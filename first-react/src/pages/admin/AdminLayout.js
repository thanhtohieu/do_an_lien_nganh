import React from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import '../../css/Admin.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    // Bảo vệ route: chỉ admin mới vào được
    if (!user || user.role !== 'admin') {
        return (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <h1 style={{ color: '#d70018', fontSize: '48px' }}>⛔</h1>
                <h2>Không có quyền truy cập</h2>
                <p>Trang này chỉ dành cho quản trị viên.</p>
                <a href="/" style={{ color: '#667eea', fontWeight: 600 }}>Về trang chủ</a>
            </div>
        );
    }

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/dangnhap');
    };

    return (
        <div className="admin-wrapper">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-brand">
                    <h2>🖥️ Laptop Shop</h2>
                    <span>Admin Panel</span>
                </div>
                <ul className="admin-nav">
                    <li>
                        <NavLink to="/admin" end className={({ isActive }) => isActive ? 'active' : ''}>
                            <i className="fas fa-chart-pie"></i>
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'active' : ''}>
                            <i className="fas fa-box"></i>
                            <span>Sản phẩm</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'active' : ''}>
                            <i className="fas fa-shopping-bag"></i>
                            <span>Đơn hàng</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''}>
                            <i className="fas fa-users"></i>
                            <span>Tài khoản</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/" className={() => ''}>
                            <i className="fas fa-store"></i>
                            <span>Xem cửa hàng</span>
                        </NavLink>
                    </li>
                </ul>
                <div className="admin-sidebar-footer">
                    <button className="admin-logout-btn" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="admin-main">
                <div className="admin-topbar">
                    <div></div>
                    <div className="admin-topbar-user">
                        <span>{user.name}</span>
                        <div className="admin-topbar-avatar">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
