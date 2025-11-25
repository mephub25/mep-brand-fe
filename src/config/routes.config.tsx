import { Navigate, createBrowserRouter } from "react-router-dom";
import Contact from "../pages/home/Contact";
import LandingPage from "../pages/home/LandingPage";
import ProjectPage from "../pages/home/ProjectPage";
import ProjectsPage from "../pages/home/ProjectsPage";
import About from "../pages/about/About";
import ProtectedRoute from "../components/ProtectedRoute";

// Example


// admin dashboard 
import Dashboard from '../pages/dashboard/admin/Dashboard';
import CreateProjects from "../pages/dashboard/admin/createProject";
import ViewProjects from "../pages/dashboard/admin/Projects";
import EditProject from "../pages/dashboard/admin/editproject";
import CreateActivity from "../pages/dashboard/admin/createActivity";
import ActivityList from "../pages/dashboard/admin/activityList";
import EditActivity from "../pages/dashboard/admin/edityActivity";

import TeamList from "../pages/dashboard/team/TeamList";
import CreateTeam from "../pages/dashboard/team/CreateTeam";
import EditTeam from "../pages/dashboard/team/EditTeam";

import TestimonialsList from "../pages/dashboard/admin/testimonial/TestimonialsList";
import CreateTestimonial from "../pages/dashboard/admin/testimonial/CreateTestimonial";
import EditTestimonial from "../pages/dashboard/admin/testimonial/EditTestimonial";


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

  // admin dashboard

  {
  path: "/admin/dashboard",
  element: (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
},
{
  path: "/admin/projects",
  element: (
    <ProtectedRoute>
      <ViewProjects />
    </ProtectedRoute>
  ),
},
{
  path: "/admin/projects/create",
  element: (
    <ProtectedRoute>
      <CreateProjects />
    </ProtectedRoute>
  ),
},
  {
    path: "/admin/projects/edit/:id",
    element: (
      <ProtectedRoute>
        <EditProject />
      </ProtectedRoute>
    ),
  },
{
  path: "/admin/activity/create",
  element: (
    <ProtectedRoute>
      <CreateActivity />
    </ProtectedRoute>
  ),
},
{
  path: "/admin/activities",
  element: (
    <ProtectedRoute>
      <ActivityList />
    </ProtectedRoute>
  ),
},
{
  path: "/admin/activities/edit/:id",
  element: (
    <ProtectedRoute>
      <EditActivity />
    </ProtectedRoute>
  ),
}
,
{
  path: "/admin/team",
  element: (
    <ProtectedRoute>
      <TeamList />
    </ProtectedRoute>
  ),
},
{
  path: "/admin/team/create",
  element: (
    <ProtectedRoute>
      <CreateTeam />
    </ProtectedRoute>
  ),
},
{
  path: "/admin/team/edit/:id",
  element: (
    <ProtectedRoute>
      <EditTeam />
    </ProtectedRoute>
  ),
},


{
  path: "/admin/testimonials",
  element: (
    <ProtectedRoute>
      <TestimonialsList />
    </ProtectedRoute>
  ),
},
{
  path: "/admin/testimonials/create",
  element: (
    <ProtectedRoute>
      <CreateTestimonial />
    </ProtectedRoute>
  ),
},
{
  path: "/admin/testimonials/edit/:id",
  element: (
    <ProtectedRoute>
      <EditTestimonial />
    </ProtectedRoute>
  ),
},

]);

export default routes;
