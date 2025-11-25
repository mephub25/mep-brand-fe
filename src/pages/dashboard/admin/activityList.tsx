"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { getAllActivities, deleteActivity } from "../../../api/activityApi";
import { useNavigate } from "react-router-dom";

export default function ActivitiesList() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<any[]>([]);

  const fetchActivities = async () => {
    const data = await getAllActivities();
    setActivities(data);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;
    await deleteActivity(id);
    fetchActivities();
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Activities</h1>
        <button
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => navigate("/admin/activities/create")}
        >
          Create Activity
        </button>
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Alias</th>
              <th className="border px-3 py-2">Image</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((a) => (
              <tr key={a._id}>
                <td className="border px-3 py-2">{a.name}</td>
                <td className="border px-3 py-2">{a.alias || "-"}</td>
                <td className="border px-3 py-2">
                  <img src={a.image} alt={a.name} className="h-16" />
                </td>
                <td className="border px-3 py-2 space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => navigate(`/admin/activities/edit/${a._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(a._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
