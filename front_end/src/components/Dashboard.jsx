import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaLeaf, FaUser, FaWallet, FaHistory, FaNewspaper, FaChartLine, FaHandHoldingUsd } from 'react-icons/fa';
import { BiMoney } from 'react-icons/bi';
import BottomNav from './BottomNav';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState('borrower'); // 'borrower' or 'lender'
  const [depositAmount, setDepositAmount] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Nhận userRole từ navigation state nếu có
  useEffect(() => {
    if (location.state?.userRole) {
      setUserRole(location.state.userRole);
    }
  }, [location.state]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

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
        <header className="dashboard-header-new">
          <div className="header-left">
            <div className="logo-container">
              <FaLeaf className="logo-icon" />
              <span className="logo-text">Green Fund</span>
            </div>
          </div>
          
          <div className="header-center">
            <div className="search-container">
              <input type="text" placeholder="Tìm kiếm trong Green Fund" className="search-input" />
            </div>
          </div>
          
          <div className="header-right">
            <div className="user-menu-container">
              <div className="user-menu-trigger" onClick={() => setShowUserMenu(!showUserMenu)}>
                <div className="user-avatar-small">
                  <FaUser />
                </div>
                <span className="user-name">Nguyễn Văn A</span>
                </div>
              
              {showUserMenu && (
                <div className="user-dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      <FaUser />
                    </div>
                    <div className="dropdown-info">
                      <p className="dropdown-name">Nguyễn Văn A</p>
                      <p className="dropdown-role">Người vay vốn</p>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => { navigate('/profile', { state: { userRole: 'borrower' } }); setShowUserMenu(false); }}>
                    <FaUser /> Hồ sơ cá nhân
                  </button>
                  <button className="dropdown-item" onClick={() => { toggleRole(); setShowUserMenu(false); }}>
                    <FaChartLine /> Chuyển sang người cho vay
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="dashboard-content">
          {/* Hero Background Section */}
          <div className="hero-background">
            <div className="background-placeholder">
              <p>🖼️ Thêm ảnh background ở đây</p>
              <span className="bg-hint">Kích thước đề xuất: 1920x400px (Phong cảnh, thành phố)</span>
            </div>
          </div>

          {/* Account Card Overlap */}
          <div className="account-card-overlap">
            <div className="account-card">
              <div className="account-header">
                <span className="account-label">Ví GreenFund</span>
              </div>
              <div className="account-balance">
                <span className="balance-label">Số dư khả dụng</span>
                <div className="balance-amount">
                  <span className="balance-value">5,000,000 VND</span>
                </div>
              </div>

              {/* Service Buttons inside card */}
              <div className="service-buttons">
                <button 
                  className="service-btn deposit-btn"
                  onClick={() => navigate('/deposit', { state: { userRole: 'borrower' } })}
                >
                  <FaWallet className="service-icon" />
                  <span>Nạp tiền</span>
                </button>
                <button 
                  className="service-btn"
                  onClick={() => navigate('/create-loan', { state: { userRole: 'borrower' } })}
                >
                  <BiMoney className="service-icon" />
                  <span>Vay vốn</span>
                </button>
                <button 
                  className="service-btn"
                  onClick={() => navigate('/loan-management', { state: { userRole: 'borrower' } })}
                >
                  <FaChartLine className="service-icon" />
                  <span>Dự án</span>
                </button>
                <button 
                  className="service-btn"
                  onClick={() => navigate('/transaction-history', { state: { userRole: 'borrower' } })}
                >
                  <FaHistory className="service-icon" />
                  <span>Lịch sử</span>
                </button>
              </div>
            </div>
          </div>

          {/* News Section */}
          <div className="news-section">
            <div className="news-header">
              <h2>
                <FaNewspaper className="news-icon" />
                Tin tức & Khuyến mãi
              </h2>
            </div>
            
            <div className="news-grid">
              <div className="news-card featured">
                <div className="news-image-placeholder">
                  <span>🖼️ Thêm ảnh banner chính</span>
                </div>
                <div className="news-content">
                  <span className="news-badge featured-badge">Nổi bật</span>
                  <h3>Chương trình khuyến mãi lãi suất ưu đãi</h3>
                  <p>Nhận ngay lãi suất ưu đãi 0.5%/tháng cho các khoản vay dưới 50 triệu đồng. Áp dụng cho khách hàng mới.</p>
                  <div className="news-meta">
                    <span className="news-date">🕒 10/10/2025</span>
                  </div>
                </div>
              </div>

              <div className="news-card">
                <div className="news-image-placeholder small">
                  <span>🖼️ Ảnh</span>
                </div>
                <div className="news-content">
                  <span className="news-badge">Tin tức</span>
                  <h3>Green Fund đạt mốc 10,000 người dùng</h3>
                  <p>Cảm ơn sự tin tưởng của quý khách hàng đã đồng hành cùng Green Fund...</p>
                  <div className="news-meta">
                    <span className="news-date">🕒 08/10/2025</span>
                  </div>
                </div>
              </div>

              <div className="news-card">
                <div className="news-image-placeholder small">
                  <span>🖼️ Ảnh</span>
                </div>
                <div className="news-content">
                  <span className="news-badge">Hướng dẫn</span>
                  <h3>Cách tạo khoản vay hiệu quả</h3>
                  <p>Hướng dẫn chi tiết cách tạo hồ sơ vay vốn để tăng cơ hội được duyệt...</p>
                  <div className="news-meta">
                    <span className="news-date">🕒 05/10/2025</span>
                  </div>
                </div>
              </div>

              <div className="news-card">
                <div className="news-image-placeholder small">
                  <span>🖼️ Ảnh</span>
                </div>
                <div className="news-content">
                  <span className="news-badge">Cập nhật</span>
                  <h3>Tính năng mới: Đầu tư tự động</h3>
                  <p>Ra mắt tính năng đầu tư tự động giúp tối ưu hóa lợi nhuận của bạn...</p>
                  <div className="news-meta">
                    <span className="news-date">🕒 01/10/2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <BottomNav userRole="borrower" />
      </div>
    );
  } 
  // Lender features
  else {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header-new">
          <div className="header-left">
            <div className="logo-container">
              <FaLeaf className="logo-icon" />
              <span className="logo-text">Green Fund</span>
            </div>
          </div>
          
          <div className="header-center">
            <div className="search-container">
              <input type="text" placeholder="Tìm kiếm trong Green Fund" className="search-input" />
            </div>
          </div>
          
          <div className="header-right">
            <div className="user-menu-container">
              <div className="user-menu-trigger" onClick={() => setShowUserMenu(!showUserMenu)}>
                <div className="user-avatar-small">
                  <FaUser />
                </div>
                <span className="user-name">Nguyễn Văn A</span>
                </div>
              
              {showUserMenu && (
                <div className="user-dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      <FaUser />
                    </div>
                    <div className="dropdown-info">
                      <p className="dropdown-name">Nguyễn Văn A</p>
                      <p className="dropdown-role">Nhà đầu tư</p>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => { navigate('/profile', { state: { userRole: 'lender' } }); setShowUserMenu(false); }}>
                    <FaUser /> Hồ sơ cá nhân
                  </button>
                  <button className="dropdown-item" onClick={() => { toggleRole(); setShowUserMenu(false); }}>
                    <FaChartLine /> Chuyển sang người vay
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="dashboard-content">
          {/* Hero Background Section */}
          <div className="hero-background">
            <div className="background-placeholder">
              <p>🖼️ Thêm ảnh background ở đây</p>
              <span className="bg-hint">Kích thước đề xuất: 1920x400px (Phong cảnh, thành phố)</span>
            </div>
          </div>

          {/* Account Card Overlap */}
          <div className="account-card-overlap">
            <div className="account-card">
              <div className="account-header">
                <span className="account-label">Ví GreenFund</span>
              </div>
              <div className="account-balance">
                <span className="balance-label">Số dư khả dụng</span>
                <div className="balance-amount">
                  <span className="balance-value">15,000,000 VND</span>
                </div>
              </div>

              {/* Service Buttons inside card */}
              <div className="service-buttons">
                <button 
                  className="service-btn deposit-btn"
                  onClick={() => navigate('/deposit', { state: { userRole: 'lender' } })}
                >
                  <FaWallet className="service-icon" />
                  <span>Nạp tiền</span>
                </button>
                <button 
                  className="service-btn"
                  onClick={() => navigate('/loan-list', { state: { userRole: 'lender' } })}
                >
                  <FaHandHoldingUsd className="service-icon" />
                  <span>Cho vay</span>
                </button>
                <button 
                  className="service-btn"
                  onClick={() => navigate('/investment-portfolio', { state: { userRole: 'lender' } })}
                >
                  <FaChartLine className="service-icon" />
                  <span>Đầu tư</span>
                </button>
                <button 
                  className="service-btn"
                  onClick={() => navigate('/transaction-history', { state: { userRole: 'lender' } })}
                >
                  <FaHistory className="service-icon" />
                  <span>Lịch sử</span>
                </button>
              </div>
            </div>
          </div>

          {/* News Section */}
          <div className="news-section">
            <div className="news-header">
              <h2>
                <FaNewspaper className="news-icon" />
                Tin tức & Khuyến mãi
              </h2>
            </div>
            
            <div className="news-grid">
              <div className="news-card featured">
                <div className="news-image-placeholder">
                  <span>🖼️ Thêm ảnh banner chính</span>
                </div>
                <div className="news-content">
                  <span className="news-badge featured-badge">Nổi bật</span>
                  <h3>Chương trình khuyến mãi lãi suất ưu đãi</h3>
                  <p>Nhận ngay lãi suất ưu đãi 0.5%/tháng cho các khoản vay dưới 50 triệu đồng. Áp dụng cho khách hàng mới.</p>
                  <div className="news-meta">
                    <span className="news-date">🕒 10/10/2025</span>
                  </div>
                </div>
              </div>

              <div className="news-card">
                <div className="news-image-placeholder small">
                  <span>🖼️ Ảnh</span>
                </div>
                <div className="news-content">
                  <span className="news-badge">Tin tức</span>
                  <h3>Green Fund đạt mốc 10,000 người dùng</h3>
                  <p>Cảm ơn sự tin tưởng của quý khách hàng đã đồng hành cùng Green Fund...</p>
                  <div className="news-meta">
                    <span className="news-date">🕒 08/10/2025</span>
                  </div>
                </div>
              </div>

              <div className="news-card">
                <div className="news-image-placeholder small">
                  <span>🖼️ Ảnh</span>
                </div>
                <div className="news-content">
                  <span className="news-badge">Hướng dẫn</span>
                  <h3>Cách tạo khoản vay hiệu quả</h3>
                  <p>Hướng dẫn chi tiết cách tạo hồ sơ vay vốn để tăng cơ hội được duyệt...</p>
                  <div className="news-meta">
                    <span className="news-date">🕒 05/10/2025</span>
                  </div>
                </div>
              </div>

              <div className="news-card">
                <div className="news-image-placeholder small">
                  <span>🖼️ Ảnh</span>
                </div>
                <div className="news-content">
                  <span className="news-badge">Cập nhật</span>
                  <h3>Tính năng mới: Đầu tư tự động</h3>
                  <p>Ra mắt tính năng đầu tư tự động giúp tối ưu hóa lợi nhuận của bạn...</p>
                  <div className="news-meta">
                    <span className="news-date">🕒 01/10/2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <BottomNav userRole="lender" />
      </div>
    );
  }
};

export default Dashboard;