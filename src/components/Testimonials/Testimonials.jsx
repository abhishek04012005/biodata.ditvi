import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import './Testimonials.css';
import Heading from '../../sturcutre/Heading/Heading';
import Container from '../../sturcutre/Container/Container';
import Client1 from '../../assets/client/client1.png'
import Client2 from '../../assets/client/client2.png'
import Client3 from '../../assets/client/client3.png'
import Client4 from '../../assets/client/client4.png'
import Client5 from '../../assets/client/client5.png'
import Client6 from '../../assets/client/client6.png'


const testimonials = [
    {
        id: 1, 
        name: 'Ajay K.',
        role: 'Bengluru',
        testimonial: 'The pay-only-when-satisfied policy is a game-changer. My Biodata was perfect!',
        gradientColors: ['#FF8C42', '#FF5733'],
        rating: 5,
        image:Client1,
    },
    {
        id: 2,
        testimonial: 'Authenticity and quality at its best—my Biodata was flawless and tailored beautifully.',
        gradientColors: ['#FF8C42', '#FF5733'],
        rating: 5,
        name: 'Anuradha K.',
        role: 'Chennai',
        image: Client2,
    },
    {
        id: 3,
        testimonial: 'Tradition and elegance seamlessly in my Biodata, showcasing my background impeccably.',
        gradientColors: ['#FF8C42', '#FF5733'],
        rating: 5,
        name: 'Hemlata K.',
        role: 'Delhi',
        image: Client3,
    },
    {
        id: 4,
        testimonial: 'A trustworthy team that crafts Biodatas with unmatched expertise and care.',
        gradientColors: ['#FF8C42', '#FF5733'],
        rating: 5,
        name: 'Vishwas',
        role: 'Indore',
        image: Client4,
    },
    {
        id: 5,
        testimonial: 'Personalized Biodata with premium results—design and content were beautifully executed.',
        gradientColors: ['#FF8C42', '#FF5733'],
        rating: 5,
        name: 'Kanchan K.',
        role: 'Kolkata',
        company: 'Ditvi Foundation',
        image: Client5,
    },
    {
        id: 6,
        testimonial: 'Impeccably crafted Biodata that balances tradition and personalization beautifully.',
        gradientColors: ['#FF8C42', '#FF5733'],
        rating: 5,
        name: 'Indu Devi',
        role: 'Jaipur',
        image: Client6,
    },



];


const NextArrow = (props) => {
    const { className, onClick } = props;
    return (

        <ArrowForwardIcon className={`${className} custom-arrow`} onClick={onClick} />
    );
};

const PrevArrow = (props) => {
    const { className, onClick } = props;
    return (

        <ArrowBackIcon className={`${className} custom-arrow`} onClick={onClick} />

    );
};

const TestimonialCard = ({ data }) => {
    const stars = Array(data.rating).fill(null);
    
    return (
        <div className="testimonial-card">
            <div className="card-inner" style={{
                background: `linear-gradient(135deg, ${data.gradientColors[0]}, ${data.gradientColors[1]})`
            }}>
                <div className="quote-icon">
                    <FormatQuoteIcon />
                </div>
                
                <div className="testimonial-content">
                    <div className="rating">
                        {stars.map((_, index) => (
                            <StarIcon key={index} className="star" />
                        ))}
                    </div>
                    
                    <p className="testimonial-text">{data.testimonial}</p>
                    
                    <div className="author-info">
                        <div className="author-image">
                            <img src={data.image} alt={data.name} />
                        </div>
                        <div className="author-details">
                            <h4 className="author-name">{data.name}</h4>
                            <p className="author-role">{data.role}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};



const Testimonials = () => {

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            { breakpoint: 1225, settings: { slidesToShow: 3, slidesToScroll: 1, }, },
            { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1, }, },
            { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1, }, },
        ],
    };
    return (
        <section className="testimonials-section">
            <div className="animated-circle circle-1"></div>
            <div className="animated-circle circle-2"></div>
            
            <Container>
                <div className="testimonials-header">
                    <div className="header-design">
                        <span className="design-element"></span>
                        <Heading title="Client Testimonials" />
                        <span className="design-element"></span>
                    </div>
                    <p className="section-subtitle">
                        What our clients say about our biodata design service
                    </p>
                </div>

                <div className="testimonials-slider">
                    <Slider {...settings}>
                        {testimonials.map((testimonial) => (
                            <TestimonialCard 
                                key={testimonial.id}
                                data={testimonial}
                            />
                        ))}
                    </Slider>
                </div>
            </Container>
        </section>
    );
}

export default Testimonials