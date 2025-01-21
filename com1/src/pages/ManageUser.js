//com1/src/pages/ManageUser.js

import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import './ManageUser.css';

const ManageUser = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [newAdmin, setNewAdmin] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleAddAdmin = (e) => {
        e.preventDefault();
        // Handle adding new admin logic here
        console.log('Adding new admin:', newAdmin);
        setShowAddModal(false);
        setNewAdmin({ name: '', email: '', password: '' });
    };

    const handleDeleteAdmin = (adminId) => {
        if (window.confirm('Are you sure you want to delete this admin?')) {
            // Handle delete logic here
            console.log('Deleting admin:', adminId);
        }
    };

    const handleContactAdmin = (adminEmail) => {
        window.location.href = `mailto:${adminEmail}`;
    };

    return (
        <AdminLayout>
            <div className="manage-users-container">
                <div className="header-section">
                    <h1>Manage Administrators</h1>
                    <button 
                        className="add-admin-btn"
                        onClick={() => setShowAddModal(true)}
                    >
                        + Add New Administrator
                    </button>
                </div>

                <div className="admin-cards-container">
                    {/* Current User's Admin Card */}
                    <div className="admin-card">
                        <img src="/api/placeholder/80/80" alt="Admin1" className="admin-avatar" />
                        <div className="admin-info">
                            <h2>Admin1 <span className="current-user-badge">You</span></h2>
                            <p>admin1@utm.my</p>
                            <p className="admin-role">Super Administrator</p>
                        </div>
                    </div>

                    {/* Other Admin Card */}
                    <div className="admin-card">
                        <img src="/api/placeholder/80/80" alt="Admin2" className="admin-avatar" />
                        <div className="admin-info">
                            <h2>Admin2</h2>
                            <p>admin2@utm.my</p>
                            <p className="admin-role">Administrator</p>
                        </div>
                        <div className="admin-actions">
                            <button 
                                className="contact-btn"
                                onClick={() => handleContactAdmin('admin2@utm.my')}
                            >
                                Contact
                            </button>
                            <button 
                                className="delete-btn"
                                onClick={() => handleDeleteAdmin(2)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                {/* Add New Admin Modal */}
                {showAddModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Add New Administrator</h2>
                            <form onSubmit={handleAddAdmin}>
                                <div className="form-group">
                                    <label>Name:</label>
                                    <input
                                        type="text"
                                        value={newAdmin.name}
                                        onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        value={newAdmin.email}
                                        onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Password:</label>
                                    <input
                                        type="password"
                                        value={newAdmin.password}
                                        onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button type="submit" className="add-btn">Add Administrator</button>
                                    <button 
                                        type="button" 
                                        className="cancel-btn"
                                        onClick={() => setShowAddModal(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ManageUser;