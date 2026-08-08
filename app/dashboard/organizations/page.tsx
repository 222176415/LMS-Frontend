"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { SuperAdminView } from "@/components/Organizations/SuperAdminView";
// import { AccessDeniedView } from "@/components/Organizations/AccessDeniedView";
// import { TenantSettingsView } from "@/components/Organizations/TenantSettingsView";
import { Skeleton } from "@/components/ui/skeleton";
import {SuperAdminView} from "@/components/Dashboard/Organizations/SuperAdminView";
import {TenantSettingsView} from "@/components/Dashboard/Organizations/TenantSettingsView";

function AccessDeniedView(props: { onBack: () => void }) {
  return null;
}

export default function OrganizationsIndexPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Rule matrix control attributes
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [organizationName, setOrganizationName] = useState<string>("");
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);

  useEffect(() => {
    const storedOrgId = localStorage.getItem("lms_org_id");
    const storedOrgName = localStorage.getItem("organizationName") || "";
    
    const userEmail = localStorage.getItem("lms_user_email") || "";
    const computedSuperAdminRole = storedOrgId === "1" && userEmail === "ntimanethemba27@gmail.com";

    setOrganizationId(storedOrgId);
    setOrganizationName(storedOrgName);
    setIsSuperAdmin(computedSuperAdminRole);
    setCheckingAuth(false);
  }, []);

  if (checkingAuth) {
    return (
        <div className="p-8 space-y-4">
          <Skeleton className="h-8 w-48 bg-neutral-100" />
          <Skeleton className="h-[400px] w-full bg-neutral-100 rounded-xl" />
        </div>
    );
  }

  // CONDITIONAL VIEW DISPATCH LOGIC

  // Case A: Main Branch (ID = 1) AND validated SuperAdmin
  if (organizationId === "1" && isSuperAdmin) {
    return <SuperAdminView />;
  }

  // Case B: Main Branch (ID = 1) but lacks SuperAdmin clearance matrix
  if (organizationId === "1" && !isSuperAdmin) {
    return (
        <div className="p-6">
          <AccessDeniedView onBack={() => router.push("/dashboard")} />
        </div>
    );
  }

  // Case C: Standard Tenant Isolation Workspace Node
  return (
      <TenantSettingsView
          orgId={organizationId || "0"}
          initialName={organizationName}
      />
  );
}