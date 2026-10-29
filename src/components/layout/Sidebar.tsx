
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
      title: 'Tổng quan',
      href: '/',
      icon: Icons.Dashboard,
      description: 'Tổng quan theo vai trò',
      visible: true,
    },
    {
      title: role === 'Employee' ? 'Hồ sơ cá nhân' : 'Nhân sự',
      href: '/employees',
      icon: Icons.Users,
      description:
        role === 'Employee'
          ? 'Thông tin cá nhân'
          : role === 'Lead'
            ? 'Thành viên trong nhóm'
            : 'Quản lý hồ sơ nhân viên',
      visible: true,
    },
    {
      title: 'Quản lý tài khoản',
      href: '/accounts',
      icon: Icons.Shield,
      description: 'Phân quyền và bảo mật',
      visible: role === 'HR',
    },
    {
      title: 'Thông báo',
      href: '/notifications',
      icon: Icons.Bell,
      description: 'Tin nhắn và cập nhật',
      visible: true,
    },
    {
      title: 'Nhật ký hệ thống',
      href: '/audit-logs',
      icon: Icons.History,
      description: 'Lịch sử hoạt động',
      visible: role === 'HR',
    },
  ];

  const scopeLabel =
    role === 'HR'
      ? 'Toàn hệ thống'
      : role === 'Lead'
        ? `Nhóm ${currentUser?.department || 'Quản lý'}`
        : role === 'Accountant'
          ? 'Tài chính công ty'
          : 'Dữ liệu cá nhân';

  const roleLabel =
    role === 'HR'
      ? 'Nhân sự quản trị'
      : role === 'Lead'
        ? 'Trưởng nhóm'
        : role === 'Accountant'
          ? 'Kế toán'
          : role === 'Employee'
            ? 'Nhân viên'
            : 'Đang tải tài khoản';

  return (
    <aside className="flex min-h-[calc(100vh-4rem)] w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white text-slate-700">
      {/* Brand */}
      <div className="border-b border-slate-100 px-5 py-5">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 transition-transform group-hover:scale-105">
            <Icons.Dashboard size={21} />
          </div>

          <div className="min-w-0">
            <div className="text-[15px] font-extrabold tracking-tight text-slate-900">
              Ecomfree
              <span className="ml-1.5 font-medium text-indigo-600">HRM</span>
            </div>
            <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              People management
            </div>
          </div>
        </Link>
      </div>

      {/* Workspace */}
      <div className="px-4 pt-5">
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/70">
              <Icons.Shield size={16} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-800">
                {scopeLabel}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Phạm vi truy cập
              </p>
            </div>

            <span
              className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 ring-4 ring-emerald-50"
              title="Phiên hoạt động"
            />
          </div>

          <div className="mt-3 border-t border-slate-200/80 pt-3">
            <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
              {roleLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pb-5 pt-6">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Không gian làm việc
        </p>

        <div className="space-y-1">
          {navItems
            .filter((item) => item.visible)
            .map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {isActive && (
                    <span className="absolute bottom-2.5 left-0 top-2.5 w-[3px] rounded-r-full bg-indigo-600" />
                  )}

                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all ${
                      isActive
                        ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100'
                        : 'text-slate-400 group-hover:bg-white group-hover:text-slate-700'
                    }`}
                  >
                    <Icon size={19} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold leading-5">
                      {item.title}
                    </span>
                    <span
                      className={`mt-0.5 block truncate text-[11px] leading-4 ${
                        isActive ? 'text-indigo-500' : 'text-slate-400'
                      }`}
                    >
                      {item.description}
                    </span>
                  </span>

                  {isActive && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                  )}
                </Link>
              );
            })}
        </div>
      </nav>

      {/* Security information */}
      <div className="px-4 pb-4">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
              <Icons.Lock size={14} />
            </span>

            <div>
              <p className="text-xs font-bold text-emerald-800">
                Bảo mật hệ thống
              </p>
              <p className="mt-0.5 text-[10px] text-emerald-700">
                Phân quyền theo vai trò
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 px-5 py-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-medium text-slate-400">
            Ecomfree POD HRM
          </span>
          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
            v1.0
          </span>
        </div>
        <p className="mt-1 text-[10px] text-slate-400">
          Đà Nẵng, Việt Nam
        </p>
      </div>
    </aside>
  );
}
