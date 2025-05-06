import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
// import DB_2222 from '../biodataTemplate/DB_2222/DB_2222';
import { ArrowBack, Refresh, Error } from '@mui/icons-material';
import Container from '../../../sturcutre/Container/Container';
import './BiodataPreview.css';
import Loader from '../../Loader/Loader';
import BiodataMaster from '../BiodataMaster/BiodataMaster';

const BiodataPreview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProductionData();
    }, [id]);

    const fetchProductionData = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: supabaseError } = await supabase
                .from('production_requests')
                .select('*')
                .eq('id', id)
                .single();

            if (supabaseError) throw supabaseError;
            if (!data) throw new Error('No data found');

            const transformedData = {
                name: data.name || { value: 'Unnamed' },
                personalData: data.personal_data || [],
                professionalData: data.professional_data || [],
                educationData: data.education_data || [],
                familyData: data.family_data || [],
                contactData: data.contact_data || {},
                profileImage: data.profile_url
            };

            setPreviewData(transformedData);
        } catch (error) {
            console.error('Error fetching production data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Loader />
        );
    }

    if (error) {
        return (
            <section className="preview-section">
                <div className="preview-background">
                    <div className="preview-circle circle-1"></div>
                    <div className="preview-circle circle-2"></div>
                </div>
                <Container>
                    <div className="preview-error">
                        <Error className="error-icon" />
                        <h3>Error Loading Preview</h3>
                        <p>{error}</p>
                        <div className="error-actions">
                            <button
                                className="retry-btn"
                                onClick={fetchProductionData}
                            >
                                <Refresh /> Try Again
                            </button>
                            <button
                                className="back-btn"
                                onClick={() => navigate('/production-requests')}
                            >
                                <ArrowBack /> Back to Requests
                            </button>
                        </div>
                    </div>
                </Container>
            </section>
        );
    }

    return (
        <section className="preview-section">
            <div className="preview-background">
                <div className="preview-circle circle-1"></div>
                <div className="preview-circle circle-2"></div>
            </div>

            <Container>
                <div className="preview-header">
                    <button
                        className="preview-back-btn"
                        onClick={() => navigate('/admin/production/')}
                    >
                        <ArrowBack />
                        <span>Back to Requests</span>
                    </button>
                    <h2>Biodata Preview</h2>
                </div>

                <div className="preview-content">
                    {previewData ? (
                        <BiodataMaster />
                    ) : (
                        <div className="preview-not-found">
                            <Error className="not-found-icon" />
                            <h3>No Data Found</h3>
                            <p>The requested biodata preview could not be found.</p>
                            <button
                                className="back-btn"
                                onClick={() => navigate('/admin/production/')}
                            >
                                <ArrowBack /> Back to Requests
                            </button>
                        </div>
                    )}
                </div>
            </Container>
        </section>
    );
};

export default BiodataPreview;