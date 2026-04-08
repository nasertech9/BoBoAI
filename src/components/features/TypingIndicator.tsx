import { Brain } from "lucide-react";
import { t } from "@/lib/translations";
import type { Language } from "@/types";

interface TypingIndicatorProps {
  language: Language;
}

export function TypingIndicator({ language }: TypingIndicatorProps) {
  return (
    <div className="flex items-center gap-3 animate-fade-in">
      {/* AI Avatar */}
      <div
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full shadow-md animate-pulse-glow"
        style={{
          background: "linear-gradient(135deg, #6455f7, #8b5cf6)",
        }}
      >
        <Brain className="h-3.5 w-3.5 text-white" />
      </div>

      {/* Typing bubble */}
      <div className="chat-bubble-ai flex items-center gap-2 px-4 py-3">
        <div className="flex items-center gap-1">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
        <span className="text-xs text-muted-foreground">{t(language, "thinking")}</span>
      </div>
    </div>
  );
}
