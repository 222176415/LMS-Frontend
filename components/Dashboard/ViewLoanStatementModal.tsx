import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, FileText, CheckCircle2, AlertCircle, Clock } from "lucide-react";

export interface LoanRecord {
    id: number;
    principalAmount: number;
    interestRate: number;
    totalAmountDue: number;
    status: "Pending" | "Active" | "Overdue" | "Paid" | string;
    dueDate: string;
    client?: {
        id: number;
        firstName: string;
        surname: string;
        email: string;
        phoneNumber: string;
        address: string;
    };
}

interface ViewLoanStatementModalProps {
    loan: LoanRecord | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ViewLoanStatementModal({
                                           loan,
                                           isOpen,
                                           onClose,
                                       }: ViewLoanStatementModalProps) {
    if (!loan) return null;

    const handlePrint = () => {
        window.print();
    };

    const interestAmount = loan.totalAmountDue - loan.principalAmount;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-lg p-0 overflow-hidden border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-sans">
                {/* Header */}
                <DialogHeader className="p-6 pb-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300">
                                <FileText size={18} />
                            </div>
                            <div>
                                <DialogTitle className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-tight">
                                    Loan Statement
                                </DialogTitle>
                                <p className="text-[11px] text-neutral-500 font-mono">
                                    REF-ID: #{loan.id.toString().padStart(6, "0")}
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrint}
                            className="h-8 gap-1.5 text-xs text-neutral-600 border-neutral-200 dark:border-neutral-700"
                        >
                            <Printer size={13} />
                            Print
                        </Button>
                    </div>
                </DialogHeader>

                {/* Note Body */}
                <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
                    {/* Note Card Paper */}
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-5">
                        {/* Borrower & Status Header */}
                        <div className="flex justify-between items-start pb-4 border-b border-dashed border-neutral-200 dark:border-neutral-800">
                            <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Borrower Details
                </span>
                                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                                    {loan.client?.firstName} {loan.client?.surname}
                                </h4>
                                <p className="text-xs text-neutral-500 font-mono mt-0.5">
                                    {loan.client?.email}
                                </p>
                                <p className="text-xs text-neutral-500 font-mono">
                                    {loan.client?.phoneNumber}
                                </p>
                                <p className="text-xs text-neutral-500 mt-1">
                                    {loan.client?.address}
                                </p>
                            </div>

                            <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Account Status
                </span>
                                <span
                                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                        loan.status === "Active"
                                            ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400"
                                            : loan.status === "Paid"
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400"
                                                : loan.status === "Overdue"
                                                    ? "bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-400"
                                                    : "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400"
                                    }`}
                                >
                  {loan.status === "Paid" && <CheckCircle2 size={10} />}
                                    {loan.status === "Overdue" && <AlertCircle size={10} />}
                                    {loan.status === "Pending" && <Clock size={10} />}
                                    {loan.status}
                </span>
                            </div>
                        </div>

                        {/* Financial Ledger Breakdown */}
                        <div className="space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Financial Schedule
              </span>

                            <div className="space-y-1.5 text-xs font-mono">
                                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                                    <span>Principal Amount</span>
                                    <span>
                    R{" "}
                                        {loan.principalAmount?.toLocaleString("en-ZA", {
                                            minimumFractionDigits: 2,
                                        })}
                  </span>
                                </div>

                                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                                    <span>Interest Rate ({loan.interestRate}%)</span>
                                    <span>
                    + R{" "}
                                        {interestAmount.toLocaleString("en-ZA", {
                                            minimumFractionDigits: 2,
                                        })}
                  </span>
                                </div>

                                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex justify-between font-bold text-neutral-900 dark:text-white text-sm">
                                    <span>Total Due</span>
                                    <span>
                    R{" "}
                                        {loan.totalAmountDue?.toLocaleString("en-ZA", {
                                            minimumFractionDigits: 2,
                                        })}
                  </span>
                                </div>
                            </div>
                        </div>

                        {/* Dates Note Footer */}
                        <div className="pt-3 border-t border-dashed border-neutral-200 dark:border-neutral-800 grid grid-cols-2 gap-4 text-xs font-mono">
                            <div>
                <span className="text-[10px] text-neutral-400 uppercase font-sans font-bold block">
                  Maturity Due Date
                </span>
                                <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                  {loan.dueDate ? loan.dueDate.split("T")[0] : "-"}
                </span>
                            </div>
                            <div>
                <span className="text-[10px] text-neutral-400 uppercase font-sans font-bold block">
                  Client ID Reference
                </span>
                                <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                  CID-#{loan.client?.id || "N/A"}
                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}