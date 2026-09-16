import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SubjectSummary {
  id: string;
  name: string;
  code?: string | null;
  color: string;
  averageMastery: number;
  classesCount: number;
  materialsCount: number;
}

export function SubjectRows({ subjects }: { subjects: SubjectSummary[] }) {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-primary)] font-semibold">
          Materias del Cuatrimestre
        </h2>
        <Link
          href="/subjects"
          className="font-mono text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition"
        >
          Gestionar
        </Link>
      </div>

      <div className="mt-3 divide-y divide-[var(--border-subtle)]">
        {subjects.map((subj) => {
          const mastery = Math.round(subj.averageMastery);
          return (
            <Link
              key={subj.id}
              href={`/subjects/${subj.id}`}
              className="py-3 px-2 flex items-center justify-between text-xs hover:bg-black/[0.02] dark:hover:bg-white/[0.02] rounded transition group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: subj.color || "#090a0f" }}
                />
                <div className="min-w-0">
                  <div className="font-medium text-[var(--text-primary)] group-hover:opacity-80 transition truncate">
                    {subj.name}
                  </div>
                  <div className="font-mono text-[10px] text-[var(--text-muted)] mt-0.5">
                    {subj.code || "UCABA"} · {subj.classesCount} clases · {subj.materialsCount} archivos
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="w-20 sm:w-28 hidden sm:block">
                  <div className="flex items-center justify-between font-mono text-[9px] text-[var(--text-muted)] mb-1">
                    <span>DOMINIO</span>
                    <span className="text-[var(--text-primary)] font-bold">{mastery}%</span>
                  </div>
                  <div className="w-full h-1 rounded bg-black/[0.06] dark:bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full transition-all duration-300 bg-[var(--text-primary)]"
                      style={{ width: `${mastery}%` }}
                    />
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
