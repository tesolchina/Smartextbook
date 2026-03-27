import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Loader2, AlertCircle, Link2, FileText, Key, X, CheckCircle2, FlaskConical } from "lucide-react";
import { useFetchUrl } from "@workspace/api-client-react";
import { useSettings } from "@/hooks/use-settings";
import { useSettingsModal } from "@/hooks/use-settings-modal";
import { useLessonsStore } from "@/hooks/use-lessons-store";

const schema = z.object({
  title: z.string().min(3, "At least 3 characters").max(100),
  chapterText: z.string().min(50, "Paste at least 50 characters of source text"),
});

type FormValues = z.infer<typeof schema>;
type Tab = "paste" | "url";

interface Props {
  onClose: () => void;
}

const SAMPLE = {
  url: "https://arxiv.org/abs/2509.13348",
  title: "Towards an AI-Augmented Textbook",
};

const STAGES = [
  { label: "Analyzing source text…",    minSec: 0  },
  { label: "Writing lesson summary…",   minSec: 8  },
  { label: "Identifying key concepts…", minSec: 18 },
  { label: "Building quiz questions…",  minSec: 30 },
  { label: "Finalizing lesson…",        minSec: 46 },
];

function estimateSecs(textLength: number): number {
  if (textLength < 1500)  return 35;
  if (textLength < 4000)  return 50;
  if (textLength < 8000)  return 65;
  return 80;
}

export function CreateLessonForm({ onClose }: Props) {
  const [_, setLocation] = useLocation();
  const { addLesson } = useLessonsStore();
  const { mutate: fetchUrl, isPending: isFetchingUrl } = useFetchUrl();
  const { settings, isConfigured } = useSettings();
  const { openSettings } = useSettingsModal();

  const [tab, setTab] = useState<Tab>("paste");
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");

  const loadSample = () => {
    setTab("url");
    setUrlInput(SAMPLE.url);
    setUrlError("");
    form.setValue("title", SAMPLE.title, { shouldValidate: true });
  };
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const [stageIndex, setStageIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [estimate, setEstimate] = useState(50);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isGenerating) {
      setStageIndex(0);
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          setStageIndex(
            STAGES.reduce((best, s, i) => (next >= s.minSec ? i : best), 0)
          );
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGenerating]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", chapterText: "" },
  });

  const handleFetchUrl = () => {
    setUrlError("");
    try {
      const parsed = new URL(urlInput.trim());
      if (!["http:", "https:"].includes(parsed.protocol)) {
        setUrlError("Only http and https URLs are supported.");
        return;
      }
    } catch {
      setUrlError("Enter a valid URL — e.g. https://en.wikipedia.org/wiki/…");
      return;
    }

    fetchUrl(
      { data: { url: urlInput.trim() } },
      {
        onSuccess: (result) => {
          form.setValue("chapterText", result.content, { shouldValidate: true });
          if (!form.getValues("title")) {
            form.setValue("title", result.title.slice(0, 100), { shouldValidate: true });
          }
          setTab("paste");
        },
        onError: (err: any) => {
          setUrlError(err?.data?.error ?? err?.message ?? "Failed to fetch URL");
        },
      }
    );
  };

  const onSubmit = async (data: FormValues) => {
    if (!isConfigured) {
      openSettings();
      return;
    }
    const est = estimateSecs(data.chapterText.length);
    setEstimate(est);
    setIsGenerating(true);
    setGenerateError(null);

    try {
      console.log("[LessonBuilder] Submitting generate-lesson", {
        provider: settings.provider,
        model: settings.model,
        hasKey: Boolean(settings.apiKey?.trim()),
        titleLen: data.title.length,
        textLen: data.chapterText.length,
      });

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
      console.log("[LessonBuilder] generate-lesson response", { status: res.status, ok: res.ok, error: json?.error });

      if (!res.ok) {
        const errMsg = json?.error || "Generation failed — please try again.";
        console.error("[LessonBuilder] AI error:", errMsg);
        setGenerateError(errMsg);
        return;
      }

      const id = crypto.randomUUID();
      addLesson({
        id,
        title: data.title,
        chapterText: data.chapterText,
        summary: json.summary ?? "",
        keyConcepts: json.keyConcepts ?? [],
        quizQuestions: json.quizQuestions ?? [],
        createdAt: new Date().toISOString(),
      });

      setLocation(`/lessons/${id}`);
    } catch (err: any) {
      console.error("[LessonBuilder] fetch error:", err);
      setGenerateError(err?.message || "Network error — check your connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const remaining = Math.max(0, estimate - elapsed);
  const progressPct = Math.min(100, Math.round((elapsed / estimate) * 100));

  return (
    <div className="bg-background rounded-3xl p-6 md:p-8 shadow-2xl border border-border/60 text-left max-w-3xl mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />

      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-xl font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" /> New Lesson
        </h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      {!isConfigured && (
        <div className="mb-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
          <Key className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="text-amber-700 dark:text-amber-400 text-sm flex-1">
            An AI provider key is required to generate lessons.
          </p>
          <button
            onClick={openSettings}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-white font-semibold text-xs hover:bg-amber-600 transition-colors shrink-0"
          >
            Set key
          </button>
        </div>
      )}

      {generateError && (
        <div className="mb-5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-destructive text-sm">{generateError}</p>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Title</label>
          <input
            {...form.register("title")}
            placeholder="e.g. Chapter 4 — Cellular Respiration"
            className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
          {form.formState.errors.title && (
            <p className="text-destructive text-xs mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {form.formState.errors.title.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-foreground">Source Material</label>
            <button
              type="button"
              onClick={loadSample}
              className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <FlaskConical className="w-3 h-3" /> Try a sample
            </button>
          </div>

          <div className="flex gap-1 p-1 bg-secondary rounded-lg mb-3 w-fit text-xs">
            {(["paste", "url"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTab(t); setUrlError(""); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                  tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "paste" ? <FileText className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
                {t === "paste" ? "Paste text" : "Fetch URL"}
              </button>
            ))}
          </div>

          {tab === "paste" ? (
            <div>
              <textarea
                {...form.register("chapterText")}
                placeholder="Paste your chapter, article, or study material here…"
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none font-serif leading-relaxed"
                rows={10}
              />
              {form.formState.errors.chapterText && (
                <p className="text-destructive text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {form.formState.errors.chapterText.message}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => { setUrlInput(e.target.value); setUrlError(""); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleFetchUrl(); }}}
                  placeholder="https://en.wikipedia.org/wiki/Photosynthesis"
                  className="flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
                <button
                  type="button"
                  onClick={handleFetchUrl}
                  disabled={isFetchingUrl || !urlInput.trim()}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                >
                  {isFetchingUrl ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                  Fetch
                </button>
              </div>
              {urlError && (
                <p className="text-destructive text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {urlError}
                </p>
              )}
              {!urlError && (
                <p className="text-xs text-muted-foreground">
                  Works best with Wikipedia articles, textbook excerpts, and text-rich pages.
                </p>
              )}
              {form.watch("chapterText") && (
                <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                  ✓ Content fetched — switch to "Paste text" to review before generating.
                </p>
              )}
            </div>
          )}
        </div>

        {isGenerating && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-primary">
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {STAGES[stageIndex].label}
              </span>
              <span className="tabular-nums text-muted-foreground">
                {remaining > 0
                  ? `~${remaining}s remaining`
                  : "Almost done…"}
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-primary/15 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-1000 ease-linear"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {STAGES.map((s, i) => {
                const done = stageIndex > i;
                const active = stageIndex === i;
                return (
                  <span
                    key={s.label}
                    className={`flex items-center gap-1 text-xs transition-colors ${
                      done
                        ? "text-green-600 dark:text-green-400"
                        : active
                        ? "text-primary font-semibold"
                        : "text-muted-foreground/50"
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                    ) : (
                      <span className="w-3 h-3 shrink-0 flex items-center justify-center">
                        <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-primary" : "bg-muted-foreground/30"}`} />
                      </span>
                    )}
                    {s.label.replace("…", "")}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isGenerating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
            ) : (
              <>Generate Lesson</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
