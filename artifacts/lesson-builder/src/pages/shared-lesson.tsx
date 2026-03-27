import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Lightbulb, ListTodo, ArrowLeft, Globe, GitBranch, Loader2, AlertTriangle, FileText as ReportIcon } from "lucide-react";
import { Layout } from "@/components/layout";
import { ChatSidebar } from "@/components/chat-sidebar";
import { QuizView, type QuizResult } from "@/components/quiz-view";
import { LessonSummaryTab } from "@/components/lesson-summary-tab";
import { MindMapTab } from "@/components/mind-map-tab";
import { CommentsSection } from "@/components/comments-section";
import { LearningReportModal } from "@/components/learning-report-modal";
import { type StoredLesson } from "@/hooks/use-lessons-store";

type Tab = "summary" | "quiz" | "mindmap" | "chapter";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "summary", label: "Summary & Concepts", icon: <Lightbulb className="w-4 h-4" /> },
  { id: "quiz",    label: "Interactive Quiz",   icon: <ListTodo className="w-4 h-4" /> },
  { id: "mindmap", label: "Mind Map",           icon: <GitBranch className="w-4 h-4" /> },
  { id: "chapter", label: "Source Text",        icon: <FileText className="w-4 h-4" /> },
];

type LoadState =
  | { status: "loading" }
  | { status: "success"; lesson: StoredLesson; expiresAt: string }
  | { status: "error"; message: string };

export default function SharedLesson() {
  const [match, params] = useRoute("/shared/:id");
  const shareId = match ? params.id : null;

  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [activeTab, setActiveTab] = useState<Tab>("summary");
  const [mindmapDiagram, setMindmapDiagram] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    if (!shareId) return;
    fetch(`/api/shared/${shareId}`)
      .then((r) => r.json().then((d) => ({ ok: r.ok, data: d })))
      .then(({ ok, data }) => {
        if (!ok) {
          setLoadState({ status: "error", message: data.error || "Failed to load lesson." });
        } else {
          setLoadState({ status: "success", lesson: data.lesson as StoredLesson, expiresAt: data.expiresAt });
        }
      })
      .catch((err) => setLoadState({ status: "error", message: err.message || "Network error" }));
  }, [shareId]);

  const formatExpiry = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  if (loadState.status === "loading") {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm">Loading shared lesson…</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (loadState.status === "error") {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-destructive/10 text-destructive p-8 rounded-2xl max-w-sm text-center border border-destructive/20">
            <AlertTriangle className="w-8 h-8 mx-auto mb-4 opacity-70" />
            <h2 className="text-xl font-bold mb-2">Lesson Not Found</h2>
            <p className="text-sm mb-5 opacity-80">{loadState.message}</p>
            <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive text-white text-sm font-bold hover:bg-destructive/90 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Go to SmartTextbook
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const { lesson, expiresAt } = loadState;

  return (
    <Layout>
      {reportOpen && quizResult && (
        <LearningReportModal
          lesson={lesson}
          quizResult={quizResult}
          shareId={shareId}
          open={reportOpen}
          onClose={() => setReportOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden h-[calc(100vh-64px)]">
        {/* ── Content pane ── */}
        <div className="flex-1 flex flex-col bg-background min-w-0 overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-5 pb-0 border-b border-border bg-card">
            <div className="flex items-start justify-between gap-3 mb-1">
              <h1 className="text-2xl font-serif font-black text-foreground line-clamp-1 flex-1" title={lesson.title}>
                {lesson.title}
              </h1>
              {quizResult && (
                <button
                  onClick={() => setReportOpen(true)}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/40 bg-primary/5 text-xs font-semibold text-primary hover:bg-primary/10 transition-all"
                >
                  <ReportIcon className="w-3.5 h-3.5" /> Learning Report
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              Shared lesson · Expires {formatExpiry(expiresAt)}
              {quizResult && (
                <span className="ml-2 text-primary font-medium">
                  · Quiz complete: {quizResult.score}/{quizResult.total}
                </span>
              )}
            </p>

            <nav className="flex gap-1">
              {TABS.map(({ id, label, icon }) => (
                <TabButton key={id} active={activeTab === id} onClick={() => setActiveTab(id)} icon={icon} label={label} />
              ))}
            </nav>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-5 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                {activeTab === "summary" && <LessonSummaryTab lesson={lesson} />}

                {activeTab === "quiz" && (
                  <div className="max-w-4xl mx-auto">
                    <QuizView
                      questions={lesson.quizQuestions || []}
                      onComplete={(result) => {
                        setQuizResult(result);
                        if (shareId) {
                          const pct = Math.round((result.score / result.total) * 100);
                          localStorage.setItem("lessonbuilder:quiz-result", JSON.stringify({ lessonId: shareId, score: pct }));
                        }
                      }}
                    />
                    {quizResult && (
                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={() => setReportOpen(true)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow"
                        >
                          <ReportIcon className="w-4 h-4" /> Generate Learning Report
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "mindmap" && (
                  <MindMapTab lesson={lesson} diagram={mindmapDiagram} onDiagramReady={setMindmapDiagram} />
                )}

                {activeTab === "chapter" && (
                  <div className="max-w-4xl mx-auto bg-card p-7 md:p-10 rounded-2xl border border-border shadow-sm">
                    <div className="font-serif text-base text-foreground leading-loose whitespace-pre-wrap">
                      {lesson.chapterText}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Comments — always visible below tabs */}
            {shareId && (
              <div className="max-w-4xl mx-auto">
                <CommentsSection shareId={shareId} />
              </div>
            )}
          </div>
        </div>

        {/* ── Chat sidebar ── */}
        <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 border-t lg:border-t-0 lg:border-l border-border h-[48vh] lg:h-full">
          <ChatSidebar lesson={lesson} />
        </div>
      </div>
    </Layout>
  );
}

function TabButton({
  active, onClick, icon, label,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold transition-colors outline-none rounded-t-lg ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      {active && (
        <motion.div
          layoutId="sharedActiveTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      )}
    </button>
  );
}
