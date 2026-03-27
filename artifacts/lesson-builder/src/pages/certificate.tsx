import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Award, CheckCircle2, AlertTriangle, Loader2, Shield, ExternalLink, Copy, Check } from "lucide-react";
import { Layout } from "@/components/layout";

interface Cert {
  id: string;
  courseId: string;
  courseTitle: string;
  teacherName: string;
  learnerName: string;
  scores: Record<string, number>;
  overallScore: number;
  contentHash: string;
  issuedAt: string;
}

interface LessonMeta { id: string; title: string; }

interface Course {
  passScore: number;
  teacherCredential: string | null;
}

type LoadState =
  | { status: "loading" }
  | { status: "success"; cert: Cert; course: Course | null; lessons: LessonMeta[] }
  | { status: "error"; message: string };

export default function CertificatePage() {
  const [match, params] = useRoute("/cert/:id");
  const certId = match ? params.id : null;

  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!certId) return;
    fetch(`/api/certificates/${certId}`)
      .then((r) => r.json().then((d) => ({ ok: r.ok, data: d })))
      .then(({ ok, data }) => {
        if (!ok) setLoadState({ status: "error", message: data.error || "Certificate not found." });
        else setLoadState({ status: "success", cert: data.cert, course: data.course, lessons: data.lessons });
      })
      .catch((err) => setLoadState({ status: "error", message: err.message }));
  }, [certId]);

  const copyHash = async (hash: string) => {
    await navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loadState.status === "loading") {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm">Verifying certificate…</p>
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
            <p className="font-semibold">Certificate not found</p>
            <p className="text-sm text-muted-foreground">{loadState.message}</p>
            <Link href="/app" className="text-sm text-primary hover:underline mt-2">← Back to Library</Link>
          </div>
        </div>
      </Layout>
    );
  }

  const { cert, course, lessons } = loadState;
  const issuedDate = new Date(cert.issuedAt).toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6">
            <Shield className="w-3.5 h-3.5" /> Verified Learning Record
          </div>
        </div>

        <div className="bg-card border-2 border-primary/20 rounded-3xl p-8 md:p-10 space-y-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                <Award className="w-10 h-10" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium">Certificate of Completion</p>
            <h1 className="text-2xl md:text-3xl font-serif font-bold leading-tight">{cert.courseTitle}</h1>
          </div>

          <div className="text-center space-y-1 py-4 border-y border-border">
            <p className="text-sm text-muted-foreground">Awarded to</p>
            <p className="text-2xl font-serif font-bold text-primary">{cert.learnerName}</p>
            <p className="text-sm text-muted-foreground">on {issuedDate}</p>
          </div>

          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground">Course by</p>
            <p className="font-semibold text-foreground">{cert.teacherName}</p>
            {course?.teacherCredential && (
              <p className="text-sm text-muted-foreground">{course.teacherCredential}</p>
            )}
          </div>

          <div className="bg-secondary/60 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Overall Score</span>
              <span className={`text-2xl font-bold ${cert.overallScore >= (course?.passScore ?? 70) ? "text-primary" : "text-destructive"}`}>
                {cert.overallScore}%
              </span>
            </div>
            <div className="space-y-2">
              {lessons.map((lesson) => {
                const score = cert.scores[lesson.id];
                return (
                  <div key={lesson.id} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm flex-1 truncate">{lesson.title}</span>
                    <span className="text-sm font-medium tabular-nums">{score}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Verification</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This certificate is tamper-evident. Its content hash is a SHA-256 fingerprint of the learner's name,
            course content, and scores at the time of issuance. Any modification would produce a different hash.
          </p>
          <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2.5">
            <code className="text-xs text-muted-foreground flex-1 break-all font-mono">{cert.contentHash}</code>
            <button
              onClick={() => copyHash(cert.contentHash)}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Copy hash"
            >
              {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Certificate ID: <span className="font-mono">{cert.id}</span></p>
        </div>

        {course && (
          <div className="text-center">
            <Link
              href={`/course/${cert.courseId}`}
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              View Course <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
