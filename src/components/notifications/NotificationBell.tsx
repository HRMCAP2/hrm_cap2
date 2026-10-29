'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { storage } from '@/lib/storage';
import { NotificationItem } from '@/types/notification';
import { Icons } from '../icons';

export function NotificationBell() {
  const { currentUser } = useAuth();

  const getFilteredNotifications = useCallback(() => {
    if (!currentUser) return [];
    const all = storage.getNotifications();
    return all.filter(
      (n) =>
        n.recipientId === currentUser.id ||
        n.recipientId === 'ALL' ||
        (n.recipientRole && n.recipientRole === currentUser.role)
    );
  }, [currentUser]);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    getFilteredNotifications()
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleCheck = () => {
      setNotifications(getFilteredNotifications());
    };
    handleCheck();
    const interval = setInterval(handleCheck, 5000);
    return () => clearInterval(interval);
  }, [getFilteredNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    const all = storage.getNotifications();
    const updated = all.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    storage.saveNotifications(updated);
    setNotifications(getFilteredNotifications());
  };

  const markAllAsRead = () => {
    const all = storage.getNotifications();
    const myIds = new Set(notifications.map((n) => n.id));
    const updated = all.map((n) => (myIds.has(n.id) ? { ...n, isRead: true } : n));
    storage.saveNotifications(updated);
    setNotifications(getFilteredNotifications());
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setNotifications(getFilteredNotifications());
        }}
        className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden"
        title="Thông báo hệ thống (FR-32)"
      >
        <Icons.Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-800">Thông báo nghiệp vụ</span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                {unreadCount} mới
              </span>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Không có thông báo nào.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-3 text-left transition-colors cursor-pointer hover:bg-slate-50 ${
                    !n.isRead ? 'bg-indigo-50/40' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`text-xs font-semibold ${!n.isRead ? 'text-indigo-950 font-bold' : 'text-slate-700'}`}>
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {formatTime(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  {n.senderName && (
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-400">
                      <span>Từ: {n.senderName}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
            <a
              href="/notifications"
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium inline-block"
              onClick={() => setIsOpen(false)}
            >
              Xem tất cả thông báo &rarr;
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
