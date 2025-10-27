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
        profileComplete, // persisted flag ensures no re-prompt after re-login
        token,
      };
      localStorage.setItem("user-info", JSON.stringify(obj));

      setStatusMsg("Success! Redirecting…");
      navigate("/dashboard");
    } catch (e) {
      setErrorMsg("Could not complete sign-in. Please try again.");
      // eslint-disable-next-line no-console
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
          (err?.type === "popup_closed" ? "Sign-in canceled before completion." : "Login failed.");
        setErrorMsg(detail);
      },
      flow: "auth-code",
    }),
    []
  );

  const googleLogin = useGoogleLogin(loginHandlers);

return (
  <div style={{
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: 24,
  }}>
    <div style={{
      width: '100%',
      maxWidth: 420,
      background: '#fff',
      border: '1px solid #e9eef5',
      borderRadius: 12,
      padding: 20,
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#1a73e8', display: 'inline-block' }} />
        <strong style={{ fontSize: 18 }}>Smart Attendence System</strong>
      </div>

      <h1 style={{ fontSize: 22, margin: '8px 0 12px' }}>Sign in</h1>

      <button
        onClick={() => { setErrorMsg(''); setStatusMsg(''); googleLogin(); }}
        disabled={loading}
        aria-busy={loading ? 'true' : 'false'}
        style={{ width: '100%' }}
      >
        {loading ? 'Signing in…' : 'Continue with Google'}
      </button>

      <p style={{ fontSize: 12, color: '#5f6368', marginTop: 10 }}>
        You can change accounts during sign‑in, and nothing is posted without permission.
      </p>

      <div aria-live="polite" style={{ minHeight: 18, marginTop: 8, fontSize: 13 }}>
        {statusMsg && <span style={{ color: '#1a73e8' }}>{statusMsg}</span>}
        {errorMsg && <span style={{ color: '#d93025' }}>{errorMsg}</span>}
      </div>
    </div>
  </div>
);

};

export default GoogleLogin;
