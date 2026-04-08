import type { Language, AIModel } from "@/types";

export const LANGUAGES: { code: Language; label: string; flag: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English", flag: "🇺🇸", dir: "ltr" },
  { code: "es", label: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "zh", label: "中文", flag: "🇨🇳", dir: "ltr" },
  { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" },
];

export const MODELS: { id: AIModel; name: string; badge: string; description: string }[] = [
  {
    id: "bobo-4-pro",
    name: "BoBoAI 4.0 Pro",
    badge: "4.0",
    description: "Most capable model with task automation",
  },
  {
    id: "bobo-3-5-pro",
    name: "BoBoAI 3.5 Pro",
    badge: "3.5",
    description: "Faster responses with limited context",
  },
];

export const QUICK_PROMPTS = [
  {
    id: "1",
    icon: "🧠",
    key: "prompt1",
    prompt: "What's something fascinating you learned recently?",
  },
  {
    id: "2",
    icon: "💻",
    key: "prompt2",
    prompt: "Write me a Python function for sorting algorithms",
  },
  {
    id: "3",
    icon: "🎵",
    key: "prompt3",
    prompt: "Show me upcoming music festivals",
  },
] as const;

export const FEATURE_CARDS = [
  {
    id: "image-gen",
    icon: "🖼️",
    titleKey: "imageGeneration",
    gradient: "from-pink-500/20 to-purple-500/20",
    borderColor: "border-pink-500/30",
  },
  {
    id: "code",
    icon: "💻",
    titleKey: "codeSnippets",
    gradient: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
  },
  {
    id: "festivals",
    icon: "🎵",
    titleKey: "upcomingFestivals",
    gradient: "from-green-500/20 to-teal-500/20",
    borderColor: "border-green-500/30",
  },
  {
    id: "create-image",
    icon: "✨",
    titleKey: "createImage",
    gradient: "from-orange-500/20 to-yellow-500/20",
    borderColor: "border-orange-500/30",
  },
] as const;

export const STORAGE_KEYS = {
  THEME: "boboai-theme",
  LANGUAGE: "boboai-language",
  MODEL: "boboai-model",
  CHAT_HISTORY: "boboai-chat-history",
  PRO_4_ENABLED: "boboai-pro-4-enabled",
  PRO_35_ENABLED: "boboai-pro-35-enabled",
} as const;
