export default function Slide4Roles() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{ background: "#faf8f5" }}
    >
      <div
        className="absolute"
        style={{
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "0.3vw",
          height: "100vh",
          background: "linear-gradient(to bottom, transparent 5%, rgba(212,160,32,0.2) 50%, transparent 95%)",
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
          Three Roles
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
          One platform, three stakeholders.
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
                fontFamily: "var(--font-display-family)",
                fontSize: "1.6vw",
                fontWeight: 700,
                color: "#b85a2a",
                letterSpacing: "0.05em",
                marginBottom: "1.5vh",
                textTransform: "uppercase",
              }}
            >
              Volunteer Author
            </div>
            <div
              style={{
                width: "100%",
                height: "0.3vh",
                background: "rgba(184,90,42,0.25)",
                marginBottom: "2.5vh",
              }}
            />
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "2.4vw",
                fontWeight: 700,
                color: "#2a1f18",
                marginBottom: "1.5vh",
                lineHeight: 1.2,
              }}
            >
              IEEE ProComm member with a Teaching Case article
            </div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.6vw",
                fontWeight: 400,
                color: "#8a7565",
                lineHeight: 1.55,
                textWrap: "pretty",
              }}
            >
              Uploads or pastes their article. Reviews and refines the AI-generated lesson draft. Submits for administrator approval.
            </div>
            <div style={{ marginTop: "2.5vh" }}>
              <div
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "1.55vw",
                  fontWeight: 600,
                  color: "#b85a2a",
                  marginBottom: "1vh",
                }}
              >
                Needs
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8vh" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1vw" }}>
                  <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#b85a2a", minWidth: "0.5vw" }} />
                  <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.55vw", color: "#2a1f18" }}>Simple upload workflow</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1vw" }}>
                  <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#b85a2a", minWidth: "0.5vw" }} />
                  <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.55vw", color: "#2a1f18" }}>AI-assisted draft generation</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1vw" }}>
                  <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#b85a2a", minWidth: "0.5vw" }} />
                  <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.55vw", color: "#2a1f18" }}>Submission status dashboard</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ width: "0.2vw", background: "rgba(138,117,101,0.15)", borderRadius: "9999px" }} />

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.6vw",
                fontWeight: 700,
                color: "#7a5a10",
                letterSpacing: "0.05em",
                marginBottom: "1.5vh",
                textTransform: "uppercase",
              }}
            >
              Learner
            </div>
            <div
              style={{
                width: "100%",
                height: "0.3vh",
                background: "rgba(212,160,32,0.3)",
                marginBottom: "2.5vh",
              }}
            />
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "2.4vw",
                fontWeight: 700,
                color: "#2a1f18",
                marginBottom: "1.5vh",
                lineHeight: 1.2,
              }}
            >
              Self-study professional or graduate student
            </div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.6vw",
                fontWeight: 400,
                color: "#8a7565",
                lineHeight: 1.55,
                textWrap: "pretty",
              }}
            >
              Browses the public catalog, selects a lesson, completes modules at their own pace, earns a certificate on passing.
            </div>
            <div style={{ marginTop: "2.5vh" }}>
              <div
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "1.55vw",
                  fontWeight: 600,
                  color: "#7a5a10",
                  marginBottom: "1vh",
                }}
              >
                Needs
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8vh" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1vw" }}>
                  <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#d4a020", minWidth: "0.5vw" }} />
                  <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.55vw", color: "#2a1f18" }}>In-browser, no install required</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1vw" }}>
                  <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#d4a020", minWidth: "0.5vw" }} />
                  <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.55vw", color: "#2a1f18" }}>Resumable progress</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1vw" }}>
                  <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#d4a020", minWidth: "0.5vw" }} />
                  <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.55vw", color: "#2a1f18" }}>AI tutor + certificate</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ width: "0.2vw", background: "rgba(138,117,101,0.15)", borderRadius: "9999px" }} />

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.6vw",
                fontWeight: 700,
                color: "#4a3828",
                letterSpacing: "0.05em",
                marginBottom: "1.5vh",
                textTransform: "uppercase",
              }}
            >
              Administrator
            </div>
            <div
              style={{
                width: "100%",
                height: "0.3vh",
                background: "rgba(42,31,24,0.15)",
                marginBottom: "2.5vh",
              }}
            />
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "2.4vw",
                fontWeight: 700,
                color: "#2a1f18",
                marginBottom: "1.5vh",
                lineHeight: 1.2,
              }}
            >
              IEEE ProComm committee member
            </div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.6vw",
                fontWeight: 400,
                color: "#8a7565",
                lineHeight: 1.55,
                textWrap: "pretty",
              }}
            >
              Reviews submitted lessons, requests revisions, approves and publishes to the public catalog.
            </div>
            <div style={{ marginTop: "2.5vh" }}>
              <div
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "1.55vw",
                  fontWeight: 600,
                  color: "#4a3828",
                  marginBottom: "1vh",
                }}
              >
                Needs
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8vh" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1vw" }}>
                  <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#4a3828", minWidth: "0.5vw" }} />
                  <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.55vw", color: "#2a1f18" }}>Review queue</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1vw" }}>
                  <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#4a3828", minWidth: "0.5vw" }} />
                  <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.55vw", color: "#2a1f18" }}>Approve / request changes</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1vw" }}>
                  <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#4a3828", minWidth: "0.5vw" }} />
                  <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.55vw", color: "#2a1f18" }}>Catalog management</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
