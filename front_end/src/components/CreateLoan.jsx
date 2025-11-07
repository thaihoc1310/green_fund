import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaArrowLeft, FaBuilding, FaLeaf, FaUpload, FaInfoCircle } from 'react-icons/fa';
import { BiMoney } from 'react-icons/bi';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import './CreateLoan.css';

const CreateLoan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = location.state?.userRole || 'borrower';
  const { user } = useAuth();
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
      const { error: insertError } = await supabase
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
        });

      if (insertError) throw insertError;

      alert('Yêu cầu vay vốn đã được gửi thành công! Vui lòng đợi admin phê duyệt.');
      navigate('/loan-management', { state: { userRole } });
    } catch (error) {
      console.error('Error creating loan:', error);
      setErrorMessage(error.message || 'Đã xảy ra lỗi khi tạo khoản vay');
    } finally {
      setLoading(false);
      setUploadingImage(false);
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
            disabled={loading}
          >
            Hủy
          </button>
          <button 
            type="submit" 
            className="btn-primary btn-submit"
            disabled={loading || uploadingImage}
          >
            {loading ? 'Đang gửi...' : uploadingImage ? 'Đang tải ảnh...' : 'Gửi yêu cầu vay vốn'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLoan;
