export default function Slide9NextSteps() {
  const asks = [
    {
      icon: "✉️",
      who: "Traci",
      label: "Send permission letters",
      detail: "Review & personalise the 14 ready-to-send emails — we prepare, you send (includes LinkedIn messages to Bob Lyons and Samartha Vashishtha)",
    },
    {
      icon: "🎓",
      who: "Both",
      label: "Co-author the research study proposal",
      detail: "Define participant pool, methodology, and IRB pathway — Cornell + HKBU",
    },
    {
      icon: "🤝",
      who: "Traci",
      label: "Connect with Alan Chong (23 articles)",
      detail: "Largest contributor — key partner for content permissions and research",
    },
    {
      icon: "💡",
      who: "Traci",
      label: "Share your thinking on the eLearning lesson conversion plan",
      detail: "Who decides which articles become lessons, at what cadence, and whether there is an IEEE editorial process for publishing to the eLearning Library",
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
          Next Steps
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
          Four asks from Traci.
        </div>
        <div
          style={{
            width: "5vw",
            height: "0.4vh",
            background: "linear-gradient(to right, #b85a2a, #d4a020)",
            borderRadius: "9999px",
            marginBottom: "3vh",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "1.8vh" }}>
          {asks.map((a, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1.8vw",
                background: "#fff",
                border: "1px solid rgba(184,90,42,0.1)",
                borderRadius: "0.8vw",
                padding: "1.5vh 2vw",
                boxShadow: "0 1px 8px rgba(42,31,24,0.04)",
              }}
            >
              <div style={{ fontSize: "1.8vw", flexShrink: 0, paddingTop: "0.2vh" }}>
                {a.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1vw",
                    marginBottom: "0.3vh",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-body-family)",
                      fontSize: "1.5vw",
                      fontWeight: 700,
                      color: "#2a1f18",
                    }}
                  >
                    {a.label}
                  </div>
                  <div
                    style={{
                      background: a.who === "Traci" ? "#b85a2a" : "#d4a020",
                      color: "#faf8f5",
                      fontFamily: "var(--font-body-family)",
                      fontSize: "0.9vw",
                      fontWeight: 700,
                      padding: "0.2vh 0.6vw",
                      borderRadius: "0.3vw",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {a.who}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1.2vw",
                    color: "rgba(42,31,24,0.55)",
                  }}
                >
                  {a.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
