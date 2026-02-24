import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../APIs/APIs';
import Myheader from './Myheader';
import Footer from './Footer';
import '../css/Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', numberphone: '' });
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('user'));
        if (!stored || !stored.id) {
            navigate('/dangnhap');
            return;
        }
        // Lấy dữ liệu mới nhất từ server
        const fetchUser = async () => {
            try {
                const res = await userAPI.get(`/${stored.id}`);
                setUser(res.data);
                setFormData({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    numberphone: res.data.numberphone || ''
                });
            } catch (err) {
                console.error('Lỗi tải thông tin:', err);
                // Fallback dùng localStorage
                setUser(stored);
                setFormData({
                    name: stored.name || '',
                    email: stored.email || '',
                    numberphone: stored.numberphone || ''
                });
            }
            setLoading(false);
        };
        fetchUser();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const res = await userAPI.patch(`/${user.id}`, {
                name: formData.name,
                email: formData.email,
                numberphone: formData.numberphone
            });
            const updatedUser = res.data;
            setUser(updatedUser);
            // Cập nhật localStorage
            localStorage.setItem('user', JSON.stringify({
                ...JSON.parse(localStorage.getItem('user')),
                name: updatedUser.name,
                email: updatedUser.email,
                numberphone: updatedUser.numberphone
            }));
            setEditing(false);
            setSuccessMsg('Cập nhật thông tin thành công!');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            console.error('Lỗi cập nhật:', err);
            alert('Không thể cập nhật. Vui lòng thử lại.');
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user.name || '',
            email: user.email || '',
            numberphone: user.numberphone || ''
        });
        setEditing(false);
    };

    if (loading) {
        return (
            <div>
                <Myheader />
                <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p>Đang tải...</p>
                </div>
                <Footer />
            </div>
        );
    }

    const avatarLetter = user?.name ? user.name.charAt(0) : '?';

    return (
        <div>
            <Myheader />
            <div className="profile-page">
                <div className="profile-container">
                    {/* Header avatar */}
                    <div className="profile-header">
                        <div className="profile-avatar">{avatarLetter}</div>
                        <h1>{user?.name || 'Người dùng'}</h1>
                        <p>{user?.email}</p>
                    </div>

                    {/* Card thông tin */}
                    <div className="profile-card">
                        <h3 className="profile-card-title">
                            <i className="fas fa-user-edit"></i>
                            Thông tin cá nhân
                        </h3>

                        {successMsg && (
                            <div className="profile-success-msg">✅ {successMsg}</div>
                        )}

                        {!editing ? (
                            /* === Chế độ xem === */
                            <>
                                <div className="profile-field">
                                    <label>Họ và tên</label>
                                    <div className="profile-field-value">
                                        <i className="fas fa-user"></i>
                                        <span>{user?.name || '—'}</span>
                                    </div>
                                </div>
                                <div className="profile-field">
                                    <label>Email</label>
                                    <div className="profile-field-value">
                                        <i className="fas fa-envelope"></i>
                                        <span>{user?.email || '—'}</span>
                                    </div>
                                </div>
                                <div className="profile-field">
                                    <label>Số điện thoại</label>
                                    <div className="profile-field-value">
                                        <i className="fas fa-phone-alt"></i>
                                        <span>{user?.numberphone || '—'}</span>
                                    </div>
                                </div>
                                <div className="profile-actions">
                                    <button className="profile-btn profile-btn-edit" onClick={() => setEditing(true)}>
                                        <i className="fas fa-pen" style={{ marginRight: '6px' }}></i>
                                        Chỉnh sửa
                                    </button>
                                </div>
                            </>
                        ) : (
                            /* === Chế độ chỉnh sửa === */
                            <>
                                <div className="profile-field">
                                    <label>Họ và tên</label>
                                    <div className="profile-field-value">
                                        <i className="fas fa-user"></i>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Nhập họ và tên"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="profile-field">
                                    <label>Email</label>
                                    <div className="profile-field-value">
                                        <i className="fas fa-envelope"></i>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Nhập email"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="profile-field">
                                    <label>Số điện thoại</label>
                                    <div className="profile-field-value">
                                        <i className="fas fa-phone-alt"></i>
                                        <input
                                            type="tel"
                                            name="numberphone"
                                            value={formData.numberphone}
                                            onChange={handleChange}
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>
                                </div>
                                <div className="profile-actions">
                                    <button className="profile-btn profile-btn-save" onClick={handleSave}>
                                        <i className="fas fa-check" style={{ marginRight: '6px' }}></i>
                                        Lưu thay đổi
                                    </button>
                                    <button className="profile-btn profile-btn-cancel" onClick={handleCancel}>
                                        Hủy
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
