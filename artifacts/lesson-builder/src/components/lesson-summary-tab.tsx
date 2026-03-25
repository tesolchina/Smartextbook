import { Sparkles } from "lucide-react";
import { MarkdownRenderer } from "./markdown-renderer";
import { type StoredLesson } from "@/hooks/use-lessons-store";

interface Props {
  lesson: StoredLesson;
}

export function LessonSummaryTab({ lesson }: Props) {
  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <section>
        <h2 className="text-xl font-serif font-bold mb-3 flex items-center gap-2 text-foreground border-b border-border pb-2">
          <Sparkles className="w-5 h-5 text-accent" /> Summary
        </h2>
        <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
          <MarkdownRenderer content={lesson.summary} className="text-base leading-relaxed" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold mb-4 flex items-center gap-2 text-foreground border-b border-border pb-2">
          <BookOpenIcon className="w-5 h-5 text-primary" /> Key Concepts
        </h2>

        {lesson.keyConcepts?.length > 0 ? (
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
          <p className="text-muted-foreground text-sm">No key concepts extracted.</p>
        )}
      </section>
    </div>
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
