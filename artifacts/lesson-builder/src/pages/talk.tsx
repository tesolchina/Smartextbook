import { Link } from "wouter";
import { BookOpenText, ExternalLink, ArrowLeft } from "lucide-react";

export default function TalkPage() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const slidesUrl = `${base}/talk.html`;

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1714]">
      {/* Minimal nav */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/10">
        <Link href="/about"
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#b84c2a] flex items-center justify-center">
            <BookOpenText className="w-4 h-4 text-white" />
          </div>
          <span className="font-serif font-bold text-white text-base">LessonBuilder</span>
        </div>
        <a
          href={slidesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-sm font-semibold"
        >
          Full screen <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </header>

      {/* Slide deck iframe — fills the rest of the viewport */}
      <div className="flex-1 relative">
        <iframe
          src={slidesUrl}
          title="Democratising AI-Augmented Textbook Creation — Simon Wang"
          className="absolute inset-0 w-full h-full border-0"
          allow="clipboard-write"
        />
      </div>
    </div>
  );
}
