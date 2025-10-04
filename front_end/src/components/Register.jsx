import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import './Register.css';

const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const navigate = useNavigate();
  const password = watch('password');

  const onSubmit = (data) => {
    // TODO: Implement actual registration logic
    console.log('Registration data:', data);
    // Redirect to verification page after successful registration
    navigate('/verification');
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
        
        <h2>Đăng ký</h2>
        <p>Tạo tài khoản mới để bắt đầu</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Họ và tên"
              {...register('fullName', { 
                required: 'Vui lòng nhập họ và tên',
                minLength: {
                  value: 2,
                  message: 'Họ và tên phải có ít nhất 2 ký tự'
                },
                maxLength: {
                  value: 50,
                  message: 'Họ và tên quá dài'
                }
              })}
            />
            {errors.fullName && <span className="error">{errors.fullName.message}</span>}
          </div>
          
          <div className="input-group">
            <input
              type="tel"
              placeholder="Số điện thoại"
              {...register('phoneNumber', { 
                required: 'Vui lòng nhập số điện thoại',
                pattern: {
                  value: /^[\+]?[0-9\s\-\(\)]{10,15}$/,
                  message: 'Số điện thoại không hợp lệ'
                }
              })}
            />
            {errors.phoneNumber && <span className="error">{errors.phoneNumber.message}</span>}
          </div>
          
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
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Mật khẩu"
              {...register('password', { 
                required: 'Vui lòng nhập mật khẩu',
                minLength: {
                  value: 6,
                  message: 'Mật khẩu phải có ít nhất 6 ký tự'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'
                }
              })}
            />
            {errors.password && <span className="error">{errors.password.message}</span>}
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              {...register('confirmPassword', { 
                required: 'Vui lòng xác nhận mật khẩu',
                validate: (value) => value === password || 'Mật khẩu xác nhận không khớp'
              })}
            />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
          </div>
          
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                {...register('agreed', { 
                  required: 'Bạn phải đồng ý với Điều khoản & Chính sách bảo mật' 
                })}
              />
              <span>Tôi đồng ý với <Link to="/terms">Điều khoản</Link> & <Link to="/privacy">Chính sách bảo mật</Link></span>
            </label>
          </div>
          {errors.agreed && <span className="error">{errors.agreed.message}</span>}
          
          <button type="submit" className="btn-primary">Đăng ký</button>
        </form>
        
        <div className="auth-links">
          <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;