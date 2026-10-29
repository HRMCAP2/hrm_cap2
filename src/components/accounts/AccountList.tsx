'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { storage } from '@/lib/storage';
import { UserAccount } from '@/types/auth';
import { Icons } from '../icons';
import { AccountModal } from './AccountModal';

export function AccountList() {
  const { currentUser, users, refreshData } = useAuth();
  const [selectedAccount, setSelectedAccount] = useState<UserAccount | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Security Access Control Check (FR-03, US-13 E)
  if (currentUser?.role !== 'HR') {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center max-w-xl mx-auto my-12 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <Icons.Shield size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Từ chối quyền truy cập (403 Forbidden)</h2>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          Theo quy tắc bảo mật và phân quyền dữ liệu (FR-03 / NFR-05), chỉ quản trị viên phòng Nhân sự (HR) mới có quyền truy cập vào phân hệ Quản lý tài khoản và phân quyền.
        </p>
        <div className="mt-4 p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500">
          Vai trò hiện tại của bạn: <strong>{currentUser?.role}</strong> ({currentUser?.fullName})
        </div>
      </div>
    );
  }

  // Filtered accounts
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;

    return matchSearch && matchRole;
  });

  // Toggle Lock/Unlock account (FR-02)
  const handleToggleLock = (account: UserAccount) => {
    const isLocking = account.isActive;
    const actionText = isLocking ? 'khóa' : 'mở khóa';

    if (account.id === currentUser.id) {
      alert('Bạn không thể tự khóa tài khoản của chính mình!');
      return;
    }

    if (
      !confirm(
        `Bạn có chắc chắn muốn ${actionText} tài khoản "${account.username}" (${account.fullName})?`
      )
    ) {
      return;
    }

    const allUsers = storage.getUsers();
    const updated = allUsers.map((u) =>
      u.id === account.id ? { ...u, isActive: !isLocking } : u
    );
    storage.saveUsers(updated);

    // Audit Log (FR-35)
    storage.addAuditLog({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUser.role,
      action: isLocking ? 'LOCK_USER' : 'UNLOCK_USER',
      actionTitle: isLocking ? 'Khóa tài khoản người dùng' : 'Mở khóa tài khoản người dùng',
      module: 'Tài khoản & Phân quyền',
      targetObject: `Tài khoản ${account.username}`,
      details: `${isLocking ? 'Khóa' : 'Mở khóa'} tài khoản người dùng ${account.fullName} (${account.role})`,
      oldValue: { isActive: account.isActive },
      newValue: { isActive: !isLocking },
    });

    // Notification
    storage.addNotification({
      recipientId: account.id,
      title: isLocking ? 'Tài khoản bị khóa' : 'Tài khoản được mở khóa',
      message: `Tài khoản của bạn đã được ${actionText} bởi Quản trị viên HR.`,
      type: 'ACCOUNT_STATUS',
      senderName: currentUser.fullName,
    });

    refreshData();
  };

  // Reset password (FR-02)
  const handleResetPassword = (account: UserAccount) => {
    if (
      !confirm(
        `Đặt lại mật khẩu cho tài khoản "${account.username}" về mật khẩu mặc định "123456"?`
      )
    ) {
      return;
    }

    // Audit Log
    storage.addAuditLog({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUser.role,
      action: 'UPDATE_USER',
      actionTitle: 'Đặt lại mật khẩu người dùng',
      module: 'Tài khoản & Phân quyền',
      targetObject: `Tài khoản ${account.username}`,
      details: `HR đặt lại mật khẩu về mặc định cho tài khoản ${account.username}`,
    });

    alert(`Đã đặt lại mật khẩu của ${account.username} thành "123456" thành công.`);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'HR':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Lead':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Accountant':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Employee':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Quản lý tài khoản &amp; Phân quyền</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
              Chỉ HR có quyền (FR-02)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cấp tài khoản, phân quyền đúng 1 vai trò (Nhân viên, Lead, HR, Kế toán) và khóa tài khoản khi cần (FR-02, BR-06)
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedAccount(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Icons.UserPlus size={16} /> Cấp tài khoản mới (FR-02)
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Icons.Search size={14} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo username, họ tên, email..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="HR">HR / Admin</option>
              <option value="Lead">Team Lead</option>
              <option value="Employee">Nhân viên (Employee)</option>
              <option value="Accountant">Kế toán (Accountant)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Account Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Tên đăng nhập</th>
                <th className="py-3 px-4">Họ và tên</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Mã NV liên kết</th>
                <th className="py-3 px-4">Vai trò (Role)</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Đăng nhập gần nhất</th>
                <th className="py-3 px-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Không tìm thấy tài khoản nào.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {acc.username}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {acc.fullName}
                    </td>

                    <td className="py-3 px-4 text-slate-500">
                      {acc.email}
                    </td>

                    <td className="py-3 px-4 font-mono">
                      {acc.employeeCode ? (
                        <span className="text-indigo-600 font-bold">{acc.employeeCode}</span>
                      ) : (
                        <span className="text-slate-400 italic">Chưa gắn</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${getRoleBadge(acc.role)}`}>
                        {acc.role}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {acc.isActive ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <Icons.Lock size={10} />
                          Đã khóa
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {acc.lastLoginAt
                        ? new Date(acc.lastLoginAt).toLocaleString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit',
                          })
                        : 'Chưa đăng nhập'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Lock / Unlock (FR-02) */}
                        <button
                          onClick={() => handleToggleLock(acc)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            acc.isActive
                              ? 'text-slate-600 hover:text-rose-600 hover:bg-rose-50'
                              : 'text-rose-600 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={acc.isActive ? 'Khóa tài khoản (FR-02)' : 'Mở khóa tài khoản (FR-02)'}
                        >
                          {acc.isActive ? <Icons.Lock size={15} /> : <Icons.Unlock size={15} />}
                        </button>

                        {/* Reset password */}
                        <button
                          onClick={() => handleResetPassword(acc)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Đặt lại mật khẩu mặc định (FR-02)"
                        >
                          <Icons.Key size={15} />
                        </button>

                        {/* Edit Role / Account */}
                        <button
                          onClick={() => {
                            setSelectedAccount(acc);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Chỉnh sửa vai trò & thông tin"
                        >
                          <Icons.Edit size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>
            Tổng số: <strong>{filteredUsers.length}</strong> tài khoản trong hệ thống
          </span>
          <span className="text-slate-400">
            Tài khoản bị khóa sẽ không thể đăng nhập (TS-02 / FR-02).
          </span>
        </div>
      </div>

      {isModalOpen && (
        <AccountModal
          account={selectedAccount}
          onClose={() => setIsModalOpen(false)}
          onSuccess={refreshData}
        />
      )}
    </div>
  );
}
