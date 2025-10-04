import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import LoanList from './components/LoanList';
import LoanDetail from './components/LoanDetail';
import CreateLoan from './components/CreateLoan';
import LoanManagement from './components/LoanManagement';
import TransactionHistory from './components/TransactionHistory';
import InvestmentPortfolio from './components/InvestmentPortfolio';
import NewsPromotion from './components/NewsPromotion';
import Deposit from './components/Deposit';
import Profile from './components/Profile';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Loan Routes */}
          <Route path="/loan-list" element={<LoanList />} />
          <Route path="/loan-detail/:id" element={<LoanDetail />} />
          <Route path="/create-loan" element={<CreateLoan />} />
          <Route path="/loan-management" element={<LoanManagement />} />
          
          {/* Portfolio & History */}
          <Route path="/investment-portfolio" element={<InvestmentPortfolio />} />
          <Route path="/transaction-history" element={<TransactionHistory />} />
          
          {/* News */}
          <Route path="/news-promotion" element={<NewsPromotion />} />
          
          {/* Static Pages */}
          <Route path="/verification" element={
            <div className="auth-container">
              <div className="auth-card">
                <h2>Xác thực tài khoản</h2>
                <p>Một email xác thực đã được gửi đến địa chỉ của bạn. Vui lòng kiểm tra email và làm theo hướng dẫn.</p>
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

export default App;
