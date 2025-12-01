"use client";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTestimonial, updateTestimonial } from "../../../api/testimonialApi";
import { useToast } from "../../../context/ToastContext";

export default function EditTestimonial() {
  const { id } = useParams();
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
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentCompanyLogo, setCurrentCompanyLogo] = useState<string | null>(null);
  const [currentSiteImage, setCurrentSiteImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const loadTestimonial = async () => {
      try {
        setLoading(true);
        const res = await getTestimonial(id);
        const t = res.data;
        setName(t.names || "");
        setMessage(t.message || "");
        setCompany(t.company || "");
        setRole(t.role || "");
        setCurrentImage(t.image || null);
        setImagePreview(t.image || null);
        setCurrentCompanyLogo(t.companyLogo || null);
        setCompanyLogoPreview(t.companyLogo || null);
        setCurrentSiteImage(t.siteImage || null);
        setSiteImagePreview(t.siteImage || null);
      } catch (err) {
        console.error(err);
        addToast("Failed to load testimonial", "error");
        navigate("/admin/testimonials");
      } finally {
        setLoading(false);
      }
    };

    loadTestimonial();
  }, [id, navigate, addToast]);

  const handleFileChange = (file: File | null, setFile: (f: File | null) => void, setPreview: (s: string | null) => void) => {
    setFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
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
      setSubmitting(true);
      await updateTestimonial(id, formData);
      addToast("Testimonial updated successfully", "success");
      navigate("/admin/testimonials");
    } catch (err: any) {
      console.error(err);
      addToast(err?.response?.data?.message || "Failed to update testimonial", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const clearImage = (type: 'image' | 'companyLogo' | 'siteImage') => {
    switch (type) {
      case 'image':
        setImage(null);
        setImagePreview(currentImage);
        break;
      case 'companyLogo':
        setCompanyLogo(null);
        setCompanyLogoPreview(currentCompanyLogo);
        break;
      case 'siteImage':
        setSiteImage(null);
        setSiteImagePreview(currentSiteImage);
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading testimonial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
            <h1 className="text-xl font-bold text-white">Edit Testimonial</h1>
            <p className="text-blue-100 text-sm mt-1">Update testimonial details</p>
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
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 h-32"
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
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                  </label>
                  {currentImage && !imagePreview?.startsWith('blob:') && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 mb-1">Current:</p>
                      <img src={currentImage} alt="Current" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                    </div>
                  )}
                  {imagePreview && imagePreview.startsWith('blob:') && (
                    <div className="mb-3">
                      <p className="text-xs text-green-500 mb-1">New:</p>
                      <div className="relative inline-block">
                        <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border-2 border-green-200" />
                        <button
                          type="button"
                          onClick={() => clearImage('image')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
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
                  <label htmlFor="image-upload" className="cursor-pointer block border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-blue-400 transition-colors duration-200">
                    <span className="text-sm text-gray-600">Change Image</span>
                  </label>
                </div>

                {/* Company Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Logo
                  </label>
                  {currentCompanyLogo && !companyLogoPreview?.startsWith('blob:') && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 mb-1">Current:</p>
                      <img src={currentCompanyLogo} alt="Current Logo" className="w-20 h-20 object-contain rounded-lg border border-gray-200 bg-white p-2" />
                    </div>
                  )}
                  {companyLogoPreview && companyLogoPreview.startsWith('blob:') && (
                    <div className="mb-3">
                      <p className="text-xs text-green-500 mb-1">New:</p>
                      <div className="relative inline-block">
                        <img src={companyLogoPreview} alt="Logo Preview" className="w-20 h-20 object-contain rounded-lg border-2 border-green-200 bg-white p-2" />
                        <button
                          type="button"
                          onClick={() => clearImage('companyLogo')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
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
                  <label htmlFor="company-logo-upload" className="cursor-pointer block border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-blue-400 transition-colors duration-200">
                    <span className="text-sm text-gray-600">Change Logo</span>
                  </label>
                </div>

                {/* Site Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Image
                  </label>
                  {currentSiteImage && !siteImagePreview?.startsWith('blob:') && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 mb-1">Current:</p>
                      <img src={currentSiteImage} alt="Current Site" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                    </div>
                  )}
                  {siteImagePreview && siteImagePreview.startsWith('blob:') && (
                    <div className="mb-3">
                      <p className="text-xs text-green-500 mb-1">New:</p>
                      <div className="relative inline-block">
                        <img src={siteImagePreview} alt="Site Preview" className="w-20 h-20 object-cover rounded-lg border-2 border-green-200" />
                        <button
                          type="button"
                          onClick={() => clearImage('siteImage')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
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
                  <label htmlFor="site-image-upload" className="cursor-pointer block border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-blue-400 transition-colors duration-200">
                    <span className="text-sm text-gray-600">Change Site Image</span>
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
                disabled={submitting || !names.trim() || !message.trim() || !company.trim() || !role.trim()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
                    <span>Update Testimonial</span>
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