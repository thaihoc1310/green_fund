import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIdCard, FaCalendar, FaEdit, FaSave } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = location.state?.userRole || 'borrower';
  
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0912345678',
    idNumber: '079123456789',
    dateOfBirth: '15/03/1990',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    bankAccount: '1234567890',
    bankName: 'Vietcombank',
    avatar: null
  });

  const [editedProfile, setEditedProfile] = useState({ ...profile });

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleSave = () => {
    setProfile({ ...editedProfile });
    setIsEditing(false);
    alert('Đã cập nhật thông tin thành công!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({ ...profile });
  };

  const handleChange = (field, value) => {
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button className="btn-back" onClick={() => navigate('/dashboard', { state: { userRole } })}>
          <FaArrowLeft /> Quay lại
        </button>
        <h1>Thông tin cá nhân</h1>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="avatar-large">
              <FaUser />
            </div>
            {isEditing && (
              <button className="btn-upload-avatar">
                Đổi ảnh đại diện
              </button>
            )}
          </div>

          <div className="profile-info-section">
            <h2>{isEditing ? 'Chỉnh sửa thông tin' : 'Thông tin cá nhân'}</h2>
            
            <div className="info-grid">
              <div className="info-group">
                <label><FaUser /> Họ và tên</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <p>{profile.fullName}</p>
                )}
              </div>

              <div className="info-group">
                <label><FaEnvelope /> Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <p>{profile.email}</p>
                )}
              </div>

              <div className="info-group">
                <label><FaPhone /> Số điện thoại</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <p>{profile.phone}</p>
                )}
              </div>

              <div className="info-group">
                <label><FaIdCard /> CMND/CCCD</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.idNumber}
                    onChange={(e) => handleChange('idNumber', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <p>{profile.idNumber}</p>
                )}
              </div>

              <div className="info-group">
                <label><FaCalendar /> Ngày sinh</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <p>{profile.dateOfBirth}</p>
                )}
              </div>

              <div className="info-group full-width">
                <label><FaMapMarkerAlt /> Địa chỉ</label>
                {isEditing ? (
                  <textarea
                    value={editedProfile.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="edit-input"
                    rows="2"
                  />
                ) : (
                  <p>{profile.address}</p>
                )}
              </div>
            </div>

            <div className="bank-info-section">
              <h3>Thông tin ngân hàng</h3>
              <div className="info-grid">
                <div className="info-group">
                  <label>Số tài khoản</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.bankAccount}
                      onChange={(e) => handleChange('bankAccount', e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    <p>{profile.bankAccount}</p>
                  )}
                </div>

                <div className="info-group">
                  <label>Ngân hàng</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.bankName}
                      onChange={(e) => handleChange('bankName', e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    <p>{profile.bankName}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-actions">
              {isEditing ? (
                <>
                  <button className="btn-save" onClick={handleSave}>
                    <FaSave /> Lưu thay đổi
                  </button>
                  <button className="btn-cancel" onClick={handleCancel}>
                    Hủy
                  </button>
                </>
              ) : (
                <button className="btn-edit" onClick={handleEdit}>
                  <FaEdit /> Chỉnh sửa thông tin
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
