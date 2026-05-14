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

interface OrganizationConfig {
  id: number;
  name: string;
  corporateEmail: string;
  vatRate: number;
  defaultInterestRate: number;
  tenantCode: string;
}

// Mock Active Tenant Node Context State
const INITIAL_ORG: OrganizationConfig = {
  id: 1,
  name: "FastCash Global Ltd",
  corporateEmail: "operations@fastcash.com",
  vatRate: 15.0,
  defaultInterestRate: 12.5,
  tenantCode: "FC-GBL-001-ZAF",
};

export default function TenantOrganizationsPage() {
  const [org, setOrg] = useState<OrganizationConfig>(INITIAL_ORG);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable Buffer Form Local State
  const [name, setName] = useState(org.name);
  const [email, setEmail] = useState(org.corporateEmail);
  const [vat, setVat] = useState(org.vatRate.toString());
  const [interest, setInterest] = useState(org.defaultInterestRate.toString());

  // FUNCTIONAL BUTTON: Commits updated baseline numbers to mock database
  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    // Validation Guard Checks
    const parsedVat = parseFloat(vat);
    const parsedInterest = parseFloat(interest);

    if (!name || !email || isNaN(parsedVat) || isNaN(parsedInterest)) {
      alert(
        "Configuration Error: All structural configuration parameters must be present and numeric.",
      );
      setIsSaving(false);
      return;
    }

    // Simulated transactional latency loop
    await new Promise((resolve) => setTimeout(resolve, 800));

    setOrg({
      ...org,
      name,
      corporateEmail: email,
      vatRate: parsedVat,
      defaultInterestRate: parsedInterest,
    });

    setIsSaving(false);
    setSaveSuccess(true);
  };

  // Reset completion alert indicator automatically over time
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  return (
    <div className="space-y-8 transition-colors duration-200">
      {/* HEADER SEGMENT */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl uppercase text-neutral-900 dark:text-white">
          Organization Profiles
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">
          Manage entity footprints, branch profiles, and structural snapshot
          calculation percentages.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN: Read-Only Active Configuration Meta Metadata Metadata Status Card */}
        <div className="lg:col-span-1 space-y-5">
          <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md">
                  <Building2 size={16} />
                </div>
                <div>
                  <CardTitle className="text-xs font-bold uppercase tracking-wide">
                    Live Tenant Node
                  </CardTitle>
                  <CardDescription className="text-[10px] font-mono">
                    {org.tenantCode}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-5 space-y-4 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Registered Name
                </span>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {org.name}
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Ledger Contact Gateway
                </span>
                <p className="font-mono text-neutral-600 dark:text-neutral-400">
                  {org.corporateEmail}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Active VAT
                  </span>
                  <p className="text-base font-bold text-neutral-900 dark:text-white">
                    {org.vatRate.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Base Interest
                  </span>
                  <p className="text-base font-bold text-neutral-900 dark:text-white">
                    {org.defaultInterestRate.toFixed(2)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CRITICAL BUSINESS INTELLIGENCE COMPLIANCE NOTICE BLOCK */}
          <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs flex gap-3">
            <AlertCircle
              size={18}
              className="text-neutral-400 shrink-0 mt-0.5"
            />
            <div className="space-y-1 text-neutral-500 dark:text-neutral-400 leading-relaxed">
              <span className="font-bold text-neutral-800 dark:text-neutral-200 block text-[11px] uppercase tracking-wide">
                Snapshot Rules Active
              </span>
              Modifying these metrics will not overwrite or alter historical
              values. All active borrower loans preserve their generated
              percentages intact.
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
                Edit values and submit parameters directly to the settings
                engine directory layers.
              </CardDescription>
            </div>
            <Sliders size={15} className="text-neutral-400" />
          </CardHeader>

          <form onSubmit={handleUpdateConfig}>
            <CardContent className="p-6 space-y-5">
              {/* SUCCESS STATE UPDATE ALERT ANIMATED FEEDBACK BANNER */}
              {saveSuccess && (
                <div className="p-3 text-xs font-semibold tracking-wide bg-neutral-900 dark:bg-white border border-neutral-950 dark:border-neutral-50 text-white dark:text-neutral-900 rounded-md flex items-center gap-2">
                  <Check size={14} />
                  <span>
                    Tenant organization profile context updated successfully.
                    Financial engines re-cached.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="org-name"
                    className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500"
                  >
                    Legal Company Name
                  </Label>
                  <Input
                    id="org-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-md h-10 text-xs focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="org-email"
                    className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500"
                  >
                    System Corporate Email
                  </Label>
                  <Input
                    id="org-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-md h-10 text-xs focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 text-neutral-400">
                    <Percent size={11} />
                    <Label
                      htmlFor="org-vat"
                      className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500"
                    >
                      Operational VAT Percentage
                    </Label>
                  </div>
                  <Input
                    id="org-vat"
                    type="number"
                    step="0.01"
                    value={vat}
                    onChange={(e) => setVat(e.target.value)}
                    className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-md h-10 text-xs focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 text-neutral-400">
                    <Percent size={11} />
                    <Label
                      htmlFor="org-interest"
                      className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500"
                    >
                      Default Base Loan Interest
                    </Label>
                  </div>
                  <Input
                    id="org-interest"
                    type="number"
                    step="0.01"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-md h-10 text-xs focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                    disabled={isSaving}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-4 bg-neutral-50 dark:bg-neutral-950/50 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              {/* FUNCTIONAL BUTTON LOGIC SEAMLESS WITH TRANSITION LOOPS */}
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-md text-xs h-10 px-6 font-medium gap-2"
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Updating System Settings...</span>
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
