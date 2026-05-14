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
