import { useState, useCallback } from "react";

export interface LearnerPreferences {
  audience: "general" | "k12" | "university" | "professional";
  goal: "understand" | "exam" | "apply" | "overview";
  quizTemplate: "quick" | "standard" | "deep";
  customGoal?: string;
  subjectType?: "general" | "language";
}

export interface PracticeCard {
  prompt: string;
  model: string;
  tip?: string;
}

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
  practiceCards?: PracticeCard[];
  chapterText: string;
  createdAt: string;
  learnerPreferences?: LearnerPreferences;
}

const STORAGE_KEY = "lessonbuilder_lessons";
const FILE_VERSION = 1;

export interface LessonExportFile {
  _version: number;
  _exported: string;
  lesson: StoredLesson;
}

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

  const importLesson = useCallback((file: File): Promise<{ lesson: StoredLesson; isNew: boolean }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string) as LessonExportFile;
          const lesson = json.lesson ?? json;
          if (!lesson.id || !lesson.title || !lesson.summary) {
            reject(new Error("Invalid lesson file — missing required fields."));
            return;
          }
          const existing = loadLessons();
          const alreadyExists = existing.some((l) => l.id === lesson.id);
          if (alreadyExists) {
            const updated = existing.map((l) => (l.id === lesson.id ? lesson : l));
            saveLessons(updated);
            setLessonsState(updated);
          } else {
            const next = [lesson, ...existing];
            saveLessons(next);
            setLessonsState(next);
          }
          resolve({ lesson, isNew: !alreadyExists });
        } catch {
          reject(new Error("Could not read file — make sure it's a valid lesson file."));
        }
      };
      reader.onerror = () => reject(new Error("File read error."));
      reader.readAsText(file);
    });
  }, []);

  const exportLesson = useCallback((lesson: StoredLesson): void => {
    const payload: LessonExportFile = {
      _version: FILE_VERSION,
      _exported: new Date().toISOString(),
      lesson,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${lesson.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.lesson.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return { lessons, addLesson, deleteLesson, getLesson, importLesson, exportLesson };
}
