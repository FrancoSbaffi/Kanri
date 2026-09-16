import React from "react";
import prisma from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  GraduationCap,
  FileText,
  Sparkles,
  CheckSquare,
  Clock,
  Layers,
  Building2,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Upload,
} from "lucide-react";
import { formatDateEs } from "@/lib/utils/dates";
import { SubjectTabs } from "@/components/subjects/subject-tabs";
import { calculateSubjectMastery } from "@/lib/utils/mastery";
import { HelpCircle } from "lucide-react";

export const revalidate = 0;

export default async function SubjectDetailPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const activeTab = searchParams.tab || "overview";

  const subject = await prisma.subject.findUnique({
    where: { id },
    include: {
      semester: true,
      classes: {
        include: { materials: true, summaries: true, topics: { include: { flashcards: true } } },
        orderBy: { date: "asc" },
      },
      topics: {
        include: { flashcards: true, concepts: true, questions: true },
        orderBy: { masteryScore: "asc" },
      },
      materials: {
        include: { classSession: true },
        orderBy: { uploadedAt: "desc" },
      },
      exams: {
        include: {
          planItems: { orderBy: { order: "asc" } },
          topics: { include: { topic: { include: { flashcards: true, questions: true } } } },
        },
        orderBy: { date: "asc" },
      },
      assignments: {
        orderBy: { dueDate: "asc" },
      },
      flashcards: true,
      questions: true,
      quizAttempts: {
        orderBy: { createdAt: "desc" },
      },
      studySessions: true,
    },
  });

  if (!subject) notFound();

  // Next class
  const nextClass = subject.classes.find((c) => new Date(c.date) >= new Date());
  // Next exam
  const nextExam = subject.exams.find((e) => new Date(e.date) >= new Date() && e.status === "upcoming");

  // Real practice-driven mastery calculation
  const mastery = calculateSubjectMastery({
    topics: subject.topics,
    flashcards: subject.flashcards,
    quizAttempts: subject.quizAttempts,
    studySessions: subject.studySessions,
    totalQuestions: subject.questions.length,
  });

  const weakTopics = subject.topics.filter((t) => t.masteryScore < 60);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-1">
            <Link href="/subjects" className="hover:text-[var(--text-primary)] transition">
              Materias
            </Link>
            <span>/</span>
            <span className="text-[var(--text-secondary)] font-medium">
              {subject.code || subject.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: subject.color || "#6366f1" }}
            />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              {subject.name}
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
              {subject.semester.name}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
            {subject.professor && <span>Prof. {subject.professor}</span>}
            {subject.commission && (
              <>
                <span>·</span>
                <span>{subject.commission}</span>
              </>
            )}
            <span>·</span>
            <span>{subject.credits || 4} Créditos</span>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/study?subjectId=${subject.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--accent)] hover:opacity-90 text-white text-xs font-medium transition"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Estudiar Materia</span>
          </Link>

          <Link
            href={`/library?subjectId=${subject.id}&action=upload`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] text-xs font-medium text-[var(--text-primary)] transition"
          >
            <Upload className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span>Subir PDF</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1">
              <div className="text-[11px] text-[var(--text-muted)]">Dominio general</div>
              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${mastery.statusBadgeColor}`}>
                {mastery.statusLabel}
              </span>
            </div>
            <div className="text-lg font-bold font-mono text-[var(--text-primary)] mt-1">
              {mastery.overallScore}%
            </div>
            <div className="w-full h-1.5 rounded-full bg-[var(--bg-surface-elevated)] mt-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${mastery.progressBarColor}`}
                style={{ width: `${mastery.overallScore}%` }}
              />
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] text-[var(--text-muted)]">
            <span className="truncate">
              {mastery.quizStats.hasPracticed
                ? `${mastery.quizStats.attemptsCount} simulacro(s) (${mastery.quizStats.avgScore}%)`
                : "Sin simulacros rendidos"}
            </span>
            <Link
              href={`/study/quiz/${subject.id}`}
              className="text-indigo-400 hover:text-indigo-300 font-medium shrink-0 ml-1"
            >
              Rendir →
            </Link>
          </div>
        </div>

        <div className="p-3.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="text-[11px] text-[var(--text-muted)]">Próxima Clase</div>
          <div className="text-xs font-semibold text-[var(--text-primary)] mt-1 truncate">
            {nextClass ? nextClass.title : "Sin clases agendadas"}
          </div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">
            {nextClass ? `${formatDateEs(nextClass.date)} · ${nextClass.room || "Aula 304"}` : "Al día"}
          </div>
        </div>

        <div className="p-3.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="text-[11px] text-[var(--text-muted)]">Próximo Examen</div>
          <div className="text-xs font-semibold text-[var(--text-primary)] mt-1 truncate">
            {nextExam ? nextExam.title : "Sin exámenes próximos"}
          </div>
          <div className="text-[11px] text-rose-400 mt-1 font-medium">
            {nextExam ? formatDateEs(nextExam.date) : "Al día"}
          </div>
        </div>

        <div className="p-3.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="text-[11px] text-[var(--text-muted)]">Temas Débiles</div>
          <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
            {weakTopics.length}
          </div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">
            de {subject.topics.length} temas evaluados
          </div>
        </div>
      </div>

      {/* Practice & Mastery Breakdown Banner */}
      <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-xs text-[var(--text-primary)]">
              Diagnóstico de Preparación para Examen
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${mastery.statusBadgeColor}`}>
              {mastery.statusLabel}
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            {mastery.practiceRecommendations[0] ||
              "Tu dominio general se calcula a partir de tus simulacros de examen de cátedra (45%), flashcards SM-2 (35%) y sesiones de estudio (20%)."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            href={`/study/quiz/${subject.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-xs transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Simulacro de Cátedra ({subject.questions.length} preguntas)</span>
          </Link>

          <Link
            href={`/reviews?subjectId=${subject.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-active)] font-medium text-[var(--text-primary)] transition"
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Repasar Flashcards ({subject.flashcards.length})</span>
          </Link>
        </div>
      </div>

      {/* Tabs Layout */}
      <SubjectTabs
        subject={subject}
        activeTab={activeTab}
        weakTopics={weakTopics}
      />
    </div>
  );
}
