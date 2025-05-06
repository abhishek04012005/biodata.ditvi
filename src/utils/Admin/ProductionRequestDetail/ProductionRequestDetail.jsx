import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import {
    Edit,
    Save,
    Cancel,
    ArrowBack,
    Person,
    Work,
    School,
    People,
    ContactPhone,
    KeyboardArrowDown,
    KeyboardArrowUp,
    Preview
} from '@mui/icons-material';
import Container from '../../../sturcutre/Container/Container';
import './ProductionRequestDetail.css';
import Loader from '../../Loader/Loader';

const ProductionRequestDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [requestData, setRequestData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);


    const getPreviewUrl = (id) => {
        return `/admin/production/preview/${id}`; // Simply return the URL string
    };


    const [expandedSections, setExpandedSections] = useState({
        personal: true,
        professional: false,
        education: false,
        family: false,
        contact: false
    });


    useEffect(() => {
        fetchRequestDetail();
    }, [id]);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };


    const fetchRequestDetail = async () => {
        try {
            const { data, error } = await supabase
                .from('production_requests')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setRequestData(data);
            setEditForm(data);
        } catch (error) {
            console.error('Error fetching request details:', error);
            navigate('/production-requests');
        } finally {
            setLoading(false);
        }
    };


    const handleImageChange = async (e) => {
        try {
            const file = e.target.files[0];
            if (!file) return;

            // Create preview URL for immediate display
            const previewUrl = URL.createObjectURL(file);

            // Update editForm with temporary preview
            setEditForm(prev => ({
                ...prev,
                profile_url: previewUrl
            }));

            setSelectedImage(file);

        } catch (error) {
            console.error('Error handling image:', error);
            alert('Failed to process image');
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            let profile_url = editForm.profile_url;

            // If there's a new image selected, upload it first
            if (selectedImage) {
                // Generate unique filename
                const fileExt = selectedImage.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

                // Upload to Supabase storage
                const { error: uploadError, data } = await supabase.storage
                    .from('biodata-images')
                    .upload(`production/${fileName}`, selectedImage);

                if (uploadError) throw uploadError;

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('biodata-images')
                    .getPublicUrl(`production/${fileName}`);

                profile_url = publicUrl;
            }

            // Update database record
            const { error: updateError } = await supabase
                .from('production_requests')
                .update({
                    ...editForm,
                    profile_url: profile_url
                })
                .eq('id', requestData.id);

            if (updateError) throw updateError;

            // Update local state
            setRequestData({
                ...editForm,
                profile_url: profile_url
            });

            setIsEditing(false);
            setSelectedImage(null);
            alert('Changes saved successfully!');

        } catch (error) {
            console.error('Error saving changes:', error);
            alert('Failed to save changes');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Loader />
        );
    }

    if (!requestData) {
        return (
            <div className="error-overlay">
                <h2>Request not found</h2>
                <button onClick={() => navigate('/production-requests')}>
                    Back to Requests
                </button>
            </div>
        );
    }

    return (
        <section className="production-detail-section">
            <div className="production-detail-background">
                <div className="detail-circle circle-1"></div>
                <div className="detail-circle circle-2"></div>
            </div>

            <Container>
                <div className="production-detail-wrapper">
                    {/* Navigation Header */}
                    <div className="detail-navigation">
                        <button
                            className="detail-back-btn"
                            onClick={() => navigate('/admin/production/')}
                        >
                            <ArrowBack />
                            <span>Back to Requests</span>
                        </button>

                        <div className="detail-actions">
                            {isEditing ? (
                                <>
                                    <button className="save-btn" onClick={handleSave}>
                                        <Save /> Save Changes
                                    </button>
                                    <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                                        <Cancel /> Cancel Editing
                                    </button>
                                </>
                            ) : (
                                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                                    <Edit /> Edit Request
                                </button>
                            )}

                            <button className="edit-btn" onClick={() => navigate(getPreviewUrl(id))}>
                                <Preview /> Preview
                            </button>
                        </div>
                    </div>

                    {/* Profile Section */}
                    <div className="detail-profile">


                        <div className="profile-image-section">
                            {isEditing ? (
                                <div className="image-upload">
                                    <img
                                        src={editForm.profile_url || '/default-profile.png'}
                                        alt="Profile Preview"
                                        className="profile-preview"
                                    />
                                    <label htmlFor="image-upload" className="upload-overlay">
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="image-input"
                                        />
                                        <span>Click to Change Image</span>
                                    </label>
                                </div>
                            ) : (
                                <div className="profile-image-wrapper">
                                    <img
                                        src={requestData.profile_url || '/default-profile.png'}
                                        alt={requestData.name?.value || 'Profile'}
                                        className="profile-image"
                                        onError={(e) => {
                                            e.target.src = '/default-profile.png';
                                        }}
                                    />
                                </div>
                            )}
                        </div>



                        <div className="profile-info">
                            <h1>{requestData.name?.value || 'Unnamed'}</h1>
                            <p className="profile-date">
                                Requested on {new Date(requestData.created_at).toLocaleDateString('en-US', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Information Sections */}
                    <div className="detail-sections">
                        {/* Personal Information */}
                        <div className="detail-section">
                            <div
                                className={`section-header ${expandedSections.personal ? 'expanded' : ''}`}
                                onClick={() => toggleSection('personal')}
                            >
                                <div className="section-header-content">
                                    <Person className="section-icon" />
                                    <h2>Personal Information</h2>
                                </div>
                                {expandedSections.personal ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </div>

                            {expandedSections.personal && (
                                <div className="section-content">
                                    {isEditing ? (
                                        <div className="edit-form-grid">
                                            <div className="form-group">
                                                <label>Name</label>
                                                <input
                                                    type="text"
                                                    value={editForm.name?.value || ''}
                                                    onChange={(e) => setEditForm(prev => ({
                                                        ...prev,
                                                        name: { ...prev.name, value: e.target.value }
                                                    }))}
                                                />
                                            </div>
                                            {editForm.personal_data?.map((item, index) => (
                                                <div key={index} className="form-group">
                                                    <label>{item.label}</label>
                                                    <input
                                                        type="text"
                                                        value={item.value}
                                                        onChange={(e) => {
                                                            const newPersonalData = [...editForm.personal_data];
                                                            newPersonalData[index] = {
                                                                ...newPersonalData[index],
                                                                value: e.target.value
                                                            };
                                                            setEditForm(prev => ({
                                                                ...prev,
                                                                personal_data: newPersonalData
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="detail-grid">
                                            <div className="detail-item">
                                                <strong>Name:</strong> {requestData.name?.value}
                                            </div>
                                            {requestData.personal_data?.map((item, index) => (
                                                <div key={index} className="detail-item">
                                                    <strong>{item.label}:</strong> {item.value}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Professional Information */}
                        <div className="detail-section">

                            <div
                                className={`section-header ${expandedSections.professional ? 'expanded' : ''}`}
                                onClick={() => toggleSection('professional')}
                            >
                                <div className="section-header-content">
                                    <Work className="section-icon" />
                                    <h2>Professional Information</h2>
                                </div>
                                {expandedSections.professional ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </div>



                            {expandedSections.professional && (
                                <div className="section-content">
                                    {isEditing ? (
                                        <div className="edit-form">

                                            {editForm.professional_data?.map((item, index) => (
                                                <div key={index} className="form-group professional-group">
                                                    <input
                                                        type="text"
                                                        value={item.company}
                                                        placeholder="Company"
                                                        onChange={(e) => {
                                                            const newProfData = [...editForm.professional_data];
                                                            newProfData[index] = {
                                                                ...newProfData[index],
                                                                company: e.target.value
                                                            };
                                                            setEditForm(prev => ({
                                                                ...prev,
                                                                professional_data: newProfData
                                                            }));
                                                        }}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={item.position}
                                                        placeholder="Position"
                                                        onChange={(e) => {
                                                            const newProfData = [...editForm.professional_data];
                                                            newProfData[index] = {
                                                                ...newProfData[index],
                                                                position: e.target.value
                                                            };
                                                            setEditForm(prev => ({
                                                                ...prev,
                                                                professional_data: newProfData
                                                            }));
                                                        }}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={item.experience}
                                                        placeholder="Experience"
                                                        onChange={(e) => {
                                                            const newProfData = [...editForm.professional_data];
                                                            newProfData[index] = {
                                                                ...newProfData[index],
                                                                experience: e.target.value
                                                            };
                                                            setEditForm(prev => ({
                                                                ...prev,
                                                                professional_data: newProfData
                                                            }));
                                                        }}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={item.salary}
                                                        placeholder="Salary"
                                                        onChange={(e) => {
                                                            const newProfData = [...editForm.professional_data];
                                                            newProfData[index] = {
                                                                ...newProfData[index],
                                                                salary: e.target.value
                                                            };
                                                            setEditForm(prev => ({
                                                                ...prev,
                                                                professional_data: newProfData
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                            ))}

                                        </div>
                                    ) : (
                                        <div className="info-grid">
                                            {requestData.professional_data?.map((item, index) => (
                                                <div key={index} className="detail-item">
                                                    <p><strong>Company:</strong> {item.company}</p>
                                                    <p><strong>Position:</strong> {item.position}</p>
                                                    <p><strong>Experience:</strong> {item.experience}</p>
                                                    <p><strong>Salary:</strong> {item.salary}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Education Information */}
                        <div className="detail-section">

                            <div
                                className={`section-header ${expandedSections.education ? 'expanded' : ''}`}
                                onClick={() => toggleSection('education')}
                            >
                                <div className="section-header-content">
                                    <School className="section-icon" />
                                    <h2>Education Information</h2>
                                </div>
                                {expandedSections.education ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </div>


                            {expandedSections.education && (
                                <div className="section-content">
                                    {isEditing ? (
                                        <div className="edit-form-grid">
                                            {editForm.education_data?.map((item, index) => (
                                                <div key={index} className="form-group education-group">
                                                    <input
                                                        type="text"
                                                        value={item.degree}
                                                        placeholder="Degree"
                                                        onChange={(e) => {
                                                            const newEduData = [...editForm.education_data];
                                                            newEduData[index] = {
                                                                ...newEduData[index],
                                                                degree: e.target.value
                                                            };
                                                            setEditForm(prev => ({
                                                                ...prev,
                                                                education_data: newEduData
                                                            }));
                                                        }}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={item.institution}
                                                        placeholder="Institution"
                                                        onChange={(e) => {
                                                            const newEduData = [...editForm.education_data];
                                                            newEduData[index] = {
                                                                ...newEduData[index],
                                                                institution: e.target.value
                                                            };
                                                            setEditForm(prev => ({
                                                                ...prev,
                                                                education_data: newEduData
                                                            }));
                                                        }}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={item.year}
                                                        placeholder="Year"
                                                        onChange={(e) => {
                                                            const newEduData = [...editForm.education_data];
                                                            newEduData[index] = {
                                                                ...newEduData[index],
                                                                year: e.target.value
                                                            };
                                                            setEditForm(prev => ({
                                                                ...prev,
                                                                education_data: newEduData
                                                            }));
                                                        }}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={item.score}
                                                        placeholder="Score"
                                                        onChange={(e) => {
                                                            const newEduData = [...editForm.education_data];
                                                            newEduData[index] = {
                                                                ...newEduData[index],
                                                                score: e.target.value
                                                            };
                                                            setEditForm(prev => ({
                                                                ...prev,
                                                                education_data: newEduData
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="detail-grid">
                                            {requestData.education_data?.map((item, index) => (
                                                <div key={index} className="detail-item">
                                                    <p><strong>Degree:</strong> {item.degree}</p>
                                                    <p><strong>Institution:</strong> {item.institution}</p>
                                                    <p><strong>Year:</strong> {item.year}</p>
                                                    <p><strong>Score:</strong> {item.score}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Family Information */}
                        <div className="detail-section">

                            <div
                                className={`section-header ${expandedSections.family ? 'expanded' : ''}`}
                                onClick={() => toggleSection('family')}
                            >
                                <div className="section-header-content">
                                    <People className="section-icon" />
                                    <h2>Family Information</h2>
                                </div>
                                {expandedSections.family ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </div>


                            {expandedSections.family && (
                                <div className="section-content">

                                    {isEditing ? (
                                        <div className="edit-form-grid">
                                            {editForm.family_data?.map((member, index) => (
                                                <div key={index} className="form-group family-group">
                                                    <h3>{member.relation}</h3>
                                                    {member.name.map((name, idx) => (
                                                        <div key={idx} className="family-member-inputs">
                                                            <input
                                                                type="text"
                                                                value={name}
                                                                placeholder="Name"
                                                                onChange={(e) => {
                                                                    const newFamilyData = [...editForm.family_data];
                                                                    newFamilyData[index].name[idx] = e.target.value;
                                                                    setEditForm(prev => ({
                                                                        ...prev,
                                                                        family_data: newFamilyData
                                                                    }));
                                                                }}
                                                            />
                                                            <input
                                                                type="text"
                                                                value={member.married[idx]}
                                                                placeholder="Married Status"
                                                                onChange={(e) => {
                                                                    const newFamilyData = [...editForm.family_data];
                                                                    newFamilyData[index].married[idx] = e.target.value;
                                                                    setEditForm(prev => ({
                                                                        ...prev,
                                                                        family_data: newFamilyData
                                                                    }));
                                                                }}
                                                            />
                                                            <input
                                                                type="text"
                                                                value={member.occupation[idx]}
                                                                placeholder="Occupation"
                                                                onChange={(e) => {
                                                                    const newFamilyData = [...editForm.family_data];
                                                                    newFamilyData[index].occupation[idx] = e.target.value;
                                                                    setEditForm(prev => ({
                                                                        ...prev,
                                                                        family_data: newFamilyData
                                                                    }));
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="detail-grid">
                                            {requestData.family_data?.map((member, index) => (
                                                <div key={index} className="detail-item">
                                                    <h3>{member.relation}</h3>
                                                    {member.name.map((name, idx) => (
                                                        <div key={idx} className="family-member">
                                                            <p><strong>Name:</strong> {name}</p>
                                                            <p><strong>Married:</strong> {member.married[idx]}</p>
                                                            <p><strong>Occupation:</strong> {member.occupation[idx]}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>


                    </div>

                    {/* Contact Information */}
                    <div className="detail-section">


                        <div
                            className={`section-header ${expandedSections.contact ? 'expanded' : ''}`}
                            onClick={() => toggleSection('contact')}
                        >
                            <div className="section-header-content">
                                <ContactPhone className="section-icon" />
                                <h2>Contact Information</h2>
                            </div>
                            {expandedSections.contact ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </div>


                        {expandedSections.contact && (
                            <div className="section-content">

                                {isEditing ? (
                                    <div className="edit-form-grid">
                                        <div className="form-group">
                                            <label>Address</label>
                                            <textarea
                                                value={editForm.contact_data?.address || ''}
                                                onChange={(e) => setEditForm(prev => ({
                                                    ...prev,
                                                    contact_data: {
                                                        ...prev.contact_data,
                                                        address: e.target.value
                                                    }
                                                }))}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Mobile</label>
                                            <input
                                                type="text"
                                                value={editForm.contact_data?.mobile || ''}
                                                onChange={(e) => setEditForm(prev => ({
                                                    ...prev,
                                                    contact_data: {
                                                        ...prev.contact_data,
                                                        mobile: e.target.value
                                                    }
                                                }))}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <p><strong>Address:</strong> {requestData.contact_data?.address}</p>
                                            <p><strong>Mobile:</strong> {requestData.contact_data?.mobile}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </Container >
        </section >
    );
};

export default ProductionRequestDetail;