/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
// src/Dashboard.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const APP_NAME = "Smart Attendance System";

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  // Load user info
  useEffect(() => {
    try {
      const data = localStorage.getItem("user-info");
      const userData = data ? JSON.parse(data) : null;
      setUserInfo(userData);
    } catch {
      setUserInfo(null);
    }
  }, []);

  // Auto-mark profileComplete if already satisfied
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user-info");
      if (!raw) return;
      const saved = JSON.parse(raw);
      const complete =
        !!saved?.profileComplete ||
        (!!saved?.role &&
          (saved.role !== "student" ||
            (saved?.rollNumber && saved?.deviceId)));

      if (complete && !saved?.profileComplete) {
        const merged = { ...saved, profileComplete: true };
        localStorage.setItem("user-info", JSON.stringify(merged));
        setUserInfo(merged);
      }
    } catch {}
  }, []);

  // Redirect if incomplete profile
  useEffect(() => {
    if (!userInfo) return;
    if (userInfo?.profileComplete) return;

    const needsProfile =
      !userInfo?.role ||
      (userInfo?.role === "student" &&
        (!userInfo?.rollNumber || !userInfo?.deviceId));

    if (needsProfile) {
      navigate("/complete-profile", { replace: true });
    }
  }, [userInfo, navigate]);

  // Close menu when clicking outside
  useEffect(() => {
    const onClick = (e) => {
      if (!menuOpen) return;
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user-info");
    navigate("/login");
  };

  const gotoProfile = () => {
    setMenuOpen(false);
    navigate("/profile");
  };

  const gotoUpdateProfile = () => {
    setMenuOpen(false);
    navigate("/complete-profile");
  };

  const Avatar = ({ size = 36 }) =>
    userInfo?.image ? (
      <img
        src={userInfo.image}
        alt={userInfo?.name || "User"}
        width={size}
        height={size}
        className="rounded-full object-cover"
        referrerPolicy="no-referrer"
      />
    ) : (
      <div
        className="grid place-items-center font-semibold uppercase bg-gray-300 text-gray-800 rounded-full"
        style={{ width: size, height: size, fontSize: 12 }}
      >
        {(userInfo?.name || "U").slice(0, 1)}
      </div>
    );

  return (
    <div className="min-h-screen bg-(var(--app-bg))">

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-(var(--card-border))">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3 font-extrabold text-[20px] text-gray-900 tracking-wide">
            <span
              className="w-3 h-3 rounded-full bg-(var(--accent)) inline-block shadow-[0_0_0_3px_rgba(26,115,232,0.15)]"
            />
            {APP_NAME}
          </div>

          {/* Menu Button */}
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-300 bg-white shadow-sm hover:bg-gray-50 transition-all"
            >
              <Avatar size={30} />

              <span className="max-w-[200px] truncate text-sm text-gray-700">
                {userInfo?.name || "User"}
              </span>

              <svg width="16" height="16" viewBox="0 0 20 20">
                <path
                  d="M5 7l5 6 5-6"
                  stroke="#555"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {menuOpen && (
              <div
                ref={menuRef}
                role="menu"
                className="absolute right-0 mt-3 w-60 bg-white shadow-xl rounded-xl border border-gray-200 p-3 z-50"
              >
                {/* User info */}
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-2">
                  <Avatar size={34} />
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 text-sm truncate">
                      {userInfo?.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {userInfo?.email}
                    </div>
                  </div>
                </div>

                <button onClick={gotoProfile} className="w-full text-left px-2 py-2 rounded-md text-gray-800 hover:bg-gray-100">
                  View profile
                </button>

                <button onClick={gotoUpdateProfile} className="w-full text-left px-2 py-2 rounded-md text-gray-800 hover:bg-gray-100">
                  Update profile
                </button>

                {/* Show QR only if a session exists */}
                {sessionId && (
                  <button
                    onClick={() => navigate(`/session/${sessionId}/qr`)}
                    className="w-full text-left px-2 py-2 rounded-md text-blue-600 hover:bg-blue-50"
                  >
                    Show QR
                  </button>
                )}

                {/* ⭐ NEW — REPORTS SHORTCUTS */}
                <div className="mt-3 border-t border-gray-200 pt-2">
                  <p className="text-xs text-gray-500 mb-1">Reports</p>

                  <button
                    onClick={() => navigate("/reports/student/monthly")}
                    className="w-full text-left px-2 py-2 rounded-md text-gray-800 hover:bg-gray-100"
                  >
                    Student Monthly Report
                  </button>

                  <button
                    onClick={() => navigate("/reports/course-wise")}
                    className="w-full text-left px-2 py-2 rounded-md text-gray-800 hover:bg-gray-100"
                  >
                    Course-wise Report
                  </button>

                  <button
                    onClick={() => navigate("/reports/student/course")}
                    className="w-full text-left px-2 py-2 rounded-md text-gray-800 hover:bg-gray-100"
                  >
                    Student Course Report
                  </button>

                  <button
                    onClick={() => navigate("/reports/student/semester")}
                    className="w-full text-left px-2 py-2 rounded-md text-gray-800 hover:bg-gray-100"
                  >
                    Semester Report
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-2 py-2 rounded-md text-red-600 hover:bg-red-50 mt-2"
                >
                  Logout
                </button>

              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-6 pt-10">
        <h1 className="text-3xl font-semibold text-gray-900 mb-1">
          Welcome {userInfo?.name}
        </h1>
        <p className="text-gray-500 text-lg">{APP_NAME}</p>

        {/* Start a session */}
        <button
          onClick={() => navigate("/create-session")}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Start New Session
        </button>

        {/* ⭐ NEW — Report Shortcuts */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">

          <button
            onClick={() => navigate("/reports/student/monthly")}
            className="p-4 bg-white border rounded-lg shadow hover:bg-gray-50 text-left"
          >
            <h3 className="font-bold text-gray-800">Student Monthly Report</h3>
            <p className="text-gray-500 text-sm">View attendance by month.</p>
          </button>

          <button
            onClick={() => navigate("/reports/course-wise")}
            className="p-4 bg-white border rounded-lg shadow hover:bg-gray-50 text-left"
          >
            <h3 className="font-bold text-gray-800">Course-wise Report</h3>
            <p className="text-gray-500 text-sm">Report per course.</p>
          </button>

          <button
            onClick={() => navigate("/reports/student/course")}
            className="p-4 bg-white border rounded-lg shadow hover:bg-gray-50 text-left"
          >
            <h3 className="font-bold text-gray-800">Student Course Report</h3>
            <p className="text-gray-500 text-sm">Student-specific course stats.</p>
          </button>

          <button
            onClick={() => navigate("/reports/student/semester")}
            className="p-4 bg-white border rounded-lg shadow hover:bg-gray-50 text-left"
          >
            <h3 className="font-bold text-gray-800">Semester Report</h3>
            <p className="text-gray-500 text-sm">Course stats for semester.</p>
          </button>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
