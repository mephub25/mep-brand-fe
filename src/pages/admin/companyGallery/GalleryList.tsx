// src/pages/admin/gallery/GalleryList.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Gallery {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
}

const GalleryList: React.FC = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(false);

const fetchGalleries = async () => {
  try {
    setLoading(true);
    const res = await axios.get("http://localhost:3000/api/v1/gallery");
    // Use res.data.data if backend wraps the array
    setGalleries(res.data.data || []);
  } catch (error) {
    console.error(error);
    setGalleries([]); // fallback
  } finally {
    setLoading(false);
  }
};


  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this gallery?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/v1/gallery/${id}`);
      fetchGalleries();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gallery</h2>
        <Link to="/admin/gallery/create" className="btn btn-primary">
          Add New
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : galleries.length === 0 ? (
        <p>No galleries found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {galleries.map((gallery) => (
            <div key={gallery._id} className="border p-2 rounded">
              <img
                src={gallery.imageUrl}
                alt={gallery.title}
                className="w-full h-48 object-cover mb-2 rounded"
              />
              <h3 className="font-semibold">{gallery.title}</h3>
              <p className="text-sm text-gray-600">{gallery.description}</p>
              <div className="mt-2 flex gap-2">
                <Link
                  to={`/admin/photo/edit/${gallery._id}`}
                  className="btn btn-sm btn-warning"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(gallery._id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryList;
