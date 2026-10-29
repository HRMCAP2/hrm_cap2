'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { storage } from '@/lib/storage';
import { UserAccount, UserRole } from '@/types/auth';
import { Icons } from '../icons';

interface Props {
  account?: UserAccount | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ROLES: { value: UserRole; label: string; desc: string }[] = [
  { value: 'HR', label: 'HR / Admin', desc: 'Quản trị hồ sơ nhân sự, tài khoản và tra cứu nhật ký' },
  { value: 'Lead', label: 'Team Lead', desc: 'Xếp ca ngày, duyệt giờ làm & sản lượng nhóm, không xem lương' },
  { value: 'Employee', label: 'Nhân viên (Employee)', desc: 'Chấm công, báo sản lượng, gửi đơn, xem hồ sơ & phiếu của mình' },
  { value: 'Accountant', label: 'Kế toán (Accountant)', desc: 'Quản lý đơn giá, tính lương, chốt kỳ, xuất file chuyển khoản' },
];

export function AccountModal({ account, onClose, onSuccess }: Props) {
  const { currentUser, employees } = useAuth();
  const isEditing = Boolean(account);

  const [username, setUsername] = useState(account?.username || '');
  const [email, setEmail] = useState(account?.email || '');
  const [fullName, setFullName] = useState(account?.fullName || '');
  const [role, setRole] = useState<UserRole>(account?.role || 'Employee');
  const [password, setPassword] = useState(isEditing ? '' : '123456');
  const [employeeCode, setEmployeeCode] = useState(account?.employeeCode || '');
  const [department, setDepartment] = useState(account?.department || 'Customer Support');
  const [error, setError] = useState<string | null>(null);

  // When choosing an employee code, auto fill full name, email, department
  const handleEmployeeCodeChange = (code: string) => {
    setEmployeeCode(code);
    const emp = employees.find((e) => e.employeeCode === code);
    if (emp) {
      setFullName(emp.fullName);
      setEmail(emp.email);
      setDepartment(emp.department);
      if (!username) {
        setUsername(emp.email.split('@')[0]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername) {
      setError('Vui lòng nhập tên đăng nhập.');
      return;
    }

    if (!isEditing && password.length < 6) {
      setError('Mật khẩu mặc định tối thiểu 6 ký tự.');
      return;
    }

    const allUsers = storage.getUsers();

    // Check duplicate username
    const isDup = allUsers.some(
      (u) => u.username.toLowerCase() === cleanUsername && u.id !== account?.id
    );
    if (isDup) {
      setError(`Tên đăng nhập "${cleanUsername}" đã tồn tại. Vui lòng chọn tên khác.`);
      return;
    }

    if (isEditing && account) {
      const updatedUser: UserAccount = {
        ...account,
        username: cleanUsername,
        email,
        fullName,
        role,
        employeeCode: employeeCode || undefined,
        department,
      };

      const updatedList = allUsers.map((u) => (u.id === account.id ? updatedUser : u));
      storage.saveUsers(updatedList);

      // Audit Log (FR-35)
      storage.addAuditLog({
        userId: currentUser?.id || 'admin',
        userName: currentUser?.fullName || 'HR Admin',
        userRole: currentUser?.role || 'HR',
        action: 'UPDATE_USER',
        actionTitle: 'Cập nhật tài khoản & Phân quyền',
        module: 'Tài khoản & Phân quyền',
        targetObject: `Tài khoản ${updatedUser.username} (${updatedUser.fullName})`,
        details: `Cập nhật vai trò thành [${role}], phòng ban [${department}]`,
        oldValue: account,
        newValue: updatedUser,
      });

      // Notification
      storage.addNotification({
        recipientId: updatedUser.id,
        title: 'Cập nhật quyền tài khoản',
        message: `Tài khoản của bạn đã được cập nhật vai trò mới: ${role}.`,
        type: 'ACCOUNT_STATUS',
        senderName: currentUser?.fullName || 'HR Admin',
      });
    } else {
      const newUser: UserAccount = {
        id: `user-${Date.now()}`,
        username: cleanUsername,
        email,
        fullName,
        role,
        isActive: true,
        employeeCode: employeeCode || undefined,
        department,
        createdAt: new Date().toISOString(),
      };

      storage.saveUsers([...allUsers, newUser]);

      // Audit Log (FR-35)
      storage.addAuditLog({
        userId: currentUser?.id || 'admin',
        userName: currentUser?.fullName || 'HR Admin',
        userRole: currentUser?.role || 'HR',
        action: 'CREATE_USER',
        actionTitle: 'Cấp mới tài khoản người dùng',
        module: 'Tài khoản & Phân quyền',
        targetObject: `Tài khoản ${newUser.username}`,
        details: `Tạo tài khoản mới với vai trò ${role} (FR-02)`,
        newValue: newUser,
      });

      storage.addNotification({
        recipientId: 'ALL',
        title: 'Tài khoản người dùng mới',
        message: `Quản trị viên đã cấp tài khoản truy cập cho ${newUser.fullName} (${role}).`,
        type: 'ACCOUNT_STATUS',
        senderName: currentUser?.fullName || 'HR Admin',
      });
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg my-8 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Icons.Shield size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {isEditing ? 'Chỉnh sửa tài khoản & phân quyền' : 'Cấp mới tài khoản người dùng'}
              </h3>
              <p className="text-xs text-slate-500">
                Gán đúng một vai trò người dùng theo FR-02
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Icons.X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <Icons.AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Link to Employee Profile */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Liên kết hồ sơ nhân sự (Nếu có):
            </label>
            <select
              value={employeeCode}
              onChange={(e) => handleEmployeeCodeChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">-- Không liên kết (Tài khoản độc lập) --</option>
              {employees.map((e) => (
                <option key={e.id} value={e.employeeCode}>
                  [{e.employeeCode}] {e.fullName} — {e.position} ({e.department})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tên đăng nhập <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="vd: lead.design"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Họ và tên hiển thị <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Email tài khoản <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@ecomfree.vn"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {!isEditing && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Mật khẩu khởi tạo <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự (mặc định 123456)"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Role selection - FR-02: Gán đúng 1 vai trò */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Phân quyền vai trò hệ thống (FR-02) <span className="text-rose-500">*</span>
            </label>
            <div className="space-y-2">
              {ROLES.map((r) => (
                <label
                  key={r.value}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    role === r.value
                      ? 'bg-indigo-50 border-indigo-400 ring-1 ring-indigo-400'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="accountRole"
                    value={r.value}
                    checked={role === r.value}
                    onChange={() => setRole(r.value)}
                    className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="font-bold text-slate-900">{r.label}</div>
                    <div className="text-[11px] text-slate-500">{r.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors shadow-xs"
            >
              {isEditing ? 'Lưu thay đổi' : 'Cấp tài khoản'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
