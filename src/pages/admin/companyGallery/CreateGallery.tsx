// src/pages/admin/gallery/CreateGallery.tsx
import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";

const CreateGallery: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      addToast("Please select at least one image", "error");
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      addToast("Please login to continue", "error");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await axios.post("http://localhost:3000/api/v1/company-gallery", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      addToast("Gallery item created successfully!", "success");
      navigate("/admin/photos");
    } catch (err: any) {
      console.error(err);
      addToast(err.response?.data?.message || "Failed to create gallery item", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      
      // Validate file sizes
      const oversizedFiles = fileArray.filter(file => file.size > 5 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        addToast("Some files exceed 5MB limit", "error");
        // Filter out oversized files
        const validFiles = fileArray.filter(file => file.size <= 5 * 1024 * 1024);
        setImages(prev => [...prev, ...validFiles]);
      } else {
        setImages(prev => [...prev, ...fileArray]);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/admin/photos");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button
            onClick={handleBackClick}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Gallery
          </button>
          <h1 className="text-xl md:text-xl font-bold text-gray-900 mb-2">
            Add New Gallery
          </h1>
          <p className="text-gray-600">
            Upload and showcase your company's photos
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border bg-white border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter gallery title"
                
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                {title.length}/100 characters
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[120px]"
                placeholder="Describe your gallery item"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {description.length}/500 characters
              </p>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Image Upload *
              </label>
              <div 
                onClick={handleUploadBoxClick}
                className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors duration-300 cursor-pointer bg-gray-50 relative"
              >
                {images.length === 0 ? (
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium mb-2">
                        Drop your images here or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports multiple images • Max: 5MB each
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((image, idx) => (
                        <div key={idx} className="relative rounded-xl overflow-hidden group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(idx);
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 z-10"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded truncate">
                            {image.name}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      {images.length} image(s) selected. Click to add more.
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              {images.length > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Total size: {(images.reduce((acc, img) => acc + img.size, 0) / (1024 * 1024)).toFixed(2)} MB
                  </span>
                  <button
                    type="button"
                    onClick={() => setImages([])}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear all images
                  </button>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-gray-200">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleBackClick}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200 flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || images.length === 0}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex-1 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create Gallery"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Quick Tips</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Use descriptive titles for better organization
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              High-quality images work best
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              You can add multiple images at once
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateGallery;