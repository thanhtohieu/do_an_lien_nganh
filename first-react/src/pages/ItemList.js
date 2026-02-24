import { useEffect, useState } from "react";
import { itemAPI } from "../APIs/APIs";
import "../css/ItemList.css";

function ItemList({ rows = 0, sapxep = null, giathap = null, giacao = null, category = null, search = "", brand = null }) {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await itemAPI.get("/");
                let data = response.data;

                // nếu giới hạn sản phẩm đều ra thì lấy nagaur nhiên sản phẩm
                if (rows != 0) {
                    data = data.sort(() => 0.5 - Math.random()).slice(0, rows * 4);
                }

                // Lọc theo category
                if (category) {
                    const searchTerm = category.toLowerCase();
                    data = data.filter((item) => {
                        const name = item.name.toLowerCase();
                        if (searchTerm === 'laptop') return name.includes('laptop');
                        if (searchTerm === 'gaming') return name.includes('gaming');
                        if (searchTerm === 'phone') return name.includes('điện thoại') || name.includes('phone') || name.includes('iphone') || name.includes('samsung');
                        if (searchTerm === 'headphone') return name.includes('tai nghe');
                        if (searchTerm === 'speaker') return name.includes('loa');
                        if (searchTerm === 'mouse') return name.includes('chuột') || name.includes('mouse');
                        if (searchTerm === 'keyboard') return name.includes('bàn phím') || name.includes('keyboard');
                        if (searchTerm === 'accessory') return name.includes('phụ kiện') || name.includes('cáp') || name.includes('sạc') || name.includes('balo') || name.includes('túi');
                        if (searchTerm === 'pc') return name.includes('pc') || name.includes('máy tính bàn');
                        if (searchTerm === 'monitor') return name.includes('màn hình') || name.includes('monitor');
                        if (searchTerm === 'smarthome') return name.includes('thông minh') || name.includes('smart');
                        if (searchTerm === 'gear') return name.includes('gear');
                        if (searchTerm === 'webcam') return name.includes('webcam') || name.includes('camera');
                        if (searchTerm === 'bag') return name.includes('balo') || name.includes('túi');
                        if (searchTerm === 'chair') return name.includes('ghế');
                        if (searchTerm === 'cable') return name.includes('cáp') || name.includes('dây');

                        return name.includes(searchTerm);
                    });
                }

                // Lọc theo từ khóa tìm kiếm
                if (search) {
                    const searchLower = search.toLowerCase();
                    data = data.filter((item) => item.name.toLowerCase().includes(searchLower));
                }

                //Lọc giá
                if (giathap !== null && giacao !== null) {
                    data = data.filter((item) => item.price >= giathap && item.price <= giacao);
                }

                // Lọc theo thương hiệu
                if (brand) {
                    const brandLower = brand.toLowerCase();
                    data = data.filter((item) => item.name.toLowerCase().includes(brandLower));
                }

                // Sắp xếp
                if (sapxep === "giatang") {
                    data.sort((a, b) => a.price - b.price);
                } else if (sapxep === "giagiam") {
                    data.sort((a, b) => b.price - a.price);
                } else if (sapxep === "tenAZ") {
                    data.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
                } else if (sapxep === "tenZA") {
                    data.sort((a, b) => b.name.localeCompare(a.name, 'vi'));
                }

                setItems(data);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };
        fetchItems();
    }, [rows, sapxep, giathap, giacao, category, search, brand]); // Cập nhật khi props thay đổi

    return (
        <div className="sanphamtuongtu">
            {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
                    <i className="fas fa-box-open" style={{ fontSize: '48px', marginBottom: '15px', display: 'block' }}></i>
                    <p style={{ fontSize: '16px' }}>Không tìm thấy sản phẩm nào phù hợp.</p>
                    <p style={{ fontSize: '14px' }}>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
                </div>
            ) : (
                <ul className="laptop-list">
                    {items.map((item) => (
                        <li key={item.id} className="sptt">
                            <a href={`/ChitietSanpham/${item.id}`}>
                                <div className="img">
                                    <img alt={item.name} src={item.images[0]} />
                                </div>
                                <div className="title">
                                    <h4>{item.name}</h4>
                                    <p>{item.price.toLocaleString("vi-VN")} đ</p>
                                    <span>Xem ngay!</span>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ItemList;
