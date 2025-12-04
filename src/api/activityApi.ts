import axios from "axios";

const API_URL = "https://be.meperictrictech.com/api/v1/activity";


// Fetch all activities
export const getAllActivities = async () => {
 const token = sessionStorage.getItem("token");
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data; // array of activities
};

export const getActivity = async (id: string) => {
    const token = sessionStorage.getItem("token");
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; 
};

// Create a new activity
export const createActivity = async (formData: FormData) => {
const token = sessionStorage.getItem("token");
  const response = await axios.post(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};


export const deleteActivity = async (id: string) => {
  const token = sessionStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data; // usually backend returns success message or deleted object
};


export const updateActivity = async (id: string, formData: FormData) => {
  const token = sessionStorage.getItem("token"); // <-- read here
  if (!token) throw new Error("User not authenticated");

  const response = await axios.patch(`${API_URL}/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
};
