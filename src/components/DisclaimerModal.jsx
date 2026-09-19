export default function DisclaimerModal({ show, onClose }) {
  if (!show) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "var(--card)",
        padding: "28px",
        borderRadius: "10px",
        width: "420px",
        border: "1px solid var(--border)",
        color: "var(--muted)"
      }}>
        <h2 style={{ marginBottom: "10px" }}>Before You Enter</h2>

        <p style={{ marginBottom: "20px" }}>
          CAD Workshops & Tutorials is a student project in active development.
          AI models may vary in accuracy. Your feedback helps improve the system.
        </p>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "10px",
            background: "var(--panel)",
            border: "1px solid var(--border)",
            color: "var(--muted)",
            borderRadius: "6px"
          }}
        >
          Enter Site
        </button>
      </div>
    </div>
  );
}
