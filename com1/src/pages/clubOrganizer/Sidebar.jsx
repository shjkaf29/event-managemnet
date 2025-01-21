import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebase";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate("/club-organizer-login");
      }
    });
    return unsubscribe;
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/club-organizer-login");
    } catch (err) {
      console.error("Error signing out: ", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="sidebar">
      <img src="./utm-mjiit-logo.png" alt="UTM-MJIIT Logo" className="logo" />
      <ul>
        {isAuthenticated && (
          <>
            <li>
              <NavLink
                to="/club-organizer/dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/club-organizer/add-event"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Add Event
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/club-organizer/track-event"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Track Event
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/club-organizer/profile"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Profile
              </NavLink>
            </li>
          </>
        )}
      </ul>
      {isAuthenticated && (
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  );
};

export default Sidebar;
