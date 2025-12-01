"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTestimonials, deleteTestimonial } from "../../../api/testimonialApi";
import { useToast } from "../../../context/ToastContext";

interface Testimonial {
  _id: string;
  names: string;
  message: string;
  company: string;
  role: string;
  image?: string;
  companyLogo?: string;
  siteImage?: string;
}

export default function TestimonialsList() {
  const [list, setList] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6); // You can make this configurable
  const navigate = useNavigate();
  const { addToast } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const res = await getTestimonials();
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      addToast("Failed to fetch testimonials", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    if (!confirm("Are you sure you want to delete this testimonial? This action cannot be undone.")) return;
    
    try {
      await deleteTestimonial(id);
      await load();
      addToast("Testimonial deleted successfully", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to delete testimonial", "error");
    }
  };

  const handleEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    navigate(`/admin/testimonials/edit/${id}`);
  };

  const handleCardClick = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTestimonial(null);
  };

  // Pagination calculations
  const totalItems = list.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = list.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage customer testimonials and reviews
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/testimonials/create")}
              className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Testimonial</span>
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No testimonials</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first testimonial.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/admin/testimonials/create")}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Testimonial
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Items per page selector */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} testimonials
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="itemsPerPage" className="text-sm text-gray-600">Items per page:</label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={3}>3</option>
                  <option value={6}>6</option>
                  <option value={9}>9</option>
                  <option value={12}>12</option>
                </select>
              </div>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {currentItems.map((testimonial) => (
                <div 
                  key={testimonial._id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => handleCardClick(testimonial)}
                >
                  {/* Header with Image and Basic Info */}
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Profile Image */}
                      <div className="flex-shrink-0">
                        {testimonial.image ? (
                          <img
                            src={testimonial.image}
                            alt={testimonial.names}
                            className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-blue-100 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Name and Company */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{testimonial.names}</h3>
                        <p className="text-blue-600 font-medium text-sm">{testimonial.role}</p>
                        <p className="text-gray-600 text-sm truncate">{testimonial.company}</p>
                      </div>
                    </div>

                    {/* Message with Read More */}
                    <div className="mt-4">
                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                        "{testimonial.message}"
                      </p>
                      {testimonial.message.length > 150 && (
                        <button className="mt-2 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                          Read full message →
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Logos and Actions */}
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      {/* Logos */}
                      <div className="flex items-center space-x-3">
                        {testimonial.companyLogo && (
                          <div className="flex items-center space-x-1">
                            <img
                              src={testimonial.companyLogo}
                              alt="Company Logo"
                              className="h-6 w-auto max-w-20 object-contain"
                            />
                          </div>
                        )}
                        {testimonial.siteImage && (
                          <div className="flex items-center space-x-1">
                            <img
                              src={testimonial.siteImage}
                              alt="Site"
                              className="h-6 w-auto max-w-20 object-contain"
                            />
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => handleEdit(testimonial._id, e)}
                          className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-200 flex items-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={(e) => handleDelete(testimonial._id, e)}
                          className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors duration-200 flex items-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 border-t border-gray-200 pt-6">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                
                <div className="flex items-center space-x-1">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Previous</span>
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border border-blue-600'
                          : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-1"
                  >
                    <span>Next</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Quick Jump */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Go to page:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = Math.max(1, Math.min(totalPages, Number(e.target.value)));
                      handlePageChange(page);
                    }}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Full Message Modal */}
      {isModalOpen && selectedTestimonial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Testimonial Details</h2>
                <button
                  onClick={closeModal}
                  className="text-blue-100 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="flex items-start space-x-4 mb-6">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  {selectedTestimonial.image ? (
                    <img
                      src={selectedTestimonial.image}
                      alt={selectedTestimonial.names}
                      className="w-20 h-20 rounded-full object-cover border-2 border-blue-200"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-blue-200 flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Personal Info */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedTestimonial.names}</h3>
                  <p className="text-blue-600 font-semibold text-lg mb-1">{selectedTestimonial.role}</p>
                  <p className="text-gray-600 text-lg">{selectedTestimonial.company}</p>
                </div>
              </div>

              {/* Full Message */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-gray-800 text-lg leading-relaxed italic">
                    "{selectedTestimonial.message}"
                  </p>
                </div>
              </div>

              {/* Company Logos */}
              {(selectedTestimonial.companyLogo || selectedTestimonial.siteImage) && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Associated Images</h4>
                  <div className="flex space-x-6">
                    {selectedTestimonial.companyLogo && (
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-2">Company Logo</p>
                        <img
                          src={selectedTestimonial.companyLogo}
                          alt="Company Logo"
                          className="h-16 w-auto max-w-32 object-contain bg-white p-2 rounded border border-gray-200"
                        />
                      </div>
                    )}
                    {selectedTestimonial.siteImage && (
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-2">Site Image</p>
                        <img
                          src={selectedTestimonial.siteImage}
                          alt="Site Image"
                          className="h-16 w-auto max-w-32 object-contain bg-white p-2 rounded border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Close
              </button>
              <button
                onClick={(e) => {
                  closeModal();
                  handleEdit(selectedTestimonial._id, e);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit Testimonial</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}