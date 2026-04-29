export default function Slide2Progress() {
  const items = [
    {
      check: true,
      label: "Listening Demo",
      sub: "AI-narrated audio, comprehension check, xAPI tracking, certificate",
    },
    {
      check: true,
      label: "Content Library Catalogued",
      sub: "127 ProComm articles classified — 65 Articles, 44 Resource Links, 9 Podcasts",
    },
    {
      check: true,
      label: "16 Authors Found",
      sub: "14 confirmed emails · 2 via LinkedIn · Alan Chong (23), Traci (15), Bob Lyons (4)…",
    },
    {
      check: true,
      label: "Permission Letter Template",
      sub: "Traci as sender (IEEE ProComm VP Content voice), Simon cc'd — ready to send",
    },
  ];

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
            fontSize: "1.3vw",
            fontWeight: 600,
            color: "#b85a2a",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: "1.5vh",
          }}
        >
          Where We Are
        </div>

        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "3.6vw",
            fontWeight: 900,
            color: "#2a1f18",
            lineHeight: 1.1,
            marginBottom: "1.2vh",
          }}
        >
          Four things already done.
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

        <div style={{ display: "flex", flexDirection: "column", gap: "2.5vh" }}>
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "2vw",
                background: "#fff",
                border: "1px solid rgba(184,90,42,0.12)",
                borderRadius: "0.8vw",
                padding: "2vh 2.2vw",
                boxShadow: "0 2px 12px rgba(42,31,24,0.05)",
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: "2.8vw",
                  height: "2.8vw",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #b85a2a, #d4a020)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "0.2vh",
                }}
              >
                <svg width="1.2vw" height="1.2vw" viewBox="0 0 20 20" fill="none" style={{ width: "1.2vw", height: "1.2vw" }}>
                  <path d="M4 10.5l4.5 4.5 8-9" stroke="#faf8f5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1.7vw",
                    fontWeight: 700,
                    color: "#2a1f18",
                    marginBottom: "0.4vh",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1.3vw",
                    color: "rgba(42,31,24,0.6)",
                  }}
                >
                  {item.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
