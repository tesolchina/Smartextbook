import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Send, Loader2, User } from "lucide-react";

interface Comment {
  id: number;
  authorName: string;
  body: string;
  createdAt: string;
}

interface CommentsSectionProps {
  shareId: string;
}

export function CommentsSection({ shareId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "done" | "error">("loading");
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/shared/${shareId}/comments`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setComments(data.comments);
      setLoadState("done");
    } catch {
      setLoadState("error");
    }
  }, [shareId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !body.trim() || posting) return;

    setPosting(true);
    setPostError(null);
    try {
      const res = await fetch(`/api/shared/${shareId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName: authorName.trim(), body: body.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setComments((prev) => [...prev, data.comment]);
      setBody("");
    } catch (err: any) {
      setPostError(err.message || "Failed to post comment. Please try again.");
    }
    setPosting(false);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="mt-8 border-t border-border pt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-serif font-bold text-foreground">
          Student Comments
          {comments.length > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">({comments.length})</span>
          )}
        </h2>
      </div>

      {/* Comment list */}
      <div className="space-y-4 mb-8">
        {loadState === "loading" && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading comments…
          </div>
        )}
        {loadState === "error" && (
          <p className="text-sm text-muted-foreground py-4">Could not load comments.</p>
        )}
        {loadState === "done" && comments.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
        {comments.map((c) => (
          <div key={c.id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-semibold text-foreground">{c.authorName}</span>
              <span className="text-xs text-muted-foreground ml-auto">{formatDate(c.createdAt)}</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed pl-9">{c.body}</p>
          </div>
        ))}
      </div>

      {/* Post a comment */}
      <div className="bg-muted/30 rounded-2xl p-5 border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-4">Leave a Comment</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Your name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            maxLength={80}
            className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background outline-none focus:border-primary/60 transition-colors"
            required
          />
          <textarea
            placeholder="Share your thoughts, questions, or what you learned…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={2000}
            rows={3}
            className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background outline-none focus:border-primary/60 transition-colors resize-none"
            required
          />
          {postError && <p className="text-xs text-destructive">{postError}</p>}
          <button
            type="submit"
            disabled={posting || !authorName.trim() || !body.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 hover:bg-primary/90 transition-colors"
          >
            {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
}
