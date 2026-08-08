"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
/*@ts-ignore*/
import { ActivityLog, UserLoginLog } from "@/hooks/useAuditHub";
import {Laptop, CheckCircle2, XCircle, Badge} from "lucide-react";

interface DataTablesProps {
    activities: ActivityLog[];
    logins: UserLoginLog[];
}

// Helper: Simplifies long User-Agent strings into recognizable browsers/OS
function parseUserAgent(uaString: string): string {
    if (!uaString) return "Unknown System";
    if (uaString.includes("Edg/")) return "Edge / Windows";
    if (uaString.includes("Chrome/")) return "Chrome / Windows";
    if (uaString.includes("Safari/") && uaString.includes("Macintosh")) return "Safari / macOS";
    if (uaString.includes("Firefox/")) return "Firefox";
    return uaString.split(" ")[0] || "Browser Client";
}

// Helper: Formats the ISO string safely into a localized date-time structure
function formatTimestamp(isoString: string): string {
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString("en-ZA", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    } catch {
        return isoString;
    }
}

export function AuditDataTables({ activities, logins }: DataTablesProps) {
    return (
        <div className="flex flex-col gap-6 xl:grid xl:grid-cols-12">

            {/* 🔴 SECTION A: STRUCTURAL MUTATION LEDGER (Takes 7/12 width) */}
            <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs xl:col-span-7 flex flex-col">
                <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                                Operational Ledger
                            </CardTitle>
                            <CardDescription className="text-[11px] mt-0.5">
                                Live transactional alterations mapped down across multi-tenant scopes.
                            </CardDescription>
                        </div>
               {/*         @ts-ignore*/}
                        <Badge variant="outline" className="font-mono text-[10px] uppercase bg-white dark:bg-neutral-950">
                            {activities.length} Cached Frames
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="p-0 overflow-x-auto max-h-[500px] overflow-y-auto">
                    <Table>
                        <TableHeader className="bg-neutral-50 dark:bg-neutral-950 sticky top-0 z-10 border-b border-neutral-100 dark:border-neutral-800">
                            <TableRow>
                                <TableHead className="text-[10px] uppercase font-bold text-neutral-400 w-[110px]">Action Matrix</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold text-neutral-400 w-[140px]">Target Model Entity</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold text-neutral-400">Context Delta Details</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold text-neutral-400 text-right w-[130px]">Recorded Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activities.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-xs text-neutral-400 font-mono py-12">
                                        No streaming delta operational packets registered on this gateway yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                activities.map((act) => {
                                    // Determine context colors based on action type
                                    const isCreate = act.action === "CREATE" || act.action === "ONBOARD";
                                    return (
                                        <TableRow key={act.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-950/40 transition-colors">
                                            {/* Action Type Badge */}
                                            <TableCell className="p-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-black font-mono tracking-wider ${
                            isCreate
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        }`}>
                          {act.action}
                        </span>
                                            </TableCell>

                                            {/* Target Model Context */}
                                            <TableCell className="p-3">
                                                <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-neutral-800 dark:text-neutral-200 text-xs">
                            {act.entityName}
                          </span>
                                                    <span className="text-[10px] font-mono text-neutral-400">
                            Identifier Ref: #{act.entityId}
                          </span>
                                                </div>
                                            </TableCell>

                                            {/* Delta Details Parser */}
                                            <TableCell className="p-3 max-w-[320px]">
                                                <div className="flex flex-col gap-1">
                          <span className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed break-words">
                            {act.newValue}
                          </span>
                                                    <span className="text-[10px] text-neutral-400 font-mono truncate block">
                            Operator: {act.userId}
                          </span>
                                                </div>
                                            </TableCell>

                                            {/* South African Local Timestamp */}
                                            <TableCell className="p-3 text-right text-neutral-500 dark:text-neutral-400 font-mono text-[11px] whitespace-nowrap">
                                                {formatTimestamp(act.timestamp)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* 🔵 SECTION B: AUTHENTICATION PERIMETER GUARD LOGS (Takes 5/12 width) */}
            <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs xl:col-span-5 flex flex-col">
                <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 pb-4">
                    <div>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                            Perimeter Access Logs
                        </CardTitle>
                        <CardDescription className="text-[11px] mt-0.5">
                            Live authorization requests verification map and source context indicators.
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="p-0 overflow-x-auto max-h-[500px] overflow-y-auto">
                    <Table>
                        <TableHeader className="bg-neutral-50 dark:bg-neutral-950 sticky top-0 z-10 border-b border-neutral-100 dark:border-neutral-800">
                            <TableRow>
                                <TableHead className="text-[10px] uppercase font-bold text-neutral-400">Operator Node Profile</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold text-neutral-400 w-[100px]">Status</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold text-neutral-400 text-right w-[110px]">Session Context</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logins.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-xs text-neutral-400 font-mono py-12">
                                        No recent perimeter gateway access sequences reported.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logins.map((log) => (
                                    <TableRow key={log.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-950/40 transition-colors">
                                        {/* User Operator Profile */}
                                        <TableCell className="p-3">
                                            <div className="flex flex-col gap-1 max-w-[200px]">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs truncate">
                          {log.userEmail}
                        </span>
                                                <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] font-mono">
                                                    <Laptop size={11} className="shrink-0" />
                                                    <span className="truncate">{parseUserAgent(log.userAgent)}</span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Status Result Indicator */}
                                        <TableCell className="p-3 vertical-align-middle">
                                            {log.isSuccess ? (
                                                <div className="inline-flex items-center gap-1 font-bold font-mono text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-sm">
                                                    <CheckCircle2 size={10} />
                                                    <span>PASS</span>
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1 font-bold font-mono text-[10px] text-red-600 dark:text-red-400 bg-red-500/10 px-2 py-0.5 rounded-sm">
                                                    <XCircle size={10} />
                                                    <span>{log.failureReason || "FAIL"}</span>
                                                </div>
                                            )}
                                        </TableCell>

                                        {/* IP & Relative Timestamp Context */}
                                        <TableCell className="p-3 text-right">
                                            <div className="flex flex-col gap-0.5 items-end">
                        <span className="font-mono text-[11px] text-neutral-800 dark:text-neutral-200">
                          {log.ipAddress === "::1" ? "127.0.0.1" : log.ipAddress}
                        </span>
                                                <span className="text-[10px] text-neutral-400 font-mono whitespace-nowrap">
                          {formatTimestamp(log.timestamp).split(",")[1]?.trim() || formatTimestamp(log.timestamp)}
                        </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    );
}