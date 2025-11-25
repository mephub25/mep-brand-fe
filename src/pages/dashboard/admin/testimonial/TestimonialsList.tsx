// pages/dashboard/admin/testimonials/TestimonialsList.tsx
"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import { useNavigate } from "react-router-dom";
import { getTestimonials, deleteTestimonial } from "../../../../api/testimonialApi";

interface Testimonial {
  _id: string;
  names: string;
  message: string;
  company: string;
  role: string;
  image?: string;
  companyLogo?: string;
  siteImage?: string;
}

export default function TestimonialsList() {
  const [list, setList] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const res = await getTestimonials();
      setList(res.data || []); // backend: { data: [...] }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await deleteTestimonial(id);
      await load();
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <button
          onClick={() => navigate("/admin/testimonials/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Testimonial
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : list.length === 0 ? (
        <p>No testimonials found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((t) => (
            <div key={t._id} className="bg-white p-4 rounded shadow flex gap-4">
              <div className="w-28">
                {t.image ? (
                  <img src={t.image} alt={t.names} className="w-28 h-28 object-cover rounded" />
                ) : (
                  <div className="w-28 h-28 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold">{t.names}</h3>
                <p className="text-sm text-gray-700">{t.message}</p>
                <p className="text-sm text-gray-500 mt-2">{t.company} — {t.role}</p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => navigate(`/admin/testimonials/edit/${t._id}`)}
                    className="px-3 py-1 bg-amber-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="w-24 flex flex-col gap-2">
                {t.companyLogo && <img src={t.companyLogo} alt="logo" className="w-20 h-8 object-contain" />}
                {t.siteImage && <img src={t.siteImage} alt="site" className="w-20 h-8 object-contain" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
