import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSettings, type LlmSettings } from "@/hooks/use-settings";

const STORAGE_KEY = "lessonbuilder:llm-settings";

const makeSettings = (overrides: Partial<LlmSettings> = {}): LlmSettings => ({
  provider: "openai",
  apiKey: "sk-test-abc123",
  model: "gpt-4o-mini",
  baseUrl: "",
  ...overrides,
});

describe("useSettings", () => {
  describe("initial state", () => {
    it("returns default settings when localStorage is empty", () => {
      const { result } = renderHook(() => useSettings());
      expect(result.current.settings.provider).toBe("openai");
      expect(result.current.settings.apiKey).toBe("");
      expect(result.current.isConfigured).toBe(false);
    });

    it("hydrates settings from localStorage", () => {
      const saved = makeSettings();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      const { result } = renderHook(() => useSettings());
      expect(result.current.settings.provider).toBe("openai");
      expect(result.current.settings.apiKey).toBe("sk-test-abc123");
      expect(result.current.isConfigured).toBe(true);
    });

    it("falls back to defaults for malformed localStorage data", () => {
      localStorage.setItem(STORAGE_KEY, "{{bad json");
      const { result } = renderHook(() => useSettings());
      expect(result.current.settings.provider).toBe("openai");
      expect(result.current.settings.apiKey).toBe("");
      expect(result.current.isConfigured).toBe(false);
    });

    it("falls back to defaults if required fields are missing", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ apiKey: "orphan-key" }));
      const { result } = renderHook(() => useSettings());
      expect(result.current.settings.provider).toBe("openai");
      expect(result.current.settings.apiKey).toBe("");
    });
  });

  describe("isConfigured", () => {
    it("is false when apiKey is empty string", () => {
      const saved = makeSettings({ apiKey: "" });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      const { result } = renderHook(() => useSettings());
      expect(result.current.isConfigured).toBe(false);
    });

    it("is true when all required fields are present", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(makeSettings()));
      const { result } = renderHook(() => useSettings());
      expect(result.current.isConfigured).toBe(true);
    });
  });

  describe("saveSettings", () => {
    it("updates the in-memory state", () => {
      const { result } = renderHook(() => useSettings());
      const next = makeSettings({ provider: "anthropic", model: "claude-3-haiku" });

      act(() => { result.current.saveSettings(next); });

      expect(result.current.settings.provider).toBe("anthropic");
      expect(result.current.isConfigured).toBe(true);
    });

    it("persists to localStorage", () => {
      const { result } = renderHook(() => useSettings());
      act(() => { result.current.saveSettings(makeSettings({ apiKey: "sk-save-test" })); });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored.apiKey).toBe("sk-save-test");
    });
  });

  describe("clearSettings", () => {
    it("resets settings to defaults and marks as not configured", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(makeSettings()));
      const { result } = renderHook(() => useSettings());

      act(() => { result.current.clearSettings(); });

      expect(result.current.settings.apiKey).toBe("");
      expect(result.current.isConfigured).toBe(false);
    });

    it("removes the key from localStorage", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(makeSettings()));
      const { result } = renderHook(() => useSettings());

      act(() => { result.current.clearSettings(); });

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });
});
