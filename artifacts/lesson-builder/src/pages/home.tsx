import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { BookOpen, Plus, Loader2, Library, ChevronRight, Trash2, AlertCircle, Link2, FileText, Key, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Layout } from "@/components/layout";
import { useFetchUrl } from "@workspace/api-client-react";
import { useSettings } from "@/hooks/use-settings";
import { useSettingsModal } from "@/hooks/use-settings-modal";
import { useLessonsStore } from "@/hooks/use-lessons-store";

const createLessonSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  chapterText: z.string().min(50, "Chapter text must be at least 50 characters to generate a meaningful lesson"),
});

type CreateLessonForm = z.infer<typeof createLessonSchema>;
type SourceTab = "paste" | "url";

export default function Home() {
  const [_, setLocation] = useLocation();
  const { lessons, addLesson, deleteLesson } = useLessonsStore();
  const { mutate: fetchUrlMutate, isPending: isFetchingUrl } = useFetchUrl();
  const { settings, isConfigured } = useSettings();
  const { openSettings } = useSettingsModal();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [sourceTab, setSourceTab] = useState<SourceTab>("paste");
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");

  const form = useForm<CreateLessonForm>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: { title: "", chapterText: "" }
  });

  const onSubmit = async (data: CreateLessonForm) => {
    if (!settings) {
      openSettings();
      return;
    }

    setIsGenerating(true);
    setGenerateError(null);

    try {
      const res = await fetch("/api/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          chapterText: data.chapterText,
          llmConfig: {
            provider: settings.provider,
            apiKey: settings.apiKey,
            model: settings.model,
            baseUrl: settings.baseUrl || undefined,
          },
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setGenerateError(json?.error || "Failed to generate lesson. Please try again.");
        return;
      }

      const id = crypto.randomUUID();
      const newLesson = {
        id,
        title: data.title,
        chapterText: data.chapterText,
        summary: json.summary ?? "",
        keyConcepts: json.keyConcepts ?? [],
        quizQuestions: json.quizQuestions ?? [],
        createdAt: new Date().toISOString(),
      };

      addLesson(newLesson);
      setIsFormOpen(false);
      form.reset();
      setUrlInput("");
      setLocation(`/lessons/${id}`);
    } catch (err: any) {
      setGenerateError(err?.message || "Network error. Please check your connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFetchUrl = () => {
    setUrlError("");
    let parsed: URL;
    try {
      parsed = new URL(urlInput.trim());
      if (!["http:", "https:"].includes(parsed.protocol)) {
        setUrlError("Only http and https URLs are supported.");
        return;
      }
    } catch {
      setUrlError("Please enter a valid URL (e.g. https://example.com/article)");
      return;
    }

    fetchUrlMutate({ data: { url: urlInput.trim() } }, {
      onSuccess: (result) => {
        form.setValue("chapterText", result.content, { shouldValidate: true });
        if (!form.getValues("title")) {
          form.setValue("title", result.title.slice(0, 100), { shouldValidate: true });
        }
        setSourceTab("paste");
      },
      onError: (err: any) => {
        const msg = err?.data?.error ?? err?.message ?? "Failed to fetch URL";
        setUrlError(msg);
      },
    });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this lesson?")) {
      deleteLesson(id);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-border bg-card">
        <div className="absolute inset-0 z-0 opacity-40">
          <img src={`${import.meta.env.BASE_URL}images/hero-bg.png`} alt="Abstract pattern" className="w-full h-full object-cover object-center" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card z-0"></div>

        <div className="container max-w-4xl mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wide uppercase mb-6 shadow-sm">
              <SparklesIcon className="w-4 h-4" /> AI-Powered Learning
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-black text-foreground mb-6 leading-[1.1]">
              Turn any chapter into an <br/><span className="text-primary italic">interactive lesson.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium">
              Paste your reading material or provide a URL. Our AI tutor will extract key concepts, build a comprehensive quiz, and guide you through the material.
            </p>

            {!isFormOpen ? (
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-foreground text-background font-bold text-lg hover:bg-foreground/90 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95"
              >
                <Plus className="w-6 h-6" />
                Create New Lesson
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-background rounded-3xl p-6 md:p-8 shadow-2xl border border-border/60 text-left max-w-3xl mx-auto relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent"></div>

                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-2xl font-bold flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-primary" />
                    New Lesson Setup
                  </h3>
                  <button onClick={() => { setIsFormOpen(false); setGenerateError(null); }} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {!isConfigured && (
                  <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                    <Key className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-amber-700 dark:text-amber-400 text-sm mb-1">API key required</p>
                      <p className="text-amber-700/80 dark:text-amber-400/80 text-xs">You need to set an AI provider API key before generating a lesson.</p>
                    </div>
                    <button
                      onClick={openSettings}
                      className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-500 text-white font-semibold text-xs hover:bg-amber-600 transition-colors"
                    >
                      Set key
                    </button>
                  </div>
                )}

                {generateError && (
                  <div className="mb-5 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <p className="text-destructive text-sm">{generateError}</p>
                  </div>
                )}

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">Lesson Title</label>
                    <input
                      {...form.register("title")}
                      placeholder="e.g. Chapter 4: Cellular Respiration"
                      className="w-full bg-card border-2 border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                    {form.formState.errors.title && (
                      <p className="text-destructive text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4"/> {form.formState.errors.title.message}</p>
                    )}
                  </div>

                  {/* Source tabs */}
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">Source Material</label>
                    <div className="flex gap-1 p-1 bg-secondary rounded-xl mb-3 w-fit">
                      <button
                        type="button"
                        onClick={() => setSourceTab("paste")}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          sourceTab === "paste"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        Paste text
                      </button>
                      <button
                        type="button"
                        onClick={() => { setSourceTab("url"); setUrlError(""); }}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          sourceTab === "url"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Link2 className="w-4 h-4" />
                        Fetch from URL
                      </button>
                    </div>

                    {sourceTab === "paste" ? (
                      <div>
                        <textarea
                          {...form.register("chapterText")}
                          placeholder="Paste your text here..."
                          className="w-full bg-card border-2 border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none font-serif"
                          rows={12}
                        />
                        {form.formState.errors.chapterText && (
                          <p className="text-destructive text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4"/> {form.formState.errors.chapterText.message}</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={urlInput}
                            onChange={(e) => { setUrlInput(e.target.value); setUrlError(""); }}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleFetchUrl(); } }}
                            placeholder="https://en.wikipedia.org/wiki/Photosynthesis"
                            className="flex-1 bg-card border-2 border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                          />
                          <button
                            type="button"
                            onClick={handleFetchUrl}
                            disabled={isFetchingUrl || !urlInput.trim()}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                          >
                            {isFetchingUrl ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                            Fetch
                          </button>
                        </div>
                        {urlError && (
                          <p className="text-destructive text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4 shrink-0" /> {urlError}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Works best with articles, Wikipedia pages, and text-heavy web pages. After fetching, you can edit the extracted text before generating.
                        </p>
                        {form.watch("chapterText") && (
                          <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-sm font-medium flex items-center gap-2">
                            <CheckCircleIcon className="w-4 h-4 shrink-0" />
                            Content fetched! Switch to "Paste text" to review or edit it before generating.
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
                    <button
                      type="button"
                      onClick={() => { setIsFormOpen(false); form.reset(); setUrlInput(""); setGenerateError(null); }}
                      className="px-6 py-3 rounded-xl font-bold text-muted-foreground hover:bg-secondary transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isGenerating || !isConfigured}
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isGenerating ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Generating AI Lesson...</>
                      ) : !isConfigured ? (
                        <><Key className="w-5 h-5" /> Set API Key First</>
                      ) : (
                        <><SparklesIcon className="w-5 h-5" /> Generate Lesson</>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Library Section */}
      <section className="py-20 bg-background flex-1">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-serif font-bold flex items-center gap-3">
              <Library className="w-8 h-8 text-secondary-foreground" />
              Your Library
            </h2>
            <p className="text-sm text-muted-foreground hidden md:block">Lessons are saved in this browser only</p>
          </div>

          {lessons.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-border border-dashed">
              <img src={`${import.meta.env.BASE_URL}images/empty-lessons.png`} alt="No lessons" className="w-48 h-48 mx-auto mb-6 object-contain opacity-80" />
              <h3 className="text-2xl font-serif font-bold mb-2">Your library is empty</h3>
              <p className="text-muted-foreground">Create your first lesson to start learning interactively.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => (
                <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                  <div className="group h-full bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col relative cursor-pointer active:scale-[0.98]">

                    <button
                      onClick={(e) => handleDelete(e, lesson.id)}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:border-destructive hover:bg-destructive/10 transition-all z-10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider">
                        <CheckCircleIcon className="w-3 h-3" /> Ready
                      </span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {lesson.title}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                      {lesson.summary || lesson.chapterText.substring(0, 150) + "..."}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {format(new Date(lesson.createdAt), "MMM d, yyyy")}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
}
function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
}
