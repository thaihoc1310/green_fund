import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaArrowLeft, FaLeaf, FaStar, FaUser, FaBuilding, 
  FaMapMarkerAlt, FaChartLine, FaHistory, FaCheckCircle 
} from 'react-icons/fa';
import { BiMoney, BiTime, BiTrendingUp } from 'react-icons/bi';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import './LoanDetail.css';

const LoanDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [investAmount, setInvestAmount] = useState('');
  const [showInvestModal, setShowInvestModal] = useState(false);

  // Mock data - sẽ thay bằng API call
  const loanData = {
    id: parseInt(id),
    projectName: 'Dự án năng lượng mặt trời Ninh Thuận',
    amount: 200000000,
    purpose: 'Đầu tư hệ thống pin mặt trời công suất 500kW cho nhà máy sản xuất, giảm chi phí điện năng và phát thải carbon',
    creditRating: 'A+',
    interestRate: 8.5,
    esgScore: 95,
    term: 24,
    funded: 65,
    paymentMethod: 'Trả gốc + lãi hàng tháng',
    
    representative: {
      name: 'Nguyễn Văn An',
      position: 'Giám đốc',
      age: 45
    },
    
    company: {
      name: 'Công ty TNHH Green Energy',
      type: 'Công ty TNHH',
      registrationLocation: 'TP. Hồ Chí Minh',
      establishedYear: 2015,
      employees: 150,
      revenue: 50000000000
    },

    creditHistory: {
      totalLoans: 5,
      onTimePaymentRate: 98,
      totalBorrowed: 800000000,
      totalRepaid: 650000000,
      defaultCount: 0
    },

    projectDetails: {
      description: 'Dự án lắp đặt hệ thống pin mặt trời công suất lớn nhằm cung cấp năng lượng sạch, giảm phụ thuộc vào lưới điện quốc gia và giảm chi phí sản xuất dài hạn.',
      benefits: [
        'Giảm 70% chi phí điện năng',
        'Giảm 500 tấn CO2/năm',
        'Tạo 20 việc làm mới',
        'Thời gian hoàn vốn: 7 năm'
      ],
      timeline: [
        { phase: 'Chuẩn bị', duration: '2 tháng', status: 'completed' },
        { phase: 'Thi công', duration: '4 tháng', status: 'in-progress' },
        { phase: 'Vận hành', duration: '18 tháng', status: 'pending' }
      ]
    },

    esgDetails: {
      environmental: 95,
      social: 90,
      governance: 98
    },

    documents: [
      { name: 'Giấy phép kinh doanh', verified: true },
      { name: 'Báo cáo tài chính 2024', verified: true },
      { name: 'Hợp đồng mua bán điện', verified: true },
      { name: 'Giấy chứng nhận ESG', verified: true }
    ]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleInvest = () => {
    if (!investAmount || investAmount < 1000000) {
      alert('Số tiền đầu tư tối thiểu là 1,000,000 VND');
      return;
    }
    // TODO: Implement investment logic
    alert(`Đầu tư thành công ${formatCurrency(investAmount)} vào dự án!`);
    setShowInvestModal(false);
    navigate('/investment-portfolio');
  };

  return (
    <div className="loan-detail-container">
      <div className="loan-detail-header">
        <button className="btn-back" onClick={() => navigate('/loan-list')}>
          <FaArrowLeft /> Quay lại danh sách
        </button>
      </div>

      <div className="loan-detail-content">
        {/* Main Info Card */}
        <div className="main-info-card">
          <div className="project-header">
            <div>
              <h1>{loanData.projectName}</h1>
              <div className="company-info">
                <FaBuilding /> {loanData.company.name}
              </div>
            </div>
            <div className="rating-badges">
              <span className="rating-badge rating-a">
                <FaStar /> {loanData.creditRating}
              </span>
              <span className="esg-badge esg-high">
                <FaLeaf /> ESG {loanData.esgScore}
              </span>
            </div>
          </div>

          <div className="key-stats">
            <div className="stat-box">
              <BiMoney className="stat-icon-large" />
              <div>
                <span className="stat-label">Số tiền cần vay</span>
                <span className="stat-value-large">{formatCurrency(loanData.amount)}</span>
              </div>
            </div>
            <div className="stat-box">
              <BiTrendingUp className="stat-icon-large" />
              <div>
                <span className="stat-label">Lãi suất</span>
                <span className="stat-value-large interest">{loanData.interestRate}%/năm</span>
              </div>
            </div>
            <div className="stat-box">
              <BiTime className="stat-icon-large" />
              <div>
                <span className="stat-label">Thời hạn</span>
                <span className="stat-value-large">{loanData.term} tháng</span>
              </div>
            </div>
          </div>

          <div className="progress-section-detail">
            <div className="progress-header">
              <span>Tiến độ huy động vốn</span>
              <span className="progress-percent">{loanData.funded}%</span>
            </div>
            <div className="progress-bar-large">
              <div 
                className="progress-fill" 
                style={{ width: `${loanData.funded}%` }}
              ></div>
            </div>
            <div className="progress-info">
              <span>Đã huy động: {formatCurrency(loanData.amount * loanData.funded / 100)}</span>
              <span>Còn lại: {formatCurrency(loanData.amount * (100 - loanData.funded) / 100)}</span>
            </div>
          </div>

          <button className="btn-invest-large" onClick={() => setShowInvestModal(true)}>
            <BiMoney /> Đầu tư ngay
          </button>
        </div>

        {/* Two Column Layout */}
        <div className="detail-grid">
          {/* Left Column */}
          <div className="detail-column">
            {/* Project Details */}
            <div className="detail-card">
              <h2><FaChartLine /> Thông tin dự án</h2>
              <div className="detail-section">
                <h3>Mục đích vay</h3>
                <p>{loanData.purpose}</p>
              </div>
              <div className="detail-section">
                <h3>Mô tả chi tiết</h3>
                <p>{loanData.projectDetails.description}</p>
              </div>
              <div className="detail-section">
                <h3>Lợi ích dự kiến</h3>
                <ul className="benefits-list">
                  {loanData.projectDetails.benefits.map((benefit, index) => (
                    <li key={index}>
                      <FaCheckCircle className="check-icon" /> {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="detail-section">
                <h3>Hình thức trả nợ</h3>
                <p className="payment-method">{loanData.paymentMethod}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="detail-card">
              <h2><BiTime /> Tiến độ dự án</h2>
              <div className="timeline">
                {loanData.projectDetails.timeline.map((phase, index) => (
                  <div key={index} className={`timeline-item ${phase.status}`}>
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h4>{phase.phase}</h4>
                      <p>{phase.duration}</p>
                      <span className={`status-badge ${phase.status}`}>
                        {phase.status === 'completed' && 'Hoàn thành'}
                        {phase.status === 'in-progress' && 'Đang thực hiện'}
                        {phase.status === 'pending' && 'Chưa bắt đầu'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ESG Details */}
            <div className="detail-card">
              <h2><FaLeaf /> Đánh giá ESG</h2>
              <div className="esg-breakdown">
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={[
                    { 
                      subject: 'Environmental\n(Môi trường)', 
                      value: loanData.esgDetails.environmental,
                      fullMark: 100 
                    },
                    { 
                      subject: 'Social\n(Xã hội)', 
                      value: loanData.esgDetails.social,
                      fullMark: 100 
                    },
                    { 
                      subject: 'Governance\n(Quản trị)', 
                      value: loanData.esgDetails.governance,
                      fullMark: 100 
                    }
                  ]}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                      style={{ whiteSpace: 'pre-wrap' }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]}
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                    />
                    <Radar 
                      name="ESG Score" 
                      dataKey="value" 
                      stroke="#16a34a" 
                      fill="#22c55e" 
                      fillOpacity={0.6}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="esg-legend">
                  <div className="esg-legend-item">
                    <span className="esg-dot environmental"></span>
                    <span>Environmental: <strong>{loanData.esgDetails.environmental}/100</strong></span>
                  </div>
                  <div className="esg-legend-item">
                    <span className="esg-dot social"></span>
                    <span>Social: <strong>{loanData.esgDetails.social}/100</strong></span>
                  </div>
                  <div className="esg-legend-item">
                    <span className="esg-dot governance"></span>
                    <span>Governance: <strong>{loanData.esgDetails.governance}/100</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="detail-column">
            {/* Representative Info */}
            <div className="detail-card">
              <h2><FaUser /> Người đại diện</h2>
              <div className="representative-info">
                <div className="rep-avatar">
                  {loanData.representative.name.charAt(0)}
                </div>
                <div className="rep-details">
                  <h3>{loanData.representative.name}</h3>
                  <p>{loanData.representative.position} • {loanData.representative.age} tuổi</p>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="detail-card">
              <h2><FaBuilding /> Thông tin doanh nghiệp</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Loại hình</span>
                  <span className="info-value">{loanData.company.type}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Nơi đăng ký</span>
                  <span className="info-value">
                    <FaMapMarkerAlt /> {loanData.company.registrationLocation}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Năm thành lập</span>
                  <span className="info-value">{loanData.company.establishedYear}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Số nhân viên</span>
                  <span className="info-value">{loanData.company.employees} người</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Doanh thu năm 2024</span>
                  <span className="info-value">{formatCurrency(loanData.company.revenue)}</span>
                </div>
              </div>
            </div>

            {/* Credit History */}
            <div className="detail-card">
              <h2><FaHistory /> Lịch sử tín dụng</h2>
              <div className="credit-stats">
                <div className="credit-item highlight">
                  <span className="credit-value">{loanData.creditHistory.totalLoans}</span>
                  <span className="credit-label">Khoản vay trước đây</span>
                </div>
                <div className="credit-item highlight">
                  <span className="credit-value success">{loanData.creditHistory.onTimePaymentRate}%</span>
                  <span className="credit-label">Tỷ lệ trả đúng hạn</span>
                </div>
                <div className="credit-item">
                  <span className="credit-label">Tổng đã vay</span>
                  <span className="credit-value">{formatCurrency(loanData.creditHistory.totalBorrowed)}</span>
                </div>
                <div className="credit-item">
                  <span className="credit-label">Tổng đã trả</span>
                  <span className="credit-value">{formatCurrency(loanData.creditHistory.totalRepaid)}</span>
                </div>
                <div className="credit-item">
                  <span className="credit-label">Số lần vi phạm</span>
                  <span className="credit-value success">{loanData.creditHistory.defaultCount}</span>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="detail-card">
              <h2><FaCheckCircle /> Tài liệu xác thực</h2>
              <div className="documents-list">
                {loanData.documents.map((doc, index) => (
                  <div key={index} className="document-item">
                    <FaCheckCircle className="doc-icon verified" />
                    <span>{doc.name}</span>
                    {doc.verified && <span className="verified-badge">Đã xác thực</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      {showInvestModal && (
        <div className="modal-overlay" onClick={() => setShowInvestModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Đầu tư vào dự án</h2>
            <p className="modal-project-name">{loanData.projectName}</p>
            
            <div className="modal-info">
              <div className="modal-info-item">
                <span>Lãi suất:</span>
                <strong className="interest">{loanData.interestRate}%/năm</strong>
              </div>
              <div className="modal-info-item">
                <span>Thời hạn:</span>
                <strong>{loanData.term} tháng</strong>
              </div>
            </div>

            <div className="input-group">
              <label>Số tiền muốn đầu tư (tối thiểu 1,000,000 VND)</label>
              <input
                type="number"
                value={investAmount}
                onChange={(e) => setInvestAmount(e.target.value)}
                placeholder="Nhập số tiền"
                min="1000000"
                step="100000"
              />
            </div>

            {investAmount >= 1000000 && (
              <div className="investment-summary">
                <p>Dự kiến nhận về sau {loanData.term} tháng:</p>
                <h3 className="expected-return">
                  {formatCurrency(investAmount * (1 + loanData.interestRate / 100 * loanData.term / 12))}
                </h3>
                <p className="profit">
                  Lợi nhuận: {formatCurrency(investAmount * loanData.interestRate / 100 * loanData.term / 12)}
                </p>
              </div>
            )}

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowInvestModal(false)}>
                Hủy
              </button>
              <button className="btn-confirm" onClick={handleInvest}>
                Xác nhận đầu tư
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanDetail;
