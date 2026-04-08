import type { Language, AIModel, Festival, GeneratedImage } from "@/types";

// Mock festivals data
const FESTIVALS: Festival[] = [
  {
    id: "1",
    name: "Coachella Valley Music & Arts Festival",
    date: "April 11–20, 2026",
    location: "Indio, California, USA",
    genre: "Indie / Electronic / Hip-Hop",
    ticketUrl: "https://www.coachella.com",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=240&fit=crop&auto=format",
    price: "$549+",
  },
  {
    id: "2",
    name: "Glastonbury Festival",
    date: "June 24–28, 2026",
    location: "Somerset, England, UK",
    genre: "Rock / Pop / Folk",
    ticketUrl: "https://www.glastonburyfestivals.co.uk",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=240&fit=crop&auto=format",
    price: "£350+",
  },
  {
    id: "3",
    name: "Tomorrowland",
    date: "July 17–26, 2026",
    location: "Boom, Belgium",
    genre: "Electronic / EDM",
    ticketUrl: "https://www.tomorrowland.com",
    imageUrl: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&h=240&fit=crop&auto=format",
    price: "€260+",
  },
  {
    id: "4",
    name: "Lollapalooza",
    date: "July 30 – August 2, 2026",
    location: "Chicago, Illinois, USA",
    genre: "Rock / Alternative / Electronic",
    ticketUrl: "https://www.lollapalooza.com",
    imageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=240&fit=crop&auto=format",
    price: "$395+",
  },
  {
    id: "5",
    name: "Ultra Music Festival",
    date: "March 27–29, 2026",
    location: "Miami, Florida, USA",
    genre: "EDM / Techno / House",
    ticketUrl: "https://www.ultramusicfestival.com",
    imageUrl: "https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?w=400&h=240&fit=crop&auto=format",
    price: "$300+",
  },
];

// Mock image URLs for generation
const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1686191128892-3b37add4c844?w=512&h=512&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1676299081847-824916de030a?w=512&h=512&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1686749342878-4aa77fa5d5bc?w=512&h=512&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1684779847639-fbcc07df1b47?w=512&h=512&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1686299508726-b6d0bd87dd34?w=512&h=512&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1686009573248-9aeda6bbf0d7?w=512&h=512&fit=crop&auto=format",
];

// Code examples by topic
const CODE_EXAMPLES: Record<string, { lang: string; code: string }> = {
  default: {
    lang: "python",
    code: `# BoBoAI Python Example
def greet_user(name: str) -> str:
    """Generate a personalized greeting."""
    return f"Hello, {name}! Welcome to BoBoAI."

def fibonacci(n: int) -> list[int]:
    """Generate Fibonacci sequence up to n terms."""
    sequence = [0, 1]
    for i in range(2, n):
        sequence.append(sequence[i-1] + sequence[i-2])
    return sequence[:n]

# Usage
print(greet_user("World"))
print(fibonacci(10))`,
  },
  javascript: {
    lang: "javascript",
    code: `// Modern JavaScript with async/await
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) throw new Error('User not found');
    
    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      email: data.email,
    };
  } catch (error) {
    console.error('Error fetching user:', error.message);
    return null;
  }
}

// Arrow function with destructuring
const formatUser = ({ name, email }) => \`\${name} <\${email}>\`;

fetchUserData(42).then(user => {
  if (user) console.log(formatUser(user));
});`,
  },
  react: {
    lang: "tsx",
    code: `import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

export function UserCard({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const res = await fetch(\`/api/users/\${userId}\`);
      const data = await res.json();
      setUser(data);
      setLoading(false);
    }
    loadUser();
  }, [userId]);

  if (loading) return <div className="animate-pulse">Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="p-4 rounded-lg border bg-card">
      <h2 className="text-xl font-bold">{user.name}</h2>
      <p className="text-muted-foreground">{user.email}</p>
    </div>
  );
}`,
  },
  python: {
    lang: "python",
    code: `from dataclasses import dataclass
from typing import Optional
import asyncio
import httpx

@dataclass
class APIResponse:
    status: int
    data: dict
    error: Optional[str] = None

async def fetch_data(url: str, params: dict = {}) -> APIResponse:
    """Async HTTP request with error handling."""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params, timeout=30.0)
            response.raise_for_status()
            return APIResponse(status=200, data=response.json())
        except httpx.HTTPStatusError as e:
            return APIResponse(
                status=e.response.status_code,
                data={},
                error=str(e)
            )

async def main():
    result = await fetch_data(
        "https://api.example.com/data",
        {"limit": 10, "offset": 0}
    )
    if result.error:
        print(f"Error: {result.error}")
    else:
        print(f"Got {len(result.data)} items")

asyncio.run(main())`,
  },
  html: {
    lang: "html",
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BoBoAI Component</title>
  <style>
    .card {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 24px;
      border-radius: 12px;
      border: 1px solid rgba(139, 92, 246, 0.3);
      background: linear-gradient(135deg, #0f0c29, #302b63);
      color: white;
      max-width: 400px;
    }
    .btn {
      padding: 10px 20px;
      border-radius: 8px;
      border: none;
      background: #6455f7;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn:hover { background: #8b5cf6; transform: translateY(-1px); }
  </style>
</head>
<body>
  <div class="card">
    <h2>BoBoAI Component</h2>
    <p>A beautiful UI component example.</p>
    <button class="btn" onclick="alert('Hello from BoBoAI!')">
      Click Me
    </button>
  </div>
</body>
</html>`,
  },
};

// AI responses by topic
function detectIntent(message: string): {
  type: "text" | "code" | "image" | "festivals";
  codeType?: string;
} {
  const lower = message.toLowerCase();

  if (
    lower.includes("image") ||
    lower.includes("picture") ||
    lower.includes("photo") ||
    lower.includes("draw") ||
    lower.includes("generate art") ||
    lower.includes("create art") ||
    lower.includes("صورة") ||
    lower.includes("图像") ||
    lower.includes("imagen")
  ) {
    return { type: "image" };
  }

  if (
    lower.includes("festival") ||
    lower.includes("concert") ||
    lower.includes("music event") ||
    lower.includes("coachella") ||
    lower.includes("lollapalooza") ||
    lower.includes("مهرجان") ||
    lower.includes("音乐节") ||
    lower.includes("festival de")
  ) {
    return { type: "festivals" };
  }

  if (
    lower.includes("code") ||
    lower.includes("function") ||
    lower.includes("program") ||
    lower.includes("script") ||
    lower.includes("snippet") ||
    lower.includes("كود") ||
    lower.includes("代码") ||
    lower.includes("código")
  ) {
    const codeType = lower.includes("javascript") || lower.includes("js")
      ? "javascript"
      : lower.includes("react")
      ? "react"
      : lower.includes("html")
      ? "html"
      : lower.includes("python")
      ? "python"
      : "default";
    return { type: "code", codeType };
  }

  return { type: "text" };
}

function getTextResponse(message: string, lang: Language, model: AIModel): string {
  const lower = message.toLowerCase();
  const modelLabel = model === "bobo-4-pro" ? "BoBoAI 4.0 Pro" : "BoBoAI 3.5 Pro";

  const responses: Record<Language, string[]> = {
    en: [
      `Great question! As ${modelLabel}, I can provide comprehensive insights on this topic. ${getTopicResponse(lower, "en")}`,
      `I'd be happy to help with that! Based on the latest information available to ${modelLabel}: ${getTopicResponse(lower, "en")}`,
      `Excellent! Here's what I know about this: ${getTopicResponse(lower, "en")} Is there anything specific you'd like me to elaborate on?`,
    ],
    es: [
      `¡Excelente pregunta! Como ${modelLabel}, puedo proporcionar información completa sobre este tema. ${getTopicResponse(lower, "es")}`,
      `¡Me alegra poder ayudarte! Basándome en la información más reciente de ${modelLabel}: ${getTopicResponse(lower, "es")}`,
      `¡Claro! Aquí está lo que sé sobre esto: ${getTopicResponse(lower, "es")} ¿Hay algo específico que quieras que elabore?`,
    ],
    zh: [
      `好问题！作为 ${modelLabel}，我可以提供关于这个话题的全面见解。${getTopicResponse(lower, "zh")}`,
      `很高兴帮助您！根据 ${modelLabel} 最新的信息：${getTopicResponse(lower, "zh")}`,
      `当然！这是我对此的了解：${getTopicResponse(lower, "zh")} 有什么需要我进一步说明的吗？`,
    ],
    ar: [
      `سؤال رائع! كـ ${modelLabel}، يمكنني تقديم رؤى شاملة حول هذا الموضوع. ${getTopicResponse(lower, "ar")}`,
      `يسعدني مساعدتك! بناءً على أحدث المعلومات المتاحة لـ ${modelLabel}: ${getTopicResponse(lower, "ar")}`,
      `بالتأكيد! إليك ما أعرفه عن هذا: ${getTopicResponse(lower, "ar")} هل هناك شيء محدد تريد مني التوضيح عنه؟`,
    ],
  };

  const langResponses = responses[lang];
  return langResponses[Math.floor(Math.random() * langResponses.length)];
}

function getTopicResponse(lower: string, lang: Language): string {
  if (lower.includes("quantum") || lower.includes("cuántica") || lower.includes("量子") || lower.includes("كمي")) {
    const responses: Record<Language, string> = {
      en: "Quantum computing uses quantum bits (qubits) that can exist in multiple states simultaneously through superposition. Unlike classical bits that are either 0 or 1, qubits can be both at once. This allows quantum computers to solve certain problems exponentially faster than classical computers, particularly in cryptography, drug discovery, and optimization problems.",
      es: "La computación cuántica utiliza bits cuánticos (qubits) que pueden existir en múltiples estados simultáneamente mediante la superposición. A diferencia de los bits clásicos que son 0 o 1, los qubits pueden ser ambos al mismo tiempo.",
      zh: "量子计算使用量子位（量子比特），它们可以通过叠加同时存在于多个状态中。与只能是0或1的经典比特不同，量子比特可以同时是两者。这使量子计算机能够以指数级速度解决某些问题。",
      ar: "تستخدم الحوسبة الكمية بتات كمية (كيوبت) يمكنها الوجود في حالات متعددة في آن واحد من خلال التراكب. على عكس البتات الكلاسيكية التي تكون 0 أو 1، يمكن للكيوبت أن يكون كليهما في نفس الوقت.",
    };
    return responses[lang];
  }

  if (lower.includes("ai") || lower.includes("artificial intelligence") || lower.includes("inteligencia artificial") || lower.includes("人工智能") || lower.includes("ذكاء اصطناعي")) {
    const responses: Record<Language, string> = {
      en: "In 2026, AI has advanced dramatically with multimodal models that can understand text, images, audio, and video simultaneously. Key trends include AI agents that can autonomously complete complex tasks, personalized AI companions, and AI integration across all industries. The focus has shifted toward making AI more reliable, interpretable, and aligned with human values.",
      es: "En 2026, la IA ha avanzado dramáticamente con modelos multimodales que pueden entender texto, imágenes, audio y video simultáneamente. Las tendencias clave incluyen agentes de IA que pueden completar tareas complejas de forma autónoma.",
      zh: "2026年，人工智能发展迅猛，多模态模型可以同时理解文本、图像、音频和视频。主要趋势包括能够自主完成复杂任务的AI代理、个性化AI伴侣以及AI在各行业的整合。",
      ar: "في عام 2026، تقدم الذكاء الاصطناعي بشكل درامي مع النماذج متعددة الوسائط التي يمكنها فهم النص والصور والصوت والفيديو في آن واحد. تشمل الاتجاهات الرئيسية وكلاء الذكاء الاصطناعي القادرين على إتمام المهام المعقدة بشكل مستقل.",
    };
    return responses[lang];
  }

  if (lower.includes("learn") || lower.includes("aprendiste") || lower.includes("学到") || lower.includes("تعلمت")) {
    const responses: Record<Language, string> = {
      en: "One fascinating thing I can share: the concept of 'emergence' — how complex behaviors arise from simple rules. For example, the beautiful patterns of a murmuration of starlings arise from just 3 simple rules each bird follows. Similarly, intelligence itself might emerge from simple neural connections at sufficient scale. The universe is full of such emergent phenomena!",
      es: "Una cosa fascinante que puedo compartir: el concepto de 'emergencia' — cómo comportamientos complejos surgen de reglas simples. Por ejemplo, los hermosos patrones de una bandada de estorninos surgen de solo 3 reglas simples que sigue cada ave.",
      zh: "我可以分享一件有趣的事：'涌现'概念——复杂行为如何从简单规则中产生。例如，椋鸟群的美丽图案来自每只鸟遵循的仅3条简单规则。同样，智能本身可能在足够规模的简单神经连接中涌现。",
      ar: "شيء رائع يمكنني مشاركته: مفهوم 'الظهور' - كيف تنشأ سلوكيات معقدة من قواعد بسيطة. على سبيل المثال، الأنماط الجميلة لسرب الزرازير تنشأ من 3 قواعد بسيطة فقط يتبعها كل طائر.",
    };
    return responses[lang];
  }

  // Default responses
  const defaults: Record<Language, string> = {
    en: "I'm here to assist you with a wide range of tasks — from answering questions and writing code to generating images and discovering events. Feel free to ask me anything!",
    es: "Estoy aquí para ayudarte con una amplia gama de tareas — desde responder preguntas y escribir código hasta generar imágenes y descubrir eventos. ¡No dudes en preguntarme cualquier cosa!",
    zh: "我在这里帮助您完成各种任务——从回答问题和编写代码到生成图像和发现活动。随时问我任何问题！",
    ar: "أنا هنا لمساعدتك في مجموعة واسعة من المهام - من الإجابة على الأسئلة وكتابة الكود إلى توليد الصور واكتشاف الأحداث. لا تتردد في سؤالي عن أي شيء!",
  };
  return defaults[lang];
}

export async function sendChatMessage(
  message: string,
  lang: Language,
  model: AIModel
): Promise<{
  type: "text" | "code" | "image" | "festivals";
  content: string;
  codeLanguage?: string;
  imageUrl?: string;
  festivals?: Festival[];
}> {
  // Simulate API delay
  const delay = model === "bobo-4-pro" ? 1800 : 1200;
  await new Promise((resolve) => setTimeout(resolve, delay + Math.random() * 800));

  const intent = detectIntent(message);

  if (intent.type === "festivals") {
    return {
      type: "festivals",
      content: "festivals",
      festivals: FESTIVALS,
    };
  }

  if (intent.type === "code") {
    const codeType = intent.codeType || "default";
    const example = CODE_EXAMPLES[codeType] || CODE_EXAMPLES.default;
    return {
      type: "code",
      content: example.code,
      codeLanguage: example.lang,
    };
  }

  if (intent.type === "image") {
    const randomImage = MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)];
    return {
      type: "image",
      content: "Here's the image I generated based on your description:",
      imageUrl: randomImage,
    };
  }

  return {
    type: "text",
    content: getTextResponse(message, lang, model),
  };
}

export async function generateImage(prompt: string): Promise<GeneratedImage> {
  await new Promise((resolve) => setTimeout(resolve, 2500 + Math.random() * 1500));
  const randomImage = MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)];
  return {
    id: crypto.randomUUID(),
    prompt,
    url: randomImage,
    createdAt: new Date(),
  };
}

export async function getFestivals(): Promise<Festival[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return FESTIVALS;
}

export function exportChatAsText(messages: Array<{ role: string; content: string; timestamp: Date }>): string {
  const header = "=== BoBoAI Chat Export ===\n";
  const dateStr = `Exported: ${new Date().toLocaleString()}\n\n`;
  const body = messages
    .map((m) => `[${m.timestamp.toLocaleTimeString()}] ${m.role.toUpperCase()}: ${m.content}`)
    .join("\n\n");
  return header + dateStr + body;
}

export function exportChatAsJson(messages: Array<{ role: string; content: string; timestamp: Date }>): string {
  return JSON.stringify(
    {
      exported_at: new Date().toISOString(),
      platform: "BoBoAI",
      version: "4.0",
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp.toISOString(),
      })),
    },
    null,
    2
  );
}
