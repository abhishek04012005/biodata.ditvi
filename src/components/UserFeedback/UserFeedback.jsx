import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/config/supabase';
import { useParams } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Container from '../../sturcutre/Container/Container';
import './UserFeedback.css';

const UserFeedback = () => {
    const { id } = useParams();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [existingFeedback, setExistingFeedback] = useState(false);
    const request_number = id;

    const handleStarClick = (selectedRating) => {
        setRating(selectedRating);
    };

    useEffect(() => {
        checkExistingFeedback();
    }, [request_number]);

    const checkExistingFeedback = async () => {
        try {
            const { data, error } = await supabase
                .from('user_feedbacks')
                .select('request_number')
                .eq('request_number', request_number)
                .single();

            if (error) {
                console.error('Error checking feedback:', error);
                return;
            }

            if (data) {
                setExistingFeedback(true);
                setMessage(`Thanks you! We have already received your feedback for this Request no. ${request_number}.`);            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('user_feedbacks')
                .insert([
                    { request_number,rating, comment }
                ]);

            if (error) throw error;

            setMessage('Thank you for your feedback!');
            setRating(0);
            setComment('');
        } catch (error) {
            setMessage('Error submitting feedback. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (existingFeedback) {
        return (
            <section className="feedback-section">
                <Container>
                    <div className="feedback-container">
                        <div className="message">{message}</div>
                    </div>
                </Container>
            </section>
        );
    }

    return (
        <section className="feedback-section">
            <div className="animated-circle circle-1"></div>
            <div className="animated-circle circle-2"></div>
            
            <Container>
                <div className="feedback-container">
                    <h2>Share Your Feedback</h2>
                    <form onSubmit={handleSubmit} className="feedback-form">
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    onClick={() => handleStarClick(star)}
                                    className="star-icon"
                                >
                                    {star <= rating ? (
                                        <StarIcon className="filled" />
                                    ) : (
                                        <StarBorderIcon className="empty" />
                                    )}
                                </span>
                            ))}
                        </div>

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience with us..."
                            required
                        />

                        <button 
                            type="submit" 
                            className="primary-btn"
                            disabled={isSubmitting || rating === 0}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                            <span className="btn-shine"></span>
                        </button>

                        {message && (
                            <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                                {message}
                            </div>
                        )}
                    </form>
                </div>
            </Container>
        </section>
    );
};

export default UserFeedback;