"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, Users, Ban, Radio, ShieldCheck } from "lucide-react";
import {TelemetryData} from "@/lib/useAuditHub";


interface KPICardsProps {
    telemetry: TelemetryData | null;
    isConnected: boolean;
    isGlobalAdmin?: boolean; // Optional flag if you want to explicitly pass org context from your auth layer
}

export function AuditKPICards({ telemetry, isConnected, isGlobalAdmin = false }: KPICardsProps) {
    const kpis = telemetry?.kpIs;
console.log("telementr",telemetry)
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* CARD 1: CONNECTOR STATUS GATEWAY */}
            <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Stream Node Link</CardTitle>
                    <Radio className={`h-4 w-4 ${isConnected ? "text-emerald-500 animate-pulse" : "text-neutral-300"}`} />
                </CardHeader>
                <CardContent>
                    <div className="text-xl font-black uppercase text-neutral-900 dark:text-white font-mono tracking-tight">
                        {isConnected ? "Connected" : "Disconnected"}
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-1 font-mono">
                        {isConnected ? "Active telemetry connection string running." : "Re-establishing backend socket link..."}
                    </p>
                </CardContent>
            </Card>

            {/* CARD 2: FAILED LOGIN INTENTIONS MATRIX */}
            <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Auth Failures Today</CardTitle>
                    <Ban className={`h-4 w-4 ${kpis && kpis.failedLoginsToday > 0 ? "text-red-500 animate-bounce" : "text-neutral-400"}`} />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-mono font-bold tracking-tight text-neutral-900 dark:text-white">
                        {kpis?.failedLoginsToday ?? 0}
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-1">
                        {isGlobalAdmin
                            ? "Rejected login attempts across all system tenants."
                            : "Failed authorization blocks within your organization."}
                    </p>
                </CardContent>
            </Card>

            {/* CARD 3: SECURITY CONTROLLER EXCEPTIONS */}
            <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Security Exceptions</CardTitle>
                    <ShieldAlert className={`h-4 w-4 ${kpis && kpis.activeSecurityAlerts > 0 ? "text-amber-500" : "text-neutral-400"}`} />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-mono font-bold tracking-tight text-neutral-900 dark:text-white">
                        {kpis?.activeSecurityAlerts ?? 0}
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-1">
                        Unsuccessful security actions or password adjustments flagged by backend interceptors.
                    </p>
                </CardContent>
            </Card>

            {/* CARD 4: ACTIVE DEPLOYED NODE OPERATOR SEATS */}
            <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Active Operators</CardTitle>
                    <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-mono font-bold tracking-tight text-neutral-900 dark:text-white">
                        {kpis?.activeUsersCount ?? 0}
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-1">
                        {isGlobalAdmin
                            ? "Total active user accounts configured across all clusters."
                            : "Active operators verified in your workspace node partition."}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}