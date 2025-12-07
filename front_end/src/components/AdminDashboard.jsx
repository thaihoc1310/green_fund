import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { 
  FaUsers, 
  FaClipboardList, 
  FaChartLine,
  FaSignOutAlt,
  FaUser,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, getUserRole, deleteImageFromStorage } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    // Restore tab from sessionStorage if available
    return sessionStorage.getItem('adminDashboardTab') || 'statistics';
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Track which tabs have been loaded
  const [loadedTabs, setLoadedTabs] = useState({
    statistics: false,
    loans: false,
    users: false
  });
  
  // Loans data
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [filterStatus, setFilterStatus] = useState(() => {
    return sessionStorage.getItem('adminDashboardFilterStatus') || 'all';
  });
  const [searchTerm, setSearchTerm] = useState(() => {
    return sessionStorage.getItem('adminDashboardSearchTerm') || '';
  });
  
  // Users data
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  
  // User detail modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  
  // Create user modal
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

  // Check if user is admin, if not redirect to dashboard
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) return;

      try {
        const { role, error } = await getUserRole();
        
        if (error) {
          console.error('Error checking user role:', error);
          navigate('/dashboard', { replace: true });
          return;
        }

        // If not admin, redirect to regular dashboard
        if (role !== 'admin') {
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Error in admin access check:', error);
        navigate('/dashboard', { replace: true });
      }
    };

    checkAdminAccess();
  }, [user, getUserRole, navigate]);

  // Save dashboard state to sessionStorage whenever state changes
  useEffect(() => {
    sessionStorage.setItem('adminDashboardTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    sessionStorage.setItem('adminDashboardFilterStatus', filterStatus);
  }, [filterStatus]);

  useEffect(() => {
    sessionStorage.setItem('adminDashboardSearchTerm', searchTerm);
  }, [searchTerm]);

  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
    is_verified: false
  });
  
  // Statistics
  const [stats, setStats] = useState({
    totalLoans: 0,
    pendingLoans: 0,
    activeLoans: 0,
    totalFunded: 0,
    totalUsers: 0
  });

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data.role !== 'admin') {
          navigate('/dashboard', { state: { userRole: 'user' } });
          return;
        }

        // Load statistics first (since it's the default tab)
        await loadStatistics();
        setLoadedTabs(prev => ({ ...prev, statistics: true }));
      } catch (error) {
        console.error('Error checking admin:', error);
        setErrorMessage('Lỗi khi kiểm tra quyền truy cập');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [user, navigate]);

  // Lazy load data when tab changes
  useEffect(() => {
    const loadTabData = async () => {
      try {
        if (activeTab === 'loans' && !loadedTabs.loans) {
          await loadLoans();
          setLoadedTabs(prev => ({ ...prev, loans: true }));
        } else if (activeTab === 'users' && !loadedTabs.users) {
          await loadUsers();
          setLoadedTabs(prev => ({ ...prev, users: true }));
        } else if (activeTab === 'statistics' && !loadedTabs.statistics) {
          await loadStatistics();
          setLoadedTabs(prev => ({ ...prev, statistics: true }));
        }
      } catch (error) {
        console.error('Error loading tab data:', error);
        setErrorMessage('Lỗi khi tải dữ liệu');
      }
    };

    loadTabData();
  }, [activeTab]);

  const loadLoans = async () => {
    try {
      const { data, error } = await supabase
        .from('loans')
        .select(`
          *,
          borrower:users!borrower_id(full_name, email, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLoans(data || []);
      setFilteredLoans(data || []);
    } catch (error) {
      console.error('Error loading loans:', error);
      throw error;
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id, 
          full_name, 
          email, 
          phone, 
          role, 
          is_verified, 
          created_at, 
          date_of_birth, 
          national_id, 
          address, 
          avatar_url, 
          updated_at,
          wallets (
            balance
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Flatten wallet data
      const usersWithBalance = (data || []).map(user => ({
        ...user,
        balance: user.wallets?.[0]?.balance || 0
      }));
      
      setUsers(usersWithBalance);
    } catch (error) {
      console.error('Error loading users:', error);
      throw error;
    }
  };

  const loadStatistics = async () => {
    try {
      const { data: loansData, error: loansError } = await supabase
        .from('loans')
        .select('status, amount, funded_amount');

      if (loansError) throw loansError;

      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id', { count: 'exact' });

      if (usersError) throw usersError;

      const totalFunded = loansData.reduce((sum, loan) => sum + parseFloat(loan.funded_amount || 0), 0);
      const pendingCount = loansData.filter(l => l.status === 'pending').length;
      const activeCount = loansData.filter(l => l.status === 'active').length;

      setStats({
        totalLoans: loansData.length,
        pendingLoans: pendingCount,
        activeLoans: activeCount,
        totalFunded: totalFunded,
        totalUsers: usersData.length
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
      throw error;
    }
  };

  // Filter loans
  useEffect(() => {
    let filtered = loans;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(loan => loan.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(loan =>
        loan.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.borrower?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLoans(filtered);
  }, [filterStatus, searchTerm, loans]);

  // Filter users
  useEffect(() => {
    let filtered = users;

    // Filter by search term
    if (userSearchTerm) {
      filtered = filtered.filter(user =>
        user.full_name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        (user.phone && user.phone.toLowerCase().includes(userSearchTerm.toLowerCase()))
      );
    }

    setFilteredUsers(filtered);
  }, [userSearchTerm, users]);

  const deleteLoan = async (loanId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khoản vay này?')) {
      return;
    }

    try {
      setErrorMessage('');
      
      // Bước 1: Lấy thông tin loan trước khi xóa (để lấy image_url)
      const { data: loanData, error: fetchError } = await supabase
        .from('loans')
        .select('image_url')
        .eq('id', loanId)
        .maybeSingle(); // Dùng maybeSingle() thay vì single() để tránh lỗi nếu không tìm thấy

      if (fetchError) throw fetchError;

      // Bước 2: Xóa loan từ database TRƯỚC (cascade sẽ xóa loan_documents records)
      const { error: deleteError } = await supabase
        .from('loans')
        .delete()
        .eq('id', loanId);

      if (deleteError) throw deleteError;

      // Bước 3: Xóa ảnh loan từ storage nếu có
      if (loanData?.image_url) {
        try {
          const urlParts = loanData.image_url.split('/');
          const fileName = urlParts[urlParts.length - 1].split('?')[0];
          
          const { error: imgDeleteError } = await supabase.storage
            .from('loan-images')
            .remove([fileName]);
          
          if (imgDeleteError) {
            console.warn('Warning: Could not delete loan image from storage:', imgDeleteError);
          }
        } catch (imgErr) {
          console.warn('Warning: Error processing loan image deletion:', imgErr);
        }
      }

      // Bước 4: Xóa tất cả loan documents từ storage
      try {
        // List all folders trong loan này (loan_id/)
        const { data: docFolders, error: listError } = await supabase.storage
          .from('loan-documents')
          .list(loanId);

        if (!listError && docFolders && docFolders.length > 0) {
          // Với mỗi document folder, xóa tất cả files bên trong
          for (const folder of docFolders) {
            const folderPath = `${loanId}/${folder.name}`;
            
            const { data: files } = await supabase.storage
              .from('loan-documents')
              .list(folderPath);

            if (files && files.length > 0) {
              const filePaths = files.map(file => `${folderPath}/${file.name}`);
              await supabase.storage
                .from('loan-documents')
                .remove(filePaths);
            }
          }
        }
      } catch (docErr) {
        console.warn('Warning: Error deleting document storage:', docErr);
      }

      setSuccessMessage('Đã xóa khoản vay và tất cả tài liệu liên quan thành công');
      loadLoans();
      loadStatistics();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting loan:', error);
      setErrorMessage(error.message || 'Lỗi khi xóa khoản vay');
    }
  };

  // User management functions
  const openUserDetail = (user) => {
    setSelectedUser(user);
    setEditedUser(user);
    setIsUserModalOpen(true);
    setIsEditingUser(false);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedUser(null);
    setEditedUser(null);
    setIsEditingUser(false);
  };

  const openCreateUserModal = () => {
    setNewUser({
      full_name: '',
      email: '',
      phone: '',
      password: '',
      role: 'user',
      is_verified: false
    });
    setIsCreateUserModalOpen(true);
  };

  const closeCreateUserModal = () => {
    setIsCreateUserModalOpen(false);
    setNewUser({
      full_name: '',
      email: '',
      phone: '',
      password: '',
      role: 'user',
      is_verified: false
    });
  };

  const createUser = async () => {
    try {
      setErrorMessage('');
      setSuccessMessage('');

      // Validate required fields
      if (!newUser.email || !newUser.password || !newUser.full_name) {
        setErrorMessage('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      // Tạo user với metadata bao gồm role và is_verified
      // Database trigger sẽ tự động tạo record trong public.users và wallets
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            full_name: newUser.full_name,
            phone: newUser.phone || null,
            role: newUser.role || 'user',
            is_verified: newUser.is_verified || false
          }
        }
      });

      if (authError) throw authError;

      // Không cần INSERT vào public.users nữa - trigger sẽ tự động làm điều này

      setSuccessMessage('Tạo người dùng mới thành công');
      closeCreateUserModal();
      
      // Đợi một chút để trigger hoàn thành
      setTimeout(async () => {
        await loadUsers();
        loadStatistics();
      }, 500);

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error creating user:', error);
      setErrorMessage(error.message || 'Lỗi khi tạo người dùng');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này? Hành động này sẽ xóa cả avatar, tất cả loans, documents và ảnh liên quan. Không thể hoàn tác!')) {
      return;
    }

    try {
      setErrorMessage('');
      
      // Bước 1: Lấy thông tin user để xóa avatar
      const { data: userData, error: fetchUserError } = await supabase
        .from('users')
        .select('avatar_url')
        .eq('id', userId)
        .single();

      if (fetchUserError) throw fetchUserError;

      // Bước 2: Lấy tất cả loans của user để xóa ảnh từ storage
      const { data: userLoans, error: fetchLoansError } = await supabase
        .from('loans')
        .select('id, image_url')
        .eq('borrower_id', userId);

      if (fetchLoansError) throw fetchLoansError;

      // Bước 3: Xóa tất cả ảnh của loans từ storage
      if (userLoans && userLoans.length > 0) {
        for (const loan of userLoans) {
          if (loan.image_url) {
            const { error: deleteLoanImageError } = await deleteImageFromStorage(
              loan.image_url,
              'loan-images'
            );
            
            if (deleteLoanImageError) {
              console.warn(`Warning: Could not delete loan image for loan ${loan.id}:`, deleteLoanImageError);
            }
          }

          // Xóa loan documents từ storage (cascade sẽ xóa DB record)
          try {
            const { data: docs } = await supabase
              .from('loan_documents')
              .select('id')
              .eq('loan_id', loan.id);

            if (docs && docs.length > 0) {
              for (const doc of docs) {
                try {
                  const folderPath = `${loan.id}/${doc.id}`;
                  
                  // List all files in document folder
                  const { data: fileList, error: listError } = await supabase.storage
                    .from('loan-documents')
                    .list(folderPath);

                  if (!listError && fileList && fileList.length > 0) {
                    const filePaths = fileList.map(file => `${folderPath}/${file.name}`);
                    await supabase.storage
                      .from('loan-documents')
                      .remove(filePaths);
                  }
                } catch (docErr) {
                  console.error(`Error deleting document folder for loan ${loan.id}:`, docErr);
                }
              }
            }
          } catch (docListErr) {
            console.error(`Error fetching documents for loan ${loan.id}:`, docListErr);
          }
        }
      }

      // Bước 4: Xóa avatar từ storage
      if (userData?.avatar_url) {
        const { error: deleteAvatarError } = await deleteImageFromStorage(
          userData.avatar_url,
          'avatars'
        );
        
        if (deleteAvatarError) {
          console.warn('Warning: Could not delete user avatar:', deleteAvatarError);
        }
      }

      // Bước 5: Gọi database function để xóa user từ auth.users
      // CASCADE sẽ tự động: auth.users → public.users → wallets, loans, loan_documents
      const { error: deleteUserError } = await supabase
        .rpc('admin_delete_user', { target_user_id: userId });

      if (deleteUserError) throw deleteUserError;

      setSuccessMessage('Đã xóa người dùng, avatar, tất cả loans, documents và ảnh liên quan thành công');
      closeUserModal();
      await loadUsers();
      loadStatistics();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting user:', error);
      setErrorMessage(error.message || 'Lỗi khi xóa người dùng');
    }
  };

  const toggleUserVerification = async (userId, currentVerificationStatus) => {
    try {
      setErrorMessage('');
      const { error } = await supabase
        .from('users')
        .update({ is_verified: !currentVerificationStatus })
        .eq('id', userId);

      if (error) throw error;

      setSuccessMessage(currentVerificationStatus ? 'Đã hủy xác thực người dùng' : 'Đã xác thực người dùng');
      
      // Update selected user
      setSelectedUser(prev => ({ ...prev, is_verified: !currentVerificationStatus }));
      
      // Reload users
      await loadUsers();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error toggling user verification:', error);
      setErrorMessage(error.message || 'Lỗi khi cập nhật xác thực');
    }
  };

  const updateUser = async () => {
    try {
      setErrorMessage('');
      setSuccessMessage('');

      // Update user info
      const { error: userError } = await supabase
        .from('users')
        .update({
          full_name: editedUser.full_name,
          phone: editedUser.phone,
          date_of_birth: editedUser.date_of_birth,
          national_id: editedUser.national_id,
          address: editedUser.address,
          role: editedUser.role,
          is_verified: editedUser.is_verified,
          updated_at: new Date().toISOString()
        })
        .eq('id', editedUser.id);

      if (userError) throw userError;

      // Update wallet balance
      const { error: walletError } = await supabase
        .from('wallets')
        .update({
          balance: parseFloat(editedUser.balance) || 0,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', editedUser.id);

      if (walletError) throw walletError;

      setSuccessMessage('Cập nhật thông tin người dùng thành công');
      setIsEditingUser(false);
      
      // Update selected user
      setSelectedUser(editedUser);
      
      // Reload users
      await loadUsers();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating user:', error);
      setErrorMessage(error.message || 'Lỗi khi cập nhật thông tin người dùng');
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Chờ duyệt',
      'active': 'Đang hoạt động',
      'completed': 'Hoàn thành',
      'rejected': 'Từ chối',
      'cancelled': 'Đã hủy'
    };
    return labels[status] || status;
  };

  const getStatusClass = (status) => {
    const classes = {
      'pending': 'status-pending',
      'active': 'status-active',
      'completed': 'status-completed',
      'rejected': 'status-rejected',
      'cancelled': 'status-cancelled'
    };
    return classes[status] || '';
  };

  const formatNumberWithDots = (value) => {
    // Remove all non-digit characters
    const numStr = value.toString().replace(/\D/g, '');
    // Add dots every 3 digits from the right
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const parseFormattedNumber = (value) => {
    // Remove dots and parse to number
    return parseFloat(value.toString().replace(/\./g, '')) || 0;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <div className="admin-info">
            <FaUser />
            <span>{user?.email}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={activeTab === 'statistics' ? 'active' : ''}
            onClick={() => setActiveTab('statistics')}
          >
            <FaChartLine /> Thống kê
          </button>
          <button 
            className={activeTab === 'loans' ? 'active' : ''}
            onClick={() => setActiveTab('loans')}
          >
            <FaClipboardList /> Quản lý khoản vay
          </button>
          <button 
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            <FaUsers /> Quản lý người dùng
          </button>
        </nav>

        <button className="btn-logout" onClick={handleSignOut}>
          <FaSignOutAlt /> Đăng xuất
        </button>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <div className="content-header">
          <h1>
            {activeTab === 'statistics' && 'Thống kê tổng quan'}
            {activeTab === 'loans' && 'Quản lý khoản vay'}
            {activeTab === 'users' && 'Quản lý người dùng'}
          </h1>
        </div>

        {errorMessage && (
          <div className="alert alert-error">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            {successMessage}
          </div>
        )}

        {/* Statistics Cards - Only show on statistics tab */}
        {activeTab === 'statistics' && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-info">
                <h3>{stats.totalLoans}</h3>
                <p>Tổng khoản vay</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <h3>{stats.pendingLoans}</h3>
                <p>Chờ duyệt</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <h3>{formatCurrency(stats.totalFunded)}</h3>
                <p>Tổng vốn đầu tư</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <h3>{stats.totalUsers}</h3>
                <p>Người dùng</p>
              </div>
            </div>
          </div>
        )}

        {/* Loans Management */}
        {activeTab === 'loans' && (
          <div className="content-section">
            <div className="section-toolbar">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên dự án, công ty, người vay..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filter-box">
                <FaFilter />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="rejected">Từ chối</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>

            <div className="loans-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Dự án</th>
                    <th>Người vay</th>
                    <th>Số tiền</th>
                    <th>Lãi suất</th>
                    <th>Kỳ hạn</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoans.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                        Không tìm thấy khoản vay nào
                      </td>
                    </tr>
                  ) : (
                    filteredLoans.map(loan => (
                      <tr key={loan.id}>
                        <td>
                          <div className="loan-project">
                            <strong>{loan.project_name}</strong>
                            <small>{loan.company_name}</small>
                          </div>
                        </td>
                        <td>
                          <div className="borrower-info">
                            <strong>{loan.borrower?.full_name}</strong>
                            <small>{loan.borrower?.email}</small>
                          </div>
                        </td>
                        <td><strong>{formatCurrency(loan.amount)}</strong></td>
                        <td>{loan.interest_rate}%/năm</td>
                        <td>{loan.term_months} tháng</td>
                        <td>
                          <span className={`status-badge ${getStatusClass(loan.status)}`}>
                            {getStatusLabel(loan.status)}
                          </span>
                        </td>
                        <td>{formatDate(loan.created_at)}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-text btn-view"
                              onClick={() => navigate(`/admin-loan/${loan.id}`)}
                            >
                              Xem
                            </button>

                            <button 
                              className="btn-text btn-delete"
                              onClick={() => deleteLoan(loan.id)}
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Management */}
        {activeTab === 'users' && (
          <div className="content-section">
            <div className="section-toolbar">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                />
              </div>

              <button className="btn-create-user" onClick={openCreateUserModal}>
                <FaUser /> Tạo người dùng
              </button>
            </div>

            <div className="users-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Vai trò</th>
                    <th>Xác thực</th>
                    <th>Ngày đăng ký</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                        {userSearchTerm ? 'Không tìm thấy người dùng nào' : 'Không có người dùng nào'}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td><strong>{user.full_name}</strong></td>
                        <td>{user.email}</td>
                        <td>{user.phone || 'N/A'}</td>
                        <td>
                          <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                            {user.role === 'admin' ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td>
                          <span className={`verify-badge ${user.is_verified ? 'verified' : 'not-verified'}`}>
                            {user.is_verified ? 'Đã xác thực' : 'Chưa xác thực'}
                          </span>
                        </td>
                        <td>{formatDate(user.created_at)}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-text btn-view"
                              onClick={() => openUserDetail(user)}
                            >
                              Xem
                            </button>
                            <button 
                              className="btn-text btn-delete"
                              onClick={() => deleteUser(user.id)}
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Statistics */}
        {activeTab === 'statistics' && (
          <div className="content-section">
            <div className="statistics-content">
              <h3>Thống kê tổng quan hệ thống</h3>
              <p>Tính năng thống kê chi tiết đang được phát triển...</p>
            </div>
          </div>
        )}

        {/* User Detail Modal */}
        {isUserModalOpen && selectedUser && (
          <div className="modal-overlay" onClick={closeUserModal}>
            <div className="modal-content user-modal-large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  {isEditingUser ? 'Chỉnh sửa người dùng' : 'Chi tiết người dùng'}
                </h2>
                <button className="modal-close" onClick={closeUserModal}>&times;</button>
              </div>
              
              <div className="modal-body">
                {/* Avatar Section */}
                {selectedUser.avatar_url && (
                  <div className="user-avatar-section">
                    <img src={selectedUser.avatar_url} alt={selectedUser.full_name} className="user-avatar-large" />
                  </div>
                )}

                <div className="user-detail-info">
                  <div className="detail-row">
                    <label>Họ tên:</label>
                    {isEditingUser ? (
                      <input
                        type="text"
                        value={editedUser.full_name}
                        onChange={(e) => setEditedUser({...editedUser, full_name: e.target.value})}
                        className="edit-input"
                      />
                    ) : (
                      <span><strong>{selectedUser.full_name}</strong></span>
                    )}
                  </div>

                  <div className="detail-row">
                    <label>Email:</label>
                    <span>{selectedUser.email}</span>
                  </div>

                  <div className="detail-row">
                    <label>Số điện thoại:</label>
                    {isEditingUser ? (
                      <input
                        type="tel"
                        value={editedUser.phone || ''}
                        onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                        className="edit-input"
                        placeholder="Nhập số điện thoại"
                      />
                    ) : (
                      <span>{selectedUser.phone || 'Chưa cập nhật'}</span>
                    )}
                  </div>

                  <div className="detail-row">
                    <label>Ngày sinh:</label>
                    {isEditingUser ? (
                      <input
                        type="date"
                        value={editedUser.date_of_birth || ''}
                        onChange={(e) => setEditedUser({...editedUser, date_of_birth: e.target.value})}
                        className="edit-input"
                      />
                    ) : (
                      <span>{selectedUser.date_of_birth ? formatDate(selectedUser.date_of_birth) : 'Chưa cập nhật'}</span>
                    )}
                  </div>

                  <div className="detail-row">
                    <label>CMND/CCCD:</label>
                    {isEditingUser ? (
                      <input
                        type="text"
                        value={editedUser.national_id || ''}
                        onChange={(e) => setEditedUser({...editedUser, national_id: e.target.value})}
                        className="edit-input"
                        placeholder="Nhập số CMND/CCCD"
                      />
                    ) : (
                      <span>{selectedUser.national_id || 'Chưa cập nhật'}</span>
                    )}
                  </div>

                  <div className="detail-row">
                    <label>Địa chỉ:</label>
                    {isEditingUser ? (
                      <textarea
                        value={editedUser.address || ''}
                        onChange={(e) => setEditedUser({...editedUser, address: e.target.value})}
                        className="edit-textarea"
                        placeholder="Nhập địa chỉ"
                        rows="2"
                      />
                    ) : (
                      <span>{selectedUser.address || 'Chưa cập nhật'}</span>
                    )}
                  </div>

                  <div className="detail-row">
                    <label>Số dư ví:</label>
                    {isEditingUser ? (
                      <input
                        type="text"
                        value={formatNumberWithDots(editedUser.balance || 0)}
                        onChange={(e) => {
                          const numValue = parseFormattedNumber(e.target.value);
                          setEditedUser({...editedUser, balance: numValue});
                        }}
                        className="edit-input balance-input"
                        placeholder="Nhập số dư (VD: 1.000.000)"
                      />
                    ) : (
                      <span className="balance-amount">{formatCurrency(selectedUser.balance || 0)}</span>
                    )}
                  </div>

                  <div className="detail-row">
                    <label>Vai trò:</label>
                    {isEditingUser ? (
                      <select
                        value={editedUser.role}
                        onChange={(e) => setEditedUser({...editedUser, role: e.target.value})}
                        className="edit-input"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`role-badge ${selectedUser.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                        {selectedUser.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    )}
                  </div>

                  <div className="detail-row">
                    <label>Trạng thái xác thực:</label>
                    {isEditingUser ? (
                      <select
                        value={editedUser.is_verified ? 'true' : 'false'}
                        onChange={(e) => setEditedUser({...editedUser, is_verified: e.target.value === 'true'})}
                        className="edit-input"
                      >
                        <option value="false">Chưa xác thực</option>
                        <option value="true">Đã xác thực</option>
                      </select>
                    ) : (
                      <span className={`verify-badge ${selectedUser.is_verified ? 'verified' : 'not-verified'}`}>
                        {selectedUser.is_verified ? 'Đã xác thực' : 'Chưa xác thực'}
                      </span>
                    )}
                  </div>

                  <div className="detail-row">
                    <label>Ngày đăng ký:</label>
                    <span>{formatDate(selectedUser.created_at)}</span>
                  </div>

                  <div className="detail-row">
                    <label>Cập nhật lần cuối:</label>
                    <span>{formatDate(selectedUser.updated_at)}</span>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                {isEditingUser ? (
                  <>
                    <button 
                      className="btn-save"
                      onClick={updateUser}
                    >
                      Lưu thay đổi
                    </button>
                    <button 
                      className="btn-cancel-edit"
                      onClick={() => {
                        setIsEditingUser(false);
                        setEditedUser(selectedUser);
                      }}
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="btn-edit-user"
                      onClick={() => setIsEditingUser(true)}
                    >
                      Chỉnh sửa
                    </button>
                    {!selectedUser.is_verified && (
                      <button 
                        className="btn-verify-action"
                        onClick={() => {
                          toggleUserVerification(selectedUser.id, selectedUser.is_verified);
                        }}
                      >
                        Xác thực người dùng
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Create User Modal */}
        {isCreateUserModalOpen && (
          <div className="modal-overlay" onClick={closeCreateUserModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Tạo người dùng mới</h2>
                <button className="modal-close" onClick={closeCreateUserModal}>&times;</button>
              </div>
              
              <div className="modal-body">
                <div className="user-detail-info">
                  <div className="detail-row">
                    <label>Họ tên: *</label>
                    <input
                      type="text"
                      value={newUser.full_name}
                      onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                      className="edit-input"
                      placeholder="Nhập họ tên"
                      required
                    />
                  </div>

                  <div className="detail-row">
                    <label>Email: *</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="edit-input"
                      placeholder="Nhập email"
                      required
                    />
                  </div>

                  <div className="detail-row">
                    <label>Mật khẩu: *</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="edit-input"
                      placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                      required
                    />
                  </div>

                  <div className="detail-row">
                    <label>Số điện thoại:</label>
                    <input
                      type="tel"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                      className="edit-input"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  <div className="detail-row">
                    <label>Vai trò:</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      className="edit-input"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="detail-row">
                    <label>Trạng thái xác thực:</label>
                    <select
                      value={newUser.is_verified ? 'true' : 'false'}
                      onChange={(e) => setNewUser({...newUser, is_verified: e.target.value === 'true'})}
                      className="edit-input"
                    >
                      <option value="false">Chưa xác thực</option>
                      <option value="true">Đã xác thực</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="btn-save"
                  onClick={createUser}
                >
                  Tạo người dùng
                </button>
                <button 
                  className="btn-cancel-edit"
                  onClick={closeCreateUserModal}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
