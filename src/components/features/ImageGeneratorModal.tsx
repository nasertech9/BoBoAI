import { useState, useRef } from "react";
import {
  X,
  Wand2,
  Download,
  Loader2,
  Sparkles,
  ImageIcon,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { FunctionsHttpError } from "@supabase/supabase-js";
import type { Language } from "@/types";
import { t } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const STYLES = [
  { id: "vivid", label: "Vivid", emoji: "🎨", desc: "Vibrant & detailed" },
  { id: "natural", label: "Natural", emoji: "📷", desc: "Photorealistic" },
  { id: "artistic", label: "Artistic", emoji: "🖌️", desc: "Painterly style" },
  { id: "anime", label: "Anime", emoji: "✨", desc: "Anime / manga" },
  { id: "fantasy", label: "Fantasy", emoji: "🧙", desc: "Magical & epic" },
  { id: "cyberpunk", label: "Cyberpunk", emoji: "🤖", desc: "Neon futurism" },
] as const;

type StyleId = (typeof STYLES)[number]["id"];

const ASPECT_RATIOS = [
  { value: "1:1", label: "Square 1:1" },
  { value: "16:9", label: "Landscape 16:9" },
  { value: "9:16", label: "Portrait 9:16" },
  { value: "4:3", label: "Classic 4:3" },
  { value: "3:2", label: "Photo 3:2" },
] as const;

const QUICK_PROMPTS = [
  "A glowing futuristic city at night with neon lights reflecting on wet streets",
  "A majestic dragon flying over snow-capped mountains at sunset",
  "A cozy coffee shop interior with warm lighting and plants",
  "An astronaut floating in space with Earth in the background",
  "A serene Japanese garden with cherry blossoms and koi pond",
  "A cyberpunk hacker in a neon-lit underground lab",
];

export function ImageGeneratorModal({ isOpen, onClose, language }: ImageGeneratorModalProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<StyleId>("vivid");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [showRatioMenu, setShowRatioMenu] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const startTimer = () => {
    setElapsedSec(0);
    timerRef.current = setInterval(() => setElapsedSec((s) => s + 1), 1000);
  };
  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setGeneratedUrl(null);
    setErrorMsg(null);
    startTimer();

    try {
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: {
          prompt: prompt.trim(),
          aspect_ratio: aspectRatio,
          style: selectedStyle,
        },
      });

      if (error) {
        let errorMessage = error.message;
        if (error instanceof FunctionsHttpError) {
          try {
            const statusCode = error.context?.status ?? 500;
            const textContent = await error.context?.text();
            errorMessage = `[Code: ${statusCode}] ${textContent || error.message}`;
          } catch {
            errorMessage = error.message || "Failed to generate image";
          }
        }
        console.error("Image generation error:", errorMessage);
        setErrorMsg(errorMessage);
        toast.error("Image generation failed. Please try again.");
        return;
      }

      if (data?.imageUrl) {
        setGeneratedUrl(data.imageUrl);
        toast.success("Image generated successfully!");
      } else {
        setErrorMsg("No image was returned. Please try again.");
        toast.error("No image returned.");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrorMsg("Something went wrong. Please try again.");
      toast.error("Unexpected error occurred.");
    } finally {
      setIsGenerating(false);
      stopTimer();
    }
  };

  const handleDownload = async () => {
    if (!generatedUrl) return;
    try {
      const response = await fetch(generatedUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `boboai-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Image downloaded!");
    } catch {
      // fallback
      window.open(generatedUrl, "_blank");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleGenerate();
    }
  };

  const handleReset = () => {
    setGeneratedUrl(null);
    setErrorMsg(null);
    setPrompt("");
    textareaRef.current?.focus();
  };

  if (!isOpen) return null;

  const currentRatio = ASPECT_RATIOS.find((r) => r.value === aspectRatio);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-xl animate-fade-in rounded-2xl border border-border/60 bg-background shadow-2xl overflow-hidden"
        style={{ maxHeight: "92vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4 bg-gradient-to-r from-pink-500/5 to-purple-600/5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg">
              <Wand2 className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">{t(language, "createImage")}</h2>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-pink-400" />
                Powered by OnSpace AI · Gemini Vision
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(92vh - 65px)" }}>
          <div className="p-5 space-y-5">
            {/* Prompt area */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Describe your image
              </label>
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t(language, "imagePromptPlaceholder")}
                className={cn(
                  "w-full resize-none rounded-xl border border-border bg-muted/30 px-4 py-3",
                  "text-sm text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40",
                  "transition-all duration-200 min-h-[88px]"
                )}
                rows={3}
              />

              {/* Quick prompts */}
              <div>
                <p className="text-[11px] text-muted-foreground mb-1.5">Quick prompts:</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.slice(0, 3).map((qp) => (
                    <button
                      key={qp}
                      onClick={() => setPrompt(qp)}
                      className="text-[11px] rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all truncate max-w-[200px]"
                    >
                      {qp.slice(0, 40)}…
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Style selector */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Style</label>
              <div className="grid grid-cols-3 gap-2">
                {STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-xl border p-2.5 transition-all duration-200 text-center",
                      selectedStyle === style.id
                        ? "border-primary/60 bg-primary/10 shadow-sm"
                        : "border-border/50 bg-muted/20 hover:border-border hover:bg-muted/40"
                    )}
                  >
                    <span className="text-lg">{style.emoji}</span>
                    <span
                      className={cn(
                        "text-[11px] font-semibold",
                        selectedStyle === style.id ? "text-primary" : "text-foreground"
                      )}
                    >
                      {style.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground leading-tight">
                      {style.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect ratio + generate row */}
            <div className="flex items-center gap-3">
              {/* Aspect Ratio */}
              <div className="relative">
                <button
                  onClick={() => setShowRatioMenu((o) => !o)}
                  className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-xs font-medium text-foreground hover:border-border transition-all"
                >
                  <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  {currentRatio?.label}
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>
                {showRatioMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowRatioMenu(false)}
                    />
                    <div className="absolute bottom-10 left-0 z-20 min-w-[150px] rounded-xl border border-border bg-popover shadow-xl overflow-hidden">
                      {ASPECT_RATIOS.map((r) => (
                        <button
                          key={r.value}
                          onClick={() => {
                            setAspectRatio(r.value);
                            setShowRatioMenu(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-accent",
                            aspectRatio === r.value && "text-primary font-medium bg-primary/5"
                          )}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Generate button */}
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="flex-1 gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 shadow-lg shadow-pink-500/20"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t(language, "generating")} ({elapsedSec}s)
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    {t(language, "generateImage")}
                  </>
                )}
              </Button>
            </div>

            <p className="text-[11px] text-muted-foreground text-center">
              Ctrl+Enter to generate · Real AI generation via OnSpace AI
            </p>

            {/* Loading state */}
            {isGenerating && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/10 p-8 gap-4">
                <div className="relative h-16 w-16">
                  <div className="absolute inset-0 rounded-full border-4 border-pink-500/20 border-t-pink-500 animate-spin" />
                  <div className="absolute inset-2 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin [animation-direction:reverse]" />
                  <div className="absolute inset-[18px] rounded-full bg-gradient-to-br from-pink-500/30 to-purple-600/30 animate-pulse" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-semibold text-foreground animate-pulse">
                    Creating your masterpiece…
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Gemini Vision is rendering your image · {elapsedSec}s
                  </p>
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-1.5 w-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-60"
                      style={{
                        animation: `bounce-dots 1.2s ease-in-out infinite`,
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Error state */}
            {errorMsg && !isGenerating && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-2">
                <p className="text-sm font-medium text-destructive">Generation failed</p>
                <p className="text-xs text-muted-foreground">{errorMsg}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerate}
                  className="h-7 gap-1.5 text-xs"
                >
                  <RefreshCw className="h-3 w-3" />
                  Try again
                </Button>
              </div>
            )}

            {/* Generated image result */}
            {generatedUrl && !isGenerating && (
              <div className="space-y-3 animate-fade-in">
                <div className="overflow-hidden rounded-xl border border-border/60 shadow-xl relative group">
                  <img
                    src={generatedUrl}
                    alt={prompt}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    style={{ maxHeight: "320px" }}
                  />
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100">
                    <Button
                      onClick={handleDownload}
                      size="sm"
                      className="h-8 gap-1.5 text-xs bg-white/90 text-gray-900 hover:bg-white shadow-lg"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* Prompt used */}
                <div className="rounded-lg bg-muted/30 border border-border/40 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                    Prompt used
                  </p>
                  <p className="text-xs text-foreground leading-relaxed line-clamp-2">{prompt}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <p className="text-xs text-green-500 font-semibold flex items-center gap-1 flex-1">
                    <span>✓</span> {t(language, "imageGenerated")}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="h-7 gap-1.5 text-xs"
                  >
                    <RefreshCw className="h-3 w-3" />
                    New image
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleDownload}
                    className="h-7 gap-1.5 text-xs bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                  >
                    <Download className="h-3 w-3" />
                    {t(language, "downloadImage")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
