import React from 'react'
import Hero from './Hero/Hero'
import WhyUs from './WhyUs/WhyUs'
import Biodata from './Biodata/Biodata'
import Testimonials from './Testimonials/Testimonials'
import Contact from './ContactUs/ContactUs'
import HowWeWork from './HowWeWorks/HowWeWork'
import Blog from './Blog/Blog'



const Main = () => {
    return (
            <div className="App">
                <Hero />
                <WhyUs />
                <HowWeWork />
                <Biodata />
                <Testimonials />
                <Blog />
                <Contact />
            </div>
    );
};


export default Main;