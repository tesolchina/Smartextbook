import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpenText, Sparkles, ListTodo, MessageSquare, Download,
  ChevronLeft, ChevronRight, Github, ExternalLink, ArrowRight,
  FileText, Lightbulb, GraduationCap, Network, Share2, BarChart2,
  CalendarDays, MapPin, Users, Video, ChevronDown, ChevronUp,
  Key, Zap, Globe, CheckCircle2, Presentation,
} from "lucide-react";
import { POSTS, type Post } from "@/data/posts";

const SLIDES = [
  {
    icon: <FileText className="w-10 h-10 text-primary" />,
    label: "Step 1 — Input",
    title: "Paste a chapter or fetch a URL",
    body: "Give SmartTextbook any text — a textbook chapter, Wikipedia article, research paper, or any webpage. Paste it directly or drop in a link to fetch the content automatically.",
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
    icon: <Network className="w-10 h-10 text-primary" />,
    label: "Step 3 — Mind Map",
    title: "Visualise how concepts connect",
    body: "Switch to the Mind Map tab to see an interactive concept diagram generated from the lesson. Nodes and edges reveal how key ideas relate to one another — making structure visible at a glance.",
    accent: "from-primary/20 to-accent/10",
    mockup: <MindMapMockup />,
  },
  {
    icon: <ListTodo className="w-10 h-10 text-accent" />,
    label: "Step 4 — Quiz",
    title: "Test your understanding interactively",
    body: "Work through auto-generated multiple-choice questions. Get instant feedback, read explanations for every answer, and see your final score — active recall that research shows improves retention.",
    accent: "from-accent/20 to-primary/10",
    mockup: <QuizMockup />,
  },
  {
    icon: <MessageSquare className="w-10 h-10 text-primary" />,
    label: "Step 5 — Chat",
    title: "Ask your personal AI tutor anything",
    body: "A context-aware AI tutor sits alongside every lesson, aware of the full chapter content. Ask follow-up questions, request alternative explanations, or probe deeper — it stays on-topic.",
    accent: "from-primary/20 to-accent/10",
    mockup: <ChatMockup />,
  },
  {
    icon: <Share2 className="w-10 h-10 text-accent" />,
    label: "Step 6 — Share",
    title: "Publish a public lesson link",
    body: "Generate a shareable public link for any lesson. Students open it in their browser without an account, read the lesson, take the quiz, and leave comments — no setup required.",
    accent: "from-accent/20 to-primary/10",
    mockup: <ShareMockup />,
  },
  {
    icon: <BarChart2 className="w-10 h-10 text-primary" />,
    label: "Step 7 — Reports",
    title: "Track student comments & progress",
    body: "View every student comment in one place and generate an AI-powered Learning Report that summarises class understanding, highlights misconceptions, and suggests follow-up teaching points.",
    accent: "from-primary/20 to-accent/10",
    mockup: <ReportMockup />,
  },
  {
    icon: <Download className="w-10 h-10 text-accent" />,
    label: "Step 8 — Export",
    title: "Download a self-contained lesson file",
    body: "Export any lesson as a standalone HTML page — no server needed. Name your AI tutor, choose a teaching style, and let learners bring their own API key to chat with the embedded tutor.",
    accent: "from-accent/20 to-primary/10",
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
            <span className="font-serif font-bold text-xl tracking-tight">SmartTextbook</span>
          </div>
          <nav className="flex items-center gap-3">
            <a href="#how-to-start"
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <Key className="w-4 h-4" /> Get Started
            </a>
            <a href="#workshops"
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <CalendarDays className="w-4 h-4" /> Workshops
            </a>
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
        <div className="container max-w-4xl mx-auto px-4 pt-14 pb-16 md:pt-24 md:pb-28 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-7">
              <Sparkles className="w-3.5 h-3.5" /> Open-Source · Bring Your Own Key
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-black leading-[1.07] tracking-tight mb-6">
              Turn any chapter<br />
              <span className="text-primary italic">into a living lesson.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Paste a textbook chapter or URL — SmartTextbook generates an AI-powered summary, key-concept glossary, interactive quiz, and Mind Map. Share lessons publicly, collect student comments, and get AI-generated Learning Reports. Fully BYOK, no data stored.
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
            <p className="text-muted-foreground">Eight steps from raw text to mastery — for students and educators alike.</p>
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
            SmartTextbook was created as an open educational tool and is freely available to use, fork, and remix.
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
                  Simon built SmartTextbook with Replit to help language learners and educators transform dense reading material into structured, interactive study experiences — inspired by Google's "Learn Your Way" research.
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

      {/* ── How to Start (BYOK guide) ── */}
      <section className="py-20 bg-card border-b border-border" id="how-to-start">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4">
              <Key className="w-3.5 h-3.5" /> Bring Your Own Key
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-black mb-3">Start in 3 minutes — free</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              No account. No subscription. You supply an API key from any major AI provider — it stays in your browser and goes directly to the model.
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              {
                step: "01",
                icon: <Globe className="w-6 h-6" />,
                title: "Pick a provider",
                desc: "🇭🇰 In Hong Kong? Use DeepSeek — globally accessible and extremely low-cost. Outside HK: Google Gemini offers a free tier. OpenRouter gives access to 300+ models with one key.",
                providers: ["DeepSeek (HK ★)", "Gemini (global free)", "OpenRouter", "OpenAI", "Kimi", "Grok"],
                link: { label: "Get a DeepSeek key (HK users) →", url: "https://platform.deepseek.com/api_keys" },
              },
              {
                step: "02",
                icon: <Key className="w-6 h-6" />,
                title: "Set your API key",
                desc: "Open the app and click \"Set API Key\" in the top-right corner. Paste your key, choose a model, and hit Save. The key is stored only in your browser — never on our servers.",
                link: { label: "Open the app →", url: "/app", internal: true },
              },
              {
                step: "03",
                icon: <Zap className="w-6 h-6" />,
                title: "Generate your first lesson",
                desc: "Paste any textbook chapter or a URL. Add one teaching instruction (optional). Hit Generate — in seconds you'll have a summary, glossary, quiz, mind map, and AI tutor.",
                link: { label: "Watch the demo talk →", url: "/talk", internal: true },
              },
            ].map((item) => (
              <div key={item.step} className="bg-background border border-border rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-4 right-5 font-serif text-5xl font-black text-primary/8 leading-none select-none">{item.step}</div>
                <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-serif font-black text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{item.desc}</p>
                {"providers" in item && item.providers && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {item.providers.map((p) => (
                      <span key={p} className="inline-block px-2 py-0.5 rounded-full bg-primary/8 text-primary text-[11px] font-bold">{p}</span>
                    ))}
                  </div>
                )}
                {item.link.internal ? (
                  <Link href={item.link.url} className="text-sm font-bold text-primary hover:underline inline-flex items-center gap-1">
                    {item.link.label} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <a href={item.link.url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-primary hover:underline inline-flex items-center gap-1">
                    {item.link.label} <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Privacy assurance */}
          <div className="bg-green-500/8 border border-green-500/20 rounded-2xl p-5 flex items-start gap-4">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-foreground mb-1">Your key never leaves your device</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                SmartTextbook is a static front-end app. Your API key is stored in your browser's local storage and sent <strong>directly</strong> from your browser to your chosen AI provider. We have no server-side access to your key, your content, or your lessons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Workshops & Blog ── */}
      <section className="py-20 bg-background border-b border-border" id="workshops">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4">
              <CalendarDays className="w-3.5 h-3.5" /> Workshops &amp; Blog
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-black mb-3">Events &amp; Writing</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Talks, seminars, and reflections on AI in education — by Simon Wang and collaborators.
            </p>
          </div>
          {/* Talk slides link */}
          <div className="bg-card border border-primary/20 rounded-3xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Presentation className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-0.5">Slide Deck</p>
              <h3 className="font-serif font-black text-lg leading-tight mb-1">
                Democratising AI-Augmented Textbook Creation Through No-Code Chatbot Customisation
              </h3>
              <p className="text-sm text-muted-foreground">
                The full 12-slide presentation by Simon Wang — includes a live interactive demo you can try directly in the slide.
              </p>
            </div>
            <Link href="/talk"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-md shadow-primary/20 shrink-0">
              View Slides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid gap-6">
            {POSTS.map((post) => <PostCard key={post.slug} post={post} />)}
          </div>
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
          <a href="#how-to-start" className="hover:text-foreground transition-colors">Get Started</a>
          <a href="#workshops" className="hover:text-foreground transition-colors">Workshops</a>
          <Link href="/talk" className="hover:text-foreground transition-colors">Talk Slides</Link>
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

function MindMapMockup() {
  return (
    <div className="p-5 space-y-3">
      <div className="text-xs font-bold text-muted-foreground mb-2">🗺 Mind Map — The Water Cycle</div>
      <div className="relative bg-secondary rounded-xl h-36 overflow-hidden flex items-center justify-center">
        <div className="absolute w-14 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] font-bold text-primary left-1/2 -translate-x-1/2 top-4">Water Cycle</div>
        <div className="absolute w-12 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-[9px] font-semibold text-accent left-4 top-12">Evaporation</div>
        <div className="absolute w-14 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-[9px] font-semibold text-accent right-4 top-12">Condensation</div>
        <div className="absolute w-12 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-[9px] font-semibold text-accent left-8 bottom-4">Precipitation</div>
        <div className="absolute w-10 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-[9px] font-semibold text-accent right-8 bottom-4">Runoff</div>
      </div>
      <p className="text-[10px] text-muted-foreground">Tap any node to explore related concepts</p>
    </div>
  );
}

function ShareMockup() {
  return (
    <div className="p-5 space-y-3">
      <div className="text-xs font-bold text-muted-foreground mb-2">🔗 Share Lesson</div>
      <div className="bg-secondary rounded-xl p-3 space-y-2">
        <p className="text-[11px] text-muted-foreground">Public link — anyone with the link can view this lesson</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-card border border-border rounded-lg px-2.5 py-1.5 text-[10px] text-muted-foreground truncate">lessonbuilder.app/s/wc-4f9a2b…</div>
          <div className="bg-primary text-primary-foreground rounded-lg px-2.5 py-1.5 text-[10px] font-bold shrink-0">Copy</div>
        </div>
      </div>
      <div className="bg-card border border-dashed border-border rounded-xl p-3 space-y-1.5">
        <p className="text-[11px] font-semibold">What students can do:</p>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="text-green-500">✓</span> Read the summary &amp; glossary</div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="text-green-500">✓</span> Take the quiz</div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="text-green-500">✓</span> Leave comments</div>
      </div>
    </div>
  );
}

function ReportMockup() {
  return (
    <div className="p-5 space-y-3">
      <div className="text-xs font-bold text-muted-foreground mb-2">📊 Learning Report</div>
      <div className="space-y-1.5">
        {[
          { label: "Quiz average", value: "72%", bar: 72 },
          { label: "Students completed", value: "18 / 24", bar: 75 },
        ].map((row) => (
          <div key={row.label} className="bg-secondary rounded-lg p-2.5">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-bold text-foreground">{row.value}</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${row.bar}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-2.5 text-[10px] text-muted-foreground leading-relaxed">
        💡 AI insight: Most students confused <em>transpiration</em> with <em>evaporation</em>. Consider revisiting with a plant-biology example.
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

function PostCard({ post }: { post: Post }) {
  const [expanded, setExpanded] = useState(false);

  const isUpcoming = new Date(post.isoDate) >= new Date(new Date().toDateString());

  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />
      <div className="p-6 md:p-8">
        {/* Top row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
            post.type === "workshop"
              ? "bg-primary/10 text-primary"
              : "bg-accent/15 text-accent"
          }`}>
            {post.type === "workshop" ? <CalendarDays className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
            {post.type === "workshop" ? "Workshop / Seminar" : "Blog Post"}
          </span>
          {isUpcoming && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-700 dark:text-green-400">
              ● Upcoming
            </span>
          )}
          {post.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        {/* Event meta */}
        {post.event && (
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">{post.event}</p>
        )}
        <h3 className="font-serif text-xl md:text-2xl font-black leading-tight mb-3">{post.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{post.summary}</p>

        {/* Details row */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4 shrink-0 text-primary" />
            <span className="font-semibold">{post.date}</span>
          </div>
          {post.venue && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              {post.venue === "Zoom" ? <Video className="w-4 h-4 shrink-0 text-primary" /> : <MapPin className="w-4 h-4 shrink-0 text-primary" />}
              <span>{post.venue}</span>
            </div>
          )}
          {post.speakers && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="w-4 h-4 shrink-0 text-primary" />
              <span>{post.speakers.map((s) => s.name).join(" · ")}</span>
            </div>
          )}
        </div>

        {/* Zoom info */}
        {post.zoomUrl && (
          <div className="bg-secondary rounded-xl p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Zoom Details</p>
              <p className="text-sm font-semibold">Meeting ID: {post.meetingId}</p>
              <p className="text-sm text-muted-foreground">Passcode: <span className="font-mono font-semibold text-foreground">{post.passcode}</span></p>
            </div>
            <a
              href={post.zoomUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all hover:-translate-y-0.5"
            >
              <Video className="w-4 h-4" /> Join Zoom
            </a>
          </div>
        )}

        {/* Expand / collapse speaker abstracts */}
        {post.speakers && post.speakers.length > 0 && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors mb-3"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {expanded ? "Hide" : "View"} speaker abstracts
            </button>

            {expanded && (
              <div className="space-y-4 border-t border-border pt-4">
                {post.chair && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-bold">Session Chair:</span> {post.chair}
                  </p>
                )}
                {post.speakers.map((speaker) => (
                  <div key={speaker.name} className="space-y-1.5">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <p className="font-serif font-bold text-base">{speaker.name}</p>
                      <p className="text-xs text-primary font-semibold">{speaker.role}</p>
                      <p className="text-xs text-muted-foreground">{speaker.institution}</p>
                    </div>
                    {speaker.abstract && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{speaker.abstract}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
