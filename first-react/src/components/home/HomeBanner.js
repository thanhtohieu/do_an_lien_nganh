import React from 'react';

const HomeBanner = () => {
    return (
        <div className="right">
            <a className="product" href="#laptops">
                <img alt="Laptop văn phòng" src="./images/home_side_banner_1.webp" />
            </a>
            <a className="product" href="#monitors">
                <img alt="Màn hình 4K" src="./images/home_side_banner_2.webp" />
            </a>
            <a className="product" href="#keyboards">
                <img alt="Bàn phím cơ" src="./images/home_side_banner_3.webp" />
            </a>
        </div>
    );
};

export default HomeBanner;
