import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import HomeIcon from '@mui/icons-material/Home';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import './ThankYou.css';

const ThankYou = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { requestDetails } = location.state || {};
    const [copied, setCopied] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);

    useEffect(() => {
        if (!requestDetails) {
            navigate('/');
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [requestDetails, navigate]);

    const handleCopyRequestNumber = async () => {
        try {
            await navigator.clipboard.writeText(requestDetails.requestNumber);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleWhatsApp = () => {
        const message = encodeURIComponent(
            `Hi Ditvi Biodata,\n\nMy request details:\nRequest No.: ${requestDetails.requestNumber}\nName: ${requestDetails.name}\nModel Type: ${requestDetails.modelType}\nLanguage: ${requestDetails.language}\n\nI'm waiting for further instructions. Thank you!`
        );
        window.open(`https://wa.me/919263767441?text=${message}`, '_blank');
    };

    if (!requestDetails) return null;

    return (
        <div className="thankyou-container fade-in">
            <div className="thankyou-card slide-up">
                <div className="success-icon scale-in">
                    <CheckCircleIcon />
                </div>

                <h1 className="slide-up delay-1">Thank You!</h1>

                <p className="success-message slide-up delay-2">
                    Your biodata has been successfully submitted
                </p>

                <div className="order-details slide-up delay-3">
                    <div className="order-header">
                        <h2>Reuest Details</h2>
                        <div className="order-id-copy">
                            <span>Request No.: {requestDetails.requestNumber}</span>
                            <button 
                                className={`copy-button ${copied ? 'copied' : ''}`}
                                onClick={handleCopyRequestNumber}
                            >
                                <ContentCopyIcon />
                                <span className="tooltip">
                                    {copied ? 'Copied!' : 'Copy Request No.'}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="details-grid">
                        <div className="detail-item">
                            <label>Model Type:</label>
                            <span>{requestDetails.modelType}</span>
                        </div>
                        <div className="detail-item">
                            <label>Language:</label>
                            <span>{requestDetails.language}</span>
                        </div>
                        <div className="detail-item">
                            <label>Name:</label>
                            <span>{requestDetails.name}</span>
                        </div>
                        <div className="detail-item">
                            <label>Mobile:</label>
                            <span>{requestDetails.mobileNumber}</span>
                        </div>
                    </div>
                </div>

                <div className="next-steps slide-up delay-4">
                    <h3>What's Next?</h3>
                    <div className="timeline">
                        <div className="timeline-item">
                            <div className="timeline-icon">1</div>
                            <p>You will receive a WhatsApp message shortly</p>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-icon">2</div>
                            <p>Our team will review your details</p>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-icon">3</div>
                            <p>We will send you a preview within 24 hours</p>
                        </div>
                    </div>
                </div>

                <div className="thankyou-buttons slide-up delay-5">
                    <button 
                        className="whatsapp-button"
                        onClick={handleWhatsApp}
                    >
                        <WhatsAppIcon />
                        <span>Contact on WhatsApp</span>
                    </button>
                    <button 
                        className="home-button"
                        onClick={() => navigate(`/status/${requestDetails.requestNumber}`)}
                    >
                        <HomeIcon />
                        <span>Check Status</span>

                    </button>
                </div>
            </div>
        </div>
    );
};

export default ThankYou;