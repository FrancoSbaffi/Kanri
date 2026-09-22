import React from "react";
import prisma from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  Laptop,
  FileText,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Layers,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import { formatDateEs } from "@/lib/utils/dates";
import { formatFileName } from "@/lib/utils/format";
import { ClassUploader } from "@/components/classes/class-uploader";
import { AttendanceSelector } from "@/components/classes/attendance-selector";
import { ClassNotesEditor } from "@/components/classes/class-notes-editor";

export const revalidate = 0;

export default async function ClassDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const classSession = await prisma.classSession.findUnique({
    where: { id },
    include: {
      subject: true,
      materials: { orderBy: { uploadedAt: "desc" } },
      summaries: { orderBy: { createdAt: "desc" } },
      topics: {
        include: { flashcards: true },
        orderBy: { masteryScore: "asc" },
      },
      questions: true,
    },
  });

  if (!classSession) notFound();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-1">
            <Link
              href={`/subjects/${classSession.subject.id}`}
              className="hover:text-[var(--text-primary)] transition flex items-center gap-1.5"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: classSession.subject.color }}
              />
              {classSession.subject.name}
            </Link>
            <span>/</span>
            <span className="text-[var(--text-secondary)] font-medium">
              Clase {classSession.classNumber.toString().padStart(2, "0")}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            {classSession.title}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              {formatDateEs(classSession.date, { includeDayName: true, includeYear: true })}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              {classSession.startTime} – {classSession.endTime} hs
            </span>
            <span>·</span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                classSession.modality === "presencial"
                  ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                  : "bg-blue-500/10 text-blue-300 border-blue-500/20"
              }`}
            >
              {classSession.modality === "presencial" ? (
                <>
                  <Building2 className="w-3 h-3 text-amber-400" />
                  <span>Presencial en Sede</span>
                </>
              ) : (
                <>
                  <Laptop className="w-3 h-3 text-blue-400" />
                  <span>Virtual (Campus / Zoom)</span>
                </>
              )}
            </span>
            {classSession.room ? (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  {classSession.room} ({classSession.location || "Sede UCABA"})
                </span>
              </>
            ) : classSession.modality === "virtual" ? (
              <>
                <span>·</span>
                <span className="flex items-center gap-1 text-[var(--text-muted)]">
                  Campus Virtual UCABA
                </span>
              </>
            ) : null}
          </div>
        </div>

        {/* Top Actions: Export to Mac & Attendance Status */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <a
            href={`/api/calendar/export?classId=${classSession.id}`}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] text-xs font-medium text-[var(--text-primary)] transition"
            title="Sincronizar esta clase con la aplicación Calendario"
          >
            <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Añadir a Calendario (.ics)</span>
          </a>

          <AttendanceSelector
            classId={classSession.id}
            currentStatus={classSession.attendanceStatus}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* PDF Uploader */}
          <ClassUploader
            subjectId={classSession.subject.id}
            classId={classSession.id}
          />

          {/* AI Structured Summaries */}
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                  Resumen Estructurado Inteligente
                </h3>
              </div>
              <span className="text-[11px] text-[var(--text-muted)]">
                {classSession.summaries.length} versión generada
              </span>
            </div>

            {classSession.summaries.length > 0 ? (
              <div className="space-y-4">
                {classSession.summaries.map((summary) => (
                  <div
                    key={summary.id}
                    className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-[var(--text-primary)]">
                        {summary.title}
                      </h4>
                      <Link
                        href={`/summaries/${summary.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--accent)] text-white font-medium hover:opacity-90 transition text-xs"
                      >
                        <span>Abrir en Lector Dividido</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {summary.overview}
                    </p>

                    {summary.simplifiedExplanation && (
                      <div className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[11px]">
                        <span className="font-semibold text-amber-400 block mb-1">
                          Explicación intuitiva:
                        </span>
                        <p className="text-[var(--text-secondary)]">
                          {summary.simplifiedExplanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-[var(--text-muted)]">
                Aún no has generado un resumen para esta clase. Sube el PDF arriba para extraerlo automáticamente.
              </div>
            )}
          </div>

          {/* Class Notes Notebook */}
          <ClassNotesEditor
            classId={classSession.id}
            initialNotes={classSession.notes}
            classTitle={classSession.title}
          />
        </div>

        {/* Right sidebar: Materials list, Topics, and Exam Questions */}
        <div className="space-y-6">
          {/* Uploaded Materials */}
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-xs">
            <h3 className="font-semibold text-xs text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2.5 mb-3">
              Archivos ({classSession.materials.length})
            </h3>
            <div className="space-y-2">
              {classSession.materials.map((m) => (
                <div
                  key={m.id}
                  className="p-2.5 rounded-lg bg-[var(--bg-surface-elevated)] flex items-center justify-between"
                >
                  <div className="min-w-0 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate font-medium text-[var(--text-primary)]">
                      {formatFileName(m.fileName)}
                    </span>
                  </div>
                  <a
                    href={`/api/materials/${m.id}/file`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition"
                    title="Ver PDF"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
              {classSession.materials.length === 0 && (
                <p className="text-[11px] text-[var(--text-muted)] py-2 text-center">
                  Sin archivos adjuntos.
                </p>
              )}
            </div>
          </div>

          {/* Topics from this class */}
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-xs">
            <h3 className="font-semibold text-xs text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2.5 mb-3">
              Temas Extraídos ({classSession.topics.length})
            </h3>
            <div className="space-y-2">
              {classSession.topics.map((t) => (
                <div
                  key={t.id}
                  className="p-2 rounded-lg bg-[var(--bg-surface-elevated)] flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-[var(--text-primary)] truncate">
                      {t.name}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)]">
                      Dominio: {t.masteryScore}% · {t.importance}
                    </div>
                  </div>
                  <Link
                    href={`/study?subjectId=${classSession.subject.id}&topicId=${t.id}`}
                    className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Questions generated */}
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-xs">
            <h3 className="font-semibold text-xs text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2.5 mb-3">
              Preguntas de Examen ({classSession.questions.length})
            </h3>
            <div className="space-y-2">
              {classSession.questions.slice(0, 3).map((q) => (
                <div
                  key={q.id}
                  className="p-2.5 rounded-lg bg-[var(--bg-surface-elevated)] text-[11px] space-y-1"
                >
                  <div className="font-medium text-[var(--text-primary)]">
                    {q.question}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    Rta: {q.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
