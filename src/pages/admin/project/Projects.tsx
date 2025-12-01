"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProjects, deleteProject } from "../../../api/projectApi";

const ViewProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getAllProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProject(id);
      loadProjects();
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = projects.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6 lg:mb-8">
          <div className="flex-1">
            <h1 className="text-xl sm:text-xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage and view all your projects</p>
          </div>
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-4">
            {/* Items per page selector */}
            {projects.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={projects.length}>All</option>
                </select>
              </div>
            )}
            <button
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base w-full xs:w-auto"
              onClick={() => navigate("/admin/projects/create")}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Project</span>
            </button>
          </div>
        </div>

        {/* Projects Count */}
        {projects.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <p className="text-gray-600 text-sm sm:text-base">
              Showing <span className="font-semibold">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, projects.length)}</span> of{" "}
              <span className="font-semibold">{projects.length}</span> projects
            </p>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Get started by creating your first project</p>
            <button
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
              onClick={() => navigate("/admin/projects/create")}
            >
              Create Project
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {currentProjects.map((project: any) => (
                <div
                  key={project._id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group"
                >
                  {/* Project Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                      <span className="bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-1">{project.name}</h2>
                    <div className="space-y-2 mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs sm:text-sm truncate">{project.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-xs sm:text-sm truncate">Owner: {project.projectOwner}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col xs:flex-row gap-2 pt-3 sm:pt-4 border-t border-gray-200">
                      <button
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-1 text-xs sm:text-sm"
                        onClick={() => navigate(`/admin/projects/view/${project._id}`)}
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                      <button
                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-1 text-xs sm:text-sm"
                        onClick={() => navigate(`/admin/projects/edit/${project._id}`)}
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-1 text-xs sm:text-sm"
                        onClick={() => handleDelete(project._id)}
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 sm:py-6 border-t border-gray-200">
                {/* Page info */}
                <div className="text-sm text-gray-600 order-2 sm:order-1">
                  Page <span className="font-semibold">{currentPage}</span> of{" "}
                  <span className="font-semibold">{totalPages}</span>
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col xs:flex-row items-center gap-3 order-1 sm:order-2 w-full xs:w-auto">
                  {/* Previous Button */}
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-all duration-200 text-sm ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    } w-full xs:w-auto justify-center`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden xs:inline">Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1 flex-wrap justify-center">
                    {getPageNumbers().map((number, index) => (
                      <button
                        key={index}
                        onClick={() => typeof number === 'number' && paginate(number)}
                        className={`min-w-[32px] sm:min-w-[40px] h-8 sm:h-10 flex items-center justify-center rounded-lg border transition-all duration-200 text-sm ${
                          number === currentPage
                            ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                            : number === '...'
                            ? "bg-white text-gray-500 border-gray-300 cursor-default"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                        }`}
                        disabled={number === '...'}
                      >
                        {number}
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-all duration-200 text-sm ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    } w-full xs:w-auto justify-center`}
                  >
                    <span className="hidden xs:inline">Next</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Items per page info */}
                <div className="text-sm text-gray-600 order-3 text-center sm:text-left">
                  {itemsPerPage === projects.length ? "Showing all projects" : `${itemsPerPage} per page`}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewProjects;