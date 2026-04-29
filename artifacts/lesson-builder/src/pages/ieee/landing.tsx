import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  BookOpen, Users, Award, Database, ChevronRight, FileText,
  Brain, CheckCircle, MessageSquare, Globe, ArrowRight, Layers,
  BarChart2, Shield,
} from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  {
    icon: <FileText className="w-6 h-6 text-primary" />,
    title: "IEEE Teaching Case Ingest",
    description:
      "Upload or paste any IEEE Teaching Case article. Our AI automatically parses abstract, learning objectives, case narrative, discussion questions, and supplementary materials.",
  },
  {
    icon: <Brain className="w-6 h-6 text-primary" />,
    title: "AI-Assisted Lesson Authoring",
    description:
      "Generate a complete interactive lesson draft — Bloom's-tagged objectives, concept glossary, knowledge-check quiz, reflection activities, and mind map — in seconds.",
  },
  {
    icon: <Layers className="w-6 h-6 text-primary" />,
    title: "Modular Learner Experience",
    description:
      "Learners move through structured modules: Introduction → Case Narrative → Key Concepts → Knowledge Check → Reflection → AI Tutor → Summary.",
  },
  {
    icon: <Database className="w-6 h-6 text-primary" />,
    title: "Full xAPI Compliance",
    description:
      "Every learner action — launched, experienced, answered, reflected, completed — emits an xAPI statement to the Learning Record Store for full analytics traceability.",
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: "Volunteer Author Workflow",
    description:
      "IEEE ProComm volunteers submit articles, review AI-generated drafts, edit each module, and submit for editorial review — all in one structured interface.",
  },
  {
    icon: <Award className="w-6 h-6 text-primary" />,
    title: "Certificate Issuance",
    description:
      "Learners who pass the knowledge check receive a completion certificate — shareable proof of engagement aligned to IEEE Professional Communication standards.",
  },
];

const MODULES = [
  { label: "Introduction", type: "module", color: "bg-blue-500" },
  { label: "Case Narrative", type: "reading", color: "bg-indigo-500" },
  { label: "Key Concepts", type: "lesson", color: "bg-violet-500" },
  { label: "Mind Map", type: "simulation", color: "bg-purple-500" },
  { label: "Knowledge Check", type: "assessment", color: "bg-pink-500" },
  { label: "Reflection", type: "question", color: "bg-rose-500" },
  { label: "AI Tutor", type: "interaction", color: "bg-orange-500" },
  { label: "Summary", type: "module", color: "bg-amber-500" },
];

const WORKFLOW = [
  { step: "1", label: "Upload Article", desc: "PDF, DOC, or paste text" },
  { step: "2", label: "Auto-Parse", desc: "AI detects IEEE Teaching Case sections" },
  { step: "3", label: "Generate Draft", desc: "AI builds complete lesson modules" },
  { step: "4", label: "Review & Edit", desc: "Author refines every module" },
  { step: "5", label: "Submit for Review", desc: "Editorial committee approval" },
  { step: "6", label: "Publish", desc: "Lesson goes live in the public catalog" },
];

export default function IeeeLanding() {
  return (
    <Layout>
      <div className="flex-1 overflow-y-auto">
        <section className="relative py-20 px-4 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="container max-w-4xl mx-auto relative"
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary font-medium">
              IEEE Transactions on Professional Communication
            </Badge>
            <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-foreground mb-4 leading-tight">
              Teaching Cases, <span className="text-primary">Transformed</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              An interactive lesson platform purpose-built for IEEE ProComm volunteer authors and learners.
              Convert scholarly Teaching Case articles into self-paced, xAPI-traceable learning experiences.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href="/ieee/author/new">
                  <FileText className="w-4 h-4" />
                  Submit a Teaching Case
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/ieee/catalog">
                  <Globe className="w-4 h-4" />
                  Browse Lesson Catalog
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>

        <section className="py-16 px-4 bg-muted/30">
          <div className="container max-w-5xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-center mb-2">Modular Lesson Structure</h2>
            <p className="text-center text-muted-foreground mb-10">
              Every lesson follows xAPI-aligned activity types — fully traceable from first view to final certificate.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {MODULES.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3 shadow-sm"
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${m.color}`} />
                  <div>
                    <div className="font-medium text-sm">{m.label}</div>
                    <div className="text-xs text-muted-foreground">xAPI: {m.type}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-center mb-2">Platform Features</h2>
            <p className="text-center text-muted-foreground mb-10">
              Built on the LessonBuilder infrastructure — specialized for IEEE Teaching Case standards.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-background border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-muted/30">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-center mb-2">Volunteer Author Workflow</h2>
            <p className="text-center text-muted-foreground mb-10">
              From article upload to published lesson — a guided, structured process.
            </p>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
              <div className="space-y-4">
                {WORKFLOW.map((w, i) => (
                  <motion.div
                    key={w.step}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-4 items-start"
                  >
                    <div className="relative z-10 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">
                      {w.step}
                    </div>
                    <div className="bg-background border border-border rounded-xl p-4 flex-1 shadow-sm">
                      <div className="font-semibold">{w.label}</div>
                      <div className="text-sm text-muted-foreground">{w.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-3xl p-10">
              <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-bold mb-3">
                Ready to Contribute?
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                IEEE ProComm volunteers can submit their Teaching Case articles and reach a global audience of
                self-study professionals and students through interactive, AI-powered lessons.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/ieee/author/new">
                    Start Authoring <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/ieee/author">My Submissions</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
