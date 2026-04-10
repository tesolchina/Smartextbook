import { Loader2, BookOpen, Users, Target, ClipboardList, ChevronLeft, CheckCircle2 } from "lucide-react";
import {
  type LearnerPreferences,
  AUDIENCES, GOALS, QUIZ_TEMPLATES, STAGES,
  type SubjectType,
} from "@/lib/lesson-form-types";

interface Props {
  prefs: LearnerPreferences;
  setPrefs: React.Dispatch<React.SetStateAction<LearnerPreferences>>;
  isGenerating: boolean;
  stageIndex: number;
  remaining: number;
  progressPct: number;
  onBack: () => void;
  onClose: () => void;
  onGenerate: () => void;
}

export function LessonFormStep2({
  prefs, setPrefs,
  isGenerating, stageIndex, remaining, progressPct,
  onBack, onClose, onGenerate,
}: Props) {
  return (
    <div className="space-y-6">

      {/* Subject type */}
      <div>
        <label className="flex items-center gap-1.5 text-sm font-bold text-foreground mb-2.5">
          <BookOpen className="w-4 h-4 text-primary" /> What type of subject is this?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { id: "general" as SubjectType,  emoji: "📚", label: "General Subject",     desc: "Facts, concepts, theory — any content subject" },
              { id: "language" as SubjectType, emoji: "✍️", label: "Language & Writing",  desc: "English writing, reading, academic literacy" },
            ] as const
          ).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setPrefs((p) => ({ ...p, subjectType: s.id }))}
              className={`text-left p-3 rounded-xl border-2 transition-all ${
                prefs.subjectType === s.id
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <span className="text-lg">{s.emoji}</span>
              <p className="font-semibold text-sm mt-1">{s.label}</p>
              <p className="text-xs opacity-70 mt-0.5">{s.desc}</p>
            </button>
          ))}
        </div>
        {prefs.subjectType === "language" && (
          <p className="text-xs text-primary/80 mt-2 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
            Writing Practice cards will be generated — sentence analysis, rewrite tasks, vocabulary in context, and more.
          </p>
        )}
      </div>

      {/* Audience */}
      <div>
        <label className="flex items-center gap-1.5 text-sm font-bold text-foreground mb-2.5">
          <Users className="w-4 h-4 text-primary" /> Who is this lesson for?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {AUDIENCES.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setPrefs((p) => ({ ...p, audience: a.id }))}
              className={`text-left p-3 rounded-xl border-2 transition-all ${
                prefs.audience === a.id
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span>{a.emoji}</span>
                <span className="text-xs font-bold">{a.label}</span>
              </div>
              <p className="text-[11px] leading-tight">{a.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Goal */}
      <div>
        <label className="flex items-center gap-1.5 text-sm font-bold text-foreground mb-2.5">
          <Target className="w-4 h-4 text-primary" /> What's the learning goal?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {GOALS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setPrefs((p) => ({ ...p, goal: g.id }))}
              className={`text-left p-3 rounded-xl border-2 transition-all ${
                prefs.goal === g.id
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <p className="text-xs font-bold mb-0.5">{g.label}</p>
              <p className="text-[11px] leading-tight">{g.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Quiz format */}
      <div>
        <label className="flex items-center gap-1.5 text-sm font-bold text-foreground mb-2.5">
          <ClipboardList className="w-4 h-4 text-primary" /> Quiz format
        </label>
        <div className="grid grid-cols-3 gap-2">
          {QUIZ_TEMPLATES.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setPrefs((p) => ({ ...p, quizTemplate: q.id }))}
              className={`text-left p-3 rounded-xl border-2 transition-all ${
                prefs.quizTemplate === q.id
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <p className="text-xs font-bold mb-1">{q.label}</p>
              <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full mb-1 ${q.badge}`}>
                {q.count}
              </span>
              <p className="text-[11px] leading-tight">{q.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom goal */}
      <div>
        <label className="block text-sm font-bold text-foreground mb-1.5">
          Specific learning outcome <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={prefs.customGoal}
          onChange={(e) => setPrefs((p) => ({ ...p, customGoal: e.target.value }))}
          placeholder="e.g. Students should be able to write a proper academic citation"
          maxLength={300}
          className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
        />
      </div>

      {/* Progress indicator */}
      {isGenerating && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-primary">
            <span className="flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {STAGES[stageIndex].label}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {remaining > 0 ? `~${remaining}s remaining` : "Almost done…"}
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
              const done   = stageIndex > i;
              const active = stageIndex === i;
              return (
                <span
                  key={s.label}
                  className={`flex items-center gap-1 text-xs transition-colors ${
                    done ? "text-green-600 dark:text-green-400" : active ? "text-primary font-semibold" : "text-muted-foreground/50"
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

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <button
          type="button"
          onClick={onBack}
          disabled={isGenerating}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-secondary disabled:opacity-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-secondary disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isGenerating
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
              : <>Generate Lesson</>}
          </button>
        </div>
      </div>
    </div>
  );
}
