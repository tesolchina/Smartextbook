import { useState, useCallback, useEffect } from "react";
import { PROVIDERS, getProvider } from "@/lib/providers";

export type { Provider } from "@/lib/providers";
export { PROVIDERS, getProvider } from "@/lib/providers";

export interface LlmSettings {
  provider: string;
  apiKey: string;
  model: string;
  baseUrl: string;
}

const STORAGE_KEY = "lessonbuilder:llm-settings";
const SETTINGS_CHANGE_EVENT = "lessonbuilder:settings-changed";

const DEFAULT_SETTINGS: LlmSettings = {
  provider: "openai",
  apiKey: "",
  model: "gpt-4o",
  baseUrl: "",
};

function loadSettings(): LlmSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    if (parsed?.provider && parsed?.model) return { ...DEFAULT_SETTINGS, ...parsed };
    return { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function persistSettings(settings: LlmSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent(SETTINGS_CHANGE_EVENT, { detail: settings }));
  } catch {}
}

export function useSettings() {
  const [settings, setSettingsState] = useState<LlmSettings>(loadSettings);

  useEffect(() => {
    const handleChange = (e: CustomEvent<LlmSettings>) => {
      setSettingsState(e.detail);
    };
    window.addEventListener(SETTINGS_CHANGE_EVENT as any, handleChange as any);
    return () => window.removeEventListener(SETTINGS_CHANGE_EVENT as any, handleChange as any);
  }, []);

  const saveSettings = useCallback((next: LlmSettings) => {
    persistSettings(next);
    setSettingsState(next);
  }, []);

  const updateSettings = useCallback((updates: Partial<LlmSettings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...updates };
      persistSettings(next);
      return next;
    });
  }, []);

  const clearSettings = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent(SETTINGS_CHANGE_EVENT, { detail: { ...DEFAULT_SETTINGS } }));
    } catch {}
    setSettingsState({ ...DEFAULT_SETTINGS });
  }, []);

  const isConfigured = Boolean(settings.apiKey.trim());

  const getLlmConfig = () => {
    const provider = getProvider(settings.provider);
    const resolvedBaseUrl =
      settings.provider === "custom"
        ? settings.baseUrl
        : provider?.baseUrl ?? "";
    return {
      provider: settings.provider,
      apiKey: settings.apiKey,
      model: settings.model,
      baseUrl: resolvedBaseUrl,
    };
  };

  return { settings, updateSettings, saveSettings, clearSettings, isConfigured, getLlmConfig };
}
