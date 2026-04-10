import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Key, AlertCircle, CheckCircle2, ChevronRight, X } from "lucide-react";
import { useFetchUrl } from "@workspace/api-client-react";
import { useSettings } from "@/hooks/use-settings";
import { useSettingsModal } from "@/hooks/use-settings-modal";
import { useLessonsStore } from "@/hooks/use-lessons-store";
import {
  type LearnerPreferences,
  SAMPLE, STAGES, estimateSecs,
} from "@/lib/lesson-form-types";
import { LessonFormStep1, type Step1FormValues } from "@/components/lesson-form-step1";
import { LessonFormStep2 } from "@/components/lesson-form-step2";

const schema = z.object({
  title: z.string().min(3, "At least 3 characters").max(100),
  chapterText: z.string().min(50, "Paste at least 50 characters of source text"),
});

type Tab = "paste" | "url" | "pdf";

interface Props {
  onClose: () => void;
}

export function CreateLessonForm({ onClose }: Props) {
  const [_, setLocation] = useLocation();
  const { addLesson } = useLessonsStore();
  const { mutate: fetchUrl, isPending: isFetchingUrl } = useFetchUrl();
  const { settings, isConfigured } = useSettings();
  const { openSettings } = useSettingsModal();

  const [step, setStep] = useState<1 | 2>(1);
  const [tab, setTab] = useState<Tab>("paste");
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [estimate, setEstimate] = useState(60);

  const [prefs, setPrefs] = useState<LearnerPreferences>({
    audience: "university",
    goal: "understand",
    quizTemplate: "standard",
    customGoal: "",
    subjectType: "general",
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isGenerating) {
      setStageIndex(0);
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          setStageIndex(STAGES.reduce((best, s, i) => (next >= s.minSec ? i : best), 0));
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isGenerating]);

  const form = useForm<Step1FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", chapterText: "" },
  });

  const handleLoadSample = () => {
    setTab("url");
    setUrlInput(SAMPLE.url);
    setUrlError("");
    form.setValue("title", SAMPLE.title, { shouldValidate: true });
  };

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

  const handleNextStep = async () => {
    const valid = await form.trigger(["title", "chapterText"]);
    if (valid) setStep(2);
  };

  const handleGenerate = async () => {
    if (!isConfigured) { openSettings(); return; }
    const data = form.getValues();
    const est = estimateSecs(data.chapterText.length);
    setEstimate(est);
    setIsGenerating(true);
    setGenerateError(null);

    try {
      const res = await fetch("/api/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          chapterText: data.chapterText,
          teachingPrompt: settings.teachingPrompt?.trim() || undefined,
          llmConfig: {
            provider: settings.provider,
            apiKey: settings.apiKey,
            model: settings.model,
            baseUrl: settings.baseUrl || undefined,
          },
          learnerPreferences: {
            audience: prefs.audience,
            goal: prefs.goal,
            quizTemplate: prefs.quizTemplate,
            customGoal: prefs.customGoal || undefined,
            subjectType: prefs.subjectType,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setGenerateError(json?.error || "Generation failed — please try again.");
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
        practiceCards: json.practiceCards ?? undefined,
        createdAt: new Date().toISOString(),
        learnerPreferences: prefs,
      });

      setLocation(`/lessons/${id}`);
    } catch (err: any) {
      setGenerateError(err?.message || "Network error — check your connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const remaining  = Math.max(0, estimate - elapsed);
  const progressPct = Math.min(100, Math.round((elapsed / estimate) * 100));

  return (
    <div className="bg-background rounded-3xl p-6 md:p-8 shadow-2xl border border-border/60 text-left max-w-3xl mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-serif text-xl font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" /> New Lesson
        </h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { n: 1, label: "Source Material" },
          { n: 2, label: "Lesson Design" },
        ].map(({ n, label }, i) => (
          <div key={n} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
              step === n
                ? "bg-primary text-primary-foreground"
                : step > n
                ? "bg-green-500/15 text-green-600 dark:text-green-400"
                : "bg-secondary text-muted-foreground"
            }`}>
              {step > n ? <CheckCircle2 className="w-3 h-3" /> : <span>{n}</span>}
              {label}
            </div>
            {i === 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />}
          </div>
        ))}
      </div>

      {/* API key warning */}
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

      {/* Generation error */}
      {generateError && (
        <div className="mb-5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-destructive text-sm">{generateError}</p>
        </div>
      )}

      {/* Steps */}
      {step === 1 && (
        <LessonFormStep1
          form={form}
          tab={tab}
          setTab={setTab}
          urlInput={urlInput}
          setUrlInput={setUrlInput}
          urlError={urlError}
          setUrlError={setUrlError}
          isFetchingUrl={isFetchingUrl}
          onFetchUrl={handleFetchUrl}
          onClose={onClose}
          onNext={handleNextStep}
          onLoadSample={handleLoadSample}
        />
      )}
      {step === 2 && (
        <LessonFormStep2
          prefs={prefs}
          setPrefs={setPrefs}
          isGenerating={isGenerating}
          stageIndex={stageIndex}
          remaining={remaining}
          progressPct={progressPct}
          onBack={() => setStep(1)}
          onClose={onClose}
          onGenerate={handleGenerate}
        />
      )}
    </div>
  );
}
