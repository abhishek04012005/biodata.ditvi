import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import Logo from '../../assets/logo.png';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import WorkIcon from '@mui/icons-material/Work';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import ArticleIcon from '@mui/icons-material/Article';
import ContactMailIcon from '@mui/icons-material/ContactMail';

const navLinks = [
    { id: '', label: 'HOME', icon: <HomeIcon /> },
    { id: 'whyus', label: 'WHY US?', icon: <InfoIcon /> },
    { id: 'how-we-work', label: 'HOW WE WORK', icon: <WorkIcon /> },
    {
        id: '',
        label: 'SERVICES',
        icon: <DesignServicesIcon />,
        subMenu: [
            { id: 'for-bride', label: 'FOR BRIDE' },
            { id: 'for-groom', label: 'FOR GROOM' }
        ]
    },
    { id: 'blog-section', label: 'BLOG', icon: <ArticleIcon /> },
    { id: 'contact-section', label: 'CONTACT', icon: <ContactMailIcon /> }
];

const Navbar = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeLink, setActiveLink] = useState('');
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleWhatsAppClick = () => {
        const message = encodeURIComponent(
            "Hello Ditvi Biodata,\nI want to learn more about your services.\n\nThank You :)"
        );
        window.open(`https://wa.me/919263767441?text=${message}`, '_blank');
    };

    return (
        <>
            <nav className={`navbar-container ${isScrolled ? 'navbar-scrolled' : ''}`}>
                <div className="navbar-background"></div>
                <div className="navbar-inner">
                    <Link to="/" className="navbar-logo">
                        <img src={Logo} alt="Ditvi Biodata Logo" className="navbar-logo-img" />
                        <span className="navbar-logo-shine"></span>
                    </Link>

                    <div className={`navbar-menu ${isMobile ? 'navbar-menu-active' : ''}`}>
                        <ul className="navbar-list">
                            {navLinks.map((link) => (
                                <li 
                                    key={link.id} 
                                    className={`navbar-item ${activeLink === link.id ? 'navbar-item-active' : ''}`}
                                    onMouseEnter={() => setActiveDropdown(link.id)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    {isHomePage && !link.subMenu ? (
                                        <ScrollLink
                                            to={link.id}
                                            className="navbar-link"
                                            smooth={true}
                                            duration={500}
                                            offset={-70}
                                            spy={true}
                                            onClick={() => {
                                                setIsMobile(false);
                                                setActiveLink(link.id);
                                            }}
                                        >
                                            <span className="navbar-link-icon">{link.icon}</span>
                                            <span className="navbar-link-text">{link.label}</span>
                                            {link.subMenu && (
                                                <KeyboardArrowDownIcon className="navbar-arrow" />
                                            )}
                                            <span className="navbar-link-decoration"></span>
                                        </ScrollLink>
                                    ) : (
                                        <Link
                                            to={`/${link.id}`}
                                            className="navbar-link"
                                            onClick={() => {
                                                setIsMobile(false);
                                                setActiveLink(link.id);
                                            }}
                                        >
                                            <span className="navbar-link-icon">{link.icon}</span>
                                            <span className="navbar-link-text">{link.label}</span>
                                            {link.subMenu && (
                                                <KeyboardArrowDownIcon className="navbar-arrow" />
                                            )}
                                            <span className="navbar-link-decoration"></span>
                                        </Link>
                                    )}

                                    {link.subMenu && (
                                        <ul className={`navbar-dropdown ${activeDropdown === link.id ? 'navbar-dropdown-active' : ''}`}>
                                            {link.subMenu.map((subItem) => (
                                                <li key={subItem.id} className="navbar-dropdown-item">
                                                    <Link 
                                                        to={`/${subItem.id}`}
                                                        className="navbar-dropdown-link"
                                                        onClick={() => setIsMobile(false)}
                                                    >
                                                        {subItem.label}
                                                        <span className="navbar-dropdown-decoration"></span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button
                        className="navbar-toggle"
                        onClick={() => setIsMobile(!isMobile)}
                        aria-label="Toggle menu"
                    >
                        <span className={`navbar-hamburger ${isMobile ? 'navbar-hamburger-active' : ''}`}></span>
                    </button>
                </div>
            </nav>

            <button className="navbar-whatsapp" onClick={handleWhatsAppClick}>
                <WhatsAppIcon className="navbar-whatsapp-icon" />
                <div className="navbar-whatsapp-ripple"></div>
                <span className="navbar-whatsapp-tooltip">Chat with us</span>
            </button>
        </>
    );
};

export default Navbar;