"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById, updateProject } from "../../../api/projectApi";
import AdminLayout from "../../../components/admin/AdminLayout";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<any>({
    name: "",
    location: "",
    projectOwner: "",
    projectOwnerContact: "",
    startDate: "",
    endDate: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadProject();
  }, []);

  const loadProject = async () => {
    const project = await getProjectById(id!);

    setForm({
      name: project.name,
      location: project.location,
      projectOwner: project.projectOwner,
      projectOwnerContact: project.projectOwnerContact,
      startDate: project.startDate?.slice(0, 10),
      endDate: project.endDate?.slice(0, 10),
    });

    setImagePreview(project.image);
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value as any);
    });

    if (imageFile) {
      formData.append("image", imageFile);
    }

    await updateProject(id!, formData);
    navigate("/admin/projects");
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-lg">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
          placeholder="Project Name"
        />

        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          className="border p-2 rounded"
          placeholder="Location"
        />

        <input
          type="text"
          name="projectOwner"
          value={form.projectOwner}
          onChange={handleChange}
          className="border p-2 rounded"
          placeholder="Project Owner"
        />

        <input
          type="text"
          name="projectOwnerContact"
          value={form.projectOwnerContact}
          onChange={handleChange}
          className="border p-2 rounded"
          placeholder="Owner Contact"
        />

        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* Image Upload */}
        <div>
          {imagePreview && (
            <img src={imagePreview} className="w-40 h-40 object-cover rounded mb-2" />
          )}
          <input type="file" onChange={handleFileChange} />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Update Project
        </button>
      </form>
    </AdminLayout>
  );
};

export default EditProject;
