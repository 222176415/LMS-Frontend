"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TopNavBar } from "@/components/top-nav-bar";
import { SidebarNav } from "@/components/sidebar-nav";

export default function DashboardLayout({
                                          children,
                                        }: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
          <div className="flex flex-1 relative overflow-hidden p-[3px] bg-neutral-200 dark:bg-neutral-800">
              <div className="absolute inset-0 pointer-events-none z-10">
                  <div
                      className="absolute top-1/2 left-1/2 w-[150%] h-[150%] animate-spin-slow opacity-75 dark:opacity-100"
                      style={{
                          background: "conic-gradient(from 0deg, transparent 40%, #3b82f6 50%, #8b5cf6 60%, transparent 70%)",
                          animationDuration: '10s' // Slow rotation for main content
                      }}
                  />
                  <div
                      className="absolute top-1/2 left-1/2 w-[150%] h-[150%] animate-spin-slow blur-md opacity-40"
                      style={{
                          background: "conic-gradient(from 0deg, transparent 40%, #3b82f6 50%, #8b5cf6 60%, transparent 70%)",
                          animationDuration: '10s'
                      }}
                  />
              </div>
            <div className="flex flex-1 w-full z-20 bg-neutral-50 dark:bg-neutral-950 relative">
              <aside className="fixed bottom-[3px] top-14 z-30   hidden w-64 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 lg:block">
                  <div className="flex flex-col justify-between h-full ">
                      <SidebarNav />
                      <div className="relative p-[3px] overflow-hidden rounded-lg group transition-all duration-300 border-r">
                          <div className="absolute inset-0 pointer-events-none z-0">
                              <div
                                  className="absolute top-1/2 left-1/2 w-[200%] h-[200%] animate-spin-slow opacity-80"
                                  style={{
                                      background: "conic-gradient(from 0deg, transparent 30%, #3b82f6 50%, #8b5cf6 70%, transparent 80%)",
                                      animationDuration: '4s' 
                                  }}
                              />
                              <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-950/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </div>
                          <div className="relative z-10 p-3.5  bg-white dark:bg-neutral-900 rounded-[7px] text-[11px] leading-relaxed font-mono">
                              <div className="flex items-center gap-2 mb-2">
                                  <div className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                                  </div>
                                  <span className="font-bold text-neutral-800 dark:text-neutral-200 block text-xs tracking-tight">
                      Meet Alex! Your AI Assistant
                    </span>
                              </div>
                              <p className="text-neutral-500 dark:text-neutral-500">
                                  I'm integrated with your Loan Management System using advancesd smart search capabilities.Ask me anything...
                              </p>
                          </div>
                      </div>
                  </div>
              </aside>
            <main className="flex-1 lg:pl-64 min-w-0">
              <div>{children}</div>
            </main>
          </div>
        </div>
      </div>
  );
}