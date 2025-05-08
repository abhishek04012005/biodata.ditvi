import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../utils/config/supabase';
import Container from '../../sturcutre/Container/Container';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
    const { paymentId } = useParams();
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPaymentDetails();
    }, [paymentId]);

    const fetchPaymentDetails = async () => {
        try {
            const { data, error } = await supabase
                .from('payment_requests')
                .select('*')
                .eq('id', paymentId)
                .single();

            if (error) throw error;
            setPaymentDetails(data);
        } catch (error) {
            console.error('Error fetching payment details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <section className="payment-success-section">
            <Container>
                <div className="payment-success-card">
                    <div className="success-icon">✓</div>
                    <h1>Payment Successful!</h1>
                    <div className="payment-details">
                        <div className="detail-item">
                            <span className="label">Request Number:</span>
                            <span className="value">#{paymentDetails.request_number}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Amount Paid:</span>
                            <span className="value">₹{paymentDetails.amount}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Transaction ID:</span>
                            <span className="value">{paymentDetails.transaction_id}</span>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default PaymentSuccess;