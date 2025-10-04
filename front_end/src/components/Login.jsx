import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import './Login.css';

const Login = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');

  const onSubmit = (data) => {
    // Simulate login error for demonstration
    if (data.emailPhone === 'error@example.com' && data.password === 'password') {
      setError('emailPhone', { 
        type: 'manual', 
        message: 'Tài khoản này đã bị khóa. Vui lòng liên hệ hỗ trợ.' 
      });
      setLoginError('Tài khoản này đã bị khóa. Vui lòng liên hệ hỗ trợ.');
      return;
    }
    
    // TODO: Implement actual login logic
    console.log('Login data:', data);
    // Redirect to dashboard after successful login
    navigate('/dashboard');
  };

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
        
        <h2>Đăng nhập</h2>
        <p>Vui lòng đăng nhập để tiếp tục</p>
        
        {loginError && (
          <div className="error-message">
            {loginError}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Email hoặc Số điện thoại"
              {...register('emailPhone', { 
                required: 'Vui lòng nhập email hoặc số điện thoại',
                minLength: {
                  value: 3,
                  message: 'Thông tin không hợp lệ'
                }
              })}
            />
            {errors.emailPhone && <span className="error">{errors.emailPhone.message}</span>}
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Mật khẩu"
              {...register('password', { 
                required: 'Vui lòng nhập mật khẩu',
                minLength: {
                  value: 6,
                  message: 'Mật khẩu phải có ít nhất 6 ký tự'
                }
              })}
            />
            {errors.password && <span className="error">{errors.password.message}</span>}
          </div>
          
          <button type="submit" className="btn-primary">Đăng nhập</button>
        </form>
        
        <div className="auth-links">
          <Link to="/forgot-password">Quên mật khẩu?</Link>
          <div className="divider">HOẶC</div>
          <Link to="/register">Tạo tài khoản mới</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;