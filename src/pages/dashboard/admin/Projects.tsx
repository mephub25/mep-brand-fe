"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../components/admin/AdminLayout";
import { getAllProjects, deleteProject } from "../../../api/projectApi";

const ViewProjects = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProject(id);
      loadProjects(); // refresh list
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/admin/projects/create")}
        >
          + Add New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <div
              key={project._id}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-40 object-cover rounded"
              />

              <h2 className="text-xl font-semibold mt-3">{project.name}</h2>
              <p className="text-gray-600">📍 {project.location}</p>
              <p className="text-gray-500 text-sm">
                Owner: {project.projectOwner}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() =>
                    navigate(`/admin/projects/edit/${project._id}`)
                  }
                >
                  Edit
                </button>

                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(project._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default ViewProjects;
