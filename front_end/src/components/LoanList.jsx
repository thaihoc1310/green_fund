import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaLeaf, FaStar, FaArrowLeft, FaFilter } from 'react-icons/fa';
import { BiMoney, BiTime } from 'react-icons/bi';
import './LoanList.css';

const LoanList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = location.state?.userRole || 'lender';
  const [filter, setFilter] = useState('all'); // all, high-rating, low-rate, esg

  // Mock data - sẽ thay bằng API call
  const loans = [
    {
      id: 1,
      projectName: 'Dự án năng lượng mặt trời Ninh Thuận',
      amount: 200000000,
      purpose: 'Đầu tư hệ thống pin mặt trời cho nhà máy sản xuất',
      creditRating: 'A+',
      interestRate: 8.5,
      esgScore: 95,
      term: 24,
      funded: 65,
      representative: 'Nguyễn Văn An',
      company: 'Công ty TNHH Green Energy'
    },
    {
      id: 2,
      projectName: 'Dự án nông nghiệp hữu cơ Đà Lạt',
      amount: 150000000,
      purpose: 'Mở rộng vùng trồng rau hữu cơ và xây dựng nhà kính',
      creditRating: 'A',
      interestRate: 7.2,
      esgScore: 92,
      term: 18,
      funded: 80,
      representative: 'Trần Thị Bình',
      company: 'HTX Nông nghiệp sạch Đà Lạt'
    },
    {
      id: 3,
      projectName: 'Dự án tái chế nhựa thân thiện môi trường',
      amount: 300000000,
      purpose: 'Đầu tư máy móc tái chế nhựa thành sản phẩm tái sử dụng',
      creditRating: 'B+',
      interestRate: 9.5,
      esgScore: 88,
      term: 30,
      funded: 40,
      representative: 'Lê Minh Cường',
      company: 'Công ty CP Môi trường xanh'
    },
    {
      id: 4,
      projectName: 'Dự án du lịch sinh thái Phú Quốc',
      amount: 500000000,
      purpose: 'Xây dựng khu nghỉ dưỡng sinh thái thân thiện môi trường',
      creditRating: 'A',
      interestRate: 8.0,
      esgScore: 90,
      term: 36,
      funded: 25,
      representative: 'Phạm Thị Dung',
      company: 'Công ty TNHH Du lịch Xanh'
    },
    {
      id: 5,
      projectName: 'Dự án xử lý nước thải công nghiệp',
      amount: 180000000,
      purpose: 'Lắp đặt hệ thống xử lý nước thải hiện đại',
      creditRating: 'B',
      interestRate: 10.0,
      esgScore: 85,
      term: 24,
      funded: 55,
      representative: 'Hoàng Văn Em',
      company: 'Công ty CP Công nghệ môi trường'
    }
  ];

  const filteredLoans = loans.filter(loan => {
    if (filter === 'high-rating') return ['A+', 'A'].includes(loan.creditRating);
    if (filter === 'low-rate') return loan.interestRate <= 8.5;
    if (filter === 'esg') return loan.esgScore >= 90;
    return true;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getRatingColor = (rating) => {
    if (rating.includes('A')) return 'rating-a';
    if (rating.includes('B')) return 'rating-b';
    return 'rating-c';
  };

  const getESGColor = (score) => {
    if (score >= 90) return 'esg-high';
    if (score >= 80) return 'esg-medium';
    return 'esg-low';
  };

  return (
    <div className="loan-list-container">
      <div className="loan-list-header">
        <button className="btn-back" onClick={() => navigate('/dashboard', { state: { userRole } })}>
          <FaArrowLeft /> Quay lại
        </button>
        <h1>Danh sách khoản vay</h1>
      </div>

      {/* Featured Promotional Banner - Add your image here */}
      <div className="loan-promo-banner">
        <div className="loan-banner-placeholder">
          <p>💡 Thêm ảnh quảng cáo dự án nổi bật ở đây</p>
          <span className="loan-banner-hint">Kích thước đề xuất: 1200x400px</span>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-title">
          <FaFilter /> Lọc dự án
        </div>
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('all')}
          >
            Tất cả ({loans.length})
          </button>
          <button 
            className={filter === 'high-rating' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('high-rating')}
          >
            Xếp hạng cao
          </button>
          <button 
            className={filter === 'low-rate' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('low-rate')}
          >
            Lãi suất thấp
          </button>
          <button 
            className={filter === 'esg' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('esg')}
          >
            <FaLeaf /> ESG cao
          </button>
        </div>
      </div>

      <div className="loans-grid">
        {filteredLoans.map(loan => (
          <div key={loan.id} className="loan-card-modern">
            <div className="loan-card-header">
              <h3>{loan.projectName}</h3>
              <span className={`rating-badge ${getRatingColor(loan.creditRating)}`}>
                <FaStar /> {loan.creditRating}
              </span>
            </div>

            <div className="loan-card-body">
              <div className="loan-company">
                <strong>{loan.company}</strong>
                <p>Đại diện: {loan.representative}</p>
              </div>

              <div className="loan-stats">
                <div className="stat-item">
                  <BiMoney className="stat-icon" />
                  <div>
                    <span className="stat-label">Số tiền cần vay</span>
                    <span className="stat-value">{formatCurrency(loan.amount)}</span>
                  </div>
                </div>

                <div className="stat-item">
                  <BiTime className="stat-icon" />
                  <div>
                    <span className="stat-label">Thời hạn</span>
                    <span className="stat-value">{loan.term} tháng</span>
                  </div>
                </div>
              </div>

              <div className="loan-details-row">
                <div className="detail-item">
                  <span>Lãi suất:</span>
                  <strong className="interest-rate">{loan.interestRate}%/năm</strong>
                </div>
                <div className="detail-item">
                  <span>ESG Score:</span>
                  <span className={`esg-badge ${getESGColor(loan.esgScore)}`}>
                    <FaLeaf /> {loan.esgScore}/100
                  </span>
                </div>
              </div>

              <div className="loan-purpose">
                <span className="purpose-label">Mục đích vay:</span>
                <p>{loan.purpose}</p>
              </div>

              <div className="progress-section">
                <div className="progress-header">
                  <span>Đã huy động: {loan.funded}%</span>
                  <span>{formatCurrency(loan.amount * loan.funded / 100)}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${loan.funded}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="loan-card-footer">
              <button 
                className="btn-view-detail"
                onClick={() => navigate(`/loan-detail/${loan.id}`)}
              >
                Xem chi tiết
              </button>
              <button 
                className="btn-invest"
                onClick={() => navigate(`/loan-detail/${loan.id}`)}
              >
                Đầu tư ngay
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredLoans.length === 0 && (
        <div className="no-results">
          <p>Không tìm thấy khoản vay phù hợp với bộ lọc</p>
        </div>
      )}
    </div>
  );
};

export default LoanList;
