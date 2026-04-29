import { useState, useEffect, useRef, useCallback } from "react";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertTriangle, ArrowLeft, ChevronLeft, ChevronRight,
  BookOpen, Lightbulb, Network, CheckCircle, MessageSquare,
  BookMarked, FileText, Award, RotateCcw, Send,
} from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useSettings } from "@/hooks/use-settings";
import { useSettingsModal } from "@/hooks/use-settings-modal";

type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type BloomsObjective = { objective: string; level: string };
type Concept = { term: string; definition: string };
type ReflectionActivity = { prompt: string; guidance: string };

type LessonData = {
  summary?: string;
  bloomsObjectives?: BloomsObjective[];
  keyConcepts?: Concept[];
  glossary?: Concept[];
  quizQuestions?: QuizQuestion[];
  reflectionActivities?: ReflectionActivity[];
};

type Submission = {
  id: number;
  title: string;
  authorName: string;
  doi: string | null;
  topicArea: string | null;
  bloomsLevel: string | null;
  estimatedMinutes: string | null;
  teachingCaseSections: Record<string, string>;
  lessonData: LessonData;
};

type QuizAnswer = { questionIndex: number; selectedIndex: number; correct: boolean };

type ModuleId =
  | "introduction"
  | "narrative"
  | "concepts"
  | "quiz"
  | "reflection"
  | "tutor"
  | "summary";

type Module = {
  id: ModuleId;
  label: string;
  icon: React.ReactNode;
  xapiType: string;
};

const MODULES: Module[] = [
  { id: "introduction", label: "Introduction", icon: <BookOpen className="w-4 h-4" />, xapiType: "http://adlnet.gov/expapi/activities/module" },
  { id: "narrative", label: "Case Narrative", icon: <FileText className="w-4 h-4" />, xapiType: "http://adlnet.gov/expapi/activities/reading" },
  { id: "concepts", label: "Key Concepts", icon: <Lightbulb className="w-4 h-4" />, xapiType: "http://adlnet.gov/expapi/activities/lesson" },
  { id: "quiz", label: "Knowledge Check", icon: <CheckCircle className="w-4 h-4" />, xapiType: "http://adlnet.gov/expapi/activities/assessment" },
  { id: "reflection", label: "Reflection", icon: <BookMarked className="w-4 h-4" />, xapiType: "http://adlnet.gov/expapi/activities/question" },
  { id: "tutor", label: "AI Tutor", icon: <MessageSquare className="w-4 h-4" />, xapiType: "http://adlnet.gov/expapi/activities/interaction" },
  { id: "summary", label: "Summary", icon: <Award className="w-4 h-4" />, xapiType: "http://adlnet.gov/expapi/activities/module" },
];

type XapiExtra = {
  result?: {
    success?: boolean;
    score?: { scaled: number; raw: number; max: number };
    response?: string;
    completion?: boolean;
    duration?: string;
  };
};

const _sessionIds = new Map<number, string>();
function getLessonSessionId(lessonId: number): string {
  if (!_sessionIds.has(lessonId)) {
    _sessionIds.set(lessonId, `ieee-${lessonId}-${Date.now()}`);
  }
  return _sessionIds.get(lessonId)!;
}

function emitXapi(
  verb: string,
  verbId: string,
  lesson: Submission,
  module: Module,
  extra?: XapiExtra
) {
  const sessionId = getLessonSessionId(lesson.id);
  fetch("/api/xapi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      actor: { name: "Learner", mbox: "mailto:learner@ieee.org" },
      verb: { id: verbId, display: { "en-US": verb } },
      object: {
        id: `https://procomm.ieee.org/lessons/${lesson.id}/modules/${module.id}`,
        definition: {
          name: { "en-US": `${lesson.title} — ${module.label}` },
          type: module.xapiType,
          extensions: {
            "https://procomm.ieee.org/extensions/doi": lesson.doi ?? "",
            "https://procomm.ieee.org/extensions/lessonId": String(lesson.id),
          },
        },
      },
      context: {
        platform: "IEEE ProComm Lesson Platform",
        extensions: {
          sessionId,
          module: module.id,
          lessonId: lesson.id,
        },
      },
      ...extra,
    }),
  }).catch(() => {});
}

type ChatMsg = { role: "user" | "assistant"; content: string };

type LoadState =
  | { status: "loading" }
  | { status: "success"; submission: Submission }
  | { status: "error"; message: string };

export default function IeeeLesson() {
  const [match, params] = useRoute("/ieee/lesson/:id");
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [activeModule, setActiveModule] = useState<ModuleId>("introduction");
  const [completedModules, setCompletedModules] = useState<Set<ModuleId>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [reflectionInputs, setReflectionInputs] = useState<Record<number, string>>({});
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const { settings, getLlmConfig } = useSettings();
  const { openSettings } = useSettingsModal();

  const lessonId = match ? params.id : null;

  useEffect(() => {
    if (!lessonId) return;
    fetch(`/api/ieee/submissions/${lessonId}`)
      .then((r) => r.json().then((d) => ({ ok: r.ok, data: d })))
      .then(({ ok, data }) => {
        if (!ok) {
          setLoadState({ status: "error", message: data.error || "Lesson not found." });
        } else if (data.submission?.status !== "approved") {
          setLoadState({ status: "error", message: "This lesson is not yet published." });
        } else {
          setLoadState({ status: "success", submission: data.submission });
          const mod = MODULES.find((m) => m.id === "introduction")!;
          emitXapi("launched", "http://adlnet.gov/expapi/verbs/launched", data.submission, mod);
        }
      })
      .catch((err) => setLoadState({ status: "error", message: err.message || "Network error" }));
  }, [lessonId]);

  const handleModuleChange = useCallback(
    (modId: ModuleId) => {
      if (loadState.status !== "success") return;
      const prevMod = MODULES.find((m) => m.id === activeModule)!;
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      emitXapi(
        "experienced",
        "http://adlnet.gov/expapi/verbs/experienced",
        loadState.submission,
        prevMod,
        { result: { duration: `PT${duration}S`, completion: true } }
      );
      setCompletedModules((prev) => {
        const next = new Set([...prev, activeModule]);
        if (modId === "summary") {
          const summaryMod = MODULES.find((m) => m.id === "summary")!;
          emitXapi(
            "completed",
            "http://adlnet.gov/expapi/verbs/completed",
            loadState.submission,
            summaryMod,
            { result: { completion: true, success: true } }
          );
        }
        return next;
      });
      startTimeRef.current = Date.now();
      setActiveModule(modId);
    },
    [activeModule, loadState]
  );

  const currentModuleIndex = MODULES.findIndex((m) => m.id === activeModule);
  const canGoNext = currentModuleIndex < MODULES.length - 1;
  const canGoPrev = currentModuleIndex > 0;

  const goNext = () => {
    if (canGoNext) handleModuleChange(MODULES[currentModuleIndex + 1].id);
  };
  const goPrev = () => {
    if (canGoPrev) handleModuleChange(MODULES[currentModuleIndex - 1].id);
  };

  const progressPct =
    ((completedModules.size) / MODULES.length) * 100;

  const handleQuizAnswer = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    if (loadState.status !== "success") return;
    const questions = loadState.submission.lessonData?.quizQuestions ?? [];
    setQuizAnswers((prev) => {
      const next = prev.filter((a) => a.questionIndex !== qIdx);
      const correct = optIdx === questions[qIdx]?.correctIndex;
      return [...next, { questionIndex: qIdx, selectedIndex: optIdx, correct }];
    });
  };

  const handleQuizSubmit = () => {
    if (loadState.status !== "success") return;
    const questions = loadState.submission.lessonData?.quizQuestions ?? [];
    const correctCount = quizAnswers.filter((a) => a.correct).length;
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 70;
    const mod = MODULES.find((m) => m.id === "quiz")!;
    emitXapi(
      passed ? "passed" : "failed",
      passed
        ? "http://adlnet.gov/expapi/verbs/passed"
        : "http://adlnet.gov/expapi/verbs/failed",
      loadState.submission,
      mod,
      {
        result: {
          score: { scaled: score / 100, raw: correctCount, max: questions.length },
          success: passed,
          completion: true,
        },
      }
    );
    setQuizSubmitted(true);
  };

  const handleReflectionSubmit = (idx: number) => {
    if (loadState.status !== "success") return;
    const mod = MODULES.find((m) => m.id === "reflection")!;
    emitXapi(
      "answered",
      "http://adlnet.gov/expapi/verbs/answered",
      loadState.submission,
      mod,
      { result: { response: reflectionInputs[idx] ?? "", completion: true } }
    );
  };

  const handleChat = async () => {
    if (!chatInput.trim() || chatLoading || loadState.status !== "success") return;
    if (!settings.apiKey) {
      openSettings();
      return;
    }

    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setChatLoading(true);

    const lesson = loadState.submission;
    const mod = MODULES.find((m) => m.id === "tutor")!;
    emitXapi(
      "asked",
      "http://adlnet.gov/expapi/verbs/asked",
      lesson,
      mod,
      { result: { response: userMsg } }
    );

    const lessonContext = {
      title: lesson.title,
      summary: lesson.lessonData?.summary ?? "",
      keyConcepts: (lesson.lessonData?.keyConcepts ?? []) as { term: string; definition: string }[],
      chapterText: lesson.teachingCaseSections?.caseNarrative ?? lesson.teachingCaseSections?.abstract ?? "",
    };

    const history = chatMessages.map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history,
          lessonContext,
          llmConfig: getLlmConfig(),
        }),
      });

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      let assistantText = "";
      setChatMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.content ?? "";
            assistantText += delta;
            setChatMessages((prev) => {
              const next = [...prev];
              next[next.length - 1] = { role: "assistant", content: assistantText };
              return next;
            });
          } catch {}
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to get response";
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${message}` },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loadState.status === "loading") {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span>Loading lesson…</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (loadState.status === "error") {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Lesson Not Available</h2>
            <p className="text-muted-foreground mb-4">{loadState.message}</p>
            <Button asChild variant="outline">
              <Link href="/ieee/catalog"><ArrowLeft className="w-4 h-4 mr-2" />Back to Catalog</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const { submission } = loadState;
  const sections = submission.teachingCaseSections ?? {};
  const lessonData = submission.lessonData ?? {};
  const quizQuestions = lessonData.quizQuestions ?? [];
  const keyConcepts = lessonData.keyConcepts ?? [];
  const glossary = lessonData.glossary ?? [];
  const bloomsObjectives = lessonData.bloomsObjectives ?? [];
  const reflectionActivities = lessonData.reflectionActivities ?? [];
  const quizScore = quizSubmitted
    ? Math.round((quizAnswers.filter((a) => a.correct).length / (quizQuestions.length || 1)) * 100)
    : null;

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <Button asChild variant="ghost" size="sm" className="gap-1">
              <Link href="/ieee/catalog"><ArrowLeft className="w-4 h-4" />Catalog</Link>
            </Button>
            <div className="flex-1">
              <h1 className="font-serif font-bold text-xl leading-tight">{submission.title}</h1>
              <p className="text-sm text-muted-foreground">By {submission.authorName}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Progress</span>
              <span className="text-sm text-muted-foreground">{completedModules.size}/{MODULES.length} modules</span>
            </div>
            <Progress value={progressPct} className="h-2" />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-6">
            {MODULES.map((m) => {
              const isActive = m.id === activeModule;
              const isDone = completedModules.has(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => handleModuleChange(m.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : isDone
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {m.icon}
                  {m.label}
                  {isDone && !isActive && <CheckCircle className="w-3 h-3" />}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="bg-background border border-border rounded-2xl p-6 mb-6 min-h-[300px]"
            >
              {activeModule === "introduction" && (
                <div>
                  <h2 className="text-xl font-serif font-bold mb-4">Introduction</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {lessonData.summary || sections.abstract || "Welcome to this IEEE Teaching Case lesson."}
                  </p>
                  {bloomsObjectives.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Learning Objectives</h3>
                      <ul className="space-y-2">
                        {bloomsObjectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Badge variant="outline" className="capitalize shrink-0 mt-0.5 text-xs">
                              {obj.level}
                            </Badge>
                            <span className="text-sm">{obj.objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeModule === "narrative" && (
                <div>
                  <h2 className="text-xl font-serif font-bold mb-4">Case Narrative</h2>
                  <div className="prose prose-sm max-w-none text-foreground">
                    <p className="leading-relaxed whitespace-pre-wrap">
                      {sections.caseNarrative || "The case narrative was not extracted from this article. Please refer to the original publication."}
                    </p>
                  </div>
                </div>
              )}

              {activeModule === "concepts" && (
                <div>
                  <h2 className="text-xl font-serif font-bold mb-4">Key Concepts</h2>
                  {keyConcepts.length > 0 && (
                    <div className="grid gap-3 mb-6">
                      {keyConcepts.map((c, i) => (
                        <div key={i} className="bg-muted/50 rounded-xl p-4 border border-border">
                          <div className="font-semibold mb-1">{c.term}</div>
                          <div className="text-sm text-muted-foreground">{c.definition}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {glossary.length > 0 && (
                    <>
                      <h3 className="font-semibold mb-3">Glossary</h3>
                      <div className="grid gap-2">
                        {glossary.map((c, i) => (
                          <div key={i} className="flex gap-3 py-2 border-b border-border last:border-0">
                            <span className="font-medium text-sm w-40 shrink-0">{c.term}</span>
                            <span className="text-sm text-muted-foreground">{c.definition}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeModule === "quiz" && (
                <div>
                  <h2 className="text-xl font-serif font-bold mb-2">Knowledge Check</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Answer all questions, then submit to see your score. Passing score: 70%.
                  </p>
                  {quizSubmitted && quizScore !== null && (
                    <div className={`rounded-xl p-4 mb-6 border ${quizScore >= 70 ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
                      <div className="font-semibold text-lg">
                        Score: {quizScore}% — {quizScore >= 70 ? "Passed ✓" : "Not Passed"}
                      </div>
                      <div className="text-sm mt-1">
                        {quizAnswers.filter((a) => a.correct).length} / {quizQuestions.length} correct
                      </div>
                    </div>
                  )}
                  <div className="space-y-6">
                    {quizQuestions.map((q, qi) => {
                      const answer = quizAnswers.find((a) => a.questionIndex === qi);
                      return (
                        <div key={qi}>
                          <p className="font-medium mb-3">
                            {qi + 1}. {q.question}
                          </p>
                          <div className="space-y-2">
                            {q.options.map((opt: string, oi: number) => {
                              let cls = "border border-border rounded-xl p-3 text-sm cursor-pointer hover:bg-muted/50 transition-colors";
                              if (answer?.selectedIndex === oi) {
                                if (quizSubmitted) {
                                  cls += oi === q.correctIndex
                                    ? " bg-green-50 border-green-300 text-green-800"
                                    : " bg-red-50 border-red-300 text-red-800";
                                } else {
                                  cls += " bg-primary/10 border-primary/40";
                                }
                              } else if (quizSubmitted && oi === q.correctIndex) {
                                cls += " bg-green-50 border-green-300 text-green-800";
                              }
                              return (
                                <div
                                  key={oi}
                                  className={cls}
                                  onClick={() => handleQuizAnswer(qi, oi)}
                                >
                                  {opt}
                                </div>
                              );
                            })}
                          </div>
                          {quizSubmitted && (
                            <p className="text-xs text-muted-foreground mt-2 bg-muted/50 rounded-lg p-2">
                              {q.explanation}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {!quizSubmitted && quizQuestions.length > 0 && (
                    <Button
                      onClick={handleQuizSubmit}
                      disabled={quizAnswers.length < quizQuestions.length}
                      className="mt-6"
                    >
                      Submit Answers
                    </Button>
                  )}
                  {quizSubmitted && (
                    <Button
                      variant="outline"
                      onClick={() => { setQuizAnswers([]); setQuizSubmitted(false); }}
                      className="mt-6 gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />Retake Quiz
                    </Button>
                  )}
                </div>
              )}

              {activeModule === "reflection" && (
                <div>
                  <h2 className="text-xl font-serif font-bold mb-2">Reflection Activities</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Take time to reflect on the case. There are no wrong answers — focus on your own reasoning.
                  </p>
                  {reflectionActivities.length > 0 ? (
                    <div className="space-y-6">
                      {reflectionActivities.map((r, i) => (
                        <div key={i} className="border border-border rounded-xl p-4">
                          <p className="font-medium mb-3">{i + 1}. {r.prompt}</p>
                          <Textarea
                            placeholder="Write your reflection here…"
                            className="mb-3 min-h-[100px]"
                            value={reflectionInputs[i] ?? ""}
                            onChange={(e) => setReflectionInputs((prev) => ({ ...prev, [i]: e.target.value }))}
                          />
                          {r.guidance && (
                            <p className="text-xs text-muted-foreground italic mb-3">
                              Guidance: {r.guidance}
                            </p>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReflectionSubmit(i)}
                            disabled={!reflectionInputs[i]?.trim()}
                          >
                            Submit Reflection
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(sections.discussionQuestions || "").split("\n").filter(Boolean).map((q: string, i: number) => (
                        <div key={i} className="border border-border rounded-xl p-4">
                          <p className="font-medium mb-3">{q}</p>
                          <Textarea
                            placeholder="Write your reflection here…"
                            className="mb-2 min-h-[80px]"
                            value={reflectionInputs[i] ?? ""}
                            onChange={(e) => setReflectionInputs((prev) => ({ ...prev, [i]: e.target.value }))}
                          />
                          <Button size="sm" variant="outline" onClick={() => handleReflectionSubmit(i)}>
                            Submit
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeModule === "tutor" && (
                <div className="flex flex-col h-full">
                  <h2 className="text-xl font-serif font-bold mb-1">AI Tutor</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ask anything about this case. The AI tutor is grounded in the lesson content.
                    {!settings.apiKey && (
                      <button onClick={openSettings} className="text-primary hover:underline ml-1 font-medium">
                        Configure your API key to use this feature.
                      </button>
                    )}
                  </p>
                  <div className="flex-1 min-h-[200px] max-h-[400px] overflow-y-auto border border-border rounded-xl p-4 mb-4 space-y-3">
                    {chatMessages.length === 0 && (
                      <p className="text-muted-foreground text-sm text-center py-8">
                        Ask a question about the case to get started…
                      </p>
                    )}
                    {chatMessages.map((m, i) => (
                      <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                            m.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {m.content || <span className="opacity-50">Thinking…</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 border border-border rounded-xl px-4 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Ask the AI tutor…"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleChat(); } }}
                    />
                    <Button onClick={handleChat} disabled={chatLoading || !chatInput.trim()} size="icon">
                      {chatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              )}

              {activeModule === "summary" && (
                <div>
                  <h2 className="text-xl font-serif font-bold mb-4">Summary & Takeaways</h2>
                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-2xl p-6 mb-6">
                    <Award className="w-8 h-8 text-primary mb-3" />
                    {quizScore !== null && quizScore >= 70 ? (
                      <>
                        <h3 className="font-semibold text-lg mb-2">Congratulations!</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          You passed the knowledge check with {quizScore}% and have completed this IEEE Teaching Case lesson.
                        </p>
                      </>
                    ) : (
                      <p className="text-muted-foreground text-sm mb-4">
                        You've worked through this IEEE Teaching Case lesson. Return to the Knowledge Check to earn your completion certificate.
                      </p>
                    )}
                  </div>
                  <h3 className="font-semibold mb-3">What You Covered</h3>
                  <div className="space-y-2">
                    {MODULES.filter((m) => m.id !== "summary").map((m) => (
                      <div key={m.id} className="flex items-center gap-2 text-sm">
                        {completedModules.has(m.id) ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                        )}
                        <span className={completedModules.has(m.id) ? "" : "text-muted-foreground"}>
                          {m.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  {lessonData.summary && (
                    <div className="mt-6">
                      <h3 className="font-semibold mb-2">Case Summary</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{lessonData.summary}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between">
            <Button variant="outline" onClick={goPrev} disabled={!canGoPrev} className="gap-2">
              <ChevronLeft className="w-4 h-4" />Previous
            </Button>
            <Button onClick={goNext} disabled={!canGoNext} className="gap-2">
              Next<ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
