"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { getAllProjects } from "../../api/projectApi";
import { getAllActivities } from "../../api/activityApi";
import { getAllMembers } from "../../api/memberApi";
import { getTestimonials } from "../../api/testimonialApi";

interface DashboardStats {
  totalProjects: number;
  totalActivities: number;
  totalMembers: number;
  totalTestimonials: number;
  recentProjects: any[];
  recentMembers: any[];
  recentTestimonials: any[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalActivities: 0,
    totalMembers: 0,
    totalTestimonials: 0,
    recentProjects: [],
    recentMembers: [],
    recentTestimonials: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [projectsData, activitiesData, membersData, testimonialsData] = await Promise.all([
        getAllProjects(),
        getAllActivities(),
        getAllMembers(),
        getTestimonials()
      ]);

      const testimonials = testimonialsData.data || [];

      setStats({
        totalProjects: projectsData.length || 0,
        totalActivities: activitiesData.length || 0,
        totalMembers: membersData.length || 0,
        totalTestimonials: testimonials.length || 0,
        recentProjects: (projectsData || []).slice(0, 3),
        recentMembers: (membersData || []).slice(0, 3),
        recentTestimonials: testimonials.slice(0, 3)
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      addToast("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="mt-2 text-sm text-gray-600">
                Welcome to your admin dashboard. Here's what's happening with your content.
              </p>
            </div>
          
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Projects Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProjects}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => navigate("/admin/projects")}
              className="w-full mt-4 bg-blue-50 text-blue-700 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center space-x-1"
            >
              <span>Manage Projects</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Activities Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Activities</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalActivities}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => navigate("/admin/activities")}
              className="w-full mt-4 bg-green-50 text-green-700 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors duration-200 flex items-center justify-center space-x-1"
            >
              <span>Manage Activities</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Team Members Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Team Members</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalMembers}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => navigate("/admin/team")}
              className="w-full mt-4 bg-purple-50 text-gray-900 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors duration-200 flex items-center justify-center space-x-1"
            >
              <span>Manage Team</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Testimonials Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Testimonials</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalTestimonials}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => navigate("/admin/testimonials")}
              className="w-full mt-4 bg-orange-50 text-orange-700 py-2 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors duration-200 flex items-center justify-center space-x-1"
            >
              <span>Manage Testimonials</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/admin/projects/create")}
              className="bg-blue-800 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Project</span>
            </button>
            <button
              onClick={() => navigate("/admin/activity/create")}
              className="bg-green-800 text-white p-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Activity</span>
            </button>
            <button
              onClick={() => navigate("/admin/team/create")}
              className="bg-gray-700 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Team Member</span>
            </button>
            <button
              onClick={() => navigate("/admin/testimonials/create")}
              className="bg-orange-700 text-white p-2 rounded-lg hover:bg-orange-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Testimonial</span>
            </button>
          </div>
        </div>

        {/* Recent Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
              <button
                onClick={() => navigate("/admin/projects")}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
            {stats.recentProjects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p>No projects yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentProjects.map((project) => (
                  <div
                    key={project._id}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200"
                    onClick={() => navigate(`/admin/projects/view/${project._id}`)}
                  >
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{project.name}</p>
                      <p className="text-xs text-gray-500 truncate">{project.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Team Members */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Team Members</h2>
              <button
                onClick={() => navigate("/admin/team")}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
            {stats.recentMembers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p>No team members yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentMembers.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200"
                    onClick={() => navigate(`/admin/team/edit/${member._id}`)}
                  >
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.names}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{member.names}</p>
                      <p className="text-xs text-gray-500 truncate">{member.role || "No role"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Testimonials */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Testimonials</h2>
              <button
                onClick={() => navigate("/admin/testimonials")}
                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
            {stats.recentTestimonials.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p>No testimonials yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentTestimonials.map((testimonial) => (
                  <div
                    key={testimonial._id}
                    className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200"
                    onClick={() => navigate(`/admin/testimonials/edit/${testimonial._id}`)}
                  >
                    <div className="flex items-start space-x-3">
                      {testimonial.image ? (
                        <img
                          src={testimonial.image}
                          alt={testimonial.names}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{testimonial.names}</p>
                        <p className="text-xs text-gray-500 truncate">{testimonial.company}</p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          "{testimonial.message}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Projects</p>
                <p className="text-xs text-gray-600">{stats.totalProjects} items</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Activities</p>
                <p className="text-xs text-gray-600">{stats.totalActivities} items</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Team Members</p>
                <p className="text-xs text-gray-600">{stats.totalMembers} items</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Testimonials</p>
                <p className="text-xs text-gray-600">{stats.totalTestimonials} items</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}