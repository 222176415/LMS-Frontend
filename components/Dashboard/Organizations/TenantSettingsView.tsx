"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Shadcn UI Elements
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Lucide Icons
import {
    Building2,
    Percent,
    Sliders,
    Check,
    RefreshCw,
    AlertCircle,
} from "lucide-react";

interface TenantSettingsProps {
    orgId: string;
    initialName: string;
}

export function TenantSettingsView({ orgId, initialName }: TenantSettingsProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Form Field Buffers
    const [name, setName] = useState(initialName || "");
    const [email, setEmail] = useState("");
    const [vat, setVat] = useState("15.00");
    const [interest, setInterest] = useState("12.50");

    // Keep state sync framework matching root changes
    useEffect(() => {
        if (initialName) {
            setName(initialName);
        }
    }, [initialName]);

    const handleUpdateConfig = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveSuccess(false);

        const parsedVat = parseFloat(vat);
        const parsedInterest = parseFloat(interest);

        if (!name || !email || isNaN(parsedVat) || isNaN(parsedInterest)) {
            alert("Configuration Error: All parameters must be present and numeric.");
            setIsSaving(false);
            return;
        }

        // Simulated transactional update pipeline delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        setIsSaving(false);
        setSaveSuccess(true);
    };

    useEffect(() => {
        if (saveSuccess) {
            const timer = setTimeout(() => setSaveSuccess(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [saveSuccess]);

    return (
        <div className="space-y-8 transition-colors duration-200 p-6">
            {/* HEADER SEGMENT */}
            <div>
                <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl uppercase text-neutral-900 dark:text-white">
                    Organization Configuration
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">
                    Manage entity footprints, branch profiles, and default tenant snapshots.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* LEFT COLUMN: Read-Only Overview */}
                <div className="lg:col-span-1 space-y-5">
                    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm">
                        <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md">
                                    <Building2 size={16} />
                                </div>
                                <div>
                                    <CardTitle className="text-xs font-bold uppercase tracking-wide">
                                        Live Workspace Node
                                    </CardTitle>
                                    <CardDescription className="text-[10px] font-mono">
                                        ID-PARTITION-00{orgId}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-5 space-y-4 text-xs">
                            <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Registered Title
                </span>
                                <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                                    {name || "Loading Instance..."}
                                </p>
                            </div>
                            <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Contact Gateway
                </span>
                                <p className="font-mono text-neutral-600 dark:text-neutral-400">
                                    {email || "Not specified yet"}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Active VAT
                  </span>
                                    <p className="text-base font-bold text-neutral-900 dark:text-white">
                                        {parseFloat(vat || "0").toFixed(2)}%
                                    </p>
                                </div>
                                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Base Yield Rate
                  </span>
                                    <p className="text-base font-bold text-neutral-900 dark:text-white">
                                        {parseFloat(interest || "0").toFixed(2)}%
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs flex gap-3">
                        <AlertCircle size={18} className="text-neutral-400 shrink-0 mt-0.5" />
                        <div className="space-y-1 text-neutral-500 dark:text-neutral-400 leading-relaxed">
              <span className="font-bold text-neutral-800 dark:text-neutral-200 block text-[11px] uppercase tracking-wide">
                Snapshot Rules Guard
              </span>
                            Modifying metrics will not mutate retroactively. Historical loan allocations retain initial calculation indices.
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Functional configuration editor form component */}
                <Card className="lg:col-span-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm overflow-hidden">
                    <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-sm font-bold uppercase tracking-tight">
                                Configuration Console
                            </CardTitle>
                            <CardDescription className="text-xs text-neutral-500">
                                Update parameters directly bound inside context domain environments.
                            </CardDescription>
                        </div>
                        <Sliders size={15} className="text-neutral-400" />
                    </CardHeader>

                    <form onSubmit={handleUpdateConfig}>
                        <CardContent className="p-6 space-y-5">
                            {saveSuccess && (
                                <div className="p-3 text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md flex items-center gap-2">
                                    <Check size={14} />
                                    <span>Tenant parameters re-cached and synchronized successfully.</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="org-name" className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                        Legal Entity Trading Name
                                    </Label>
                                    <Input
                                        id="org-name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-10 text-xs"
                                        disabled={isSaving}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="org-email" className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                        Corporate Ledger Email
                                    </Label>
                                    <Input
                                        id="org-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="operations@domain.co.za"
                                        className="h-10 text-xs"
                                        disabled={isSaving}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-1 text-neutral-400">
                                        <Percent size={11} />
                                        <Label htmlFor="org-vat" className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                            Regional VAT Threshold (%)
                                        </Label>
                                    </div>
                                    <Input
                                        id="org-vat"
                                        type="number"
                                        step="0.01"
                                        value={vat}
                                        onChange={(e) => setVat(e.target.value)}
                                        className="h-10 text-xs"
                                        disabled={isSaving}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-1 text-neutral-400">
                                        <Percent size={11} />
                                        <Label htmlFor="org-interest" className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                            Baseline Interest Rules Index (%)
                                        </Label>
                                    </div>
                                    <Input
                                        id="org-interest"
                                        type="number"
                                        step="0.01"
                                        value={interest}
                                        onChange={(e) => setInterest(e.target.value)}
                                        className="h-10 text-xs"
                                        disabled={isSaving}
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="p-4 bg-neutral-50 dark:bg-neutral-950/50 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                            <Button type="submit" disabled={isSaving} className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs h-10 px-6 font-medium gap-2">
                                {isSaving ? (
                                    <>
                                        <RefreshCw size={13} className="animate-spin" />
                                        <span>Updating Parameters...</span>
                                    </>
                                ) : (
                                    <span>Commit Workspace Parameter Shifts</span>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}