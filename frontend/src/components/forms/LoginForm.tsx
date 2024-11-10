import React from "react";

import { FaUser, FaLock } from "react-icons/fa";

import { Link } from "react-router-dom";

const LoginForm = () => {
    return (
        <div className="form-page">
            <div className="form-wrapper">
                <div className="form-content">
                    <form action="">
                        <h1 className="form-title">Sign in</h1>
                        <div className="form-input-box">
                            <div className="form-icon"><FaUser/></div>
                            <input type="text" placeholder="Username" className="form-input" required/>
                        </div>
                        <div className="form-input-box">
                            <div className="form-icon"><FaLock/></div>
                            <input type="text" placeholder="Password" className="form-input" required/>
                        </div>
                        <label className="form-label">
                            <input type="checkbox" className="form-input"/>
                            <span className="remember-me">Remember me</span>
                        </label>
                        <div className="forgot-password">
                            <Link to="/forgot-password" className="form-link">Forgot password?</Link>
                        </div>
                        <button type="submit" className="form-button">Login</button>
                        <div className="forward">
                            <p>Don't have an account? <Link to="/register" className="form-link">Register</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;