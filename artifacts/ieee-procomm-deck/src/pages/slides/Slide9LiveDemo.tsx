export default function Slide9LiveDemo() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{
        background: "linear-gradient(145deg, #7a2c0e 0%, #b85a2a 50%, #5a1a06 100%)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 20% 80%, rgba(212,160,32,0.18) 0%, transparent 55%)",
        }}
      />

      <div
        className="absolute"
        style={{
          right: 0,
          top: 0,
          width: "0.4vw",
          height: "100vh",
          background: "linear-gradient(to bottom, transparent, rgba(212,160,32,0.5), transparent)",
        }}
      />

      <div
        className="absolute"
        style={{
          bottom: "12vh",
          left: "7vw",
          right: "7vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      />

      <div
        className="absolute"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          width: "80vw",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "1.5vw",
            fontWeight: 600,
            color: "rgba(245,232,192,0.8)",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: "2.5vh",
          }}
        >
          Live Demo
        </div>

        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "6vw",
            fontWeight: 900,
            color: "#faf8f5",
            lineHeight: 1.05,
            marginBottom: "3vh",
          }}
        >
          Try It Now
        </div>

        <div
          style={{
            width: "6vw",
            height: "0.4vh",
            background: "linear-gradient(to right, rgba(212,160,32,0.5), #d4a020, rgba(212,160,32,0.5))",
            borderRadius: "9999px",
            margin: "0 auto 3.5vh",
          }}
        />

        <div
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "1.7vw",
            fontWeight: 400,
            color: "rgba(250,248,245,0.8)",
            marginBottom: "4vh",
          }}
        >
          The SmartTextbook Chapter-to-Lesson platform — see AI-assisted lesson generation in action.
        </div>

        <a
          href="https://cae5c87d-8c93-4c67-9816-e5397c3a11ac-00-14csojzz0dqfl.worf.replit.dev"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            fontFamily: "var(--font-body-family)",
            fontSize: "1.7vw",
            fontWeight: 600,
            color: "#f5e8c0",
            textDecoration: "underline",
            textUnderlineOffset: "0.3em",
            textDecorationColor: "rgba(212,160,32,0.7)",
            letterSpacing: "0.02em",
            overflowWrap: "anywhere",
            wordBreak: "break-all",
          }}
        >
          https://cae5c87d-8c93-4c67-9816-e5397c3a11ac-00-14csojzz0dqfl.worf.replit.dev
        </a>
      </div>

      <div
        className="absolute"
        style={{
          bottom: "5vh",
          right: "7vw",
          textAlign: "right",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "1.5vw",
            fontWeight: 600,
            color: "rgba(212,160,32,0.7)",
          }}
        >
          SmartTextbook
        </div>
        <div
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "1.5vw",
            fontWeight: 400,
            color: "rgba(250,248,245,0.4)",
          }}
        >
          IEEE ProComm 2026
        </div>
      </div>
    </div>
  );
}
