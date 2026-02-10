import React from 'react';

const SpecialOffers = () => {
    return (
        <section className="special-offers">
            <div className="container">
                <div className="offer">
                    <i className="fas fa-motorcycle" />
                    <span className="uppercase">GIAO HỎA TỐC</span>
                    <span className="lowercase">Nội thành TP. HCM trong 4h</span>

                </div>
                <div className="offer">
                    <i className="fas fa-hand-holding-usd" />
                    <span className="uppercase">TRẢ GÓP ƯU ĐÃI%</span>
                    <span className="lowercase">Hỗ trợ vay với lãi suất thấp</span>
                </div>
                <div className="offer">
                    <i className="fas fa-bolt" />
                    <span className="uppercase">DEAL HOT BÙNG NỔ</span>
                    <span className="lowercase">Flash sale giảm giá cực sốc</span>
                </div>
                <div className="offer">
                    <i className="fas fa-exchange-alt" />
                    <span className="uppercase">MIỄN PHÍ ĐỔI TRẢ</span>
                    <span className="lowercase">Trong vòng 30 ngày miễn phí</span>
                </div>
                <div className="offer">
                    <i className="fas fa-headset" />
                    <span className="uppercase">HỖ TRỢ 24/7</span>
                    <span className="lowercase">Hỗ trợ khách hàng 24/7</span>
                </div>
            </div>
        </section>
    );
};

export default SpecialOffers;
