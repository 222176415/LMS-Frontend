"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { LoginResponse } from "@/lib/type";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Lucide Icons
import { Sun, Moon, LogIn, Laptop } from "lucide-react";

export default function AuthSplitPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<LoginResponse>("/Auth/login", {
        email: loginEmail,
        password: loginPassword,
      });
      return response.data;
    },
    onSuccess: (response) => {
      if (response.success && response.data.token) {
        localStorage.setItem("lms_bearer_token", response.data.token);
        localStorage.setItem("lms_user_email", response.data.email);
        localStorage.setItem(
          "lms_org_id",
          response.data.organizationId.toString(),
        );
        router.push("/dashboard");
      } else {
        setErrorMessage(
          response.message || "Authentication rejected by tenant engine.",
        );
      }
    },
    onError: (error: any) => {
      const serverMessage =
        error.response?.data?.message ||
        "Runtime connection timeout to backend server.";
      setErrorMessage(`Authentication Failed: ${serverMessage}`);
    },
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!loginEmail || !loginPassword) {
      setErrorMessage("Please enter both email and password parameters.");
      return;
    }

    loginMutation.mutate();
  };

  return (
    <div className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background text-foreground transition-colors duration-200">
      {/* LEFT COLUMN: STATIC PERSISTENT INFO PANEL */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-neutral-950 text-white overflow-hidden border-r border-neutral-800 dark:border-neutral-800">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-grid-pattern invert" />

        <div className="relative z-10 text-xs font-bold tracking-widest uppercase text-neutral-400">
          <div>
            <Link href="/" className="hover:text-white transition-colors">
              LMS.Core | Lending Dashboard
            </Link>
          </div>
          <div className="inline-block mt-2 px-2.5 py-0.5 text-[8px] font-medium tracking-wider uppercase border border-neutral-800 bg-neutral-900 text-neutral-300">
            Engineered for Independent Lenders & Small Businesses
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tighter leading-none uppercase">
            Protect Your Capital. <br />
            <span className="text-neutral-500">Grow Your Loan Book.</span>
          </h2>

          <p className="text-neutral-400 text-sm leading-relaxed">
            Stop tracking active borrowers across loose spreadsheets and
            fractured notifications. LMS Core delivers absolute visibility into
            your daily cash flow, partial repayments, and outstanding interest
            balances through a clean, automated interface.
          </p>

          <div className="grid grid-cols-1 gap-3 pt-4 border-t border-neutral-900">
            <div className="flex items-start gap-2.5 text-xs text-neutral-300">
              <span className="text-neutral-500 font-mono">[✓]</span>
              <span>
                <strong>Automated Late Alerts:</strong> Chronos Scheduler
                automatically flags overdue borrowers at midnight.
              </span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-neutral-300">
              <span className="text-neutral-500 font-mono">[✓]</span>
              <span>
                <strong>Zero Ledger Overlaps:</strong> Active safety guards
                prevent borrowers from doubling their debt loops.
              </span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-neutral-300">
              <span className="text-neutral-500 font-mono">[✓]</span>
              <span>
                <strong>Instant Rate Snapshotting:</strong> Lock interest and
                VAT configurations on generation—fully immune to global changes.
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[10px] tracking-wider text-neutral-600 uppercase font-mono">
          <span>Secured Workspace Engine</span>
          <span>3.0.0</span>
        </div>
      </div>

      {/* RIGHT COLUMN: INTERACTIVE INPUT PANEL */}
      <div className="relative flex flex-col items-center justify-center p-6 md:p-12 bg-background">
        {/* CORNER QUICK THEME CONTROLLER TOGGLER */}
        <div className="absolute top-4 right-4 z-20 flex gap-1 p-0.5 border border-border bg-card rounded-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme("light")}
            className={`h-7 w-7 rounded-sm p-0 ${mounted && theme === "light" ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" : "text-neutral-400"}`}
          >
            <Sun size={12} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme("dark")}
            className={`h-7 w-7 rounded-sm p-0 ${mounted && theme === "dark" ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" : "text-neutral-400"}`}
          >
            <Moon size={12} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme("system")}
            className={`h-7 w-7 rounded-sm p-0 ${mounted && theme === "system" ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" : "text-neutral-400"}`}
          >
            <Laptop size={12} />
          </Button>
        </div>

        <div className="w-full max-w-sm space-y-6 relative z-10">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-neutral-100 dark:bg-neutral-900 p-1 border border-border rounded-md">
              <TabsTrigger
                value="signin"
                className="rounded-sm data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:text-foreground font-medium text-xs uppercase tracking-wider"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-sm data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:text-foreground font-medium text-xs uppercase tracking-wider"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {errorMessage && (
              <div className="mt-4 p-3 text-xs font-semibold border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-md font-mono">
                {errorMessage}
              </div>
            )}

            <TabsContent value="signin" className="mt-4">
              <Card className="border-border bg-card rounded-xl shadow-sm">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl font-bold tracking-tight uppercase text-foreground">
                    Access Your Dashboard
                  </CardTitle>
                  <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                    Sign in to manage your active borrowers, log repayments, and
                    track your daily cash flow.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLoginSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="login-email"
                        className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500"
                      >
                        Email Address
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="lender@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="border-border bg-background rounded-md focus-visible:ring-neutral-900 dark:focus-visible:ring-white h-10 text-xs"
                        disabled={loginMutation.isPending}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="login-password"
                        className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500"
                      >
                        Account Password
                      </Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="border-border bg-background rounded-md focus-visible:ring-neutral-900 dark:focus-visible:ring-white h-10 text-xs"
                        disabled={loginMutation.isPending}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button
                      type="submit"
                      className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-md h-10 text-xs font-semibold uppercase tracking-wider gap-2"
                      disabled={loginMutation.isPending}
                    >
                      <LogIn size={14} />
                      <span>
                        {loginMutation.isPending ? "Loading..." : "Login"}
                      </span>
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="signup" className="mt-4">
              <Card className="border-border bg-card rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold tracking-tight uppercase text-foreground">
                    User Onboarding
                  </CardTitle>
                  <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                    Account registration is managed directly by internal
                    administrative teams.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 py-4 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans border-t border-border">
                  To provision a new operator or staff profile, please contact
                  your internal Organization Admin. For platform-level scaling,
                  multi-tenant setup queries, or direct backend access, email
                  system administration at{" "}
                  <a
                    href="mailto:ntimanethemba27@gmail.com"
                    className="font-mono font-bold text-neutral-900 dark:text-white underline hover:text-neutral-700 dark:hover:text-neutral-300"
                  >
                    ntimanethemba27@gmail.com
                  </a>
                  .
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
