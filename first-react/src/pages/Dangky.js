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
      // Kiểm tra email đã tồn tại chưa bằng query parameter
      const response = await userAPI.get(`/?email=${email}`);
      const existingUsers = response.data;

      if (existingUsers.length > 0) {
        alert("Email đã tồn tại, không thể tạo tài khoản!");
        return;
      }

      await userAPI.post("/", { name, numberphone, email, password });
      localStorage.setItem("user", JSON.stringify({
        email: email,
        name: name
      }));
      alert("Đăng ký thành công!");
      // onLogin không cần thiết phải truyền users, có thể load lại hoặc chỉ pass user mới
      // Để tương thích logic cũ (có vẻ onLogin mong đợi list users?), ta cứ bỏ qua arg users
      // Hoặc nếu onLogin set state users ở App.js, ta cần xem lại. 
      // App.js: onLogin={setCurrentUser} -> setCurrentUser mong đợi user object, không phải list users.
      // Dangky.js cũ: onLogin(users) -> SAI?
      // App.js line 32: <Dangky onLogin={setCurrentUser} />
      // setCurrentUser expects user object.
      // Dangky.js cũ line 60: onLogin(users).
      // users state trong Dangky.js là list of users.
      // Vậy Dangky.js cũ đang gọi onLogin với [list users], nhưng App.js dùng nó như currentUser object?
      // Nếu đúng vậy, code cũ bị BUG logic ở đây. Nếu đăng ký xong, currentUser sẽ là array -> crash hoặc sai logic ở Home?
      // Home.js: currentUser ? <Home user={currentUser} ... />
      // Nếu currentUser là array, Home user prop là array.
      // Home.js cũ không dùng prop user.
      // Nhưng App.js: currentUser ? (Home user={currentUser}...)
      // Có vẻ logic cũ bị sai. Tôi sẽ fix để onLogin nhận user object mới tạo.
      const newUser = { name, email, id: "new_id_placeholder" }; // ID server gen
      onLogin(newUser);
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