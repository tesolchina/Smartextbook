export interface TutorConfig {
  name: string;
  style: "explanatory" | "socratic" | "exam" | "mentor";
  focus: string;
  systemPrompt: string;
  provider: string;
  baseUrl: string;
  model: string;
}
