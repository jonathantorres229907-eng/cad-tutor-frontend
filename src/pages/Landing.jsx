import { useState } from "react";
import DisclaimerModal from "../components/DisclaimerModal";
import OrderForm from "../components/OrderForm";

export default function Landing() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showForm, setShowForm] = useState(false);

  return (
    <div style={{ minHeight: "100vh", padding: "40px 20px" }}>
      <DisclaimerModal show={showDisclaimer} onClose={() => setShowDisclaimer(false)} />

      <div style={{ textAlign: "center", paddingTop: "80px" }}>
        <h1 style={{ fontSize: "44px", marginBottom: "12px" }}>CAD Workshops & Tutorials</h1>

        <p style={{ fontSize: "16px", marginBottom: "28px", maxWidth: "720px", marginLeft: "auto", marginRight: "auto" }}>
          AI-assisted CAD modeling for students, makers, and engineers.
        </p>

        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: "12px 26px",
            background: "var(--panel)",
            border: "1px solid var(--border)",
            color: "var(--muted)",
            borderRadius: "6px",
            fontSize: "16px"
          }}
        >
          Start Your Model
        </button>

        {showForm && <OrderForm />}
      </div>
    </div>
  );
}

