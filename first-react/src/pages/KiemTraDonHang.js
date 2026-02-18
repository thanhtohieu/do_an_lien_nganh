import React, { useState, useEffect } from 'react';
import Myheader from './Myheader';
import Footer from './Footer';
import '../css/KiemTraDonHang.css';
import axios from 'axios';

const url = process.env.REACT_APP_API_URL || "http://localhost:5000";

const orderAPI = axios.create({
    baseURL: url + '/orders',
    headers: { "Content-Type": "application/json" },
});

const PAYMENT_LABELS = {
    cod: { label: 'Thanh toán khi nhận hàng', icon: 'fas fa-money-bill-wave', color: '#28a745' },
    bank: { label: 'Chuyển khoản ngân hàng', icon: 'fas fa-university', color: '#1a73e8' },
    momo: { label: 'Ví MoMo', icon: 'fas fa-mobile-alt', color: '#a50064' },
    zalopay: { label: 'Ví ZaloPay', icon: 'fas fa-wallet', color: '#0068ff' },
    vnpay: { label: 'VNPAY-QR', icon: 'fas fa-qrcode', color: '#e21b1b' },
    credit_card: { label: 'Thẻ quốc tế (Visa/MC/JCB)', icon: 'fas fa-credit-card', color: '#1a1f71' },
    atm: { label: 'Thẻ ATM / Internet Banking', icon: 'fas fa-id-card', color: '#2d6a4f' },
};

const STATUS_MAP = {
    pending: { label: 'Chờ xác nhận', color: '#f39c12', icon: 'fas fa-clock' },
    confirmed: { label: 'Đã xác nhận', color: '#3498db', icon: 'fas fa-check-circle' },
    shipping: { label: 'Đang giao hàng', color: '#e67e22', icon: 'fas fa-shipping-fast' },
    delivered: { label: 'Đã giao hàng', color: '#27ae60', icon: 'fas fa-box-open' },
    cancelled: { label: 'Đã hủy', color: '#e74c3c', icon: 'fas fa-times-circle' },
};

const KiemTraDonHang = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            loadOrders();
        }
    }, [user]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            // Fetch all orders and filter client-side (json-server has strict type matching)
            const response = await orderAPI.get("/");
            const userOrders = response.data
                .filter(order => String(order.userId) === String(user.id))
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(userOrders);
        } catch (err) {
            console.error("Error loading orders:", err);
        } finally {
            setLoading(false);
        }
    };



    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getPaymentInfo = (payment) => {
        return PAYMENT_LABELS[payment] || { label: payment, icon: 'fas fa-wallet', color: '#666' };
    };

    const getStatusInfo = (status) => {
        return STATUS_MAP[status] || { label: status, color: '#666', icon: 'fas fa-question-circle' };
    };

    const toggleOrder = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const renderOrderCard = (order) => {
        const statusInfo = getStatusInfo(order.status);
        const paymentInfo = getPaymentInfo(order.payment);
        const isExpanded = expandedOrder === order.id;

        return (
            <div key={order.id} className={`ktdh-order-card ${isExpanded ? 'expanded' : ''}`}>
                {/* Order Header */}
                <div className="ktdh-order-header" onClick={() => toggleOrder(order.id)}>
                    <div className="ktdh-order-header-left">
                        <div className="ktdh-order-id">
                            <i className="fas fa-receipt"></i>
                            <span>Đơn hàng #{order.id}</span>
                        </div>
                        <div className="ktdh-order-date">
                            <i className="far fa-calendar-alt"></i>
                            {formatDate(order.createdAt)}
                        </div>
                    </div>
                    <div className="ktdh-order-header-right">
                        <span className="ktdh-status-badge" style={{ background: statusInfo.color }}>
                            <i className={statusInfo.icon}></i> {statusInfo.label}
                        </span>
                        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} ktdh-toggle-icon`}></i>
                    </div>
                </div>

                {/* Order Quick Info */}
                <div className="ktdh-order-quick">
                    <div className="ktdh-quick-item">
                        <span className="ktdh-quick-label">Sản phẩm:</span>
                        <span>{order.items?.length || 0} sản phẩm</span>
                    </div>
                    <div className="ktdh-quick-item">
                        <span className="ktdh-quick-label">Thanh toán:</span>
                        <span style={{ color: paymentInfo.color }}>
                            <i className={paymentInfo.icon} style={{ marginRight: '5px' }}></i>
                            {paymentInfo.label}
                        </span>
                    </div>
                    <div className="ktdh-quick-item ktdh-quick-total">
                        <span className="ktdh-quick-label">Tổng tiền:</span>
                        <span className="ktdh-total-price">{order.totalPrice?.toLocaleString("vi-VN")}₫</span>
                    </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                    <div className="ktdh-order-details">
                        {/* Shipping Info */}
                        <div className="ktdh-detail-section">
                            <h4><i className="fas fa-map-marker-alt"></i> Thông tin giao hàng</h4>
                            <div className="ktdh-shipping-info">
                                <p><strong>Người nhận:</strong> {order.customerName}</p>
                                <p><strong>Số điện thoại:</strong> {order.phone}</p>
                                <p><strong>Địa chỉ:</strong> {order.address}</p>
                                {order.note && <p><strong>Ghi chú:</strong> {order.note}</p>}
                            </div>
                        </div>

                        {/* Items */}
                        <div className="ktdh-detail-section">
                            <h4><i className="fas fa-box"></i> Chi tiết sản phẩm</h4>
                            <div className="ktdh-items-list">
                                {order.items?.map((item, index) => (
                                    <div key={index} className="ktdh-item-row">
                                        <img src={item.image} alt={item.name} className="ktdh-item-img" />
                                        <div className="ktdh-item-info">
                                            <p className="ktdh-item-name">{item.name}</p>
                                            <p className="ktdh-item-price-qty">
                                                {item.price?.toLocaleString("vi-VN")}₫ × {item.quantity}
                                            </p>
                                        </div>
                                        <div className="ktdh-item-subtotal">
                                            {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="ktdh-detail-section">
                            <h4><i className="fas fa-history"></i> Trạng thái đơn hàng</h4>
                            <div className="ktdh-timeline">
                                {['pending', 'confirmed', 'shipping', 'delivered'].map((step, idx) => {
                                    const stepInfo = getStatusInfo(step);
                                    const statusOrder = ['pending', 'confirmed', 'shipping', 'delivered'];
                                    const currentIdx = statusOrder.indexOf(order.status);
                                    const isCancelled = order.status === 'cancelled';
                                    const isActive = !isCancelled && idx <= currentIdx;
                                    const isCurrent = !isCancelled && idx === currentIdx;

                                    return (
                                        <div key={step} className={`ktdh-timeline-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
                                            <div className="ktdh-timeline-dot" style={isActive ? { background: stepInfo.color } : {}}>
                                                <i className={stepInfo.icon}></i>
                                            </div>
                                            <div className="ktdh-timeline-content">
                                                <span className="ktdh-timeline-label">{stepInfo.label}</span>
                                                {isCurrent && <span className="ktdh-timeline-current-tag">Hiện tại</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                                {order.status === 'cancelled' && (
                                    <div className="ktdh-timeline-step active current">
                                        <div className="ktdh-timeline-dot" style={{ background: '#e74c3c' }}>
                                            <i className="fas fa-times-circle"></i>
                                        </div>
                                        <div className="ktdh-timeline-content">
                                            <span className="ktdh-timeline-label">Đã hủy</span>
                                            <span className="ktdh-timeline-current-tag" style={{ background: '#fde8e8', color: '#e74c3c' }}>Hiện tại</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Total Summary */}
                        <div className="ktdh-order-total-bar">
                            <span>Tổng thanh toán:</span>
                            <span className="ktdh-final-total">{order.totalPrice?.toLocaleString("vi-VN")}₫</span>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div>
            <Myheader />
            <div className="ktdh-page">
                <div className="ktdh-container">
                    <h1 className="ktdh-title">
                        <i className="fas fa-clipboard-list"></i> Kiểm tra đơn hàng
                    </h1>



                    {/* User Orders */}
                    {user ? (
                        <div className="ktdh-orders-section">
                            <h2 className="ktdh-section-title">
                                <i className="fas fa-list-alt"></i> Đơn hàng của bạn
                                <span className="ktdh-order-count">{orders.length} đơn</span>
                            </h2>

                            {loading ? (
                                <div className="ktdh-loading">
                                    <i className="fas fa-spinner fa-spin"></i> Đang tải đơn hàng...
                                </div>
                            ) : orders.length > 0 ? (
                                <div className="ktdh-orders-list">
                                    {orders.map(order => renderOrderCard(order))}
                                </div>
                            ) : (
                                <div className="ktdh-empty">
                                    <i className="fas fa-inbox"></i>
                                    <h3>Chưa có đơn hàng nào</h3>
                                    <p>Hãy mua sắm và đặt hàng để xem đơn hàng tại đây</p>
                                    <a href="/DanhmucSanpham" className="ktdh-shop-btn">
                                        <i className="fas fa-shopping-bag"></i> Mua sắm ngay
                                    </a>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="ktdh-not-logged-in">
                            <i className="fas fa-user-lock"></i>
                            <h3>Bạn chưa đăng nhập</h3>
                            <p>Đăng nhập để xem lịch sử đơn hàng của bạn</p>
                            <a href="/Dangnhap" className="ktdh-login-btn">
                                <i className="fas fa-sign-in-alt"></i> Đăng nhập
                            </a>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default KiemTraDonHang;
