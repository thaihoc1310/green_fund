import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import './Login.css';

const Login = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const onSubmit = async (data) => {
    setLoading(true);
    setLoginError('');

    try {
      // Kiểm tra xem input là email hay số điện thoại
      const isEmail = data.emailPhone.includes('@');
      
      if (!isEmail) {
        setLoginError('Hiện tại chỉ hỗ trợ đăng nhập bằng email');
        setLoading(false);
        return;
      }

      // Đăng nhập với Supabase
      const { data: authData, error } = await signIn(data.emailPhone, data.password);

      if (error) {
        // Xử lý các lỗi cụ thể
        if (error.message.includes('Invalid login credentials')) {
          setLoginError('Email hoặc mật khẩu không đúng');
        } else if (error.message.includes('Email not confirmed')) {
          setLoginError('Vui lòng xác nhận email trước khi đăng nhập');
        } else {
          setLoginError(error.message || 'Đã xảy ra lỗi khi đăng nhập');
        }
        setLoading(false);
        return;
      }

      if (authData?.user) {
        // Kiểm tra role của user để redirect đúng dashboard
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user role:', userError);
          // Nếu không lấy được role, mặc định redirect đến dashboard thường
          navigate('/dashboard');
          return;
        }

        // Redirect theo role
        if (userData.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Đã xảy ra lỗi không mong muốn');
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
          <h2>Đăng nhập</h2>
        </div>
        
        <p className="welcome-text">Chào mừng Quý khách đến với GreenFund</p>
        
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
              disabled={loading}
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
              disabled={loading}
            />
            {errors.password && <span className="error">{errors.password.message}</span>}
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
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