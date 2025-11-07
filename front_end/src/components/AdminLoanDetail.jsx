import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaArrowLeft, FaEdit, FaCheck, FaTimes, 
  FaBuilding, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaCalendar, FaLeaf
} from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';
import './AdminLoanDetail.css';

const AdminLoanDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedLoan, setEditedLoan] = useState(null);

  useEffect(() => {
    loadLoanDetail();
  }, [id]);

  const loadLoanDetail = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('loans')
        .select(`
          *,
          borrower:users!borrower_id(
            id,
            full_name,
            email,
            phone,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setLoan(data);
      setEditedLoan(data);
    } catch (error) {
      console.error('Error loading loan:', error);
      alert('Không thể tải thông tin khoản vay');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const { data, error } = await supabase
        .from('loans')
        .update({
          project_name: editedLoan.project_name,
          amount: editedLoan.amount,
          interest_rate: editedLoan.interest_rate,
          term_months: editedLoan.term_months,
          status: editedLoan.status,
          package: editedLoan.package,
          loan_purpose: editedLoan.loan_purpose,
          detailed_description: editedLoan.detailed_description,
          repayment_method: editedLoan.repayment_method,
          representative_name: editedLoan.representative_name,
          representative_position: editedLoan.representative_position,
          representative_phone: editedLoan.representative_phone,
          representative_email: editedLoan.representative_email,
          company_name: editedLoan.company_name,
          business_address: editedLoan.business_address,
          business_type: editedLoan.business_type,
          business_registration_number: editedLoan.business_registration_number,
          company_founded_year: editedLoan.company_founded_year,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      console.log('Update response:', { data, error });

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      setEditing(false);
      await loadLoanDetail();
    } catch (error) {
      console.error('Error updating loan:', error);
      alert('Cập nhật thất bại: ' + error.message);
    }
  };

  // Function handleDelete đã bị xóa vì nút Delete đã được chuyển vào table actions

  const handleApprove = async () => {
    if (!window.confirm('Bạn chắc chắn muốn duyệt khoản vay này?')) return;
    
    try {
      const { error } = await supabase
        .from('loans')
        .update({
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      alert('Khoản vay đã được duyệt!');
      await loadLoanDetail();
    } catch (error) {
      console.error('Error approving loan:', error);
      alert('Duyệt thất bại: ' + error.message);
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Bạn chắc chắn muốn từ chối khoản vay này?')) return;
    
    try {
      const { error } = await supabase
        .from('loans')
        .update({
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      alert('Khoản vay đã bị từ chối!');
      await loadLoanDetail();
    } catch (error) {
      console.error('Error rejecting loan:', error);
      alert('Từ chối thất bại: ' + error.message);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      funding: 'Đang huy động vốn',
      active: 'Đang hoạt động',
      completed: 'Hoàn thành',
      rejected: 'Từ chối',
      cancelled: 'Đã hủy'
    };
    return labels[status] || status;
  };

  const getPackageLabel = (pkg) => {
    const labels = {
      'green-agriculture': 'Nông nghiệp xanh',
      'renewable-energy': 'Năng lượng tái tạo',
      'environmental-tech': 'Công nghệ môi trường',
      'sustainable-consumption': 'Tiêu dùng bền vững'
    };
    return labels[pkg] || pkg;
  };

  const getRepaymentMethodLabel = (method) => {
    const labels = {
      'monthly': 'Trả hàng tháng',
      'quarterly': 'Trả hàng quý',
      'end_term': 'Trả cuối kỳ'
    };
    return labels[method] || method;
  };

  if (loading) {
    return (
      <div className="admin-loan-detail">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="admin-loan-detail">
        <div className="error">Không tìm thấy khoản vay</div>
      </div>
    );
  }

  return (
    <div className="admin-loan-detail">
      {/* Header */}
      <div className="detail-header">
        <button className="btn-back" onClick={() => navigate('/admin-dashboard')}>
          <FaArrowLeft /> Quay lại Dashboard
        </button>
        <div className="header-actions">
          {!editing ? (
            <>
              <button className="btn-edit" onClick={() => setEditing(true)}>
                <FaEdit /> Chỉnh sửa
              </button>
            </>
          ) : (
            <>
              <button className="btn-save" onClick={handleUpdate}>
                <FaCheck /> Lưu
              </button>
              <button className="btn-cancel" onClick={() => {
                setEditing(false);
                setEditedLoan(loan);
              }}>
                <FaTimes /> Hủy
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="detail-content">
        {/* Left Column */}
        <div className="detail-column-left">
          {/* Loan Image */}
          <div className="detail-card">
            <h3>Hình ảnh dự án</h3>
            {loan.image_url ? (
              <img src={loan.image_url} alt={loan.project_name} className="loan-image" />
            ) : (
              <div className="no-image">
                <FaBuilding />
                <p>Chưa có hình ảnh</p>
              </div>
            )}
          </div>

          {/* Borrower Info */}
          <div className="detail-card">
            <h3><FaUser /> Thông tin người vay</h3>
            <div className="borrower-info">
              {loan.borrower?.avatar_url && (
                <img src={loan.borrower.avatar_url} alt={loan.borrower.full_name} className="borrower-avatar" />
              )}
              <div className="borrower-details">
                <p><strong>{loan.borrower?.full_name || 'N/A'}</strong></p>
                <p><FaEnvelope /> {loan.borrower?.email || 'N/A'}</p>
                <p><FaPhone /> {loan.borrower?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Approval Card */}
          {loan.status === 'pending' && (
            <div className="detail-card">
              <h3>Duyệt gói vay</h3>
              <div className="approval-actions" style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn-approve"
                  onClick={handleApprove}
                  style={{
                    flex: 1,
                    padding: '12px 15px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  ✓ Duyệt
                </button>
                <button 
                  className="btn-reject"
                  onClick={handleReject}
                  style={{
                    flex: 1,
                    padding: '12px 15px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  ✕ Từ chối
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="detail-column-right">
          {/* Basic Info */}
          <div className="detail-card">
            <h3>Thông tin cơ bản</h3>
            <div className="info-grid">
              <div className="info-row">
                <label>Tên dự án:</label>
                {editing ? (
                  <input
                    type="text"
                    value={editedLoan.project_name}
                    onChange={(e) => setEditedLoan({...editedLoan, project_name: e.target.value})}
                  />
                ) : (
                  <span><strong>{loan.project_name}</strong></span>
                )}
              </div>

              <div className="info-row">
                <label>Số tiền vay:</label>
                {editing ? (
                  <input
                    type="number"
                    value={editedLoan.amount}
                    onChange={(e) => setEditedLoan({...editedLoan, amount: parseFloat(e.target.value)})}
                  />
                ) : (
                  <span className="highlight">{formatCurrency(loan.amount)}</span>
                )}
              </div>

              <div className="info-row">
                <label>Lãi suất:</label>
                {editing ? (
                  <input
                    type="number"
                    step="0.1"
                    value={editedLoan.interest_rate}
                    onChange={(e) => setEditedLoan({...editedLoan, interest_rate: parseFloat(e.target.value)})}
                  />
                ) : (
                  <span className="highlight">{loan.interest_rate}%/năm</span>
                )}
              </div>

              <div className="info-row">
                <label>Thời hạn:</label>
                {editing ? (
                  <input
                    type="number"
                    value={editedLoan.term_months}
                    onChange={(e) => setEditedLoan({...editedLoan, term_months: parseInt(e.target.value)})}
                  />
                ) : (
                  <span>{loan.term_months} tháng</span>
                )}
              </div>

              <div className="info-row">
                <label>Trạng thái:</label>
                {editing ? (
                  <select
                    value={editedLoan.status}
                    onChange={(e) => setEditedLoan({...editedLoan, status: e.target.value})}
                  >
                    <option value="pending">Chờ duyệt</option>
                    <option value="approved">Đã duyệt</option>
                    <option value="funding">Đang huy động vốn</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="rejected">Từ chối</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                ) : (
                  <span className={`status-badge status-${loan.status}`}>
                    {getStatusLabel(loan.status)}
                  </span>
                )}
              </div>

              <div className="info-row">
                <label>Gói vay:</label>
                {editing ? (
                  <select
                    value={editedLoan.package}
                    onChange={(e) => setEditedLoan({...editedLoan, package: e.target.value})}
                  >
                    <option value="green-agriculture">Nông nghiệp xanh</option>
                    <option value="renewable-energy">Năng lượng tái tạo</option>
                    <option value="environmental-tech">Công nghệ môi trường</option>
                    <option value="sustainable-consumption">Tiêu dùng bền vững</option>
                  </select>
                ) : (
                  <span className="highlight"><FaLeaf /> {getPackageLabel(loan.package)}</span>
                )}
              </div>

              <div className="info-row">
                <label>Phương thức trả:</label>
                {editing ? (
                  <select
                    value={editedLoan.repayment_method}
                    onChange={(e) => setEditedLoan({...editedLoan, repayment_method: e.target.value})}
                  >
                    <option value="monthly">Trả hàng tháng</option>
                    <option value="quarterly">Trả hàng quý</option>
                    <option value="end_term">Trả cuối kỳ</option>
                  </select>
                ) : (
                  <span>{getRepaymentMethodLabel(loan.repayment_method)}</span>
                )}
              </div>
            </div>
          </div>

          {/* Row 2: Representative + Company Info (Side by Side) */}
          <div className="detail-row-split">
            {/* Representative Info */}
            <div className="detail-card">
              <h3><FaUser /> Người đại diện</h3>
              <div className="representative-info">
                {editing ? (
                  <>
                    <div className="edit-field">
                      <label>Tên người đại diện:</label>
                      <input
                        type="text"
                        value={editedLoan.representative_name}
                        onChange={(e) => setEditedLoan({...editedLoan, representative_name: e.target.value})}
                      />
                    </div>
                    <div className="edit-field">
                      <label>Chức vụ:</label>
                      <input
                        type="text"
                        value={editedLoan.representative_position}
                        onChange={(e) => setEditedLoan({...editedLoan, representative_position: e.target.value})}
                      />
                    </div>
                    <div className="edit-field">
                      <label>Số điện thoại:</label>
                      <input
                        type="tel"
                        value={editedLoan.representative_phone}
                        onChange={(e) => setEditedLoan({...editedLoan, representative_phone: e.target.value})}
                      />
                    </div>
                    <div className="edit-field">
                      <label>Email:</label>
                      <input
                        type="email"
                        value={editedLoan.representative_email}
                        onChange={(e) => setEditedLoan({...editedLoan, representative_email: e.target.value})}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p><strong>{loan.representative_name}</strong></p>
                    <p>Chức vụ: {loan.representative_position}</p>
                    <p><FaPhone /> {loan.representative_phone}</p>
                    <p><FaEnvelope /> {loan.representative_email}</p>
                  </>
                )}
              </div>
            </div>

            {/* Company Info */}
            <div className="detail-card">
              <h3><FaBuilding /> Thông tin doanh nghiệp</h3>
              <div className="company-info">
                {editing ? (
                  <>
                    <div className="edit-field">
                      <label>Tên doanh nghiệp:</label>
                      <input
                        type="text"
                        value={editedLoan.company_name}
                        onChange={(e) => setEditedLoan({...editedLoan, company_name: e.target.value})}
                      />
                    </div>
                    <div className="edit-field">
                      <label>Địa chỉ:</label>
                      <input
                        type="text"
                        value={editedLoan.business_address}
                        onChange={(e) => setEditedLoan({...editedLoan, business_address: e.target.value})}
                      />
                    </div>
                    <div className="edit-field">
                      <label>Loại hình:</label>
                      <input
                        type="text"
                        value={editedLoan.business_type}
                        onChange={(e) => setEditedLoan({...editedLoan, business_type: e.target.value})}
                      />
                    </div>
                    <div className="edit-field">
                      <label>Số ĐKKD:</label>
                      <input
                        type="text"
                        value={editedLoan.business_registration_number || ''}
                        onChange={(e) => setEditedLoan({...editedLoan, business_registration_number: e.target.value})}
                      />
                    </div>
                    <div className="edit-field">
                      <label>Năm thành lập:</label>
                      <input
                        type="number"
                        value={editedLoan.company_founded_year || ''}
                        onChange={(e) => setEditedLoan({...editedLoan, company_founded_year: parseInt(e.target.value) || null})}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p><strong>{loan.company_name}</strong></p>
                    <p><FaMapMarkerAlt /> {loan.business_address}</p>
                    <p>Loại hình: {loan.business_type}</p>
                    <div className="company-meta">
                      <div>
                        <span className="meta-label">Số ĐKKD:</span>
                        <span className="meta-value">{loan.business_registration_number || 'Chưa cập nhật'}</span>
                      </div>
                      <div>
                        <span className="meta-label">Năm thành lập:</span>
                        <span className="meta-value">{loan.company_founded_year || 'Chưa cập nhật'}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Row 3: Project Details */}
          <div className="detail-card">
            <h3>Chi tiết dự án</h3>
            <div className="project-details">
              <div className="detail-section">
                <h4>Mục đích vay:</h4>
                {editing ? (
                  <textarea
                    value={editedLoan.loan_purpose}
                    onChange={(e) => setEditedLoan({...editedLoan, loan_purpose: e.target.value})}
                    rows="3"
                  />
                ) : (
                  <p>{loan.loan_purpose}</p>
                )}
              </div>

              <div className="detail-section">
                <h4>Mô tả chi tiết:</h4>
                {editing ? (
                  <textarea
                    value={editedLoan.detailed_description}
                    onChange={(e) => setEditedLoan({...editedLoan, detailed_description: e.target.value})}
                    rows="5"
                  />
                ) : (
                  <p>{loan.detailed_description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Row 4: Funding Progress */}
          <div className="detail-card">
            <h3>Tiến độ huy động vốn</h3>
            <div className="funding-info">
              <div className="funding-stats">
                <div className="stat-item">
                  <label>Đã huy động:</label>
                  <span className="highlight">{formatCurrency(loan.funded_amount || 0)}</span>
                </div>
                <div className="stat-item">
                  <label>Còn thiếu:</label>
                  <span>{formatCurrency(loan.amount - (loan.funded_amount || 0))}</span>
                </div>
                <div className="stat-item">
                  <label>Tiến độ:</label>
                  <span>{((loan.funded_amount || 0) / loan.amount * 100).toFixed(1)}%</span>
                </div>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${((loan.funded_amount || 0) / loan.amount * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="detail-card">
            <h3><FaCalendar /> Thông tin thời gian</h3>
            <div className="timestamps">
              <div className="timestamp-item">
                <label>Ngày tạo:</label>
                <span>{formatDate(loan.created_at)}</span>
              </div>
              <div className="timestamp-item">
                <label>Cập nhật lần cuối:</label>
                <span>{formatDate(loan.updated_at)}</span>
              </div>
              {loan.start_date && (
                <div className="timestamp-item">
                  <label>Ngày bắt đầu:</label>
                  <span>{formatDate(loan.start_date)}</span>
                </div>
              )}
              {loan.end_date && (
                <div className="timestamp-item">
                  <label>Ngày kết thúc:</label>
                  <span>{formatDate(loan.end_date)}</span>
                </div>
              )}
              {loan.funded_date && (
                <div className="timestamp-item">
                  <label>Ngày huy động đủ vốn:</label>
                  <span>{formatDate(loan.funded_date)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoanDetail;
