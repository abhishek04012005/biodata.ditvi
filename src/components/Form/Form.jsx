import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BiodataStorage } from '../../utils/config/supabaseStorage';
import { uploadImage } from '../../utils/config/uploadImage';

import './Form.css';
import { defaultName, personalData, professionalData, educationData, familyData, contactData } from '../../JSON/formConstant';
import Loader from '../../utils/Loader/Loader';

const Form = () => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const { modelNumber, language, modelType, guestDetailId, guestName, mobileNumber } = location.state || {};
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);



    const [formData, setFormData] = useState({

        profileImage: null,
        name: defaultName,
        personalData: personalData.map(({ label, value }) => ({ label, value })),
        professionalData: [...professionalData],
        educationData: [...educationData],
        familyData: [...familyData],
        contactData: contactData,
        biodataDetails: [{
            modelNumber: modelNumber,
            language: language,
            modelType: modelType,
            guestName: guestName,
            mobileNumber: mobileNumber
        }],
        guestDetailId: guestDetailId

    });



    const steps = [
        'Profile Image',
        'Personal',
        'Professional',
        'Education',
        'Family',
        'Contact',
        'Preview'
    ];


    const handleNext = () => {
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB in bytes



    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size
            if (file.size > MAX_IMAGE_SIZE) {
                alert('Image size should be less than 5MB');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Only image files are allowed');
                return;
            }

            try {

                setIsLoading(true);
                // Create preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData(prev => ({
                        ...prev,
                        profileImage: reader.result
                    }));
                };
                reader.onerror = () => {
                    alert('Error reading file');
                };
                reader.readAsDataURL(file);

                setSelectedImage(file);
            } catch (error) {
                console.error('Error handling image:', error);
                alert('Failed to process image');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleAddEducation = () => {
        if (formData.educationData.length < 5) {
            setFormData(prev => ({
                ...prev,
                educationData: [
                    ...prev.educationData,
                    { degree: '', institution: '', year: '', score: '' }
                ]
            }));
        }
    };


    const handleDeleteEducation = (indexToDelete) => {
        if (formData.educationData.length > 1) {
            setFormData(prev => ({
                ...prev,
                educationData: prev.educationData.filter((_, index) => index !== indexToDelete)
            }));
        }
    };


    const handleAddSibling = (type) => {
        const familyIndex = type === 'brother' ? 2 : 3;
        const newFamilyData = [...formData.familyData];
        const currentSibling = newFamilyData[familyIndex];

        if (currentSibling.name.length < 2) {
            currentSibling.name.push('');
            currentSibling.married.push('No');
            currentSibling.occupation.push('');
            setFormData({ ...formData, familyData: newFamilyData });
        }
    };

    const handleRemoveSibling = (type, siblingIndex) => {
        const familyIndex = type === 'brother' ? 2 : 3;
        const newFamilyData = [...formData.familyData];

        newFamilyData[familyIndex].name = newFamilyData[familyIndex].name.filter((_, i) => i !== siblingIndex);
        newFamilyData[familyIndex].occupation = newFamilyData[familyIndex].occupation.filter((_, i) => i !== siblingIndex);

        setFormData({ ...formData, familyData: newFamilyData });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (currentStep !== steps.length - 1) {
            handleNext();
            return;
        }

        // Validate contact data
        if (!formData.contactData?.address || !formData.contactData?.mobile) {
            alert('Please fill in all contact information');
            return;
        }

        setIsLoading(true);
        try {
            let imageUrl = null;
            if (selectedImage) {
                imageUrl = await uploadImage(selectedImage);
            }

            const dataToSave = {
                ...formData,
                profileImage: imageUrl
            };

            const savedData = await BiodataStorage.saveBiodata(dataToSave);

            navigate('/preview/DBP_1111', {
                state: {
                    uploadedData: savedData
                }
            });
        } catch (error) {
            console.error('Error saving biodata:', error);
            alert('Failed to save biodata');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Profile Image
                return (
                    <div className="form-section">
                        <h2>Profile Image</h2>
                        <div className="image-upload-container">
                            <label className="image-upload-label">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="image-input"
                                />
                                <span className="upload-button">
                                    {formData.profileImage ? 'Change Image' : 'Upload Image'}
                                </span>
                            </label>
                            {formData.profileImage && (
                                <div className="image-preview-container">
                                    <div className="image-preview">
                                        <img
                                            src={formData.profileImage}
                                            alt="Profile Preview"
                                            className="preview-image"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="remove-image-btn"
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, profileImage: null }));
                                            setSelectedImage(null);
                                        }}
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            )}
                            <div className="image-requirements">
                                <small>
                                    * Accepted formats: JPG, PNG, JPEG<br />
                                    * Maximum size: 5MB<br />
                                    * Recommended dimensions: 400x400px
                                </small>
                            </div>
                        </div>
                    </div>
                );

            case 1: // Personal Information
                return (
                    <div className="form-section">
                        <h2>Personal Information</h2>
                        <input
                            type="text"
                            placeholder="Name"
                            value={formData.name.value}
                            onChange={(e) => setFormData({
                                ...formData,
                                name: { value: e.target.value }
                            })}
                            required
                        />
                        {formData.personalData.map((field, index) => (
                            <input
                                key={index}
                                type="text"
                                placeholder={field.label}
                                value={field.value}
                                onChange={(e) => {
                                    const newPersonalData = [...formData.personalData];
                                    newPersonalData[index].value = e.target.value;
                                    setFormData({ ...formData, personalData: newPersonalData });
                                }}
                                required
                            />
                        ))}
                    </div>
                );

            case 2: // Professional Information
                return (
                    <div className="form-section">
                        <h2>Professional Information</h2>
                        <input
                            type="text"
                            placeholder="Company"
                            value={formData.professionalData[0].company}
                            onChange={(e) => setFormData({
                                ...formData,
                                professionalData: [{
                                    ...formData.professionalData[0],
                                    company: e.target.value
                                }]
                            })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Position"
                            value={formData.professionalData[0].position}
                            onChange={(e) => setFormData({
                                ...formData,
                                professionalData: [{
                                    ...formData.professionalData[0],
                                    position: e.target.value
                                }]
                            })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Experience (years)"
                            value={formData.professionalData[0].experience}
                            onChange={(e) => setFormData({
                                ...formData,
                                professionalData: [{
                                    ...formData.professionalData[0],
                                    experience: e.target.value
                                }]
                            })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Salary (LPA)"
                            value={formData.professionalData[0].salary}
                            onChange={(e) => setFormData({
                                ...formData,
                                professionalData: [{
                                    ...formData.professionalData[0],
                                    salary: e.target.value
                                }]
                            })}
                            required
                        />
                    </div>
                );
            case 3: // Education Information
                return (
                    <div className="form-section">
                        <div className="section-header-h">
                            <h2>Education Information</h2>
                            {formData.educationData.length < 5 && (
                                <button
                                    type="button"
                                    onClick={handleAddEducation}
                                    className="add-education-btn"
                                >
                                    + Add Education ({5 - formData.educationData.length} remaining)
                                </button>
                            )}
                        </div>
                        {formData.educationData.map((education, index) => (
                            <div key={index} className="education-group">
                                <div className="education-header">
                                    <h3>Education {index + 1}</h3>
                                    {formData.educationData.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteEducation(index)}
                                            className="delete-education-btn"
                                        >
                                            Remove Education {index + 1}
                                        </button>
                                    )}
                                </div>
                                <div className="education-inputs">
                                    <input
                                        type="text"
                                        placeholder="Degree"
                                        value={education.degree}
                                        onChange={(e) => {
                                            const newEducationData = [...formData.educationData];
                                            newEducationData[index] = {
                                                ...newEducationData[index],
                                                degree: e.target.value
                                            };
                                            setFormData({ ...formData, educationData: newEducationData });
                                        }}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Institution"
                                        value={education.institution}
                                        onChange={(e) => {
                                            const newEducationData = [...formData.educationData];
                                            newEducationData[index] = {
                                                ...newEducationData[index],
                                                institution: e.target.value
                                            };
                                            setFormData({ ...formData, educationData: newEducationData });
                                        }}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Year"
                                        value={education.year}
                                        onChange={(e) => {
                                            const newEducationData = [...formData.educationData];
                                            newEducationData[index] = {
                                                ...newEducationData[index],
                                                year: e.target.value
                                            };
                                            setFormData({ ...formData, educationData: newEducationData });
                                        }}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Score"
                                        value={education.score}
                                        onChange={(e) => {
                                            const newEducationData = [...formData.educationData];
                                            newEducationData[index] = {
                                                ...newEducationData[index],
                                                score: e.target.value
                                            };
                                            setFormData({ ...formData, educationData: newEducationData });
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 4: // Family Information
                return (
                    <div className="form-section">
                        <h2>Family Information</h2>

                        {/* Parents */}
                        {formData.familyData.slice(0, 2).map((member, index) => (
                            <div key={index} className="family-group">
                                <h3>{member.relation}</h3>
                                <div className="family-inputs">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={member.name[0] || ''}
                                        onChange={(e) => {
                                            const newFamilyData = [...formData.familyData];
                                            newFamilyData[index].name = [e.target.value];
                                            setFormData({ ...formData, familyData: newFamilyData });
                                        }}
                                        required
                                    />
                                    <input
                                        style={{ display: "none" }}
                                        type="text"
                                        value="-"
                                        disabled
                                        className="married-status-disabled"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Occupation"
                                        value={member.occupation[0] || ''}
                                        onChange={(e) => {
                                            const newFamilyData = [...formData.familyData];
                                            newFamilyData[index].occupation = [e.target.value];
                                            setFormData({ ...formData, familyData: newFamilyData });
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                        ))}




                        {/* Brothers Section */}
                        <div className="family-group">
                            <div className="sibling-header">
                                <h3>Brother(s)</h3>
                                {formData.familyData[2].name.length < 2 && (
                                    <button
                                        type="button"
                                        onClick={() => handleAddSibling('brother')}
                                        className="add-sibling-btn"
                                    >
                                        + Add Brother
                                    </button>
                                )}
                            </div>
                            <div className="siblings-grid">
                                {formData.familyData[2].name.map((name, idx) => (
                                    <div key={idx} className="sibling-row">
                                        <div className="sibling-inputs">

                                            <input
                                                type="text"
                                                placeholder={`Brother ${idx + 1} Name`}
                                                value={name}
                                                onChange={(e) => {
                                                    const newFamilyData = [...formData.familyData];
                                                    newFamilyData[2].name[idx] = e.target.value;
                                                    setFormData({ ...formData, familyData: newFamilyData });
                                                }}
                                            />
                                            <div className="sibling-radio-group">
                                                <label htmlFor="married">Married: </label>
                                                <label className="sibling-radio-option">
                                                    <input
                                                        type="radio"
                                                        className="sibling-radio-input"
                                                        name={`married-brother-${idx}`}
                                                        value="No"
                                                        checked={formData.familyData[2].married[idx] === 'No'}
                                                        onChange={(e) => {
                                                            const newFamilyData = [...formData.familyData];
                                                            newFamilyData[2].married[idx] = e.target.value;
                                                            setFormData({ ...formData, familyData: newFamilyData });
                                                        }}
                                                    />
                                                    <span className="sibling-radio-label">No</span>
                                                </label>
                                                <label className="sibling-radio-option">
                                                    <input
                                                        type="radio"
                                                        className="sibling-radio-input"
                                                        name={`married-brother-${idx}`}
                                                        value="Yes"
                                                        checked={formData.familyData[2].married[idx] === 'Yes'}
                                                        onChange={(e) => {
                                                            const newFamilyData = [...formData.familyData];
                                                            newFamilyData[2].married[idx] = e.target.value;
                                                            setFormData({ ...formData, familyData: newFamilyData });
                                                        }}
                                                    />
                                                    <span className="sibling-radio-label">Yes</span>
                                                </label>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Occupation"
                                                value={formData.familyData[2].occupation[idx] || ''}
                                                onChange={(e) => {
                                                    const newFamilyData = [...formData.familyData];
                                                    newFamilyData[2].occupation[idx] = e.target.value;
                                                    setFormData({ ...formData, familyData: newFamilyData });
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSibling('brother', idx)}
                                                className="remove-sibling-btn"
                                            >
                                                Remove Brother
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sisters Section */}
                        <div className="family-group">
                            <div className="sibling-header">
                                <h3> Sister(s)</h3>
                                {formData.familyData[3].name.length < 2 && (
                                    <button
                                        type="button"
                                        onClick={() => handleAddSibling('sister')}
                                        className="add-sibling-btn"
                                    >
                                        + Add Sister
                                    </button>
                                )}
                            </div>
                            <div className="siblings-grid">
                                {formData.familyData[3].name.map((name, idx) => (
                                    <div key={idx} className="sibling-row">
                                        <div className="sibling-inputs">
                                            <input
                                                type="text"
                                                placeholder={`Sister ${idx + 1} Name`}
                                                value={name}
                                                onChange={(e) => {
                                                    const newFamilyData = [...formData.familyData];
                                                    newFamilyData[3].name[idx] = e.target.value;
                                                    setFormData({ ...formData, familyData: newFamilyData });
                                                }}
                                            />
                                            <div className="sibling-radio-group">
                                                <label htmlFor="married">Married: </label>
                                                <label className="sibling-radio-option">
                                                    <input
                                                        type="radio"
                                                        className="sibling-radio-input"
                                                        name={`married-sister-${idx}`}
                                                        value="No"
                                                        checked={formData.familyData[3].married[idx] === 'No'}
                                                        onChange={(e) => {
                                                            const newFamilyData = [...formData.familyData];
                                                            newFamilyData[3].married[idx] = e.target.value;
                                                            setFormData({ ...formData, familyData: newFamilyData });
                                                        }}
                                                    />
                                                    <span className="sibling-radio-label">No</span>
                                                </label>
                                                <label className="sibling-radio-option">
                                                    <input
                                                        type="radio"
                                                        className="sibling-radio-input"
                                                        name={`married-sister-${idx}`}
                                                        value="Yes"
                                                        checked={formData.familyData[3].married[idx] === 'Yes'}
                                                        onChange={(e) => {
                                                            const newFamilyData = [...formData.familyData];
                                                            newFamilyData[3].married[idx] = e.target.value;
                                                            setFormData({ ...formData, familyData: newFamilyData });
                                                        }}
                                                    />
                                                    <span className="sibling-radio-label">Yes</span>
                                                </label>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Occupation"
                                                value={formData.familyData[3].occupation[idx] || ''}
                                                onChange={(e) => {
                                                    const newFamilyData = [...formData.familyData];
                                                    newFamilyData[3].occupation[idx] = e.target.value;
                                                    setFormData({ ...formData, familyData: newFamilyData });
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSibling('sister', idx)}
                                                className="remove-sibling-btn"
                                            >
                                                Remove Sister
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 5: // Contact Information
                return (
                    <div className="form-section">
                        <h2>Contact Information</h2>
                        <textarea
                            placeholder="Address"
                            value={formData.contactData.address}
                            onChange={(e) => setFormData({
                                ...formData,
                                contactData: {
                                    ...formData.contactData,
                                    address: e.target.value
                                }
                            })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Mobile Number"
                            value={formData.contactData.mobile}
                            onChange={(e) => setFormData({
                                ...formData,
                                contactData: {
                                    ...formData.contactData,
                                    mobile: e.target.value
                                }
                            })}
                            required
                        />
                    </div>
                );


            // Add this preview case in your Form.jsx renderStepContent() function

            case 6:
                return (
                    <div className="form-section preview-section">
                        <h2>Review Your Information</h2>

                        {/* Profile Image Preview */}
                        <div className="preview-group">
                            <h3>Profile Image</h3>
                            <div className="preview-image-container">
                                {formData.profileImage && (
                                    <img
                                        src={formData.profileImage}
                                        alt="Profile Preview"
                                        className="preview-profile-image"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Personal Information Preview */}
                        <div className="preview-group">
                            <h3>Personal Information</h3>
                            <div className="preview-grid">
                                <div className="preview-item">
                                    <label>Name:</label>
                                    <span>{formData.name.value}</span>
                                </div>
                                {formData.personalData.map((field, index) => (
                                    <div key={index} className="preview-item">
                                        <label>{field.label}:</label>
                                        <span>{field.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Education Details Preview */}
                        <div className="preview-group">
                            <h3>Education Details</h3>
                            {formData.educationData.map((edu, index) => (
                                <div key={index} className="preview-education">
                                    <h4>Education {index + 1}</h4>
                                    <div className="preview-grid">
                                        <div className="preview-item">
                                            <label>Degree/Course:</label>
                                            <span>{edu.degree}</span>
                                        </div>
                                        <div className="preview-item">
                                            <label>University/Board:</label>
                                            <span>{edu.university}</span>
                                        </div>
                                        <div className="preview-item">
                                            <label>Year of Passing:</label>
                                            <span>{edu.yearOfPassing}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Family Information Preview */}
                        <div className="preview-group">
                            <h3>Family Information</h3>

                            {/* Parents */}
                            {formData.familyData.slice(0, 2).map((member, index) => (
                                <div key={index} className="preview-family">
                                    <h4>{member.relation}</h4>
                                    <div className="preview-grid">
                                        <div className="preview-item">
                                            <label>Name:</label>
                                            <span>{member.name[0]}</span>
                                        </div>
                                        <div className="preview-item">
                                            <label>Occupation:</label>
                                            <span>{member.occupation[0]}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Brothers */}
                            {formData.familyData[2].name.length > 0 && (
                                <div className="preview-siblings">
                                    <h4>Brothers</h4>
                                    {formData.familyData[2].name.map((name, idx) => (
                                        <div key={idx} className="preview-grid">
                                            <div className="preview-item">
                                                <label>Name:</label>
                                                <span>{name}</span>
                                            </div>
                                            <div className="preview-item">
                                                <label>Married:</label>
                                                <span>{formData.familyData[2].married[idx]}</span>
                                            </div>
                                            <div className="preview-item">
                                                <label>Occupation:</label>
                                                <span>{formData.familyData[2].occupation[idx]}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Sisters */}
                            {formData.familyData[3].name.length > 0 && (
                                <div className="preview-siblings">
                                    <h4>Sisters</h4>
                                    {formData.familyData[3].name.map((name, idx) => (
                                        <div key={idx} className="preview-grid">
                                            <div className="preview-item">
                                                <label>Name:</label>
                                                <span>{name}</span>
                                            </div>
                                            <div className="preview-item">
                                                <label>Married:</label>
                                                <span>{formData.familyData[3].married[idx]}</span>
                                            </div>
                                            <div className="preview-item">
                                                <label>Occupation:</label>
                                                <span>{formData.familyData[3].occupation[idx]}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Contact Information Preview */}
                        <div className="preview-group">
                            <h3>Contact Information</h3>
                            <div className="preview-grid">
                                <div className="preview-item">
                                    <label>Address:</label>
                                    <span>{formData.contactData.address}</span>
                                </div>
                                <div className="preview-item">
                                    <label>Mobile Number:</label>
                                    <span>{formData.contactData.mobile}</span>
                                </div>
                            </div>
                        </div>


                    </div>
                );



            default:
                return null;
        }
    };


    return (
        <>
            <div className="stepper-form-container">
                {/* Stepper Header */}
                <div className="stepper-header">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                        >
                            <div className="step-number">{index + 1}</div>
                            <div className="step-label">{step}</div>
                        </div>
                    ))}
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="stepper-form">
                    {renderStepContent()}

                    {/* Navigation Buttons */}
                    <div className="form-navigation">
                        <button
                            type="button"
                            onClick={handlePrevious}
                            className="nav-button prev"
                            disabled={currentStep === 0}
                        >
                            Previous
                        </button>
                        <button
                            type="submit"
                            className="nav-button next"
                            disabled={isLoading}
                        >
                            {currentStep === steps.length - 1 ? (isLoading ? "Saving..." : "Save and Preview") : "Next"}
                        </button>
                    </div>
                </form>
            </div>

            {isLoading && <Loader/> }
        </>

    );


};

export default Form;