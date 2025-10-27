import './App.css';
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from './GoogleLogin';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import { useState } from 'react';
import RefreshHandler from './RefreshHandler';
import NotFound from './NotFound';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const GoogleWrapper = () => (
    <GoogleOAuthProvider clientId="924470151805-40go9narrc79c8ni8b0thjnl38vgvt1t.apps.googleusercontent.com">
      <GoogleLogin />
    </GoogleOAuthProvider>
  );

  // eslint-disable-next-line react/prop-types
  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/login" element={<GoogleWrapper />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
