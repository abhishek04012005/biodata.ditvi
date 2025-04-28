import React, { useState } from 'react'
import './HowWeWork.css'
import { Grid } from '@mui/material'
import Container from '../../sturcutre/Container/Container'
import Heading from '../../sturcutre/Heading/Heading'

const steps = [
    {
        number: 1,
        title: "Select & Submit",
        steps: [
            "SELECT A DESIGN WHICH YOU LIKE, CLICK ON GET NOW BUTTON.",
            "FILL YOUR NAME, WHATSAPP NUMBER AND SUBMIT IT.",
            "YOU WILL RECIVE A LINK FROM US TO SHARE YOUR BIODATA DETAILS ON YOUR WHATSAPP."
        ],
        icon: "🎨"
    },
    {
        number: 2,
        title: "Review & Approve",
        steps: [
            "FILL YOUR DETAILS AND SUBMIT IT TO US.",
            "YOU WILL RECEIVE CUSTOMIZED TRADITIONAL BIODATA WITH WATERMARK.",
            "ENSURE YOU ARE SATISFIED WITH BIODATA."
        ],
        icon: "✨"
    },
    {
        number: 3,
        title: "Pay & Download",
        steps: [
            `TEXT US, "I AM SATISFIED".`,
            "WE WILL SEND YOU A PAYMENT LINK.",
            "AFTER SUCCESSFULL PAYMENT, YOU WILL RECIEVE YOUR BIODATA WITHOUT WATERMARK."
        ],
        icon: "🚀"
    }
];

const HowWeWork = () => {
    const [activeStep, setActiveStep] = useState(null);

    return (
        <section className="how-we-work">
            <div className="how-we-work-background">
                <div className="animated-circle circle-1"></div>
                <div className="animated-circle circle-2"></div>
            </div>
            <Container>

                <div className="section-header">
                    <div className="header-design">
                        <span className="design-element"></span>
                        <Heading title="How We work" />
                        <span className="design-element"></span>
                    </div>
                    <p className="section-subtitle">
                        <p className="subtitle">Simple steps to get your traditional biodata</p>
                    </p>
                </div>
                
                <div className="process-timeline">
                    <div className="timeline-line"></div>
                    <Grid container spacing={4}>
                        {steps.map((step, index) => (
                            <Grid size={{ xs: 12, md: 4 }} key={step.number}>
                                <div
                                    className={`process-step ${activeStep === index ? 'active' : ''}`}
                                    onMouseEnter={() => setActiveStep(index)}
                                    onMouseLeave={() => setActiveStep(null)}
                                >
                                    <div className="step-icon">
                                        <span className="icon">{step.icon}</span>
                                        <span className="number">{step.number}</span>
                                    </div>
                                    <h3 className="step-title">{step.title}</h3>
                                    <div className="step-content">
                                        <ul>
                                            {step.steps.map((text, i) => (
                                                <li key={i}>{text}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </Container>
        </section>
    )
}

export default HowWeWork