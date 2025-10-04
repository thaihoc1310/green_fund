import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaNewspaper, FaGift, FaBullhorn } from 'react-icons/fa';
import './NewsPromotion.css';

const NewsPromotion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = location.state?.userRole || 'borrower';

  const news = [
    {
      id: 1,
      type: 'news',
      title: 'Green Fund ra mắt chương trình tín dụng xanh 2025',
      description: 'Nền tảng công bố gói tín dụng 500 tỷ đồng dành cho các dự án năng lượng tái tạo và nông nghiệp bền vững',
      date: '2025-10-01',
      image: 'https://via.placeholder.com/400x250?text=Green+Fund+2025'
    },
    {
      id: 2,
      type: 'promotion',
      title: 'Ưu đãi lãi suất 0% trong 3 tháng đầu',
      description: 'Dành cho khách hàng mới đầu tư từ 50 triệu đồng trở lên vào các dự án ESG cao',
      date: '2025-09-28',
      validUntil: '2025-12-31',
      discount: '0%'
    },
    {
      id: 3,
      type: 'news',
      title: 'Thành công huy động 100 tỷ đồng cho dự án năng lượng mặt trời',
      description: 'Dự án lắp đặt hệ thống pin mặt trời tại Ninh Thuận đã hoàn tất vòng gọi vốn với sự tham gia của hơn 500 nhà đầu tư',
      date: '2025-09-25',
      image: 'https://via.placeholder.com/400x250?text=Solar+Project'
    },
    {
      id: 4,
      type: 'promotion',
      title: 'Giảm 20% phí giao dịch',
      description: 'Áp dụng cho tất cả giao dịch đầu tư trong tháng 10/2025',
      date: '2025-09-20',
      validUntil: '2025-10-31',
      discount: '20%'
    },
    {
      id: 5,
      type: 'news',
      title: 'Green Fund nhận giải thưởng "Startup công nghệ tài chính xuất sắc 2025"',
      description: 'Nền tảng được vinh danh tại lễ trao giải Vietnam Fintech Awards 2025 cho những đóng góp vào tài chính bền vững',
      date: '2025-09-15',
      image: 'https://via.placeholder.com/400x250?text=Award+2025'
    },
    {
      id: 6,
      type: 'promotion',
      title: 'Tặng 500.000 VND khi giới thiệu bạn bè',
      description: 'Nhận ngay 500.000 VND cho mỗi người bạn đăng ký và đầu tư thành công',
      date: '2025-09-10',
      validUntil: '2025-12-31',
      discount: '500K'
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="news-container">
      <div className="news-header">
        <button className="btn-back" onClick={() => navigate('/dashboard', { state: { userRole } })}>
          <FaArrowLeft /> Quay lại
        </button>
        <h1>Tin tức & Ưu đãi</h1>
      </div>

      <div className="news-grid">
        {news.map(item => (
          <div key={item.id} className={`news-card ${item.type}`}>
            {item.type === 'news' && item.image && (
              <div className="news-image">
                <img src={item.image} alt={item.title} />
                <span className="news-badge">
                  <FaNewspaper /> Tin tức
                </span>
              </div>
            )}

            {item.type === 'promotion' && (
              <div className="promotion-header">
                <FaGift className="promo-icon" />
                <span className="promotion-badge">Ưu đãi</span>
                {item.discount && (
                  <span className="discount-badge">{item.discount}</span>
                )}
              </div>
            )}

            <div className="news-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>

              <div className="news-meta">
                <span className="news-date">{formatDate(item.date)}</span>
                {item.validUntil && (
                  <span className="valid-until">
                    Có hiệu lực đến: {formatDate(item.validUntil)}
                  </span>
                )}
              </div>

              {item.type === 'promotion' && (
                <button className="btn-apply">
                  Áp dụng ngay
                </button>
              )}

              {item.type === 'news' && (
                <button className="btn-read-more">
                  Đọc thêm
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="subscribe-section">
        <div className="subscribe-card">
          <FaBullhorn className="subscribe-icon" />
          <h2>Đăng ký nhận thông báo</h2>
          <p>Nhận tin tức và ưu đãi mới nhất từ Green Fund</p>
          <div className="subscribe-form">
            <input 
              type="email" 
              placeholder="Nhập email của bạn" 
            />
            <button className="btn-subscribe">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPromotion;
