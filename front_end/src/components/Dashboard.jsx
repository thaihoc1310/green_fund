import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaLeaf, FaUser, FaWallet, FaHistory, FaNewspaper, FaChartLine, FaHandHoldingUsd } from 'react-icons/fa';
import { BiMoney } from 'react-icons/bi';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState('borrower'); // 'borrower' or 'lender'
  const [depositAmount, setDepositAmount] = useState('');

  // Nhận userRole từ navigation state nếu có
  useEffect(() => {
    if (location.state?.userRole) {
      setUserRole(location.state.userRole);
    }
  }, [location.state]);

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/login');
  };

  const toggleRole = () => {
    setUserRole(userRole === 'borrower' ? 'lender' : 'borrower');
  };

  const handleDeposit = () => {
    if (depositAmount && depositAmount > 0) {
      alert(`Đã nạp ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(depositAmount)} vào tài khoản`);
      setDepositAmount('');
    }
  };

  // Borrower features
  if (userRole === 'borrower') {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="role-switcher">
            <h1><FaLeaf className="header-icon" /> Green Fund - Người vay</h1>
            <button onClick={toggleRole} className="btn-secondary">
              Chuyển sang người cho vay
            </button>
          </div>
          <button onClick={handleLogout} className="btn-secondary">Đăng xuất</button>
        </header>
        <main className="dashboard-content">
          <div className="user-info-card">
            <div className="user-avatar">
              <FaUser />
            </div>
            <div className="user-details">
              <h2>Nguyễn Văn A</h2>
              <p className="user-role">Người vay vốn</p>
              <p className="user-balance"><FaWallet /> Số dư: <strong>5,000,000 VND</strong></p>
            </div>
            <button className="btn-profile" onClick={() => navigate('/profile', { state: { userRole: 'borrower' } })}>Hồ sơ</button>
          </div>
          
          <div className="card">
            <h3>Chức năng chính</h3>
            <div className="dashboard-grid">
              <button 
                className="btn-feature dashboard-btn deposit-feature"
                onClick={() => navigate('/deposit', { state: { userRole: 'borrower' } })}
              >
                <FaWallet className="feature-icon" />
                <span>Nạp tiền</span>
              </button>
              <button 
                className="btn-feature dashboard-btn"
                onClick={() => navigate('/create-loan', { state: { userRole: 'borrower' } })}
              >
                <BiMoney className="feature-icon" />
                <span>Tạo khoản vay mới</span>
              </button>
              <button 
                className="btn-feature dashboard-btn"
                onClick={() => navigate('/loan-management', { state: { userRole: 'borrower' } })}
              >
                <FaChartLine className="feature-icon" />
                <span>Quản lý dự án</span>
              </button>
              <button 
                className="btn-feature dashboard-btn"
                onClick={() => navigate('/transaction-history', { state: { userRole: 'borrower' } })}
              >
                <FaHistory className="feature-icon" />
                <span>Lịch sử giao dịch</span>
              </button>
              <button 
                className="btn-feature dashboard-btn"
                onClick={() => navigate('/news-promotion', { state: { userRole: 'borrower' } })}
              >
                <FaNewspaper className="feature-icon" />
                <span>Tin tức & ưu đãi</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  } 
  // Lender features
  else {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="role-switcher">
            <h1><FaLeaf className="header-icon" /> Green Fund - Người cho vay</h1>
            <button onClick={toggleRole} className="btn-secondary">
              Chuyển sang người vay
            </button>
          </div>
          <button onClick={handleLogout} className="btn-secondary">Đăng xuất</button>
        </header>
        <main className="dashboard-content">
          <div className="user-info-card">
            <div className="user-avatar">
              <FaUser />
            </div>
            <div className="user-details">
              <h2>Nguyễn Văn A</h2>
              <p className="user-role">Nhà đầu tư</p>
              <p className="user-balance"><FaWallet /> Số dư: <strong>15,000,000 VND</strong></p>
            </div>
            <button className="btn-profile" onClick={() => navigate('/profile', { state: { userRole: 'lender' } })}>Hồ sơ</button>
          </div>
          
          <div className="card">
            <h3>Chức năng chính</h3>
            <div className="dashboard-grid">
              <button 
                className="btn-feature dashboard-btn deposit-feature"
                onClick={() => navigate('/deposit', { state: { userRole: 'lender' } })}
              >
                <FaWallet className="feature-icon" />
                <span>Nạp tiền</span>
              </button>
              <button 
                className="btn-feature dashboard-btn"
                onClick={() => navigate('/loan-list', { state: { userRole: 'lender' } })}
              >
                <FaHandHoldingUsd className="feature-icon" />
                <span>Danh sách khoản vay</span>
              </button>
              <button 
                className="btn-feature dashboard-btn"
                onClick={() => navigate('/investment-portfolio', { state: { userRole: 'lender' } })}
              >
                <FaChartLine className="feature-icon" />
                <span>Danh mục đầu tư</span>
              </button>
              <button 
                className="btn-feature dashboard-btn"
                onClick={() => navigate('/transaction-history', { state: { userRole: 'lender' } })}
              >
                <FaHistory className="feature-icon" />
                <span>Lịch sử giao dịch</span>
              </button>
              <button 
                className="btn-feature dashboard-btn"
                onClick={() => navigate('/news-promotion', { state: { userRole: 'lender' } })}
              >
                <FaNewspaper className="feature-icon" />
                <span>Tin tức & ưu đãi</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }
};

export default Dashboard;