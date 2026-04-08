import { Moon, Sun, Plus, Download, ChevronDown, LogIn, UserPlus, LogOut, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import boboLogo from "@/assets/bobo-logo.png";
import type { Language } from "@/types";
import { t } from "@/lib/translations";
import { LANGUAGES } from "@/constants";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface HeaderProps {
  language: Language;
  theme: "dark" | "light";
  onLanguageChange: (lang: Language) => void;
  onToggleTheme: () => void;
  onNewChat: () => void;
  onExportChat: (format: "txt" | "json") => void;
}

export function Header({
  language,
  theme,
  onLanguageChange,
  onToggleTheme,
  onNewChat,
  onExportChat,
}: HeaderProps) {
  const [langOpen, setLangOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const navigate = useNavigate();

  const currentLang = LANGUAGES.find((l) => l.code === language);

  const storedUser = localStorage.getItem("boboai_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleSignOut = () => {
    localStorage.removeItem("boboai_user");
    toast.success("Signed out successfully");
    navigate("/sign-in");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={boboLogo}
              alt="BoBoAI Logo"
              className="h-8 w-8 rounded-lg object-cover shadow-md"
              style={{ boxShadow: "0 0 12px rgba(139, 92, 246, 0.5)" }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold gradient-brand-text leading-tight">
              BoBoAI
            </span>
            <span className="hidden text-[10px] text-muted-foreground leading-tight sm:block">
              {t(language, "tagline")}
            </span>
          </div>
        </div>

        {/* Center tagline - mobile */}
        <div className="block sm:hidden">
          <span className="text-sm font-semibold gradient-brand-text">
            BoBoAI
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Language Picker */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setLangOpen((o) => !o);
                setExportOpen(false);
              }}
              className="h-8 gap-1 px-2 text-xs font-medium"
            >
              <span>{currentLang?.flag}</span>
              <span className="hidden sm:block">{currentLang?.label}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>

            {langOpen && (
              <div className="absolute right-0 top-10 z-50 min-w-[140px] rounded-xl border border-border bg-popover shadow-xl animate-fade-in">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setLangOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent",
                      lang.code === language && "text-primary font-medium",
                      lang.code === LANGUAGES[0].code && "rounded-t-xl",
                      lang.code === LANGUAGES[LANGUAGES.length - 1].code && "rounded-b-xl"
                    )}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* New Chat */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewChat}
            className="hidden h-8 gap-1.5 px-2 text-xs sm:flex"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden md:block">{t(language, "newChat")}</span>
          </Button>

          {/* Export Chat */}
          <div className="relative hidden sm:block">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setExportOpen((o) => !o);
                setLangOpen(false);
              }}
              className="h-8 gap-1.5 px-2 text-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden md:block">{t(language, "exportChat")}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>

            {exportOpen && (
              <div className="absolute right-0 top-10 z-50 min-w-[160px] rounded-xl border border-border bg-popover shadow-xl animate-fade-in">
                <button
                  onClick={() => {
                    onExportChat("txt");
                    setExportOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-t-xl px-3 py-2 text-sm transition-colors hover:bg-accent"
                >
                  📄 {t(language, "exportAsTxt")}
                </button>
                <button
                  onClick={() => {
                    onExportChat("json");
                    setExportOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-b-xl px-3 py-2 text-sm transition-colors hover:bg-accent"
                >
                  📋 {t(language, "exportAsJson")}
                </button>
              </div>
            )}
          </div>

          {/* Auth buttons */}
          {user ? (
            <div className="flex items-center gap-1.5">
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary/10 border border-primary/20">
                <User className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-primary max-w-[80px] truncate">{user.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="h-8 gap-1.5 px-2 text-xs text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden md:block">Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/sign-in")}
                className="h-8 gap-1.5 px-2.5 text-xs font-medium"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span className="hidden sm:block">Sign In</span>
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/sign-up")}
                className="h-8 gap-1.5 px-2.5 text-xs font-medium bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:opacity-90 shadow-sm"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span className="hidden sm:block">Sign Up</span>
              </Button>
            </div>
          )}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className="h-8 w-8"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-yellow-400" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Click outside handler */}
      {(langOpen || exportOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setLangOpen(false);
            setExportOpen(false);
          }}
        />
      )}
    </header>
  );
}
