'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { storage } from '@/lib/storage';
import { AuditLogItem } from '@/types/audit';
import { Icons } from '../icons';

export function AuditLogList() {
  const { currentUser } = useAuth();
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');

  // Security Access Control Check (FR-35, FR-03)
  if (currentUser?.role !== 'HR') {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center max-w-xl mx-auto my-12 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <Icons.Shield size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Từ chối quyền truy cập (403 Forbidden)</h2>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          Theo quy định kiểm soát nội bộ (FR-35 / BO-04), nhật ký hệ thống chỉ dành riêng cho Quản trị viên phòng Nhân sự (HR) để thanh tra và truy vết khi có tranh chấp.
        </p>
      </div>
    );
  }

  const logs = storage.getAuditLogs();

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetObject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchModule = moduleFilter === 'ALL' || log.module === moduleFilter;
    const matchAction = actionFilter === 'ALL' || log.action === actionFilter;

    return matchSearch && matchModule && matchAction;
  });

  const getActionBadgeColor = (action: string) => {
    if (action.includes('LOGIN')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (action.includes('LOCK')) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (action.includes('CREATE')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (action.includes('UPDATE')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (action.includes('APPROVE')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Nhật ký hệ thống &amp; Kiểm soát (Audit Trail)</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
              Chỉ đọc • Bất biến (FR-35)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Lưu vết tự động người thực hiện, thời điểm, hành vi, giá trị cũ và mới (FR-35 / BO-04 / TS-35)
          </p>
        </div>

        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <Icons.Shield size={16} className="shrink-0" />
          <span>Bảo toàn chứng cứ: Hệ thống không cho phép sửa hoặc xóa nhật ký</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Icons.Search size={14} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo người thực hiện, đối tượng, chi tiết..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="ALL">Tất cả phân hệ</option>
              <option value="Tài khoản & Phân quyền">Tài khoản &amp; Phân quyền</option>
              <option value="Hồ sơ nhân viên">Hồ sơ nhân viên</option>
              <option value="Yêu cầu & Nghỉ phép">Yêu cầu &amp; Nghỉ phép</option>
              <option value="Chấm công & Sản lượng">Chấm công &amp; Sản lượng</option>
              <option value="Hệ thống">Hệ thống</option>
            </select>
          </div>

          <div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="ALL">Tất cả nhóm hành động</option>
              <option value="LOGIN">Đăng nhập</option>
              <option value="LOCK_USER">Khóa tài khoản</option>
              <option value="CREATE_USER">Cấp tài khoản</option>
              <option value="UPDATE_USER">Cập nhật tài khoản</option>
              <option value="CREATE_PROFILE">Tạo mới hồ sơ</option>
              <option value="UPDATE_PROFILE">Cập nhật hồ sơ</option>
              <option value="IMPORT_PROFILES">Nhập dữ liệu CSV</option>
              <option value="APPROVE_REQUEST">Phê duyệt yêu cầu</option>
              <option value="CHANGE_PASSWORD">Đổi mật khẩu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Thời điểm (Timestamp)</th>
                <th className="py-3 px-4">Người thực hiện</th>
                <th className="py-3 px-4">Hành động</th>
                <th className="py-3 px-4">Phân hệ</th>
                <th className="py-3 px-4">Đối tượng tác động</th>
                <th className="py-3 px-4">Chi tiết thao tác</th>
                <th className="py-3 px-4 text-center">So sánh (Diff)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Không tìm thấy bản ghi nhật ký nào.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{log.userName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Vai trò: {log.userRole}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${getActionBadgeColor(log.action)}`}>
                        {log.actionTitle}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {log.module}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {log.targetObject}
                    </td>

                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={log.details}>
                      {log.details}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {(log.oldValue || log.newValue) ? (
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-[10px] transition-colors"
                        >
                          Xem Diff
                        </button>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>
            Tổng số: <strong>{filteredLogs.length}</strong> sự kiện được ghi nhận
          </span>
          <span className="text-slate-400">
            Dữ liệu ghi tự động, phục vụ chuẩn kiểm định TS-35 &amp; BR-05.
          </span>
        </div>
      </div>

      {/* Diff Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Chi tiết thay đổi dữ liệu (Audit Diff)
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedLog.actionTitle} • {selectedLog.targetObject}
                </p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <Icons.X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="text-slate-500">
                  <strong>Người thực hiện:</strong> {selectedLog.userName} ({selectedLog.userRole})
                </div>
                <div className="text-slate-500 font-mono">
                  <strong>Thời điểm:</strong> {new Date(selectedLog.timestamp).toISOString()}
                </div>
                <div className="text-slate-700">
                  <strong>Nội dung:</strong> {selectedLog.details}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Old Value */}
                <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40">
                  <span className="font-bold text-rose-800 block text-xs mb-2">
                    Giá trị cũ (Old Value):
                  </span>
                  <pre className="p-2.5 bg-white rounded-lg border border-rose-200 font-mono text-[11px] text-slate-700 overflow-x-auto">
                    {selectedLog.oldValue
                      ? JSON.stringify(selectedLog.oldValue, null, 2)
                      : '(Không có / Tạo mới)'}
                  </pre>
                </div>

                {/* New Value */}
                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40">
                  <span className="font-bold text-emerald-800 block text-xs mb-2">
                    Giá trị mới (New Value):
                  </span>
                  <pre className="p-2.5 bg-white rounded-lg border border-emerald-200 font-mono text-[11px] text-slate-700 overflow-x-auto">
                    {selectedLog.newValue
                      ? JSON.stringify(selectedLog.newValue, null, 2)
                      : '(Đã xóa / Không có)'}
                  </pre>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
