export default function Slide5Outreach() {
  const steps = [
    {
      num: "01",
      label: "Template ready",
      detail: "Drafted and reviewed — in Google Docs, ready to personalise per author",
    },
    {
      num: "02",
      label: "Traci sends",
      detail: "Letter is from Traci as IEEE ProComm VP Content — Simon cc'd as HKBU collaborator",
    },
    {
      num: "03",
      label: "14 emails confirmed",
      detail: "Addresses verified for 14 of 16 authors · 2 reachable via LinkedIn (Bob Lyons, Samartha Vashishtha)",
    },
    {
      num: "04",
      label: "Attribution guaranteed",
      detail: "Author name, original URL, and publication date in every lesson module — non-commercial, freely revocable",
    },
  ];

  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{
        background: "linear-gradient(150deg, #1e0c04 0%, #3a1808 50%, #120804 100%)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 85% 60%, rgba(212,160,32,0.1) 0%, transparent 55%)",
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
          Author Outreach
        </div>
        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "3.6vw",
            fontWeight: 900,
            color: "#faf8f5",
            lineHeight: 1.1,
            marginBottom: "1.2vh",
          }}
        >
          Traci writes.
          <br />
          Authors trust ProComm.
        </div>
        <div
          style={{
            width: "5vw",
            height: "0.4vh",
            background: "linear-gradient(to right, #d4a020, #f5e8c0)",
            borderRadius: "9999px",
            marginBottom: "4vh",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "2.2vh" }}>
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "2.5vw",
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  fontFamily: "var(--font-display-family)",
                  fontSize: "2.2vw",
                  fontWeight: 900,
                  color: "rgba(212,160,32,0.35)",
                  lineHeight: 1,
                  width: "3vw",
                  paddingTop: "0.3vh",
                }}
              >
                {s.num}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1.7vw",
                    fontWeight: 700,
                    color: "#faf8f5",
                    marginBottom: "0.5vh",
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1.3vw",
                    color: "rgba(245,232,192,0.6)",
                  }}
                >
                  {s.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "3.5vh", display: "flex", gap: "2vw", alignItems: "stretch" }}>
          <div
            style={{
              flex: 1,
              background: "rgba(212,160,32,0.1)",
              border: "1px solid rgba(212,160,32,0.25)",
              borderRadius: "0.8vw",
              padding: "1.8vh 2.2vw",
              display: "flex",
              alignItems: "center",
              gap: "1.2vw",
            }}
          >
            <span style={{ fontSize: "1.8vw" }}>💡</span>
            <span
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.3vw",
                color: "rgba(245,232,192,0.85)",
              }}
            >
              The IEEE ProComm name is the key trust signal — authors are likely to say yes
            </span>
          </div>
          <a
            href="https://docs.google.com/document/d/1o-JgbqSw7hOO4ufi9ad37azcFczAso57p86Q_EwlcO8/edit"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.8vw",
              background: "rgba(250,248,245,0.07)",
              border: "1px solid rgba(212,160,32,0.3)",
              borderRadius: "0.8vw",
              padding: "1.8vh 2vw",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: "1.6vw" }}>📝</span>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "1.2vw",
                  fontWeight: 700,
                  color: "#d4a020",
                }}
              >
                Open permission letter template →
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "1vw",
                  color: "rgba(245,232,192,0.45)",
                }}
              >
                Google Docs · ready to personalise
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
