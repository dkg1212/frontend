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
    <div style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid #f1f1f1" }}>
      <div style={{ width: 140, color: "#666" }}>{label}</div>
      <div style={{ color: "#222" }}>{value || "—"}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 960, margin: "32px auto", padding: "0 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        {user?.image ? (
          <img
            src={user.image}
            alt={user?.name || "User"}
            width={80}
            height={80}
            style={{ borderRadius: "50%", objectFit: "cover" }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            style={{
              width: 80, height: 80, borderRadius: "50%", background: "#c5c5c5",
              color: "#222", display: "grid", placeItems: "center",
              fontWeight: 700, fontSize: 22, textTransform: "uppercase"
            }}
          >
            {(user?.name || "U").slice(0, 1)}
          </div>
        )}
        <div>
          <h2 style={{ margin: 0 }}>{user?.name}</h2>
          <div style={{ color: "#666" }}>{user?.email}</div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: 16 }}>
        <Row label="Role" value={user?.role} />
        <Row label="Roll number" value={user?.rollNumber} />
        <Row label="Device ID" value={user?.deviceId} />
        <Row label="Department" value={user?.department} />
        <Row label="Semester" value={user?.semester} />
        <Row label="Profile complete" value={user?.profileComplete ? "Yes" : "No"} />
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button onClick={() => navigate("/complete-profile")} title="Update your profile">
          Edit profile
        </button>
        <button onClick={() => navigate("/dashboard")} title="Back to dashboard" style={{ background: "#f1f3f4", color: "#222" }}>
          Back
        </button>
      </div>
    </div>
  );
}
