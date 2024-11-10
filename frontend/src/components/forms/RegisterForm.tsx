import React from "react";

import { FaUser, FaLock, FaUserSecret } from "react-icons/fa";
import { MdOutlineDriveFileRenameOutline, MdEmail } from "react-icons/md";

import { Link } from "react-router-dom";

const RegisterForm = () => {
    return (
        <div className="form-page">
            <div className="form-wrapper">
                <div className="form-content">
                    <form>
                        <h1 className="form-title">Sign up</h1>
                        <div className="form-input-box">
                            <div className="form-icon"><MdOutlineDriveFileRenameOutline/></div>
                            <input
                                type="text"
                                placeholder="First name"
                                className="form-input"
                                name="firstName"
                                required
                            />
                        </div>
                        <div className="form-input-box">
                            <div className="form-icon"><MdOutlineDriveFileRenameOutline/></div>
                            <input
                                type="text"
                                placeholder="Last name"
                                className="form-input"
                                name="lastName"
                                required
                            />
                        </div>
                        <div className="form-input-box">
                            <div className="form-icon"><MdEmail/></div>
                            <input
                                type="text"
                                placeholder="Email"
                                className="form-input"
                                name="email"
                                required
                            />
                        </div>
                        <div className="form-input-box">
                            <div className="form-icon"><FaUser/></div>
                            <input
                                type="text"
                                placeholder="Username"
                                className="form-input"
                                name="username"
                                required
                            />
                        </div>
                        <div className="form-input-box">
                            <div className="form-icon"><FaLock/></div>
                            <input
                                type="text"
                                placeholder="Password"
                                className="form-input"
                                name="password"
                                required
                            />
                        </div>
                        <div className="form-input-box">
                            <div className="form-icon"><FaUserSecret/></div>
                            <input
                                type="text"
                                placeholder="Admin code (optional)"
                                className="form-input"
                                name="password"
                            />
                        </div>
                        <button type="submit" className="form-button">Register</button>
                        <div className="forward">
                            <p>Already have an account? <Link to="/login" className="form-link">Login</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;