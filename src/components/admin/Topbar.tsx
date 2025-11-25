import React from "react";
import { Admin } from "../../types/Admin";

interface TopbarProps {
  admin: Admin | null;
}

const Topbar: React.FC<TopbarProps> = ({ admin }) => {
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("admin");
    window.location.href = "/admin/login";
  };

  return (
    <div className="h-16 w-full bg-white shadow flex items-center justify-between px-6 fixed top-0">
      <h2 className="text-xl ml-64 font-semibold">Admin Dashboard</h2>
      <div className="flex items-center gap-4">
        <span className="font-medium">{admin?.name}</span>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-1 rounded"
        >
          Logout
        </button>
    
      </div>
      
    </div>
  );
};

export default Topbar;
