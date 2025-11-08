import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaArrowLeft, FaEdit, FaCheck, FaTimes, 
  FaBuilding, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaCalendar, FaLeaf, FaFileAlt, FaFilePdf, FaFileImage, 
  FaFileWord, FaFileExcel, FaDownload, FaEye, FaCheckCircle, FaTrash
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
  const [loanDocuments, setLoanDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  useEffect(() => {
    loadLoanDetail();
    loadLoanDocuments();
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

  const loadLoanDocuments = async () => {
    try {
      setLoadingDocuments(true);
      const { data, error } = await supabase
        .from('loan_documents')
        .select('*')
        .eq('loan_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLoanDocuments(data || []);
    } catch (error) {
      console.error('Error loading loan documents:', error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const handleDownloadDocument = async (doc) => {
    try {
      // file_url is already the path in storage (loan_id/doc_id/filename)
      const filePath = doc.file_url;

      const { data, error } = await supabase.storage
        .from('loan-documents')
        .download(filePath);

      if (error) throw error;

      // Create download link
      const blobUrl = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Không thể tải file: ' + error.message);
    }
  };

  const handlePreviewDocument = async (doc) => {
    try {
      // Check if it's previewable (PDF or image)
      const previewableTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
      
      if (!previewableTypes.includes(doc.mime_type)) {
        alert('File này không hỗ trợ xem trước. Vui lòng tải xuống để xem.');
        return;
      }

      // file_url is already the path in storage (loan_id/doc_id/filename)
      const filePath = doc.file_url;

      // Create signed URL for preview (valid for 1 hour)
      const { data, error } = await supabase.storage
        .from('loan-documents')
        .createSignedUrl(filePath, 3600);

      if (error) throw error;

      setPreviewDoc({
        ...doc,
        signedUrl: data.signedUrl
      });
    } catch (error) {
      console.error('Error previewing document:', error);
      alert('Không thể xem trước file: ' + error.message);
    }
  };

  const handleDeleteDocument = async (doc) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài liệu "${doc.file_name}"?`)) {
      return;
    }

    try {
      // Extract folder path: loan-id/doc-id
      const folderPath = `${doc.loan_id}/${doc.id}`;
      
      // List all files in the document folder
      const { data: fileList, error: listError } = await supabase.storage
        .from('loan-documents')
        .list(folderPath);

      if (listError) throw listError;

      // Delete all files in the folder
      if (fileList && fileList.length > 0) {
        const filePaths = fileList.map(file => `${folderPath}/${file.name}`);
        const { error: storageError } = await supabase.storage
          .from('loan-documents')
          .remove(filePaths);

        if (storageError) throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('loan_documents')
        .delete()
        .eq('id', doc.id);

      if (dbError) throw dbError;

      alert('Đã xóa tài liệu thành công!');
      await loadLoanDocuments();
    } catch (err) {
      console.error('Error deleting document:', err);
      alert('Không thể xóa tài liệu: ' + err.message);
    }
  };

  const handleVerifyDocument = async (docId, currentStatus) => {
    try {
      // Get current admin user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Không thể xác thực. Vui lòng đăng nhập lại.');
        return;
      }

      const newStatus = !currentStatus;
      const updateData = {
        is_verified: newStatus,
        verified_by: newStatus ? user.id : null,
        verified_at: newStatus ? new Date().toISOString() : null
      };

      const { error } = await supabase
        .from('loan_documents')
        .update(updateData)
        .eq('id', docId);

      if (error) throw error;

      alert(newStatus ? 'Đã xác minh tài liệu!' : 'Đã hủy xác minh tài liệu!');
      await loadLoanDocuments();
    } catch (error) {
      console.error('Error verifying document:', error);
      alert('Không thể cập nhật trạng thái xác minh: ' + error.message);
    }
  };

  const getDocumentIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) return <FaFileImage style={{ color: '#3b82f6' }} />;
    if (mimeType === 'application/pdf') return <FaFilePdf style={{ color: '#ef4444' }} />;
    if (mimeType.includes('word') || mimeType.includes('document')) return <FaFileWord style={{ color: '#2563eb' }} />;
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return <FaFileExcel style={{ color: '#16a34a' }} />;
    return <FaFileAlt style={{ color: '#6b7280' }} />;
  };

  const getDocumentTypeLabel = (type) => {
    const labels = {
      business_license: 'Giấy phép kinh doanh',
      financial_report: 'Báo cáo tài chính',
      id_card: 'CMND/CCCD',
      tax_certificate: 'Chứng nhận thuế',
      related_contract: 'Hợp đồng liên quan',
      other: 'Khác'
    };
    return labels[type] || type;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
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
    if (!window.confirm('Bạn chắc chắn muốn duyệt khoản vay này? Dự án sẽ chuyển sang trạng thái "Đang hoạt động".')) return;
    
    try {
      const { error } = await supabase
        .from('loans')
        .update({
          status: 'active',
          start_date: new Date().toISOString(),
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
        <button className="btn-back" onClick={() => navigate(-1)}>
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

          {/* Row 4: Loan Documents */}
          <div className="detail-card">
            <h3><FaFileAlt /> Tài liệu đính kèm</h3>
            {loadingDocuments ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>Đang tải tài liệu...</p>
              </div>
            ) : loanDocuments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                <FaFileAlt size={40} style={{ marginBottom: '10px', opacity: 0.5 }} />
                <p>Chưa có tài liệu nào được tải lên</p>
              </div>
            ) : (
              <div className="documents-list">
                {loanDocuments.map((doc) => (
                  <div key={doc.id} className="document-item">
                    <div className="document-info">
                      <div className="document-icon">
                        {getDocumentIcon(doc.mime_type)}
                      </div>
                      <div className="document-details">
                        <h4>{doc.file_name}</h4>
                        <div className="document-meta">
                          <span className="doc-type">{getDocumentTypeLabel(doc.document_type)}</span>
                          <span className="doc-size">{formatFileSize(doc.file_size)}</span>
                          <span className="doc-date">{formatDate(doc.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="document-actions">
                      {doc.is_verified ? (
                        <div className="verified-badge">
                          <FaCheckCircle style={{ color: '#16a34a', marginRight: '5px' }} />
                          <span>Đã xác minh</span>
                        </div>
                      ) : (
                        <div className="unverified-badge">
                          <span style={{ color: '#f59e0b' }}>Chưa xác minh</span>
                        </div>
                      )}
                      <button
                        className="btn-doc-action btn-preview"
                        onClick={() => handlePreviewDocument(doc)}
                        title="Xem trước"
                      >
                        <FaEye /> Xem
                      </button>
                      {/* <button
                        className="btn-doc-action btn-download"
                        onClick={() => handleDownloadDocument(doc)}
                        title="Tải xuống"
                      >
                        <FaDownload /> Tải
                      </button> */}
                      <button
                        className="btn-doc-action btn-delete-doc"
                        onClick={() => handleDeleteDocument(doc)}
                        title="Xóa tài liệu"
                      >
                        <FaTrash /> Xóa
                      </button>
                      <button
                        className={`btn-doc-action ${doc.is_verified ? 'btn-unverify' : 'btn-verify'}`}
                        onClick={() => handleVerifyDocument(doc.id, doc.is_verified)}
                        title={doc.is_verified ? 'Hủy xác minh' : 'Xác minh'}
                      >
                        {doc.is_verified ? '✕ Hủy' : '✓ Xác minh'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="preview-modal" onClick={() => setPreviewDoc(null)}>
          <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="preview-modal-header">
              <h3>{previewDoc.file_name}</h3>
              <button className="btn-close-preview" onClick={() => setPreviewDoc(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="preview-modal-body">
              {previewDoc.mime_type === 'application/pdf' ? (
                <iframe
                  src={previewDoc.signedUrl}
                  title={previewDoc.file_name}
                />
              ) : previewDoc.mime_type.startsWith('image/') ? (
                <img
                  src={previewDoc.signedUrl}
                  alt={previewDoc.file_name}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p>Không thể xem trước file này</p>
                </div>
              )}
            </div>
            <div className="preview-modal-footer">
              <button
                className="btn-download-modal"
                onClick={() => handleDownloadDocument(previewDoc)}
              >
                <FaDownload /> Tải xuống
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLoanDetail;
