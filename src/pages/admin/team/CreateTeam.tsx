"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMember } from "../../../api/memberApi";
import { useToast } from "../../../context/ToastContext";

export default function CreateTeam() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Form states
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
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
      addToast("Full name is required", "warning");
      return;
    }

    if (!role.trim()) {
      addToast("Role is required", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("names", fullname);
    formData.append("phone", phone);
    formData.append("role", role);
    if (order !== "") formData.append("order", String(order));
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      await createMember(formData);
      addToast("Team member created successfully", "success");
      navigate("/admin/team");
    } catch (err: any) {
      console.error("Create member error:", err);
      addToast(err?.response?.data?.message || "Failed to create team member", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Add Team Member</h1>
            <p className="text-blue-100 text-sm mt-1">Create a new team member profile</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full px-4 py-3 bg-white  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter full name"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-white  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="e.g. Director, Manager, Developer"
                required
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
                className="w-full px-4 py-3 bg-white  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter phone number"
              />
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
                <span className="text-gray-400 text-xs ml-1">(optional)</span>
              </label>
              <input
                type="number"
                min={1}
                value={order}
                onChange={(e) => setOrder(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-4 py-3 bg-white  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Lower numbers appear first"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image
                <span className="text-gray-400 text-xs ml-1">(optional)</span>
              </label>
              
              {/* Image Preview */}
              {preview && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <div className="relative inline-block">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-blue-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setPreview(null);
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
                      {preview ? "Change image" : "Upload profile image"}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      PNG, JPG, JPEG up to 10MB
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
                disabled={loading || !fullname.trim() || !role.trim()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Create Member</span>
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