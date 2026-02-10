import React, { useState } from 'react';
import Myheader from './Myheader';
import Footer from './Footer';

const KiemTraDonHang = () => {
    const [orderId, setOrderId] = useState('');

    const handleCheck = () => {
        if (!orderId) {
            alert("Vui lòng nhập mã đơn hàng");
            return;
        }
        alert(`Đang tìm kiếm đơn hàng: ${orderId}... (Chức năng đang phát triển)`);
    };

    return (
        <div>
            <Myheader />
            <div className="container" style={{ minHeight: '50vh', padding: '20px' }}>
                <h1>Kiểm tra đơn hàng</h1>
                <div style={{ maxWidth: '400px', margin: '20px 0' }}>
                    <input
                        type="text"
                        placeholder="Nhập mã đơn hàng"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        style={{ padding: '10px', width: '70%', marginRight: '10px' }}
                    />
                    <button onClick={handleCheck} style={{ padding: '10px 20px', backgroundColor: '#d70018', color: 'white', border: 'none', cursor: 'pointer' }}>
                        Kiểm tra
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default KiemTraDonHang;
