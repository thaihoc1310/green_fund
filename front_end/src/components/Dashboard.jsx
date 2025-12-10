import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaLeaf, FaUser, FaWallet, FaHistory, FaNewspaper, FaChartLine, FaHandHoldingUsd, FaSearch, FaTimes } from 'react-icons/fa';
import { BiMoney } from 'react-icons/bi';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import backgroundDb from '../assets/background_db.jpg';
import logo from '../assets/logo.png';
import newsInterestRate from '../assets/Ảnh chương trình lãi suất (trang chủ).png';
import newsFinancial from '../assets/Bản tin Tài chính hôm nay (trang chủ).jpg';
import newsAutoInvest from '../assets/Đầu tư tự động (trang chủ).jpg';
import ChatBot from './ChatBot';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user, getUserRole } = useAuth();
  const [userRole, setUserRole] = useState('lender'); // 'borrower' or 'lender' - Mặc định là nhà đầu tư
  const [depositAmount, setDepositAmount] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const [userProfile, setUserProfile] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  // Check if user is admin and redirect immediately
  useEffect(() => {
    const checkAdminAndRedirect = async () => {
      if (!user) return;

      try {
        const { role, error } = await getUserRole();
        
        if (error) {
          console.error('Error checking user role:', error);
          return;
        }

        // If admin, redirect to admin dashboard immediately
        if (role === 'admin') {
          navigate('/admin-dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Error in admin check:', error);
      }
    };

    checkAdminAndRedirect();
  }, [user, getUserRole, navigate]);

  // Load user profile và wallet balance
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Load user profile
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setUserProfile(profileData);

        // Load wallet balance
        const { data: walletData, error: walletError } = await supabase
          .from('wallets')
          .select('balance')
          .eq('user_id', user.id)
          .single();

        if (walletError) throw walletError;
        setWalletBalance(walletData?.balance || 0);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

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
      // Close search results when clicking outside
      if (showSearchResults && !event.target.closest('.search-container') && !event.target.closest('.search-overlay-mobile')) {
        setShowSearchResults(false);
        setSelectedResultIndex(-1);
      }
      // Close search overlay when clicking outside
      if (isSearchExpanded && !event.target.closest('.search-overlay-mobile') && !event.target.closest('.search-icon-mobile')) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu, isSearchExpanded, showSearchResults]);

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

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Logout error:', error);
        alert('Đã xảy ra lỗi khi đăng xuất');
        return;
      }
      // Đăng xuất thành công, chuyển về trang đăng nhập
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Unexpected logout error:', error);
      alert('Đã xảy ra lỗi không mong muốn');
    }
  };

  const toggleRole = () => {
    setUserRole(userRole === 'borrower' ? 'lender' : 'borrower');
  };

  // Search routes configuration
  const searchRoutes = [
    {
      title: 'Gọi vốn',
      description: 'Tạo yêu cầu gọi vốn cho dự án xanh',
      path: '/create-loan',
      icon: BiMoney,
      keywords: ['goi von', 'tao du an', 'yeu cau von', 'vay', 'tao loan', 'create'],
      role: 'borrower'
    },
    {
      title: 'Dự án của tôi',
      description: 'Quản lý các dự án gọi vốn',
      path: '/loan-management',
      icon: FaChartLine,
      keywords: ['du an', 'quan ly du an', 'loan management', 'project'],
      role: 'borrower'
    },
    {
      title: 'Gói dự án',
      description: 'Xem danh sách các dự án cần đầu tư',
      path: '/loan-list',
      icon: FaHandHoldingUsd,
      keywords: ['goi du an', 'cho vay', 'du an dau tu', 'loan list', 'invest'],
      role: 'lender'
    },
    {
      title: 'Danh mục đầu tư',
      description: 'Xem các khoản đầu tư của bạn',
      path: '/investment-portfolio',
      icon: FaChartLine,
      keywords: ['dau tu', 'danh muc', 'portfolio', 'investment'],
      role: 'lender'
    },
    {
      title: 'Thông tin cá nhân',
      description: 'Xem và chỉnh sửa hồ sơ cá nhân',
      path: '/profile',
      icon: FaUser,
      keywords: ['ca nhan', 'ho so', 'profile', 'thong tin', 'account'],
      role: 'both'
    },
    {
      title: 'Nạp tiền',
      description: 'Nạp tiền vào ví GreenFund',
      path: '/deposit',
      icon: FaWallet,
      keywords: ['nap tien', 'wallet', 'vi', 'deposit', 'balance'],
      role: 'both'
    },
    {
      title: 'Lịch sử giao dịch',
      description: 'Xem lịch sử các giao dịch',
      path: '/transaction-history',
      icon: FaHistory,
      keywords: ['lich su', 'giao dich', 'transaction', 'history'],
      role: 'both'
    }
  ];

  // Filter search results based on query and user role
  const getFilteredResults = () => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove Vietnamese accents
      .replace(/đ/g, 'd');
    
    return searchRoutes.filter(route => {
      // Filter by role
      if (route.role !== 'both' && route.role !== userRole) return false;
      
      // Check if query matches title, description, or keywords
      const titleMatch = route.title.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .includes(query);
      
      const descMatch = route.description.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .includes(query);
      
      const keywordMatch = route.keywords.some(keyword => 
        keyword.includes(query) || query.includes(keyword)
      );
      
      return titleMatch || descMatch || keywordMatch;
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchResults(value.trim().length > 0);
    setSelectedResultIndex(-1);
  };

  // Handle search result selection
  const handleSearchSelect = (route) => {
    navigate(route.path, { state: { userRole } });
    setSearchQuery('');
    setShowSearchResults(false);
    setSelectedResultIndex(-1);
    setIsSearchExpanded(false);
  };

  // Handle keyboard navigation
  const handleSearchKeyDown = (e) => {
    const results = getFilteredResults();
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedResultIndex(prev => 
        prev < results.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedResultIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedResultIndex >= 0 && results[selectedResultIndex]) {
        handleSearchSelect(results[selectedResultIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSearchResults(false);
      setSearchQuery('');
      setSelectedResultIndex(-1);
      setIsSearchExpanded(false);
    }
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
            {/* Mobile Search Icon */}
            <button className="search-icon-mobile" onClick={() => setIsSearchExpanded(true)}>
              <FaSearch />
            </button>
          </div>
          
          <div className="header-center">
            <div className="search-container">
              <FaSearch className="search-icon-left" />
              <input 
                type="text" 
                placeholder="Tìm kiếm: Gọi vốn, Dự án, Đầu tư..." 
                className="search-input"
                value={searchQuery || ''}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
              />
              {showSearchResults && getFilteredResults().length > 0 && (
                <div className="search-results-dropdown">
                  {getFilteredResults().map((result, index) => {
                    const Icon = result.icon;
                    return (
                      <button
                        key={result.path}
                        className={`search-result-item ${selectedResultIndex === index ? 'selected' : ''}`}
                        onClick={() => handleSearchSelect(result)}
                        onMouseEnter={() => setSelectedResultIndex(index)}
                      >
                        <Icon className="result-icon" />
                        <div className="result-content">
                          <div className="result-title">{result.title}</div>
                          <div className="result-description">{result.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          
          <div className="header-right">
            <div className="user-menu-container">
              <div className="user-menu-trigger" onClick={() => setShowUserMenu(!showUserMenu)}>
                <div className="user-avatar-small">
                  {userProfile?.avatar_url ? (
                    <img src={userProfile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  ) : (
                    <FaUser />
                  )}
                </div>
                <span className="user-name">{userProfile?.full_name || 'Người dùng'}</span>
                </div>
              
              {showUserMenu && (
                <div className="user-dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      {userProfile?.avatar_url ? (
                        <img src={userProfile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                      ) : (
                        <FaUser />
                      )}
                    </div>
                    <div className="dropdown-info">
                      <p className="dropdown-name">{userProfile?.full_name || 'Người dùng'}</p>
                      <p className="dropdown-role">{userRole === 'lender' ? 'Nhà đầu tư' : 'Người vay vốn'}</p>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => { navigate('/profile', { state: { userRole } }); setShowUserMenu(false); }}>
                    <FaUser /> Hồ sơ cá nhân
                  </button>
                  <button className="dropdown-item" onClick={() => { toggleRole(); setShowUserMenu(false); }}>
                    <FaChartLine /> {userRole === 'lender' ? 'Chuyển sang người gọi vốn' : 'Chuyển sang nhà đầu tư'}
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search Overlay */}
          <div className={`search-overlay-mobile ${isSearchExpanded ? 'active' : ''}`}>
            <div className="search-mobile-header">
              <FaSearch className="search-icon-left" />
              <input 
                type="text" 
                placeholder="Tìm kiếm: Gọi vốn, Dự án, Đầu tư..." 
                className="search-input"
                value={searchQuery || ''}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                autoFocus
              />
              <button className="close-search" onClick={() => {
                setIsSearchExpanded(false);
                setSearchQuery('');
                setShowSearchResults(false);
              }}>
                <FaTimes />
              </button>
            </div>
            {showSearchResults && getFilteredResults().length > 0 && (
              <div className="search-results-mobile">
                {getFilteredResults().map((result, index) => {
                  const Icon = result.icon;
                  return (
                    <button
                      key={result.path}
                      className={`search-result-item ${selectedResultIndex === index ? 'selected' : ''}`}
                      onClick={() => handleSearchSelect(result)}
                      onMouseEnter={() => setSelectedResultIndex(index)}
                    >
                      <Icon className="result-icon" />
                      <div className="result-content">
                        <div className="result-title">{result.title}</div>
                        <div className="result-description">{result.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
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
                <span className="account-role">Người gọi vốn</span>
              </div>
              <div className="account-balance">
                <span className="balance-label">Số dư khả dụng</span>
                <div className="balance-amount">
                  <span className="balance-value">
                    {loading ? '...' : new Intl.NumberFormat('vi-VN').format(walletBalance)} <span className="currency">VND</span>
                  </span>
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
                  <span>Gọi vốn</span>
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
            {/* Mobile Search Icon */}
            <button className="search-icon-mobile" onClick={() => setIsSearchExpanded(true)}>
              <FaSearch />
            </button>
          </div>
          
          <div className="header-center">
            <div className="search-container">
              <FaSearch className="search-icon-left" />
              <input 
                type="text" 
                placeholder="Tìm kiếm: Gọi vốn, Dự án, Đầu tư..." 
                className="search-input"
                value={searchQuery || ''}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
              />
              {showSearchResults && getFilteredResults().length > 0 && (
                <div className="search-results-dropdown">
                  {getFilteredResults().map((result, index) => {
                    const Icon = result.icon;
                    return (
                      <button
                        key={result.path}
                        className={`search-result-item ${selectedResultIndex === index ? 'selected' : ''}`}
                        onClick={() => handleSearchSelect(result)}
                        onMouseEnter={() => setSelectedResultIndex(index)}
                      >
                        <Icon className="result-icon" />
                        <div className="result-content">
                          <div className="result-title">{result.title}</div>
                          <div className="result-description">{result.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          
          <div className="header-right">
            <div className="user-menu-container">
              <div className="user-menu-trigger" onClick={() => setShowUserMenu(!showUserMenu)}>
                <div className="user-avatar-small">
                  {userProfile?.avatar_url ? (
                    <img src={userProfile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  ) : (
                    <FaUser />
                  )}
                </div>
                <span className="user-name">{userProfile?.full_name || 'Người dùng'}</span>
                </div>
              
              {showUserMenu && (
                <div className="user-dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      {userProfile?.avatar_url ? (
                        <img src={userProfile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                      ) : (
                        <FaUser />
                      )}
                    </div>
                    <div className="dropdown-info">
                      <p className="dropdown-name">{userProfile?.full_name || 'Người dùng'}</p>
                      <p className="dropdown-role">{userRole === 'lender' ? 'Nhà đầu tư' : 'Người vay vốn'}</p>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => { navigate('/profile', { state: { userRole } }); setShowUserMenu(false); }}>
                    <FaUser /> Hồ sơ cá nhân
                  </button>
                  <button className="dropdown-item" onClick={() => { toggleRole(); setShowUserMenu(false); }}>
                    <FaChartLine /> {userRole === 'lender' ? 'Chuyển sang người gọi vốn' : 'Chuyển sang nhà đầu tư'}
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search Overlay */}
          <div className={`search-overlay-mobile ${isSearchExpanded ? 'active' : ''}`}>
            <div className="search-mobile-header">
              <FaSearch className="search-icon-left" />
              <input 
                type="text" 
                placeholder="Tìm kiếm: Gọi vốn, Dự án, Đầu tư..." 
                className="search-input"
                value={searchQuery || ''}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                autoFocus
              />
              <button className="close-search" onClick={() => {
                setIsSearchExpanded(false);
                setSearchQuery('');
                setShowSearchResults(false);
              }}>
                <FaTimes />
              </button>
            </div>
            {showSearchResults && getFilteredResults().length > 0 && (
              <div className="search-results-mobile">
                {getFilteredResults().map((result, index) => {
                  const Icon = result.icon;
                  return (
                    <button
                      key={result.path}
                      className={`search-result-item ${selectedResultIndex === index ? 'selected' : ''}`}
                      onClick={() => handleSearchSelect(result)}
                      onMouseEnter={() => setSelectedResultIndex(index)}
                    >
                      <Icon className="result-icon" />
                      <div className="result-content">
                        <div className="result-title">{result.title}</div>
                        <div className="result-description">{result.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
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
                <span className="account-role">Nhà đầu tư</span>
              </div>
              <div className="account-balance">
                <span className="balance-label">Số dư khả dụng</span>
                <div className="balance-amount">
                  <span className="balance-value">
                    {loading ? '...' : new Intl.NumberFormat('vi-VN').format(walletBalance)} <span className="currency">VND</span>
                  </span>
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
                  <span>Gói dự án</span>
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

        {/* ChatBot - Only for Lender */}
        <ChatBot />
      </div>
    );
  }
};

export default Dashboard;