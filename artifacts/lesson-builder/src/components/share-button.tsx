import { useState, useRef, useEffect } from "react";
import { Share2, Copy, Check, Loader2, X, Globe, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/use-settings";
import { useSettingsModal } from "@/hooks/use-settings-modal";
import { type StoredLesson } from "@/hooks/use-lessons-store";

interface ShareButtonProps {
  lesson: StoredLesson;
}

type CheckResult =
  | { passed: true; summary: string }
  | { passed: false; issues: string[]; summary: string };

type State =
  | { status: "idle" }
  | { status: "confirming" }
  | { status: "checking" }
  | { status: "checked"; result: CheckResult }
  | { status: "sharing" }
  | { status: "shared"; shareId: string; shareUrl: string; expiresAt: string }
  | { status: "error"; message: string };

export function ShareButton({ lesson }: ShareButtonProps) {
  const { toast } = useToast();
  const { isConfigured, getLlmConfig } = useSettings();
  const { openSettings } = useSettingsModal();
  const [state, setState] = useState<State>({ status: "idle" });
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const shareUrl = state.status === "shared" ? state.shareUrl : "";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setState((s) => (s.status === "idle" ? s : { status: "idle" }));
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const runAiCheck = async () => {
    setState({ status: "checking" });
    try {
      const llmConfig = getLlmConfig();
      const res = await fetch("/api/check-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson, llmConfig }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setState({ status: "checked", result: data as CheckResult });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "AI check failed";
      setState({ status: "error", message });
    }
  };

  const doShare = async () => {
    setState({ status: "sharing" });
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson }),
      });
      const data = await res.json() as { shareId: string; shareUrl: string; expiresAt: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setState({ status: "shared", shareId: data.shareId, shareUrl: data.shareUrl, expiresAt: data.expiresAt });
      // Auto-copy on success
      try {
        await navigator.clipboard.writeText(data.shareUrl);
        toast({ title: "Link copied!", description: "Share it with your students." });
      } catch {
        toast({ title: "Lesson published!", description: "Use the copy button to get the link.", variant: "default" });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to share lesson";
      setState({ status: "error", message });
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({ title: "Link copied!", description: "Share it with your students." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Copy failed", description: "Please copy the link manually.", variant: "destructive" });
    }
  };

  const formatExpiry = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  };

  const isOpen = state.status !== "idle";

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => {
          if (state.status === "idle") setState({ status: "confirming" });
          else setState({ status: "idle" });
        }}
        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
      >
        <Globe className="w-3.5 h-3.5" /> Share
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute top-full right-0 mt-2 z-50 w-84 bg-card border border-border rounded-2xl shadow-xl p-4"
          style={{ width: "21rem" }}
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Globe className="w-4 h-4 text-primary" />
              Share Lesson
            </div>
            <button
              onClick={() => setState({ status: "idle" })}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── CONFIRMING ── */}
          {state.status === "confirming" && (
            <>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                This will create a <strong className="text-foreground">public link</strong> — anyone with it can view this lesson and leave comments. The link expires in 90 days.
              </p>

              {isConfigured ? (
                <>
                  <button
                    onClick={runAiCheck}
                    className="w-full py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mb-2"
                  >
                    <ShieldCheck className="w-4 h-4" /> Check with AI, then Share
                  </button>
                  <button
                    onClick={doShare}
                    className="w-full py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Skip check & Publish now
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">
                      <button
                        onClick={() => { setState({ status: "idle" }); openSettings(); }}
                        className="font-semibold underline hover:no-underline"
                      >
                        Set an API key
                      </button>{" "}
                      to enable AI content verification before publishing.
                    </p>
                  </div>
                  <button
                    onClick={doShare}
                    className="w-full py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" /> Publish Without AI Check
                  </button>
                </>
              )}
            </>
          )}

          {/* ── CHECKING ── */}
          {state.status === "checking" && (
            <div className="flex flex-col items-center justify-center gap-2 py-6 text-muted-foreground text-sm">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="font-medium text-foreground">AI is reviewing your lesson…</p>
              <p className="text-xs text-center">Checking for accuracy, quiz correctness, and suitability for students.</p>
            </div>
          )}

          {/* ── CHECKED (pass) ── */}
          {state.status === "checked" && state.result.passed && (
            <>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50 border border-green-200 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-green-800 mb-0.5">Looks good!</p>
                  <p className="text-xs text-green-700 leading-relaxed">{state.result.summary}</p>
                </div>
              </div>
              <button
                onClick={doShare}
                className="w-full py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Globe className="w-4 h-4" /> Publish Lesson
              </button>
            </>
          )}

          {/* ── CHECKED (issues) ── */}
          {state.status === "checked" && !state.result.passed && (
            <>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <p className="text-xs font-bold text-amber-800">Issues found</p>
                </div>
                <p className="text-xs text-amber-700 mb-2 leading-relaxed">{state.result.summary}</p>
                <ul className="space-y-1">
                  {state.result.issues.map((issue, i) => (
                    <li key={i} className="text-xs text-amber-800 flex items-start gap-1.5">
                      <span className="mt-0.5 shrink-0">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-xs text-muted-foreground mb-2 text-center">
                You can fix the lesson or publish it as-is.
              </p>
              <button
                onClick={doShare}
                className="w-full py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-sm font-semibold hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" /> Publish Anyway
              </button>
            </>
          )}

          {/* ── SHARING ── */}
          {state.status === "sharing" && (
            <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating public link…
            </div>
          )}

          {/* ── SHARED ── */}
          {state.status === "shared" && (
            <>
              <p className="text-xs text-muted-foreground mb-2">
                Your lesson is now public. Share this link:
              </p>
              <div className="flex items-center gap-2 mb-3">
                <input
                  readOnly
                  value={shareUrl}
                  className="flex-1 text-xs border border-border rounded-lg px-2 py-1.5 bg-muted/40 text-foreground font-mono truncate outline-none"
                />
                <button
                  onClick={copyLink}
                  className="shrink-0 p-1.5 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
                  title="Copy link"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Expires {formatExpiry(state.expiresAt)}. Students can view it and leave comments.
              </p>
            </>
          )}

          {/* ── ERROR ── */}
          {state.status === "error" && (
            <>
              <div className="text-xs text-destructive p-3 rounded-xl bg-destructive/10 border border-destructive/20 mb-3">
                {state.message}
              </div>
              <button
                onClick={() => setState({ status: "confirming" })}
                className="w-full py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
