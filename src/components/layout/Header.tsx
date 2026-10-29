'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Icons } from '../icons';
import { NotificationBell } from '../notifications/NotificationBell';
import { ChangePasswordModal } from '../accounts/ChangePasswordModal';

export function Header() {
  const { currentUser, switchUser, logout, users } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'HR':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Lead':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Accountant':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Employee':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getRoleDisplayName = (role?: string) => {
    switch (role) {
      case 'HR':
        return 'Admin / HR';
      case 'Lead':
        return 'Team Lead';
      case 'Accountant':
        return 'Kế toán';
      case 'Employee':
        return 'Nhân viên';
      default:
        return role;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-xs">
      {/* Left branding */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-linear-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-sm">
          EF
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 tracking-tight text-lg">Ecomfree HRM</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              MVP Sprint 1
            </span>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block">Hệ thống Quản lý nhân sự & Phân quyền tập trung</p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Demo Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs">
          <span className="text-slate-500 font-medium px-1.5 hidden md:inline flex items-center gap-1">
            <Icons.Shield size={14} className="text-indigo-600 inline" /> Chuyển vai trò test:
          </span>
          <select
            value={currentUser?.id || ''}
            onChange={(e) => switchUser(e.target.value)}
            className="bg-white border border-slate-200 rounded-md py-1 px-2 font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs cursor-pointer shadow-2xs"
            title="Chuyển đổi vai trò người dùng để kiểm thử phân quyền (FR-03)"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id} disabled={!u.isActive}>
                {u.fullName} — [{getRoleDisplayName(u.role)}] {!u.isActive ? '(ĐÃ KHÓA)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Notifications */}
        <NotificationBell />

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 pl-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors focus:outline-hidden text-left"
          >
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-slate-800 leading-tight">
                {currentUser?.fullName}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded-sm border ${getRoleBadgeColor(currentUser?.role)}`}>
                  {getRoleDisplayName(currentUser?.role)}
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs uppercase border border-slate-300">
              {currentUser?.fullName?.charAt(0) || 'U'}
            </div>
            <Icons.ChevronDown size={14} className="text-slate-400" />
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-sm animate-in fade-in slide-in-from-top-1"
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="font-semibold text-slate-900">{currentUser?.fullName}</div>
                <div className="text-xs text-slate-500">{currentUser?.email}</div>
                <div className="text-xs text-indigo-600 font-medium mt-1">
                  Mã NV: {currentUser?.employeeCode || 'Chưa gắn'}
                </div>
              </div>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  setShowPasswordModal(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors text-left text-xs"
              >
                <Icons.Key size={16} className="text-slate-500" />
                <span>Đổi mật khẩu (FR-01)</span>
              </button>

              <div className="border-t border-slate-100 my-1"></div>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 transition-colors text-left text-xs"
              >
                <Icons.LogOut size={16} className="text-red-500" />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </header>
  );
}
