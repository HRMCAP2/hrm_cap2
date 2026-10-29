'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Icons } from '../icons';

export function LeadDashboard() {
  const { currentUser, employees } = useAuth();

  // Scope: Lead only sees their department (FR-03, NFR-05)
  const myDept = currentUser?.department || 'Customer Support';
  const teamMembers = employees.filter((e) => e.department === myDept);
  const activeMembers = teamMembers.filter((e) => e.workStatus === 'Đang làm việc');

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
              Dashboard Trưởng nhóm (Lead)
            </span>
            <span className="text-xs text-blue-200">Phạm vi: Nhóm {myDept}</span>
          </div>
          <h1 className="text-2xl font-bold mt-2">Xin chào, {currentUser?.fullName}!</h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
            Theo dõi quân số ca ngày, duyệt yêu cầu nghỉ phép và kiểm soát chất lượng sản lượng của nhóm.
          </p>
        </div>

        <div>
          <Link
            href="/employees"
            className="px-4 py-2 rounded-xl bg-white text-blue-700 text-xs font-bold hover:bg-blue-50 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Icons.Users size={16} /> Danh sách nhóm ({teamMembers.length})
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Thành viên nhóm</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Icons.Users size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{teamMembers.length}</span>
            <span className="text-xs font-semibold text-emerald-600">
              {activeMembers.length} đang làm
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Thuộc nhóm: {myDept}
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Yêu cầu chờ duyệt</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Icons.Clock size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600">2</span>
            <span className="text-xs text-slate-500">đơn cần xử lý</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Nghỉ phép &amp; làm thêm giờ (BPMN 2)
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Sản lượng chờ duyệt</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Icons.CheckCircle size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">14</span>
            <span className="text-xs text-slate-500">bản ghi</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Sản lượng/ticket chưa duyệt (BPMN 1)
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Bảo mật thông tin</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Icons.Shield size={18} />
            </div>
          </div>
          <div className="mt-3 text-xs font-semibold text-purple-700">
            Được bảo vệ (FR-03)
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Lead không thấy thông tin lương nhân viên
          </div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Danh sách nhân sự thuộc nhóm {myDept}</h3>
            <p className="text-xs text-slate-400">Chỉ hiển thị nhân viên trong phạm vi quản lý của bạn (FR-03)</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {teamMembers.length} nhân sự
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Mã NV</th>
                <th className="py-3 px-4">Họ và tên</th>
                <th className="py-3 px-4">Vị trí</th>
                <th className="py-3 px-4">Hình thức trả</th>
                <th className="py-3 px-4">Trạng thái NDA</th>
                <th className="py-3 px-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {teamMembers.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600">{emp.employeeCode}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div>{emp.fullName}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{emp.email}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{emp.position}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                      {emp.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {emp.ndaStatus === 'Đã ký' ? (
                      <span className="text-emerald-600 font-medium flex items-center gap-1">
                        <Icons.CheckCircle size={12} /> Đã ký
                      </span>
                    ) : (
                      <span className="text-rose-600 font-medium flex items-center gap-1">
                        <Icons.AlertTriangle size={12} /> Chưa ký
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${
                        emp.workStatus === 'Đang làm việc'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {emp.workStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
