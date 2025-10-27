// src/GoogleLogin.jsx
import { useState, useMemo } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "./api";
import { useNavigate } from "react-router-dom";

const GoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleBackendExchange = async (code) => {
    setLoading(true);
    setErrorMsg("");
    setStatusMsg("Signing you in…");
    try {
      const result = await googleAuth(code);
      const { email, name, image } = result.data.user;
      const token = result.data.token;
      const obj = { email, name, token, image };
      localStorage.setItem("user-info", JSON.stringify(obj));
      setStatusMsg("Success! Redirecting…");
      navigate("/dashboard");
    } catch (e) {
      setErrorMsg("Could not complete sign-in. Please try again.");
      console.error("Error while Google Login...", e);
    } finally {
      setLoading(false);
    }
  };

  const loginHandlers = useMemo(
    () => ({
      onSuccess: async (authResult) => {
        // For auth-code flow, the response carries a `code` to exchange on your backend.
        if (authResult?.code) {
          await handleBackendExchange(authResult.code);
        } else {
          setErrorMsg("No authorization code returned. Please try again.");
          console.error("Google Auth Error:", authResult);
        }
      },
      onError: (err) => {
        // OAuth error from Google
        const detail = err?.error_description || err?.error || "Login failed.";
        setErrorMsg(detail);
      },
      onNonOAuthError: (nonOAuthErr) => {
        // Popup closed/failed etc.
        if (nonOAuthErr?.type === "popup_closed") {
          setErrorMsg("Sign-in canceled before completion.");
        } else if (nonOAuthErr?.type === "popup_failed_to_open") {
          setErrorMsg("Couldn’t open Google sign-in window. Check pop-up blockers.");
        } else {
          setErrorMsg("Unexpected issue starting Google sign-in.");
        }
      },
      flow: "auth-code",
      // You can also add `prompt: 'select_account'` for account picker in implicit flow;
      // in auth-code flow, selection happens during consent.
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const googleLogin = useGoogleLogin(loginHandlers);

  return (
    <div style={{ maxWidth: 360 }}>
      <button
        onClick={() => {
          setErrorMsg("");
          setStatusMsg("");
          googleLogin();
        }}
        disabled={loading}
        title="Sign in securely with your Google account"
        aria-busy={loading ? "true" : "false"}
        aria-describedby="google-login-help"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
          borderRadius: 8,
          border: "1px solid #dadce0",
          background: loading ? "#f1f3f4" : "#fff",
          color: "#1f1f1f",
          cursor: loading ? "not-allowed" : "pointer",
          minWidth: 240,
        }}
      >
        {loading ? (
          <>
            <span
              className="spinner"
              aria-hidden="true"
              style={{
                width: 16,
                height: 16,
                border: "2px solid #999",
                borderTopColor: "transparent",
                borderRadius: "50%",
                display: "inline-block",
                animation: "spin 0.8s linear infinite",
              }}
            />
            Signing in…
          </>
        ) : (
          <>
            {/* Google “G” icon (SVG) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303C33.884 31.668 29.351 35 24 35c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.755 5.077 29.652 3 24 3 12.955 3 4 11.955 4 23s8.955 20 20 20 19-9 19-20c0-1.341-.138-2.651-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.815C14.297 16.31 18.74 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.755 5.077 29.652 3 24 3 16.318 3 9.656 7.337 6.306 14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24 43c5.268 0 10.098-2.017 13.71-5.29l-6.324-5.353C29.351 35 24.818 31.668 24 31.668c-5.091 0-9.41-3.43-10.957-8.088H6.29l-6.28 4.853C3.343 40.658 12.318 43 24 43z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303c-1.333 3.74-4.879 6.417-9.303 6.417 0 0 .001 0 0 0 0 0 0 0 0 0 5.269 0 9.8-3.333 11.313-8h0c.39-1.166.6-2.41.6-3.74 0-1.28-.146-2.518-.399-3.594z"
              />
            </svg>
            Continue with Google
          </>
        )}
      </button>

      <div
        id="google-login-help"
        style={{ fontSize: 12, color: "#5f6368", marginTop: 8 }}
      >
        We’ll never post without your permission, and you can change accounts during sign‑in. [web:13][web:16]
      </div>

      {/* Live status for screen readers and visible feedback */}
      <div
        aria-live="polite"
        style={{ minHeight: 20, marginTop: 8, fontSize: 13 }}
      >
        {statusMsg && <span style={{ color: "#1a73e8" }}>{statusMsg}</span>}
        {errorMsg && <span style={{ color: "#d93025" }}>{errorMsg}</span>}
      </div>

      <style>
        {`
          @keyframes spin { to { transform: rotate(360deg); } }
          button:focus { outline: 3px solid #1a73e8; outline-offset: 2px; }
          button:hover:not([disabled]) { background: #f8f9fa; }
        `}
      </style>
    </div>
  );
};

export default GoogleLogin;
