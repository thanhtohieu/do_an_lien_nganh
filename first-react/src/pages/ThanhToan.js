import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI, itemAPI } from "../APIs/APIs";
import axios from "axios";
import Myheader from "./Myheader";
import '../css/ThanhToan.css';
import '../css/MyCoupons.css';
import Footer from "./Footer";

const url = process.env.REACT_APP_API_URL || "http://localhost:5000";
const orderAPI = axios.create({
    baseURL: url + '/orders',
    headers: { "Content-Type": "application/json" },
});
const couponAPI = axios.create({
    baseURL: url + '/coupons',
    headers: { "Content-Type": "application/json" },
});

// Thông tin tài khoản ngân hàng cửa hàng (thay đổi theo thực tế)
const BANK_INFO = {
    bankId: "MB",           // Mã ngân hàng (MB Bank)
    accountNo: "0123456789", // Số tài khoản
    accountName: "LAPTOP PC SHOP",
    template: "compact2"
};

// Thông tin MoMo cửa hàng
const MOMO_INFO = {
    phone: "0123456789",
    name: "LAPTOP PC SHOP"
};

const ThanhToan = () => {
    const [user, setUser] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [myCoupons, setMyCoupons] = useState([]);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [discount, setDiscount] = useState(0);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        note: "",
        payment: "cod"
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const u = JSON.parse(storedUser);
            setUser(u);
            setFormData(prev => ({
                ...prev,
                name: u.name || "",
                phone: u.numberphone || ""
            }));
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user && user.cart && user.cart.length > 0) {
            loadCartItems(user.cart);
        } else {
            setLoading(false);
        }
    }, [user]);

    const loadCartItems = async (cart) => {
        try {
            const response = await itemAPI.get("/");
            const allItems = response.data;
            const merged = cart
                .map(cartItem => {
                    const product = allItems.find(p => p.id === cartItem.id);
                    if (product) return { ...product, quantity: cartItem.number };
                    return null;
                })
                .filter(Boolean);
            setCartItems(merged);
        } catch (err) {
            console.error("Error loading cart:", err);
        } finally {
            setLoading(false);
        }
    };

    // Load saved coupons
    useEffect(() => {
        if (user) {
            const loadCoupons = async () => {
                try {
                    const [couponRes, userRes] = await Promise.all([
                        couponAPI.get('/'),
                        userAPI.get(`/${user.id}`)
                    ]);
                    const savedIds = userRes.data.savedCoupons || [];
                    const saved = couponRes.data.filter(c => savedIds.includes(c.id));
                    setMyCoupons(saved);
                } catch (err) { console.error('Error loading coupons:', err); }
            };
            loadCoupons();
        }
    }, [user]);

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Calculate discount when coupon or total changes
    useEffect(() => {
        if (!selectedCoupon) { setDiscount(0); return; }
        if (totalPrice < selectedCoupon.minOrder) { setDiscount(0); setSelectedCoupon(null); return; }
        let disc = 0;
        if (selectedCoupon.type === 'percent') {
            disc = Math.round(totalPrice * selectedCoupon.value / 100);
            if (selectedCoupon.maxDiscount && disc > selectedCoupon.maxDiscount) disc = selectedCoupon.maxDiscount;
        } else {
            disc = selectedCoupon.value;
        }
        setDiscount(disc);
    }, [selectedCoupon, totalPrice]);

    const finalPrice = totalPrice - discount;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.address) {
            alert("Vui lòng điền đầy đủ thông tin giao hàng!");
            return;
        }

        if (cartItems.length === 0) {
            alert("Giỏ hàng trống!");
            return;
        }

        setSubmitting(true);
        try {
            // Create order
            const order = {
                userId: user.id,
                customerName: formData.name,
                phone: formData.phone,
                address: formData.address,
                note: formData.note,
                payment: formData.payment,
                items: cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.images?.[0] || ""
                })),
                totalPrice: finalPrice,
                originalPrice: totalPrice,
                couponCode: selectedCoupon ? selectedCoupon.code : null,
                discount: discount,
                status: "pending",
                createdAt: new Date().toISOString()
            };

            const orderResponse = await orderAPI.post("/", order);
            setOrderId(orderResponse.data.id);

            // Update item stock
            for (const item of cartItems) {
                const newRemain = Math.max(0, item.remain - item.quantity);
                await itemAPI.patch(`/${item.id}`, { remain: newRemain });
            }

            // Update coupon usage
            if (selectedCoupon) {
                await couponAPI.patch(`/${selectedCoupon.id}`, {
                    usedCount: (selectedCoupon.usedCount || 0) + 1
                });
            }

            // Clear cart
            await userAPI.patch(`/${user.id}`, { cart: [] });
            const updatedUser = { ...user, cart: [] };
            localStorage.setItem("user", JSON.stringify(updatedUser));

            setOrderSuccess(true);
        } catch (err) {
            console.error("Error placing order:", err);
            alert("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại!");
        } finally {
            setSubmitting(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="thanhtoan-page">
                <Myheader />
                <div className="thanhtoan-container">
                    <div className="order-success">
                        <div className="success-icon">
                            <i className="fas fa-check-circle"></i>
                        </div>
                        <h1>Đặt hàng thành công!</h1>
                        <p>Mã đơn hàng của bạn: <strong>#{orderId}</strong></p>
                        <p>Chúng tôi sẽ liên hệ bạn sớm nhất để xác nhận đơn hàng.</p>
                        <div className="success-actions">
                            <a href="/" className="tt-btn-primary">Về trang chủ</a>
                            <a href="/KiemTraDonHang" className="tt-btn-secondary">Kiểm tra đơn hàng</a>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="thanhtoan-page">
            <Myheader />
            <div className="thanhtoan-container">
                <h1 className="thanhtoan-title">
                    <i className="fas fa-credit-card"></i> Thanh toán
                </h1>

                {loading ? (
                    <p>Đang tải...</p>
                ) : !user ? (
                    <div className="thanhtoan-empty">
                        <p>Bạn chưa đăng nhập.</p>
                        <a href="/Dangnhap" className="tt-btn-primary">Đăng nhập</a>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="thanhtoan-empty">
                        <p>Giỏ hàng trống. Không có sản phẩm để thanh toán.</p>
                        <a href="/DanhmucSanpham" className="tt-btn-primary">Mua sắm ngay</a>
                    </div>
                ) : (
                    <div className="thanhtoan-content">
                        <div className="thanhtoan-left">
                            {/* Shipping Info */}
                            <div className="tt-section">
                                <h2><i className="fas fa-map-marker-alt"></i> Thông tin giao hàng</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="tt-form-group">
                                        <label>Họ và tên *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Nhập họ tên người nhận"
                                            required
                                        />
                                    </div>
                                    <div className="tt-form-group">
                                        <label>Số điện thoại *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Nhập số điện thoại"
                                            required
                                        />
                                    </div>
                                    <div className="tt-form-group">
                                        <label>Địa chỉ giao hàng *</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/TP"
                                            required
                                        />
                                    </div>
                                    <div className="tt-form-group">
                                        <label>Ghi chú</label>
                                        <textarea
                                            name="note"
                                            value={formData.note}
                                            onChange={handleChange}
                                            placeholder="Ghi chú cho đơn hàng (tùy chọn)"
                                            rows="3"
                                        ></textarea>
                                    </div>
                                </form>
                            </div>

                            {/* Payment Method */}
                            <div className="tt-section">
                                <h2><i className="fas fa-wallet"></i> Phương thức thanh toán</h2>
                                <div className="tt-payment-options">
                                    {/* 1. COD */}
                                    <label className={`tt-payment-option ${formData.payment === 'cod' ? 'active' : ''}`}>
                                        <input type="radio" name="payment" value="cod" checked={formData.payment === 'cod'} onChange={handleChange} />
                                        <div className="tt-payment-info">
                                            <i className="fas fa-money-bill-wave"></i>
                                            <div>
                                                <strong>Thanh toán khi nhận hàng (COD)</strong>
                                                <p>Thanh toán bằng tiền mặt khi nhận hàng</p>
                                            </div>
                                        </div>
                                    </label>

                                    {/* 2. Bank Transfer */}
                                    <label className={`tt-payment-option ${formData.payment === 'bank' ? 'active' : ''}`}>
                                        <input type="radio" name="payment" value="bank" checked={formData.payment === 'bank'} onChange={handleChange} />
                                        <div className="tt-payment-info">
                                            <i className="fas fa-university"></i>
                                            <div>
                                                <strong>Chuyển khoản ngân hàng</strong>
                                                <p>Quét mã QR để chuyển khoản</p>
                                            </div>
                                        </div>
                                    </label>

                                    {/* 3. MoMo */}
                                    <label className={`tt-payment-option ${formData.payment === 'momo' ? 'active' : ''}`}>
                                        <input type="radio" name="payment" value="momo" checked={formData.payment === 'momo'} onChange={handleChange} />
                                        <div className="tt-payment-info">
                                            <i className="fas fa-mobile-alt" style={{ color: '#a50064' }}></i>
                                            <div>
                                                <strong>Ví MoMo</strong>
                                                <p>Quét mã QR MoMo để thanh toán</p>
                                            </div>
                                        </div>
                                    </label>

                                    {/* 4. ZaloPay */}
                                    <label className={`tt-payment-option ${formData.payment === 'zalopay' ? 'active' : ''}`}>
                                        <input type="radio" name="payment" value="zalopay" checked={formData.payment === 'zalopay'} onChange={handleChange} />
                                        <div className="tt-payment-info">
                                            <i className="fas fa-wallet" style={{ color: '#0068ff' }}></i>
                                            <div>
                                                <strong>Ví ZaloPay</strong>
                                                <p>Quét mã QR ZaloPay để thanh toán</p>
                                            </div>
                                        </div>
                                    </label>

                                    {/* 5. VNPAY-QR */}
                                    <label className={`tt-payment-option ${formData.payment === 'vnpay' ? 'active' : ''}`}>
                                        <input type="radio" name="payment" value="vnpay" checked={formData.payment === 'vnpay'} onChange={handleChange} />
                                        <div className="tt-payment-info">
                                            <i className="fas fa-qrcode" style={{ color: '#e21b1b' }}></i>
                                            <div>
                                                <strong>Qua VNPAY-QR</strong>
                                                <p>Quét mã SmartPay-QR qua ứng dụng ngân hàng</p>
                                            </div>
                                        </div>
                                    </label>

                                    {/* 6. Visa/Mastercard/JCB */}
                                    <label className={`tt-payment-option ${formData.payment === 'credit_card' ? 'active' : ''}`}>
                                        <input type="radio" name="payment" value="credit_card" checked={formData.payment === 'credit_card'} onChange={handleChange} />
                                        <div className="tt-payment-info">
                                            <i className="fas fa-credit-card" style={{ color: '#1a1f71' }}></i>
                                            <div>
                                                <strong>Thẻ quốc tế (Visa / Mastercard / JCB)</strong>
                                                <p>Thanh toán bằng thẻ tín dụng / ghi nợ quốc tế</p>
                                            </div>
                                        </div>
                                    </label>

                                    {/* 7. ATM / Internet Banking */}
                                    <label className={`tt-payment-option ${formData.payment === 'atm' ? 'active' : ''}`}>
                                        <input type="radio" name="payment" value="atm" checked={formData.payment === 'atm'} onChange={handleChange} />
                                        <div className="tt-payment-info">
                                            <i className="fas fa-id-card" style={{ color: '#2d6a4f' }}></i>
                                            <div>
                                                <strong>Qua thẻ ATM (có Internet Banking)</strong>
                                                <p>Thanh toán qua thẻ ATM nội địa</p>
                                            </div>
                                        </div>
                                    </label>

                                </div>

                                {/* ===== DETAIL PANELS ===== */}

                                {/* Bank Transfer QR */}
                                {formData.payment === 'bank' && totalPrice > 0 && (
                                    <div className="tt-qr-section">
                                        <div className="tt-qr-header">
                                            <i className="fas fa-qrcode"></i>
                                            <h3>Quét mã QR để thanh toán</h3>
                                        </div>
                                        <div className="tt-qr-body">
                                            <div className="tt-qr-image">
                                                <img
                                                    src={`https://img.vietqr.io/image/${BANK_INFO.bankId}-${BANK_INFO.accountNo}-${BANK_INFO.template}.png?amount=${totalPrice}&addInfo=Thanh+toan+don+hang&accountName=${encodeURIComponent(BANK_INFO.accountName)}`}
                                                    alt="QR Chuyển khoản ngân hàng"
                                                />
                                            </div>
                                            <div className="tt-qr-info">
                                                <div className="tt-qr-detail"><span>Ngân hàng:</span><strong>MB Bank</strong></div>
                                                <div className="tt-qr-detail"><span>Số tài khoản:</span><strong>{BANK_INFO.accountNo}</strong></div>
                                                <div className="tt-qr-detail"><span>Chủ tài khoản:</span><strong>{BANK_INFO.accountName}</strong></div>
                                                <div className="tt-qr-detail tt-qr-amount"><span>Số tiền:</span><strong>{totalPrice.toLocaleString("vi-VN")}₫</strong></div>
                                            </div>
                                            <p className="tt-qr-note"><i className="fas fa-info-circle"></i> Mở ứng dụng ngân hàng và quét mã QR để thanh toán tự động</p>
                                        </div>
                                    </div>
                                )}

                                {/* MoMo QR */}
                                {formData.payment === 'momo' && totalPrice > 0 && (
                                    <div className="tt-qr-section tt-qr-momo">
                                        <div className="tt-qr-header" style={{ background: 'linear-gradient(135deg, #a50064, #d6006e)' }}>
                                            <i className="fas fa-qrcode"></i>
                                            <h3>Quét mã QR MoMo</h3>
                                        </div>
                                        <div className="tt-qr-body">
                                            <div className="tt-qr-image tt-qr-momo-img">
                                                <img
                                                    src={`https://momosv3.apimienphi.com/api/QRCode?phone=${MOMO_INFO.phone}&amount=${totalPrice}&note=${encodeURIComponent('Thanh toan don hang')}`}
                                                    alt="QR MoMo"
                                                    onError={(e) => { e.target.src = `https://img.vietqr.io/image/MOMO-${MOMO_INFO.phone}-compact2.png?amount=${totalPrice}&addInfo=Thanh+toan+don+hang`; }}
                                                />
                                            </div>
                                            <div className="tt-qr-info">
                                                <div className="tt-qr-detail"><span>Ví MoMo:</span><strong>{MOMO_INFO.phone}</strong></div>
                                                <div className="tt-qr-detail"><span>Tên:</span><strong>{MOMO_INFO.name}</strong></div>
                                                <div className="tt-qr-detail tt-qr-amount" style={{ color: '#a50064' }}><span>Số tiền:</span><strong>{totalPrice.toLocaleString("vi-VN")}₫</strong></div>
                                            </div>
                                            <p className="tt-qr-note"><i className="fas fa-info-circle"></i> Mở ứng dụng MoMo → Quét mã QR → Xác nhận thanh toán</p>
                                        </div>
                                    </div>
                                )}

                                {/* ZaloPay QR */}
                                {formData.payment === 'zalopay' && totalPrice > 0 && (
                                    <div className="tt-qr-section">
                                        <div className="tt-qr-header" style={{ background: 'linear-gradient(135deg, #0068ff, #004fc4)' }}>
                                            <i className="fas fa-qrcode"></i>
                                            <h3>Quét mã QR ZaloPay</h3>
                                        </div>
                                        <div className="tt-qr-body">
                                            <div className="tt-qr-image" style={{ borderColor: '#0068ff', background: '#f0f6ff' }}>
                                                <img
                                                    src={`https://img.vietqr.io/image/${BANK_INFO.bankId}-${BANK_INFO.accountNo}-${BANK_INFO.template}.png?amount=${totalPrice}&addInfo=ZaloPay+Thanh+toan&accountName=${encodeURIComponent(BANK_INFO.accountName)}`}
                                                    alt="QR ZaloPay"
                                                />
                                            </div>
                                            <div className="tt-qr-info">
                                                <div className="tt-qr-detail"><span>Ví ZaloPay:</span><strong>{MOMO_INFO.phone}</strong></div>
                                                <div className="tt-qr-detail"><span>Tên:</span><strong>{MOMO_INFO.name}</strong></div>
                                                <div className="tt-qr-detail tt-qr-amount" style={{ color: '#0068ff' }}><span>Số tiền:</span><strong>{totalPrice.toLocaleString("vi-VN")}₫</strong></div>
                                            </div>
                                            <p className="tt-qr-note"><i className="fas fa-info-circle"></i> Mở ứng dụng ZaloPay → Quét mã QR → Xác nhận thanh toán</p>
                                        </div>
                                    </div>
                                )}

                                {/* VNPAY QR */}
                                {formData.payment === 'vnpay' && totalPrice > 0 && (
                                    <div className="tt-qr-section">
                                        <div className="tt-qr-header" style={{ background: 'linear-gradient(135deg, #e21b1b, #b71515)' }}>
                                            <i className="fas fa-qrcode"></i>
                                            <h3>Quét mã VNPAY-QR</h3>
                                        </div>
                                        <div className="tt-qr-body">
                                            <div className="tt-qr-image" style={{ borderColor: '#e21b1b', background: '#fff5f5' }}>
                                                <img
                                                    src={`https://img.vietqr.io/image/${BANK_INFO.bankId}-${BANK_INFO.accountNo}-${BANK_INFO.template}.png?amount=${totalPrice}&addInfo=VNPAY+Thanh+toan&accountName=${encodeURIComponent(BANK_INFO.accountName)}`}
                                                    alt="QR VNPAY"
                                                />
                                            </div>
                                            <div className="tt-qr-info">
                                                <div className="tt-qr-detail"><span>Cổng thanh toán:</span><strong>VNPAY</strong></div>
                                                <div className="tt-qr-detail tt-qr-amount"><span>Số tiền:</span><strong>{totalPrice.toLocaleString("vi-VN")}₫</strong></div>
                                            </div>
                                            <p className="tt-qr-note"><i className="fas fa-info-circle"></i> Mở ứng dụng ngân hàng hỗ trợ VNPAY → Quét mã QR → Xác nhận</p>
                                        </div>
                                    </div>
                                )}

                                {/* Credit Card Form */}
                                {formData.payment === 'credit_card' && (
                                    <div className="tt-card-section">
                                        <div className="tt-card-header">
                                            <i className="fas fa-credit-card"></i>
                                            <h3>Thông tin thẻ quốc tế</h3>
                                            <div className="tt-card-logos">
                                                <span className="tt-card-logo tt-visa">VISA</span>
                                                <span className="tt-card-logo tt-mc">MC</span>
                                                <span className="tt-card-logo tt-jcb">JCB</span>
                                            </div>
                                        </div>
                                        <div className="tt-card-body">
                                            <div className="tt-form-group">
                                                <label>Số thẻ *</label>
                                                <input type="text" name="cardNumber" placeholder="0000 0000 0000 0000" maxLength="19"
                                                    onChange={(e) => {
                                                        let v = e.target.value.replace(/\D/g, '').substring(0, 16);
                                                        v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
                                                        e.target.value = v;
                                                    }}
                                                />
                                            </div>
                                            <div className="tt-form-group">
                                                <label>Tên chủ thẻ *</label>
                                                <input type="text" name="cardName" placeholder="NGUYEN VAN A" style={{ textTransform: 'uppercase' }} />
                                            </div>
                                            <div className="tt-card-row">
                                                <div className="tt-form-group">
                                                    <label>Ngày hết hạn *</label>
                                                    <input type="text" name="cardExpiry" placeholder="MM/YY" maxLength="5"
                                                        onChange={(e) => {
                                                            let v = e.target.value.replace(/\D/g, '').substring(0, 4);
                                                            if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2);
                                                            e.target.value = v;
                                                        }}
                                                    />
                                                </div>
                                                <div className="tt-form-group">
                                                    <label>CVV *</label>
                                                    <input type="password" name="cardCvv" placeholder="•••" maxLength="3" />
                                                </div>
                                            </div>
                                            <p className="tt-card-note"><i className="fas fa-lock"></i> Thông tin thẻ được bảo mật và mã hóa an toàn</p>
                                        </div>
                                    </div>
                                )}

                                {/* ATM / Internet Banking */}
                                {formData.payment === 'atm' && (
                                    <div className="tt-card-section">
                                        <div className="tt-card-header" style={{ background: 'linear-gradient(135deg, #2d6a4f, #40916c)' }}>
                                            <i className="fas fa-id-card"></i>
                                            <h3>Thẻ ATM / Internet Banking</h3>
                                        </div>
                                        <div className="tt-card-body">
                                            <div className="tt-form-group">
                                                <label>Chọn ngân hàng *</label>
                                                <select name="atmBank" className="tt-select" defaultValue="">
                                                    <option value="" disabled>-- Chọn ngân hàng --</option>
                                                    <option value="vcb">Vietcombank</option>
                                                    <option value="tcb">Techcombank</option>
                                                    <option value="mb">MB Bank</option>
                                                    <option value="acb">ACB</option>
                                                    <option value="vpb">VPBank</option>
                                                    <option value="bidv">BIDV</option>
                                                    <option value="agr">Agribank</option>
                                                    <option value="vib">VIB</option>
                                                    <option value="shb">SHB</option>
                                                    <option value="tpb">TPBank</option>
                                                    <option value="msb">MSB</option>
                                                    <option value="scb">Sacombank</option>
                                                </select>
                                            </div>
                                            <div className="tt-form-group">
                                                <label>Số thẻ ATM *</label>
                                                <input type="text" name="atmNumber" placeholder="Nhập số thẻ ATM" maxLength="19" />
                                            </div>
                                            <div className="tt-form-group">
                                                <label>Tên chủ thẻ *</label>
                                                <input type="text" name="atmName" placeholder="NGUYEN VAN A" style={{ textTransform: 'uppercase' }} />
                                            </div>
                                            <p className="tt-card-note"><i className="fas fa-shield-alt"></i> Bạn sẽ được chuyển đến cổng thanh toán ngân hàng để xác nhận</p>
                                        </div>
                                    </div>
                                )}


                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="thanhtoan-right">
                            <div className="tt-order-summary">
                                <h2>Đơn hàng ({cartItems.length} sản phẩm)</h2>
                                <div className="tt-order-items">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="tt-order-item">
                                            <div className="tt-item-img-wrap">
                                                <img src={item.images?.[0]} alt={item.name} />
                                                <span className="tt-item-qty">{item.quantity}</span>
                                            </div>
                                            <div className="tt-item-info">
                                                <p className="tt-item-name">{item.name}</p>
                                                <p className="tt-item-price">{(item.price * item.quantity).toLocaleString("vi-VN")}₫</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="tt-summary-divider"></div>

                                {/* Coupon section */}
                                <div className="tt-coupon-section">
                                    <h3><i className="fas fa-ticket-alt"></i> Mã giảm giá</h3>
                                    {myCoupons.length === 0 ? (
                                        <p className="tt-coupon-empty">Chưa lưu mã giảm giá. <a href="/KhuyenMai" style={{ color: '#EE1926' }}>Lấy mã</a></p>
                                    ) : (
                                        <div className="tt-coupon-list">
                                            {myCoupons.map(c => {
                                                const expired = new Date(c.expiryDate) < new Date();
                                                const soldOut = c.usedCount >= c.usageLimit;
                                                const notEnough = totalPrice < c.minOrder;
                                                const disabled = expired || soldOut || notEnough;
                                                const isSelected = selectedCoupon?.id === c.id;
                                                return (
                                                    <label key={c.id} className={`tt-coupon-item ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                                                        onClick={() => { if (!disabled) setSelectedCoupon(isSelected ? null : c); }}>
                                                        <input type="radio" checked={isSelected} readOnly disabled={disabled} />
                                                        <span className={`tt-coupon-badge ${c.type}`}>
                                                            {c.type === 'percent' ? `-${c.value}%` : `-${(c.value / 1000).toFixed(0)}K`}
                                                        </span>
                                                        <div className="tt-coupon-info">
                                                            <strong>{c.code}</strong>
                                                            <span>
                                                                {disabled
                                                                    ? (expired ? 'Hết hạn' : soldOut ? 'Hết lượt' : `Đơn tối thiểu ${c.minOrder.toLocaleString('vi-VN')}₫`)
                                                                    : `Đơn từ ${c.minOrder.toLocaleString('vi-VN')}₫`
                                                                }
                                                            </span>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}
                                    {selectedCoupon && (
                                        <button className="tt-coupon-clear" onClick={() => setSelectedCoupon(null)}>
                                            <i className="fas fa-times"></i> Bỏ chọn mã
                                        </button>
                                    )}
                                </div>

                                <div className="tt-summary-divider"></div>
                                <div className="tt-summary-row">
                                    <span>Tạm tính:</span>
                                    <span>{totalPrice.toLocaleString("vi-VN")}₫</span>
                                </div>
                                {discount > 0 && (
                                    <div className="tt-summary-row tt-discount-row">
                                        <span><i className="fas fa-tag"></i> Giảm giá ({selectedCoupon?.code}):</span>
                                        <span>-{discount.toLocaleString("vi-VN")}₫</span>
                                    </div>
                                )}
                                <div className="tt-summary-row">
                                    <span>Phí vận chuyển:</span>
                                    <span className="free-ship">Miễn phí</span>
                                </div>
                                <div className="tt-summary-divider"></div>
                                <div className="tt-summary-row tt-summary-total">
                                    <span>Tổng cộng:</span>
                                    <span className="tt-total-price">{finalPrice.toLocaleString("vi-VN")}₫</span>
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    className="tt-submit-btn"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>Đang xử lý...</>
                                    ) : (
                                        <><i className="fas fa-check"></i> Đặt hàng</>
                                    )}
                                </button>
                                <a href="/Giohang" className="tt-back-btn">
                                    <i className="fas fa-arrow-left"></i> Quay lại giỏ hàng
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ThanhToan;
