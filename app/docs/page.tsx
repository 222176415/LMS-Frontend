"use client";

import React, { useState } from "react";
// import Link from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SaaSDocumentationPage() {
  const [activeSection, setActiveSection] = useState("onboarding");
  const [searchQuery, setSearchQuery] = useState("");

  const helpCategories = [
    {
      group: "Getting Started",
      items: [
        { id: "onboarding", label: "Tenant Onboarding Guide" },
        { id: "roles", label: "Configuring Staff Roles" },
      ],
    },
    {
      group: "Core Walkthroughs",
      items: [
        { id: "issuance", label: "Auto-Issuing a Loan" },
        { id: "repayments", label: "Processing Partial Payments" },
        { id: "escalations", label: "Managing Overdue Defaults" },
      ],
    },
    {
      group: "System Diagnostics",
      items: [
        { id: "audit-stream", label: "Live Activity Audit Reviews" },
        { id: "troubleshooting", label: "Error Logs & Resolutions" },
      ],
    },
  ];

  // Functional Search Filter Logic
  const allItems = helpCategories.flatMap((c) => c.items);
  const filteredItems = allItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-200">
      {/* Absolute Minimal Grid Background Layer */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {/* Persistent Help Desk Header Bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-white/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-bold tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-all"
          >
            ← Home
          </Link>
          <span className="text-neutral-200">/</span>
          <span className="text-xs font-bold tracking-widest uppercase text-neutral-900">
            Knowledge Base
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button
              size="sm"
              variant="outline"
              className="border-neutral-200 rounded-md text-xs font-medium"
            >
              Access Workspace
            </Button>
          </Link>
        </div>
      </header>

      {/* Interactive Search Spotlight Bar */}
      <div className="border-b border-neutral-100 bg-neutral-50/50 py-12 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Help Center & Documentation
          </h1>
          <p className="text-neutral-500 text-sm max-w-md mx-auto">
            Search step-by-step feature walkthroughs, configuration profiles,
            and self-service onboarding guides.
          </p>
          <div className="relative max-w-md mx-auto pt-2">
            <Input
              type="text"
              placeholder="Search help topics (e.g., auto-issue, repayments)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-neutral-200 rounded-md h-10 shadow-sm focus-visible:ring-neutral-900 placeholder:text-neutral-400 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Workspace Split Interface */}
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
        {/* ASIDE SIDEBAR: Segmented Knowledge Directories */}
        <aside className="md:col-span-1 space-y-6">
          {searchQuery ? (
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 mb-2">
                Search Results ({filteredItems.length})
              </p>
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs font-medium rounded-md transition-all",
                    activeSection === item.id
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : (
            helpCategories.map((category, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 mb-2">
                  {category.group}
                </p>
                {category.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-xs font-medium rounded-md transition-all",
                      activeSection === item.id
                        ? "bg-neutral-100 text-neutral-900 font-semibold"
                        : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))
          )}
        </aside>

        {/* MAIN DISPLAY VIEWPORT: Comprehensive SaaS Documentation Guides */}
        <main className="md:col-span-3 max-w-2xl space-y-8">
          {activeSection === "onboarding" && (
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Onboarding Guide // Step-by-Step
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight">
                  Tenant Onboarding Walkthrough
                </h2>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Setting up your workspace correctly guarantees all downstream
                operations execute smoothly. To eliminate configuration loops,
                initialize your tenant system workspace using this exact
                sequential path:
              </p>
              <Card className="border-neutral-200 shadow-none bg-neutral-50/50 rounded-lg">
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-bold uppercase">
                    Initialization Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3 text-xs text-neutral-600">
                  <div className="flex gap-3">
                    <span className="font-bold text-neutral-900">[1]</span>{" "}
                    <span>
                      <strong>Establish Rates:</strong> Set your central
                      Organization tax footprint (VAT) and your default branch
                      Interest Percentage. These values serve as your master
                      financial profiles.
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-bold text-neutral-900">[2]</span>{" "}
                    <span>
                      <strong>Onboard Staff:</strong> Register profiles for your
                      team members. Assign them explicit security roles (`Admin`
                      or `LoanOfficer`) to anchor operational bounds.
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-bold text-neutral-900">[3]</span>{" "}
                    <span>
                      <strong>Client Profiling:</strong> Begin adding borrowers.
                      Once a customer has a structural account profile, they
                      become legally eligible for capital generation.
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "roles" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Security Parameters // Hierarchy
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight">
                  Configuring Staff Roles
                </h2>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed">
                The platform utilizes a explicit role matrix to handle security
                context restrictions. It enforces functional constraints based
                on structural permission assignments:
              </p>
              <div className="border border-neutral-200 rounded-lg overflow-hidden text-xs">
                <div className="grid grid-cols-3 font-semibold bg-neutral-900 text-white p-3 font-mono text-[10px] uppercase">
                  <span>Role Level</span>
                  <span>Allowed Functions</span>
                  <span>Data Boundary Scope</span>
                </div>
                <div className="grid grid-cols-3 p-3 border-b border-neutral-100">
                  <span className="font-bold">System Root</span>
                  <span>Full Tenant Creation / Global Edits</span>
                  <span className="text-neutral-500">
                    Cross-Tenant Directory Overview
                  </span>
                </div>
                <div className="grid grid-cols-3 p-3 border-b border-neutral-100">
                  <span className="font-bold">Tenant Admin</span>
                  <span>Staff Setup / Adjust Organization Rates</span>
                  <span className="text-neutral-500">
                    Isolated Organization Workspace
                  </span>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <span className="font-bold">Loan Officer</span>
                  <span>Client Creation / Issue Loans & Payments</span>
                  <span className="text-neutral-500">
                    Read/Write Client records only
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeSection === "issuance" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Feature Walkthrough // Underwriting
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight">
                  Auto-Issuing a Loan
                </h2>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed">
                The **Auto-Issue Feature** combines customer account profile
                registration and lending setup into a single database
                transaction. This speeds up data entry and completely removes
                administrative errors.
              </p>
              <div className="p-4 bg-neutral-950 text-neutral-400 border border-neutral-800 rounded-lg font-mono text-xs space-y-2">
                <p className="text-white font-semibold">
                  {" "}
                  How the system executes auto-issuance under the hood:
                </p>
                <p>1. Target Email Scan :hecks database matching profiles.</p>
                <p>
                  2. Profile Validation : Missing profiles automatically
                  generate client entries.
                </p>
                <p>
                  3. Settings Snapshot : Automatically reads and copies live
                  interest/VAT percentages.
                </p>
                <p>
                  4. Secure Logging : Commits entries to tables and alerts the
                  audit group monitors.
                </p>
              </div>
            </div>
          )}

          {activeSection === "repayments" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Feature Walkthrough // Servicing
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight">
                  Processing Partial Payments
                </h2>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed">
                When a borrower pays down capital via cash, card, or wire
                transfer, use the **Payments Panel** to post the transaction.
                The system applies explicit validation scripts to protect your
                ledger balances:
              </p>
              <ul className="list-disc pl-5 text-sm text-neutral-500 space-y-2">
                <li>
                  <strong>Overpayment Lockdown:</strong> The backend calculates
                  your open remaining balance and rejects any transaction
                  exceeding that precise dollar metric.
                </li>
                <li>
                  <strong>State Shifting:</strong> If a payment successfully
                  drops the outstanding debt balance to zero, the loan is
                  updated to a{" "}
                  <code className="text-xs font-mono bg-neutral-100 px-1 border border-neutral-200 rounded text-neutral-900">
                    Paid
                  </code>{" "}
                  status and closed.
                </li>
              </ul>
            </div>
          )}

          {activeSection === "escalations" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Operational Risk // Enforcement
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight">
                  Managing Overdue Defaults
                </h2>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed">
                To keep your active portfolio clear of bad debt, delinquent
                accounts run through two distinct processing tracks:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-neutral-200 rounded-lg space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Automated Transition
                  </h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    The Chronos Worker runs automatically at midnight, scans for
                    past due-dates, shifts records to an Overdue state, and
                    drops an immutable log record.
                  </p>
                </div>
                <div className="p-4 border border-neutral-200 rounded-lg space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Manual Escalation
                  </h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Branch managers can use the administrative default endpoint
                    tool to shift uncollectible contracts into a Defaulted loss
                    profile manually.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "audit-stream" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Diagnostics // Transparency
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight">
                  Live Activity Audit Reviews
                </h2>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Compliance and internal risk tracking rely heavily on our audit
                logs. Every create, update, and delete action writes a
                descriptive snapshot to the database. These changes are
                broadcast to connected admin dashboards via a secure Real-Time
                WebSockets Hub connection.
              </p>
            </div>
          )}

          {activeSection === "troubleshooting" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Diagnostics // Troubleshooting
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight">
                  Error Logs & Resolutions
                </h2>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Below are standard runtime diagnostic validations returned by
                our structured endpoints, alongside the required corrective
                actions:
              </p>
              <div className="space-y-3">
                <div className="p-3 border border-neutral-200 rounded-lg text-xs bg-neutral-50/50">
                  <p className="font-bold text-neutral-900">
                    401 Unauthorized // "User is not logged in."
                  </p>
                  <p className="text-neutral-500 mt-1">
                    The authorization handshake token is expired or formatted
                    incorrectly. Clear local storage cache fields and
                    re-authenticate via the split entry gate.
                  </p>
                </div>
                <div className="p-3 border border-neutral-200 rounded-lg text-xs bg-neutral-50/50">
                  <p className="font-bold text-neutral-900">
                    400 Bad Request // "Transaction rejected. Outstanding debt
                    balance found."
                  </p>
                  <p className="text-neutral-500 mt-1">
                    The Client Status Guard has identified an active or overdue
                    loan contract attached to this client. The open contract
                    must be paid or defaulted before new lending assets can be
                    deployed.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
