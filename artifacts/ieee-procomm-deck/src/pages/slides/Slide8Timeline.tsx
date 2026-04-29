export default function Slide8Timeline() {
  const events = [
    {
      date: "Apr 30",
      year: "2026",
      label: "Workshop paper camera-ready",
      detail: "ProComm 2026 — Edmonton",
      done: true,
    },
    {
      date: "May",
      year: "2026",
      label: "Author permission outreach",
      detail: "Traci sends 14 personalised emails + 2 LinkedIn messages",
      done: false,
      active: true,
    },
    {
      date: "May–Jun",
      year: "2026",
      label: "IRB application (if needed)",
      detail: "For the companion empirical research study",
      done: false,
    },
    {
      date: "Jun",
      year: "2026",
      label: "TPC Teaching Case submission",
      detail: "IEEE Transactions on Professional Communication — Teaching Case Track",
      done: false,
    },
    {
      date: "Jul 12–15",
      year: "2026",
      label: "IEEE ProComm 2026 Edmonton",
      detail: "Live workshop + presentation of the platform",
      done: false,
    },
    {
      date: "Fall",
      year: "2026",
      label: "Research study pilot",
      detail: "First cohort — HKBU + Cornell students (or target population TBD)",
      done: false,
    },
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
          background: "radial-gradient(ellipse at 20% 80%, rgba(212,160,32,0.12) 0%, transparent 55%)",
        }}
      />

      <div className="absolute" style={{ left: "7vw", top: "9vh", right: "7vw" }}>
        <div
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "1.3vw",
            fontWeight: 600,
            color: "rgba(245,232,192,0.7)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: "1.2vh",
          }}
        >
          Timeline
        </div>
        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "3.4vw",
            fontWeight: 900,
            color: "#faf8f5",
            lineHeight: 1.1,
            marginBottom: "1vh",
          }}
        >
          April → Fall 2026.
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2vh 4vw",
          }}
        >
          {events.map((e, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1.5vw",
                opacity: e.done ? 0.6 : 1,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  textAlign: "right",
                  width: "5vw",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display-family)",
                    fontSize: "1.6vw",
                    fontWeight: 900,
                    color: e.active ? "#d4a020" : e.done ? "rgba(245,232,192,0.5)" : "rgba(245,232,192,0.75)",
                  }}
                >
                  {e.date}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1vw",
                    color: "rgba(245,232,192,0.4)",
                  }}
                >
                  {e.year}
                </div>
              </div>
              <div
                style={{
                  paddingTop: "0.4vh",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.3vh",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.8vw",
                  }}
                >
                  <div
                    style={{
                      width: "0.7vw",
                      height: "0.7vw",
                      borderRadius: "50%",
                      background: e.done ? "rgba(245,232,192,0.4)" : e.active ? "#d4a020" : "rgba(212,160,32,0.5)",
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      fontFamily: "var(--font-body-family)",
                      fontSize: "1.4vw",
                      fontWeight: 700,
                      color: e.active ? "#faf8f5" : "rgba(245,232,192,0.85)",
                    }}
                  >
                    {e.label}
                    {e.done && (
                      <span
                        style={{
                          marginLeft: "0.8vw",
                          fontSize: "1.1vw",
                          color: "#d4a020",
                          fontWeight: 600,
                        }}
                      >
                        ✓ Done
                      </span>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1.1vw",
                    color: "rgba(245,232,192,0.5)",
                    paddingLeft: "1.5vw",
                  }}
                >
                  {e.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
