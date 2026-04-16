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
  console.error("❌ ERROR: API_KEY is missing! Check Render Environment Variables.");
} else {
  console.log("✅ API_KEY is detected.");
}

if (!process.env.JWT_SECRET) {
  console.warn("⚠️ WARNING: JWT_SECRET is not set. Using default secret.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "DUMMY_KEY");

const app = express();
app.use(cors());
app.use(express.json());

// ─── Auth Middleware ───────────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required. Please login first." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token. Please login again." });
  }
}

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("GenAI Backend Server is running!");
});

// ─── Auth Routes ──────────────────────────────────────────────────────────────

// POST /auth/signup
app.post("/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const existing = findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = createUser(email, passwordHash);

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        websitesGenerated: user.websitesGenerated,
        maxWebsites: MAX_WEBSITES,
      },
    });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ error: "Something went wrong during signup." });
  }
});

// POST /auth/login
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        websitesGenerated: user.websitesGenerated,
        maxWebsites: MAX_WEBSITES,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Something went wrong during login." });
  }
});

// GET /auth/me  — verify token & return current user
app.get("/auth/me", authMiddleware, (req, res) => {
  const user = findUserById(req.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }
  res.json({
    user: {
      id: user.id,
      email: user.email,
      websitesGenerated: user.websitesGenerated,
      maxWebsites: MAX_WEBSITES,
    },
  });
});

// ─── Generate Route (protected) ───────────────────────────────────────────────
app.post("/generate", authMiddleware, async (req, res) => {
  try {
    const user = findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.websitesGenerated >= MAX_WEBSITES) {
      return res.status(403).json({
        error: "Website generation limit reached.",
        details: `You have reached your free tier limit of ${MAX_WEBSITES} websites.`,
        limitReached: true,
      });
    }

    if (!API_KEY || API_KEY === "DUMMY_KEY") {
      return res.status(500).json({
        error: "Server Configuration Error",
        details: "Gemini API_KEY is missing in production environment. Please set it in Render settings.",
      });
    }

    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
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

    // Increment website count after successful generation
    const updatedUser = incrementWebsiteCount(req.userId);

    res.json({
      code,
      websitesGenerated: updatedUser.websitesGenerated,
      maxWebsites: MAX_WEBSITES,
    });
  } catch (err) {
    console.error("❌ Gemini Error:", err?.message || err);
    res.status(500).json({
      error: "Something went wrong",
      details: err?.message || String(err),
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
