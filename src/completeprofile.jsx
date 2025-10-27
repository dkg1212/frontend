/* eslint-disable no-useless-escape */
// src/CompleteProfile.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "./api";

export default function CompleteProfile() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user-info");
      const parsed = raw ? JSON.parse(raw) : null;
      setUser(parsed);
      if (!parsed?.token) {
        navigate("/login", { replace: true });
        return;
      }
      if (parsed?.role) setRole(parsed.role);
      if (parsed?.rollNumber) setRollNumber(parsed.rollNumber);
      if (parsed?.deviceId) setDeviceId(parsed.deviceId);
      if (parsed?.department) setDepartment(parsed.department);
      if (parsed?.semester) setSemester(parsed.semester);
    } catch {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const isProfileComplete = useMemo(() => {
    if (!user) return false;
    if (user?.profileComplete) return true;
    if (!user?.role) return false;
    if (user.role === "student") return Boolean(user?.rollNumber && user?.deviceId);
    return true;
  }, [user]);

  useEffect(() => {
    if (isProfileComplete) {
      navigate("/dashboard", { replace: true });
    }
  }, [isProfileComplete, navigate]);

  const isStudent = role === "student";
  const rollRegex = /^[A-Z0-9][A-Z0-9\-\/]*$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");

    if (!role) return setError("Please select your role.");
    if (isStudent) {
      if (!rollNumber.trim() || !deviceId.trim()) {
        return setError("rollNumber and deviceId are required for students.");
      }
      if (!rollRegex.test(rollNumber)) {
        return setError("Invalid roll number format.");
      }
    }

    try {
      setSaving(true);
      setStatus("Saving your profile…");

      await updateProfile(
        { role, rollNumber, deviceId, department, semester },
        user.token
      );

      const merged = {
        ...user,
        role,
        rollNumber: rollNumber || user.rollNumber,
        deviceId: deviceId || user.deviceId,
        department: department || user.department,
        semester: semester || user.semester,
        profileComplete:
          role !== "student"
            ? true
            : Boolean(
                (rollNumber || user.rollNumber) && (deviceId || user.deviceId)
              ),
      };
      localStorage.setItem("user-info", JSON.stringify(merged));

      setStatus("Profile updated.");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to update profile.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!user || isProfileComplete) return null;

  return (
    <div style={{ maxWidth: 520, margin: "32px auto", padding: 16 }}>
      <h2>Complete your profile</h2>
      <p style={{ color: "#666" }}>Signed in as {user?.email || "unknown"}.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">Select role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        {isStudent && (
          <>
            <label>
              Roll Number
              <input
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value.toUpperCase().trim())}
                placeholder="e.g., CSE-2025-001"
                required
              />
            </label>
            <label>
              Device ID
              <input
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value.trim())}
                placeholder="Device identifier"
                required
              />
            </label>
          </>
        )}

        <label>
          Department
          <input
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="e.g., CSE"
          />
        </label>

        <label>
          Semester
          <input
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            placeholder="e.g., 5"
          />
        </label>

        <div>
          <button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save and continue"}
          </button>
        </div>

        <div aria-live="polite" style={{ minHeight: 18 }}>
          {status && <span style={{ color: "#1a73e8" }}>{status}</span>}
          {error && <span style={{ color: "#d93025" }}>{error}</span>}
        </div>
      </form>
    </div>
  );
}
