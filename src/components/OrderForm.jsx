import { useState } from "react";
import ModelPreview from "./ModelPreview";

console.log("OrderForm loaded");

export default function OrderForm() {
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [software, setSoftware] = useState("");
  const [status, setStatus] = useState(null);
  const [stlData, setStlData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

async function generateModel() {
  console.log("generateModel clicked");
  setIsGenerating(true); 

  const formData = new FormData();
  formData.append("description", description);

  try {
    const response = await fetch("http://localhost:8000/generate-stl", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      console.error("Backend returned error:", response.status);
      setIsGenerating(fals);
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    const stlBytes = new Uint8Array(arrayBuffer);
    setStlData(stlBytes);
    console.log("recieved STL bytes:", stlBytes);
  } catch (err) {
    const color = new THREE.Color(0xcccccc)
  } finally {
    setIsGenerating(false);
  }
}

  async function submitOrder() {
    setStatus("sending");

    try {
      const formData = new FormData();
      formData.append("description", description);
      console.log("Button clicked");

      const response = await fetch("http://localhost:8000/generate-stl", {
        method: "POST",
        body: formData
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "rough_model.stl";
      a.click();

      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <>
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

        <button
          onClick={generateModel}
          disabled={isGenerating}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "10px",
            background: "var(--panel)",
            border: "1px solid var(--border)",
            color: "var(--muted)",
            borderRadius: "6px",
            opacity: isGenerating ? 0.6 : 1,
            cursor: isGenerating ? "wait" : "pointer"
          }}
        >
          {isGenerating ? "Generating..." : "Generate Rough Model"}
        </button>


        {status === "sending" && <p style={{ marginTop: "10px" }}>Sending...</p>}
        {status === "success" && <p style={{ marginTop: "10px", color: "#7bd389" }}>Model generated</p>}
        {status === "error" && <p style={{ marginTop: "10px", color: "#ff7b7b" }}>Error generating model</p>}
      </div>

      {stlData && <ModelPreview stlData={stlData} />}
    </>
  );
}
