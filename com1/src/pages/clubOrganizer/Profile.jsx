import React, { useState, useEffect } from "react";
import { auth } from "../../config/firebase";
import { updatePassword, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from "./Sidebar.jsx";
import "./Profile.css";

const BASE_URL = 'http://localhost:5001';
const API_URL = `${BASE_URL}/api`;

const Profile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [profilePic, setProfilePic] = useState('https://via.placeholder.com/150');
    const [uploadLoading, setUploadLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        phone: '',
        department: ''
    });
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [success, setSuccess] = useState('');

    const fetchProfile = async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/profile/${userId}`);
            if (response.data.success) {
                const { name, phone, department, profilePicture } = response.data.profile;
                setProfileData({ name, phone, department });
                if (profilePicture) {
                    setProfilePic(`${BASE_URL}${profilePicture}`);
                }
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile data');
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                navigate('/club-organizer/login');
                return;
            }
            setEmail(user.email);
            await fetchProfile(user.uid);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            setError('Please upload a JPG or PNG image');
            return;
        }

        try {
            setUploadLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append('profilePicture', file);
            formData.append('userId', auth.currentUser.uid);

            const response = await axios.post(
                `${API_URL}/profile/upload-picture`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                await fetchProfile(auth.currentUser.uid);
                setSuccess('Profile picture updated successfully!');
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload profile picture');
        } finally {
            setUploadLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess('');

        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Please login again');

            const response = await axios.post(`${API_URL}/profile/update`, {
                userId: user.uid,
                email: user.email,
                ...profileData
            });

            if (response.data.success) {
                setSuccess('Profile updated successfully');
                setIsEditing(false);
                await fetchProfile(user.uid);
            }
        } catch (err) {
            setError('Failed to update profile');
            console.error(err);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess('');

        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Please login again');

            if (passwordData.newPassword !== passwordData.confirmPassword) {
                throw new Error('Passwords do not match');
            }

            await updatePassword(user, passwordData.newPassword);
            setSuccess('Password updated successfully');
            setPasswordData({ newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <div className="profile-container">
                    <div className="loading">Loading profile...</div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div className="profile-container">
                <div className="profile-card">
                    <h1>My Profile</h1>
                    
                    <div className="profile-image-section">
                        <img 
                            src={profilePic} 
                            alt="Profile" 
                            className="profile-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/150';
                            }}
                        />
                        <div className="upload-section">
                            <input
                                type="file"
                                id="profile-upload"
                                accept="image/jpeg,image/png"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                            <label 
                                htmlFor="profile-upload" 
                                className="upload-button"
                                style={{ opacity: uploadLoading ? 0.5 : 1 }}
                            >
                                {uploadLoading ? 'Uploading...' : 'Change Picture'}
                            </label>
                        </div>
                    </div>

                    <div className="profile-info">
                        {isEditing ? (
                            <form onSubmit={handleProfileUpdate} className="edit-form">
                                <div className="form-group">
                                    <label>Name:</label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({
                                            ...profileData,
                                            name: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone:</label>
                                    <input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({
                                            ...profileData,
                                            phone: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Department:</label>
                                    <input
                                        type="text"
                                        value={profileData.department}
                                        onChange={(e) => setProfileData({
                                            ...profileData,
                                            department: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="button-group">
                                    <button type="submit" className="save-btn">Save Changes</button>
                                    <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="profile-details">
                                <p><strong>Email:</strong> {email}</p>
                                <p><strong>Name:</strong> {profileData.name}</p>
                                <p><strong>Phone:</strong> {profileData.phone}</p>
                                <p><strong>Department:</strong> {profileData.department}</p>
                                <button onClick={() => setIsEditing(true)} className="edit-btn">
                                    Edit Profile
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="password-section">
                        <h3>Change Password</h3>
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="form-group">
                                <label>New Password:</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({
                                        ...passwordData,
                                        newPassword: e.target.value
                                    })}
                                    minLength={6}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm Password:</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({
                                        ...passwordData,
                                        confirmPassword: e.target.value
                                    })}
                                    minLength={6}
                                    required
                                />
                            </div>
                            <button type="submit" className="change-password-btn">
                                Change Password
                            </button>
                        </form>
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                </div>
            </div>
        </div>
    );
};

export default Profile;