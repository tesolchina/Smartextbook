import { AlertCircle, Link2, FileText, FlaskConical, ChevronRight, FileUp } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { PdfExtractor } from "@/components/pdf-extractor";

export interface Step1FormValues {
  title: string;
  chapterText: string;
}

type Tab = "paste" | "url" | "pdf";

interface Props {
  form: UseFormReturn<Step1FormValues>;
  tab: Tab;
  setTab: (t: Tab) => void;
  urlInput: string;
  setUrlInput: (v: string) => void;
  urlError: string;
  setUrlError: (v: string) => void;
  isFetchingUrl: boolean;
  onFetchUrl: () => void;
  onClose: () => void;
  onNext: () => void;
  onLoadSample: () => void;
}

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "paste", label: "Paste text",  icon: <FileText className="w-3.5 h-3.5" /> },
  { id: "url",   label: "Fetch URL",   icon: <Link2 className="w-3.5 h-3.5" /> },
  { id: "pdf",   label: "Upload PDF",  icon: <FileUp className="w-3.5 h-3.5" /> },
];

export function LessonFormStep1({
  form, tab, setTab,
  urlInput, setUrlInput, urlError, setUrlError,
  isFetchingUrl, onFetchUrl, onClose, onNext, onLoadSample,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">Title</label>
        <input
          {...form.register("title")}
          placeholder="e.g. Chapter 4 — Cellular Respiration"
          className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
        />
        {form.formState.errors.title && (
          <p className="text-destructive text-xs mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {form.formState.errors.title.message}
          </p>
        )}
      </div>

      {/* Source material */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-semibold text-foreground">Source Material</label>
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
          >
            <FlaskConical className="w-3 h-3" /> Try a sample
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-secondary rounded-lg mb-3 w-fit text-xs">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => { setTab(t.id); setUrlError(""); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                tab === t.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* PDF upload */}
        {tab === "pdf" && (
          <PdfExtractor
            onExtracted={(text, guessedTitle) => {
              form.setValue("chapterText", text, { shouldValidate: true });
              if (!form.getValues("title")) {
                form.setValue("title", guessedTitle.slice(0, 100), { shouldValidate: true });
              }
              setTab("paste");
            }}
          />
        )}

        {/* Paste text */}
        {tab === "paste" && (
          <div>
            <textarea
              {...form.register("chapterText")}
              placeholder="Paste your chapter, article, or study material here…"
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none font-serif leading-relaxed"
              rows={10}
            />
            {form.formState.errors.chapterText && (
              <p className="text-destructive text-xs mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {form.formState.errors.chapterText.message}
              </p>
            )}
          </div>
        )}

        {/* Fetch URL */}
        {tab === "url" && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => { setUrlInput(e.target.value); setUrlError(""); }}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onFetchUrl(); } }}
                placeholder="https://en.wikipedia.org/wiki/Photosynthesis"
                className="flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
              <button
                type="button"
                onClick={onFetchUrl}
                disabled={isFetchingUrl || !urlInput.trim()}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all whitespace-nowrap"
              >
                {isFetchingUrl
                  ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <Link2 className="w-4 h-4" />}
                Fetch
              </button>
            </div>
            {urlError && (
              <p className="text-destructive text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {urlError}
              </p>
            )}
            {!urlError && (
              <p className="text-xs text-muted-foreground">
                Works best with Wikipedia articles, textbook excerpts, and text-rich pages.
              </p>
            )}
            {form.watch("chapterText") && (
              <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                ✓ Content fetched — switch to "Paste text" to review before generating.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-secondary transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
