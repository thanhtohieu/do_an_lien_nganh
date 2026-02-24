import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Myheader from "./Myheader"
import '../css/DanhmucSanpham.css'
import Footer from "./Footer"
import ItemList from "./ItemList"
const DanhmucSanpham = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";

  const [sapxep, setSapxep] = useState(null);
  const [giathap, setGiathap] = useState(null);
  const [giacao, setGiacao] = useState(null);
  const [pk, setpk] = useState(null);
  const [brand, setBrand] = useState(null);

  const chonKhoangGia = (thap, cao, pk) => {
    setGiathap(thap);
    setGiacao(cao);
    setpk(pk);
  };

  const brands = [
    { label: "Tất cả", value: null },
    { label: "Asus", value: "asus" },
    { label: "HP", value: "hp" },
    { label: "Lenovo", value: "lenovo" },
    { label: "MSI", value: "msi" },
    { label: "Apple", value: "macbook" },
    { label: "Dell", value: "dell" },
    { label: "Acer", value: "acer" },
  ];

  return (
    <div>
      <Myheader />
      <div className="khungmainsp">
        <div className="mainsp">
          {searchQuery && (
            <div style={{ padding: '10px 20px', fontSize: '16px', color: '#333' }}>
              <i className="fas fa-search" style={{ marginRight: '8px', color: '#1a73e8' }}></i>
              Kết quả tìm kiếm cho: <strong>"{searchQuery}"</strong>
            </div>
          )}

          {/* Lọc theo thương hiệu */}
          <div className="locphankhuc">
            <div className="textlpk"><i className="fas fa-tag"></i> Thương hiệu:</div>
            {brands.map((b) => (
              <button
                key={b.label}
                onClick={() => setBrand(b.value)}
                className={brand === b.value ? "phankhuc select" : "phankhuc"}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Lọc theo khoảng giá */}
          <div className="locphankhuc">
            <div className="textlpk"><i className="fas fa-money-bill-wave"></i> Khoảng giá:</div>
            <button onClick={() => chonKhoangGia(null, null, "pk0")} className={pk === "pk0" || pk === null ? "phankhuc" : "phankhuc"}>Tất cả</button>
            <button onClick={() => chonKhoangGia(5000000, 10000000, "pk1")} className={pk === "pk1" ? "phankhuc select" : "phankhuc"}>5 - 10 triệu</button>
            <button onClick={() => chonKhoangGia(10000000, 20000000, "pk2")} className={pk === "pk2" ? "phankhuc select" : "phankhuc"}>10 - 20 triệu</button>
            <button onClick={() => chonKhoangGia(20000000, 30000000, "pk3")} className={pk === "pk3" ? "phankhuc select" : "phankhuc"}>20 - 30 triệu</button>
            <button onClick={() => chonKhoangGia(30000000, 50000000, "pk4")} className={pk === "pk4" ? "phankhuc select" : "phankhuc"}>30 - 50 triệu</button>
            <button onClick={() => chonKhoangGia(50000000, Infinity, "pk5")} className={pk === "pk5" ? "phankhuc select" : "phankhuc"}>Trên 50 triệu</button>
          </div>

          {/* Sắp xếp */}
          <div className="locphankhuc">
            <div className="textlpk"><i className="fas fa-sort"></i> Sắp xếp:</div>
            <button onClick={() => setSapxep("giatang")} className={sapxep === "giatang" ? "phankhuc select" : "phankhuc"}>
              <i className="fas fa-sort-amount-up"></i> Giá tăng dần
            </button>
            <button onClick={() => setSapxep("giagiam")} className={sapxep === "giagiam" ? "phankhuc select" : "phankhuc"}>
              <i className="fas fa-sort-amount-down"></i> Giá giảm dần
            </button>
            <button onClick={() => setSapxep("tenAZ")} className={sapxep === "tenAZ" ? "phankhuc select" : "phankhuc"}>
              <i className="fas fa-sort-alpha-down"></i> Tên A - Z
            </button>
            <button onClick={() => setSapxep("tenZA")} className={sapxep === "tenZA" ? "phankhuc select" : "phankhuc"}>
              <i className="fas fa-sort-alpha-down-alt"></i> Tên Z - A
            </button>
          </div>

          {/* Hiển thị bộ lọc đang áp dụng */}
          {(brand || pk || sapxep) && (
            <div className="active-filters">
              <span className="active-filters-label">Đang lọc:</span>
              {brand && (
                <span className="filter-tag">
                  {brands.find(b => b.value === brand)?.label}
                  <button onClick={() => setBrand(null)}>×</button>
                </span>
              )}
              {pk && pk !== "pk0" && (
                <span className="filter-tag">
                  {giathap && giacao !== Infinity
                    ? `${(giathap / 1000000).toFixed(0)} - ${(giacao / 1000000).toFixed(0)} triệu`
                    : `Trên ${(giathap / 1000000).toFixed(0)} triệu`}
                  <button onClick={() => chonKhoangGia(null, null, null)}>×</button>
                </span>
              )}
              {sapxep && (
                <span className="filter-tag">
                  {sapxep === "giatang" ? "Giá tăng" : sapxep === "giagiam" ? "Giá giảm" : sapxep === "tenAZ" ? "A → Z" : "Z → A"}
                  <button onClick={() => setSapxep(null)}>×</button>
                </span>
              )}
              <button className="clear-all-btn" onClick={() => { setBrand(null); setGiathap(null); setGiacao(null); setpk(null); setSapxep(null); }}>
                <i className="fas fa-times"></i> Xóa tất cả
              </button>
            </div>
          )}

          <div>
            <ItemList rows={0} sapxep={sapxep} giathap={giathap} giacao={giacao} category={categoryParam} search={searchQuery} brand={brand} />
          </div>

          <div className="chuyentrang">
            <div className="boxso">
              <a href="">
                <div className="so">1</div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default DanhmucSanpham;