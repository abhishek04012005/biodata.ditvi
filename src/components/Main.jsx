import React from 'react'
import Hero from './Hero/Hero'
import WhyUs from './WhyUs/WhyUs'
import ForBride from './ForBride/ForBride'
import ForGroom from './ForGroom/ForGroom'
import Testimonials from './Testimonials/Testimonials'
import Contact from './ContactUs/ContactUs'
import HowWeWork from './HowWeWorks/HowWeWork'
import Blog from './Blog/Blog'

const Main = () => {
    return (
        <>
            <Hero />
            <WhyUs />
            <HowWeWork />
            <ForBride />
            <ForGroom />
            <Testimonials />
            <Blog />
            <Contact />
        </>
    )
}

export default Main