import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI, itemAPI } from "../APIs/APIs";
import '../css/dangnhap.css'
import Myheader from "./Myheader";
import Footer from "./Footer";

function Dangky({ onLogin }) {

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [name, setName] = useState(null);
  const [numberphone, setNumberphone] = useState(null);
  const navigate = useNavigate();

  const handleAddUser = async (e) => {
    e.preventDefault(); // Ngăn reload trang

    if (!email) {
      alert("thiếu email");
      return;
    }
    if (!password) {
      alert("thiếu pass");
      return;
    }
    if (!name) {
      alert("thiếu tên");
      return;
    }
    if (!numberphone) {
      alert("thiếu SDT");
      return;
    }

    try {
      // Kiểm tra email đã tồn tại chưa (lấy tất cả user rồi tìm client-side)
      const response = await userAPI.get('/');
      const existingUsers = response.data;
      const emailExists = existingUsers.find(u => u.email === email);

      if (emailExists) {
        alert("Email đã tồn tại, không thể tạo tài khoản!");
        return;
      }

      const createResponse = await userAPI.post("/", { name, numberphone, email, password });
      const createdUser = createResponse.data; // Server trả về user với ID thật
      localStorage.setItem("user", JSON.stringify({
        email: createdUser.email,
        name: createdUser.name,
        id: createdUser.id,
        cart: createdUser.cart || []
      }));
      alert("Đăng ký thành công!");
      onLogin(createdUser);
      navigate("/");

    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  return (
    <div>
      <Myheader />
      <div className="s1">
        <p>
          <a href="/">Trang chủ</a> / Đăng Ký
        </p>
      </div>
      <div className="dangnhap1">
        <form className="dangnhap" onSubmit={handleAddUser}>
          <h1>Đăng Ký Tài Khoản</h1>
          <p>
            Bạn đã có tài khoản ? <a href="/Dangnhap">Đăng nhập tại đây</a>
          </p>
          <input
            type="text"
            placeholder="Tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Số điện thoại"
            value={numberphone}
            onChange={(e) => setNumberphone(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="button">Đăng Ký</button>
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
export default Dangky;