import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileSpreadsheet, Plus, RefreshCw, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";
import { Loan, FilterBarProps, DashboardHeaderProps } from "@/lib/type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

interface LoansTableProps {
  isLoading: boolean;
  loans: Loan[];
}

export function AutoIssueModal() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    surname: "",
    email: "",
    phoneNumber: "",
    address: "",
    principalAmount: "",
    dueDate: "",
  });

  const createLoanMutation = useMutation({
    mutationFn: async (payload: any) => await apiClient.post("/loans", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loansLedger"] });
      setIsOpen(false);
      setForm({
        firstName: "",
        surname: "",
        email: "",
        phoneNumber: "",
        address: "",
        principalAmount: "",
        dueDate: "",
      });
    },
    onError: (err: any) => alert(`Submission Failure: ${err.message}`),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.firstName ||
      !form.surname ||
      !form.email ||
      !form.principalAmount ||
      !form.dueDate
    ) {
      alert("Please fulfill all required borrower metrics fields.");
      return;
    }

    // Flattend structure explicitly tailored to match the C# CreateLoanRequest DTO exactly
    createLoanMutation.mutate({
      principalAmount: parseFloat(form.principalAmount),
      dueDate: new Date(form.dueDate).toISOString(), // Ensure standard ISO format for .NET DateTime conversion
      email: form.email,
      firstName: form.firstName,
      surname: form.surname,
      phoneNumber: form.phoneNumber,
      address: form.address,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-neutral-900 text-white text-xs rounded-md h-9 gap-1.5">
          <Plus size={14} />
          <span>Auto-Issue Contract</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl bg-white rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-bold uppercase">
            Auto-Issue Capital Flow
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-500">
            Initialize borrower metrics processing logic.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[10px] text-neutral-400 font-bold uppercase">
                First Name *
              </Label>
              <Input
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                placeholder="John"
                className="h-9 text-xs"
              />
            </div>
            <div>
              <Label className="text-[10px] text-neutral-400 font-bold uppercase">
                Surname *
              </Label>
              <Input
                value={form.surname}
                onChange={(e) => setForm({ ...form, surname: e.target.value })}
                placeholder="Doe"
                className="h-9 text-xs"
              />
            </div>
            <div className="col-span-2">
              <Label className="text-[10px] text-neutral-400 font-bold uppercase">
                Email Address *
              </Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="johndoe@example.com"
                className="h-9 text-xs"
              />
            </div>
            <div className="col-span-2">
              <Label className="text-[10px] text-neutral-400 font-bold uppercase">
                Phone Number
              </Label>
              <Input
                type="tel"
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({ ...form, phoneNumber: e.target.value })
                }
                placeholder="+27 82 123 4567"
                className="h-9 text-xs"
              />
            </div>
            <div className="col-span-2">
              <Label className="text-[10px] text-neutral-400 font-bold uppercase">
                Physical Address
              </Label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="123 Financial District, Johannesburg"
                className="h-9 text-xs"
              />
            </div>
            <div>
              <Label className="text-[10px] text-neutral-400 font-bold uppercase">
                Principal (ZAR) *
              </Label>
              <Input
                type="number"
                step="0.01"
                value={form.principalAmount}
                onChange={(e) =>
                  setForm({ ...form, principalAmount: e.target.value })
                }
                placeholder="15000.50"
                className="h-9 text-xs"
              />
            </div>
            <div>
              <Label className="text-[10px] text-neutral-400 font-bold uppercase">
                Due Date *
              </Label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="h-9 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full text-xs h-9 bg-neutral-900 text-white"
              disabled={createLoanMutation.isPending}
            >
              {createLoanMutation.isPending
                ? "Processing Parameters..."
                : "Confirm Issue"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export function LoansTable({ isLoading, loans }: LoansTableProps) {
  const formatDate = (dateStr: string) =>
    dateStr ? dateStr.split("T")[0] : "-";

  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-neutral-50">
          <TableRow className="border-neutral-200">
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 h-10">
              Contract Ref
            </TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 h-10">
              Borrower Entity
            </TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 h-10 text-right">
              Principal
            </TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 h-10 text-center">
              Rate
            </TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 h-10 text-right">
              Total Owed
            </TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 h-10 text-center">
              Status
            </TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 h-10">
              Due Date
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <TableRow key={`skeleton-${idx}`} className="border-neutral-100">
                <TableCell>
                  <Skeleton className="h-4 w-12 bg-neutral-100" />
                </TableCell>
                <TableCell>
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28 bg-neutral-100" />
                    <Skeleton className="h-3 w-36 bg-neutral-100" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Skeleton className="h-4 w-20 bg-neutral-100" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-8 bg-neutral-100" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Skeleton className="h-4 w-20 bg-neutral-100" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Skeleton className="h-5 w-16 rounded-full bg-neutral-100" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20 bg-neutral-100" />
                </TableCell>
              </TableRow>
            ))
          ) : loans.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-10 text-xs text-neutral-400"
              >
                No records found matching query context.
              </TableCell>
            </TableRow>
          ) : (
            loans.map((loan) => (
              <TableRow
                key={loan.id}
                className="hover:bg-neutral-50/50 border-neutral-100 transition-colors"
              >
                <TableCell className="font-mono text-xs text-neutral-600">
                  #{loan.id}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-neutral-900 text-xs">
                      {loan.client?.FirstName} {loan.client?.lastName}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {loan.client?.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right text-xs font-medium text-neutral-900">
                  R{" "}
                  {loan.principalAmount?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell className="text-center text-xs text-neutral-600">
                  {loan.interestRate}%
                </TableCell>
                <TableCell className="text-right text-xs font-bold text-neutral-900">
                  R{" "}
                  {loan.totalAmountDue?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide",
                      loan.status === "Active" &&
                        "bg-blue-50 text-blue-700 border border-blue-100",
                      loan.status === "Overdue" &&
                        "bg-red-50 text-red-700 border border-red-100",
                      loan.status === "Paid" &&
                        "bg-emerald-50 text-emerald-700 border border-emerald-100",
                    )}
                  >
                    {loan.status}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-neutral-500 font-medium">
                  {formatDate(loan.dueDate)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export function FilterBar({
  search,
  setSearch,
  activeTab,
  setActiveTab,
  isLoading,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-100 pb-4">
      <div className="flex items-center gap-1 border border-neutral-200 rounded-md px-3 bg-white w-full sm:w-80 h-9">
        <Search size={14} className="text-neutral-400 shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by client or reference..."
          className="text-xs bg-transparent focus:outline-none w-full text-neutral-800"
          disabled={isLoading}
        />
      </div>
      <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-md border border-neutral-200/60 self-start sm:self-auto">
        {(["All", "Active", "Overdue", "Paid"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            disabled={isLoading}
            className={cn(
              "text-xs px-3 py-1.5 font-medium rounded-sm transition-all",
              activeTab === tab
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900",
              isLoading && "opacity-50 cursor-not-allowed",
            )}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MetricsGrid({
  isLoading,
  totalPortfolio,
  totalOverdue,
  collectedCapital,
}: MetricsGridProps) {
  const formatCurrency = (val: number) =>
    `R ${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Portfolio Card */}
      <Card className="shadow-sm border-neutral-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Total Portfolio Out
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-neutral-400" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-7 w-32 bg-neutral-200" />
          ) : (
            <div className="text-2xl font-bold text-neutral-900">
              {formatCurrency(totalPortfolio)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overdue Risk Card */}
      <Card className="shadow-sm border-neutral-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Overdue Risk Exposure
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-7 w-32 bg-neutral-200" />
          ) : (
            <div className="text-2xl font-bold text-amber-600">
              {formatCurrency(totalOverdue)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Collected Capital Card */}
      <Card className="shadow-sm border-neutral-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Collected Capital
          </CardTitle>
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-7 w-32 bg-neutral-200" />
          ) : (
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(collectedCapital)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function DashboardHeader({
  isRefetching,
  onExport,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl uppercase text-neutral-900">
            Loans Ledger
          </h1>
          {isRefetching && (
            <RefreshCw className="h-4 w-4 animate-spin text-neutral-400" />
          )}
        </div>
        <p className="text-neutral-500 text-xs mt-0.5">
          Issue capital, track repayment structures, and review automated
          default risks.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          onClick={onExport}
          className="border-neutral-200 text-neutral-600 text-xs rounded-md h-9 gap-1.5 hover:bg-neutral-50"
        >
          <FileSpreadsheet size={14} />
          <span>Export Report</span>
        </Button>

        <AutoIssueModal />
      </div>
    </div>
  );
}
