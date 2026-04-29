export default function Slide6Research() {
  const rqs = [
    {
      n: "RQ 1",
      q: "Does the interactive format improve comprehension vs. static PDF?",
      detail: "Quasi-experimental · pre/post reading comprehension · same ProComm article, two conditions",
    },
    {
      n: "RQ 2",
      q: "How does AI-narrated audio affect engagement and self-paced study?",
      detail: "xAPI listening duration, replay patterns, and self-reported confidence ratings",
    },
    {
      n: "RQ 3",
      q: "What xAPI trace patterns correlate with stronger learning outcomes?",
      detail: "Learning analytics on completed module statements — time-on-task, quiz attempts, certificate rate",
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
          Companion Research Study — Traci's Suggestion
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
          Three research questions.
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

        <div style={{ display: "flex", flexDirection: "column", gap: "2.5vh" }}>
          {rqs.map((rq, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "2.5vw",
                alignItems: "flex-start",
                background: "#fff",
                border: "1px solid rgba(184,90,42,0.1)",
                borderLeft: `0.4vw solid ${i === 0 ? "#b85a2a" : i === 1 ? "#d4a020" : "#7a2c0e"}`,
                borderRadius: "0 0.8vw 0.8vw 0",
                padding: "2vh 2.2vw",
                boxShadow: "0 2px 12px rgba(42,31,24,0.04)",
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  fontFamily: "var(--font-body-family)",
                  fontSize: "1.1vw",
                  fontWeight: 700,
                  color: i === 0 ? "#b85a2a" : i === 1 ? "#d4a020" : "#7a2c0e",
                  paddingTop: "0.4vh",
                  letterSpacing: "0.1em",
                }}
              >
                {rq.n}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1.5vw",
                    fontWeight: 700,
                    color: "#2a1f18",
                    marginBottom: "0.5vh",
                  }}
                >
                  {rq.q}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1.2vw",
                    color: "rgba(42,31,24,0.55)",
                  }}
                >
                  {rq.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "3vh",
            fontFamily: "var(--font-body-family)",
            fontSize: "1.3vw",
            color: "rgba(42,31,24,0.45)",
            fontStyle: "italic",
          }}
        >
          Target venue: IEEE Transactions on Professional Communication or Computers &amp; Education
        </div>
      </div>
    </div>
  );
}
