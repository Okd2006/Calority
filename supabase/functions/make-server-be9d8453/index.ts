import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";

const app = new Hono();

app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

app.get("/make-server-be9d8453/health", (c) => {
  return c.json({ status: "ok" });
});

app.post("/make-server-be9d8453/analyze-meal", async (c) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", portionContext = "" } = await c.req.json();

    if (!imageBase64) {
      return c.json({ error: "imageBase64 is required" }, 400);
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return c.json({ error: "GEMINI_API_KEY not configured" }, 500);
    }

    const contextLine = portionContext
      ? `The user describes this as: "${portionContext}". Use this as your primary signal for portion size.`
      : "Estimate portion size from visual cues: plate diameter (~26cm standard), utensils, hands, or food height/density.";

    const prompt = `You are a registered dietitian and expert food recognition AI with deep knowledge of nutritional databases (USDA, NIH).

## STEP 1 — Identify
List every distinct food item visible. For each, note:
- Exact food type and preparation method (raw/boiled/fried/grilled/baked/sautéed)
- Estimated weight in grams using visual reference objects

## STEP 2 — Portion calibration
${contextLine}
Reference weights: standard dinner plate ~26cm holds ~400-600g food. Side plate ~20cm holds ~150-250g. A fist ≈ 1 cup ≈ ~240ml volume.

## STEP 3 — Calorie calculation
Use these density rules per 100g:
- Cooked white rice: 130 kcal | Cooked pasta: 158 kcal | Bread: 265 kcal
- Chicken breast grilled: 165 kcal | Chicken fried: 240 kcal | Beef lean: 250 kcal
- Vegetables (non-starchy): 25-40 kcal | Legumes cooked: 120 kcal
- Cheese: 350-400 kcal | Oils/butter: 720-900 kcal | Nuts: 550-650 kcal
- Eggs: 155 kcal each ~50g | Milk whole: 61 kcal/100ml
Multiply each item's weight × (kcal per 100g / 100), then sum all items.

## STEP 4 — Macro split
Derive protein/carbs/fat from the identified ingredients using standard macro ratios.
Verify: (protein × 4) + (carbs × 4) + (fat × 9) should be within 10% of total calories.

## STEP 5 — Confidence
- high: food clearly visible, portion estimable, standard dish
- medium: partially obscured, mixed dish, or unusual portion
- low: blurry image, non-food, or unrecognizable dish

Return ONLY this JSON, no markdown, no explanation, no extra text:
{
  "name": "string (specific name, e.g. 'Butter Chicken with Basmati Rice')",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "ingredients": ["string (e.g. 'Basmati rice cooked 180g — 234 kcal')"],
  "confidence": "low" | "medium" | "high",
  "confidenceNote": "string (brief reason if not high, else empty string)"
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                { inline_data: { mime_type: mimeType, data: imageBase64 } },
              ],
            },
          ],
          generationConfig: { temperature: 0.1 },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return c.json({ error: `Gemini API error: ${err}` }, 500);
    }

    const geminiData = await response.json();
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return c.json({ error: "No response from Gemini" }, 500);
    }

    const cleaned = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const mealData = JSON.parse(cleaned);
    return c.json(mealData);
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

Deno.serve(app.fetch);
