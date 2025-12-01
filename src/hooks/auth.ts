import { useState, useEffect } from 'react';
import { getProfile } from '../api/authApi';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const refreshProfile = async () => {
    if (!token) return;

    try {
      const userData = await getProfile(token);
      setUser(userData);
      sessionStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      console.error('Profile refresh failed:', err);
    }
  };

  return { user, setUser, token, setToken, refreshProfile, loading };
};
