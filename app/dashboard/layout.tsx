"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TopNavBar } from "@/components/top-nav-bar"; // IMPORTS NEW HEADER COMPONENT
import { SidebarNav } from "@/components/sidebar-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // SECURITY FIREWALL: Guards routes against unauthenticated sessions
  useEffect(() => {
    const token = localStorage.getItem("lms_bearer_token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
        <p className="text-xs font-semibold tracking-widest text-neutral-400 uppercase font-mono animate-pulse">
          Validating Security Session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-sans flex flex-col transition-colors duration-200">
      <TopNavBar />
      <div className="flex flex-1 relative">
        <aside className="fixed bottom-0 top-14 left-0 z-30 hidden w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 lg:block">
          <div className="flex flex-col justify-between h-full ">
            <SidebarNav />

            {/* <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-md text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed font-mono">
              <span className="font-bold text-neutral-700 dark:text-neutral-300 block mb-0.5">
                Isolated Security
              </span>
              Multi-tenant node mapping active. Data leakage scope locked.
            </div> */}
          </div>
        </aside>

        <main className="flex-1 lg:pl-64 min-w-0 ">
          <div className="p-2 md:p-4 ">{children}</div>
        </main>
      </div>
    </div>
  );
}
