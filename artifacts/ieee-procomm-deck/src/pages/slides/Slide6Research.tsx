export default function Slide6Research() {
  const rqs = [
    {
      n: "RQ 1",
      label: "Learning Effectiveness",
      q: "Do learners who engage with an AI-generated xAPI interactive lesson demonstrate higher knowledge retention and deeper reflection compared to learners who read the original article as a PDF?",
      method: "Quasi-experimental · n = 60–80 · MCQ post-test + rubric-scored reflection",
      accent: "#b85a2a",
    },
    {
      n: "RQ 2",
      label: "Authoring Experience",
      q: "Does the AI-assisted authoring workflow lower the barrier for IEEE ProComm volunteers to produce interactive instructional content, and does the resulting lesson quality meet peer-review standards?",
      method: "Mixed methods · n = 10–15 volunteer authors · SUS + semi-structured interviews",
      accent: "#d4a020",
    },
    {
      n: "RQ 3",
      label: "xAPI Data Utility",
      q: "What learner behavior patterns — navigation sequences, time-on-task, quiz retries, AI tutor query themes — are revealed by xAPI trace data, and what do they imply for Teaching Case design?",
      method: "Descriptive / exploratory · anonymised platform data · no separate IRB required",
      accent: "#7a2c0e",
    },
  ];

  const venues = [
    { label: "Study 1 + Teaching Case", venue: "IEEE Trans. Professional Communication", timing: "After Phase 2" },
    { label: "Study 2", venue: "IEEE ProComm Annual Conference (IPCC)", timing: "After Phase 1 pilot" },
    { label: "Study 3", venue: "Journal of Learning Analytics", timing: "After 6 months live data" },
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

      <div className="absolute" style={{ left: "7vw", top: "8vh", right: "7vw" }}>
        <div
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "1.3vw",
            fontWeight: 600,
            color: "#b85a2a",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: "1vh",
          }}
        >
          Companion Research Study
        </div>
        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "3.2vw",
            fontWeight: 900,
            color: "#2a1f18",
            lineHeight: 1.1,
            marginBottom: "0.8vh",
          }}
        >
          Three studies. One platform.
        </div>
        <div
          style={{
            width: "5vw",
            height: "0.4vh",
            background: "linear-gradient(to right, #b85a2a, #d4a020)",
            borderRadius: "9999px",
            marginBottom: "2.8vh",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "1.8vh" }}>
          {rqs.map((rq, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "2vw",
                alignItems: "flex-start",
                background: "#fff",
                border: "1px solid rgba(184,90,42,0.1)",
                borderLeft: `0.4vw solid ${rq.accent}`,
                borderRadius: "0 0.8vw 0.8vw 0",
                padding: "1.5vh 2vw",
                boxShadow: "0 2px 10px rgba(42,31,24,0.04)",
              }}
            >
              <div style={{ flexShrink: 0, paddingTop: "0.2vh", width: "4.5vw" }}>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "0.95vw",
                    fontWeight: 700,
                    color: rq.accent,
                    letterSpacing: "0.1em",
                  }}
                >
                  {rq.n}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "0.85vw",
                    fontWeight: 600,
                    color: rq.accent,
                    opacity: 0.7,
                    lineHeight: 1.2,
                    marginTop: "0.2vh",
                  }}
                >
                  {rq.label}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1.35vw",
                    fontWeight: 700,
                    color: "#2a1f18",
                    marginBottom: "0.5vh",
                    lineHeight: 1.35,
                  }}
                >
                  {rq.q}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1.05vw",
                    color: "rgba(42,31,24,0.5)",
                    fontStyle: "italic",
                  }}
                >
                  {rq.method}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "2.2vh",
            display: "flex",
            gap: "1.5vw",
            alignItems: "stretch",
          }}
        >
          {venues.map((v, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                background: "#fff",
                border: "1px solid rgba(42,31,24,0.08)",
                borderRadius: "0.6vw",
                padding: "1.1vh 1.2vw",
                boxShadow: "0 1px 6px rgba(42,31,24,0.03)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "0.95vw",
                  fontWeight: 700,
                  color: "#b85a2a",
                  marginBottom: "0.3vh",
                }}
              >
                {v.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "1vw",
                  fontWeight: 600,
                  color: "#2a1f18",
                  marginBottom: "0.2vh",
                  lineHeight: 1.3,
                }}
              >
                {v.venue}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "0.9vw",
                  color: "rgba(42,31,24,0.45)",
                  fontStyle: "italic",
                }}
              >
                {v.timing}
              </div>
            </div>
          ))}

          <a
            href="https://docs.google.com/document/d/1daIdioS7onsLIfg2jQWetC1cZ9mEpDYE0syH7NGmguU/edit"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6vw",
              fontFamily: "var(--font-body-family)",
              fontSize: "1.05vw",
              color: "#b85a2a",
              fontWeight: 600,
              textDecoration: "none",
              background: "#fff",
              border: "1px solid rgba(184,90,42,0.2)",
              borderRadius: "0.6vw",
              padding: "1vh 1.2vw",
              flexShrink: 0,
              alignSelf: "center",
            }}
          >
            <span>📋</span>
            <span>Full research plan →</span>
          </a>
        </div>
      </div>
    </div>
  );
}
