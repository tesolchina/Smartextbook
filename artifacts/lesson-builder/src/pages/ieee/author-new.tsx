import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, ArrowRight, ArrowLeft, Upload, Link2, FileText,
  Brain, CheckCircle, AlertTriangle, Edit, Send, LogIn,
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

const STEPS = [
  { label: "Upload Article", icon: <Upload className="w-4 h-4" /> },
  { label: "Generate Lesson", icon: <Brain className="w-4 h-4" /> },
  { label: "Review & Submit", icon: <CheckCircle className="w-4 h-4" /> },
];

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

type ParseState =
  | { status: "idle" }
  | { status: "parsing" }
  | { status: "done"; sections: Sections }
  | { status: "error"; message: string };

type GenerateState =
  | { status: "idle" }
  | { status: "generating" }
  | { status: "done"; lessonData: LessonData }
  | { status: "error"; message: string };

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "done"; id: number }
  | { status: "error"; message: string };

export default function IeeeAuthorNew() {
  const [_, setLocation] = useLocation();
  const { settings, getLlmConfig, isConfigured } = useSettings();
  const { openSettings } = useSettingsModal();
  const { user, loading: authLoading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [step, setStep] = useState(0);
  const [articleText, setArticleText] = useState("");
  const [doi, setDoi] = useState("");
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState<Sections>({});
  const [lessonData, setLessonData] = useState<LessonData>({});
  const [editingSections, setEditingSections] = useState(false);
  const [parseState, setParseState] = useState<ParseState>({ status: "idle" });
  const [generateState, setGenerateState] = useState<GenerateState>({ status: "idle" });
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  const handleParse = async () => {
    if (!articleText.trim()) return;
    if (!isConfigured) { openSettings(); return; }
    setParseState({ status: "parsing" });
    try {
      const res = await fetch("/api/ieee/parse-teaching-case", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleText,
          doi: doi.trim() || undefined,
          llmConfig: getLlmConfig(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setParseState({ status: "error", message: data.error || "Parsing failed." });
        return;
      }
      const s = data.sections ?? {};
      setSections(s);
      if (s.suggestedTitle && !title) setTitle(s.suggestedTitle);
      setParseState({ status: "done", sections: s });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error";
      setParseState({ status: "error", message });
    }
  };

  const handleGenerate = async () => {
    if (!isConfigured) { openSettings(); return; }
    setGenerateState({ status: "generating" });
    try {
      const res = await fetch("/api/ieee/generate-lesson", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections,
          title,
          llmConfig: getLlmConfig(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGenerateState({ status: "error", message: data.error || "Generation failed." });
        return;
      }
      setLessonData(data);
      setGenerateState({ status: "done", lessonData: data });
      setStep(2);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error";
      setGenerateState({ status: "error", message });
    }
  };

  async function createDraftSubmission() {
    const createRes = await fetch("/api/ieee/submissions", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        doi: doi.trim() || undefined,
        teachingCaseSections: sections,
        lessonData,
        topicArea: sections.topicArea || undefined,
        bloomsLevel: sections.bloomsLevel || undefined,
        publicationYear: sections.publicationYear || undefined,
        estimatedMinutes: sections.estimatedMinutes || undefined,
      }),
    });
    const createData = await createRes.json() as { submission?: { id: number }; error?: string };
    if (!createRes.ok) throw new Error(createData.error ?? "Failed to save submission");
    if (!createData.submission) throw new Error("No submission returned from server");
    return createData.submission;
  }

  const handleSaveAsDraft = async () => {
    if (!title.trim()) return;
    setSubmitState({ status: "submitting" });
    try {
      const submission = await createDraftSubmission();
      setSubmitState({ status: "done", id: submission.id });
      setTimeout(() => setLocation("/ieee/author"), 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error";
      setSubmitState({ status: "error", message });
    }
  };

  const handleSubmitForReview = async () => {
    if (!title.trim()) return;
    setSubmitState({ status: "submitting" });
    try {
      const submission = await createDraftSubmission();
      const submitRes = await fetch(`/api/ieee/submissions/${submission.id}/submit`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const submitData = await submitRes.json() as { error?: string };
      if (!submitRes.ok) throw new Error(submitData.error ?? "Failed to submit for review");
      setSubmitState({ status: "done", id: submission.id });
      setTimeout(() => setLocation("/ieee/author"), 2500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error";
      setSubmitState({ status: "error", message });
    }
  };

  return (
    <Layout>
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-3xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-8">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/ieee/author")} className="gap-1">
              <ArrowLeft className="w-4 h-4" />Back
            </Button>
            <div>
              <h1 className="text-2xl font-serif font-bold">New Teaching Case Submission</h1>
              <p className="text-muted-foreground text-sm">Upload your IEEE Teaching Case article and generate an interactive lesson.</p>
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
              <h2 className="font-semibold text-lg mb-2">Sign in to submit a Teaching Case</h2>
              <p className="text-muted-foreground text-sm mb-6">
                You need an account to submit IEEE Teaching Cases for review.
              </p>
              <Button onClick={() => setAuthModalOpen(true)} className="gap-2">
                <LogIn className="w-4 h-4" />Sign In
              </Button>
            </div>
          )}

          {!authLoading && user && (
            <div className="flex gap-1 mb-8">
              {STEPS.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    i === step
                      ? "bg-primary text-primary-foreground font-medium"
                      : i < step
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s.icon}
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </div>
              ))}
            </div>
          )}

          {!authLoading && user && <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
              >
                <div className="bg-background border border-border rounded-2xl p-6 space-y-5">
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
                    <p className="text-xs text-muted-foreground mt-1">
                      If provided, the DOI will be embedded in xAPI statements for traceability.
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Article Text <span className="text-destructive">*</span></label>
                    <Textarea
                      placeholder="Paste the full text of your IEEE Teaching Case article here. Include the abstract, learning objectives, case narrative, discussion questions, and any teaching notes."
                      className="min-h-[300px] font-mono text-xs leading-relaxed resize-y"
                      value={articleText}
                      onChange={(e) => setArticleText(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      The AI will detect and extract the IEEE Teaching Case sections automatically.
                    </p>
                  </div>

                  {!isConfigured && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4 text-sm">
                      You need to configure your AI API key before parsing.{" "}
                      <button onClick={openSettings} className="font-medium underline">
                        Configure now
                      </button>
                    </div>
                  )}

                  {parseState.status === "error" && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 text-sm flex gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      {parseState.message}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={handleParse}
                      disabled={!articleText.trim() || parseState.status === "parsing"}
                      className="gap-2"
                    >
                      {parseState.status === "parsing" ? (
                        <><Loader2 className="w-4 h-4 animate-spin" />Parsing…</>
                      ) : (
                        <><Brain className="w-4 h-4" />Parse Article</>
                      )}
                    </Button>
                    {parseState.status === "done" && (
                      <Button
                        variant="default"
                        className="gap-2"
                        onClick={() => setStep(1)}
                      >
                        Continue <ArrowRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {parseState.status === "done" && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
                        <CheckCircle className="w-4 h-4" />
                        Article parsed successfully
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {[
                          ["Abstract", !!sections.abstract],
                          ["Learning Objectives", !!sections.learningObjectives],
                          ["Case Narrative", !!sections.caseNarrative],
                          ["Discussion Questions", !!sections.discussionQuestions],
                          ["Appendices", !!sections.appendices],
                          ["Teaching Notes", !!sections.teachingNotes],
                        ].map(([label, found]) => (
                          <div key={label as string} className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${found ? "bg-green-500" : "bg-gray-300"}`} />
                            <span className={found ? "text-green-800" : "text-gray-500"}>{label as string}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
              >
                <div className="bg-background border border-border rounded-2xl p-6 space-y-5">
                  <div>
                    <h2 className="font-semibold text-lg mb-1">Review Parsed Sections</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      Review the extracted sections and edit if needed, then generate the lesson.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Lesson Title</label>
                        <Input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter the lesson title"
                        />
                      </div>

                      {[
                        { key: "abstract", label: "Abstract" },
                        { key: "learningObjectives", label: "Learning Objectives" },
                        { key: "caseNarrative", label: "Case Narrative" },
                        { key: "discussionQuestions", label: "Discussion Questions" },
                      ].map(({ key, label }) => (
                        <div key={key}>
                          <label className="text-sm font-medium mb-1 flex items-center gap-2">
                            {label}
                            {sections[key as keyof Sections] ? (
                              <Badge className="text-xs bg-green-100 text-green-800 border-green-200">Detected</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs text-yellow-700 border-yellow-200 bg-yellow-50">Not detected — fill in manually</Badge>
                            )}
                          </label>
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
                            <SelectTrigger>
                              <SelectValue placeholder="Select topic" />
                            </SelectTrigger>
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
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              {BLOOMS_OPTIONS.map((l) => (
                                <SelectItem key={l} value={l} className="capitalize">{l.charAt(0).toUpperCase() + l.slice(1)}</SelectItem>
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
                  </div>

                  {generateState.status === "error" && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 text-sm flex gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      {generateState.message}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(0)} className="gap-2">
                      <ArrowLeft className="w-4 h-4" />Back
                    </Button>
                    <Button
                      onClick={handleGenerate}
                      disabled={!title.trim() || generateState.status === "generating"}
                      className="gap-2"
                    >
                      {generateState.status === "generating" ? (
                        <><Loader2 className="w-4 h-4 animate-spin" />Generating Lesson…</>
                      ) : (
                        <><Brain className="w-4 h-4" />Generate Interactive Lesson</>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
              >
                <div className="space-y-4">
                  {submitState.status === "done" && (
                    <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-6 text-center">
                      <CheckCircle className="w-10 h-10 mx-auto mb-3" />
                      <h2 className="font-semibold text-lg mb-1">Submitted Successfully!</h2>
                      <p className="text-sm">Redirecting to your dashboard…</p>
                    </div>
                  )}

                  {submitState.status !== "done" && (
                    <>
                      <div className="bg-background border border-border rounded-2xl p-6">
                        <h2 className="font-semibold text-lg mb-1">Author</h2>
                        <p className="text-sm text-muted-foreground">Submitting as <strong>{user?.displayName || user?.email}</strong></p>
                      </div>

                      <div className="bg-background border border-border rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="font-semibold text-lg">Generated Lesson Preview</h2>
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />Generated
                          </Badge>
                        </div>
                        <div className="space-y-4 text-sm">
                          {lessonData.summary && (
                            <div>
                              <div className="font-medium text-muted-foreground mb-1">Summary</div>
                              <p className="leading-relaxed line-clamp-3">{lessonData.summary}</p>
                            </div>
                          )}
                          <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="bg-muted/50 rounded-xl p-3">
                              <div className="font-bold text-xl text-primary">{lessonData.keyConcepts?.length ?? 0}</div>
                              <div className="text-xs text-muted-foreground">Key Concepts</div>
                            </div>
                            <div className="bg-muted/50 rounded-xl p-3">
                              <div className="font-bold text-xl text-primary">{lessonData.quizQuestions?.length ?? 0}</div>
                              <div className="text-xs text-muted-foreground">Quiz Questions</div>
                            </div>
                            <div className="bg-muted/50 rounded-xl p-3">
                              <div className="font-bold text-xl text-primary">{lessonData.reflectionActivities?.length ?? 0}</div>
                              <div className="text-xs text-muted-foreground">Reflections</div>
                            </div>
                          </div>
                          {lessonData.bloomsObjectives && lessonData.bloomsObjectives.length > 0 && (
                            <div>
                              <div className="font-medium text-muted-foreground mb-2">Learning Objectives</div>
                              <ul className="space-y-1">
                                {lessonData.bloomsObjectives.slice(0, 3).map((obj, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <Badge variant="outline" className="capitalize text-xs shrink-0">{obj.level}</Badge>
                                    <span className="text-sm line-clamp-1">{obj.objective}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {submitState.status === "error" && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 text-sm flex gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                          {submitState.message}
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                          <ArrowLeft className="w-4 h-4" />Back
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleSaveAsDraft}
                          disabled={!title.trim() || submitState.status === "submitting"}
                          className="gap-2"
                        >
                          {submitState.status === "submitting" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                          Save as Draft
                        </Button>
                        <Button
                          onClick={handleSubmitForReview}
                          disabled={!title.trim() || submitState.status === "submitting"}
                          className="gap-2"
                        >
                          {submitState.status === "submitting" ? (
                            <><Loader2 className="w-4 h-4 animate-spin" />Submitting…</>
                          ) : (
                            <><Send className="w-4 h-4" />Submit for Review</>
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>}
        </div>
      </div>
    </Layout>
  );
}
