import React from 'react';
import { Link } from 'react-router-dom';

const CategoryGrid = () => {
    return (
        <section className="product-categories">
            <div className="container">
                <div className="category-grid">
                    <Link className="category-item" to="/DanhmucSanpham?category=laptop">
                        <img alt="Laptop" src="./images/coll_1.webp" />
                        <span>Laptop</span>
                    </Link>
                    <Link className="category-item" to="/DanhmucSanpham?category=gaming">
                        <img alt="Máy tính gaming" src="./images/coll_2.webp" />
                        <span>Gaming</span>
                    </Link>
                    <Link className="category-item" to="/DanhmucSanpham?category=phone">
                        <img alt="Điện thoại" src="./images/coll_3.webp" />
                        <span>Điện thoại</span>
                    </Link>
                    <Link className="category-item" to="/DanhmucSanpham?category=headphone">
                        <img alt="Tai nghe" src="./images/coll_4.webp" />
                        <span>Tai nghe</span>
                    </Link>
                    <Link className="category-item" to="/DanhmucSanpham?category=speaker">
                        <img alt="Loa" src="./images/coll_5.webp" />
                        <span>Loa</span>
                    </Link>
                    <Link className="category-item" to="/DanhmucSanpham?category=mouse">
                        <img alt="Chuột" src="./images/coll_6.webp" />
                        <span>Chuột</span>
                    </Link>
                    <Link className="category-item" to="/DanhmucSanpham?category=keyboard">
                        <img alt="Bàn phím" src="./images/coll_7.webp" />
                        <span>Bàn phím</span>
                    </Link>
                    <Link className="category-item" to="/DanhmucSanpham?category=accessory">
                        <img alt="Phụ kiện" src="./images/coll_8.png" />
                        <span>Phụ kiện</span>
                    </Link>
                </div>
                <div className="category-grid">
                    <Link className="category-item" to="/DanhmucSanpham?category=pc">
                        <img alt="Máy tính bàn" src="./images/coll_9.webp" />
                        <span>PC Gaming</span>
                    </Link>
                    <Link className="category-item" to="/DanhmucSanpham?category=monitor">
                        <img alt="Màn hình" src="./images/coll_10.webp" />
                        <span>Màn hình</span>
                    </Link>
                    <Link className="category-item" to="/DanhmucSanpham?category=smarthome">
                        <img alt="Thiết bị thông minh" src="./images/coll_11.png" />
                        <span>Smart Home</span>
                    </Link>
                    <Link className="category-item" to="/DanhmucSanpham?category=gear">
                        <img alt="Gaming Gear" src="./images/coll_12.webp" />
                        <span>Gaming Gear</span>
                    </Link>
                    <Link className="category-item" to="/DanhmucSanpham?category=webcam">
                        <img alt="Camera" src="./images/coll_13.webp" />
                        <span>Webcam</span>
                    </Link>
                    <Link className="category-item" to="/DanhmucSanpham?category=bag">
                        <img alt="Ba lô laptop" src="./images/coll_14.png" />
                        <span>Ba lô</span>
                    </Link>
                    <Link className="category-item" to="/DanhmucSanpham?category=chair">
                        <img alt="Ghế gaming" src="./images/coll_15.webp" />
                        <span>Ghế</span>
                    </Link>
                    <Link className="category-item" to="/DanhmucSanpham?category=cable">
                        <img alt="Dây cáp" src="./images/coll_16.webp" />
                        <span>Dây cáp</span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
