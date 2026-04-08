import { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MessageBubble } from "@/components/features/MessageBubble";
import { TypingIndicator } from "@/components/features/TypingIndicator";
import { ChatInput } from "@/components/features/ChatInput";
import { WelcomeScreen } from "@/components/features/WelcomeScreen";
import { ImageGeneratorModal } from "@/components/features/ImageGeneratorModal";
import { BillingModal } from "@/components/features/BillingModal";
import { useBoBoAI } from "@/hooks/useBoBoAI";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { AIModel } from "@/types";

export default function ChatPage() {
  const {
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
  } = useBoBoAI();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [showImageModal, setShowImageModal] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [billingModel, setBillingModel] = useState<AIModel | null>(null);

  // Handle voice message coming back from VoicePage
  useEffect(() => {
    const state = location.state as { voiceMessage?: string } | null;
    if (state?.voiceMessage) {
      sendMessage(state.voiceMessage);
      window.history.replaceState({}, "");
    }
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleFeatureClick = (feature: string) => {
    setActiveFeature(feature);
    setMobileSidebarOpen(false);

    if (feature === "create-image" || feature === "image-gen") {
      setShowImageModal(true);
      return;
    }

    const prompts: Record<string, string> = {
      code: "Write me a Python function with async/await and error handling",
      festivals: "Show me upcoming music festivals",
    };

    if (prompts[feature]) {
      sendMessage(prompts[feature]);
    }
  };

  const handlePromptClick = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleSubscribeSuccess = () => {
    if (billingModel === "bobo-4-pro") {
      if (!pro4Enabled) togglePro4();
      setModel("bobo-4-pro");
    } else if (billingModel === "bobo-3-5-pro") {
      if (!pro35Enabled) togglePro35();
      setModel("bobo-3-5-pro");
    }
    setBillingModel(null);
    toast.success("Subscription activated! Enjoy your Pro plan.");
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <Header
        language={language}
        theme={theme}
        onLanguageChange={setLanguage}
        onToggleTheme={toggleTheme}
        onNewChat={newChat}
        onExportChat={exportChat}
      />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar
          language={language}
          model={model}
          activeFeature={activeFeature}
          onFeatureClick={handleFeatureClick}
          onNewChat={newChat}
          onExportChat={exportChat}
          className="hidden w-52 flex-shrink-0 lg:flex"
        />

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 z-50 w-60 animate-slide-in-left">
              <Sidebar
                language={language}
                model={model}
                activeFeature={activeFeature}
                onFeatureClick={handleFeatureClick}
                onNewChat={newChat}
                onExportChat={exportChat}
                className="flex h-full"
              />
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Mobile menu button */}
          <div className="flex items-center border-b border-border/40 px-4 py-2 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileSidebarOpen((o) => !o)}
              className="h-8 w-8"
            >
              {mobileSidebarOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
            <span className="ml-2 text-sm font-medium text-muted-foreground">
              Menu
            </span>
          </div>

          {/* Messages / Welcome */}
          <div
            className="flex-1 overflow-y-auto"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {messages.length === 0 ? (
              <WelcomeScreen
                language={language}
                currentModel={model}
                pro4Enabled={pro4Enabled}
                pro35Enabled={pro35Enabled}
                onPromptClick={handlePromptClick}
                onImageClick={() => setShowImageModal(true)}
                onFeatureClick={handleFeatureClick}
                onTogglePro4={() => {
                  if (!pro4Enabled) setBillingModel("bobo-4-pro");
                  else togglePro4();
                }}
                onTogglePro35={() => {
                  if (!pro35Enabled) setBillingModel("bobo-3-5-pro");
                  else togglePro35();
                }}
                onSelectModel={setModel}
                onSubscribe4Pro={() => setBillingModel("bobo-4-pro")}
                onSubscribe35Pro={() => setBillingModel("bobo-3-5-pro")}
                className="max-w-3xl mx-auto w-full"
              />
            ) : (
              <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 w-full">
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    language={language}
                  />
                ))}
                {isLoading && <TypingIndicator language={language} />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div
            className={cn(
              "border-t border-border/40 bg-background/80 p-4 backdrop-blur-xl"
            )}
          >
            <div className="mx-auto max-w-3xl w-full">
              <ChatInput
                language={language}
                isLoading={isLoading}
                onSend={sendMessage}
              />
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                BoBoAI 2026 · {model === "bobo-4-pro" ? "4.0 Pro" : "3.5 Pro"} ·{" "}
                {language.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Generator Modal */}
      <ImageGeneratorModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        language={language}
      />

      {/* Billing Modal */}
      {billingModel && (
        <BillingModal
          isOpen={true}
          onClose={() => setBillingModel(null)}
          model={billingModel}
          onSuccess={handleSubscribeSuccess}
        />
      )}
    </div>
  );
}
