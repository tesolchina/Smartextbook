import { useRef, useState } from "react";
import { FileUp, Loader2, AlertCircle, CheckCircle2, FileScan } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface Props {
  onExtracted: (text: string, title: string) => void;
}

type Status = "idle" | "loading" | "success" | "error";

export function PdfExtractor({ onExtracted }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setStatus("error");
      setMessage("Please select a PDF file.");
      return;
    }

    setFileName(file.name);
    setStatus("loading");
    setMessage("Reading PDF…");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = "";
      const maxPages = Math.min(pdf.numPages, 50);

      for (let i = 1; i <= maxPages; i++) {
        setMessage(`Extracting page ${i} of ${maxPages}…`);
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: any) => ("str" in item ? item.str : ""))
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        if (pageText) fullText += pageText + "\n\n";
      }

      fullText = fullText.trim();

      if (!fullText || fullText.length < 100) {
        setStatus("error");
        setMessage(
          "This PDF appears to be a scanned image — no text layer was found. " +
          "Please copy the text from the PDF and paste it manually."
        );
        return;
      }

      const guessedTitle = file.name.replace(/\.pdf$/i, "").replace(/[-_]+/g, " ");
      setStatus("success");
      setMessage(`${fullText.split(/\s+/).length.toLocaleString()} words extracted from ${pdf.numPages} page(s).`);
      onExtracted(fullText.slice(0, 80_000), guessedTitle);
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message || "Could not read this PDF. Try copying the text manually.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleChange}
      />

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:border-primary/50 hover:bg-primary/3 transition-all group"
      >
        {status === "loading" ? (
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        ) : status === "success" ? (
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        ) : status === "error" ? (
          <FileScan className="w-8 h-8 text-destructive" />
        ) : (
          <FileUp className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
        )}

        <div className="text-center">
          {status === "idle" && (
            <>
              <p className="text-sm font-semibold text-foreground">Click or drag a PDF here</p>
              <p className="text-xs text-muted-foreground mt-1">
                Works with digital PDFs that have a text layer.
                Scanned images require manual copy-paste.
              </p>
            </>
          )}
          {status === "loading" && (
            <p className="text-sm font-medium text-foreground">{message}</p>
          )}
          {status === "success" && (
            <>
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                {fileName}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{message}</p>
              <p className="text-xs text-primary font-medium mt-1">
                Text loaded — review it in "Paste text" tab before generating.
              </p>
            </>
          )}
          {status === "error" && (
            <div className="flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-xs text-destructive">{message}</p>
            </div>
          )}
        </div>
      </div>

      {status === "idle" && (
        <p className="text-xs text-muted-foreground text-center">
          Supports up to 50 pages. All processing happens in your browser — no file is uploaded to any server.
        </p>
      )}
    </div>
  );
}
