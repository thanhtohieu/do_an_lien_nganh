import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { itemAPI } from '../../APIs/APIs';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
    LineChart, Line, AreaChart, Area
} from 'recharts';

const url = process.env.REACT_APP_API_URL || "http://localhost:5000";
const orderAPI = axios.create({
    baseURL: url + '/orders',
    headers: { "Content-Type": "application/json" },
});

const STATUS_LABELS = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    shipping: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
};

const PIE_COLORS = ['#ffc107', '#0d6efd', '#20c997', '#198754', '#dc3545'];

const AdminDashboard = () => {
    const [stats, setStats] = useState({ revenue: 0, totalOrders: 0, totalProducts: 0, pendingOrders: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [revenueByDate, setRevenueByDate] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, itemsRes] = await Promise.all([
                    orderAPI.get('/'),
                    itemAPI.get('/')
                ]);
                const orders = ordersRes.data;
                const items = itemsRes.data;

                // === Thống kê tổng ===
                const revenue = orders
                    .filter(o => o.status === 'delivered')
                    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
                const pendingOrders = orders.filter(o => o.status === 'pending').length;

                setStats({
                    revenue,
                    totalOrders: orders.length,
                    totalProducts: items.length,
                    pendingOrders
                });

                // === 5 đơn gần nhất ===
                const sorted = [...orders].sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setRecentOrders(sorted.slice(0, 5));

                // === Biểu đồ tròn: Trạng thái đơn hàng ===
                const statusCounts = {};
                orders.forEach(o => {
                    const s = o.status || 'pending';
                    statusCounts[s] = (statusCounts[s] || 0) + 1;
                });
                const pieData = Object.entries(statusCounts).map(([key, value]) => ({
                    name: STATUS_LABELS[key] || key,
                    value,
                    status: key
                }));
                setStatusData(pieData);

                // === Biểu đồ cột + line: Doanh thu theo ngày ===
                const dailyRevenue = {};
                const dailyCount = {};
                orders.forEach(o => {
                    if (!o.createdAt) return;
                    const date = new Date(o.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
                    dailyRevenue[date] = (dailyRevenue[date] || 0) + (o.totalPrice || 0);
                    dailyCount[date] = (dailyCount[date] || 0) + 1;
                });
                const dateData = Object.entries(dailyRevenue).map(([date, total]) => ({
                    date,
                    revenue: total,
                    orders: dailyCount[date] || 0
                }));
                setRevenueByDate(dateData);

                // === Biểu đồ cột: Top sản phẩm bán chạy ===
                const productSales = {};
                orders.forEach(o => {
                    if (!o.items) return;
                    o.items.forEach(item => {
                        const name = item.name?.length > 25 ? item.name.substring(0, 25) + '...' : item.name;
                        productSales[name] = (productSales[name] || 0) + (item.quantity || 1);
                    });
                });
                const topData = Object.entries(productSales)
                    .map(([name, sold]) => ({ name, sold }))
                    .sort((a, b) => b.sold - a.sold)
                    .slice(0, 6);
                setTopProducts(topData);

            } catch (err) {
                console.error('Lỗi tải dashboard:', err);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const formatDate = (iso) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    const formatVND = (value) => {
        if (value >= 1000000) return (value / 1000000).toFixed(1) + 'tr';
        if (value >= 1000) return (value / 1000).toFixed(0) + 'k';
        return value;
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#333', marginBottom: '24px' }}>
                <i className="fas fa-chart-pie" style={{ color: '#667eea', marginRight: '10px' }}></i>
                Dashboard
            </h1>

            {/* ===== Stat Cards ===== */}
            <div className="admin-stats">
                <div className="admin-stat-card">
                    <div className="admin-stat-icon revenue">
                        <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="admin-stat-info">
                        <h3>{stats.revenue.toLocaleString('vi-VN')}₫</h3>
                        <p>Doanh thu (đã giao)</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon orders">
                        <i className="fas fa-shopping-bag"></i>
                    </div>
                    <div className="admin-stat-info">
                        <h3>{stats.totalOrders}</h3>
                        <p>Tổng đơn hàng</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon products">
                        <i className="fas fa-box"></i>
                    </div>
                    <div className="admin-stat-info">
                        <h3>{stats.totalProducts}</h3>
                        <p>Sản phẩm</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon pending">
                        <i className="fas fa-clock"></i>
                    </div>
                    <div className="admin-stat-info">
                        <h3>{stats.pendingOrders}</h3>
                        <p>Chờ xử lý</p>
                    </div>
                </div>
            </div>

            {/* ===== Charts Row 1: Doanh thu + Trạng thái ===== */}
            <div className="admin-charts-row-1">
                {/* Biểu đồ Area: Doanh thu theo ngày */}
                <div className="admin-table-card">
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#333', marginBottom: '16px' }}>
                        <i className="fas fa-chart-area" style={{ color: '#28a745', marginRight: '8px' }}></i>
                        Doanh thu theo ngày
                    </h2>
                    {revenueByDate.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={revenueByDate}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#667eea" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" fontSize={12} tick={{ fill: '#888' }} />
                                <YAxis tickFormatter={formatVND} fontSize={12} tick={{ fill: '#888' }} />
                                <Tooltip
                                    formatter={(value) => [value.toLocaleString('vi-VN') + '₫', 'Doanh thu']}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #eee' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#667eea" fill="url(#colorRevenue)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>Chưa có dữ liệu doanh thu</p>
                    )}
                </div>

                {/* Biểu đồ tròn: Trạng thái đơn hàng */}
                <div className="admin-table-card">
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#333', marginBottom: '16px' }}>
                        <i className="fas fa-chart-pie" style={{ color: '#764ba2', marginRight: '8px' }}></i>
                        Trạng thái đơn hàng
                    </h2>
                    {statusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={85}
                                    paddingAngle={3}
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>Chưa có đơn hàng</p>
                    )}
                </div>
            </div>

            {/* ===== Charts Row 2: Top SP + Số đơn theo ngày ===== */}
            <div className="admin-charts-row-2">
                {/* Biểu đồ cột: Top sản phẩm bán chạy */}
                <div className="admin-table-card">
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#333', marginBottom: '16px' }}>
                        <i className="fas fa-fire" style={{ color: '#fd7e14', marginRight: '8px' }}></i>
                        Top sản phẩm bán chạy
                    </h2>
                    {topProducts.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={topProducts} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis type="number" fontSize={12} tick={{ fill: '#888' }} />
                                <YAxis dataKey="name" type="category" width={130} fontSize={11} tick={{ fill: '#555' }} />
                                <Tooltip
                                    formatter={(value) => [value + ' sản phẩm', 'Đã bán']}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #eee' }}
                                />
                                <Bar dataKey="sold" fill="#667eea" radius={[0, 6, 6, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>Chưa có dữ liệu</p>
                    )}
                </div>

                {/* Biểu đồ line: Số đơn hàng theo ngày */}
                <div className="admin-table-card">
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#333', marginBottom: '16px' }}>
                        <i className="fas fa-chart-line" style={{ color: '#0d6efd', marginRight: '8px' }}></i>
                        Số đơn hàng theo ngày
                    </h2>
                    {revenueByDate.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={revenueByDate}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" fontSize={12} tick={{ fill: '#888' }} />
                                <YAxis fontSize={12} tick={{ fill: '#888' }} allowDecimals={false} />
                                <Tooltip
                                    formatter={(value) => [value + ' đơn', 'Số đơn']}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #eee' }}
                                />
                                <Line type="monotone" dataKey="orders" stroke="#0d6efd" strokeWidth={2} dot={{ fill: '#0d6efd', r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>Chưa có dữ liệu</p>
                    )}
                </div>
            </div>

            {/* ===== Đơn hàng gần đây ===== */}
            <div className="admin-recent-orders">
                <h2><i className="fas fa-clock" style={{ marginRight: '8px', color: '#667eea' }}></i>Đơn hàng gần đây</h2>
                {recentOrders.length === 0 ? (
                    <p style={{ color: '#999', padding: '20px 0' }}>Chưa có đơn hàng nào.</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Khách hàng</th>
                                <th>Ngày đặt</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map(order => (
                                <tr key={order.id}>
                                    <td><strong>#{order.id}</strong></td>
                                    <td>{order.customerName}</td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td className="price-text">{order.totalPrice?.toLocaleString('vi-VN')}₫</td>
                                    <td>
                                        <span className={`admin-badge ${order.status || 'pending'}`}>
                                            {STATUS_LABELS[order.status] || order.status}
                                        </span>
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

export default AdminDashboard;
