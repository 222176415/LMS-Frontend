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

// Local Interfaces
interface ClientInfo {
  id: number;
  firstName: string;
  surname: string;
  email: string;
  phoneNumber: string;
  address: string;
}

interface Loan {
  id: number;
  principalAmount: number;
  interestRate: number;
  totalAmountDue: number;
  status: "Active" | "Overdue" | "Paid" | "Defaulted";
  dueDate: string;
  client: ClientInfo;
}

// Mock Database State for UI-Side Functional Testing Loop
const MOCK_LOANS: Loan[] = [
  {
    id: 1042,
    principalAmount: 5000.0,
    interestRate: 12.5,
    totalAmountDue: 5625.0,
    status: "Active",
    dueDate: "2026-06-15",
    client: {
      id: 1,
      firstName: "John",
      surname: "Mokoena",
      email: "john@mokoena.co.za",
      phoneNumber: "0821112233",
      address: "Johannesburg",
    },
  },
  {
    id: 1041,
    principalAmount: 2500.0,
    interestRate: 15.0,
    totalAmountDue: 2875.0,
    status: "Overdue",
    dueDate: "2026-05-01",
    client: {
      id: 2,
      firstName: "Sarah",
      surname: "Smith",
      email: "sarah@smith.com",
      phoneNumber: "0714445566",
      address: "Pretoria",
    },
  },
  {
    id: 1040,
    principalAmount: 12000.0,
    interestRate: 10.0,
    totalAmountDue: 13200.0,
    status: "Paid",
    dueDate: "2026-04-30",
    client: {
      id: 3,
      firstName: "David",
      surname: "Khumalo",
      email: "david@khumalo.org",
      phoneNumber: "0637778899",
      address: "Soweto",
    },
  },
];

export default function LoansLedgerPage() {
  const [loans, setLoans] = useState<Loan[]>(MOCK_LOANS);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<
    "All" | "Active" | "Overdue" | "Paid"
  >("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State for Auto-Issue Workflow Action Loop
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [principalAmount, setPrincipalAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  // FUNCTIONAL BUTTON: Excel Export Simulation
  const handleExportExcel = () => {
    alert(
      "Export sequence initialized using ClosedXML parsing guidelines. Generated file name: Loans_Report_20260512.xlsx",
    );
  };

  // FUNCTIONAL BUTTON: Dynamic Auto-Creation Form Execution Loop
  const handleAutoIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !surname || !email || !principalAmount || !dueDate) {
      alert(
        "Validation Error: All mandatory financial metrics must be present.",
      );
      return;
    }

    const newLoanId =
      loans.length > 0 ? Math.max(...loans.map((l) => l.id)) + 1 : 1001;
    const amount = parseFloat(principalAmount);

    // Simulating standard snapshotted 12% default rate for mock presentation logic
    const calculatedTotal = amount + amount * 0.12;

    const newLoan: Loan = {
      id: newLoanId,
      principalAmount: amount,
      interestRate: 12.0,
      totalAmountDue: calculatedTotal,
      status: "Active",
      dueDate: dueDate,
      client: {
        id: Date.now(),
        firstName,
        surname,
        email,
        phoneNumber,
        address,
      },
    };

    setLoans([newLoan, ...loans]);
    setIsDialogOpen(false);

    // Clear Input Streams
    setFirstName("");
    setSurname("");
    setEmail("");
    setPhoneNumber("");
    setAddress("");
    setPrincipalAmount("");
    setDueDate("");
  };

  // Status Filter Matrix Calculations
  const filteredLoans = loans.filter((l) => {
    const matchesSearch = `${l.client.firstName} ${l.client.surname} ${l.id}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesTab = activeTab === "All" || l.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalPortfolio = loans.reduce(
    (acc, curr) => acc + curr.principalAmount,
    0,
  );
  const totalOverdue = loans
    .filter((l) => l.status === "Overdue")
    .reduce((acc, curr) => acc + curr.totalAmountDue, 0);
  const collectedCapital = loans
    .filter((l) => l.status === "Paid")
    .reduce((acc, curr) => acc + curr.totalAmountDue, 0);

  return (
    <div className="space-y-8">
      {/* HEADER CONTROLS VIEWPORT */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl uppercase">
            Loans Ledger
          </h1>
          <p className="text-neutral-500 text-xs mt-0.5">
            Issue capital, track repayment structures, and review automated
            default risks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* FUNCTIONAL BUTTON: ClosedXML Engine Export Trigger */}
          <Button
            variant="outline"
            onClick={handleExportExcel}
            className="border-neutral-200 text-neutral-600 text-xs rounded-md h-9 gap-1.5 hover:bg-neutral-50"
          >
            <FileSpreadsheet size={14} />
            <span>Export Report</span>
          </Button>

          {/* DYNAMIC SHADCN FORM TRIGGER DIALOG DICTIONARY */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-neutral-900 text-white hover:bg-neutral-800 text-xs rounded-md h-9 gap-1.5">
                <Plus size={14} />
                <span>Auto-Issue Contract</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl border-neutral-200 bg-white rounded-xl shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-base font-bold uppercase tracking-tight">
                  Auto-Issue Capital Flow
                </DialogTitle>
                <DialogDescription className="text-xs text-neutral-500">
                  Enter borrower metrics. System runs automated scanning queries
                  to map existing client parameters before initializing
                  deployment logic.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAutoIssueSubmit} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      First Name
                    </Label>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="rounded-md border-neutral-200 h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Surname
                    </Label>
                    <Input
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      placeholder="Doe"
                      className="rounded-md border-neutral-200 h-9 text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Borrower Email
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@doe.com"
                    className="rounded-md border-neutral-200 h-9 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Principal Amount (ZAR)
                    </Label>
                    <Input
                      type="number"
                      value={principalAmount}
                      onChange={(e) => setPrincipalAmount(e.target.value)}
                      placeholder="5000"
                      className="rounded-md border-neutral-200 h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Repayment Due Date
                    </Label>
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="rounded-md border-neutral-200 h-9 text-xs"
                    />
                  </div>
                </div>
                <DialogFooter className="pt-4 border-t border-neutral-100 flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsDialogOpen(false)}
                    className="rounded-md text-xs h-9"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-md text-xs h-9"
                  >
                    Commit Transaction
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* THREE SCORE SUMMARY CARDS WITH EXPLICIT 0.55REM RADII */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Card className="border-neutral-200 bg-white rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Active Allocated Principal
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              R{" "}
              {totalPortfolio.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
              Active deployment book value
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 bg-white rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Overdue Portfolio Risk
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-neutral-500 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-neutral-900">
              R{" "}
              {totalOverdue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
              Requires immediate collections workflow
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 bg-white rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Settled Liquidity Revenue
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              R{" "}
              {collectedCapital.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
              Total capital returns + interest cleared
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CONTROL FILTERS BAR WORKSPACE ASSEMBLY */}
      <Card className="border-neutral-200 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-neutral-50/50">
          {/* TAB BUTTONS STATE DRIVEN INTERACTIVE */}
          <div className="flex items-center gap-1.5 bg-neutral-200/60 p-1 rounded-md max-w-max border border-neutral-200">
            {(["All", "Active", "Overdue", "Paid"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-sm transition-all",
                  activeTab === tab
                    ? "bg-white text-neutral-900"
                    : "text-neutral-500 hover:text-neutral-900",
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* LIVE SEARCH STREAM BAR CONTROL */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search by Loan ID or Client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white border-neutral-200 rounded-md h-9 text-xs"
            />
          </div>
        </div>

        {/* LEDGER DATA SHEETS ASSEMBLY TABLE RULES */}
        <Table>
          <TableHeader className="bg-neutral-50">
            <TableRow>
              <TableHead className="w-[80px] font-mono text-xs uppercase text-neutral-400">
                Loan ID
              </TableHead>
              <TableHead className="text-xs uppercase text-neutral-400">
                Client Profile
              </TableHead>
              <TableHead className="text-xs uppercase text-neutral-400">
                Principal
              </TableHead>
              <TableHead className="text-xs uppercase text-neutral-400">
                Gross Due
              </TableHead>
              <TableHead className="text-xs uppercase text-neutral-400">
                Target Due Date
              </TableHead>
              <TableHead className="w-[100px] text-xs uppercase text-neutral-400 text-center">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLoans.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-xs text-neutral-400 py-10 font-mono"
                >
                  No active loan contracts found matching this layout
                  configuration context parameters.
                </TableCell>
              </TableRow>
            ) : (
              filteredLoans.map((loan) => (
                <TableRow
                  key={loan.id}
                  className="hover:bg-neutral-50/50 transition-colors"
                >
                  <td className="font-mono font-bold text-xs p-4">
                    #{loan.id}
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-xs">
                      {loan.client.firstName} {loan.client.surname}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      {loan.client.email}
                    </div>
                  </td>
                  <td className="text-xs p-4">
                    R {loan.principalAmount.toFixed(2)}
                  </td>
                  <td className="text-xs font-semibold p-4">
                    R {loan.totalAmountDue.toFixed(2)}
                  </td>
                  <td className="text-xs p-4 font-mono">{loan.dueDate}</td>
                  <td className="p-4">
                    <div
                      className={cn(
                        "mx-auto w-20 px-2 py-0.5 text-[10px] font-bold text-center rounded border tracking-wide uppercase",
                        loan.status === "Active" &&
                          "bg-neutral-50 border-neutral-200 text-neutral-800",
                        loan.status === "Overdue" &&
                          "bg-neutral-50 border-neutral-200 text-neutral-900 line-through decoration-neutral-400",
                        loan.status === "Paid" &&
                          "bg-neutral-900 border-neutral-950 text-white",
                      )}
                    >
                      {loan.status}
                    </div>
                  </td>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
