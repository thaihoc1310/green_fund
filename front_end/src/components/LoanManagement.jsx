import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaArrowLeft, FaEye, FaEdit, FaTrash, FaFileAlt, FaCheckCircle, FaTimesCircle, 
  FaPlus, FaUpload, FaTimes, FaDownload, FaFileImage, FaFilePdf, FaFileWord, FaFileExcel 
} from 'react-icons/fa';
import { BiMoney, BiTime } from 'react-icons/bi';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import './LoanManagement.css';

const LoanManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, deleteImageFromStorage } = useAuth();
  const userRole = location.state?.userRole || 'borrower';
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [loanDocuments, setLoanDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  
  // Edit mode states
  const [editMode, setEditMode] = useState(false);
  const [editedLoan, setEditedLoan] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  
  // Add document states
  const [showAddDocumentBox, setShowAddDocumentBox] = useState(false);
  const [newDocumentType, setNewDocumentType] = useState('business_license');
  const [newDocumentFiles, setNewDocumentFiles] = useState([]);
  const [uploadingNewDoc, setUploadingNewDoc] = useState(false);

  // Fetch loans from Supabase
  useEffect(() => {
    // Chỉ fetch một lần khi component mount
    if (user?.id) {
      fetchLoans();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - chỉ chạy 1 lần khi mount

  const fetchLoans = async () => {
    if (!user) {
      setError('Vui lòng đăng nhập để xem khoản vay');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .eq('borrower_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setLoans(data || []);
    } catch (err) {
      console.error('Error fetching loans:', err);
      setError('Không thể tải danh sách khoản vay. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch documents for a specific loan
  const fetchLoanDocuments = async (loanId) => {
    try {
      setLoadingDocuments(true);

      const { data, error } = await supabase
        .from('loan_documents')
        .select('*')
        .eq('loan_id', loanId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setLoanDocuments(data || []);
    } catch (err) {
      console.error('Error fetching loan documents:', err);
      setLoanDocuments([]);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const filteredLoans = loans.filter(loan => {
    if (statusFilter === 'all') return true;
    return loan.status === statusFilter;
  });

  const formatCurrency = (amount) => {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Chờ duyệt', class: 'status-pending' },
      approved: { text: 'Đã duyệt', class: 'status-approved' },
      funding: { text: 'Đang gọi vốn', class: 'status-funding' },
      active: { text: 'Đang hoạt động', class: 'status-active' },
      completed: { text: 'Đã hoàn thành', class: 'status-completed' },
      rejected: { text: 'Đã từ chối', class: 'status-rejected' },
      cancelled: { text: 'Đã hủy', class: 'status-cancelled' }
    };
    return badges[status] || badges.pending;
  };

  const getPackageName = (packageCode) => {
    const packages = {
      'green-agriculture': 'Nông nghiệp xanh',
      'renewable-energy': 'Năng lượng tái tạo',
      'environmental-tech': 'Công nghệ môi trường',
      'sustainable-consumption': 'Tiêu dùng bền vững'
    };
    return packages[packageCode] || packageCode;
  };

  const getDocumentTypeName = (docType) => {
    const types = {
      'business_license': 'Giấy phép kinh doanh',
      'financial_report': 'Báo cáo tài chính',
      'related_contract': 'Hợp đồng liên quan',
      'id_card': 'CMND/CCCD',
      'tax_certificate': 'Giấy tờ thuế',
      'other': 'Khác'
    };
    return types[docType] || docType;
  };

  const getDocumentIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) return <FaFileImage style={{ color: '#3b82f6', fontSize: '40px' }} />;
    if (mimeType === 'application/pdf') return <FaFilePdf style={{ color: '#ef4444', fontSize: '40px' }} />;
    if (mimeType.includes('word') || mimeType.includes('document')) return <FaFileWord style={{ color: '#2563eb', fontSize: '40px' }} />;
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return <FaFileExcel style={{ color: '#16a34a', fontSize: '40px' }} />;
    return <FaFileAlt style={{ color: '#6b7280', fontSize: '40px' }} />;
  };

  const calculateFundingProgress = (fundedAmount, totalAmount) => {
    if (!totalAmount || totalAmount === 0) return 0;
    return Math.round((fundedAmount / totalAmount) * 100);
  };

  const handleViewDetail = async (loan) => {
    setSelectedLoan(loan);
    setEditedLoan(loan);
    setEditMode(false);
    setEditImageFile(null);
    setEditImagePreview(loan.image_url);
    setShowDetailModal(true);
    await fetchLoanDocuments(loan.id);
  };

  const handleViewDocuments = async (loan) => {
    setSelectedLoan(loan);
    setShowDocumentsModal(true);
    await fetchLoanDocuments(loan.id);
  };

  const handleEdit = (loan) => {
    navigate('/create-loan', { 
      state: { 
        userRole,
        editMode: true,
        loanData: loan
      } 
    });
  };

  const handleStartEdit = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedLoan(selectedLoan);
    setEditImageFile(null);
    setEditImagePreview(selectedLoan.image_url);
  };

  const handleEditImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh hợp lệ');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const handleSaveEdit = async () => {
    if (!editedLoan) return;

    try {
      setSavingEdit(true);

      let imageUrl = selectedLoan.image_url;

      // Upload new image if changed
      if (editImageFile) {
        // Delete old image if exists
        if (selectedLoan.image_url) {
          try {
            // Extract filename from URL - get the last part after the last '/'
            const urlParts = selectedLoan.image_url.split('/');
            const oldFileName = urlParts[urlParts.length - 1].split('?')[0]; // Remove query params if any
            
            const { error: deleteError } = await supabase.storage
              .from('loan-images')
              .remove([oldFileName]);
            
            if (deleteError) {
              console.error('Error deleting old image:', deleteError);
              // Continue anyway to upload new image
            }
          } catch (deleteErr) {
            console.error('Error processing old image deletion:', deleteErr);
            // Continue anyway
          }
        }

        // Upload new image
        const fileExt = editImageFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
          .from('loan-images')
          .upload(filePath, editImageFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('loan-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // Update loan in database
      const { error: updateError } = await supabase
        .from('loans')
        .update({
          project_name: editedLoan.project_name,
          package: editedLoan.package,
          detailed_description: editedLoan.detailed_description,
          company_name: editedLoan.company_name,
          business_type: editedLoan.business_type,
          business_address: editedLoan.business_address,
          business_registration_number: editedLoan.business_registration_number,
          company_founded_year: editedLoan.company_founded_year,
          company_employees: editedLoan.company_employees,
          company_revenue_2024: editedLoan.company_revenue_2024,
          representative_name: editedLoan.representative_name,
          representative_position: editedLoan.representative_position,
          representative_phone: editedLoan.representative_phone,
          representative_email: editedLoan.representative_email,
          loan_purpose: editedLoan.loan_purpose,
          amount: parseFloat(editedLoan.amount),
          interest_rate: parseFloat(editedLoan.interest_rate),
          term_months: parseInt(editedLoan.term_months),
          repayment_method: editedLoan.repayment_method,
          image_url: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', editedLoan.id);

      if (updateError) throw updateError;

      alert('Đã cập nhật dự án thành công!');
      
      // Refresh data
      await fetchLoans();
      
      // Update modal display
      const updatedLoan = { ...editedLoan, image_url: imageUrl };
      setSelectedLoan(updatedLoan);
      setEditMode(false);
      setEditImageFile(null);
      
    } catch (err) {
      console.error('Error updating loan:', err);
      alert('Không thể cập nhật dự án. Vui lòng thử lại.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (loan) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa dự án "${loan.project_name}"?`)) {
      return;
    }

    try {
      setLoading(true);

      // Delete loan image if exists
      if (loan.image_url) {
        const { error: imgDeleteError } = await deleteImageFromStorage(
          loan.image_url,
          'loan-images'
        );
        
        if (imgDeleteError) {
          console.warn('Warning: Could not delete loan image:', imgDeleteError);
          // Không throw error, vẫn tiếp tục xóa loan
        }
      }

      // Delete loan documents from storage
      const { data: docs } = await supabase
        .from('loan_documents')
        .select('id')
        .eq('loan_id', loan.id);

      if (docs && docs.length > 0) {
        // Delete each document's folder and all files inside
        for (const doc of docs) {
          try {
            const folderPath = `${loan.id}/${doc.id}`;
            
            // List all files in the document folder
            const { data: fileList, error: listError } = await supabase.storage
              .from('loan-documents')
              .list(folderPath);

            if (!listError && fileList && fileList.length > 0) {
              const filePaths = fileList.map(file => `${folderPath}/${file.name}`);
              await supabase.storage
                .from('loan-documents')
                .remove(filePaths);
            }
          } catch (docErr) {
            console.error('Error deleting document folder:', docErr);
          }
        }
      }

      // Delete loan from database (documents will be deleted via cascade)
      const { error } = await supabase
        .from('loans')
        .delete()
        .eq('id', loan.id);

      if (error) throw error;

      await fetchLoans();
    } catch (err) {
      console.error('Error deleting loan:', err);
      alert('Không thể xóa dự án. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocument = async (doc) => {
    try {
      const { data, error } = await supabase.storage
        .from('loan-documents')
        .download(doc.file_url);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading document:', err);
      alert('Không thể tải xuống tài liệu. Vui lòng thử lại.');
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
    } catch (err) {
      console.error('Error previewing document:', err);
      alert('Không thể xem trước file: ' + err.message);
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
      await fetchLoanDocuments(selectedLoan.id);
    } catch (err) {
      console.error('Error deleting document:', err);
      alert('Không thể xóa tài liệu. Vui lòng thử lại.');
    }
  };

  const handleAddDocumentFiles = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles = [];
    let hasError = false;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" vượt quá 10MB`);
        hasError = true;
        break;
      }

      // Validate file type (PDF, images, Word, Excel)
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (!allowedTypes.includes(file.type)) {
        alert(`File "${file.name}" không đúng định dạng. Chỉ chấp nhận PDF, Word, Excel hoặc ảnh`);
        hasError = true;
        break;
      }

      newFiles.push(file);
    }

    if (!hasError) {
      setNewDocumentFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveNewDocumentFile = (index) => {
    setNewDocumentFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Sanitize filename to remove Vietnamese accents and special characters
  const sanitizeFileName = (fileName) => {
    // Remove Vietnamese accents
    const from = "àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềấệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ";
    const to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyydAAAAAAAAAAAAAAAAAEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYD";
    
    let sanitized = fileName;
    for (let i = 0; i < from.length; i++) {
      sanitized = sanitized.replace(new RegExp(from[i], 'g'), to[i]);
    }
    
    // Replace spaces and special chars with underscore
    sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    // Remove multiple consecutive underscores
    sanitized = sanitized.replace(/_+/g, '_');
    
    return sanitized;
  };

  const handleUploadNewDocuments = async () => {
    if (newDocumentFiles.length === 0) {
      alert('Vui lòng chọn ít nhất một file');
      return;
    }

    try {
      setUploadingNewDoc(true);

      for (const file of newDocumentFiles) {
        const docId = crypto.randomUUID();
        const sanitizedFileName = sanitizeFileName(file.name);
        const filePath = `${selectedLoan.id}/${docId}/${sanitizedFileName}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('loan-documents')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Insert document record
        const { error: insertError } = await supabase
          .from('loan_documents')
          .insert({
            id: docId,
            loan_id: selectedLoan.id,
            document_type: newDocumentType,
            file_url: filePath,
            file_name: file.name,
            file_size: file.size,
            mime_type: file.type,
            is_verified: false
          });

        if (insertError) {
          // If insert fails, delete the uploaded file
          await supabase.storage
            .from('loan-documents')
            .remove([filePath]);
          throw insertError;
        }
      }

      alert('Đã tải lên tài liệu thành công!');
      setNewDocumentFiles([]);
      setNewDocumentType('business_license');
      setShowAddDocumentBox(false);
      await fetchLoanDocuments(selectedLoan.id);
    } catch (err) {
      console.error('Error uploading documents:', err);
      alert('Không thể tải lên tài liệu. Vui lòng thử lại.');
    } finally {
      setUploadingNewDoc(false);
    }
  };

  if (loading) {
    return (
      <div className="loan-management-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loan-management-container">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="btn-retry" onClick={fetchLoans}>Thử lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="loan-management-container">
      <div className="loan-management-header">
        <button className="btn-back" onClick={() => navigate('/dashboard', { state: { userRole } })}>
          <FaArrowLeft /> Quay lại
        </button>
        <h1>Quản lý dự án vay</h1>
      </div>

      <div className="filter-section">
        <div className="filter-buttons">
          <button 
            className={statusFilter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setStatusFilter('all')}
          >
            Tất cả ({loans.length})
          </button>
          <button 
            className={statusFilter === 'pending' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setStatusFilter('pending')}
          >
            Chờ duyệt ({loans.filter(l => l.status === 'pending').length})
          </button>
          <button 
            className={statusFilter === 'approved' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setStatusFilter('approved')}
          >
            Đã duyệt ({loans.filter(l => l.status === 'approved').length})
          </button>
          <button 
            className={statusFilter === 'funding' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setStatusFilter('funding')}
          >
            Đang gọi vốn ({loans.filter(l => l.status === 'funding').length})
          </button>
          <button 
            className={statusFilter === 'active' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setStatusFilter('active')}
          >
            Đang hoạt động ({loans.filter(l => l.status === 'active').length})
          </button>
          <button 
            className={statusFilter === 'completed' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setStatusFilter('completed')}
          >
            Đã hoàn thành ({loans.filter(l => l.status === 'completed').length})
          </button>
        </div>
      </div>

      <div className="loans-list">
        {filteredLoans.map(loan => {
          const fundingProgress = calculateFundingProgress(loan.funded_amount, loan.amount);
          
          return (
            <div key={loan.id} className="loan-management-card">
              <div className="loan-card-header">
                <div>
                  <h3>{loan.project_name}</h3>
                  <div className="loan-meta">
                    <span className={`status-badge ${getStatusBadge(loan.status).class}`}>
                      {getStatusBadge(loan.status).text}
                    </span>
                    <span className="package-badge">{getPackageName(loan.package)}</span>
                  </div>
                </div>
                <div className="loan-actions">
                  <button className="action-btn" onClick={() => handleViewDetail(loan)} title="Xem chi tiết">
                    <FaEye /> Xem
                  </button>
                  <button className="action-btn" onClick={() => handleViewDocuments(loan)} title="Xem tài liệu">
                    <FaFileAlt /> Tài liệu
                  </button>
                  {loan.status === 'pending' && (
                    <button className="action-btn delete" onClick={() => handleDelete(loan)} title="Xóa">
                      <FaTrash /> Xóa
                    </button>
                  )}
                </div>
              </div>

              <div className="loan-card-body">
                {loan.image_url && (
                  <div className="loan-image">
                    <img src={loan.image_url} alt={loan.project_name} />
                  </div>
                )}

                <div className="info-grid">
                  <div className="info-item">
                    <BiMoney className="info-icon" />
                    <div>
                      <span className="info-label">Số tiền vay</span>
                      <span className="info-value">{formatCurrency(loan.amount)}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <BiTime className="info-icon" />
                    <div>
                      <span className="info-label">Thời hạn</span>
                      <span className="info-value">{loan.term_months} tháng</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <div>
                      <span className="info-label">Lãi suất</span>
                      <span className="info-value">{loan.interest_rate}%/năm</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Tiến độ huy động</span>
                    <div className="progress-bar-small">
                      <div className="progress-fill" style={{ width: `${fundingProgress}%` }}></div>
                    </div>
                    <span className="progress-text">{fundingProgress}% ({formatCurrency(loan.funded_amount)} / {formatCurrency(loan.amount)})</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Công ty</span>
                    <span className="info-value">{loan.company_name}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Người đại diện</span>
                    <span className="info-value">{loan.representative_name}</span>
                  </div>
                </div>

                {loan.status === 'pending' && (
                  <div className="pending-notice">
                    <p>📋 Dự án đang chờ được duyệt. Chúng tôi sẽ thông báo khi dự án được phê duyệt.</p>
                  </div>
                )}

                {loan.status === 'rejected' && (
                  <div className="rejected-notice">
                    <p>❌ Dự án đã bị từ chối. Vui lòng liên hệ với quản trị viên để biết thêm chi tiết.</p>
                  </div>
                )}

                {loan.status === 'funding' && (
                  <div className="funding-notice">
                    <p>💰 Dự án đang gọi vốn. Nhà đầu tư có thể đầu tư vào dự án này.</p>
                  </div>
                )}

                {loan.status === 'active' && loan.start_date && (
                  <div className="active-notice">
                    <p>✅ Dự án đang hoạt động từ {formatDate(loan.start_date)}</p>
                  </div>
                )}
              </div>

              <div className="loan-card-footer">
                <span>Ngày tạo: {formatDate(loan.created_at)}</span>
                {loan.start_date && <span>Ngày bắt đầu: {formatDate(loan.start_date)}</span>}
                {loan.end_date && <span>Ngày kết thúc: {formatDate(loan.end_date)}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {filteredLoans.length === 0 && (
        <div className="no-results">
          <p>Không có dự án nào</p>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedLoan && (
        <div className="modal-overlay" onClick={() => !editMode && setShowDetailModal(false)}>
          <div className="modal-content detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? 'Chỉnh sửa dự án' : 'Chi tiết dự án'}</h2>
              <button className="btn-close" onClick={() => {
                if (editMode) {
                  handleCancelEdit();
                }
                setShowDetailModal(false);
              }}>×</button>
            </div>
            
            <div className="modal-body">
              {!editMode ? (
                // View Mode
                <>
                  <h3>{selectedLoan.project_name}</h3>
                  
                  {selectedLoan.image_url && (
                    <div className="modal-image">
                      <img src={selectedLoan.image_url} alt={selectedLoan.project_name} />
                    </div>
                  )}

              <div className="detail-section">
                <h4>Thông tin cơ bản</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Trạng thái:</span>
                    <span className={`status-badge ${getStatusBadge(selectedLoan.status).class}`}>
                      {getStatusBadge(selectedLoan.status).text}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">Gói vay:</span>
                    <strong>{getPackageName(selectedLoan.package)}</strong>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">Số tiền vay:</span>
                    <strong className="highlight">{formatCurrency(selectedLoan.amount)}</strong>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">Lãi suất:</span>
                    <strong>{selectedLoan.interest_rate}%/năm</strong>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">Thời hạn:</span>
                    <strong>{selectedLoan.term_months} tháng</strong>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">Phương thức trả nợ:</span>
                    <strong>
                      {selectedLoan.repayment_method === 'monthly' && 'Hàng tháng'}
                      {selectedLoan.repayment_method === 'quarterly' && 'Hàng quý'}
                      {selectedLoan.repayment_method === 'end_term' && 'Cuối kỳ'}
                    </strong>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">Đã huy động:</span>
                    <strong>{formatCurrency(selectedLoan.funded_amount)}</strong>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">Tiến độ:</span>
                    <strong>{calculateFundingProgress(selectedLoan.funded_amount, selectedLoan.amount)}%</strong>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Mô tả dự án</h4>
                <p className="description-text">{selectedLoan.detailed_description}</p>
              </div>

              <div className="detail-section">
                <h4>Mục đích vay</h4>
                <p className="description-text">{selectedLoan.loan_purpose}</p>
              </div>

              <div className="detail-section">
                <h4>Thông tin công ty</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Tên công ty:</span>
                    <strong>{selectedLoan.company_name}</strong>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">Loại hình kinh doanh:</span>
                    <strong>{selectedLoan.business_type}</strong>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">Địa chỉ:</span>
                    <strong>{selectedLoan.business_address}</strong>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">Mã số ĐKKD:</span>
                    <strong>{selectedLoan.business_registration_number}</strong>
                  </div>

                  {selectedLoan.company_founded_year && (
                    <div className="detail-item">
                      <span className="label">Năm thành lập:</span>
                      <strong>{selectedLoan.company_founded_year}</strong>
                    </div>
                  )}

                  {selectedLoan.company_employees && (
                    <div className="detail-item">
                      <span className="label">Số nhân viên:</span>
                      <strong>{selectedLoan.company_employees} người</strong>
                    </div>
                  )}

                  {selectedLoan.company_revenue_2024 && (
                    <div className="detail-item">
                      <span className="label">Doanh thu 2024:</span>
                      <strong>{formatCurrency(selectedLoan.company_revenue_2024)}</strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h4>Người đại diện</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Họ tên:</span>
                    <strong>{selectedLoan.representative_name}</strong>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">Chức vụ:</span>
                    <strong>{selectedLoan.representative_position}</strong>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">Điện thoại:</span>
                    <strong>{selectedLoan.representative_phone}</strong>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">Email:</span>
                    <strong>{selectedLoan.representative_email}</strong>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Thời gian</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Ngày tạo:</span>
                    <strong>{formatDate(selectedLoan.created_at)}</strong>
                  </div>
                  
                  {selectedLoan.start_date && (
                    <div className="detail-item">
                      <span className="label">Ngày bắt đầu:</span>
                      <strong>{formatDate(selectedLoan.start_date)}</strong>
                    </div>
                  )}
                  
                  {selectedLoan.end_date && (
                    <div className="detail-item">
                      <span className="label">Ngày kết thúc:</span>
                      <strong>{formatDate(selectedLoan.end_date)}</strong>
                    </div>
                  )}
                  
                  {selectedLoan.funded_date && (
                    <div className="detail-item">
                      <span className="label">Ngày huy động đủ:</span>
                      <strong>{formatDate(selectedLoan.funded_date)}</strong>
                    </div>
                  )}
                </div>
              </div>

              {selectedLoan.status === 'pending' && (
                <div className="modal-notice pending">
                  <p>📋 Dự án đang chờ được duyệt. Chúng tôi sẽ thông báo khi dự án được phê duyệt.</p>
                </div>
              )}

              {selectedLoan.status === 'completed' && (
                <div className="modal-notice completed">
                  <p>✅ Dự án đã hoàn thành. Cảm ơn bạn đã sử dụng dịch vụ!</p>
                </div>
              )}
                </>
              ) : (
                // Edit Mode
                <div className="edit-loan-form">
                  <div className="form-section">
                    <label>Tên dự án:</label>
                    <input
                      type="text"
                      value={editedLoan.project_name}
                      onChange={(e) => setEditedLoan({...editedLoan, project_name: e.target.value})}
                      disabled={savingEdit}
                    />
                  </div>

                  {editImagePreview && (
                    <div className="modal-image">
                      <img src={editImagePreview} alt="Preview" />
                    </div>
                  )}

                  <div className="form-section">
                    <label>Đổi ảnh dự án:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      disabled={savingEdit}
                    />
                  </div>

                  <div className="form-section">
                    <label>Gói vay:</label>
                    <select
                      value={editedLoan.package}
                      onChange={(e) => setEditedLoan({...editedLoan, package: e.target.value})}
                      disabled={savingEdit}
                    >
                      <option value="green-agriculture">Nông nghiệp xanh</option>
                      <option value="renewable-energy">Năng lượng tái tạo</option>
                      <option value="environmental-tech">Công nghệ môi trường</option>
                      <option value="sustainable-consumption">Tiêu dùng bền vững</option>
                    </select>
                  </div>

                  <div className="form-section">
                    <label>Mô tả chi tiết:</label>
                    <textarea
                      rows={4}
                      value={editedLoan.detailed_description}
                      onChange={(e) => setEditedLoan({...editedLoan, detailed_description: e.target.value})}
                      disabled={savingEdit}
                    />
                  </div>

                  <div className="form-section">
                    <label>Mục đích vay:</label>
                    <textarea
                      rows={3}
                      value={editedLoan.loan_purpose}
                      onChange={(e) => setEditedLoan({...editedLoan, loan_purpose: e.target.value})}
                      disabled={savingEdit}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-section">
                      <label>Số tiền vay (VNĐ):</label>
                      <input
                        type="number"
                        value={editedLoan.amount}
                        onChange={(e) => setEditedLoan({...editedLoan, amount: e.target.value})}
                        disabled={savingEdit}
                      />
                    </div>

                    <div className="form-section">
                      <label>Lãi suất (%/năm):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editedLoan.interest_rate}
                        onChange={(e) => setEditedLoan({...editedLoan, interest_rate: e.target.value})}
                        disabled={savingEdit}
                      />
                    </div>

                    <div className="form-section">
                      <label>Thời hạn (tháng):</label>
                      <input
                        type="number"
                        value={editedLoan.term_months}
                        onChange={(e) => setEditedLoan({...editedLoan, term_months: e.target.value})}
                        disabled={savingEdit}
                      />
                    </div>
                  </div>

                  <div className="form-section">
                    <label>Phương thức trả nợ:</label>
                    <select
                      value={editedLoan.repayment_method}
                      onChange={(e) => setEditedLoan({...editedLoan, repayment_method: e.target.value})}
                      disabled={savingEdit}
                    >
                      <option value="monthly">Hàng tháng</option>
                      <option value="quarterly">Hàng quý</option>
                      <option value="end_term">Cuối kỳ</option>
                    </select>
                  </div>

                  <h4 className="section-title">Thông tin công ty</h4>

                  <div className="form-section">
                    <label>Tên công ty:</label>
                    <input
                      type="text"
                      value={editedLoan.company_name}
                      onChange={(e) => setEditedLoan({...editedLoan, company_name: e.target.value})}
                      disabled={savingEdit}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-section">
                      <label>Loại hình kinh doanh:</label>
                      <input
                        type="text"
                        value={editedLoan.business_type}
                        onChange={(e) => setEditedLoan({...editedLoan, business_type: e.target.value})}
                        disabled={savingEdit}
                      />
                    </div>

                    <div className="form-section">
                      <label>Mã số ĐKKD:</label>
                      <input
                        type="text"
                        value={editedLoan.business_registration_number}
                        onChange={(e) => setEditedLoan({...editedLoan, business_registration_number: e.target.value})}
                        disabled={savingEdit}
                      />
                    </div>
                  </div>

                  <div className="form-section">
                    <label>Địa chỉ:</label>
                    <input
                      type="text"
                      value={editedLoan.business_address}
                      onChange={(e) => setEditedLoan({...editedLoan, business_address: e.target.value})}
                      disabled={savingEdit}
                    />
                  </div>

                  <h4 className="section-title">Người đại diện</h4>

                  <div className="form-row">
                    <div className="form-section">
                      <label>Họ tên:</label>
                      <input
                        type="text"
                        value={editedLoan.representative_name}
                        onChange={(e) => setEditedLoan({...editedLoan, representative_name: e.target.value})}
                        disabled={savingEdit}
                      />
                    </div>

                    <div className="form-section">
                      <label>Chức vụ:</label>
                      <input
                        type="text"
                        value={editedLoan.representative_position}
                        onChange={(e) => setEditedLoan({...editedLoan, representative_position: e.target.value})}
                        disabled={savingEdit}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-section">
                      <label>Điện thoại:</label>
                      <input
                        type="tel"
                        value={editedLoan.representative_phone}
                        onChange={(e) => setEditedLoan({...editedLoan, representative_phone: e.target.value})}
                        disabled={savingEdit}
                      />
                    </div>

                    <div className="form-section">
                      <label>Email:</label>
                      <input
                        type="email"
                        value={editedLoan.representative_email}
                        onChange={(e) => setEditedLoan({...editedLoan, representative_email: e.target.value})}
                        disabled={savingEdit}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {selectedLoan.status === 'pending' && !editMode && (
              <div className="modal-footer">
                <button 
                  className="btn-edit-loan" 
                  onClick={handleStartEdit}
                >
                  <FaEdit /> Sửa dự án
                </button>
              </div>
            )}

            {editMode && (
              <div className="modal-footer">
                <button 
                  className="btn-secondary" 
                  onClick={handleCancelEdit}
                  disabled={savingEdit}
                >
                  Hủy
                </button>
                <button 
                  className="btn-primary" 
                  onClick={handleSaveEdit}
                  disabled={savingEdit}
                >
                  {savingEdit ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Documents Modal */}
      {showDocumentsModal && selectedLoan && (
        <div className="modal-overlay" onClick={() => setShowDocumentsModal(false)}>
          <div className="modal-content documents-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Tài liệu dự án: {selectedLoan.project_name}</h2>
              <button className="btn-close" onClick={() => setShowDocumentsModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              {loadingDocuments ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Đang tải tài liệu...</p>
                </div>
              ) : loanDocuments.length > 0 ? (
                <div className="documents-list-full">
                  {loanDocuments.map(doc => (
                    <div key={doc.id} className="document-card">
                      <div className="document-header">
                        <div className="doc-icon-large">
                          {getDocumentIcon(doc.mime_type)}
                        </div>
                        <div className="document-details">
                          <h4>{doc.file_name}</h4>
                          <p className="doc-type">{getDocumentTypeName(doc.document_type)}</p>
                        </div>
                      </div>
                      
                      <div className="document-meta-grid">
                        <div className="meta-item">
                          <span className="meta-label">Kích thước:</span>
                          <span className="meta-value">{(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                        
                        <div className="meta-item">
                          <span className="meta-label">Định dạng:</span>
                          <span className="meta-value">{doc.mime_type}</span>
                        </div>
                        
                        <div className="meta-item">
                          <span className="meta-label">Ngày tải lên:</span>
                          <span className="meta-value">{formatDate(doc.created_at)}</span>
                        </div>
                        
                        <div className="meta-item">
                          <span className="meta-label">Trạng thái:</span>
                          <span className={`verification-badge ${doc.is_verified ? 'verified' : 'not-verified'}`}>
                            {doc.is_verified ? (
                              <>
                                <FaCheckCircle /> Đã xác minh
                              </>
                            ) : (
                              <>
                                <FaTimesCircle /> Chưa xác minh
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      {doc.is_verified && doc.verification_note && (
                        <div className="verification-note">
                          <strong>Ghi chú xác minh:</strong>
                          <p>{doc.verification_note}</p>
                          <span className="verified-info">
                            Xác minh bởi: Admin • {formatDate(doc.verified_at)}
                          </span>
                        </div>
                      )}
                      
                      <div className="document-actions">
                        <button 
                          className="btn-doc-action btn-preview" 
                          onClick={() => handlePreviewDocument(doc)}
                          title="Xem trước"
                        >
                          <FaEye /> Xem trước
                        </button>
                        <button 
                          className="btn-doc-action btn-download-doc" 
                          onClick={() => handleDownloadDocument(doc)}
                          title="Tải xuống"
                        >
                          <FaDownload /> Tải xuống
                        </button>
                        {!doc.is_verified && (
                          <button 
                            className="btn-doc-action btn-delete-doc" 
                            onClick={() => handleDeleteDocument(doc)}
                            title="Xóa tài liệu"
                          >
                            <FaTrash /> Xóa
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-documents-full">
                  <FaFileAlt className="no-docs-icon" />
                  <p>Chưa có tài liệu nào cho dự án này</p>
                </div>
              )}

              {/* Add Document Section */}
              <div className="add-document-box">
                <div 
                  className="add-document-header clickable" 
                  onClick={() => {
                    if (showAddDocumentBox) {
                      // Reset when closing
                      setNewDocumentFiles([]);
                      setNewDocumentType('business_license');
                    }
                    setShowAddDocumentBox(!showAddDocumentBox);
                  }}
                >
                  <h4>
                    <FaFileAlt style={{ marginRight: '8px', color: '#16a34a' }} />
                    Thêm tài liệu mới
                  </h4>
                  <div className="btn-toggle-box">
                    {showAddDocumentBox ? <FaTimes /> : <FaPlus />}
                  </div>
                </div>

                {showAddDocumentBox && (
                  <div className="add-document-body">
                    <div className="form-group-doc">
                      <label>Loại tài liệu:</label>
                      <select 
                        value={newDocumentType} 
                        onChange={(e) => setNewDocumentType(e.target.value)}
                        disabled={uploadingNewDoc}
                      >
                        <option value="business_license">Giấy phép kinh doanh</option>
                        <option value="financial_report">Báo cáo tài chính</option>
                        <option value="related_contract">Hợp đồng liên quan</option>
                        <option value="id_card">CMND/CCCD</option>
                        <option value="tax_certificate">Giấy tờ thuế</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>

                    <div className="form-group-doc">
                      <label>Chọn file:</label>
                      <div className="file-upload-box">
                        <input
                          type="file"
                          id="newDocFiles"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                          onChange={handleAddDocumentFiles}
                          disabled={uploadingNewDoc}
                          style={{ display: 'none' }}
                        />
                        <label htmlFor="newDocFiles" className="file-upload-label">
                          <FaUpload />
                          <span>Chọn file (PDF, Ảnh, Word, Excel)</span>
                        </label>
                      </div>
                    </div>

                    {newDocumentFiles.length > 0 && (
                      <div className="selected-files">
                        <p className="selected-files-title">Đã chọn {newDocumentFiles.length} file:</p>
                        {newDocumentFiles.map((file, index) => (
                          <div key={index} className="selected-file-item">
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                            <button
                              className="btn-remove-file"
                              onClick={() => handleRemoveNewDocumentFile(index)}
                              disabled={uploadingNewDoc}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <button 
                      className="btn-upload-documents" 
                      onClick={handleUploadNewDocuments}
                      disabled={uploadingNewDoc || newDocumentFiles.length === 0}
                    >
                      {uploadingNewDoc ? (
                        <>
                          <div className="spinner-small"></div>
                          Đang tải lên...
                        </>
                      ) : (
                        <>
                          <FaUpload /> Tải lên tài liệu
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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

export default LoanManagement;
