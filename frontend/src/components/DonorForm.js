import "./DonorForm.css";
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import PickupMap from "./PickupMap"; // ✅ IMPORT MAP

function DonorForm() {
  const [food, setFood] = useState("");
  const [quantity, setQuantity] = useState("");
  const [timeCooked, setTimeCooked] = useState("");
  const [donations, setDonations] = useState([]);

  // 🔍 Force location permission popup (debug)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      () => console.log("✅ Location access granted"),
      (err) => console.error("❌ Location error:", err)
    );
  }, []);

  // 🔐 TEMP ADMIN FLAG (we'll auto-detect later)
  const isAdmin = true;

  // 🔴 Urgency logic
  const getUrgencyLevel = (hours) => {
    const h = Number(hours);
    if (h >= 5) return "HIGH";
    if (h >= 2) return "MEDIUM";
    return "LOW";
  };

  // 📍 Get user location
  const getLocation = () =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        reject
      );
    });

  // 🔹 Submit food donation
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const location = await getLocation();

      await addDoc(collection(db, "foodDonations"), {
        foodType: food,
        quantity,
        cookedHoursAgo: timeCooked,
        status: "available",
        location,
        createdAt: serverTimestamp(),
      });

      alert("Food submitted successfully!");

      setFood("");
      setQuantity("");
      setTimeCooked("");
    } catch (error) {
      console.error("Error adding document:", error);
      alert("ERROR: " + error.message);
    }
  };

  // 🗑️ ADMIN DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this donation?")) return;

    try {
      await deleteDoc(doc(db, "foodDonations", id));
      alert("Donation deleted");
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  // 🔄 Real-time fetch
  useEffect(() => {
    const q = query(
      collection(db, "foodDonations"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDonations(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="donor-container">
      {/* ===== FORM ===== */}
      <div className="form-card">
        <h1 className="title">🍽 Smart Food Wastage Reduction</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Food Type"
              value={food}
              onChange={(e) => setFood(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Cooked hours ago"
              value={timeCooked}
              onChange={(e) => setTimeCooked(e.target.value)}
              required
            />
          </div>

          <button className="submit-btn" type="submit">
            Submit Food
          </button>
        </form>
      </div>

      {/* ===== MAP VIEW ===== */}
      <h2 className="section-title">📍 Pickup Locations</h2>

      <div className="map-wrapper">
        <PickupMap
          donations={donations.filter(
            (d) => d.location && d.location.lat && d.location.lng
          )}
        />
      </div>

      {/* ===== DONATIONS LIST ===== */}
      <h2 className="section-title">📦 Available Food Donations</h2>

      {donations.length === 0 ? (
        <p>No donations yet.</p>
      ) : (
        <div className="donation-grid">
          {donations.map((donation) => {
            const urgency = getUrgencyLevel(donation.cookedHoursAgo);

            return (
              <div className="donation-card" key={donation.id}>
                <div className="food-name">{donation.foodType}</div>

                <div className="meta">🍽 Quantity: {donation.quantity}</div>
                <div className="meta">
                  ⏱ Cooked {donation.cookedHoursAgo} hours ago
                </div>

                <span className={`badge ${urgency.toLowerCase()}`}>
                  {urgency} URGENCY
                </span>

                {isAdmin && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(donation.id)}
                  >
                    🗑 Delete
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DonorForm;
