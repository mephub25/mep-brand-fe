import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-6 fixed top-0 left-0 z-10">
      <h1 className="text-2xl font-bold mb-10">Admin Panel</h1>

      <nav className="flex flex-col gap-4">
        <Link to="/admin/dashboard" className="hover:text-gray-300">Dashboard</Link>

        {/* PROJECTS */}
        <div className="flex flex-col">
          <span className="font-semibold mt-4">Projects</span>
          <Link to="/admin/projects" className="hover:text-gray-300 ml-4">All Projects</Link>
          <Link to="/admin/projects/create" className="hover:text-gray-300 ml-4">Create Project</Link>
        </div>

        {/* SERVICES */}
        <div className="flex flex-col">
          <span className="font-semibold mt-4">Activities</span>
          <Link to="/admin/activities" className="hover:text-gray-300 ml-4">All Activities</Link>
          <Link to="/admin/activity/create" className="hover:text-gray-300 ml-4">Create Activity</Link>
        </div>

        {/* Team */}
        <div className="flex flex-col">
          <span className="font-semibold mt-4">Team Members</span>
          <Link to="/admin/team" className="hover:text-gray-300 ml-4">All Members</Link>
          <Link to="/admin/team/create" className="hover:text-gray-300 ml-4">Register member</Link>
        </div>

          {/* Testemon */}
        <div className="flex flex-col">
          <span className="font-semibold mt-4">Testimonials</span>
          <Link to="/admin/testimonials" className="hover:text-gray-300 ml-4">All testimonials</Link>
          <Link to="/admin/testimonials/create" className="hover:text-gray-300 ml-4">create testimonial</Link>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
