'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { storage } from '@/lib/storage';
import {
  EmployeeProfile,
  DepartmentType,
  PositionType,
  ContractType,
  PaymentMethodType,
  WorkStatusType,
} from '@/types/employee';
import { Icons } from '../icons';

interface Props {
  employee?: EmployeeProfile | null;
  onClose: () => void;
  onSuccess: () => void;
}

const DEPARTMENTS: DepartmentType[] = [
  'Customer Support',
  'Graphic Design',
  'Operations & Fulfillment',
  'Finance & Admin',
  'Technology',
];

const POSITIONS: PositionType[] = [
  'Support Specialist',
  'Graphic Designer POD',
  'Order Fulfillment Staff',
  'Customer Support Lead',
  'Design Lead',
  'Operations Lead',
  'HR Specialist',
  'General Accountant',
];

const CONTRACT_TYPES: ContractType[] = [
  'Chính thức',
  'Thử việc',
  'Thời vụ',
  'Cộng tác viên (CTV)',
];

const PAYMENT_METHODS: PaymentMethodType[] = [
  'Theo giờ',
  'Theo sản lượng',
  'Lương cố định',
  'Kết hợp',
];

const WORK_STATUSES: WorkStatusType[] = [
  'Đang làm việc',
  'Tạm hoãn',
  'Đã thôi việc',
];

export function EmployeeModal({ employee, onClose, onSuccess }: Props) {
  const { currentUser, employees } = useAuth();
  const isEditing = Boolean(employee);

  // Auto-generate code if new: EF-0XX
  const generateNewCode = () => {
    const existingCodes = employees.map((e) => {
      const match = e.employeeCode.match(/EF-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });
    const maxNum = existingCodes.length > 0 ? Math.max(...existingCodes) : 0;
    const nextNum = maxNum + 1;
    return `EF-${nextNum.toString().padStart(3, '0')}`;
  };

  const [formData, setFormData] = useState<Partial<EmployeeProfile>>({
    employeeCode: employee?.employeeCode || generateNewCode(),
    fullName: employee?.fullName || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    dateOfBirth: employee?.dateOfBirth || '2000-01-01',
    identityCard: employee?.identityCard || '',
    address: employee?.address || 'Đà Nẵng',
    department: employee?.department || 'Customer Support',
    position: employee?.position || 'Support Specialist',
    directLeadName: employee?.directLeadName || 'Trần Văn Tuấn',
    contractType: employee?.contractType || 'Chính thức',
    contractStartDate: employee?.contractStartDate || new Date().toISOString().split('T')[0],
    contractEndDate: employee?.contractEndDate || '',
    ndaStatus: employee?.ndaStatus || 'Đã ký',
    ndaSignedDate: employee?.ndaSignedDate || new Date().toISOString().split('T')[0],
    paymentMethod: employee?.paymentMethod || 'Theo giờ',
    baseSalaryOrRate: employee?.baseSalaryOrRate || 35000,
    bankName: employee?.bankName || 'Vietcombank',
    bankAccountNumber: employee?.bankAccountNumber || '',
    workStatus: employee?.workStatus || 'Đang làm việc',
    annualLeaveRemaining: employee?.annualLeaveRemaining ?? 12,
    notes: employee?.notes || '',
  });

  const [error, setError] = useState<string | null>(null);

  const leads = employees.filter((e) => e.position.includes('Lead'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.employeeCode?.trim()) {
      setError('Vui lòng nhập mã nhân viên (FR-04).');
      return;
    }

    if (!formData.fullName?.trim()) {
      setError('Vui lòng nhập họ và tên nhân viên.');
      return;
    }

    if (!formData.email?.trim() || !formData.email.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }

    // Check duplicate code
    const isCodeDuplicated = employees.some(
      (emp) =>
        emp.employeeCode.toUpperCase() === formData.employeeCode?.toUpperCase() &&
        emp.id !== employee?.id
    );

    if (isCodeDuplicated) {
      setError(`Mã nhân viên "${formData.employeeCode}" đã tồn tại. Vui lòng chọn mã khác.`);
      return;
    }

    const allEmps = storage.getEmployees();

    if (isEditing && employee) {
      // Update
      const updated: EmployeeProfile = {
        ...employee,
        ...(formData as EmployeeProfile),
        updatedAt: new Date().toISOString(),
      };

      const updatedList = allEmps.map((e) => (e.id === employee.id ? updated : e));
      storage.saveEmployees(updatedList);

      // Audit Log
      storage.addAuditLog({
        userId: currentUser?.id || 'admin',
        userName: currentUser?.fullName || 'HR Admin',
        userRole: currentUser?.role || 'HR',
        action: 'UPDATE_PROFILE',
        actionTitle: 'Cập nhật hồ sơ nhân viên',
        module: 'Hồ sơ nhân viên',
        targetObject: `Nhân viên ${updated.employeeCode} (${updated.fullName})`,
        details: `Cập nhật thông tin phòng ban ${updated.department}, chức danh ${updated.position}, hợp đồng ${updated.contractType}`,
        oldValue: employee,
        newValue: updated,
      });

      // Notification
      storage.addNotification({
        recipientId: 'u-emp-01',
        title: 'Hồ sơ nhân sự đã được cập nhật',
        message: `Phòng Nhân sự đã cập nhật thông tin hồ sơ của bạn vào lúc ${new Date().toLocaleTimeString('vi-VN')}.`,
        type: 'PROFILE_UPDATE',
        senderName: currentUser?.fullName || 'HR Admin',
      });
    } else {
      // Create new
      const newEmployee: EmployeeProfile = {
        ...(formData as EmployeeProfile),
        id: `emp-${Date.now()}`,
        joinDate: formData.contractStartDate || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      storage.saveEmployees([newEmployee, ...allEmps]);

      // Audit Log
      storage.addAuditLog({
        userId: currentUser?.id || 'admin',
        userName: currentUser?.fullName || 'HR Admin',
        userRole: currentUser?.role || 'HR',
        action: 'CREATE_PROFILE',
        actionTitle: 'Tạo mới hồ sơ nhân viên',
        module: 'Hồ sơ nhân viên',
        targetObject: `Nhân viên ${newEmployee.employeeCode} (${newEmployee.fullName})`,
        details: `Tạo mới hồ sơ nhân sự mã ${newEmployee.employeeCode}, vị trí ${newEmployee.position}, phòng ban ${newEmployee.department}`,
        newValue: newEmployee,
      });

      // Notification
      storage.addNotification({
        recipientId: 'ALL',
        title: 'Nhân sự mới gia nhập Ecomfree',
        message: `Chào mừng ${newEmployee.fullName} (${newEmployee.employeeCode}) gia nhập đội ngũ ${newEmployee.department}!`,
        type: 'PROFILE_UPDATE',
        senderName: currentUser?.fullName || 'HR Admin',
      });
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl my-8 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Icons.UserPlus size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {isEditing ? 'Cập nhật hồ sơ nhân viên' : 'Thêm mới hồ sơ nhân viên'}
              </h3>
              <p className="text-xs text-slate-500">
                Tuân thủ yêu cầu chức năng FR-04 &amp; FR-05
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
              <Icons.AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Group 1: General Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-1.5">
              <Icons.User size={14} /> 1. Thông tin định danh &amp; cá nhân
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mã nhân viên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.employeeCode}
                  onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                  placeholder="EF-001"
                  className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email công việc <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@ecomfree.vn"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số điện thoại <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0905xxxxxx"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CCCD / Định danh
                </label>
                <input
                  type="text"
                  value={formData.identityCard}
                  onChange={(e) => setFormData({ ...formData, identityCard: e.target.value })}
                  placeholder="048..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Group 2: Department & Position */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-1.5">
              <Icons.Building size={14} /> 2. Phòng ban &amp; Vị trí công tác
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phòng ban / Nhóm <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value as DepartmentType })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vị trí chuyên môn <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value as PositionType })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {POSITIONS.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lead quản lý trực tiếp
                </label>
                <select
                  value={formData.directLeadName}
                  onChange={(e) => setFormData({ ...formData, directLeadName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">Không có (Cấp quản lý)</option>
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.fullName}>
                      {lead.fullName} ({lead.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Group 3: Contract & NDA Legal */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-1.5">
              <Icons.FileText size={14} /> 3. Hợp đồng &amp; Cam kết NDA / Quyền sở hữu trí tuệ IP (FR-05)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Loại hợp đồng <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.contractType}
                  onChange={(e) => setFormData({ ...formData, contractType: e.target.value as ContractType })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {CONTRACT_TYPES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ngày bắt đầu HĐ
                </label>
                <input
                  type="date"
                  value={formData.contractStartDate}
                  onChange={(e) => setFormData({ ...formData, contractStartDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ngày hết hạn HĐ
                </label>
                <input
                  type="date"
                  value={formData.contractEndDate}
                  onChange={(e) => setFormData({ ...formData, contractEndDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* NDA Status */}
              <div className="sm:col-span-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="ndaCheckbox"
                    checked={formData.ndaStatus === 'Đã ký'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ndaStatus: e.target.checked ? 'Đã ký' : 'Chưa ký',
                        ndaSignedDate: e.target.checked ? new Date().toISOString().split('T')[0] : undefined,
                      })
                    }
                    className="w-4 h-4 text-indigo-600 rounded-sm focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="ndaCheckbox" className="text-xs font-semibold text-slate-800 cursor-pointer">
                    Đã ký Thỏa thuận bảo mật thông tin (NDA) và Điều khoản quyền sở hữu trí tuệ (IP)
                  </label>
                </div>

                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-sm ${
                    formData.ndaStatus === 'Đã ký'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {formData.ndaStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Group 4: Payment & Status */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-1.5">
              <Icons.Briefcase size={14} /> 4. Hình thức trả công &amp; Trạng thái làm việc
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hình thức trả công <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethodType })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {PAYMENT_METHODS.map((pm) => (
                    <option key={pm} value={pm}>
                      {pm}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Đơn giá / Lương cơ bản (VNĐ) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={formData.baseSalaryOrRate}
                  onChange={(e) => setFormData({ ...formData, baseSalaryOrRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Trạng thái làm việc <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.workStatus}
                  onChange={(e) => setFormData({ ...formData, workStatus: e.target.value as WorkStatusType })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
                >
                  {WORK_STATUSES.map((ws) => (
                    <option key={ws} value={ws}>
                      {ws}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số ngày phép năm còn lại (FR-16)
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={formData.annualLeaveRemaining}
                  onChange={(e) => setFormData({ ...formData, annualLeaveRemaining: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ngân hàng nhận lương
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="Vietcombank, MBBank..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số tài khoản ngân hàng
                </label>
                <input
                  type="text"
                  value={formData.bankAccountNumber}
                  onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                  placeholder="004100..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Icons.Check size={16} />
              <span>{isEditing ? 'Lưu thay đổi hồ sơ' : 'Lập hồ sơ nhân viên'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
