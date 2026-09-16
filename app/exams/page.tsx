import React from "react";
import prisma from "@/lib/db/prisma";
import Link from "next/link";
import { Sparkles, Calendar, MapPin, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { formatDateEs, getCountdownParts } from "@/lib/utils/dates";
import { CreateExamModal } from "@/components/exams/create-exam-modal";

export const revalidate = 0;

export default async function ExamsPage() {
  const [exams, subjects] = await Promise.all([
    prisma.exam.findMany({
      include: {
        subject: true,
        planItems: true,
        topics: { include: { topic: true } },
      },
      orderBy: { date: "asc" },
    }),
    prisma.subject.findMany({
      where: { status: "active" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Exámenes & Evaluaciones
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Cuentas regresivas en tiempo real, hojas de ruta y porcentaje de preparación
          </p>
        </div>
        <CreateExamModal subjects={subjects} />
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exams.map((exam) => {
          const countdown = getCountdownParts(exam.date);
          const totalPlan = exam.planItems.length;
          const completedPlan = exam.planItems.filter((p) => p.completed).length;
          const prepScore =
            totalPlan > 0
              ? Math.round((completedPlan / totalPlan) * 100)
              : 60;

          return (
            <Link
              key={exam.id}
              href={`/exams/${exam.id}`}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] p-5 transition group flex flex-col justify-between text-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: exam.subject.color }}
                    />
                    <span className="font-semibold text-[11px] text-[var(--text-muted)] uppercase tracking-wider truncate">
                      {exam.subject.name}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-rose-400">
                    {countdown.isPast ? "Finalizado" : `${countdown.days}d ${countdown.hours}h`}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] transition mt-2">
                  {exam.title}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    {formatDateEs(exam.date, { includeDayName: true, includeYear: true })}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    {exam.startTime || "18:00"} hs
                  </span>
                  {exam.room && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        {exam.room}
                      </span>
                    </>
                  )}
                </div>

                {(() => {
                  let rubric: any = null;
                  try {
                    rubric = JSON.parse(exam.notes || "{}");
                  } catch {
                    rubric = null;
                  }

                  if (rubric && rubric.institution) {
                    return (
                      <div className="mt-2.5 space-y-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                            Ponderación: {rubric.weightPercentage}%
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                            {rubric.gradingScale?.includes("70%") ? "Aprobación con 70% (Nota 7)" : `Aprobación: >= ${rubric.passingGrade}`}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2">
                          {rubric.format}
                        </p>
                      </div>
                    );
                  }

                  if (exam.notes) {
                    return (
                      <p className="mt-2.5 text-[11px] text-[var(--text-secondary)] line-clamp-2">
                        {exam.notes}
                      </p>
                    );
                  }

                  return null;
                })()}
              </div>

              <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                  <span>Preparación</span>
                  <span className="font-mono text-[var(--text-primary)] font-semibold">
                    {prepScore}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[var(--bg-surface-elevated)] overflow-hidden">
                  <div
                    className={`h-full ${prepScore >= 75 ? "bg-emerald-500" : "bg-amber-500"}`}
                    style={{ width: `${prepScore}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-1">
                  <span>{completedPlan} de {totalPlan} hitos listos</span>
                  <span className="inline-flex items-center gap-1 text-[var(--text-primary)] group-hover:text-[var(--accent)] font-medium transition">
                    Ver hoja de ruta
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
