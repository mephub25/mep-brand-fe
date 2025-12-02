import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProjectById,
  updateProject,
  uploadGalleryImages,
  removeGalleryImage,

  updateProjectActivities,
} from "../../../api/projectApi";
import {
  
  getAllActivities,

} from "../../../api/activityApi";
import { useToast } from "../../../context/ToastContext";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<any>({
    name: "",
    location: "",
    projectOwner: "",
    projectOwnerContact: "",
    startDate: "",
    endDate: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [gallery, setGallery] = useState<any[]>([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);

  const [activities, setActivities] = useState<any[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  useEffect(() => {
    loadProject();
    loadActivities();
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const project = await getProjectById(id!);

      setForm({
        name: project.name || "",
        location: project.location || "",
        projectOwner: project.projectOwner || "",
        projectOwnerContact: project.projectOwnerContact || "",
        startDate: project.startDate?.slice(0, 10) || "",
        endDate: project.endDate?.slice(0, 10) || "",
      });

      setImagePreview(project.image || null);
      setGallery(project.gallery || []);
      setSelectedActivities(project.activities?.map((a: any) => a._id) || []);
    } catch (error) {
      console.error("Failed to load project:", error);
      addToast("Failed to load project", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async () => {
    try {
      const res = await getAllActivities();
      setActivities(res);
    } catch (error) {
      console.error(error);
      addToast("Failed to load activities", "error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      addToast("Please select an image file", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast("Image must be less than 5MB", "error");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files);
    const valid = selected.filter((file) => {
      if (!file.type.startsWith("image/")) {
        addToast(`${file.name} skipped: Invalid image`, "warning");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        addToast(`${file.name} skipped: File too large`, "warning");
        return false;
      }
      return true;
    });

    setNewGalleryFiles((prev) => [...prev, ...valid]);
  };

  const removeGalleryFile = (index: number) => {
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteGalleryImage = async (imageId: string) => {
    if (!window.confirm("Are you sure you want to delete this image permanently?")) return;

    try {
      await removeGalleryImage(imageId);
      setGallery((prev) => prev.filter((img) => img._id !== imageId));
      addToast("Image deleted successfully", "success");
    } catch (error) {
      addToast("Failed to delete image", "error");
    }
  };

  const handleActivityChange = (activityId: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v) formData.append(k, v as string);
      });

      if (imageFile) formData.append("image", imageFile);

      await updateProject(id!, formData);

      if (newGalleryFiles.length) {
        const galleryFd = new FormData();
        newGalleryFiles.forEach((file) => galleryFd.append("images", file));
        await uploadGalleryImages(galleryFd, id!);
      }

      // Update activities
      await updateProjectActivities(id!, selectedActivities);


      addToast("Project updated successfully", "success");
      // navigate("/admin/projects");
    } catch (error: any) {
      console.error(error);
      addToast(
        error.response?.data?.message || "Failed to update project",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Edit Project</h1>
              <p className="text-gray-600 mt-2">Update your project details and media</p>
            </div>
            <button
              onClick={() => navigate("/admin/projects")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              ← Back to Projects
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Project Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Project Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { field: "name", label: "Project Name", required: true },
                  { field: "location", label: "Location", required: true },
                  { field: "projectOwner", label: "Project Owner", required: true },
                  { field: "projectOwnerContact", label: "Owner Contact", required: true }
                ].map(({ field, label, required }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {label}
                      {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      required={required}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Image Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                Main Project Image
              </h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col lg:flex-row items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="relative group">
                    <img
                      src={imagePreview || "/placeholder.jpg"}
                      className="w-64 h-48 object-cover rounded-lg shadow-md border border-gray-200"
                      alt="Project preview"
                    />
                    {imagePreview && (
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg"></div>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Upload New Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="main-image-upload"
                    />
                    <label
                      htmlFor="main-image-upload"
                      className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Choose Image
                    </label>
                    <p className="text-gray-500 text-sm mt-3">PNG, JPG up to 5MB</p>
                  </div>
                  {imageFile && (
                    <p className="text-green-600 text-sm mt-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      New image selected: {imageFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
      
          {/* Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Activities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {activities.map((activity) => (
                <label key={activity._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedActivities.includes(activity._id)}
                    onChange={() => handleActivityChange(activity._id)}
                  />
                  <span>{activity.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Existing Gallery Card */}
          {gallery.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  Existing Gallery Images
                  <span className="text-sm font-normal text-gray-500 ml-2">({gallery.length} images)</span>
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {gallery.map((img) => (
                    <div key={img._id} className="relative group">
                      <img
                        src={img.url}
                        className="h-32 w-full object-cover rounded-lg shadow-sm border border-gray-200 group-hover:shadow-md transition-shadow duration-200"
                        alt="Gallery image"
                      />
                      <button
                        type="button"
                        onClick={() => deleteGalleryImage(img._id)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-200 hover:bg-red-600"
                        title="Delete image"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* New Gallery Images Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                Add New Gallery Images
              </h2>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  className="hidden"
                  id="gallery-upload"
                />
                <label
                  htmlFor="gallery-upload"
                  className="cursor-pointer inline-flex flex-col items-center justify-center"
                >
                  <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span className="text-lg font-medium text-gray-700">Click to upload gallery images</span>
                  <span className="text-gray-500 text-sm mt-2">Multiple images allowed, up to 5MB each</span>
                </label>
              </div>

              {newGalleryFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">
                    New Images to Upload ({newGalleryFiles.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {newGalleryFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          className="h-32 w-full object-cover rounded-lg shadow-sm border border-gray-200"
                          alt={`New upload ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryFile(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-90 hover:opacity-100 hover:bg-red-600 transition-colors duration-200"
                          title="Remove image"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-b-lg truncate">
                          {file.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Ready to update your project?</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Review your changes before submitting
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/admin/projects")}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  disabled={submitting}
                  className="inline-flex items-center px-8 py-3 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Update Project
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;