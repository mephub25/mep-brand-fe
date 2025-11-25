// pages/dashboard/admin/team/TeamList.tsx
"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { getAllMembers, deleteMember } from "../../../api/memberApi";
import { useNavigate } from "react-router-dom";

interface Member {
  _id: string;
  names: string;
  role?: string;
  phone?: string;
  image?: string;
  order?: number;
}

const TeamList: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await getAllMembers();
      setMembers(data || []);
    } catch (err) {
      console.error("Failed to load members", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      await deleteMember(id);
      await loadMembers();
    } catch (err) {
      console.error("Failed to delete member", err);
      alert("Delete failed. See console for details.");
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/admin/team/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Member
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading members...</p>
      ) : members.length === 0 ? (
        <p>No members found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {members.map((m) => (
            <div key={m._id} className="bg-white rounded shadow p-4">
              {m.image ? (
                <img
                  src={m.image}
                  alt={m.names}
                  className="w-full h-40 object-cover rounded"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}

              <h2 className="text-xl font-semibold mt-3">{m.names}</h2>
              <p className="text-gray-600">{m.role || "—"}</p>
              <p className="text-gray-500 text-sm">Phone: {m.phone || "—"}</p>
              <p className="text-gray-400 text-xs">Order: {m.order ?? "-"}</p>

              <div className="flex gap-2 mt-4">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => navigate(`/admin/team/edit/${m._id}`)}
                >
                  Edit
                </button>

                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(m._id)}
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

export default TeamList;
