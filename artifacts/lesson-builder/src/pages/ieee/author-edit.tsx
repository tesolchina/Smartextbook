import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, ArrowLeft, Brain, CheckCircle, AlertTriangle, Send, LogIn,
  FileText, Link2,
} from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useSettings } from "@/hooks/use-settings";
import { useSettingsModal } from "@/hooks/use-settings-modal";
import { useAuth } from "@/hooks/use-auth";
import { AuthModal } from "@/components/auth-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Sections = {
  abstract?: string;
  learningObjectives?: string;
  caseNarrative?: string;
  discussionQuestions?: string;
  appendices?: string;
  teachingNotes?: string;
  suggestedTitle?: string;
  topicArea?: string;
  bloomsLevel?: string;
  publicationYear?: string;
  estimatedMinutes?: string;
};

type LessonData = {
  summary?: string;
  bloomsObjectives?: Array<{ objective: string; level: string }>;
  keyConcepts?: Array<{ term: string; definition: string }>;
  glossary?: Array<{ term: string; definition: string }>;
  quizQuestions?: Array<{ question: string; options: string[]; correctIndex: number; explanation: string }>;
  reflectionActivities?: Array<{ prompt: string; guidance: string }>;
};

type SubmissionDetail = {
  id: number;
  title: string;
  doi: string | null;
  status: string;
  adminNotes: string | null;
  teachingCaseSections: Sections;
  lessonData: LessonData;
  topicArea: string | null;
  bloomsLevel: string | null;
  publicationYear: string | null;
  estimatedMinutes: string | null;
};

const TOPIC_OPTIONS = [
  { value: "technical-writing", label: "Technical Writing" },
  { value: "presentations", label: "Presentations" },
  { value: "intercultural-communication", label: "Intercultural Communication" },
  { value: "workplace-writing", label: "Workplace Writing" },
  { value: "digital-communication", label: "Digital Communication" },
  { value: "research-communication", label: "Research Communication" },
  { value: "leadership-communication", label: "Leadership Communication" },
  { value: "other", label: "Other" },
];

const BLOOMS_OPTIONS = ["remember", "understand", "apply", "analyze", "evaluate", "create"];

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; submission: SubmissionDetail };

type SaveState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "done" }
  | { status: "error"; message: string };

type GenerateState =
  | { status: "idle" }
  | { status: "generating" }
  | { status: "done"; lessonData: LessonData }
  | { status: "error"; message: string };

export default function IeeeAuthorEdit() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { getLlmConfig, isConfigured } = useSettings();
  const { openSettings } = useSettingsModal();
  const { user, loading: authLoading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle" });
  const [generateState, setGenerateState] = useState<GenerateState>({ status: "idle" });

  const [title, setTitle] = useState("");
  const [doi, setDoi] = useState("");
  const [sections, setSections] = useState<Sections>({});
  const [lessonData, setLessonData] = useState<LessonData>({});

  useEffect(() => {
    if (!user || !params.id) return;
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      setLoadState({ status: "error", message: "Invalid submission ID" });
      return;
    }
    fetch(`/api/ieee/submissions/${id}`, { credentials: "include" })
      .then((r) => r.json().then((d) => ({ ok: r.ok, data: d as { submission?: SubmissionDetail; error?: string } })))
      .then(({ ok, data }) => {
        if (!ok || !data.submission) {
          setLoadState({ status: "error", message: data.error ?? "Submission not found" });
        } else if (data.submission.status !== "rejected") {
          setLoadState({ status: "error", message: `This submission has status "${data.submission.status}" and cannot be edited here. Only rejected submissions can be revised.` });
        } else {
          const s = data.submission;
          setTitle(s.title);
          setDoi(s.doi ?? "");
          setSections(s.teachingCaseSections ?? {});
          setLessonData(s.lessonData ?? {});
          setLoadState({ status: "ready", submission: s });
        }
      })
      .catch((err: unknown) =>
        setLoadState({ status: "error", message: err instanceof Error ? err.message : "Network error" })
      );
  }, [user, params.id]);

  const handleRegenerateLesson = async () => {
    if (!isConfigured) { openSettings(); return; }
    setGenerateState({ status: "generating" });
    try {
      const res = await fetch("/api/ieee/generate-lesson", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections, title, llmConfig: getLlmConfig() }),
      });
      const data = await res.json() as LessonData & { error?: string };
      if (!res.ok) {
        setGenerateState({ status: "error", message: data.error ?? "Generation failed." });
        return;
      }
      setLessonData(data);
      setGenerateState({ status: "done", lessonData: data });
    } catch (err: unknown) {
      setGenerateState({ status: "error", message: err instanceof Error ? err.message : "Network error" });
    }
  };

  const handleSaveAndResubmit = async () => {
    if (!params.id || !title.trim()) return;
    const id = parseInt(params.id, 10);
    setSaveState({ status: "saving" });
    try {
      const patchRes = await fetch(`/api/ieee/submissions/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          doi: doi.trim() || null,
          teachingCaseSections: sections,
          lessonData,
          topicArea: sections.topicArea || null,
          bloomsLevel: sections.bloomsLevel || null,
          publicationYear: sections.publicationYear || null,
          estimatedMinutes: sections.estimatedMinutes || null,
        }),
      });
      const patchData = await patchRes.json() as { error?: string };
      if (!patchRes.ok) throw new Error(patchData.error ?? "Failed to save changes");

      const resubmitRes = await fetch(`/api/ieee/submissions/${id}/resubmit`, {
        method: "POST",
        credentials: "include",
      });
      const resubmitData = await resubmitRes.json() as { error?: string };
      if (!resubmitRes.ok) throw new Error(resubmitData.error ?? "Failed to resubmit");

      setSaveState({ status: "done" });
      setTimeout(() => navigate("/ieee/author"), 2000);
    } catch (err: unknown) {
      setSaveState({ status: "error", message: err instanceof Error ? err.message : "Network error" });
    }
  };

  const handleSaveAsDraft = async () => {
    if (!params.id || !title.trim()) return;
    const id = parseInt(params.id, 10);
    setSaveState({ status: "saving" });
    try {
      const res = await fetch(`/api/ieee/submissions/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          doi: doi.trim() || null,
          teachingCaseSections: sections,
          lessonData,
          topicArea: sections.topicArea || null,
          bloomsLevel: sections.bloomsLevel || null,
          publicationYear: sections.publicationYear || null,
          estimatedMinutes: sections.estimatedMinutes || null,
        }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to save");
      setSaveState({ status: "done" });
      setTimeout(() => navigate("/ieee/author"), 1500);
    } catch (err: unknown) {
      setSaveState({ status: "error", message: err instanceof Error ? err.message : "Network error" });
    }
  };

  return (
    <Layout>
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-3xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-8">
            <Button variant="ghost" size="sm" onClick={() => navigate("/ieee/author")} className="gap-1">
              <ArrowLeft className="w-4 h-4" />Back
            </Button>
            <div>
              <h1 className="text-2xl font-serif font-bold">Revise Submission</h1>
              <p className="text-muted-foreground text-sm">Update your rejected submission and resubmit for review.</p>
            </div>
          </div>

          {authLoading && (
            <div className="flex justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />Checking session…
            </div>
          )}

          {!authLoading && !user && (
            <div className="bg-background border border-border rounded-2xl p-8 text-center">
              <LogIn className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="font-semibold text-lg mb-2">Sign in to edit your submission</h2>
              <Button onClick={() => setAuthModalOpen(true)} className="gap-2">
                <LogIn className="w-4 h-4" />Sign In
              </Button>
            </div>
          )}

          {!authLoading && user && loadState.status === "loading" && (
            <div className="flex justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />Loading submission…
            </div>
          )}

          {!authLoading && user && loadState.status === "error" && (
            <div className="flex flex-col items-center py-12 gap-3">
              <AlertTriangle className="w-8 h-8 text-destructive" />
              <p className="text-destructive text-center">{loadState.message}</p>
              <Button variant="outline" onClick={() => navigate("/ieee/author")}>
                Back to Dashboard
              </Button>
            </div>
          )}

          {!authLoading && user && loadState.status === "ready" && (
            <div className="space-y-5">
              {/* Reviewer feedback banner */}
              {loadState.submission.adminNotes && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                  <p className="text-sm font-semibold text-red-800 mb-1">Reviewer feedback</p>
                  <p className="text-sm text-red-700">{loadState.submission.adminNotes}</p>
                </div>
              )}

              {saveState.status === "done" && (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-5 text-center">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-semibold">Changes saved. Redirecting…</p>
                </div>
              )}

              {saveState.status === "error" && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 text-sm flex gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  {saveState.message}
                </div>
              )}

              {/* Edit form */}
              <div className="bg-background border border-border rounded-2xl p-6 space-y-5">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Lesson Title <span className="text-destructive">*</span></label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Lesson title" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Article DOI (optional)</label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="10.1109/TPC.XXXX.XXXXXXX"
                      value={doi}
                      onChange={(e) => setDoi(e.target.value)}
                    />
                  </div>
                </div>

                {[
                  { key: "abstract", label: "Abstract" },
                  { key: "learningObjectives", label: "Learning Objectives" },
                  { key: "caseNarrative", label: "Case Narrative" },
                  { key: "discussionQuestions", label: "Discussion Questions" },
                  { key: "teachingNotes", label: "Teaching Notes" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-sm font-medium mb-1 block">{label}</label>
                    <Textarea
                      className="min-h-[80px] text-sm"
                      value={sections[key as keyof Sections] ?? ""}
                      onChange={(e) => setSections((prev) => ({ ...prev, [key]: e.target.value }))}
                      placeholder={`Enter the ${label.toLowerCase()}…`}
                    />
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Topic Area</label>
                    <Select
                      value={sections.topicArea ?? ""}
                      onValueChange={(v) => setSections((prev) => ({ ...prev, topicArea: v }))}
                    >
                      <SelectTrigger><SelectValue placeholder="Select topic" /></SelectTrigger>
                      <SelectContent>
                        {TOPIC_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Bloom's Level</label>
                    <Select
                      value={sections.bloomsLevel ?? ""}
                      onValueChange={(v) => setSections((prev) => ({ ...prev, bloomsLevel: v }))}
                    >
                      <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                      <SelectContent>
                        {BLOOMS_OPTIONS.map((l) => (
                          <SelectItem key={l} value={l} className="capitalize">
                            {l.charAt(0).toUpperCase() + l.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Publication Year</label>
                    <Input
                      placeholder="e.g. 2024"
                      value={sections.publicationYear ?? ""}
                      onChange={(e) => setSections((prev) => ({ ...prev, publicationYear: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Est. Completion (minutes)</label>
                    <Input
                      placeholder="e.g. 45"
                      type="number"
                      value={sections.estimatedMinutes ?? ""}
                      onChange={(e) => setSections((prev) => ({ ...prev, estimatedMinutes: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Re-generate lesson panel */}
              <div className="bg-background border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="font-semibold">Interactive Lesson</h2>
                    <p className="text-sm text-muted-foreground">
                      {Object.keys(lessonData).length > 0
                        ? "Lesson already generated. Optionally regenerate after editing sections."
                        : "No lesson generated yet. Generate one before resubmitting."}
                    </p>
                  </div>
                  {Object.keys(lessonData).length > 0 && (
                    <div className="flex gap-3 text-center text-sm">
                      <div>
                        <div className="font-bold text-primary">{lessonData.keyConcepts?.length ?? 0}</div>
                        <div className="text-xs text-muted-foreground">Concepts</div>
                      </div>
                      <div>
                        <div className="font-bold text-primary">{lessonData.quizQuestions?.length ?? 0}</div>
                        <div className="text-xs text-muted-foreground">Questions</div>
                      </div>
                      <div>
                        <div className="font-bold text-primary">{lessonData.reflectionActivities?.length ?? 0}</div>
                        <div className="text-xs text-muted-foreground">Reflections</div>
                      </div>
                    </div>
                  )}
                </div>

                {generateState.status === "error" && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-3 text-sm flex gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    {generateState.message}
                  </div>
                )}

                {generateState.status === "done" && (
                  <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-3 text-sm flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4" />Lesson regenerated successfully.
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={handleRegenerateLesson}
                  disabled={generateState.status === "generating" || !title.trim()}
                  className="gap-2"
                >
                  {generateState.status === "generating" ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Regenerating…</>
                  ) : (
                    <><Brain className="w-4 h-4" />Regenerate Lesson</>
                  )}
                </Button>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleSaveAsDraft}
                  disabled={!title.trim() || saveState.status === "saving"}
                >
                  {saveState.status === "saving" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                  <span className="ml-2">Save Changes</span>
                </Button>
                <Button
                  onClick={handleSaveAndResubmit}
                  disabled={!title.trim() || saveState.status === "saving"}
                  className="gap-2"
                >
                  {saveState.status === "saving" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Save & Resubmit for Review
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
