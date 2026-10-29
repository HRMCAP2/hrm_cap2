'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Icons } from '../icons';

export function AccountantDashboard() {
  const { currentUser, employees } = useAuth();

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-amber-700 via-amber-800 to-indigo-950 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
              Dashboard Kế toán (Accountant)
            </span>
            <span className="text-xs text-amber-200">Kỳ lương: Tháng 10/2026</span>
          </div>
          <h1 className="text-2xl font-bold mt-2">Xin chào, {currentUser?.fullName}!</h1>
          <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-xl">
            Quản trị đơn giá, kiểm tra dữ liệu công/sản lượng đã duyệt và theo dõi trạng thái chốt kỳ lương trước ngày 5.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/employees"
            className="px-4 py-2 rounded-xl bg-white text-amber-800 text-xs font-bold hover:bg-amber-50 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Icons.Users size={16} /> Danh sách đối soát ({employees.length})
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Trạng thái kỳ lương</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Icons.Clock size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600">Chưa chốt</span>
            <span className="text-xs text-slate-400">(Kỳ 10/2026)</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Hạn chốt và chuyển khoản: Trước ngày 05/11 (BRULE-01)
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Nhân sự đủ điều kiện tính lương</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Icons.Users size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{employees.length}</span>
            <span className="text-xs text-emerald-600 font-semibold">100% có hợp đồng</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Support, Designer, Ops &amp; Quản lý
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Bản ghi công/sản lượng đã duyệt</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Icons.CheckCircle size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">284</span>
            <span className="text-xs text-slate-500">bản ghi sạch</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Sẵn sàng chạy tính lương tự động (BPMN 3)
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Quyền hạn Kế toán (FR-03)</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Icons.Shield size={18} />
            </div>
          </div>
          <div className="mt-3 text-xs font-bold text-slate-700">
            Xem hồ sơ &amp; Chốt lương
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Hệ thống chặn Kế toán tự sửa hồ sơ cá nhân
          </div>
        </div>
      </div>

      {/* Salary Overview Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-100 flex items-center justify-between">
          <span>Quy tắc tính lương theo vị trí Ecomfree (BRULE-02 &amp; BRULE-05)</span>
          <span className="text-xs font-normal text-slate-500">Bám sát BRD Sprint 1</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
            <div className="font-bold text-blue-900 text-sm mb-1">1. Customer Support</div>
            <p className="text-slate-600 text-xs">
              • Trả theo giờ làm ca ngày (giờ check-in/out thực tế).
              <br />• Thưởng theo ticket giải quyết khách Mỹ/EU.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
            <div className="font-bold text-emerald-900 text-sm mb-1">2. Graphic Designer POD</div>
            <p className="text-slate-600 text-xs">
              • Trả theo sản lượng mẫu thiết kế (artwork) đạt duyệt.
              <br />• Chỉ tính vào lương khi Lead Design đã bấm Duyệt (BRULE-03).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50">
            <div className="font-bold text-purple-900 text-sm mb-1">3. Quản lý &amp; Vận hành</div>
            <p className="text-slate-600 text-xs">
              • Lương cố định hoặc kết hợp sản lượng đơn hàng.
              <br />• Khóa dữ liệu và xuất file chuyển khoản trước ngày 5 (BRULE-01).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
