import React, { useState } from 'react';
import './Auth.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const API = import.meta.env.VITE_API_URL;
            console.log('Login: API URL:', API);
            
            if (!API) {
                alert("API URL not configured. Please check .env file");
                return;
            }

            console.log('Login: Attempting login with email:', email);
            const res = await fetch(`${API}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            console.log('Login: Response status:', res.status);
            const data = await res.json();
            console.log('Login: Response data:', data);

            if (data.error) {
                console.error('Login: Server error:', data.error);
                alert(data.error);
                return;
            }

            if (!data.token) {
                console.error('Login: No token in response');
                alert("Login failed: No token received");
                return;
            }

            //store token
            localStorage.setItem("token", data.token);

            //optional: store user
            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            console.log('Login: Success, redirecting to home');
            //redirect to home
            window.location.href = "/";

        } catch (err) {
            console.error('Login: Catch error:', err.message);
            console.error('Login: Full error:', err);
            alert(`Login failed: ${err.message}`);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Voice-2-Note</h1>
                <h2>Login</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="password-input">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    //eye-off icon
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9-7-9-7a18.32 18.32 0 0 1 5.06-5.94M1 1l22 22"/>
                                    </svg>
                                ) : (
                                    //eye icon
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn-login">
                        Login
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <a href="/signup">Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;