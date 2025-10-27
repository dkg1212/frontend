/* eslint-disable react/prop-types */
/* eslint-disable no-empty */
// src/Dashboard.jsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const APP_NAME = 'Smart Attendence System'; // change this to your app name

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
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

  // One-time migration: if fields already complete, set profileComplete = true
  useEffect(() => {
    try {
      const raw = localStorage.getItem('user-info');
      if (!raw) return;
      const saved = JSON.parse(raw);
      const complete =
        !!saved?.profileComplete ||
        (!!saved?.role &&
          (saved.role !== 'student' || (saved?.rollNumber && saved?.deviceId)));
      if (complete && !saved?.profileComplete) {
        const merged = { ...saved, profileComplete: true };
        localStorage.setItem('user-info', JSON.stringify(merged));
        setUserInfo(merged);
      }
    } catch {}
  }, []);

  // Redirect guard prefers the profileComplete flag
  useEffect(() => {
    if (!userInfo) return;
    if (userInfo?.profileComplete) return;
    const needsProfile =
      !userInfo?.role ||
      (userInfo?.role === 'student' &&
        (!userInfo?.rollNumber || !userInfo?.deviceId));
    if (needsProfile) {
      navigate('/complete-profile', { replace: true });
    }
  }, [userInfo, navigate]);

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
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('user-info');
    navigate('/login');
  };

  const gotoProfile = () => {
    setMenuOpen(false);
    navigate('/profile');
  };

  const gotoUpdateProfile = () => {
    setMenuOpen(false);
    navigate('/complete-profile');
  };

  const Avatar = ({ size = 36 }) =>
    userInfo?.image ? (
      <img
        src={userInfo.image}
        alt={userInfo?.name || 'User'}
        width={size}
        height={size}
        style={{ borderRadius: '50%', objectFit: 'cover' }}
        referrerPolicy="no-referrer"
      />
    ) : (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: '#c5c5c5',
          color: '#222',
          display: 'grid',
          placeItems: 'center',
          fontWeight: 600,
          fontSize: 12,
          textTransform: 'uppercase',
        }}
        aria-label="Avatar"
      >
        {(userInfo?.name || 'U').slice(0, 1)}
      </div>
    );

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fb' }}>
      {/* Sticky Top Navbar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: '#ffffff',
          borderBottom: '1px solid #e9eef5',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontWeight: 800,
              fontSize: 20,
              color: '#1f1f1f',
              letterSpacing: 0.2,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#1a73e8',
                display: 'inline-block',
                boxShadow: '0 0 0 3px rgba(26,115,232,0.15)',
              }}
            />
            {APP_NAME}
          </div>

          <div style={{ position: 'relative' }}>
            <button
              ref={buttonRef}
              onClick={() => setMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={menuOpen ? 'true' : 'false'}
              title={userInfo?.name || 'Account'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '6px 10px',
                borderRadius: 999,
                border: '1px solid #e3e8ef',
                background: '#fff',
                cursor: 'pointer',
                boxShadow: menuOpen ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <Avatar size={30} />
              <span
                style={{
                  maxWidth: 200,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontSize: 14,
                  color: '#333',
                }}
              >
                {userInfo?.name || 'User'}
              </span>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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
                aria-label="Account menu"
                style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: 10,
                  minWidth: 240,
                  background: '#fff',
                  border: '1px solid #eaeef3',
                  borderRadius: 10,
                  boxShadow:
                    '0 18px 30px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.05)',
                  padding: 10,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: 10,
                    borderBottom: '1px solid #f2f4f7',
                  }}
                >
                  <Avatar size={34} />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: '#222',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 160,
                      }}
                      title={userInfo?.name}
                    >
                      {userInfo?.name || 'User'}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: '#666',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 200,
                      }}
                      title={userInfo?.email}
                    >
                      {userInfo?.email || ''}
                    </div>
                  </div>
                </div>

                <button
                  role="menuitem"
                  onClick={gotoProfile}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: 10,
                    borderRadius: 8,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#1f1f1f',
                  }}
                >
                  View profile
                </button>

                <button
                  role="menuitem"
                  onClick={gotoUpdateProfile}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: 10,
                    borderRadius: 8,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#1f1f1f',
                  }}
                >
                  Update profile
                </button>

                <button
                  role="menuitem"
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: 10,
                    borderRadius: 8,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#d93025',
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content: only welcome and app name */}
      <main
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '40px 24px',
        }}
      >
        <h1 style={{ margin: '8px 0 6px', fontSize: 32, color: '#0f172a' }}>
          Welcome {userInfo?.name}
        </h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: 16 }}> {APP_NAME} </p>
      </main>
    </div>
  );
};

export default Dashboard;
