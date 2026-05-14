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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Lucide Icons
import {
  Search,
  Plus,
  UserCheck,
  Shield,
  KeyRound,
  Mail,
  ToggleLeft,
  ToggleRight,
  FileSpreadsheet,
} from "lucide-react";

interface UserAccount {
  id: number;
  fullName: string;
  email: string;
  roleName: "Admin" | "LoanOfficer";
  isActive: boolean;
  dateJoined: string;
}

// Mock User Dataset matching your database seeder schema mapping
const MOCK_USERS: UserAccount[] = [
  {
    id: 1,
    fullName: "Thabo Ndlovu",
    email: "thabo_admin@fastcash.com",
    roleName: "Admin",
    isActive: true,
    dateJoined: "2026-01-15",
  },
  {
    id: 2,
    fullName: "Jane Smith",
    email: "jane_officer@fastcash.com",
    roleName: "LoanOfficer",
    isActive: true,
    dateJoined: "2026-02-10",
  },
  {
    id: 3,
    fullName: "Sipho Khumalo",
    email: "sipho_temp@fastcash.com",
    roleName: "LoanOfficer",
    isActive: false,
    dateJoined: "2026-04-01",
  },
];

export default function StaffDirectoryHubPage() {
  const [users, setUsers] = useState<UserAccount[]>(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form input state targets for introducing a new user context
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleName, setRoleName] = useState<"Admin" | "LoanOfficer">(
    "LoanOfficer",
  );

  // FUNCTIONAL BUTTON: Excel Export Simulator matching ClosedXML logic
  const handleExportStaffExcel = () => {
    alert(
      "Export execution fired. Staff directory formatted cleanly and compiled into: Staff_Export_20260514.xlsx",
    );
  };

  // FUNCTIONAL BUTTON: Submits parameters to append a user profile to memory arrays
  const handleOnboardUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      alert(
        "Validation Constraint Error: Complete all core identity data properties.",
      );
      return;
    }

    // Verify duplicate email records before allowing generation
    const emailConflict = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (emailConflict) {
      alert(
        `Conflict: Account email '${email}' is already registered to a staff profile.`,
      );
      return;
    }

    const newAccount: UserAccount = {
      id: users.length + 1,
      fullName,
      email,
      roleName,
      isActive: true,
      dateJoined: new Date().toISOString().split("T")[0],
    };

    setUsers([newAccount, ...users]);
    setIsDialogOpen(false);

    // Clear Input Stream Buffers
    setFullName("");
    setEmail("");
    setPassword("");
    setRoleName("LoanOfficer");
  };

  // FUNCTIONAL BUTTON: Toggles live login access privilege flags on the fly
  const handleToggleUserAccess = (id: number) => {
    setUsers(
      users.map((u) => {
        if (u.id === id) {
          const nextState = !u.isActive;
          return { ...u, isActive: nextState };
        }
        return u;
      }),
    );
  };

  // Live filter operations projecting text queries onto datasets
  const filteredUsers = users.filter((u) =>
    `${u.fullName} ${u.email} ${u.roleName}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const totalPersonnel = users.length;
  const activeAdmins = users.filter(
    (u) => u.roleName === "Admin" && u.isActive,
  ).length;
  const lockedAccounts = users.filter((u) => !u.isActive).length;

  return (
    <div className="space-y-8 transition-colors duration-200">
      {/* HEADER CONTROL SHEETS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl uppercase text-neutral-900 dark:text-white">
            Staff Directory
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">
            Provision workplace accounts, adjust access flags, and manage system
            operations boundaries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* FUNCTIONAL ACTION BUTTON 1: OpenXML Export */}
          <Button
            variant="outline"
            onClick={handleExportStaffExcel}
            className="border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs rounded-md h-9 gap-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            <FileSpreadsheet size={14} />
            <span>Export Roster</span>
          </Button>

          {/* FUNCTIONAL DIALOG ONBOARDING FORM MODAL */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs rounded-md h-9 gap-1.5">
                <Plus size={14} />
                <span>Onboard Personnel</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-base font-bold uppercase tracking-tight text-neutral-900 dark:text-white">
                  Onboard Staff Profile
                </DialogTitle>
                <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                  Register a new workforce team member account profile. System
                  automatically enforces BCrypt security password hashes.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={handleOnboardUserSubmit}
                className="space-y-4 pt-2"
              >
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    Full Operational Name
                  </Label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Thabo Khumalo"
                    className="rounded-md border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    Corporate Login Email
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="thabo@fastcash.com"
                    className="rounded-md border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    Temporary Password
                  </Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-md border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 h-9 text-xs"
                  />
                </div>

                {/* SELECT COMPONENT ROLE MAPPING */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    System Permission Role
                  </Label>
                  <Select
                    value={roleName}
                    onValueChange={(value: "Admin" | "LoanOfficer") =>
                      setRoleName(value)
                    }
                  >
                    <SelectTrigger className="w-full rounded-md border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 h-9 text-xs">
                      <SelectValue placeholder="Select functional role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-md">
                      <SelectItem value="LoanOfficer" className="text-xs">
                        Loan Officer (Standard Ops)
                      </SelectItem>
                      <SelectItem value="Admin" className="text-xs">
                        Tenant Admin (Full Control Over Org Settings)
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                    Provision System Profile
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* WORKFORCE COUNTER SCORE CARDS */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Total Operational Staff
            </CardTitle>
            <UserCheck className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {totalPersonnel}
            </div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono mt-0.5">
              Active personnel nodes within tenant
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Authorized Branch Admins
            </CardTitle>
            <Shield className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {activeAdmins}
            </div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono mt-0.5">
              Holds configuration modification keys
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Locked Accounts
            </CardTitle>
            <KeyRound className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {lockedAccounts}
            </div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono mt-0.5">
              Deactivated access profiles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FILTER CONTROL SHEETS BAR */}
      <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-neutral-50/50 dark:bg-neutral-950/50">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Personnel Directory Registry
          </p>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 rounded-md h-9 text-xs focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
            />
          </div>
        </div>

        {/* STAFF LIST TABLE CONTROL MAPS */}
        <Table>
          <TableHeader className="bg-neutral-50 dark:bg-neutral-950">
            <TableRow className="border-b border-neutral-100 dark:border-neutral-800">
              <TableHead className="w-[60px] font-mono text-xs uppercase text-neutral-400 dark:text-neutral-500">
                ID
              </TableHead>
              <TableHead className="text-xs uppercase text-neutral-400 dark:text-neutral-500">
                Full Profile Name
              </TableHead>
              <TableHead className="text-xs uppercase text-neutral-400 dark:text-neutral-500">
                System Email Alias
              </TableHead>
              <TableHead className="text-xs uppercase text-neutral-400 dark:text-neutral-500">
                Permission Role
              </TableHead>
              <TableHead className="w-[120px] text-xs uppercase text-neutral-400 dark:text-neutral-500 text-center">
                Login Access
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-xs text-neutral-400 dark:text-neutral-500 py-10 font-mono"
                >
                  No personnel records found matching current query parameters.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-950/50 transition-colors"
                >
                  <td className="font-mono font-bold text-xs p-4 text-neutral-400 dark:text-neutral-500">
                    #{user.id}
                  </td>
                  <td className="p-4 font-semibold text-xs text-neutral-900 dark:text-white">
                    {user.fullName}
                  </td>
                  <td className="p-4 text-xs font-mono text-neutral-600 dark:text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <Mail size={12} className="text-neutral-400" />{" "}
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded border tracking-wide text-[10px] font-bold uppercase",
                        user.roleName === "Admin"
                          ? "bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-300"
                          : "bg-neutral-100 dark:bg-neutral-800 border-transparent text-neutral-500",
                      )}
                    >
                      {user.roleName === "Admin"
                        ? "Tenant Administrator"
                        : "Loan Officer"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleUserAccess(user.id)}
                      className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-all focus:outline-none"
                      title={
                        user.isActive
                          ? "Deactivate employee console access"
                          : "Activate employee console access"
                      }
                    >
                      {user.isActive ? (
                        <ToggleRight className="h-6 w-6 text-neutral-900 dark:text-white" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-neutral-400" />
                      )}
                    </button>
                  </td>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
