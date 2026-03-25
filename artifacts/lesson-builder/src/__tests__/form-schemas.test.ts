import { describe, it, expect } from "vitest";
import { z } from "zod";

const createLessonSchema = z.object({
  title: z.string().min(3, "At least 3 characters").max(100),
  chapterText: z.string().min(50, "Paste at least 50 characters of source text"),
});

describe("Create Lesson form schema", () => {
  describe("title validation", () => {
    it("accepts a valid title", () => {
      const r = createLessonSchema.safeParse({ title: "Chapter 1", chapterText: "A".repeat(50) });
      expect(r.success).toBe(true);
    });

    it("rejects a title shorter than 3 characters", () => {
      const r = createLessonSchema.safeParse({ title: "AB", chapterText: "A".repeat(50) });
      expect(r.success).toBe(false);
      if (!r.success) {
        expect(r.error.issues[0].message).toMatch(/3 characters/i);
      }
    });

    it("rejects an empty title", () => {
      const r = createLessonSchema.safeParse({ title: "", chapterText: "A".repeat(50) });
      expect(r.success).toBe(false);
    });

    it("rejects a title longer than 100 characters", () => {
      const r = createLessonSchema.safeParse({ title: "A".repeat(101), chapterText: "A".repeat(50) });
      expect(r.success).toBe(false);
    });

    it("accepts a title of exactly 3 characters", () => {
      const r = createLessonSchema.safeParse({ title: "DNA", chapterText: "A".repeat(50) });
      expect(r.success).toBe(true);
    });

    it("accepts a title of exactly 100 characters", () => {
      const r = createLessonSchema.safeParse({ title: "A".repeat(100), chapterText: "A".repeat(50) });
      expect(r.success).toBe(true);
    });
  });

  describe("chapterText validation", () => {
    it("accepts text of exactly 50 characters", () => {
      const r = createLessonSchema.safeParse({ title: "Test", chapterText: "A".repeat(50) });
      expect(r.success).toBe(true);
    });

    it("rejects text shorter than 50 characters", () => {
      const r = createLessonSchema.safeParse({ title: "Test", chapterText: "A".repeat(49) });
      expect(r.success).toBe(false);
      if (!r.success) {
        expect(r.error.issues[0].message).toMatch(/50 characters/i);
      }
    });

    it("rejects empty text", () => {
      const r = createLessonSchema.safeParse({ title: "Test", chapterText: "" });
      expect(r.success).toBe(false);
    });

    it("accepts long text (realistic chapter)", () => {
      const longText = "The mitochondria is the powerhouse of the cell. ".repeat(50);
      const r = createLessonSchema.safeParse({ title: "Biology Ch. 3", chapterText: longText });
      expect(r.success).toBe(true);
    });
  });

  describe("full schema", () => {
    it("parses valid input and returns typed data", () => {
      const input = {
        title: "Cellular Respiration",
        chapterText: "Glucose is broken down into ATP in a multi-step metabolic process.".repeat(3),
      };
      const r = createLessonSchema.safeParse(input);
      expect(r.success).toBe(true);
      if (r.success) {
        expect(r.data.title).toBe("Cellular Respiration");
        expect(typeof r.data.chapterText).toBe("string");
      }
    });

    it("collects multiple errors when both fields are invalid", () => {
      const r = createLessonSchema.safeParse({ title: "AB", chapterText: "Too short" });
      expect(r.success).toBe(false);
      if (!r.success) {
        expect(r.error.issues.length).toBeGreaterThanOrEqual(2);
      }
    });
  });
});
