import React, { useState, useEffect } from 'react';
import './GetNowPopUp.css';

const GetNowPopUp = ({ isOpen, onClose, modelNumber }) => {
    const [formData, setFormData] = useState({
        name: '',
        whatsapp: '',
        modelNumber: ''
    });

    // Update form when modelNumber changes
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            modelNumber: modelNumber || ''
        }));
    }, [modelNumber]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const message = encodeURIComponent(
            `*New Biodata Request*\nName: ${formData.name}\nWhatsApp: ${formData.whatsapp}\nModel Number: ${formData.modelNumber}`
        );
        window.open(`https://wa.me/919263767441?text=${message}`, '_blank');
        
        // Reset form
        setFormData({
            name: '',
            whatsapp: '',
            modelNumber: ''
        });
        onClose();
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>&times;</button>
                <div className="popup-header">
                    <h2>Request Biodata</h2>
                    <p>Please fill in your details to recive a link on your Whatsapp.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name:</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>WhatsApp Number:</label>
                        <input
                            type="tel"
                            name="whatsapp"
                            placeholder="Enter your WhatsApp number"
                            value={formData.whatsapp}
                            onChange={handleChange}
                            pattern="[0-9]{10}"
                            title="Please enter a valid 10-digit phone number"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Model Number:</label>
                        <input
                            type="text"
                            name="modelNumber"
                            value={formData.modelNumber}
                            disabled
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        Submit & Connect on WhatsApp
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GetNowPopUp;