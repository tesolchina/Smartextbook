import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Bot, Sparkles, Eye, EyeOff } from "lucide-react";
import { type StoredLesson } from "@/hooks/use-lessons-store";
import { type TutorConfig, buildSystemPrompt, generateLessonHtml } from "@/lib/generate-html";
import { PROVIDERS } from "@/lib/providers";

interface Props {
  lesson: StoredLesson;
  open: boolean;
  onClose: () => void;
}

type Style = TutorConfig["style"];

const STYLES: { id: Style; label: string; desc: string }[] = [
  { id: "explanatory", label: "Clear Explainer", desc: "Uses examples and analogies to make ideas concrete" },
  { id: "socratic",    label: "Socratic Guide",  desc: "Asks questions to lead the student to answers" },
  { id: "exam",        label: "Exam Coach",      desc: "Focuses on testable facts and common misconceptions" },
  { id: "mentor",      label: "Warm Mentor",     desc: "Encouraging, builds confidence alongside knowledge" },
];

const EXPORT_PROVIDERS = PROVIDERS.filter((p) => p.id !== "custom");

export function ExportModal({ lesson, open, onClose }: Props) {
  const [tutorName, setTutorName] = useState("Aria");
  const [style, setStyle] = useState<Style>("explanatory");
  const [focus, setFocus] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [embedProvider, setEmbedProvider] = useState("openai");
  const [embedModel, setEmbedModel] = useState("gpt-4o-mini");

  const selectedProvider = EXPORT_PROVIDERS.find((p) => p.id === embedProvider);

  useEffect(() => {
    if (selectedProvider && selectedProvider.models.length > 0) {
      setEmbedModel(selectedProvider.models[0].id);
    }
  }, [embedProvider]);

  const systemPrompt = buildSystemPrompt(lesson, {
    name: tutorName || "Aria",
    style,
    focus,
  });

  const handleDownload = () => {
    const tutor: TutorConfig = {
      name: tutorName || "Aria",
      style,
      focus,
      systemPrompt,
      provider: embedProvider,
      baseUrl: selectedProvider?.baseUrl ?? "",
      model: embedModel,
    };

    const html = generateLessonHtml(lesson, tutor);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${lesson.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-lesson.html`;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative w-full max-w-xl bg-background border border-border rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />

            {/* Header */}
            <div className="flex items-center justify-between p-5 pb-4 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-lg">Export as Standalone Page</h2>
                  <p className="text-xs text-muted-foreground">Customize your AI tutor, then download</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-5 space-y-5">
              {/* Tutor name */}
              <div>
                <label className="block text-sm font-bold mb-1.5 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" /> Tutor name
                </label>
                <input
                  type="text"
                  value={tutorName}
                  onChange={(e) => setTutorName(e.target.value)}
                  placeholder="e.g. Aria, Professor Lee, Max…"
                  maxLength={40}
                  className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              {/* Teaching style */}
              <div>
                <label className="block text-sm font-bold mb-2">Teaching style</label>
                <div className="grid grid-cols-2 gap-2">
                  {STYLES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStyle(s.id)}
                      className={`text-left p-3 rounded-xl border-2 transition-all ${
                        style === s.id
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      <p className="text-xs font-bold mb-0.5">{s.label}</p>
                      <p className="text-[11px] leading-tight">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional focus */}
              <div>
                <label className="block text-sm font-bold mb-1.5">
                  Additional focus <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  placeholder='e.g. "Use visual analogies" or "Focus on practical applications" or "Speak like Richard Feynman"'
                  rows={2}
                  className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                />
              </div>

              {/* System prompt preview */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowPrompt((v) => !v)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPrompt ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showPrompt ? "Hide" : "Preview"} generated system prompt
                </button>
                <AnimatePresence>
                  {showPrompt && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <pre className="mt-2 p-3 bg-secondary rounded-xl text-[11px] text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed max-h-40 overflow-y-auto border border-border">
                        {systemPrompt}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Provider hint for embedded chatbot */}
              <div className="p-3.5 rounded-xl bg-secondary/60 border border-border/60 space-y-2.5">
                <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> Default provider in the exported file
                </p>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-[11px] text-muted-foreground mb-1">Provider</label>
                    <select
                      value={embedProvider}
                      onChange={(e) => setEmbedProvider(e.target.value)}
                      className="w-full bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary transition-all"
                    >
                      {EXPORT_PROVIDERS.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[11px] text-muted-foreground mb-1">Default model</label>
                    {selectedProvider && selectedProvider.models.length > 0 ? (
                      <select
                        value={embedModel}
                        onChange={(e) => setEmbedModel(e.target.value)}
                        className="w-full bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary transition-all"
                      >
                        {selectedProvider.models.map((m) => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={embedModel}
                        onChange={(e) => setEmbedModel(e.target.value)}
                        className="w-full bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary transition-all"
                      />
                    )}
                  </div>
                </div>
                {embedProvider === "poe" && (
                  <div className="flex gap-2 px-2.5 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed dark:bg-amber-950/30 dark:border-amber-800/40 dark:text-amber-300">
                    <span className="shrink-0">ℹ️</span>
                    <span>Students who open this file will need their own <strong>Poe subscription</strong> and API key to use the tutor. The model name is a Poe bot handle (e.g. <code className="bg-amber-100 dark:bg-amber-900/50 px-0.5 rounded">Claude-3-Haiku</code>).</span>
                  </div>
                )}
                <p className="text-[11px] text-muted-foreground">
                  Users can change the provider and model when they open the file — this is just the default pre-selected for them.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-5 pt-4 border-t border-border shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" /> Download HTML
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
