/* eslint-disable react/prop-types */
// src/App.jsx
import './App.css';
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from './GoogleLogin';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import { useState } from 'react';
import RefreshHandler from './RefreshHandler';
import NotFound from './NotFound';
import CompleteProfile from './completeprofile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  // Simple private route guard using local state set by RefreshHandler
  const PrivateRoute = ({ element }) => (
    isAuthenticated ? element : <Navigate to="/login" replace />
  );

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<GoogleLogin />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
