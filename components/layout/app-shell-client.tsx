"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { CommandPalette } from "./command-palette";

interface AppShellClientProps {
  children: React.ReactNode;
  subjects: { id: string; name: string; color: string; code?: string | null }[];
  notifications: any[];
  dueReviewsCount: number;
  upcomingExamsCount: number;
}

export function AppShellClient({
  children,
  subjects,
  notifications,
  dueReviewsCount,
  upcomingExamsCount,
}: AppShellClientProps) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  // When on the Baseframe Home Landing page, render full screen without app sidebar
  if (isLanding) {
    return (
      <div className="min-h-screen w-full bg-[#08090c] text-white">
        {children}
        <CommandPalette />
      </div>
    );
  }

  // Inside the academic operating workspace (/dashboard, /calendar, /subjects, etc.)
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-main)] text-[var(--text-primary)]">
      {/* Sidebar */}
      <Sidebar
        subjects={subjects}
        reviewsDueCount={dueReviewsCount}
        upcomingExamsCount={upcomingExamsCount}
      />

      {/* Main Workspace Canvas */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header notifications={notifications} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto w-full">{children}</div>
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette />
    </div>
  );
}
