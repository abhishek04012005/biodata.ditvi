import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GuestStorage } from '../../utils/config/supabaseStorage';
import './GetNowPopUp.css';
import Loader from '../../utils/Loader/Loader';

const GetNowPopUp = ({ isOpen, onClose, modelNumber, language, modelType }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        whatsapp: '',
    });



    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);


        try {
            const guestDetail = await GuestStorage.saveGuestDetails({
                ...formData
            });

            console.log('Guest details saved:', guestDetail);


            navigate('/form', {
                state: {
                    modelNumber: modelNumber,
                    language: language,
                    modelType: modelType,
                    guestDetailId: guestDetail.id,
                    requestNumber: guestDetail.request_number,
                    guestName: formData.name,
                    mobileNumber: formData.whatsapp,
                }
            });

        } catch (err) {

            console.error('Error submitting form:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    if (!isOpen) return null;

    return (
        <>
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

                        <button type="submit" className="submit-button">
                            Save & Continue
                        </button>
                    </form>
                </div>


            </div>
            {isLoading && <Loader />}
        </>
    );
};

export default GetNowPopUp;