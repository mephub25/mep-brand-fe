import { Navigate, createBrowserRouter } from "react-router-dom";
import Contact from "../pages/home/Contact";
import LandingPage from "../pages/home/LandingPage";
import ProjectPage from "../pages/home/ProjectPage";
import ProjectsPage from "../pages/home/ProjectsPage";
import About from "../pages/about/About";
import ProtectedRoute from "../components/ProtectedRoute";


// admin dashboard 
import Dashboard from '../pages/admin/Dashboard';
import CreateProjects from "../pages/admin/project/createProject";
import ViewProjects from "../pages/admin/project/Projects";
import EditProject from "../pages/admin/project/editproject";
import ViewProjectDetails from "../pages/admin/project/ViewProjectDetails";

import CreateActivity from "../pages/admin/activity/createActivity";
import ActivityList from "../pages/admin/activity/activityList";
import EditActivity from "../pages/admin/activity/edityActivity";

import AdminLayout from "../components/admin/AdminLayout";
import TeamList from "../pages/admin/team/TeamList";
import CreateTeam from "../pages/admin/team/CreateTeam";
import EditTeam from "../pages/admin/team/EditTeam";

import TestimonialsList from "../pages/admin/testimonial/TestimonialsList";
import CreateTestimonial from "../pages/admin/testimonial/CreateTestimonial";
import EditTestimonial from "../pages/admin/testimonial/EditTestimonial";

import CertificatesList from "../pages/admin/certificate/CertificateList";
import AddCertificate from "../pages/admin/certificate/CertificateAdd";
import EditCertificate from "../pages/admin/certificate/CertificateEdit";
import Profile from '../pages/authontication/profilePage';

import GalleryList from "../pages/admin/companyGallery/GalleryList";
import CreateGallery from "../pages/admin/companyGallery/CreateGallery";
import EditGallery from "../pages/admin/companyGallery/EditGallery";

import ResetPassword from "../pages/authontication/ResetPassword";


const routes = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/projects",
    element: <ProjectsPage />,
  },
  {
    path: "/projects/:id",
    element: <ProjectPage />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },

  { path:"/reset-password",
    element: <ResetPassword /> 
  },

  // admin dashboard
  

 {
  path: "/admin",
  element: (
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  ),
  children: [
     { index: true, element: <Dashboard /> }, 
    { path: "dashboard", element: <Dashboard /> },

    // Projects
    { path: "projects", element: <ViewProjects /> },
    { path: "projects/create", element: <CreateProjects /> },
    { path: "projects/edit/:id", element: <EditProject /> },
    { path: "projects/view/:id", element: <ViewProjectDetails /> },


    // Activities
    { path: "activities", element: <ActivityList /> },
    { path: "activity/create", element: <CreateActivity /> },
    { path: "activities/edit/:id", element: <EditActivity /> },

    // Team
    { path: "team", element: <TeamList /> },
    { path: "team/create", element: <CreateTeam /> },
    { path: "team/edit/:id", element: <EditTeam /> },

    // Testimonials
    { path: "testimonials", element: <TestimonialsList /> },
    { path: "testimonials/create", element: <CreateTestimonial /> },
    { path: "testimonials/edit/:id", element: <EditTestimonial /> },

    // Certificate
    { path: "certificates", element: <CertificatesList /> },
    { path: "certificates/create", element: <AddCertificate /> },
    { path: "certificates/edit/:id", element: <EditCertificate /> },
     
    { path: "photos", element: <GalleryList /> },
    { path: "photo/create", element: <CreateGallery /> },
    { path: "photo/edit/:id", element: <EditGallery /> },

    {
     path: "profile",element: <Profile />,}
  ]
}


]);

export default routes;
