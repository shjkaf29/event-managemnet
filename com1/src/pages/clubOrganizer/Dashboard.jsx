//pages/clubOrganizer/Dashboard

import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AddEvent from "./AddEvent.jsx";
import TrackEvent from "./TrackEvent.jsx";
import Profile from "./Profile.jsx";
import Sidebar from "./Sidebar";
import DashboardView from "./DashboardView.jsx";
import "./styles.css";

const Dashboard = () => {
  const [trackableEvents] = useState([
    {
      date: "2024-12-01",
      name: "Club Meeting",
      status: "Pending",
    },
    {
      date: "2024-12-08",
      name: "Fundraiser",
      status: "Approved",
    },
    {
      date: "2024-12-15",
      name: "Tech Talk",
      status: "Rejected",
      remark: "Incomplete paperwork submitted",
    },
  ]);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<Navigate to="/club-organizer/dashboard" replace />} />
          <Route path="/club-organizer/dashboard" element={<DashboardView />} />
          <Route path="/club-organizer/add-event" element={<AddEvent />} />
          <Route
            path="/club-organizer/track-event"
            element={<TrackEvent events={trackableEvents} />}
          />
          <Route path="/club-organizer/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
