import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Myheader from './Myheader';
import Footer from './Footer';
import '../css/OrderHistory.css';

const url = process.env.REACT_APP_API_URL || "http://localhost:5000";
const orderAPI = axios.create({
    baseURL: url + '/orders',
    headers: { "Content-Type": "application/json" },
});

const PAYMENT_LABELS = {
    cod: { label: 'COD', icon: 'fas fa-money-bill-wave' },
    bank: { label: 'Chuyển khoản', icon: 'fas fa-university' },
    momo: { label: 'MoMo', icon: 'fas fa-mobile-alt' },
    zalopay: { label: 'ZaloPay', icon: 'fas fa-wallet' },
    vnpay: { label: 'VNPAY', icon: 'fas fa-qrcode' },
    credit_card: { label: 'Thẻ quốc tế', icon: 'fas fa-credit-card' },
    atm: { label: 'ATM', icon: 'fas fa-id-card' },
};

const STATUS_LABELS = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    shipping: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
};

const OrderHistory = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedIds, setExpandedIds] = useState(new Set());

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('user'));
        if (!stored || !stored.id) {
            navigate('/dangnhap');
            return;
        }

        const fetchOrders = async () => {
            try {
                const res = await orderAPI.get(`?userId=${stored.id}&_sort=createdAt&_order=desc`);
                setOrders(res.data);
            } catch (err) {
                console.error('Lỗi tải đơn hàng:', err);
            }
            setLoading(false);
        };
        fetchOrders();
    }, [navigate]);

    const toggleExpand = (id) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const formatDate = (iso) => {
        if (!iso) return '—';
        const d = new Date(iso);
        return d.toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div>
            <Myheader />
            <div className="order-history-page">
                <div className="order-history-container">
                    <h1 className="order-history-title">
                        <i className="fas fa-receipt"></i>
                        Lịch sử đơn hàng
                    </h1>

                    {loading ? (
                        <div className="order-history-loading">
                            <i className="fas fa-spinner fa-spin"></i> Đang tải đơn hàng...
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="order-history-empty">
                            <i className="fas fa-box-open"></i>
                            <h3>Chưa có đơn hàng nào</h3>
                            <p>Hãy mua sắm và đặt hàng để xem lịch sử tại đây.</p>
                            <a href="/DanhmucSanpham">Mua sắm ngay</a>
                        </div>
                    ) : (
                        orders.map(order => {
                            const isExpanded = expandedIds.has(order.id);
                            const payment = PAYMENT_LABELS[order.payment] || { label: order.payment, icon: 'fas fa-money-bill' };
                            const itemsToShow = isExpanded ? order.items : order.items?.slice(0, 2);
                            const hasMore = order.items?.length > 2;

                            return (
                                <div key={order.id} className="order-card">
                                    {/* Header */}
                                    <div className="order-card-header">
                                        <div>
                                            <span className="order-card-id">Đơn hàng #{order.id}</span>
                                            <span className="order-card-date" style={{ marginLeft: '12px' }}>
                                                {formatDate(order.createdAt)}
                                            </span>
                                        </div>
                                        <span className={`order-status ${order.status || 'pending'}`}>
                                            {STATUS_LABELS[order.status] || order.status}
                                        </span>
                                    </div>

                                    {/* Items */}
                                    <div className="order-card-items">
                                        {itemsToShow?.map((item, idx) => (
                                            <div key={idx} className="order-item-row">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="order-item-img"
                                                />
                                                <div className="order-item-info">
                                                    <p className="order-item-name">{item.name}</p>
                                                    <p className="order-item-qty">SL: {item.quantity}</p>
                                                </div>
                                                <div className="order-item-price">
                                                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                                                </div>
                                            </div>
                                        ))}
                                        {hasMore && (
                                            <button className="order-toggle-btn" onClick={() => toggleExpand(order.id)}>
                                                {isExpanded
                                                    ? '▲ Thu gọn'
                                                    : `▼ Xem thêm ${order.items.length - 2} sản phẩm`}
                                            </button>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="order-card-footer">
                                        <div className="order-payment">
                                            <i className={payment.icon}></i>
                                            {payment.label}
                                        </div>
                                        <div className="order-total">
                                            <span>Tổng:</span>
                                            {order.totalPrice?.toLocaleString('vi-VN')}₫
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default OrderHistory;
