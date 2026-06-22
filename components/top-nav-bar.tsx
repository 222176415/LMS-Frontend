"use client";



import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";

// Shadcn UI Elements
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

// Lucide Icons
import {
  LogOut,
  Moon,
  Sun,
  User,
  Building,
  Settings,
  HelpCircle,
  Laptop,
} from "lucide-react";

export function TopNavBar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [userEmail, setUserEmail] = useState("");
  const [organization, setOrganization] = useState("");
console.log()
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setUserEmail(
        localStorage.getItem("lms_user_email") || "operator@lms.com",
      );
      setOrganization(localStorage.getItem("org_name") || "1001");
    }
  }, []);

  const handleLogoutAction = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 py-3 flex h-14c items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6 shadow-sm transition-colors duration-200">
      <div className="flex items-center gap-4">
        <span className="text-xs font-extrabold tracking-widest uppercase text-neutral-900 dark:text-white">
          LMS | Portal
        </span>
        <div className="hidden md:inline-block h-4 w-[1px] bg-neutral-200 dark:bg-neutral-800" />
        <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 border border-green-200 dark:border-green-800 bg-neutral-50 dark:bg-neutral-950 rounded text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase">
          <Building size={10} />
          <span className="text-green-600">Organization: {organization}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/docs" className="hidden sm:inline-block">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-md h-9"
          >
            Help Desk Docs
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white focus-visible:ring-neutral-900 dark:focus-visible:ring-white shadow-sm"
            >
              <User size={15} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-56 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg shadow-lg mx-6 p-1 text-xs"
            align="end"
          >
            <DropdownMenuLabel className="px-2 py-2 text-neutral-400 dark:text-neutral-500 font-normal">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Authenticated Profile
              </span>
              <span className="block font-semibold text-neutral-800 dark:text-neutral-200 truncate mt-0.5 font-mono">
                {userEmail}
              </span>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-800 my-1" />

            <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Interface Theme
            </DropdownMenuLabel>

            {/* --- NATIVE SHADCN RADIO INTERACTION ENGINE --- */}
            <DropdownMenuRadioGroup
              value={mounted ? theme : "light"}
              onValueChange={setTheme}
            >
              <DropdownMenuRadioItem
                value="light"
                className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                <Sun size={13} className="text-neutral-400" />
                <span>Light Mode</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="dark"
                className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                <Moon size={13} className="text-neutral-400" />
                <span>Dark Mode</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="system"
                className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                <Laptop size={13} className="text-neutral-400" />
                <span>System Standard</span>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-800 my-1" />

            <DropdownMenuGroup>
              {/* <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer text-neutral-700 dark:text-neutral-300 font-medium transition-all">
                <Settings size={13} className="text-neutral-400" />
                <span>Console Preferences</span>
              </DropdownMenuItem> */}
              <Link href="/docs">
                <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer text-neutral-700 dark:text-neutral-300 font-medium transition-all">
                  <HelpCircle size={13} className="text-neutral-400" />
                  <span>Knowledge Hub Support</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-800 my-1" />

            <DropdownMenuItem
              onClick={handleLogoutAction}
              className="flex items-center gap-2 px-2 py-2 rounded-md text-neutral-900 dark:text-neutral-50 hover:bg-neutral-950 dark:hover:bg-white hover:text-white dark:hover:text-neutral-950 cursor-pointer font-semibold transition-all"
            >
              <LogOut size={13} className="shrink-0" />
              <span>Sign Out Session</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}




