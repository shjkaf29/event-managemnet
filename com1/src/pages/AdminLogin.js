import React, { useState } from 'react';
import './AdminLogin.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase'; // Adjust the path as necessary
import { signInWithEmailAndPassword } from 'firebase/auth';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="admin-login">
            <div className="admin-container">
                <h1>Admin Login</h1>
                {error && <p style={{ color: 'red', fontSize: '0.9em', margin: '10px 0' }}>{error}</p>}
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        display: 'block',
                        width: '100%',
                        padding: '10px',
                        margin: '10px 0',
                        fontSize: '1em',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                    }}
                />
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        display: 'block',
                        width: '100%',
                        padding: '10px',
                        margin: '10px 0',
                        fontSize: '1em',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                    }}
                />
                <button className="login-button" onClick={handleLogin}>
                    Login
                </button>

                {/* Back to Login Dashboard Button */}
                <button
                    className="back-to-login-dashboard"
                    onClick={() => navigate('/login')}
                    style={{
                        marginTop: '10px',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #ccc',
                        cursor: 'pointer',
                    }}
                >
                    Back to Login Dashboard
                </button>
            </div>
        </div>
    );
};

export default AdminLogin;
