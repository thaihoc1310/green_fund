import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaArrowLeft, FaBuilding, FaLeaf, FaUpload, FaInfoCircle, FaTimes, FaPlus } from 'react-icons/fa';
import { BiMoney } from 'react-icons/bi';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import './CreateLoan.css';

const CreateLoan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = location.state?.userRole || 'borrower';
  const { user, deleteImageFromStorage } = useAuth();
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      interestRate: 8,
      termMonths: 12,
      repaymentMethod: 'monthly'
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Documents state
  const [documentRows, setDocumentRows] = useState([
    { id: 1, docType: 'business_license', files: [] }
  ]); // Mỗi row có files riêng
  const [uploadingDocument, setUploadingDocument] = useState(false);

  const onSubmit = async (data) => {
    if (!user) {
      setErrorMessage('Vui lòng đăng nhập để tạo khoản vay');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      let imageUrl = null;

      // Upload image nếu có
      if (imageFile) {
        setUploadingImage(true);
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
          .from('loan-images')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('loan-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
        setUploadingImage(false);
      }

      // Tạo loan record
      const { data: loanData, error: insertError } = await supabase
        .from('loans')
        .insert({
          borrower_id: user.id,
          project_name: data.projectName,
          package: data.package,
          detailed_description: data.detailedDescription,
          company_name: data.companyName,
          business_type: data.businessType,
          business_address: data.businessAddress,
          business_registration_number: data.businessRegistrationNumber,
          company_founded_year: data.companyFoundedYear ? parseInt(data.companyFoundedYear) : null,
          company_employees: data.companyEmployees ? parseInt(data.companyEmployees) : null,
          company_revenue_2024: data.companyRevenue2024 ? parseFloat(data.companyRevenue2024) : null,
          representative_name: data.representativeName,
          representative_position: data.representativePosition,
          representative_phone: data.representativePhone,
          representative_email: data.representativeEmail,
          loan_purpose: data.loanPurpose,
          amount: parseFloat(data.amount),
          interest_rate: parseFloat(data.interestRate),
          term_months: parseInt(data.termMonths),
          repayment_method: data.repaymentMethod,
          image_url: imageUrl,
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const loanId = loanData.id;

      // Upload documents nếu có
      if (documentRows.length > 0) {
        setUploadingDocument(true);
        
        // Lấy tất cả files từ tất cả rows và lọc ra files hợp lệ
        const allFiles = documentRows
          .flatMap(row => row.files)
          .filter(file => file && file.file && file.fileName);
        
        for (const doc of allFiles) {
          try {
            // Generate unique document ID
            const docId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
            
            // Sanitize filename for storage
            const sanitizedFileName = sanitizeFileName(doc.fileName);
            
            // Upload file to storage: loan-documents/<loan_id>/<doc_id>/<filename>
            const filePath = `${loanId}/${docId}/${sanitizedFileName}`;
            
            const { error: uploadDocError } = await supabase.storage
              .from('loan-documents')
              .upload(filePath, doc.file, {
                cacheControl: '3600',
                upsert: false
              });

            if (uploadDocError) {
              console.error('Error uploading document:', uploadDocError);
              continue; // Skip this document but continue with others
            }

            // Get file URL (for private bucket, we store the path)
            const fileUrl = filePath;

            // Insert document record into loan_documents table
            const { error: insertDocError } = await supabase
              .from('loan_documents')
              .insert({
                loan_id: loanId,
                document_type: doc.documentType,
                file_url: fileUrl,
                file_name: doc.fileName,
                file_size: doc.fileSize,
                mime_type: doc.mimeType,
                is_verified: false
              });

            if (insertDocError) {
              console.error('Error inserting document record:', insertDocError);
              // If insert fails, try to delete the uploaded file
              await supabase.storage
                .from('loan-documents')
                .remove([filePath]);
            }
          } catch (docError) {
            console.error('Error processing document:', doc.fileName, docError);
            // Continue with next document
          }
        }
        
        setUploadingDocument(false);
      }

      alert('Yêu cầu vay vốn và tài liệu đã được gửi thành công! Vui lòng đợi admin phê duyệt.');
      navigate('/loan-management', { state: { userRole } });
    } catch (error) {
      console.error('Error creating loan:', error);
      setErrorMessage(error.message || 'Đã xảy ra lỗi khi tạo khoản vay');
    } finally {
      setLoading(false);
      setUploadingImage(false);
      setUploadingDocument(false);
    }
  };


  // Handle image upload
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Vui lòng chọn file ảnh hợp lệ');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrorMessage('');
  };

  // Handle document upload - Chỉ thêm vào state của row đó
  const handleDocumentChange = (event, rowId) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Lấy row hiện tại
    const currentRow = documentRows.find(row => row.id === rowId);
    if (!currentRow) return;

    const newDocuments = [];
    let hasError = false;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(`File "${file.name}" vượt quá 10MB`);
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
        setErrorMessage(`File "${file.name}" không đúng định dạng. Chỉ chấp nhận PDF, Word, Excel hoặc ảnh`);
        hasError = true;
        break;
      }

      // Add to new documents list
      newDocuments.push({
        id: `${Date.now()}-${i}-${Math.random().toString(36).substring(7)}`,
        file: file,
        documentType: currentRow.docType,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type
      });
    }

    if (!hasError && newDocuments.length > 0) {
      // Thêm files vào row hiện tại
      setDocumentRows(documentRows.map(row => 
        row.id === rowId 
          ? { ...row, files: [...row.files, ...newDocuments] }
          : row
      ));
      setErrorMessage('');
    }

    event.target.value = ''; // Reset input
  };

  // Change document type for a specific row
  const handleDocTypeChange = (rowId, newDocType) => {
    setDocumentRows(documentRows.map(row => 
      row.id === rowId ? { ...row, docType: newDocType } : row
    ));
  };

  // Add new document row
  const addDocumentRow = () => {
    const newRow = {
      id: Date.now(),
      docType: 'business_license',
      files: []
    };
    setDocumentRows([...documentRows, newRow]);
  };

  // Remove document from a specific row
  const removeDocument = (rowId, docId) => {
    setDocumentRows(prevRows => {
      const updatedRows = prevRows.map(row => {
        if (row.id === rowId) {
          const filteredFiles = row.files.filter(file => file.id !== docId);
          return { ...row, files: filteredFiles };
        }
        return row;
      });
      return updatedRows;
    });
  };

  // Get document type label
  const getDocumentTypeLabel = (type) => {
    const labels = {
      'business_license': 'Giấy phép ĐKKD',
      'financial_report': 'Báo cáo tài chính',
      'related_contract': 'Hợp đồng liên quan',
      'id_card': 'CCCD/CMND',
      'tax_certificate': 'Giấy tờ thuế',
      'other': 'Khác'
    };
    return labels[type] || type;
  };

  // Format file size
  // Sanitize filename for storage (remove Vietnamese accents and special chars)
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const loanAmount = watch('amount', 0);
  const interestRate = watch('interestRate', 8);
  const loanTerm = watch('termMonths', 12);

  const calculateMonthlyPayment = () => {
    if (!loanAmount || !interestRate || !loanTerm) return 0;
    const principal = parseFloat(loanAmount);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const numPayments = parseInt(loanTerm);
    
    if (monthlyRate === 0) return principal / numPayments;
    
    const monthlyPayment = 
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    return isNaN(monthlyPayment) ? 0 : monthlyPayment;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="create-loan-container">
      <div className="create-loan-header">
        <button className="btn-back" onClick={() => navigate('/dashboard', { state: { userRole } })}>
          <FaArrowLeft /> Quay lại
        </button>
        <h1>Tạo yêu cầu vay vốn xanh</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="loan-form">
        {errorMessage && (
          <div className="form-card error-card">
            <p style={{ color: '#dc2626', margin: 0 }}>{errorMessage}</p>
          </div>
        )}

        {/* Thông tin dự án */}
        <div className="form-card">
          <h2><FaBuilding /> Thông tin dự án</h2>
          
          <div className="input-group">
            <label>Tên dự án *</label>
            <input
              type="text"
              {...register('projectName', { 
                required: 'Vui lòng nhập tên dự án',
                minLength: { value: 10, message: 'Tên dự án phải có ít nhất 10 ký tự' },
                maxLength: { value: 500, message: 'Tên dự án không vượt quá 500 ký tự' }
              })}
              placeholder="VD: Dự án năng lượng mặt trời Ninh Thuận"
            />
            {errors.projectName && <span className="error">{errors.projectName.message}</span>}
          </div>

          <div className="input-group">
            <label>Gói vay xanh *</label>
            <select {...register('package', { required: 'Vui lòng chọn gói vay' })}>
              <option value="">-- Chọn gói vay --</option>
              <option value="green-agriculture">Nông nghiệp xanh</option>
              <option value="renewable-energy">Năng lượng tái tạo</option>
              <option value="environmental-tech">Công nghệ môi trường</option>
              <option value="sustainable-consumption">Tiêu dùng bền vững</option>
            </select>
            {errors.package && <span className="error">{errors.package.message}</span>}
          </div>

          <div className="input-group">
            <label>Mô tả chi tiết dự án *</label>
            <textarea
              {...register('detailedDescription', { 
                required: 'Vui lòng nhập mô tả dự án',
                minLength: { value: 100, message: 'Mô tả phải có ít nhất 100 ký tự' }
              })}
              placeholder="Mô tả toàn diện về dự án: mục tiêu, lợi ích môi trường, tác động xã hội..."
              rows="6"
            ></textarea>
            {errors.detailedDescription && <span className="error">{errors.detailedDescription.message}</span>}
          </div>

          <div className="input-group">
            <label>Ảnh dự án (tùy chọn)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" style={{ maxWidth: '300px', maxHeight: '200px', borderRadius: '8px', marginTop: '10px' }} />
              </div>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
              Tối đa 5MB, định dạng: JPG, PNG
            </small>
          </div>
        </div>

        {/* Tài liệu khoản vay */}
        <div className="form-card">
          <h2><FaUpload /> Tài liệu khoản vay</h2>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
            Vui lòng upload các tài liệu cần thiết để chứng minh tính khả thi của dự án. Có thể upload nhiều file cho mỗi loại tài liệu.
          </p>

          {/* Document Rows */}
          {documentRows.map((row, index) => (
            <div key={row.id} className="document-upload-row">
              <div className="form-row">
                <div className="input-group" style={{ flex: 1 }}>
                  <label>Loại tài liệu</label>
                  <select 
                    value={row.docType} 
                    onChange={(e) => handleDocTypeChange(row.id, e.target.value)}
                    className="doc-type-select"
                  >
                    <option value="business_license">Giấy phép ĐKKD</option>
                    <option value="financial_report">Báo cáo tài chính</option>
                    <option value="id_card">CCCD/CMND</option>
                    <option value="tax_certificate">Giấy tờ thuế</option>
                    <option value="related_contract">Hợp đồng liên quan</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="input-group" style={{ flex: 2 }}>
                  <label>Chọn file (có thể chọn nhiều)</label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      id={`file-input-${row.id}`}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      onChange={(e) => handleDocumentChange(e, row.id)}
                      className="file-input-hidden"
                      disabled={uploadingDocument}
                      multiple
                    />
                    <label htmlFor={`file-input-${row.id}`} className="btn-choose-file">
                      <FaPlus /> Thêm file
                    </label>
                  </div>
                  <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
                    Định dạng: PDF, Word, Excel, JPG, PNG. Tối đa 10MB/file
                  </small>
                </div>
              </div>

              {/* Files đã chọn cho row này */}
              {row.files.length > 0 && (
                <div className="row-files-list">
                  {row.files.map((doc) => (
                    <div key={doc.id} className="document-item">
                      <div className="document-icon">
                        {doc.mimeType.includes('pdf') && '📄'}
                        {doc.mimeType.includes('image') && '🖼️'}
                        {doc.mimeType.includes('word') && '📝'}
                        {doc.mimeType.includes('sheet') && '📊'}
                      </div>
                      <div className="document-info">
                        <div className="document-name">{doc.fileName}</div>
                        <div className="document-meta">
                          <span className="document-size">{formatFileSize(doc.fileSize)}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn-remove-doc"
                        onClick={() => removeDocument(row.id, doc.id)}
                        title="Xóa tài liệu"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Nút Thêm Loại Tài Liệu */}
          <button
            type="button"
            className="btn-add-doc-row"
            onClick={addDocumentRow}
            disabled={uploadingDocument}
          >
            <FaPlus /> Thêm loại tài liệu
          </button>
        </div>

        {/* Thông tin doanh nghiệp */}
        <div className="form-card">
          <h2><FaBuilding /> Thông tin doanh nghiệp</h2>

          <div className="input-group">
            <label>Tên doanh nghiệp *</label>
            <input
              type="text"
              {...register('companyName', { 
                required: 'Vui lòng nhập tên doanh nghiệp',
                maxLength: { value: 255, message: 'Tên doanh nghiệp không vượt quá 255 ký tự' }
              })}
              placeholder="Công ty TNHH..."
            />
            {errors.companyName && <span className="error">{errors.companyName.message}</span>}
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Loại hình doanh nghiệp *</label>
              <input
                type="text"
                {...register('businessType', { 
                  required: 'Vui lòng nhập loại hình doanh nghiệp',
                  maxLength: { value: 100, message: 'Không vượt quá 100 ký tự' }
                })}
                placeholder="VD: Công ty TNHH, Công ty Cổ phần, HTX..."
              />
              {errors.businessType && <span className="error">{errors.businessType.message}</span>}
            </div>

            <div className="input-group">
              <label>Số đăng ký kinh doanh *</label>
              <input
                type="text"
                {...register('businessRegistrationNumber', { 
                  required: 'Vui lòng nhập số đăng ký kinh doanh',
                  maxLength: { value: 50, message: 'Không vượt quá 50 ký tự' }
                })}
                placeholder="0123456789"
              />
              {errors.businessRegistrationNumber && <span className="error">{errors.businessRegistrationNumber.message}</span>}
            </div>
          </div>

          <div className="input-group">
            <label>Địa chỉ doanh nghiệp *</label>
            <input
              type="text"
              {...register('businessAddress', { 
                required: 'Vui lòng nhập địa chỉ doanh nghiệp',
                maxLength: { value: 500, message: 'Không vượt quá 500 ký tự' }
              })}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
            />
            {errors.businessAddress && <span className="error">{errors.businessAddress.message}</span>}
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Năm thành lập (tùy chọn)</label>
              <input
                type="number"
                {...register('companyFoundedYear', {
                  min: { value: 1900, message: 'Năm không hợp lệ' },
                  max: { value: new Date().getFullYear(), message: 'Năm không hợp lệ' }
                })}
                placeholder="2020"
                min="1900"
                max={new Date().getFullYear()}
              />
              {errors.companyFoundedYear && <span className="error">{errors.companyFoundedYear.message}</span>}
            </div>

            <div className="input-group">
              <label>Số lượng nhân viên (tùy chọn)</label>
              <input
                type="number"
                {...register('companyEmployees', {
                  min: { value: 0, message: 'Số lượng phải >= 0' }
                })}
                placeholder="50"
                min="0"
              />
              {errors.companyEmployees && <span className="error">{errors.companyEmployees.message}</span>}
            </div>
          </div>

          <div className="input-group">
            <label>Doanh thu năm 2024 (VND, tùy chọn)</label>
            <input
              type="number"
              {...register('companyRevenue2024', {
                min: { value: 0, message: 'Doanh thu phải >= 0' }
              })}
              placeholder="1000000000"
              step="1000000"
              min="0"
            />
            {errors.companyRevenue2024 && <span className="error">{errors.companyRevenue2024.message}</span>}
          </div>
        </div>

        {/* Người đại diện */}
        <div className="form-card">
          <h2><FaInfoCircle /> Thông tin người đại diện</h2>

          <div className="form-row">
            <div className="input-group">
              <label>Họ và tên *</label>
              <input
                type="text"
                {...register('representativeName', { 
                  required: 'Vui lòng nhập tên người đại diện',
                  maxLength: { value: 255, message: 'Không vượt quá 255 ký tự' }
                })}
                placeholder="Nguyễn Văn A"
              />
              {errors.representativeName && <span className="error">{errors.representativeName.message}</span>}
            </div>

            <div className="input-group">
              <label>Chức vụ *</label>
              <input
                type="text"
                {...register('representativePosition', { 
                  required: 'Vui lòng nhập chức vụ',
                  maxLength: { value: 100, message: 'Không vượt quá 100 ký tự' }
                })}
                placeholder="Giám đốc"
              />
              {errors.representativePosition && <span className="error">{errors.representativePosition.message}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Số điện thoại *</label>
              <input
                type="tel"
                {...register('representativePhone', { 
                  required: 'Vui lòng nhập số điện thoại',
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: 'Số điện thoại không hợp lệ (10-11 chữ số)'
                  },
                  maxLength: { value: 20, message: 'Không vượt quá 20 ký tự' }
                })}
                placeholder="0912345678"
              />
              {errors.representativePhone && <span className="error">{errors.representativePhone.message}</span>}
            </div>

            <div className="input-group">
              <label>Email *</label>
              <input
                type="email"
                {...register('representativeEmail', { 
                  required: 'Vui lòng nhập email',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email không hợp lệ'
                  },
                  maxLength: { value: 255, message: 'Không vượt quá 255 ký tự' }
                })}
                placeholder="nguyen.vana@company.com"
              />
              {errors.representativeEmail && <span className="error">{errors.representativeEmail.message}</span>}
            </div>
          </div>
        </div>

        {/* Thông tin vay */}
        <div className="form-card">
          <h2><BiMoney /> Thông tin khoản vay</h2>

          <div className="input-group">
            <label>Mục đích vay vốn *</label>
            <textarea
              {...register('loanPurpose', { 
                required: 'Vui lòng nhập mục đích vay',
                minLength: { value: 50, message: 'Mô tả phải có ít nhất 50 ký tự' }
              })}
              placeholder="Mô tả chi tiết mục đích sử dụng vốn vay, kế hoạch triển khai..."
              rows="4"
            ></textarea>
            {errors.loanPurpose && <span className="error">{errors.loanPurpose.message}</span>}
          </div>

          <div className="input-group">
            <label>Số tiền vay (VND) *</label>
            <input
              type="number"
              {...register('amount', { 
                required: 'Vui lòng nhập số tiền vay',
                min: { value: 1000000, message: 'Số tiền tối thiểu 1,000,000 VND' },
                max: { value: 50000000000, message: 'Số tiền tối đa 50,000,000,000 VND' }
              })}
              placeholder="100000000"
              step="1000000"
            />
            {errors.amount && <span className="error">{errors.amount.message}</span>}
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Lãi suất đề xuất (%/năm) *</label>
              <input
                type="number"
                {...register('interestRate', { 
                  required: 'Vui lòng nhập lãi suất',
                  min: { value: 0.1, message: 'Lãi suất tối thiểu 0.1%' },
                  max: { value: 30, message: 'Lãi suất tối đa 30%' }
                })}
                placeholder="8.5"
                step="0.1"
              />
              {errors.interestRate && <span className="error">{errors.interestRate.message}</span>}
            </div>

            <div className="input-group">
              <label>Thời hạn vay (tháng) *</label>
              <input
                type="number"
                {...register('termMonths', { 
                  required: 'Vui lòng nhập thời hạn',
                  min: { value: 1, message: 'Thời hạn tối thiểu 1 tháng' },
                  max: { value: 120, message: 'Thời hạn tối đa 120 tháng' }
                })}
                placeholder="24"
                step="1"
              />
              {errors.termMonths && <span className="error">{errors.termMonths.message}</span>}
            </div>
          </div>

          <div className="input-group">
            <label>Hình thức trả nợ *</label>
            <select {...register('repaymentMethod', { required: 'Vui lòng chọn hình thức' })}>
              <option value="monthly">Trả gốc + lãi hàng tháng</option>
              <option value="quarterly">Trả gốc + lãi hàng quý</option>
              <option value="end_term">Trả gốc + lãi cuối kỳ</option>
            </select>
            {errors.repaymentMethod && <span className="error">{errors.repaymentMethod.message}</span>}
          </div>

          {loanAmount > 0 && interestRate > 0 && loanTerm > 0 && (
            <div className="calculation-summary">
              <h3>Dự kiến thanh toán</h3>
              <div className="calculation-grid">
                <div className="calc-item">
                  <span>Trả hàng tháng:</span>
                  <strong>{formatCurrency(calculateMonthlyPayment())}</strong>
                </div>
                <div className="calc-item">
                  <span>Tổng lãi phải trả:</span>
                  <strong>{formatCurrency(calculateMonthlyPayment() * loanTerm - loanAmount)}</strong>
                </div>
                <div className="calc-item">
                  <span>Tổng thanh toán:</span>
                  <strong className="highlight">{formatCurrency(calculateMonthlyPayment() * loanTerm)}</strong>
                </div>
              </div>
              <small style={{ color: '#666', fontSize: '12px', marginTop: '10px', display: 'block' }}>
                * Đây là số liệu ước tính. Số liệu chính thác sẽ được tính sau khi admin phê duyệt.
              </small>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => navigate('/dashboard', { state: { userRole } })}
            disabled={loading || uploadingImage || uploadingDocument}
          >
            Hủy
          </button>
          <button 
            type="submit" 
            className="btn-primary btn-submit"
            disabled={loading || uploadingImage || uploadingDocument}
          >
            {uploadingDocument ? 'Đang tải tài liệu...' : 
             uploadingImage ? 'Đang tải ảnh...' : 
             loading ? 'Đang gửi...' : 
             'Gửi yêu cầu vay vốn'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLoan;
