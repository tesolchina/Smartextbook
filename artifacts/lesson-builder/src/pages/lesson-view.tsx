import { useState } from "react";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Lightbulb, ListTodo, ArrowLeft } from "lucide-react";
import { Layout } from "@/components/layout";
import { ChatSidebar } from "@/components/chat-sidebar";
import { QuizView } from "@/components/quiz-view";
import { LessonSummaryTab } from "@/components/lesson-summary-tab";
import { useLessonsStore } from "@/hooks/use-lessons-store";

type Tab = "summary" | "quiz" | "chapter";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "summary", label: "Summary & Concepts", icon: <Lightbulb className="w-4 h-4" /> },
  { id: "quiz",    label: "Interactive Quiz",   icon: <ListTodo className="w-4 h-4" /> },
  { id: "chapter", label: "Source Text",        icon: <FileText className="w-4 h-4" /> },
];

export default function LessonView() {
  const [match, params] = useRoute("/lessons/:id");
  const [activeTab, setActiveTab] = useState<Tab>("summary");

  const { getLesson } = useLessonsStore();
  const lesson = match ? getLesson(params.id) : undefined;

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
              href="/"
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
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden h-[calc(100vh-64px)]">

        {/* ── Content pane ── */}
        <div className="flex-1 flex flex-col bg-background min-w-0">

          {/* Header + Tabs */}
          <div className="px-6 pt-5 pb-0 border-b border-border bg-card">
            <h1
              className="text-2xl font-serif font-black text-foreground mb-4 line-clamp-1"
              title={lesson.title}
            >
              {lesson.title}
            </h1>

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
                    <QuizView questions={lesson.quizQuestions || []} />
                  </div>
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
