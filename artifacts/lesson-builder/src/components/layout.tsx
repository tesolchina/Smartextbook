import { useState } from "react";
import { Link } from "wouter";
import { BookOpenText, Key, CheckCircle, LogIn, LogOut, UserCircle, ChevronDown } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { useSettingsModal } from "@/hooks/use-settings-modal";
import { useAuth } from "@/hooks/use-auth";
import { AuthModal } from "@/components/auth-modal";

export function Layout({ children }: { children: React.ReactNode }) {
  const { isConfigured } = useSettings();
  const { openSettings } = useSettingsModal();
  const { user, logout, loading } = useAuth();

  const [authOpen, setAuthOpen] = useState(false);
  const [authStep, setAuthStep] = useState<"login" | "register">("login");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  function openLogin() { setAuthStep("login"); setAuthOpen(true); }
  function openRegister() { setAuthStep("register"); setAuthOpen(true); }

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

          <nav className="flex items-center gap-3">
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
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
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
              <span>{isConfigured ? "API Key ✓" : "Set API Key"}</span>
            </button>

            {/* Auth section */}
            {!loading && (
              user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all border border-transparent hover:border-border"
                  >
                    <UserCircle className="w-4 h-4" />
                    <span className="hidden sm:inline max-w-[120px] truncate">{user.displayName}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-2xl shadow-xl z-20 overflow-hidden">
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-xs text-muted-foreground">Signed in as</p>
                          <p className="text-sm font-semibold text-foreground truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={() => { void logout(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={openLogin}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground border border-border hover:border-primary/40 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-y-auto">{children}</main>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultStep={authStep}
      />
    </div>
  );
}
