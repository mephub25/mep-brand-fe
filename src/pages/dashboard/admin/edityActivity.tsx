"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../../components/admin/AdminLayout";
import { getActivity, updateActivity } from "../../../api/activityApi";

export default function EditActivity() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (!id) return;
  getActivity(id)
    .then((activity) => {
      if (!activity) return;
      setName(activity.name);
      setAlias(activity.alias || "");
      setCurrentImage(activity.image || null);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to fetch activity:", err);
      setLoading(false);
    });
}, [id]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const formData = new FormData();
    formData.append("name", name);
    if (alias) formData.append("alias", alias);
    if (image) formData.append("image", image); // optional new image

    await updateActivity(id, formData);
    navigate("/admin/activities");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 text-center">Loading activity...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-lg mx-auto bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4">Edit Activity</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Name</label>
            <input
              type="text"
              required
              className="w-full bg-white border px-3 py-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Alias</label>
            <input
              type="text"
              className="w-full bg-white border px-3 py-2 rounded"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Current Image</label>
            {currentImage ? (
              <img src={currentImage} alt={name} className="h-32 mb-2" />
            ) : (
              <div className="text-gray-500 mb-2">No image uploaded</div>
            )}
            <input
              type="file"
              accept="image/*"
              className="w-full"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>

          <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
            Update Activity
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
