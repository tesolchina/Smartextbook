import { useState, useEffect, useRef } from "react";
import { X, Key, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, ExternalLink, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PROVIDERS, getProvider } from "@/lib/providers";
import { type LlmSettings, useSettings } from "@/hooks/use-settings";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { settings, saveSettings, clearSettings } = useSettings();

  const [provider, setProvider] = useState(settings?.provider ?? "openai");
  const [apiKey, setApiKey] = useState(settings?.apiKey ?? "");
  const [model, setModel] = useState(settings?.model ?? "");
  const [baseUrl, setBaseUrl] = useState(settings?.baseUrl ?? "");
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [testMessage, setTestMessage] = useState("");

  const currentProvider = getProvider(provider);

  useEffect(() => {
    if (open) {
      setProvider(settings?.provider ?? "openai");
      setApiKey(settings?.apiKey ?? "");
      setModel(settings?.model ?? "");
      setBaseUrl(settings?.baseUrl ?? "");
      setTestStatus("idle");
    }
  }, [open, settings]);

  useEffect(() => {
    const prov = getProvider(provider);
    if (prov && prov.models.length > 0) {
      const existing = prov.models.find((m) => m.id === model);
      if (!existing) {
        setModel(prov.models[0].id);
      }
    } else if (provider === "custom") {
      setModel(settings?.model ?? "");
    }
  }, [provider]);

  const handleSave = () => {
    const next: LlmSettings = { provider, apiKey: apiKey.trim(), model: model.trim(), baseUrl: baseUrl.trim() };
    saveSettings(next);
    onClose();
  };

  const handleClear = () => {
    clearSettings();
    setApiKey("");
    setModel("");
    setBaseUrl("");
    setProvider("openai");
    setTestStatus("idle");
  };

  const handleTest = async () => {
    if (!apiKey.trim() || !model.trim()) {
      setTestMessage("Enter your API key and model first.");
      setTestStatus("error");
      return;
    }

    setTestStatus("loading");
    setTestMessage("");

    try {
      const resolvedBaseUrl =
        provider === "custom" ? baseUrl.trim() : getProvider(provider)?.baseUrl ?? "";

      const res = await fetch(`${resolvedBaseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`,
          ...(provider === "openrouter"
            ? { "HTTP-Referer": "https://lessonbuilder.app", "X-Title": "LessonBuilder" }
            : {}),
        },
        body: JSON.stringify({
          model: model.trim(),
          messages: [{ role: "user", content: "Say OK." }],
          max_tokens: 5,
        }),
      });

      if (res.ok) {
        setTestStatus("ok");
        setTestMessage("Connection successful! Your key works.");
      } else {
        const data = await res.json().catch(() => ({}));
        const msg = data?.error?.message ?? `HTTP ${res.status}`;
        setTestStatus("error");
        setTestMessage(`Connection failed: ${msg}`);
      }
    } catch (err: any) {
      setTestStatus("error");
      setTestMessage(`Connection failed: ${err.message}`);
    }
  };

  const canSave = apiKey.trim() && model.trim() && (provider !== "custom" || baseUrl.trim());

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-background border border-border rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />

            <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-xl">AI Provider Settings</h2>
                  <p className="text-xs text-muted-foreground">Bring your own API key</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-bold mb-2">Provider</label>
                <div className="relative">
                  <select
                    value={provider}
                    onChange={(e) => { setProvider(e.target.value); setTestStatus("idle"); }}
                    className="w-full appearance-none bg-card border-2 border-border rounded-xl px-4 py-3 pr-10 text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                  >
                    {PROVIDERS.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {provider === "custom" && (
                <div>
                  <label className="block text-sm font-bold mb-2">Base URL</label>
                  <input
                    type="url"
                    value={baseUrl}
                    onChange={(e) => { setBaseUrl(e.target.value); setTestStatus("idle"); }}
                    placeholder="https://your-endpoint.com/v1"
                    className="w-full bg-card border-2 border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Must be an OpenAI-compatible chat completions endpoint</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold mb-2 flex items-center justify-between">
                  <span>API Key</span>
                  {currentProvider?.docsUrl && (
                    <a
                      href={currentProvider.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1 font-normal"
                    >
                      Get key <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => { setApiKey(e.target.value); setTestStatus("idle"); }}
                    placeholder={currentProvider?.keyPlaceholder ?? "your-api-key"}
                    className="w-full bg-card border-2 border-border rounded-xl px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {currentProvider?.keyHint && (
                  <p className="text-xs text-muted-foreground mt-1">{currentProvider.keyHint}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Model</label>
                {currentProvider && currentProvider.models.length > 0 ? (
                  <div className="relative">
                    <select
                      value={model}
                      onChange={(e) => { setModel(e.target.value); setTestStatus("idle"); }}
                      className="w-full appearance-none bg-card border-2 border-border rounded-xl px-4 py-3 pr-10 text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                    >
                      {currentProvider.models.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => { setModel(e.target.value); setTestStatus("idle"); }}
                    placeholder="e.g. gpt-4o, llama-3-70b"
                    className="w-full bg-card border-2 border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-mono text-sm"
                  />
                )}
              </div>

              <button
                type="button"
                onClick={handleTest}
                disabled={testStatus === "loading" || !apiKey.trim() || !model.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-border bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {testStatus === "loading" ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Testing connection...</>
                ) : (
                  "Test connection"
                )}
              </button>

              {testStatus === "ok" && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  {testMessage}
                </div>
              )}
              {testStatus === "error" && (
                <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {testMessage}
                </div>
              )}

              <div className="p-3 rounded-xl bg-secondary/60 border border-border/50 text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Privacy:</strong> Your API key is stored only in your browser's local storage. It is sent directly to{" "}
                {currentProvider ? <strong className="text-foreground">{currentProvider.name}</strong> : "your chosen provider"} and never to our servers.
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 p-6 pt-4 border-t border-border">
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                Clear key
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!canSave}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Save settings
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
