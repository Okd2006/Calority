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
      ? `The user describes this as: "${portionContext}". Use this to calibrate portion size.`
      : "Estimate the portion size from visual cues in the image (plate size, utensils, hands if visible).";

    const prompt = `You are a professional nutritionist and food recognition AI.

Analyze the food in this image and return a JSON object. Follow these rules strictly:

1. Identify ALL food items visible in the image as a single combined meal.
2. ${contextLine}
3. Account for cooking method — fried food has ~30% more calories than grilled/baked equivalents.
4. If a reference object (fork, hand, plate) is visible, use it to judge portion size accurately.
5. Be conservative — it's better to slightly underestimate than overestimate.
6. If the image is unclear, blurry, or not food, set confidence to "low".

Return ONLY this JSON structure, no markdown, no explanation:
{
  "name": "string (specific food name, e.g. 'Grilled Chicken Breast with Rice')",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "ingredients": ["string (ingredient with estimated quantity, e.g. 'Chicken breast 150g')"],
  "confidence": "low" | "medium" | "high",
  "confidenceNote": "string (brief reason if confidence is low or medium, empty string if high)"
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
