import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import {
    School,
    Work,
    People,
    ContactPhone,
    KeyboardArrowDown,
    KeyboardArrowUp,
    Person,
    ArrowBack,
} from '@mui/icons-material';
import './UserRequestDetail.css';
import Container from '../../../sturcutre/Container/Container';
import Loader from '../../Loader/Loader';
import { get } from 'react-scroll/modules/mixins/scroller';

const UserRequestDetail = () => {
    // ... your existing state and hooks ...
    const { id } = useParams();
    const navigate = useNavigate();
    const [requestData, setRequestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedSections, setExpandedSections] = useState({
        personal: true,
        professional: false,
        education: false,
        family: false,
        contact: false
    });
    const [isMovingToProduction, setIsMovingToProduction] = useState(false);

    // ... your existing useEffect and functions ...
    useEffect(() => {
        fetchRequestDetail();
    }, [id]);


    const fetchRequestDetail = async () => {
        try {
            const { data, error } = await supabase
                .from('user_requests')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            const transformedData = {
                ...data,
                name: data.name || { value: 'Unnamed' },
                personalData: data.personal_data || [],
                professionalData: data.professional_data || [],
                educationData: data.education_data || [],
                familyData: data.family_data || [],
                contactData: data.contact_data || {},
                profileImage: data.profile_url,
                requestNumber: data.request_number,
                biodataDetails: data.biodata_details,
            };

            setRequestData(transformedData);
        } catch (error) {
            console.error('Error fetching request details:', error);
            navigate('/requests');
        } finally {
            setLoading(false);
        }
    };

    const getLatestStatus = (statusArray) => {
        // console.log("statusArray", statusArray);
        if (!Array.isArray(statusArray) || statusArray.length === 0) {
            return 'Pending';
        }

        // Find the status with the highest status_number
        const latestStatus = statusArray.reduce((latest, current) => {
            return (current.status_number > latest.status_number) ? current : latest;
        });

        return latestStatus.status || 'Pending';
    };


    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    if (loading) return (
        <Loader />
    );

    if (!requestData) return (
        <div className="request-detail-error">
            <h2>Request Not Found</h2>
            <button onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</button>
        </div>
    );

    return (
        <section className="request-detail-section">
            <div className="request-detail-background">
                <div className="detail-circle circle-1"></div>
                <div className="detail-circle circle-2"></div>
            </div>

            <Container>
                <div className="request-detail-wrapper">
                    <div className="detail-navigation">
                        <button
                            className="detail-back-btn"
                            onClick={() => navigate('/admin/dashboard')}
                        >
                            <ArrowBack />
                            <span>Back to Dashboard</span>
                        </button>
                    </div>

                    <div className="detail-profile">
                        <div className="profile-image-wrapper">
                            <img
                                src={requestData.profileImage || '/default-profile.png'}
                                alt={requestData.name?.value || 'Profile'}
                                onError={(e) => { e.target.src = '/default-profile.png' }}
                            />
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
                            <div className="profile-status">
                                <span className={`status-badge ${requestData.status ? 'in-production' : 'pending'}`}>
                                    {getLatestStatus(requestData.status)}
                                </span>
                            </div>
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
                                <div className="header-content">
                                    <Person className="section-icon" />
                                    <h2>Personal Information</h2>
                                </div>
                                {expandedSections.personal ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </div>
                            {expandedSections.personal && (
                                <div className="section-content">
                                    <table className="detail-table">
                                        <tbody>
                                            {requestData.personalData?.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="field-label">{item.label}</td>
                                                    <td className="field-value">{item.value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Professional Information */}
                        <div className="detail-section">
                            <div className="section-header" onClick={() => toggleSection('professional')}>
                                <div className="header-content">
                                    <Work className="section-icon" />
                                    <h2>Professional Information</h2>
                                </div>
                                {expandedSections.professional ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </div>
                            {expandedSections.professional && (
                                <table className="detail-table">
                                    <thead>
                                        <tr>
                                            <th>Company</th>
                                            <th>Position</th>
                                            <th>Experience</th>
                                            <th>Salary</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requestData.professionalData?.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.company}</td>
                                                <td>{item.position}</td>
                                                <td>{item.experience}</td>
                                                <td>{item.salary}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Education Information */}
                        <div className="detail-section">
                            <div className="section-header" onClick={() => toggleSection('education')}>
                                <div className="header-content">
                                    <School className="section-icon" />
                                    <h2>Education Information</h2>
                                </div>
                                {expandedSections.education ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </div>
                            {expandedSections.education && (
                                <table className="detail-table">
                                    <thead>
                                        <tr>
                                            <th>Degree</th>
                                            <th>Institution</th>
                                            <th>Year</th>
                                            <th>Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requestData.educationData?.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.degree}</td>
                                                <td>{item.institution}</td>
                                                <td>{item.year}</td>
                                                <td>{item.score}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Family Information */}
                        <div className="detail-section">
                            <div className="section-header" onClick={() => toggleSection('family')}>
                                <div className="header-content">
                                    <People className="section-icon" />
                                    <h2>Family Information</h2>
                                </div>
                                {expandedSections.family ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </div>
                            {expandedSections.family && (
                                <table className="detail-table">
                                    <thead>
                                        <tr>
                                            <th>Relation</th>
                                            <th>Name</th>
                                            <th>Married</th>
                                            <th>Occupation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requestData.familyData?.map((member) => (
                                            member.name.map((name, idx) => (
                                                <tr key={`${member.relation}-${idx}`}>
                                                    <td>{idx === 0 ? member.relation : ''}</td>
                                                    <td>{name}</td>
                                                    <td>{member.married[idx]}</td>
                                                    <td>{member.occupation[idx]}</td>
                                                </tr>
                                            ))
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Contact Information */}
                        <div className="detail-section">
                            <div className="section-header" onClick={() => toggleSection('contact')}>
                                <div className="header-content">
                                    <ContactPhone className="section-icon" />
                                    <h2>Contact Information</h2>
                                </div>
                                {expandedSections.contact ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </div>
                            {expandedSections.contact && (
                                <table className="detail-table">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Address</td>
                                            <td>{requestData.contactData?.address}</td>
                                        </tr>
                                        <tr>
                                            <td>Mobile</td>
                                            <td>{requestData.contactData?.mobile}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default UserRequestDetail;