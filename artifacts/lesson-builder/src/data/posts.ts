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
    title: "From Passive to Participatory: Rethinking Process, Assessment, and Active Learning in the Age of AI",
    event: "TeachingMatters Seminar",
    venue: "Zoom",
    zoomUrl: "https://lasallesg.zoom.us/j/99922140429",
    meetingId: "999 2214 0429",
    passcode: "198027",
    chair: "Dr Suba Rajan",
    speakers: [
      {
        name: "Karina Yuen",
        role: "EdTech Development Specialist",
        institution: "AI Centre for Educational Technologies (AICET), National University of Singapore",
        abstract:
          "Explores how educators can use accessible AI tools — such as NotebookLM and Gemini Gems — to customise AI chatbots that provide personalised guidance grounded in course materials, serve as conversational practice partners, and offer structured feedback based on instructor-defined criteria. Drawing on work with faculty at NUS, Karina will share design ideas, practical tips, and approachable ways to get started.",
      },
      {
        name: "Dr. Simon Wang",
        role: "Lecturer in English & Innovation Officer",
        institution: "The Language Centre, Hong Kong Baptist University",
        abstract:
          `Explores \u201cDemocratising AI-Augmented Textbook Creation Through No-Code Chatbot Customisation\u201d. Traditional educational materials remain static and fail to provide personalised learning experiences. While Google\u2019s \u201cLearn Your Way\u201d research demonstrated 11% learning improvements through AI-augmented textbooks, such innovations remain inaccessible due to technical barriers. This talk presents a platform that enables educators to transform static content into intelligent, interactive experiences \u2014 without programming knowledge \u2014 using natural language to create content-aware AI tutors.`,
      },
      {
        name: "Dr. Damaris Carlisle",
        role: "Lecturer-in-charge",
        institution: "The Learning Centre",
        abstract:
          `Presents the Theoretical Assessment Working Group (TAWG) findings, advocating for a systemic shift toward process-oriented pedagogy and technological literacy. Introduces a scaffolded assessment framework featuring process-oriented written assessment models to advanced oral defenses \u2014 designed to prioritise original student thought and \u201chuman nuance\u201d over generic AI outputs.`,
      },
    ],
    summary:
      "As AI becomes embedded in creative education, traditional assessment models centred on final outputs are increasingly insufficient. This seminar examines how arts-based, practice-led pedagogy can transition from passive consumption to participatory learning — emphasising process, experimentation, iteration, and reflective decision-making.",
    tags: ["AI in Education", "Assessment", "Active Learning", "No-Code"],
  },
];
