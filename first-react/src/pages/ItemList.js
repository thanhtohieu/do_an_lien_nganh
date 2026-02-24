import { useEffect, useState } from "react";
import { itemAPI } from "../APIs/APIs";
import "../css/ItemList.css";

const ITEMS_PER_PAGE = 12;

function ItemList({ rows = 0, sapxep = null, giathap = null, giacao = null, category = null, search = "", brand = null }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // Reset về trang 1 khi filter thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [sapxep, giathap, giacao, category, search, brand]);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const response = await itemAPI.get("/");
                let data = response.data;

                // nếu giới hạn sản phẩm đều ra thì lấy ngẫu nhiên sản phẩm
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

                // Lọc giá
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
            setLoading(false);
        };
        fetchItems();
    }, [rows, sapxep, giathap, giacao, category, search, brand]);

    // Tính pagination
    const totalPages = rows === 0 ? Math.ceil(items.length / ITEMS_PER_PAGE) : 1;
    const displayItems = rows === 0
        ? items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
        : items;

    const goToPage = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    // Tạo danh sách số trang hiển thị
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    // Loading spinner
    if (loading) {
        return (
            <div className="itemlist-loading">
                <div className="spinner"></div>
                <p>Đang tải sản phẩm...</p>
            </div>
        );
    }

    return (
        <div className="sanphamtuongtu">
            {items.length === 0 ? (
                <div className="itemlist-empty">
                    <i className="fas fa-box-open"></i>
                    <p>Không tìm thấy sản phẩm nào phù hợp.</p>
                    <span>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</span>
                </div>
            ) : (
                <>
                    {/* Thông tin số lượng */}
                    {rows === 0 && (
                        <div className="itemlist-info">
                            Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, items.length)} / {items.length} sản phẩm
                        </div>
                    )}

                    <ul className="laptop-list">
                        {displayItems.map((item) => (
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="page-btn"
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>

                            {getPageNumbers()[0] > 1 && (
                                <>
                                    <button className="page-btn" onClick={() => goToPage(1)}>1</button>
                                    {getPageNumbers()[0] > 2 && <span className="page-dots">...</span>}
                                </>
                            )}

                            {getPageNumbers().map(page => (
                                <button
                                    key={page}
                                    className={`page-btn ${page === currentPage ? 'page-active' : ''}`}
                                    onClick={() => goToPage(page)}
                                >
                                    {page}
                                </button>
                            ))}

                            {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                                <>
                                    {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && <span className="page-dots">...</span>}
                                    <button className="page-btn" onClick={() => goToPage(totalPages)}>{totalPages}</button>
                                </>
                            )}

                            <button
                                className="page-btn"
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ItemList;
