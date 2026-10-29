"use client";

import { useMemo, useState } from "react";

type AttendanceStatus = "Đúng giờ" | "Đi trễ" | "Vắng mặt";

type AttendanceRecord = {
  id: string;
  name: string;
  role: string;
  employeeCode: string;
  checkIn: string | null;
  checkOut: string | null;
  hours: string;
  status: AttendanceStatus;
  initials: string;
  avatarColor: string;
  date: string;
};

const today = "2026-10-29";

const initialRecords: AttendanceRecord[] = [
  {
    id: "1",
    name: "Nguyễn Minh Anh",
    role: "Chuyên viên nhân sự",
    employeeCode: "NV001",
    checkIn: "08:02",
    checkOut: null,
    hours: "Đang làm",
    status: "Đúng giờ",
    initials: "MA",
    avatarColor: "bg-violet-100 text-violet-700",
    date: today,
  },
  {
    id: "2",
    name: "Trần Quốc Bảo",
    role: "Kỹ sư phần mềm",
    employeeCode: "NV024",
    checkIn: "08:17",
    checkOut: "17:32",
    hours: "8 giờ 15 phút",
    status: "Đi trễ",
    initials: "QB",
    avatarColor: "bg-sky-100 text-sky-700",
    date: today,
  },
  {
    id: "3",
    name: "Lê Thu Hà",
    role: "Chuyên viên kế toán",
    employeeCode: "NV018",
    checkIn: "07:54",
    checkOut: "17:06",
    hours: "8 giờ 12 phút",
    status: "Đúng giờ",
    initials: "TH",
    avatarColor: "bg-rose-100 text-rose-700",
    date: today,
  },
  {
    id: "4",
    name: "Phạm Hoàng Long",
    role: "Trưởng nhóm kinh doanh",
    employeeCode: "NV009",
    checkIn: null,
    checkOut: null,
    hours: "—",
    status: "Vắng mặt",
    initials: "HL",
    avatarColor: "bg-amber-100 text-amber-700",
    date: today,
  },
  {
    id: "5",
    name: "Đỗ Ngọc Linh",
    role: "Chuyên viên marketing",
    employeeCode: "NV031",
    checkIn: "08:00",
    checkOut: "17:15",
    hours: "8 giờ 15 phút",
    status: "Đúng giờ",
    initials: "NL",
    avatarColor: "bg-emerald-100 text-emerald-700",
    date: today,
  },
  {
    id: "6",
    name: "Vũ Đức Thành",
    role: "Nhân viên hỗ trợ khách hàng",
    employeeCode: "NV042",
    checkIn: "08:11",
    checkOut: null,
    hours: "Đang làm",
    status: "Đi trễ",
    initials: "ĐT",
    avatarColor: "bg-indigo-100 text-indigo-700",
    date: today,
  },
  {
    id: "7",
    name: "Hoàng Khánh Vy",
    role: "Chuyên viên tuyển dụng",
    employeeCode: "NV015",
    checkIn: null,
    checkOut: null,
    hours: "—",
    status: "Vắng mặt",
    initials: "KV",
    avatarColor: "bg-pink-100 text-pink-700",
    date: today,
  },
];

const statusStyles: Record<AttendanceStatus, string> = {
  "Đúng giờ": "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  "Đi trễ": "bg-amber-50 text-amber-700 ring-amber-600/15",
  "Vắng mặt": "bg-rose-50 text-rose-700 ring-rose-600/15",
};

function Icon({
  name,
  className = "size-5",
}: {
  name: "grid" | "clock" | "calendar" | "file" | "users" | "search" | "bell" | "chevron" | "arrow" | "filter" | "download" | "check" | "menu";
  className?: string;
}) {
  const paths: Record<typeof name, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    filter: <><path d="M4 7h16M7 12h10m-7 5h4" /><circle cx="8" cy="7" r="1" fill="currentColor" /><circle cx="15" cy="12" r="1" fill="currentColor" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5M12 15V3" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function formatVietnameseDate(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function calculateWorkDuration(checkIn: string, checkOut: string) {
  const [checkInHour, checkInMinute] = checkIn.split(":").map(Number);
  const [checkOutHour, checkOutMinute] = checkOut.split(":").map(Number);
  const totalMinutes = Math.max(
    0,
    checkOutHour * 60 + checkOutMinute - (checkInHour * 60 + checkInMinute),
  );
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours} giờ ${minutes} phút`;
}

export default function AttendanceDashboard() {
  const [records, setRecords] = useState(initialRecords);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(today);
  const [statusFilter, setStatusFilter] = useState("Tất cả trạng thái");
  const [notice, setNotice] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const myRecord = records.find((record) => record.id === "1");

  const filteredRecords = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("vi-VN");
    return records.filter((record) => {
      const matchesSearch =
        !normalizedSearch ||
        record.name.toLocaleLowerCase("vi-VN").includes(normalizedSearch) ||
        record.employeeCode.toLocaleLowerCase("vi-VN").includes(normalizedSearch);
      const matchesStatus =
        statusFilter === "Tất cả trạng thái" || record.status === statusFilter;
      return record.date === selectedDate && matchesSearch && matchesStatus;
    });
  }, [records, search, selectedDate, statusFilter]);

  function handleAttendanceAction() {
    if (!myRecord) return;

    if (myRecord.checkIn && !myRecord.checkOut) {
      const checkOut = new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date());

      setRecords((currentRecords) =>
        currentRecords.map((record) =>
          record.id === myRecord.id
            ? {
                ...record,
                checkOut,
                hours: calculateWorkDuration(myRecord.checkIn!, checkOut),
              }
            : record,
        ),
      );
      setNotice(`Đã ghi nhận check-out lúc ${checkOut} trên bản demo.`);
      return;
    }

    if (!myRecord.checkIn) {
      const checkIn = new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date());

      setRecords((currentRecords) =>
        currentRecords.map((record) =>
          record.id === myRecord.id
            ? { ...record, checkIn, status: "Đúng giờ", hours: "Đang làm" }
            : record,
        ),
      );
      setNotice(`Đã ghi nhận check-in lúc ${checkIn} trên bản demo.`);
    }
  }

  const attendanceButtonLabel = !myRecord?.checkIn
    ? "Check-in ngay"
    : myRecord.checkOut
      ? "Đã hoàn tất hôm nay"
      : "Check-out";

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] flex-col border-r border-slate-200/80 bg-white lg:flex">
        <div className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            <Icon name="grid" className="size-5" />
          </div>
          <div>
            <p className="text-[15px] font-bold tracking-tight text-slate-900">NOVA HRM</p>
            <p className="text-[11px] font-medium tracking-wide text-slate-400">QUẢN TRỊ NHÂN SỰ</p>
          </div>
        </div>

        <div className="px-4 pt-7">
          <p className="px-3 text-[10px] font-bold tracking-[0.16em] text-slate-400">KHÔNG GIAN LÀM VIỆC</p>
          <button className="mt-3 flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-3 text-left text-sm font-semibold text-slate-700 shadow-sm">
            <span className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">N</span>Công ty Nova</span>
            <Icon name="chevron" className="size-4 rotate-90 text-slate-400" />
          </button>
        </div>

        <nav aria-label="Điều hướng chính" className="mt-8 flex-1 px-4">
          <p className="px-3 text-[10px] font-bold tracking-[0.16em] text-slate-400">TỔNG QUAN</p>
          <a href="#tong-quan" className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50">
            <Icon name="grid" className="size-[18px]" /> Tổng quan
          </a>
          <p className="mb-2 mt-7 px-3 text-[10px] font-bold tracking-[0.16em] text-slate-400">NHÂN SỰ</p>
          <a href="#nhan-su" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50">
            <Icon name="users" className="size-[18px]" /> Hồ sơ nhân viên
          </a>
          <a href="#cham-cong" aria-current="page" className="mt-1 flex items-center gap-3 rounded-xl bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-700">
            <Icon name="clock" className="size-[18px]" /> Chấm công
            <span className="ml-auto size-1.5 rounded-full bg-indigo-600" />
          </a>
          <a href="#lich-lam-viec" className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50">
            <Icon name="calendar" className="size-[18px]" /> Lịch làm việc
          </a>
          <a href="#don-tu" className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50">
            <Icon name="file" className="size-[18px]" /> Đơn từ
          </a>
          <p className="mb-2 mt-7 px-3 text-[10px] font-bold tracking-[0.16em] text-slate-400">TỔ CHỨC</p>
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400">
            <Icon name="users" className="size-[18px]" /> Phòng ban
          </div>
        </nav>

        <div className="m-4 rounded-2xl bg-slate-900 p-4 text-white">
          <div className="flex items-center gap-2 text-xs font-semibold"><span className="size-2 rounded-full bg-emerald-400" /> Gói tiêu chuẩn</div>
          <p className="mt-2 text-[11px] leading-5 text-slate-400">Cần hỗ trợ sử dụng hệ thống?</p>
          <button className="mt-3 text-xs font-semibold text-indigo-300 hover:text-white">Liên hệ quản trị viên <span aria-hidden="true">→</span></button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <nav aria-label="Điều hướng chính trên thiết bị nhỏ" className="h-full w-[280px] bg-white p-5 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-7 flex items-center justify-between">
              <span className="font-bold">NOVA HRM</span>
              <button aria-label="Đóng menu" className="rounded-lg p-2 text-slate-500" onClick={() => setMobileMenuOpen(false)}>×</button>
            </div>
            <a href="#tong-quan" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500"><Icon name="grid" /> Tổng quan</a>
            <a href="#cham-cong" aria-current="page" className="mt-1 flex items-center gap-3 rounded-xl bg-indigo-50 px-3 py-3 text-sm font-semibold text-indigo-700"><Icon name="clock" /> Chấm công</a>
            <a href="#lich-lam-viec" className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500"><Icon name="calendar" /> Lịch làm việc</a>
            <a href="#don-tu" className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500"><Icon name="file" /> Đơn từ</a>
          </nav>
        </div>
      )}

      <div className="lg:pl-[252px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur sm:px-7 lg:px-10">
          <div className="flex items-center gap-3">
            <button aria-label="Mở menu" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setMobileMenuOpen(true)}><Icon name="menu" /></button>
            <div className="hidden items-center gap-2 text-sm text-slate-400 sm:flex"><span>Nhân sự</span><Icon name="chevron" className="size-3" /><span className="font-semibold text-slate-700">Chấm công</span></div>
            <span className="font-semibold text-slate-800 sm:hidden">Chấm công</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button aria-label="Tìm kiếm" className="hidden rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 sm:block"><Icon name="search" /></button>
            <button aria-label="Thông báo" className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"><Icon name="bell" /><span className="absolute right-2.5 top-2.5 size-2 rounded-full border-2 border-white bg-rose-500" /></button>
            <div className="h-8 w-px bg-slate-200" />
            <button className="flex items-center gap-2.5 rounded-xl p-1.5 text-left hover:bg-slate-50">
              <span className="flex size-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">MA</span>
              <span className="hidden sm:block"><span className="block text-xs font-semibold text-slate-800">Minh Anh</span><span className="block text-[10px] text-slate-400">Quản trị viên</span></span>
              <Icon name="chevron" className="hidden size-3 rotate-90 text-slate-400 sm:block" />
            </button>
          </div>
        </header>

        <main id="cham-cong" className="mx-auto max-w-[1440px] px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400"><span>Nhân sự</span><Icon name="chevron" className="size-3" /><span className="text-indigo-600">Chấm công</span></div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-[30px]">Quản lý chấm công</h1>
              <p className="mt-1.5 text-sm text-slate-500">Theo dõi thời gian làm việc và tình hình chuyên cần của nhân viên.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="mr-1 text-sm font-medium capitalize text-slate-500">{formatVietnameseDate(new Date(`${today}T12:00:00`))}</span>
              <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50"><Icon name="download" className="size-4" /><span className="hidden sm:inline">Xuất báo cáo</span><span className="sm:hidden">Xuất</span></button>
            </div>
          </div>

          <section aria-label="Thống kê chấm công hôm nay" className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            <StatCard title="Tổng nhân viên" value="128" change="Toàn công ty" icon="users" iconStyle="bg-indigo-50 text-indigo-600" />
            <StatCard title="Có mặt hôm nay" value="118" change="92,2% tổng nhân sự" icon="check" iconStyle="bg-emerald-50 text-emerald-600" />
            <StatCard title="Đi trễ" value="08" change="Cần theo dõi" icon="clock" iconStyle="bg-amber-50 text-amber-600" />
            <StatCard title="Vắng mặt" value="10" change="2 đơn đang chờ" icon="users" iconStyle="bg-rose-50 text-rose-600" />
          </section>

          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.02]">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-2"><h2 className="text-base font-bold text-slate-900">Lịch sử chấm công</h2><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">{filteredRecords.length}</span></div>
                <p className="mt-1 text-xs text-slate-400">Danh sách ghi nhận giờ làm việc trong ngày.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <label className="relative min-w-0 flex-1 sm:min-w-[220px]">
                  <span className="sr-only">Tìm nhân viên</span><Icon name="search" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tên, mã nhân viên..." className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10" />
                </label>
                <label className="relative">
                  <span className="sr-only">Lọc theo ngày</span><Icon name="calendar" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} aria-label="Lọc theo ngày" className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-600 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 sm:w-[160px]" />
                </label>
                <label className="relative">
                  <span className="sr-only">Lọc theo trạng thái</span><Icon name="filter" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Lọc theo trạng thái" className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-sm text-slate-600 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 sm:w-[178px]">
                    <option>Tất cả trạng thái</option><option>Đúng giờ</option><option>Đi trễ</option><option>Vắng mặt</option>
                  </select><Icon name="chevron" className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 rotate-90 text-slate-400" />
                </label>
              </div>
            </div>

            {notice && <div role="status" className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50 px-5 py-3 text-sm text-emerald-800"><Icon name="check" className="size-4" />{notice}</div>}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  <tr><th className="px-6 py-3.5">Nhân viên</th><th className="px-4 py-3.5">Mã nhân viên</th><th className="px-4 py-3.5">Giờ vào</th><th className="px-4 py-3.5">Giờ ra</th><th className="px-4 py-3.5">Tổng giờ</th><th className="px-6 py-3.5">Trạng thái</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="transition hover:bg-slate-50/70">
                      <td className="px-6 py-4"><div className="flex items-center gap-3"><span className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${record.avatarColor}`}>{record.initials}</span><span><span className="block whitespace-nowrap text-sm font-semibold text-slate-800">{record.name}</span><span className="mt-0.5 block whitespace-nowrap text-xs text-slate-400">{record.role}</span></span></div></td>
                      <td className="px-4 py-4 text-sm font-medium text-slate-500">{record.employeeCode}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-700">{record.checkIn ?? "—"}</td>
                      <td className="px-4 py-4 text-sm font-medium text-slate-500">{record.checkOut ?? "—"}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{record.hours}</td>
                      <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${statusStyles[record.status]}`}><span className="size-1.5 rounded-full bg-current" />{record.status}</span></td>
                    </tr>
                  ))}
                  {filteredRecords.length === 0 && <tr><td colSpan={6} className="px-6 py-14 text-center"><div className="mx-auto flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-400"><Icon name="search" /></div><p className="mt-3 text-sm font-semibold text-slate-700">Không tìm thấy dữ liệu</p><p className="mt-1 text-xs text-slate-400">Thử thay đổi từ khóa hoặc bộ lọc của bạn.</p></td></tr>}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-xs text-slate-400">Đang hiển thị <span className="font-semibold text-slate-600">{filteredRecords.length}</span> trong <span className="font-semibold text-slate-600">{filteredRecords.length}</span> nhân viên</p>
              <div className="flex items-center gap-1 self-end sm:self-auto"><button disabled className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-300">Trước</button><button className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white">1</button><button disabled className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-300">Sau</button></div>
            </div>
          </section>

          <section className="mt-5 flex flex-col gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3.5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm"><Icon name="clock" /></span>
              <div><h2 className="text-sm font-bold text-slate-900">Chấm công của bạn</h2><p className="mt-1 text-xs text-slate-500">{myRecord?.checkOut ? `Bạn đã hoàn tất ngày làm việc · ${myRecord.checkIn} – ${myRecord.checkOut}` : myRecord?.checkIn ? `Bạn đã check-in lúc ${myRecord.checkIn} · Chúc bạn một ngày làm việc hiệu quả!` : "Bạn chưa check-in hôm nay."}</p></div>
            </div>
            <button onClick={handleAttendanceAction} disabled={Boolean(myRecord?.checkIn && myRecord.checkOut)} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-emerald-600 disabled:shadow-none">
              {myRecord?.checkOut ? <Icon name="check" className="size-4" /> : <Icon name="arrow" className="size-4 rotate-45" />}{attendanceButtonLabel}
            </button>
          </section>

          <p className="mt-5 text-center text-[11px] text-slate-400">Dữ liệu minh họa · Thao tác chấm công chỉ được mô phỏng trên giao diện và chưa lưu vào cơ sở dữ liệu.</p>
        </main>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  icon,
  iconStyle,
}: {
  title: string;
  value: string;
  change: string;
  icon: "users" | "check" | "clock";
  iconStyle: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-900/[0.02] sm:p-5">
      <div className="flex items-start justify-between gap-2"><p className="text-xs font-medium text-slate-500 sm:text-sm">{title}</p><span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}><Icon name={icon} className="size-[18px]" /></span></div>
      <div className="mt-3 flex items-end justify-between gap-2"><p className="text-[26px] font-bold leading-none tracking-tight text-slate-900 sm:text-[30px]">{value}</p><p className="hidden text-[10px] text-slate-400 sm:block">{change}</p></div>
      <p className="mt-2 text-[10px] text-slate-400 sm:hidden">{change}</p>
    </article>
  );
}
