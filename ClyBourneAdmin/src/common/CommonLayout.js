import React from 'react';
import Layout from '../components/Layout/Layout';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
// import Footer from '../components/Footer';
import CustomApp from './CustomApp';

const CommonLayout = ({ children, page }) => (
    <Layout page={page}>
        <Topbar />
        <div className="main-container" id="container">
            <div className="overlay"></div>
            <div className="search-overlay"></div>
                <Sidebar/>
                    {children} {/* Render the main content */}
                {/* <Footer/> */}
        </div>
        <CustomApp />
    </Layout>
);

export default CommonLayout;
