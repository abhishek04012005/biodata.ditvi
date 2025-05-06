import React, { useState } from 'react'
import './WhyUs.css'
import Container from '../../sturcutre/Container/Container'
import Heading from '../../sturcutre/Heading/Heading'

const whyUsData = [
    {
        id: 1,
        title: "Professional Design",
        description: "Expertly crafted traditional biodata designs that leave a lasting impression",
        icon: "🎨",
        hoverBg: "#FFE5D9",
        animationDelay: "0s"
    },
    {
        id: 2,
        title: "Cultural Touch",
        description: "Preserving traditional values with modern presentation styles",
        icon: "🏛️",
        hoverBg: "#FFD9D9",
        animationDelay: "0.2s"
    },
    {
        id: 3,
        title: "Quick Delivery",
        description: "Fast turnaround time without compromising on quality",
        icon: "⚡",
        hoverBg: "#FFE0D9",
        animationDelay: "0.4s"
    },
    {
        id: 4,
        title: "100% Satisfaction",
        description: "Pay only when you're completely satisfied with the result",
        icon: "✨",
        hoverBg: "#FFD9E5",
        animationDelay: "0.6s"
    }
];

const WhyUs = () => {
    const [activeId, setActiveId] = useState(null);

    return (
        <section className="whyus" id="whyus">
            <div className="whyus-background">
                <div className="animated-circle circle-1"></div>
                <div className="animated-circle circle-2"></div>
            </div>
            <Container>
                <div className="whyus-inner">



                    <div className="section-header-h">
                        <div className="header-design">
                            <span className="design-element"></span>
                            <Heading title="Why Us?" />
                            <span className="design-element"></span>
                        </div>
                        <p className="section-subtitle">
                            <p className="subtitle">Create lasting impressions with our expertly crafted traditional biodata designs</p>
                        </p>
                    </div>
                    <div className="whyus-grid">
                        {whyUsData.map((item) => (
                            <div
                                className={`whyus-card ${activeId === item.id ? 'active' : ''}`}
                                key={item.id}
                                onMouseEnter={() => setActiveId(item.id)}
                                onMouseLeave={() => setActiveId(null)}
                                style={{
                                    '--hover-bg': item.hoverBg,
                                    '--animation-delay': item.animationDelay
                                }}
                            >
                                <div className="card-icon">
                                    <span>{item.icon}</span>
                                </div>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                                <div className="card-overlay"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default WhyUs