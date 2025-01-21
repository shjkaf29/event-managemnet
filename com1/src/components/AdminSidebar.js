import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/pending-approvals', label: 'Pending Approvals' },
    { path: '/admin/profile', label: 'Profile' },
  ];

  const handleLogout = () => {
    navigate('/admin-login');
  };

  return (
    <aside className="sidebar">
      <h2>Admin Menu</h2>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.path}
              onClick={() => navigate(item.path)}
              className={location.pathname === item.path ? 'active' : ''}
            >
              {item.label}
            </li>
          ))}
          <li onClick={handleLogout} className="logout-button">
            Logout
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
