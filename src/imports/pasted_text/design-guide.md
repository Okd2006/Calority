Step 1: The Design Blueprint (The Setup)
The absolute first thing you must do is define the foundation, exactly as shown in the design showcase.

Frame Size: Open Figma and create six frames. Select the "Phone" category and choose iPhone 14 (or a 390x844px equivalent). Line them up horizontally, just like in the image.

Typography: In Figma's Text styles, select Poppins or Inter.

Headers: Semi-Bold, 22-24px.

Body: Regular, 14-16px.

Colors (Health + Energy): Go to your "Fill" panel and create these official Color Styles:

Main Green: #2ECC71 (Vibrant and fresh, seen on buttons and goals).

Energy Orange: #E67E22 (Energetic and warning, used for macro highlights).

Background White: #FFFFFF.

Reusable Components: Start by creating a "Standard Button" component. Make it a rectangle with corner-radius: 20 (soft rounded). Fill the main button green. Also, create a "Card" component—a soft rounded rectangle with a very subtle shadow (e.g., blur: 10, y: 4, opacity: 5%).

Step 2: The Splash Screen (The Entrance)
The user’s first interaction must be minimal and inviting. Refer to Frame 1 (Left) in the design showcase for the final visual.

Logo: Design or import a minimal Calority logo. Keep it simple; maybe a stylized leaf or a checkmark combined with a spoon icon, as suggested in the visual summary.

Tagline: Directly below the logo, add the tagline: "Snap your meal. Know your calories."

Background: Use a very subtle, friendly background. You can achieve this with a soft linear gradient (#E8F8F5 light green to #FFFFFF white) or by placing minimal, blurred food illustrations, making sure the logo and tagline remain the primary focus.

Step 3: The Home Screen (The Hub)
This screen is the active dashboard for daily logging. Refer to Frame 2 in the design showcase for the visual reference.

Greeting: At the top, in large header font, add: "What are you eating today?" Follow it with a personalized greeting if you choose (e.g., "Hi, Alex!").

Main Camera Call to Action (CTA): This must be the biggest element on the screen, as shown in the visual reference. Create a large, soft rounded component (almost a circular square) and place a large camera icon in the center. This visually communicates: "This app needs your camera."

Upload Button: Create a separate, rounded button component just below the camera CTA, clearly labeled "Upload image" for choosing photos from the gallery.

Recent Meals: Add a small section labeled "Recent Meals." Use a simple auto-layout row to create small, soft rounded square thumbnails. These placeholders represent previous scans (like the avocado toast and apple examples) and make the dashboard feel active.

Bottom Navigation (Persistent Component): Design your permanent navigation bar. Use three simple, descriptive icons (e.g., from the 'Iconify' plugin):

Home (The current screen).

History.

Profile.

Step 4: The Scanning Screen (The Feedback Loop)
This screen must provide instant visual feedback. This screen is critical because the AI analysis takes 2–4 seconds, and users need reassurance. Look at Frame 3 in the design showcase for inspiration.

Meal Image: Display the photo the user just took (or uploaded) as the main focus of the screen.

Animated Scanner Overlay: Over the top of the image, create a visual overlay, just like the circular orange scanner in the visual reference. This gives the feeling of movement and analysis without needing actual motion in Figma. Use an energetic color (like your primary orange) for the "scanning" visual to communicate activity.

Status Text: Add central text that clearly states the current action: "Analyzing your meal with AI..." or "Calculating macros."

Step 5: The Result Screen (The Macro Deep Dive)
This is the most critical screen. It presents the user's data with clarity. Refer to Frame 4 in the design showcase for how to arrange this complex information neatly.

Detected Food Name: At the top of the information panel, clearly display the AI's identification (e.g., "Chicken Biryani").

Macro Cards (Information Hierarchy): Group the macronutrients into the clean, soft rounded card components you defined in Step 1. Focus on clear typography. The visuals (circular charts) in the example are excellent for this.

Create one large "Calories" card.

Below it, create three separate, smaller cards for: Protein, Carbs, and Fat. Use different colors (Green for goal, Orange for highlight) to distinguish them, matching the main color palette.

Charts or Progress Indicators: This is where you can make the data visual. As shown in the visual reference, use soft circular charts or horizontal progress bars inside the card components to show the user how close they are to their macro goals. (These will be static placeholders in Figma but dynamic in your code).

Action Buttons: Use your "Standard Button" component at the bottom, just like the visual reference.

Green Button: "Save Meal".

Outline Button: "Scan Another Meal".

Step 6: The Meal History Screen (The Log)
Frame 5 in the design showcase demonstrates how to design a clean, scrollable log.

Scrollable List (Auto-Layout): Use Auto-Layout to create a single "Meal Card" component for a clean, scrollable list (V-Stack).

Card Layout: Each card needs specific elements for the summary view:

Small photo thumbnail (1:1 aspect ratio).

Food Name (e.g., "Pasta Salad") and total Calories (e.g., "450 kcal").

Date and time of the scan.

Structure: Arrange these within the card neatly, using consistent spacing (e.g., 8px or 12px) to keep the list uniform and easily digestible.

Step 7: The Profile Screen (The Goal Setting)
This is where the user manages their overall journey. See Frame 6 (Right) in the design showcase for the final result.

Daily Intake Progress Bar: This is the visual summary of the day. Create a prominent progress bar component at the top of the screen, as shown in the example.

The bar shows daily consumed calories against their total calorie goal.

As shown in the guide visual, use green for the main bar and orange for warning if they are nearing or exceeding their limit.

Calorie Goal Management: Add interactive inputs where the user can set their specific target calories or weight goals.

Settings: Finish the screen with a standard settings icon/list, where users can configure app preferences.