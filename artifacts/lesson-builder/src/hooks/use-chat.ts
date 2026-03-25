import { useState, useRef, useCallback } from "react";
import { type LlmSettings } from "./use-settings";
import { type StoredLesson } from "./use-lessons-store";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function useChat(lesson: StoredLesson) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string, llmSettings: LlmSettings | null) => {
    if (!content.trim() || isStreaming) return;

    if (!llmSettings) {
      setError("No API key configured. Click 'Set API Key' in the top menu to add your key.");
      return;
    }

    setError(null);
    const userMsg: ChatMessage = { role: "user", content };
    const historyToSend = [...messages];

    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: historyToSend,
          lessonContext: {
            title: lesson.title,
            summary: lesson.summary,
            keyConcepts: lesson.keyConcepts,
            chapterText: lesson.chapterText,
          },
          llmConfig: {
            provider: llmSettings.provider,
            apiKey: llmSettings.apiKey,
            model: llmSettings.model,
            baseUrl: llmSettings.baseUrl || undefined,
          },
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to send message to tutor");
      }
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.slice(6).trim();
              if (!dataStr) continue;

              try {
                const data = JSON.parse(dataStr);
                if (data.done) {
                  done = true;
                } else if (data.error) {
                  setError(data.error);
                  done = true;
                } else if (data.content) {
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastIdx = newMessages.length - 1;
                    if (newMessages[lastIdx].role === "assistant") {
                      newMessages[lastIdx] = {
                        ...newMessages[lastIdx],
                        content: newMessages[lastIdx].content + data.content,
                      };
                    }
                    return newMessages;
                  });
                }
              } catch {
                // Ignore incomplete JSON chunks
              }
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Chat stream aborted");
      } else {
        console.error("Chat error:", err);
        setError(err.message || "An error occurred while chatting.");
      }
    } finally {
      setIsStreaming(false);
    }
  }, [lesson, messages, isStreaming]);

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  }, []);

  return { messages, isStreaming, sendMessage, stopStreaming, error };
}
