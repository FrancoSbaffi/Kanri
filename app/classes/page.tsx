import React from "react";
import prisma from "@/lib/db/prisma";
import Link from "next/link";
import { GraduationCap, Calendar, Clock, MapPin, ArrowRight, FileText } from "lucide-react";
import { formatDateEs } from "@/lib/utils/dates";
import { GenerateScheduleModal } from "@/components/classes/generate-schedule-modal";

export const revalidate = 0;

export default async function ClassesPage() {
  const [classes, subjects] = await Promise.all([
    prisma.classSession.findMany({
      include: {
        subject: true,
        materials: true,
        summaries: true,
      },
      orderBy: { date: "asc" },
    }),
    prisma.subject.findMany({
      where: { status: "active" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Clases & Sesiones Universitarias
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Cronograma completo del cuatrimestre, aulas y materiales adjuntos
          </p>
        </div>
        <GenerateScheduleModal subjects={subjects} />
      </div>

      {/* Classes list */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] divide-y divide-[var(--border-subtle)]">
        {classes.map((c) => (
          <Link
            key={c.id}
            href={`/classes/${c.id}`}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--bg-surface-elevated)] transition group text-xs"
          >
            <div className="flex items-start gap-3 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                style={{ backgroundColor: c.subject.color }}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition truncate">
                    {c.title}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded border uppercase font-bold ${
                      c.modality === "presencial"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}
                  >
                    {c.modality}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2.5 text-[11px] text-[var(--text-muted)]">
                  <span>{c.subject.name}</span>
                  <span>·</span>
                  <span>{formatDateEs(c.date, { includeDayName: true })}</span>
                  <span>·</span>
                  <span>{c.startTime} - {c.endTime} hs</span>
                  {c.room && (
                    <>
                      <span>·</span>
                      <span>{c.room}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                <FileText className="w-3.5 h-3.5" />
                <span>{c.materials.length} PDFs</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                  c.attendanceStatus === "attended"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                }`}
              >
                {c.attendanceStatus === "attended" ? "Asistida" : "Pendiente"}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition" />
            </div>
          </Link>
        ))}

        {classes.length === 0 && (
          <div className="py-12 text-center text-xs text-[var(--text-muted)]">
            No hay clases registradas. Usa el generador automático arriba para crearlas.
          </div>
        )}
      </div>
    </div>
  );
}
