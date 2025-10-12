import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaWallet, FaUniversity, FaCreditCard, FaMobileAlt } from 'react-icons/fa';
import { BiMoney } from 'react-icons/bi';
import BottomNav from './BottomNav';
import './Deposit.css';

const Deposit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = location.state?.userRole || 'borrower';
  
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('wallet');
  const [bankAccount, setBankAccount] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const quickAmounts = [100000, 500000, 1000000, 5000000, 10000000, 50000000];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleQuickAmount = (amount) => {
    setDepositAmount(amount.toString());
  };

  const handleDeposit = (e) => {
    e.preventDefault();
    
    if (!depositAmount || depositAmount < 10000) {
      alert('Số tiền nạp tối thiểu là 10,000 VND');
      return;
    }

    // TODO: Implement actual deposit logic
    alert(`Đã nạp thành công ${formatCurrency(depositAmount)} vào tài khoản!`);
    navigate('/dashboard', { state: { userRole } });
  };

  return (
    <div className="deposit-container">
      <div className="deposit-header">
        <button className="btn-back" onClick={() => navigate('/dashboard', { state: { userRole } })}>
          <FaArrowLeft /> Quay lại
        </button>
        <h1>Nạp tiền vào tài khoản</h1>
      </div>

      <div className="deposit-content">
        <div className="deposit-main">
          <div className="deposit-card">
            <div className="card-header">
              <FaWallet className="header-icon" />
              <div>
                <h2>Thông tin nạp tiền</h2>
                <p>Nạp tiền an toàn và nhanh chóng</p>
              </div>
            </div>

            <form onSubmit={handleDeposit}>
              <div className="form-section">
                <label>Số tiền cần nạp *</label>
                <div className="amount-input-group">
                  <BiMoney className="input-icon" />
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Nhập số tiền"
                    min="10000"
                    step="10000"
                    required
                  />
                  <span className="currency-label">VND</span>
                </div>

                <div className="quick-amounts">
                  <span className="quick-label">Chọn nhanh:</span>
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      className={`quick-btn ${depositAmount === amount.toString() ? 'active' : ''}`}
                      onClick={() => handleQuickAmount(amount)}
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <label>Phương thức nạp tiền *</label>
                <div className="payment-methods">
                  <div
                    className={`method-card ${selectedMethod === 'wallet' ? 'active' : ''}`}
                    onClick={() => setSelectedMethod('wallet')}
                  >
                    <input
                      type="radio"
                      name="method"
                      value="wallet"
                      checked={selectedMethod === 'wallet'}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                    />
                    <FaWallet className="method-icon" />
                    <div className="method-info">
                      <span className="method-name">Ví điện tử</span>
                      <span className="method-desc">Momo, ZaloPay, VNPay</span>
                    </div>
                  </div>

                  <div
                    className={`method-card ${selectedMethod === 'bank' ? 'active' : ''}`}
                    onClick={() => setSelectedMethod('bank')}
                  >
                    <input
                      type="radio"
                      name="method"
                      value="bank"
                      checked={selectedMethod === 'bank'}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                    />
                    <FaUniversity className="method-icon" />
                    <div className="method-info">
                      <span className="method-name">Chuyển khoản</span>
                      <span className="method-desc">Ngân hàng nội địa</span>
                    </div>
                  </div>

                  <div
                    className={`method-card ${selectedMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setSelectedMethod('card')}
                  >
                    <input
                      type="radio"
                      name="method"
                      value="card"
                      checked={selectedMethod === 'card'}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                    />
                    <FaCreditCard className="method-icon" />
                    <div className="method-info">
                      <span className="method-name">Thẻ tín dụng</span>
                      <span className="method-desc">Visa, Mastercard, JCB</span>
                    </div>
                  </div>

                  <div
                    className={`method-card ${selectedMethod === 'mobile' ? 'active' : ''}`}
                    onClick={() => setSelectedMethod('mobile')}
                  >
                    <input
                      type="radio"
                      name="method"
                      value="mobile"
                      checked={selectedMethod === 'mobile'}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                    />
                    <FaMobileAlt className="method-icon" />
                    <div className="method-info">
                      <span className="method-name">Mobile Banking</span>
                      <span className="method-desc">App ngân hàng</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedMethod === 'bank' && (
                <div className="form-section">
                  <label>Số tài khoản ngân hàng</label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="Nhập số tài khoản"
                    className="form-input"
                  />
                </div>
              )}

              {selectedMethod === 'card' && (
                <div className="form-section">
                  <label>Số thẻ tín dụng</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="xxxx xxxx xxxx xxxx"
                    className="form-input"
                    maxLength="19"
                  />
                </div>
              )}

              {depositAmount >= 10000 && (
                <div className="summary-box">
                  <h3>Tóm tắt giao dịch</h3>
                  <div className="summary-row">
                    <span>Số tiền nạp:</span>
                    <strong>{formatCurrency(depositAmount)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Phí giao dịch:</span>
                    <strong className="free">Miễn phí</strong>
                  </div>
                  <div className="summary-row total">
                    <span>Tổng cộng:</span>
                    <strong>{formatCurrency(depositAmount)}</strong>
                  </div>
                </div>
              )}

              <button type="submit" className="btn-deposit">
                Xác nhận nạp tiền
              </button>
            </form>
          </div>
        </div>

        <div className="deposit-sidebar">
          <div className="info-card">
            <h3>💡 Lưu ý quan trọng</h3>
            <ul>
              <li>Số tiền nạp tối thiểu: 10,000 VND</li>
              <li>Thời gian xử lý: 1-5 phút</li>
              <li>Phí giao dịch: Miễn phí 100%</li>
              <li>Hỗ trợ 24/7 qua hotline: 1900-xxxx</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>🔒 Bảo mật & An toàn</h3>
            <ul>
              <li>✓ Mã hóa SSL 256-bit</li>
              <li>✓ Tuân thủ tiêu chuẩn PCI DSS</li>
              <li>✓ Xác thực 2 lớp</li>
              <li>✓ Bảo vệ giao dịch 100%</li>
            </ul>
          </div>

          <div className="info-card promo">
            <h3>🎁 Ưu đãi đặc biệt</h3>
            <p>Nạp từ 5,000,000 VND nhận thêm 50,000 VND</p>
            <span className="promo-code">Mã: NAPFIRST</span>
          </div>
        </div>
      </div>
      <BottomNav userRole={userRole} />
    </div>
  );
};

export default Deposit;
