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
import {
  CheckCircle,
  CreditCard,
  Edit,
  Eye,
  FileSpreadsheet,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Trash2, XCircle
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {Loan, FilterBarProps, DashboardHeaderProps, MetricsGridProps, LoansTableProps} from "@/lib/type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { NotificationCenter, Toast } from "../ui/Notification";


export function AutoIssueModal() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [form, setForm] = useState({
    firstName: "",
    surname: "",
    email: "",
    phoneNumber: "",
    address: "",
    principalAmount: "",
    dueDate: "",
  });
  const showToast = (type: "success" | "error", message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  const createLoanMutation = useMutation({
    mutationFn: async (payload: any) => {
      return await apiClient.post("/loans", payload);
    },
    onSuccess: (response: any) => {
      if (response && response.success === false) {
        showToast(
          "error",
          response.message || "Runtime configuration mismatch.",
        );
        return;
      }

      showToast(
        "success",
        "Loan ledger record provisions initialized successfully!",
      );
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
    onError: (err: any) => {
      console.log(err, "error");
      showToast(
        "error",
        err?.message || "Internal transmission layer interface failure.",
      );
    },
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
      <NotificationCenter notifications={toasts} onDismiss={removeToast} />
      <DialogTrigger asChild>
        <Button className="bg-neutral-900 text-white text-xs rounded-md h-9 gap-1.5">
          <Plus size={14} />
          <span>New Loan Application</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl bg-white rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-bold uppercase">
          New Loan 
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-500">
           Record new loan
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
                ? "Processing ..."
                : "Add loan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export function LoansTable({
                             isLoading,
                             loans,
                             globalFilter,
                             statusFilter,
                             currentUserOrgId,
                             onAction
                           }: LoansTableProps) {

  const formatDate = (dateStr: string) => dateStr ? dateStr.split("T")[0] : "-";

  const filteredLoans = loans.filter((loan) => {
    const fullName = `${loan.client?.firstName || ""} ${loan.client?.surname || ""}`.toLowerCase();
    const matchesSearch =
        fullName.includes(globalFilter.toLowerCase()) ||
        loan.id.toString().includes(globalFilter) ||
        (loan.client?.email || "").toLowerCase().includes(globalFilter.toLowerCase());

    const matchesTab = statusFilter === "All" || loan.status === statusFilter;
    return matchesSearch && matchesTab;
  });

  return (
      <TooltipProvider delayDuration={200}>
        <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-neutral-50 dark:bg-neutral-950">
              <TableRow className="border-neutral-200 dark:border-neutral-800">
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 h-10">Borrower Entity</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 h-10 text-right">Principal</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 h-10 text-center">Rate</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 h-10 text-right">Total Owed</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 h-10 text-center">Status</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 h-10">Due Date</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 h-10 text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                      <TableRow key={`skeleton-${idx}`} className="border-neutral-100 dark:border-neutral-800">
                        <TableCell><div className="space-y-1.5"><Skeleton className="h-4 w-28" /><Skeleton className="h-3 w-36" /></div></TableCell>
                        <TableCell><div className="flex justify-end"><Skeleton className="h-4 w-20" /></div></TableCell>
                        <TableCell><div className="flex justify-center"><Skeleton className="h-4 w-8" /></div></TableCell>
                        <TableCell><div className="flex justify-end"><Skeleton className="h-4 w-20" /></div></TableCell>
                        <TableCell><div className="flex justify-center"><Skeleton className="h-5 w-16 rounded-full" /></div></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell />
                      </TableRow>
                  ))
              ) : filteredLoans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-xs text-neutral-400 font-mono">
                      No records found matching query context.
                    </TableCell>
                  </TableRow>
              ) : (
                  filteredLoans.map((loan) => (
                      <TableRow key={loan.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-950/40 border-neutral-100 dark:border-neutral-800 transition-colors">
                        <TableCell>
                          <div className="flex flex-col">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
                        {loan.client?.firstName} {loan.client?.surname}
                      </span>
                            <span className="text-[10px] text-neutral-400 font-mono">#{loan.id} • {loan.client?.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-xs font-medium text-neutral-900 dark:text-neutral-100">
                          R {loan.principalAmount?.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-center text-xs text-neutral-600 dark:text-neutral-400 font-mono">{loan.interestRate}%</TableCell>
                        <TableCell className="text-right text-xs font-bold text-neutral-900 dark:text-neutral-100">
                          R {loan.totalAmountDue?.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-center">
                    <span className={cn(
                        "inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                        loan.status === "Pending" && "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
                        loan.status === "Active" && "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
                        loan.status === "Overdue" && "bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
                        loan.status === "Paid" && "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                    )}>
                      {loan.status}
                    </span>
                        </TableCell>
                        <TableCell className="text-xs text-neutral-500 dark:text-neutral-400 font-medium font-mono">{formatDate(loan.dueDate)}</TableCell>

                        {/* 🛠️ UPGRADED ACTIONS MATRIX COLUMN */}
                        <TableCell className="text-right pr-6">
                          <DropdownMenu>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                              </TooltipTrigger>
                              <TooltipContent  side="left" className="text-[11px] font-medium bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
                                Open workflow action desk for Loan #{loan.id}
                              </TooltipContent>
                            </Tooltip>

                            <DropdownMenuContent align="end" className="w-52 text-xs border-neutral-200 dark:border-neutral-800">
                              <DropdownMenuLabel className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">Servicing Suite</DropdownMenuLabel>

                              <DropdownMenuItem onClick={() => onAction("VIEW", loan)} className="gap-2 cursor-pointer">
                                <Eye size={13} className="text-neutral-400" /> View Statement
                              </DropdownMenuItem>

                              {/* WORKFLOW PHASE A: PENDING APPLICATIONS */}
                              {loan.status === "Pending" && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => onAction("APPROVE", loan)} className="gap-2 cursor-pointer text-emerald-600 dark:text-emerald-400 focus:text-emerald-700">
                                      <CheckCircle size={13} /> Approve Underwriting
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onAction("DECLINE", loan)} className="gap-2 cursor-pointer text-red-600 dark:text-red-400 focus:text-red-700">
                                      <XCircle size={13} /> Decline Application
                                    </DropdownMenuItem>
                                  </>
                              )}

                              {/* WORKFLOW PHASE B: CASHFLOW PROCESSING (ACTIVE / OVERDUE) */}
                              {(loan.status === "Active" || loan.status === "Overdue") && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => onAction("PAYMENT", loan)} className="gap-2 cursor-pointer font-semibold text-blue-600 dark:text-blue-400 focus:text-blue-700">
                                      <CreditCard size={13} /> Collect Payment
                                    </DropdownMenuItem>
                                  </>
                              )}

                              {/* MANAGEMENT CRITICAL PATH */}
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">System Parameters</DropdownMenuLabel>

                              <DropdownMenuItem onClick={() => onAction("EDIT", loan)} className="gap-2 cursor-pointer">
                                <Edit size={13} className="text-neutral-400" /> Alter Structural Terms
                              </DropdownMenuItem>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div> {/* Wrapper div ensures disabled button state still catches events for tooltips to render */}
                                    <DropdownMenuItem
                                        onClick={() => onAction("DELETE", loan)}
                                        disabled={currentUserOrgId === 1}
                                        className="gap-2 cursor-pointer text-neutral-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                      <Trash2 size={13} /> Drop From Ledger
                                    </DropdownMenuItem>
                                  </div>
                                </TooltipTrigger>
                                {currentUserOrgId === 1 && (
                                    <TooltipContent  side="left" className="text-[10px] max-w-[180px] leading-relaxed bg-red-950 text-red-200 border-red-900 font-mono">
                                      Perimeter Lockdown: Data deletions cannot be committed from global management nodes (Org 1).
                                    </TooltipContent>
                                )}
                              </Tooltip>

                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>
      </TooltipProvider>
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
  // Configured with standard South African formatting localization rules
  const formatCurrency = (val: number) =>
      `R ${val.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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
                <div className="text-2xl font-bold text-neutral-900 dark:text-white">
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
                <div className="text-2xl font-bold text-neutral-900 dark:text-white">
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
                <div className="text-2xl font-bold text-neutral-900 dark:text-white">
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
