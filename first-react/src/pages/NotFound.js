import React from 'react';
import { useNavigate } from 'react-router-dom';
import Myheader from './Myheader';
import Footer from './Footer';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Myheader />
            <div style={{
                minHeight: '55vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                textAlign: 'center',
                background: '#f0f3f7'
            }}>
                <div style={{ fontSize: '120px', fontWeight: '900', color: '#d70018', lineHeight: 1 }}>
                    404
                </div>
                <h2 style={{ fontSize: '24px', color: '#333', margin: '15px 0 10px' }}>
                    Trang không tồn tại
                </h2>
                <p style={{ fontSize: '15px', color: '#777', maxWidth: '400px', marginBottom: '25px' }}>
                    Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '12px 28px',
                            background: '#d70018',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: 'pointer',
                        }}
                    >
                        <i className="fas fa-home" style={{ marginRight: '8px' }}></i>
                        Về trang chủ
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            padding: '12px 28px',
                            background: 'white',
                            color: '#333',
                            border: '1.5px solid #ccc',
                            borderRadius: '8px',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: 'pointer',
                        }}
                    >
                        <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
                        Quay lại
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default NotFound;
