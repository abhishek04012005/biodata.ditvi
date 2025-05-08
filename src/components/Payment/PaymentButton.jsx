import React from 'react';
import { supabase } from '../../utils/config/supabase';
import './PaymentButton.css';

const PaymentButton = ({ requestNumber, amount }) => {
    const initializePayment = async () => {
        try {
            // First create payment request entry
            const { data: paymentRequest, error: dbError } = await supabase
                .from('payment_requests')
                .insert([{
                    request_number: requestNumber,
                    amount: 1,
                    status: 'INITIATED',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (dbError) throw dbError;

            const options = {
                key: '',
                amount: 1 * 100, // amount in paisa
                currency: "INR",
                name: "Biodata.ditvi",
                description: `Payment for request #${requestNumber}`,
                // Remove order_id as we don't have backend
                handler: async function (response) {
                    await handlePaymentSuccess(response, paymentRequest.id);
                },
                modal: {
                    ondismiss: async function() {
                        // Handle payment modal dismissal
                        await updatePaymentStatus(paymentRequest.id, 'CANCELLED');
                    }
                },
                prefill: {
                    name: "Guest User",
                    email: "",
                    contact: ""
                },
                notes: {
                    request_number: requestNumber
                },
                theme: {
                    color: "#FF8C42"
                }
            };

            const razorpayInstance = new window.Razorpay(options);
            razorpayInstance.on('payment.failed', async function (response) {
                await handlePaymentFailure(response, paymentRequest.id);
            });
            razorpayInstance.open();

        } catch (error) {
            console.error('Payment initialization failed:', error);
            alert('Payment initialization failed. Please try again.');
        }
    };

    const handlePaymentSuccess = async (response, paymentRequestId) => {
        console.log('Payment successful:', response);
        try {
            const { error } = await supabase
                .from('payment_requests')
                .update({
                    transaction_id: response.razorpay_payment_id,
                    status: 'SUCCESS',
                    payment_response: response,
                    updated_at: new Date().toISOString()
                })
                .eq('id', paymentRequestId);

            if (error) throw error;

            // Update user_requests status to "Payment Confirmed"
            // await updateRequestStatus(requestNumber);

            // Redirect to success page
            window.location.href = `/payment-success/${paymentRequestId}`;
        } catch (error) {
            console.error('Error updating payment status:', error);
            alert('Payment was successful but status update failed. Please contact support.');
        }
    };

    const handlePaymentFailure = async (response, paymentRequestId) => {
        try {
            await updatePaymentStatus(paymentRequestId, 'FAILED', response.error);
            alert('Payment failed. Please try again.');
        } catch (error) {
            console.error('Error updating failed payment status:', error);
        }
    };

    const updatePaymentStatus = async (paymentRequestId, status, error = null) => {
        const { error: updateError } = await supabase
            .from('payment_requests')
            .update({
                status: status,
                error_message: error?.description,
                updated_at: new Date().toISOString()
            })
            .eq('id', paymentRequestId);

        if (updateError) {
            console.error('Error updating payment status:', updateError);
        }
    };

    const updateRequestStatus = async (requestNumber) => {
        try {
            const { data: request, error: fetchError } = await supabase
                .from('user_requests')
                .select('status')
                .eq('request_number', requestNumber)
                .single();

            if (fetchError) throw fetchError;

            const currentStatus = request.status || [];
            const newStatus = {
                status_number: currentStatus.length + 1,
                status: 'Payment Confirmed',
                updated_at: new Date().toISOString()
            };

            const { error: updateError } = await supabase
                .from('user_requests')
                .update({
                    status: [...currentStatus, newStatus]
                })
                .eq('request_number', requestNumber);

            if (updateError) throw updateError;
        } catch (error) {
            console.error('Error updating request status:', error);
        }
    };

    return (
        <button className="payment-button" onClick={initializePayment}>
            Make Payment
            <span className="btn-shine"></span>
        </button>
    );
};

export default PaymentButton;