/* eslint-disable react-hooks/exhaustive-deps */
// src/GoogleLogin.jsx
import { useMemo, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "./api";
import { useNavigate } from "react-router-dom";

const GoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleBackendExchange = async (code, extras = {}) => {
    setLoading(true);
    setErrorMsg("");
    setStatusMsg("Signing you in…");
    try {
      const result = await googleAuth(code, extras);
      const {
        name,
        email,
        image,
        role,
        rollNumber,
        deviceId,
        department,
        semester,
        profileComplete,
      } = result.data.user;
      const token = result.data.token;

      const obj = {
        name,
        email,
        image,
        role,
        rollNumber,
        deviceId,
        department,
        semester,
        profileComplete,
        token,
      };
      localStorage.setItem("user-info", JSON.stringify(obj));

      setStatusMsg("Success! Redirecting…");
      navigate("/dashboard");
    } catch (e) {
      setErrorMsg("Could not complete sign-in. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loginHandlers = useMemo(
    () => ({
      onSuccess: async (authResult) => {
        const code = authResult?.code;
        if (!code) {
          setErrorMsg("No authorization code returned. Please try again.");
          return;
        }
        await handleBackendExchange(code);
      },
      onError: (err) => {
        const detail =
          err?.error_description ||
          err?.error ||
          (err?.type === "popup_closed"
            ? "Sign-in canceled before completion."
            : "Login failed.");
        setErrorMsg(detail);
      },
      flow: "auth-code",
    }),
    []
  );

  const googleLogin = useGoogleLogin(loginHandlers);

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-(var(--app-bg))">
  <div className="w-full max-w-sm bg-white border border-(var(--card-border)) rounded-xl p-6 shadow-lg">
    
    <div className="flex items-center gap-3 mb-4">
      <span className="w-3 h-3 rounded-full bg-(var(--accent)) inline-block" />
      <strong className="text-lg">Smart Attendance System</strong>
    </div>

    <h1 className="text-2xl font-semibold mb-4">Sign in</h1>

    <button
      onClick={() => {
        setErrorMsg("");
        setStatusMsg("");
        googleLogin();
      }}
      disabled={loading}
      aria-busy={loading ? "true" : "false"}
      className="w-full py-2 text-sm font-semibold border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"
    >
      {loading ? "Signing in…" : "Continue with Google"}
    </button>

    <p className="text-xs text-(var(--muted)) mt-3">
      You can change accounts during sign-in, and nothing is posted without permission.
    </p>

    <div aria-live="polite" className="min-h-[18px] mt-3 text-sm">
      {statusMsg && <span className="text-(var(--accent))">{statusMsg}</span>}
      {errorMsg && <span className="text-red-600">{errorMsg}</span>}
    </div>
  </div>
</div>

  );
};

export default GoogleLogin;
