import React, { useState, useEffect } from 'react';
import axios from 'axios';

const url = process.env.REACT_APP_API_URL || "http://localhost:5000";
const couponAPI = axios.create({
    baseURL: url + '/coupons',
    headers: { "Content-Type": "application/json" },
});

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        code: '', type: 'percent', value: '', minOrder: '', maxDiscount: '',
        usageLimit: '', expiryDate: '', active: true
    });

    useEffect(() => { fetchCoupons(); }, []);

    const fetchCoupons = async () => {
        try {
            const res = await couponAPI.get('/');
            setCoupons(res.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const resetForm = () => {
        setForm({ code: '', type: 'percent', value: '', minOrder: '', maxDiscount: '', usageLimit: '', expiryDate: '', active: true });
        setEditing(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ...form,
            value: Number(form.value),
            minOrder: Number(form.minOrder),
            maxDiscount: Number(form.maxDiscount) || 0,
            usageLimit: Number(form.usageLimit),
            usedCount: editing ? editing.usedCount : 0
        };
        try {
            if (editing) {
                await couponAPI.put(`/${editing.id}`, { ...data, id: editing.id });
            } else {
                await couponAPI.post('/', data);
            }
            fetchCoupons();
            resetForm();
        } catch (err) { console.error(err); alert('Lỗi lưu mã giảm giá!'); }
    };

    const handleEdit = (coupon) => {
        setForm({
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            minOrder: coupon.minOrder,
            maxDiscount: coupon.maxDiscount || 0,
            usageLimit: coupon.usageLimit,
            expiryDate: coupon.expiryDate,
            active: coupon.active
        });
        setEditing(coupon);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xác nhận xóa mã giảm giá?')) return;
        try {
            await couponAPI.delete(`/${id}`);
            fetchCoupons();
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="admin-loading"><div className="spinner"></div><p>Đang tải...</p></div>;

    return (
        <div>
            <div className="admin-table-header">
                <h2><i className="fas fa-ticket-alt" style={{ color: '#EE1926', marginRight: '8px' }}></i>Quản lý mã giảm giá</h2>
                <button className="admin-add-btn" onClick={() => { resetForm(); setShowForm(true); }}>
                    <i className="fas fa-plus"></i> Thêm mã
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) resetForm(); }}>
                    <div className="admin-modal">
                        <h2>{editing ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>Mã code *</label>
                                    <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} required placeholder="VD: GIAM10PHAN" />
                                </div>
                                <div className="admin-form-group">
                                    <label>Loại giảm giá *</label>
                                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ width: '100%', padding: '10px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '14px' }}>
                                        <option value="percent">Giảm theo %</option>
                                        <option value="fixed">Giảm cố định (₫)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>{form.type === 'percent' ? 'Phần trăm giảm (%)' : 'Số tiền giảm (₫)'} *</label>
                                    <input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} required min="1" />
                                </div>
                                <div className="admin-form-group">
                                    <label>Đơn hàng tối thiểu (₫) *</label>
                                    <input type="number" value={form.minOrder} onChange={e => setForm({ ...form, minOrder: e.target.value })} required min="0" />
                                </div>
                            </div>
                            {form.type === 'percent' && (
                                <div className="admin-form-group">
                                    <label>Giảm tối đa (₫)</label>
                                    <input type="number" value={form.maxDiscount} onChange={e => setForm({ ...form, maxDiscount: e.target.value })} min="0" />
                                </div>
                            )}
                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>Tổng lượt sử dụng *</label>
                                    <input type="number" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: e.target.value })} required min="1" />
                                </div>
                                <div className="admin-form-group">
                                    <label>Ngày hết hạn *</label>
                                    <input type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} required />
                                </div>
                            </div>
                            <div className="admin-form-actions">
                                <button type="submit" className="admin-form-save">{editing ? 'Cập nhật' : 'Tạo mã'}</button>
                                <button type="button" className="admin-form-cancel" onClick={resetForm}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="admin-table-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Mã</th>
                            <th>Loại</th>
                            <th>Giá trị</th>
                            <th>Đơn tối thiểu</th>
                            <th>Đã dùng</th>
                            <th>HSD</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.length === 0 ? (
                            <tr><td colSpan="8" style={{ textAlign: 'center', color: '#999', padding: '30px' }}>Chưa có mã giảm giá</td></tr>
                        ) : coupons.map(c => {
                            const expired = new Date(c.expiryDate) < new Date();
                            return (
                                <tr key={c.id}>
                                    <td><strong style={{ color: '#EE1926' }}>{c.code}</strong></td>
                                    <td>{c.type === 'percent' ? 'Phần trăm' : 'Cố định'}</td>
                                    <td>{c.type === 'percent' ? `${c.value}%` : `${c.value.toLocaleString('vi-VN')}₫`}</td>
                                    <td>{c.minOrder.toLocaleString('vi-VN')}₫</td>
                                    <td>{c.usedCount || 0}/{c.usageLimit}</td>
                                    <td>{new Date(c.expiryDate).toLocaleDateString('vi-VN')}</td>
                                    <td>
                                        <span className={`admin-badge ${expired ? 'cancelled' : c.active ? 'delivered' : 'pending'}`}>
                                            {expired ? 'Hết hạn' : c.active ? 'Hoạt động' : 'Tắt'}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="admin-action-btn edit" onClick={() => handleEdit(c)}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="admin-action-btn delete" onClick={() => handleDelete(c.id)}>
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCoupons;
