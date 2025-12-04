// src/api/testimonialApi.ts
import axios from "axios";

const API_URL = "https://be.meperictrictech.com/api/v1/testimonial";

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getTestimonials = async () => {
  const res = await axios.get(API_URL, { headers: { ...getAuthHeader() } });
  return res.data; // backend wraps { statusCode, message, data }
};

export const getTestimonial = async (id: string) => {
  const res = await axios.get(`${API_URL}/${id}`, { headers: { ...getAuthHeader() } });
  return res.data;
};

export const createTestimonial = async (formData: FormData) => {
  const res = await axios.post(API_URL, formData, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateTestimonial = async (id: string, formData: FormData) => {
  const res = await axios.patch(`${API_URL}/${id}`, formData, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteTestimonial = async (id: string) => {
  const res = await axios.delete(`${API_URL}/${id}`, { headers: { ...getAuthHeader() } });
  return res.data;
};