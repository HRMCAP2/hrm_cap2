import { UserRole } from './auth';

export type AuditActionType =
  | 'LOGIN'
  | 'LOGOUT'
  | 'CHANGE_PASSWORD'
  | 'CREATE_USER'
  | 'UPDATE_USER'
  | 'LOCK_USER'
  | 'UNLOCK_USER'
  | 'CREATE_PROFILE'
  | 'UPDATE_PROFILE'
  | 'IMPORT_PROFILES'
  | 'DELETE_PROFILE_ATTEMPT'
  | 'SUBMIT_REQUEST'
  | 'APPROVE_REQUEST'
  | 'REJECT_REQUEST'
  | 'SYSTEM_CONFIG';

export type AuditModuleType =
  | 'Tài khoản & Phân quyền'
  | 'Hồ sơ nhân viên'
  | 'Yêu cầu & Nghỉ phép'
  | 'Chấm công & Sản lượng'
  | 'Hệ thống';

export interface AuditLogItem {
  id: string;
  timestamp: string; // ISO string
  userId: string;
  userName: string;
  userRole: UserRole;
  action: AuditActionType;
  actionTitle: string;
  module: AuditModuleType;
  targetObject: string; // e.g. "Nhân viên EF-003", "Tài khoản lead.support"
  details: string;
  oldValue?: unknown;
  newValue?: unknown;
  ipAddress?: string;
}
