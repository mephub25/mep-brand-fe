import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1/auth';

// ---------- LOGIN ----------
export const login = async (username: string, password: string) => {
  const res = await axios.post(`${API_URL}/login`, { username, password });
  return res.data; // contains token + user object
};

// ---------- GET PROFILE ----------
export const getProfile = async (token: string) => {
  const res = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;   // FIXED -> return only user object
};

// ---------- UPDATE PROFILE ----------
export const updateProfile = async (token: string, profileData: any) => {
  const res = await axios.patch(`${API_URL}/profile`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // includes message + data
};

// ---------- CHANGE PASSWORD ----------
export const changePassword = async (token: string, oldPwd: string, newPwd: string) => {
  const res = await axios.patch(
    `${API_URL}/change-password`,
    { oldPwd, newPwd },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// ---------- LOGOUT ----------
export const logout = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
};
