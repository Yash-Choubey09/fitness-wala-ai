import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API = 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser]               = useState(null);
  const [isAuthenticated, setIsAuth]  = useState(false);
  const [loading, setLoading]         = useState(true);

  // ----- Restore session from localStorage on app load -----
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }

    fetch(`${API}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) { setUser(data); setIsAuth(true); }
        else { localStorage.removeItem('token'); localStorage.removeItem('userId'); }
      })
      .catch(() => { localStorage.removeItem('token'); localStorage.removeItem('userId'); })
      .finally(() => setLoading(false));
  }, []);

  // ----- Called after successful login/signup -----
  const login = useCallback(({ token, user: userData }) => {
    localStorage.setItem('token', token);
    if (userData?._id) localStorage.setItem('userId', userData._id);
    setUser(userData);
    setIsAuth(true);
  }, []);

  // ----- Logout -----
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
    setIsAuth(false);
  }, []);

  // ----- Refresh user data from backend (e.g. after profile update) -----
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  }, []);

  // ----- Update profile (PATCH-like) -----
  const updateProfile = useCallback(async (fields) => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const res = await fetch(`${API}/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(fields)
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        return updatedUser;
      }
    } catch (err) {
      console.error('Profile update failed:', err);
    }
    return null;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, refreshUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
