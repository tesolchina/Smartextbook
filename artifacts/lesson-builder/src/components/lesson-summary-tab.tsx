import { useState } from "react";
import { Sparkles, LayoutGrid, GalleryHorizontalEnd, RotateCcw, ChevronLeft, ChevronRight, PenLine } from "lucide-react";
import { FlashcardArray, useFlashcardArray } from "react-quizlet-flashcard";
import "react-quizlet-flashcard/dist/index.css";
import { MarkdownRenderer } from "./markdown-renderer";
import { type StoredLesson, type PracticeCard } from "@/hooks/use-lessons-store";

interface Props {
  lesson: StoredLesson;
}

type ConceptView = "grid" | "cards";

function FlashcardDeck({ concepts }: { concepts: { term: string; definition: string }[] }) {
  const deck = concepts.map((c) => ({
    front: {
      html: (
        <div className="fc-face fc-front">
          <span className="fc-label">TERM</span>
          <p className="fc-term">{c.term}</p>
          <span className="fc-hint">tap to reveal</span>
        </div>
      ),
    },
    back: {
      html: (
        <div className="fc-face fc-back">
          <span className="fc-label">DEFINITION</span>
          <p className="fc-def">{c.definition}</p>
        </div>
      ),
    },
  }));

  const hook = useFlashcardArray({
    deckLength: deck.length,
    showCount: false,
    showControls: false,
    showProgressBar: false,
    cycle: false,
  });

  const pct = Math.round((hook.progressBar.current / hook.progressBar.total) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground tabular-nums whitespace-nowrap">
          {hook.progressBar.current} / {hook.progressBar.total}
        </span>
      </div>

      <FlashcardArray deck={deck} style={{ width: "100%" }} flipArrayHook={hook} />

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={hook.prevCard}
          disabled={!hook.canGoPrev}
          className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-30 transition-all"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => hook.setCurrentCard(1)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
        >
          <RotateCcw className="w-3 h-3" /> Restart
        </button>

        <button
          onClick={hook.nextCard}
          disabled={!hook.canGoNext}
          className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-30 transition-all"
          aria-label="Next card"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Click a card to flip · Use arrows to navigate
      </p>
    </div>
  );
}

function PracticeCardDeck({ cards }: { cards: PracticeCard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[index];
  const total = cards.length;
  const pct = Math.round(((index + 1) / total) * 100);

  const goTo = (i: number) => {
    setIndex(i);
    setFlipped(false);
  };

  const prev = () => { if (index > 0) goTo(index - 1); };
  const next = () => { if (index < total - 1) goTo(index + 1); };
  const restart = () => goTo(0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground tabular-nums whitespace-nowrap">
          {index + 1} / {total}
        </span>
      </div>

      <div
        className="pc-scene"
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") setFlipped((f) => !f); }}
        aria-label={flipped ? "Show task" : "Show model answer"}
      >
        <div className={`pc-card ${flipped ? "pc-card--flipped" : ""}`}>
          <div className="pc-face pc-face--front">
            <span className="pc-badge pc-badge--task">TASK</span>
            <p className="pc-prompt">{card.prompt}</p>
            <span className="pc-hint">tap to reveal model answer</span>
          </div>
          <div className="pc-face pc-face--back">
            <span className="pc-badge pc-badge--model">MODEL ANSWER</span>
            <p className="pc-model">{card.model}</p>
            {card.tip && (
              <p className="pc-tip">
                <span className="pc-tip-label">Teacher note:</span> {card.tip}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={prev}
          disabled={index === 0}
          className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-emerald-400/60 disabled:opacity-30 transition-all"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={restart}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-emerald-400/60 transition-all"
        >
          <RotateCcw className="w-3 h-3" /> Restart
        </button>

        <button
          onClick={next}
          disabled={index === total - 1}
          className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-emerald-400/60 disabled:opacity-30 transition-all"
          aria-label="Next card"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Click a card to reveal the answer · Use arrows to navigate
      </p>
    </div>
  );
}

export function LessonSummaryTab({ lesson }: Props) {
  const [conceptView, setConceptView] = useState<ConceptView>("grid");

  return (
    <>
      <style>{`
        /* ── Vocab flashcard overrides ── */
        .FlashcardArrayWrapper { width: 100% !important; }
        .FlashcardArrayWrapper--CardBox { width: 100% !important; max-width: 540px !important; margin: 0 auto !important; }
        .FlashcardArray--card { border-radius: 1.25rem !important; border: 1px solid hsl(var(--border)) !important; box-shadow: 0 4px 24px -6px rgba(0,0,0,0.1) !important; cursor: pointer !important; }
        .FlashcardArray--front { background: hsl(var(--card)) !important; border-radius: 1.25rem !important; }
        .FlashcardArray--back { background: hsl(var(--primary) / 0.06) !important; border-radius: 1.25rem !important; }
        .FlashcardArrayWrapper--controls { display: none !important; }
        .fc-face { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; padding:1.75rem 2rem; text-align:center; gap:0.6rem; box-sizing:border-box; }
        .fc-label { font-size:0.6rem; font-weight:800; letter-spacing:0.14em; color:hsl(var(--primary)); opacity:0.75; }
        .fc-term { font-size:1.3rem; font-weight:700; color:hsl(var(--foreground)); font-family:var(--font-serif,Georgia,serif); line-height:1.3; margin:0; }
        .fc-def { font-size:0.9rem; line-height:1.65; color:hsl(var(--foreground)); margin:0; }
        .fc-hint { font-size:0.65rem; color:hsl(var(--muted-foreground)); opacity:0.7; margin-top:0.1rem; }

        /* ── Practice card flip ── */
        .pc-scene { width:100%; max-width:600px; margin:0 auto; perspective:1200px; cursor:pointer; }
        .pc-card { position:relative; width:100%; min-height:220px; transform-style:preserve-3d; transition:transform 0.45s cubic-bezier(0.4,0,0.2,1); }
        .pc-card--flipped { transform:rotateY(180deg); }
        .pc-face { position:absolute; inset:0; backface-visibility:hidden; -webkit-backface-visibility:hidden; border-radius:1.25rem; border:1px solid hsl(var(--border)); padding:1.5rem 1.75rem; display:flex; flex-direction:column; gap:0.75rem; box-shadow:0 4px 24px -6px rgba(0,0,0,0.09); }
        .pc-face--front { background:hsl(var(--card)); }
        .pc-face--back { background:hsl(142 76% 96%); transform:rotateY(180deg); }
        .dark .pc-face--back { background:hsl(142 30% 12%); }
        .pc-badge { display:inline-block; font-size:0.6rem; font-weight:800; letter-spacing:0.14em; padding:0.2rem 0.55rem; border-radius:999px; align-self:flex-start; }
        .pc-badge--task { background:hsl(var(--primary)/0.12); color:hsl(var(--primary)); }
        .pc-badge--model { background:hsl(142 60% 85%); color:hsl(142 60% 28%); }
        .dark .pc-badge--model { background:hsl(142 30% 20%); color:hsl(142 60% 70%); }
        .pc-prompt { font-size:0.95rem; line-height:1.7; color:hsl(var(--foreground)); margin:0; font-style:italic; }
        .pc-model { font-size:0.92rem; line-height:1.7; color:hsl(var(--foreground)); margin:0; }
        .pc-tip { font-size:0.78rem; line-height:1.5; color:hsl(var(--muted-foreground)); margin:0; border-top:1px solid hsl(var(--border)/0.5); padding-top:0.65rem; }
        .pc-tip-label { font-weight:700; color:hsl(142 50% 40%); }
        .dark .pc-tip-label { color:hsl(142 50% 60%); }
        .pc-hint { font-size:0.65rem; color:hsl(var(--muted-foreground)); opacity:0.7; margin-top:auto; }
      `}</style>

      <div className="space-y-10 max-w-4xl mx-auto">
        {/* Summary */}
        <section>
          <h2 className="text-xl font-serif font-bold mb-3 flex items-center gap-2 text-foreground border-b border-border pb-2">
            <Sparkles className="w-5 h-5 text-accent" /> Summary
          </h2>
          <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
            <MarkdownRenderer content={lesson.summary} className="text-base leading-relaxed" />
          </div>
        </section>

        {/* Key Concepts */}
        <section>
          <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
            <h2 className="text-xl font-serif font-bold flex items-center gap-2 text-foreground">
              <BookOpenIcon className="w-5 h-5 text-primary" /> Key Concepts
              {lesson.keyConcepts?.length > 0 && (
                <span className="text-xs font-normal text-muted-foreground font-sans">
                  ({lesson.keyConcepts.length})
                </span>
              )}
            </h2>

            {lesson.keyConcepts?.length > 0 && (
              <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg text-xs">
                <button
                  onClick={() => setConceptView("grid")}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-semibold transition-all ${
                    conceptView === "grid"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" /> Grid
                </button>
                <button
                  onClick={() => setConceptView("cards")}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-semibold transition-all ${
                    conceptView === "cards"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <GalleryHorizontalEnd className="w-3.5 h-3.5" /> Study Cards
                </button>
              </div>
            )}
          </div>

          {lesson.keyConcepts?.length > 0 ? (
            conceptView === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lesson.keyConcepts.map((concept, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border/60 p-4 rounded-xl hover:shadow-md hover:border-primary/25 transition-all group"
                  >
                    <h3 className="font-bold text-sm text-foreground mb-1.5 group-hover:text-primary transition-colors">
                      {concept.term}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {concept.definition}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <FlashcardDeck concepts={lesson.keyConcepts} />
            )
          ) : (
            <p className="text-muted-foreground text-sm">No key concepts extracted.</p>
          )}
        </section>

        {/* Writing Practice Cards — only shown when practiceCards exist */}
        {lesson.practiceCards && lesson.practiceCards.length > 0 && (
          <section>
            <div className="border-b border-border pb-2 mb-4">
              <h2 className="text-xl font-serif font-bold flex items-center gap-2 text-foreground">
                <PenLine className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Writing Practice
                <span className="text-xs font-normal text-muted-foreground font-sans">
                  ({lesson.practiceCards.length} tasks)
                </span>
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Sentence-level tasks for writing, reading, and academic literacy skills.
              </p>
            </div>
            <PracticeCardDeck cards={lesson.practiceCards} />
          </section>
        )}
      </div>
    </>
  );
}

function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
