export default function Slide2Problem() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{ background: "#faf8f5" }}
    >
      <div
        className="absolute"
        style={{
          top: 0,
          right: 0,
          width: "35vw",
          height: "100vh",
          background: "linear-gradient(to left, #f0ebe3, transparent)",
        }}
      />

      <div
        className="absolute"
        style={{
          top: 0,
          left: 0,
          width: "0.35vw",
          height: "100vh",
          background: "linear-gradient(to bottom, #b85a2a, #d4a020, #b85a2a)",
          opacity: 0.5,
        }}
      />

      <div className="absolute" style={{ left: "7vw", top: "10vh", right: "10vw" }}>
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
          The Problem
        </div>

        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "3.8vw",
            fontWeight: 900,
            color: "#2a1f18",
            lineHeight: 1.1,
            marginBottom: "1.5vh",
            textWrap: "balance",
          }}
        >
          Teaching Cases reach scholars.
          <br />
          They don't reach learners.
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

        <div style={{ display: "flex", flexDirection: "column", gap: "3.5vh" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "2vw" }}>
            <div
              style={{
                minWidth: "3vw",
                height: "3vw",
                background: "rgba(184,90,42,0.12)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "0.3vh",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: "1.8vw",
                  fontWeight: 900,
                  color: "#b85a2a",
                }}
              >
                1
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: "2vw",
                  fontWeight: 700,
                  color: "#2a1f18",
                  marginBottom: "0.8vh",
                }}
              >
                Published as PDFs, consumed in classrooms
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "1.6vw",
                  fontWeight: 400,
                  color: "#8a7565",
                  textWrap: "pretty",
                }}
              >
                IEEE ProComm Teaching Cases are high-quality scholarly articles designed for classroom use, but distribution ends at the PDF.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "2vw" }}>
            <div
              style={{
                minWidth: "3vw",
                height: "3vw",
                background: "rgba(184,90,42,0.12)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "0.3vh",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: "1.8vw",
                  fontWeight: 900,
                  color: "#b85a2a",
                }}
              >
                2
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: "2vw",
                  fontWeight: 700,
                  color: "#2a1f18",
                  marginBottom: "0.8vh",
                }}
              >
                No pathway from article to interactive experience
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "1.6vw",
                  fontWeight: 400,
                  color: "#8a7565",
                  textWrap: "pretty",
                }}
              >
                There is no platform to transform these articles into self-paced, standards-compliant interactive lessons.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "2vw" }}>
            <div
              style={{
                minWidth: "3vw",
                height: "3vw",
                background: "rgba(184,90,42,0.12)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "0.3vh",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: "1.8vw",
                  fontWeight: 900,
                  color: "#b85a2a",
                }}
              >
                3
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: "2vw",
                  fontWeight: 700,
                  color: "#2a1f18",
                  marginBottom: "0.8vh",
                }}
              >
                Volunteer knowledge goes untracked
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "1.6vw",
                  fontWeight: 400,
                  color: "#8a7565",
                  textWrap: "pretty",
                }}
              >
                IEEE ProComm volunteers produce rich instructional content with no visibility into learner engagement or outcomes.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
