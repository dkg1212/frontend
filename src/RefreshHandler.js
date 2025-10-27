// src/RefreshHandler.js
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
function RefreshHandler({ setIsAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const data = localStorage.getItem('user-info');
      const token = data ? JSON.parse(data)?.token : null;

      if (token) {
        setIsAuthenticated(true);
        if (location.pathname === '/' || location.pathname === '/login') {
          navigate('/dashboard', { replace: false });
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  }, [location, navigate, setIsAuthenticated]);

  return null;
}

export default RefreshHandler;
