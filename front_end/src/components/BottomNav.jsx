import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaChartLine, FaWallet, FaUser, FaHandHoldingUsd } from 'react-icons/fa';
import { BiMoney } from 'react-icons/bi';
import './BottomNav.css';

const BottomNav = ({ userRole = 'borrower' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const borrowerNavItems = [
    { path: '/dashboard', icon: FaHome, label: 'Trang chủ' },
    { path: '/loan-management', icon: FaChartLine, label: 'Dự án' },
    { path: '/deposit', icon: FaWallet, label: 'Nạp tiền' },
    { path: '/profile', icon: FaUser, label: 'Cá nhân' },
  ];

  const lenderNavItems = [
    { path: '/dashboard', icon: FaHome, label: 'Trang chủ' },
    { path: '/loan-list', icon: FaHandHoldingUsd, label: 'Gói dự án' },
    { path: '/investment-portfolio', icon: FaChartLine, label: 'Đầu tư' },
    { path: '/deposit', icon: FaWallet, label: 'Nạp tiền' },
    { path: '/profile', icon: FaUser, label: 'Cá nhân' },
  ];

  const navItems = userRole === 'borrower' ? borrowerNavItems : lenderNavItems;

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path, { state: { userRole } });
  };

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-container">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              <Icon className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
