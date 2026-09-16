"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Clock, Play, CheckCircle } from "lucide-react";
import { StudyRecommendation } from "@/lib/ai/study-planner";

interface StudyRecommendationsProps {
  recommendations: StudyRecommendation[];
  totalMinutes?: number;
}

export function StudyRecommendations({
  recommendations,
  totalMinutes = 90,
}: StudyRecommendationsProps) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 text-center">
        <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
        <h3 className="text-xs font-semibold text-[var(--text-primary)]">
          Estás al día con la cursada
        </h3>
        <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-mono">
          No hay repasos vencidos ni temas críticos pendientes para hoy.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6">
      {/* Baseframe Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded border border-black/10 dark:border-white/10 bg-black/[0.04] dark:bg-white/[0.04] text-[var(--text-primary)] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-primary)] font-semibold">
              Plan de Estudio Inteligente
            </h2>
            <div className="text-[11px] text-[var(--text-muted)]">Priorizado según fechas clave y algoritmo SM-2</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] font-mono text-xs text-[var(--text-secondary)]">
          <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span>{totalMinutes} min hoy</span>
        </div>
      </div>

      {/* Recommendations list */}
      <div className="mt-3 divide-y divide-[var(--border-subtle)]">
        {recommendations.map((item, idx) => {
          const priorityBadge =
            item.priority === "critical"
              ? "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
              : item.priority === "high"
              ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
              : "border-black/10 dark:border-white/10 bg-black/[0.04] dark:bg-white/[0.04] text-[var(--text-secondary)]";

          return (
            <div
              key={idx}
              className="py-3 px-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-black/[0.02] dark:hover:bg-white/[0.02] rounded transition group"
            >
              <div className="flex items-start gap-3 min-w-0">
                <span className="font-mono text-[11px] text-[var(--text-muted)] mt-0.5 shrink-0">
                  [{String(idx + 1).padStart(2, "0")}]
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--text-primary)] truncate">
                      {item.topic}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      · {item.subject}
                    </span>
                    <span
                      className={`font-mono text-[9px] px-1.5 py-0.2 rounded border uppercase tracking-wider ${priorityBadge}`}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-normal">
                    {item.reason}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="font-mono text-xs text-[var(--text-muted)]">
                  {item.durationMinutes} min
                </span>
                {/* Baseframe High Contrast Primary Button */}
                <Link
                  href={item.actionUrl}
                  className="baseframe-btn-primary"
                >
                  <Play className="w-3 h-3" />
                  <span>Comenzar</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
