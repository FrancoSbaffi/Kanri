import React from "react";
import prisma from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  HelpCircle,
  Layers,
} from "lucide-react";
import { formatDateEs, getCountdownParts } from "@/lib/utils/dates";
import { ExamPlanChecklist } from "@/components/exams/exam-plan-checklist";

export const revalidate = 0;

export default async function ExamDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const exam = await prisma.exam.findUnique({
    where: { id },
    include: {
      subject: true,
      planItems: { orderBy: { order: "asc" } },
      topics: {
        include: { topic: true },
      },
    },
  });

  if (!exam) notFound();

  const countdown = getCountdownParts(exam.date);
  const totalPlan = exam.planItems.length;
  const completedPlan = exam.planItems.filter((p) => p.completed).length;
  const prepScore =
    totalPlan > 0 ? Math.round((completedPlan / totalPlan) * 100) : 60;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-1">
            <Link href="/exams" className="hover:text-[var(--text-primary)] transition">
              Exámenes
            </Link>
            <span>/</span>
            <span className="text-[var(--text-secondary)] font-medium">
              {exam.subject.name}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            {exam.title}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
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
                  {exam.room} ({exam.location || "Campus Central"})
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <a
            href={`/api/calendar/export?examId=${exam.id}`}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] text-xs font-medium text-[var(--text-primary)] transition"
            title="Sincronizar esta fecha de examen con la aplicación Calendario"
          >
            <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Añadir a Calendario (.ics)</span>
          </a>

          <Link
            href={`/study?subjectId=${exam.subject.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[var(--accent)] text-white text-xs font-medium hover:opacity-90 transition"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Iniciar Estudio</span>
          </Link>
          <Link
            href={`/study/quiz/${exam.subject.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] text-xs font-medium text-[var(--text-primary)] transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Simulacro Quiz</span>
          </Link>
        </div>
      </div>

      {/* Countdown and Preparation Bar */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
            Cuenta Regresiva
          </div>
          <div className="flex items-baseline gap-2 text-[var(--text-primary)] font-mono text-2xl sm:text-3xl font-bold">
            {countdown.days}d {countdown.hours}h {countdown.minutes}m
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Fecha límite: {formatDateEs(exam.date)}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
            <span>Nivel de Preparación</span>
            <span className="font-mono text-[var(--text-primary)]">{prepScore}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--bg-surface-elevated)] mt-2 overflow-hidden">
            <div
              className={`h-full ${prepScore >= 75 ? "bg-emerald-500" : "bg-amber-500"}`}
              style={{ width: `${prepScore}%` }}
            />
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">
            {completedPlan} de {totalPlan} hitos del plan completados
          </p>
        </div>

        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
            Temas Evaluados
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">
            {exam.topics.length} temas clave
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Vinculados a resúmenes y flashcards
          </p>
        </div>
      </div>

      {/* Official UCABA Rubric & Evaluation Framework */}
      {(() => {
        let rubric: any = null;
        try {
          rubric = JSON.parse(exam.notes || "{}");
        } catch {
          rubric = null;
        }

        if (rubric && rubric.institution) {
          return (
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                    Rúbrica Oficial UCABA
                  </span>
                  <h3 className="font-semibold text-xs text-[var(--text-primary)] uppercase tracking-wider">
                    {rubric.instanceType || exam.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] px-2.5 py-1 rounded bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] font-medium">
                    Ponderación: <strong className="text-[var(--text-primary)]">{rubric.weightPercentage}%</strong>
                  </span>
                  <span className="text-[11px] px-2.5 py-1 rounded bg-[var(--bg-surface-elevated)] text-emerald-400 border border-emerald-500/20 font-medium">
                    Promoción Directa: <strong className="text-emerald-300">&gt;= {rubric.promotionGrade}</strong>
                  </span>
                  <span className="text-[11px] px-2.5 py-1 rounded bg-[var(--bg-surface-elevated)] text-amber-400 border border-amber-500/20 font-medium">
                    Aprobación: <strong className="text-amber-300">&gt;= {rubric.passingGrade}</strong>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Modalidad & Formato de Examen
                  </div>
                  <p className="text-[11px] text-[var(--text-primary)] leading-relaxed bg-[var(--bg-surface-elevated)] p-3.5 rounded-lg border border-[var(--border-subtle)]">
                    {rubric.format}
                  </p>
                  {rubric.professors && (
                    <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5 pt-1">
                      <span>Mesa Examinadora:</span>
                      <strong className="text-[var(--text-secondary)]">{rubric.professors}</strong>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Criterios de Evaluación Obligatorios de Cátedra
                  </div>
                  <ul className="text-[11px] text-[var(--text-secondary)] space-y-1.5 bg-[var(--bg-surface-elevated)] p-3.5 rounded-lg border border-[var(--border-subtle)] list-disc list-inside leading-relaxed">
                    {rubric.keyCriteria?.map((criterion: string, idx: number) => (
                      <li key={idx} className="text-[var(--text-primary)]">
                        <span className="text-[var(--text-secondary)]">{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {rubric.evaluatedScope && (
                <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[var(--text-muted)]">
                  <span><strong>Alcance Oficial de Cátedra:</strong> {rubric.evaluatedScope}</span>
                  <span className="font-mono text-[10px] text-[var(--accent)]">UCABA · Licenciatura en Tecnologías Digitales</span>
                </div>
              )}
            </div>
          );
        }

        if (exam.notes) {
          return (
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-xs">
              <div className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                Notas y Pautas de Evaluación
              </div>
              <p className="text-[var(--text-primary)] leading-relaxed">
                {exam.notes}
              </p>
            </div>
          );
        }

        return null;
      })()}

      {/* Two columns: Roadmap Checklist & Topics evaluated */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Left 2 cols: Automatic Preparation Plan Roadmap */}
        <div className="lg:col-span-2">
          <ExamPlanChecklist planItems={exam.planItems} />
        </div>

        {/* Right col: Topics evaluated in this exam with mastery bars */}
        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-3">
            <h3 className="font-semibold text-xs text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2.5">
              Estado de los Temas
            </h3>
            <div className="space-y-3">
              {exam.topics.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[var(--text-primary)] truncate max-w-[190px]">
                      {item.topic.name}
                    </span>
                    <span className="font-mono text-[11px] text-[var(--text-muted)]">
                      {item.topic.masteryScore}%
                    </span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-[var(--bg-surface-elevated)] overflow-hidden">
                    <div
                      className={`h-full ${
                        item.topic.masteryScore >= 75
                          ? "bg-emerald-500"
                          : item.topic.masteryScore >= 50
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${item.topic.masteryScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-3">
            <h3 className="font-semibold text-xs text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2.5">
              Herramientas de Refuerzo
            </h3>
            <div className="space-y-2">
              <Link
                href={`/reviews?subjectId=${exam.subject.id}`}
                className="p-2.5 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] flex items-center justify-between text-[var(--text-primary)] font-medium transition"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>Repasar Flashcards SM-2</span>
                </div>
                <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
