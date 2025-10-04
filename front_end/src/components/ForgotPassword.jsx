import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (data) => {
    // TODO: Implement password reset logic
    console.log('Password reset requested for:', data.email);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          {/* Logo placeholder - ThaiHoc will replace with actual logo */}
          <div className="logo-placeholder">
            <img src="/src/assets/logo.png" alt="Logo" className="logo" onError={(e) => {
              e.target.style.display = 'none';
              const parent = e.target.parentElement;
              if (parent) {
                parent.innerHTML = '<div className="logo-text">Your Logo</div>';
              }
            }} />
          </div>
          
          <h2>Khôi phục mật khẩu</h2>
          <div className="success-message">
            <p>Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn!</p>
            <p>Vui lòng kiểm tra email và làm theo hướng dẫn.</p>
          </div>
          <button 
            className="btn-primary" 
            onClick={() => {
              navigate('/login');
              reset();
            }}
          >
            Quay về đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo placeholder - ThaiHoc will replace with actual logo */}
        <div className="logo-placeholder">
          <img src="/src/assets/logo.png" alt="Logo" className="logo" onError={(e) => {
            e.target.style.display = 'none';
            const parent = e.target.parentElement;
            if (parent) {
              parent.innerHTML = '<div className="logo-text">Your Logo</div>';
            }
          }} />
        </div>
        
        <h2>Quên mật khẩu</h2>
        <p>Nhập email để nhận link đặt lại mật khẩu</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              {...register('email', { 
                required: 'Vui lòng nhập email',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email không hợp lệ'
                }
              })}
            />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>
          <button type="submit" className="btn-primary">Gửi yêu cầu</button>
        </form>
        
        <div className="auth-links">
          <Link to="/login">Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;