import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaLeaf, FaStar, FaArrowLeft, FaFilter } from 'react-icons/fa';
import { BiMoney, BiTime } from 'react-icons/bi';
import './LoanList.css';
import greenAgriculture from '../assets/loan_packages/green-agriculture.jpg';
import renewableEnergy from '../assets/loan_packages/renewable-energy.jpg';
import sustainableConsumption from '../assets/loan_packages/sustainable-consumption.jpg';
import environmentalTech from '../assets/loan_packages/environmental-tech.jpg';
import { loansData, calculateESGScore } from '../data/loansData';

const LoanList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = location.state?.userRole || 'lender';
  const initialPackage = location.state?.selectedPackage || null;
  const [filter, setFilter] = useState('all'); // all, high-rating, low-rate, esg
  const [selectedPackage, setSelectedPackage] = useState(initialPackage);

  // Loan packages
  const loanPackages = [
    {
      id: 'green-agriculture',
      name: 'NÔNG NGHIỆP XANH',
      image: greenAgriculture,
      description: 'Phát triển nông nghiệp công nghệ cao, giảm phát thải'
    },
    {
      id: 'renewable-energy',
      name: 'NĂNG LƯỢNG TÁI TẠO',
      image: renewableEnergy,
      description: 'Năng lượng sạch, bền vững cho tương lai'
    },
    {
      id: 'sustainable-consumption',
      name: 'SẢN XUẤT TIÊU DÙNG BỀN VỮNG',
      image: sustainableConsumption,
      description: 'Sản phẩm thân thiện môi trường'
    },
    {
      id: 'environmental-tech',
      name: 'CÔNG NGHỆ MÔI TRƯỜNG',
      image: environmentalTech,
      description: 'Công nghệ xử lý môi trường tiên tiến'
    }
  ];

  // Filter loans based on selected package
  const loans = selectedPackage 
    ? loansData.filter(loan => loan.package === selectedPackage)
    : [];

  const filteredLoans = loans.filter(loan => {
    const esgScore = calculateESGScore(loan.esgDetails);
    if (filter === 'high-rating') return ['A+', 'A'].includes(loan.creditRating);
    if (filter === 'low-rate') return loan.interestRate <= 10.5;
    if (filter === 'esg') return esgScore >= 75;
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
    if (score >= 80) return 'esg-high';
    if (score >= 70) return 'esg-medium';
    return 'esg-low';
  };

  return (
    <div className="loan-list-container">
      <div className="loan-list-header">
        <button className="btn-back" onClick={() => {
          if (selectedPackage) {
            setSelectedPackage(null);
          } else {
            navigate('/dashboard', { state: { userRole } });
          }
        }}>
          <FaArrowLeft /> {selectedPackage ? 'Quay lại chọn gói' : 'Quay lại'}
        </button>
        <h1>Danh sách khoản vay</h1>
      </div>

      {/* Package Selection - Show when no package selected */}
      {!selectedPackage && (
        <div className="package-selection">
          <h2 className="package-title">Chọn gói dự án</h2>
          <div className="packages-grid">
            {loanPackages.map(pkg => (
              <div 
                key={pkg.id} 
                className="package-card"
                onClick={() => setSelectedPackage(pkg.id)}
              >
                <div className="package-image">
                  <img src={pkg.image} alt={pkg.name} />
                </div>
                <div className="package-info">
                  <h3>{pkg.name}</h3>
                  <p>{pkg.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Loans Grid - Show only when package selected */}
      {selectedPackage && (
        <>
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
            {filteredLoans.map(loan => {
              const esgScore = calculateESGScore(loan.esgDetails);
              return (
              <div key={loan.id} className="loan-card-modern">
                {/* Loan Image */}
                <div className="loan-card-image">
                  <img src={loan.image} alt={loan.projectName} />
                  <span className={`rating-badge ${getRatingColor(loan.creditRating)}`}>
                    <FaStar /> {loan.creditRating}
                  </span>
                </div>

                <div className="loan-card-body">
                  <h3 className="loan-card-title">{loan.projectName}</h3>
                  
                  <div className="loan-company">
                    <strong>{loan.company?.name || loan.company}</strong>
                    <p>Đại diện: {loan.representative?.name || loan.representative}</p>
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
                      <span className={`esg-badge ${getESGColor(esgScore)}`}>
                        <FaLeaf /> {esgScore}/100
                      </span>
                    </div>
                  </div>

                </div>

                <div className="loan-card-footer">
                  <button 
                    className="btn-view-detail"
                    onClick={() => navigate(`/loan-detail/${loan.id}`, { 
                      state: { selectedPackage, userRole } 
                    })}
                  >
                    Xem chi tiết
                  </button>
                  <button 
                    className="btn-invest"
                    onClick={() => navigate(`/loan-detail/${loan.id}`, { 
                      state: { selectedPackage, userRole } 
                    })}
                  >
                    Đầu tư ngay
                  </button>
                </div>
              </div>
              );
            })}
          </div>

          {filteredLoans.length === 0 && (
            <div className="no-results">
              <p>Không tìm thấy khoản vay phù hợp với bộ lọc</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LoanList;
