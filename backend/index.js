import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  findUserByEmail,
  findUserById,
  createUser,
  incrementWebsiteCount,
} from "./users.js";

dotenv.config();

const API_KEY = process.env.API_KEY;
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_change_in_prod";
const MAX_WEBSITES = 3;

if (!API_KEY) {
  console.log("⚠️ Warning: API_KEY is missing in environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "DUMMY_KEY");

const app = express();
app.use(cors());
app.use(express.json());

// ─── Auth Middleware ───────────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token." });
  }
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("GenAI Backend Server is running!");
});

app.post("/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });
    
    if (findUserByEmail(email)) return res.status(400).json({ error: "User exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = createUser(email, passwordHash);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ token, user: { ...user, maxWebsites: MAX_WEBSITES } });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { ...user, maxWebsites: MAX_WEBSITES } });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/auth/me", authMiddleware, (req, res) => {
  const user = findUserById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user: { ...user, maxWebsites: MAX_WEBSITES } });
});

app.post("/generate", authMiddleware, async (req, res) => {
  try {
    const user = findUserById(req.userId);
    if (user.websitesGenerated >= MAX_WEBSITES) {
      return res.status(403).json({ error: "Limit reached", limitReached: true });
    }

    const { prompt } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      prompt + " Return ONLY a single React functional component as the default export. Use Tailwind CSS. No imports."
    );

    let code = result.response.text();
    code = code.replace(/```jsx|```tsx|```html|```css|```js|```javascript|```/g, "").trim();
    code = code.replace(/^import\s+.*?;\s*\n/gm, "");

    const updatedUser = incrementWebsiteCount(req.userId);
    res.json({ code, websitesGenerated: updatedUser.websitesGenerated });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ error: "Generation failed", details: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
