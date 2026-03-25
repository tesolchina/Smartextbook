import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLessonsStore, type StoredLesson } from "@/hooks/use-lessons-store";

const makeLesson = (overrides: Partial<StoredLesson> = {}): StoredLesson => ({
  id: crypto.randomUUID(),
  title: "Introduction to Photosynthesis",
  summary: "Plants convert sunlight into chemical energy.",
  keyConcepts: [{ term: "Chlorophyll", definition: "Green pigment in leaves." }],
  quizQuestions: [
    {
      question: "What do plants need for photosynthesis?",
      options: ["Sunlight", "Darkness", "Water only", "Soil only"],
      correctIndex: 0,
      explanation: "Plants need sunlight, water, and CO2.",
    },
  ],
  chapterText: "A".repeat(200),
  createdAt: new Date().toISOString(),
  ...overrides,
});

describe("useLessonsStore", () => {
  describe("initial state", () => {
    it("starts with an empty list when localStorage is empty", () => {
      const { result } = renderHook(() => useLessonsStore());
      expect(result.current.lessons).toEqual([]);
    });

    it("hydrates from existing localStorage data", () => {
      const lesson = makeLesson({ id: "existing-id" });
      localStorage.setItem("lessonbuilder_lessons", JSON.stringify([lesson]));

      const { result } = renderHook(() => useLessonsStore());
      expect(result.current.lessons).toHaveLength(1);
      expect(result.current.lessons[0].id).toBe("existing-id");
    });

    it("returns empty list when localStorage contains malformed JSON", () => {
      localStorage.setItem("lessonbuilder_lessons", "not-valid-json{{{{");
      const { result } = renderHook(() => useLessonsStore());
      expect(result.current.lessons).toEqual([]);
    });
  });

  describe("addLesson", () => {
    it("adds a lesson to the front of the list", () => {
      const { result } = renderHook(() => useLessonsStore());
      const lesson = makeLesson({ title: "Chapter One" });

      act(() => { result.current.addLesson(lesson); });

      expect(result.current.lessons).toHaveLength(1);
      expect(result.current.lessons[0].title).toBe("Chapter One");
    });

    it("prepends new lessons so the most recent is first", () => {
      const { result } = renderHook(() => useLessonsStore());
      const first = makeLesson({ title: "First" });
      const second = makeLesson({ title: "Second" });

      act(() => { result.current.addLesson(first); });
      act(() => { result.current.addLesson(second); });

      expect(result.current.lessons[0].title).toBe("Second");
      expect(result.current.lessons[1].title).toBe("First");
    });

    it("persists the lesson to localStorage", () => {
      const { result } = renderHook(() => useLessonsStore());
      const lesson = makeLesson({ id: "persist-me" });

      act(() => { result.current.addLesson(lesson); });

      const stored = JSON.parse(localStorage.getItem("lessonbuilder_lessons")!);
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe("persist-me");
    });
  });

  describe("deleteLesson", () => {
    it("removes the lesson with the given id", () => {
      const lesson = makeLesson({ id: "to-delete" });
      localStorage.setItem("lessonbuilder_lessons", JSON.stringify([lesson]));

      const { result } = renderHook(() => useLessonsStore());
      act(() => { result.current.deleteLesson("to-delete"); });

      expect(result.current.lessons).toHaveLength(0);
    });

    it("leaves other lessons intact", () => {
      const keep = makeLesson({ id: "keep" });
      const remove = makeLesson({ id: "remove" });
      localStorage.setItem("lessonbuilder_lessons", JSON.stringify([keep, remove]));

      const { result } = renderHook(() => useLessonsStore());
      act(() => { result.current.deleteLesson("remove"); });

      expect(result.current.lessons).toHaveLength(1);
      expect(result.current.lessons[0].id).toBe("keep");
    });

    it("does nothing if the id does not exist", () => {
      const lesson = makeLesson({ id: "exists" });
      localStorage.setItem("lessonbuilder_lessons", JSON.stringify([lesson]));

      const { result } = renderHook(() => useLessonsStore());
      act(() => { result.current.deleteLesson("ghost-id"); });

      expect(result.current.lessons).toHaveLength(1);
    });

    it("persists the deletion to localStorage", () => {
      const lesson = makeLesson({ id: "gone" });
      localStorage.setItem("lessonbuilder_lessons", JSON.stringify([lesson]));

      const { result } = renderHook(() => useLessonsStore());
      act(() => { result.current.deleteLesson("gone"); });

      const stored = JSON.parse(localStorage.getItem("lessonbuilder_lessons")!);
      expect(stored).toHaveLength(0);
    });
  });

  describe("getLesson", () => {
    it("returns the lesson matching the id", () => {
      const lesson = makeLesson({ id: "find-me", title: "Target Lesson" });
      localStorage.setItem("lessonbuilder_lessons", JSON.stringify([lesson]));

      const { result } = renderHook(() => useLessonsStore());
      const found = result.current.getLesson("find-me");

      expect(found).toBeDefined();
      expect(found?.title).toBe("Target Lesson");
    });

    it("returns undefined for an unknown id", () => {
      const { result } = renderHook(() => useLessonsStore());
      expect(result.current.getLesson("nope")).toBeUndefined();
    });
  });
});
