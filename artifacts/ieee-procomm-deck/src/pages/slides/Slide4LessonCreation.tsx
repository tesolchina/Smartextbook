export default function Slide4LessonCreation() {
  const steps = [
    {
      n: "1",
      label: "Paste article text or URL",
      detail: "Author submits the ProComm article — plain text, PDF, or a link",
      icon: "📄",
    },
    {
      n: "2",
      label: "AI drafts the lesson",
      detail: "Generates narration script, 5 comprehension questions, and a key-points summary",
      icon: "🤖",
    },
    {
      n: "3",
      label: "Author edits & approves",
      detail: "Full editing interface — adjust wording, remove questions, change audio tone",
      icon: "✏️",
    },
    {
      n: "4",
      label: "Admin review & publish",
      detail: "One-click publish: lesson goes live with xAPI tracking and certificate enabled",
      icon: "🚀",
    },
  ];

  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{ background: "#faf8f5" }}
    >
      <div
        className="absolute"
        style={{
          bottom: 0,
          left: 0,
          right: 0,
          height: "0.5vh",
          background: "linear-gradient(to right, #b85a2a, #d4a020, #b85a2a)",
        }}
      />

      <div className="absolute" style={{ left: "7vw", top: "9vh", right: "7vw" }}>
        <div
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "1.3vw",
            fontWeight: 600,
            color: "#b85a2a",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: "1.2vh",
          }}
        >
          Lesson Creation — Author Workflow
        </div>
        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "3.4vw",
            fontWeight: 900,
            color: "#2a1f18",
            lineHeight: 1.1,
            marginBottom: "1vh",
          }}
        >
          Article in. Interactive lesson out.
        </div>
        <div
          style={{
            width: "5vw",
            height: "0.4vh",
            background: "linear-gradient(to right, #b85a2a, #d4a020)",
            borderRadius: "9999px",
            marginBottom: "3.5vh",
          }}
        />

        <div style={{ display: "flex", alignItems: "stretch", gap: "0" }}>
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {i < steps.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: "3.8vh",
                    right: "-1.2vw",
                    zIndex: 10,
                    fontSize: "2vw",
                    color: "#d4a020",
                    fontWeight: 900,
                  }}
                >
                  →
                </div>
              )}
              <div
                style={{
                  background: i % 2 === 0 ? "#fff" : "#fdf6ef",
                  border: "1px solid rgba(184,90,42,0.1)",
                  borderRadius: "0.8vw",
                  padding: "2.5vh 1.8vw",
                  margin: "0 1.2vw",
                  flex: 1,
                  boxShadow: "0 2px 12px rgba(42,31,24,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.2vh",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1vw" }}>
                  <div
                    style={{
                      width: "2.8vw",
                      height: "2.8vw",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #b85a2a, #d4a020)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontFamily: "var(--font-display-family)",
                      fontSize: "1.3vw",
                      fontWeight: 900,
                      color: "#faf8f5",
                    }}
                  >
                    {s.n}
                  </div>
                  <span style={{ fontSize: "2vw" }}>{s.icon}</span>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1.5vw",
                    fontWeight: 700,
                    color: "#2a1f18",
                    lineHeight: 1.3,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1.2vw",
                    color: "rgba(42,31,24,0.55)",
                    lineHeight: 1.5,
                  }}
                >
                  {s.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "3vh",
            display: "flex",
            alignItems: "center",
            gap: "3vw",
          }}
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid rgba(184,90,42,0.15)",
              borderRadius: "0.8vw",
              padding: "1.5vh 2vw",
              display: "flex",
              alignItems: "center",
              gap: "1vw",
              flex: 1,
            }}
          >
            <span style={{ fontSize: "1.5vw" }}>⏱</span>
            <span
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.3vw",
                color: "rgba(42,31,24,0.7)",
              }}
            >
              A volunteer author can go from article to published lesson in <strong style={{ color: "#b85a2a" }}>under 20 minutes</strong>
            </span>
          </div>
          <div
            style={{
              background: "#fff",
              border: "1px solid rgba(184,90,42,0.15)",
              borderRadius: "0.8vw",
              padding: "1.5vh 2vw",
              display: "flex",
              alignItems: "center",
              gap: "1vw",
              flex: 1,
            }}
          >
            <span style={{ fontSize: "1.5vw" }}>🔑</span>
            <span
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.3vw",
                color: "rgba(42,31,24,0.7)",
              }}
            >
              BYOK — author brings their own AI API key; no subscription required
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
