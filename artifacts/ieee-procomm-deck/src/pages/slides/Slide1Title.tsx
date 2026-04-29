export default function Slide1Title() {
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
          background: "radial-gradient(ellipse at 80% 20%, rgba(212,160,32,0.15) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute"
        style={{
          left: "7vw",
          top: "0",
          width: "0.35vw",
          height: "100vh",
          background: "linear-gradient(to bottom, transparent, rgba(212,160,32,0.6), transparent)",
        }}
      />

      <div className="absolute" style={{ left: "7vw", top: "11vh", right: "8vw" }}>
        <div
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "1.3vw",
            fontWeight: 600,
            color: "rgba(245,232,192,0.75)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            marginBottom: "2vh",
          }}
        >
          Project Update · May 2026
        </div>

        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "5.2vw",
            fontWeight: 900,
            color: "#faf8f5",
            lineHeight: 1.08,
            textWrap: "balance",
            marginBottom: "2.5vh",
          }}
        >
          IEEE ProComm
          <br />
          Interactive Lesson
          <br />
          Platform
        </div>

        <div
          style={{
            width: "6vw",
            height: "0.4vh",
            background: "linear-gradient(to right, #d4a020, #f5e8c0)",
            borderRadius: "9999px",
            marginBottom: "3vh",
          }}
        />

        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontStyle: "italic",
            fontSize: "2.1vw",
            fontWeight: 700,
            color: "rgba(245,232,192,0.9)",
            marginBottom: "5vh",
          }}
        >
          Turning ProComm articles into interactive self-study lessons
        </div>

        <div style={{ display: "flex", gap: "4vw", alignItems: "flex-start" }}>
          <div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.4vw",
                fontWeight: 700,
                color: "#d4a020",
              }}
            >
              Traci Nathans-Kelly
            </div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.2vw",
                color: "rgba(250,248,245,0.6)",
              }}
            >
              VP Content, IEEE ProComm · Cornell
            </div>
          </div>
          <div
            style={{
              width: "0.2vw",
              height: "4vh",
              background: "rgba(212,160,32,0.3)",
              marginTop: "0.3vh",
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.4vw",
                fontWeight: 700,
                color: "#d4a020",
              }}
            >
              Dr Simon Wang
            </div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.2vw",
                color: "rgba(250,248,245,0.6)",
              }}
            >
              Language Centre, HKBU
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute"
        style={{ right: "7vw", bottom: "6vh", textAlign: "right" }}
      >
        <div
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "1.2vw",
            fontWeight: 600,
            color: "rgba(212,160,32,0.7)",
          }}
        >
          Open Source · BYOK · xAPI
        </div>
      </div>
    </div>
  );
}
