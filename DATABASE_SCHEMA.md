# 🌱 GREEN FUND - DATABASE SCHEMA DESIGN (SUPABASE)

## 📋 MỤC LỤC
1. [Tổng quan hệ thống](#tổng-quan-hệ-thống)
2. [Sơ đồ quan hệ (ERD)](#sơ-đồ-quan-hệ-erd)
3. [Chi tiết các bảng](#chi-tiết-các-bảng)
4. [Policies & Row Level Security](#policies--row-level-security)
5. [Hướng dẫn tạo database trên Supabase](#hướng-dẫn-tạo-database-trên-supabase)
6. [Hướng dẫn tích hợp vào dự án](#hướng-dẫn-tích-hợp-vào-dự-án)

---

## 🎯 TỔNG QUAN HỆ THỐNG

**Green Fund** là nền tảng P2P lending tập trung vào các dự án xanh, bền vững. Hệ thống có 2 vai trò chính:
- **Borrower (Người vay)**: Tạo dự án, quản lý khoản vay, trả nợ
- **Lender (Nhà đầu tư)**: Đầu tư vào dự án, nhận lãi suất

---

## 🔗 SƠ ĐỒ QUAN HỆ (ERD)

```
users (1) ──────< (n) loans
users (1) ──────< (n) investments
users (1) ──────< (n) transactions
users (1) ──────< (n) wallets
loans (1) ──────< (n) investments
loans (1) ──────< (n) loan_payments
loans (1) ──────< (n) loan_documents
loans (1) ──────< (n) loan_timeline
investments (1) ──< (n) investment_returns
```

---

## 📊 CHI TIẾT CÁC BẢNG

### 1. 👤 **BẢNG: users**
Quản lý thông tin người dùng (cả Borrower và Lender)

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | ID người dùng (tự sinh) |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email đăng nhập |
| `password_hash` | VARCHAR(255) | NOT NULL | Mật khẩu đã mã hóa (bcrypt) |
| `full_name` | VARCHAR(255) | NOT NULL | Họ và tên đầy đủ |
| `phone` | VARCHAR(20) | | Số điện thoại |
| `id_number` | VARCHAR(20) | UNIQUE | Số CMND/CCCD |
| `date_of_birth` | DATE | | Ngày sinh |
| `address` | TEXT | | Địa chỉ chi tiết |
| `avatar_url` | TEXT | | URL ảnh đại diện |
| `role` | VARCHAR(20) | NOT NULL, DEFAULT 'borrower' | 'borrower' hoặc 'lender' |
| `bank_account` | VARCHAR(50) | | Số tài khoản ngân hàng |
| `bank_name` | VARCHAR(100) | | Tên ngân hàng |
| `is_verified` | BOOLEAN | DEFAULT FALSE | Trạng thái xác minh tài khoản |
| `kyc_status` | VARCHAR(20) | DEFAULT 'pending' | 'pending', 'approved', 'rejected' |
| `kyc_submitted_at` | TIMESTAMP | | Thời gian nộp KYC |
| `kyc_verified_at` | TIMESTAMP | | Thời gian xác minh KYC |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày tạo tài khoản |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật cuối |
| `last_login_at` | TIMESTAMP | | Lần đăng nhập cuối |

**Indexes:**
- `idx_users_email` ON `email`
- `idx_users_id_number` ON `id_number`
- `idx_users_role` ON `role`

---

### 2. 💰 **BẢNG: wallets**
Ví điện tử của người dùng

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | ID ví |
| `user_id` | UUID | FOREIGN KEY → users(id), NOT NULL | ID người dùng |
| `balance` | DECIMAL(15,2) | DEFAULT 0.00, CHECK (balance >= 0) | Số dư hiện tại (VND) |
| `total_deposited` | DECIMAL(15,2) | DEFAULT 0.00 | Tổng tiền đã nạp |
| `total_withdrawn` | DECIMAL(15,2) | DEFAULT 0.00 | Tổng tiền đã rút |
| `total_invested` | DECIMAL(15,2) | DEFAULT 0.00 | Tổng tiền đã đầu tư |
| `total_borrowed` | DECIMAL(15,2) | DEFAULT 0.00 | Tổng tiền đã vay |
| `available_balance` | DECIMAL(15,2) | DEFAULT 0.00 | Số dư khả dụng (không bị khóa) |
| `locked_balance` | DECIMAL(15,2) | DEFAULT 0.00 | Số dư bị khóa (đang đầu tư) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày tạo ví |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật cuối |

**Constraints:**
- UNIQUE (`user_id`) - Mỗi user chỉ có 1 ví
- CHECK: `balance = available_balance + locked_balance`

**Indexes:**
- `idx_wallets_user_id` ON `user_id`

---

### 3. 📦 **BẢNG: loan_packages**
Các gói vay theo lĩnh vực ESG

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|-------------|-----------|-------|
| `id` | VARCHAR(50) | PRIMARY KEY | ID gói (green-agriculture, renewable-energy, ...) |
| `name` | VARCHAR(255) | NOT NULL | Tên gói (tiếng Việt) |
| `name_en` | VARCHAR(255) | | Tên gói (tiếng Anh) |
| `description` | TEXT | | Mô tả ngắn |
| `image_url` | TEXT | | URL hình ảnh đại diện |
| `interest_rate_min` | DECIMAL(5,2) | | Lãi suất tối thiểu (%) |
| `interest_rate_max` | DECIMAL(5,2) | | Lãi suất tối đa (%) |
| `max_term_months` | INTEGER | | Kỳ hạn tối đa (tháng) |
| `is_active` | BOOLEAN | DEFAULT TRUE | Còn hoạt động không |
| `display_order` | INTEGER | DEFAULT 0 | Thứ tự hiển thị |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |

**Dữ liệu mẫu:**
```sql
INSERT INTO loan_packages (id, name, name_en, description) VALUES
('green-agriculture', 'NÔNG NGHIỆP XANH', 'Green Agriculture', 'Phát triển nông nghiệp công nghệ cao, giảm phát thải'),
('renewable-energy', 'NĂNG LƯỢNG TÁI TẠO', 'Renewable Energy', 'Năng lượng sạch, bền vững cho tương lai'),
('sustainable-consumption', 'SẢN XUẤT TIÊU DÙNG BỀN VỮNG', 'Sustainable Consumption', 'Sản phẩm thân thiện môi trường'),
('environmental-tech', 'CÔNG NGHỆ MÔI TRƯỜNG', 'Environmental Technology', 'Công nghệ xử lý môi trường tiên tiến');
```

---

### 4. 💳 **BẢNG: loans**
Thông tin các khoản vay / dự án

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | ID khoản vay |
| `borrower_id` | UUID | FOREIGN KEY → users(id), NOT NULL | ID người vay |
| `package_id` | VARCHAR(50) | FOREIGN KEY → loan_packages(id), NOT NULL | ID gói vay |
| `project_name` | VARCHAR(500) | NOT NULL | Tên dự án |
| `purpose` | TEXT | NOT NULL | Mục đích vay vốn |
| `description` | TEXT | | Mô tả chi tiết dự án |
| `amount` | DECIMAL(15,2) | NOT NULL, CHECK (amount > 0) | Số tiền cần vay (VND) |
| `funded_amount` | DECIMAL(15,2) | DEFAULT 0.00 | Số tiền đã huy động được |
| `funded_percentage` | DECIMAL(5,2) | DEFAULT 0.00, CHECK (funded_percentage BETWEEN 0 AND 100) | % đã huy động |
| `interest_rate` | DECIMAL(5,2) | NOT NULL | Lãi suất (%/năm) |
| `term_months` | INTEGER | NOT NULL, CHECK (term_months > 0) | Kỳ hạn (tháng) |
| `payment_method` | VARCHAR(100) | | Phương thức trả nợ |
| `credit_rating` | VARCHAR(10) | | Xếp hạng tín dụng (A+, A, A-, B+, ...) |
| `status` | VARCHAR(20) | DEFAULT 'pending' | 'pending', 'approved', 'funding', 'active', 'completed', 'rejected', 'defaulted' |
| `image_url` | TEXT | | URL hình ảnh dự án |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |
| `approved_at` | TIMESTAMP | | Ngày duyệt |
| `funded_at` | TIMESTAMP | | Ngày đủ vốn |
| `start_date` | DATE | | Ngày bắt đầu giải ngân |
| `end_date` | DATE | | Ngày kết thúc dự kiến |
| `completed_at` | TIMESTAMP | | Ngày hoàn thành thực tế |

**Indexes:**
- `idx_loans_borrower_id` ON `borrower_id`
- `idx_loans_package_id` ON `package_id`
- `idx_loans_status` ON `status`
- `idx_loans_created_at` ON `created_at DESC`

---

### 5. 🏢 **BẢNG: loan_companies**
Thông tin doanh nghiệp của khoản vay

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | ID |
| `loan_id` | UUID | FOREIGN KEY → loans(id), UNIQUE, NOT NULL | ID khoản vay |
| `name` | VARCHAR(255) | NOT NULL | Tên doanh nghiệp |
| `type` | VARCHAR(100) | | Loại hình (TNHH, CP, HTX, ...) |
| `registration_location` | VARCHAR(255) | | Nơi đăng ký kinh doanh |
| `established_year` | INTEGER | | Năm thành lập |
| `employees` | INTEGER | | Số nhân viên |
| `revenue` | DECIMAL(15,2) | | Doanh thu năm gần nhất (VND) |
| `tax_code` | VARCHAR(50) | | Mã số thuế |
| `business_license` | VARCHAR(100) | | Số giấy phép ĐKKD |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |

**Indexes:**
- `idx_loan_companies_loan_id` ON `loan_id`

---

### 6. 👨‍💼 **BẢNG: loan_representatives**
Người đại diện của khoản vay

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | ID |
| `loan_id` | UUID | FOREIGN KEY → loans(id), UNIQUE, NOT NULL | ID khoản vay |
| `name` | VARCHAR(255) | NOT NULL | Họ tên người đại diện |
| `position` | VARCHAR(100) | | Chức vụ |
| `age` | INTEGER | | Tuổi |
| `phone` | VARCHAR(20) | | Số điện thoại |
| `email` | VARCHAR(255) | | Email |
| `id_number` | VARCHAR(20) | | Số CMND/CCCD |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |

**Indexes:**
- `idx_loan_representatives_loan_id` ON `loan_id`

---

### 7. 🌿 **BẢNG: loan_esg_scores**
Điểm ESG của khoản vay

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | ID |
| `loan_id` | UUID | FOREIGN KEY → loans(id), UNIQUE, NOT NULL | ID khoản vay |
| `environmental` | INTEGER | CHECK (environmental BETWEEN 0 AND 100) | Điểm Môi trường (0-100) |
| `social` | INTEGER | CHECK (social BETWEEN 0 AND 100) | Điểm Xã hội (0-100) |
| `governance` | INTEGER | CHECK (governance BETWEEN 0 AND 100) | Điểm Quản trị (0-100) |
| `total_score` | INTEGER | GENERATED ALWAYS AS (ROUND((environmental + social + governance) / 3.0)) STORED | Điểm tổng (tự tính) |
| `evaluated_by` | UUID | FOREIGN KEY → users(id) | Người đánh giá |
| `evaluated_at` | TIMESTAMP | DEFAULT NOW() | Ngày đánh giá |
| `notes` | TEXT | | Ghi chú đánh giá |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |

**Indexes:**
- `idx_loan_esg_scores_loan_id` ON `loan_id`
- `idx_loan_esg_scores_total_score` ON `total_score DESC`

---

### 8. 📄 **BẢNG: loan_documents**
Tài liệu đính kèm của khoản vay

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | ID tài liệu |
| `loan_id` | UUID | FOREIGN KEY → loans(id), NOT NULL | ID khoản vay |
| `name` | VARCHAR(255) | NOT NULL | Tên tài liệu |
| `type` | VARCHAR(50) | | Loại tài liệu (license, financial_report, ...) |
| `file_url` | TEXT | NOT NULL | URL file trên Supabase Storage |
| `file_size` | INTEGER | | Kích thước file (bytes) |
| `mime_type` | VARCHAR(100) | | MIME type |
| `is_verified` | BOOLEAN | DEFAULT FALSE | Đã xác minh chưa |
| `verified_by` | UUID | FOREIGN KEY → users(id) | Người xác minh |
| `verified_at` | TIMESTAMP | | Thời gian xác minh |
| `uploaded_at` | TIMESTAMP | DEFAULT NOW() | Ngày upload |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày tạo |

**Indexes:**
- `idx_loan_documents_loan_id` ON `loan_id`

---

### 9. 📅 **BẢNG: loan_timeline**
Timeline / lộ trình thực hiện dự án

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | ID |
| `loan_id` | UUID | FOREIGN KEY → loans(id), NOT NULL | ID khoản vay |
| `phase` | VARCHAR(255) | NOT NULL | Tên giai đoạn |
| `duration` | VARCHAR(100) | | Thời gian (VD: "2 tháng") |
| `status` | VARCHAR(20) | DEFAULT 'pending' | 'completed', 'in-progress', 'pending' |
| `display_order` | INTEGER | DEFAULT 0 | Thứ tự hiển thị |
| `start_date` | DATE | | Ngày bắt đầu thực tế |
| `end_date` | DATE | | Ngày kết thúc thực tế |
| `notes` | TEXT | | Ghi chú |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |

**Indexes:**
- `idx_loan_timeline_loan_id` ON `loan_id`

---

### 10. 💼 **BẢNG: loan_credit_history**
Lịch sử tín dụng của người vay

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | ID |
| `loan_id` | UUID | FOREIGN KEY → loans(id), UNIQUE, NOT NULL | ID khoản vay |
| `total_loans` | INTEGER | DEFAULT 0 | Tổng số lần vay |
| `on_time_payment_rate` | DECIMAL(5,2) | DEFAULT 100.00 | Tỷ lệ trả đúng hạn (%) |
| `total_borrowed` | DECIMAL(15,2) | DEFAULT 0.00 | Tổng tiền đã vay |
| `total_repaid` | DECIMAL(15,2) | DEFAULT 0.00 | Tổng tiền đã trả |
| `default_count` | INTEGER | DEFAULT 0 | Số lần vỡ nợ |
| `last_loan_date` | DATE | | Ngày vay gần nhất |
| `notes` | TEXT | | Ghi chú |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |

**Indexes:**
- `idx_loan_credit_history_loan_id` ON `loan_id`

---

### 11. 🎯 **BẢNG: loan_benefits**
Lợi ích của dự án

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | ID |
| `loan_id` | UUID | FOREIGN KEY → loans(id), NOT NULL | ID khoản vay |
| `benefit` | TEXT | NOT NULL | Lợi ích |
| `display_order` | INTEGER | DEFAULT 0 | Thứ tự hiển thị |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày tạo |

**Indexes:**
- `idx_loan_benefits_loan_id` ON `loan_id`

---

### 12. 💸 **BẢNG: investments**
Thông tin đầu tư của nhà đầu tư vào dự án

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | ID đầu tư |
| `loan_id` | UUID | FOREIGN KEY → loans(id), NOT NULL | ID khoản vay |
| `lender_id` | UUID | FOREIGN KEY → users(id), NOT NULL | ID nhà đầu tư |
| `amount` | DECIMAL(15,2) | NOT NULL, CHECK (amount > 0) | Số tiền đầu tư (VND) |
| `interest_rate` | DECIMAL(5,2) | NOT NULL | Lãi suất cam kết (%/năm) |
| `term_months` | INTEGER | NOT NULL | Kỳ hạn (tháng) |
| `expected_return` | DECIMAL(15,2) | | Lợi nhuận dự kiến |
| `actual_return` | DECIMAL(15,2) | DEFAULT 0.00 | Lợi nhuận thực tế |
| `status` | VARCHAR(20) | DEFAULT 'active' | 'active', 'completed', 'cancelled' |
| `invested_at` | TIMESTAMP | DEFAULT NOW() | Ngày đầu tư |
| `maturity_date` | DATE | | Ngày đáo hạn |
| `completed_at` | TIMESTAMP | | Ngày hoàn thành |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |

**Indexes:**
- `idx_investments_loan_id` ON `loan_id`
- `idx_investments_lender_id` ON `lender_id`
- `idx_investments_status` ON `status`

---

### 13. 💰 **BẢNG: investment_returns**
Lãi suất trả định kỳ cho nhà đầu tư

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | ID |
| `investment_id` | UUID | FOREIGN KEY → investments(id), NOT NULL | ID đầu tư |
| `amount` | DECIMAL(15,2) | NOT NULL | Số tiền lãi |
| `period` | INTEGER | | Kỳ thứ (1, 2, 3, ...) |
| `due_date` | DATE | NOT NULL | Ngày đến hạn |
| `paid_date` | DATE | | Ngày trả thực tế |
| `status` | VARCHAR(20) | DEFAULT 'pending' | 'pending', 'paid', 'overdue' |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |

**Indexes:**
- `idx_investment_returns_investment_id` ON `investment_id`
- `idx_investment_returns_status` ON `status`
- `idx_investment_returns_due_date` ON `due_date`

---

### 14. 💳 **BẢNG: loan_payments**
Thanh toán nợ của người vay

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | ID |
| `loan_id` | UUID | FOREIGN KEY → loans(id), NOT NULL | ID khoản vay |
| `period` | INTEGER | NOT NULL | Kỳ thanh toán thứ |
| `principal` | DECIMAL(15,2) | NOT NULL | Tiền gốc |
| `interest` | DECIMAL(15,2) | NOT NULL | Tiền lãi |
| `total_amount` | DECIMAL(15,2) | NOT NULL | Tổng tiền (gốc + lãi) |
| `due_date` | DATE | NOT NULL | Ngày đến hạn |
| `paid_date` | DATE | | Ngày trả thực tế |
| `status` | VARCHAR(20) | DEFAULT 'pending' | 'pending', 'paid', 'overdue', 'partial' |
| `paid_amount` | DECIMAL(15,2) | DEFAULT 0.00 | Số tiền đã trả |
| `late_fee` | DECIMAL(15,2) | DEFAULT 0.00 | Phí trả chậm |
| `notes` | TEXT | | Ghi chú |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |

**Indexes:**
- `idx_loan_payments_loan_id` ON `loan_id`
- `idx_loan_payments_status` ON `status`
- `idx_loan_payments_due_date` ON `due_date`

---

### 15. 📊 **BẢNG: transactions**
Lịch sử giao dịch (nạp, rút, đầu tư, trả nợ, ...)

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | ID giao dịch |
| `user_id` | UUID | FOREIGN KEY → users(id), NOT NULL | ID người dùng |
| `type` | VARCHAR(50) | NOT NULL | 'deposit', 'withdraw', 'invest', 'disburse', 'repay', 'receive_interest', 'fee' |
| `amount` | DECIMAL(15,2) | NOT NULL | Số tiền |
| `balance_before` | DECIMAL(15,2) | NOT NULL | Số dư trước giao dịch |
| `balance_after` | DECIMAL(15,2) | NOT NULL | Số dư sau giao dịch |
| `reference_id` | UUID | | ID tham chiếu (loan_id, investment_id, ...) |
| `reference_type` | VARCHAR(50) | | Loại tham chiếu (loan, investment, ...) |
| `description` | TEXT | | Mô tả giao dịch |
| `status` | VARCHAR(20) | DEFAULT 'completed' | 'pending', 'completed', 'failed', 'cancelled' |
| `metadata` | JSONB | | Thông tin bổ sung (JSON) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày tạo |

**Indexes:**
- `idx_transactions_user_id` ON `user_id`
- `idx_transactions_type` ON `type`
- `idx_transactions_created_at` ON `created_at DESC`
- `idx_transactions_reference` ON `reference_id, reference_type`

---

### 16. 📰 **BẢNG: news**
Tin tức, khuyến mãi

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | ID tin tức |
| `title` | VARCHAR(500) | NOT NULL | Tiêu đề |
| `slug` | VARCHAR(500) | UNIQUE | Slug URL |
| `content` | TEXT | | Nội dung |
| `excerpt` | TEXT | | Tóm tắt |
| `image_url` | TEXT | | URL hình ảnh |
| `category` | VARCHAR(50) | | 'news', 'promotion', 'guide' |
| `author_id` | UUID | FOREIGN KEY → users(id) | Tác giả |
| `is_published` | BOOLEAN | DEFAULT FALSE | Đã xuất bản chưa |
| `published_at` | TIMESTAMP | | Ngày xuất bản |
| `views` | INTEGER | DEFAULT 0 | Số lượt xem |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |

**Indexes:**
- `idx_news_category` ON `category`
- `idx_news_published_at` ON `published_at DESC`
- `idx_news_slug` ON `slug`

---

### 17. 🔔 **BẢNG: notifications**
Thông báo cho người dùng

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | ID thông báo |
| `user_id` | UUID | FOREIGN KEY → users(id), NOT NULL | ID người nhận |
| `type` | VARCHAR(50) | NOT NULL | 'loan_approved', 'investment_complete', 'payment_due', ... |
| `title` | VARCHAR(255) | NOT NULL | Tiêu đề |
| `message` | TEXT | | Nội dung |
| `link` | TEXT | | Link đến trang chi tiết |
| `is_read` | BOOLEAN | DEFAULT FALSE | Đã đọc chưa |
| `read_at` | TIMESTAMP | | Thời gian đọc |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày tạo |

**Indexes:**
- `idx_notifications_user_id` ON `user_id`
- `idx_notifications_is_read` ON `is_read`
- `idx_notifications_created_at` ON `created_at DESC`

---

## 🔐 POLICIES & ROW LEVEL SECURITY

### Bật RLS cho tất cả các bảng:
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
-- ... (tương tự cho các bảng khác)
```

### Policy Examples:

#### 1. Users - Chỉ xem/sửa thông tin của chính mình
```sql
-- Select: Ai cũng có thể xem thông tin user khác (trừ password)
CREATE POLICY "Users can view other users (public info)"
ON users FOR SELECT
USING (true);

-- Update: Chỉ sửa được thông tin của chính mình
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id);
```

#### 2. Wallets - Chỉ xem ví của mình
```sql
CREATE POLICY "Users can view own wallet"
ON wallets FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can update wallets"
ON wallets FOR UPDATE
USING (true); -- Sẽ dùng service_role_key từ backend
```

#### 3. Loans - Borrower tạo loan, mọi người xem được
```sql
CREATE POLICY "Anyone can view approved loans"
ON loans FOR SELECT
USING (status IN ('approved', 'funding', 'active', 'completed'));

CREATE POLICY "Borrowers can create loans"
ON loans FOR INSERT
WITH CHECK (auth.uid() = borrower_id);

CREATE POLICY "Borrowers can update own loans"
ON loans FOR UPDATE
USING (auth.uid() = borrower_id AND status = 'pending');
```

#### 4. Investments - Lender đầu tư, chỉ xem investment của mình
```sql
CREATE POLICY "Lenders can view own investments"
ON investments FOR SELECT
USING (auth.uid() = lender_id);

CREATE POLICY "Lenders can create investments"
ON investments FOR INSERT
WITH CHECK (auth.uid() = lender_id);
```

#### 5. Transactions - Chỉ xem transaction của mình
```sql
CREATE POLICY "Users can view own transactions"
ON transactions FOR SELECT
USING (auth.uid() = user_id);
```

---

## 🛠️ HƯỚNG DẪN TẠO DATABASE TRÊN SUPABASE

### BƯỚC 1: Tạo Project Supabase
1. Truy cập https://supabase.com
2. Đăng nhập / Đăng ký tài khoản
3. Click **"New Project"**
4. Điền thông tin:
   - **Name**: `green-fund`
   - **Database Password**: Tạo password mạnh (LƯU LẠI!)
   - **Region**: Singapore (gần VN nhất)
   - **Pricing Plan**: Free (đủ để test)
5. Click **"Create new project"** → Đợi 2-3 phút

---

### BƯỚC 2: Tạo Database Schema

#### 2.1. Mở SQL Editor
1. Sidebar bên trái → Click **"SQL Editor"**
2. Click **"New query"**

#### 2.2. Copy & Paste Script SQL

**File: `create_tables.sql`** (Tôi sẽ tạo file riêng với full SQL script)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  id_number VARCHAR(20) UNIQUE,
  date_of_birth DATE,
  address TEXT,
  avatar_url TEXT,
  role VARCHAR(20) NOT NULL DEFAULT 'borrower' CHECK (role IN ('borrower', 'lender', 'admin')),
  bank_account VARCHAR(50),
  bank_name VARCHAR(100),
  is_verified BOOLEAN DEFAULT FALSE,
  kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected')),
  kyc_submitted_at TIMESTAMP,
  kyc_verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

-- Create indexes for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_id_number ON users(id_number);
CREATE INDEX idx_users_role ON users(role);

-- ... (tiếp tục với các bảng khác)
```

#### 2.3. Chạy Script
1. Paste toàn bộ SQL script vào editor
2. Click **"Run"** (hoặc Ctrl/Cmd + Enter)
3. Kiểm tra **"Results"** panel → Thành công nếu thấy "Success"

---

### BƯỚC 3: Insert Dữ liệu mẫu

```sql
-- Insert loan packages
INSERT INTO loan_packages (id, name, name_en, description, image_url) VALUES
('green-agriculture', 'NÔNG NGHIỆP XANH', 'Green Agriculture', 'Phát triển nông nghiệp công nghệ cao, giảm phát thải', '/images/green-agriculture.jpg'),
('renewable-energy', 'NĂNG LƯỢNG TÁI TẠO', 'Renewable Energy', 'Năng lượng sạch, bền vững cho tương lai', '/images/renewable-energy.jpg'),
('sustainable-consumption', 'SẢN XUẤT TIÊU DÙNG BỀN VỮNG', 'Sustainable Consumption', 'Sản phẩm thân thiện môi trường', '/images/sustainable-consumption.jpg'),
('environmental-tech', 'CÔNG NGHỆ MÔI TRƯỜNG', 'Environmental Technology', 'Công nghệ xử lý môi trường tiên tiến', '/images/environmental-tech.jpg');

-- Insert sample admin user
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@greenfund.vn', '$2a$10$...', 'Admin Green Fund', 'admin');
```

---

### BƯỚC 4: Setup Row Level Security (RLS)

1. SQL Editor → New query
2. Copy paste policies từ section **"POLICIES & ROW LEVEL SECURITY"** ở trên
3. Run

---

### BƯỚC 5: Setup Storage (Lưu ảnh)

1. Sidebar → **"Storage"**
2. Click **"Create a new bucket"**
3. Bucket settings:
   - **Name**: `loan-images`
   - **Public**: ✅ ON (để public access)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/jpeg, image/png, image/jpg, image/webp`
4. Click **"Create bucket"**

Làm tương tự cho:
- `loan-documents` (private bucket cho tài liệu)
- `user-avatars` (public bucket cho avatar)

---

### BƯỚC 6: Lấy API Keys

1. Sidebar → **"Project Settings"** (icon bánh răng)
2. **"API"** section
3. Copy 2 keys:
   - **`anon` / `public` key** → Dùng trong frontend
   - **`service_role` key** → Dùng trong backend (BẢO MẬT!)

---

## 📦 HƯỚNG DẪN TÍCH HỢP VÀO DỰ ÁN

### BƯỚC 1: Cài đặt Supabase Client

```bash
cd front_end
npm install @supabase/supabase-js
```

---

### BƯỚC 2: Tạo Supabase Config

**File: `/front_end/src/lib/supabase.js`**

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

### BƯỚC 3: Tạo file `.env`

**File: `/front_end/.env`**

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **LƯU Ý:** Thay `xxxxx` bằng URL và key thật của bạn

---

### BƯỚC 4: Update `.gitignore`

```gitignore
# Environment variables
.env
.env.local
.env.production
```

---

### BƯỚC 5: Tạo API Services

**File: `/front_end/src/services/authService.js`**

```javascript
import { supabase } from '../lib/supabase';

export const authService = {
  // Đăng ký
  async signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    
    if (error) throw error;
    
    // Insert vào bảng users
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email,
        full_name: fullName
      });
    
    if (insertError) throw insertError;
    
    return data;
  },

  // Đăng nhập
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  // Đăng xuất
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Lấy user hiện tại
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};
```

**File: `/front_end/src/services/loanService.js`**

```javascript
import { supabase } from '../lib/supabase';

export const loanService = {
  // Lấy tất cả loans
  async getAllLoans(packageId = null) {
    let query = supabase
      .from('loans')
      .select(`
        *,
        loan_companies(*),
        loan_representatives(*),
        loan_esg_scores(*),
        loan_benefits(*),
        loan_timeline(*),
        loan_documents(*),
        loan_credit_history(*)
      `)
      .in('status', ['approved', 'funding', 'active', 'completed']);
    
    if (packageId) {
      query = query.eq('package_id', packageId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  // Lấy loan theo ID
  async getLoanById(id) {
    const { data, error } = await supabase
      .from('loans')
      .select(`
        *,
        loan_companies(*),
        loan_representatives(*),
        loan_esg_scores(*),
        loan_benefits(*),
        loan_timeline(*),
        loan_documents(*),
        loan_credit_history(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Tạo loan mới
  async createLoan(loanData) {
    const { data, error } = await supabase
      .from('loans')
      .insert(loanData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
```

**File: `/front_end/src/services/investmentService.js`**

```javascript
import { supabase } from '../lib/supabase';

export const investmentService = {
  // Đầu tư vào loan
  async invest(loanId, amount) {
    const user = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('investments')
      .insert({
        loan_id: loanId,
        lender_id: user.data.user.id,
        amount,
        status: 'active'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Lấy danh sách đầu tư của user
  async getMyInvestments() {
    const user = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('investments')
      .select(`
        *,
        loans(*)
      `)
      .eq('lender_id', user.data.user.id);
    
    if (error) throw error;
    return data;
  }
};
```

---

### BƯỚC 6: Update Components sử dụng API

**Example: Login.jsx**

```javascript
import { authService } from '../services/authService';

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const data = await authService.signIn(email, password);
    console.log('Login success:', data);
    navigate('/dashboard');
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

---

## 🎯 TỔNG KẾT

### Đã hoàn thành:
✅ Thiết kế 17 bảng database hoàn chỉnh
✅ Định nghĩa đầy đủ các cột, kiểu dữ liệu, ràng buộc
✅ Thiết lập quan hệ giữa các bảng (Foreign Keys)
✅ Tạo indexes cho hiệu năng
✅ Thiết kế Row Level Security policies
✅ Hướng dẫn chi tiết từng bước setup Supabase
✅ Hướng dẫn tích hợp vào dự án React

### Các bước tiếp theo:
1. ✅ Tạo project Supabase
2. ✅ Chạy SQL scripts tạo bảng
3. ✅ Setup Storage buckets
4. ✅ Cài đặt `@supabase/supabase-js`
5. ✅ Tạo các service files
6. ⏳ Migrate dữ liệu mẫu từ `loansData.js` sang Supabase
7. ⏳ Update components sử dụng API thay vì mock data
8. ⏳ Test toàn bộ flow: Register → Login → Create Loan → Invest

---

**Tác giả:** GitHub Copilot  
**Ngày tạo:** 17/10/2025  
**Version:** 1.0
