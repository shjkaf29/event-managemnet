import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Import pages
import PublicHomePage from "./pages/PublicHomePage";
import LoginDashboard from "./pages/LoginDashboard";
import AdminLogin from "./pages/AdminLogin";
import ClubOrganizerLogin from "./pages/ClubOrganizerLogin";
import AdminDashboard from "./pages/AdminDashboard";
import PendingApprovals from "./pages/PendingApprovals";
import Profile from "./pages/Profile";
import ManageUser from "./pages/ManageUser";
import SidebarLayout from "./pages/clubOrganizer/SidebarLayout";
import DashboardView from "./pages/clubOrganizer/DashboardView";
import AddEvent from "./pages/clubOrganizer/AddEvent";
import TrackEvent from "./pages/clubOrganizer/TrackEvent";
import ClubOrganizerProfile from "./pages/clubOrganizer/Profile";

// App component with routes
function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicHomePage />} />
        <Route path="/login" element={<LoginDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/club-organizer-login" element={<ClubOrganizerLogin />} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/pending-approvals" element={<PendingApprovals />} />
        <Route path="/admin/profile" element={<Profile />} />
        <Route path="/admin/manage-users" element={<ManageUser />} />

        {/* Club Organizer routes */}
        <Route path="/club-organizer" element={<SidebarLayout />}>
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="add-event" element={<AddEvent />} />
          <Route path="track-event" element={<TrackEvent />} />
          <Route path="profile" element={<ClubOrganizerProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
