import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIdCard, FaCalendar, FaEdit, FaSave } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = location.state?.userRole || 'borrower';
  const { user } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    nationalId: '',
    dateOfBirth: '',
    address: '',
    avatar: null
  });

  const [editedProfile, setEditedProfile] = useState({ ...profile });

  // Load profile data từ Supabase
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          const profileData = {
            fullName: data.full_name || '',
            email: data.email || '',
            phone: data.phone || '',
            nationalId: data.national_id || '',
            dateOfBirth: data.date_of_birth || '',
            address: data.address || '',
            avatar: data.avatar_url || null
          };
          setProfile(profileData);
          setEditedProfile(profileData);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setErrorMessage('Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setErrorMessage('');
      setSuccessMessage('');

      // Validate dữ liệu
      if (!editedProfile.fullName.trim()) {
        setErrorMessage('Họ và tên không được để trống');
        setSaving(false);
        return;
      }

      // Format date nếu có (chuyển từ dd/mm/yyyy sang yyyy-mm-dd cho database)
      let formattedDate = editedProfile.dateOfBirth;
      if (formattedDate && formattedDate.includes('/')) {
        const parts = formattedDate.split('/');
        if (parts.length === 3) {
          formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }

      // Update vào Supabase
      const { error } = await supabase
        .from('users')
        .update({
          full_name: editedProfile.fullName.trim(),
          phone: editedProfile.phone.trim(),
          national_id: editedProfile.nationalId.trim() || null,
          date_of_birth: formattedDate || null,
          address: editedProfile.address.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Cập nhật local state
      setProfile({ ...editedProfile, dateOfBirth: formattedDate });
      setIsEditing(false);
      setSuccessMessage('Đã cập nhật thông tin thành công!');
      
      // Clear success message sau 3 giây
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage(error.message || 'Đã xảy ra lỗi khi cập nhật thông tin');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({ ...profile });
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleChange = (field, value) => {
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  // Format date để hiển thị (yyyy-mm-dd -> dd/mm/yyyy)
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    if (dateString.includes('/')) return dateString;
    
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  };

  // Upload avatar
  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Vui lòng chọn file ảnh hợp lệ');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      setErrorMessage('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    try {
      setUploadingAvatar(true);
      setErrorMessage('');

      // Tạo tên file unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Xóa avatar cũ nếu có
      if (profile.avatar) {
        const oldFileName = profile.avatar.split('/').pop();
        await supabase.storage
          .from('avatars')
          .remove([oldFileName]);
      }

      // Upload avatar mới
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Lấy public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update avatar_url vào database
      const { error: updateError } = await supabase
        .from('users')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update local state
      setProfile({ ...profile, avatar: publicUrl });
      setEditedProfile({ ...editedProfile, avatar: publicUrl });
      setSuccessMessage('Đã cập nhật ảnh đại diện thành công!');
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setErrorMessage(error.message || 'Đã xảy ra lỗi khi tải ảnh lên');
    } finally {
      setUploadingAvatar(false);
      event.target.value = ''; // Reset input
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-content">
          <div className="profile-card">
            <p style={{ textAlign: 'center', padding: '40px' }}>Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

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
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                <FaUser />
              )}
            </div>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarUpload}
              disabled={uploadingAvatar}
            />
            <button 
              className="btn-upload-avatar" 
              onClick={() => document.getElementById('avatar-upload').click()}
              disabled={uploadingAvatar}
            >
              {uploadingAvatar ? 'Đang tải lên...' : 'Đổi ảnh đại diện'}
            </button>
            <small style={{ color: '#666', fontSize: '12px', marginTop: '8px', display: 'block' }}>
              Tối đa 5MB, định dạng: JPG, PNG, GIF
            </small>
          </div>

          <div className="profile-info-section">
            <h2>{isEditing ? 'Chỉnh sửa thông tin' : 'Thông tin cá nhân'}</h2>
            
            {errorMessage && (
              <div className="error-message" style={{ marginBottom: '20px' }}>
                {errorMessage}
              </div>
            )}
            
            {successMessage && (
              <div className="success-message" style={{ marginBottom: '20px' }}>
                {successMessage}
              </div>
            )}
            
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
                <p>{profile.email}</p>
                {isEditing && <small style={{ color: '#666', fontSize: '12px' }}>Email không thể thay đổi</small>}
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
                    value={editedProfile.nationalId}
                    onChange={(e) => handleChange('nationalId', e.target.value)}
                    className="edit-input"
                    placeholder="Nhập số CMND/CCCD"
                    maxLength="30"
                  />
                ) : (
                  <p>{profile.nationalId || 'Chưa cập nhật'}</p>
                )}
              </div>

              <div className="info-group">
                <label><FaCalendar /> Ngày sinh</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedProfile.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <p>{formatDateForDisplay(profile.dateOfBirth) || 'Chưa cập nhật'}</p>
                )}
              </div>

              <div className="info-group full-width">
                <label><FaMapMarkerAlt /> Địa chỉ</label>
                {isEditing ? (
                  <textarea
                    value={editedProfile.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="edit-input"
                    rows="3"
                    placeholder="Nhập địa chỉ đầy đủ"
                  />
                ) : (
                  <p>{profile.address || 'Chưa cập nhật'}</p>
                )}
              </div>
            </div>

            <div className="profile-actions">
              {isEditing ? (
                <>
                  <button className="btn-save" onClick={handleSave} disabled={saving}>
                    <FaSave /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                  <button className="btn-cancel" onClick={handleCancel} disabled={saving}>
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
