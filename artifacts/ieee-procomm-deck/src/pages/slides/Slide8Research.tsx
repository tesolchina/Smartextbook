export default function Slide8Research() {
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
            fontSize: "1.5vw",
            fontWeight: 600,
            color: "#b85a2a",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: "1.5vh",
          }}
        >
          Companion Research Study
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
          Three research questions.
        </div>

        <div
          style={{
            width: "5vw",
            height: "0.4vh",
            background: "linear-gradient(to right, #b85a2a, #d4a020)",
            borderRadius: "9999px",
            marginBottom: "1.5vh",
          }}
        />

        <div
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "1.6vw",
            fontWeight: 400,
            color: "#8a7565",
            marginBottom: "4.5vh",
            textWrap: "pretty",
          }}
        >
          A structured research proposal accompanies the platform, designed for submission to IEEE Transactions on Professional Communication.
        </div>

        <div style={{ display: "flex", gap: "2.5vw" }}>
          <div
            style={{
              flex: 1,
              padding: "3vh 2.5vw",
              background: "#f0ebe3",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.4vw",
                fontWeight: 700,
                color: "#b85a2a",
                letterSpacing: "0.1em",
                marginBottom: "1.5vh",
                textTransform: "uppercase",
              }}
            >
              RQ1
            </div>
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.85vw",
                fontWeight: 700,
                color: "#2a1f18",
                marginBottom: "1.5vh",
                lineHeight: 1.25,
              }}
            >
              Learning Effectiveness
            </div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.55vw",
                fontWeight: 400,
                color: "#8a7565",
                lineHeight: 1.5,
                textWrap: "pretty",
              }}
            >
              Do learners using the interactive lesson demonstrate higher knowledge retention and deeper reflection compared to reading the original PDF?
            </div>
          </div>

          <div
            style={{
              flex: 1,
              padding: "3vh 2.5vw",
              background: "#f0ebe3",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.4vw",
                fontWeight: 700,
                color: "#7a5a10",
                letterSpacing: "0.1em",
                marginBottom: "1.5vh",
                textTransform: "uppercase",
              }}
            >
              RQ2
            </div>
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.85vw",
                fontWeight: 700,
                color: "#2a1f18",
                marginBottom: "1.5vh",
                lineHeight: 1.25,
              }}
            >
              Authoring Experience
            </div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.55vw",
                fontWeight: 400,
                color: "#8a7565",
                lineHeight: 1.5,
                textWrap: "pretty",
              }}
            >
              Does AI-assisted authoring lower the barrier for IEEE ProComm volunteers, and does the resulting lesson quality meet peer-review standards?
            </div>
          </div>

          <div
            style={{
              flex: 1,
              padding: "3vh 2.5vw",
              background: "#f0ebe3",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.4vw",
                fontWeight: 700,
                color: "#4a3828",
                letterSpacing: "0.1em",
                marginBottom: "1.5vh",
                textTransform: "uppercase",
              }}
            >
              RQ3
            </div>
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.85vw",
                fontWeight: 700,
                color: "#2a1f18",
                marginBottom: "1.5vh",
                lineHeight: 1.25,
              }}
            >
              xAPI Trace Analysis
            </div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.55vw",
                fontWeight: 400,
                color: "#8a7565",
                lineHeight: 1.5,
                textWrap: "pretty",
              }}
            >
              What learner behavior patterns are revealed by xAPI trace data, and what implications do they hold for Teaching Case design?
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
