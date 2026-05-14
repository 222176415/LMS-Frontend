"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
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

// Lucide Icons
import {
  Search,
  Plus,
  Users,
  UserCheck,
  ShieldAlert,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

interface Client {
  id: number;
  firstName: string;
  surname: string;
  email: string;
  phoneNumber: string;
  address: string;
  activeLoanCount: number;
}

// Mock Dataset for Frontend Verification Loops
const MOCK_CLIENTS: Client[] = [
  {
    id: 1,
    firstName: "John",
    surname: "Mokoena",
    email: "john@mokoena.co.za",
    phoneNumber: "0821112233",
    address: "Johannesburg",
    activeLoanCount: 1,
  },
  {
    id: 2,
    firstName: "Sarah",
    surname: "Smith",
    email: "sarah@smith.com",
    phoneNumber: "0714445566",
    address: "Pretoria",
    activeLoanCount: 1,
  },
  {
    id: 3,
    firstName: "David",
    surname: "Khumalo",
    email: "david@khumalo.org",
    phoneNumber: "0637778899",
    address: "Soweto",
    activeLoanCount: 0,
  },
];

export default function BorrowersDashboardPage() {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State parameters for New Borrower Creation
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  // FUNCTIONAL BUTTON: Dynamic client profile registration with memory push
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !surname || !email || !phoneNumber || !address) {
      alert("Validation Constraint: Complete all borrower data properties.");
      return;
    }

    // Verify duplicate email inside internal client data registry array
    const emailTaken = clients.some(
      (c) => c.email.toLowerCase() === email.toLowerCase(),
    );
    if (emailTaken) {
      alert(
        `Conflict: The email address '${email}' is already registered within this tenant organization.`,
      );
      return;
    }

    const newClient: Client = {
      id: clients.length + 1,
      firstName,
      surname,
      email,
      phoneNumber,
      address,
      activeLoanCount: 0,
    };

    setClients([newClient, ...clients]);
    setIsDialogOpen(false);

    // Reset Form Input Buffers
    setFirstName("");
    setSurname("");
    setEmail("");
    setPhoneNumber("");
    setAddress("");
  };

  // Live filter operations matching inputs against database text matrices
  const filteredClients = clients.filter((c) =>
    `${c.firstName} ${c.surname} ${c.email}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const totalClientsCount = clients.length;
  const activeBorrowersCount = clients.filter(
    (c) => c.activeLoanCount > 0,
  ).length;
  const clearProspectsCount = clients.filter(
    (c) => c.activeLoanCount === 0,
  ).length;

  return (
    <div className="space-y-8 transition-colors duration-200">
      {/* HEADER CONTROLS WINDOW */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl uppercase text-neutral-900 dark:text-white">
            Borrowers Index
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">
            Profile new lending clients, evaluate active liabilities, and manage
            verification records.
          </p>
        </div>

        {/* MODAL TRIGGER FOR ONBOARDING FORM */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs rounded-md h-9 gap-1.5 transition-all">
              <Plus size={14} />
              <span>Register New Borrower</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-base font-bold uppercase tracking-tight text-neutral-900 dark:text-white">
                Create Borrower Profile
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                Register a new client profile. The isolation boundary rules lock
                this identity to your unique tenant workspace context.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateClient} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    First Name
                  </Label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Robert"
                    className="rounded-md border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    Surname
                  </Label>
                  <Input
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    placeholder="Smit"
                    className="rounded-md border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 h-9 text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  Email Address
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="robert@smit.co.za"
                  className="rounded-md border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  Phone Number
                </Label>
                <Input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0825559876"
                  className="rounded-md border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  Residential Address
                </Label>
                <Input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="12 Oak Ave, Sandton"
                  className="rounded-md border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 h-9 text-xs"
                />
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
                  Verify & Commit
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
              Total Profiled Clients
            </CardTitle>
            <Users className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {totalClientsCount}
            </div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono mt-0.5">
              Unified master borrower entries
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Active Debtors
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {activeBorrowersCount}
            </div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono mt-0.5">
              Currently subject to open credit filters
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Eligible Prospects
            </CardTitle>
            <UserCheck className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {clearProspectsCount}
            </div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono mt-0.5">
              Cleared for automated loan creation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* SEARCH AND DIRECTORY LAYOUT GRID */}
      <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-neutral-50/50 dark:bg-neutral-950/50">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Customer Roster Index
          </p>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search by profile name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 rounded-md h-9 text-xs focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
            />
          </div>
        </div>

        {/* PROFILE SHEET DATA LAYOUT TABLE */}
        <Table>
          <TableHeader className="bg-neutral-50 dark:bg-neutral-950">
            <TableRow className="border-b border-neutral-100 dark:border-neutral-800">
              <TableHead className="w-[60px] font-mono text-xs uppercase text-neutral-400 dark:text-neutral-500">
                ID
              </TableHead>
              <TableHead className="text-xs uppercase text-neutral-400 dark:text-neutral-500">
                Borrower Identity
              </TableHead>
              <TableHead className="text-xs uppercase text-neutral-400 dark:text-neutral-500">
                Contact Details
              </TableHead>
              <TableHead className="text-xs uppercase text-neutral-400 dark:text-neutral-500">
                Physical Address
              </TableHead>
              <TableHead className="w-[140px] text-xs uppercase text-neutral-400 dark:text-neutral-500 text-center">
                Status Guard
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-xs text-neutral-400 dark:text-neutral-500 py-10 font-mono"
                >
                  No registered borrowers matching your query parameters exist
                  within this company partition context.
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow
                  key={client.id}
                  className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-950/50 transition-colors"
                >
                  <td className="font-mono font-bold text-xs p-4 text-neutral-400 dark:text-neutral-500">
                    #{client.id}
                  </td>
                  <td className="p-4 font-semibold text-xs text-neutral-900 dark:text-white">
                    {client.firstName} {client.surname}
                  </td>
                  <td className="p-4 space-y-0.5 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <Mail size={11} className="text-neutral-400" />{" "}
                      <span>{client.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone size={11} className="text-neutral-400" />{" "}
                      <span>{client.phoneNumber}</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-neutral-400 shrink-0" />{" "}
                      <span className="truncate max-w-[200px]">
                        {client.address}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    {/* SYSTEM RISK INDICATOR IN ACTION */}
                    <div
                      className={cn(
                        "mx-auto w-28 px-2 py-0.5 text-[10px] font-bold text-center rounded border tracking-wide uppercase font-sans",
                        client.activeLoanCount > 0
                          ? "bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-300 font-medium"
                          : "bg-neutral-900 dark:bg-white border-neutral-950 dark:border-neutral-50 text-white dark:text-neutral-900",
                      )}
                    >
                      {client.activeLoanCount > 0
                        ? "1 Active Liability"
                        : "Cleared for Loan"}
                    </div>
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
