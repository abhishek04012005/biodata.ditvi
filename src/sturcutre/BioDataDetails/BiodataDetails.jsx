import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BiodataDetails.css';
import Container from '../Container/Container';
import GetNowPopUp from '../GetNowPopUp/GetNowPopUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DescriptionIcon from '@mui/icons-material/Description';
import StarIcon from '@mui/icons-material/Star';

const BiodataDetails = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState('');
    const [imageLoaded, setImageLoaded] = useState(false);
    const { state } = useLocation();
    const navigate = useNavigate();
    const { biodata } = state || {};

    if (!biodata) {
        navigate('/');
        return null;
    }

    const handleGetNow = (modelNumber) => {
        setSelectedModel(modelNumber);
        setIsPopupOpen(true);
    };

    return (
        <section className="biodatadetails-section">
            <div className="biodatadetails-background">
                <div className="biodatadetails-circle circle-1"></div>
                <div className="biodatadetails-circle circle-2"></div>
            </div>
            
            <Container>
                <div className="biodatadetails-inner">
                    <div className="biodatadetails-header">
                        <h1 className="biodatadetails-title">{biodata.title}</h1>
                        <button 
                            onClick={() => navigate(-1)} 
                            className="biodatadetails-back"
                        >
                            <ArrowBackIcon />
                            <span>Back</span>
                        </button>
                    </div>
                    
                    <div className="biodatadetails-content">
                        <div className="biodatadetails-image-wrapper">
                            <div className={`biodatadetails-image ${imageLoaded ? 'loaded' : ''}`}>
                                <img 
                                    src={biodata.image} 
                                    alt={biodata.modelName} 
                                    onLoad={() => setImageLoaded(true)}
                                />
                                <div className="biodatadetails-tags">
                                    <span className="biodatadetails-premium">Premium</span>
                                    <span className="biodatadetails-discount">
                                        <LocalOfferIcon />
                                        {biodata.discount}% OFF
                                    </span>
                                </div>
                            </div>
                            <div className="biodatadetails-rating">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} className="biodatadetails-star" />
                                ))}
                                <span className="biodatadetails-reviews">(50+ Reviews)</span>
                            </div>
                        </div>
                        
                        <div className="biodatadetails-info">
                            <div className="biodatadetails-model">
                                <h2>Model No: {biodata.modelName}</h2>
                                <div className="biodatadetails-divider"></div>
                            </div>
                            
                            <div className="biodatadetails-price">
                                <div className="biodatadetails-price-original">
                                    <span className="price-label">Original Price:</span>
                                    <span className="price-value">₹{biodata.originalPrice}</span>
                                </div>
                                <div className="biodatadetails-price-final">
                                    <span className="price-label">Final Price:</span>
                                    <span className="price-value">₹{biodata.discountedPrice}</span>
                                </div>
                            </div>

                            <button 
                                className="biodatadetails-cta"
                                onClick={() => handleGetNow(biodata.modelName)}
                            >
                                <ShoppingCartIcon />
                                <span>Get Now</span>
                                <div className="biodatadetails-btn-shine"></div>
                            </button>

                            <div className="biodatadetails-description">
                                <div className="biodatadetails-description-header">
                                    <DescriptionIcon />
                                    <h3>Description</h3>
                                </div>
                                <p className="biodatadetails-description-text">
                                    {biodata.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
            
            <GetNowPopUp
                isOpen={isPopupOpen}
                onClose={() => {
                    setIsPopupOpen(false);
                    setSelectedModel('');
                }}
                modelNumber={selectedModel}
            />
        </section>
    );
};

export default BiodataDetails;