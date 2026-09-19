import { useState } from "react";

export default function OrderForm() {
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [software, setSoftware] = useState("");
  const [status, setStatus] = useState(null);

  async function submitOrder() {
    setStatus("sending");
    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("software", software);
      formData.append("customer_email", email);

      const res = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setStatus("success");
      console.log(data);
    } catch (err) {
      setStatus("error");
      console.error(err);
    }
  }

  return (
    <div style={{
      marginTop: "36px",
      background: "var(--card)",
      padding: "24px",
      width: "640px",
      marginLeft: "auto",
      marginRight: "auto",
      borderRadius: "10px",
      border: "1px solid var(--border)"
    }}>
      <h2 style={{ marginBottom: "14px" }}>Create Your Model</h2>

      <select
        value={software}
        onChange={e => setSoftware(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "14px", background: "var(--panel)", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: "6px" }}
      >
        <option value="">Select CAD Software</option>
        <option value="SolidWorks">SolidWorks</option>
        <option value="NX">Siemens NX</option>
        <option value="AutoCAD">AutoCAD</option>
      </select>

      <textarea
        placeholder="Please be specific and use CAD terminology for best results."
        value={description}
        onChange={e => setDescription(e.target.value)}
        style={{ width: "100%", height: "140px", padding: "10px", background: "var(--panel)", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: "6px", marginBottom: "14px" }}
      />

      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: "100%", padding: "10px", background: "var(--panel)", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: "6px", marginBottom: "14px" }}
      />

      <button
        onClick={submitOrder}
        style={{ width: "100%", padding: "12px", background: "var(--panel)", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: "6px" }}
      >
        Submit Order
      </button>

      {status === "sending" && <p style={{ marginTop: "10px" }}>Sending...</p>}
      {status === "success" && <p style={{ marginTop: "10px", color: "#7bd389" }}>Order submitted</p>}
      {status === "error" && <p style={{ marginTop: "10px", color: "#ff7b7b" }}>Error submitting order</p>}
    </div>
  );
}
