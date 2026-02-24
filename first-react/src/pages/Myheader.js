import './../css/header.css';
import './../css/responsive.css';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { itemAPI, userAPI } from "../APIs/APIs";

function Myheader() {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Load user from localStorage and sync cart from server
  const refreshUser = async () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      try {
        // Fetch latest user data from server to ensure cart is in sync
        const response = await userAPI.get(`/${parsedUser.id}`);
        const serverUser = response.data;
        const updatedUser = {
          ...parsedUser,
          cart: serverUser.cart || []
        };
        setUser(updatedUser);
        // Update localStorage with latest cart from server
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (err) {
        // If server is unavailable, use localStorage data
        setUser(parsedUser);
      }
    }
  };

  useEffect(() => {
    refreshUser();
    // Listen for cartUpdated events from add-to-cart actions
    const handleCartUpdate = () => refreshUser();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  useEffect(() => {
    if (user && user.cart && user.cart.length > 0) {
      setCartCount(user.cart.reduce((sum, item) => sum + item.number, 0));
      loadCartPreview(user.cart);
    } else {
      setCartCount(0);
      setCartItems([]);
    }
  }, [user]);

  const loadCartPreview = async (cart) => {
    try {
      const response = await itemAPI.get("/");
      const allItems = response.data;
      const merged = cart
        .map(cartItem => {
          const product = allItems.find(p => p.id === cartItem.id);
          if (product) return { ...product, quantity: cartItem.number };
          return null;
        })
        .filter(Boolean)
        .slice(0, 5); // Show max 5 items in preview
      setCartItems(merged);
    } catch (err) {
      console.error("Error loading cart preview:", err);
    }
  };

  function cart() {
    const cartEl = document.querySelector('.hidden');
    if (!isVisible) {
      cartEl.style.display = "none";
      setIsVisible(!isVisible);
    }
    if (isVisible) {
      cartEl.style.display = 'block';
      setIsVisible(!isVisible);
    }
  }

  function noncart(event) {
    event.stopPropagation();
  }

  function dangxuat() {
    alert("Đăng xuất")
    if (user == 'null') {
      navigate("/")
    }
    else {
      localStorage.removeItem("user");
      navigate("/Dangnhap");
    }
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <div className='headerFake'></div>
      <header id='header-all'>
        <div className="header-banner">
          <img alt="Khuyến mãi đặc biệt" src="../images/top_banner.webp" />
        </div>
        <div className='header'>
          <div className='logo'>
            <a href='/'> <img id='logo' alt='Logo' src='../images/pnk1.png'></img></a>
          </div>
          <div className='main-header'>
            <div className="top-header">
              <div className="left-top-header">
                <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) navigate(`/DanhmucSanpham?search=${encodeURIComponent(searchQuery.trim())}`); }}>
                  <input type="text" placeholder="Tìm kiếm sản phẩm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}></input>
                  <button type="submit"><i className="fas fa-search"></i> Tìm</button>
                </form>
              </div>
              <div className="right-top-header">
                <a
                  href="#"
                  onClick={user ? dangxuat : () => navigate("/Dangnhap")}
                  className="login-btn"
                >
                  <i className="fas fa-user"></i> {user ? "Đăng xuất" : "Đăng nhập"}
                </a>
                <a href="#" onClick={cart} className="cart-btn open-cart-btn">
                  <i className="fas fa-shopping-cart" style={{ color: "#74C0FC" }}></i> Giỏ hàng
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </a>
              </div>
            </div>
            <div className="bottom-header">
              <div className="left-bottom-header">
                <a href="/KhuyenMai" className="nav-link">Khuyến mãi</a>
                <a href="/TinTuc" className="nav-link">Tin tức</a>
                <a href="/LienHe" className="nav-link">Liên hệ</a>
                <a href="/KiemTraDonHang" className="nav-link">Kiểm tra đơn hàng</a>
              </div>
              <div className="right-bottom-header">
                <a href='/DanhmucSanpham' className="nav-link">
                  <i className="fas fa-bars"></i>
                  <span>  Danh mục sản phẩm</span>
                </a>
                <a href="#hotline" className="nav-link">
                  <i className="fas fa-phone-alt"></i>
                  <span> Hotline: 0123404953</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="cart-overlay hidden" onClick={cart}>
          <div className="cart" onClick={noncart}>
            <h2>Giỏ hàng</h2>
            {user ? (
              <p>Xin chào, {user.name}!</p>
            ) : (
              <p>Bạn chưa đăng nhập</p>
            )}

            {cartItems.length > 0 ? (
              <div className="cart-sidebar-items">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-sidebar-item">
                    <img src={item.images?.[0]} alt={item.name} className="cart-sidebar-img" />
                    <div className="cart-sidebar-info">
                      <p className="cart-sidebar-name">{item.name}</p>
                      <p className="cart-sidebar-price">
                        {item.price.toLocaleString("vi-VN")}₫ × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="cart-sidebar-total">
                  <span>Tổng cộng:</span>
                  <span className="cart-sidebar-total-price">{cartTotal.toLocaleString("vi-VN")}₫</span>
                </div>
                <a href="/Giohang" className="cart-sidebar-btn cart-sidebar-btn-primary">Xem giỏ hàng</a>
                <a href="/ThanhToan" className="cart-sidebar-btn cart-sidebar-btn-checkout">Thanh toán ngay</a>
              </div>
            ) : (
              <div>
                <img src="../images/cart_no_item.jpg" alt="Empty Cart"></img>
                <br></br>
                <p className="cart-empty-text">Giỏ hàng chưa có gì!</p>
                <p>Hãy tìm sản phẩm ưng ý và <br></br> thêm vào giỏ hàng bạn nhé</p>
              </div>
            )}
            <br></br>
            <a id="button" href="/DanhmucSanpham">Tiếp tục mua sắm</a>
          </div>
        </div>
      </header>
    </div>
  );
};
export default Myheader;