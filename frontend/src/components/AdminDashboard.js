import { auth } from "../firebase";
import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "../firebase";

function AdminDashboard() {
  const [donations, setDonations] = useState([]);

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

  // 🔹 Mark food as collected
  const markAsCollected = async (id) => {
    await updateDoc(doc(db, "foodDonations", id), {
      status: "collected",
    });
  };

  // 🔹 Delete donation
  const deleteDonation = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this donation?"
    );
    if (confirmDelete) {
      await deleteDoc(doc(db, "foodDonations", id));
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: "center" }}>
        🏥 NGO / Admin Dashboard
      </h2>

      {donations.length === 0 ? (
        <p>No food donations available.</p>
      ) : (
        donations.map((donation) => (
          <div className="card" key={donation.id}>
            <h3>{donation.foodType}</h3>

            <p><strong>Quantity:</strong> {donation.quantity}</p>
            <p>
              <strong>Cooked:</strong> {donation.cookedHoursAgo} hours ago
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {donation.status === "collected" ? (
                <span style={{ color: "green" }}>Collected</span>
              ) : (
                <span style={{ color: "orange" }}>Available</span>
              )}
            </p>

            {donation.status !== "collected" && (
              <button
                className="button"
                onClick={() => markAsCollected(donation.id)}
                style={{ marginRight: "10px" }}
              >
                Mark as Collected
              </button>
            )}

            <button
              className="button"
              style={{ backgroundColor: "#e74c3c" }}
              onClick={() => deleteDonation(donation.id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;
