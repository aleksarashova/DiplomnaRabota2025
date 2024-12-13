import React from 'react';
import "./footer.css";

import { Link } from 'react-router-dom';

import { FaSquareInstagram } from "react-icons/fa6";
import { FaLinkedin, FaPinterest, FaTwitterSquare, FaFacebook } from "react-icons/fa";
import { TfiEmail } from "react-icons/tfi";

const Footer = () => {
    return (
        <div className="footer">
            <div className="footerLinks">
                <h2 className="footerLinksTitle">Go to</h2>
                <Link to="/" className="footerLink">Home</Link>
                <Link to="/login" className="footerLink">Login</Link>
                <Link to="/register" className="footerLink">Register</Link>
            </div>
            <div className="leftPart">
                <h1 className="footerTitle">Get in Touch</h1>
                <p className="footerText">
                    Explore the art of cooking with us!<br/>
                    Join our community of food lovers and discover recipes that inspire creativity and bring people
                    together.
                </p>
                <ul className="contactButtons">
                    <li>
                        <Link to="/">
                            <FaSquareInstagram className="contactIcon"/>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <FaLinkedin className="contactIcon"/>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <FaPinterest className="contactIcon"/>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <FaFacebook className="contactIcon"/>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <FaTwitterSquare className="contactIcon"/>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="rightPart">
                <div className="contactButtons" id="emailButton">
                    <Link to="/">
                        <TfiEmail className="contactIcon"/>
                    </Link>
                    <div className="emailAddress">contact@example.org</div>
                </div>
            </div>
        </div>
    );
}

export default Footer;