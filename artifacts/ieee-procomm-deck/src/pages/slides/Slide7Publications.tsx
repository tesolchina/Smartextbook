export default function Slide7Publications() {
  const pubs = [
    {
      badge: "Workshop Paper",
      badgeColor: "#b85a2a",
      title: "IEEE ProComm 2026",
      subtitle: "Edmonton · July 12–15, 2026",
      detail:
        "Camera-ready deadline: April 30, 2026. Paper accepted: \u2018From Teaching Case to Interactive Self-Study Lesson: A SmartTextbook Approach.\u2019",
      status: "Camera-ready submitted",
      statusColor: "#2a8a4a",
    },
    {
      badge: "Teaching Case",
      badgeColor: "#d4a020",
      title: "IEEE Transactions on Professional Communication",
      subtitle: "Teaching Case Submission · Target: June 2026",
      detail:
        "A Teaching Case documents a real instructional problem and its solution — here, converting a published engineering communication case study (Leydens & Lucena) into an interactive lesson. Consent from original authors already secured. Submitted to the IEEE TPC Teaching Case Track.",
      status: "In preparation",
      statusColor: "#b85a2a",
    },
    {
      badge: "Research Article",
      badgeColor: "#7a2c0e",
      title: "Companion Empirical Study",
      subtitle: "Target venue: Computers & Education or IEEE TPC",
      detail:
        "Quasi-experimental study on interactive vs. static article engagement, learning analytics from xAPI traces, with Traci as co-author.",
      status: "Proposed",
      statusColor: "rgba(42,31,24,0.45)",
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
          Publication Pipeline
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
          Three outputs. One platform.
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
          {pubs.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "2vw",
                background: "#fff",
                border: "1px solid rgba(42,31,24,0.08)",
                borderRadius: "0.8vw",
                padding: "1.8vh 2.2vw",
                boxShadow: "0 2px 10px rgba(42,31,24,0.04)",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1.5vw", marginBottom: "0.8vh" }}>
                  <div
                    style={{
                      background: p.badgeColor,
                      color: "#faf8f5",
                      fontFamily: "var(--font-body-family)",
                      fontSize: "1vw",
                      fontWeight: 700,
                      padding: "0.3vh 0.8vw",
                      borderRadius: "0.4vw",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      flexShrink: 0,
                    }}
                  >
                    {p.badge}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body-family)",
                      fontSize: "1.1vw",
                      fontWeight: 700,
                      color: p.statusColor,
                    }}
                  >
                    {p.status}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1.5vw",
                    fontWeight: 700,
                    color: "#2a1f18",
                    marginBottom: "0.4vh",
                  }}
                >
                  {p.title}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1.2vw",
                    fontWeight: 600,
                    color: p.badgeColor,
                    marginBottom: "0.6vh",
                  }}
                >
                  {p.subtitle}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1.2vw",
                    color: "rgba(42,31,24,0.55)",
                  }}
                >
                  {p.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
