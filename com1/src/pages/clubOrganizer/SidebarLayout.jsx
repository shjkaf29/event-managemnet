import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./styles.css";

const SidebarLayout = () => {
  return (
    <div className="sidebar-layout">
      <Sidebar />
      <div className="main-content">
        <Outlet /> {/* Renders the nested route content */}
      </div>
    </div>
  );
};

export default SidebarLayout;
