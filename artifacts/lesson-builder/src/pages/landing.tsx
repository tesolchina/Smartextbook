import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpenText, Sparkles, ListTodo, MessageSquare, Download,
  ChevronLeft, ChevronRight, Github, ExternalLink, ArrowRight,
  FileText, Lightbulb, GraduationCap,
} from "lucide-react";

const SLIDES = [
  {
    icon: <FileText className="w-10 h-10 text-primary" />,
    label: "Step 1 — Input",
    title: "Paste a chapter or fetch a URL",
    body: "Give LessonBuilder any text — a textbook chapter, Wikipedia article, research paper, or any webpage. Paste it directly or drop in a link to fetch the content automatically.",
    accent: "from-primary/20 to-accent/10",
    mockup: <PasteMockup />,
  },
  {
    icon: <Lightbulb className="w-10 h-10 text-accent" />,
    label: "Step 2 — Generate",
    title: "AI crafts a complete lesson",
    body: "In seconds, your chosen AI model produces a concise summary, a glossary of key concepts with definitions, and 5–8 multiple-choice questions — all grounded in the source text.",
    accent: "from-accent/20 to-primary/10",
    mockup: <SummaryMockup />,
  },
  {
    icon: <ListTodo className="w-10 h-10 text-primary" />,
    label: "Step 3 — Quiz",
    title: "Test your understanding interactively",
    body: "Work through auto-generated multiple-choice questions. Get instant feedback, read explanations for every answer, and see your final score — active recall that research shows improves retention.",
    accent: "from-primary/20 to-accent/10",
    mockup: <QuizMockup />,
  },
  {
    icon: <MessageSquare className="w-10 h-10 text-accent" />,
    label: "Step 4 — Chat",
    title: "Ask your personal AI tutor anything",
    body: "A context-aware AI tutor sits alongside every lesson, aware of the full chapter content. Ask follow-up questions, request alternative explanations, or probe deeper — it stays on-topic.",
    accent: "from-accent/20 to-primary/10",
    mockup: <ChatMockup />,
  },
  {
    icon: <Download className="w-10 h-10 text-primary" />,
    label: "Step 5 — Export",
    title: "Share a self-contained lesson file",
    body: "Download any lesson as a standalone HTML page — no server needed. Name your AI tutor, choose a teaching style, and let learners bring their own API key to chat with the embedded tutor.",
    accent: "from-primary/20 to-accent/10",
    mockup: <ExportMockup />,
  },
];

export default function Landing() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setSlide((s) => (s + 1) % SLIDES.length), []);
  const prev = useCallback(() => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(next, 5000);
    return () => clearTimeout(t);
  }, [slide, paused, next]);

  const s = SLIDES[slide];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 font-sans">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
              <BookOpenText className="w-5 h-5" />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight">LessonBuilder</span>
          </div>
          <nav className="flex items-center gap-3">
            <a href="https://github.com/tesolchina/Smartextbook" target="_blank" rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-4 h-4" /> GitHub
            </a>
            <Link href="/app"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background text-sm font-bold hover:bg-foreground/85 transition-all hover:-translate-y-0.5 shadow-sm">
              Open App <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
        </div>
        <div className="container max-w-4xl mx-auto px-4 pt-24 pb-28 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-7">
              <Sparkles className="w-3.5 h-3.5" /> Open-Source · Bring Your Own Key
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-black leading-[1.07] tracking-tight mb-6">
              Turn any chapter<br />
              <span className="text-primary italic">into a living lesson.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Paste a textbook chapter or URL — LessonBuilder generates an AI-powered summary, key-concept glossary, and interactive quiz. A personal AI tutor answers every question. Fully BYOK, no data stored.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/app"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-foreground text-background font-bold text-base hover:bg-foreground/85 shadow-xl hover:-translate-y-1 transition-all active:scale-95">
                Start Learning Free <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="https://replit.com/@SimonWang23/Smartextbook?v=1" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-border bg-background font-bold text-base hover:border-primary/50 hover:bg-secondary transition-all">
                <ReplitIcon /> Remix on Replit
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Feature Carousel ── */}
      <section className="py-20 bg-background border-b border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-black mb-3">How it works</h2>
            <p className="text-muted-foreground">Five steps from raw text to mastery.</p>
          </div>

          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={slide}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                {/* Text side */}
                <div className="space-y-4 lg:pr-8">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${s.accent} text-xs font-bold uppercase tracking-widest text-foreground/70`}>
                    {s.label}
                  </div>
                  <div>{s.icon}</div>
                  <h3 className="text-3xl font-serif font-black leading-tight">{s.title}</h3>
                  <p className="text-muted-foreground text-base leading-relaxed">{s.body}</p>
                </div>

                {/* Mockup side */}
                <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
                  {s.mockup}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button onClick={prev}
                className="w-9 h-9 rounded-full border border-border bg-card hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                {SLIDES.map((_, i) => (
                  <button key={i} onClick={() => setSlide(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${i === slide ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted-foreground"}`}
                  />
                ))}
              </div>

              <button onClick={next}
                className="w-9 h-9 rounded-full border border-border bg-card hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Highlights strip ── */}
      <section className="py-14 bg-card border-b border-border">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { stat: "8+", label: "AI providers supported", sub: "OpenAI, Gemini, DeepSeek, Grok, Mistral, Poe…" },
              { stat: "BYOK", label: "Bring your own key", sub: "Your key stays in your browser — never on our servers" },
              { stat: "100%", label: "Client-side storage", sub: "Lessons saved in your browser via localStorage" },
              { stat: "Free", label: "Open source & remixable", sub: "Fork on GitHub or remix on Replit" },
            ].map((item) => (
              <div key={item.stat} className="p-4">
                <p className="text-3xl font-serif font-black text-primary mb-1">{item.stat}</p>
                <p className="text-sm font-bold text-foreground mb-1">{item.label}</p>
                <p className="text-xs text-muted-foreground leading-snug">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Credits ── */}
      <section className="py-20 bg-background border-b border-border">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <GraduationCap className="w-10 h-10 text-primary mx-auto mb-5" />
          <h2 className="text-3xl font-serif font-black mb-3">Built by</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            LessonBuilder was created as an open educational tool and is freely available to use, fork, and remix.
          </p>

          {/* Dr. Simon Wang credit card */}
          <div className="bg-card border border-border rounded-3xl p-8 mb-8 text-left shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif font-black text-xl mb-1">Dr. Simon Wang</h3>
                <p className="text-sm font-semibold text-primary mb-0.5">Lecturer in English & Innovation Officer</p>
                <p className="text-sm text-muted-foreground mb-4">The Language Centre, Hong Kong Baptist University</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  Simon built LessonBuilder with Replit to help language learners and educators transform dense reading material into structured, interactive study experiences — inspired by Google's "Learn Your Way" research.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="https://github.com/tesolchina/Smartextbook" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background text-sm font-bold hover:bg-foreground/85 transition-all hover:-translate-y-0.5">
                    <Github className="w-4 h-4" /> View on GitHub
                  </a>
                  <a href="https://replit.com/@SimonWang23/Smartextbook?v=1" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-border bg-background text-sm font-bold hover:border-primary/50 hover:bg-secondary transition-all">
                    <ReplitIcon /> Remix on Replit (free)
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Open source note */}
          <p className="text-sm text-muted-foreground">
            Inspired by{" "}
            <a href="https://learnyourway.withgoogle.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
              Google's "Learn Your Way"
            </a>{" "}
            experiment and the{" "}
            <a href="https://arxiv.org/abs/2509.13348" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
              LearnLM research
            </a>{" "}
            on AI-augmented textbooks.
          </p>
        </div>
      </section>

      {/* ── CTA footer ── */}
      <section className="py-20 bg-card text-center">
        <div className="container max-w-2xl mx-auto px-4">
          <h2 className="text-4xl font-serif font-black mb-4">Ready to learn smarter?</h2>
          <p className="text-muted-foreground mb-8">
            No account needed. Bring your own API key and start generating lessons in under a minute.
          </p>
          <Link href="/app"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">
            Start Building Lessons <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <footer className="py-6 border-t border-border bg-background text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/app" className="hover:text-foreground transition-colors">App</Link>
          <Link href="/credits" className="hover:text-foreground transition-colors">Credits</Link>
          <a href="https://github.com/tesolchina/Smartextbook" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Github className="w-3 h-3" /> GitHub
          </a>
          <a href="https://replit.com/@SimonWang23/Smartextbook?v=1" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            Remix on Replit
          </a>
        </div>
        <p className="mt-2">Built with Replit · Open source · Free to use</p>
      </footer>
    </div>
  );
}

// ── Slide mockup components ──

function PasteMockup() {
  return (
    <div className="p-5 space-y-3">
      <div className="text-xs font-bold text-muted-foreground mb-2">New Lesson</div>
      <div className="bg-secondary rounded-lg p-2.5 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Title:</span> Chapter 4 — The Water Cycle
      </div>
      <div className="bg-secondary rounded-lg p-3 text-xs text-muted-foreground leading-relaxed font-serif h-28 overflow-hidden">
        The water cycle, also known as the hydrological cycle, describes the continuous movement of water on, above, and below Earth's surface. The main processes driving the water cycle are evaporation, transpiration, condensation, precipitation, and runoff...
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">📋 Paste text</div>
        <div className="flex-1 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-xs text-muted-foreground">🔗 Fetch URL</div>
      </div>
      <div className="h-9 rounded-xl bg-foreground flex items-center justify-center text-xs font-bold text-background">Generate Lesson →</div>
    </div>
  );
}

function SummaryMockup() {
  return (
    <div className="p-5 space-y-3">
      <div className="text-xs font-bold text-muted-foreground mb-2">✨ Summary</div>
      <div className="bg-secondary rounded-lg p-3 text-xs text-muted-foreground leading-relaxed font-serif">
        The water cycle describes how water continuously moves through Earth's systems via evaporation, condensation, and precipitation — driven by solar energy and gravity.
      </div>
      <div className="text-xs font-bold text-muted-foreground mt-1 mb-1">🔑 Key Concepts</div>
      <div className="grid grid-cols-2 gap-2">
        {["Evaporation", "Condensation", "Precipitation", "Transpiration"].map((t) => (
          <div key={t} className="bg-card border border-border rounded-lg p-2">
            <p className="text-xs font-bold text-foreground">{t}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Definition…</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuizMockup() {
  return (
    <div className="p-5 space-y-3">
      <div className="text-xs font-bold text-muted-foreground mb-2">✏️ Question 2 of 6</div>
      <div className="text-sm font-semibold">What process converts liquid water to water vapor?</div>
      <div className="space-y-2">
        <div className="border-2 border-green-500 bg-green-50 dark:bg-green-950/20 rounded-lg p-2.5 text-xs font-semibold text-green-700 dark:text-green-400">✓ Evaporation</div>
        <div className="border border-border rounded-lg p-2.5 text-xs text-muted-foreground bg-card">Condensation</div>
        <div className="border border-border rounded-lg p-2.5 text-xs text-muted-foreground bg-card">Precipitation</div>
        <div className="border border-border rounded-lg p-2.5 text-xs text-muted-foreground bg-card">Runoff</div>
      </div>
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-2.5 text-[11px] text-muted-foreground">
        💡 Evaporation occurs when solar energy heats water, causing it to change state from liquid to gas.
      </div>
    </div>
  );
}

function ChatMockup() {
  return (
    <div className="p-4 space-y-2.5">
      <div className="text-xs font-bold text-muted-foreground mb-1">💬 AI Tutor — Aria</div>
      <div className="bg-secondary rounded-xl rounded-bl-sm p-2.5 text-xs max-w-[85%]">
        Hi! I'm Aria, your AI tutor. Ask me anything about <em>The Water Cycle</em>! 📚
      </div>
      <div className="bg-primary text-primary-foreground rounded-xl rounded-br-sm p-2.5 text-xs max-w-[85%] ml-auto">
        Why does water evaporate faster on hot days?
      </div>
      <div className="bg-secondary rounded-xl rounded-bl-sm p-2.5 text-xs max-w-[90%]">
        Great question! Higher temperatures give water molecules more kinetic energy, allowing them to overcome intermolecular forces and escape into the air as vapor more rapidly.
      </div>
      <div className="flex gap-2 mt-1">
        <div className="flex-1 bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground">Ask a question…</div>
        <div className="bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-xs font-bold">Send</div>
      </div>
    </div>
  );
}

function ExportMockup() {
  return (
    <div className="p-5 space-y-3">
      <div className="text-xs font-bold text-muted-foreground mb-2">📤 Export as Standalone Page</div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-20 shrink-0">Tutor name</span>
          <div className="flex-1 bg-secondary rounded-lg px-2.5 py-1.5 text-xs font-semibold">Professor Chen</div>
        </div>
        <div>
          <span className="text-xs text-muted-foreground block mb-1">Teaching style</span>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="border-2 border-primary bg-primary/5 rounded-lg p-1.5 text-[11px] font-bold text-primary">Socratic Guide</div>
            <div className="border border-border rounded-lg p-1.5 text-[11px] text-muted-foreground">Clear Explainer</div>
            <div className="border border-border rounded-lg p-1.5 text-[11px] text-muted-foreground">Exam Coach</div>
            <div className="border border-border rounded-lg p-1.5 text-[11px] text-muted-foreground">Warm Mentor</div>
          </div>
        </div>
        <div className="h-9 rounded-xl bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">⬇ Download HTML</div>
      </div>
    </div>
  );
}

function ReplitIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z" />
    </svg>
  );
}
