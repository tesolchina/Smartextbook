export default function Slide9IEEEiln() {
  const courses = [
    {
      title: "From Research to Publication",
      sub: "A Step-by-Step Guide to Technical Writing",
      topics: [
        "Writing & editing technical English",
        "Organising research papers (ILMRaDC pattern)",
        "Predictable patterns of scientific communication",
        "Writing for IEEE journals",
        "Using Generative AI for technical writing",
      ],
      credit: "CEU / PDH credits available",
      badge: "IEEE ILN",
    },
    {
      title: "IEEE English for Technical Professionals",
      sub: "For engineers whose first language is not English",
      topics: [
        "Professional vocabulary and register",
        "Writing reports and technical documentation",
        "Email and workplace communication norms",
        "Presenting findings to international audiences",
        "Grammar patterns specific to technical writing",
      ],
      credit: "CEU / PDH credits available",
      badge: "IEEE ILN",
    },
  ];

  const topics = [
    "Oral Presentation Skills",
    "Written Reporting",
    "Style and Grammar",
    "Team Communication",
    "Career Development",
    "Rhetorical Strategies",
    "Interpersonal Communication",
    "Visual Communication",
    "Process Writing",
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
          What to Teach — Existing IEEE Platform
        </div>
        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "3.2vw",
            fontWeight: 900,
            color: "#2a1f18",
            lineHeight: 1.1,
            marginBottom: "0.8vh",
          }}
        >
          IEEE Learning Network (ILN)
          <br />
          already offers two ProComm courses.
        </div>
        <div
          style={{
            width: "5vw",
            height: "0.4vh",
            background: "linear-gradient(to right, #b85a2a, #d4a020)",
            borderRadius: "9999px",
            marginBottom: "2.5vh",
          }}
        />

        <div style={{ display: "flex", gap: "3vw", alignItems: "flex-start" }}>
          <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: "1.8vh" }}>
            {courses.map((c, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "1px solid rgba(184,90,42,0.1)",
                  borderLeft: "0.4vw solid #b85a2a",
                  borderRadius: "0 0.8vw 0.8vw 0",
                  padding: "1.8vh 1.8vw",
                  boxShadow: "0 2px 10px rgba(42,31,24,0.04)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1vw", marginBottom: "0.6vh" }}>
                  <div
                    style={{
                      background: "#b85a2a",
                      color: "#faf8f5",
                      fontFamily: "var(--font-body-family)",
                      fontSize: "0.9vw",
                      fontWeight: 700,
                      padding: "0.2vh 0.7vw",
                      borderRadius: "0.3vw",
                    }}
                  >
                    {c.badge}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body-family)",
                      fontSize: "0.95vw",
                      color: "#2a8a4a",
                      fontWeight: 600,
                    }}
                  >
                    {c.credit}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1.4vw",
                    fontWeight: 700,
                    color: "#2a1f18",
                    marginBottom: "0.2vh",
                  }}
                >
                  {c.title}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1.1vw",
                    color: "#b85a2a",
                    fontWeight: 600,
                    marginBottom: "0.8vh",
                  }}
                >
                  {c.sub}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5vh 1vw" }}>
                  {c.topics.map((t, j) => (
                    <div
                      key={j}
                      style={{
                        fontFamily: "var(--font-body-family)",
                        fontSize: "1.1vw",
                        color: "rgba(42,31,24,0.6)",
                      }}
                    >
                      · {t}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <a
              href="https://procomm.ieee.org/ieee-iln-procomm-online-courses/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6vw",
                fontFamily: "var(--font-body-family)",
                fontSize: "1.2vw",
                color: "#b85a2a",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <span>🔗</span>
              <span>procomm.ieee.org/ieee-iln-procomm-online-courses</span>
            </a>
          </div>

          <div
            style={{
              flex: 1,
              background: "#fff",
              border: "1px solid rgba(184,90,42,0.1)",
              borderRadius: "0.8vw",
              padding: "2vh 1.8vw",
              boxShadow: "0 2px 10px rgba(42,31,24,0.04)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.1vw",
                fontWeight: 700,
                color: "rgba(42,31,24,0.5)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "1.5vh",
              }}
            >
              ProComm Article Topics
              <br />
              <span style={{ fontWeight: 400, fontSize: "0.95vw" }}>127 articles across 9 categories</span>
            </div>
            {topics.map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8vw",
                  padding: "0.7vh 0",
                  borderBottom: i < topics.length - 1 ? "1px solid rgba(42,31,24,0.06)" : "none",
                }}
              >
                <div
                  style={{
                    width: "0.5vw",
                    height: "0.5vw",
                    borderRadius: "50%",
                    background: "#d4a020",
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "1.15vw",
                    color: "rgba(42,31,24,0.7)",
                  }}
                >
                  {t}
                </div>
              </div>
            ))}
            <div
              style={{
                marginTop: "1.8vh",
                background: "linear-gradient(135deg, rgba(184,90,42,0.07), rgba(212,160,32,0.05))",
                border: "1px solid rgba(184,90,42,0.18)",
                borderLeft: "0.4vw solid #d4a020",
                borderRadius: "0 0.6vw 0.6vw 0",
                padding: "1.4vh 1.4vw",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "0.95vw",
                  fontWeight: 700,
                  color: "#b85a2a",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "0.5vh",
                }}
              >
                Open question for Traci
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "1.15vw",
                  color: "#2a1f18",
                  lineHeight: 1.45,
                  fontStyle: "italic",
                }}
              >
                If our goal is for these to become ILN lessons — what infrastructure does IEEE expose to content partners? Can we publish directly into ILN, or do we build alongside it?
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
