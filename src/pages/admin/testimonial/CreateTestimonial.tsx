"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTestimonial } from "../../../api/testimonialApi";
import { useToast } from "../../../context/ToastContext";

export default function CreateTestimonial() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [names, setName] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [siteImage, setSiteImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(null);
  const [siteImagePreview, setSiteImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (file: File | null, setFile: (f: File | null) => void, setPreview: (s: string | null) => void) => {
    setFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!names.trim() || !message.trim() || !company.trim() || !role.trim()) {
      addToast("Please fill all required fields", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("names", names);
    formData.append("message", message);
    formData.append("company", company);
    formData.append("role", role);

    if (image) formData.append("image", image);
    if (companyLogo) formData.append("companyLogo", companyLogo);
    if (siteImage) formData.append("siteImage", siteImage);

    try {
      setLoading(true);
      await createTestimonial(formData);
      addToast("Testimonial created successfully", "success");
      navigate("/admin/testimonials");
    } catch (err: any) {
      console.error(err);
      addToast(err?.response?.data?.message || "Failed to create testimonial", "error");
    } finally {
      setLoading(false);
    }
  };

  const clearImage = (type: 'image' | 'companyLogo' | 'siteImage') => {
    switch (type) {
      case 'image':
        setImage(null);
        setImagePreview(null);
        break;
      case 'companyLogo':
        setCompanyLogo(null);
        setCompanyLogoPreview(null);
        break;
      case 'siteImage':
        setSiteImage(null);
        setSiteImagePreview(null);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-4">
            <h1 className="text-xl font-bold text-white">Add Testimonial</h1>
            <p className="text-blue-100 text-sm mt-1">Create a new customer testimonial</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={names}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-white  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 h-32"
                  placeholder="Enter testimonial message"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-3 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter company name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter role/position"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Image Uploads */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image
                    <span className="text-gray-400 text-xs ml-1">(optional)</span>
                  </label>
                  {imagePreview && (
                    <div className="mb-3">
                      <div className="relative inline-block">
                        <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg border-2 border-blue-200" />
                        <button
                          type="button"
                          onClick={() => clearImage('image')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null, setImage, setImagePreview)}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer block border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors duration-200">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-600">Upload Profile Image</span>
                  </label>
                </div>

                {/* Company Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Logo
                    <span className="text-gray-400 text-xs ml-1">(optional)</span>
                  </label>
                  {companyLogoPreview && (
                    <div className="mb-3">
                      <div className="relative inline-block">
                        <img src={companyLogoPreview} alt="Logo Preview" className="w-24 h-24 object-contain rounded-lg border-2 border-blue-200 bg-white p-2" />
                        <button
                          type="button"
                          onClick={() => clearImage('companyLogo')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null, setCompanyLogo, setCompanyLogoPreview)}
                    className="hidden"
                    id="company-logo-upload"
                  />
                  <label htmlFor="company-logo-upload" className="cursor-pointer block border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors duration-200">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-sm text-gray-600">Upload Company Logo</span>
                  </label>
                </div>

                {/* Site Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Image
                    <span className="text-gray-400 text-xs ml-1">(optional)</span>
                  </label>
                  {siteImagePreview && (
                    <div className="mb-3">
                      <div className="relative inline-block">
                        <img src={siteImagePreview} alt="Site Preview" className="w-24 h-24 object-cover rounded-lg border-2 border-blue-200" />
                        <button
                          type="button"
                          onClick={() => clearImage('siteImage')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null, setSiteImage, setSiteImagePreview)}
                    className="hidden"
                    id="site-image-upload"
                  />
                  <label htmlFor="site-image-upload" className="cursor-pointer block border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors duration-200">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                    <span className="text-sm text-gray-600">Upload Site Image</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/admin/testimonials")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !names.trim() || !message.trim() || !company.trim() || !role.trim()}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
                    <span>Create Testimonial</span>
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