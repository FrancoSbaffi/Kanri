import React from "react";
import prisma from "@/lib/db/prisma";
import { AppShellClient } from "./app-shell-client";

export async function AppShell({ children }: { children: React.ReactNode }) {
  // Fetch navigation context server-side
  const [subjects, notifications, dueReviewsCount, upcomingExamsCount] = await Promise.all([
    prisma.subject.findMany({
      where: { status: "active" },
      select: { id: true, name: true, color: true, code: true },
      orderBy: { name: "asc" },
    }),
    prisma.notification.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    }),
    prisma.flashcard.count({
      where: {
        nextReviewAt: { lte: new Date() },
      },
    }),
    prisma.exam.count({
      where: {
        status: "upcoming",
        date: { gte: new Date() },
      },
    }),
  ]);

  return (
    <AppShellClient
      subjects={subjects}
      notifications={notifications}
      dueReviewsCount={dueReviewsCount}
      upcomingExamsCount={upcomingExamsCount}
    >
      {children}
    </AppShellClient>
  );
}
