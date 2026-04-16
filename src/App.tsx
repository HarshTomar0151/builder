/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Download,
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet,
  Code2,
  Eye,
  EyeOff,
  Sparkles,
  ChevronRight,
  Layout,
  Settings,
  History,
  Search,
  Menu,
  X,
  Github,
  Twitter,
  ExternalLink,
  CheckCircle2,
  Loader2,
  Copy,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
  FileCode2,
  LogOut,
  User,
  Lock,
  Mail,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { SandpackProvider, SandpackLayout, SandpackPreview } from "@codesandbox/sandpack-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AuthUser {
  id: string;
  email: string;
  websitesGenerated: number;
  maxWebsites: number;
}

// ─── Auth API helpers ─────────────────────────────────────────────────────────
const getBackendUrl = () =>
  import.meta.env.VITE_API_URL || "https://builder-ybob.onrender.com";

async function apiSignup(email: string, password: string) {
  const res = await fetch(`${getBackendUrl()}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

async function apiLogin(email: string, password: string) {
  const res = await fetch(`${getBackendUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

async function apiMe(token: string) {
  const res = await fetch(`${getBackendUrl()}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// ─── Login Page ───────────────────────────────────────────────────────────────
function LoginPage({
  onLogin,
  onGoSignup,
}: {
  onLogin: (user: AuthUser, token: string) => void;
  onGoSignup: () => void;
}) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPass, setShowPass] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiLogin(email, password);
      if (data.error) {
        setError(data.error);
      } else {
        localStorage.setItem("auth_token", data.token);
        onLogin(data.user, data.token);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            AI Builder
          </span>
        </div>

        <Card className="bg-zinc-900/80 border-zinc-800/50 backdrop-blur-sm shadow-2xl p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-sm text-zinc-500">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg pl-10 pr-10 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm text-red-400">{error}</span>
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-500">
              Don't have an account?{" "}
              <button
                onClick={onGoSignup}
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                Create one
              </button>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

// ─── Signup Page ──────────────────────────────────────────────────────────────
function SignupPage({
  onSignup,
  onGoLogin,
}: {
  onSignup: (user: AuthUser, token: string) => void;
  onGoLogin: () => void;
}) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPass, setShowPass] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const data = await apiSignup(email, password);
      if (data.error) {
        setError(data.error);
      } else {
        localStorage.setItem("auth_token", data.token);
        onSignup(data.user, data.token);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            AI Builder
          </span>
        </div>

        <Card className="bg-zinc-900/80 border-zinc-800/50 backdrop-blur-sm shadow-2xl p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
            <p className="text-sm text-zinc-500">Start building websites with AI — free</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg pl-10 pr-10 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm text-red-400">{error}</span>
              </motion.div>
            )}

            {/* Free plan info */}
            <div className="flex items-center gap-2 p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span className="text-xs text-indigo-300">Free plan includes 3 website generations</span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-500">
              Already have an account?{" "}
              <button
                onClick={onGoLogin}
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  // Auth state
  const [authUser, setAuthUser] = React.useState<AuthUser | null>(null);
  const [authToken, setAuthToken] = React.useState<string | null>(null);
  const [authPage, setAuthPage] = React.useState<"login" | "signup">("login");
  const [authLoading, setAuthLoading] = React.useState(true);

  // App state
  const [prompt, setPrompt] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [previewMode, setPreviewMode] = React.useState<"desktop" | "tablet" | "mobile">("desktop");
  const [hasGenerated, setHasGenerated] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const [generatedCode, setGeneratedCode] = React.useState("");
  const [isViewCode, setIsViewCode] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [limitError, setLimitError] = React.useState("");

  // On mount: check saved token
  React.useEffect(() => {
    console.log("🚀 App started. Target Backend:", getBackendUrl());
    
    const savedToken = localStorage.getItem("auth_token");
    if (savedToken) {
      apiMe(savedToken)
        .then((data) => {
          if (data.user) {
            setAuthUser(data.user);
            setAuthToken(savedToken);
          } else {
            localStorage.removeItem("auth_token");
          }
        })
        .catch(() => {
          localStorage.removeItem("auth_token");
        })
        .finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
  }, []);

  const handleAuthSuccess = (user: AuthUser, token: string) => {
    setAuthUser(user);
    setAuthToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setAuthUser(null);
    setAuthToken(null);
    setHasGenerated(false);
    setGeneratedCode("");
    setPrompt("");
    setLimitError("");
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !authToken) return;
    
    // Check locally first to avoid unnecessary API calls
    if (isLimitReached) {
      setLimitError("You have reached your 3 website generation limit.");
      return;
    }

    setIsGenerating(true);
    setLimitError("");

    try {
      const response = await fetch(`${getBackendUrl()}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          // If response is not JSON (e.g. Render 500 HTML page)
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        
        if (errorData.limitReached) {
          setLimitError(errorData.error);
          return;
        }

        throw new Error(errorData.details || errorData.error || `Server returned ${response.status}`);
      }

      const data = await response.json();

      setGeneratedCode(data.code || "");
      setHasGenerated(true);

      // Update user's website count
      if (authUser && data.websitesGenerated !== undefined) {
        setAuthUser({ ...authUser, websitesGenerated: data.websitesGenerated });
      }
    } catch (error: any) {
      console.error("❌ Error generating code:", error);
      alert(`Generation Failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleDownloadZip = async () => {
    if (!generatedCode) return;

    const zip = new JSZip();

    const packageJson = {
      name: "generated-website",
      version: "1.0.0",
      main: "src/index.js",
      dependencies: {
        react: "^18.0.0",
        "react-dom": "^18.0.0",
        "lucide-react": "latest",
        "framer-motion": "latest",
        clsx: "latest",
        "tailwind-merge": "latest",
      },
      scripts: {
        start: "react-scripts start",
        build: "react-scripts build",
      },
    };

    const indexJs = `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

    const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

    const appJs = (generatedCode || "").includes("import React")
      ? generatedCode
      : `import React from "react";\n${generatedCode || ""}`;

    zip.file("package.json", JSON.stringify(packageJson, null, 2));
    const src = zip.folder("src")!;
    src.file("App.js", appJs);
    src.file("index.js", indexJs);
    src.file("index.css", indexCss);
    zip.file("tailwind.config.js", tailwindConfig);

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "website-source.zip");
  };

  const handleCopy = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // ── Loading screen ──────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  // ── Auth screens ────────────────────────────────────────────────────────────
  if (!authUser) {
    if (authPage === "signup") {
      return (
        <SignupPage
          onSignup={handleAuthSuccess}
          onGoLogin={() => setAuthPage("login")}
        />
      );
    }
    return (
      <LoginPage
        onLogin={handleAuthSuccess}
        onGoSignup={() => setAuthPage("signup")}
      />
    );
  }

  // ── Website count badge ─────────────────────────────────────────────────────
  const websitesLeft = authUser.maxWebsites - authUser.websitesGenerated;
  const isLimitReached = authUser.websitesGenerated >= authUser.maxWebsites;

  // ── Main App ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/50 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                AI Builder
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Templates</a>
              <a href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Showcase</a>
              <a href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Pricing</a>
              <a href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Docs</a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 mr-4">
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800/50">
                <Github className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800/50">
                <Twitter className="w-5 h-5" />
              </Button>
            </div>

            {/* Website usage counter */}
            <div className={cn(
              "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium",
              isLimitReached
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-zinc-900/50 border-zinc-800 text-zinc-400"
            )}>
              <FileCode2 className="w-3.5 h-3.5" />
              {isLimitReached ? "Limit reached" : `${websitesLeft} generation${websitesLeft !== 1 ? "s" : ""} left`}
            </div>

            {/* User info + logout */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-800">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs text-zinc-300 max-w-[120px] truncate">{authUser.email}</span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-zinc-400"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#09090b] pt-20 px-4 md:hidden"
          >
            <div className="flex flex-col gap-6">
              <a href="#" className="text-lg font-medium text-zinc-300">Templates</a>
              <a href="#" className="text-lg font-medium text-zinc-300">Showcase</a>
              <a href="#" className="text-lg font-medium text-zinc-300">Pricing</a>
              <a href="#" className="text-lg font-medium text-zinc-300">Docs</a>
              <Separator className="bg-zinc-800" />
              <div className="flex items-center gap-2 py-2">
                <User className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-zinc-300">{authUser.email}</span>
              </div>
              <div className="text-sm text-zinc-500">
                Websites generated: {authUser.websitesGenerated} / {authUser.maxWebsites}
              </div>
              <Button
                variant="outline"
                className="border-zinc-800 text-red-400 hover:bg-red-500/10"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={cn(
        "max-w-[1700px] mx-auto p-4 lg:p-6 grid gap-6 transition-all duration-500 ease-in-out h-[calc(100vh-80px)]",
        isSidebarOpen ? "grid-cols-1 lg:grid-cols-[400px_1fr]" : "grid-cols-1"
      )}>
        {/* Left Panel: Controls */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: "auto" }}
              exit={{ opacity: 0, x: -20, width: 0 }}
              className="flex flex-col gap-6 h-full "
            >
              <Card className="flex-1 bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm flex flex-col overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between bg-zinc-900/80">
                  <div className="flex items-center gap-2">
                    <Layout className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Editor</span>
                  </div>
                  <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[10px] font-bold">
                    BETA
                  </Badge>
                </div>
              </Card>
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {/* Website limit indicator */}
                  <div className={cn(
                    "p-3 rounded-lg border",
                    isLimitReached
                      ? "bg-red-500/10 border-red-500/20"
                      : websitesLeft === 1
                        ? "bg-amber-500/10 border-amber-500/20"
                        : "bg-zinc-900/50 border-zinc-800/50"
                  )}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn(
                        "text-xs font-medium",
                        isLimitReached ? "text-red-400" : websitesLeft === 1 ? "text-amber-400" : "text-zinc-400"
                      )}>
                        {isLimitReached ? "Generation limit reached" : "Generation usage"}
                      </span>
                      <span className={cn(
                        "text-xs font-bold",
                        isLimitReached ? "text-red-400" : "text-zinc-300"
                      )}>
                        {authUser.websitesGenerated}/{authUser.maxWebsites}
                      </span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          isLimitReached ? "bg-red-500" : websitesLeft === 1 ? "bg-amber-500" : "bg-indigo-500"
                        )}
                        style={{ width: `${(authUser.websitesGenerated / authUser.maxWebsites) * 100}%` }}
                      />
                    </div>
                    {isLimitReached && (
                      <p className="text-xs text-red-400 mt-1.5">
                        Upgrade your plan to generate more websites.
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      What are we building today?
                    </label>
                    <div className="relative group">
                      <Textarea
                        placeholder="e.g. A modern portfolio for a creative developer with a dark theme, bento grid layout, and smooth scroll animations..."
                        className="min-h-[200px] bg-zinc-950/50 border-zinc-800 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all resize-none text-zinc-200 placeholder:text-zinc-600 p-4 leading-relaxed"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isLimitReached}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {limitError && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                      >
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-red-400">{limitError}</span>
                      </motion.div>
                    )}

                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim() || isLimitReached}
                      className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Generating Magic...
                        </>
                      ) : isLimitReached ? (
                        <>
                          <AlertCircle className="w-5 h-5 mr-2" />
                          Limit Reached
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Generate Website
                        </>
                      )}
                    </Button>

                    {hasGenerated && (
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          onClick={handleRegenerate}
                          disabled={isLimitReached}
                          className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 disabled:opacity-50"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Regenerate
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleDownloadZip}
                          className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download ZIP
                        </Button>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-zinc-800/50" />

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Quick Prompts</h3>
                    <div className="space-y-2">
                      {[
                        "SaaS Landing Page for AI Tool",
                        "Personal Blog with Minimalist UI",
                        "E-commerce Store for Sneakers",
                      ].map((item, i) => (
                        <button
                          key={i}
                          onClick={() => setPrompt(item)}
                          disabled={isLimitReached}
                          className="w-full text-left p-3 rounded-lg bg-zinc-950/30 border border-zinc-800/30 hover:border-zinc-700 hover:bg-zinc-800/30 transition-all group disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400 group-hover:text-zinc-200 truncate pr-4">{item}</span>
                            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="p-4 bg-zinc-950/50 border-t border-zinc-800/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-500">
                  <History className="w-4 h-4" />
                  <span className="text-xs font-medium">Auto-saved 2m ago</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-200">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-4 h-full min-w-0">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-white bg-zinc-900/50 border border-zinc-800"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
              </Button>

              <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800/50">
                <Button
                  variant={previewMode === "desktop" ? "secondary" : "ghost"}
                  size="sm"
                  className={cn("h-8 px-3 rounded-lg", previewMode === "desktop" ? "bg-zinc-800 text-white" : "text-zinc-500")}
                  onClick={() => setPreviewMode("desktop")}
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Desktop
                </Button>
                <Button
                  variant={previewMode === "tablet" ? "secondary" : "ghost"}
                  size="sm"
                  className={cn("h-8 px-3 rounded-lg", previewMode === "tablet" ? "bg-zinc-800 text-white" : "text-zinc-500")}
                  onClick={() => setPreviewMode("tablet")}
                >
                  <Tablet className="w-4 h-4 mr-2" />
                  Tablet
                </Button>
                <Button
                  variant={previewMode === "mobile" ? "secondary" : "ghost"}
                  size="sm"
                  className={cn("h-8 px-3 rounded-lg", previewMode === "mobile" ? "bg-zinc-800 text-white" : "text-zinc-500")}
                  onClick={() => setPreviewMode("mobile")}
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Mobile
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isViewCode ? "secondary" : "ghost"}
                size="sm"
                className={cn("h-8 px-3 rounded-lg", isViewCode ? "bg-indigo-500/10 text-indigo-400" : "text-zinc-400 hover:text-white")}
                onClick={() => setIsViewCode(!isViewCode)}
              >
                {isViewCode ? <Eye className="w-4 h-4 mr-2" /> : <Code2 className="w-4 h-4 mr-2" />}
                {isViewCode ? "Show Preview" : "View Code"}
              </Button>
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open
              </Button>
            </div>
          </div>

          <div className="flex-1 relative bg-zinc-950 rounded-2xl border border-zinc-800/50 overflow-hidden shadow-2xl group">
            {/* Browser-like frame */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-4 z-10">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-zinc-800" />
                <div className="w-3 h-3 rounded-full bg-zinc-800" />
                <div className="w-3 h-3 rounded-full bg-zinc-800" />
              </div>
              <div className="flex-1 max-w-md mx-auto h-6 bg-zinc-950 rounded-md border border-zinc-800 flex items-center px-3 gap-2">
                <Search className="w-3 h-3 text-zinc-600" />
                <span className="text-[10px] text-zinc-600 font-mono">preview.aistudio.build/site-12345</span>
              </div>
              <div className="w-20" />
            </div>

            <div className="absolute inset-0 pt-0 flex flex-col bg-zinc-950 h-full min-h-0">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="flex flex-col pt-10 h-full items-center gap-6 text-center px-6"
                  >
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                      <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-indigo-400 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-white tracking-tight">Crafting your vision...</h2>
                      <p className="text-zinc-500 max-w-xs mx-auto text-sm">Our AI is analyzing your prompt and generating a custom layout with optimized code.</p>
                    </div>
                    <div className="flex flex-col gap-2 w-full max-w-[240px]">
                      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ x: "-100%" }}
                          animate={{ x: "0%" }}
                          transition={{ duration: 3, ease: "easeInOut" }}
                          className="h-full bg-indigo-500"
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                        <span>Analyzing</span>
                        <span>85%</span>
                      </div>
                    </div>
                  </motion.div>
                ) : hasGenerated ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full w-full"
                  >
                    {isViewCode ? (
                      <div className="h-full w-full bg-[#0d0d0ed2] overflow-hidden flex flex-col pt-10">
                        <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800/50 bg-[#09090b]/50">
                          <div className="flex items-center gap-2">
                            <Code2 className="w-4 h-4 text-indigo-400" />
                            <span className="text-xs font-mono text-zinc-400">Source Code</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-zinc-400 hover:text-white"
                            onClick={handleCopy}
                          >
                            {isCopied ? <Check className="w-4 h-4 mr-2 text-emerald-500" /> : <Copy className="w-4 h-4 mr-2" />}
                            {isCopied ? "Copied" : "Copy Code"}
                          </Button>
                        </div>
                        <ScrollArea className="flex-1">
                          <pre className="p-6 text-sm font-mono text-zinc-300 leading-relaxed whitespace-pre px-8">
                            {generatedCode}
                          </pre>
                        </ScrollArea>
                      </div>
                    ) : (
                      <div className={cn(
                        "h-full transition-all duration-500 ease-in-out bg-white overflow-hidden pt-10",
                        previewMode === "desktop" && "w-full",
                        previewMode === "tablet" && "w-[768px] border-x border-zinc-800 mx-auto",
                        previewMode === "mobile" && "w-[375px] border-x border-zinc-800 mx-auto"
                      )}>
                        <div className="flex-1 w-full min-h-0 h-full relative">
                          <SandpackProvider
                            template="react"
                            theme="dark"
                            files={{
                              "/App.js": (generatedCode || "").includes("import React")
                                ? generatedCode
                                : `import React from "react";\n${generatedCode || ""}`,
                              "/index.js": `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
`,
                            }}
                            options={{
                              externalResources: ["https://cdn.tailwindcss.com"],
                            }}
                          >
                            <SandpackLayout style={{ height: "100%", width: "100%", border: "none" }}>
                              <SandpackPreview
                                style={{ height: "100%", width: "100%" }}
                                showNavigator={false}
                              />
                            </SandpackLayout>
                          </SandpackProvider>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col pt-0 h-full justify-center items-center gap-6 text-center px-6"
                  >
                    <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner">
                      <Eye className="w-10 h-10 text-zinc-700" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-zinc-300">Ready to preview</h2>
                      <p className="text-zinc-500 max-w-xs mx-auto text-sm">
                        {isLimitReached
                          ? "You have reached your 3 website generation limit."
                          : `Enter a prompt on the left and click "Generate Website" to see the magic happen.`}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 pt-4">
                      <div className="flex items-center gap-2 text-xs text-zinc-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500/50" />
                        Responsive Design
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500/50" />
                        Clean Code
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500/50" />
                        SEO Optimized
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 h-8 bg-zinc-950 border-t border-zinc-800/50 flex items-center px-4 justify-between z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">System Online</span>
          </div>
          <Separator orientation="vertical" className="h-3 bg-zinc-800" />
          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">v2.4.0-stable</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider">© 2024 AI Builder Inc.</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
            <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider">Privacy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
            <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
