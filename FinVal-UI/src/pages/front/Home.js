import React from 'react';
import Testimonial from './Testimonial';
import Banner from './Home/Banner';
import BannerFooter from './Home/BannerFooter';
import HowWork from './Home/HowWork';
import Proposal from './Home/Proposal';
import CountriesNumber from './Home/CountriesNumber';
import Join from './Home/Join';
import Blog from './Home/Blog';

const Home = () => {

    return (
        <>
            <Banner />
            <BannerFooter />   
            <HowWork /> 
            <Proposal/>
            <CountriesNumber />  
            <Join />
            <Testimonial />
            <Blog />
        </>
    );
};

export default Home;
