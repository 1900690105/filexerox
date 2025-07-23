"use client"; // Only if you're using Next.js App Router

import { useEffect, useState } from "react";

export default function ExactLocation() {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  const fetchFullAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );

      const data = await response.json();

      if (data && data.address) {
        setAddress(data.address);
      } else {
        setError("Address not found.");
      }
    } catch (err) {
      setError("Failed to fetch address.");
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });
          fetchFullAddress(lat, lng);
        },
        (err) => {
          setError("Permission denied or location unavailable.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-bold mb-2">Your Exact Location</h2>
      {error && <p className="text-red-500">{error}</p>}

      {address ? (
        <div className="space-y-1">
          <p>
            <strong>Road:</strong> {address.road || "N/A"}
          </p>
          <p>
            <strong>Neighbourhood:</strong>{" "}
            {address.suburb || address.neighbourhood || "N/A"}
          </p>
          <p>
            <strong>City:</strong>{" "}
            {address.city || address.town || address.village || "N/A"}
          </p>
          <p>
            <strong>District:</strong> {address.county || "N/A"}
          </p>
          <p>
            <strong>State:</strong> {address.state || "N/A"}
          </p>
          <p>
            <strong>Postcode:</strong> {address.postcode || "N/A"}
          </p>
          <p>
            <strong>Country:</strong> {address.country || "N/A"}
          </p>
        </div>
      ) : (
        !error && <p>Getting your exact location...</p>
      )}
    </div>
  );
}
