'use client';

import { UserAccount } from '@/types/auth';
import { EmployeeProfile } from '@/types/employee';
import { AuditLogItem } from '@/types/audit';
import { NotificationItem } from '@/types/notification';
import {
  INITIAL_USERS,
  INITIAL_EMPLOYEES,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from './mock-data';

const STORAGE_KEYS = {
  USERS: 'ecomfree_hrm_users_v1',
  EMPLOYEES: 'ecomfree_hrm_employees_v1',
  AUDIT_LOGS: 'ecomfree_hrm_audit_logs_v1',
  NOTIFICATIONS: 'ecomfree_hrm_notifications_v1',
  CURRENT_USER: 'ecomfree_hrm_current_user_v1',
};

// Safe localStorage helper
export const storage = {
  getUsers: (): UserAccount[] => {
    if (typeof window === 'undefined') return INITIAL_USERS;
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_USERS;
    }
  },

  saveUsers: (users: UserAccount[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getEmployees: (): EmployeeProfile[] => {
    if (typeof window === 'undefined') return INITIAL_EMPLOYEES;
    const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
      return INITIAL_EMPLOYEES;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_EMPLOYEES;
    }
  },

  saveEmployees: (employees: EmployeeProfile[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  },

  getAuditLogs: (): AuditLogItem[] => {
    if (typeof window === 'undefined') return INITIAL_AUDIT_LOGS;
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  },

  addAuditLog: (log: Omit<AuditLogItem, 'id' | 'timestamp'>) => {
    if (typeof window === 'undefined') return;
    const currentLogs = storage.getAuditLogs();
    const newLogItem: AuditLogItem = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [newLogItem, ...currentLogs];
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated));
    return newLogItem;
  },

  getNotifications: (): NotificationItem[] => {
    if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  saveNotifications: (notifications: NotificationItem[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },

  addNotification: (item: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) => {
    if (typeof window === 'undefined') return;
    const current = storage.getNotifications();
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    const updated = [newNotif, ...current];
    storage.saveNotifications(updated);
    return newNotif;
  },

  resetToDefault: () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
};
