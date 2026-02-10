import React from 'react';

const HomeSlider = () => {
    return (
        <div className="left">
            <button className="prev-slide">
                <i className="fas fa-chevron-left" />
            </button>
            <div className="main-image-slider">
                <a href="#promo1">
                    <img alt="Siêu sale laptop gaming" src="./images/home_slider_1.webp" />
                </a>
                <a href="#promo2">
                    <img alt="Đại hạ giá màn hình 4K" src="./images/home_slider_2.webp" />
                </a>
            </div>
            <button className="next-slide">
                <i className="fas fa-chevron-right" />
            </button>
        </div>
    );
};

export default HomeSlider;
