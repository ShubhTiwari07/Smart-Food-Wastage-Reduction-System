import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 🔴🔶🟢 Urgency marker icons
const highIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
});

const mediumIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
  iconSize: [32, 32],
});

const lowIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
});

// 🔥 Choose icon based on urgency
const getMarkerIcon = (hours) => {
  const h = Number(hours);
  if (h >= 5) return highIcon;
  if (h >= 2) return mediumIcon;
  return lowIcon;
};

function PickupMap({ donations }) {
  const center = [28.6139, 77.2090]; // Delhi

  return (
    <div style={{ height: "400px", width: "100%", borderRadius: "12px" }}>
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {donations.map(
          (donation) =>
            donation.location?.lat &&
            donation.location?.lng && (
              <Marker
                key={donation.id}
                position={[
                  donation.location.lat,
                  donation.location.lng,
                ]}
                icon={getMarkerIcon(donation.cookedHoursAgo)}
              >
                <Popup>
                  <strong>{donation.foodType}</strong><br />
                  🍽 Quantity: {donation.quantity}<br />
                  ⏱ Cooked {donation.cookedHoursAgo} hours ago
                  <br /><br />

                  {/* 🧭 NAVIGATE BUTTON */}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${donation.location.lat},${donation.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      padding: "6px 10px",
                      background: "#2563eb",
                      color: "#fff",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontSize: "14px",
                    }}
                  >
                    🧭 Navigate
                  </a>
                </Popup>
              </Marker>
            )
        )}
      </MapContainer>
    </div>
  );
}

export default PickupMap;
