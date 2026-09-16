"use client";

import React, { useState } from "react";
import { updateAssignmentStatus } from "@/app/actions/tasks";
import { formatDateEs } from "@/lib/utils/dates";
import { CheckSquare, Calendar, AlertTriangle, Clock } from "lucide-react";

interface AssignmentItem {
  id: string;
  title: string;
  description?: string | null;
  dueDate: Date;
  priority: string;
  status: string;
  subject: {
    id: string;
    name: string;
    color: string;
  };
}

export function TasksList({ initialTasks }: { initialTasks: AssignmentItem[] }) {
  const [tasks, setTasks] = useState<AssignmentItem[]>(initialTasks);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const handleToggle = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "completed" ? "todo" : "completed";
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
    );
    await updateAssignmentStatus(id, nextStatus as any);
  };

  const filtered = tasks.filter((t) => {
    if (filter === "pending") return t.status !== "completed";
    if (filter === "completed") return t.status === "completed";
    return true;
  });

  return (
    <div className="space-y-4 text-xs">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-[var(--bg-surface-elevated)] p-1 rounded-lg border border-[var(--border-subtle)] w-fit">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-md font-medium transition ${
            filter === "all"
              ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          Todos ({tasks.length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-3 py-1 rounded-md font-medium transition ${
            filter === "pending"
              ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          Pendientes ({tasks.filter((t) => t.status !== "completed").length})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-3 py-1 rounded-md font-medium transition ${
            filter === "completed"
              ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          Completados ({tasks.filter((t) => t.status === "completed").length})
        </button>
      </div>

      {/* Task Rows */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] divide-y divide-[var(--border-subtle)]">
        {filtered.map((t) => {
          const isCompleted = t.status === "completed";
          const priorityBadge =
            t.priority === "urgent" || t.priority === "high"
              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
              : t.priority === "medium"
              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
              : "bg-blue-500/10 text-blue-400 border-blue-500/20";

          return (
            <div
              key={t.id}
              className={`p-4 flex items-start justify-between gap-3 transition ${
                isCompleted ? "opacity-60 bg-[var(--bg-surface-elevated)]/30" : "hover:bg-[var(--bg-surface-elevated)]"
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => handleToggle(t.id, t.status)}
                  className="mt-1 rounded border-[var(--border-strong)] text-[var(--accent)] cursor-pointer"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: t.subject.color }}
                    />
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {t.subject.name}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded border uppercase font-bold ${priorityBadge}`}
                    >
                      {t.priority}
                    </span>
                  </div>

                  <h3
                    className={`font-semibold text-xs mt-1 ${
                      isCompleted ? "line-through text-[var(--text-muted)]" : "text-[var(--text-primary)]"
                    }`}
                  >
                    {t.title}
                  </h3>

                  {t.description && (
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1 line-clamp-2">
                      {t.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] font-mono">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDateEs(t.dueDate)}</span>
                </div>
                <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
                  {isCompleted ? "Completado" : "Pendiente"}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-10 text-center text-xs text-[var(--text-muted)]">
            No hay trabajos o tareas en esta vista.
          </div>
        )}
      </div>
    </div>
  );
}
