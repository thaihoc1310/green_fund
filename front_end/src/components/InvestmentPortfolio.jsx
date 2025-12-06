import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaChartLine, FaLeaf, FaStar, FaCheckCircle } from 'react-icons/fa';
import { BiMoney, BiTrendingUp } from 'react-icons/bi';
import './InvestmentPortfolio.css';

const InvestmentPortfolio = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = location.state?.userRole || 'lender';
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleViewDetail = (investment) => {
    setSelectedInvestment(investment);
    setShowDetailModal(true);
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedInvestment(null);
  };

  // Mock data
  const investments = [
    {
      id: 1,
      projectName: 'Dự án năng lượng mặt trời Ninh Thuận',
      investedAmount: 50000000,
      currentValue: 52500000,
      expectedReturn: 54250000,
      interestRate: 8.5,
      term: 24,
      remainingMonths: 18,
      monthlyReturn: 350000,
      creditRating: 'A+',
      esgScore: 95,
      status: 'active'
    },
    {
      id: 2,
      projectName: 'Dự án nông nghiệp hữu cơ Đà Lạt',
      investedAmount: 30000000,
      currentValue: 31800000,
      expectedReturn: 32160000,
      interestRate: 7.2,
      term: 18,
      remainingMonths: 12,
      monthlyReturn: 180000,
      creditRating: 'A',
      esgScore: 92,
      status: 'active'
    },
    {
      id: 3,
      projectName: 'Dự án tái chế nhựa',
      investedAmount: 40000000,
      currentValue: 43800000,
      expectedReturn: 43800000,
      interestRate: 9.5,
      term: 24,
      remainingMonths: 0,
      monthlyReturn: 0,
      creditRating: 'B+',
      esgScore: 88,
      status: 'completed'
    }
  ];

  const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalProfit = totalCurrentValue - totalInvested;
  const activeInvestments = investments.filter(inv => inv.status === 'active').length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getROI = (invested, current) => {
    return ((current - invested) / invested * 100).toFixed(2);
  };

  return (
    <div className="portfolio-container">
      <div className="portfolio-header">
        <button className="btn-back" onClick={() => navigate('/dashboard', { state: { userRole } })}>
          <FaArrowLeft /> Quay lại
        </button>
        <h1>Danh mục đầu tư</h1>
      </div>

      <div className="portfolio-summary">
        <div className="summary-card-large">
          <div className="summary-icon-large">
            <BiMoney />
          </div>
          <div className="summary-content-large">
            <span className="summary-label-large">Tổng đầu tư</span>
            <span className="summary-value-large">{formatCurrency(totalInvested)}</span>
          </div>
        </div>

        <div className="summary-card-large">
          <div className="summary-icon-large profit">
            <BiTrendingUp />
          </div>
          <div className="summary-content-large">
            <span className="summary-label-large">Giá trị hiện tại</span>
            <span className="summary-value-large">{formatCurrency(totalCurrentValue)}</span>
            <span className="summary-change positive">+{formatCurrency(totalProfit)} ({getROI(totalInvested, totalCurrentValue)}%)</span>
          </div>
        </div>

        <div className="summary-card-large">
          <div className="summary-icon-large chart">
            <FaChartLine />
          </div>
          <div className="summary-content-large">
            <span className="summary-label-large">Dự án đang đầu tư</span>
            <span className="summary-value-large">{activeInvestments}</span>
          </div>
        </div>
      </div>

      <div className="investments-list">
        <h2>Danh sách đầu tư</h2>
        {investments.map(investment => (
          <div key={investment.id} className="investment-card">
            <div className="investment-header">
              <div>
                <h3>{investment.projectName}</h3>
                <div className="investment-badges">
                  <span className="rating-badge rating-a">
                    <FaStar /> {investment.creditRating}
                  </span>
                  <span className="esg-badge esg-high">
                    <FaLeaf /> ESG {investment.esgScore}
                  </span>
                  <span className={`status-badge ${investment.status === 'active' ? 'active' : 'completed'}`}>
                    {investment.status === 'active' ? 'Đang hoạt động' : 'Đã hoàn thành'}
                  </span>
                </div>
              </div>
              <button 
                className="btn-view"
                onClick={() => handleViewDetail(investment)}
              >
                Xem chi tiết
              </button>
            </div>

            <div className="investment-body">
              <div className="investment-stats">
                <div className="stat-col">
                  <span className="stat-label">Đã đầu tư</span>
                  <span className="stat-value">{formatCurrency(investment.investedAmount)}</span>
                </div>

                <div className="stat-col">
                  <span className="stat-label">Giá trị hiện tại</span>
                  <span className="stat-value highlight">{formatCurrency(investment.currentValue)}</span>
                </div>

                <div className="stat-col">
                  <span className="stat-label">Lợi nhuận</span>
                  <span className="stat-value profit">
                    +{formatCurrency(investment.currentValue - investment.investedAmount)}
                  </span>
                  <span className="roi-badge">
                    ROI: {getROI(investment.investedAmount, investment.currentValue)}%
                  </span>
                </div>

                <div className="stat-col">
                  <span className="stat-label">Lãi suất</span>
                  <span className="stat-value">{investment.interestRate}%/năm</span>
                </div>
              </div>

              {investment.status === 'active' && (
                <div className="investment-progress">
                  <div className="progress-info">
                    <span>Còn lại: {investment.remainingMonths} / {investment.term} tháng</span>
                    <span>Thu nhập hàng tháng: {formatCurrency(investment.monthlyReturn)}</span>
                  </div>
                </div>
              )}

              {investment.status === 'completed' && (
                <div className="completed-info">
                  <FaCheckCircle className="check-icon" />
                  <span>Đầu tư đã hoàn thành. Tổng lợi nhuận: {formatCurrency(investment.currentValue - investment.investedAmount)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Chi tiết đầu tư */}
      {showDetailModal && selectedInvestment && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết đầu tư</h2>
              <button className="btn-close" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <h3>{selectedInvestment.projectName}</h3>

              <div className="detail-section">
                <h4>📊 Thông tin đầu tư</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Số tiền đầu tư:</span>
                    <strong className="info-value">{formatCurrency(selectedInvestment.investedAmount)}</strong>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Giá trị hiện tại:</span>
                    <strong className="info-value highlight">{formatCurrency(selectedInvestment.currentValue)}</strong>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Lợi nhuận đã nhận:</span>
                    <strong className="info-value profit">
                      {formatCurrency(selectedInvestment.currentValue - selectedInvestment.investedAmount)}
                    </strong>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Lãi suất:</span>
                    <strong className="info-value">{selectedInvestment.interestRate}% / năm</strong>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Kỳ hạn:</span>
                    <strong className="info-value">{selectedInvestment.term} tháng</strong>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Còn lại:</span>
                    <strong className="info-value">{selectedInvestment.remainingMonths} tháng</strong>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Thu nhập hàng tháng:</span>
                    <strong className="info-value">{formatCurrency(selectedInvestment.monthlyReturn)}</strong>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Trạng thái:</span>
                    <span className={`status-tag ${selectedInvestment.status}`}>
                      {selectedInvestment.status === 'active' ? 'Đang hoạt động' : 'Đã hoàn thành'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>📈 Lịch sử thanh toán gần nhất</h4>
                <div className="payment-history">
                  <div className="payment-item">
                    <div className="payment-date">15/09/2025</div>
                    <div className="payment-desc">Lãi tháng 9/2025</div>
                    <div className="payment-amount income">+{formatCurrency(selectedInvestment.monthlyReturn)}</div>
                  </div>
                  <div className="payment-item">
                    <div className="payment-date">15/08/2025</div>
                    <div className="payment-desc">Lãi tháng 8/2025</div>
                    <div className="payment-amount income">+{formatCurrency(selectedInvestment.monthlyReturn)}</div>
                  </div>
                  <div className="payment-item">
                    <div className="payment-date">15/07/2025</div>
                    <div className="payment-desc">Lãi tháng 7/2025</div>
                    <div className="payment-amount income">+{formatCurrency(selectedInvestment.monthlyReturn)}</div>
                  </div>
                  <div className="payment-item">
                    <div className="payment-date">15/06/2025</div>
                    <div className="payment-desc">Lãi tháng 6/2025</div>
                    <div className="payment-amount income">+{formatCurrency(selectedInvestment.monthlyReturn)}</div>
                  </div>
                </div>
              </div>

              {selectedInvestment.status === 'active' && (
                <div className="detail-section">
                  <h4>⏱️ Tiến độ</h4>
                  <div className="progress-detail">
                    <div className="progress-text">
                      Đã trải qua {selectedInvestment.term - selectedInvestment.remainingMonths}/{selectedInvestment.term} tháng 
                      ({Math.round((selectedInvestment.term - selectedInvestment.remainingMonths) / selectedInvestment.term * 100)}%)
                    </div>
                  </div>
                  <div className="expected-return">
                    <span>Tổng lợi nhuận dự kiến khi đáo hạn:</span>
                    <strong>{formatCurrency(selectedInvestment.expectedReturn - selectedInvestment.investedAmount)}</strong>
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h4>🎯 Đánh giá</h4>
                <div className="rating-section">
                  <div className="rating-item">
                    <span className="rating-label">Xếp hạng tín dụng:</span>
                    <span className="rating-badge-large rating-a">
                      <FaStar /> {selectedInvestment.creditRating}
                    </span>
                  </div>
                  <div className="rating-item">
                    <span className="rating-label">Điểm ESG:</span>
                    <span className="esg-badge-large">
                      <FaLeaf /> {selectedInvestment.esgScore}/100
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentPortfolio;
