'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserAccount } from '@/types/auth';
import { EmployeeProfile } from '@/types/employee';
import { storage } from './storage';

interface AuthContextType {
  currentUser: UserAccount | null;
  currentEmployee: EmployeeProfile | null;
  users: UserAccount[];
  employees: EmployeeProfile[];
  login: (username: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;
  switchUser: (userId: string) => void;
  changePassword: (oldPass: string, newPass: string) => { success: boolean; error?: string };
  refreshData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'ecomfree_current_user_id';
const LAST_ACTIVITY_KEY = 'ecomfree_last_activity';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 mins per NFR-04

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserAccount[]>(() => storage.getUsers());
  const [employees, setEmployees] = useState<EmployeeProfile[]>(() => storage.getEmployees());

  const getInitialUser = (): { user: UserAccount | null; emp: EmployeeProfile | null } => {
    if (typeof window === 'undefined') {
      const u = storage.getUsers()[0] || null;
      const e = storage.getEmployees().find(emp => emp.employeeCode === u?.employeeCode) || null;
      return { user: u, emp: e };
    }

    const loadedUsers = storage.getUsers();
    const loadedEmployees = storage.getEmployees();
    const savedUserId = localStorage.getItem(CURRENT_USER_KEY);
    const active = loadedUsers.find(u => u.id === (savedUserId || 'u-hr-01')) || loadedUsers[0];

    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (lastActivity && Date.now() - parseInt(lastActivity, 10) > SESSION_TIMEOUT_MS) {
      localStorage.removeItem(CURRENT_USER_KEY);
      return { user: null, emp: null };
    }

    if (active && active.isActive) {
      const emp = loadedEmployees.find(e => e.employeeCode === active.employeeCode) || null;
      return { user: active, emp };
    }

    return { user: null, emp: null };
  };

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getInitialUser().user);
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeProfile | null>(() => getInitialUser().emp);

  const refreshData = useCallback(() => {
    const loadedUsers = storage.getUsers();
    const loadedEmployees = storage.getEmployees();
    setUsers(loadedUsers);
    setEmployees(loadedEmployees);

    const savedUserId = typeof window !== 'undefined' ? localStorage.getItem(CURRENT_USER_KEY) : null;
    const active = loadedUsers.find(u => u.id === (savedUserId || 'u-hr-01')) || loadedUsers[0];

    if (active && active.isActive) {
      setCurrentUser(active);
      const emp = loadedEmployees.find(e => e.employeeCode === active.employeeCode);
      setCurrentEmployee(emp || null);
    } else {
      setCurrentUser(null);
      setCurrentEmployee(null);
    }
  }, []);

  useEffect(() => {
    const handleActivity = () => {
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, []);

  const login = (username: string, pass: string): { success: boolean; error?: string } => {
    const allUsers = storage.getUsers();
    const cleanUsername = username.trim().toLowerCase();
    const found = allUsers.find(
      u => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanUsername
    );

    if (!found) {
      return { success: false, error: 'Tên đăng nhập hoặc mật khẩu không chính xác.' };
    }

    if (!found.isActive) {
      return { success: false, error: 'Tài khoản này đã bị khóa. Vui lòng liên hệ phòng Nhân sự (HR).' };
    }

    if (pass.length < 6) {
      return { success: false, error: 'Mật khẩu phải có độ dài tối thiểu 6 ký tự.' };
    }

    const updatedUser = { ...found, lastLoginAt: new Date().toISOString() };
    const updatedUsers = allUsers.map(u => u.id === found.id ? updatedUser : u);
    storage.saveUsers(updatedUsers);
    setUsers(updatedUsers);
    setCurrentUser(updatedUser);

    const allEmps = storage.getEmployees();
    const emp = allEmps.find(e => e.employeeCode === found.employeeCode);
    setCurrentEmployee(emp || null);

    localStorage.setItem(CURRENT_USER_KEY, found.id);
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());

    storage.addAuditLog({
      userId: found.id,
      userName: found.fullName,
      userRole: found.role,
      action: 'LOGIN',
      actionTitle: 'Đăng nhập hệ thống',
      module: 'Hệ thống',
      targetObject: `Tài khoản ${found.username}`,
      details: `Đăng nhập thành công với vai trò ${found.role}`,
    });

    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      storage.addAuditLog({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUser.role,
        action: 'LOGOUT',
        actionTitle: 'Đăng xuất hệ thống',
        module: 'Hệ thống',
        targetObject: `Tài khoản ${currentUser.username}`,
        details: 'Người dùng đã đăng xuất an toàn khỏi hệ thống',
      });
    }
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    setCurrentUser(null);
    setCurrentEmployee(null);
  };

  const switchUser = (userId: string) => {
    const allUsers = storage.getUsers();
    const target = allUsers.find(u => u.id === userId);
    if (!target) return;

    if (!target.isActive) {
      alert(`Tài khoản "${target.username}" hiện đang bị KHÓA. Không thể chuyển sang tài khoản này.`);
      return;
    }

    setCurrentUser(target);
    const allEmps = storage.getEmployees();
    const emp = allEmps.find(e => e.employeeCode === target.employeeCode);
    setCurrentEmployee(emp || null);
    localStorage.setItem(CURRENT_USER_KEY, target.id);
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());

    storage.addAuditLog({
      userId: target.id,
      userName: target.fullName,
      userRole: target.role,
      action: 'LOGIN',
      actionTitle: 'Chuyển phiên vai trò (Demo)',
      module: 'Hệ thống',
      targetObject: `Tài khoản ${target.username}`,
      details: `Chuyển trực tiếp sang vai trò ${target.role} để kiểm thử phân quyền`,
    });
  };

  const changePassword = (oldPass: string, newPass: string): { success: boolean; error?: string } => {
    if (!currentUser) return { success: false, error: 'Chưa đăng nhập' };

    if (!oldPass || oldPass.length < 6) {
      return { success: false, error: 'Vui lòng nhập mật khẩu hiện tại chính xác (tối thiểu 6 ký tự).' };
    }

    if (!newPass || newPass.length < 6) {
      return { success: false, error: 'Mật khẩu mới phải có ít nhất 6 ký tự.' };
    }

    if (oldPass === newPass) {
      return { success: false, error: 'Mật khẩu mới không được trùng với mật khẩu cũ.' };
    }

    storage.addAuditLog({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUser.role,
      action: 'CHANGE_PASSWORD',
      actionTitle: 'Đổi mật khẩu tài khoản',
      module: 'Tài khoản & Phân quyền',
      targetObject: `Tài khoản ${currentUser.username}`,
      details: 'Người dùng tự đổi mật khẩu cá nhân thành công',
    });

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentEmployee,
        users,
        employees,
        login,
        logout,
        switchUser,
        changePassword,
        refreshData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
