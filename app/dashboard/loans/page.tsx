"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

// Shadcn UI Elements
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Lucide Icons
import {
  Search,
  Plus,
  FileSpreadsheet,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useLoansLedgerQuery } from "@/lib/api-hooks";
import { Loan } from "@/lib/type";
import {
  DashboardHeader,
  FilterBar,
  LoansTable,
  MetricsGrid,
} from "@/components/Dashboard/DashboardLayout";

export default function LoansLedgerPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<
    "All" | "Active" | "Overdue" | "Paid"
  >("All");

  const {
    data: loans = [],
    isLoading,
    isRefetching,
    error,
  } = useLoansLedgerQuery();

  const filteredLoans = loans.filter((l) => {
    const matchesSearch =
      `${l.client?.firstName || ""} ${l.client?.lastName || ""} ${l.id}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesTab = activeTab === "All" || l.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalPortfolio = loans.reduce(
    (acc, curr) => acc + (curr.principalAmount || 0),
    0,
  );
  const totalOverdue = loans
    .filter((l) => l.status === "Overdue")
    .reduce((acc, curr) => acc + (curr.totalAmountDue || 0), 0);
  const collectedCapital = loans
    .filter((l) => l.status === "Paid")
    .reduce((acc, curr) => acc + (curr.totalAmountDue || 0), 0);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-600 m-6">
        Error: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <DashboardHeader
        isRefetching={isRefetching}
        onExport={() => alert("Export initialized.")}
      />
      <MetricsGrid
        isLoading={isLoading}
        totalPortfolio={totalPortfolio}
        totalOverdue={totalOverdue}
        collectedCapital={collectedCapital}
      />
      <FilterBar
        search={search}
        setSearch={setSearch}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoading={isLoading}
      />
      <LoansTable
        isLoading={isLoading}
        loans={loans}
        globalFilter={search}
        statusFilter={activeTab}
      />
    </div>
  );
}
