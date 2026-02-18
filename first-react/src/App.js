
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Home from "./pages/Home";
import DanhmucSanpham from "./pages/DanhmucSanpham";
import Dangnhap from "./pages/Dangnhap";
import Dangky from "./pages/Dangky";
import ChitietSanpham from "./pages/ChitietSanpham";
import ItemList from "./pages/ItemList";
import Giohang from "./pages/Giohang";
import UserTable from "./test/UserTable";
import ItemTable from "./test/ItemTable";
import KhuyenMai from "./pages/KhuyenMai";
import TinTuc from "./pages/TinTuc";
import LienHe from "./pages/LienHe";
import KiemTraDonHang from "./pages/KiemTraDonHang";
import ThanhToan from "./pages/ThanhToan";
const App = () => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            currentUser ? (
              <Home user={currentUser} onLogout={() => setCurrentUser(null)} />
            ) : (
              <Dangnhap onLogin={setCurrentUser} />
            )
          }
        />
        <Route path="/DanhmucSanpham" element={<DanhmucSanpham />} />
        <Route path="/dangnhap" element={<Dangnhap onLogin={setCurrentUser} />} />
        <Route path="/Dangky" element={<Dangky onLogin={setCurrentUser} />} />
        <Route path="/ChitietSanpham/:id" element={<ChitietSanpham />} />
        <Route path="/Usertable" element={<UserTable />} />
        <Route path="/Itemtable" element={<ItemTable />} />
        <Route path="/Giohang" element={<Giohang />} />
        <Route path="/KhuyenMai" element={<KhuyenMai />} />
        <Route path="/TinTuc" element={<TinTuc />} />
        <Route path="/LienHe" element={<LienHe />} />
        <Route path="/KiemTraDonHang" element={<KiemTraDonHang />} />
        <Route path="/ThanhToan" element={<ThanhToan />} />
      </Routes>
    </Router>
  );
}

export default App;


