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
    if (user.role === "student")
      return Boolean(user?.rollNumber && user?.deviceId);
    return true;
  }, [user]);

  useEffect(() => {
    if (isProfileComplete) navigate("/dashboard", { replace: true });
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
                (rollNumber || user.rollNumber) &&
                  (deviceId || user.deviceId)
              ),
      };

      localStorage.setItem("user-info", JSON.stringify(merged));

      setStatus("Profile updated.");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update profile.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!user || isProfileComplete) return null;

  return (
    <div className="max-w-lg mx-auto mt-10 p-4">
      <h2 className="text-2xl font-semibold mb-1">Complete your profile</h2>
      <p className="text-gray-600 mb-6">
        Signed in as {user?.email || "unknown"}.
      </p>

      <form onSubmit={handleSubmit} className="grid gap-4">
        {/* Role */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">Role</span>
          <select
            className="border rounded-md px-3 py-2 bg-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        {/* Student fields */}
        {isStudent && (
          <>
            <label className="flex flex-col gap-1">
              <span className="font-medium">Roll Number</span>
              <input
                className="border rounded-md px-3 py-2"
                value={rollNumber}
                onChange={(e) =>
                  setRollNumber(e.target.value.toUpperCase().trim())
                }
                placeholder="e.g., CSE-2025-001"
                required
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-medium">Device ID</span>
              <input
                className="border rounded-md px-3 py-2"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value.trim())}
                placeholder="Device identifier"
                required
              />
            </label>
          </>
        )}

        {/* Department */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">Department</span>
          <input
            className="border rounded-md px-3 py-2"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="e.g., CSE"
          />
        </label>

        {/* Semester */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">Semester</span>
          <input
            className="border rounded-md px-3 py-2"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            placeholder="e.g., 5"
          />
        </label>

        {/* Save button */}
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save and continue"}
        </button>

        {/* Status & Error */}
        <div aria-live="polite" className="min-h-[18px] text-sm">
          {status && <span className="text-blue-600">{status}</span>}
          {error && <span className="text-red-600">{error}</span>}
        </div>
      </form>
    </div>
  );
}
