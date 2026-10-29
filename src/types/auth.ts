export type UserRole = 'HR' | 'Lead' | 'Employee' | 'Accountant';

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  avatarUrl?: string;
  employeeCode?: string; // Links to EmployeeProfile
  department?: string;
  lastLoginAt?: string;
  createdAt: string;
}

export interface CurrentUserSession {
  user: UserAccount;
  token?: string;
  expiresAt: string;
}
