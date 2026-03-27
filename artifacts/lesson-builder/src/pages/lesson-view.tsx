import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Lightbulb, ListTodo, ArrowLeft, Download, GitBranch, MessageSquare, X } from "lucide-react";
import { Layout } from "@/components/layout";
import { ChatSidebar } from "@/components/chat-sidebar";
import { QuizView } from "@/components/quiz-view";
import { LessonSummaryTab } from "@/components/lesson-summary-tab";
import { MindMapTab } from "@/components/mind-map-tab";
import { ExportModal } from "@/components/export-modal";
import { ShareButton } from "@/components/share-button";
import { LearningReportModal } from "@/components/learning-report-modal";
import { useLessonsStore } from "@/hooks/use-lessons-store";
import type { QuizResult } from "@/components/quiz-view";

type Tab = "summary" | "quiz" | "chapter" | "mindmap";

const TABS: { id: Tab; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  { id: "summary", label: "Summary & Concepts", shortLabel: "Summary", icon: <Lightbulb className="w-4 h-4" /> },
  { id: "quiz",    label: "Interactive Quiz",   shortLabel: "Quiz",    icon: <ListTodo className="w-4 h-4" /> },
  { id: "mindmap", label: "Mind Map",           shortLabel: "Map",     icon: <GitBranch className="w-4 h-4" /> },
  { id: "chapter", label: "Source Text",        shortLabel: "Source",  icon: <FileText className="w-4 h-4" /> },
];

export default function LessonView() {
  const [match, params] = useRoute("/lessons/:id");
  const [activeTab, setActiveTab] = useState<Tab>("summary");
  const [exportOpen, setExportOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [mindmapDiagram, setMindmapDiagram] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const { getLesson } = useLessonsStore();
  const lesson = match ? getLesson(params.id) : undefined;

  useEffect(() => {
    setMindmapDiagram(null);
    setQuizResult(null);
    setChatOpen(false);
  }, [params?.id]);

  if (!lesson) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-destructive/10 text-destructive p-8 rounded-2xl max-w-sm text-center border border-destructive/20">
            <h2 className="text-xl font-bold mb-2">Lesson not found</h2>
            <p className="text-sm mb-5 opacity-80">
              This lesson may have been cleared from browser storage, or the link is invalid.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive text-white text-sm font-bold hover:bg-destructive/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {lesson && (
        <ExportModal lesson={lesson} open={exportOpen} onClose={() => setExportOpen(false)} />
      )}
      {reportOpen && quizResult && (
        <LearningReportModal
          lesson={lesson}
          quizResult={quizResult}
          open={reportOpen}
          onClose={() => setReportOpen(false)}
        />
      )}

      {/* Mobile chat drawer */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setChatOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="absolute bottom-0 left-0 right-0 h-[75vh] bg-background rounded-t-2xl border-t border-border flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                <span className="font-semibold text-sm">AI Chat</span>
                <button
                  onClick={() => setChatOpen(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatSidebar lesson={lesson} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden" style={{ height: "calc(100vh - 56px)" }}>

        {/* ── Content pane ── */}
        <div className="flex-1 flex flex-col bg-background min-w-0 overflow-hidden">

          {/* Header */}
          <div className="px-4 md:px-6 pt-4 pb-0 border-b border-border bg-card">
            {/* Top row: back + title + actions */}
            <div className="flex items-center gap-2 mb-3">
              <Link
                href="/app"
                className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Back to library"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <h1
                className="text-base md:text-xl font-serif font-black text-foreground flex-1 min-w-0 truncate"
                title={lesson.title}
              >
                {lesson.title}
              </h1>

              {/* Desktop actions */}
              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                {quizResult && (
                  <button
                    onClick={() => setReportOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/40 bg-primary/5 text-xs font-semibold text-primary hover:bg-primary/10 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" /> Report
                  </button>
                )}
                <ShareButton lesson={lesson} />
                <button
                  onClick={() => setExportOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
              </div>

              {/* Mobile actions: icon row */}
              <div className="flex sm:hidden items-center gap-0.5 shrink-0">
                <ShareButton lesson={lesson} />
                <button
                  onClick={() => setExportOpen(true)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  aria-label="Export"
                >
                  <Download className="w-4 h-4" />
                </button>
                {quizResult && (
                  <button
                    onClick={() => setReportOpen(true)}
                    className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                    aria-label="Learning Report"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <nav className="flex gap-0.5 overflow-x-auto scrollbar-none -mx-1 px-1">
              {TABS.map(({ id, label, shortLabel, icon }) => (
                <TabButton
                  key={id}
                  active={activeTab === id}
                  onClick={() => setActiveTab(id)}
                  icon={icon}
                  label={label}
                  shortLabel={shortLabel}
                />
              ))}
            </nav>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
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
                      onComplete={(result) => setQuizResult(result)}
                    />
                  </div>
                )}

                {activeTab === "mindmap" && (
                  <MindMapTab
                    lesson={lesson}
                    diagram={mindmapDiagram}
                    onDiagramReady={setMindmapDiagram}
                  />
                )}

                {activeTab === "chapter" && (
                  <div className="max-w-4xl mx-auto bg-card p-5 md:p-10 rounded-2xl border border-border shadow-sm">
                    <div className="font-serif text-sm md:text-base text-foreground leading-loose whitespace-pre-wrap">
                      {lesson.chapterText}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile floating chat button */}
          <div className="lg:hidden fixed bottom-5 right-5 z-30">
            <button
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 text-sm font-bold hover:bg-primary/90 active:scale-95 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>

        {/* ── Desktop chat sidebar ── */}
        <div className="hidden lg:flex w-[380px] xl:w-[420px] shrink-0 border-l border-border flex-col">
          <ChatSidebar lesson={lesson} />
        </div>
      </div>
    </Layout>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  shortLabel,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  shortLabel: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-semibold transition-colors outline-none rounded-t-lg whitespace-nowrap shrink-0 ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      <span className="sm:hidden">{shortLabel}</span>
      <span className="hidden sm:inline">{label}</span>
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      )}
    </button>
  );
}
