import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Mail, Lock, User, Loader2, CheckCircle,
  RefreshCw, Eye, EyeOff, Smartphone, KeyRound, ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type Tab = "login" | "register";
type Step = "form" | "otp";
type LoginMode = "code" | "password";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: Tab;
}

export function AuthModal({ open, onClose, defaultTab = "login" }: AuthModalProps) {
  const { login, sendCode, register, verifyOtp, resendOtp } = useAuth();

  const [tab, setTab] = useState<Tab>(defaultTab);
  const [step, setStep] = useState<Step>("form");
  const [loginMode, setLoginMode] = useState<LoginMode>("code");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [optionalPass, setOptionalPass] = useState("");
  const [showOptionalPass, setShowOptionalPass] = useState(false);

  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [otpPurpose, setOtpPurpose] = useState<"verify" | "login">("verify");

  useEffect(() => {
    if (open) {
      setTab(defaultTab);
      setStep("form");
      setLoginMode("code");
      setEmail(""); setPassword(""); setDisplayName(""); setOptionalPass("");
      setOtpDigits(["", "", "", "", "", ""]);
      setError(null); setInfo(null); setCooldown(0);
    }
  }, [open, defaultTab]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (step === "otp") setTimeout(() => otpRefs.current[0]?.focus(), 120);
  }, [step]);

  const otp = otpDigits.join("");

  function handleOtpKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otpDigits[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  }

  function handleOtpChange(i: number, val: string) {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otpDigits];
    next[i] = digit;
    setOtpDigits(next);
    if (digit && i < 5) otpRefs.current[i + 1]?.focus();
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length) {
      const digits = text.padEnd(6, "").split("").slice(0, 6);
      setOtpDigits(digits);
      otpRefs.current[Math.min(text.length, 5)]?.focus();
    }
  }

  // ── Login with code (send OTP) ──
  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await sendCode(email);
    setLoading(false);
    if (result.notFound) {
      setError("No account found. Please create an account first.");
      return;
    }
    if (result.needsVerification) {
      setInfo("Your email isn't verified yet — a verification code has been sent.");
      setOtpPurpose("verify");
      setStep("otp");
      return;
    }
    if (!result.ok) {
      setError(result.error ?? "Failed to send code");
      return;
    }
    setOtpPurpose("login");
    setInfo(result.emailSent ? `Code sent to ${email}` : `Code: check server logs (SMTP not configured)`);
    setStep("otp");
  }

  // ── Login with password ──
  async function handleLoginPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) { onClose(); return; }
    if (result.useCode) {
      setError("No password set for this account. Use 'Email code' to sign in.");
      setLoginMode("code");
      return;
    }
    if (result.needsVerification) {
      setOtpPurpose("verify");
      setInfo("Please verify your email first. A code has been sent.");
      setStep("otp");
      return;
    }
    setError(result.error ?? "Login failed");
  }

  // ── Register ──
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await register(email, displayName, optionalPass || undefined);
    setLoading(false);
    if (!result.ok) { setError(result.error ?? "Registration failed"); return; }
    setOtpPurpose("verify");
    setInfo(result.emailSent
      ? `Verification code sent to ${email}`
      : "SMTP not configured — check server logs for the code");
    setStep("otp");
  }

  // ── Verify OTP ──
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) return;
    setError(null);
    setLoading(true);
    const result = await verifyOtp(email, otp);
    setLoading(false);
    if (result.ok) { onClose(); return; }
    setError(result.error ?? "Invalid code");
    setOtpDigits(["", "", "", "", "", ""]);
    otpRefs.current[0]?.focus();
  }

  async function handleResend() {
    if (cooldown > 0) return;
    setCooldown(60);
    const result = await resendOtp(email, otpPurpose);
    setInfo(result.emailSent ? `New code sent to ${email}` : "Code sent (check server logs)");
    setError(null);
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
            <div className="flex items-center justify-between px-6 pt-6">
              <div className="flex items-center gap-2">
                {step === "otp" && (
                  <button
                    onClick={() => { setStep("form"); setError(null); setInfo(null); setOtpDigits(["","","","","",""]); }}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors mr-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-base">📖</div>
                <span className="font-serif font-bold text-lg ml-1.5">SmartTextbook</span>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab bar (only on form step) */}
            {step === "form" && (
              <div className="flex gap-0 px-6 pt-4">
                {(["login", "register"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTab(t); setError(null); setInfo(null); }}
                    className={`flex-1 py-2.5 text-sm font-bold border-b-2 transition-colors ${
                      tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t === "login" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>
            )}

            <div className="p-6 pt-4">
              {/* Alerts */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div key="err" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="mb-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </motion.div>
                )}
                {info && !error && (
                  <motion.div key="info" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="mb-3 p-3 rounded-xl bg-primary/8 border border-primary/20 text-primary text-sm">
                    {info}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── OTP STEP ─────────────────────── */}
              {step === "otp" && (
                <form onSubmit={(e) => { void handleVerifyOtp(e); }} className="space-y-5">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Smartphone className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">
                      {otpPurpose === "login" ? "Enter your login code" : "Verify your email"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      6-digit code sent to<br />
                      <span className="font-semibold text-foreground">{email}</span>
                    </p>
                  </div>

                  {/* 6 individual digit inputs */}
                  <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                    {otpDigits.map((d, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKey(i, e)}
                        className={`w-11 h-14 text-center text-2xl font-black rounded-xl border-2 outline-none transition-all bg-secondary/30 text-foreground
                          ${d ? "border-primary bg-primary/5" : "border-border focus:border-primary"}`}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 disabled:opacity-60 transition-all"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4" /> Verify & Sign In</>}
                  </button>

                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <button type="button" onClick={() => { void handleResend(); }} disabled={cooldown > 0}
                      className="inline-flex items-center gap-1 hover:text-foreground disabled:opacity-50 transition-colors">
                      <RefreshCw className="w-3 h-3" />
                      {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                    </button>
                    <span className="text-border">|</span>
                    <span>Expires in 15 min</span>
                  </div>
                </form>
              )}

              {/* ── LOGIN FORM ───────────────────── */}
              {step === "form" && tab === "login" && (
                <div className="space-y-4">
                  {/* Mode toggle */}
                  <div className="flex rounded-xl border border-border overflow-hidden bg-secondary/20">
                    {([
                      { id: "code", label: "Email Code", icon: <Smartphone className="w-3.5 h-3.5" /> },
                      { id: "password", label: "Password", icon: <KeyRound className="w-3.5 h-3.5" /> },
                    ] as { id: LoginMode; label: string; icon: React.ReactNode }[]).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => { setLoginMode(m.id); setError(null); }}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold transition-colors ${
                          loginMode === m.id
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {m.icon} {m.label}
                      </button>
                    ))}
                  </div>

                  {/* Code login */}
                  {loginMode === "code" && (
                    <form onSubmit={(e) => { void handleSendCode(e); }} className="space-y-4">
                      <Field label="Email address" icon={<Mail className="w-4 h-4" />}>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com" required autoFocus
                          className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground" />
                      </Field>
                      <button type="submit" disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 disabled:opacity-60 transition-all">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Smartphone className="w-4 h-4" /> Send Me a Code</>}
                      </button>
                      <p className="text-center text-xs text-muted-foreground">
                        A 6-digit code will be sent to your inbox. No password needed.
                      </p>
                    </form>
                  )}

                  {/* Password login */}
                  {loginMode === "password" && (
                    <form onSubmit={(e) => { void handleLoginPassword(e); }} className="space-y-4">
                      <Field label="Email address" icon={<Mail className="w-4 h-4" />}>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com" required autoFocus
                          className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground" />
                      </Field>
                      <Field label="Password" icon={<Lock className="w-4 h-4" />}>
                        <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                          placeholder="Your password" required
                          className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground" />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="text-muted-foreground hover:text-foreground">
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </Field>
                      <button type="submit" disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 disabled:opacity-60 transition-all">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                      </button>
                    </form>
                  )}

                  <p className="text-center text-xs text-muted-foreground pt-1">
                    No account?{" "}
                    <button onClick={() => { setTab("register"); setError(null); }} className="text-primary font-bold hover:underline">
                      Create one
                    </button>
                  </p>
                </div>
              )}

              {/* ── REGISTER FORM ────────────────── */}
              {step === "form" && tab === "register" && (
                <form onSubmit={(e) => { void handleRegister(e); }} className="space-y-4">
                  <Field label="Your name" icon={<User className="w-4 h-4" />}>
                    <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Dr. Jane Smith" required minLength={2} maxLength={60} autoFocus
                      className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground" />
                  </Field>
                  <Field label="Email address" icon={<Mail className="w-4 h-4" />}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com" required
                      className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground" />
                  </Field>

                  {/* Optional password section */}
                  <div className="rounded-xl border border-dashed border-border p-3.5 space-y-2 bg-secondary/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" /> Password <span className="font-normal">(optional)</span>
                      </span>
                      {!showOptionalPass && (
                        <button type="button" onClick={() => setShowOptionalPass(true)}
                          className="text-[11px] text-primary font-bold hover:underline">
                          Add password
                        </button>
                      )}
                    </div>
                    {showOptionalPass && (
                      <div className="flex items-center gap-2">
                        <input
                          type={showPass ? "text" : "password"}
                          value={optionalPass}
                          onChange={(e) => setOptionalPass(e.target.value)}
                          placeholder="Min. 8 characters"
                          minLength={8}
                          className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground border-b border-border pb-0.5 focus:border-primary transition-colors"
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="text-muted-foreground hover:text-foreground shrink-0">
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    )}
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      You can always sign in with an email code — password is optional and can be added later.
                    </p>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 disabled:opacity-60 transition-all">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account & Send Code"}
                  </button>

                  <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                    Your password (if set) is hashed and never readable. API keys never leave your browser.
                  </p>
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
