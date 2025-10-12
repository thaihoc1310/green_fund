import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaChartLine, FaCheckCircle, FaClock, FaExclamationTriangle, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { BiMoney, BiTime } from 'react-icons/bi';
import BottomNav from './BottomNav';
import './LoanManagement.css';

const LoanManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = location.state?.userRole || 'borrower';
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoan, setPaymentLoan] = useState(null);

  // Mock data
  const loans = [
    {
      id: 1,
      projectName: 'Dự án năng lượng mặt trời Ninh Thuận',
      amount: 200000000,
      funded: 65,
      status: 'active',
      term: 24,
      monthlyPayment: 9500000,
      nextPaymentDate: '2025-11-01',
      totalRepaid: 57000000,
      createdDate: '2025-01-15'
    },
    {
      id: 2,
      projectName: 'Dự án tái chế nhựa thân thiện môi trường',
      amount: 150000000,
      funded: 100,
      status: 'completed',
      term: 18,
      monthlyPayment: 9200000,
      nextPaymentDate: null,
      totalRepaid: 165600000,
      createdDate: '2024-06-10'
    },
    {
      id: 3,
      projectName: 'Dự án nông nghiệp công nghệ cao',
      amount: 100000000,
      funded: 30,
      status: 'pending',
      term: 24,
      monthlyPayment: 0,
      nextPaymentDate: null,
      totalRepaid: 0,
      createdDate: '2025-09-20'
    }
  ];

  const filteredLoans = loans.filter(loan => {
    if (statusFilter === 'all') return true;
    return loan.status === statusFilter;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { text: 'Đang hoạt động', class: 'status-active' },
      pending: { text: 'Chờ duyệt', class: 'status-pending' },
      completed: { text: 'Đã hoàn thành', class: 'status-completed' }
    };
    return badges[status] || badges.pending;
  };

  const handleViewDetail = (loan) => {
    setSelectedLoan(loan);
    setShowDetailModal(true);
  };

  const handlePayment = (loan) => {
    setPaymentLoan(loan);
    setShowPaymentModal(true);
  };

  const confirmPayment = () => {
    if (paymentLoan) {
      alert(`Đã thanh toán ${formatCurrency(paymentLoan.monthlyPayment)} cho dự án "${paymentLoan.projectName}"`);
      setShowPaymentModal(false);
      setPaymentLoan(null);
    }
  };

  return (
    <div className="loan-management-container">
      <div className="loan-management-header">
        <button className="btn-back" onClick={() => navigate('/dashboard', { state: { userRole } })}>
          <FaArrowLeft /> Quay lại
        </button>
        <h1>Quản lý dự án vay</h1>
      </div>

      <div className="filter-section">
        <div className="filter-buttons">
          <button 
            className={statusFilter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setStatusFilter('all')}
          >
            Tất cả ({loans.length})
          </button>
          <button 
            className={statusFilter === 'pending' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setStatusFilter('pending')}
          >
            Chờ duyệt
          </button>
          <button 
            className={statusFilter === 'active' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setStatusFilter('active')}
          >
            Đang hoạt động
          </button>
          <button 
            className={statusFilter === 'completed' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setStatusFilter('completed')}
          >
            Đã hoàn thành
          </button>
        </div>
      </div>

      <div className="loans-list">
        {filteredLoans.map(loan => (
          <div key={loan.id} className="loan-management-card">
            <div className="loan-card-header">
              <div>
                <h3>{loan.projectName}</h3>
                <span className={`status-badge ${getStatusBadge(loan.status).class}`}>
                  {getStatusBadge(loan.status).text}
                </span>
              </div>
              <div className="loan-actions">
                <button className="action-btn" onClick={() => handleViewDetail(loan)}>
                  <FaEye /> Xem
                </button>
                {loan.status === 'pending' && (
                  <>
                    <button className="action-btn">
                      <FaEdit /> Sửa
                    </button>
                    <button className="action-btn delete">
                      <FaTrash /> Xóa
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="loan-card-body">
              <div className="info-grid">
                <div className="info-item">
                  <BiMoney className="info-icon" />
                  <div>
                    <span className="info-label">Số tiền vay</span>
                    <span className="info-value">{formatCurrency(loan.amount)}</span>
                  </div>
                </div>

                <div className="info-item">
                  <BiTime className="info-icon" />
                  <div>
                    <span className="info-label">Thời hạn</span>
                    <span className="info-value">{loan.term} tháng</span>
                  </div>
                </div>

                <div className="info-item">
                  <span className="info-label">Tiến độ huy động</span>
                  <div className="progress-bar-small">
                    <div className="progress-fill" style={{ width: `${loan.funded}%` }}></div>
                  </div>
                  <span className="progress-text">{loan.funded}%</span>
                </div>

                {loan.status === 'active' && (
                  <>
                    <div className="info-item">
                      <span className="info-label">Trả hàng tháng</span>
                      <span className="info-value">{formatCurrency(loan.monthlyPayment)}</span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">Ngày trả tiếp theo</span>
                      <span className="info-value">{formatDate(loan.nextPaymentDate)}</span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">Đã trả</span>
                      <span className="info-value">{formatCurrency(loan.totalRepaid)}</span>
                    </div>
                  </>
                )}
              </div>

              {loan.status === 'pending' && (
                <div className="pending-notice">
                  <p>Dự án đang chờ được duyệt. Chúng tôi sẽ thông báo khi dự án được phê duyệt.</p>
                </div>
              )}

              {loan.status === 'active' && loan.nextPaymentDate && (
                <button className="btn-pay" onClick={() => handlePayment(loan)}>
                  Thanh toán kỳ hạn
                </button>
              )}
            </div>

            <div className="loan-card-footer">
              <span>Ngày tạo: {formatDate(loan.createdDate)}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredLoans.length === 0 && (
        <div className="no-results">
          <p>Không có dự án nào</p>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedLoan && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết dự án</h2>
              <button className="btn-close" onClick={() => setShowDetailModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <h3>{selectedLoan.projectName}</h3>
              
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Trạng thái:</span>
                  <span className={`status-badge ${getStatusBadge(selectedLoan.status).class}`}>
                    {getStatusBadge(selectedLoan.status).text}
                  </span>
                </div>
                
                <div className="detail-item">
                  <span className="label">Số tiền vay:</span>
                  <strong>{formatCurrency(selectedLoan.amount)}</strong>
                </div>
                
                <div className="detail-item">
                  <span className="label">Thời hạn:</span>
                  <strong>{selectedLoan.term} tháng</strong>
                </div>
                
                <div className="detail-item">
                  <span className="label">Tiến độ huy động:</span>
                  <strong>{selectedLoan.funded}%</strong>
                </div>
                
                {selectedLoan.status === 'active' && (
                  <>
                    <div className="detail-item">
                      <span className="label">Trả hàng tháng:</span>
                      <strong className="highlight">{formatCurrency(selectedLoan.monthlyPayment)}</strong>
                    </div>
                    
                    <div className="detail-item">
                      <span className="label">Ngày trả tiếp theo:</span>
                      <strong>{formatDate(selectedLoan.nextPaymentDate)}</strong>
                    </div>
                    
                    <div className="detail-item">
                      <span className="label">Tổng đã trả:</span>
                      <strong>{formatCurrency(selectedLoan.totalRepaid)}</strong>
                    </div>
                    
                    <div className="detail-item">
                      <span className="label">Còn phải trả:</span>
                      <strong>{formatCurrency(selectedLoan.amount - selectedLoan.totalRepaid)}</strong>
                    </div>
                  </>
                )}
                
                <div className="detail-item full-width">
                  <span className="label">Ngày tạo:</span>
                  <strong>{formatDate(selectedLoan.createdDate)}</strong>
                </div>
              </div>

              {selectedLoan.status === 'pending' && (
                <div className="modal-notice pending">
                  <p>📋 Dự án đang chờ được duyệt. Chúng tôi sẽ thông báo khi dự án được phê duyệt.</p>
                </div>
              )}

              {selectedLoan.status === 'completed' && (
                <div className="modal-notice completed">
                  <p>✅ Dự án đã hoàn thành. Cảm ơn bạn đã sử dụng dịch vụ!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && paymentLoan && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Thanh toán kỳ hạn</h2>
              <button className="btn-close" onClick={() => setShowPaymentModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <h3>{paymentLoan.projectName}</h3>
              
              <div className="payment-info">
                <div className="payment-item">
                  <span>Kỳ thanh toán:</span>
                  <strong>{formatDate(paymentLoan.nextPaymentDate)}</strong>
                </div>
                
                <div className="payment-item highlight-payment">
                  <span>Số tiền thanh toán:</span>
                  <strong className="amount">{formatCurrency(paymentLoan.monthlyPayment)}</strong>
                </div>
                
                <div className="payment-item">
                  <span>Tổng đã trả:</span>
                  <strong>{formatCurrency(paymentLoan.totalRepaid)}</strong>
                </div>
                
                <div className="payment-item">
                  <span>Còn phải trả:</span>
                  <strong>{formatCurrency(paymentLoan.amount - paymentLoan.totalRepaid)}</strong>
                </div>
              </div>

              <div className="payment-methods">
                <h4>Chọn phương thức thanh toán:</h4>
                <div className="method-options">
                  <label className="method-option">
                    <input type="radio" name="payment-method" defaultChecked />
                    <span>💳 Ví Green Fund</span>
                  </label>
                  <label className="method-option">
                    <input type="radio" name="payment-method" />
                    <span>🏦 Chuyển khoản ngân hàng</span>
                  </label>
                  <label className="method-option">
                    <input type="radio" name="payment-method" />
                    <span>💰 Thẻ tín dụng</span>
                  </label>
                </div>
              </div>

              <div className="modal-notice info">
                <p>💡 Sau khi thanh toán, hệ thống sẽ tự động cập nhật lịch sử giao dịch và thông tin khoản vay.</p>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowPaymentModal(false)}>
                Hủy
              </button>
              <button className="btn-confirm" onClick={confirmPayment}>
                Xác nhận thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
      <BottomNav userRole={userRole} />
    </div>
  );
};

export default LoanManagement;
