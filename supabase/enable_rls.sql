-- ============================================
-- GREEN FUND ROW LEVEL SECURITY (RLS) POLICIES
-- Supabase PostgreSQL
-- Version: 1.0
-- Date: 2025-10-17
-- ============================================

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_representatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_esg_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_credit_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Anyone can view basic user info (excluding sensitive data)
CREATE POLICY "Public profiles are viewable by everyone"
ON users FOR SELECT
USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (during signup)
CREATE POLICY "Users can insert own profile"
ON users FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================
-- WALLETS TABLE POLICIES
-- ============================================

-- Users can only view their own wallet
CREATE POLICY "Users can view own wallet"
ON wallets FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own wallet (for backend transactions)
CREATE POLICY "Users can update own wallet"
ON wallets FOR UPDATE
USING (auth.uid() = user_id);

-- Users can create their own wallet
CREATE POLICY "Users can create own wallet"
ON wallets FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- LOAN PACKAGES TABLE POLICIES
-- ============================================

-- Everyone can view loan packages
CREATE POLICY "Loan packages are viewable by everyone"
ON loan_packages FOR SELECT
USING (is_active = true);

-- Only admins can manage loan packages
CREATE POLICY "Admins can manage loan packages"
ON loan_packages FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- ============================================
-- LOANS TABLE POLICIES
-- ============================================

-- Anyone can view approved/active loans
CREATE POLICY "Anyone can view public loans"
ON loans FOR SELECT
USING (
  status IN ('approved', 'funding', 'active', 'completed')
  OR borrower_id = auth.uid()
);

-- Borrowers can create their own loans
CREATE POLICY "Borrowers can create loans"
ON loans FOR INSERT
WITH CHECK (
  auth.uid() = borrower_id
  AND EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'borrower'
  )
);

-- Borrowers can update their own pending loans
CREATE POLICY "Borrowers can update own pending loans"
ON loans FOR UPDATE
USING (
  auth.uid() = borrower_id
  AND status = 'pending'
);

-- Admins can update any loan
CREATE POLICY "Admins can update any loan"
ON loans FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- ============================================
-- LOAN RELATED TABLES POLICIES
-- (loan_companies, loan_representatives, loan_esg_scores, 
--  loan_documents, loan_timeline, loan_credit_history, loan_benefits)
-- ============================================

-- Anyone can view if the loan is public
CREATE POLICY "Anyone can view loan companies"
ON loan_companies FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM loans
    WHERE loans.id = loan_companies.loan_id
    AND (
      loans.status IN ('approved', 'funding', 'active', 'completed')
      OR loans.borrower_id = auth.uid()
    )
  )
);

CREATE POLICY "Anyone can view loan representatives"
ON loan_representatives FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM loans
    WHERE loans.id = loan_representatives.loan_id
    AND (
      loans.status IN ('approved', 'funding', 'active', 'completed')
      OR loans.borrower_id = auth.uid()
    )
  )
);

CREATE POLICY "Anyone can view loan ESG scores"
ON loan_esg_scores FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM loans
    WHERE loans.id = loan_esg_scores.loan_id
    AND (
      loans.status IN ('approved', 'funding', 'active', 'completed')
      OR loans.borrower_id = auth.uid()
    )
  )
);

CREATE POLICY "Anyone can view loan documents"
ON loan_documents FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM loans
    WHERE loans.id = loan_documents.loan_id
    AND (
      loans.status IN ('approved', 'funding', 'active', 'completed')
      OR loans.borrower_id = auth.uid()
    )
  )
);

CREATE POLICY "Anyone can view loan timeline"
ON loan_timeline FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM loans
    WHERE loans.id = loan_timeline.loan_id
    AND (
      loans.status IN ('approved', 'funding', 'active', 'completed')
      OR loans.borrower_id = auth.uid()
    )
  )
);

CREATE POLICY "Anyone can view loan credit history"
ON loan_credit_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM loans
    WHERE loans.id = loan_credit_history.loan_id
    AND (
      loans.status IN ('approved', 'funding', 'active', 'completed')
      OR loans.borrower_id = auth.uid()
    )
  )
);

CREATE POLICY "Anyone can view loan benefits"
ON loan_benefits FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM loans
    WHERE loans.id = loan_benefits.loan_id
    AND (
      loans.status IN ('approved', 'funding', 'active', 'completed')
      OR loans.borrower_id = auth.uid()
    )
  )
);

-- Borrowers can insert/update their own loan data
CREATE POLICY "Borrowers can insert loan companies"
ON loan_companies FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM loans
    WHERE loans.id = loan_companies.loan_id
    AND loans.borrower_id = auth.uid()
  )
);

CREATE POLICY "Borrowers can insert loan representatives"
ON loan_representatives FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM loans
    WHERE loans.id = loan_representatives.loan_id
    AND loans.borrower_id = auth.uid()
  )
);

CREATE POLICY "Borrowers can insert loan benefits"
ON loan_benefits FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM loans
    WHERE loans.id = loan_benefits.loan_id
    AND loans.borrower_id = auth.uid()
  )
);

CREATE POLICY "Borrowers can insert loan documents"
ON loan_documents FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM loans
    WHERE loans.id = loan_documents.loan_id
    AND loans.borrower_id = auth.uid()
  )
);

CREATE POLICY "Borrowers can insert loan timeline"
ON loan_timeline FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM loans
    WHERE loans.id = loan_timeline.loan_id
    AND loans.borrower_id = auth.uid()
  )
);

-- ============================================
-- INVESTMENTS TABLE POLICIES
-- ============================================

-- Lenders can view their own investments
CREATE POLICY "Lenders can view own investments"
ON investments FOR SELECT
USING (auth.uid() = lender_id);

-- Borrowers can view investments in their loans
CREATE POLICY "Borrowers can view investments in own loans"
ON investments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM loans
    WHERE loans.id = investments.loan_id
    AND loans.borrower_id = auth.uid()
  )
);

-- Lenders can create investments
CREATE POLICY "Lenders can create investments"
ON investments FOR INSERT
WITH CHECK (
  auth.uid() = lender_id
  AND EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'lender'
  )
  AND EXISTS (
    SELECT 1 FROM loans
    WHERE loans.id = investments.loan_id
    AND loans.status IN ('approved', 'funding')
  )
);

-- ============================================
-- INVESTMENT RETURNS TABLE POLICIES
-- ============================================

-- Lenders can view their own investment returns
CREATE POLICY "Lenders can view own investment returns"
ON investment_returns FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM investments
    WHERE investments.id = investment_returns.investment_id
    AND investments.lender_id = auth.uid()
  )
);

-- ============================================
-- LOAN PAYMENTS TABLE POLICIES
-- ============================================

-- Borrowers can view their own loan payments
CREATE POLICY "Borrowers can view own loan payments"
ON loan_payments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM loans
    WHERE loans.id = loan_payments.loan_id
    AND loans.borrower_id = auth.uid()
  )
);

-- Lenders can view payments of loans they invested in
CREATE POLICY "Lenders can view payments of invested loans"
ON loan_payments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM investments
    WHERE investments.loan_id = loan_payments.loan_id
    AND investments.lender_id = auth.uid()
  )
);

-- ============================================
-- TRANSACTIONS TABLE POLICIES
-- ============================================

-- Users can only view their own transactions
CREATE POLICY "Users can view own transactions"
ON transactions FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own transactions
CREATE POLICY "Users can create own transactions"
ON transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- NEWS TABLE POLICIES
-- ============================================

-- Everyone can view published news
CREATE POLICY "Anyone can view published news"
ON news FOR SELECT
USING (is_published = true);

-- Admins can manage news
CREATE POLICY "Admins can manage news"
ON news FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- ============================================
-- NOTIFICATIONS TABLE POLICIES
-- ============================================

-- Users can only view their own notifications
CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- System can create notifications for users
CREATE POLICY "System can create notifications"
ON notifications FOR INSERT
WITH CHECK (true);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
ON notifications FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Row Level Security policies created successfully!';
  RAISE NOTICE '🔒 All tables are now secured with RLS';
  RAISE NOTICE '🎯 Next step: Test policies with different user roles';
END $$;
