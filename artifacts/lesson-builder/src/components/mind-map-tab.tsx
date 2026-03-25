import { useState, useEffect, useRef, useCallback } from "react";
import { RefreshCw, GitBranch, AlertTriangle, Loader2 } from "lucide-react";
import mermaid from "mermaid";
import { useSettings } from "@/hooks/use-settings";
import { type StoredLesson } from "@/hooks/use-lessons-store";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  fontFamily: "Georgia, serif",
  fontSize: 14,
});

let _mermaidCounter = 0;

interface MindMapTabProps {
  lesson: StoredLesson;
  diagram: string | null;
  onDiagramReady: (diagram: string) => void;
}

type RenderState =
  | { status: "loading" }
  | { status: "success"; diagram: string }
  | { status: "error"; message: string };

export function MindMapTab({ lesson, diagram, onDiagramReady }: MindMapTabProps) {
  const { getLlmConfig, isConfigured } = useSettings();

  const initialState: RenderState = diagram
    ? { status: "success", diagram }
    : { status: "loading" };

  const [renderState, setRenderState] = useState<RenderState>(initialState);
  const containerRef = useRef<HTMLDivElement>(null);

  const generate = useCallback(async () => {
    if (!isConfigured) {
      setRenderState({ status: "error", message: "Configure your LLM provider in Settings first." });
      return;
    }

    setRenderState({ status: "loading" });
    try {
      const config = getLlmConfig();
      const res = await fetch("/api/generate-mindmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: lesson.title,
          summary: lesson.summary,
          keyConcepts: lesson.keyConcepts,
          llmConfig: config,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      if (!data.mermaid) throw new Error("No diagram returned by the AI.");

      onDiagramReady(data.mermaid);
      setRenderState({ status: "success", diagram: data.mermaid });
    } catch (err: any) {
      setRenderState({ status: "error", message: err.message || "Failed to generate mind map." });
    }
  }, [lesson, isConfigured, getLlmConfig, onDiagramReady]);

  useEffect(() => {
    if (!diagram) {
      generate();
    }
  }, []);

  useEffect(() => {
    if (renderState.status !== "success" || !containerRef.current) return;

    const renderId = `mm-${++_mermaidCounter}`;
    containerRef.current.innerHTML = "";

    mermaid
      .render(renderId, renderState.diagram)
      .then(({ svg }) => {
        if (!containerRef.current) return;
        containerRef.current.innerHTML = svg;
        const svgEl = containerRef.current.querySelector("svg");
        if (svgEl) {
          svgEl.style.width = "100%";
          svgEl.style.height = "auto";
          svgEl.removeAttribute("height");
        }
      })
      .catch((err) => {
        setRenderState({
          status: "error",
          message: `Could not render the diagram: ${err.message || "invalid Mermaid syntax"}. Try regenerating.`,
        });
      });
  }, [renderState]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <GitBranch className="w-4 h-4" />
          <span className="text-sm font-medium">Concept Mind Map</span>
        </div>
        {renderState.status !== "loading" && (
          <button
            onClick={generate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Regenerate
          </button>
        )}
      </div>

      {renderState.status === "loading" && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Loader2 className="w-8 h-8 animate-spin opacity-50" />
          <p className="text-sm">Generating mind map…</p>
        </div>
      )}

      {renderState.status === "error" && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 flex flex-col items-center gap-3 text-center max-w-md mx-auto">
          <AlertTriangle className="w-7 h-7 text-destructive/70" />
          <p className="text-sm text-destructive/90 font-medium">{renderState.message}</p>
          <button
            onClick={generate}
            className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-xs font-semibold text-destructive/80 hover:bg-destructive/15 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Try again
          </button>
        </div>
      )}

      {renderState.status === "success" && (
        <div className="bg-card border border-border rounded-2xl p-4 md:p-6 shadow-sm overflow-auto">
          <div ref={containerRef} className="w-full min-h-[300px]" />
        </div>
      )}
    </div>
  );
}
