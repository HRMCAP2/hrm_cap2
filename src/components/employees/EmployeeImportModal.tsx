'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { storage } from '@/lib/storage';
import { EmployeeProfile, DepartmentType, PositionType, ContractType, PaymentMethodType } from '@/types/employee';
import { Icons } from '../icons';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

interface ParsedRow {
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  department: DepartmentType;
  position: PositionType;
  contractType: ContractType;
  paymentMethod: PaymentMethodType;
  baseSalaryOrRate: number;
  isValid: boolean;
  errors: string[];
}

const SAMPLE_CSV = `Mã NV,Họ và tên,Email,Số điện thoại,Phòng ban,Vị trí,Hợp đồng,Hình thức trả,Lương hoặc Đơn giá
EF-013,Lê Hoàng Nam,nam.le@ecomfree.vn,0905333444,Graphic Design,Graphic Designer POD,Chính thức,Theo sản lượng,45000
EF-014,Trương Mỹ Duyên,duyen.truong@ecomfree.vn,0905444555,Customer Support,Support Specialist,Thử việc,Theo giờ,35000
EF-015,Nguyễn Quốc Huy,huy.nguyen@ecomfree.vn,0905555666,Operations & Fulfillment,Order Fulfillment Staff,Chính thức,Theo sản lượng,3500`;

export function EmployeeImportModal({ onClose, onSuccess }: Props) {
  const { employees, currentUser } = useAuth();
  const [csvContent, setCsvContent] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [hasValidated, setHasValidated] = useState(false);

  const downloadSampleCsv = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'mau_danh_sach_nhan_vien_ecomfree.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleValidate = () => {
    if (!csvContent.trim()) {
      alert('Vui lòng dán hoặc tải nội dung dữ liệu CSV vào ô bên dưới.');
      return;
    }

    const lines = csvContent
      .trim()
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length <= 1) {
      alert('Tệp dữ liệu không có dòng dữ liệu hợp lệ (cần ít nhất tiêu đề + 1 dòng dữ liệu).');
      return;
    }

    const existingCodes = new Set(employees.map((e) => e.employeeCode.toUpperCase()));
    const existingEmails = new Set(employees.map((e) => e.email.toLowerCase()));
    const seenCodesInBatch = new Set<string>();

    const rows: ParsedRow[] = [];

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim());
      const [
        code = '',
        name = '',
        email = '',
        phone = '',
        dept = 'Customer Support',
        pos = 'Support Specialist',
        contract = 'Chính thức',
        payment = 'Theo giờ',
        rateStr = '35000',
      ] = parts;

      const errors: string[] = [];

      // Validate employeeCode
      if (!code) {
        errors.push('Thiếu mã nhân viên');
      } else {
        const upperCode = code.toUpperCase();
        if (existingCodes.has(upperCode)) {
          errors.push(`Trùng mã NV "${code}" đã có trên hệ thống`);
        } else if (seenCodesInBatch.has(upperCode)) {
          errors.push(`Trùng mã NV "${code}" lặp lại trong tệp import`);
        } else {
          seenCodesInBatch.add(upperCode);
        }
      }

      // Validate fullName
      if (!name) {
        errors.push('Thiếu họ và tên');
      }

      // Validate email
      if (!email || !email.includes('@')) {
        errors.push('Email không hợp lệ hoặc bị trống');
      } else if (existingEmails.has(email.toLowerCase())) {
        errors.push(`Email "${email}" đã tồn tại`);
      }

      // Validate rate
      const rate = parseFloat(rateStr) || 0;
      if (rate <= 0) {
        errors.push('Đơn giá/lương phải lớn hơn 0');
      }

      rows.push({
        employeeCode: code || `EF-ERR-${i}`,
        fullName: name || 'Chưa có tên',
        email: email || '',
        phone: phone || '0905000000',
        department: dept as DepartmentType,
        position: pos as PositionType,
        contractType: contract as ContractType,
        paymentMethod: payment as PaymentMethodType,
        baseSalaryOrRate: rate,
        isValid: errors.length === 0,
        errors,
      });
    }

    setParsedRows(rows);
    setHasValidated(true);
  };

  const handleConfirmImport = () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      alert('Không có dòng dữ liệu hợp lệ nào để nhập vào hệ thống.');
      return;
    }

    const currentEmps = storage.getEmployees();
    const newEmps: EmployeeProfile[] = validRows.map((r, idx) => ({
      id: `emp-imported-${Date.now()}-${idx}`,
      employeeCode: r.employeeCode,
      fullName: r.fullName,
      email: r.email,
      phone: r.phone,
      department: r.department,
      position: r.position,
      contractType: r.contractType,
      contractStartDate: new Date().toISOString().split('T')[0],
      ndaStatus: 'Đã ký',
      ndaSignedDate: new Date().toISOString().split('T')[0],
      paymentMethod: r.paymentMethod,
      baseSalaryOrRate: r.baseSalaryOrRate,
      workStatus: 'Đang làm việc',
      joinDate: new Date().toISOString().split('T')[0],
      annualLeaveRemaining: 12,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const combined = [...newEmps, ...currentEmps];
    storage.saveEmployees(combined);

    // Audit Log (FR-35)
    storage.addAuditLog({
      userId: currentUser?.id || 'admin',
      userName: currentUser?.fullName || 'HR Admin',
      userRole: currentUser?.role || 'HR',
      action: 'IMPORT_PROFILES',
      actionTitle: 'Nhập dữ liệu nhân viên ban đầu từ CSV',
      module: 'Hồ sơ nhân viên',
      targetObject: `Nhập thành công ${validRows.length} hồ sơ`,
      details: `HR nhập danh sách nhân viên ban đầu từ tệp. Đã loại trừ các dòng thiếu thông tin và trùng lặp (FR-37).`,
      newValue: { importedCount: validRows.length, codes: validRows.map((r) => r.employeeCode) },
    });

    alert(`Đã nhập thành công ${validRows.length} hồ sơ nhân viên mới vào hệ thống!`);
    onSuccess();
    onClose();
  };

  const loadSampleIntoInput = () => {
    setCsvContent(SAMPLE_CSV);
    setHasValidated(false);
    setParsedRows([]);
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const invalidCount = parsedRows.filter((r) => !r.isValid).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl my-8 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Icons.Upload size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Nhập dữ liệu nhân viên ban đầu (FR-37)
              </h3>
              <p className="text-xs text-slate-500">
                Tự động kiểm tra dữ liệu thiếu, trùng lặp mã NV hoặc email trước khi lưu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Icons.X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Action bar for sample */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
            <div className="text-indigo-900 font-medium">
              💡 Bạn có thể dùng tệp mẫu chuẩn của Ecomfree để chuẩn bị dữ liệu:
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadSampleIntoInput}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1 shadow-2xs"
              >
                <Icons.FileText size={14} /> Dán dữ liệu mẫu
              </button>
              <button
                type="button"
                onClick={downloadSampleCsv}
                className="px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-indigo-700 font-medium hover:bg-indigo-50 transition-colors flex items-center gap-1"
              >
                <Icons.Download size={14} /> Tải file mẫu CSV
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Dán nội dung bảng tính CSV hoặc nhập trực tiếp:
            </label>
            <textarea
              rows={6}
              value={csvContent}
              onChange={(e) => {
                setCsvContent(e.target.value);
                setHasValidated(false);
              }}
              placeholder={`Mã NV,Họ và tên,Email,Số điện thoại,Phòng ban,Vị trí,Hợp đồng,Hình thức trả,Lương hoặc Đơn giá\nEF-013,Nguyễn Văn A,a.nguyen@ecomfree.vn,0905111222,Graphic Design,Graphic Designer POD,Chính thức,Theo sản lượng,45000`}
              className="w-full p-3 font-mono text-[11px] rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleValidate}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Icons.Shield size={16} /> Kiểm tra tính hợp lệ dữ liệu (Validate)
            </button>

            {hasValidated && (
              <div className="flex items-center gap-3">
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  ✓ Hợp lệ: {validCount} dòng
                </span>
                {invalidCount > 0 && (
                  <span className="text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                    ✕ Có lỗi: {invalidCount} dòng
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Validation Result Table */}
          {hasValidated && (
            <div className="border border-slate-200 rounded-xl overflow-hidden mt-3">
              <div className="p-3 bg-slate-50 border-b border-slate-200 font-semibold text-slate-800 flex items-center justify-between">
                <span>Kết quả đối soát trước khi nhập (FR-37):</span>
                <span className="text-slate-500 font-normal">Tổng {parsedRows.length} dòng</span>
              </div>
              <div className="max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100/70 text-slate-500 text-[10px] uppercase font-semibold sticky top-0">
                    <tr>
                      <th className="p-2.5">Trạng thái</th>
                      <th className="p-2.5">Mã NV</th>
                      <th className="p-2.5">Họ và tên</th>
                      <th className="p-2.5">Email</th>
                      <th className="p-2.5">Phòng ban</th>
                      <th className="p-2.5">Lý do lỗi (nếu có)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedRows.map((r, i) => (
                      <tr
                        key={i}
                        className={r.isValid ? 'bg-white hover:bg-slate-50' : 'bg-rose-50/50 hover:bg-rose-50'}
                      >
                        <td className="p-2.5">
                          {r.isValid ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              Hợp lệ
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                              Không đạt
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 font-mono font-bold text-slate-800">{r.employeeCode}</td>
                        <td className="p-2.5 font-medium text-slate-900">{r.fullName}</td>
                        <td className="p-2.5 text-slate-600">{r.email}</td>
                        <td className="p-2.5 text-slate-600">{r.department}</td>
                        <td className="p-2.5 text-rose-600 font-medium">
                          {r.errors.length > 0 ? r.errors.join('; ') : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Hệ thống sẽ chỉ nạp các dòng dữ liệu hợp lệ vào kho hồ sơ chính thức.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              disabled={!hasValidated || validCount === 0}
              onClick={handleConfirmImport}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Icons.Check size={16} /> Xác nhận nhập {validCount} hồ sơ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
