import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy session hiện tại
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Lắng nghe sự thay đổi auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Đăng ký
  const signUp = async (email, password, fullName, phone) => {
    try {
      // Bước 1: Tạo auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Bước 2: Tạo user trong public.users table
        const { error: userError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: email,
              full_name: fullName,
              phone: phone,
              role: 'user',
              is_verified: false,
            }
          ]);

        if (userError) {
          console.error('Error creating user profile:', userError);
          throw userError;
        }

        // Trigger sẽ tự động tạo wallet cho user
      }

      return { data: authData, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }
  };

  // Đăng nhập
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  };

  // Đăng xuất
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { data: null, error };
    }
  };

  // Update password
  const updatePassword = async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      // Đăng xuất sau khi đổi mật khẩu thành công
      // User sẽ cần đăng nhập lại với mật khẩu mới
      await supabase.auth.signOut();

      return { data, error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { data: null, error };
    }
  };

  // Lấy thông tin user profile từ public.users
  const getUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Get user profile error:', error);
      return { data: null, error };
    }
  };

  // Lấy role của user hiện tại
  const getUserRole = async () => {
    try {
      if (!user?.id) return { role: null, error: new Error('No user logged in') };

      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      return { role: data?.role, error: null };
    } catch (error) {
      console.error('Get user role error:', error);
      return { role: null, error };
    }
  };

  // Xóa ảnh từ Supabase Storage
  const deleteImageFromStorage = async (imageUrl, bucket = 'avatars') => {
    try {
      if (!imageUrl) return { success: true, error: null };

      // Extract file path from URL
      // URL format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
      const urlParts = imageUrl.split(`/${bucket}/`);
      if (urlParts.length < 2) {
        console.warn('Invalid image URL format:', imageUrl);
        return { success: false, error: new Error('Invalid URL format') };
      }

      const filePath = urlParts[1];

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Delete image error:', error);
      return { success: false, error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    getUserProfile,
    getUserRole,
    deleteImageFromStorage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
