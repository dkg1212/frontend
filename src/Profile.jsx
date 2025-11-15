/* eslint-disable react/prop-types */
// src/Profile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user-info");
      const parsed = raw ? JSON.parse(raw) : null;
      setUser(parsed);
      if (!parsed?.token) navigate("/login", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  if (!user) return null;

  const Row = ({ label, value }) => (
    <div className="flex gap-3 py-2 border-b border-gray-100">
      <div className="w-36 text-gray-600">{label}</div>
      <div className="text-gray-900">{value || "—"}</div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto mt-10 px-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        {user?.image ? (
          <img
            src={user.image}
            width={80}
            height={80}
            alt={user?.name || "User"}
            className="rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-300 text-gray-800 grid place-items-center font-bold text-2xl uppercase">
            {(user?.name || "U").slice(0, 1)}
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <div className="text-gray-600">{user?.email}</div>
        </div>
      </div>

      {/* Box */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <Row label="Role" value={user?.role} />
        <Row label="Roll number" value={user?.rollNumber} />
        <Row label="Device ID" value={user?.deviceId} />
        <Row label="Department" value={user?.department} />
        <Row label="Semester" value={user?.semester} />
        <Row
          label="Profile complete"
          value={user?.profileComplete ? "Yes" : "No"}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => navigate("/complete-profile")}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          Edit profile
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          Back
        </button>
      </div>
    </div>
  );
}
