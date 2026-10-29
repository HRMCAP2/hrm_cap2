'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { EmployeeProfile } from '@/types/employee';
import { Icons } from '../icons';
import { EmployeeModal } from './EmployeeModal';
import { EmployeeDetailModal } from './EmployeeDetailModal';
import { EmployeeImportModal } from './EmployeeImportModal';

export function EmployeeList() {
  const { currentUser, currentEmployee, employees, refreshData } = useAuth();
  const role = currentUser?.role;

  // Modals state
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeProfile | null>(null);
  const [detailEmployee, setDetailEmployee] = useState<EmployeeProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [ndaFilter, setNdaFilter] = useState('ALL');

  // Role-based data isolation (FR-03 / NFR-05)
  const scopedEmployees = useMemo(() => {
    if (role === 'Employee') {
      // Employee only sees their own profile (FR-06)
      return employees.filter(
        (e) => e.employeeCode === (currentEmployee?.employeeCode || currentUser?.employeeCode)
      );
    }

    if (role === 'Lead') {
      // Lead only sees their team/department members
      return employees.filter((e) => e.department === currentUser?.department);
    }

    // HR and Accountant see all
    return employees;
  }, [employees, role, currentUser, currentEmployee]);

  // Filtered list
  const filteredEmployees = useMemo(() => {
    return scopedEmployees.filter((emp) => {
      const matchSearch =
        emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDept = departmentFilter === 'ALL' || emp.department === departmentFilter;
      const matchStatus = statusFilter === 'ALL' || emp.workStatus === statusFilter;
      const matchNda = ndaFilter === 'ALL' || emp.ndaStatus === ndaFilter;

      return matchSearch && matchDept && matchStatus && matchNda;
    });
  }, [scopedEmployees, searchTerm, departmentFilter, statusFilter, ndaFilter]);

  // Export to CSV (FR-07 / PB-30)
  const handleExportCSV = () => {
    const headers = [
      'Mã nhân viên',
      'Họ và tên',
      'Email',
      'Số điện thoại',
      'Phòng ban',
      'Vị trí',
      'Loại hợp đồng',
      'Cam kết NDA',
      'Hình thức trả công',
      'Trạng thái làm việc',
      'Ngày vào làm',
    ];

    const rows = filteredEmployees.map((e) => [
      e.employeeCode,
      `"${e.fullName}"`,
      e.email,
      e.phone,
      `"${e.department}"`,
      `"${e.position}"`,
      `"${e.contractType}"`,
      `"${e.ndaStatus}"`,
      `"${e.paymentMethod}"`,
      `"${e.workStatus}"`,
      e.joinDate,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `danh_sach_nhan_su_ecomfree_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = (emp: EmployeeProfile) => {
    setSelectedEmployee(emp);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  // If Employee, show Personal Profile Card directly (FR-06)
  if (role === 'Employee') {
    const myProfile = scopedEmployees[0] || currentEmployee;
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Hồ sơ cá nhân của tôi (FR-06)</h1>
            <p className="text-xs text-slate-500">
              Nhân viên xem thông tin hồ sơ đã được lưu trữ trên hệ thống Ecomfree (Chỉ đọc)
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
            Bảo mật: Chỉ bạn có quyền xem
          </span>
        </div>

        {myProfile ? (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="bg-linear-to-r from-slate-900 to-indigo-950 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-black border border-indigo-400">
                  {myProfile.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-sm bg-white/20">
                      {myProfile.employeeCode}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-300">
                      {myProfile.workStatus}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mt-1">{myProfile.fullName}</h2>
                  <p className="text-xs text-indigo-200">
                    {myProfile.position} • {myProfile.department}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase text-indigo-700">1. Thông tin cá nhân</h4>
                <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Email:</span>
                    <span className="font-semibold text-slate-800">{myProfile.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Số điện thoại:</span>
                    <span className="font-semibold text-slate-800">{myProfile.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Địa chỉ:</span>
                    <span className="font-semibold text-slate-800">{myProfile.address}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase text-indigo-700">2. Hợp đồng &amp; Pháp lý</h4>
                <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Loại hợp đồng:</span>
                    <span className="font-semibold text-slate-800">{myProfile.contractType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Thời hạn hợp đồng:</span>
                    <span className="font-semibold text-slate-800">
                      {myProfile.contractStartDate} &rarr; {myProfile.contractEndDate || 'Vô thời hạn'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Cam kết bảo mật NDA/IP (FR-05):</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                      <Icons.CheckCircle size={12} /> {myProfile.ndaStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase text-indigo-700">3. Chế độ trả công &amp; Nghỉ phép</h4>
                <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Hình thức tính lương:</span>
                    <span className="font-semibold text-slate-800">{myProfile.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Số ngày phép năm còn lại (FR-16):</span>
                    <span className="font-bold text-indigo-700 text-sm">{myProfile.annualLeaveRemaining} ngày</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tài khoản ngân hàng:</span>
                    <span className="font-mono text-slate-800">
                      {myProfile.bankName} - {myProfile.bankAccountNumber}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Nếu thông tin có sai lệch, vui lòng liên hệ phòng Nhân sự (HR) để được điều chỉnh.</span>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            Chưa tìm thấy hồ sơ liên kết với tài khoản của bạn. Vui lòng liên hệ HR.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              {role === 'Lead' ? `Nhân sự nhóm ${currentUser?.department}` : 'Quản lý hồ sơ nhân viên'}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
              {filteredEmployees.length} nhân sự
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {role === 'Lead'
              ? 'Lead kiểm tra thông tin và hỗ trợ thành viên nhóm (FR-03: không xem dữ liệu lương)'
              : role === 'Accountant'
              ? 'Đối soát nhân sự để chuẩn bị tính lương (FR-03: không sửa hồ sơ)'
              : 'Lập, cập nhật, tìm kiếm, xuất và nạp dữ liệu nhân sự (FR-04, FR-05, FR-07, FR-37)'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Export CSV (FR-07) */}
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Xuất danh sách nhân viên ra file CSV (FR-07)"
          >
            <Icons.Download size={14} /> Xuất CSV
          </button>

          {/* HR Only actions */}
          {role === 'HR' && (
            <>
              <button
                onClick={() => setIsImportOpen(true)}
                className="px-3 py-2 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition-colors flex items-center gap-1.5"
                title="Nhập dữ liệu nhân viên ban đầu từ Excel/CSV (FR-37)"
              >
                <Icons.Upload size={14} /> Import ban đầu (FR-37)
              </button>

              <button
                onClick={handleCreateNew}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Icons.Plus size={16} /> Thêm nhân viên (FR-04)
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Icons.Search size={14} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, mã NV, email..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Department Filter (Only enabled if HR or Accountant) */}
          <div>
            <select
              value={departmentFilter}
              disabled={role === 'Lead'}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="ALL">Tất cả phòng ban</option>
              <option value="Customer Support">Customer Support</option>
              <option value="Graphic Design">Graphic Design</option>
              <option value="Operations & Fulfillment">Operations &amp; Fulfillment</option>
              <option value="Finance & Admin">Finance &amp; Admin</option>
              <option value="Technology">Technology</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="Đang làm việc">Đang làm việc</option>
              <option value="Tạm hoãn">Tạm hoãn</option>
              <option value="Đã thôi việc">Đã thôi việc</option>
            </select>
          </div>

          {/* NDA Status Filter (FR-05) */}
          <div>
            <select
              value={ndaFilter}
              onChange={(e) => setNdaFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="ALL">Tất cả tình trạng NDA/IP</option>
              <option value="Đã ký">Đã ký NDA/IP</option>
              <option value="Chưa ký">Chưa ký NDA/IP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Mã NV</th>
                <th className="py-3 px-4">Họ và tên</th>
                <th className="py-3 px-4">Phòng ban &amp; Vị trí</th>
                <th className="py-3 px-4">Hợp đồng</th>
                <th className="py-3 px-4">Cam kết NDA/IP</th>
                <th className="py-3 px-4">Hình thức trả</th>
                {role !== 'Lead' && <th className="py-3 px-4">Đơn giá / Lương</th>}
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={role !== 'Lead' ? 9 : 8} className="py-8 text-center text-slate-400">
                    Không tìm thấy nhân viên nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                      {emp.employeeCode}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div>{emp.fullName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{emp.email}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{emp.department}</div>
                      <div className="text-[10px] text-slate-500">{emp.position}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      <span className="px-2 py-0.5 rounded-sm bg-slate-100 font-medium text-[11px]">
                        {emp.contractType}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {emp.ndaStatus === 'Đã ký' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                          <Icons.CheckCircle size={12} /> Đã ký
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-[11px] bg-rose-50 px-1.5 py-0.5 rounded-sm border border-rose-200">
                          <Icons.AlertTriangle size={12} /> Chưa ký
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-slate-700 font-medium">{emp.paymentMethod}</span>
                    </td>

                    {role !== 'Lead' && (
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                        {emp.baseSalaryOrRate.toLocaleString('vi-VN')} đ
                      </td>
                    )}

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-medium text-[11px] ${
                          emp.workStatus === 'Đang làm việc'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : emp.workStatus === 'Tạm hoãn'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {emp.workStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setDetailEmployee(emp)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Xem chi tiết hồ sơ (FR-06)"
                        >
                          <Icons.Eye size={15} />
                        </button>

                        {role === 'HR' && (
                          <button
                            onClick={() => handleEdit(emp)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Sửa hồ sơ nhân viên (FR-04)"
                          >
                            <Icons.Edit size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Hiển thị <strong>{filteredEmployees.length}</strong> / <strong>{scopedEmployees.length}</strong> nhân sự trong phạm vi cho phép
          </span>
          <span className="text-slate-400">
            {role === 'Lead' && 'Dữ liệu lương được ẩn tự động đối với vai trò Lead (FR-03).'}
          </span>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <EmployeeModal
          employee={selectedEmployee}
          onClose={() => setIsModalOpen(false)}
          onSuccess={refreshData}
        />
      )}

      {detailEmployee && (
        <EmployeeDetailModal
          employee={detailEmployee}
          onClose={() => setDetailEmployee(null)}
          onEdit={() => handleEdit(detailEmployee)}
        />
      )}

      {isImportOpen && (
        <EmployeeImportModal
          onClose={() => setIsImportOpen(false)}
          onSuccess={refreshData}
        />
      )}
    </div>
  );
}
