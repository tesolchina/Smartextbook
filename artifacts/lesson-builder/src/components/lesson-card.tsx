import { Link } from "wouter";
import { Trash2, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { type StoredLesson } from "@/hooks/use-lessons-store";

interface LessonCardProps {
  lesson: StoredLesson;
  onDelete: (id: string) => void;
}

export function LessonCard({ lesson, onDelete }: LessonCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Delete this lesson? This cannot be undone.")) {
      onDelete(lesson.id);
    }
  };

  const preview = lesson.summary
    ? lesson.summary.slice(0, 160) + (lesson.summary.length > 160 ? "…" : "")
    : lesson.chapterText.slice(0, 160) + "…";

  const conceptCount = lesson.keyConcepts?.length ?? 0;
  const quizCount = lesson.quizQuestions?.length ?? 0;

  return (
    <Link href={`/lessons/${lesson.id}`}>
      <div className="group h-full bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-200 flex flex-col relative cursor-pointer active:scale-[0.99]">

        <button
          onClick={handleDelete}
          aria-label="Delete lesson"
          className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 transition-all z-10"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <h3 className="text-base font-serif font-bold text-foreground mb-2 line-clamp-2 pr-8 group-hover:text-primary transition-colors leading-snug">
          {lesson.title}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-3 mb-4 flex-1 leading-relaxed">
          {preview}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
          <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
            <span>{format(new Date(lesson.createdAt), "MMM d, yyyy")}</span>
            {conceptCount > 0 && <span className="text-primary/60">{conceptCount} concepts</span>}
            {quizCount > 0 && <span className="text-accent/60">{quizCount} questions</span>}
          </div>
          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
