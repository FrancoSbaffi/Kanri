"use client";

import React, { useState } from "react";
import { togglePlanItemCompleted } from "@/app/actions/exams";
import { formatDateEs } from "@/lib/utils/dates";
import { CheckCircle2, Calendar, Sparkles } from "lucide-react";

interface PlanItem {
  id: string;
  scheduledDate: Date;
  title: string;
  description?: string | null;
  completed: boolean;
  order: number;
}

export function ExamPlanChecklist({ planItems }: { planItems: PlanItem[] }) {
  const [items, setItems] = useState<PlanItem[]>(planItems);

  const handleToggle = async (id: string, currentCompleted: boolean) => {
    const newCompleted = !currentCompleted;
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, completed: newCompleted } : it))
    );
    await togglePlanItemCompleted(id, newCompleted);
  };

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--accent)]" />
          <h3 className="font-semibold text-xs text-[var(--text-primary)] uppercase tracking-wider">
            Plan de Preparación Automatizado
          </h3>
        </div>
        <span className="text-[11px] text-[var(--text-muted)]">
          {items.filter((i) => i.completed).length} de {items.length} completados
        </span>
      </div>

      <div className="space-y-2.5">
        {items.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => handleToggle(item.id, item.completed)}
            className={`p-3 rounded-lg border transition cursor-pointer flex items-center justify-between gap-3 ${
              item.completed
                ? "border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]/40 opacity-70"
                : "border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-[var(--border-strong)]"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => {}} // handled by parent div onClick
                className="rounded border-[var(--border-strong)] text-[var(--accent)] cursor-pointer"
              />
              <div className="min-w-0">
                <span
                  className={`font-medium ${
                    item.completed
                      ? "line-through text-[var(--text-muted)]"
                      : "text-[var(--text-primary)]"
                  }`}
                >
                  {item.title}
                </span>
                {item.description && (
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    {item.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] font-mono shrink-0">
              <Calendar className="w-3 h-3" />
              <span>{formatDateEs(item.scheduledDate)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
