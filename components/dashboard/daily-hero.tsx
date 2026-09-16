import React from "react";
import { formatDateEs } from "@/lib/utils/dates";

interface DailyHeroProps {
  userName: string;
  upcomingClassesCount: number;
  assignmentsDueCount: number;
  reviewsDueCount: number;
  daysUntilNextExam: number | null;
}

export function DailyHero({
  userName,
  upcomingClassesCount,
  assignmentsDueCount,
  reviewsDueCount,
  daysUntilNextExam,
}: DailyHeroProps) {
  const todayFormatted = formatDateEs(new Date(), { includeDayName: true, includeYear: true });

  return (
    <div className="space-y-4">
      {/* Baseframe Hero Title & Monospace Status Tag */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Sistema Activo · 2° Cuatrimestre 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            Buenos días, {userName}
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider mt-1">
            {todayFormatted} · UCABA Campus & Cursada
          </p>
        </div>
      </div>

      {/* Baseframe Operational Metric Grid (Inspired by Baseframe's 4-column client grid) */}
      <div className="border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface)] overflow-hidden">
        <div className="px-4 py-2 border-b border-[var(--border-subtle)] bg-black/[0.01] dark:bg-white/[0.01] flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
          <span>Métricas Operativas Académicas</span>
          <span>UCABA · TIEMPO REAL</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-subtle)]">
          {/* Metric 1 */}
          <div className="p-4 sm:p-5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Próximas Clases
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--text-primary)] mt-1.5">
              {upcomingClassesCount}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>{upcomingClassesCount === 1 ? "próxima sesión" : "próximas sesiones"}</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="p-4 sm:p-5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Entregas Pendientes
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--text-primary)] mt-1.5">
              {assignmentsDueCount}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>{assignmentsDueCount === 1 ? "trabajo práctico" : "trabajos prácticos"}</span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="p-4 sm:p-5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Repasos SM-2 Hoy
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--text-primary)] mt-1.5">
              {reviewsDueCount}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>tarjetas para repasar</span>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="p-4 sm:p-5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Próximo Parcial
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--text-primary)] mt-1.5">
              {daysUntilNextExam !== null ? `${daysUntilNextExam} d` : "Al día"}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>cuenta regresiva activa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
