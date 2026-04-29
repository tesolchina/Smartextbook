import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Plus, FileText, CheckCircle, XCircle, RefreshCw,
  Loader2, AlertTriangle, ChevronRight, LogIn, Edit, Send,
} from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { AuthModal } from "@/components/auth-modal";

type Submission = {
  id: number;
  title: string;
  status: string;
  topicArea: string | null;
  bloomsLevel: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  draft: {
    label: "Draft",
    icon: <FileText className="w-3.5 h-3.5" />,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  under_review: {
    label: "Under Review",
    icon: <RefreshCw className="w-3.5 h-3.5" />,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  approved: {
    label: "Published",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    color: "bg-green-100 text-green-800 border-green-200",
  },
  rejected: {
    label: "Rejected",
    icon: <XCircle className="w-3.5 h-3.5" />,
    color: "bg-red-100 text-red-800 border-red-200",
  },
};

type LoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; submissions: Submission[] }
  | { status: "error"; message: string };

export default function IeeeAuthor() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [loadState, setLoadState] = useState<LoadState>({ status: "idle" });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [resubmitting, setResubmitting] = useState<number | null>(null);

  const load = () => {
    setLoadState({ status: "loading" });
    fetch("/api/ieee/submissions", { credentials: "include" })
      .then((r) => r.json().then((d) => ({ ok: r.ok, data: d as { submissions?: Submission[]; error?: string } })))
      .then(({ ok, data }) => {
        if (!ok) {
          setLoadState({ status: "error", message: data.error ?? "Failed to load submissions." });
        } else {
          setLoadState({ status: "success", submissions: data.submissions ?? [] });
        }
      })
      .catch((err: unknown) => setLoadState({ status: "error", message: err instanceof Error ? err.message : "Network error" }));
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  const handleResubmit = async (id: number) => {
    setResubmitting(id);
    try {
      const res = await fetch(`/api/ieee/submissions/${id}/resubmit`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json() as { submission?: Submission; error?: string };
      if (res.ok && data.submission) {
        setLoadState((prev) => {
          if (prev.status !== "success") return prev;
          return {
            ...prev,
            submissions: prev.submissions.map((s) =>
              s.id === id ? { ...s, status: "under_review", adminNotes: null } : s
            ),
          };
        });
      }
    } catch {
      // resubmit failed silently; load() will show the real state
    } finally {
      setResubmitting(null);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <Layout>
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-3xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-serif font-bold">Author Dashboard</h1>
              <p className="text-muted-foreground">Manage your IEEE Teaching Case submissions.</p>
            </div>
            {user && (
              <Button asChild className="gap-2">
                <Link href="/ieee/author/new">
                  <Plus className="w-4 h-4" />New Submission
                </Link>
              </Button>
            )}
          </div>

          {authLoading && (
            <div className="flex justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />Checking session…
            </div>
          )}

          {!authLoading && !user && (
            <div className="bg-background border border-border rounded-2xl p-8 text-center">
              <LogIn className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="font-semibold text-lg mb-2">Sign in to view your submissions</h2>
              <p className="text-muted-foreground text-sm mb-6">
                You need an account to submit and manage IEEE Teaching Cases.
              </p>
              <Button onClick={() => setAuthModalOpen(true)} className="gap-2">
                <LogIn className="w-4 h-4" />Sign In
              </Button>
            </div>
          )}

          {!authLoading && user && (
            <>
              <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                <span>Showing submissions for <strong>{user.email}</strong></span>
                <button onClick={load} className="text-primary hover:underline">
                  Refresh
                </button>
              </div>

              {loadState.status === "loading" && (
                <div className="flex justify-center py-16 text-muted-foreground gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />Loading…
                </div>
              )}

              {loadState.status === "error" && (
                <div className="flex flex-col items-center py-12 gap-3">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                  <p className="text-destructive">{loadState.message}</p>
                </div>
              )}

              {loadState.status === "success" && loadState.submissions.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="font-medium">No submissions yet</p>
                  <p className="text-sm mt-1 mb-4">Start by submitting your first IEEE Teaching Case article.</p>
                  <Button asChild variant="outline">
                    <Link href="/ieee/author/new"><Plus className="w-4 h-4 mr-2" />New Submission</Link>
                  </Button>
                </div>
              )}

              {loadState.status === "success" && loadState.submissions.length > 0 && (
                <div className="space-y-3">
                  {loadState.submissions.map((s, i) => {
                    const statusCfg = STATUS_CONFIG[s.status] ?? STATUS_CONFIG.draft;
                    const isResubmitting = resubmitting === s.id;
                    return (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-background border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold leading-snug mb-2 line-clamp-2">{s.title}</h3>
                            <div className="flex flex-wrap gap-2 items-center mb-2">
                              <Badge
                                variant="outline"
                                className={`text-xs gap-1 ${statusCfg.color}`}
                              >
                                {statusCfg.icon}
                                {statusCfg.label}
                              </Badge>
                              {s.topicArea && (
                                <Badge variant="secondary" className="text-xs capitalize">
                                  {s.topicArea.replace(/-/g, " ")}
                                </Badge>
                              )}
                            </div>
                            {s.adminNotes && s.status === "rejected" && (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2 text-sm text-red-800">
                                <strong>Reviewer notes:</strong> {s.adminNotes}
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Submitted {formatDate(s.createdAt)} · Updated {formatDate(s.updatedAt)}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2 shrink-0">
                            {s.status === "approved" && (
                              <Button asChild size="sm" variant="outline" className="gap-1">
                                <Link href={`/ieee/lesson/${s.id}`}>
                                  View <ChevronRight className="w-3 h-3" />
                                </Link>
                              </Button>
                            )}
                            {s.status === "rejected" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1"
                                  onClick={() => navigate(`/ieee/author/edit/${s.id}`)}
                                >
                                  <Edit className="w-3.5 h-3.5" />Edit
                                </Button>
                                <Button
                                  size="sm"
                                  className="gap-1"
                                  disabled={isResubmitting}
                                  onClick={() => handleResubmit(s.id)}
                                >
                                  {isResubmitting
                                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    : <Send className="w-3.5 h-3.5" />}
                                  Resubmit
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
