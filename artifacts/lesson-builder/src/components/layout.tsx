import { Link } from "wouter";
import { BookOpenText, Key, CheckCircle } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { useSettingsModal } from "@/hooks/use-settings-modal";

export function Layout({ children }: { children: React.ReactNode }) {
  const { isConfigured } = useSettings();
  const { openSettings } = useSettingsModal();

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-background text-foreground selection:bg-primary/20">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/app" className="flex items-center gap-2.5 group outline-none">
            <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <BookOpenText className="w-5 h-5" />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight text-foreground">
              LessonBuilder
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link href="/about" className="hidden md:inline text-sm font-semibold text-muted-foreground hover:text-primary transition-colors outline-none focus-visible:text-primary">
              About
            </Link>
            <Link href="/app" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors outline-none focus-visible:text-primary">
              My Lessons
            </Link>
            <Link href="/credits" className="hidden md:inline text-sm font-semibold text-muted-foreground hover:text-primary transition-colors outline-none focus-visible:text-primary">
              Credits
            </Link>
            <button
              onClick={openSettings}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                isConfigured
                  ? "text-green-700 dark:text-green-400 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20"
                  : "text-muted-foreground bg-secondary hover:bg-secondary/80 border border-border hover:border-primary/40 hover:text-primary"
              }`}
            >
              {isConfigured ? (
                <CheckCircle className="w-3.5 h-3.5" />
              ) : (
                <Key className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">{isConfigured ? "API Key ✓" : "Set API Key"}</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-y-auto">{children}</main>
    </div>
  );
}
