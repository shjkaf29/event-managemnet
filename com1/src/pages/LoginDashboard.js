import React from 'react';
import './LoginDashboard.css';
import { useNavigate } from 'react-router-dom';

const LoginDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="login-dashboard">
            <div className="login-container">
                <h1>Login</h1>
                <button className="login-button" onClick={() => navigate('/admin-login')}>Admin</button>
                <button className="login-button" onClick={() => navigate('/club-organizer-login')}>Club Organizer</button>

                <button
                    className="back-to-home-btn"
                    onClick={() => navigate('/')}
                    style={{
                        marginTop: '15px',
                        padding: '10px',
                        backgroundColor: '#f1f1f1',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1em',
                    }}
                >
                    Back to Public Home Page
                </button>
            </div>
        </div>
    );
};

export default LoginDashboard;
