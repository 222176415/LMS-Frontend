"use client";

import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Loan } from "@/lib/type";

interface LoansTableProps {
  isLoading: boolean;
  loans: Loan[];
  globalFilter: string;
  statusFilter: "All" | "Active" | "Overdue" | "Paid";
}

export function LoansTable({
  isLoading,
  loans,
  globalFilter,
  statusFilter,
}: LoansTableProps) {
  const columns = useMemo<ColumnDef<Loan>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Contract Ref",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-neutral-600">
            #{row.original.id}
          </span>
        ),
      },
      {
        id: "borrower",
        header: "Borrower Entity",
        // Custom search accessor targeting nested client identities simultaneously
        accessorFn: (row) => `${row.client?.firstName} ${row.client?.lastName}`,
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-semibold text-neutral-900 text-xs">
              {row.original.client?.firstName} {row.original.client?.lastName}
            </span>
            <span className="text-[10px] text-neutral-400">
              {row.original.client?.email}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "principalAmount",
        header: ({ column }) => (
          <div className="text-right">
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="inline-flex items-center gap-1 hover:text-neutral-900 text-[10px] font-bold uppercase tracking-wider text-neutral-400"
            >
              Principal <ArrowUpDown size={10} />
            </button>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right text-xs font-medium text-neutral-900">
            R{" "}
            {row.original.principalAmount?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </div>
        ),
      },
      {
        accessorKey: "interestRate",
        header: () => (
          <div className="text-center text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Rate
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center text-xs text-neutral-600">
            {row.original.interestRate}%
          </div>
        ),
      },
      {
        accessorKey: "totalAmountDue",
        header: () => (
          <div className="text-right text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Total Owed
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right text-xs font-bold text-neutral-900">
            R{" "}
            {row.original.totalAmountDue?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: () => (
          <div className="text-center text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Status
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <span
              className={cn(
                "inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide",
                row.original.status === "Active" &&
                  "bg-blue-50 text-blue-700 border border-blue-100",
                row.original.status === "Overdue" &&
                  "bg-red-50 text-red-700 border border-red-100",
                row.original.status === "Paid" &&
                  "bg-emerald-50 text-emerald-700 border border-emerald-100",
              )}
            >
              {row.original.status}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "dueDate",
        header: "Due Date",
        cell: ({ row }) => {
          const dateStr = row.original.dueDate;
          return (
            <span className="text-xs text-neutral-500 font-medium">
              {dateStr ? dateStr.split("T")[0] : "-"}
            </span>
          );
        },
      },
    ],
    [],
  );

  // 2. Pre-filter your loan ledger array by selected Tab State before passing data down to the model instance
  const computedData = useMemo(() => {
    if (statusFilter === "All") return loans;
    return loans.filter((loan) => loan.status === statusFilter);
  }, [loans, statusFilter]);

  // 3. Operationalize TanStack Table Engine Instantiation Hooks
  const table = useReactTable({
    data: computedData,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-neutral-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-neutral-200">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="h-10 text-neutral-500 p-3"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
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
          ) : table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-10 text-xs text-neutral-400"
              >
                No records found matching query context.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-neutral-50/50 border-neutral-100 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="p-3 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
