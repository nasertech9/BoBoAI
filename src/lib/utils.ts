import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function highlightCode(code: string, language: string): string {
  // Simple tokenizer for syntax highlighting
  let highlighted = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Comments
  highlighted = highlighted.replace(
    /(#[^\n]*|\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g,
    '<span class="token-comment">$1</span>'
  );

  // Strings
  highlighted = highlighted.replace(
    /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
    '<span class="token-string">$1</span>'
  );

  // Keywords
  const keywords = [
    "function", "const", "let", "var", "return", "if", "else", "for", "while",
    "class", "import", "export", "from", "default", "async", "await", "try",
    "catch", "throw", "new", "this", "typeof", "instanceof", "def", "import",
    "from", "as", "in", "not", "and", "or", "True", "False", "None", "print",
    "interface", "type", "extends", "implements", "readonly", "public", "private",
    "void", "string", "number", "boolean", "null", "undefined",
  ];
  const keywordPattern = new RegExp(
    `\\b(${keywords.join("|")})\\b(?![^<]*>)`,
    "g"
  );
  highlighted = highlighted.replace(
    keywordPattern,
    '<span class="token-keyword">$1</span>'
  );

  // Numbers
  highlighted = highlighted.replace(
    /(?<![<"'a-zA-Z_])\b(\d+\.?\d*)\b(?![^<]*>)/g,
    '<span class="token-number">$1</span>'
  );

  // Function calls
  highlighted = highlighted.replace(
    /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()(?![^<]*>)/g,
    '<span class="token-function">$1</span>'
  );

  return highlighted;
}
