"use client";

import React from "react";
import Link from "next/link";
import { formatDateEs } from "@/lib/utils/dates";
import { Calendar, ChevronRight } from "lucide-react";

interface ScheduleItem {
  id: string;
  type: "class" | "assignment" | "exam";
  title: string;
  date: Date;
  time?: string;
  subjectName: string;
  subjectColor: string;
  detail?: string;
  badge?: string;
  url: string;
}

export function UpcomingSchedule({ items }: { items: ScheduleItem[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 text-xs text-center text-[var(--text-muted)] font-mono">
        No hay actividades académicas programadas para los próximos 7 días.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-primary)] font-semibold">
          Próximos 7 Días
        </h2>
        <div className="flex items-center gap-3">
          <a
            href="/api/calendar/export"
            download="kanri_calendario_ucaba.ics"
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1.5 transition font-mono"
            title="Exportar calendario en formato .ics"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-[11px]">Exportar (.ics)</span>
          </a>
          <span className="text-[var(--border-subtle)]">|</span>
          <Link
            href="/calendar"
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1 transition font-mono text-[11px]"
          >
            <span>Ver todo</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="mt-3 divide-y divide-[var(--border-subtle)]">
        {items.map((item) => {
          return (
            <Link
              key={item.id}
              href={item.url}
              className="py-2.5 flex items-center justify-between text-xs hover:bg-black/[0.02] dark:hover:bg-white/[0.02] px-2 rounded transition group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.subjectColor || "#090a0f" }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--text-primary)] group-hover:opacity-80 transition truncate">
                      {item.title}
                    </span>
                    {item.badge && (
                      <span
                        className={`font-mono text-[9px] px-1.5 py-0.2 rounded border uppercase tracking-wider ${
                          item.badge === "presencial"
                            ? "border-amber-500/40 dark:border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"
                            : item.badge === "virtual"
                            ? "border-blue-500/40 dark:border-blue-500/30 bg-blue-500/10 text-blue-800 dark:text-blue-300"
                            : "border-rose-500/40 dark:border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-2 mt-0.5 font-mono">
                    <span>{item.subjectName}</span>
                    {item.detail && (
                      <>
                        <span className="text-[var(--border-subtle)]">·</span>
                        <span>{item.detail}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 font-mono">
                <div className="text-xs text-[var(--text-secondary)]">
                  {formatDateEs(item.date)}
                </div>
                {item.time && (
                  <div className="text-[10px] text-[var(--text-muted)]">{item.time} hs</div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
