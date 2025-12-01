import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCertificate, updateCertificate } from '../../../api/certificateApi';
import { useToast } from '../../../context/ToastContext';

type Certificate = {
  _id: string;
  title: string;
  description?: string;
  image?: string;
};

export default function CertificateEdit(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      addToast("Certificate ID is missing", "error");
      navigate("/admin/certificates");
      return;
    }
    loadCertificate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadCertificate = async () => {
    try {
      setLoading(true);
      const res = await getCertificate(id as string);
      const cert: Certificate = res.data.data;
      setTitle(cert.title || '');
      setDescription(cert.description || '');
      setImagePreview(cert.image || null);
    } catch (err) {
      console.error('Failed to load certificate', err);
      addToast('Failed to load certificate details', 'error');
      navigate("/admin/certificates");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return setImageFile(null);

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (PNG, JPG, JPEG)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('Image must be less than 5MB', 'error');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      addToast('Missing certificate ID', 'error');
      return;
    }

    if (!title.trim()) {
      addToast('Title is required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', title.trim());
      fd.append('description', description.trim());
      if (imageFile) fd.append('image', imageFile);

      await updateCertificate(id as string, fd);
      addToast('Certificate updated successfully', 'success');
      navigate('/admin/certificates');
    } catch (err: any) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to update certificate', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading certificate details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Edit Certificate</h1>
              <p className="text-gray-600 mt-2">Update certificate information and image</p>
            </div>
            <button
              onClick={() => navigate('/admin/certificates')}
              className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              ← Back to Certificates
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              Certificate Details
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate Title
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter certificate title"
                />
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                  placeholder="Enter certificate description (optional)"
                />
                <p className="text-gray-500 text-sm mt-2">
                  Brief description about the certificate
                </p>
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate Image
                </label>
                
                <div className="flex flex-col lg:flex-row items-start gap-8">
                  {/* Current Image Preview */}
                  <div className="flex-shrink-0">
                    <div className="relative group">
                      <img
                        src={imagePreview || '/placeholder.jpg'}
                        alt="Certificate preview"
                        className="w-64 h-48 object-cover rounded-lg shadow-md border border-gray-200"
                      />
                      {imagePreview && (
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg"></div>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mt-2 text-center">
                      Current image
                    </p>
                  </div>

                  {/* Upload New Image */}
                  <div className="flex-1">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="certificate-image-upload"
                      />
                      <label
                        htmlFor="certificate-image-upload"
                        className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Choose New Image
                      </label>
                      <p className="text-gray-500 text-sm mt-3">PNG, JPG, JPEG up to 5MB</p>
                    </div>
                    
                    {imageFile && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-sm flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          New image selected: {imageFile.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/admin/certificates')}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
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
                      Update Certificate
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}