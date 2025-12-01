import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/project"; 
const GALLERY_URL = "http://localhost:3000/api/v1/gallery"; // Gallery endpoints

export const getAllProjects = async () => {
  const token = sessionStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data; // because backend wraps inside { data: [...] }
};

export const createProject = async (formData: FormData) => {
  const token = sessionStorage.getItem("token");

  const response = await axios.post(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getProjectById = async (id: string) => {
  const token = sessionStorage.getItem("token");

  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

export const updateProject = async (id: string, formData: FormData) => {
  const token = sessionStorage.getItem("token");

  const response = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteProject = async (id: string) => {
  const token = sessionStorage.getItem("token");

  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// --- Gallery APIs ---
const getToken = () => sessionStorage.getItem("token");

// Upload multiple images to gallery
// ---------- UPLOAD NEW GALLERY IMAGES ----------
export const uploadGalleryImages = (formData: FormData, projectId: string) => {
  const token = sessionStorage.getItem("token");

  formData.append("projectId", projectId);

  return axios.post(GALLERY_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};


// Delete a gallery image by ID
export const removeGalleryImage = async (imageId: string) => {
  const token = getToken();
  const response = await axios.delete(`${GALLERY_URL}/${imageId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};