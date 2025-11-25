"use client";

import { useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { createActivity } from "../../../api/activityApi";

export default function CreateActivity() {
  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload an image for the activity.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    if (alias) formData.append("alias", alias);
    formData.append("image", image);

    try {
      await createActivity(formData);
      alert("Activity created successfully!");
      setName("");
      setAlias("");
      setImage(null);
    } catch (error: any) {
      console.error("Error creating activity:", error.response?.data || error.message);
      alert("Failed to create activity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-md mx-auto bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4">Create Activity</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Activity Name</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Alias (optional)</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
          >
            {loading ? "Creating..." : "Create Activity"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
