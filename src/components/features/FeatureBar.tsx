import { Image, Code2, Music, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/lib/translations";
import type { Language } from "@/types";

interface FeatureBarProps {
  language: Language;
  onFeatureClick: (feature: string) => void;
  className?: string;
}

const FEATURES = [
  {
    id: "image-gen",
    icon: Image,
    labelKey: "imageGeneration" as const,
    gradient: "from-pink-500/20 to-purple-500/10",
    border: "border-pink-500/30",
    iconColor: "text-pink-400",
    hoverBg: "hover:border-pink-500/50",
  },
  {
    id: "code",
    icon: Code2,
    labelKey: "codeSnippets" as const,
    gradient: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
    hoverBg: "hover:border-blue-500/50",
  },
  {
    id: "festivals",
    icon: Music,
    labelKey: "upcomingFestivals" as const,
    gradient: "from-green-500/20 to-teal-500/10",
    border: "border-green-500/30",
    iconColor: "text-green-400",
    hoverBg: "hover:border-green-500/50",
  },
  {
    id: "create-image",
    icon: Sparkles,
    labelKey: "createImage" as const,
    gradient: "from-orange-500/20 to-yellow-500/10",
    border: "border-orange-500/30",
    iconColor: "text-orange-400",
    hoverBg: "hover:border-orange-500/50",
  },
];

export function FeatureBar({ language, onFeatureClick, className }: FeatureBarProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-2 sm:grid-cols-4", className)}>
      {FEATURES.map(({ id, icon: Icon, labelKey, gradient, border, iconColor, hoverBg }) => (
        <button
          key={id}
          onClick={() => onFeatureClick(id)}
          className={cn(
            "flex items-center gap-2 rounded-xl border bg-gradient-to-br px-3 py-2.5",
            "text-xs font-medium text-foreground transition-all duration-200",
            "hover:-translate-y-0.5 hover:shadow-md",
            gradient,
            border,
            hoverBg
          )}
        >
          <Icon className={cn("h-4 w-4 flex-shrink-0", iconColor)} />
          <span className="truncate">{t(language, labelKey)}</span>
        </button>
      ))}
    </div>
  );
}
