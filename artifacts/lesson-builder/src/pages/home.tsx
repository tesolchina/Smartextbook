import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Library } from "lucide-react";
import { Layout } from "@/components/layout";
import { CreateLessonForm } from "@/components/create-lesson-form";
import { LessonCard } from "@/components/lesson-card";
import { useLessonsStore } from "@/hooks/use-lessons-store";

export default function Home() {
  const { lessons, deleteLesson } = useLessonsStore();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="relative pt-24 pb-28 overflow-hidden border-b border-border bg-card">
        <div className="absolute inset-0 z-0 opacity-35 pointer-events-none">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-card z-0 pointer-events-none" />

        <div className="container max-w-3xl mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-7">
              <SparklesIcon className="w-3.5 h-3.5" /> AI-Powered Learning
            </span>

            <h1 className="text-5xl md:text-[68px] font-serif font-black text-foreground mb-5 leading-[1.08] tracking-tight">
              Any chapter.<br />
              <span className="text-primary italic">Any subject. Learned.</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
              Paste a chapter or drop a URL — LessonBuilder generates a concise summary, a glossary of key concepts, and an interactive quiz. Then your personal AI tutor stays on hand to answer every question.
            </p>

            <AnimatePresence mode="wait">
              {!isFormOpen ? (
                <motion.button
                  key="cta"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  onClick={() => setIsFormOpen(true)}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-foreground text-background font-bold text-base hover:bg-foreground/90 shadow-xl shadow-foreground/10 hover:-translate-y-1 transition-all active:scale-95"
                >
                  <Plus className="w-5 h-5" /> Create a Lesson
                </motion.button>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25 }}
                >
                  <CreateLessonForm onClose={() => setIsFormOpen(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── Library ── */}
      <section className="py-16 bg-background flex-1">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold flex items-center gap-2.5 text-foreground">
              <Library className="w-6 h-6 text-muted-foreground" /> Your Library
            </h2>
            <span className="text-xs text-muted-foreground hidden md:block">
              Saved in this browser only
            </span>
          </div>

          {lessons.length === 0 ? (
            <EmptyLibrary onCreateClick={() => setIsFormOpen(true)} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} onDelete={deleteLesson} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

function EmptyLibrary({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="text-center py-20 bg-card rounded-2xl border border-border border-dashed">
      <img
        src={`${import.meta.env.BASE_URL}images/empty-lessons.png`}
        alt="No lessons yet"
        className="w-36 h-36 mx-auto mb-5 object-contain opacity-70"
      />
      <h3 className="text-xl font-serif font-bold mb-1.5">No lessons yet</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
        Create your first lesson from any textbook chapter, article, or web page.
      </p>
      <button
        onClick={onCreateClick}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
      >
        <Plus className="w-4 h-4" /> Create a Lesson
      </button>
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}
