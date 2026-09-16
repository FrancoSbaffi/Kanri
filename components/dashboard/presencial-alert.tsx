"use client";

import React from "react";
import Link from "next/link";
import { Building2, ArrowRight, MapPin, Clock } from "lucide-react";

interface PresencialClassAlertProps {
  upcomingClass: {
    id: string;
    title: string;
    date: Date;
    startTime: string;
    endTime: string;
    room?: string | null;
    location?: string | null;
    subject: {
      name: string;
      color: string;
    };
  } | null;
}

export function PresencialAlert({ upcomingClass }: PresencialClassAlertProps) {
  if (!upcomingClass) return null;

  return (
    <div className="rounded-lg border border-amber-500/30 dark:border-amber-500/20 bg-amber-500/[0.08] dark:bg-amber-500/[0.03] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs transition">
      <div className="flex items-start gap-3.5">
        <div className="w-8 h-8 rounded border border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
          <Building2 className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-700 dark:text-amber-400 font-semibold">
              [Alerta Presencial Próxima]
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded border border-amber-500/40 dark:border-amber-500/30 bg-amber-500/15 text-amber-800 dark:text-amber-300">
              Sede UCABA
            </span>
          </div>
          <p className="mt-1 text-sm font-semibold tracking-tight text-[var(--text-primary)]">
            {upcomingClass.subject.name} — {upcomingClass.title}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-4 text-[11px] text-[var(--text-secondary)] font-mono">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              {upcomingClass.startTime} – {upcomingClass.endTime} hs
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              {upcomingClass.room || "Aula Magna 102"} · {upcomingClass.location || "Sede UCABA"}
            </span>
          </div>
        </div>
      </div>

      <Link
        href={`/classes/${upcomingClass.id}`}
        className="baseframe-btn-secondary shrink-0"
      >
        <span>Ver clase</span>
        <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
      </Link>
    </div>
  );
}
