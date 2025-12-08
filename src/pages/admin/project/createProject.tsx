"use client";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { createProject } from "../../../api/projectApi";
import { getAllActivities } from "../../../api/activityApi";
import { useToast } from "../../../context/ToastContext";


interface ActivityOption {
  _id: string;
  name: string;
  description?: string;
}

export default function CreateProject() {
  const navigate = useNavigate();

  // Project form state
  const { addToast } = useToast();

  const [name, setName] = useState("");
  const [projectOwner, setProjectOwner] = useState("");
  const [projectOwnerContact, setProjectOwnerContact] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // Activities
  const [availableActivities, setAvailableActivities] = useState<ActivityOption[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  // Fetch activities on mount
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setActivitiesLoading(true);
        const data = await getAllActivities();
        setAvailableActivities(data);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setActivitiesLoading(false);
      }
    };
    fetchActivities();
  }, []);

  // Handle image preview
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

  // Handle gallery previews
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setGallery(files);

    // Create previews for gallery images
    const previews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result as string);
        if (previews.length === files.length) {
          setGalleryPreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });

    if (files.length === 0) {
      setGalleryPreviews([]);
    }
  };

  // Handle activity checkbox changes
  const handleActivityChange = (activityId: string) => {
    setSelectedActivities(prev =>
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  // Select all activities
  const handleSelectAll = () => {
    if (selectedActivities.length === availableActivities.length) {
      setSelectedActivities([]);
    } else {
      setSelectedActivities(availableActivities.map(activity => activity._id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("projectOwner", projectOwner);
    if (projectOwnerContact) formData.append("projectOwnerContact", projectOwnerContact);
    formData.append("startDate", startDate);
    if (endDate) formData.append("endDate", endDate);
    formData.append("location", location);

    if (image) formData.append("image", image);

    gallery.forEach((file) => formData.append("gallery", file));

    // Append selected activities as ObjectIds
    selectedActivities.forEach((id) => formData.append("activities", id));

    try {
      await createProject(formData);

      
    
    // Show toast
    addToast("Project created successfully!", "success");

    // Reset fields
    setName("");
    setProjectOwner("");
    setProjectOwnerContact("");
    setStartDate("");
    setEndDate("");
    setLocation("");
    setImage(null);
    setGallery([]);
    setSelectedActivities([]);

    // Clear previews
    setImagePreview(null);
    setGalleryPreviews([]);

    // // Optional: navigate after 1 second
    // setTimeout(() => {
    //   navigate("/admin/projects");
    // }, 1000);

    } catch (error: any) {
      console.error("Create project error:", error.response?.data || error.message);
       addToast(
      error.response?.data?.message || "Failed to create project. Please try again.",
      "error"
    );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/projects")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 group"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Projects
          </button>
          <h1 className="text-xl text-center font-bold text-gray-900">Create New Project</h1>
          <p className="text-gray-600 text-center mt-2">Add a new project to your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Project Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name *</label>
                <input
                  type="text"
                  className="w-full border bg-white border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter project name"
                />
              </div>

              {/* Project Owner */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Owner *</label>
                <input
                  type="text"
                  className="w-full border bg-white border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                  value={projectOwner}
                  onChange={(e) => setProjectOwner(e.target.value)}
                  placeholder="Enter project owner name"
                />
              </div>

              {/* Project Owner Contact */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Information</label>
                <input
                  type="text"
                  className="w-full border bg-white border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={projectOwnerContact}
                  onChange={(e) => setProjectOwnerContact(e.target.value)}
                  placeholder="Email or phone number"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  className="w-full border bg-white border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter project location"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                <input
                  type="date"
                  className="w-full border bg-white border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  className="w-full border bg-white border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Media
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Main Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">Main Project Image *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="main-image"
                    onChange={handleImageChange}
                    required
                  />
                  <label htmlFor="main-image" className="cursor-pointer">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-xl mx-auto"
                        />
                        <p className="text-sm text-gray-600">Click to change image</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Upload main image</p>
                          <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">Gallery Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    id="gallery-images"
                    onChange={handleGalleryChange}
                  />
                  <label htmlFor="gallery-images" className="cursor-pointer">
                    {galleryPreviews.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                          {galleryPreviews.map((preview, index) => (
                            <img
                              key={index}
                              src={preview}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">
                          {gallery.length} image(s) selected. Click to add more.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Upload gallery images</p>
                          <p className="text-xs text-gray-500">Multiple images supported</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Activities Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Project Activities
              </h2>
              {availableActivities.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                >
                  {selectedActivities.length === availableActivities.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>

            {activitiesLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : availableActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p>No activities available. Create activities first to assign them to projects.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableActivities.map((activity) => (
                  <label
                    key={activity._id}
                    className={`flex items-start space-x-3 p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedActivities.includes(activity._id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedActivities.includes(activity._id)}
                      onChange={() => handleActivityChange(activity._id)}
                      className="mt-1 text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <div className="flex-1">
                      <span className={`font-medium ${
                        selectedActivities.includes(activity._id) ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {activity.name}
                      </span>
                      {activity.description && (
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}

            {selectedActivities.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-800 text-sm">
                  <span className="font-semibold">{selectedActivities.length}</span> 
                  {selectedActivities.length === 1 ? ' activity' : ' activities'} selected
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate("/admin/projects")}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}