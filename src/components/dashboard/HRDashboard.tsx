'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { storage } from '@/lib/storage';
import { Icons } from '../icons';

export function HRDashboard() {
  const { employees, users, currentUser } = useAuth();
  const auditLogs = storage.getAuditLogs();
  const notifications = storage.getNotifications();

  // Metrics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.workStatus === 'Đang làm việc').length;
  const signedNDACount = employees.filter((e) => e.ndaStatus === 'Đã ký').length;
  const ndaPercentage = Math.round((signedNDACount / (totalEmployees || 1)) * 100);
  const totalAccounts = users.length;
  const activeAccounts = users.filter((u) => u.isActive).length;

  // Department distribution
  const deptCount: Record<string, number> = {};
  employees.forEach((e) => {
    deptCount[e.department] = (deptCount[e.department] || 0) + 1;
  });

  // Payment method distribution
  const paymentMethodCount: Record<string, number> = {};
  employees.forEach((e) => {
    paymentMethodCount[e.paymentMethod] = (paymentMethodCount[e.paymentMethod] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-indigo-700 via-indigo-800 to-blue-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
              Dashboard Admin / HR
            </span>
            <span className="text-xs text-indigo-200">Phạm vi: Toàn công ty</span>
          </div>
          <h1 className="text-2xl font-bold mt-2">Xin chào, {currentUser?.fullName}!</h1>
          <p className="text-indigo-100 text-xs sm:text-sm mt-1 max-w-xl">
            Chào mừng bạn đến với hệ thống HRM Ecomfree. Dưới đây là bức tranh tổng thể về nhân sự, tài khoản và an toàn bảo mật.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/employees"
            className="px-4 py-2 rounded-xl bg-white text-indigo-700 text-xs font-bold hover:bg-indigo-50 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Icons.UserPlus size={16} /> Thêm nhân viên
          </Link>
          <Link
            href="/accounts"
            className="px-4 py-2 rounded-xl bg-indigo-500/40 border border-white/20 text-white text-xs font-semibold hover:bg-indigo-500/60 transition-colors flex items-center gap-1.5"
          >
            <Icons.Shield size={16} /> Quản lý tài khoản
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tổng nhân sự</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Icons.Users size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalEmployees}</span>
            <span className="text-xs font-semibold text-emerald-600">
              {activeEmployees} đang làm việc
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Quy mô POD: ~30 nhân sự Việt Nam
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tài khoản người dùng</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Icons.Shield size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalAccounts}</span>
            <span className="text-xs font-semibold text-emerald-600">
              {activeAccounts} hoạt động
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Được phân theo 4 vai trò RBAC (FR-02)
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tỷ lệ ký NDA / IP</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Icons.FileText size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{ndaPercentage}%</span>
            <span className="text-xs text-slate-500">
              ({signedNDACount}/{totalEmployees})
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Cam kết bảo mật tài sản thiết kế POD (FR-05)
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Thông báo chưa đọc</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Icons.Bell size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {notifications.filter((n) => !n.isRead).length}
            </span>
            <span className="text-xs text-amber-600 font-medium">yêu cầu & tin mới</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            In-app Notification MVP (FR-32)
          </div>
        </div>
      </div>

      {/* Breakdown Charts & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Phân bổ nhân sự theo Nhóm/Phòng ban</h3>
              <p className="text-xs text-slate-400">Cơ cấu tổ chức hiện tại</p>
            </div>
            <Icons.Building size={18} className="text-slate-400" />
          </div>

          <div className="mt-4 space-y-3">
            {Object.entries(deptCount).map(([dept, count]) => {
              const pct = Math.round((count / (totalEmployees || 1)) * 100);
              return (
                <div key={dept} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>{dept}</span>
                    <span className="text-slate-500">
                      {count} nhân sự ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Hình thức trả công (BRULE-02)</h3>
              <p className="text-xs text-slate-400">Phân theo vị trí và tính chất công việc POD</p>
            </div>
            <Icons.Briefcase size={18} className="text-slate-400" />
          </div>

          <div className="mt-4 space-y-3">
            {Object.entries(paymentMethodCount).map(([method, count]) => {
              const pct = Math.round((count / (totalEmployees || 1)) * 100);
              const color =
                method === 'Theo giờ'
                  ? 'bg-blue-500'
                  : method === 'Theo sản lượng'
                  ? 'bg-emerald-500'
                  : method === 'Lương cố định'
                  ? 'bg-purple-500'
                  : 'bg-amber-500';

              return (
                <div key={method} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${color}`}></span>
                      {method}
                    </span>
                    <span className="text-slate-500">
                      {count} nhân sự ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-xl text-slate-600 text-[11px] leading-relaxed">
            💡 <strong>Quy tắc nghiệp vụ:</strong> Support trả theo giờ; Designer &amp; Ops trả theo sản lượng (artwork/đơn hoàn thành); Quản lý hưởng lương cố định.
          </div>
        </div>
      </div>

      {/* Recent Audit Logs Snapshot */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Icons.History size={16} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Nhật ký thao tác gần nhất (FR-35 / BO-04)</h3>
              <p className="text-[11px] text-slate-500">Truy vết tự động mọi hành vi nhạy cảm của người dùng</p>
            </div>
          </div>
          <Link
            href="/audit-logs"
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
          >
            Xem toàn bộ nhật ký &rarr;
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="p-3.5 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {log.userName.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-slate-800 flex items-center gap-2">
                    <span>{log.actionTitle}</span>
                    <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-sm bg-slate-100 text-slate-600 border border-slate-200">
                      {log.module}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Thực hiện bởi: <span className="font-medium text-slate-700">{log.userName}</span> ({log.userRole}) • {log.targetObject}
                  </div>
                  <div className="text-slate-600 text-[11px] mt-0.5 italic">
                    &ldquo;{log.details}&rdquo;
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(log.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className="text-[10px] text-slate-400">
                  {new Date(log.timestamp).toLocaleDateString('vi-VN')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
