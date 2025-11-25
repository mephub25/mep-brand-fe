// src/api/memberApi.ts
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/member";

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllMembers = async () => {
  const response = await axios.get(API_URL, {
    headers: {
      ...getAuthHeader(),
    },
  });
  return response.data.data;
};

export const getMemberById = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { ...getAuthHeader() },
  });
  return response.data.data;
};

export const createMember = async (formData: FormData) => {
  const response = await axios.post(API_URL, formData, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateMember = async (id: string, formData: FormData) => {
  const response = await axios.patch(`${API_URL}/${id}`, formData, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteMember = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { ...getAuthHeader() },
  });
  return response.data;
};
