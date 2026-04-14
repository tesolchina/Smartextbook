import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Loader2, CheckCircle, RefreshCw, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type Step = "choose" | "login" | "register" | "otp";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultStep?: "login" | "register";
}

export function AuthModal({ open, onClose, defaultStep = "login" }: AuthModalProps) {
  const { login, register, verifyOtp, resendOtp } = useAuth();

  const [step, setStep] = useState<Step>(defaultStep);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [otp, setOtp] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setStep(defaultStep);
      setEmail("");
      setPassword("");
      setDisplayName("");
      setOtp("");
      setError(null);
      setSuccess(null);
    }
  }, [open, defaultStep]);

  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpInputRef.current?.focus(), 100);
    }
  }, [step]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) {
      onClose();
    } else if (result.needsVerification) {
      setSuccess("A verification code has been sent to your email.");
      setStep("otp");
    } else {
      setError(result.error ?? "Login failed");
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await register(email, password, displayName);
    setLoading(false);
    if (result.ok) {
      setSuccess(
        result.emailSent
          ? `Verification code sent to ${email}. Please check your inbox.`
          : "Account created. Enter the verification code (check server logs if SMTP is not configured)."
      );
      setStep("otp");
    } else {
      setError(result.error ?? "Registration failed");
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) return;
    setError(null);
    setLoading(true);
    const result = await verifyOtp(email, otp);
    setLoading(false);
    if (result.ok) {
      onClose();
    } else {
      setError(result.error ?? "Invalid code");
      setOtp("");
    }
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setResendCooldown(60);
    await resendOtp(email);
    setSuccess("A new code has been sent.");
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md bg-card rounded-3xl border border-border shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  📖
                </div>
                <span className="font-serif font-bold text-lg">LessonBuilder</span>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab bar for login/register */}
            {(step === "login" || step === "register") && (
              <div className="flex gap-0 px-6 pt-5 pb-0">
                {(["login", "register"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStep(s); setError(null); }}
                    className={`flex-1 py-2.5 text-sm font-bold capitalize border-b-2 transition-colors ${
                      step === s
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s === "login" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>
            )}

            <div className="p-6 pt-5">
              {/* Error / Success */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="err"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                  >
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    key="suc"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-sm"
                  >
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* LOGIN */}
              {step === "login" && (
                <form onSubmit={(e) => { void handleLogin(e); }} className="space-y-4">
                  <Field label="Email" icon={<Mail className="w-4 h-4" />}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoFocus
                      className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                    />
                  </Field>
                  <Field label="Password" icon={<Lock className="w-4 h-4" />}>
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
                      required
                      className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="text-muted-foreground hover:text-foreground">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </Field>
                  <SubmitButton loading={loading}>Sign In</SubmitButton>
                  <p className="text-center text-xs text-muted-foreground">
                    No account?{" "}
                    <button type="button" onClick={() => { setStep("register"); setError(null); }} className="text-primary font-bold hover:underline">
                      Create one
                    </button>
                  </p>
                </form>
              )}

              {/* REGISTER */}
              {step === "register" && (
                <form onSubmit={(e) => { void handleRegister(e); }} className="space-y-4">
                  <Field label="Display Name" icon={<User className="w-4 h-4" />}>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Dr. Jane Smith"
                      required
                      autoFocus
                      minLength={2}
                      maxLength={60}
                      className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                    />
                  </Field>
                  <Field label="Email" icon={<Mail className="w-4 h-4" />}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                    />
                  </Field>
                  <Field label="Password" icon={<Lock className="w-4 h-4" />}>
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      required
                      minLength={8}
                      className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="text-muted-foreground hover:text-foreground">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </Field>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    A 6-digit verification code will be sent to your email. Your data stays private — passwords are hashed, API keys never leave your browser.
                  </p>
                  <SubmitButton loading={loading}>Create Account</SubmitButton>
                </form>
              )}

              {/* OTP VERIFY */}
              {step === "otp" && (
                <form onSubmit={(e) => { void handleVerifyOtp(e); }} className="space-y-5">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Mail className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Check your inbox</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter the 6-digit code sent to<br />
                      <span className="font-semibold text-foreground">{email}</span>
                    </p>
                  </div>

                  <div>
                    <input
                      ref={otpInputRef}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="000000"
                      className="w-full text-center text-3xl font-mono font-black tracking-[12px] py-4 rounded-2xl border-2 border-border focus:border-primary outline-none bg-secondary/30 text-foreground placeholder:text-muted-foreground/40 transition-colors"
                    />
                  </div>

                  <SubmitButton loading={loading} disabled={otp.length !== 6}>
                    {loading ? "Verifying..." : <><CheckCircle className="w-4 h-4" /> Verify Email</>}
                  </SubmitButton>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => { void handleResend(); }}
                      disabled={resendCooldown > 0}
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                    </button>
                    <span className="mx-2 text-muted-foreground/40">·</span>
                    <button
                      type="button"
                      onClick={() => { setStep("register"); setOtp(""); setError(null); setSuccess(null); }}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Wrong email?
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{label}</label>
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-border bg-secondary/20 focus-within:border-primary transition-colors">
        <span className="text-muted-foreground shrink-0">{icon}</span>
        {children}
      </div>
    </div>
  );
}

function SubmitButton({ loading, disabled, children }: { loading: boolean; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 disabled:opacity-60 transition-all active:scale-98"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </button>
  );
}
