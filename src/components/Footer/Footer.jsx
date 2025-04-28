import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import './Footer.css';
import Logo from '../../assets/logo.png';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    return (

        <footer className="footer">
            <div className="footer-background">
                <div className="footer-circle circle-1"></div>
                <div className="footer-circle circle-2"></div>
            </div>

            <div className="footer-content">
                <div className="footer-main">
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <img src={Logo} alt="Ditvi Biodata Logo" />
                        </Link>
                        <p className="footer-description">
                            Creating lasting impressions with our expertly crafted traditional biodata designs.
                        </p>
                        <div className="footer-social">
                            <a href="https://whatsapp.com" className="footer-social-link whatsapp">
                                <WhatsAppIcon />
                            </a>
                            <a href="https://instagram.com" className="footer-social-link instagram">
                                <InstagramIcon />
                            </a>
                            <a href="https://facebook.com" className="footer-social-link facebook">
                                <FacebookIcon />
                            </a>
                            <a href="https://twitter.com" className="footer-social-link twitter">
                                <TwitterIcon />
                            </a>
                            <a href="https://linkedin.com" className="footer-social-link linkedin">
                                <LinkedInIcon />
                            </a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <div className="footer-section">
                            <h3 className="footer-title">Quick Links</h3>
                            <ul className="footer-list">
                                <li>
                                    {isHomePage ? (
                                        <ScrollLink
                                            to="hero"
                                            spy={true}
                                            smooth={true}
                                            offset={-70}
                                            duration={500}
                                            className="footer-link"
                                            activeClass="active"
                                        >
                                            Home
                                        </ScrollLink>
                                    ) : (
                                        <Link to="/" className="footer-link">Home</Link>
                                    )}
                                </li>
                                <li>
                                    {isHomePage ? (
                                        <ScrollLink
                                            to="whyus"
                                            spy={true}
                                            smooth={true}
                                            offset={-70}
                                            duration={500}
                                            className="footer-link"
                                            activeClass="active"
                                        >
                                            Why Us
                                        </ScrollLink>
                                    ) : (
                                        <Link to="/whyus" className="footer-link">Why Us</Link>
                                    )}
                                </li>
                                <li>
                                    {isHomePage ? (
                                        <ScrollLink
                                            to="how-we-work"
                                            spy={true}
                                            smooth={true}
                                            offset={-70}
                                            duration={500}
                                            className="footer-link"
                                            activeClass="active"
                                        >
                                            How We Work
                                        </ScrollLink>
                                    ) : (
                                        <Link to="/how-we-work" className="footer-link">How We Work</Link>
                                    )}
                                </li>
                                <li>

                                    {isHomePage ? (
                                        <ScrollLink
                                            to="blog-section"
                                            spy={true}
                                            smooth={true}
                                            offset={-70}
                                            duration={500}
                                            className="footer-link"
                                            activeClass="active"
                                        >
                                            Blog
                                        </ScrollLink>
                                    ) : (
                                        <Link to="/blog" className="footer-link">How We Work</Link>
                                    )}
                                </li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h3 className="footer-title">Services</h3>
                            <ul className="footer-list">
                                <li><Link to="/for-bride" className="footer-link">For Bride</Link></li>
                                <li><Link to="/for-groom" className="footer-link">For Groom</Link></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h3 className="footer-title">Contact Info</h3>
                            <ul className="footer-list">
                                <li className="footer-contact-item">
                                    <PhoneIcon className="footer-icon" />
                                    <a href="tel:+919263767441" className="footer-link">+91 9263767441</a>
                                </li>
                                <li className="footer-contact-item">
                                    <EmailIcon className="footer-icon" />
                                    <a href="mailto:contact@ditvibiodata.com" className="footer-link">care@ditvi.org</a>
                                </li>
                                <li className="footer-contact-item">
                                    <LocationOnIcon className="footer-icon" />
                                    <span className="footer-text">Thane, Maharashtra, India</span>
                                </li>
                            </ul>
                        </div>




                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-copyright">
                        <p>Ditvi Biodata is a unit of <strong>Ditvi Foundation</strong> | © {new Date().getFullYear()} Ditvi Biodata. All rights reserved.</p>
                    </div>
                    <div className="footer-legal">
                        <Link to="/privacy" className="footer-legal-link">Privacy Policy</Link>
                        <Link to="/terms" className="footer-legal-link">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;