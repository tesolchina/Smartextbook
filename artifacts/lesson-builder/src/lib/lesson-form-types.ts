export type Audience = "general" | "k12" | "university" | "professional";
export type Goal = "understand" | "exam" | "apply" | "overview";
export type QuizTemplate = "quick" | "standard" | "deep";
export type SubjectType = "general" | "language";

export interface LearnerPreferences {
  audience: Audience;
  goal: Goal;
  quizTemplate: QuizTemplate;
  customGoal: string;
  subjectType: SubjectType;
}

export const SAMPLE = {
  url: "https://arxiv.org/abs/2509.13348",
  title: "Towards an AI-Augmented Textbook",
};

export const STAGES = [
  { label: "Analyzing source text…",       minSec: 0  },
  { label: "Tailoring to learner profile…", minSec: 8  },
  { label: "Writing lesson summary…",       minSec: 18 },
  { label: "Extracting key concepts…",      minSec: 32 },
  { label: "Building quiz questions…",      minSec: 48 },
  { label: "Finalizing lesson…",            minSec: 62 },
];

export function estimateSecs(textLength: number): number {
  if (textLength < 1500) return 45;
  if (textLength < 4000) return 60;
  if (textLength < 8000) return 80;
  return 95;
}

export const AUDIENCES: { id: Audience; label: string; desc: string; emoji: string }[] = [
  { id: "k12",          label: "High School",    desc: "Ages 14–18, plain language",       emoji: "🏫" },
  { id: "university",   label: "University",     desc: "Academic terms, deeper analysis",  emoji: "🎓" },
  { id: "professional", label: "Professional",   desc: "Technical, concise, applied",      emoji: "💼" },
  { id: "general",      label: "General Public", desc: "Anyone, everyday analogies",       emoji: "🌍" },
];

export const GOALS: { id: Goal; label: string; desc: string }[] = [
  { id: "understand", label: "Deep Understanding", desc: "Explain why, not just what"       },
  { id: "exam",       label: "Exam Preparation",   desc: "Testable facts & key definitions" },
  { id: "apply",      label: "Apply in Practice",  desc: "Real-world use cases"             },
  { id: "overview",   label: "Quick Overview",     desc: "High-level orientation only"      },
];

export const QUIZ_TEMPLATES: { id: QuizTemplate; label: string; count: string; desc: string; badge: string }[] = [
  { id: "quick",    label: "Quick Check",   count: "5 questions",  desc: "Basic comprehension",             badge: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
  { id: "standard", label: "Standard Quiz", count: "10 questions", desc: "Comprehension + analysis",        badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  { id: "deep",     label: "Deep Assessment", count: "15 questions", desc: "Recall, analysis & application", badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
];
