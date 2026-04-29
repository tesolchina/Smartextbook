export default function SlideDestination() {
  const steps = [
    { label: "Article", sub: "ProComm resource library" },
    { label: "Lesson", sub: "AI-assisted interactive module" },
    { label: "Library", sub: "IEEE eLearning Library" },
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
          Where This Goes
        </div>
        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "3.2vw",
            fontWeight: 900,
            color: "#2a1f18",
            lineHeight: 1.15,
            marginBottom: "1vh",
            maxWidth: "72vw",
          }}
        >
          Lessons published to the IEEE eLearning Library —
          <br />available to IEEE members worldwide.
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

        <div style={{ display: "flex", gap: "5vw", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                background: "#fff",
                border: "1px solid rgba(184,90,42,0.12)",
                borderRadius: "1vw",
                padding: "2.5vh 2.2vw",
                boxShadow: "0 2px 12px rgba(42,31,24,0.05)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "1vw",
                  fontWeight: 700,
                  color: "#b85a2a",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "1.2vh",
                }}
              >
                IEEE eLearning Library
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "1.25vw",
                  color: "rgba(42,31,24,0.7)",
                  lineHeight: 1.6,
                  marginBottom: "1.8vh",
                }}
              >
                The Library already hosts hundreds of courses used by engineers,
                faculty, and students at academic institutions and corporations
                worldwide. It is the IEEE's primary destination for professional
                continuing education.
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "1.25vw",
                  color: "rgba(42,31,24,0.7)",
                  lineHeight: 1.6,
                }}
              >
                ProComm-generated interactive lessons are a natural complement
                to the existing catalog — peer-reviewed article content,
                delivered in an active-learning format, authored by the
                community that wrote the research.
              </div>
            </div>
          </div>

          <div
            style={{
              flexShrink: 0,
              width: "28vw",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1vw",
                fontWeight: 700,
                color: "#b85a2a",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "1.8vh",
                alignSelf: "flex-start",
              }}
            >
              The Pipeline
            </div>
            {steps.map((step, i) => (
              <div key={i} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    width: "100%",
                    background: i === 2
                      ? "linear-gradient(135deg, #b85a2a 0%, #d4a020 100%)"
                      : "#fff",
                    border: i === 2
                      ? "none"
                      : "1px solid rgba(184,90,42,0.15)",
                    borderRadius: "0.8vw",
                    padding: "1.4vh 1.8vw",
                    boxShadow: "0 1px 8px rgba(42,31,24,0.05)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display-family)",
                      fontSize: "1.5vw",
                      fontWeight: 800,
                      color: i === 2 ? "#faf8f5" : "#2a1f18",
                      marginBottom: "0.2vh",
                    }}
                  >
                    {step.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body-family)",
                      fontSize: "1vw",
                      color: i === 2 ? "rgba(250,248,245,0.75)" : "rgba(42,31,24,0.5)",
                    }}
                  >
                    {step.sub}
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div
                    style={{
                      width: "0.25vw",
                      height: "2.5vh",
                      background: "linear-gradient(to bottom, #b85a2a, #d4a020)",
                      borderRadius: "9999px",
                      margin: "0.3vh 0",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
