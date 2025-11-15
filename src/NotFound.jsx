// src/NotFound.jsx
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-gray-800">404</h1>
      <p className="text-gray-500 text-lg mt-2">Page Not Found</p>

      <button
        onClick={() => navigate("/")}
        className="mt-6 px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
      >
        Go to Login
      </button>
    </div>
  );
}
