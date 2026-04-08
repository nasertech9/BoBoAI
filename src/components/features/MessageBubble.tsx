import { Brain, Zap, AlertTriangle, Download } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { CodeBlock } from "@/components/features/CodeBlock";
import { FestivalList } from "@/components/features/FestivalList";
import type { Message, Language } from "@/types";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  language: Language;
}

function AIAvatar({ model }: { model?: string }) {
  return (
    <div
      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full shadow-md"
      style={{
        background: "linear-gradient(135deg, #6455f7, #8b5cf6)",
        boxShadow: "0 0 10px rgba(139, 92, 246, 0.4)",
      }}
    >
      {model === "bobo-3-5-pro" ? (
        <Zap className="h-3.5 w-3.5 text-white" />
      ) : (
        <Brain className="h-3.5 w-3.5 text-white" />
      )}
    </div>
  );
}

export function MessageBubble({ message, language }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isError = message.type === "error";

  const handleImageDownload = (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `boboai-${Date.now()}.jpg`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      {!isUser && <AIAvatar model={message.model} />}

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[85%] space-y-2",
          isUser ? "items-end" : "items-start",
          "flex flex-col"
        )}
      >
        {/* Main content */}
        {isError ? (
          <div className="flex items-start gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{message.content}</span>
          </div>
        ) : message.type === "code" ? (
          <div className="w-full max-w-2xl space-y-2">
            {message.content && (
              <div className="chat-bubble-ai px-4 py-3 text-sm text-foreground">
                Here's the code you requested:
              </div>
            )}
            <CodeBlock
              code={message.content}
              language={message.codeLanguage || "text"}
              uiLanguage={language}
            />
          </div>
        ) : message.type === "image" && message.imageUrl ? (
          <div className="space-y-2 max-w-sm">
            <div className="chat-bubble-ai px-4 py-3 text-sm text-foreground">
              {message.content}
            </div>
            <div className="group relative overflow-hidden rounded-xl border border-border/60 shadow-lg">
              <img
                src={message.imageUrl}
                alt="Generated"
                className="w-full object-cover"
                style={{ maxHeight: "280px" }}
              />
              <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100 p-3">
                <button
                  onClick={() => handleImageDownload(message.imageUrl!)}
                  className="flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-900 shadow"
                >
                  <Download className="h-3 w-3" />
                  Download
                </button>
              </div>
            </div>
          </div>
        ) : message.type === "festivals" && message.festivals ? (
          <div className="w-full max-w-2xl">
            <FestivalList
              festivals={message.festivals}
              language={language}
              className="chat-bubble-ai px-4 py-4"
            />
          </div>
        ) : (
          <div
            className={cn(
              "px-4 py-3 text-sm leading-relaxed",
              isUser ? "chat-bubble-user" : "chat-bubble-ai text-foreground"
            )}
          >
            {message.content}
          </div>
        )}

        {/* Timestamp */}
        <span className="px-1 text-[10px] text-muted-foreground">
          {formatTime(message.timestamp)}
          {message.model && !isUser && (
            <span className="ml-1.5 opacity-60">
              · {message.model === "bobo-4-pro" ? "4.0 Pro" : "3.5 Pro"}
            </span>
          )}
        </span>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-xs font-bold text-white shadow-md">
          U
        </div>
      )}
    </div>
  );
}
