import React, { useState, useEffect } from 'react';
import { userAPI } from '../../APIs/APIs';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await userAPI.get('/');
                setUsers(res.data);
            } catch (err) {
                console.error('Lỗi tải danh sách tài khoản:', err);
            }
            setLoading(false);
        };
        fetchUsers();
    }, []);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Bạn có chắc muốn xóa tài khoản "${name}"?`)) return;
        try {
            await userAPI.delete(`/${id}`);
            setUsers(prev => prev.filter(u => u.id !== id));
            alert('Đã xóa tài khoản!');
        } catch (err) {
            console.error('Lỗi xóa:', err);
            alert('Không thể xóa tài khoản.');
        }
    };

    const filtered = searchTerm
        ? users.filter(u =>
            u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.numberphone?.includes(searchTerm)
        )
        : users;

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                <p>Đang tải danh sách tài khoản...</p>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#333', marginBottom: '24px' }}>
                <i className="fas fa-users" style={{ color: '#667eea', marginRight: '10px' }}></i>
                Quản lý tài khoản
            </h1>

            <div className="admin-table-card">
                <div className="admin-table-header">
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="🔍 Tìm tên, email, SĐT..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '8px 14px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '14px', width: '280px', outline: 'none' }}
                        />
                        <span style={{ fontSize: '13px', color: '#888' }}>{filtered.length} tài khoản</span>
                    </div>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>SĐT</th>
                            <th>Vai trò</th>
                            <th>Giỏ hàng</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(user => (
                            <tr key={user.id}>
                                <td><strong>#{user.id}</strong></td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            background: user.role === 'admin' ? 'linear-gradient(135deg, #dc3545, #fd7e14)' : 'linear-gradient(135deg, #667eea, #764ba2)',
                                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 700, fontSize: '13px', flexShrink: 0
                                        }}>
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span style={{ fontWeight: 500 }}>{user.name}</span>
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>{user.numberphone}</td>
                                <td>
                                    <span className={`admin-badge ${user.role === 'admin' ? 'cancelled' : 'delivered'}`}>
                                        {user.role === 'admin' ? 'Admin' : 'Khách hàng'}
                                    </span>
                                </td>
                                <td>{user.cart?.length || 0} sản phẩm</td>
                                <td>
                                    {user.role !== 'admin' && (
                                        <button className="admin-action-btn delete" onClick={() => handleDelete(user.id, user.name)}>
                                            <i className="fas fa-trash"></i> Xóa
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
