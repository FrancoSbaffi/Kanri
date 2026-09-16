import React from "react";
import prisma from "@/lib/db/prisma";
import { TasksList } from "@/components/tasks/tasks-list";
import { CreateTaskModal } from "@/components/tasks/create-task-modal";

export const revalidate = 0;

export default async function TasksPage() {
  const [assignments, subjects] = await Promise.all([
    prisma.assignment.findMany({
      include: { subject: true },
      orderBy: { dueDate: "asc" },
    }),
    prisma.subject.findMany({
      where: { status: "active" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Trabajos Prácticos & Entregas
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Gestión de consignas, plazos de entrega y prioridades académicas
          </p>
        </div>
        <CreateTaskModal subjects={subjects} />
      </div>

      <TasksList initialTasks={assignments} />
    </div>
  );
}
