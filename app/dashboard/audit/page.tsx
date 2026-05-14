"use client";

import React, { useState } from "react";
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

// Lucide Icons
import {
  ShieldCheck,
  Activity,
  Key,
  Search,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

// Structured Interfaces matching our Backend Database Log contracts
interface ActivityLog {
  id: number;
  action: "CREATE" | "UPDATE" | "DELETE" | "SYSTEM_ESCALATION" | "AUTO_CREATE";
  entityName: string;
  entityId: string;
  oldValue: string;
  newValue: string;
  userId: string;
  timestamp: string;
}

interface LoginLog {
  id: number;
  userEmail: string;
  isSuccess: boolean;
  failureReason: string | null;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

// Mock Live Stream Data Array matching our SignalR Hub payloads
const MOCK_ACTIVITIES: ActivityLog[] = [
  {
    id: 9422,
    action: "SYSTEM_ESCALATION",
    entityName: "Loan",
    entityId: "1041",
    oldValue: "Active",
    newValue:
      "Loan ID: 1041 automatically escalated to OVERDUE status by system scheduler.",
    userId: "Chronos_Worker_Daemon",
    timestamp: "2026-05-14 00:00:12",
  },
  {
    id: 9421,
    action: "AUTO_CREATE",
    entityName: "Client",
    entityId: "34",
    oldValue: "None",
    newValue:
      "System auto-created client profile for Robert Mokoena (robert@mokoena.co.za) during auto-loan setup.",
    userId: "smith_officer@fastcash.com",
    timestamp: "2026-05-13 14:22:45",
  },
  {
    id: 9420,
    action: "UPDATE",
    entityName: "Organization",
    entityId: "1",
    oldValue: "DefaultInterestRate: 10.00%",
    newValue:
      "DefaultInterestRate updated to 12.50% by administrative override.",
    userId: "admin_tenant@fastcash.com",
    timestamp: "2026-05-13 09:15:22",
  },
];

const MOCK_LOGINS: LoginLog[] = [
  {
    id: 411,
    userEmail: "admin_tenant@fastcash.com",
    isSuccess: true,
    failureReason: null,
    ipAddress: "196.25.255.1",
    userAgent: "Chrome / Windows 11",
    timestamp: "2026-05-14 08:30:11",
  },
  {
    id: 410,
    userEmail: "intruder_attempt@unknown.org",
    isSuccess: false,
    failureReason:
      "Privilege escalation denied. Invalid cryptographic hash match.",
    ipAddress: "45.12.88.14",
    userAgent: "Unknown Script / Linux Engine",
    timestamp: "2026-05-13 23:44:02",
  },
];

export default function SecurityAuditPage() {
  const [activeStream, setActiveStream] = useState<"activities" | "logins">(
    "activities",
  );
  const [search, setSearch] = useState("");

  // FUNCTIONAL BUTTON: ClosedXML Download Simulator
  const handleDownloadAudit = () => {
    alert(
      `ClosedXML stream pipeline triggered. Document extracted: ${activeStream === "activities" ? "Activity_Audit_Trail" : "Login_Audit_Trail"}_20260514.xlsx`,
    );
  };

  // Memory filtering rules targeting emails, entities, or action properties
  const filteredActivities = MOCK_ACTIVITIES.filter((a) =>
    `${a.entityName} ${a.userId} ${a.action}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const filteredLogins = MOCK_LOGINS.filter((l) =>
    `${l.userEmail} ${l.ipAddress} ${l.failureReason || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8 transition-colors duration-200">
      {/* CONTROL TOP HEADING HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl uppercase text-neutral-900 dark:text-white">
            Security & Auditing
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">
            Review immutable system transactions, automated worker tasks, and
            access request tracking.
          </p>
        </div>

        {/* FUNCTIONAL ACTION EXCEL EXPORT BUTTON */}
        <Button
          variant="outline"
          onClick={handleDownloadAudit}
          className="border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs rounded-md h-9 gap-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 self-start sm:self-auto"
        >
          <FileSpreadsheet size={14} />
          <span>Export Selected Sheet</span>
        </Button>
      </div>

      {/* TWIN STREAM SELECTION SCORE CARDS */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* INTERACTIVE TOGGLE CARD 1: Activities */}
        <div
          onClick={() => {
            setActiveStream("activities");
            setSearch("");
          }}
          className={cn(
            "p-5 border cursor-pointer rounded-xl transition-all flex items-start gap-4 bg-white dark:bg-neutral-900",
            activeStream === "activities"
              ? "border-neutral-900 dark:border-white ring-1 ring-neutral-900 dark:ring-white"
              : "border-neutral-200 dark:border-neutral-800 opacity-60 hover:opacity-100",
          )}
        >
          <div className="p-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-md text-neutral-900 dark:text-white">
            <Activity size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-tight text-neutral-900 dark:text-white">
              Activity Audit Trail
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-mono">
              {MOCK_ACTIVITIES.length} Total tracked ledger records
            </p>
          </div>
        </div>

        {/* INTERACTIVE TOGGLE CARD 2: Logins */}
        <div
          onClick={() => {
            setActiveStream("logins");
            setSearch("");
          }}
          className={cn(
            "p-5 border cursor-pointer rounded-xl transition-all flex items-start gap-4 bg-white dark:bg-neutral-900",
            activeStream === "logins"
              ? "border-neutral-900 dark:border-white ring-1 ring-neutral-900 dark:ring-white"
              : "border-neutral-200 dark:border-neutral-800 opacity-60 hover:opacity-100",
          )}
        >
          <div className="p-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-md text-neutral-900 dark:text-white">
            <Key size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-tight text-neutral-900 dark:text-white">
              Access Firewall Logs
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-mono">
              {MOCK_LOGINS.length} Core verification events logged
            </p>
          </div>
        </div>
      </div>

      {/* FILTER CONTROL WRAPPER */}
      <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-neutral-50/50 dark:bg-neutral-950/50">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            {activeStream === "activities"
              ? "Ledger Changes Feed"
              : "Authentication Firewall Stream"}
          </p>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              type="text"
              placeholder={
                activeStream === "activities"
                  ? "Filter by action or user profile..."
                  : "Filter by email or connection IP..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 rounded-md h-9 text-xs focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
            />
          </div>
        </div>

        {/* CONDITIONALLY RENDERED AUDIT PANELS DATA TABLES */}
        {activeStream === "activities" ? (
          <Table>
            <TableHeader className="bg-neutral-50 dark:bg-neutral-950">
              <TableRow className="border-b border-neutral-100 dark:border-neutral-800">
                <TableHead className="w-[140px] text-xs uppercase text-neutral-400 dark:text-neutral-500">
                  Action Marker
                </TableHead>
                <TableHead className="w-[120px] text-xs uppercase text-neutral-400 dark:text-neutral-500">
                  Target Object
                </TableHead>
                <TableHead className="text-xs uppercase text-neutral-400 dark:text-neutral-500">
                  Descriptive Structural Delta Changes
                </TableHead>
                <TableHead className="w-[180px] text-xs uppercase text-neutral-400 dark:text-neutral-500">
                  Author
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.map((log) => (
                <TableRow
                  key={log.id}
                  className="border-b border-neutral-100 dark:border-neutral-800 text-xs font-sans"
                >
                  <td className="p-4 font-mono">
                    <span
                      className={cn(
                        "px-2 py-0.5 font-bold rounded text-[10px] uppercase border tracking-wide",
                        log.action === "SYSTEM_ESCALATION" &&
                          "bg-neutral-50 border-neutral-200 text-neutral-900 dark:bg-neutral-950",
                        log.action === "AUTO_CREATE" &&
                          "bg-neutral-900 border-neutral-950 text-white dark:bg-white dark:text-neutral-950",
                        log.action === "UPDATE" &&
                          "bg-neutral-50 border-neutral-200 text-neutral-600 dark:bg-neutral-950 dark:text-neutral-400",
                      )}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-neutral-800 dark:text-neutral-300">
                    {log.entityName} #{log.entityId}
                  </td>
                  <td className="p-4 text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    <div>{log.newValue}</div>
                    <div className="text-[10px] text-neutral-400 font-mono mt-1">
                      Previous Context baseline: {log.oldValue}
                    </div>
                  </td>
                  <td className="p-4 space-y-0.5 text-neutral-400 font-mono text-[11px]">
                    <div className="font-semibold text-neutral-700 dark:text-neutral-300">
                      {log.userId}
                    </div>
                    <div>{log.timestamp}</div>
                  </td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader className="bg-neutral-50 dark:bg-neutral-950">
              <TableRow className="border-b border-neutral-100 dark:border-neutral-800">
                <TableHead className="w-[100px] text-xs uppercase text-neutral-400 dark:text-neutral-500 text-center">
                  Status
                </TableHead>
                <TableHead className="text-xs uppercase text-neutral-400 dark:text-neutral-500">
                  Access ID (Email Target)
                </TableHead>
                <TableHead className="text-xs uppercase text-neutral-400 dark:text-neutral-500">
                  Diagnostic Details / Reasons
                </TableHead>
                <TableHead className="w-[200px] text-xs uppercase text-neutral-400 dark:text-neutral-500 font-mono">
                  Meta Metadata
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogins.map((login) => (
                <TableRow
                  key={login.id}
                  className="border-b border-neutral-100 dark:border-neutral-800 text-xs font-sans"
                >
                  <td className="p-4 text-center">
                    {login.isSuccess ? (
                      <CheckCircle className="mx-auto text-neutral-900 dark:text-white h-4 w-4" />
                    ) : (
                      <AlertCircle className="mx-auto text-neutral-400 h-4 w-4" />
                    )}
                  </td>
                  <td className="p-4 font-semibold text-neutral-800 dark:text-neutral-300">
                    {login.userEmail}
                  </td>
                  <td className="p-4 text-neutral-500 dark:text-neutral-400 leading-relaxed font-mono text-[11px]">
                    {login.isSuccess
                      ? "Session handshake verified cleanly. Token deployed."
                      : login.failureReason}
                  </td>
                  <td className="p-4 space-y-0.5 text-neutral-400 font-mono text-[10px]">
                    <div>IP: {login.ipAddress}</div>
                    <div className="truncate max-w-[180px]">
                      UA: {login.userAgent}
                    </div>
                    <div className="text-neutral-500">{login.timestamp}</div>
                  </td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
