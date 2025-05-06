import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { School, Work, People, ContactPhone, Print } from '@mui/icons-material';
import './BiodataMaster.css';
import Loader from '../../Loader/Loader';
import backgroundImage1 from '../../../assets/background/b1112.svg';
import logo from '../../../assets/logo.png';


const BiodataMaster = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [biodataData, setBiodataData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showWatermark, setShowWatermark] = useState(false);
    // Add this with other state declarations
    const [fontSize, setFontSize] = useState(16); // Default font size in pixels
    // Add this with your other state declarations at the top
    const [tableFontSize, setTableFontSize] = useState(14); // Default table font size


    const getBackgroundImage = (template) => {
        try {
            return require(`../../../assets/background/${template}.svg`);
        } catch {
            return require('../../../assets/background/dbp_1111.svg'); // fallback image
        }
    };


    useEffect(() => {
        const fetchProductionRequest = async () => {
            try {
                setLoading(true);
                setError(null);

                const { data, error } = await supabase
                    .from('production_requests')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                if (!data) {
                    throw new Error('Production request not found');
                }

                // Transform the data to match the expected format
                const transformedData = {
                    name: data.name || { value: 'Unnamed' },
                    personalData: data.personal_data || [],
                    professionalData: data.professional_data || [],
                    educationData: data.education_data || [],
                    familyData: data.family_data || [],
                    contactData: data.contact_data || { address: '', mobile: '' },
                    profileImage: data.profile_url
                };

                setBiodataData(transformedData);
            } catch (error) {
                console.error('Error fetching production request:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProductionRequest();
        }
    }, [id]);


    // Add these functions in your component
    const increaseFontSize = () => {
        setFontSize(prev => Math.min(prev + 1, 24)); // Maximum size of 24px
    };

    const decreaseFontSize = () => {
        setFontSize(prev => Math.max(prev - 1, 12)); // Minimum size of 12px
    };

    const increaseTableFontSize = () => {
        setTableFontSize(prev => Math.min(prev + 1, 20)); // Maximum size of 20px
    };

    const decreaseTableFontSize = () => {
        setTableFontSize(prev => Math.max(prev - 1, 10)); // Minimum size of 10px
    };

    const handlePrint = (withWatermark = false) => {
        // Store current page styles
        const originalContent = document.body.innerHTML;

        // Get only the biodata container content
        const biodataContent = document.querySelector('.biodata-master-a4-container').innerHTML;

        // Create print-specific styles
        const printStyles = `
            <style>
                @page {
                    size: A4;
                    margin: 0;
                }
                body {
                    margin: 0;
                    padding: 0;
                }
                .biodata-master-a4-container {
                    width: 210mm;
                    min-height: 297mm;
                    margin: 0 auto;
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    box-sizing: border-box;
                    position: relative;
                    background-image: url(${getBackgroundImage(biodataData.name.value)});
                }
    
                .img-watermark {
                    display: ${withWatermark ? 'block !important' : 'none !important'};
                   
                }

                .img-watermark img{
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                  opacity: 0.3;
                  transform: rotate(-45deg);

                }
    
                @media print {
                    .img-watermark {
                        display: ${withWatermark ? 'block !important' : 'none !important'};
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            </style>
        `;

        // Create a new container with watermark
        const printContent = `
            <div class="biodata-master-a4-container">
                ${withWatermark ? `
                    <div class="img-watermark">
                        <img src="${logo}" alt="watermark" style="width: 100%; height: 100%; object-fit: contain;"/>
                    </div>
                ` : ''}
                ${biodataContent}
            </div>
        `;

        // Replace page content with biodata content and print styles
        document.body.innerHTML = printStyles + printContent;

        // Print after a small delay to ensure styles are applied
        setTimeout(() => {
            window.print();
            // Restore original content
            document.body.innerHTML = originalContent;
            // Reattach event listeners if needed
            window.location.reload();
        }, 300);
    };




    const handlePopUp = () => {
        setShowPopup(true);
    };





    const renderMultiLineContent = (content) => {
        return Array.isArray(content) ? (
            content.map((item, i) => (
                <React.Fragment key={i}>
                    {item}
                    {i < content.length - 1 && <br />}
                </React.Fragment>
            ))
        ) : (
            content
        );
    };

    if (loading) {
        return (
            <Loader />
        );
    }

    if (error) {
        return (
            <div className="biodata-master-error">
                <h3>Error: {error}</h3>
                <button onClick={() => navigate('/production-requests')}>
                    Back to Requests
                </button>
            </div>
        );
    }

    if (!biodataData) {
        return <div className="biodata-master-error">No data found</div>;
    }

    return (
        <div className="biodata-master-biodata-page">

            <div className="biodata-master-actions-left">


                <div className="font-size-controls">
                <span className="font-control-label">Heading:</span>
                    <button
                        className="biodata-master-font-button"
                        onClick={decreaseFontSize}
                        title="Decrease font size"
                    >
                        A-
                    </button>
                    <button
                        className="biodata-master-font-button"
                        onClick={increaseFontSize}
                        title="Increase font size"
                    >
                        A+
                    </button>
                </div>


                <div className="font-control-group">
                    <span className="font-control-label">Table:</span>
                    <button
                        className="biodata-master-font-button"
                        onClick={decreaseTableFontSize}
                        title="Decrease table font size"
                    >
                        T-
                    </button>
                    <button
                        className="biodata-master-font-button"
                        onClick={increaseTableFontSize}
                        title="Increase table font size"
                    >
                        T+
                    </button>
                </div>


                <button className="biodata-master-print-button" onClick={handlePopUp}>
                    <Print /> PopUP
                </button>

                <button className="biodata-master-print-button" onClick={handlePrint}>
                    <Print /> Print Sample
                </button>


                <button className="biodata-master-print-button" onClick={handlePrint}>
                    <Print /> Print Sample
                </button>


                <button className="biodata-master-print-button" onClick={handlePrint}>
                    <Print /> Print Sample
                </button>


                <button className="biodata-master-print-button" onClick={handlePrint}>
                    <Print /> Print Sample
                </button>


                <button className="biodata-master-print-button" onClick={handlePrint}>
                    <Print /> Print Sample
                </button>
            </div>


            <div className="biodata-master-actions">
                <button className="biodata-master-print-button" onClick={() => handlePrint(true)}>
                    <Print /> Print Sample
                </button>


                <button className="biodata-master-print-button" onClick={() => handlePrint(false)}>
                    <Print /> Print Original
                </button>


            </div>

            <div className="biodata-master-a4-container"
                style={{
                    backgroundImage: `url(${getBackgroundImage(biodataData.name.value)})`,
                    // backgroundImage: `url(${backgroundImage1})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',

                }}>


                {/* <div className="img-watermark"><img src={logo} alt="" /></div> */}


                <div className="biodata-master-biodata-content" style={{ fontSize: `${fontSize}px` }}>
                    {/* Personal Section */}
                    <div className="biodata-master-personal-section">
                        <div className="biodata-master-photo-section">
                            <div className="biodata-master-photo-frame">
                                <img
                                    src={biodataData.profileImage || "/default-profile.png"}
                                    alt="Profile"
                                    onError={(e) => {
                                        e.target.src = "/default-profile.png";
                                    }}
                                />
                            </div>
                            <div className="biodata-master-name-text">
                                <h3>{biodataData.name.value}</h3>
                            </div>
                        </div>
                        <div className="biodata-master-personal-info">
                            <table className="biodata-master-bio-table personal-table" style={{ fontSize: `${tableFontSize}px` }}>
                                <tbody>
                                    {biodataData.personalData.map((item, index) => (
                                        <tr key={index}>
                                            <th className='biodata-master-personal-icon-alignment'>
                                                {item.label}
                                            </th>
                                            <td>{item.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Professional Section */}
                    <div className="biodata-master-section professional-margin">
                        <div className="biodata-master-section-title">
                            <span className="biodata-master-flex-section">
                                <Work className="biodata-master-section-icon" />
                                <h3>Professional Details</h3>
                            </span>
                        </div>
                        <table className="biodata-master-bio-table" style={{ fontSize: `${tableFontSize}px` }}>
                            <tbody>
                                <tr>
                                    <th>Company Name</th>
                                    <th>Position</th>
                                    <th>Years of Experience</th>
                                    <th>Salary</th>
                                </tr>
                                {biodataData.professionalData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.company}</td>
                                        <td>{item.position}</td>
                                        <td>{item.experience}</td>
                                        <td>{item.salary}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Education Section */}
                    <div className="biodata-master-section education-section">
                        <div className="biodata-master-section-title">
                            <span className="biodata-master-flex-section">
                                <School className="biodata-master-section-icon" />
                                <h3>Education Details</h3>
                            </span>
                        </div>
                        <table className="biodata-master-bio-table" style={{ fontSize: `${tableFontSize}px` }}>
                            <thead>
                                <tr>
                                    <th>Degree</th>
                                    <th>Institution</th>
                                    <th>Year</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {biodataData.educationData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.degree}</td>
                                        <td>{item.institution}</td>
                                        <td>{item.year}</td>
                                        <td>{item.score}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Family Section */}
                    <div className="biodata-master-section">
                        <div className="biodata-master-section-title">
                            <span className="biodata-master-flex-section">
                                <People className="biodata-master-section-icon" />
                                <h3>Family Details</h3>
                            </span>
                        </div>
                        <table className="biodata-master-bio-table" style={{ fontSize: `${tableFontSize}px` }}>
                            <tbody>
                                <tr>
                                    <th>Relation</th>
                                    <th>Name</th>
                                    <th>Occupation</th>
                                    <th>Married</th>
                                </tr>
                                {biodataData.familyData.map((member, index) => (
                                    <tr key={index}>
                                        <td>{member.relation}</td>
                                        <td>{renderMultiLineContent(member.name)}</td>
                                        <td>{renderMultiLineContent(member.occupation)}</td>
                                        <td>{renderMultiLineContent(member.married)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Contact Section */}
                    <div className="biodata-master-section">
                        <div className="biodata-master-section-title">
                            <span className="biodata-master-flex-section">
                                <ContactPhone className="biodata-master-section-icon" />
                                <h3>Contact Details</h3>
                            </span>
                        </div>
                        <table className="biodata-master-bio-table" style={{ fontSize: `${tableFontSize}px` }}>
                            <tbody>
                                <tr>
                                    <th>Address</th>
                                    <th>Mobile No.</th>
                                </tr>
                                <tr>
                                    <td>
                                        {biodataData.contactData.address.split('\n').map((line, i) => (
                                            <React.Fragment key={i}>
                                                {line}
                                                {i < biodataData.contactData.address.split('\n').length - 1 && <br />}
                                            </React.Fragment>
                                        ))}
                                    </td>
                                    <td>{biodataData.contactData.mobile}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>



            {showPopup && (
                <div className="biodata-master-popup-overlay">
                    <div className="biodata-master-popup-content">
                        <div className="biodata-master-popup-header">
                            <h3>✨ Your Biodata Preview is Ready!</h3>
                            <button
                                className="biodata-master-popup-close"
                                onClick={() => setShowPopup(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="biodata-master-popup-body">
                            <div className="biodata-master-popup-message">
                                <div className="popup-greeting">
                                    Hey <span className="highlight">{biodataData.name.value}</span>! 🎉
                                </div>

                                <div className="popup-details">
                                    <div className="detail-item">
                                        <span className="detail-label">Request No:</span>
                                        <span className="detail-value">{id}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Model No:</span>
                                        <span className="detail-value">{biodataData.name.value}</span>
                                    </div>
                                </div>

                                <p className="popup-text">
                                    Your customized & traditional Ditvi Biodata sample is ready to impress!
                                </p>

                                <div className="popup-message">
                                    Please check the attached watermarked sample and let us know if it brightens your day!
                                    <span className="highlight">Your feedback is key, and remember—you pay only when you're delighted!</span> 💖
                                </div>

                                <div className="popup-footer">
                                    <p>Thanks for choosing Ditvi Biodata. We're excited for you! 🌟</p>
                                    <p className="signature">Warm wishes,<br />The Ditvi Biodata Team</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>


    );
};

export default BiodataMaster;