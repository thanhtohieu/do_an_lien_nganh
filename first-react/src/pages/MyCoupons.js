import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userAPI } from '../APIs/APIs';
import Myheader from './Myheader';
import Footer from './Footer';
import '../css/MyCoupons.css';

const url = process.env.REACT_APP_API_URL || "http://localhost:5000";
const couponAPI = axios.create({
    baseURL: url + '/coupons',
    headers: { "Content-Type": "application/json" },
});

const MyCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            setUser(JSON.parse(stored));
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) fetchMyCoupons();
    }, [user]);

    const fetchMyCoupons = async () => {
        try {
            const [couponRes, userRes] = await Promise.all([
                couponAPI.get('/'),
                userAPI.get(`/${user.id}`)
            ]);
            const allCoupons = couponRes.data;
            const savedIds = userRes.data.savedCoupons || [];
            const myCoupons = allCoupons.filter(c => savedIds.includes(c.id));
            setCoupons(myCoupons);
        } catch (err) {
            console.error('Error fetching coupons:', err);
        }
        setLoading(false);
    };

    const removeCoupon = async (couponId) => {
        try {
            const userRes = await userAPI.get(`/${user.id}`);
            const current = userRes.data.savedCoupons || [];
            const updated = current.filter(id => id !== couponId);
            await userAPI.patch(`/${user.id}`, { savedCoupons: updated });
            const updatedUser = { ...user, savedCoupons: updated };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setCoupons(prev => prev.filter(c => c.id !== couponId));
        } catch (err) {
            console.error('Error removing coupon:', err);
        }
    };

    const isExpired = (date) => new Date(date) < new Date();

    if (loading) {
        return (
            <div className="mycoupons-page">
                <Myheader />
                <div className="mycoupons-container">
                    <p style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Đang tải...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="mycoupons-page">
                <Myheader />
                <div className="mycoupons-container">
                    <div className="mycoupons-empty">
                        <i className="fas fa-user-lock"></i>
                        <h3>Vui lòng đăng nhập</h3>
                        <p>Bạn cần đăng nhập để xem mã giảm giá của mình.</p>
                        <a href="/Dangnhap" className="mycoupons-browse-btn">
                            <i className="fas fa-sign-in-alt"></i> Đăng nhập
                        </a>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="mycoupons-page">
            <Myheader />
            <div className="mycoupons-container">
                <h1 className="mycoupons-title">
                    <i className="fas fa-ticket-alt"></i> Mã giảm giá của tôi
                </h1>

                {coupons.length === 0 ? (
                    <div className="mycoupons-empty">
                        <i className="fas fa-ticket-alt"></i>
                        <h3>Chưa có mã giảm giá nào</h3>
                        <p>Hãy ghé trang Khuyến mãi để lưu mã giảm giá!</p>
                        <a href="/KhuyenMai" className="mycoupons-browse-btn">
                            <i className="fas fa-tags"></i> Xem khuyến mãi
                        </a>
                    </div>
                ) : (
                    <div className="coupon-list">
                        {coupons.map(coupon => {
                            const expired = isExpired(coupon.expiryDate);
                            const soldOut = coupon.usedCount >= coupon.usageLimit;
                            return (
                                <div key={coupon.id} className={`coupon-card ${expired || soldOut ? 'expired' : ''}`}>
                                    <div className={`coupon-left ${coupon.type}`}>
                                        <span className="coupon-value">
                                            {coupon.type === 'percent' ? `${coupon.value}%` : `${(coupon.value / 1000).toFixed(0)}K`}
                                        </span>
                                        <span className="coupon-type-label">
                                            {coupon.type === 'percent' ? 'GIẢM GIÁ' : 'GIẢM'}
                                        </span>
                                    </div>
                                    <div className="coupon-right">
                                        <p className="coupon-code">{coupon.code}</p>
                                        <p className="coupon-desc">
                                            {coupon.type === 'percent'
                                                ? `Giảm ${coupon.value}% cho đơn từ ${coupon.minOrder.toLocaleString('vi-VN')}₫. Tối đa ${coupon.maxDiscount.toLocaleString('vi-VN')}₫`
                                                : `Giảm ${coupon.value.toLocaleString('vi-VN')}₫ cho đơn từ ${coupon.minOrder.toLocaleString('vi-VN')}₫`
                                            }
                                        </p>
                                        <div className="coupon-meta">
                                            <span className={`coupon-expiry-tag ${expired ? 'expired-tag' : 'valid'}`}>
                                                <i className="fas fa-clock"></i>
                                                {expired ? 'Hết hạn' : `HSD: ${new Date(coupon.expiryDate).toLocaleDateString('vi-VN')}`}
                                            </span>
                                            {soldOut && <span className="coupon-expiry-tag expired-tag">Hết lượt</span>}
                                        </div>
                                    </div>
                                    <div className="coupon-actions">
                                        {!expired && !soldOut ? (
                                            <button className="coupon-use-btn" onClick={() => navigate('/ThanhToan')}>
                                                <i className="fas fa-shopping-cart"></i> Dùng ngay
                                            </button>
                                        ) : null}
                                        <button className="coupon-remove-btn" onClick={() => removeCoupon(coupon.id)} style={{ marginLeft: '4px' }}>
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default MyCoupons;
