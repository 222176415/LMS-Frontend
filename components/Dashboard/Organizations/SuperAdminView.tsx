"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Building2, Mail, RefreshCw, Trash2, Edit } from "lucide-react";

// Hook matching your global directory data stream context perfectly
import { useOrganizationsDirectoryQuery } from "@/lib/api-hooks";

interface Organization {
    id: number;
    name: string;
    email: string;
    vatRate: number;
    defaultInterestRate: number;
}

export function SuperAdminView() {
    // Directly wiring into the verified target stream hook
    const { data: organizationsData, isLoading, isRefetching } = useOrganizationsDirectoryQuery();
    const backendOrgs: Organization[] = organizationsData || [];

    const [localOrgs, setLocalOrgs] = useState<Organization[]>([]);
    const [search, setSearch] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [vatRate, setVatRate] = useState("15");
    const [defaultInterestRate, setDefaultInterestRate] = useState("20");

    const combinedOrgs = [...localOrgs, ...backendOrgs];

    const handleCreateOrg = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) {
            alert("Validation Constraint: Structural profile configuration inputs required.");
            return;
        }

        const newOrg: Organization = {
            id: Date.now(),
            name,
            email,
            vatRate: parseFloat(vatRate) || 0,
            defaultInterestRate: parseFloat(defaultInterestRate) || 0,
        };

        setLocalOrgs([newOrg, ...localOrgs]);
        setIsDialogOpen(false);
        setName("");
        setEmail("");
    };

    const filteredOrgs = combinedOrgs.filter((o) =>
        `${o.name || ""} ${o.email || ""}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl uppercase text-neutral-900 dark:text-white">
                            System Ecosystem Core
                        </h1>
                        {isRefetching && <RefreshCw className="h-4 w-4 animate-spin text-neutral-400" />}
                    </div>
                    <p className="text-neutral-500 text-xs mt-0.5">
                        Root Tenant Management Zone. Provision workspace environments, allocate regional tax structures, and monitor instances.
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 text-xs h-9 gap-1.5 rounded-md">
                            <Plus size={14} />
                            <span>Provision Organization</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg">
                        <DialogHeader>
                            <DialogTitle className="text-base font-bold uppercase tracking-tight text-neutral-900 dark:text-white">
                               Onboard New Organization
                            </DialogTitle>
                            <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                             Create and Add New Organization
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateOrg} className="space-y-4 pt-2">
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Trading Name</Label>
                                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Egoli Capital Lenders" className="h-9 text-xs" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Administrative Email</Label>
                                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@egolicapital.co.za" className="h-9 text-xs" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">VAT Rate (%)</Label>
                                    <Input type="number" value={vatRate} onChange={(e) => setVatRate(e.target.value)} className="h-9 text-xs" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Base Interest (%)</Label>
                                    <Input type="number" step="0.1" value={defaultInterestRate} onChange={(e) => setDefaultInterestRate(e.target.value)} className="h-9 text-xs" />
                                </div>
                            </div>
                            <DialogFooter className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex gap-2">
                                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-xs h-9 text-neutral-500">Cancel</Button>
                                <Button type="submit" className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs h-9 font-medium">Add Organization</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total System Instances</CardTitle>
                        <Building2 className="h-4 w-4 text-neutral-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-neutral-900 dark:text-white">{combinedOrgs.length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-neutral-50/50 dark:bg-neutral-950/50">
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">System Partition Index</p>
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
                        <Input type="text" placeholder="Filter active instances..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-xs" />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-neutral-50 dark:bg-neutral-950">
                        <TableRow className="border-b border-neutral-100 dark:border-neutral-800">
                         
                            <TableHead className="text-xs uppercase text-neutral-400">Instance Name</TableHead>
                            <TableHead className="text-xs uppercase text-neutral-400">System Link</TableHead>
                            <TableHead className="text-xs uppercase text-neutral-400 text-right">Tax Matrix</TableHead>
                            <TableHead className="text-xs uppercase text-neutral-400 text-right">Yield Core</TableHead>
                            <TableHead className="w-[100px] text-xs uppercase text-neutral-400 text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, idx) => (
                                <TableRow key={idx}>
                                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-16 mx-auto rounded" /></TableCell>
                                </TableRow>
                            ))
                        ) : filteredOrgs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-xs text-neutral-400 py-10 font-mono">
                                    No organization clusters found matching query parameters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOrgs.map((org) => (
                                <TableRow key={org.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-950/50 transition-colors">
                              
                                    <TableCell className="p-4 font-semibold text-xs text-neutral-900 dark:text-white">{org.name}</TableCell>
                                    <TableCell className="p-4 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                                        <div className="flex items-center gap-1.5">
                                            <Mail size={11} className="text-neutral-400" /> <span>{org.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-4 text-xs font-medium text-right text-neutral-600 dark:text-neutral-400">{org.vatRate}% VAT</TableCell>
                                    <TableCell className="p-4 text-xs font-bold text-right text-neutral-900 dark:text-white">{org.defaultInterestRate}% APR</TableCell>
                                    <TableCell className="p-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-400 hover:text-neutral-900"><Edit size={12} /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-400 hover:text-red-600" disabled={org.id === 1}><Trash2 size={12} /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}