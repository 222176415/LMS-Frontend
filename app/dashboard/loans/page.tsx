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
import {Loan, LoanRecord} from "@/lib/type";
import {
  DashboardHeader,
  FilterBar,
  LoansTable,
  MetricsGrid,
} from "@/components/Dashboard/DashboardLayout";
import {ViewLoanStatementModal} from "@/components/Dashboard/ViewLoanStatementModal";

export default function LoansLedgerPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<
    "All" | "Active" | "Overdue" | "Paid"
  >("All");
  const [isExporting, setIsExporting] = useState(false);
  const [selectedLoanForView, setSelectedLoanForView] = useState<LoanRecord | null>(null);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  const {
    data: loans = [],
    isLoading,
    isRefetching,
    error,
  } = useLoansLedgerQuery();

  // const filteredLoans = loans.filter((l) => {
  //   const matchesSearch =
  //     `${l.client?.firstName || ""} ${l.client?.lastName || ""} ${l.id}`
  //       .toLowerCase()
  //       .includes(search.toLowerCase());
  //   const matchesTab = activeTab === "All" || l.status === activeTab;
  //   return matchesSearch && matchesTab;
  // });

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
 
  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      const response = await apiClient.get("/Loans/export", {
        responseType: "blob",
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const contentDisposition = response.headers["content-disposition"];
      let fileName = `Loans_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;

      if (contentDisposition) {
        const match = contentDisposition.match(/filename\*?=(?:UTF-8'')?([^;]+)/i);
        if (match && match[1]) {
          fileName = decodeURIComponent(match[1].replace(/["']/g, ""));
        }
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export Error:", error);
    /*  showToast("error", "Failed to download Excel report.");*/
    } finally {
      setIsExporting(false);
    }
  };


  const handleTableAction = (
      actionType: "APPROVE" | "DECLINE" | "PAYMENT" | "EDIT" | "DELETE" | "VIEW",
      loan: LoanRecord
  ) => {
    if (actionType === "VIEW") {
      setSelectedLoanForView(loan);
      setIsStatementModalOpen(true);
      return;
    }

    // Handle other actions (APPROVE, DECLINE, PAYMENT, etc.)
  };
  
  return (
    <div className="space-y-8 p-6">
      <DashboardHeader
          isRefetching={isRefetching}
          isExporting={isExporting}
          onExport={handleExport}
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
{/*      @ts-ignore*/}
      <LoansTable
        isLoading={isLoading}
        //currentUserOrgId={1}
        onAction={handleTableAction}
        loans={loans}
        globalFilter={search}
        statusFilter={activeTab}
      />
      <ViewLoanStatementModal
          loan={selectedLoanForView}
          isOpen={isStatementModalOpen}
          onClose={() => {
            setIsStatementModalOpen(false);
            setSelectedLoanForView(null);
          }}
      />
    </div>
  );
}

