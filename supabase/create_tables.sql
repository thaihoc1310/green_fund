-- ============================================
-- GREEN FUND DATABASE CREATION SCRIPT
-- Supabase PostgreSQL
-- Version: 1.0
-- Date: 2025-10-17
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. USERS TABLE
-- ============================================
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

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_id_number ON users(id_number);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- 2. WALLETS TABLE
-- ============================================
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(15,2) DEFAULT 0.00 CHECK (balance >= 0),
  total_deposited DECIMAL(15,2) DEFAULT 0.00,
  total_withdrawn DECIMAL(15,2) DEFAULT 0.00,
  total_invested DECIMAL(15,2) DEFAULT 0.00,
  total_borrowed DECIMAL(15,2) DEFAULT 0.00,
  available_balance DECIMAL(15,2) DEFAULT 0.00 CHECK (available_balance >= 0),
  locked_balance DECIMAL(15,2) DEFAULT 0.00 CHECK (locked_balance >= 0),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT check_balance_sum CHECK (balance = available_balance + locked_balance)
);

CREATE INDEX idx_wallets_user_id ON wallets(user_id);

-- ============================================
-- 3. LOAN PACKAGES TABLE
-- ============================================
CREATE TABLE loan_packages (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  description TEXT,
  image_url TEXT,
  interest_rate_min DECIMAL(5,2),
  interest_rate_max DECIMAL(5,2),
  max_term_months INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 4. LOANS TABLE
-- ============================================
CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  borrower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  package_id VARCHAR(50) NOT NULL REFERENCES loan_packages(id),
  project_name VARCHAR(500) NOT NULL,
  purpose TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  funded_amount DECIMAL(15,2) DEFAULT 0.00 CHECK (funded_amount >= 0),
  funded_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (funded_percentage BETWEEN 0 AND 100),
  interest_rate DECIMAL(5,2) NOT NULL,
  term_months INTEGER NOT NULL CHECK (term_months > 0),
  payment_method VARCHAR(100),
  credit_rating VARCHAR(10),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'funding', 'active', 'completed', 'rejected', 'defaulted')),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  funded_at TIMESTAMP,
  start_date DATE,
  end_date DATE,
  completed_at TIMESTAMP
);

CREATE INDEX idx_loans_borrower_id ON loans(borrower_id);
CREATE INDEX idx_loans_package_id ON loans(package_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loans_created_at ON loans(created_at DESC);

-- ============================================
-- 5. LOAN COMPANIES TABLE
-- ============================================
CREATE TABLE loan_companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id UUID NOT NULL UNIQUE REFERENCES loans(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  registration_location VARCHAR(255),
  established_year INTEGER,
  employees INTEGER,
  revenue DECIMAL(15,2),
  tax_code VARCHAR(50),
  business_license VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_loan_companies_loan_id ON loan_companies(loan_id);

-- ============================================
-- 6. LOAN REPRESENTATIVES TABLE
-- ============================================
CREATE TABLE loan_representatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id UUID NOT NULL UNIQUE REFERENCES loans(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(100),
  age INTEGER,
  phone VARCHAR(20),
  email VARCHAR(255),
  id_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_loan_representatives_loan_id ON loan_representatives(loan_id);

-- ============================================
-- 7. LOAN ESG SCORES TABLE
-- ============================================
CREATE TABLE loan_esg_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id UUID NOT NULL UNIQUE REFERENCES loans(id) ON DELETE CASCADE,
  environmental INTEGER CHECK (environmental BETWEEN 0 AND 100),
  social INTEGER CHECK (social BETWEEN 0 AND 100),
  governance INTEGER CHECK (governance BETWEEN 0 AND 100),
  total_score INTEGER GENERATED ALWAYS AS (ROUND((COALESCE(environmental, 0) + COALESCE(social, 0) + COALESCE(governance, 0)) / 3.0)) STORED,
  evaluated_by UUID REFERENCES users(id),
  evaluated_at TIMESTAMP DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_loan_esg_scores_loan_id ON loan_esg_scores(loan_id);
CREATE INDEX idx_loan_esg_scores_total_score ON loan_esg_scores(total_score DESC);

-- ============================================
-- 8. LOAN DOCUMENTS TABLE
-- ============================================
CREATE TABLE loan_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50),
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_loan_documents_loan_id ON loan_documents(loan_id);

-- ============================================
-- 9. LOAN TIMELINE TABLE
-- ============================================
CREATE TABLE loan_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  phase VARCHAR(255) NOT NULL,
  duration VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('completed', 'in-progress', 'pending')),
  display_order INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_loan_timeline_loan_id ON loan_timeline(loan_id);

-- ============================================
-- 10. LOAN CREDIT HISTORY TABLE
-- ============================================
CREATE TABLE loan_credit_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id UUID NOT NULL UNIQUE REFERENCES loans(id) ON DELETE CASCADE,
  total_loans INTEGER DEFAULT 0,
  on_time_payment_rate DECIMAL(5,2) DEFAULT 100.00,
  total_borrowed DECIMAL(15,2) DEFAULT 0.00,
  total_repaid DECIMAL(15,2) DEFAULT 0.00,
  default_count INTEGER DEFAULT 0,
  last_loan_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_loan_credit_history_loan_id ON loan_credit_history(loan_id);

-- ============================================
-- 11. LOAN BENEFITS TABLE
-- ============================================
CREATE TABLE loan_benefits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  benefit TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_loan_benefits_loan_id ON loan_benefits(loan_id);

-- ============================================
-- 12. INVESTMENTS TABLE
-- ============================================
CREATE TABLE investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  lender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  interest_rate DECIMAL(5,2) NOT NULL,
  term_months INTEGER NOT NULL,
  expected_return DECIMAL(15,2),
  actual_return DECIMAL(15,2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  invested_at TIMESTAMP DEFAULT NOW(),
  maturity_date DATE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_investments_loan_id ON investments(loan_id);
CREATE INDEX idx_investments_lender_id ON investments(lender_id);
CREATE INDEX idx_investments_status ON investments(status);

-- ============================================
-- 13. INVESTMENT RETURNS TABLE
-- ============================================
CREATE TABLE investment_returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investment_id UUID NOT NULL REFERENCES investments(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  period INTEGER,
  due_date DATE NOT NULL,
  paid_date DATE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_investment_returns_investment_id ON investment_returns(investment_id);
CREATE INDEX idx_investment_returns_status ON investment_returns(status);
CREATE INDEX idx_investment_returns_due_date ON investment_returns(due_date);

-- ============================================
-- 14. LOAN PAYMENTS TABLE
-- ============================================
CREATE TABLE loan_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  period INTEGER NOT NULL,
  principal DECIMAL(15,2) NOT NULL,
  interest DECIMAL(15,2) NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'partial')),
  paid_amount DECIMAL(15,2) DEFAULT 0.00,
  late_fee DECIMAL(15,2) DEFAULT 0.00,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_loan_payments_loan_id ON loan_payments(loan_id);
CREATE INDEX idx_loan_payments_status ON loan_payments(status);
CREATE INDEX idx_loan_payments_due_date ON loan_payments(due_date);

-- ============================================
-- 15. TRANSACTIONS TABLE
-- ============================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('deposit', 'withdraw', 'invest', 'disburse', 'repay', 'receive_interest', 'fee', 'refund')),
  amount DECIMAL(15,2) NOT NULL,
  balance_before DECIMAL(15,2) NOT NULL,
  balance_after DECIMAL(15,2) NOT NULL,
  reference_id UUID,
  reference_type VARCHAR(50),
  description TEXT,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_reference ON transactions(reference_id, reference_type);

-- ============================================
-- 16. NEWS TABLE
-- ============================================
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE,
  content TEXT,
  excerpt TEXT,
  image_url TEXT,
  category VARCHAR(50) CHECK (category IN ('news', 'promotion', 'guide')),
  author_id UUID REFERENCES users(id),
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_published_at ON news(published_at DESC);
CREATE INDEX idx_news_slug ON news(slug);

-- ============================================
-- 17. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================
-- TRIGGERS FOR updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loan_packages_updated_at BEFORE UPDATE ON loan_packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loans_updated_at BEFORE UPDATE ON loans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loan_companies_updated_at BEFORE UPDATE ON loan_companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loan_representatives_updated_at BEFORE UPDATE ON loan_representatives FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loan_esg_scores_updated_at BEFORE UPDATE ON loan_esg_scores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loan_timeline_updated_at BEFORE UPDATE ON loan_timeline FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loan_credit_history_updated_at BEFORE UPDATE ON loan_credit_history FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON investments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investment_returns_updated_at BEFORE UPDATE ON investment_returns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loan_payments_updated_at BEFORE UPDATE ON loan_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INSERT INITIAL DATA
-- ============================================

-- Insert loan packages
INSERT INTO loan_packages (id, name, name_en, description, display_order) VALUES
('green-agriculture', 'NÔNG NGHIỆP XANH', 'Green Agriculture', 'Phát triển nông nghiệp công nghệ cao, giảm phát thải', 1),
('renewable-energy', 'NĂNG LƯỢNG TÁI TẠO', 'Renewable Energy', 'Năng lượng sạch, bền vững cho tương lai', 2),
('sustainable-consumption', 'SẢN XUẤT TIÊU DÙNG BỀN VỮNG', 'Sustainable Consumption', 'Sản phẩm thân thiện môi trường', 3),
('environmental-tech', 'CÔNG NGHỆ MÔI TRƯỜNG', 'Environmental Technology', 'Công nghệ xử lý môi trường tiên tiến', 4);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Database schema created successfully!';
  RAISE NOTICE '📊 Total tables: 17';
  RAISE NOTICE '🔗 Total indexes: 50+';
  RAISE NOTICE '🎯 Next step: Enable Row Level Security';
END $$;
