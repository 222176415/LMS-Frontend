"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  Users,
  Building2,
  ShieldCheck,
  Activity,
  UserCheck,
} from "lucide-react";

export function SidebarNav() {
  const pathname = usePathname();

  const navigationItems = [
    { name: "Overview", href: "/dashboard", icon: Activity },
    { name: "Loans Ledger", href: "/dashboard/loans", icon: CreditCard },
    { name: "Borrowers", href: "/dashboard/clients", icon: Users },
    { name: "Staff Directory", href: "/dashboard/users", icon: UserCheck },
    {
      name: "Organizations",
      href: "/dashboard/organizations",
      icon: Building2,
    },
    { name: "Security Audit", href: "/dashboard/audit", icon: ShieldCheck },
  ] as const;

  return (
    <nav className="space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-3 mb-3">
        Operations Matrix
      </p>

      {navigationItems.map((item) => {
        const isActive = pathname === item.href;
        const IconComponent = item.icon;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-xs font-semibold tracking-wide rounded-md transition-all group",
              isActive
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-none"
                : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white",
            )}
          >
            <IconComponent
              size={16}
              className={cn(
                "transition-colors",
                isActive
                  ? "text-white dark:text-neutral-900"
                  : "text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white",
              )}
            />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
