import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2, StopCircle, Key } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/hooks/use-chat";
import { useSettings } from "@/hooks/use-settings";
import { useSettingsModal } from "@/hooks/use-settings-modal";
import { MarkdownRenderer } from "./markdown-renderer";
import { type StoredLesson } from "@/hooks/use-lessons-store";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ChatSidebarProps {
  lesson: StoredLesson;
}

const SUGGESTED_QUESTIONS = [
  "Can you summarize this chapter simply?",
  "Quiz me on the main concepts.",
  "What is the most important takeaway?",
];

export function ChatSidebar({ lesson }: ChatSidebarProps) {
  const { settings, isConfigured } = useSettings();
  const { openSettings } = useSettingsModal();
  const { messages, isStreaming, sendMessage, stopStreaming, error } = useChat(lesson);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isStreaming) {
      sendMessage(input, settings);
      setInput("");
    }
  };

  const handleSuggested = (question: string) => {
    if (!isStreaming) {
      sendMessage(question, settings);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card border-l border-border shadow-2xl shadow-black/5">
      <div className="p-4 border-b border-border bg-card z-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-serif font-bold text-lg text-foreground leading-tight">Tutor AI</h2>
          <p className="text-xs text-muted-foreground">Always here to help you learn</p>
        </div>
      </div>

      {!isConfigured && (
        <div className="mx-4 mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm">
          <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1.5">
            <Key className="w-4 h-4" /> API key required
          </p>
          <p className="text-amber-700/80 dark:text-amber-400/80 mb-3 text-xs">
            Set your API key to chat with the AI tutor.
          </p>
          <button
            onClick={openSettings}
            className="w-full px-3 py-2 rounded-lg bg-amber-500 text-white font-semibold text-xs hover:bg-amber-600 transition-colors"
          >
            Set API Key
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-6 relative bg-background/50">
        {messages.length === 0 && isConfigured && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center px-4"
          >
            <div className="w-16 h-16 bg-accent/20 text-accent rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold mb-2">Hello, Student!</h3>
            <p className="text-muted-foreground text-sm mb-8 max-w-[250px]">
              I've read this chapter and I'm ready to help. Ask me anything, or try one of these:
            </p>

            <div className="flex flex-col gap-2 w-full">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggested(q)}
                  className="text-left px-4 py-3 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all text-sm text-foreground shadow-sm group"
                >
                  <span className="group-hover:text-primary transition-colors">{q}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex gap-3 max-w-[90%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm",
                msg.role === "user"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary text-primary-foreground"
              )}>
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={cn(
                "px-4 py-3 rounded-2xl shadow-sm",
                msg.role === "user"
                  ? "bg-secondary text-secondary-foreground rounded-tr-none"
                  : "bg-card border border-border/50 text-card-foreground rounded-tl-none"
              )}>
                {msg.role === "assistant" ? (
                  <MarkdownRenderer content={msg.content || (isStreaming && idx === messages.length - 1 ? "..." : "")} />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center mx-4">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} className="h-2" />
      </div>

      <div className="p-4 bg-card border-t border-border z-10">
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={!isConfigured}
            placeholder={isConfigured ? "Ask about the chapter..." : "Set your API key to chat..."}
            className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none min-h-[52px] max-h-[120px] disabled:opacity-60 disabled:cursor-not-allowed"
            rows={1}
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={stopStreaming}
              className="absolute right-2 bottom-2 w-9 h-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white flex items-center justify-center transition-colors"
            >
              <StopCircle className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim() || isStreaming || !isConfigured}
              className="absolute right-2 bottom-2 w-9 h-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          )}
        </form>
        <p className="text-center text-[10px] text-muted-foreground mt-2 font-medium">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
