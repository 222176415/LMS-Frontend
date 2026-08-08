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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

// Lucide Icons
import {
  Search,
  Plus,
  Users,
  UserCheck,
  ShieldAlert,
  Mail,
  RefreshCw, Edit, Trash2,
} from "lucide-react";

// Using the correct hook matching your backend team data stream context
import { useStaffDirectoryQuery } from "@/lib/api-hooks";

interface StaffMember {
  id: number;
  fullName: string;
  email: string;
  roleId: number;
  roleName: string;
  isActive: boolean;
}

export default function StaffDirectoryPage() {
  // Fetch real team properties from backend
  const { data: stuffMembersData, isLoading, isRefetching } = useStaffDirectoryQuery();

  // Safely extract data array from backend response envelope
  const backendStaff: StaffMember[] = stuffMembersData|| [];

  const [localStaff, setLocalStaff] = useState<StaffMember[]>([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State parameters for Local Onboarding Fallbacks
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [roleName, setRoleName] = useState("LoanOfficer");

  // Combine remote dataset with local updates
  const combinedStaff = [...localStaff, ...backendStaff];

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email) {
      alert("Validation Constraint: Complete all requested identity properties.");
      return;
    }

    const emailTaken = combinedStaff.some(
        (s) => s.email.toLowerCase() === email.toLowerCase() && s.email !== ""
    );
    if (emailTaken) {
      alert(`Conflict: The email address '${email}' is already registered.`);
      return;
    }

    const newStaff: StaffMember = {
      id: Date.now(),
      fullName,
      email,
      roleId: roleName === "Admin" ? 1 : 2,
      roleName,
      isActive: true,
    };

    setLocalStaff([newStaff, ...localStaff]);
    setIsDialogOpen(false);

    // Reset parameters
    setFullName("");
    setEmail("");
  };

  // Filter evaluation checking text records
  const filteredStaff = combinedStaff.filter((s) => {
    const nameMatch = (s.fullName || "Unnamed Profile").toLowerCase().includes(search.toLowerCase());
    const emailMatch = (s.email || "").toLowerCase().includes(search.toLowerCase());
    const roleMatch = (s.roleName || "").toLowerCase().includes(search.toLowerCase());
    return nameMatch || emailMatch || roleMatch;
  });

  // Calculate high level metrics
  const totalStaffCount = combinedStaff.length;
  const activeStaffCount = combinedStaff.filter((s) => s.isActive).length;
  const adminStaffCount = combinedStaff.filter((s) => s.roleName === "Admin").length;

  return (
      <div className="space-y-8 transition-colors duration-200 p-6">
        {/* HEADER CONTROLS WINDOW */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl uppercase text-neutral-900 dark:text-white">
                Staff Directory
              </h1>
              {isRefetching && (
                  <RefreshCw className="h-4 w-4 animate-spin text-neutral-400" />
              )}
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">
              Manage system administrators, allocate lending desks, and review active operator permissions.
            </p>
          </div>

          {/* MODAL TRIGGER FOR ONBOARDING FORM */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs rounded-md h-9 gap-1.5 transition-all">
                <Plus size={14} />
                <span>Provision User Profile</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-base font-bold uppercase tracking-tight text-neutral-900 dark:text-white">
                  Create User Profile
                </DialogTitle>
                <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                  Provision access for an internal team member.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateStaff} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    Full Name
                  </Label>
                  <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Naledi Mabaso"
                      className="rounded-md border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    Email Address
                  </Label>
                  <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="n.mabaso@mzansicredit.co.za"
                      className="rounded-md border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    Role Assignment
                  </Label>
                  <select
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      className="w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 h-9 text-xs px-3 focus:outline-hidden"
                  >
                    <option value="LoanOfficer">LoanOfficer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <DialogFooter className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex gap-2">
                  <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsDialogOpen(false)}
                      className="rounded-md text-xs h-9 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    Cancel
                  </Button>
                  <Button
                      type="submit"
                      className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-md text-xs h-9 font-medium"
                  >
                    Confirm Assignment
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* THREE SCORE SUMMARY METRICS CARDS */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Total Personnel
              </CardTitle>
              <Users className="h-4 w-4 text-neutral-400" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                  <Skeleton className="h-8 w-16 bg-neutral-100 dark:bg-neutral-800" />
              ) : (
                  <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    {totalStaffCount}
                  </div>
              )}
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono mt-0.5">
                Active directory seats filled
              </p>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Active Operators
              </CardTitle>
              <UserCheck className="h-4 w-4 text-neutral-400" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                  <Skeleton className="h-8 w-16 bg-neutral-100 dark:bg-neutral-800" />
              ) : (
                  <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    {activeStaffCount}
                  </div>
              )}
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono mt-0.5">
                Profiles with live login permissions
              </p>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                System Admins
              </CardTitle>
              <ShieldAlert className="h-4 w-4 text-neutral-400" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                  <Skeleton className="h-8 w-16 bg-neutral-100 dark:bg-neutral-800" />
              ) : (
                  <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    {adminStaffCount}
                  </div>
              )}
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono mt-0.5">
                Full system policy management roles
              </p>
            </CardContent>
          </Card>
        </div>

        {/* SEARCH AND DIRECTORY LAYOUT GRID */}
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-neutral-50/50 dark:bg-neutral-950/50">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Internal Staff Roster
            </p>

            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
              <Input
                  type="text"
                  placeholder="Search by name, email, or role..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 rounded-md h-9 text-xs"
                  disabled={isLoading}
              />
            </div>
          </div>

          {/* PROFILE SHEET DATA LAYOUT TABLE */}
          <Table>
            <TableHeader className="bg-neutral-50 dark:bg-neutral-950">
              <TableRow className="border-b border-neutral-100 dark:border-neutral-800">

                <TableHead className="text-xs uppercase text-neutral-400 dark:text-neutral-500">
                  Staff Identity
                </TableHead>
                <TableHead className="text-xs uppercase text-neutral-400 dark:text-neutral-500">
                  Contact Details
                </TableHead>
                <TableHead className="w-[180px] text-xs uppercase text-neutral-400 dark:text-neutral-500 text-center">
                  Access Security Role
                </TableHead>
                <TableHead className="w-[100px] text-xs uppercase text-neutral-400 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                      <TableRow key={`skeleton-row-${idx}`} className="border-b border-neutral-100 dark:border-neutral-800">
                        <TableCell><Skeleton className="h-4 w-8 bg-neutral-100 dark:bg-neutral-800" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32 bg-neutral-100 dark:bg-neutral-800" /></TableCell>
                        <TableCell><Skeleton className="h-3 w-40 bg-neutral-100 dark:bg-neutral-800" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24 mx-auto rounded bg-neutral-100 dark:bg-neutral-800" /></TableCell>
                      </TableRow>
                  ))
              ) : filteredStaff.length === 0 ? (
                  <TableRow>
                    <TableCell
                        colSpan={4}
                        className="text-center text-xs text-neutral-400 dark:text-neutral-500 py-10 font-mono"
                    >
                      No system operators found matching query parameters.
                    </TableCell>
                  </TableRow>
              ) : (
                  filteredStaff.map((staff) => (
                      <TableRow
                          key={staff.id}
                          className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-950/50 transition-colors"
                      >

                        <TableCell className="p-4 font-semibold text-xs text-neutral-900 dark:text-white">
                          {staff.fullName || (
                              <span className="text-neutral-400 italic font-normal">Incomplete Registration</span>
                          )}
                        </TableCell>
                        <TableCell className="p-4 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                          {staff.email ? (
                              <div className="flex items-center gap-1.5">
                                <Mail size={11} className="text-neutral-400" /> <span>{staff.email}</span>
                              </div>
                          ) : (
                              <span className="text-neutral-400 italic font-normal">No email supplied</span>
                          )}
                        </TableCell>
                        <TableCell className="p-4 text-center">
                    <span
                        className={cn(
                            "inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide",
                            staff.roleName === "Admin"
                                ? "bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50"
                                : "bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50"
                        )}
                    >
                      {staff.roleName || "User"}
                    </span>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-400 hover:text-neutral-900"><Edit size={12} /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-400 hover:text-red-600"><Trash2 size={12} /></Button>
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