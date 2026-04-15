import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Library, KeyRound, BookOpen, Upload, Share2, Download, Info } from "lucide-react";
import { Layout } from "@/components/layout";
import { CreateLessonForm } from "@/components/create-lesson-form";
import { LessonCard } from "@/components/lesson-card";
import { useLessonsStore } from "@/hooks/use-lessons-store";
import { useSettings } from "@/hooks/use-settings";
import { useSettingsModal } from "@/hooks/use-settings-modal";

export default function Home() {
  const { lessons, deleteLesson, importLesson } = useLessonsStore();
  const { isConfigured } = useSettings();
  const { openSettings } = useSettingsModal();
  const [_, setLocation] = useLocation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const handleCreateClick = () => {
    if (!isConfigured) {
      openSettings();
      return;
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => setIsFormOpen(false);

  const handleImportClick = () => {
    setImportError(null);
    importInputRef.current?.click();
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    try {
      const { lesson } = await importLesson(file);
      setLocation(`/lessons/${lesson.id}`);
    } catch (err: any) {
      setImportError(err?.message ?? "Could not import lesson file.");
    }
  };

  return (
    <Layout>
      {/* ── Create Lesson Modal ── */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 pt-16 overflow-y-auto"
            onClick={(e) => { if (e.target === e.currentTarget) handleCloseForm(); }}
          >
            <motion.div
              key="modal-content"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.22 }}
              className="w-full max-w-3xl"
            >
              <CreateLessonForm onClose={handleCloseForm} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-28 overflow-hidden border-b border-border bg-card shrink-0">
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

            <h1 className="text-4xl sm:text-5xl md:text-[68px] font-serif font-black text-foreground mb-5 leading-[1.08] tracking-tight">
              Any chapter.<br />
              <span className="text-primary italic">Any subject. Learned.</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
              Paste a chapter or drop a URL — SmartTextbook generates a concise summary, a glossary of key concepts, an interactive quiz, and a Mind Map. Share lessons publicly, collect student comments, and generate AI-powered Learning Reports.
            </p>

            {!isConfigured && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-center gap-3 px-5 py-3 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-sm font-semibold max-w-sm mx-auto"
              >
                <KeyRound className="w-4 h-4 shrink-0" />
                <span>No API key set.{" "}
                  <button
                    onClick={openSettings}
                    className="underline underline-offset-2 hover:opacity-80 transition-opacity"
                  >
                    Add your key
                  </button>{" "}
                  to create lessons.
                </span>
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleCreateClick}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-foreground text-background font-bold text-base hover:bg-foreground/90 shadow-xl shadow-foreground/10 hover:-translate-y-1 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" /> Create New Lesson
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── Hidden import input ── */}
      <input
        ref={importInputRef}
        type="file"
        accept=".json,.lesson.json"
        className="hidden"
        onChange={handleImportFile}
      />

      {/* ── Library ── */}
      <section className="py-16 bg-background flex-1">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
            <h2 className="text-2xl font-serif font-bold flex items-center gap-2.5 text-foreground">
              <Library className="w-6 h-6 text-muted-foreground" /> Your Library
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground hidden md:block mr-1 flex items-center gap-1 group relative cursor-default">
                <Info className="w-3 h-3 shrink-0" />
                Saved in this browser
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 px-3 py-2 rounded-xl bg-foreground text-background text-[11px] leading-snug font-normal opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50 text-left">
                  Lessons are stored in your browser. To access across devices: use <strong>Share</strong> to create a permanent cloud link, or <strong>Export JSON</strong> to download a backup file.
                </span>
              </span>
              <button
                onClick={handleImportClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" /> Import
              </button>
              <Link
                href="/create-course"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" /> Create Course
              </Link>
              <button
                onClick={handleCreateClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> New Lesson
              </button>
            </div>
          </div>

          {importError && (
            <div className="mb-5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-2.5">
              <span className="text-destructive text-sm">{importError}</span>
              <button onClick={() => setImportError(null)} className="ml-auto text-xs text-muted-foreground hover:text-foreground">Dismiss</button>
            </div>
          )}

          {lessons.length === 0 ? (
            <EmptyLibrary onCreateClick={handleCreateClick} />
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
  const { isConfigured, settings } = useSettings();
  const { openSettings } = useSettingsModal();

  return (
    <div className="bg-card rounded-2xl border border-border border-dashed overflow-hidden">
      {/* Step hints */}
      <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
        {[
          {
            num: "01",
            icon: <KeyRound className="w-5 h-5" />,
            title: "Set your API key",
            desc: "SmartTextbook is BYOK — bring a key from Google Gemini (free), DeepSeek, OpenRouter, OpenAI, Kimi, or Grok.",
            action: isConfigured ? null : (
              <button onClick={openSettings} className="mt-3 text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">
                Set API key →
              </button>
            ),
            done: isConfigured,
          },
          {
            num: "02",
            icon: <Plus className="w-5 h-5" />,
            title: "Generate a lesson",
            desc: "Paste any textbook chapter or URL. One teaching instruction is all you need — AI handles the rest.",
            action: (
              <button onClick={onCreateClick} className="mt-3 text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">
                Create first lesson →
              </button>
            ),
            done: false,
          },
          {
            num: "03",
            icon: <Share2 className="w-5 h-5" />,
            title: "Share with students",
            desc: "Hit Share to create a cloud-stored public link. Students can read, quiz, and comment — from any device.",
            action: null,
            done: false,
          },
        ].map((step) => (
          <div key={step.num} className="p-6 relative">
            <div className="absolute top-4 right-5 font-serif text-4xl font-black text-primary/7 leading-none select-none">{step.num}</div>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${step.done ? "bg-green-500/15 text-green-600" : "bg-primary/10 text-primary"}`}>
              {step.icon}
            </div>
            <h4 className="font-bold text-sm mb-1 flex items-center gap-1.5">
              {step.title}
              {step.done && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-500/15 text-green-600">Done</span>}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
            {step.action}
          </div>
        ))}
      </div>

      {/* Main empty CTA */}
      <div className="text-center py-12 border-t border-border px-4">
        <img
          src={`${import.meta.env.BASE_URL}images/empty-lessons.png`}
          alt="No lessons yet"
          className="w-28 h-28 mx-auto mb-4 object-contain opacity-60"
        />
        <h3 className="text-lg font-serif font-bold mb-1">Your library is empty</h3>
        <p className="text-xs text-muted-foreground mb-5 max-w-xs mx-auto">
          {isConfigured
            ? `Using ${settings.provider} · ${settings.model}. Ready to generate your first lesson.`
            : "Set an API key above, then create your first lesson."}
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={onCreateClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create a Lesson
          </button>
          <Link href="/about#how-to-start"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
          >
            <Info className="w-3.5 h-3.5" /> How to Start
          </Link>
        </div>
      </div>
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
