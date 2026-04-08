export type Language = "en" | "es" | "zh" | "ar";
export type Theme = "dark" | "light";
export type AIModel = "bobo-4-pro" | "bobo-3-5-pro";
export type MessageRole = "user" | "assistant";
export type MessageType = "text" | "code" | "image" | "festivals" | "error";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  type: MessageType;
  timestamp: Date;
  language: Language;
  codeLanguage?: string;
  imageUrl?: string;
  festivals?: Festival[];
  model?: AIModel;
}

export interface Festival {
  id: string;
  name: string;
  date: string;
  location: string;
  genre: string;
  ticketUrl: string;
  imageUrl: string;
  price: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  language: Language;
  model: AIModel;
}

export interface ProFeature {
  id: string;
  name: string;
  model: AIModel;
  description: string;
  features: string[];
  speed: number;
  contextWindow: string;
  enabled: boolean;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  url: string;
  createdAt: Date;
}

export interface QuickPrompt {
  id: string;
  icon: string;
  labelKey: keyof import("./translations").Translations;
  prompt: string;
}
