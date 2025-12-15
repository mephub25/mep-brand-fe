import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { useToast } from "../../../context/ToastContext";
import ImageModal from "../../../components/admin/ImageModal";

interface Gallery {
  _id: string;
  title: string;
  description?: string;
  images: string[];
  createdAt?: string;
}

interface PaginationResponse {
  data: Gallery[];
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}

const GalleryList: React.FC = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // ⭐ PAGINATION STATES
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const { addToast } = useToast();

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const res = await axios.get<PaginationResponse>(
        `https://be.meperictrictech.com/api/v1/company-gallery?page=${page}&limit=${limit}`
      );

      setGalleries(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error(error);
      addToast("Failed to load galleries", "error");
      setGalleries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, [page]); // 👈 Re-fetch when page changes

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeletingId(id);
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`https://be.meperictrictech.com/api/v1/company-gallery/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      addToast(`"${title}" deleted successfully`, "success");

      fetchGalleries();
    } catch (error) {
      console.error(error);
      addToast("Failed to delete gallery", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredGalleries = galleries.filter(
    (gallery) =>
      gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gallery.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderImageGrid = (images: string[], title: string) => {
    if (images.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
          <svg className="w-12 h-12" fill="none" stroke="currentColor">
            <path strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" />
          </svg>
        </div>
      );
    }

    if (images.length === 1) {
      return (
        <div
          className="w-full h-48 cursor-pointer group relative overflow-hidden"
          onClick={() => setSelectedImage(images[0])}
        >
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 h-full gap-1">
        {images.slice(0, 4).map((imgUrl, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden group cursor-pointer"
            onClick={() => setSelectedImage(imgUrl)}
          >
            <img
              src={imgUrl}
              alt={`${title} ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20"></div>

            {idx === 3 && images.length > 4 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  +{images.length - 3}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">Loading...</div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl md:text-xl font-bold">Company Gallery</h1>
              <p className="text-gray-600">
                Manage and organize your company photos
              </p>
            </div>

            <Link
              to="/admin/photo/create"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg"
            >
              + Add New Gallery
            </Link>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border mb-4"
          />

          <div className="flex gap-4">
            <div className="px-4 py-2 bg-white rounded-xl shadow border">
              Total: <b>{galleries.length}</b>
            </div>
            <div className="px-4 py-2 bg-white rounded-xl shadow border">
              Showing: <b>{filteredGalleries.length}</b>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGalleries.map((gallery) => (
            <div
              key={gallery._id}
              className="bg-white shadow-lg rounded-2xl overflow-hidden"
            >
              <div className="relative h-48">
                {renderImageGrid(gallery.images, gallery.title)}
                <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs">
                  {gallery.images.length} images
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold">{gallery.title}</h3>

                {gallery.description && (
                  <p className="text-gray-600 text-sm line-clamp-2 mt-2">
                    {gallery.description}
                  </p>
                )}

                <p className="text-gray-400 text-xs mt-3">
                  {formatDate(gallery.createdAt)}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                 <Link
                   to={`/admin/photo/edit/${gallery._id}`}
                   className="w-9 h-9 bg-gray-600 text-white rounded-lg flex items-center justify-center hover:bg-gray-700"
                   title="Edit"
                   aria-label="Edit photo"
                 >
                   <EditIcon fontSize="small" />
                 </Link>

                  <button
                    disabled={deletingId === gallery._id}
                    onClick={() => handleDelete(gallery._id, gallery.title)}
                    className="flex-1 px-4 py-2 bg-red-900 text-white text-sm rounded-lg"
                  >
                    {deletingId === gallery._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center mt-10 gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={`px-4 py-2 rounded-lg text-sm ${
              page === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            ◀ Previous
          </button>

          <span className="text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded-lg text-sm ${
              page === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next ▶
          </button>
        </div>

        {selectedImage && (
          <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
        )}
      </div>
    </div>
  );
};

export default GalleryList;
