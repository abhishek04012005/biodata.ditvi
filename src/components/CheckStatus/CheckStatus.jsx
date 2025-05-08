import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAdmin } from '../../utils/Admin/AdminContext/AdminContext';
import { supabase } from '../../utils/config/supabase';
import Container from '../../sturcutre/Container/Container';
import './CheckStatus.css';

const STATUS_STEPS = [
    { id: 1, label: 'Request Received', icon: '📝' },
    { id: 2, label: 'Sample Shared & In Review', icon: '👀' },
    { id: 3, label: 'Approved by User', icon: '✅' },
    { id: 4, label: 'Payment Confirmed', icon: '💳' },
    { id: 5, label: 'Request Fulfilled', icon: '🎉' }
];

const CheckStatus = () => {
    const { id } = useParams();
    const [statusHistory, setStatusHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [requestDetails, setRequestDetails] = useState(null);
    const { adminData } = useAdmin();
    const [canUpdateStatus, setCanUpdateStatus] = useState(false);

    useEffect(() => {
        fetchStatus();
        checkAdminStatus();
    }, [id, adminData]);

    const checkAdminStatus = () => {
        const isAdmin = !!adminData && adminData.role === 'admin';
        setCanUpdateStatus(true);
    };

    const fetchStatus = async () => {
        try {
            const { data, error } = await supabase
                .from('user_requests')
                .select('status, biodata_details')
                .eq('request_number', id)
                .single();

            if (error) throw error;
            setStatusHistory(data.status || []);
            setRequestDetails(data.biodata_details || {});
        } catch (err) {
            setError('Error fetching status');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async () => {
        try {
            const currentStatus = statusHistory.length ? 
                Math.max(...statusHistory.map(s => s.status_number)) : 0;
            
            if (currentStatus >= 5) return;

            const newStatus = {
                status_number: currentStatus + 1,
                updated_at: new Date().toISOString()
            };

            const updatedStatus = [...statusHistory, newStatus];

            const { error } = await supabase
                .from('user_requests')
                .update({ status: updatedStatus })
                .eq('request_number', id);

            if (error) throw error;
            setStatusHistory(updatedStatus);
        } catch (err) {
            console.error('Error updating status:', err);
            setError('Error updating status');
        }
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading request details...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <div className="error-icon">❌</div>
            <p>{error}</p>
        </div>
    );

    const getCurrentStep = () => {
        if (statusHistory.length === 0) return 0;
        return Math.max(...statusHistory.map(s => s.status_number));
    };

    return (
        <section className="status-section">
            <div className="animated-circle circle-1"></div>
            <div className="animated-circle circle-2"></div>
            <Container>
                <div className="status-container">
                    <div className="status-header">
                        <h1>Track Your Request</h1>
                        <p className="request-number">Request No: #{id}</p>
                    </div>

                    <div className="request-card">
                        <h2 className="card-title">Request Details</h2>
                        <div className="details-grid">
                            <div className="detail-item">
                                <span className="detail-label">Guest Name</span>
                                <span className="detail-value">{requestDetails?.guestName || 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Model No</span>
                                <span className="detail-value">{requestDetails?.modelNumber || 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Model Type</span>
                                <span className="detail-value">{requestDetails?.modelType || 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Language</span>
                                <span className="detail-value">{requestDetails?.language || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="status-progress">
                        <h2 className="progress-title">Current Progress</h2>
                        <div className="stepper">
        <div 
            className="stepper-progress" 
            style={{ 
                width: `${(getCurrentStep() / (STATUS_STEPS.length - 1)) * 100}%` 
            }}
        />
        {STATUS_STEPS.map((step, index) => {
            const isCompleted = statusHistory.find(s => s.status_number === step.id);
            const isActive = getCurrentStep() === step.id;
            
            return (
                <div 
                    key={step.id} 
                    className={`step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                >
                    {isCompleted ? '✓' : step.id}
                    <span className="step-label">{step.label}</span>
                </div>
            );
        })}
        </div>
                        <div className="timeline">
                            {STATUS_STEPS.map((step, index) => {
                                const statusEntry = statusHistory.find(s => s.status_number === step.id);
                                const isCompleted = statusEntry !== undefined;
                                
                                return (
                                    <div key={step.id} 
                                         className={`timeline-item ${isCompleted ? 'completed' : ''}`}>
                                        <div className="timeline-icon">{step.icon}</div>
                                        <div className="timeline-content">
                                            <h3>{step.label}</h3>
                                            {statusEntry && (
                                                <p className="status-date">
                                                    {new Date(statusEntry.updated_at).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {canUpdateStatus && (
                        <button 
                            className="update-status-btn"
                            onClick={updateStatus}
                            disabled={statusHistory.length >= 5}
                        >
                            Update Status
                            <span className="btn-icon">→</span>
                        </button>
                    )}
                </div>
            </Container>
        </section>
    );
};

export default CheckStatus;