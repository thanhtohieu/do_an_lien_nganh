import React from 'react';

const NewsSection = () => {
    return (
        <div className="Quan">
            <div className="thanhtieude2">
                <div className="tentieude2">Bản tin công nghệ</div>
                <div className="thanhdoc" />
                <div className="menu2-1">
                    <a href="">
                        <div className="menucon2-1">Công nghệ</div>
                    </a>
                </div>
            </div>
            <div className="bantincongnghe">
                <div className="news-item">
                    <div className="news-image-container">
                        <img className="news-image" alt="" src="./images/tin1.jpg" />
                    </div>
                    <div className="news-content">
                        <a href="" style={{ textDecoration: 'none' }}>
                            <div className="news-title">
                                Cách xử lý đồng hồ bị vào nước, hấp hơi nước cực đơn giản tại nhà
                            </div>
                            <div className="news-summary">
                                Trong quá trình sử dụng chắc hẳn các bạn đã gặp phải trường hợp
                                đồng hồ bị vào nước gây ảnh hưởng đến độ chính xác cũng như ...
                            </div>
                        </a>
                    </div>
                    <div className="news-footer">
                        <div className="news-date">08/06/2024</div>
                        <a href="" className="news-button">Xem chi tiết</a>
                    </div>
                </div>

                <div className="news-item">
                    <div className="news-image-container">
                        <img className="news-image" alt="" src="./images/tin2.jpg" />
                    </div>
                    <div className="news-content">
                        <a href="" style={{ textDecoration: 'none' }}>
                            <div className="news-title">
                                Realme toàn cầu đạt top 7 và 35 triệu người dùng
                            </div>
                            <div className="news-summary">
                                Hãng smartphone tiếp nhận nhiều tin vui trong giai đoạn khó khăn
                                chung toàn cầu 5 tháng đầu năm 2020. Toàn cảnh thị trường
                                smartphone toàn...
                            </div>
                        </a>
                    </div>
                    <div className="news-footer">
                        <div className="news-date">08/06/2024</div>
                        <a href="" className="news-button">Xem chi tiết</a>
                    </div>
                </div>

                <div className="news-item">
                    <div className="news-image-container">
                        <img className="news-image" alt="" src="./images/tin3.webp" />
                    </div>
                    <div className="news-content">
                        <a href="" style={{ textDecoration: 'none' }}>
                            <div className="news-title">
                                Tổng hợp đánh giá CPU Intel Core Ultra: Nhanh mạnh, bền bỉ, cân kèo Apple lẫn AMD
                            </div>
                            <div className="news-summary">
                                Mặc dù đây mới chỉ là những phiên bản sản xuất sớm, cần được
                                trên tay tận nơi để kiểm chứng, nhưng kết quả kể...
                            </div>
                        </a>
                    </div>
                    <div className="news-footer">
                        <div className="news-date">08/06/2024</div>
                        <a href="" className="news-button">Xem chi tiết</a>
                    </div>
                </div>

                <div className="news-item">
                    <div className="news-image-container">
                        <img className="news-image" alt="" src="./images/tin4.jpg" />
                    </div>
                    <div className="news-content">
                        <a href="" style={{ textDecoration: 'none' }}>
                            <div className="news-title">
                                Cách gập màn hình laptop mà không tắt máy Win 11, Win 10
                            </div>
                            <div className="news-summary">
                                Khi bạn muốn gập màn hình laptop nhưng máy vẫn phát nhạc hay vẫn
                                muốn download phần mềm trong lúc di chuyển thì mẹo gập..
                            </div>
                        </a>
                    </div>
                    <div className="news-footer">
                        <div className="news-date">08/06/2024</div>
                        <a href="" className="news-button">Xem chi tiết</a>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default NewsSection;
