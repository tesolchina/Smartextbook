import { useState, useRef, useCallback } from "react";
import { ChatHistoryMessage } from "@workspace/api-client-react";

export function useChat(lessonId: number, initialHistory: ChatHistoryMessage[] = []) {
  const [messages, setMessages] = useState<ChatHistoryMessage[]>(initialHistory);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isStreaming) return;

    setError(null);
    const userMsg: ChatHistoryMessage = { role: "user", content };
    const historyToSend = [...messages];
    
    // Optimistically add user message
    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch(`/api/lessons/${lessonId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, history: historyToSend }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        throw new Error("Failed to send message to tutor");
      }
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      // Add an empty assistant message to stream into
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
              } catch (e) {
                // Ignore incomplete JSON chunks, they will be resolved in next stream chunk
                // in a robust SSE implementation, but typical simple SSEs send complete JSON objects per line
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
  }, [lessonId, messages, isStreaming]);

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  }, []);

  return {
    messages,
    isStreaming,
    sendMessage,
    stopStreaming,
    error,
    setMessages
  };
}
