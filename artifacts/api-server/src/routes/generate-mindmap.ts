import { Router, type IRouter } from "express";
import { GenerateMindmapBody } from "@workspace/api-zod";
import { createLLMClient } from "../lib/llm-client";
import { jsonrepair } from "jsonrepair";

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

Return a JSON object with this exact structure:
{"mermaid": "<the full Mermaid mindmap definition>"}

The mermaid field must contain only valid Mermaid mindmap syntax starting with the word "mindmap".

Use this structure for the diagram:
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
- The root node uses root(...) syntax with the lesson title (kept short, under 40 chars).
- Add one branch per major concept (use the term as the plain text branch label).
- Each branch may have 1-3 sub-ideas drawn from the definition or related ideas.
- Use no more than 8 top-level branches.
- Branch and sub-branch labels must be plain text only — no parentheses, no special Mermaid node shapes.
- Return ONLY the JSON object, no other text.`;
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
      stream: false,
    });
    let content = response.choices[0]?.message?.content ?? "";

    // Strip markdown code fences if present (```json ... ``` or ``` ... ```)
    content = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();

    // Extract the outermost JSON object
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // Fallback: the LLM may have returned raw Mermaid — try to extract it directly
      const mermaidMatch = content.match(/mindmap[\s\S]*/i);
      if (mermaidMatch) {
        res.json({ mermaid: mermaidMatch[0].trim() });
        return;
      }
      res.status(502).json({ error: "AI did not return a valid Mermaid mindmap. Please try again." });
      return;
    }

    // Use jsonrepair to handle common LLM JSON issues (trailing commas, unescaped newlines, etc.)
    const data = JSON.parse(jsonrepair(jsonMatch[0]));
    let mermaid = String(data.mermaid ?? "").trim();

    // Strip any nested code fences the LLM may have included inside the JSON value
    mermaid = mermaid.replace(/^```(?:mermaid)?\s*/i, "").replace(/\s*```\s*$/, "").trim();

    if (!mermaid.toLowerCase().startsWith("mindmap")) {
      // Try to extract just the mindmap block if extra text was included
      const match = mermaid.match(/mindmap[\s\S]*/i);
      if (match) {
        mermaid = match[0].trim();
      } else {
        res.status(502).json({ error: "AI did not return a valid Mermaid mindmap. Please try again." });
        return;
      }
    }

    res.json({ mermaid });
  } catch (err: any) {
    res.status(502).json({ error: err.message || "AI provider error" });
  }
});

export default router;
