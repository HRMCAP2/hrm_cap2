export type DepartmentType = 
  | 'Customer Support' 
  | 'Graphic Design' 
  | 'Operations & Fulfillment' 
  | 'Finance & Admin' 
  | 'Technology';

export type PositionType = 
  | 'Support Specialist'
  | 'Graphic Designer POD'
  | 'Order Fulfillment Staff'
  | 'Customer Support Lead'
  | 'Design Lead'
  | 'Operations Lead'
  | 'HR Specialist'
  | 'General Accountant';

export type ContractType = 
  | 'Chính thức' 
  | 'Thử việc' 
  | 'Thời vụ' 
  | 'Cộng tác viên (CTV)';

export type PaymentMethodType = 
  | 'Theo giờ' 
  | 'Theo sản lượng' 
  | 'Lương cố định' 
  | 'Kết hợp';

export type WorkStatusType = 
  | 'Đang làm việc' 
  | 'Tạm hoãn' 
  | 'Đã thôi việc';

export type NDASignStatus = 
  | 'Đã ký' 
  | 'Chưa ký';

export interface EmployeeProfile {
  id: string;
  employeeCode: string; // Unique, e.g., EF-001
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  identityCard?: string; // CCCD
  address?: string;
  
  department: DepartmentType;
  position: PositionType;
  directLeadId?: string;
  directLeadName?: string;
  
  // Contract & Legal
  contractType: ContractType;
  contractStartDate: string;
  contractEndDate?: string;
  ndaStatus: NDASignStatus;
  ndaSignedDate?: string;
  
  // Payment method
  paymentMethod: PaymentMethodType;
  baseSalaryOrRate: number; // Đơn giá giờ, đơn giá sản lượng, hoặc lương cứng
  bankName?: string;
  bankAccountNumber?: string;
  
  // Status
  workStatus: WorkStatusType;
  joinDate: string;
  annualLeaveRemaining: number; // Mặc định 12 ngày/năm (FR-16)
  
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
