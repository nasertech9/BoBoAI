import boboLogo from "@/assets/bobo-logo.png";
import heroBg from "@/assets/hero-bg.jpg";
import { t } from "@/lib/translations";
import type { Language } from "@/types";
import { cn } from "@/lib/utils";
import { QuickPrompts } from "@/components/features/QuickPrompts";
import { FeatureBar } from "@/components/features/FeatureBar";
import { ProCards } from "@/components/features/ProCards";
import type { AIModel } from "@/types";

interface WelcomeScreenProps {
  language: Language;
  currentModel: AIModel;
  pro4Enabled: boolean;
  pro35Enabled: boolean;
  onPromptClick: (prompt: string) => void;
  onImageClick: () => void;
  onFeatureClick: (feature: string) => void;
  onTogglePro4: () => void;
  onTogglePro35: () => void;
  onSelectModel: (model: AIModel) => void;
  onSubscribe4Pro?: () => void;
  onSubscribe35Pro?: () => void;
  className?: string;
}

export function WelcomeScreen({
  language,
  currentModel,
  pro4Enabled,
  pro35Enabled,
  onPromptClick,
  onImageClick,
  onFeatureClick,
  onTogglePro4,
  onTogglePro35,
  onSelectModel,
  onSubscribe4Pro,
  onSubscribe35Pro,
  className,
}: WelcomeScreenProps) {
  return (
    <div className={cn("flex flex-col gap-6 px-4 py-6", className)}>
      {/* Hero Section */}
      <div
        className="relative overflow-hidden rounded-2xl border border-border/40"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "180px",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-violet-900/40 to-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={boboLogo}
              alt="BoBoAI"
              className="h-12 w-12 rounded-xl shadow-lg"
              style={{ boxShadow: "0 0 20px rgba(139, 92, 246, 0.6)" }}
            />
            <h1
              className="text-3xl font-bold text-white"
              style={{
                textShadow: "0 0 30px rgba(139, 92, 246, 0.8)",
              }}
            >
              BoBoAI
            </h1>
          </div>
          <p className="text-lg font-medium text-white/90">
            {t(language, "tagline")}
          </p>
          <p className="mt-1 text-sm text-white/60">
            {t(language, "welcomeMessage")}
          </p>
        </div>
      </div>

      {/* Feature Bar */}
      <FeatureBar
        language={language}
        onFeatureClick={onFeatureClick}
      />

      {/* Quick Prompts */}
      <QuickPrompts
        language={language}
        onPromptClick={onPromptClick}
        onImageClick={onImageClick}
      />

      {/* Pro Cards */}
      <ProCards
        language={language}
        currentModel={currentModel}
        pro4Enabled={pro4Enabled}
        pro35Enabled={pro35Enabled}
        onTogglePro4={onTogglePro4}
        onTogglePro35={onTogglePro35}
        onSelectModel={onSelectModel}
        onSubscribe4Pro={onSubscribe4Pro}
        onSubscribe35Pro={onSubscribe35Pro}
      />
    </div>
  );
}
