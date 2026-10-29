'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Icons } from '../icons';

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const role = currentUser?.role;

  const navItems = [
    {
      title: 'Dashboard',
      href: '/',
      icon: Icons.Dashboard,
      description: 'Tổng quan theo vai trò',
      visible: true,
    },
    {
      title: role === 'Employee' ? 'Hồ sơ cá nhân' : 'Hồ sơ nhân viên',
      href: '/employees',
      icon: Icons.Users,
      description:
        role === 'Employee'
          ? 'Xem thông tin của tôi'
          : role === 'Lead'
          ? 'Thành viên trong nhóm'
          : 'Quản lý hồ sơ công ty',
      visible: true,
    },
    {
      title: 'Quản lý tài khoản',
      href: '/accounts',
      icon: Icons.Shield,
      description: 'Cấp quyền & Khóa tài khoản',
      // FR-02: Chỉ HR thấy chức năng này
      visible: role === 'HR',
    },
    {
      title: 'Thông báo nghiệp vụ',
      href: '/notifications',
      icon: Icons.Bell,
      description: 'Nhận tin phê duyệt & hệ thống',
      visible: true,
    },
    {
      title: 'Nhật ký hệ thống',
      href: '/audit-logs',
      icon: Icons.History,
      description: 'Tra cứu truy vết thay đổi',
      // FR-35: Chỉ HR xem nhật ký
      visible: role === 'HR',
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      {/* Scope Info Pill */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/40">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Phạm vi dữ liệu
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-200">
            {role === 'HR' && 'Toàn hệ thống (Admin)'}
            {role === 'Lead' && `Nhóm ${currentUser?.department || 'Quản lý'}`}
            {role === 'Accountant' && 'Toàn công ty (Tài chính)'}
            {role === 'Employee' && 'Chỉ dữ liệu cá nhân'}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          {role === 'Lead' && '• Không xem dữ liệu lương'}
          {role === 'Accountant' && '• Không sửa hồ sơ nhân sự'}
          {role === 'Employee' && '• Chỉ xem hồ sơ & phiếu của mình'}
          {role === 'HR' && '• Quản trị hồ sơ, tài khoản & nhật ký'}
        </p>
      </div>

      {/* Nav list */}
      <nav className="p-3 space-y-1.5 flex-1">
        {navItems
          .filter((item) => item.visible)
          .map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon size={20} className={`mt-0.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <div className="overflow-hidden">
                  <div className="text-sm tracking-tight">{item.title}</div>
                  <div className={`text-[11px] truncate ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
      </nav>

      {/* System status footer */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1 bg-slate-950/20">
        <div className="flex items-center justify-between">
          <span>Phiên làm việc:</span>
          <span className="text-slate-300 font-mono">30p (NFR-04)</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Bảo mật:</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <Icons.Lock size={10} /> Chuẩn RBAC
          </span>
        </div>
        <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-800/60">
          Ecomfree POD HRM • Đà Nẵng
        </div>
      </div>
    </aside>
  );
}
