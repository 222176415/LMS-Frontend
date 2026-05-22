"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  AutoIssueLoanPayload,
  BorrowerProfile,
  CreateBorrowerPayload,
  DashboardSummaryData,
  LoanContract,
  LoginResponse,
  OnboardStaffPayload,
  RecordRepaymentPayload,
} from "@/lib/type";

export function useDashboardSummaryQuery() {
  return useQuery<DashboardSummaryData>({
    queryKey: ["realtimeDashboardSummary"],
    queryFn: async () => {
      const response = await apiClient.get("/Analytics/dashboard-summary");
      return response.data.data;
    },
  });
}

export function useBorrowersQuery() {
  return useQuery<BorrowerProfile[]>({
    queryKey: ["borrowersIndex"],
    queryFn: async () => {
      const response = await apiClient.get("/Clients");
      return response.data.data;
    },
  });
}

export function useCreateBorrowerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateBorrowerPayload) => {
      const response = await apiClient.post("/Clients", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrowersIndex"] });
    },
  });
}

export function useLoansLedgerQuery() {
  return useQuery<LoanContract[]>({
    queryKey: ["loansLedgerIndex"],
    queryFn: async () => {
      const response = await apiClient.get("/Loans");
      return response.data.data;
    },
  });
}

export function useAutoIssueLoanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AutoIssueLoanPayload) => {
      const response = await apiClient.post("/Loans/auto-issue", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loansLedgerIndex"] });
      queryClient.invalidateQueries({ queryKey: ["realtimeDashboardSummary"] });
      queryClient.invalidateQueries({ queryKey: ["borrowersIndex"] });
    },
  });
}

export function useRecordRepaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RecordRepaymentPayload) => {
      const response = await apiClient.post("/Payments", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loansLedgerIndex"] });
      queryClient.invalidateQueries({ queryKey: ["realtimeDashboardSummary"] });
    },
  });
}

export function useStaffDirectoryQuery() {
  return useQuery({
    queryKey: ["staffDirectoryIndex"],
    queryFn: async () => {
      const response = await apiClient.get("/Users");
      return response.data.data;
    },
  });
}

export function useOnboardStaffMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: OnboardStaffPayload) => {
      const response = await apiClient.post("/Users", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffDirectoryIndex"] });
    },
  });
}
