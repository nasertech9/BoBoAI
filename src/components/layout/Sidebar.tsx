import { Image, Code2, Music, Sparkles, Zap, Brain, Plus, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/lib/translations";
import type { Language, AIModel } from "@/types";

interface SidebarProps {
  language: Language;
  model: AIModel;
  activeFeature: string | null;
  onFeatureClick: (feature: string) => void;
  onNewChat: () => void;
  onExportChat: (format: "txt" | "json") => void;
  className?: string;
}

const FEATURES = [
  { id: "image-gen", icon: Image, labelKey: "imageGeneration", color: "text-pink-400" },
  { id: "code", icon: Code2, labelKey: "codeSnippets", color: "text-blue-400" },
  { id: "festivals", icon: Music, labelKey: "upcomingFestivals", color: "text-green-400" },
  { id: "create-image", icon: Sparkles, labelKey: "createImage", color: "text-orange-400" },
] as const;

export function Sidebar({
  language,
  model,
  activeFeature,
  onFeatureClick,
  onNewChat,
  onExportChat,
  className,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col gap-2 border-r border-border/60 bg-background/60 p-3",
        className
      )}
    >
      {/* Features */}
      <div className="flex flex-col gap-1">
        <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Features
        </p>
        {FEATURES.map(({ id, icon: Icon, labelKey, color }) => (
          <button
            key={id}
            onClick={() => onFeatureClick(id)}
            className={cn(
              "sidebar-item",
              activeFeature === id && "active"
            )}
          >
            <Icon className={cn("h-4 w-4 flex-shrink-0", color)} />
            <span className="truncate">{t(language, labelKey as Parameters<typeof t>[1])}</span>
          </button>
        ))}
      </div>

      <div className="my-1 h-px bg-border/60" />

      {/* Model indicator */}
      <div className="flex flex-col gap-1">
        <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Model
        </p>
        <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 px-3 py-2">
          {model === "bobo-4-pro" ? (
            <Brain className="h-4 w-4 text-primary" />
          ) : (
            <Zap className="h-4 w-4 text-primary" />
          )}
          <span className="text-xs font-medium text-primary">
            {model === "bobo-4-pro" ? "4.0 Pro" : "3.5 Pro"}
          </span>
        </div>
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex flex-col gap-1">
        <button
          onClick={onNewChat}
          className="sidebar-item"
        >
          <Plus className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{t(language, "newChat")}</span>
        </button>
        <button
          onClick={() => onExportChat("txt")}
          className="sidebar-item"
        >
          <Download className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{t(language, "exportChat")}</span>
        </button>
      </div>
    </aside>
  );
}
