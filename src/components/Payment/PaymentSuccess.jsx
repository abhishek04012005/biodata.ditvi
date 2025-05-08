import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/config/supabase';
import Container from '../../sturcutre/Container/Container';
import Loader from '../../utils/Loader/Loader';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
    const { paymentId } = useParams();
    const navigate = useNavigate();
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [redirectTime, setRedirectTime] = useState(10);

    useEffect(() => {
        if (!paymentId) {
            setError('Invalid payment ID');
            setLoading(false);
            return;
        }
        fetchPaymentDetails();
    }, [paymentId]);

    // Redirect timer
    useEffect(() => {
        if (!loading && !error) {
            const timer = setInterval(() => {
                setRedirectTime((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        navigate('/');
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [loading, error, navigate]);

    const fetchPaymentDetails = async () => {
        try {
            const { data, error: fetchError } = await supabase
                .from('payment_requests')
                .select(`
                    id,
                    amount,
                    request_number,
                    transaction_id,
                    created_at,
                    status
                `)
                .eq('id', paymentId)
                .single();

            if (fetchError) throw fetchError;
            
            if (!data) {
                throw new Error('Payment details not found');
            }

            setPaymentDetails(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching payment details:', err);
            setError('Failed to fetch payment details');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (loading) {
        return (
            <div className="payment-loading">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="payment-error">
                <div className="error-icon">❌</div>
                <h2>Payment Verification Failed</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/')} className="home-button">
                    <HomeIcon /> Return Home
                </button>
            </div>
        );
    }

    return (
        <section className="payment-success-section">
            <Container>
                <div className="payment-success-card">
                    <div className="success-icon">
                        <CheckCircleIcon />
                    </div>
                    
                    <h1>Payment Successful!</h1>
                    <p className="success-message">
                        Your payment has been processed successfully
                    </p>

                    <div className="payment-details">
                        <div className="detail-item">
                            <span className="label">Request Number:</span>
                            <div className="value-with-copy">
                                <span className="value">#{paymentDetails.request_number}</span>
                                <button 
                                    className="copy-button"
                                    onClick={() => handleCopy(paymentDetails.request_number)}
                                >
                                    <ContentCopyIcon />
                                </button>
                            </div>
                        </div>

                        <div className="detail-item">
                            <span className="label">Amount Paid:</span>
                            <span className="value">₹{paymentDetails.amount}</span>
                        </div>

                        <div className="detail-item">
                            <span className="label">Transaction ID:</span>
                            <div className="value-with-copy">
                                <span className="value">{paymentDetails.transaction_id}</span>
                                <button 
                                    className="copy-button"
                                    onClick={() => handleCopy(paymentDetails.transaction_id)}
                                >
                                    <ContentCopyIcon />
                                </button>
                            </div>
                        </div>

                        <div className="detail-item">
                            <span className="label">Date:</span>
                            <span className="value">
                                {new Date(paymentDetails.created_at).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button 
                            className="download-receipt"
                            onClick={() => window.print()}
                        >
                            <ReceiptIcon /> Download Receipt
                        </button>
                        <button 
                            className="home-button"
                            onClick={() => navigate('/')}
                        >
                            <HomeIcon /> Return Home
                            {redirectTime > 0 && <span> ({redirectTime}s)</span>}
                        </button>
                    </div>

                    {copied && (
                        <div className="copy-tooltip">Copied to clipboard!</div>
                    )}
                </div>
            </Container>
        </section>
    );
};

export default PaymentSuccess;