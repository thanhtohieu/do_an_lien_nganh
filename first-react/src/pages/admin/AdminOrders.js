import React, { useState, useEffect } from 'react';
import axios from 'axios';

const url = process.env.REACT_APP_API_URL || "http://localhost:5000";
const orderAPI = axios.create({
    baseURL: url + '/orders',
    headers: { "Content-Type": "application/json" },
});

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'shipping', label: 'Đang giao' },
    { value: 'delivered', label: 'Đã giao' },
    { value: 'cancelled', label: 'Đã hủy' },
];

const PAYMENT_LABELS = {
    cod: 'COD',
    bank: 'Chuyển khoản',
    momo: 'MoMo',
    zalopay: 'ZaloPay',
    vnpay: 'VNPAY',
    credit_card: 'Thẻ quốc tế',
    atm: 'ATM',
};

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await orderAPI.get('/');
            // Sắp xếp mới nhất trước ở client
            const sorted = res.data.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setOrders(sorted);
        } catch (err) {
            console.error('Lỗi tải đơn hàng:', err);
        }
        setLoading(false);
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await orderAPI.patch(`/${orderId}`, { status: newStatus });
            setOrders(prev => prev.map(o =>
                o.id === orderId ? { ...o, status: newStatus } : o
            ));
        } catch (err) {
            console.error('Lỗi cập nhật trạng thái:', err);
            alert('Không thể cập nhật trạng thái. Vui lòng thử lại.');
        }
    };

    const formatDate = (iso) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const filtered = filterStatus === 'all'
        ? orders
        : orders.filter(o => o.status === filterStatus);

    // Thống kê theo trạng thái
    const statusCounts = orders.reduce((acc, o) => {
        acc[o.status || 'pending'] = (acc[o.status || 'pending'] || 0) + 1;
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                <p>Đang tải đơn hàng...</p>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#333', marginBottom: '24px' }}>
                <i className="fas fa-shopping-bag" style={{ color: '#667eea', marginRight: '10px' }}></i>
                Quản lý đơn hàng
            </h1>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setFilterStatus('all')}
                    style={{
                        padding: '8px 16px', borderRadius: '20px', border: 'none',
                        background: filterStatus === 'all' ? '#667eea' : '#e0e0e0',
                        color: filterStatus === 'all' ? 'white' : '#555',
                        fontWeight: 600, fontSize: '13px', cursor: 'pointer'
                    }}
                >
                    Tất cả ({orders.length})
                </button>
                {STATUS_OPTIONS.map(s => (
                    <button
                        key={s.value}
                        onClick={() => setFilterStatus(s.value)}
                        style={{
                            padding: '8px 16px', borderRadius: '20px', border: 'none',
                            background: filterStatus === s.value ? '#667eea' : '#e0e0e0',
                            color: filterStatus === s.value ? 'white' : '#555',
                            fontWeight: 600, fontSize: '13px', cursor: 'pointer'
                        }}
                    >
                        {s.label} ({statusCounts[s.value] || 0})
                    </button>
                ))}
            </div>

            <div className="admin-table-card">
                <div className="admin-table-header">
                    <h2>{filtered.length} đơn hàng</h2>
                </div>

                {filtered.length === 0 ? (
                    <p style={{ color: '#999', padding: '30px', textAlign: 'center' }}>
                        Không có đơn hàng nào.
                    </p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Khách hàng</th>
                                <th>SĐT</th>
                                <th>Ngày đặt</th>
                                <th>Thanh toán</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(order => (
                                <tr key={order.id}>
                                    <td><strong>#{order.id}</strong></td>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{order.customerName}</div>
                                        <div style={{ fontSize: '12px', color: '#888', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {order.address}
                                        </div>
                                    </td>
                                    <td>{order.phone}</td>
                                    <td style={{ fontSize: '13px' }}>{formatDate(order.createdAt)}</td>
                                    <td>{PAYMENT_LABELS[order.payment] || order.payment}</td>
                                    <td className="price-text">{order.totalPrice?.toLocaleString('vi-VN')}₫</td>
                                    <td>
                                        <select
                                            className="admin-status-select"
                                            value={order.status || 'pending'}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        >
                                            {STATUS_OPTIONS.map(s => (
                                                <option key={s.value} value={s.value}>{s.label}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
