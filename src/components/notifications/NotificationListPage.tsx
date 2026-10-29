'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { storage } from '@/lib/storage';
import { NotificationItem } from '@/types/notification';
import { Icons } from '../icons';

export function NotificationListPage() {
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
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');

  useEffect(() => {
    const handleUpdate = () => {
      setNotifications(getFilteredNotifications());
    };
    handleUpdate();
  }, [getFilteredNotifications]);

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

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'READ') return n.isRead;
    return true;
  });

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'LEAVE_REQUEST':
      case 'OVERTIME_REQUEST':
        return <Icons.Clock size={16} className="text-amber-600" />;
      case 'APPROVAL_RESULT':
        return <Icons.CheckCircle size={16} className="text-emerald-600" />;
      case 'PROFILE_UPDATE':
      case 'ACCOUNT_STATUS':
        return <Icons.Shield size={16} className="text-purple-600" />;
      default:
        return <Icons.Bell size={16} className="text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Thông báo nghiệp vụ</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
              FR-32 / PB-24
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Nhận thông báo khi có yêu cầu mới, kết quả phê duyệt và cập nhật hệ thống
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={markAllAsRead}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Icons.Check size={14} /> Đánh dấu đã đọc tất cả
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filter === 'ALL'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Tất cả ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filter === 'UNREAD'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Chưa đọc ({notifications.filter((n) => !n.isRead).length})
        </button>
        <button
          onClick={() => setFilter('READ')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filter === 'READ'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Đã đọc ({notifications.filter((n) => n.isRead).length})
        </button>
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <Icons.Bell size={32} className="mx-auto mb-2 text-slate-300" />
            <p>Không có thông báo nào trong mục này.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredNotifs.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`p-4 transition-colors cursor-pointer hover:bg-slate-50/80 flex items-start justify-between gap-4 ${
                  !n.isRead ? 'bg-indigo-50/30' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 mt-0.5 shrink-0">
                    {getNotifIcon(n.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-xs font-semibold ${
                          !n.isRead ? 'text-indigo-950 font-bold' : 'text-slate-800'
                        }`}
                      >
                        {n.title}
                      </h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {n.message}
                    </p>
                    {n.senderName && (
                      <div className="mt-1.5 text-[11px] text-slate-400">
                        Người gửi: <span className="font-medium text-slate-600">{n.senderName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(n.createdAt).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {!n.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(n.id);
                      }}
                      className="block mt-1 text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      Đánh dấu đã đọc
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
