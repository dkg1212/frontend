// src/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const data = localStorage.getItem('user-info');
      const userData = data ? JSON.parse(data) : null;
      setUserInfo(userData);
    } catch {
      setUserInfo(null);
    }
  }, []);

  // NEW: redirect if profile incomplete
  useEffect(() => {
    if (!userInfo) return;
    const needsProfile =
      !userInfo?.role ||
      (userInfo?.role === 'student' &&
        (!userInfo?.rollNumber || !userInfo?.deviceId));
    if (needsProfile) {
      navigate('/complete-profile', { replace: true });
    }
  }, [userInfo, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user-info');
    navigate('/login');
  };

  const Avatar = () =>
    userInfo?.image ? (
      <img
        src={userInfo.image}
        alt={userInfo?.name || 'User'}
        width={64}
        height={64}
        style={{ borderRadius: '50%' }}
        referrerPolicy="no-referrer"
      />
    ) : (
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: '#ccc',
        }}
        aria-label="Avatar"
      />
    );

  return (
    <div style={{ padding: 32 }}>
      <h1>Welcome {userInfo?.name}</h1>
      <p>{userInfo?.email}</p>
      <Avatar />
      <div style={{ marginTop: 16 }}>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
