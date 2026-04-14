export type PostType = "workshop" | "blog";

export interface Speaker {
  name: string;
  role: string;
  institution: string;
  abstract?: string;
}

export interface Post {
  slug: string;
  type: PostType;
  date: string;
  isoDate: string;
  title: string;
  event?: string;
  venue?: string;
  zoomUrl?: string;
  meetingId?: string;
  passcode?: string;
  chair?: string;
  speakers?: Speaker[];
  summary: string;
  tags: string[];
  externalUrl?: string;
}

export const POSTS: Post[] = [
  {
    slug: "2026-04-15-teaching-matters-seminar",
    type: "workshop",
    date: "Wed 15 April 2026",
    isoDate: "2026-04-15",
    title: "Democratising AI-Augmented Textbook Creation Through No-Code Chatbot Customisation",
    event: "TeachingMatters Seminar",
    venue: "Zoom",
    zoomUrl: "https://lasallesg.zoom.us/j/99922140429",
    meetingId: "999 2214 0429",
    passcode: "198027",
    chair: "Dr Suba Rajan",
    speakers: [
      {
        name: "Dr. Simon Wang",
        role: "Lecturer in English & Innovation Officer",
        institution: "The Language Centre, Hong Kong Baptist University",
        abstract:
          `Traditional educational materials remain static and fail to provide personalised learning experiences. While Google\u2019s \u201cLearn Your Way\u201d research demonstrated 11% learning improvements through AI-augmented textbooks, such innovations remain inaccessible due to technical barriers. This talk presents SmartTextbook \u2014 a platform that enables educators to transform static content into intelligent, interactive experiences without programming knowledge, using natural language to create content-aware AI tutors.`,
      },
    ],
    summary:
      "How do you give every student a personalised tutor grounded in the exact materials you teach \u2014 without writing a single line of code? This talk demonstrates a no-code workflow for transforming static textbook chapters into AI-augmented lessons with summaries, glossaries, quizzes, mind maps, and a built-in AI tutor.",
    tags: ["AI in Education", "No-Code", "BYOK", "SmartTextbook"],
  },
];
