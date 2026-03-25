import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Lightbulb, ListTodo, ArrowLeft, Download, GitBranch } from "lucide-react";
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

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "summary", label: "Summary & Concepts", icon: <Lightbulb className="w-4 h-4" /> },
  { id: "quiz",    label: "Interactive Quiz",   icon: <ListTodo className="w-4 h-4" /> },
  { id: "mindmap", label: "Mind Map",           icon: <GitBranch className="w-4 h-4" /> },
  { id: "chapter", label: "Source Text",        icon: <FileText className="w-4 h-4" /> },
];

export default function LessonView() {
  const [match, params] = useRoute("/lessons/:id");
  const [activeTab, setActiveTab] = useState<Tab>("summary");
  const [exportOpen, setExportOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [mindmapDiagram, setMindmapDiagram] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const { getLesson } = useLessonsStore();
  const lesson = match ? getLesson(params.id) : undefined;

  useEffect(() => {
    setMindmapDiagram(null);
    setQuizResult(null);
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

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden h-[calc(100vh-64px)]">

        {/* ── Content pane ── */}
        <div className="flex-1 flex flex-col bg-background min-w-0">

          {/* Header + Tabs */}
          <div className="px-6 pt-5 pb-0 border-b border-border bg-card">
            <div className="flex items-start justify-between gap-2 mb-4">
              <h1
                className="text-2xl font-serif font-black text-foreground line-clamp-1 flex-1"
                title={lesson.title}
              >
                {lesson.title}
              </h1>
              <div className="flex items-center gap-1.5 shrink-0">
                {quizResult && (
                  <button
                    onClick={() => setReportOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/40 bg-primary/5 text-xs font-semibold text-primary hover:bg-primary/10 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" /> Learning Report
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
            </div>

            <nav className="flex gap-1">
              {TABS.map(({ id, label, icon }) => (
                <TabButton
                  key={id}
                  active={activeTab === id}
                  onClick={() => setActiveTab(id)}
                  icon={icon}
                  label={label}
                />
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
                  <div className="max-w-4xl mx-auto bg-card p-7 md:p-10 rounded-2xl border border-border shadow-sm">
                    <div className="font-serif text-base text-foreground leading-loose whitespace-pre-wrap">
                      {lesson.chapterText}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
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
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
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
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      )}
    </button>
  );
}
