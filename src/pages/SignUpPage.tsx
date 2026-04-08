import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Loader2, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import boboLogo from "@/assets/bobo-logo.png";
import heroBg from "@/assets/hero-bg.jpg";
import { toast } from "sonner";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "At least 8 characters", pass: password.length >= 8 },
    { label: "Contains uppercase", pass: /[A-Z]/.test(password) },
    { label: "Contains number", pass: /\d/.test(password) },
    { label: "Contains special char", pass: /[!@#$%^&*]/.test(password) },
  ];

  const score = checks.filter((c) => c.pass).length;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][score];
  const strengthColor = ["", "text-red-400", "text-orange-400", "text-yellow-400", "text-green-400"][score];
  const barColor = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400"][score];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-all duration-300",
                i <= score ? barColor : "bg-border"
              )}
            />
          ))}
        </div>
        <span className={cn("text-[11px] font-semibold", strengthColor)}>{strengthLabel}</span>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {checks.map(({ label, pass }) => (
          <div key={label} className="flex items-center gap-1">
            <CheckCircle className={cn("h-3 w-3 flex-shrink-0", pass ? "text-green-400" : "text-border")} />
            <span className={cn("text-[10px]", pass ? "text-muted-foreground" : "text-muted-foreground/50")}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!form.password || form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!form.terms) {
      newErrors.terms = "You must agree to the Terms of Service";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("boboai_user", JSON.stringify({ email: form.email, name: form.name }));
      toast.success("Account created! Welcome to BoBoAI!");
      navigate("/");
    }, 2000);
  };

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSocialSignup = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("boboai_user", JSON.stringify({ email: `user@${provider}.com`, name: `${provider} User` }));
      toast.success(`Account created with ${provider}!`);
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel – branding */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden"
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-violet-900/50 to-black/70" />
        <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-sm">
          <div className="flex items-center gap-4">
            <img
              src={boboLogo}
              alt="BoBoAI"
              className="h-16 w-16 rounded-2xl shadow-2xl"
              style={{ boxShadow: "0 0 40px rgba(139,92,246,0.7)" }}
            />
            <span
              className="text-5xl font-black text-white"
              style={{ textShadow: "0 0 40px rgba(139,92,246,0.9)" }}
            >
              BoBoAI
            </span>
          </div>
          <p className="text-2xl font-bold text-white leading-tight">
            Start for free.<br />
            <span className="text-violet-300">Upgrade anytime.</span>
          </p>
          <div className="space-y-3 w-full">
            {[
              { icon: "✨", text: "Free tier includes 50 messages/day" },
              { icon: "🧠", text: "Access to BoBoAI 3.5 Pro model" },
              { icon: "🎨", text: "5 image generations per day" },
              { icon: "🎙️", text: "Voice assistant included" },
              { icon: "🌐", text: "4 language support built-in" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-left">
                <span className="text-lg">{icon}</span>
                <p className="text-sm text-white/85">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-8 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <img src={boboLogo} alt="BoBoAI" className="h-9 w-9 rounded-xl" />
            <span className="text-2xl font-black gradient-brand-text">BoBoAI</span>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Create account</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Join BoBoAI for free — no credit card required
            </p>
          </div>

          {/* Social signup */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              onClick={() => handleSocialSignup("Google")}
              disabled={isLoading}
              className={cn(
                "flex items-center justify-center gap-2.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground",
                "transition-all duration-200 hover:bg-accent disabled:opacity-50"
              )}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              onClick={() => handleSocialSignup("GitHub")}
              disabled={isLoading}
              className={cn(
                "flex items-center justify-center gap-2.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground",
                "transition-all duration-200 hover:bg-accent disabled:opacity-50"
              )}
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
              </svg>
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or sign up with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Full name <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Jane Smith"
                  autoComplete="name"
                  className={cn(
                    "w-full rounded-xl border bg-muted/30 pl-10 pr-4 py-2.5 text-sm",
                    "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all",
                    errors.name ? "border-destructive" : "border-border"
                  )}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] text-destructive">⚠ {errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Email address <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={cn(
                    "w-full rounded-xl border bg-muted/30 pl-10 pr-4 py-2.5 text-sm",
                    "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all",
                    errors.email ? "border-destructive" : "border-border"
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-destructive">⚠ {errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  className={cn(
                    "w-full rounded-xl border bg-muted/30 pl-10 pr-10 py-2.5 text-sm",
                    "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all",
                    errors.password ? "border-destructive" : "border-border"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-destructive">⚠ {errors.password}</p>
              )}
              <PasswordStrength password={form.password} />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Confirm password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className={cn(
                    "w-full rounded-xl border bg-muted/30 pl-10 pr-10 py-2.5 text-sm",
                    "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all",
                    errors.confirmPassword ? "border-destructive" : "border-border",
                    form.confirmPassword && form.confirmPassword === form.password && "border-green-400/50"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-destructive">⚠ {errors.confirmPassword}</p>
              )}
              {form.confirmPassword && form.confirmPassword === form.password && (
                <p className="text-[11px] text-green-400 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Passwords match
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="space-y-1">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={form.terms}
                  onChange={(e) => handleChange("terms", e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border accent-primary cursor-pointer flex-shrink-0"
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                  I agree to BoBoAI's{" "}
                  <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>{" "}
                  and{" "}
                  <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
                </label>
              </div>
              {errors.terms && (
                <p className="text-[11px] text-destructive">⚠ {errors.terms}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20 mt-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create Free Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/sign-in" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>

          <p className="mt-6 text-center text-[11px] text-muted-foreground/60">
            BoBoAI 2026 · Secure · Private · No spam
          </p>
        </div>
      </div>
    </div>
  );
}
