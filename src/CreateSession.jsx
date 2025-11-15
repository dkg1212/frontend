// src/CreateSession.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function CreateSession() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user-info"));

  const [courseId, setCourseId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState(20);
  const [duration, setDuration] = useState(45);
  const [status, setStatus] = useState("");

  // ⭐ Auto-detect location on page load
  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("Geolocation not supported.");
      return;
    }

    setStatus("Fetching your current location…");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setStatus("Location detected.");
      },
      (err) => {
        console.error(err);
        setStatus("Location permission denied.");
      }
    );
  }, []);

  // ⭐ Create session
  const startSession = async (e) => {
    e.preventDefault();
    setStatus("Creating session…");

    if (!latitude || !longitude) {
      setStatus("Location not available.");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE}/session/create`,
        {
          courseId,
          latitude,
          longitude,
          radius,
          duration,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const sessionId = res.data.sessionId;

      // ⭐ Redirect to QR page
      navigate(`/session/${sessionId}/qr`);
    } catch (err) {
      setStatus(err?.response?.data?.error || "Failed to create session.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Create Class Session</h1>

      <form onSubmit={startSession} className="grid gap-4">
        
        {/* Course ObjectId */}
        <input
          className="border rounded-md px-3 py-2"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          placeholder="Course ObjectId"
          required
        />

        {/* Latitude (read-only) */}
        <input
          className="border rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
          value={latitude}
          readOnly
          placeholder="Latitude (auto detected)"
        />

        {/* Longitude (read-only) */}
        <input
          className="border rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
          value={longitude}
          readOnly
          placeholder="Longitude (auto detected)"
        />

        {/* Radius */}
        <input
          className="border rounded-md px-3 py-2"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          placeholder="Radius (meters)"
          required
        />

        {/* Duration */}
        <input
          className="border rounded-md px-3 py-2"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (minutes)"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Start Session
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-3">{status}</p>
    </div>
  );
}
