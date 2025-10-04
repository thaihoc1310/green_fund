import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaArrowDown, FaArrowUp, FaFilter } from 'react-icons/fa';
import { BiMoney, BiCalendar } from 'react-icons/bi';
import './TransactionHistory.css';

const TransactionHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = location.state?.userRole || 'borrower';
  const [filter, setFilter] = useState('all'); // all, income, expense

  // Mock data
  const transactions = [
    {
      id: 1,
      type: 'income',
      category: 'Giải ngân từ nhà đầu tư',
      amount: 50000000,
      date: '2025-10-01',
      projectName: 'Dự án năng lượng mặt trời',
      status: 'completed'
    },
    {
      id: 2,
      type: 'expense',
      category: 'Trả nợ gốc + lãi',
      amount: 5500000,
      date: '2025-09-30',
      projectName: 'Dự án năng lượng mặt trời',
      status: 'completed'
    },
    {
      id: 3,
      type: 'income',
      category: 'Nhận lãi đầu tư',
      amount: 2000000,
      date: '2025-09-25',
      projectName: 'Dự án nông nghiệp hữu cơ',
      status: 'completed'
    },
    {
      id: 4,
      type: 'income',
      category: 'Nạp tiền vào tài khoản',
      amount: 10000000,
      date: '2025-09-20',
      projectName: null,
      status: 'completed'
    },
    {
      id: 5,
      type: 'expense',
      category: 'Đầu tư vào dự án',
      amount: 30000000,
      date: '2025-09-15',
      projectName: 'Dự án tái chế nhựa',
      status: 'completed'
    }
  ];

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'income') return t.type === 'income';
    if (filter === 'expense') return t.type === 'expense';
    return true;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="transaction-container">
      <div className="transaction-header">
        <button className="btn-back" onClick={() => navigate('/dashboard', { state: { userRole } })}>
          <FaArrowLeft /> Quay lại
        </button>
        <h1>Lịch sử giao dịch</h1>
      </div>

      <div className="summary-cards">
        <div className="summary-card income">
          <div className="summary-icon">
            <FaArrowDown />
          </div>
          <div className="summary-content">
            <span className="summary-label">Tổng thu</span>
            <span className="summary-value">{formatCurrency(totalIncome)}</span>
          </div>
        </div>

        <div className="summary-card expense">
          <div className="summary-icon">
            <FaArrowUp />
          </div>
          <div className="summary-content">
            <span className="summary-label">Tổng chi</span>
            <span className="summary-value">{formatCurrency(totalExpense)}</span>
          </div>
        </div>

        <div className="summary-card balance">
          <div className="summary-icon">
            <BiMoney />
          </div>
          <div className="summary-content">
            <span className="summary-label">Chênh lệch</span>
            <span className="summary-value">{formatCurrency(totalIncome - totalExpense)}</span>
          </div>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-title">
          <FaFilter /> Lọc giao dịch
        </div>
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('all')}
          >
            Tất cả ({transactions.length})
          </button>
          <button 
            className={filter === 'income' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('income')}
          >
            Thu nhập
          </button>
          <button 
            className={filter === 'expense' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('expense')}
          >
            Chi tiêu
          </button>
        </div>
      </div>

      <div className="transactions-list">
        {filteredTransactions.map(transaction => (
          <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
            <div className="transaction-icon">
              {transaction.type === 'income' ? <FaArrowDown /> : <FaArrowUp />}
            </div>
            <div className="transaction-details">
              <h3>{transaction.category}</h3>
              {transaction.projectName && (
                <p className="project-name">{transaction.projectName}</p>
              )}
              <p className="transaction-date">
                <BiCalendar /> {formatDate(transaction.date)}
              </p>
            </div>
            <div className={`transaction-amount ${transaction.type}`}>
              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </div>
          </div>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="no-results">
          <p>Không có giao dịch nào</p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
