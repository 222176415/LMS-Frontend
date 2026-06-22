"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

// Shadcn UI Elements
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

// Lucide Icons
import {
  Activity,
  Key,
  Search,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Building2
} from "lucide-react";

// Updated interfaces to perfectly match your database schemas
interface ActivityLog {
  id: number;
  organizationId: number;
  userId: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "SYSTEM_ESCALATION" | "AUTO_CREATE";
  entityName: string;
  entityId: string;
  oldValue: string;
  newValue: string;
  timestamp: string;
}

interface UserLoginLog {
  id: number;
  userEmail: string;
  ipAddress: string;
  isSuccess: boolean; // mapped from 1/0 bit integers
  failureReason: string | null;
  timestamp: string;
  userAgent: string;
}

// Analytics Chart Mock Payload data
const CHART_DATA = [
  { time: "16:00", Logins: 12, SystemActions: 34 },
  { time: "17:00", Logins: 19, SystemActions: 45 },
  { time: "18:00", Logins: 8, SystemActions: 21 },
  { time: "19:00", Logins: 15, SystemActions: 56 },
  { time: "20:00", Logins: 28, SystemActions: 89 },
  { time: "21:00", Logins: 4, SystemActions: 12 },
];

// Live DB Match Array
const MOCK_ACTIVITIES: ActivityLog[] = [
  {
    id: 1,
    organizationId: 1,
    userId: "ntimanethemba27@gmail.com",
    action: "CREATE",
    entityName: "User",
    entityId: "2",
    oldValue: "",
    newValue: "User () created with RoleID: 1",
    timestamp: "2026-06-22 20:18:25.973",
  },
  {
    id: 2,
    organizationId: 1,
    userId: "system_daemon@fastcash.com",
    action: "SYSTEM_ESCALATION",
    entityName: "Loan",
    entityId: "849",
    oldValue: "Status: Pending",
    newValue: "Loan auto-flagged to HIGH_RISK due to delinquency parameters",
    timestamp: "2026-06-22 20:45:11.102",
  },
];

const MOCK_LOGINS: UserLoginLog[] = [
  {
    id: 1,
    userEmail: "thembantimane27@gmail.com",
    ipAddress: "::1",
    isSuccess: false,
    failureReason: "Invalid credentials",
    timestamp: "2026-06-22 20:10:50.809",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0",
  },
  {
    id: 2,
    userEmail: "admin_audit@fastcash.com",
    ipAddress: "192.168.10.45",
    isSuccess: true,
    failureReason: null,
    timestamp: "2026-06-22 20:15:30.112",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  },
];

export default function SecurityAuditPage() {
  const [activeStream, setActiveStream] = useState<"activities" | "logins">("activities");
  const [search, setSearch] = useState("");

  const handleDownloadAudit = () => {
    alert(`ClosedXML pipeline generated for context: ${activeStream}`);
  };

  const filteredActivities = MOCK_ACTIVITIES.filter((a) =>
      `${a.entityName} ${a.userId} ${a.action} ${a.newValue}`
          .toLowerCase()
          .includes(search.toLowerCase())
  );

  const filteredLogins = MOCK_LOGINS.filter((l) =>
      `${l.userEmail} ${l.ipAddress} ${l.failureReason || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
  );

  return (
      <div className="space-y-6  mx-auto bg-neutral-50/50 dark:bg-neutral-950 min-h-screen text-neutral-900 dark:text-neutral-50">

        {/* FINANCIAL AUDIT BRANDING TOP BAR */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 dark:border-neutral-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
              <ShieldCheck className="h-4 w-4" /> Consolidated Ledger Core
            </div>
            <h1 className="text-xl font-bold tracking-tight uppercase font-mono mt-1">
              System Auditing & Firewall
            </h1>
          </div>

          <Button
              variant="outline"
              onClick={handleDownloadAudit}
              className="border-neutral-300 dark:border-neutral-800 font-mono text-xs rounded-none h-9 gap-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-900 bg-white dark:bg-neutral-900"
          >
            <FileSpreadsheet size={14} className="text-emerald-600" />
            <span>EXPORT_LEDGER.XLSX</span>
          </Button>
        </div>

        {/* METRIC RIBBON BANNER */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "AUTHENTICATION_SUCCESS_RATE", value: "98.4%", desc: "Target benchmark > 95%" },
            { label: "SYSTEM_ESCALATIONS_24H", value: "02", desc: "Automated cron executions" },
            { label: "ACTIVE_TENANT_ID", value: "ORG-001", desc: "FastCash Core Operations" },
            { label: "FIREWALL_STATUS", value: "SECURE", desc: "No active packet anomalies" },
          ].map((stat, i) => (
              <div key={i} className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 font-mono">
                <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">{stat.label}</p>
                <p className="text-lg font-bold tracking-tight mt-1 text-neutral-800 dark:text-neutral-100">{stat.value}</p>
                <p className="text-[9px] text-neutral-500 mt-0.5">{stat.desc}</p>
              </div>
          ))}
        </div>

        {/* CHARTS LAYER SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 rounded-none border-neutral-200 dark:border-neutral-800 shadow-none bg-white dark:bg-neutral-900">
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-neutral-400" /> Volume Delta Trend Analytics
            </span>
            </div>
            <CardContent className="pt-6 h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CHART_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" className="hidden dark:block" />
                  <XAxis dataKey="time" stroke="#888888" fontSize={10} fontClassName="font-mono" />
                  <YAxis stroke="#888888" fontSize={10} fontClassName="font-mono" />
                  <Tooltip contentStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                  <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <Line type="monotone" dataKey="Logins" stroke="#10b981" strokeWidth={2} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="SystemActions" stroke="#6366f1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-none border-neutral-200 dark:border-neutral-800 shadow-none bg-white dark:bg-neutral-900">
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
              Metric Load Comparison
            </span>
            </div>
            <CardContent className="pt-6 h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="time" stroke="#888888" fontSize={10} />
                  <YAxis stroke="#888888" fontSize={10} />
                  <Tooltip contentStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                  <Bar dataKey="Logins" fill="#000000" className="dark:fill-white" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* TWIN STREAM SELECTION LOGS TOGGLE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
              onClick={() => { setActiveStream("activities"); setSearch(""); }}
              className={cn(
                  "p-4 border cursor-pointer font-mono transition-all flex items-center justify-between bg-white dark:bg-neutral-900",
                  activeStream === "activities"
                      ? "border-neutral-900 dark:border-neutral-100 border-l-4 border-l-indigo-600"
                      : "border-neutral-200 dark:border-neutral-800 opacity-60 hover:opacity-100",
              )}
          >
            <div className="flex items-center gap-3">
              <Activity size={16} className="text-indigo-600" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-tight">ActivityLogs Ledger</h3>
                <p className="text-[10px] text-neutral-400 mt-0.5">SYS_ENTITIES / REVISION_CONTROL</p>
              </div>
            </div>
            <span className="text-xs font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">{MOCK_ACTIVITIES.length}</span>
          </div>

          <div
              onClick={() => { setActiveStream("logins"); setSearch(""); }}
              className={cn(
                  "p-4 border cursor-pointer font-mono transition-all flex items-center justify-between bg-white dark:bg-neutral-900",
                  activeStream === "logins"
                      ? "border-neutral-900 dark:border-neutral-100 border-l-4 border-l-emerald-600"
                      : "border-neutral-200 dark:border-neutral-800 opacity-60 hover:opacity-100",
              )}
          >
            <div className="flex items-center gap-3">
              <Key size={16} className="text-emerald-600" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-tight">UserLoginLogs Stream</h3>
                <p className="text-[10px] text-neutral-400 mt-0.5">NET_GATEWAY / IDENTITY_RESOLVER</p>
              </div>
            </div>
            <span className="text-xs font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">{MOCK_LOGINS.length}</span>
          </div>
        </div>

        {/* FILTER CONTROL / CORE DATAGRID TERMINAL */}
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-none shadow-none overflow-hidden">
          <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-neutral-50/50 dark:bg-neutral-950/50 font-mono">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              {activeStream === "activities" ? "QUERY_EXECUTION: SELECT * FROM ActivityLogs" : "QUERY_EXECUTION: SELECT * FROM UserLoginLogs"}
            </p>

            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-400" />
              <Input
                  type="text"
                  placeholder="Search via pipeline parameters..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 rounded-none h-8 text-xs font-mono focus-visible:ring-1 focus-visible:ring-neutral-400"
              />
            </div>
          </div>

          {activeStream === "activities" ? (
              <Table>
                <TableHeader className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                  <TableRow className="hover:bg-transparent font-mono text-[11px]">
                    <TableHead className="w-[80px] uppercase text-neutral-400">Org ID</TableHead>
                    <TableHead className="w-[130px] uppercase text-neutral-400">Action Marker</TableHead>
                    <TableHead className="w-[140px] uppercase text-neutral-400">Target Entity</TableHead>
                    <TableHead className="uppercase text-neutral-400">Structural Transaction Data Summary</TableHead>
                    <TableHead className="w-[200px] uppercase text-neutral-400">Authorized Agent/Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="font-mono text-xs">
                  {filteredActivities.map((log) => (
                      <TableRow key={log.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-950/50">
                        <td className="p-3 text-neutral-400 font-bold">
                          <div className="flex items-center gap-1"><Building2 size={11}/> {log.organizationId}</div>
                        </td>
                        <td className="p-3">
                    <span className={cn(
                        "px-1.5 py-0.5 font-bold text-[10px] tracking-wide border",
                        log.action === "SYSTEM_ESCALATION" && "bg-amber-50 dark:bg-amber-950/30 border-amber-200 text-amber-700",
                        log.action === "CREATE" && "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-700",
                        log.action === "UPDATE" && "bg-blue-50 dark:bg-blue-950/30 border-blue-200 text-blue-700",
                    )}>
                      {log.action}
                    </span>
                        </td>
                        <td className="p-3 font-semibold text-neutral-700 dark:text-neutral-300">
                          {log.entityName} <span className="text-neutral-400">#{log.entityId}</span>
                        </td>
                        <td className="p-3 text-neutral-600 dark:text-neutral-400 max-w-sm">
                          <div className="font-sans font-medium text-neutral-900 dark:text-neutral-200">{log.newValue}</div>
                          {log.oldValue && (
                              <div className="text-[10px] text-neutral-400 mt-1 truncate">
                                Baseline Context: {log.oldValue}
                              </div>
                          )}
                        </td>
                        <td className="p-3 space-y-0.5 text-neutral-400 text-[11px]">
                          <div className="text-neutral-700 dark:text-neutral-300 truncate max-w-[190px]" title={log.userId}>{log.userId}</div>
                          <div className="text-[10px] font-sans text-neutral-400">{log.timestamp}</div>
                        </td>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
          ) : (
              <Table>
                <TableHeader className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                  <TableRow className="hover:bg-transparent font-mono text-[11px]">
                    <TableHead className="w-[80px] uppercase text-neutral-400 text-center">Status</TableHead>
                    <TableHead className="w-[220px] uppercase text-neutral-400">Access Identity</TableHead>
                    <TableHead className="uppercase text-neutral-400">Diagnostic Details / Exception Stack</TableHead>
                    <TableHead className="w-[220px] uppercase text-neutral-400">Network Meta Profile</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="font-mono text-xs">
                  {filteredLogins.map((login) => (
                      <TableRow key={login.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-950/50">
                        <td className="p-3 text-center">
                          {login.isSuccess ? (
                              <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1 font-bold text-[10px] bg-emerald-50 dark:bg-emerald-950/20 px-1 border border-emerald-200"><CheckCircle2 className="h-3 w-3" /> PASS</span>
                          ) : (
                              <span className="text-rose-600 dark:text-rose-400 inline-flex items-center gap-1 font-bold text-[10px] bg-rose-50 dark:bg-rose-950/20 px-1 border border-rose-200"><AlertTriangle className="h-3 w-3" /> FAIL</span>
                          )}
                        </td>
                        <td className="p-3 font-semibold text-neutral-800 dark:text-neutral-300 truncate max-w-[200px]" title={login.userEmail}>
                          {login.userEmail}
                        </td>
                        <td className={cn(
                            "p-3 text-[11px]",
                            login.isSuccess ? "text-neutral-400 font-sans" : "text-rose-600 dark:text-rose-400 font-bold"
                        )}>
                          {login.isSuccess ? "Session handshake verified cleanly. Auth token deployed." : login.failureReason}
                        </td>
                        <td className="p-3 space-y-0.5 text-neutral-400 text-[10px]">
                          <div>IP_ADDR: <span className="text-neutral-700 dark:text-neutral-300">{login.ipAddress}</span></div>
                          <div className="truncate max-w-[200px]" title={login.userAgent}>UA: {login.userAgent}</div>
                          <div className="font-sans text-neutral-500 mt-0.5">{login.timestamp}</div>
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