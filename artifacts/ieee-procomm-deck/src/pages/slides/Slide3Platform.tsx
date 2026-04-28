export default function Slide3Platform() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{ background: "#f0ebe3" }}
    >
      <div
        className="absolute"
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: "0.5vh",
          background: "linear-gradient(to right, #b85a2a, #d4a020, #b85a2a)",
        }}
      />

      <div
        className="absolute"
        style={{
          bottom: 0,
          left: 0,
          right: 0,
          height: "0.5vh",
          background: "linear-gradient(to right, transparent, rgba(184,90,42,0.3), transparent)",
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
          The Platform
        </div>

        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "3.8vw",
            fontWeight: 900,
            color: "#2a1f18",
            lineHeight: 1.1,
            marginBottom: "1.5vh",
          }}
        >
          One platform. Three capabilities.
        </div>

        <div
          style={{
            width: "5vw",
            height: "0.4vh",
            background: "linear-gradient(to right, #b85a2a, #d4a020)",
            borderRadius: "9999px",
            marginBottom: "4vh",
          }}
        />

        <div
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "1.7vw",
            fontWeight: 400,
            color: "#2a1f18",
            lineHeight: 1.6,
            maxWidth: "72vw",
            marginBottom: "5vh",
            textWrap: "pretty",
          }}
        >
          Built on the existing SmartTextbook infrastructure, the IEEE ProComm Lesson Platform adds an authoring environment for volunteer contributors, a learner-facing interactive delivery system, and full xAPI compliance — connecting professional communication scholarship directly to measurable learning outcomes.
        </div>

        <div style={{ display: "flex", gap: "2.5vw" }}>
          <div
            style={{
              flex: 1,
              background: "rgba(184,90,42,0.08)",
              borderTop: "0.35vh solid #b85a2a",
              padding: "2.5vh 2vw",
              borderRadius: "0 0 0.5vw 0.5vw",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.9vw",
                fontWeight: 700,
                color: "#b85a2a",
                marginBottom: "1.2vh",
              }}
            >
              Authoring Environment
            </div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.55vw",
                fontWeight: 400,
                color: "#2a1f18",
                lineHeight: 1.5,
              }}
            >
              AI-assisted lesson generation from IEEE Teaching Case articles, with a structured editor for volunteer review.
            </div>
          </div>

          <div
            style={{
              flex: 1,
              background: "rgba(212,160,32,0.08)",
              borderTop: "0.35vh solid #d4a020",
              padding: "2.5vh 2vw",
              borderRadius: "0 0 0.5vw 0.5vw",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.9vw",
                fontWeight: 700,
                color: "#7a5a10",
                marginBottom: "1.2vh",
              }}
            >
              Learner Delivery
            </div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.55vw",
                fontWeight: 400,
                color: "#2a1f18",
                lineHeight: 1.5,
              }}
            >
              Browser-based, self-paced interactive lessons with an AI tutor, knowledge checks, and certificates.
            </div>
          </div>

          <div
            style={{
              flex: 1,
              background: "rgba(42,31,24,0.06)",
              borderTop: "0.35vh solid #8a7565",
              padding: "2.5vh 2vw",
              borderRadius: "0 0 0.5vw 0.5vw",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.9vw",
                fontWeight: 700,
                color: "#2a1f18",
                marginBottom: "1.2vh",
              }}
            >
              xAPI Compliance
            </div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.55vw",
                fontWeight: 400,
                color: "#2a1f18",
                lineHeight: 1.5,
              }}
            >
              Every learner action emits a traceable xAPI statement, with external LRS connector support.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
