// ✅ ALL IMPORTS MUST BE AT THE TOP
import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import PickupMap from "./PickupMap";
import "./DonorForm.css";

// 📊 CHART IMPORTS
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

// ✅ REGISTER CHARTS (AFTER IMPORTS)
ChartJS.register(ArcElement, Tooltip, Legend);

function NGODashboard() {
  const [donations, setDonations] = useState([]);

  // 🔄 Fetch donations
  useEffect(() => {
    const q = query(
      collection(db, "foodDonations"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((docu) => ({
        id: docu.id,
        ...docu.data(),
      }));
      setDonations(data);
    });

    return () => unsubscribe();
  }, []);

  // 🗑 Delete donation
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this donation?")) return;
    await deleteDoc(doc(db, "foodDonations", id));
  };

  // 🔴 Urgency logic
  const getUrgencyLevel = (hours) => {
    const h = Number(hours);
    if (h >= 5) return "HIGH";
    if (h >= 2) return "MEDIUM";
    return "LOW";
  };

  // 📊 ANALYTICS COUNTS
  const urgencyCount = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  const foodTypeCount = {};

  donations.forEach((d) => {
    const urgency = getUrgencyLevel(d.cookedHoursAgo);
    urgencyCount[urgency]++;
    foodTypeCount[d.foodType] =
      (foodTypeCount[d.foodType] || 0) + 1;
  });

  // 📈 CHART DATA
  const urgencyChartData = {
    labels: ["HIGH", "MEDIUM", "LOW"],
    datasets: [
      {
        data: [
          urgencyCount.HIGH,
          urgencyCount.MEDIUM,
          urgencyCount.LOW,
        ],
        backgroundColor: ["#dc2626", "#f59e0b", "#16a34a"],
      },
    ],
  };

  const foodTypeChartData = {
    labels: Object.keys(foodTypeCount),
    datasets: [
      {
        data: Object.values(foodTypeCount),
        backgroundColor: [
          "#2563eb",
          "#9333ea",
          "#14b8a6",
          "#f97316",
          "#22c55e",
        ],
      },
    ],
  };

  return (
    <div className="donor-container">
      <h1 className="title">🏢 NGO Dashboard</h1>

      {/* 📊 ANALYTICS */}
      <h2 className="section-title">📊 Analytics Overview</h2>
      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        <div style={{ width: "300px" }}>
          <h4>Urgency Distribution</h4>
          <Pie data={urgencyChartData} />
        </div>

        <div style={{ width: "300px" }}>
          <h4>Food Type Distribution</h4>
          <Pie data={foodTypeChartData} />
        </div>
      </div>

      {/* 🗺 MAP */}
      <PickupMap donations={donations} />

      <h2 className="section-title">📦 All Food Donations</h2>

      <div className="donation-grid">
        {donations.map((donation) => {
          const urgency = getUrgencyLevel(donation.cookedHoursAgo);

          return (
            <div className="donation-card" key={donation.id}>
              <div className="food-name">{donation.foodType}</div>

              <div className="meta">
                🍽 Quantity: {donation.quantity}
              </div>
              <div className="meta">
                ⏱ Cooked {donation.cookedHoursAgo} hours ago
              </div>

              <span className={`badge ${urgency.toLowerCase()}`}>
                {urgency} URGENCY
              </span>

              <button
                className="delete-btn"
                onClick={() => handleDelete(donation.id)}
              >
                🗑 Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NGODashboard;
