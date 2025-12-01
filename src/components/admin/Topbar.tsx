import React, { useState, useRef, useEffect } from "react";
import { Admin } from "../../types/Admin";

interface TopbarProps {
  admin: Admin | null;
  onMenuToggle: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ admin, onMenuToggle }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("admin");
    window.location.href = "/admin/login";
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prepare safe name + avatar fallback
  const nameToDisplay = admin?.fullName || "Admin";
  const initial = nameToDisplay.charAt(0).toUpperCase();

  return (
    <div className="h-16 w-full bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 fixed top-0 left-0 right-0 z-30">
      {/* Left side - Menu button and Brand */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Brand/Title */}
        <h1 className="text-xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Admin Panel
        </h1>
      </div>

      {/* Right side - User menu */}
      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
          onClick={() => setOpen(!open)}
        >
          {/* Username - hidden on mobile, shown on tablet and up */}
          <div className="text-right hidden sm:block">
            <span className="font-medium text-gray-700 block text-sm">{nameToDisplay}</span>
            <span className="text-xs text-gray-500">Administrator</span>
          </div>

          {/* Avatar */}
          <div className="relative">
            {admin?.avatar ? (
              <img
                src={admin.avatar}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 shadow-sm hover:border-blue-500 transition-colors duration-200"
                alt="avatar"
              />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold border-2 border-white shadow-sm hover:shadow-md transition-all duration-200">
                {initial}
              </div>
            )}
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>

          {/* Chevron icon */}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Dropdown menu */}
        <div
          className={`absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-xl border border-gray-100 py-2 transform transition-all duration-200 ease-out ${
            open
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }`}
        >
          {/* User info in dropdown */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-gray-800 text-sm">{nameToDisplay}</p>
            <p className="text-xs text-gray-500 mt-1">Administrator</p>
          </div>

          {/* Dropdown items */}
          <div className="py-2">
            <a
              href={`/admin/profile`}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 group"
            >
              <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile Settings
            </a>

            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 group"
            >
              <svg className="w-4 h-4 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;