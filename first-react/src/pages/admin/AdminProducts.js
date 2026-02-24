import React, { useState, useEffect } from 'react';
import { itemAPI } from '../../APIs/APIs';

const emptyProduct = {
    name: '', price: '', remain: '',
    cpu: '', ram: '', drive: '', card: '',
    screen: '', camera: '', port: '', weight: '',
    pin: '', system: '', images: ['']
};

const AdminProducts = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ ...emptyProduct });
    const [searchTerm, setSearchTerm] = useState('');

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await itemAPI.get('/');
            setItems(res.data);
        } catch (err) {
            console.error('Lỗi tải sản phẩm:', err);
        }
        setLoading(false);
    };

    useEffect(() => { fetchItems(); }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const addImageField = () => {
        setFormData({ ...formData, images: [...formData.images, ''] });
    };

    const removeImageField = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages.length > 0 ? newImages : [''] });
    };

    const openAddForm = () => {
        setEditingId(null);
        setFormData({ ...emptyProduct, images: [''] });
        setShowForm(true);
    };

    const openEditForm = (item) => {
        setEditingId(item.id);
        setFormData({
            name: item.name || '',
            price: item.price || '',
            remain: item.remain || '',
            cpu: item.cpu || '',
            ram: item.ram || '',
            drive: item.drive || '',
            card: item.card || '',
            screen: item.screen || '',
            camera: item.camera || '',
            port: item.port || '',
            weight: item.weight || '',
            pin: item.pin || '',
            system: item.system || '',
            images: item.images?.length > 0 ? [...item.images] : ['']
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price) {
            alert('Vui lòng nhập tên và giá sản phẩm!');
            return;
        }

        const payload = {
            ...formData,
            price: Number(formData.price),
            remain: Number(formData.remain) || 0,
            monthly: Math.round(Number(formData.price) / 12),
            images: formData.images.filter(img => img.trim() !== '')
        };

        try {
            if (editingId) {
                await itemAPI.patch(`/${editingId}`, payload);
                alert('Cập nhật sản phẩm thành công!');
            } else {
                await itemAPI.post('/', payload);
                alert('Thêm sản phẩm thành công!');
            }
            setShowForm(false);
            fetchItems();
        } catch (err) {
            console.error('Lỗi lưu sản phẩm:', err);
            alert('Không thể lưu sản phẩm. Vui lòng thử lại.');
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Bạn có chắc muốn xóa "${name}"?`)) return;
        try {
            await itemAPI.delete(`/${id}`);
            alert('Đã xóa sản phẩm!');
            fetchItems();
        } catch (err) {
            console.error('Lỗi xóa:', err);
            alert('Không thể xóa sản phẩm.');
        }
    };

    const filtered = searchTerm
        ? items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : items;

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                <p>Đang tải sản phẩm...</p>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#333', marginBottom: '24px' }}>
                <i className="fas fa-box" style={{ color: '#667eea', marginRight: '10px' }}></i>
                Quản lý sản phẩm
            </h1>

            <div className="admin-table-card">
                <div className="admin-table-header">
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="🔍 Tìm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '8px 14px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '14px', width: '250px', outline: 'none' }}
                        />
                        <span style={{ fontSize: '13px', color: '#888' }}>{filtered.length} sản phẩm</span>
                    </div>
                    <button className="admin-add-btn" onClick={openAddForm}>
                        <i className="fas fa-plus" style={{ marginRight: '6px' }}></i>Thêm sản phẩm
                    </button>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Hình</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá</th>
                            <th>Còn lại</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(item => (
                            <tr key={item.id}>
                                <td>
                                    <img src={item.images?.[0]} alt={item.name} />
                                </td>
                                <td style={{ maxWidth: '300px' }}>
                                    <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {item.name}
                                    </div>
                                </td>
                                <td className="price-text">{item.price?.toLocaleString('vi-VN')}₫</td>
                                <td>{item.remain}</td>
                                <td>
                                    <button className="admin-action-btn edit" onClick={() => openEditForm(item)}>
                                        <i className="fas fa-pen"></i> Sửa
                                    </button>
                                    <button className="admin-action-btn delete" onClick={() => handleDelete(item.id, item.name)}>
                                        <i className="fas fa-trash"></i> Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingId ? '✏️ Sửa sản phẩm' : '➕ Thêm sản phẩm mới'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="admin-form-group">
                                <label>Tên sản phẩm *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="VD: Laptop Asus TUF Gaming..." required />
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>Giá (VNĐ) *</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="VD: 15000000" required />
                                </div>
                                <div className="admin-form-group">
                                    <label>Số lượng còn</label>
                                    <input type="number" name="remain" value={formData.remain} onChange={handleChange} placeholder="VD: 50" />
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>CPU</label>
                                    <input type="text" name="cpu" value={formData.cpu} onChange={handleChange} placeholder="VD: Intel Core i7-13700H" />
                                </div>
                                <div className="admin-form-group">
                                    <label>RAM</label>
                                    <input type="text" name="ram" value={formData.ram} onChange={handleChange} placeholder="VD: 16GB DDR5" />
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>Ổ cứng</label>
                                    <input type="text" name="drive" value={formData.drive} onChange={handleChange} placeholder="VD: 512GB SSD" />
                                </div>
                                <div className="admin-form-group">
                                    <label>Card đồ họa</label>
                                    <input type="text" name="card" value={formData.card} onChange={handleChange} placeholder="VD: RTX 4060" />
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>Màn hình</label>
                                    <input type="text" name="screen" value={formData.screen} onChange={handleChange} placeholder="VD: 15.6 FHD 144Hz" />
                                </div>
                                <div className="admin-form-group">
                                    <label>Camera</label>
                                    <input type="text" name="camera" value={formData.camera} onChange={handleChange} placeholder="VD: HD 720p" />
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label>Cổng kết nối</label>
                                <input type="text" name="port" value={formData.port} onChange={handleChange} placeholder="VD: USB-C, HDMI, USB-A..." />
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>Trọng lượng</label>
                                    <input type="text" name="weight" value={formData.weight} onChange={handleChange} placeholder="VD: 2.1kg" />
                                </div>
                                <div className="admin-form-group">
                                    <label>Pin</label>
                                    <input type="text" name="pin" value={formData.pin} onChange={handleChange} placeholder="VD: 76Wh" />
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label>Hệ điều hành</label>
                                <input type="text" name="system" value={formData.system} onChange={handleChange} placeholder="VD: Windows 11" />
                            </div>

                            {/* Images */}
                            <div className="admin-form-group">
                                <label>Hình ảnh (URL)</label>
                                {formData.images.map((img, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                                        <input
                                            type="url"
                                            value={img}
                                            onChange={(e) => handleImageChange(idx, e.target.value)}
                                            placeholder="https://example.com/image.jpg"
                                            style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '13px' }}
                                        />
                                        {formData.images.length > 1 && (
                                            <button type="button" onClick={() => removeImageField(idx)}
                                                style={{ padding: '8px 12px', background: '#fde8e8', color: '#c62828', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addImageField}
                                    style={{ padding: '6px 14px', background: '#f0f0f0', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', marginTop: '4px' }}>
                                    + Thêm ảnh
                                </button>
                            </div>

                            <div className="admin-form-actions">
                                <button type="submit" className="admin-form-save">
                                    <i className="fas fa-check" style={{ marginRight: '6px' }}></i>
                                    {editingId ? 'Cập nhật' : 'Thêm sản phẩm'}
                                </button>
                                <button type="button" className="admin-form-cancel" onClick={() => setShowForm(false)}>
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
