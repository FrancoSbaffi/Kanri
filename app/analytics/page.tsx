import React from "react";
import prisma from "@/lib/db/prisma";
import {
  BarChart3,
  Clock,
  Layers,
  Award,
  BookOpen,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

export const revalidate = 0;

export default async function AnalyticsPage() {
  const [studySessions, reviewSessions, topics, subjects] = await Promise.all([
    prisma.studySession.findMany({
      include: { subject: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.reviewSession.findMany(),
    prisma.topic.findMany({
      include: { subject: true },
      orderBy: { masteryScore: "asc" },
    }),
    prisma.subject.findMany({
      where: { status: "active" },
      include: { topics: true },
    }),
  ]);

  const totalStudyMinutes = studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalHours = Math.floor(totalStudyMinutes / 60);
  const remainingMinutes = totalStudyMinutes % 60;

  const totalReviews = reviewSessions.length;
  const overallAvgMastery =
    topics.length > 0
      ? Math.round(topics.reduce((acc, t) => acc + t.masteryScore, 0) / topics.length)
      : 70;

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-xs">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Progreso & Analítica Académica
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Horas de estudio acumuladas, efectividad de repasos y dominio por materia
        </p>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-[11px]">
            <span>Tiempo de Estudio</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-1">
            {totalHours}h {remainingMinutes}m
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">
            {studySessions.length} sesiones registradas
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-[11px]">
            <span>Repasos SM-2</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-1">
            {totalReviews}
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">
            tarjetas evaluadas en el ciclo
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-[11px]">
            <span>Dominio Promedio</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-1">
            {overallAvgMastery}%
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">
            en {topics.length} temas analizados
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-[11px]">
            <span>Materias Activas</span>
            <BookOpen className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-1">
            {subjects.length}
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">
            2° Cuatrimestre 2026
          </div>
        </div>
      </div>

      {/* Two columns: Subject Mastery Comparison & Topics Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Mastery Progress Bars */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
          <h3 className="font-semibold text-xs text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2.5">
            Dominio Académico por Materia
          </h3>
          <div className="space-y-3.5">
            {subjects.map((s) => {
              const avg =
                s.topics.length > 0
                  ? Math.round(
                      s.topics.reduce((acc, t) => acc + t.masteryScore, 0) / s.topics.length
                    )
                  : 65;

              return (
                <div key={s.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                      <span className="font-semibold text-[var(--text-primary)]">
                        {s.name}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[var(--text-primary)]">
                      {avg}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--bg-surface-elevated)] overflow-hidden">
                    <div
                      className={`h-full ${
                        avg >= 75
                          ? "bg-emerald-500"
                          : avg >= 50
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${avg}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weakest Topics Needing Work */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
          <h3 className="font-semibold text-xs text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2.5">
            Temas con Mayor Brecha de Aprendizaje
          </h3>
          <div className="space-y-2.5">
            {topics.slice(0, 5).map((t) => (
              <div
                key={t.id}
                className="p-2.5 rounded-lg bg-[var(--bg-surface-elevated)] flex items-center justify-between"
              >
                <div className="min-w-0">
                  <div className="font-medium text-[var(--text-primary)] truncate">
                    {t.name}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
                    {t.subject.name} · Importancia {t.importance}
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-rose-400">
                  {t.masteryScore}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
