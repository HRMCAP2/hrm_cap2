'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Icons } from '../icons';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentUser, login } = useAuth();
  const [username, setUsername] = useState('admin.hr');
  const [password, setPassword] = useState('123456');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = login(username, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Đăng nhập không thành công.');
      }
      setIsLoading(false);
    }, 300);
  };

  const handleQuickLogin = (uname: string) => {
    setUsername(uname);
    setPassword('123456');
    setErrorMsg(null);
    login(uname, '123456');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Background decorative glow */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10">
          <div className="p-8 text-center bg-linear-to-b from-slate-50 to-white border-b border-slate-100">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-linear-to-tr from-indigo-600 to-blue-600 text-white items-center justify-center text-xl font-black shadow-md mb-3">
              EF
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ecomfree HRM</h1>
            <p className="text-xs text-slate-500 mt-1">
              Phân hệ Quản lý tài khoản, Hồ sơ, Dashboard & Nhật ký
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                  <Icons.AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Không thể đăng nhập:</span>
                    <span>{errorMsg}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên đăng nhập hoặc Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Icons.User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ví dụ: admin.hr, lead.support..."
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật khẩu <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Icons.Lock size={16} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Icons.RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Icons.Shield size={16} />
                  )}
                  <span>Đăng nhập hệ thống (FR-01)</span>
                </button>
              </div>
            </form>

            {/* Quick Login test buttons for grading and demo */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5 text-center">
                Đăng nhập nhanh các vai trò mẫu
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin.hr')}
                  className="p-2 rounded-lg border border-purple-200 bg-purple-50 text-purple-700 font-medium hover:bg-purple-100 text-left transition-colors"
                >
                  <div className="font-bold">👑 Admin / HR</div>
                  <div className="text-[10px] text-purple-500">admin.hr (Toàn quyền)</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('lead.support')}
                  className="p-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 text-left transition-colors"
                >
                  <div className="font-bold">👔 Lead Support</div>
                  <div className="text-[10px] text-blue-500">lead.support</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('emp.designer')}
                  className="p-2 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 font-medium hover:bg-emerald-100 text-left transition-colors"
                >
                  <div className="font-bold">🎨 Designer</div>
                  <div className="text-[10px] text-emerald-500">emp.designer (Lương SP)</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('accountant')}
                  className="p-2 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 font-medium hover:bg-amber-100 text-left transition-colors"
                >
                  <div className="font-bold">📊 Kế toán</div>
                  <div className="text-[10px] text-amber-500">accountant</div>
                </button>
              </div>

              {/* Locked account test */}
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('emp.locked')}
                  className="w-full p-1.5 rounded-lg border border-dashed border-rose-300 bg-rose-50 text-rose-700 text-[11px] font-medium hover:bg-rose-100 transition-colors text-center"
                >
                  🔒 Test kiểm thử: Đăng nhập tài khoản bị khóa (emp.locked)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
