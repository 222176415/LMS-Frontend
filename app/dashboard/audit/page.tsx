"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { RefreshCw, ShieldCheck } from "lucide-react";
import {AuditKPICards} from "@/components/Dashboard/Audit/AuditKPICards";
import {AuditDataTables} from "@/components/Dashboard/Audit/AuditDataTables";
import {useAuditHub} from "@/lib/useAuditHub";

export default function SecurityAuditDashboard() {
  const { activities, logins, telemetry, isConnected, refreshMetrics } = useAuditHub();
console.log("Tel 2",telemetry)
  return (
      <div className="space-y-6 p-6">
        {/* DASHBOARD TITLE PANEL BLOCK */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-neutral-900 dark:text-white" />
              <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl uppercase text-neutral-900 dark:text-white">
                System Audit & Security Guard
              </h1>
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">
              Real-time multi-tenant signal telemetry infrastructure. Monitoring transactional modifications, system errors, and authentication signatures.
            </p>
          </div>

          <Button
              onClick={refreshMetrics}
              disabled={!isConnected}
              variant="outline"
              className="text-xs h-9 gap-1.5 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-md shadow-xs"
          >
            <RefreshCw size={12} className={!isConnected ? "" : "hover:animate-spin"} />
            <span>Synchronize Telemetry Engine</span>
          </Button>
        </div>
        <AuditKPICards telemetry={telemetry} isConnected={isConnected} />
        <AuditDataTables activities={activities} logins={logins} />
      </div>
  );
}