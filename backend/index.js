import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

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
      prompt + " Return ONLY clean HTML, CSS, JS code. No explanation."
    );

    let code = result.response.text();

    // clean markdown code fences
    code = code.replace(/```html|```css|```js|```javascript|```/g, "").trim();

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

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});