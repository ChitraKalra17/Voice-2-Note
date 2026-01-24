import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email && password) {
            // Store logged-in state
            localStorage.setItem('loggedIn', JSON.stringify({ email, loginTime: new Date().toISOString() }));
            if (onLogin) {
                onLogin({ email });
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>🎤 voice-2-note</h1>
                <h2>Login</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
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
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn-login">
                        Login
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <a href="#signup">Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;