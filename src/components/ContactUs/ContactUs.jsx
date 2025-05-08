import React, { useState } from 'react';
import './ContactUs.css';
import Container from '../../sturcutre/Container/Container';
import Grid from '@mui/material/Grid';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import ContactUsImg from '../../assets/contactus.svg';
import Heading from '../../sturcutre/Heading/Heading';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';

const Contact = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        number: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const scriptURL = "https://script.google.com/macros/s/AKfycbwfqJJvoQpJhHIZ7GxWW_0aPHtkM7Rpg6EYWaPi_Ojwa1d-hYS7kgDr9n8QFkLEgntQog/exec";

        const formDataToSend = new URLSearchParams();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            const response = await fetch(scriptURL, {
                method: "POST",
                body: formDataToSend,
            });

            if (response.ok) {
                alert("Thank You! We'll get back to you soon.");
                setFormData({ name: '', email: '', message: '', number: '' });
            } else {
                alert("There was an error submitting the form.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("There was an error submitting the form.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="contact">
            <div className="contact-background">
                <div className="contact-circle circle-1"></div>
                <div className="contact-circle circle-2"></div>
            </div>
            
            <Container>
                <div className="contact-header">
                    <div className="contact-header-design">
                        <span className="contact-design-element"></span>
                        <Heading title='Get in Touch' />
                        <span className="contact-design-element"></span>
                    </div>
                    <p className="contact-subtitle">
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible
                    </p>
                </div>

                <Grid container direction={{ xs: 'column-reverse', md: 'row' }}
                    spacing={{ xs: 5, md: 3, lg: 20 }} className="contact-grid">
                    <Grid  size={{ xs: 12, md: 6 }}className="contact-form-wrapper">
                        <div className="contact-card">
                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                className="contact-form"
                            >
                                <div className="contact-input-wrapper">
                                    <PersonIcon className="contact-input-icon" />
                                    <TextField
                                        className="contact-input"
                                        label="Your Name"
                                        name="name"
                                        variant="outlined"
                                        value={formData.name}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                </div>

                                <div className="contact-input-wrapper">
                                    <EmailIcon className="contact-input-icon" />
                                    <TextField
                                        className="contact-input"
                                        label="Your Email"
                                        name="email"
                                        type="email"
                                        variant="outlined"
                                        value={formData.email}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                </div>

                                <div className="contact-input-wrapper">
                                    <PhoneIcon className="contact-input-icon" />
                                    <TextField
                                        className="contact-input"
                                        label="Mobile Number"
                                        name="number"
                                        type="tel"
                                        variant="outlined"
                                        value={formData.number}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                </div>

                                <div className="contact-input-wrapper">
                                    <MessageIcon className="contact-input-icon message-icon" />
                                    <TextField
                                        className="contact-input"
                                        label="Your Message"
                                        name="message"
                                        variant="outlined"
                                        value={formData.message}
                                        onChange={handleChange}
                                        multiline
                                        rows={0}
                                        fullWidth
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    className="contact-submit-btn"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} className="contact-loader" />
                                    ) : (
                                        "Send Message"
                                    )}
                                    <div className="contact-btn-shine"></div>
                                </Button>
                            </Box>
                        </div>
                    </Grid>

                    <Grid  size={{ xs: 12, md: 6 }} className="contact-image-wrapper">
                        <div className="contact-image-card">
                            <img src={ContactUsImg} alt="Contact Us Illustration" />
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </section>
    );
};

export default Contact;