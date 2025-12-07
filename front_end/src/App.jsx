import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import AdminLoanDetail from './components/AdminLoanDetail';
import LoanList from './components/LoanList';
import LoanDetail from './components/LoanDetail';
import CreateLoan from './components/CreateLoan';
import LoanManagement from './components/LoanManagement';
import TransactionHistory from './components/TransactionHistory';
import InvestmentPortfolio from './components/InvestmentPortfolio';
import Deposit from './components/Deposit';
import Profile from './components/Profile';
import ScrollToTop from './components/ScrollToTop';
import { supabase } from './lib/supabaseClient';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading, getUserRole } = useAuth();
  const [checkingRole, setCheckingRole] = useState(true);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        setCheckingRole(false);
        return;
      }

      try {
        const { role, error } = await getUserRole();
        
        if (error) {
          console.error('Error getting user role:', error);
          setRedirectPath('/dashboard');
        } else if (role === 'admin') {
          setRedirectPath('/admin-dashboard');
        } else {
          setRedirectPath('/dashboard');
        }
      } catch (error) {
        console.error('Error checking role:', error);
        setRedirectPath('/dashboard');
      } finally {
        setCheckingRole(false);
      }
    };

    if (!loading) {
      checkUserRole();
    }
  }, [user, loading, getUserRole]);

  if (loading || checkingRole) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (user && redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin-loan/:id" element={<ProtectedRoute><AdminLoanDetail /></ProtectedRoute>} />
          <Route path="/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          {/* Loan Routes - Protected */}
          <Route path="/loan-list" element={<ProtectedRoute><LoanList /></ProtectedRoute>} />
          <Route path="/loan-detail/:id" element={<ProtectedRoute><LoanDetail /></ProtectedRoute>} />
          <Route path="/create-loan" element={<ProtectedRoute><CreateLoan /></ProtectedRoute>} />
          <Route path="/loan-management" element={<ProtectedRoute><LoanManagement /></ProtectedRoute>} />
          
          {/* Portfolio & History - Protected */}
          <Route path="/investment-portfolio" element={<ProtectedRoute><InvestmentPortfolio /></ProtectedRoute>} />
          <Route path="/transaction-history" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
          
          {/* Static Pages */}
          <Route path="/verification" element={
            <div className="auth-container">
              <div className="auth-card">
                <h2>Xác thực tài khoản</h2>
                <p>Một email xác thực đã được gửi đến địa chỉ của bạn. Vui lòng kiểm tra email (nhớ kiểm tra thư spam) và làm theo hướng dẫn.</p>
              </div>
            </div>
          } />
          <Route path="/terms" element={
            <div className="auth-container">
              <div className="auth-card">
                <h2>Điều khoản sử dụng</h2>
                <p>Nội dung điều khoản sử dụng sẽ được hiển thị ở đây.</p>
              </div>
            </div>
          } />
          <Route path="/privacy" element={
            <div className="auth-container">
              <div className="auth-card">
                <h2>Chính sách bảo mật</h2>
                <p>Nội dung chính sách bảo mật sẽ được hiển thị ở đây.</p>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
