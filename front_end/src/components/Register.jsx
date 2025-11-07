import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import './Register.css';

const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const navigate = useNavigate();
  const password = watch('password');
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { signUp } = useAuth();

  const onSubmit = async (data) => {
    setLoading(true);
    setRegisterError('');
    setSuccessMessage('');

    try {
      // Đăng ký với Supabase
      const { data: authData, error } = await signUp(
        data.email,
        data.password,
        data.fullName,
        data.phoneNumber
      );

      if (error) {
        // Xử lý các lỗi cụ thể
        if (error.message.includes('User already registered')) {
          setRegisterError('Email này đã được đăng ký');
        } else if (error.message.includes('already exists')) {
          setRegisterError('Email này đã được đăng ký');
        } else {
          setRegisterError(error.message || 'Đã xảy ra lỗi khi đăng ký');
        }
        setLoading(false);
        return;
      }

      if (authData?.user) {
        // Đăng ký thành công
        setSuccessMessage('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.');
        
        // Chuyển đến trang đăng nhập sau 2 giây
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setRegisterError('Đã xảy ra lỗi không mong muốn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header with Logo and Title */}
        <div className="auth-header">
          <div className="logo-small">
            <img src="/logo.png" alt="GreenFund Logo" className="logo" onError={(e) => {
              e.target.style.display = 'none';
              const parent = e.target.parentElement;
              if (parent) {
                parent.innerHTML = '<div className="logo-text-small">GF</div>';
              }
            }} />
          </div>
          <span className="brand-name">GreenFund</span>
          <h2>Đăng ký</h2>
        </div>
        
        <p className="welcome-text">Chào mừng Quý khách đến với GreenFund</p>
        
        {registerError && (
          <div className="error-message">
            {registerError}
          </div>
        )}
        
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
                disabled={loading}
              />
              <span>Tôi đồng ý với <Link to="/terms">Điều khoản</Link> & <Link to="/privacy">Chính sách bảo mật</Link></span>
            </label>
          </div>
          {errors.agreed && <span className="error">{errors.agreed.message}</span>}
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;