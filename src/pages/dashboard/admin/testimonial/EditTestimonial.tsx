// pages/dashboard/admin/testimonials/EditTestimonial.tsx
"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";
import { getTestimonial, updateTestimonial } from "../../../../api/testimonialApi";

export default function EditTestimonial() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [names, setNames] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [siteImage, setSiteImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await getTestimonial(id);
        const t = res.data;
        setNames(t.names || "");
        setMessage(t.message || "");
        setCompany(t.company || "");
        setRole(t.role || "");
        setPreview(t.image || null);
      } catch (err) {
        console.error(err);
        alert("Failed to load testimonial");
      }
    })();
  }, [id]);

  const onFile = (setter: (f: File | null) => void, previewSetter?: (s: string | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setter(f);
    if (previewSetter && f) previewSetter(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!names.trim() || !message.trim() || !company.trim() || !role.trim()) {
      alert("Please fill required fields");
      return;
    }

    const fd = new FormData();
    fd.append("names", names);
    fd.append("message", message);
    fd.append("company", company);
    fd.append("role", role);

    if (image) fd.append("image", image);
    if (companyLogo) fd.append("companyLogo", companyLogo);
    if (siteImage) fd.append("siteImage", siteImage);

    try {
      setLoading(true);
      await updateTestimonial(id, fd);
      navigate("/admin/testimonials");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Edit Testimonial</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Full Name *</label>
            <input value={names} onChange={(e) => setNames(e.target.value)} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block font-semibold mb-1">Message *</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full border p-2 rounded h-28" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Company *</label>
              <input value={company} onChange={(e) => setCompany(e.target.value)} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Role *</label>
              <input value={role} onChange={(e) => setRole(e.target.value)} className="w-full border p-2 rounded" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-1">Image (profile)</label>
              {preview && <img src={preview} className="w-24 h-24 object-cover rounded mb-2" />}
              <input type="file" accept="image/*" onChange={onFile(setImage, setPreview)} />
            </div>

            <div>
              <label className="block font-semibold mb-1">Company Logo</label>
              <input type="file" accept="image/*" onChange={onFile(setCompanyLogo)} />
            </div>

            <div>
              <label className="block font-semibold mb-1">Site Image</label>
              <input type="file" accept="image/*" onChange={onFile(setSiteImage)} />
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
              {loading ? "Saving..." : "Save changes"}
            </button>

            <button type="button" onClick={() => navigate("/admin/testimonials")} className="px-4 py-2 rounded border">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
