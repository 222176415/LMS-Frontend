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
  Phone,
  MapPin,
  RefreshCw, Edit, Trash2,
} from "lucide-react";

// Assuming this hook returns your typed backend structure: { success: boolean, data: Client[], message: string }
import { useBorrowersQuery } from "@/lib/api-hooks";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {apiClient} from "@/lib/api-client";
import {NotificationCenter ,Toast} from "@/components/Notification";

interface Client {
  id: number;
  organizationId?: number;
  firstName: string;
  surname: string;
  email: string;
  phoneNumber: string;
  address: string;
  activeLoanCount?: number; 
}

export default function BorrowersDashboardPage() {
  
  const { data: clientsData, isLoading, isRefetching } = useBorrowersQuery();
  const queryClient = useQueryClient();
 
  const backendClients: Client[] = clientsData|| [];

 
  const [localClients, setLocalClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: "success" | "error", message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (backendClients.length > 0) {
      setLocalClients([]);
    }
  }, [backendClients]);

  // Combine remote dataset with your newly committed local memory blocks
  const combinedClients = [...localClients, ...backendClients];

  const createClientMutation = useMutation({
    mutationFn: async (newClientPayload: {
      firstName: string;
      surname: string;
      email: string;
      phoneNumber: string;
      address: string;
    }) => {
      const response = await apiClient.post("/Clients", newClientPayload);
      return response.data ?? response;
    },
    onSuccess: (res: any) => {
      if (res && res.success === false) {
        showToast("error", res.message || "Failed to onboard borrower profile.");
        setIsDialogOpen(false)
        return;
      }

      showToast("success", "Borrower created successfully!");

      // Invalidate borrowers list
      queryClient.invalidateQueries({ queryKey: ["borrowers"] });

      // Reset modal and inputs
      setIsDialogOpen(false);
      setFirstName("");
      setSurname("");
      setEmail("");
      setPhoneNumber("");
      setAddress("");

      // Trigger full page reload
      window.location.reload();
    },
    onError: (err: any) => {
      console.error("Borrower Creation Error:", err);
      const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to transmit client record to the network layer.";
      showToast("error", message);
    },
  });

  // SUBMIT HANDLER
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !surname || !email || !phoneNumber || !address) {
      showToast("error", "Validation Constraint: Complete all borrower data properties.");
      return;
    }

    // Client-side duplicate check
    const emailTaken = clientsData?.some(
        (c) => c.email.toLowerCase() === email.toLowerCase()
    );
    if (emailTaken) {
      setIsDialogOpen(false)
      showToast(
          "error",
          `Dupplicate Entries: The email address '${email}' is already registered within this  organization.`
      );
      return;
    }

    createClientMutation.mutate({
      firstName,
      surname,
      email,
      phoneNumber,
      address,
    });
  };
  
  const filteredClients = combinedClients.filter((c) =>
      `${c.firstName || ""} ${c.surname || ""} ${c.email || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
  );

  const totalClientsCount = combinedClients.length;
  const activeBorrowersCount = combinedClients.filter(
      (c) => (c.activeLoanCount || 0) > 0
  ).length;
  const clearProspectsCount = combinedClients.filter(
      (c) => (c.activeLoanCount || 0) === 0
  ).length;

  return (
      <div className="space-y-8 transition-colors duration-200 md:p-4 p-2">
        <NotificationCenter notifications={toasts} onDismiss={removeToast} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl uppercase text-neutral-900 dark:text-white">
                Borrowers
              </h1>
              {isRefetching && (
                  <RefreshCw className="h-4 w-4 animate-spin text-neutral-400" />
              )}
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">
              Profile new lending clients, evaluate active liabilities, and manage verification records.
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
            <DialogContent className=" border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-base font-bold uppercase tracking-tight text-neutral-900 dark:text-white">
                  Create Borrower Profile
                </DialogTitle>
                <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                  Register a new client profile.
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
                        placeholder="First Name"
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
                        placeholder="Surname"
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
                      placeholder="example@gmail.com"
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
                      placeholder="07 000 00000"
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
                      placeholder="40 Juta Street, Braamfontein"
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
                  Add Client
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
              {isLoading ? (
                  <Skeleton className="h-8 w-16 bg-neutral-100 dark:bg-neutral-800" />
              ) : (
                  <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    {totalClientsCount}
                  </div>
              )}
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
              {isLoading ? (
                  <Skeleton className="h-8 w-16 bg-neutral-100 dark:bg-neutral-800" />
              ) : (
                  <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    {activeBorrowersCount}
                  </div>
              )}
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
              {isLoading ? (
                  <Skeleton className="h-8 w-16 bg-neutral-100 dark:bg-neutral-800" />
              ) : (
                  <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    {clearProspectsCount}
                  </div>
              )}
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
                  disabled={isLoading}
              />
            </div>
          </div>

          {/* PROFILE SHEET DATA LAYOUT TABLE */}
          <Table>
            <TableHeader className="bg-neutral-50 dark:bg-neutral-950">
              <TableRow className="border-b border-neutral-100 dark:border-neutral-800">
              
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
                <TableHead className="text-xs uppercase text-neutral-400 dark:text-neutral-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                      <TableRow key={`skeleton-row-${idx}`} className="border-b border-neutral-100 dark:border-neutral-800">
                        <TableCell><Skeleton className="h-4 w-8 bg-neutral-100 dark:bg-neutral-800" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32 bg-neutral-100 dark:bg-neutral-800" /></TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Skeleton className="h-3 w-40 bg-neutral-100 dark:bg-neutral-800" />
                            <Skeleton className="h-3 w-28 bg-neutral-100 dark:bg-neutral-800" />
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-48 bg-neutral-100 dark:bg-neutral-800" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-48 bg-neutral-100 dark:bg-neutral-800" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24 mx-auto rounded bg-neutral-100 dark:bg-neutral-800" /></TableCell>
                      </TableRow>
                  ))
              ) : filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell
                        colSpan={5}
                        className="text-center text-xs text-neutral-400 dark:text-neutral-500 py-10 font-mono"
                    >
                      No registered borrowers matching your Search parameters exist within this company partition context.
                    </TableCell>
                  </TableRow>
              ) : (
                  filteredClients.map((client) => (
                      <TableRow
                          key={client.id}
                          className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-950/50 transition-colors"
                      >
           
                        <TableCell className="p-4 font-semibold text-xs text-neutral-900 dark:text-white">
                          {client.firstName} {client.surname}
                        </TableCell>
                        <TableCell className="p-4 space-y-0.5 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                          <div className="flex items-center gap-1.5">
                            <Mail size={11} className="text-neutral-400" /> <span>{client.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone size={11} className="text-neutral-400" /> <span>{client.phoneNumber}</span>
                          </div>
                        </TableCell>
                        <TableCell className="p-4 text-xs text-neutral-500 dark:text-neutral-400">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={12} className="text-neutral-400 shrink-0" />{" "}
                            <span className="truncate max-w-[200px]" title={client.address}>
                        {client.address}
                      </span>
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <div
                              className={cn(
                                  "mx-auto w-28 px-2 py-0.5 text-[10px] font-bold text-center rounded border tracking-wide uppercase font-sans",
                                  (client.activeLoanCount || 0) > 0
                                      ? "bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-300 font-medium"
                                      : "bg-neutral-900 dark:bg-white border-neutral-950 dark:border-neutral-50 text-white dark:text-neutral-900"
                              )}
                          >
                            {(client.activeLoanCount || 0) > 0
                                ? `${client.activeLoanCount} Active Liability`
                                : "Cleared for Loan"}
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-400 hover:text-neutral-900"><Edit size={12} /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-400 hover:text-red-600" ><Trash2 size={12} /></Button>
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