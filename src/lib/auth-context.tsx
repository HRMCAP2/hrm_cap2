
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
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
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeProfile | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const refreshData = useCallback(() => {
    const loadedUsers = storage.getUsers();
    const loadedEmployees = storage.getEmployees();

    setUsers(loadedUsers);
    setEmployees(loadedEmployees);

    const savedUserId = localStorage.getItem(CURRENT_USER_KEY);
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);

    if (
      lastActivity &&
      Date.now() - Number(lastActivity) > SESSION_TIMEOUT_MS
    ) {
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem(LAST_ACTIVITY_KEY);
      setCurrentUser(null);
      setCurrentEmployee(null);
      return;
    }

    const active = savedUserId
      ? loadedUsers.find((user) => user.id === savedUserId)
      : null;

    if (active?.isActive) {
      setCurrentUser(active);
      const employee =
        loadedEmployees.find((item) => item.employeeCode === active.employeeCode) || null;
      setCurrentEmployee(employee);
    } else {
      setCurrentUser(null);
      setCurrentEmployee(null);
    }
  }, []);

  useEffect(() => {
    refreshData();
    setIsInitialized(true);
  }, [refreshData]);

  useEffect(() => {
    if (!isInitialized) return;

    const handleActivity = () => {
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [isInitialized]);

  const login = (username: string, pass: string) => {
    const allUsers = storage.getUsers();
    const cleanUsername = username.trim().toLowerCase();

    const found = allUsers.find(
      (user) =>
        user.username.toLowerCase() === cleanUsername ||
        user.email.toLowerCase() === cleanUsername
    );

    if (!found) {
      return { success: false, error: 'Tên đăng nhập hoặc mật khẩu không chính xác.' };
    }

    if (!found.isActive) {
      return {
        success: false,
        error: 'Tài khoản này đã bị khóa. Vui lòng liên hệ phòng Nhân sự (HR).',
      };
    }

    if (pass.length < 6) {
      return {
        success: false,
        error: 'Mật khẩu phải có độ dài tối thiểu 6 ký tự.',
      };
    }

    const updatedUser = { ...found, lastLoginAt: new Date().toISOString() };
    const updatedUsers = allUsers.map((user) =>
      user.id === found.id ? updatedUser : user
    );

    storage.saveUsers(updatedUsers);
    setUsers(updatedUsers);
    setCurrentUser(updatedUser);

    const allEmployees = storage.getEmployees();
    setEmployees(allEmployees);

    const employee =
      allEmployees.find((item) => item.employeeCode === found.employeeCode) || null;
    setCurrentEmployee(employee);

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
    const target = allUsers.find((user) => user.id === userId);

    if (!target) return;

    if (!target.isActive) {
      alert(`Tài khoản "${target.username}" hiện đang bị KHÓA. Không thể chuyển sang tài khoản này.`);
      return;
    }

    setCurrentUser(target);

    const allEmployees = storage.getEmployees();
    setEmployees(allEmployees);

    const employee =
      allEmployees.find((item) => item.employeeCode === target.employeeCode) || null;
    setCurrentEmployee(employee);

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

  const changePassword = (oldPass: string, newPass: string) => {
    if (!currentUser) {
      return { success: false, error: 'Chưa đăng nhập' };
    }

    if (!oldPass || oldPass.length < 6) {
      return {
        success: false,
        error: 'Vui lòng nhập mật khẩu hiện tại chính xác (tối thiểu 6 ký tự).',
      };
    }

    if (!newPass || newPass.length < 6) {
      return {
        success: false,
        error: 'Mật khẩu mới phải có ít nhất 6 ký tự.',
      };
    }

    if (oldPass === newPass) {
      return {
        success: false,
        error: 'Mật khẩu mới không được trùng với mật khẩu cũ.',
      };
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

  if (!isInitialized) {
    return <div className="min-h-screen bg-slate-100" />;
  }

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
