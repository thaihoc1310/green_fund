import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaArrowLeft, FaBuilding, FaLeaf, FaUpload } from 'react-icons/fa';
import { BiMoney } from 'react-icons/bi';
import './CreateLoan.css';

const CreateLoan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = location.state?.userRole || 'borrower';
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const onSubmitStep1 = (data) => {
    setFormData({ ...formData, ...data });
    setStep(2);
  };

  const onSubmitStep2 = (data) => {
    setFormData({ ...formData, ...data });
    setStep(3);
  };

  const onSubmitFinal = (data) => {
    const finalData = { ...formData, ...data };
    console.log('Loan Application:', finalData);
    // TODO: Submit to API
    alert('Yêu cầu vay vốn đã được gửi thành công!');
    navigate('/loan-management');
  };

  const loanAmount = watch('loanAmount', 0);
  const interestRate = watch('interestRate', 8);
  const loanTerm = watch('loanTerm', 12);

  const calculateMonthlyPayment = () => {
    if (!loanAmount || !interestRate || !loanTerm) return 0;
    const principal = parseFloat(loanAmount);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const numPayments = parseInt(loanTerm);
    
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
        <h1>Tạo yêu cầu vay vốn</h1>
      </div>

      <div className="progress-steps">
        <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <span>Thông tin dự án</span>
        </div>
        <div className="step-line"></div>
        <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <span>Thông tin vay</span>
        </div>
        <div className="step-line"></div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <span>Xác nhận</span>
        </div>
      </div>

      {step === 1 && (
        <form onSubmit={handleSubmit(onSubmitStep1)} className="loan-form">
          <div className="form-card">
            <h2><FaBuilding /> Thông tin dự án</h2>
            
            <div className="input-group">
              <label>Tên dự án *</label>
              <input
                type="text"
                {...register('projectName', { 
                  required: 'Vui lòng nhập tên dự án',
                  minLength: { value: 10, message: 'Tên dự án phải có ít nhất 10 ký tự' }
                })}
                placeholder="VD: Dự án năng lượng mặt trời Ninh Thuận"
              />
              {errors.projectName && <span className="error">{errors.projectName.message}</span>}
            </div>

            <div className="input-group">
              <label>Tên doanh nghiệp *</label>
              <input
                type="text"
                {...register('companyName', { 
                  required: 'Vui lòng nhập tên doanh nghiệp'
                })}
                placeholder="Công ty TNHH..."
              />
              {errors.companyName && <span className="error">{errors.companyName.message}</span>}
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Loại hình doanh nghiệp *</label>
                <select {...register('companyType', { required: 'Vui lòng chọn loại hình' })}>
                  <option value="">-- Chọn loại hình --</option>
                  <option value="TNHH">Công ty TNHH</option>
                  <option value="CP">Công ty Cổ phần</option>
                  <option value="HTX">Hợp tác xã</option>
                  <option value="TTNM">Tư nhân</option>
                </select>
                {errors.companyType && <span className="error">{errors.companyType.message}</span>}
              </div>

              <div className="input-group">
                <label>Nơi đăng ký kinh doanh *</label>
                <input
                  type="text"
                  {...register('registrationLocation', { required: 'Vui lòng nhập nơi đăng ký' })}
                  placeholder="TP. Hồ Chí Minh"
                />
                {errors.registrationLocation && <span className="error">{errors.registrationLocation.message}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Người đại diện *</label>
                <input
                  type="text"
                  {...register('representative', { required: 'Vui lòng nhập tên người đại diện' })}
                  placeholder="Nguyễn Văn A"
                />
                {errors.representative && <span className="error">{errors.representative.message}</span>}
              </div>

              <div className="input-group">
                <label>Chức vụ *</label>
                <input
                  type="text"
                  {...register('position', { required: 'Vui lòng nhập chức vụ' })}
                  placeholder="Giám đốc"
                />
                {errors.position && <span className="error">{errors.position.message}</span>}
              </div>
            </div>

            <div className="input-group">
              <label>Mục đích vay *</label>
              <textarea
                {...register('purpose', { 
                  required: 'Vui lòng nhập mục đích vay',
                  minLength: { value: 50, message: 'Mô tả phải có ít nhất 50 ký tự' }
                })}
                placeholder="Mô tả chi tiết mục đích sử dụng vốn vay..."
                rows="4"
              ></textarea>
              {errors.purpose && <span className="error">{errors.purpose.message}</span>}
            </div>

            <div className="input-group">
              <label>Mô tả chi tiết dự án *</label>
              <textarea
                {...register('description', { 
                  required: 'Vui lòng nhập mô tả dự án',
                  minLength: { value: 100, message: 'Mô tả phải có ít nhất 100 ký tự' }
                })}
                placeholder="Mô tả toàn diện về dự án, lợi ích mang lại..."
                rows="6"
              ></textarea>
              {errors.description && <span className="error">{errors.description.message}</span>}
            </div>
          </div>

          <button type="submit" className="btn-primary btn-next">
            Tiếp tục
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit(onSubmitStep2)} className="loan-form">
          <div className="form-card">
            <h2><BiMoney /> Thông tin khoản vay</h2>

            <div className="input-group">
              <label>Số tiền vay (VND) *</label>
              <input
                type="number"
                {...register('loanAmount', { 
                  required: 'Vui lòng nhập số tiền vay',
                  min: { value: 10000000, message: 'Số tiền tối thiểu 10,000,000 VND' },
                  max: { value: 10000000000, message: 'Số tiền tối đa 10,000,000,000 VND' }
                })}
                placeholder="100000000"
                step="1000000"
              />
              {errors.loanAmount && <span className="error">{errors.loanAmount.message}</span>}
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Lãi suất đề xuất (%/năm) *</label>
                <input
                  type="number"
                  {...register('interestRate', { 
                    required: 'Vui lòng nhập lãi suất',
                    min: { value: 5, message: 'Lãi suất tối thiểu 5%' },
                    max: { value: 20, message: 'Lãi suất tối đa 20%' }
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
                  {...register('loanTerm', { 
                    required: 'Vui lòng nhập thời hạn',
                    min: { value: 6, message: 'Thời hạn tối thiểu 6 tháng' },
                    max: { value: 60, message: 'Thời hạn tối đa 60 tháng' }
                  })}
                  placeholder="24"
                  step="1"
                />
                {errors.loanTerm && <span className="error">{errors.loanTerm.message}</span>}
              </div>
            </div>

            <div className="input-group">
              <label>Hình thức trả nợ *</label>
              <select {...register('paymentMethod', { required: 'Vui lòng chọn hình thức' })}>
                <option value="">-- Chọn hình thức --</option>
                <option value="monthly">Trả gốc + lãi hàng tháng</option>
                <option value="interest-only">Trả lãi hàng tháng, gốc cuối kỳ</option>
                <option value="end-term">Trả gốc + lãi cuối kỳ</option>
              </select>
              {errors.paymentMethod && <span className="error">{errors.paymentMethod.message}</span>}
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
              </div>
            )}
          </div>

          <div className="form-card">
            <h2><FaLeaf /> Thông tin ESG (Tùy chọn)</h2>
            <p className="card-description">Cung cấp thông tin về tác động môi trường, xã hội và quản trị để tăng cơ hội được tài trợ</p>

            <div className="input-group">
              <label>Tác động môi trường</label>
              <textarea
                {...register('environmentalImpact')}
                placeholder="Dự án giảm lượng khí thải CO2, sử dụng năng lượng tái tạo..."
                rows="3"
              ></textarea>
            </div>

            <div className="input-group">
              <label>Tác động xã hội</label>
              <textarea
                {...register('socialImpact')}
                placeholder="Tạo việc làm, cải thiện điều kiện sống cộng đồng..."
                rows="3"
              ></textarea>
            </div>

            <div className="input-group">
              <label>Quản trị doanh nghiệp</label>
              <textarea
                {...register('governanceInfo')}
                placeholder="Chính sách quản trị minh bạch, tuân thủ pháp luật..."
                rows="3"
              ></textarea>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
              Quay lại
            </button>
            <button type="submit" className="btn-primary">
              Tiếp tục
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit(onSubmitFinal)} className="loan-form">
          <div className="form-card">
            <h2><FaUpload /> Tải lên tài liệu</h2>
            <p className="card-description">Tải lên các tài liệu cần thiết để xác minh thông tin</p>

            <div className="upload-section">
              <div className="upload-item">
                <label>Giấy phép kinh doanh *</label>
                <div className="file-upload">
                  <input type="file" accept=".pdf,.jpg,.png" />
                  <span className="upload-placeholder">Chọn file hoặc kéo thả vào đây</span>
                </div>
              </div>

              <div className="upload-item">
                <label>Báo cáo tài chính gần nhất *</label>
                <div className="file-upload">
                  <input type="file" accept=".pdf,.xlsx" />
                  <span className="upload-placeholder">Chọn file hoặc kéo thả vào đây</span>
                </div>
              </div>

              <div className="upload-item">
                <label>Hợp đồng/tài liệu liên quan (nếu có)</label>
                <div className="file-upload">
                  <input type="file" accept=".pdf,.jpg,.png" multiple />
                  <span className="upload-placeholder">Chọn file hoặc kéo thả vào đây</span>
                </div>
              </div>
            </div>

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  {...register('agreedTerms', { 
                    required: 'Bạn phải đồng ý với điều khoản' 
                  })}
                />
                <span>Tôi xác nhận rằng tất cả thông tin được cung cấp là chính xác và đồng ý với <a href="/terms">điều khoản sử dụng</a></span>
              </label>
              {errors.agreedTerms && <span className="error">{errors.agreedTerms.message}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setStep(2)}>
              Quay lại
            </button>
            <button type="submit" className="btn-primary btn-submit">
              Gửi yêu cầu
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateLoan;
