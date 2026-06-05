import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : '/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  
  // Toast notifications state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Helper for API fetch calls with token header
  const apiFetch = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (err) {
      throw err;
    }
  };

  // Load user session on mount/token change
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        setProfile(null);
        setNotifications([]);
        setLoading(false);
        return;
      }

      try {
        const data = await apiFetch('/auth/me');
        if (data.success) {
          setUser(data.user);
          setProfile(data.profile);
          
          // Fetch notifications for candidate
          if (data.user.role === 'candidate') {
            const notifData = await apiFetch('/notifications');
            if (notifData.success) {
              setNotifications(notifData.notifications);
            }
          }
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.error('Error loading session:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (name, email, password, role) => {
    setLoading(true);
    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      });

      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        setProfile(data.profile);
        showToast('Account registered successfully!', 'success');
        return data;
      }
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        setProfile(data.profile);
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        return data;
      }
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setProfile(null);
    showToast('Logged out successfully', 'info');
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const data = await apiFetch('/profiles', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      if (data.success) {
        setProfile(data.profile);
        setUser(data.user);
        showToast('Profile updated successfully!', 'success');
        return data;
      }
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const data = await apiFetch('/notifications');
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      const data = await apiFetch(`/notifications/${id}/read`, {
        method: 'PUT',
      });
      if (data.success) {
        setNotifications(prev =>
          prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const data = await apiFetch('/notifications', {
        method: 'DELETE',
      });
      if (data.success) {
        setNotifications([]);
        showToast('All notifications cleared', 'success');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        toast,
        showToast,
        register,
        login,
        logout,
        updateProfile,
        apiFetch,
        notifications,
        fetchNotifications,
        markNotificationAsRead,
        clearAllNotifications,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
