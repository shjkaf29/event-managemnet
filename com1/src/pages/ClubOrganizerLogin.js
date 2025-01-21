import React, { useState } from 'react';
import './ClubOrganizerLogin.css';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase'; // Ensure db is imported for Firestore
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // To save user data in Firestore

const ClubOrganizerLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const handleAction = async () => {
        try {
            if (isForgotPassword) {
                // Forgot Password Logic
                await sendPasswordResetEmail(auth, email);
                alert('Password reset link sent to your email.');
                setIsForgotPassword(false); // Go back to login
            } else if (isSignUp) {
                // Signup Logic
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Save user details to Firestore
                await setDoc(doc(db, 'club-organizers', user.uid), {
                    email: user.email,
                    role: 'Club Organizer', // Add any additional role or metadata
                    createdAt: new Date().toISOString(),
                });

                alert('Account created successfully! Please log in.');
                setIsSignUp(false); // Switch to login mode after signup
            } else {
                // Login Logic
                await signInWithEmailAndPassword(auth, email, password);
                navigate('/club-organizer/dashboard'); // Redirect to dashboard
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="club-organizer-login">
            <div className="club-container">
                <h1>
                    {isForgotPassword
                        ? 'Forgot Password'
                        : isSignUp
                        ? 'Sign Up'
                        : 'Club Organizer Login'}
                </h1>
                {error && <p style={{ color: 'red', fontSize: '0.9em', margin: '10px 0' }}>{error}</p>}

                {!isForgotPassword && (
                    <>
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
                    </>
                )}

                {isForgotPassword && (
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
                )}

                <button className="club-login-button" onClick={handleAction}>
                    {isForgotPassword
                        ? 'Reset Password'
                        : isSignUp
                        ? 'Sign Up'
                        : 'Login'}
                </button>

                <p
                    style={{
                        fontSize: '0.9em',
                        marginTop: '10px',
                        cursor: 'pointer',
                        color: '#007BFF',
                        textDecoration: 'underline',
                    }}
                    onClick={() => {
                        if (isForgotPassword) {
                            setIsForgotPassword(false);
                        } else {
                            setIsSignUp(!isSignUp);
                            setError('');
                        }
                    }}
                >
                    {isForgotPassword
                        ? 'Back to Login'
                        : isSignUp
                        ? 'Already have an account? Log in here.'
                        : "Don't have an account? Sign up here."}
                </p>

                {!isSignUp && !isForgotPassword && (
                    <p
                        style={{
                            fontSize: '0.9em',
                            marginTop: '10px',
                            cursor: 'pointer',
                            color: '#007BFF',
                            textDecoration: 'underline',
                        }}
                        onClick={() => {
                            setIsForgotPassword(true);
                            setError('');
                        }}
                    >
                        Forgot Password?
                    </p>
                )}

                <button
                    className="back-to-login-btn"
                    onClick={() => navigate('/login')}
                    style={{
                        marginTop: '15px',
                        padding: '10px',
                        backgroundColor: '#f1f1f1',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1em',
                    }}
                >
                    Back to Login Dashboard
                </button>
            </div>
        </div>
    );
};

export default ClubOrganizerLogin;
