import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Admin } from "../../types/Admin";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const adminData = sessionStorage.getItem("admin");
  const admin: Admin | null = adminData ? JSON.parse(adminData) : null;

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Topbar admin={admin} />

        <div className="p-6 mt-20 ml-64">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
