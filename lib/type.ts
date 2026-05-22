export interface LoginResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    email: string;
    organizationId: number;
  };
}
export interface OnboardStaffPayload {
  fullName: string;
  email: string;
  roleId: number;
}
export interface LoanContract {
  id: number;
  clientId: number;
  clientFullName: string;
  principalAmount: number;
  interestRate: number;
  vatRate: number;
  totalAmountDue: number;
  status: "Active" | "Overdue" | "Paid" | "Defaulted";
  issueDate: string;
  dueDate: string;
}

export interface AutoIssueLoanPayload {
  firstName: string;
  surname: string;
  email: string;
  phoneNumber: string;
  address: string;
  principalAmount: number;
  dueDate: string;
}

export interface RecordRepaymentPayload {
  loanId: number;
  amountPaid: number;
  paymentMethod: string;
}

export interface AutoIssueLoanPayload {
  firstName: string;
  surname: string;
  email: string;
  phoneNumber: string;
  address: string;
  principalAmount: number;
  dueDate: string;
}

export interface RecordRepaymentPayload {
  loanId: number;
  amountPaid: number;
  paymentMethod: string;
}
export interface BorrowerProfile {
  id: number;
  firstName: string;
  surname: string;
  email: string;
  phoneNumber: string;
  address: string;
  activeLoanCount: number;
}

export interface CreateBorrowerPayload {
  firstName: string;
  surname: string;
  email: string;
  phoneNumber: string;
  address: string;
}
export interface DashboardSummaryData {
  metrics: {
    activeDisbursed: string;
    overdueAtRisk: string;
    collectedInterest: string;
    pendingRequests: number;
  };
  trendData: Array<{
    month: string;
    capitalIssued: number;
    revenueCollected: number;
  }>;
  riskData: Array<{ name: string; value: number }>;
}
export interface ClientInfo {
  id: number;
  firstName: string;
  lastName: string; // Changed from surname
  email: string;
  phoneNumber: string;
  address: string;
}

export interface Loan {
  id: number;
  principalAmount: number;
  interestRate: number;
  totalAmountDue: number;
  status: "Active" | "Overdue" | "Paid" | "Defaulted";
  dueDate: string;
  client: ClientInfo;
}
export interface FilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  activeTab: "All" | "Active" | "Overdue" | "Paid";
  setActiveTab: (tab: "All" | "Active" | "Overdue" | "Paid") => void;
  isLoading: boolean;
}
export interface MetricsGridProps {
  isLoading: boolean;
  totalPortfolio: number;
  totalOverdue: number;
  collectedCapital: number;
}
export interface DashboardHeaderProps {
  isRefetching: boolean;
  onExport: () => void;
}
