import { Brain, Zap, CheckCircle, Circle, Clock, Mail, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { t } from "@/lib/translations";
import type { Language, AIModel } from "@/types";

interface ProCardsProps {
  language: Language;
  currentModel: AIModel;
  pro4Enabled: boolean;
  pro35Enabled: boolean;
  onTogglePro4: () => void;
  onTogglePro35: () => void;
  onSelectModel: (model: AIModel) => void;
  onSubscribe4Pro?: () => void;
  onSubscribe35Pro?: () => void;
  className?: string;
}

interface FeatureItem {
  icon: React.ElementType;
  text: string;
}

interface ProCardItemProps {
  model: AIModel;
  currentModel: AIModel;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ElementType;
  iconColor: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  speed: number;
  context: string;
  features: FeatureItem[];
  enabled: boolean;
  onToggle: () => void;
  onSelect: () => void;
  onSubscribe?: () => void;
  enableLabel: string;
  disableLabel: string;
}

function SpeedBar({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-all",
            i < value ? "bg-primary" : "bg-border"
          )}
        />
      ))}
    </div>
  );
}

function ProCardItem({
  model,
  currentModel,
  title,
  subtitle,
  badge,
  icon: Icon,
  iconColor,
  gradientFrom,
  gradientTo,
  borderColor,
  speed,
  context,
  features,
  enabled,
  onToggle,
  onSelect,
  onSubscribe,
  enableLabel,
  disableLabel,
}: ProCardItemProps) {
  const isActive = currentModel === model;

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 transition-all duration-300",
        borderColor,
        isActive && "ring-2 ring-primary/30",
        `bg-gradient-to-br ${gradientFrom} ${gradientTo}`
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl",
              iconColor
            )}
            style={{
              background: isActive
                ? "linear-gradient(135deg, rgba(100,85,247,0.3), rgba(139,92,246,0.2))"
                : "rgba(255,255,255,0.08)",
            }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-foreground">{title}</h3>
              <span className="pro-badge text-[10px]">{badge}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        {isActive && (
          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
        )}
      </div>

      {/* Speed indicator */}
      <div className="mb-3 space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">Response Speed</span>
          <span className="font-medium text-foreground">{speed}/5</span>
        </div>
        <SpeedBar value={speed} />
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">Context</span>
          <span className="font-medium text-foreground">{context}</span>
        </div>
      </div>

      {/* Features */}
      <div className="mb-3 space-y-1.5">
        {features.map((feature, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
            <feature.icon className="h-3 w-3 text-primary flex-shrink-0" />
            <span>{feature.text}</span>
          </div>
        ))}
      </div>

      {/* Pro toggle / subscribe */}
      <div className="flex items-center gap-2 mb-3 rounded-lg bg-background/30 px-3 py-2 border border-border/40">
        <button
          onClick={() => {
            if (!enabled && onSubscribe) {
              onSubscribe();
            } else {
              onToggle();
            }
          }}
          className={cn(
            "relative flex h-5 w-9 items-center rounded-full transition-all duration-200",
            enabled ? "bg-primary" : "bg-border"
          )}
          aria-label={enabled ? disableLabel : enableLabel}
        >
          <div
            className={cn(
              "absolute h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200",
              enabled ? "translate-x-4" : "translate-x-0.5"
            )}
          />
        </button>
        <span className="text-xs font-medium">
          {enabled ? (
            <span className="text-primary">{enableLabel} Active</span>
          ) : (
            <span className="text-muted-foreground">{enableLabel} · Subscribe</span>
          )}
        </span>
        {!enabled && (
          <button
            onClick={onSubscribe}
            className="ml-auto text-[10px] font-semibold text-primary hover:underline"
          >
            Get access →
          </button>
        )}
      </div>

      {/* Select model button */}
      <Button
        variant={isActive ? "default" : "outline"}
        size="sm"
        onClick={onSelect}
        className={cn(
          "w-full h-8 text-xs font-medium",
          isActive &&
            "bg-gradient-to-r from-violet-600 to-purple-600 text-white border-0 hover:from-violet-700 hover:to-purple-700"
        )}
      >
        {isActive ? "✓ Currently Active" : "Switch to this model"}
      </Button>
    </div>
  );
}

export function ProCards({
  language,
  currentModel,
  pro4Enabled,
  pro35Enabled,
  onTogglePro4,
  onTogglePro35,
  onSelectModel,
  onSubscribe4Pro,
  onSubscribe35Pro,
  className,
}: ProCardsProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-semibold text-foreground px-1">AI Models</h3>
      <div className="grid gap-3 lg:grid-cols-2">
        <ProCardItem
          model="bobo-4-pro"
          currentModel={currentModel}
          title={t(language, "bobo4Pro")}
          subtitle="Most capable"
          badge="PRO"
          icon={Brain}
          iconColor="text-violet-400"
          gradientFrom="from-violet-500/10"
          gradientTo="to-purple-500/5"
          borderColor="border-violet-500/30"
          speed={4}
          context="200K tokens"
          features={[
            { icon: Bell, text: t(language, "scheduleReminders") },
            { icon: Mail, text: "Send emails & automate tasks" },
            { icon: Clock, text: t(language, "taskAutomation") },
          ]}
          enabled={pro4Enabled}
          onToggle={onTogglePro4}
          onSelect={() => onSelectModel("bobo-4-pro")}
          onSubscribe={onSubscribe4Pro}
          enableLabel={t(language, "enablePro")}
          disableLabel={t(language, "disablePro")}
        />

        <ProCardItem
          model="bobo-3-5-pro"
          currentModel={currentModel}
          title={t(language, "bobo35Pro")}
          subtitle="Faster responses"
          badge="3.5"
          icon={Zap}
          iconColor="text-yellow-400"
          gradientFrom="from-yellow-500/10"
          gradientTo="to-orange-500/5"
          borderColor="border-yellow-500/30"
          speed={5}
          context="32K tokens"
          features={[
            { icon: Zap, text: t(language, "fasterResponses") },
            { icon: Circle, text: t(language, "largerContext") },
            { icon: CheckCircle, text: "Optimized for quick tasks" },
          ]}
          enabled={pro35Enabled}
          onToggle={onTogglePro35}
          onSelect={() => onSelectModel("bobo-3-5-pro")}
          onSubscribe={onSubscribe35Pro}
          enableLabel={t(language, "enablePro")}
          disableLabel={t(language, "disablePro")}
        />
      </div>
    </div>
  );
}
