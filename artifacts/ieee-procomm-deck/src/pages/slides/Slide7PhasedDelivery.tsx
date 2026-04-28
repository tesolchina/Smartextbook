export default function Slide7PhasedDelivery() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{ background: "#faf8f5" }}
    >
      <div
        className="absolute"
        style={{
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "radial-gradient(ellipse at 100% 100%, rgba(212,160,32,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="absolute" style={{ left: "7vw", top: "9vh", right: "7vw" }}>
        <div
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "1.5vw",
            fontWeight: 600,
            color: "#b85a2a",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: "1.5vh",
          }}
        >
          Phased Delivery
        </div>

        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "3.5vw",
            fontWeight: 900,
            color: "#2a1f18",
            lineHeight: 1.1,
            marginBottom: "1.5vh",
          }}
        >
          Three phases to full deployment.
        </div>

        <div
          style={{
            width: "5vw",
            height: "0.4vh",
            background: "linear-gradient(to right, #b85a2a, #d4a020)",
            borderRadius: "9999px",
            marginBottom: "5vh",
          }}
        />

        <div style={{ display: "flex", gap: "3vw" }}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1vw",
                marginBottom: "2vh",
              }}
            >
              <div
                style={{
                  width: "3.5vw",
                  height: "3.5vw",
                  background: "#b85a2a",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "3.5vw",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display-family)",
                    fontSize: "1.8vw",
                    fontWeight: 900,
                    color: "#faf8f5",
                  }}
                >
                  1
                </span>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display-family)",
                    fontSize: "2vw",
                    fontWeight: 700,
                    color: "#b85a2a",
                    lineHeight: 1.2,
                  }}
                >
                  Proof of Concept
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1.55vw",
                    color: "#8a7565",
                  }}
                >
                  4 – 6 weeks
                </div>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                height: "0.25vh",
                background: "rgba(184,90,42,0.2)",
                marginBottom: "2.5vh",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2vh" }}>
              <div style={{ display: "flex", gap: "0.8vw", alignItems: "flex-start" }}>
                <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "#b85a2a", marginTop: "0.8vh", minWidth: "0.4vw" }} />
                <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.55vw", color: "#2a1f18", lineHeight: 1.4 }}>Teaching Case upload with AI lesson generation</div>
              </div>
              <div style={{ display: "flex", gap: "0.8vw", alignItems: "flex-start" }}>
                <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "#b85a2a", marginTop: "0.8vh", minWidth: "0.4vw" }} />
                <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.55vw", color: "#2a1f18", lineHeight: 1.4 }}>Modular lesson viewer with xAPI logging</div>
              </div>
              <div style={{ display: "flex", gap: "0.8vw", alignItems: "flex-start" }}>
                <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "#b85a2a", marginTop: "0.8vh", minWidth: "0.4vw" }} />
                <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.55vw", color: "#2a1f18", lineHeight: 1.4 }}>Volunteer author dashboard</div>
              </div>
              <div style={{ display: "flex", gap: "0.8vw", alignItems: "flex-start" }}>
                <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "#b85a2a", marginTop: "0.8vh", minWidth: "0.4vw" }} />
                <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.55vw", color: "#2a1f18", lineHeight: 1.4 }}>1–2 pilot lessons from real IEEE articles</div>
              </div>
            </div>
          </div>

          <div style={{ width: "0.2vw", background: "rgba(138,117,101,0.15)", borderRadius: "9999px" }} />

          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1vw",
                marginBottom: "2vh",
              }}
            >
              <div
                style={{
                  width: "3.5vw",
                  height: "3.5vw",
                  background: "#d4a020",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "3.5vw",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display-family)",
                    fontSize: "1.8vw",
                    fontWeight: 900,
                    color: "#2a1f18",
                  }}
                >
                  2
                </span>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display-family)",
                    fontSize: "2vw",
                    fontWeight: 700,
                    color: "#7a5a10",
                    lineHeight: 1.2,
                  }}
                >
                  Volunteer Platform
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1.55vw",
                    color: "#8a7565",
                  }}
                >
                  6 – 8 weeks
                </div>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                height: "0.25vh",
                background: "rgba(212,160,32,0.3)",
                marginBottom: "2.5vh",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2vh" }}>
              <div style={{ display: "flex", gap: "0.8vw", alignItems: "flex-start" }}>
                <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "#d4a020", marginTop: "0.8vh", minWidth: "0.4vw" }} />
                <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.55vw", color: "#2a1f18", lineHeight: 1.4 }}>Admin review and approval workflow</div>
              </div>
              <div style={{ display: "flex", gap: "0.8vw", alignItems: "flex-start" }}>
                <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "#d4a020", marginTop: "0.8vh", minWidth: "0.4vw" }} />
                <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.55vw", color: "#2a1f18", lineHeight: 1.4 }}>Public lesson catalog</div>
              </div>
              <div style={{ display: "flex", gap: "0.8vw", alignItems: "flex-start" }}>
                <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "#d4a020", marginTop: "0.8vh", minWidth: "0.4vw" }} />
                <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.55vw", color: "#2a1f18", lineHeight: 1.4 }}>Certificate issuance</div>
              </div>
              <div style={{ display: "flex", gap: "0.8vw", alignItems: "flex-start" }}>
                <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "#d4a020", marginTop: "0.8vh", minWidth: "0.4vw" }} />
                <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.55vw", color: "#2a1f18", lineHeight: 1.4 }}>External LRS connector</div>
              </div>
            </div>
          </div>

          <div style={{ width: "0.2vw", background: "rgba(138,117,101,0.15)", borderRadius: "9999px" }} />

          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1vw",
                marginBottom: "2vh",
              }}
            >
              <div
                style={{
                  width: "3.5vw",
                  height: "3.5vw",
                  background: "#2a1f18",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "3.5vw",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display-family)",
                    fontSize: "1.8vw",
                    fontWeight: 900,
                    color: "#faf8f5",
                  }}
                >
                  3
                </span>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display-family)",
                    fontSize: "2vw",
                    fontWeight: 700,
                    color: "#2a1f18",
                    lineHeight: 1.2,
                  }}
                >
                  Ecosystem Integration
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1.55vw",
                    color: "#8a7565",
                  }}
                >
                  Ongoing
                </div>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                height: "0.25vh",
                background: "rgba(42,31,24,0.15)",
                marginBottom: "2.5vh",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2vh" }}>
              <div style={{ display: "flex", gap: "0.8vw", alignItems: "flex-start" }}>
                <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "#2a1f18", marginTop: "0.8vh", minWidth: "0.4vw" }} />
                <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.55vw", color: "#2a1f18", lineHeight: 1.4 }}>SCORM export for LMS compatibility</div>
              </div>
              <div style={{ display: "flex", gap: "0.8vw", alignItems: "flex-start" }}>
                <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "#2a1f18", marginTop: "0.8vh", minWidth: "0.4vw" }} />
                <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.55vw", color: "#2a1f18", lineHeight: 1.4 }}>DOI-based article lookup via CrossRef</div>
              </div>
              <div style={{ display: "flex", gap: "0.8vw", alignItems: "flex-start" }}>
                <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "#2a1f18", marginTop: "0.8vh", minWidth: "0.4vw" }} />
                <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.55vw", color: "#2a1f18", lineHeight: 1.4 }}>IEEE infrastructure deployment</div>
              </div>
              <div style={{ display: "flex", gap: "0.8vw", alignItems: "flex-start" }}>
                <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "#2a1f18", marginTop: "0.8vh", minWidth: "0.4vw" }} />
                <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.55vw", color: "#2a1f18", lineHeight: 1.4 }}>Analytics dashboard for editors</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
