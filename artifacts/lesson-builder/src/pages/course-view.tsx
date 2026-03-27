import { useState, useEffect, useCallback } from "react";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CheckCircle2, Circle, Lock, Award, Loader2,
  AlertTriangle, ExternalLink, ChevronRight, BookOpen
} from "lucide-react";
import { Layout } from "@/components/layout";

interface LessonMeta {
  id: string;
  title: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  teacherName: string;
  teacherCredential: string | null;
  lessonIds: string[];
  passScore: number;
  createdAt: string;
}

type LoadState =
  | { status: "loading" }
  | { status: "success"; course: Course; lessons: LessonMeta[] }
  | { status: "error"; message: string };

type CertState =
  | { status: "idle" }
  | { status: "form" }
  | { status: "issuing" }
  | { status: "done"; certId: string };

const STORAGE_KEY = (courseId: string) => `lessonbuilder:course-progress:${courseId}`;

function getProgress(courseId: string): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY(courseId)) ?? "{}"); } catch { return {}; }
}
function setProgress(courseId: string, scores: Record<string, number>) {
  localStorage.setItem(STORAGE_KEY(courseId), JSON.stringify(scores));
}

const LEARNER_KEY_KEY = "lessonbuilder:learner-key";
function getLearnerKey(): string {
  let k = localStorage.getItem(LEARNER_KEY_KEY);
  if (!k) { k = crypto.randomUUID(); localStorage.setItem(LEARNER_KEY_KEY, k); }
  return k;
}

export default function CourseView() {
  const [match, params] = useRoute("/course/:id");
  const courseId = match ? params.id : null;

  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [scores, setScores] = useState<Record<string, number>>({});
  const [certState, setCertState] = useState<CertState>({ status: "idle" });
  const [learnerName, setLearnerName] = useState("");

  useEffect(() => {
    if (!courseId) return;
    setScores(getProgress(courseId));
    fetch(`/api/courses/${courseId}`)
      .then((r) => r.json().then((d) => ({ ok: r.ok, data: d })))
      .then(({ ok, data }) => {
        if (!ok) setLoadState({ status: "error", message: data.error || "Course not found." });
        else setLoadState({ status: "success", course: data.course, lessons: data.lessons });
      })
      .catch((err) => setLoadState({ status: "error", message: err.message }));
  }, [courseId]);

  useEffect(() => {
    const handler = () => {
      if (!courseId) return;
      const raw = localStorage.getItem(`lessonbuilder:quiz-result`);
      if (raw) {
        try {
          const { lessonId, score } = JSON.parse(raw) as { lessonId: string; score: number };
          setScores((prev) => {
            const next = { ...prev, [lessonId]: Math.max(prev[lessonId] ?? 0, score) };
            setProgress(courseId, next);
            return next;
          });
        } catch { /* ignore */ }
      }
    };
    window.addEventListener("storage", handler);
    window.addEventListener("focus", handler);
    return () => { window.removeEventListener("storage", handler); window.removeEventListener("focus", handler); };
  }, [courseId]);

  const issueCert = useCallback(async () => {
    if (loadState.status !== "success" || !learnerName.trim()) return;
    setCertState({ status: "issuing" });
    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: loadState.course.id,
          learnerName: learnerName.trim(),
          learnerKey: getLearnerKey(),
          scores,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to issue certificate");
      setCertState({ status: "done", certId: data.id });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to issue certificate");
      setCertState({ status: "form" });
    }
  }, [loadState, learnerName, scores]);

  if (loadState.status === "loading") {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm">Loading course…</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (loadState.status === "error") {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3 text-center">
            <AlertTriangle className="w-10 h-10 text-destructive" />
            <p className="font-semibold">Course not found</p>
            <p className="text-sm text-muted-foreground">{loadState.message}</p>
            <Link href="/app" className="text-sm text-primary hover:underline mt-2">← Back to Library</Link>
          </div>
        </div>
      </Layout>
    );
  }

  const { course, lessons } = loadState;
  const passed = (id: string) => (scores[id] ?? 0) >= course.passScore;
  const completedCount = lessons.filter((l) => passed(l.id)).length;
  const allPassed = completedCount === lessons.length;
  const progressPct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <Link href="/app" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Library
        </Link>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold leading-tight">{course.title}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                by <span className="font-medium text-foreground">{course.teacherName}</span>
                {course.teacherCredential && <span className="ml-1 text-muted-foreground">· {course.teacherCredential}</span>}
              </p>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">{course.description}</p>
          <p className="text-xs text-muted-foreground">Passing score: {course.passScore}% per lesson</p>
        </motion.div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">{completedCount} of {lessons.length} completed</span>
            <span className="font-medium text-foreground">{progressPct}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {lessons.map((lesson, i) => {
            const isComplete = passed(lesson.id);
            const isUnlocked = i === 0 || passed(lessons[i - 1].id);
            const score = scores[lesson.id];

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                  isComplete
                    ? "bg-primary/5 border-primary/20"
                    : isUnlocked
                    ? "bg-card border-border hover:border-primary/40"
                    : "bg-muted/40 border-border opacity-60"
                }`}
              >
                <div className={`shrink-0 ${isComplete ? "text-primary" : isUnlocked ? "text-muted-foreground" : "text-muted-foreground/40"}`}>
                  {isComplete ? <CheckCircle2 className="w-5 h-5" /> : isUnlocked ? <Circle className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{lesson.title}</p>
                  {score !== undefined && (
                    <p className="text-xs text-muted-foreground mt-0.5">Score: {score}%</p>
                  )}
                </div>
                {isUnlocked ? (
                  <a
                    href={`/app/shared/${lesson.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`shrink-0 flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      isComplete
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {isComplete ? "Review" : "Start"} <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="shrink-0 text-xs text-muted-foreground/60 px-3 py-1.5">Locked</span>
                )}
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {allPassed && certState.status === "idle" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 text-center space-y-4"
            >
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-primary/15 text-primary">
                  <Award className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold">All lessons completed!</h2>
                <p className="text-sm text-muted-foreground mt-1">You're ready to receive your certificate.</p>
              </div>
              <button
                onClick={() => setCertState({ status: "form" })}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              >
                <Award className="w-4 h-4" /> Get Certificate
              </button>
            </motion.div>
          )}

          {allPassed && certState.status === "form" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-2xl p-6 space-y-4"
            >
              <h2 className="text-lg font-serif font-bold">Enter your name for the certificate</h2>
              <p className="text-sm text-muted-foreground">
                This name will appear on your public certificate. You may use your real name, a pseudonym, or an alias.
              </p>
              <input
                type="text"
                value={learnerName}
                onChange={(e) => setLearnerName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                Your name and score will be permanently public on the certificate page.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCertState({ status: "idle" })}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={issueCert}
                  disabled={!learnerName.trim()}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Generate Certificate
                </button>
              </div>
            </motion.div>
          )}

          {certState.status === "issuing" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-3 py-8 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Issuing your certificate…</span>
            </motion.div>
          )}

          {certState.status === "done" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 text-center space-y-4"
            >
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-primary/15 text-primary">
                  <Award className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold">Certificate issued!</h2>
                <p className="text-sm text-muted-foreground mt-1">Your learning record is now permanently verifiable.</p>
              </div>
              <Link
                href={`/cert/${certState.certId}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              >
                View Certificate <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
