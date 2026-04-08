import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { highlightCode } from "@/lib/utils";
import { t } from "@/lib/translations";
import type { Language } from "@/types";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language: string;
  uiLanguage: Language;
  className?: string;
}

const LANG_COLORS: Record<string, string> = {
  python: "text-yellow-400",
  javascript: "text-yellow-300",
  typescript: "text-blue-400",
  tsx: "text-blue-400",
  html: "text-orange-400",
  css: "text-pink-400",
  json: "text-green-400",
  bash: "text-purple-400",
  default: "text-muted-foreground",
};

export function CodeBlock({ code, language, uiLanguage, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const highlighted = highlightCode(code, language);
  const langColor = LANG_COLORS[language] || LANG_COLORS.default;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/60 bg-[#0d1117] shadow-lg",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 bg-[#161b22] px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/70" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <div className="h-3 w-3 rounded-full bg-green-500/70" />
          </div>
          <span className={cn("text-xs font-mono font-medium", langColor)}>
            {language.toUpperCase()}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-400" />
              <span className="text-green-400">{t(uiLanguage, "copied")}</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>{t(uiLanguage, "copyCode")}</span>
            </>
          )}
        </Button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto p-4">
        <pre className="code-block text-sm leading-relaxed">
          <code
            dangerouslySetInnerHTML={{ __html: highlighted }}
            className="text-[#e6edf3]"
          />
        </pre>
      </div>
    </div>
  );
}
