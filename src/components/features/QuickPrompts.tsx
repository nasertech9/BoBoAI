import { Brain, Code2, Music, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/lib/translations";
import type { Language } from "@/types";

interface QuickPromptsProps {
  language: Language;
  onPromptClick: (prompt: string) => void;
  onImageClick: () => void;
  className?: string;
}

const PROMPTS = [
  {
    id: "1",
    icon: Brain,
    color: "text-violet-400",
    bg: "from-violet-500/15 to-purple-500/10 border-violet-500/30",
    textKey: "prompt1" as const,
    prompt: "What's something fascinating you learned recently?",
  },
  {
    id: "2",
    icon: Code2,
    color: "text-blue-400",
    bg: "from-blue-500/15 to-cyan-500/10 border-blue-500/30",
    textKey: "prompt2" as const,
    prompt: "Write me a Python function with async/await",
  },
  {
    id: "3",
    icon: Music,
    color: "text-green-400",
    bg: "from-green-500/15 to-teal-500/10 border-green-500/30",
    textKey: "prompt3" as const,
    prompt: "Show me upcoming music festivals",
  },
];

export function QuickPrompts({ language, onPromptClick, onImageClick, className }: QuickPromptsProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-semibold text-muted-foreground px-1">
        {t(language, "learnSomething")}
      </h3>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {PROMPTS.map(({ id, icon: Icon, color, bg, textKey, prompt }) => (
          <button
            key={id}
            onClick={() => onPromptClick(prompt)}
            className={cn(
              "flex items-start gap-3 rounded-xl border bg-gradient-to-br p-3.5 text-left",
              "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
              bg
            )}
          >
            <div className="flex-shrink-0 rounded-lg p-1.5 bg-background/30">
              <Icon className={cn("h-4 w-4", color)} />
            </div>
            <p className="text-xs leading-relaxed text-foreground/80">
              {t(language, textKey)}
            </p>
          </button>
        ))}

        {/* Create Image card */}
        <button
          onClick={onImageClick}
          className={cn(
            "flex items-start gap-3 rounded-xl border bg-gradient-to-br p-3.5 text-left",
            "from-pink-500/15 to-orange-500/10 border-pink-500/30",
            "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:hidden lg:flex"
          )}
        >
          <div className="flex-shrink-0 rounded-lg p-1.5 bg-background/30">
            <Wand2 className="h-4 w-4 text-pink-400" />
          </div>
          <p className="text-xs leading-relaxed text-foreground/80">
            {t(language, "createImage")}
          </p>
        </button>
      </div>
    </div>
  );
}
