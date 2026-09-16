import React from "react";
import prisma from "@/lib/db/prisma";
import Link from "next/link";
import { Plus, BookOpen, GraduationCap, FileText, ArrowRight, UserCheck, Layers } from "lucide-react";
import { CreateSubjectModal } from "@/components/subjects/create-subject-modal";

export const revalidate = 0;

export default async function SubjectsPage() {
  const subjects = await prisma.subject.findMany({
    include: {
      classes: true,
      materials: true,
      topics: true,
      exams: { where: { status: "upcoming" } },
      assignments: { where: { status: { not: "completed" } } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Materias Universitarias
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            2° Cuatrimestre 2026 · Plan de Estudios Ingeniería
          </p>
        </div>
        <CreateSubjectModal />
      </div>

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((subj) => {
          const avgMastery =
            subj.topics.length > 0
              ? Math.round(
                  subj.topics.reduce((acc, t) => acc + t.masteryScore, 0) / subj.topics.length
                )
              : 65;

          return (
            <Link
              key={subj.id}
              href={`/subjects/${subj.id}`}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] p-5 transition group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: subj.color || "#6366f1" }}
                    />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] transition truncate">
                        {subj.name}
                      </h3>
                      <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-2 mt-0.5">
                        <span>{subj.code || "Comisión 3K2"}</span>
                        <span>·</span>
                        <span>{subj.credits || 4} Créditos</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    {subj.status}
                  </span>
                </div>

                {subj.description && (
                  <p className="mt-3 text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {subj.description}
                  </p>
                )}

                {subj.professor && (
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{subj.professor}</span>
                    {subj.commission && <span>({subj.commission})</span>}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] space-y-3">
                {/* Mastery Bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] mb-1">
                    <span>Dominio de la materia</span>
                    <span className="font-mono text-[var(--text-primary)] font-semibold">
                      {avgMastery}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[var(--bg-surface-elevated)] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        avgMastery >= 75
                          ? "bg-emerald-500"
                          : avgMastery >= 50
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${avgMastery}%` }}
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-1">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      {subj.classes.length} clases
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {subj.materials.length} PDFs
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition">
                    Ver materia
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
