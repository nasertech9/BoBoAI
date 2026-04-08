import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import ChatPage from "@/pages/ChatPage";
import VoicePage from "@/pages/VoicePage";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";

function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      <div className="text-6xl font-black gradient-brand-text">404</div>
      <p className="text-muted-foreground">Page not found</p>
      <a
        href="/"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Back to BoBoAI
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            color: "hsl(var(--foreground))",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/voice" element={<VoicePage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
