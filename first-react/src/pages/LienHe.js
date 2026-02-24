import React, { useState } from 'react';
import Myheader from './Myheader';
import Footer from './Footer';
import '../css/LienHe.css';

const LienHe = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Hiển thị thông báo thành công
        setSubmitted(true);
        // Reset form sau 3 giây
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        }, 3000);
    };

    return (
        <div>
            <Myheader />
            <div className="lienhe-page">
                <div className="lienhe-container">
                    <h1 className="lienhe-title">Liên hệ với chúng tôi</h1>
                    <p className="lienhe-subtitle">
                        Bạn có câu hỏi hoặc cần hỗ trợ? Hãy liên hệ với chúng tôi qua form bên dưới hoặc đến trực tiếp cửa hàng.
                    </p>

                    <div className="lienhe-content">
                        {/* Cột trái: Thông tin + Form */}
                        <div className="lienhe-left">
                            {/* Thẻ thông tin */}
                            <div className="lienhe-info-cards">
                                <div className="lienhe-info-card">
                                    <div className="lienhe-info-icon address">
                                        <i className="fas fa-map-marker-alt"></i>
                                    </div>
                                    <div className="lienhe-info-text">
                                        <h4>Địa chỉ</h4>
                                        <p>Trường ĐH Phenikaa, Yên Nghĩa, Hà Đông, Hà Nội</p>
                                    </div>
                                </div>
                                <div className="lienhe-info-card">
                                    <div className="lienhe-info-icon phone">
                                        <i className="fas fa-phone-alt"></i>
                                    </div>
                                    <div className="lienhe-info-text">
                                        <h4>Hotline</h4>
                                        <p>0123 404 953</p>
                                    </div>
                                </div>
                                <div className="lienhe-info-card">
                                    <div className="lienhe-info-icon email">
                                        <i className="fas fa-envelope"></i>
                                    </div>
                                    <div className="lienhe-info-text">
                                        <h4>Email</h4>
                                        <p>contact@phenikaa.edu.vn</p>
                                    </div>
                                </div>
                                <div className="lienhe-info-card">
                                    <div className="lienhe-info-icon hours">
                                        <i className="fas fa-clock"></i>
                                    </div>
                                    <div className="lienhe-info-text">
                                        <h4>Giờ làm việc</h4>
                                        <p>8:00 - 21:00 (T2 - CN)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Form liên hệ */}
                            <div className="lienhe-form-container">
                                <h3>Gửi tin nhắn cho chúng tôi</h3>
                                {submitted && (
                                    <div className="lienhe-success-msg">
                                        ✅ Cảm ơn bạn! Tin nhắn đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất.
                                    </div>
                                )}
                                <form className="lienhe-form" onSubmit={handleSubmit}>
                                    <div className="lienhe-form-row">
                                        <div className="lienhe-form-group">
                                            <label>Họ và tên *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Nhập họ và tên"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="lienhe-form-group">
                                            <label>Email *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Nhập email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="lienhe-form-row">
                                        <div className="lienhe-form-group">
                                            <label>Số điện thoại</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="Nhập số điện thoại"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="lienhe-form-group">
                                            <label>Chủ đề *</label>
                                            <input
                                                type="text"
                                                name="subject"
                                                placeholder="Nhập chủ đề"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="lienhe-form-group">
                                        <label>Nội dung tin nhắn *</label>
                                        <textarea
                                            name="message"
                                            placeholder="Nhập nội dung tin nhắn..."
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="lienhe-submit-btn">
                                        <i className="fas fa-paper-plane"></i> Gửi tin nhắn
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Cột phải: Google Maps */}
                        <div className="lienhe-map-container">
                            <iframe
                                title="Phenikaa University Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.901021806074!2d105.74468277508136!3d20.964864080685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313452efff394ce3%3A0x391a39d4325be464!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBQaGVuaWthYQ!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                            <div className="lienhe-map-label">
                                <i className="fas fa-map-marker-alt"></i>
                                Trường Đại học Phenikaa - Yên Nghĩa, Hà Đông, Hà Nội
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LienHe;
