'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Icons } from '../icons';

export function EmployeeDashboard() {
  const { currentUser, currentEmployee } = useAuth();

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-emerald-700 via-teal-800 to-indigo-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
              Dashboard Nhân viên
            </span>
            <span className="text-xs text-emerald-200">
              Mã NV: {currentEmployee?.employeeCode || currentUser?.employeeCode}
            </span>
          </div>
          <h1 className="text-2xl font-bold mt-2">Xin chào, {currentUser?.fullName}!</h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
            Vị trí: <strong>{currentEmployee?.position || 'Nhân viên chuyên trách'}</strong> • Nhóm: {currentEmployee?.department || currentUser?.department}
          </p>
        </div>

        <div>
          <Link
            href="/employees"
            className="px-4 py-2 rounded-xl bg-white text-teal-800 text-xs font-bold hover:bg-emerald-50 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Icons.Eye size={16} /> Xem hồ sơ cá nhân của tôi (FR-06)
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Ngày công tháng này</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Icons.Calendar size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">21.5</span>
            <span className="text-xs text-slate-500">/ 24 ngày tiêu chuẩn</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Tổng giờ làm tích lũy: 172.5 giờ
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Phép năm còn lại (FR-16)</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Icons.Clock size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-600">
              {currentEmployee?.annualLeaveRemaining ?? 10}
            </span>
            <span className="text-xs text-slate-500">/ 12 ngày tiêu chuẩn</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Hạn mức nghỉ có hưởng nguyên lương
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Hình thức trả công</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Icons.Briefcase size={18} />
            </div>
          </div>
          <div className="mt-3 text-base font-bold text-slate-900">
            {currentEmployee?.paymentMethod || 'Theo giờ'}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Đơn giá / mức: {currentEmployee?.baseSalaryOrRate.toLocaleString('vi-VN')} đ
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Trạng thái cam kết NDA</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Icons.FileText size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            {currentEmployee?.ndaStatus === 'Đã ký' ? (
              <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                <Icons.CheckCircle size={16} /> Đã hoàn tất ký NDA/IP
              </span>
            ) : (
              <span className="text-sm font-bold text-rose-600 flex items-center gap-1">
                <Icons.AlertTriangle size={16} /> Chưa hoàn tất ký
              </span>
            )}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Bảo mật thiết kế và bản quyền Ecomfree
          </div>
        </div>
      </div>

      {/* Profile Overview Card & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-100 flex items-center gap-2">
            <Icons.User size={16} className="text-indigo-600" />
            Tóm tắt thông tin nhân sự cá nhân
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="text-slate-400 block text-[11px]">Họ và tên:</span>
              <span className="font-semibold text-slate-800">{currentEmployee?.fullName}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="text-slate-400 block text-[11px]">Email công việc:</span>
              <span className="font-semibold text-slate-800">{currentEmployee?.email}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="text-slate-400 block text-[11px]">Số điện thoại:</span>
              <span className="font-semibold text-slate-800">{currentEmployee?.phone}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="text-slate-400 block text-[11px]">Trưởng nhóm phụ trách (Lead):</span>
              <span className="font-semibold text-indigo-700">
                {currentEmployee?.directLeadName || 'Chưa phân công'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="text-slate-400 block text-[11px]">Loại hợp đồng:</span>
              <span className="font-semibold text-slate-800">{currentEmployee?.contractType}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="text-slate-400 block text-[11px]">Thời hạn hợp đồng:</span>
              <span className="font-semibold text-slate-800">
                {currentEmployee?.contractStartDate} &rarr; {currentEmployee?.contractEndDate || 'Không xác định'}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Bảo mật dữ liệu: Bạn chỉ có quyền xem hồ sơ của mình (FR-03).</span>
            <Link href="/employees" className="text-indigo-600 hover:text-indigo-800 font-semibold">
              Chi tiết hồ sơ &rarr;
            </Link>
          </div>
        </div>

        {/* Recent Activity for Employee */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-100 flex items-center gap-2">
              <Icons.Clock size={16} className="text-emerald-600" />
              Yêu cầu &amp; Đơn gần đây
            </h3>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between font-semibold text-slate-800">
                  <span>Nghỉ phép 1 ngày</span>
                  <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] border border-emerald-200">
                    Đã duyệt
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Lý do: Việc gia đình • Duyệt bởi: {currentEmployee?.directLeadName || 'Lead'}</div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between font-semibold text-slate-800">
                  <span>Khai báo sản lượng</span>
                  <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-[10px] border border-blue-200">
                    Đã duyệt
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">12 mẫu artwork áo thun tuần trước</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">
              Mọi cập nhật trạng thái đều được gửi thông báo tự động (FR-32)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
