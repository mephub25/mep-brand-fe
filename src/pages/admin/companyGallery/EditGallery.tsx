// src/pages/admin/gallery/EditGallery.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

interface Gallery {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
}

const EditGallery: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const fetchGallery = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/gallery/${id}`);
      setGallery(res.data);
      setTitle(res.data.title);
      setDescription(res.data.description);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      await axios.patch(`http://localhost:3000/api/v1/gallery/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/admin/gallery");
    } catch (error) {
      console.error(error);
    }
  };

  if (!gallery) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit Gallery</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block font-semibold">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
          />
        </div>
        <div>
          <label className="block font-semibold">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
          <img src={gallery.imageUrl} alt={gallery.title} className="w-48 mt-2" />
        </div>
        <button type="submit" className="btn btn-warning">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditGallery;
