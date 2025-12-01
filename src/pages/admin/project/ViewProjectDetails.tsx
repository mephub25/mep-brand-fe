import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById } from "../../../api/projectApi";

const ViewProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadProject();
  }, []);

  const loadProject = async () => {
    try {
      setLoading(true);
      const data = await getProjectById(id!);
      setProject(data);
    } catch (err) {
      console.error("Failed to load project:", err);
    } finally {
      setLoading(false);
    }
  };

  const openImageModal = (image: any, index: number = 0) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setCurrentImageIndex(0);
  };

  const navigateImage = (direction: 'next' | 'prev') => {
    if (!project?.gallery) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentImageIndex + 1) % project.gallery.length;
    } else {
      newIndex = (currentImageIndex - 1 + project.gallery.length) % project.gallery.length;
    }

    setCurrentImageIndex(newIndex);
    setSelectedImage(project.gallery[newIndex]);
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeImageModal();
      }
      // Arrow key navigation
      if (e.key === 'ArrowLeft') {
        navigateImage('prev');
      }
      if (e.key === 'ArrowRight') {
        navigateImage('next');
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, currentImageIndex, project?.gallery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Get all images including main image and gallery
  const allImages = [
    { url: project.image, _id: 'main', type: 'main' },
    ...(project.gallery || []).map((img: any) => ({ ...img, type: 'gallery' }))
  ].filter(img => img.url); // Filter out images without URLs

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all duration-200 mb-6 group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Projects
        </button>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.name}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{project.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Project Owner</p>
                      <p className="font-medium">{project.projectOwner}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-medium">{project.projectOwnerContact}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Project Duration</p>
                      <p className="font-medium">
                        {project.startDate?.slice(0, 10)} - {project.endDate?.slice(0, 10)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Project Image */}
              {project.image && (
                <div className="lg:w-80">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-48 lg:h-64 object-cover rounded-xl shadow-lg cursor-pointer hover:opacity-90 transition-opacity duration-200"
                    onClick={() => openImageModal({ url: project.image, _id: 'main' }, 0)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Gallery Section */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Project Gallery ({project.gallery.length} images)
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {project.gallery.map((img: any, index: number) => (
                  <div 
                    key={img._id} 
                    className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => openImageModal(img, index + 1)} // +1 because index 0 is main image
                  >
                    <img
                      src={img.url}
                      alt={`Gallery ${img._id}`}
                      className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activities Section */}
          {project.activities && project.activities.length > 0 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Project Activities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.activities.map((act: any) => (
                  <div key={act._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-green-300 transition-colors duration-200">
                    <h3 className="font-semibold text-gray-900 mb-2">{act.name || "Unnamed Activity"}</h3>
                    {act.description && (
                      <p className="text-gray-600 text-sm">{act.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors duration-200 bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation Arrows - Show if there are multiple images */}
            {allImages.length > 1 && (
              <>
                {/* Previous Button */}
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 z-10 text-white hover:text-gray-300 transition-colors duration-200 bg-black bg-opacity-50 rounded-full p-4 hover:bg-opacity-70 group"
                >
                  <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Next Button */}
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 z-10 text-white hover:text-gray-300 transition-colors duration-200 bg-black bg-opacity-50 rounded-full p-4 hover:bg-opacity-70 group"
                >
                  <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image Counter - Show if there are multiple images */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 text-white bg-black bg-opacity-50 rounded-full px-4 py-2 text-sm font-medium">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            )}

            {/* Main Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={selectedImage.url}
                alt="Full size view"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              
              {/* Loading state for image */}
              {!selectedImage.url && (
                <div className="flex items-center justify-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            {/* Image Description (if available) */}
            {selectedImage.caption && (
              <div className="absolute bottom-4 left-4 z-10 text-white bg-black bg-opacity-50 rounded-lg px-4 py-2 text-sm max-w-md">
                {selectedImage.caption}
              </div>
            )}

            {/* Click outside to close */}
            <div 
              className="absolute inset-0 -z-10 cursor-zoom-out"
              onClick={closeImageModal}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProjectDetails;