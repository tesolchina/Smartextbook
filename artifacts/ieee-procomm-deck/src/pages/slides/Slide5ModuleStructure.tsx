export default function Slide5ModuleStructure() {
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
          width: "42vw",
          height: "100vh",
          background: "#f0ebe3",
        }}
      />

      <div
        className="absolute"
        style={{
          top: 0,
          right: "42vw",
          width: "0.3vw",
          height: "100vh",
          background: "linear-gradient(to bottom, transparent, rgba(184,90,42,0.3), transparent)",
        }}
      />

      <div className="absolute" style={{ left: "7vw", top: "9vh" }}>
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
          Lesson Architecture
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
          8 Modular xAPI
          <br />
          Activity Types
        </div>

        <div
          style={{
            width: "5vw",
            height: "0.4vh",
            background: "linear-gradient(to right, #b85a2a, #d4a020)",
            borderRadius: "9999px",
            marginBottom: "3vh",
          }}
        />

        <div
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "1.6vw",
            fontWeight: 400,
            color: "#8a7565",
            lineHeight: 1.5,
            maxWidth: "50vw",
            textWrap: "pretty",
          }}
        >
          Each lesson is broken into discrete, trackable modules mapped to xAPI Activity Types. Learners navigate in sequence and may revisit any completed module.
        </div>
      </div>

      <div
        className="absolute"
        style={{ right: "0", top: "0", width: "42vw", height: "100vh", padding: "6vh 3vw" }}
      >
        <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center", gap: "0.8vh" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 1vw",
              paddingBottom: "1vh",
              borderBottom: "0.2vh solid rgba(138,117,101,0.3)",
              marginBottom: "0.5vh",
            }}
          >
            <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", fontWeight: 600, color: "#8a7565", textTransform: "uppercase", letterSpacing: "0.1em" }}>Module</div>
            <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", fontWeight: 600, color: "#8a7565", textTransform: "uppercase", letterSpacing: "0.1em" }}>xAPI Type</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1vw", padding: "0.9vh 0", borderBottom: "0.15vh solid rgba(138,117,101,0.15)" }}>
            <div style={{ fontFamily: "var(--font-display-family)", fontSize: "1.6vw", fontWeight: 700, color: "#2a1f18" }}>Introduction</div>
            <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#b85a2a" }}>module</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1vw", padding: "0.9vh 0", borderBottom: "0.15vh solid rgba(138,117,101,0.15)" }}>
            <div style={{ fontFamily: "var(--font-display-family)", fontSize: "1.6vw", fontWeight: 700, color: "#2a1f18" }}>Case Narrative</div>
            <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#b85a2a" }}>reading</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1vw", padding: "0.9vh 0", borderBottom: "0.15vh solid rgba(138,117,101,0.15)" }}>
            <div style={{ fontFamily: "var(--font-display-family)", fontSize: "1.6vw", fontWeight: 700, color: "#2a1f18" }}>Key Concepts</div>
            <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#b85a2a" }}>lesson</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1vw", padding: "0.9vh 0", borderBottom: "0.15vh solid rgba(138,117,101,0.15)" }}>
            <div style={{ fontFamily: "var(--font-display-family)", fontSize: "1.6vw", fontWeight: 700, color: "#2a1f18" }}>Mind Map</div>
            <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#b85a2a" }}>simulation</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1vw", padding: "0.9vh 0", borderBottom: "0.15vh solid rgba(138,117,101,0.15)" }}>
            <div style={{ fontFamily: "var(--font-display-family)", fontSize: "1.6vw", fontWeight: 700, color: "#2a1f18" }}>Knowledge Check</div>
            <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#b85a2a" }}>assessment</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1vw", padding: "0.9vh 0", borderBottom: "0.15vh solid rgba(138,117,101,0.15)" }}>
            <div style={{ fontFamily: "var(--font-display-family)", fontSize: "1.6vw", fontWeight: 700, color: "#2a1f18" }}>Reflection Activity</div>
            <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#b85a2a" }}>question</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1vw", padding: "0.9vh 0", borderBottom: "0.15vh solid rgba(138,117,101,0.15)" }}>
            <div style={{ fontFamily: "var(--font-display-family)", fontSize: "1.6vw", fontWeight: 700, color: "#2a1f18" }}>AI Tutor</div>
            <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#b85a2a" }}>interaction</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1vw", padding: "0.9vh 0" }}>
            <div style={{ fontFamily: "var(--font-display-family)", fontSize: "1.6vw", fontWeight: 700, color: "#2a1f18" }}>Summary</div>
            <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#b85a2a" }}>module</div>
          </div>
        </div>
      </div>
    </div>
  );
}
