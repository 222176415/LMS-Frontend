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
import DashboardLayout from "./layout";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
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
            {isLoading ? (
              <div className="space-y-2 py-0.5">
                <Skeleton variant="rectangular" className="h-7 w-28" />
                <Skeleton variant="text" className="w-40" />
              </div>
            ) : (
              <>
                <div className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  {dashboardData?.metrics?.activeDisbursed}
                </div>
                <p className="text-[9px] text-neutral-400 font-mono mt-0.5">
                  Active loan book principal value
                </p>
              </>
            )}
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
            {isLoading ? (
              <div className="space-y-2 py-0.5">
                <Skeleton variant="rectangular" className="h-7 w-24" />
                <Skeleton variant="text" className="w-36" />
              </div>
            ) : (
              <>
                <div className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  {dashboardData?.metrics?.overdueAtRisk}
                </div>
                <p className="text-[9px] text-neutral-400 font-mono mt-0.5">
                  Total active overdue balances
                </p>
              </>
            )}
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
            {isLoading ? (
              <div className="space-y-2 py-0.5">
                <Skeleton variant="rectangular" className="h-7 w-20" />
                <Skeleton variant="text" className="w-32" />
              </div>
            ) : (
              <>
                <div className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  {dashboardData?.metrics?.collectedInterest}
                </div>
                <p className="text-[9px] text-neutral-400 font-mono mt-0.5">
                  Returned profit ledger margin
                </p>
              </>
            )}
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
            {isLoading ? (
              <div className="space-y-2 py-0.5">
                <Skeleton variant="rectangular" className="h-7 w-16" />
                <Skeleton variant="text" className="w-44" />
              </div>
            ) : (
              <>
                <div className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  {dashboardData?.metrics?.pendingRequests}
                </div>
                <p className="text-[9px] text-neutral-400 font-mono mt-0.5">
                  Awaiting workspace onboarding approvals
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4">
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
            {isLoading ? (
              <div className="w-full h-full flex flex-col justify-between pl-4 pb-2">
                <div className="flex-1 flex items-end gap-4 border-b border-l border-neutral-100 dark:border-neutral-800/60 p-2 relative overflow-hidden">
                  {/* Subtle diagonal line wireframe simulating a placeholder graph trend */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-neutral-100/30 dark:via-neutral-800/20 to-transparent h-[2px] w-full top-1/2 rotate-12 transform scale-110 animate-pulse" />
                  <Skeleton
                    variant="rectangular"
                    className="h-[20%] w-full opacity-40"
                  />
                  <Skeleton
                    variant="rectangular"
                    className="h-[45%] w-full opacity-40"
                  />
                  <Skeleton
                    variant="rectangular"
                    className="h-[35%] w-full opacity-40"
                  />
                  <Skeleton
                    variant="rectangular"
                    className="h-[75%] w-full opacity-40"
                  />
                </div>
                <div className="flex justify-between mt-2 px-1">
                  <Skeleton variant="text" className="w-8" />
                  <Skeleton variant="text" className="w-8" />
                  <Skeleton variant="text" className="w-8" />
                  <Skeleton variant="text" className="w-8" />
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dashboardData?.trendData}
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
            )}
          </CardContent>
        </Card>
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
            {isLoading ? (
              <div className="w-full h-full flex flex-col items-center justify-center pt-2">
                {/* Minimalistic Ring Skeleton mimicking the Pie Chart */}
                <div className="relative flex items-center justify-center w-[190px] h-[190px]">
                  <Skeleton
                    variant="circular"
                    className="absolute w-[190px] h-[190px] opacity-40"
                  />
                  {/* Internal punchout to simulate an elegant donut ring structure */}
                  <div className="absolute w-[130px] h-[130px] rounded-full bg-white dark:bg-neutral-900 z-10" />
                </div>

                {/* Horizontal Legend Skeletons mapping the chart keys below */}
                <div className="flex gap-4 justify-center items-center mt-6 w-full px-4">
                  <div className="flex items-center gap-1.5">
                    <Skeleton
                      variant="rectangular"
                      className="h-2.5 w-2.5 rounded-sm"
                    />
                    <Skeleton variant="text" className="w-14 h-2.5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Skeleton
                      variant="rectangular"
                      className="h-2.5 w-2.5 rounded-sm"
                    />
                    <Skeleton variant="text" className="w-16 h-2.5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Skeleton
                      variant="rectangular"
                      className="h-2.5 w-2.5 rounded-sm"
                    />
                    <Skeleton variant="text" className="w-12 h-2.5" />
                  </div>
                </div>
              </div>
            ) : (
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
                    wrapperStyle={{
                      fontSize: "11px",
                      fontFamily: "sans-serif",
                    }}
                  />
                  <Pie
                    data={dashboardData?.riskData}
                    cx="50%"
                    cy="45%"
                    labelLine={false}
                    outerRadius={95}
                    dataKey="value"
                    stroke="var(--card)"
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
            )}
          </CardContent>
        </Card>
      </div>
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

            <CardContent className="p-4 flex-1 space-y-3 overflow-y-auto">
              {isLoading
                ? // Replicates the shape of exactly 3 operation rows perfectly
                  Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="border-b border-neutral-100 dark:border-neutral-800 pb-3 last:border-0 last:pb-0 space-y-2"
                    >
                      <div className="flex gap-2">
                        <Skeleton variant="rectangular" className="h-4 w-12" />
                        <Skeleton variant="rectangular" className="h-4 w-20" />
                      </div>
                      <Skeleton variant="text" className="w-[90%]" />
                      <div className="flex gap-4 w-1/2">
                        <Skeleton variant="text" className="h-2" />
                        <Skeleton variant="text" className="h-2" />
                      </div>
                    </div>
                  ))
                : dashboardData?.recentActivityLogs?.map((act) => (
                    <div
                      key={act.id}
                      className="flex justify-between items-start gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              act.action === "CREATE" ||
                              act.action === "ONBOARD"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                                : "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                            }`}
                          >
                            {act.action}
                          </span>
                          <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500">
                            {act.entityName} #{act.entityId}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-neutral-800 dark:text-neutral-300 leading-snug break-words mt-1">
                          {act.newValue || act.oldValue || "No changes logged."}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500 truncate max-w-[150px]">
                            {act.userId}
                          </span>
                          <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-medium">
                            •{" "}
                            {new Date(act.timestamp).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                              },
                            )}{" "}
                            {new Date(act.timestamp).toLocaleTimeString(
                              undefined,
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              },
                            )}
                          </span>
                        </div>
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
