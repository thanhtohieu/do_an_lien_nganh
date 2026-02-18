import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI, itemAPI } from "../APIs/APIs";
import Myheader from "./Myheader";
import '../css/Giohang.css';
import Footer from "./Footer";

const Giohang = () => {
    const [user, setUser] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();

    // Load user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setLoading(false);
        }
    }, []);

    // Load cart items with full product info
    useEffect(() => {
        if (user && user.cart && user.cart.length > 0) {
            loadCartItems(user.cart);
        } else {
            setCartItems([]);
            setLoading(false);
        }
    }, [user]);

    const loadCartItems = async (cart) => {
        try {
            setLoading(true);
            const response = await itemAPI.get("/");
            const allItems = response.data;

            const merged = cart
                .map(cartItem => {
                    const product = allItems.find(p => p.id === cartItem.id);
                    if (product) {
                        return {
                            ...product,
                            quantity: cartItem.number
                        };
                    }
                    return null;
                })
                .filter(Boolean);

            setCartItems(merged);
        } catch (err) {
            console.error("Error loading cart items:", err);
        } finally {
            setLoading(false);
        }
    };

    // Update cart on server and localStorage
    const updateCart = async (newCartItems) => {
        if (!user) return;
        setUpdating(true);
        try {
            const cartData = newCartItems.map(item => ({
                id: item.id,
                number: item.quantity
            }));

            await userAPI.patch(`/${user.id}`, { cart: cartData });

            const updatedUser = { ...user, cart: cartData };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setCartItems(newCartItems);
        } catch (err) {
            console.error("Error updating cart:", err);
            alert("Lỗi khi cập nhật giỏ hàng!");
        } finally {
            setUpdating(false);
        }
    };

    const increaseQuantity = (itemId) => {
        const item = cartItems.find(i => i.id === itemId);
        if (item && item.quantity >= item.remain) {
            alert("Số lượng đã đạt giới hạn tồn kho!");
            return;
        }
        const updated = cartItems.map(item =>
            item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
        updateCart(updated);
    };

    const decreaseQuantity = (itemId) => {
        const updated = cartItems.map(item =>
            item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
        );
        updateCart(updated);
    };

    const removeItem = (itemId) => {
        if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
            const updated = cartItems.filter(item => item.id !== itemId);
            updateCart(updated);
        }
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert("Giỏ hàng trống!");
            return;
        }
        navigate("/ThanhToan");
    };

    return (
        <div className="giohang-page">
            <Myheader />
            <div className="giohang-container">
                <h1 className="giohang-title">
                    <i className="fas fa-shopping-cart"></i> Giỏ hàng của bạn
                </h1>

                {loading ? (
                    <div className="giohang-loading">
                        <p>Đang tải giỏ hàng...</p>
                    </div>
                ) : !user ? (
                    <div className="giohang-empty">
                        <img src="../images/cart_no_item.jpg" alt="Chưa đăng nhập" />
                        <h2>Bạn chưa đăng nhập</h2>
                        <p>Hãy đăng nhập để xem giỏ hàng của bạn</p>
                        <a href="/Dangnhap" className="giohang-btn-primary">Đăng nhập ngay</a>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="giohang-empty">
                        <img src="../images/cart_no_item.jpg" alt="Giỏ hàng trống" />
                        <h2>Giỏ hàng trống</h2>
                        <p>Hãy tìm sản phẩm ưng ý và thêm vào giỏ hàng nhé!</p>
                        <a href="/DanhmucSanpham" className="giohang-btn-primary">Mua sắm ngay</a>
                    </div>
                ) : (
                    <div className="giohang-content">
                        <div className="giohang-items">
                            <div className="giohang-header-row">
                                <span className="gh-col-product">Sản phẩm</span>
                                <span className="gh-col-price">Đơn giá</span>
                                <span className="gh-col-qty">Số lượng</span>
                                <span className="gh-col-total">Thành tiền</span>
                                <span className="gh-col-action">Thao tác</span>
                            </div>

                            {cartItems.map((item) => (
                                <div key={item.id} className="giohang-item">
                                    <div className="gh-col-product gh-product-info">
                                        <a href={`/ChitietSanpham/${item.id}`}>
                                            <img
                                                src={item.images?.[0]}
                                                alt={item.name}
                                                className="gh-product-img"
                                            />
                                        </a>
                                        <div className="gh-product-detail">
                                            <a href={`/ChitietSanpham/${item.id}`} className="gh-product-name">
                                                {item.name}
                                            </a>
                                            <p className="gh-product-remain">Còn {item.remain} sản phẩm</p>
                                        </div>
                                    </div>
                                    <div className="gh-col-price">
                                        <span className="gh-price">{item.price.toLocaleString("vi-VN")}₫</span>
                                    </div>
                                    <div className="gh-col-qty">
                                        <div className="gh-qty-controls">
                                            <button
                                                onClick={() => decreaseQuantity(item.id)}
                                                disabled={updating || item.quantity <= 1}
                                                className="gh-qty-btn"
                                            >−</button>
                                            <span className="gh-qty-value">{item.quantity}</span>
                                            <button
                                                onClick={() => increaseQuantity(item.id)}
                                                disabled={updating}
                                                className="gh-qty-btn"
                                            >+</button>
                                        </div>
                                    </div>
                                    <div className="gh-col-total">
                                        <span className="gh-subtotal">
                                            {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                                        </span>
                                    </div>
                                    <div className="gh-col-action">
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            disabled={updating}
                                            className="gh-remove-btn"
                                            title="Xóa sản phẩm"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="giohang-summary">
                            <div className="giohang-summary-card">
                                <h3>Tóm tắt đơn hàng</h3>
                                <div className="summary-row">
                                    <span>Số lượng sản phẩm:</span>
                                    <span>{totalItems}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Tạm tính:</span>
                                    <span>{totalPrice.toLocaleString("vi-VN")}₫</span>
                                </div>
                                <div className="summary-row">
                                    <span>Phí vận chuyển:</span>
                                    <span className="free-ship">Miễn phí</span>
                                </div>
                                <div className="summary-divider"></div>
                                <div className="summary-row summary-total">
                                    <span>Tổng cộng:</span>
                                    <span className="total-price">{totalPrice.toLocaleString("vi-VN")}₫</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="giohang-checkout-btn"
                                    disabled={updating}
                                >
                                    <i className="fas fa-credit-card"></i> Tiến hành thanh toán
                                </button>
                                <a href="/DanhmucSanpham" className="giohang-continue-btn">
                                    <i className="fas fa-arrow-left"></i> Tiếp tục mua sắm
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

export default Giohang;
