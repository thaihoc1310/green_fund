import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import logo from '../assets/logo.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo" onClick={() => navigate('/')}>
            <img src={logo} alt="Green Fund Logo" />
            <span>Green Fund</span>
          </div>
          <ul className="nav-menu">
            <li><a onClick={() => scrollToSection('home')}>Trang chủ</a></li>
            <li><a onClick={() => scrollToSection('features')}>Tính năng</a></li>
            <li><a onClick={() => scrollToSection('how-it-works')}>Cách hoạt động</a></li>
            <li><a onClick={() => scrollToSection('about')}>Về chúng tôi</a></li>
          </ul>
          <div className="nav-buttons">
            <button className="btn-login" onClick={() => navigate('/login')}>
              Đăng nhập
            </button>
            <button className="btn-register" onClick={() => navigate('/register')}>
              Đăng ký
            </button>
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
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Tại sao chọn Green Fund?</h2>
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

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Cách hoạt động</h2>
            <p>Bắt đầu đầu tư chỉ với 3 bước đơn giản</p>
          </div>
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
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-container">
          <div className="about-content">
            <div className="about-text">
              <h2>Về Green Fund</h2>
              <p>
                Green Fund là nền tảng cho vay và đầu tư xanh tiên phong tại Việt Nam, 
                kết nối nhà đầu tư với các dự án năng lượng tái tạo, nông nghiệp bền vững, 
                và các giải pháp thân thiện với môi trường.
              </p>
              <p>
                Chúng tôi tin rằng đầu tư không chỉ là tạo ra lợi nhuận, mà còn là góp phần 
                xây dựng một tương lai xanh và bền vững cho thế hệ mai sau.
              </p>
              <ul className="about-highlights">
                <li>✓ Được cấp phép và giám sát bởi Ngân hàng Nhà nước</li>
                <li>✓ Đối tác với hơn 100+ tổ chức tài chính uy tín</li>
                <li>✓ Đã tài trợ thành công 500+ dự án xanh</li>
                <li>✓ Cộng đồng 10,000+ nhà đầu tư tin tưởng</li>
              </ul>
            </div>
            <div className="about-image">
              <div className="about-card">
                <div className="about-card-icon">🏆</div>
                <h4>Giải thưởng xuất sắc</h4>
                <p>Top 10 Fintech Việt Nam 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Sẵn sàng bắt đầu hành trình đầu tư xanh?</h2>
          <p>Tham gia cùng hàng ngàn nhà đầu tư thông minh đã tin tưởng Green Fund</p>
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
              <img src={logo} alt="Green Fund Logo" />
              <span>Green Fund</span>
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
          <p>&copy; 2024 Green Fund. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
