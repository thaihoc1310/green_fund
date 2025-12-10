import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LandingPage.css';
import logo from '../assets/logo.png';
import backgroundHp2 from '../assets/background_hp2.jpg';
import projectImage1 from '../assets/Ảnh dự án nông nghiệp xanh(1).jpg';
import projectImage2 from '../assets/Ảnh dự án nông nghiệp xanh.jpg';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, getUserRole } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('investor'); // 'investor' or 'borrower'
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateToDashboard = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setNavigating(true);
      const { role, error } = await getUserRole();
      
      if (error) {
        console.error('Error getting user role:', error);
        // Fallback to dashboard if error
        navigate('/dashboard');
        return;
      }

      // Navigate based on role
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error navigating:', error);
      navigate('/dashboard');
    } finally {
      setNavigating(false);
    }
  };

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo" onClick={() => navigate('/')}>
            <img src={logo} alt="GreenFund Logo" />
            <span>GreenFund</span>
          </div>
          <ul className="nav-menu">
            <li><a onClick={() => scrollToSection('home')}>Trang chủ</a></li>
            <li><a onClick={() => scrollToSection('features')}>Tính năng</a></li>
            <li><a onClick={() => scrollToSection('how-it-works')}>Cách hoạt động</a></li>
            <li><a onClick={() => scrollToSection('about')}>Về chúng tôi</a></li>
          </ul>
          <div className="nav-buttons">
            {user ? (
              <button 
                className="btn-login" 
                onClick={handleNavigateToDashboard}
                disabled={navigating}
              >
                {navigating ? 'Đang chuyển...' : 'Vào trang chủ'}
              </button>
            ) : (
              <>
                <button className="btn-login" onClick={() => navigate('/login')}>
                  Đăng nhập
                </button>
                <button className="btn-register" onClick={() => navigate('/register')}>
                  Đăng ký
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Đầu tư tương lai,
              <span className="gradient-text"> Xanh hóa </span>
              cuộc sống
            </h1>
            <p className="hero-description">
              Nền tảng cho vay và đầu tư xanh hàng đầu Việt Nam. 
              Kết nối nhà đầu tư với các dự án bền vững, 
              mang lại lợi nhuận hấp dẫn và ý nghĩa cho tương lai.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => navigate('/register')}>
                Bắt đầu ngay
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="btn-secondary" onClick={() => scrollToSection('how-it-works')}>
                Tìm hiểu thêm
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <h3>10,000+</h3>
                <p>Nhà đầu tư</p>
              </div>
              <div className="stat-item">
                <h3>500+</h3>
                <p>Dự án xanh</p>
              </div>
              <div className="stat-item">
                <h3>12%</h3>
                <p>Lợi nhuận trung bình</p>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-card card-1">
              <div className="card-icon">🌱</div>
              <h4>Năng lượng tái tạo</h4>
              <p className="card-growth">+15.5%</p>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">💰</div>
              <h4>Đầu tư an toàn</h4>
              <p className="card-growth">Được bảo hiểm</p>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">📈</div>
              <h4>Lợi nhuận ổn định</h4>
              <p className="card-growth">8-15% / năm</p>
            </div>
            <div className="floating-card card-4">
              <div className="card-icon">🌿</div>
              <h4>Bảo vệ môi trường</h4>
              <p className="card-growth">Tương lai xanh</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Tại sao chọn GreenFund?</h2>
            <p>Nền tảng đầu tư xanh toàn diện với nhiều tính năng vượt trội</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>An toàn & Bảo mật</h3>
              <p>Hệ thống bảo mật đa lớp, mã hóa dữ liệu theo tiêu chuẩn quốc tế</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💹</div>
              <h3>Lợi nhuận hấp dẫn</h3>
              <p>Lãi suất cạnh tranh từ 8-15% mỗi năm, được giải ngân đúng hạn</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Đầu tư có ý nghĩa</h3>
              <p>Góp phần bảo vệ môi trường qua các dự án xanh bền vững</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Dễ dàng sử dụng</h3>
              <p>Giao diện thân thiện, đầu tư chỉ với vài thao tác đơn giản</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Thanh khoản linh hoạt</h3>
              <p>Rút tiền nhanh chóng, chuyển nhượng khoản đầu tư dễ dàng</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Minh bạch 100%</h3>
              <p>Báo cáo chi tiết, theo dõi đầu tư real-time mọi lúc mọi nơi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Agricultural Projects Showcase Section */}
      <section className="agricultural-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Dự án Nông nghiệp Xanh</h2>
            <p>Kết nối đầu tư với các dự án nông nghiệp bền vững, công nghệ cao</p>
          </div>
          
          <div className="agricultural-content">
            <div className="agricultural-main-image">
              <img src={projectImage1} alt="Công nhân tại nhà máy trồng rau" />
              <div className="agricultural-overlay">
                <h3>Nhà máy trồng rau thủy canh hiện đại</h3>
                <p>Ứng dụng công nghệ IoT và AI trong sản xuất rau sạch, mang lại hiệu quả cao và bền vững cho môi trường</p>
                <div className="agricultural-stats">
                  <div className="stat-box">
                    <span className="stat-number">500+</span>
                    <span className="stat-label">Tấn rau/năm</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-number">90%</span>
                    <span className="stat-label">Tiết kiệm nước</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-number">0</span>
                    <span className="stat-label">Thuốc trừ sâu</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="agricultural-grid">
              <div className="agricultural-card">
                <div className="card-image-container">
                  <img src={projectImage2} alt="Các hoạt động nông nghiệp xanh" />
                </div>
                <div className="card-content">
                  <h4>🌾 Canh tác hữu cơ đa dạng</h4>
                  <p>Mô hình canh tác đa dạng sinh học, kết hợp trồng trọt và chăn nuôi bền vững</p>
                  <div className="card-footer">
                    <span className="interest-rate">Lợi nhuận: 12-14%/năm</span>
                    <button className="btn-learn-more" onClick={() => navigate('/loan-list')}>
                      Tìm hiểu →
                    </button>
                  </div>
                </div>
              </div>

              <div className="agricultural-info">
                <div className="info-item">
                  <div className="info-icon">🎯</div>
                  <div className="info-content">
                    <h5>Mục tiêu phát triển</h5>
                    <p>Xây dựng chuỗi cung ứng nông sản sạch, từ trang trại đến bàn ăn, đảm bảo chất lượng và an toàn thực phẩm</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-icon">💡</div>
                  <div className="info-content">
                    <h5>Công nghệ ứng dụng</h5>
                    <p>IoT, AI giám sát tự động, hệ thống tưới tiêu thông minh, quản lý dinh dưỡng tối ưu</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-icon">🌍</div>
                  <div className="info-content">
                    <h5>Tác động môi trường</h5>
                    <p>Giảm 60% phát thải CO₂, tái sử dụng 95% nước, không sử dụng hóa chất độc hại</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Cách hoạt động</h2>
            <p>Dành cho cả nhà đầu tư và người gọi vốn</p>
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            <button 
              className={`tab-button ${activeTab === 'investor' ? 'active' : ''}`}
              onClick={() => setActiveTab('investor')}
            >
              <span className="tab-icon">💰</span>
              Dành cho Nhà đầu tư
            </button>
            <button 
              className={`tab-button ${activeTab === 'borrower' ? 'active' : ''}`}
              onClick={() => setActiveTab('borrower')}
            >
              <span className="tab-icon">🏢</span>
              Dành cho Người gọi vốn
            </button>
          </div>

          {/* Investor Steps */}
          {activeTab === 'investor' && (
            <div className="steps-container">
              <div className="step-item">
                <div className="step-number">01</div>
                <div className="step-content">
                  <h3>Đăng ký tài khoản</h3>
                  <p>Tạo tài khoản miễn phí chỉ trong vài phút với thông tin cơ bản</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">02</div>
                <div className="step-content">
                  <h3>Nạp tiền & Chọn dự án</h3>
                  <p>Nạp tiền vào ví và khám phá các dự án xanh phù hợp với bạn</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">03</div>
                <div className="step-content">
                  <h3>Nhận lợi nhuận</h3>
                  <p>Theo dõi đầu tư và nhận lãi định kỳ vào tài khoản của bạn</p>
                </div>
              </div>
            </div>
          )}

          {/* Borrower Steps */}
          {activeTab === 'borrower' && (
            <div className="steps-container">
              <div className="step-item">
                <div className="step-number">01</div>
                <div className="step-content">
                  <h3>Đăng ký & Xác thực</h3>
                  <p>Tạo tài khoản và hoàn tất xác thực thông tin doanh nghiệp/cá nhân</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">02</div>
                <div className="step-content">
                  <h3>Tạo khoản vay</h3>
                  <p>Mô tả dự án xanh của bạn, số tiền cần vay và mục đích sử dụng</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">03</div>
                <div className="step-content">
                  <h3>Nhận vốn & Hoàn trả</h3>
                  <p>Sau khi được phê duyệt, nhận vốn và trả nợ theo lịch trình đã cam kết</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-container">
          <div className="about-content">
            <div className="about-text">
              <h2>Về GreenFund</h2>
              <p>
                GreenFund là nền tảng cho vay và đầu tư xanh tiên phong tại Việt Nam, 
                kết nối nhà đầu tư với các dự án năng lượng tái tạo, nông nghiệp bền vững, 
                và các giải pháp thân thiện với môi trường.
              </p>
              <p>
                Chúng tôi tin rằng đầu tư không chỉ là tạo ra lợi nhuận, mà còn là góp phần 
                xây dựng một tương lai xanh và bền vững cho thế hệ mai sau.
              </p>
            </div>
            <div className="about-image">
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Sẵn sàng bắt đầu hành trình đầu tư xanh?</h2>
          <p>Tham gia cùng hàng ngàn nhà đầu tư thông minh đã tin tưởng GreenFund</p>
          <button className="btn-cta" onClick={() => navigate('/register')}>
            Đăng ký miễn phí ngay
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <div className="footer-logo">
              <img src={logo} alt="GreenFund Logo" />
              <span>GreenFund</span>
            </div>
            <p>Nền tảng đầu tư xanh hàng đầu Việt Nam</p>
          </div>
          <div className="footer-section">
            <h4>Sản phẩm</h4>
            <ul>
              <li><a onClick={() => scrollToSection('features')}>Tính năng</a></li>
              <li><a onClick={() => navigate('/loan-list')}>Dự án đầu tư</a></li>
              <li><a onClick={() => navigate('/dashboard')}>Dashboard</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Công ty</h4>
            <ul>
              <li><a onClick={() => scrollToSection('about')}>Về chúng tôi</a></li>
              <li><a onClick={() => navigate('/terms')}>Điều khoản</a></li>
              <li><a onClick={() => navigate('/privacy')}>Bảo mật</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Liên hệ</h4>
            <ul>
              <li>Email: contact@greenfund.vn</li>
              <li>Hotline: 1900 xxxx</li>
              <li>Địa chỉ: Hà Nội, Việt Nam</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 GreenFund. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
