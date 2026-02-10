import React from 'react';
import Myheader from './Myheader';
import Footer from './Footer';
import FlashSale from '../components/home/FlashSale';
import ProductSection from '../components/home/ProductSection';
import '../css/binh.css'; // Importing CSS for FlashSale and ProductSection

const KhuyenMai = () => {
    return (
        <div>
            <Myheader />
            <div className="binhtongcabai" style={{ paddingTop: '20px', minHeight: '60vh' }}>
                <div className="binhtong">
                    <FlashSale />
                    <ProductSection />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default KhuyenMai;
