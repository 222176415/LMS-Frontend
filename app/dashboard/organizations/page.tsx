"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { SuperAdminView } from "@/components/Dashboard/Organizations/SuperAdminView";
import { TenantSettingsView } from "@/components/Dashboard/Organizations/TenantSettingsView";
import { RoleGuard } from "@/components/auth/role-guard"; // Adjust path as needed

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
    const computedSuperAdminRole =
        storedOrgId === "1" && userEmail === "ntimanethemba27@gmail.com";

    setOrganizationId(storedOrgId);
    setOrganizationName(storedOrgName);
    setIsSuperAdmin(computedSuperAdminRole);
    setCheckingAuth(false);
  }, []);

  return (
      <RoleGuard allowedRoles={["Admin", "SuperAdmin"]}>
        {checkingAuth ? (
            <div className="p-8 space-y-4">
              <Skeleton className="h-8 w-48 bg-neutral-100" />
              <Skeleton className="h-[400px] w-full bg-neutral-100 rounded-xl" />
            </div>
        ) : organizationId === "1" && isSuperAdmin ? (
            /* Case A: Main Branch (ID = 1) AND validated SuperAdmin */
            <SuperAdminView />
        ) : organizationId === "1" && !isSuperAdmin ? (
            /* Case B: Main Branch (ID = 1) but lacks SuperAdmin clearance matrix */
            <div className="p-6">
              <AccessDeniedView onBack={() => router.push("/dashboard")} />
            </div>
        ) : (
            /* Case C: Standard Tenant Isolation Workspace Node */
            <TenantSettingsView
                orgId={organizationId || "0"}
                initialName={organizationName}
            />
        )}
      </RoleGuard>
  );
}