'use client';

import React from 'react';
import { EmployeeProfile } from '@/types/employee';
import { useAuth } from '@/lib/auth-context';
import { Icons } from '../icons';

interface Props {
  employee: EmployeeProfile;
  onClose: () => void;
  onEdit?: () => void;
}

export function EmployeeDetailModal({ employee, onClose, onEdit }: Props) {
  const { currentUser } = useAuth();
  const canEdit = currentUser?.role === 'HR';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Icons.X size={18} />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 border-2 border-indigo-400 text-white flex items-center justify-center text-2xl font-bold shadow-md">
              {employee.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white/20 text-indigo-200 border border-white/20">
                  {employee.employeeCode}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                  {employee.workStatus}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">{employee.fullName}</h2>
              <p className="text-xs text-indigo-200 mt-0.5">
                {employee.position} • {employee.department}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs">
          {/* Section 1: Thông tin cá nhân */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-100 flex items-center gap-1.5 text-indigo-700">
              <Icons.User size={14} /> Thông tin cá nhân &amp; liên hệ
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Email:</span>
                <span className="font-semibold text-slate-800 break-all">{employee.email}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Điện thoại:</span>
                <span className="font-semibold text-slate-800">{employee.phone}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">CCCD / Định danh:</span>
                <span className="font-semibold text-slate-800">{employee.identityCard || 'Chưa cập nhật'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Ngày sinh:</span>
                <span className="font-semibold text-slate-800">{employee.dateOfBirth || 'Chưa cập nhật'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl col-span-2">
                <span className="text-slate-400 block text-[10px]">Địa chỉ cư trú:</span>
                <span className="font-semibold text-slate-800">{employee.address || 'Đà Nẵng'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Hợp đồng & Pháp lý */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-100 flex items-center gap-1.5 text-indigo-700">
              <Icons.FileText size={14} /> Hợp đồng lao động &amp; Cam kết bảo mật NDA/IP (FR-05)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Loại hợp đồng:</span>
                <span className="font-semibold text-slate-800">{employee.contractType}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Thời hạn hợp đồng:</span>
                <span className="font-semibold text-slate-800">
                  {employee.contractStartDate} &rarr; {employee.contractEndDate || 'Không xác định'}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Cam kết NDA/IP:</span>
                <span
                  className={`font-bold inline-flex items-center gap-1 mt-0.5 ${
                    employee.ndaStatus === 'Đã ký' ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {employee.ndaStatus === 'Đã ký' ? <Icons.CheckCircle size={12} /> : <Icons.AlertTriangle size={12} />}
                  {employee.ndaStatus}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Phép năm còn lại (FR-16):</span>
                <span className="font-bold text-indigo-700">{employee.annualLeaveRemaining} ngày</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Ngày vào công ty:</span>
                <span className="font-semibold text-slate-800">{employee.joinDate}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Lead quản lý trực tiếp:</span>
                <span className="font-semibold text-slate-800">{employee.directLeadName || 'Cấp quản lý'}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Hình thức trả lương & ngân hàng */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-100 flex items-center gap-1.5 text-indigo-700">
              <Icons.Briefcase size={14} /> Hình thức trả công &amp; Thanh toán
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Hình thức:</span>
                <span className="font-semibold text-slate-800">{employee.paymentMethod}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Mức / Đơn giá:</span>
                <span className="font-mono font-bold text-slate-900">
                  {currentUser?.role === 'Lead' ? '*** (Bảo mật)' : `${employee.baseSalaryOrRate.toLocaleString('vi-VN')} đ`}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Tài khoản ngân hàng:</span>
                <span className="font-mono text-slate-800">
                  {employee.bankName ? `${employee.bankName} - ${employee.bankAccountNumber}` : 'Chưa cập nhật'}
                </span>
              </div>
            </div>
          </div>

          {employee.notes && (
            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <span className="font-semibold text-indigo-900 block text-[11px]">Ghi chú nhân sự:</span>
              <p className="text-slate-600 mt-0.5">{employee.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            {currentUser?.role === 'Employee' && 'Bạn đang xem hồ sơ cá nhân của mình (FR-06 - Read only).'}
            {currentUser?.role === 'Lead' && 'Dữ liệu thành viên nhóm. Thông tin lương được ẩn theo FR-03.'}
            {currentUser?.role === 'HR' && 'Quản trị viên có toàn quyền cập nhật.'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              Đóng
            </button>
            {canEdit && onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Icons.Edit size={14} /> Chỉnh sửa hồ sơ
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
