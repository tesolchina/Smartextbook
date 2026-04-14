import { motion } from "framer-motion";
import { ExternalLink, BookOpen, GraduationCap, Lightbulb, Star, Github, Mail, Globe } from "lucide-react";
import { Layout } from "@/components/layout";

const inspirationSources = [
  {
    title: "Learn Your Way — Google Labs",
    org: "Google Research",
    description:
      "Our primary inspiration. A research experiment that uses GenAI to transform textbooks into personalized, multimodal learning experiences — immersive text, section-level quizzes, narrated slides, audio lessons, and mind maps. A user study showed 11 percentage points higher retention vs. a standard digital reader.",
    url: "https://learnyourway.withgoogle.com/",
    paper: "https://arxiv.org/abs/2509.13348",
    paperLabel: "arXiv: 2509.13348 — Towards an AI-Augmented Textbook",
    tags: ["Google", "LearnLM", "Gemini", "Personalization", "Multimodal"],
    highlight: true,
  },
  {
    title: "LearnLM",
    org: "Google DeepMind",
    description:
      "Google's pedagogy-infused family of models fine-tuned for learning and grounded in educational research. Powers the active recall, pedagogical questioning, and adaptive tutoring capabilities that inspired our AI tutor design.",
    url: "https://blog.google/outreach-initiatives/education/google-learnlm-gemini-generative-ai/",
    tags: ["Google", "LLM", "Pedagogy", "Education"],
  },
];

const githubProjects = [
  {
    name: "DeepTutor",
    author: "HKUDS",
    stars: "10.8k",
    url: "https://github.com/HKUDS/DeepTutor",
    description:
      "AI-powered personalized learning assistant that understands PDFs and documents with deep comprehension, supporting interactive Q&A and tutoring sessions.",
    tags: ["Python", "RAG", "PDF", "Tutoring"],
  },
  {
    name: "obsidian-quiz-generator",
    author: "ECuiDev",
    stars: "171",
    url: "https://github.com/ECuiDev/obsidian-quiz-generator",
    description:
      "Obsidian plugin that generates interactive flashcards and quizzes from your notes using OpenAI, Gemini, or local Ollama models. Supports true/false, multiple choice, and short answer questions.",
    tags: ["TypeScript", "Obsidian", "Flashcards", "Quiz"],
  },
  {
    name: "quiznote",
    author: "Evavic44",
    stars: "34",
    url: "https://github.com/Evavic44/quiznote",
    description:
      "AI-powered quiz generator for creating quizzes from your notes and textbooks, powered by Google Gemini. Simple interface for rapid quiz creation from any text input.",
    tags: ["Next.js", "Gemini", "Quiz", "Notes"],
  },
  {
    name: "AI-Quiz-Generator",
    author: "quentin-mckay",
    stars: "~",
    url: "https://github.com/quentin-mckay/AI-Quiz-Generator",
    description:
      "GPT-powered multiple-choice quiz generator built with Next.js. Paste any text and instantly receive a structured quiz with explanations — a clean, minimal take on AI-generated assessments.",
    tags: ["Next.js", "GPT", "Quiz", "Open Source"],
  },
  {
    name: "quizify_ai",
    author: "fns12",
    stars: "~",
    url: "https://github.com/fns12/quizify_ai",
    description:
      "Streamlit application that generates QnA, MCQs, flashcards, and summaries from PDF documents. Demonstrates how AI can create multiple study-format outputs from a single source material.",
    tags: ["Python", "Streamlit", "PDF", "Flashcards", "MCQ"],
  },
  {
    name: "AIStudyAssistant",
    author: "mhss1",
    stars: "~",
    url: "https://github.com/mhss1/AIStudyAssistant",
    description:
      "AI chatbot combining lecture summarization, essay writing, and question generation in a single mobile-friendly application. Inspired our all-in-one lesson + tutor approach.",
    tags: ["Kotlin", "Android", "Chatbot", "Summarizer"],
  },
  {
    name: "deltamind",
    author: "rafapradana",
    stars: "~",
    url: "https://github.com/rafapradana/deltamind",
    description:
      "Full-stack AI-powered quiz generator and learning assistant. Generates quizzes from custom topics and provides a conversational learning experience.",
    tags: ["React", "FastAPI", "Quiz", "Learning"],
  },
  {
    name: "AI-Powered-Study-Plan-and-Book-Summarization",
    author: "Huzaifa-X",
    stars: "~",
    url: "https://github.com/Huzaifa-X/AI-Powered-Study-Planand-Book-Summarization",
    description:
      "Combines personalized study plan generation with hierarchical book summarization, showing how AI can structure long-form content into digestible learning paths.",
    tags: ["Python", "LangChain", "Summarization", "Study Plan"],
  },
];

const researchFoundations = [
  {
    title: "Dual Coding Theory",
    author: "Paivio (1991)",
    description:
      "Forging mental connections between different representations (text + visual + audio) strengthens the underlying conceptual schema. This is why we provide a summary, key concepts glossary, and an interactive quiz — three different views of the same material.",
    url: "https://www.researchgate.net/publication/225249172_Dual_Coding_Theory_and_Education",
  },
  {
    title: "Active Recall & Testing Effect",
    author: "Roediger & Karpicke (2006)",
    description:
      "Retrieval practice (quizzing) is one of the most effective study strategies. Our multiple-choice quiz with explanations puts this into practice.",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0360131599000299",
  },
  {
    title: "Personalization in Learning",
    author: "NSF / Educational Research",
    description:
      "Adapting content to learner context enhances motivation and deepens learning. We use an AI tutor that knows your specific chapter and can explain concepts at any level you need.",
    url: "https://par.nsf.gov/servlets/purl/10274018",
  },
];

export default function Credits() {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative py-20 border-b border-border bg-card overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="container max-w-4xl mx-auto px-4 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wide mb-6">
                <GraduationCap className="w-4 h-4" /> Credits & Inspiration
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-6 leading-tight">
                Standing on the<br /><span className="text-primary italic">shoulders of giants.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                SmartTextbook was inspired by cutting-edge research in AI-powered education and a community of open-source builders who share the vision of making learning more accessible and effective.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Created by */}
        <section className="py-16 border-b border-border bg-background">
          <div className="container max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-serif font-bold mb-8 flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-primary" /> Created by
              </h2>

              <div className="rounded-3xl border border-primary/30 bg-primary/5 shadow-xl shadow-primary/5 p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />

                <div className="flex flex-col sm:flex-row items-start gap-6">
                  {/* Avatar placeholder */}
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <GraduationCap className="w-10 h-10" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Founder & Creator</p>
                    <h3 className="text-3xl font-serif font-black text-foreground mb-1">Dr. Simon Wang</h3>
                    <p className="text-base font-semibold text-foreground/80 mb-0.5">
                      Lecturer in English &amp; Innovation Officer
                    </p>
                    <p className="text-sm text-muted-foreground mb-5">
                      The Language Centre, Hong Kong Baptist University
                    </p>

                    <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">
                      Simon built SmartTextbook to help language learners and educators transform dense reading
                      material into structured, interactive study experiences. As both a language teacher and an
                      innovation officer, he bridges pedagogy and technology — designing tools that make
                      AI-powered learning practical and accessible for every classroom.
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href="https://lc.hkbu.edu.hk/main/simonwang/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-sm"
                      >
                        <Globe className="w-4 h-4" /> Personal Website
                      </a>
                      <a
                        href="mailto:simonwang@hkbu.edu.hk"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-border bg-background text-sm font-bold hover:border-primary/50 hover:bg-secondary transition-all hover:-translate-y-0.5"
                      >
                        <Mail className="w-4 h-4" /> simonwang@hkbu.edu.hk
                      </a>
                      <a
                        href="https://github.com/tesolchina/Smartextbook"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-border bg-background text-sm font-bold hover:border-primary/50 hover:bg-secondary transition-all hover:-translate-y-0.5"
                      >
                        <Github className="w-4 h-4" /> GitHub Repository
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Research Inspiration */}
        <section className="py-20 border-b border-border bg-background">
          <div className="container max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-serif font-bold mb-3 flex items-center gap-3">
              <Lightbulb className="w-8 h-8 text-accent" /> Primary Inspiration
            </h2>
            <p className="text-muted-foreground mb-10 max-w-2xl">
              The core ideas behind SmartTextbook come directly from Google Research's work on AI-augmented textbooks.
            </p>

            <div className="space-y-6">
              {inspirationSources.map((source, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-3xl border p-8 relative overflow-hidden ${
                    source.highlight
                      ? "bg-primary/5 border-primary/30 shadow-xl shadow-primary/5"
                      : "bg-card border-border"
                  }`}
                >
                  {source.highlight && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />
                  )}
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                    <div>
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">{source.org}</span>
                      <h3 className="text-2xl font-serif font-bold text-foreground mt-1">{source.title}</h3>
                    </div>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors shrink-0"
                    >
                      Visit <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">{source.description}</p>
                  {source.paper && (
                    <a
                      href={source.paper}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                    >
                      <BookOpen className="w-4 h-4" /> {source.paperLabel}
                    </a>
                  )}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {source.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Learning Science */}
        <section className="py-20 border-b border-border bg-card">
          <div className="container max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-serif font-bold mb-3 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" /> Research Foundations
            </h2>
            <p className="text-muted-foreground mb-10 max-w-2xl">
              The pedagogical principles that guide how we structure lessons and why they work.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {researchFoundations.map((item, i) => (
                <motion.a
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-background rounded-2xl p-6 border border-border hover:border-primary/40 hover:shadow-lg transition-all"
                >
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{item.author}</p>
                  <h3 className="font-serif font-bold text-lg mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  <span className="inline-flex items-center gap-1 text-xs text-primary mt-4 font-medium group-hover:underline">
                    Read research <ExternalLink className="w-3 h-3" />
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Similar GitHub Projects */}
        <section className="py-20 bg-background">
          <div className="container max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-serif font-bold mb-3 flex items-center gap-3">
              <Github className="w-8 h-8 text-foreground" /> Related Open-Source Projects
            </h2>
            <p className="text-muted-foreground mb-10 max-w-2xl">
              These open-source projects explore similar ideas — AI-powered quiz generation, study assistance, and interactive learning from text. Each brought its own perspective that shaped our thinking.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {githubProjects.map((project, i) => (
                <motion.a
                  key={i}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">@{project.author}</p>
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors font-mono text-sm truncate">
                        {project.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground shrink-0">
                      {project.stars !== "~" && (
                        <>
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-semibold">{project.stars}</span>
                        </>
                      )}
                      <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-16 border-t border-border bg-card text-center">
          <div className="container max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-serif font-bold mb-4">Built for the community</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              SmartTextbook is open source. If you're inspired by any of these projects or want to contribute,
              we'd love to have you involved.
            </p>
            <a
              href="/app"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-foreground text-background font-bold text-lg hover:bg-foreground/90 shadow-xl hover:-translate-y-1 transition-all active:scale-95"
            >
              <BookOpen className="w-5 h-5" /> Start Learning
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
}
