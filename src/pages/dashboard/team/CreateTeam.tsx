"use client";

import React, { useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useNavigate } from "react-router-dom";
import { createMember } from "../../../api/memberApi";

export default function CreateTeam() {
  const navigate = useNavigate();

  // Form states
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState(""); // REQUIRED
  const [order, setOrder] = useState<number | "">("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullname.trim()) {
      alert("Full name is required");
      return;
    }

    if (!role.trim()) {
      alert("Role is required");
      return;
    }

    // Only send allowed fields
    const formData = new FormData();
    formData.append("names", fullname);
    formData.append("phone", phone);
    formData.append("role", role);
    if (order !== "") formData.append("order", String(order));
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      await createMember(formData);
      navigate("/admin/team");
    } catch (err: any) {
      console.error("Create member error:", err);
      alert(err?.response?.data?.message || "Failed to create member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Add Team Member</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fullname */}
          <div>
            <label className="block font-semibold mb-1">Full Name *</label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block font-semibold mb-1">Role *</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="e.g. Director, Manager"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block font-semibold mb-1">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Order */}
          <div>
            <label className="block font-semibold mb-1">Order (optional)</label>
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

          {/* Image */}
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
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Saving..." : "Save"}
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
