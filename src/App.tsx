/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Download,
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet,
  Code2,
  Eye,
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
  EyeOff,
  PanelLeftClose,
  PanelLeftOpen,
  FileCode2
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

export default function App() {
  const [prompt, setPrompt] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [previewMode, setPreviewMode] = React.useState<"desktop" | "tablet" | "mobile">("desktop");
  const [hasGenerated, setHasGenerated] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const [generatedCode, setGeneratedCode] = React.useState("");
  const [isViewCode, setIsViewCode] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    console.log("🚀 Button clicked");
    console.log("📝 Prompt:", prompt);

    setIsGenerating(true);

    try {
      console.log("📡 Sending request to backend...");

      // const response = await fetch("http://localhost:5000/generate", {
      const backendUrl = import.meta.env.VITE_API_URL || "https://builder-ybob.onrender.com";
      const response = await fetch(`${backendUrl}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      console.log("📥 Response status:", response.status);

      const data = await response.json();

      console.log("✅ API Response:", data);
      console.log("💻 Generated Code:", data.code);

      if (data.error) {
        console.error("❌ API Error:", data.error, data.details);
        alert(`Error: ${data.details || data.error}`);
        return;
      }

      setGeneratedCode(data.code || "");
      setHasGenerated(true);

    } catch (error) {
      console.error("❌ Error generating code:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleDownload = () => {
    if (!generatedCode) return;
    const blob = new Blob([generatedCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "App.jsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    if (!generatedCode) return;

    const zip = new JSZip();

    // package.json
    const packageJson = {
      name: "generated-website",
      version: "1.0.0",
      main: "src/index.js",
      dependencies: {
        "react": "^18.0.0",
        "react-dom": "^18.0.0",
        "lucide-react": "latest",
        "framer-motion": "latest",
        "clsx": "latest",
        "tailwind-merge": "latest"
      },
      scripts: {
        "start": "react-scripts start",
        "build": "react-scripts build"
      }
    };

    // index.js
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

    // index.css
    const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

    // tailwind.config.js
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

    // App.js (the generated code)
    const appJs = (generatedCode || "").includes("import React")
      ? generatedCode
      : `import React from "react";\n${generatedCode || ""}`;

    zip.file("package.json", JSON.stringify(packageJson, null, 2));
    const src = zip.folder("src");
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
            <Button variant="outline" className="hidden sm:flex border-zinc-800 hover:bg-white text-[#000]">
              Sign In
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20">
              Get Started
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
              <div className="flex gap-4">
                <Button className="flex-1 bg-indigo-600">Get Started</Button>
                <Button variant="outline" className="flex-1 border-zinc-800">Sign In</Button>
              </div>
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
              className="flex flex-col gap-6 h-full overflow-hidden"
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
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      What are we building today?
                    </label>
                    <div className="relative group">
                      <Textarea
                        placeholder="e.g. A modern portfolio for a creative developer with a dark theme, bento grid layout, and smooth scroll animations..."
                        className="min-h-[240px] bg-zinc-950/50 border-zinc-800 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all resize-none text-zinc-200 placeholder:text-zinc-600 p-4 leading-relaxed"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                      <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                        <span className="text-[10px] text-zinc-500 font-mono">Press ⌘ + Enter to generate</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                      className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Generating Magic...
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
                          className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300"
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
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Recent Prompts</h3>
                    <div className="space-y-2">
                      {[
                        "SaaS Landing Page for AI Tool",
                        "Personal Blog with Minimalist UI",
                        "E-commerce Store for Sneakers"
                      ].map((item, i) => (
                        <button
                          key={i}
                          onClick={() => setPrompt(item)}
                          className="w-full text-left p-3 rounded-lg bg-zinc-950/30 border border-zinc-800/30 hover:border-zinc-700 hover:bg-zinc-800/30 transition-all group"
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
              <div className="w-20" /> {/* Spacer */}
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
                        {/* <iframe 
                          srcDoc={generatedCode}
                          className="w-full h-full border-0"
                          title="Website Preview"
                        /> */}
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
                      <p className="text-zinc-500 max-w-xs mx-auto text-sm">Enter a prompt on the left and click "Generate Website" to see the magic happen.</p>
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
