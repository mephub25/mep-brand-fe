// pages/dashboard/admin/team/EditTeam.tsx
"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";
import { getMemberById, updateMember } from "../../../api/memberApi";

export default function EditTeam() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [names, setNames] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [order, setOrder] = useState<number | "">("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadMember();
  }, [id]);

  const loadMember = async () => {
    try {
      const data = await getMemberById(id!);
      setNames(data.names || "");
      setPhone(data.phone || "");
      setRole(data.role || "");
      setOrder(data.order ?? "");
      setPreview(data.image || null);
    } catch (err) {
      console.error("Failed to load member", err);
      alert("Failed to load member data");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!names.trim()) {
      alert("Please provide member names");
      return;
    }

    const formData = new FormData();
    formData.append("names", names);
    if (phone) formData.append("phone", phone);
    if (role) formData.append("role", role);
    if (order !== "") formData.append("order", String(order));
    if (imageFile) formData.append("image", imageFile);

    try {
      setLoading(true);
      await updateMember(id!, formData);
      navigate("/admin/team");
    } catch (err: any) {
      console.error("Update member error:", err);
      alert(err?.response?.data?.message || "Failed to update member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Edit Member</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Names *</label>
            <input
              type="text"
              value={names}
              onChange={(e) => setNames(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Order (position)</label>
            <input
              type="number"
              min={1}
              value={order}
              onChange={(e) =>
                setOrder(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Image</label>
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-32 h-32 object-cover rounded mb-2"
              />
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to keep existing image.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/team")}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
