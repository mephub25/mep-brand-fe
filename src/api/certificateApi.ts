import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/certificate";

export const createCertificate = async (formData: FormData) => {
  const token = sessionStorage.getItem("token");

  return axios.post(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getCertificates = async () => {
  return axios.get(API_URL);
};

export const getCertificate = async (id: string) => {
  return axios.get(`${API_URL}/${id}`);
};

export const updateCertificate = async (id: string, formData: FormData) => {
  const token = sessionStorage.getItem("token");

  return axios.patch(`${API_URL}/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteCertificate = async (id: string) => {
  const token = sessionStorage.getItem("token");

  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
