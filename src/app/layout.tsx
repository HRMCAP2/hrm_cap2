import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers/Providers';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ecomfree HRM - Hệ thống Quản trị Nhân sự & Phân quyền',
  description: 'Hệ thống Quản lý nhân sự tập trung Ecomfree HRM - MVP Sprint 1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-slate-100 text-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
