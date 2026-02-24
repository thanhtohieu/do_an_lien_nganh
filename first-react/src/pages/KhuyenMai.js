import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { userAPI } from '../APIs/APIs';
import Myheader from './Myheader';
import Footer from './Footer';
import FlashSale from '../components/home/FlashSale';
import ProductSection from '../components/home/ProductSection';
import '../css/binh.css';
import '../css/MyCoupons.css';

const url = process.env.REACT_APP_API_URL || "http://localhost:5000";
const couponAPI = axios.create({
    baseURL: url + '/coupons',
    headers: { "Content-Type": "application/json" },
});

const KhuyenMai = () => {
    const [coupons, setCoupons] = useState([]);
    const [savedIds, setSavedIds] = useState([]);
    const [user, setUser] = useState(null);
    const [saving, setSaving] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            const u = JSON.parse(stored);
            setUser(u);
            setSavedIds(u.savedCoupons || []);
        }
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const res = await couponAPI.get('/');
            setCoupons(res.data.filter(c => c.active));
        } catch (err) {
            console.error('Error fetching coupons:', err);
        }
    };

    const saveCoupon = async (couponId) => {
        if (!user) {
            alert('Vui lòng đăng nhập để lưu mã giảm giá!');
            return;
        }
        if (savedIds.includes(couponId)) return;

        setSaving(couponId);
        try {
            const userRes = await userAPI.get(`/${user.id}`);
            const current = userRes.data.savedCoupons || [];
            if (!current.includes(couponId)) {
                const updated = [...current, couponId];
                await userAPI.patch(`/${user.id}`, { savedCoupons: updated });
                const updatedUser = { ...user, savedCoupons: updated };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setSavedIds(updated);
            }
        } catch (err) {
            console.error('Error saving coupon:', err);
            alert('Lỗi lưu mã!');
        }
        setSaving(null);
    };

    const isExpired = (date) => new Date(date) < new Date();

    return (
        <div>
            <Myheader />
            <div className="binhtongcabai" style={{ paddingTop: '20px', minHeight: '60vh' }}>
                <div className="binhtong">

                    {/* ===== MÃ GIẢM GIÁ ===== */}
                    {coupons.length > 0 && (
                        <div style={{ maxWidth: '1200px', margin: '0 auto 30px', padding: '0 20px' }}>
                            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#333', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="fas fa-ticket-alt" style={{ color: '#EE1926' }}></i>
                                Mã giảm giá
                            </h2>
                            <div className="coupon-list">
                                {coupons.map(coupon => {
                                    const expired = isExpired(coupon.expiryDate);
                                    const soldOut = coupon.usedCount >= coupon.usageLimit;
                                    const isSaved = savedIds.includes(coupon.id);
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
                                                    <span>Còn {coupon.usageLimit - (coupon.usedCount || 0)} lượt</span>
                                                </div>
                                            </div>
                                            <div className="coupon-actions">
                                                {!expired && !soldOut ? (
                                                    <button
                                                        className={`coupon-save-btn ${isSaved ? 'saved' : ''}`}
                                                        onClick={() => saveCoupon(coupon.id)}
                                                        disabled={isSaved || saving === coupon.id}
                                                    >
                                                        <i className={`fas ${isSaved ? 'fa-check' : 'fa-bookmark'}`}></i>
                                                        {saving === coupon.id ? '...' : isSaved ? 'Đã lưu' : 'Lưu mã'}
                                                    </button>
                                                ) : (
                                                    <button className="coupon-save-btn saved" disabled>
                                                        {expired ? 'Hết hạn' : 'Hết lượt'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <FlashSale />
                    <ProductSection />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default KhuyenMai;
