import { useState } from "react";
import { useLocation } from "wouter";
import { Award, Search, Shield, BookOpen, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function CertLookup() {
  const [, navigate] = useLocation();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = input.trim();
    if (!id) { setError("Please enter a certificate ID."); return; }
    const extracted = id.match(/\/cert\/([0-9a-f-]{36})/i)?.[1] ?? id;
    if (!UUID_RE.test(extracted)) { setError("That doesn't look like a valid certificate ID or link."); return; }
    navigate(`${BASE}/cert/${extracted}`);
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-lg space-y-10 text-center">

          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                <Award className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-3xl font-serif font-bold">Certificate Verification</h1>
            <p className="text-muted-foreground leading-relaxed">
              Enter a certificate ID or paste a certificate link to verify a learner's completion record.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(""); }}
                placeholder="Certificate ID or link…"
                className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${
                  error ? "border-destructive" : "border-border"
                }`}
                autoFocus
              />
            </div>
            {error && <p className="text-xs text-destructive text-left px-1">{error}</p>}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              Verify Certificate <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {[
              { icon: <Shield className="w-4 h-4" />, title: "Tamper-evident", desc: "Each certificate has a SHA-256 hash that proves it hasn't been modified." },
              { icon: <BookOpen className="w-4 h-4" />, title: "Content-based", desc: "Trust comes from the learning content itself, not institutional authority." },
              { icon: <Award className="w-4 h-4" />, title: "Permanent record", desc: "Certificates are stored permanently and publicly accessible by their ID." },
            ].map((item) => (
              <div key={item.title} className="bg-card border border-border rounded-2xl p-4 space-y-2">
                <div className="text-primary">{item.icon}</div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </Layout>
  );
}
