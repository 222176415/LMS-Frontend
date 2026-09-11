"use client";

import React from "react";
import {
    Sparkles,
    TrendingUp,
    AlertTriangle,
    Coins,
    Clock,
    Building2,
    ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface WelcomeBannerProps {
    userData: {
        name: string;
        role: string;
        orgName: string;
    };
    dashboardData?: {
        metrics?: {
            activeDisbursed?: string;
            overdueAtRisk?: string;
            collectedInterest?: string;
            pendingRequests?: string | number;
        };
    };
    isLoading?: boolean;
}

export function WelcomeBanner({
                                  userData,
                                  dashboardData,
                                  isLoading = false,
                              }: WelcomeBannerProps) {
    return (
        <div className="relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
        <div className="flex justify-between">
            <div>
                <div className="absolute -right-8 -top-8 h-32 w-32 p-40 rounded-full bg-neutral-100 dark:bg-neutral-800/50 opacity-50 pointer-events-none" />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    {/* Left Section: User Greeting & Badges */}
                    <div className="space-y-3 lg:max-w-xs xl:max-w-sm shrink-0">
                        <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
              <Sparkles size={12} className="text-amber-500" />
              Welcome back
            </span>

                            {userData.orgName && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                <Building2 size={11} className="text-neutral-400" />
                                    {userData.orgName}
              </span>
                            )}

                            {userData.role && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                <ShieldCheck size={11} className="text-neutral-400" />
                                    {userData.role}
              </span>
                            )}
                        </div>

                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl text-neutral-900 dark:text-white capitalize">
                                {userData.name ? userData.name : "Dashboard"}
                            </h1>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                                Operational control hub for managing active capital deployments,
                                monitoring risk states, and processing borrower servicing requests.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
            <div>
                <div className="bg-red-600 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 lg:flex-1 lg:max-w-3xl">
                    {/* KPI 1: Accumulated Capital */}
                    <Card className="border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-800/30 rounded-xl shadow-none p-3">
                        <CardHeader className="flex flex-row items-center justify-between p-0 pb-1.5 space-y-0">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                Accumulated Capital
                            </CardTitle>
                            <TrendingUp className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                        </CardHeader>
                        <CardContent className="p-0">
                            {isLoading ? (
                                <div className="space-y-1 py-0.5">
                                    <Skeleton className="h-6 w-24 bg-neutral-200 dark:bg-neutral-700" />
                                    <Skeleton className="h-3 w-32 bg-neutral-200 dark:bg-neutral-700" />
                                </div>
                            ) : (
                                <>
                                    <div className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                                        {dashboardData?.metrics?.activeDisbursed ?? "R 0.00"}
                                    </div>
                                    <p className="text-[9px] text-neutral-400 font-mono mt-0.5 truncate">
                                        Active loan book principal
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* KPI 2: Portfolio at Risk */}
                    <Card className="border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-800/30 rounded-xl shadow-none p-3">
                        <CardHeader className="flex flex-row items-center justify-between p-0 pb-1.5 space-y-0">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                Portfolio at Risk
                            </CardTitle>
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 animate-pulse shrink-0" />
                        </CardHeader>
                        <CardContent className="p-0">
                            {isLoading ? (
                                <div className="space-y-1 py-0.5">
                                    <Skeleton className="h-6 w-20 bg-neutral-200 dark:bg-neutral-700" />
                                    <Skeleton className="h-3 w-28 bg-neutral-200 dark:bg-neutral-700" />
                                </div>
                            ) : (
                                <>
                                    <div className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                                        {dashboardData?.metrics?.overdueAtRisk ?? "R 0.00"}
                                    </div>
                                    <p className="text-[9px] text-neutral-400 font-mono mt-0.5 truncate">
                                        Total active overdue balances
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* KPI 3: Interest Revenue */}
                    <Card className="border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-800/30 rounded-xl shadow-none p-3">
                        <CardHeader className="flex flex-row items-center justify-between p-0 pb-1.5 space-y-0">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                Interest Revenue
                            </CardTitle>
                            <Coins className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                        </CardHeader>
                        <CardContent className="p-0">
                            {isLoading ? (
                                <div className="space-y-1 py-0.5">
                                    <Skeleton className="h-6 w-16 bg-neutral-200 dark:bg-neutral-700" />
                                    <Skeleton className="h-3 w-24 bg-neutral-200 dark:bg-neutral-700" />
                                </div>
                            ) : (
                                <>
                                    <div className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                                        {dashboardData?.metrics?.collectedInterest ?? "R 0.00"}
                                    </div>
                                    <p className="text-[9px] text-neutral-400 font-mono mt-0.5 truncate">
                                        Returned profit margin
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* KPI 4: Inbound Requests */}
                    <Card className="border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-800/30 rounded-xl shadow-none p-3">
                        <CardHeader className="flex flex-row items-center justify-between p-0 pb-1.5 space-y-0">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                Inbound Requests
                            </CardTitle>
                            <Clock className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                        </CardHeader>
                        <CardContent className="p-0">
                            {isLoading ? (
                                <div className="space-y-1 py-0.5">
                                    <Skeleton className="h-6 w-12 bg-neutral-200 dark:bg-neutral-700" />
                                    <Skeleton className="h-3 w-28 bg-neutral-200 dark:bg-neutral-700" />
                                </div>
                            ) : (
                                <>
                                    <div className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                                        {dashboardData?.metrics?.pendingRequests ?? 0}
                                    </div>
                                    <p className="text-[9px] text-neutral-400 font-mono mt-0.5 truncate">
                                        Pending onboarding approvals
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
        
        </div>
    );
}