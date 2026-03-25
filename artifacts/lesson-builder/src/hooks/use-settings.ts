import { useState, useEffect, useCallback } from "react";

export interface LlmSettings {
  provider: string;
  apiKey: string;
  model: string;
  baseUrl: string;
}

const STORAGE_KEY = "lessonbuilder:llm-settings";

function loadFromStorage(): LlmSettings | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.provider && parsed?.apiKey && parsed?.model) return parsed as LlmSettings;
    return null;
  } catch {
    return null;
  }
}

function saveToStorage(settings: LlmSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export function useSettings() {
  const [settings, setSettingsState] = useState<LlmSettings | null>(() => loadFromStorage());

  const saveSettings = useCallback((next: LlmSettings) => {
    saveToStorage(next);
    setSettingsState(next);
  }, []);

  const clearSettings = useCallback(() => {
    clearStorage();
    setSettingsState(null);
  }, []);

  const isConfigured = settings !== null && settings.apiKey.length > 0;

  return { settings, saveSettings, clearSettings, isConfigured };
}
