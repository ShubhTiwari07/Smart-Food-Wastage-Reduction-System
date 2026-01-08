import React, { useState } from "react";
import DonorForm from "./components/DonorForm";
import NGODashboard from "./components/NGODashboard";

function App() {
  const [view, setView] = useState("donor"); 
  // donor | ngo

  return (
    <div style={{ padding: "20px" }}>
      {/* 🔀 SWITCH */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setView("donor")}>
          Donor View
        </button>
        <button
          onClick={() => setView("ngo")}
          style={{ marginLeft: "10px" }}
        >
          NGO Dashboard
        </button>
      </div>

      {view === "donor" ? <DonorForm /> : <NGODashboard />}
    </div>
  );
}

export default App;
