"use client";

import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useState, useEffect } from "react";
import { createProject } from "../../../api/projectApi";
import { getAllActivities } from "../../../api/activityApi";

interface ActivityOption {
  _id: string;
  name: string;
}

export default function CreateProject() {
  const navigate = useNavigate();

  // Project form state
  const [name, setName] = useState("");
  const [projectOwner, setProjectOwner] = useState("");
  const [projectOwnerContact, setProjectOwnerContact] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);

  // Activities
  const [availableActivities, setAvailableActivities] = useState<ActivityOption[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  // Fetch activities on mount
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getAllActivities();
        setAvailableActivities(data);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      }
    };
    fetchActivities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("projectOwner", projectOwner);
    if (projectOwnerContact) formData.append("projectOwnerContact", projectOwnerContact);
    formData.append("startDate", startDate);
    if (endDate) formData.append("endDate", endDate);
    formData.append("location", location);

    if (image) formData.append("image", image);

    gallery.forEach((file) => formData.append("gallery", file));

    // Append selected activities as ObjectIds
    selectedActivities.forEach((id) => formData.append("activities", id));

    try {
      await createProject(formData);
      navigate("/admin/projects");
    } catch (error: any) {
      console.error("Create project error:", error.response?.data || error.message);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4">Create Project</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-1 font-semibold">Project Name</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Project Owner */}
          <div>
            <label className="block mb-1 font-semibold">Project Owner</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              required
              value={projectOwner}
              onChange={(e) => setProjectOwner(e.target.value)}
            />
          </div>

          {/* Project Owner Contact */}
          <div>
            <label className="block mb-1 font-semibold">Project Owner Contact</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={projectOwnerContact}
              onChange={(e) => setProjectOwnerContact(e.target.value)}
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block mb-1 font-semibold">Start Date</label>
            <input
              type="date"
              className="w-full border px-3 py-2 rounded"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block mb-1 font-semibold">End Date</label>
            <input
              type="date"
              className="w-full border px-3 py-2 rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block mb-1 font-semibold">Location</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Main Image */}
          <div>
            <label className="block mb-1 font-semibold">Project Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>

          {/* Gallery Images */}
          <div>
            <label className="block mb-1 font-semibold">Gallery Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="w-full"
              onChange={(e) => setGallery(Array.from(e.target.files || []))}
            />
          </div>

          {/* Activities */}
          <div>
            <label className="block mb-1 font-semibold">Activities</label>
            <select
              multiple
              value={selectedActivities}
              onChange={(e) => {
                const options = Array.from(e.target.selectedOptions, (option) => option.value);
                setSelectedActivities(options);
              }}
              className="w-full border px-3 py-2 rounded"
            >
              {availableActivities.map((act) => (
                <option key={act._id} value={act._id}>
                  {act.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Save Project
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
