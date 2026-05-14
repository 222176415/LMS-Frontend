"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Shadcn UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Lucide Icons
import {
  TrendingUp,
  AlertTriangle,
  Coins,
  ArrowRight,
  UserPlus,
  FileText,
  ShieldAlert,
  Clock,
} from "lucide-react";
import { useDashboardSummaryQuery } from "@/lib/api-hooks";

// Mock Visual Datasets
const REVENUE_TREND_DATA = [
  { month: "Jan", capitalIssued: 45000, revenueCollected: 12000 },
  { month: "Feb", capitalIssued: 85000, revenueCollected: 19000 },
  { month: "Mar", capitalIssued: 120000, revenueCollected: 24000 },
  { month: "Apr", capitalIssued: 190000, revenueCollected: 29000 },
  { month: "May", capitalIssued: 248500, revenueCollected: 32890 },
];

const RISK_PORTFOLIO_DATA = [
  { name: "Active Book", value: 248500 },
  { name: "Overdue Risk", value: 14250 },
  { name: "Defaulted", value: 8900 },
];
export default function CoreDashboardIndex() {
  const {
    data: dashboardData,
    isLoading,
    isRefetching,
  } = useDashboardSummaryQuery();
  console.log("dashboardData", dashboardData);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const summaryMetrics = {
    activeDisbursed: "R 248,500.00",
    overdueAtRisk: "R 14,250.00",
    collectedInterest: "R 32,890.00",
    pendingRequests: 3,
  };

  const recentActivities = [
    {
      id: 1,
      type: "escalation",
      message: "Loan #1041 auto-escalated to OVERDUE status",
      time: "12 mins ago",
    },
    {
      id: 2,
      type: "payment",
      message: "Received partial repayment of R 4,500.00 on Loan #1042",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "client",
      message: "System auto-created client profile for R. Mokoena",
      time: "2 hours ago",
    },
  ];

  // Monochromatic shading rules mapped clearly for theme consistency
  const COLORS =
    mounted && resolvedTheme === "dark"
      ? ["#fafafa", "#a3a3a3", "#404040"] // Dark mode accents
      : ["#171717", "#737373", "#e5e5e5"]; // Light mode accents

  return (
    <div className="space-y-8 transition-colors duration-200">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl uppercase text-neutral-900 dark:text-white">
          Workspace Overview
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-xs">
          Operational control hub for managing active capital deployments,
          monitoring risk states, and processing borrower servicing requests.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Accumulated Capital
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {summaryMetrics.activeDisbursed}
            </div>
            <p className="text-[9px] text-neutral-400 font-mono mt-0.5">
              Active loan book principal value
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Portfolio at Risk
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-neutral-400 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {summaryMetrics.overdueAtRisk}
            </div>
            <p className="text-[9px] text-neutral-400 font-mono mt-0.5">
              Total active overdue balances
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Interest Revenue
            </CardTitle>
            <Coins className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {summaryMetrics.collectedInterest}
            </div>
            <p className="text-[9px] text-neutral-400 font-mono mt-0.5">
              Returned profit ledger margin
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Inbound Requests
            </CardTitle>
            <Clock className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {summaryMetrics.pendingRequests}
            </div>
            <p className="text-[9px] text-neutral-400 font-mono mt-0.5">
              Awaiting workspace onboarding approvals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. GRAPHICAL RENDERING LAYOUT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4">
        {/* GRAPH 1: LINE CHART */}
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-4">
          <CardHeader className="p-2 pb-6">
            <CardTitle className="text-xs font-bold uppercase tracking-wide text-neutral-900 dark:text-white">
              Capital Ledger Deployment & Return Growth
            </CardTitle>
            <CardDescription className="text-[11px] text-neutral-400">
              Monthly breakdown mapping total disbursed capital vs revenue
              collected.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={REVENUE_TREND_DATA}
                margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-neutral-100 dark:stroke-neutral-800"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  className="text-[10px] font-mono fill-neutral-400"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  className="text-[10px] font-mono fill-neutral-400"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "0.55rem",
                  }}
                  labelStyle={{
                    fontSize: "11px",
                    fontWeight: "bold",
                    fontFamily: "monospace",
                  }}
                  itemStyle={{ fontSize: "11px", color: "var(--foreground)" }}
                />
                <Line
                  type="monotone"
                  dataKey="capitalIssued"
                  name="Disbursed"
                  stroke="currentColor"
                  className="text-neutral-900 dark:text-neutral-50"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenueCollected"
                  name="Revenue"
                  stroke="currentColor"
                  className="text-neutral-400 dark:text-neutral-500"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* GRAPH 2: COMPACT PIE CHART WITH ZERO HOLE GAPS */}
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-4">
          <CardHeader className="p-2 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wide text-neutral-900 dark:text-white">
              Lending Book Risk Projections
            </CardTitle>
            <CardDescription className="text-[11px] text-neutral-400">
              Financial exposure analysis mapped out across asset tracking
              profiles.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 flex justify-center items-center p-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Tooltip
                  formatter={(value: number) => `R ${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "0.55rem",
                  }}
                  itemStyle={{ fontSize: "11px", color: "var(--foreground)" }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconSize={10}
                  iconType="square"
                  wrapperStyle={{ fontSize: "11px", fontFamily: "sans-serif" }}
                />
                <Pie
                  data={RISK_PORTFOLIO_DATA}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  outerRadius={95} // Snug layout boundary spacing lock [1]
                  dataKey="value"
                  stroke="var(--card)" // Integrates natively with active light/dark canvas backgrounds [2]
                  strokeWidth={2}
                >
                  {RISK_PORTFOLIO_DATA.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 4. SHORTCUT HUB & AUDIT STREAM TICKER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            Operational Shortcuts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/dashboard/loans" className="group">
              <div className="p-5 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl hover:border-neutral-400 dark:hover:border-neutral-600 transition-all flex justify-between items-center h-28">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-neutral-900 dark:text-white">
                    <FileText size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Deploy Capital
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-normal max-w-[200px]">
                    Access the loan ledger to auto-issue contracts or record
                    borrower payments.
                  </p>
                </div>
                <ArrowRight
                  size={14}
                  className="text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors transform group-hover:translate-x-1"
                />
              </div>
            </Link>

            <Link href="/dashboard/clients" className="group">
              <div className="p-5 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl hover:border-neutral-400 dark:hover:border-neutral-600 transition-all flex justify-between items-center h-28">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-neutral-900 dark:text-white">
                    <UserPlus size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Borrowers Directory
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-normal max-w-[200px]">
                    Profile new micro-lending candidates and audit historical
                    debt profiles.
                  </p>
                </div>
                <ArrowRight
                  size={14}
                  className="text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors transform group-hover:translate-x-1"
                />
              </div>
            </Link>
          </div>

          <div className="p-5 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-tight text-neutral-900 dark:text-white">
              System Status: Active & Compliant
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Your data shard is performing optimally. Global queries are
              completely restricted to your isolated corporate account,
              preventing information leakage. All daily interest percentage
              snapshotting features are operational.
            </p>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            Live Audit Stream
          </h2>

          <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm h-[296px] flex flex-col justify-between overflow-hidden">
            <CardHeader className="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50">
              <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
                <ShieldAlert size={14} className="text-neutral-400" />
                <span className="text-xs font-bold uppercase tracking-wide">
                  Recent Operations
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-4 flex-1 space-y-4 overflow-y-auto">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex justify-between items-start gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-3 last:border-0 last:pb-0"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-neutral-800 dark:text-neutral-300 leading-tight">
                      {act.message}
                    </p>
                    <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500">
                      {act.time}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>

            <CardFooter className="p-3 bg-neutral-50 dark:bg-neutral-950/50 border-t border-neutral-100 dark:border-neutral-800">
              <Link href="/dashboard/audit" className="w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white font-semibold transition-all"
                >
                  Open Complete Compliance Logs →
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
