import { UserRole } from './auth';

export type NotificationType =
  | 'LEAVE_REQUEST'
  | 'OVERTIME_REQUEST'
  | 'TIME_ADJUSTMENT'
  | 'APPROVAL_RESULT'
  | 'PROFILE_UPDATE'
  | 'ACCOUNT_STATUS'
  | 'PAYROLL_CLOSED'
  | 'SYSTEM_ALERT';

export interface NotificationItem {
  id: string;
  recipientId: string; // User ID or 'ALL' or specific role
  recipientRole?: UserRole;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  isRead: boolean;
  createdAt: string;
  senderName?: string;
}
