export default function Slide4ContentLibrary() {
  const types = [
    { label: "Articles", count: 65, color: "#b85a2a" },
    { label: "Resource Links", count: 44, color: "#d4a020" },
    { label: "Podcasts", count: 9, color: "#7a2c0e" },
    { label: "Other", count: 9, color: "rgba(42,31,24,0.3)" },
  ];

  const authors = [
    { name: "Alan Chong", n: 23, org: "U of Toronto" },
    { name: "Traci Nathans-Kelly", n: 15, org: "Cornell / IEEE ProComm" },
    { name: "Bob Lyons", n: 4, org: "Independent" },
    { name: "Kohava Mendelsohn", n: 2, org: "IEEE Spectrum" },
    { name: "Kristin Zibell", n: 2, org: "IA Collaborative" },
    { name: "Melissa Clarkson", n: 2, org: "U of Kentucky" },
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
            marginBottom: "1.2vh",
          }}
        >
          Content Library
        </div>
        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "3.4vw",
            fontWeight: 900,
            color: "#2a1f18",
            lineHeight: 1.1,
            marginBottom: "1vh",
          }}
        >
          127 ProComm resources.
          <br />
          All catalogued.
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
            display: "inline-flex",
            alignItems: "center",
            gap: "0.8vw",
            marginBottom: "2vh",
            background: "#fff",
            border: "1px solid rgba(184,90,42,0.15)",
            borderRadius: "0.5vw",
            padding: "0.8vh 1.2vw",
          }}
        >
          <span style={{ fontSize: "1.3vw" }}>📊</span>
          <a
            href="https://docs.google.com/spreadsheets/d/1-QZA_CsFZsxfR7_Iv6P7BqSxQB21EWCfVw3qA4IaY_g/edit"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.2vw",
              color: "#b85a2a",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Open full spreadsheet →
          </a>
          <span
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.1vw",
              color: "rgba(42,31,24,0.4)",
            }}
          >
            127 rows · Content Type · Author Status · Emails
          </span>
        </div>

        <div style={{ display: "flex", gap: "4vw" }}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.2vw",
                fontWeight: 700,
                color: "rgba(42,31,24,0.5)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "1.5vh",
              }}
            >
              By Content Type
            </div>
            {types.map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5vw",
                  marginBottom: "1.5vh",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1.3vw",
                    color: "rgba(42,31,24,0.5)",
                    width: "10vw",
                  }}
                >
                  {t.label}
                </div>
                <div
                  style={{
                    height: "2.8vh",
                    width: `${(t.count / 65) * 22}vw`,
                    minWidth: "2vw",
                    background: t.color,
                    borderRadius: "0 0.4vw 0.4vw 0",
                  }}
                />
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1.6vw",
                    fontWeight: 700,
                    color: t.color === "rgba(42,31,24,0.3)" ? "rgba(42,31,24,0.4)" : t.color,
                  }}
                >
                  {t.count}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              width: "0.15vw",
              background: "rgba(42,31,24,0.1)",
              alignSelf: "stretch",
              margin: "0 1vw",
            }}
          />

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.2vw",
                fontWeight: 700,
                color: "rgba(42,31,24,0.5)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "1.5vh",
              }}
            >
              Top Authors (16 total · 14 confirmed emails)
            </div>
            {authors.map((a, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1vh 0",
                  borderBottom: "1px solid rgba(42,31,24,0.07)",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-body-family)",
                      fontSize: "1.4vw",
                      fontWeight: 700,
                      color: "#2a1f18",
                    }}
                  >
                    {a.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body-family)",
                      fontSize: "1.1vw",
                      color: "rgba(42,31,24,0.5)",
                    }}
                  >
                    {a.org}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display-family)",
                    fontSize: "2vw",
                    fontWeight: 900,
                    color: "#b85a2a",
                  }}
                >
                  {a.n}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
