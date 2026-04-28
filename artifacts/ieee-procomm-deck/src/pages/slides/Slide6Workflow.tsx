export default function Slide6Workflow() {
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
          width: "38vw",
          height: "100vh",
          background: "#f0ebe3",
        }}
      />
      <div
        className="absolute"
        style={{
          top: 0,
          right: "38vw",
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
          Volunteer Workflow
        </div>

        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "3.2vw",
            fontWeight: 900,
            color: "#2a1f18",
            lineHeight: 1.1,
            marginBottom: "1.5vh",
          }}
        >
          From article upload
          <br />
          to published lesson.
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

        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
            <div
              style={{
                background: "#b85a2a",
                color: "#faf8f5",
                fontFamily: "var(--font-display-family)",
                fontSize: "1.55vw",
                fontWeight: 700,
                padding: "1.2vh 1.8vw",
                borderRadius: "0.4vw",
                minWidth: "20vw",
              }}
            >
              Upload Article
            </div>
            <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#8a7565" }}>PDF, DOC, or text</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0", paddingLeft: "2.5vw" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "0.3vw", height: "1.8vh", background: "#d4a020" }} />
              <div style={{ width: "0", height: "0", borderLeft: "0.5vw solid transparent", borderRight: "0.5vw solid transparent", borderTop: "0.8vh solid #d4a020" }} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
            <div
              style={{
                background: "rgba(184,90,42,0.1)",
                color: "#2a1f18",
                fontFamily: "var(--font-display-family)",
                fontSize: "1.55vw",
                fontWeight: 700,
                padding: "1.2vh 1.8vw",
                border: "0.2vh solid rgba(184,90,42,0.35)",
                borderRadius: "0.4vw",
                minWidth: "20vw",
              }}
            >
              Auto-parse
            </div>
            <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#8a7565" }}>IEEE Teaching Case sections detected</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0", paddingLeft: "2.5vw" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "0.3vw", height: "1.8vh", background: "#d4a020" }} />
              <div style={{ width: "0", height: "0", borderLeft: "0.5vw solid transparent", borderRight: "0.5vw solid transparent", borderTop: "0.8vh solid #d4a020" }} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
            <div
              style={{
                background: "rgba(184,90,42,0.1)",
                color: "#2a1f18",
                fontFamily: "var(--font-display-family)",
                fontSize: "1.55vw",
                fontWeight: 700,
                padding: "1.2vh 1.8vw",
                border: "0.2vh solid rgba(184,90,42,0.35)",
                borderRadius: "0.4vw",
                minWidth: "20vw",
              }}
            >
              AI Draft
            </div>
            <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#8a7565" }}>All 8 modules generated</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0", paddingLeft: "2.5vw" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "0.3vw", height: "1.8vh", background: "#d4a020" }} />
              <div style={{ width: "0", height: "0", borderLeft: "0.5vw solid transparent", borderRight: "0.5vw solid transparent", borderTop: "0.8vh solid #d4a020" }} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
            <div
              style={{
                background: "rgba(212,160,32,0.12)",
                color: "#2a1f18",
                fontFamily: "var(--font-display-family)",
                fontSize: "1.55vw",
                fontWeight: 700,
                padding: "1.2vh 1.8vw",
                border: "0.2vh solid rgba(212,160,32,0.45)",
                borderRadius: "0.4vw",
                minWidth: "20vw",
              }}
            >
              Author Edits
            </div>
            <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#8a7565" }}>Structured editor per module</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0", paddingLeft: "2.5vw" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "0.3vw", height: "1.8vh", background: "#d4a020" }} />
              <div style={{ width: "0", height: "0", borderLeft: "0.5vw solid transparent", borderRight: "0.5vw solid transparent", borderTop: "0.8vh solid #d4a020" }} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
            <div
              style={{
                background: "rgba(212,160,32,0.12)",
                color: "#2a1f18",
                fontFamily: "var(--font-display-family)",
                fontSize: "1.55vw",
                fontWeight: 700,
                padding: "1.2vh 1.8vw",
                border: "0.2vh solid rgba(212,160,32,0.45)",
                borderRadius: "0.4vw",
                minWidth: "20vw",
              }}
            >
              Author Submits
            </div>
            <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#8a7565" }}>Enters admin review queue</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0", paddingLeft: "2.5vw" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "0.3vw", height: "1.8vh", background: "#d4a020" }} />
              <div style={{ width: "0", height: "0", borderLeft: "0.5vw solid transparent", borderRight: "0.5vw solid transparent", borderTop: "0.8vh solid #d4a020" }} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
            <div
              style={{
                background: "rgba(42,31,24,0.07)",
                color: "#2a1f18",
                fontFamily: "var(--font-display-family)",
                fontSize: "1.55vw",
                fontWeight: 700,
                padding: "1.2vh 1.8vw",
                border: "0.2vh solid rgba(42,31,24,0.2)",
                borderRadius: "0.4vw",
                minWidth: "20vw",
              }}
            >
              Admin Reviews
            </div>
            <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#8a7565" }}>Approve or request changes</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0", paddingLeft: "2.5vw" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "0.3vw", height: "1.8vh", background: "#d4a020" }} />
              <div style={{ width: "0", height: "0", borderLeft: "0.5vw solid transparent", borderRight: "0.5vw solid transparent", borderTop: "0.8vh solid #d4a020" }} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
            <div
              style={{
                background: "#2a1f18",
                color: "#faf8f5",
                fontFamily: "var(--font-display-family)",
                fontSize: "1.55vw",
                fontWeight: 700,
                padding: "1.2vh 1.8vw",
                borderRadius: "0.4vw",
                minWidth: "20vw",
              }}
            >
              Published
            </div>
            <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#8a7565" }}>Live in public lesson catalog</div>
          </div>
        </div>
      </div>

      <div
        className="absolute"
        style={{
          right: "0",
          top: "0",
          width: "38vw",
          height: "100vh",
          padding: "9vh 3.5vw 0 3.5vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "2vw",
            fontWeight: 700,
            color: "#2a1f18",
            marginBottom: "2vh",
            lineHeight: 1.3,
          }}
        >
          Authors track every step.
        </div>

        <div
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "1.6vw",
            fontWeight: 400,
            color: "#8a7565",
            lineHeight: 1.6,
            marginBottom: "3vh",
            textWrap: "pretty",
          }}
        >
          A personal author dashboard shows the current review status of every submission. Administrators may request revisions at any stage before final publication to the public catalog.
        </div>

        <div
          style={{
            padding: "2vh 2vw",
            background: "rgba(184,90,42,0.08)",
            borderLeft: "0.35vw solid #b85a2a",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.55vw",
              fontWeight: 600,
              color: "#b85a2a",
              marginBottom: "0.8vh",
            }}
          >
            xAPI statements emitted at each stage
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
            launched → experienced → answered → reflected → completed → passed
          </div>
        </div>
      </div>
    </div>
  );
}
