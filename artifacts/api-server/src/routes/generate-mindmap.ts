import { Router, type IRouter } from "express";
import { GenerateMindmapBody } from "@workspace/api-zod";
import { createLLMClient } from "../lib/llm-client";

const router: IRouter = Router();

const MINDMAP_PROMPT = (title: string, summary: string, keyConcepts: { term: string; definition: string }[]) => {
  const conceptList = keyConcepts
    .slice(0, 12)
    .map((c) => `- ${c.term}: ${c.definition}`)
    .join("\n");

  return `\
You are an expert educational content creator. Create a Mermaid mindmap diagram for the following lesson.

Lesson title: ${title}

Summary:
${summary.slice(0, 1500)}

Key concepts:
${conceptList}

Return ONLY valid Mermaid mindmap syntax — no markdown fences, no explanation, no other text.
The output must start with the word "mindmap" on the first line.

Use this structure:
mindmap
  root(${title.slice(0, 40)})
    ConceptA
      Sub-idea 1
      Sub-idea 2
    ConceptB
      Sub-idea 1
    ConceptC
      Sub-idea 1
      Sub-idea 2

Rules:
- The root node is the lesson title (keep it short, under 40 chars).
- Add one branch per major concept (use the term as the branch label).
- Each branch may have 1-3 sub-ideas drawn from the definition or related ideas.
- Use no more than 8 top-level branches.
- Do NOT use parentheses or special Mermaid node shapes — plain text labels only.
- Return ONLY the Mermaid mindmap block, nothing else.`;
};

router.post("/generate-mindmap", async (req, res): Promise<void> => {
  const parsed = GenerateMindmapBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { title, summary, keyConcepts, llmConfig } = parsed.data;
  const prompt = MINDMAP_PROMPT(title, summary, keyConcepts);

  try {
    const { client, model } = createLLMClient(llmConfig);
    const response = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
    });
    let content = response.choices[0]?.message?.content ?? "";

    // Strip markdown code fences if present
    content = content.replace(/^```(?:mermaid)?\s*/i, "").replace(/\s*```\s*$/, "").trim();

    // Validate it starts with "mindmap"
    if (!content.toLowerCase().startsWith("mindmap")) {
      // Try to extract just the mindmap block
      const match = content.match(/mindmap[\s\S]*/i);
      if (match) {
        content = match[0].trim();
      } else {
        res.status(502).json({ error: "AI did not return a valid Mermaid mindmap. Please try again." });
        return;
      }
    }

    res.json({ mermaid: content });
  } catch (err: any) {
    res.status(502).json({ error: err.message || "AI provider error" });
  }
});

export default router;
