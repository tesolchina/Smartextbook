import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Loader2, AlertTriangle, CheckCircle, XCircle,
  Clock, FileText, RefreshCw, ChevronRight, Eye, ChevronDown,
  BookOpen, HelpCircle, Lightbulb, X,
} from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

type TeachingCaseSections = {
  abstract?: string;
  learningObjectives?: string;
  caseNarrative?: string;
  discussionQuestions?: string;
  appendices?: string;
  teachingNotes?: string;
};

type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type ReflectionActivity = {
  prompt: string;
  guidance?: string;
};

type LessonData = {
  summary?: string;
  bloomsObjectives?: Array<{ objective: string; level: string }>;
  keyConcepts?: Array<{ term: string; definition: string }>;
  quizQuestions?: QuizQuestion[];
  reflectionActivities?: ReflectionActivity[];
};

type Submission = {
  id: number;
  title: string;
  authorName: string;
  authorEmail: string;
  status: string;
  topicArea: string | null;
  bloomsLevel: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
  teachingCaseSections?: TeachingCaseSections;
  lessonData?: LessonData;
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  under_review: { label: "Under Review", color: "bg-blue-100 text-blue-800 border-blue-200" },
  approved: { label: "Published", color: "bg-green-100 text-green-800 border-green-200" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800 border-red-200" },
};

type LoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; submissions: Submission[] }
  | { status: "error"; message: string };

type ReviewState = { id: number; notes: string; saving: boolean; error?: string } | null;
type PreviewState = { id: number; loading: boolean; data: Submission | null; error: string | null } | null;

export default function IeeeAdmin() {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem("ieee:adminKey") ?? "");
  const [adminKeyInput, setAdminKeyInput] = useState("");
  const [loadState, setLoadState] = useState<LoadState>({ status: "idle" });
  const [reviewState, setReviewState] = useState<ReviewState>(null);
  const [previewState, setPreviewState] = useState<PreviewState>(null);
  const [statusFilter, setStatusFilter] = useState("under_review");

  const load = (key: string) => {
    setLoadState({ status: "loading" });
    fetch("/api/ieee/submissions", { headers: { "x-ieee-admin-key": key } })
      .then((r) => r.json().then((d) => ({ ok: r.ok, data: d as { submissions?: Submission[]; error?: string } })))
      .then(({ ok, data }) => {
        if (!ok) {
          setLoadState({ status: "error", message: data.error ?? "Invalid admin key or access denied." });
        } else {
          setLoadState({ status: "success", submissions: data.submissions ?? [] });
        }
      })
      .catch((err: unknown) => setLoadState({ status: "error", message: err instanceof Error ? err.message : "Network error" }));
  };

  useEffect(() => {
    if (adminKey) load(adminKey);
  }, []);

  const handleAdminKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const key = adminKeyInput.trim();
    if (!key) return;
    sessionStorage.setItem("ieee:adminKey", key);
    setAdminKey(key);
    load(key);
  };

  const openPreview = async (id: number) => {
    if (previewState?.id === id) {
      setPreviewState(null);
      return;
    }
    setPreviewState({ id, loading: true, data: null, error: null });
    try {
      const res = await fetch(`/api/ieee/submissions/${id}`, {
        headers: { "x-ieee-admin-key": adminKey },
      });
      const json = await res.json() as { submission?: Submission; error?: string };
      if (!res.ok) {
        setPreviewState({ id, loading: false, data: null, error: json.error ?? "Failed to load content" });
      } else {
        setPreviewState({ id, loading: false, data: json.submission ?? null, error: null });
      }
    } catch (err: unknown) {
      setPreviewState({ id, loading: false, data: null, error: err instanceof Error ? err.message : "Network error" });
    }
  };

  const updateStatus = async (id: number, newStatus: string, notes?: string) => {
    if (!adminKey) return;
    setReviewState((prev) => (prev?.id === id ? { ...prev, saving: true, error: undefined } : prev));
    try {
      const res = await fetch(`/api/ieee/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-ieee-admin-key": adminKey },
        body: JSON.stringify({ status: newStatus, adminNotes: notes ?? "" }),
      });
      const data = await res.json() as { error?: string };
      if (res.ok) {
        setLoadState((prev) => {
          if (prev.status !== "success") return prev;
          return {
            ...prev,
            submissions: prev.submissions.map((s) =>
              s.id === id ? { ...s, status: newStatus, adminNotes: notes ?? s.adminNotes } : s
            ),
          };
        });
        setReviewState(null);
        if (previewState?.id === id) setPreviewState(null);
      } else {
        setReviewState((prev) =>
          prev?.id === id ? { ...prev, saving: false, error: data.error ?? "Failed to update status" } : prev
        );
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error";
      setReviewState((prev) => (prev?.id === id ? { ...prev, saving: false, error: message } : prev));
    }
  };

  const filtered = loadState.status === "success"
    ? (statusFilter === "all" ? loadState.submissions : loadState.submissions.filter((s) => s.status === statusFilter))
    : [];

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-4xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold">Admin Review Queue</h1>
              <p className="text-muted-foreground">Review and approve IEEE Teaching Case submissions.</p>
            </div>
          </div>

          {!adminKey ? (
            <div className="bg-background border border-border rounded-2xl p-8 text-center max-w-md mx-auto">
              <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="font-semibold text-lg mb-2">Admin Access Required</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Enter the IEEE ProComm admin key to access the review queue.
              </p>
              <form onSubmit={handleAdminKeySubmit} className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Admin key"
                  value={adminKeyInput}
                  onChange={(e) => setAdminKeyInput(e.target.value)}
                  required
                />
                <Button type="submit">Access</Button>
              </form>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-6">
                {["all", "under_review", "draft", "approved", "rejected"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                      statusFilter === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {s === "all" ? "All" : STATUS_CONFIG[s]?.label ?? s}
                    {loadState.status === "success" && (
                      <span className="ml-1.5 opacity-70">
                        ({s === "all" ? loadState.submissions.length : loadState.submissions.filter((x) => x.status === s).length})
                      </span>
                    )}
                  </button>
                ))}
                <button
                  onClick={() => { sessionStorage.removeItem("ieee:adminKey"); setAdminKey(""); setLoadState({ status: "idle" }); }}
                  className="ml-auto px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign out
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

              {loadState.status === "success" && filtered.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No submissions in this category.</p>
                </div>
              )}

              {loadState.status === "success" && filtered.length > 0 && (
                <div className="space-y-4">
                  {filtered.map((s, i) => {
                    const statusCfg = STATUS_CONFIG[s.status] ?? STATUS_CONFIG.draft;
                    const isReviewing = reviewState?.id === s.id;
                    const isPreviewing = previewState?.id === s.id;
                    return (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-background border border-border rounded-2xl overflow-hidden"
                      >
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold leading-snug mb-1">{s.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {s.authorName} · {s.authorEmail}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className={`text-xs ${statusCfg.color}`}>
                                  {statusCfg.label}
                                </Badge>
                                {s.topicArea && (
                                  <Badge variant="secondary" className="text-xs capitalize">
                                    {s.topicArea.replace(/-/g, " ")}
                                  </Badge>
                                )}
                                {s.bloomsLevel && (
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {s.bloomsLevel}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                                onClick={() => openPreview(s.id)}
                              >
                                {isPreviewing ? (
                                  <><X className="w-3.5 h-3.5" />Hide</>
                                ) : (
                                  <><Eye className="w-3.5 h-3.5" />Preview</>
                                )}
                              </Button>
                              {s.status === "approved" && (
                                <Button asChild variant="outline" size="sm" className="gap-1">
                                  <Link href={`/ieee/lesson/${s.id}`}>
                                    <BookOpen className="w-3.5 h-3.5" />Open
                                  </Link>
                                </Button>
                              )}
                            </div>
                          </div>

                          {s.adminNotes && (
                            <div className="bg-muted/50 rounded-lg p-3 mb-3 text-sm">
                              <strong className="text-muted-foreground">Notes:</strong> {s.adminNotes}
                            </div>
                          )}

                          <p className="text-xs text-muted-foreground mb-3">
                            Submitted {formatDate(s.createdAt)} · Updated {formatDate(s.updatedAt)}
                          </p>

                          {isReviewing ? (
                            <div className="space-y-3 pt-3 border-t border-border">
                              <Textarea
                                placeholder="Reviewer notes (optional — will be shared with the author on rejection)"
                                value={reviewState.notes}
                                onChange={(e) => setReviewState((prev) => prev ? { ...prev, notes: e.target.value } : prev)}
                                className="min-h-[80px]"
                              />
                              {reviewState.error && (
                                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                                  <AlertTriangle className="w-4 h-4 shrink-0" />
                                  {reviewState.error}
                                </div>
                              )}
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="gap-2 bg-green-600 hover:bg-green-700"
                                  disabled={reviewState.saving}
                                  onClick={() => updateStatus(s.id, "approved", reviewState.notes)}
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />Approve & Publish
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="gap-2"
                                  disabled={reviewState.saving}
                                  onClick={() => updateStatus(s.id, "rejected", reviewState.notes)}
                                >
                                  <XCircle className="w-3.5 h-3.5" />Reject
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setReviewState(null)}
                                  disabled={reviewState.saving}
                                >
                                  Cancel
                                </Button>
                                {reviewState.saving && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground self-center" />}
                              </div>
                            </div>
                          ) : (
                            s.status === "under_review" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => setReviewState({ id: s.id, notes: s.adminNotes ?? "", saving: false })}
                              >
                                <RefreshCw className="w-3.5 h-3.5" />Review
                              </Button>
                            )
                          )}
                        </div>

                        {/* Content Preview Panel */}
                        <AnimatePresence>
                          {isPreviewing && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden border-t border-border"
                            >
                              <div className="p-5 bg-muted/20">
                                {previewState?.loading && (
                                  <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
                                    <Loader2 className="w-4 h-4 animate-spin" />Loading lesson content…
                                  </div>
                                )}
                                {previewState?.error && (
                                  <p className="text-destructive text-sm">{previewState.error}</p>
                                )}
                                {previewState?.data && (
                                  <SubmissionContentPreview submission={previewState.data} />
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
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

function SectionBlock({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 w-full text-left font-semibold text-sm mb-2 text-foreground"
      >
        {icon}
        {title}
        <ChevronDown className={`w-3.5 h-3.5 ml-auto transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pl-1">{children}</div>}
    </div>
  );
}

function SubmissionContentPreview({ submission }: { submission: Submission }) {
  const tc = submission.teachingCaseSections ?? {};
  const ld = submission.lessonData ?? {};

  const hasTc = Object.values(tc).some((v) => v && String(v).trim().length > 0);
  const hasLd = ld.summary || (Array.isArray(ld.quizQuestions) && ld.quizQuestions.length > 0);

  if (!hasTc && !hasLd) {
    return (
      <p className="text-muted-foreground text-sm italic">No lesson content has been generated for this submission yet.</p>
    );
  }

  return (
    <div className="space-y-2 text-sm max-h-[600px] overflow-y-auto pr-1">
      {hasTc && (
        <>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Teaching Case Sections</p>
          {tc.abstract && (
            <SectionBlock title="Abstract" icon={<FileText className="w-3.5 h-3.5" />}>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{tc.abstract}</p>
            </SectionBlock>
          )}
          {tc.learningObjectives && (
            <SectionBlock title="Learning Objectives" icon={<CheckCircle className="w-3.5 h-3.5 text-green-600" />}>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{tc.learningObjectives}</p>
            </SectionBlock>
          )}
          {tc.caseNarrative && (
            <SectionBlock title="Case Narrative" icon={<BookOpen className="w-3.5 h-3.5" />}>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed line-clamp-12">{tc.caseNarrative}</p>
            </SectionBlock>
          )}
          {tc.discussionQuestions && (
            <SectionBlock title="Discussion Questions" icon={<HelpCircle className="w-3.5 h-3.5" />}>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{tc.discussionQuestions}</p>
            </SectionBlock>
          )}
          {tc.teachingNotes && (
            <SectionBlock title="Teaching Notes" icon={<Lightbulb className="w-3.5 h-3.5 text-yellow-500" />}>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{tc.teachingNotes}</p>
            </SectionBlock>
          )}
        </>
      )}

      {hasLd && (
        <>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-4 mb-3">Generated Lesson</p>
          {ld.summary && (
            <SectionBlock title="Lesson Summary" icon={<FileText className="w-3.5 h-3.5" />}>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{ld.summary}</p>
            </SectionBlock>
          )}
          {Array.isArray(ld.bloomsObjectives) && ld.bloomsObjectives.length > 0 && (
            <SectionBlock title={`Learning Objectives (${ld.bloomsObjectives.length})`} icon={<CheckCircle className="w-3.5 h-3.5 text-green-600" />}>
              <ul className="space-y-1">
                {ld.bloomsObjectives.map((o, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <Badge variant="outline" className="text-xs capitalize shrink-0 mt-0.5">{o.level}</Badge>
                    {o.objective}
                  </li>
                ))}
              </ul>
            </SectionBlock>
          )}
          {Array.isArray(ld.quizQuestions) && ld.quizQuestions.length > 0 && (
            <SectionBlock title={`Quiz Questions (${ld.quizQuestions.length})`} icon={<HelpCircle className="w-3.5 h-3.5" />}>
              <div className="space-y-3">
                {ld.quizQuestions.map((q, i) => (
                  <div key={i} className="border border-border rounded-lg p-3 bg-background">
                    <p className="font-medium mb-2">{i + 1}. {q.question}</p>
                    <ul className="space-y-1">
                      {q.options.map((opt, oi) => (
                        <li key={oi} className={`text-xs px-2 py-1 rounded ${oi === q.correctIndex ? "bg-green-50 text-green-700 font-medium" : "text-muted-foreground"}`}>
                          {String.fromCharCode(65 + oi)}. {opt}
                          {oi === q.correctIndex && " ✓"}
                        </li>
                      ))}
                    </ul>
                    {q.explanation && (
                      <p className="text-xs text-muted-foreground mt-2 italic">{q.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            </SectionBlock>
          )}
          {Array.isArray(ld.reflectionActivities) && ld.reflectionActivities.length > 0 && (
            <SectionBlock title={`Reflection Activities (${ld.reflectionActivities.length})`} icon={<Lightbulb className="w-3.5 h-3.5 text-yellow-500" />}>
              <div className="space-y-2">
                {ld.reflectionActivities.map((r, i) => (
                  <div key={i} className="border border-border rounded-lg p-3 bg-background">
                    <p className="font-medium mb-1">{r.prompt}</p>
                    {r.guidance && <p className="text-xs text-muted-foreground italic">{r.guidance}</p>}
                  </div>
                ))}
              </div>
            </SectionBlock>
          )}
        </>
      )}
    </div>
  );
}
