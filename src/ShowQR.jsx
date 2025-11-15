/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function ShowQR({ sessionId, token }) {
  const [qr, setQr] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const loadQR = async () => {
    const res = await axios.get(`${API_BASE}/session/${sessionId}/qr`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const expiry = new Date(res.data.expiresAt).getTime();
    const now = Date.now();

    setQr(res.data.qrToken);
    setExpiresAt(res.data.expiresAt);
    setSecondsLeft(Math.floor((expiry - now) / 1000));
  };

  const refreshQR = async () => {
    const res = await axios.post(
      `${API_BASE}/session/${sessionId}/refresh`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const expiry = new Date(res.data.expiresAt).getTime();
    const now = Date.now();

    setQr(res.data.qrToken);
    setExpiresAt(res.data.expiresAt);
    setSecondsLeft(Math.floor((expiry - now) / 1000));
  };

  useEffect(() => {
    loadQR();
  }, []);

  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const expiry = new Date(expiresAt).getTime();
      const now = Date.now();
      const left = Math.max(0, Math.floor((expiry - now) / 1000));
      setSecondsLeft(left);

      if (left === 0) refreshQR();
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!qr) return <div className="text-center mt-6">Loading QR…</div>;

  return (
    <div className="flex flex-col items-center p-6 gap-4">
      <QRCodeSVG value={qr} size={220} />

      <div className="text-gray-600 text-sm">
        Expires in:{" "}
        <span className="text-red-600 font-semibold">{secondsLeft}s</span>
      </div>

      <div className="text-xs text-gray-400 break-all mt-3">
        Token: {qr}
      </div>
    </div>
  );
}
