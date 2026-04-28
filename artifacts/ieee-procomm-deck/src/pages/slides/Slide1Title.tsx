export default function Slide1Title() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg, #7a2c0e 0%, #b85a2a 45%, #5a1a06 100%)",
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

      <div className="absolute" style={{ left: "7vw", top: "12vh", right: "8vw" }}>
        <div
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "1.5vw",
            fontWeight: 600,
            color: "rgba(245,232,192,0.85)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: "3vh",
          }}
        >
          IEEE Transactions on Professional Communication
        </div>

        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "5.5vw",
            fontWeight: 900,
            color: "#faf8f5",
            lineHeight: 1.08,
            textWrap: "balance",
            marginBottom: "3vh",
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
            marginBottom: "3.5vh",
          }}
        />

        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontStyle: "italic",
            fontSize: "2.2vw",
            fontWeight: 700,
            color: "rgba(245,232,192,0.9)",
            textWrap: "balance",
            marginBottom: "6vh",
          }}
        >
          From Teaching Case to Interactive Self-Study Lesson
        </div>

        <div
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "1.6vw",
            fontWeight: 400,
            color: "rgba(250,248,245,0.7)",
          }}
        >
          A platform for volunteer authors, learners, and administrators
        </div>
      </div>

      <div
        className="absolute"
        style={{
          right: "7vw",
          bottom: "6vh",
          textAlign: "right",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "1.5vw",
            fontWeight: 600,
            color: "rgba(212,160,32,0.8)",
          }}
        >
          SmartTextbook
        </div>
        <div
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "1.5vw",
            fontWeight: 400,
            color: "rgba(250,248,245,0.5)",
          }}
        >
          2026
        </div>
      </div>
    </div>
  );
}
