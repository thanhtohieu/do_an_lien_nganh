import React from 'react';
import Myheader from './Myheader';
import Footer from './Footer';
import NewsSection from '../components/home/NewsSection';
import '../css/quanmain.css';
import '../css/news-section.css';

const TinTuc = () => {
    return (
        <div>
            <Myheader />
            <div className="container" style={{ minHeight: '50vh', padding: '20px' }}>
                <NewsSection />
            </div>
            <Footer />
        </div>
    );
};

export default TinTuc;
