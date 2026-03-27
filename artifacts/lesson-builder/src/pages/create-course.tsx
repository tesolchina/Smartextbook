import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Plus, Trash2, BookOpen, Loader2, GripVertical } from "lucide-react";
import { Layout } from "@/components/layout";

interface LessonEntry {
  url: string;
  resolvedId: string | null;
  resolvedTitle: string | null;
  error: string | null;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function extractShareId(input: string): string | null {
  input = input.trim();
  const match = input.match(/\/shared\/([a-f0-9-]{36})/i);
  if (match) return match[1];
  if (/^[a-f0-9-]{36}$/i.test(input)) return input;
  return null;
}

export default function CreateCourse() {
  const [, navigate] = useLocation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherCredential, setTeacherCredential] = useState("");
  const [passScore, setPassScore] = useState(70);
  const [lessons, setLessons] = useState<LessonEntry[]>([{ url: "", resolvedId: null, resolvedTitle: null, error: null }]);
  const [submitting, setSubmitting] = useState(false);
  const [resolving, setResolving] = useState<number | null>(null);

  const resolveLessonUrl = async (index: number, url: string) => {
    const id = extractShareId(url);
    if (!id) {
      setLessons((prev) => prev.map((l, i) => i === index ? { ...l, resolvedId: null, resolvedTitle: null, error: "Invalid lesson URL or ID" } : l));
      return;
    }
    setResolving(index);
    try {
      const res = await fetch(`/api/shared/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lesson not found");
      setLessons((prev) => prev.map((l, i) => i === index
        ? { ...l, resolvedId: id, resolvedTitle: data.lesson?.title || "Untitled", error: null }
        : l
      ));
    } catch (err) {
      setLessons((prev) => prev.map((l, i) => i === index
        ? { ...l, resolvedId: null, resolvedTitle: null, error: err instanceof Error ? err.message : "Not found" }
        : l
      ));
    } finally {
      setResolving(null);
    }
  };

  const updateUrl = (index: number, url: string) => {
    setLessons((prev) => prev.map((l, i) => i === index ? { ...l, url, resolvedId: null, resolvedTitle: null, error: null } : l));
  };

  const addLesson = () => setLessons((prev) => [...prev, { url: "", resolvedId: null, resolvedTitle: null, error: null }]);
  const removeLesson = (index: number) => setLessons((prev) => prev.filter((_, i) => i !== index));

  const validLessons = lessons.filter((l) => l.resolvedId);
  const canSubmit = title.trim() && description.trim() && teacherName.trim() && validLessons.length >= 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          teacherName: teacherName.trim(),
          teacherCredential: teacherCredential.trim() || null,
          lessonIds: validLessons.map((l) => l.resolvedId!),
          passScore,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create course");
      navigate(`${BASE}/course/${data.id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create course");
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <Link href="/app" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Library
        </Link>

        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold">Create a Course</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Bundle your shared lessons into a structured course with a verifiable completion certificate.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Course Details</h2>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Course Title <span className="text-destructive">*</span></label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Academic Writing Fundamentals"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                maxLength={200}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Description <span className="text-destructive">*</span></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What will students learn? Who is this for?"
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                maxLength={1000}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Your Name <span className="text-destructive">*</span></label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="e.g. Dr. Zhang Wei"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  maxLength={100}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Credential / Affiliation <span className="text-muted-foreground font-normal">(optional)</span></label>
                <input
                  type="text"
                  value={teacherCredential}
                  onChange={(e) => setTeacherCredential(e.target.value)}
                  placeholder="e.g. Lecturer, HKU"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  maxLength={200}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Passing Score</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={50} max={100} step={5}
                  value={passScore}
                  onChange={(e) => setPassScore(Number(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <span className="text-sm font-semibold tabular-nums w-10 text-right">{passScore}%</span>
              </div>
              <p className="text-xs text-muted-foreground">Students must score at least {passScore}% on each lesson quiz to pass.</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Lessons</h2>
              <span className="text-xs text-muted-foreground">{validLessons.length} added</span>
            </div>
            <p className="text-xs text-muted-foreground -mt-2">
              Paste the share link or ID of each lesson. Share lessons from your Library first, then add them here.
            </p>

            <div className="space-y-3">
              {lessons.map((lesson, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex gap-2">
                    <div className="flex items-center text-muted-foreground/40 shrink-0 mt-2.5">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={lesson.url}
                          onChange={(e) => updateUrl(i, e.target.value)}
                          onBlur={() => lesson.url.trim() && resolveLessonUrl(i, lesson.url)}
                          placeholder="Paste lesson share link or ID"
                          className={`flex-1 px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background ${
                            lesson.error ? "border-destructive" : lesson.resolvedId ? "border-primary/40" : "border-border"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => lesson.url.trim() && resolveLessonUrl(i, lesson.url)}
                          disabled={!lesson.url.trim() || resolving === i}
                          className="px-3 py-2 rounded-xl bg-secondary text-sm font-medium hover:bg-secondary/80 disabled:opacity-50 transition-colors"
                        >
                          {resolving === i ? <Loader2 className="w-4 h-4 animate-spin" /> : "Check"}
                        </button>
                        {lessons.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLesson(i)}
                            className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {lesson.resolvedTitle && (
                        <p className="text-xs text-primary pl-1">✓ {lesson.resolvedTitle}</p>
                      )}
                      {lesson.error && (
                        <p className="text-xs text-destructive pl-1">{lesson.error}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addLesson}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Lesson
            </button>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : "Publish Course"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
