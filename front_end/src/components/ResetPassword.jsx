import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import './ResetPassword.css';

const ResetPassword = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const navigate = useNavigate();
  const { updatePassword, user } = useAuth();
  const newPassword = watch('newPassword');

  useEffect(() => {
    // Kiểm tra xem user đã được authenticate từ reset password link chưa
    if (user) {
      setIsValidToken(true);
      setErrorMessage(''); // Clear error nếu có user hợp lệ
    }
    // Không set error ở đây vì loading có thể chưa xong
  }, [user]);

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { error } = await updatePassword(data.newPassword);

      if (error) {
        // Dịch error message sang tiếng Việt
        let vietnameseError = error.message || 'Đã xảy ra lỗi khi đặt lại mật khẩu';
        
        if (error.message.includes('New password should be different from the old password')) {
          vietnameseError = 'Mật khẩu mới phải khác mật khẩu cũ';
        } else if (error.message.includes('Password should be at least 6 characters')) {
          vietnameseError = 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        
        setErrorMessage(vietnameseError);
        setLoading(false);
        return;
      }

      // Thành công
      setIsPasswordUpdated(true);
      setSuccessMessage('Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...');
      
      // Chuyển đến trang đăng nhập sau 2 giây
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Update password error:', error);
      setErrorMessage('Đã xảy ra lỗi không mong muốn');
    } finally {
      setLoading(false);
    }
  };

  // Nếu không có user (token không hợp lệ hoặc hết hạn)
  // NHƯNG chỉ hiển thị error nếu không phải là trường hợp đã update password thành công
  if (!user && !isPasswordUpdated) {
    return (
      <div className="auth-container">
        <div className="auth-card">
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
            <h2>Đặt lại mật khẩu</h2>
          </div>
          
          <div className="error-message">
            Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn
          </div>
          
          <Link to="/forgot-password" className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
            Yêu cầu link mới
          </Link>
          
          <div className="auth-links">
            <Link to="/login">Quay lại đăng nhập</Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Nếu đã update password thành công, hiển thị success message
  if (isPasswordUpdated) {
    return (
      <div className="auth-container">
        <div className="auth-card">
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
            <h2>Đặt lại mật khẩu</h2>
          </div>
          
          <div className="success-message">
            {successMessage}
          </div>
        </div>
      </div>
    );
  }

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
          <h2>Đặt lại mật khẩu</h2>
        </div>
        
        <p className="welcome-text">Nhập mật khẩu mới của bạn</p>
        
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
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
              type="password"
              placeholder="Mật khẩu mới"
              {...register('newPassword', { 
                required: 'Vui lòng nhập mật khẩu mới',
                minLength: {
                  value: 6,
                  message: 'Mật khẩu phải có ít nhất 6 ký tự'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'
                }
              })}
              disabled={loading || successMessage}
            />
            {errors.newPassword && <span className="error">{errors.newPassword.message}</span>}
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              {...register('confirmPassword', { 
                required: 'Vui lòng xác nhận mật khẩu mới',
                validate: (value) => value === newPassword || 'Mật khẩu xác nhận không khớp'
              })}
              disabled={loading || successMessage}
            />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading || successMessage}>
            {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
          </button>
        </form>
        
        <div className="auth-links">
          <Link to="/login">Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
