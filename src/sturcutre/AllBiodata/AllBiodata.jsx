import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import Container from '../../sturcutre/Container/Container';
import Heading from '../../sturcutre/Heading/Heading';
import GetNowPopUp from '../../sturcutre/GetNowPopUp/GetNowPopUp';
import './AllBiodata.css';
import biodataList from '../../JSON/biodataContent';
import { languageEnglish, modelTypeProfessional } from '../../JSON/formConstant';

const BiodataCard = ({ data, isHovered, onHover, onLeave, onGetNow, onPreview }) => (
    <div 
        className={`allbiodata-card ${isHovered ? 'allbiodata-card-hovered' : ''}`}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
    >
        <div className="allbiodata-card-inner">
            <div className="allbiodata-card-media">
                <img src={data.image} alt={data.title} loading="lazy" />
                <div className="allbiodata-card-premium">Premium</div>
                <div className="allbiodata-card-discount">
                    <span className="allbiodata-card-discount-value">{data.discount}%</span>
                    <span className="allbiodata-card-discount-label">OFF</span>
                </div>
                <div className="allbiodata-card-overlay">
                    <div className="allbiodata-card-overlay-content">
                        <span className="allbiodata-model-label">Model No.</span>
                        <h3 className="allbiodata-model-name">{data.modelName}</h3>
                        <div className="allbiodata-rating">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} className="allbiodata-star" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="allbiodata-card-content">
                <h3 className="allbiodata-content-title">{data.title}</h3>
                
                <div className="allbiodata-price-section">
                    <div className="allbiodata-price-wrapper">
                        <span className="allbiodata-price-original">₹{data.originalPrice}</span>
                        <span className="allbiodata-price-final">₹{data.discountedPrice}</span>
                    </div>
                </div>

                <div className="allbiodata-buttons">
                    <button className="allbiodata-btn-primary" onClick={onGetNow}>
                        <ShoppingCartIcon />
                        <span>Get Now</span>
                        <div className="allbiodata-btn-shine"></div>
                    </button>
                    <button className="allbiodata-btn-secondary" onClick={onPreview}>
                        <VisibilityIcon />
                        <span>Preview</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const AllBiodata = () => {
    const navigate = useNavigate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState('');
    const [hoveredCard, setHoveredCard] = useState(null);

    return (
        <section className="allbiodata-section">
            <div className="allbiodata-background">
                <div className="allbiodata-circle circle-1"></div>
                <div className="allbiodata-circle circle-2"></div>
            </div>
            
            <Container>
                <div className="allbiodata-header">
                    <div className="allbiodata-header-design">
                        <span className="allbiodata-design-element"></span>
                        <Heading title="Biodata" />
                        <span className="allbiodata-design-element"></span>
                    </div>
                    <p className="allbiodata-subtitle">
                        Explore our complete collection of premium biodata designs
                    </p>
                </div>

                <div className="allbiodata-grid">
                    {biodataList.map((biodata) => (
                        <BiodataCard 
                            key={biodata.id}
                            data={biodata}
                            isHovered={hoveredCard === biodata.id}
                            onHover={() => setHoveredCard(biodata.id)}
                            onLeave={() => setHoveredCard(null)}
                            onGetNow={() => {
                                setSelectedModel(biodata.modelName);
                                setIsPopupOpen(true);
                            }}
                            onPreview={() => navigate(`/biodata/${biodata.modelName}`, { 
                                state: { biodata } 
                            })}
                        />
                    ))}
                </div>
            </Container>

            <GetNowPopUp
                isOpen={isPopupOpen}
                onClose={() => {
                    setIsPopupOpen(false);
                    setSelectedModel('');
                }}
                modelNumber={selectedModel}
                language={languageEnglish}
                modelType={modelTypeProfessional}
            />
        </section>
    );
};

export default AllBiodata;