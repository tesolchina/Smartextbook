import { useState, useRef, useEffect } from "react";

const SESSION_KEY = "deck_unlocked";
const CORRECT = "ieee2026";

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [value, setValue] = useState("");
  const [shake, setShake] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!unlocked) inputRef.current?.focus();
  }, [unlocked]);

  if (unlocked) return <>{children}</>;

  function attempt() {
    if (value.trim() === CORRECT) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setUnlocked(true);
    } else {
      setError(true);
      setShake(true);
      setValue("");
      setTimeout(() => setShake(false), 600);
    }
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") attempt();
  }

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#0a0a0a",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      <div style={{
        background: "#161616",
        border: "1px solid #2a2a2a",
        borderRadius: "16px",
        padding: "48px 40px",
        width: "100%", maxWidth: "360px",
        textAlign: "center",
        animation: shake ? "shake 0.5s ease" : "none",
      }}>
        <div style={{ fontSize: "28px", marginBottom: "8px" }}>🔒</div>
        <h1 style={{ color: "#fff", fontSize: "18px", fontWeight: 700, margin: "0 0 6px" }}>
          IEEE ProComm Deck
        </h1>
        <p style={{ color: "#666", fontSize: "13px", margin: "0 0 28px" }}>
          This presentation is private.
        </p>
        <input
          ref={inputRef}
          type="password"
          placeholder="Enter access code"
          value={value}
          onChange={e => { setValue(e.target.value); setError(false); }}
          onKeyDown={onKey}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "12px 16px",
            background: "#1e1e1e",
            border: `1.5px solid ${error ? "#ef4444" : "#333"}`,
            borderRadius: "10px",
            color: "#fff", fontSize: "15px",
            outline: "none",
            marginBottom: "12px",
            transition: "border-color 0.2s",
          }}
        />
        {error && (
          <p style={{ color: "#ef4444", fontSize: "12px", margin: "-4px 0 10px" }}>
            Incorrect access code.
          </p>
        )}
        <button
          onClick={attempt}
          style={{
            width: "100%", padding: "12px",
            background: "#fff", color: "#000",
            border: "none", borderRadius: "10px",
            fontSize: "14px", fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Unlock
        </button>
      </div>
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
