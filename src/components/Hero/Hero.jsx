import React from 'react'
import HeroRight from '../../assets/heroright.svg'
import './Hero.css'
import Container from '../../sturcutre/Container/Container'

const Hero = () => {
    return (
        <div className="hero">
            <div className="hero-background">
                <div className="animated-circle circle-1"></div>
                <div className="animated-circle circle-2"></div>
                <div className="animated-circle circle-3"></div>
            </div>
            <Container>
                <div className="hero-inner">
                    <div className="hero-left">
                        <div className="hero-left-text">
                            <div className="hero-badge">
                                <span className="badge-icon">⭐</span>
                                Premium Biodata Service
                            </div>
                            <h1 className='hero-left-text-heading'>
                                <span className="highlight animate-text">GET YOUR CUSTOMIZED</span> TRADITIONAL 
                                <span className="gradient-text animate-gradient"> BIO-DATA</span> FROM EXPERTS.
                            </h1>
                            <h2 className='hero-left-text-subheading'>
                                YOUR SATISFACTION COMES FIRST, PAY US ONLY WHEN YOU'RE HAPPY.
                            </h2>
                            <div className="hero-buttons">
                                <button className="primary-btn">
                                    Get Started
                                    <span className="btn-shine"></span>
                                </button>
                                <button className="secondary-btn">
                                    Learn More
                                    <span className="btn-arrow">→</span>
                                </button>
                            </div>
                            <div className="hero-stats">
                                <div className="stat-item">
                                    <span className="stat-number">500+</span>
                                    <span className="stat-label">Happy Clients</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">100%</span>
                                    <span className="stat-label">Satisfaction</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hero-right">
                        <div className="image-wrapper">
                            <img src={HeroRight} alt="Biodata Template" />
                            <div className="floating-card card-1">
                                <span>✨ Premium Templates</span>
                            </div>
                            <div className="floating-card card-4">
                                <span>✨ Traditional Biodata</span>
                            </div>
                            <div className="floating-card card-2">
                                <span>🎯 100% Satisfaction</span>
                            </div>
                            <div className="floating-card card-3">
                                <span>🚀 Quick Delivery</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Hero