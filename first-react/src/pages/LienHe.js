import React from 'react';
import Myheader from './Myheader';
import Footer from './Footer';

const LienHe = () => {
    return (
        <div>
            <Myheader />
            <div className="container" style={{ minHeight: '50vh', padding: '20px' }}>
                <h1>Liên hệ với chúng tôi</h1>
                <p>Địa chỉ: Trường Đại học Phenikaa, Yên Nghĩa, Hà Đông, Hà Nội</p>
                <p>Email: contact@phenikaa.edu.vn</p>
                <p>Hotline: 0123404953</p>
            </div>
            <Footer />
        </div>
    );
};

export default LienHe;
