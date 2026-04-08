import { useState, useCallback, useEffect } from "react";
import type { Message, Language, AIModel, ChatSession } from "@/types";
import { sendChatMessage, exportChatAsText, exportChatAsJson } from "@/lib/mockApi";
import { generateId, downloadFile } from "@/lib/utils";
import { STORAGE_KEYS } from "@/constants";
import { toast } from "sonner";

export function useBoBoAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return (saved as Language) || "en";
  });
  const [model, setModelState] = useState<AIModel>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MODEL);
    return (saved as AIModel) || "bobo-4-pro";
  });
  const [theme, setThemeState] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return (saved as "dark" | "light") || "light";
  });
  const [pro4Enabled, setPro4Enabled] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.PRO_4_ENABLED) === "true";
  });
  const [pro35Enabled, setPro35Enabled] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.PRO_35_ENABLED) === "true";
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Apply language direction
  useEffect(() => {
    const dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", language);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const setModel = useCallback((m: AIModel) => {
    setModelState(m);
    localStorage.setItem(STORAGE_KEYS.MODEL, m);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const togglePro4 = useCallback(() => {
    setPro4Enabled((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEYS.PRO_4_ENABLED, String(next));
      return next;
    });
  }, []);

  const togglePro35 = useCallback(() => {
    setPro35Enabled((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEYS.PRO_35_ENABLED, String(next));
      return next;
    });
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        type: "text",
        timestamp: new Date(),
        language,
        model,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await sendChatMessage(content, language, model);

        const aiMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: response.content,
          type: response.type,
          timestamp: new Date(),
          language,
          model,
          codeLanguage: response.codeLanguage,
          imageUrl: response.imageUrl,
          festivals: response.festivals,
        };

        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error("Chat error:", error);
        const errorMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: "I encountered an error. Please try again.",
          type: "error",
          timestamp: new Date(),
          language,
          model,
        };
        setMessages((prev) => [...prev, errorMessage]);
        toast.error("Failed to get response. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, language, model]
  );

  const newChat = useCallback(() => {
    setMessages([]);
    toast.success("Started a new chat!");
  }, []);

  const exportChat = useCallback(
    (format: "txt" | "json") => {
      if (messages.length === 0) {
        toast.error("No messages to export.");
        return;
      }

      const exportData = messages.map((m) => ({
        role: m.role,
        content: m.type === "code" ? `\`\`\`${m.codeLanguage}\n${m.content}\n\`\`\`` : m.content,
        timestamp: m.timestamp,
      }));

      if (format === "txt") {
        const content = exportChatAsText(exportData);
        downloadFile(content, "boboai-chat.txt", "text/plain");
      } else {
        const content = exportChatAsJson(exportData);
        downloadFile(content, "boboai-chat.json", "application/json");
      }

      toast.success("Chat exported successfully!");
    },
    [messages]
  );

  return {
    messages,
    isLoading,
    language,
    model,
    theme,
    pro4Enabled,
    pro35Enabled,
    sendMessage,
    newChat,
    exportChat,
    setLanguage,
    setModel,
    toggleTheme,
    togglePro4,
    togglePro35,
  };
}
