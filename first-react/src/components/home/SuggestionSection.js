import React, { useEffect, useState } from 'react';
import { itemAPI, userAPI } from '../../APIs/APIs';

const SuggestionSection = () => {
    const [items, setItems] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await itemAPI.get("/");
            // Lấy ngẫu nhiên 4 sản phẩm
            const shuffled = response.data.sort(() => 0.5 - Math.random()).slice(0, 4);
            setItems(shuffled);
        } catch (err) {
            console.error("Error fetching items:", err);
        }
    };

    const addToCart = async (e, itemId) => {
        e.preventDefault();
        e.stopPropagation();

        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            alert("Bạn chưa đăng nhập! Vui lòng đăng nhập để mua hàng.");
            return;
        }
        const currentUser = JSON.parse(storedUser);

        try {
            const response = await userAPI.get(`/${currentUser.id}`);
            const currentCart = response.data.cart || [];

            const itemIndex = currentCart.findIndex(c => c.id === itemId);
            if (itemIndex !== -1) {
                currentCart[itemIndex].number += 1;
            } else {
                currentCart.push({ id: itemId, number: 1 });
            }

            await userAPI.patch(`/${currentUser.id}`, { cart: currentCart });

            // Giảm tồn kho
            const itemData = items.find(i => i.id === itemId);
            if (itemData && itemData.remain > 0) {
                await itemAPI.patch(`/${itemId}`, { remain: itemData.remain - 1 });
            }

            // Cập nhật localStorage
            const updatedUser = { ...currentUser, cart: currentCart };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            window.dispatchEvent(new Event("cartUpdated"));

            alert("✅ Thêm vào giỏ hàng thành công!");
            fetchItems(); // Refresh lại dữ liệu
        } catch (err) {
            console.error("Error adding to cart:", err);
            alert("Đã xảy ra lỗi khi thêm vào giỏ hàng!");
        }
    };

    return (
        <div className="binhtongtiep1">
            <div className="binhtong5">
                <div className="binhspbanchay1">
                    <a href="/DanhmucSanpham">
                        <div className="txtbinhspbanchay1">Gợi ý hôm nay</div>
                    </a>
                </div>
                <div className="binhspbanchay2">
                    <a href="/DanhmucSanpham">
                        <div className="txtbinhspbanchay3">● Máy chơi game</div>
                    </a>
                </div>
                <div className="binhspbanchay3">
                    <a href="/DanhmucSanpham">
                        <div className="txtbinhspbanchay2">● Máy tính laptop</div>
                    </a>
                </div>
                <div className="binhspbanchay3">
                    <a href="/DanhmucSanpham">
                        <div className="txtbinhspbanchay3">● Tai nghe</div>
                    </a>
                </div>
                <div className="binhspbanchay4">
                    <a href="/DanhmucSanpham">
                        <div className="txtbinhspbanchay4">{`Xem thêm >`}</div>
                    </a>
                </div>
            </div>
            <div className="binhtong6">
                {items.map((item) => (
                    <div className="box1binhtong6" key={item.id}>
                        <a href={`/ChitietSanpham/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="binhcuoi1">
                                <img
                                    alt={item.name}
                                    src={item.images?.[0]}
                                    style={{ width: '100%', height: '200px', objectFit: 'contain' }}
                                />
                            </div>
                        </a>
                        <div className="txtbinhcuoi1">
                            <a href={`/ChitietSanpham/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="txt1boxbinhtong2-1">
                                    {item.name}
                                </div>
                                <div className="boxbinhdanhgia">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i}>
                                            <i className="fa-regular fa-star" />
                                        </div>
                                    ))}
                                    <div className="txtboxbinhdanhgia">0 đánh giá</div>
                                </div>
                                <div className="boxbinhgia">
                                    <div className="boxbinhgia1">
                                        <div className="txt1boxbinhgia1">
                                            {item.price.toLocaleString("vi-VN")}₫
                                        </div>
                                    </div>
                                </div>
                            </a>
                            <div
                                className="binhtuychon2"
                                onClick={(e) => addToCart(e, item.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="txtbinhtuychon2">Thêm vào giỏ</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestionSection;
