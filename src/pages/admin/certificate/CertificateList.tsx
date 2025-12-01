import { useEffect, useState, useCallback, useMemo } from "react";
import { getCertificates, deleteCertificate } from "../../../api/certificateApi";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";
import debounce from "lodash/debounce";

type Certificate = {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function CertificateList() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getCertificates();
      setCertificates(res.data.data || []);
    } catch (error) {
      console.error("Failed to load certificates:", error);
      addToast("Failed to load certificates", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
      setCurrentPage(1); // Reset to first page when searching
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  // Clear search function
  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Filter certificates based on search term
  const filteredCertificates = useMemo(() => {
    if (!searchTerm.trim()) return certificates;
    
    return certificates.filter(certificate =>
      certificate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (certificate.description && 
       certificate.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [certificates, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCertificates = filteredCertificates.slice(indexOfFirstItem, indexOfLastItem);
  const hasResults = filteredCertificates.length > 0;
  const hasPagination = totalPages > 1;

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteCertificate(id);
      addToast(`Certificate "${title}" deleted successfully`, "success");
      loadData();
    } catch (error) {
      console.error("Failed to delete certificate:", error);
      addToast("Failed to delete certificate", "error");
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const openCertificateDetail = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsModalOpen(true);
    // Prevent scrolling on background
    document.body.style.overflow = 'hidden';
  };

  const closeCertificateDetail = () => {
    setIsModalOpen(false);
    setSelectedCertificate(null);
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };

  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeCertificateDetail();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Certificates</h1>
                <p className="text-gray-600 mt-2">
                  {filteredCertificates.length} certificate{filteredCertificates.length !== 1 ? "s" : ""} found
                  {searchTerm && filteredCertificates.length !== certificates.length && (
                    <span className="text-blue-600">
                      {" "}(filtered from {certificates.length})
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => navigate("/admin/certificates/create")}
                className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Certificate
              </button>
            </div>
          </div>

          {/* Search and Controls Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search certificates by title or description..."
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2.5 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Items Per Page Selector */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="3">3 per page</option>
                  <option value="6">6 per page</option>
                  <option value="9">9 per page</option>
                  <option value="12">12 per page</option>
                </select>
              </div>
            </div>
          </div>

          {!hasResults ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No matching certificates found" : "No certificates found"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? "Try adjusting your search terms or clear the search."
                  : "Get started by adding your first certificate."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Search
                  </button>
                )}
                <button
                  onClick={() => navigate("/admin/certificates/create")}
                  className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Certificate
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Certificates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentCertificates.map((certificate: Certificate) => (
                  <div
                    key={certificate._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer group"
                    onClick={() => openCertificateDetail(certificate)}
                  >
                    {/* Certificate Image */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                      <img
                        src={certificate.image || "/placeholder.jpg"}
                        alt={certificate.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full shadow-sm">
                          Certificate
                        </span>
                      </div>
                      {/* View overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white bg-opacity-90 p-2 rounded-full">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Certificate Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
                        {certificate.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {certificate.description || "No description provided"}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/certificates/edit/${certificate._id}`);
                          }}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(certificate._id, certificate.title);
                          }}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {hasPagination && (
                <div className="mt-8">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Page Info */}
                      <div className="text-sm text-gray-600">
                        Showing{" "}
                        <span className="font-medium">
                          {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCertificates.length)}
                        </span>{" "}
                        of <span className="font-medium">{filteredCertificates.length}</span> certificates
                      </div>

                      {/* Pagination Buttons */}
                      <div className="flex items-center space-x-2">
                        {/* Previous Button */}
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Previous
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors duration-200 ${
                                  currentPage === pageNum
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                          
                          {totalPages > 5 && currentPage < totalPages - 2 && (
                            <>
                              <span className="px-2 text-gray-400">...</span>
                              <button
                                onClick={() => handlePageChange(totalPages)}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors duration-200 ${
                                  currentPage === totalPages
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                {totalPages}
                              </button>
                            </>
                          )}
                        </div>

                        {/* Next Button */}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          Next
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Certificate Detail Modal */}
      {isModalOpen && selectedCertificate && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closeCertificateDetail}
          />

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-auto overflow-hidden">
              {/* Close button */}
              <button
                onClick={closeCertificateDetail}
                className="absolute top-4 right-4 z-10 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-md transition-all duration-200 hover:scale-110"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Content */}
              <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="lg:w-1/2 bg-gray-100">
                  <div className="relative h-96 lg:h-full">
                    <img
                      src={selectedCertificate.image || "/placeholder.jpg"}
                      alt={selectedCertificate.title}
                      className="w-full h-full object-contain p-4"
                    />
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full shadow-sm">
                        Certificate
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="lg:w-1/2 p-6 lg:p-8">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedCertificate.title}
                      </h2>
                      <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Description
                      </h3>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {selectedCertificate.description || "No description provided."}
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Created: {formatDate(selectedCertificate.createdAt)}</span>
                        </div>
                        {selectedCertificate.updatedAt && (
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Last Updated: {formatDate(selectedCertificate.updatedAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => {
                          closeCertificateDetail();
                          navigate(`/admin/certificates/edit/${selectedCertificate._id}`);
                        }}
                        className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Certificate
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${selectedCertificate.title}"?`)) {
                            handleDelete(selectedCertificate._id, selectedCertificate.title);
                            closeCertificateDetail();
                          }
                        }}
                        className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors duration-200"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}