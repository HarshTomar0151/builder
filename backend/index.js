import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("❌ ERROR: API_KEY is not defined in environment variables!");
}

const genAI = new GoogleGenerativeAI(API_KEY || "DUMMY_KEY");

app.get("/", (req, res) => {
  res.send("GenAI Backend Server is running!");
});

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
    });

    const result = await model.generateContent(
      prompt +
        ` Return ONLY a single React functional component as the default export. 
Rules:
- Use "export default function App() { ... }" syntax.
- Do NOT include any import statements (React is available globally).
- Use Tailwind CSS classes for all styling.
- Do NOT use HTML document tags like <!DOCTYPE>, <html>, <head>, or <body>.
- Do NOT use React Router or any external libraries.
- The component must be a self-contained, single-file React component.
- Return ONLY the code, no explanation, no markdown fences.`
    );

    let code = result.response.text();

    // clean markdown code fences
    code = code.replace(/```jsx|```tsx|```html|```css|```js|```javascript|```/g, "").trim();
    
    // Remove any import statements that Gemini might still include
    code = code.replace(/^import\s+.*?;\s*\n/gm, "");

    res.json({ code });
  } catch (err) {
    // Return actual error for debugging
    console.error("❌ Gemini Error:", err?.message || err);
    res.status(500).json({
      error: "Something went wrong",
      details: err?.message || String(err),
    });
  }
});

// app.listen(5000, () => {
//   console.log("Server running on http://localhost:5000");
// });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});