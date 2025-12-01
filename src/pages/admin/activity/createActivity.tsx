"use client";

import { useState } from "react";
import { createActivity } from "../../../api/activityApi";

export default function CreateActivity() {
  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    if (alias) formData.append("alias", alias);
    if (image) formData.append("image", image);

    try {
      await createActivity(formData);
      alert("Activity created successfully!");
      setName("");
      setAlias("");
      setImage(null);
      setImagePreview(null);
      // Clear file input
      const fileInput = document.getElementById("image-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      console.error("Error creating activity:", error.response?.data || error.message);
      alert("Failed to create activity.");
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
              <h1 className="text-xl font-bold text-white">Create New Activity</h1>
              <p className="text-blue-100 text-sm mt-1">Add a new activity to your catalog</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Activity Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter activity name"
                />
              </div>

              {/* Alias */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alias <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  className="w-full px-4 py-3  bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter alias (optional)"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Image <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-4">
                    <div className="relative inline-block">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded-lg border-2 border-blue-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
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
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-gray-600 font-medium">
                        {imagePreview ? "Change image" : "Upload an image"}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        PNG, JPG, JPEG up to 10MB
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
                      <span>Create Activity</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              All fields marked with <span className="text-red-500">*</span> are required.
              Image upload is optional but recommended for better user experience.
            </p>
          </div>
        </div>
      </div>
    
  );
}