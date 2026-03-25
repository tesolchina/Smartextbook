import { useState, useRef, useEffect } from "react";
import { Share2, Copy, Check, Loader2, X, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type StoredLesson } from "@/hooks/use-lessons-store";

interface ShareButtonProps {
  lesson: StoredLesson;
}

type State =
  | { status: "idle" }
  | { status: "confirming" }
  | { status: "sharing" }
  | { status: "shared"; shareId: string; expiresAt: string }
  | { status: "error"; message: string };

export function ShareButton({ lesson }: ShareButtonProps) {
  const { toast } = useToast();
  const [state, setState] = useState<State>({ status: "idle" });
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const shareUrl =
    state.status === "shared"
      ? `${window.location.origin}/shared/${state.shareId}`
      : "";

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

  const handleShare = async () => {
    setState({ status: "sharing" });
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setState({ status: "shared", shareId: data.shareId, expiresAt: data.expiresAt });
    } catch (err: any) {
      setState({ status: "error", message: err.message || "Failed to share lesson" });
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

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => {
          if (state.status === "idle") setState({ status: "confirming" });
          else if (state.status === "confirming") setState({ status: "idle" });
        }}
        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
      >
        <Globe className="w-3.5 h-3.5" /> Share
      </button>

      {(state.status === "confirming" || state.status === "sharing" || state.status === "shared" || state.status === "error") && (
        <div
          ref={popoverRef}
          className="absolute top-full right-0 mt-2 z-50 w-80 bg-card border border-border rounded-2xl shadow-xl p-4"
        >
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

          {state.status === "confirming" && (
            <>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                This will create a <strong className="text-foreground">public link</strong> — anyone with it can view this lesson. 
                The link expires in 90 days.
              </p>
              <button
                onClick={handleShare}
                className="w-full py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" /> Make Public & Get Link
              </button>
            </>
          )}

          {state.status === "sharing" && (
            <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating public link…
            </div>
          )}

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

          {state.status === "error" && (
            <div className="text-xs text-destructive mb-3">{state.message}</div>
          )}
        </div>
      )}
    </div>
  );
}
