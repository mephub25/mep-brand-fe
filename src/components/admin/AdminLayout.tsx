import React, { useState,useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Admin } from "../../types/Admin";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const adminData = sessionStorage.getItem("admin");

  let admin: Admin | null = null;
  // 🔥 AUTH + BACK BUTTON FIX
  // ===========================
  useEffect(() => {
    const token = sessionStorage.getItem("token");

    // Prevent cached page from showing after logout
    window.history.replaceState(null, "", window.location.href);

    // Firefox back-button fix
    window.onpageshow = function (event) {
      if (event.persisted) {
        window.location.reload();
      }
    };

    // Redirect if no token
    if (!token) {
      window.location.href = "/admin/login";
    }
  }, []);
  // ===========================
  // Safely parse admin
  try {
    if (adminData && adminData !== "undefined" && adminData !== "null") {
      admin = JSON.parse(adminData);
    }
  } catch (e) {
    console.error("Invalid admin JSON in sessionStorage:", adminData);
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main content area with proper margin for fixed sidebar */}
      <div className="flex-1 flex flex-col lg:ml-64"> {/* Changed from lg:ml-0 to lg:ml-64 */}
        <Topbar admin={admin} onMenuToggle={toggleSidebar} />

        <main className="flex-1 mt-16 lg:mt-16"> {/* Removed lg:ml-0 since we're using margin on parent */}
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;