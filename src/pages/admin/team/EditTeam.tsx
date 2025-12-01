"use client";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMemberById, updateMember } from "../../../api/memberApi";
import { useToast } from "../../../context/ToastContext";

export default function EditTeam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [names, setNames] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [order, setOrder] = useState<number | "">("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadMember();
  }, [id]);

  const loadMember = async () => {
    try {
      setLoading(true);
      const data = await getMemberById(id!);
      setNames(data.names || "");
      setPhone(data.phone || "");
      setRole(data.role || "");
      setOrder(data.order ?? "");
      setCurrentImage(data.image || null);
      setPreview(data.image || null);
    } catch (err) {
      console.error("Failed to load member", err);
      addToast("Failed to load team member data", "error");
      navigate("/admin/team");
    } finally {
      setLoading(false);
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
      addToast("Please provide member names", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("names", names);
    if (phone) formData.append("phone", phone);
    if (role) formData.append("role", role);
    if (order !== "") formData.append("order", String(order));
    if (imageFile) formData.append("image", imageFile);

    try {
      setSubmitting(true);
      await updateMember(id!, formData);
      addToast("Team member updated successfully", "success");
      navigate("/admin/team");
    } catch (err: any) {
      console.error("Update member error:", err);
      addToast(err?.response?.data?.message || "Failed to update team member", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading team member...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Edit Team Member</h1>
            <p className="text-blue-100 text-sm mt-1">Update team member details</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Names */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={names}
                onChange={(e) => setNames(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter full name"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter role"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter phone number"
              />
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                min={1}
                value={order}
                onChange={(e) => setOrder(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Lower numbers appear first"
              />
            </div>

            {/* Image Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image
              </label>
              
              {/* Current Image */}
              {currentImage && !preview?.startsWith('blob:') && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                  <div className="relative inline-block">
                    <img 
                      src={currentImage} 
                      alt={names}
                      className="w-32 h-32 object-cover rounded-lg border-2 border-blue-200"
                    />
                  </div>
                </div>
              )}

              {/* New Image Preview */}
              {preview && preview.startsWith('blob:') && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">New Image Preview:</p>
                  <div className="relative inline-block">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg border-2 border-green-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setPreview(currentImage);
                        const fileInput = document.getElementById("image-upload") as HTMLInputElement;
                        if (fileInput) fileInput.value = "";
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-600 font-medium">
                      {preview && preview.startsWith('blob:') ? "Change image" : "Upload new image"}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      PNG, JPG, JPEG up to 10MB
                    </span>
                    <span className="text-xs text-blue-500 mt-1">
                      Leave empty to keep current image
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/team")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !names.trim()}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Update Member</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}