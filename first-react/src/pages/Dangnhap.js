import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { userAPI } from "../APIs/APIs";
import '../css/dangnhap.css'
import Myheader from "./Myheader";
import Footer from "./Footer";
function Dangnhap({ onLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // json-server v1 không hỗ trợ query filter → lấy tất cả rồi tìm client-side
      const response = await userAPI.get('/');
      const users = response.data;
      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        // Lưu cả email, name và role vào localStorage
        localStorage.setItem("user", JSON.stringify({
          email: foundUser.email,
          name: foundUser.name,
          id: foundUser.id,
          role: foundUser.role || "user",
          cart: foundUser.cart || []
        }));
        onLogin(foundUser);

        // Admin → redirect đến trang quản trị
        if (foundUser.role === "admin") {
          alert("Chào mừng Admin " + foundUser.name);
          navigate("/admin");
        } else {
          alert("Chào mừng trở lại " + foundUser.name);
          navigate("/");
        }
      } else {
        setError("Sai thông tin đăng nhập");
      }
    } catch (err) {
      setError("Lỗi kết nối đến server");
      console.error("Login error:", err);
    }
  };
  return (
    <div>
      <Myheader />
      <div className="s1">
        <p>
          <a href="/">Trang chủ</a> / Đăng Nhập
        </p>
      </div>
      <div className="dangnhap1">
        <form className="dangnhap" onSubmit={handleLogin}>
          <h1>Đăng nhập tài khoản</h1>
          <p>
            Bạn chưa có tài khoản ? <a href='/Dangky'>Đăng ký tại đây</a>
          </p>
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required />

          <input
            placeholder="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required />

          <button className="button" type="submit">Đăng nhập</button>{error && <p style={{ color: "red" }}>{error}</p>}
          <p>
            Quên mật khẩu?
            <a href="#"> Nhấn vào đây</a>
          </p>
          <div className="social">
            <a href="">
              <i
                className="fab fa-facebook"
                style={{
                  color: "#3b5998",
                  fontSize: "48px",
                }}
              />
            </a>
            <a href="">
              <i
                className="fab fa-google"
                style={{
                  color: "#de5246",
                  fontSize: "48px",
                }}
              />
            </a>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
export default Dangnhap;