import { useState, useCallback } from "react";

export interface StoredLesson {
  id: string;
  title: string;
  summary: string;
  keyConcepts: { term: string; definition: string }[];
  quizQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  chapterText: string;
  createdAt: string;
}

const STORAGE_KEY = "lessonbuilder_lessons";

function loadLessons(): StoredLesson[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredLesson[]) : [];
  } catch {
    return [];
  }
}

function saveLessons(lessons: StoredLesson[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
}

export function useLessonsStore() {
  const [lessons, setLessonsState] = useState<StoredLesson[]>(() => loadLessons());

  const addLesson = useCallback((lesson: StoredLesson) => {
    const next = [lesson, ...loadLessons()];
    saveLessons(next);
    setLessonsState(next);
  }, []);

  const deleteLesson = useCallback((id: string) => {
    const next = loadLessons().filter((l) => l.id !== id);
    saveLessons(next);
    setLessonsState(next);
  }, []);

  const getLesson = useCallback(
    (id: string): StoredLesson | undefined => {
      return lessons.find((l) => l.id === id);
    },
    [lessons]
  );

  return { lessons, addLesson, deleteLesson, getLesson };
}
