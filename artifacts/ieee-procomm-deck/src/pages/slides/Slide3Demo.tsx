export default function Slide3Demo() {
  const features = [
    { icon: "🎧", text: "AI-narrated audio overview (ElevenLabs)" },
    { icon: "✅", text: "Comprehension check questions" },
    { icon: "📊", text: "xAPI statements sent to LRS" },
    { icon: "🏅", text: "Auto-generated PDF certificate" },
  ];

  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg, #2a0e04 0%, #4e1e0a 50%, #180802 100%)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 75% 30%, rgba(212,160,32,0.12) 0%, transparent 55%)",
        }}
      />

      <div className="absolute" style={{ left: "7vw", top: "9vh", right: "7vw" }}>
        <div
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "1.3vw",
            fontWeight: 600,
            color: "rgba(245,232,192,0.75)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: "1.5vh",
          }}
        >
          Live Demo
        </div>

        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "3.6vw",
            fontWeight: 900,
            color: "#faf8f5",
            lineHeight: 1.1,
            marginBottom: "1.2vh",
          }}
        >
          The learner experience,
          <br />
          working today.
        </div>

        <div
          style={{
            width: "5vw",
            height: "0.4vh",
            background: "linear-gradient(to right, #d4a020, #f5e8c0)",
            borderRadius: "9999px",
            marginBottom: "3.5vh",
          }}
        />

        <div style={{ display: "flex", gap: "4vw", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                background: "rgba(250,248,245,0.06)",
                border: "1px solid rgba(212,160,32,0.25)",
                borderRadius: "1vw",
                padding: "2.5vh 2vw",
                marginBottom: "2.5vh",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "1.2vw",
                  color: "rgba(245,232,192,0.6)",
                  marginBottom: "0.8vh",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Prototype Lesson
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: "1.8vw",
                  fontWeight: 700,
                  color: "#faf8f5",
                  marginBottom: "0.5vh",
                }}
              >
                "Teaching Oral Presentation Skills<br />with NLP Technologies"
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "1.2vw",
                  color: "rgba(245,232,192,0.6)",
                }}
              >
                Based on Simon's TDG grant project · HKBU
              </div>
            </div>

            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.2vw",
                  padding: "1.2vh 0",
                  borderBottom: i < features.length - 1 ? "1px solid rgba(212,160,32,0.12)" : "none",
                }}
              >
                <span style={{ fontSize: "1.8vw" }}>{f.icon}</span>
                <span
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1.5vw",
                    color: "rgba(250,248,245,0.85)",
                  }}
                >
                  {f.text}
                </span>
              </div>
            ))}

            {/* xAPI explainer */}
            <div
              style={{
                marginTop: "2.5vh",
                background: "rgba(212,160,32,0.08)",
                border: "1px solid rgba(212,160,32,0.22)",
                borderLeft: "0.35vw solid #d4a020",
                borderRadius: "0 0.6vw 0.6vw 0",
                padding: "1.2vh 1.3vw",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "1vw",
                  fontWeight: 700,
                  color: "#d4a020",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "0.35vh",
                }}
              >
                What is xAPI?
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "1.1vw",
                  color: "rgba(245,232,192,0.7)",
                  lineHeight: 1.5,
                }}
              >
                xAPI (Experience API) is an open e-learning standard that records every learner action — play, pause, answer, complete — to a Learning Record Store (LRS). Every lesson generates a permanent, queryable audit trail.
              </div>
            </div>
          </div>

          <a
            href="/listening-demo.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flexShrink: 0,
              width: "34vw",
              background: "rgba(250,248,245,0.05)",
              border: "1px solid rgba(212,160,32,0.35)",
              borderRadius: "1vw",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "3vh 2vw",
              gap: "2vh",
              textDecoration: "none",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            <div
              style={{
                width: "7vw",
                height: "7vw",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #d4a020, #b85a2a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 40 40" fill="none" style={{ width: "3.5vw", height: "3.5vw" }}>
                <circle cx="20" cy="20" r="18" stroke="#faf8f5" strokeWidth="2" />
                <path d="M16 13l12 7-12 7V13z" fill="#faf8f5" />
              </svg>
            </div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.4vw",
                fontWeight: 700,
                color: "#d4a020",
                textAlign: "center",
              }}
            >
              Open Listening Demo →
            </div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1vw",
                color: "rgba(245,232,192,0.45)",
                textAlign: "center",
              }}
            >
              /listening-demo.html
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
