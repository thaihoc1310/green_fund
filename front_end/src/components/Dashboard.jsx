import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaLeaf, FaUser, FaWallet, FaHistory, FaNewspaper, FaChartLine, FaHandHoldingUsd } from 'react-icons/fa';
import { BiMoney } from 'react-icons/bi';
import backgroundDb from '../assets/background_db.jpg';
import logo from '../assets/logo.png';
import newsInterestRate from '../assets/Ảnh chương trình lãi suất (trang chủ).png';
import newsFinancial from '../assets/Bản tin Tài chính hôm nay (trang chủ).jpg';
import newsAutoInvest from '../assets/Đầu tư tự động (trang chủ).jpg';
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

  // Handle scroll for header animation
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.dashboard-header-new');
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            <div className="logo-container" onClick={() => navigate('/dashboard')}>
              <img src={logo} alt="GreenFund Logo" className="logo-image" />
              <span className="logo-text">GreenFund</span>
            </div>
          </div>
          
          <div className="header-center">
            <div className="search-container">
              <input type="text" placeholder="Tìm kiếm trong GreenFund" className="search-input" />
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
            <img src={backgroundDb} alt="GreenFund Background" />
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
                <img src={newsInterestRate} alt="Chương trình lãi suất ưu đãi" className="news-image" />
                <div className="news-content">
                  <span className="news-badge featured-badge">Nổi bật</span>
                  <h3>Chương trình lãi suất ưu đãi đặc biệt</h3>
                  <p>Nhận ngay lãi suất ưu đãi 0.5%/tháng cho các khoản vay dưới 50 triệu đồng. Chương trình áp dụng từ ngày 15/10 đến 30/11/2025 cho khách hàng mới đăng ký.</p>
                  <div className="news-meta">
                    <span className="news-date">🕒 15/10/2025</span>
                  </div>
                </div>
              </div>

              <div className="news-card">
                <img src={newsFinancial} alt="Bản tin tài chính" className="news-image small" />
                <div className="news-content">
                  <span className="news-badge">Tin tức</span>
                  <h3>Bản tin tài chính hôm nay</h3>
                  <p>Cập nhật thông tin thị trường tài chính, xu hướng đầu tư xanh và các cơ hội đầu tư hấp dẫn trong tuần này...</p>
                  <div className="news-meta">
                    <span className="news-date">🕒 17/10/2025</span>
                  </div>
                </div>
              </div>

              <div className="news-card">
                <img src={newsAutoInvest} alt="Đầu tư tự động" className="news-image small" />
                <div className="news-content">
                  <span className="news-badge">Tính năng mới</span>
                  <h3>Ra mắt tính năng đầu tư tự động</h3>
                  <p>Tối ưu hóa lợi nhuận với công nghệ AI, tự động phân bổ vốn vào các dự án phù hợp với hồ sơ rủi ro của bạn...</p>
                  <div className="news-meta">
                    <span className="news-date">🕒 12/10/2025</span>
                  </div>
                </div>
              </div>
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
        <header className="dashboard-header-new">
          <div className="header-left">
            <div className="logo-container" onClick={() => navigate('/')}>
              <img src={logo} alt="GreenFund Logo" className="logo-image" />
              <span className="logo-text">GreenFund</span>
            </div>
          </div>
          
          <div className="header-center">
            <div className="search-container">
              <input type="text" placeholder="Tìm kiếm trong GreenFund" className="search-input" />
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
            <img src={backgroundDb} alt="GreenFund Background" />
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
                <img src={newsInterestRate} alt="Chương trình lãi suất ưu đãi" className="news-image" />
                <div className="news-content">
                  <span className="news-badge featured-badge">Nổi bật</span>
                  <h3>Chương trình lãi suất ưu đãi đặc biệt</h3>
                  <p>Nhận ngay lãi suất ưu đãi 0.5%/tháng cho các khoản vay dưới 50 triệu đồng. Chương trình áp dụng từ ngày 15/10 đến 30/11/2025 cho khách hàng mới đăng ký.</p>
                  <div className="news-meta">
                    <span className="news-date">🕒 15/10/2025</span>
                  </div>
                </div>
              </div>

              <div className="news-card">
                <img src={newsFinancial} alt="Bản tin tài chính" className="news-image small" />
                <div className="news-content">
                  <span className="news-badge">Tin tức</span>
                  <h3>Bản tin tài chính hôm nay</h3>
                  <p>Cập nhật thông tin thị trường tài chính, xu hướng đầu tư xanh và các cơ hội đầu tư hấp dẫn trong tuần này...</p>
                  <div className="news-meta">
                    <span className="news-date">🕒 17/10/2025</span>
                  </div>
                </div>
              </div>

              <div className="news-card">
                <img src={newsAutoInvest} alt="Đầu tư tự động" className="news-image small" />
                <div className="news-content">
                  <span className="news-badge">Tính năng mới</span>
                  <h3>Ra mắt tính năng đầu tư tự động</h3>
                  <p>Tối ưu hóa lợi nhuận với công nghệ AI, tự động phân bổ vốn vào các dự án phù hợp với hồ sơ rủi ro của bạn...</p>
                  <div className="news-meta">
                    <span className="news-date">🕒 12/10/2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
};

export default Dashboard;