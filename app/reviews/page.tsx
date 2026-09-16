import React from "react";
import prisma from "@/lib/db/prisma";
import { FlashcardPlayer } from "@/components/reviews/flashcard-player";
import Link from "next/link";
import { Layers, Sparkles, HelpCircle, CheckCircle2, Clock } from "lucide-react";

export const revalidate = 0;

function getSubjectShortName(name: string): string {
  const map: Record<string, string> = {
    "Administración de Negocios Digitales": "Negocios Digitales",
    "Gestión del Talento Humano en la Industria Digital": "Talento Humano",
    "Sistemas Digitales": "Sistemas Digitales",
    "Taller: Emprendedurismo en Innovación Digital": "Emprendedurismo",
  };
  return map[name] || name;
}

export default async function ReviewsPage(props: {
  searchParams: Promise<{ subjectId?: string; mode?: string }>;
}) {
  const { subjectId, mode = "due" } = await props.searchParams;

  const now = new Date();

  // Fetch subjects with flashcard counts
  const subjects = await prisma.subject.findMany({
    where: { status: "active" },
    select: {
      id: true,
      name: true,
      color: true,
      _count: {
        select: {
          flashcards: true,
          questions: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const selectedSubject = subjects.find((s) => s.id === subjectId);

  // Determine query criteria
  const isAllMode = mode === "all";
  const whereClause: any = {};

  if (subjectId) {
    whereClause.subjectId = subjectId;
  }

  if (!isAllMode) {
    whereClause.nextReviewAt = { lte: now };
  }

  let flashcards = await prisma.flashcard.findMany({
    where: whereClause,
    include: {
      subject: true,
      topic: true,
    },
    orderBy: isAllMode ? { createdAt: "asc" } : { nextReviewAt: "asc" },
  });

  // If due mode has 0 cards, automatically fallback to all cards of that subject so user can always study
  let isFallback = false;
  if (flashcards.length === 0 && !isAllMode) {
    flashcards = await prisma.flashcard.findMany({
      where: subjectId ? { subjectId } : {},
      include: {
        subject: true,
        topic: true,
      },
      orderBy: { createdAt: "asc" },
    });
    isFallback = true;
  }

  // Count totals
  const totalCardsCount = subjects.reduce((acc, s) => acc + s._count.flashcards, 0);
  const currentSubjectTotal = selectedSubject
    ? selectedSubject._count.flashcards
    : totalCardsCount;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Repasos Espaciados (SM-2)
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Active Recall
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Algoritmo SuperMemo adaptativo basado en curva de olvido y dificultad percibida por cátedra
          </p>
        </div>

        {/* Action button to Quiz */}
        {selectedSubject && (
          <div className="flex items-center gap-2">
            <Link
              href={`/study/quiz/${selectedSubject.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] text-xs font-medium text-[var(--text-primary)] transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Simulacro Quiz ({selectedSubject._count.questions})</span>
            </Link>
          </div>
        )}
      </div>

      {/* Filter and Mode Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[var(--bg-surface)] p-2.5 rounded-xl border border-[var(--border-subtle)] text-xs shadow-xs">
        {/* Subject Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full">
          <Link
            href={`/reviews${mode ? `?mode=${mode}` : ""}`}
            className={`px-3 py-1.5 rounded-lg transition-all shrink-0 font-medium flex items-center gap-1.5 ${
              !subjectId
                ? "bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--border-strong)] shadow-xs"
                : "border border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]/60"
            }`}
          >
            <span>Todas</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                !subjectId
                  ? "bg-[var(--bg-surface-active)] text-[var(--text-secondary)] font-semibold"
                  : "opacity-60"
              }`}
            >
              {totalCardsCount}
            </span>
          </Link>
          {subjects.map((s) => {
            const isCurrent = subjectId === s.id;
            return (
              <Link
                key={s.id}
                href={`/reviews?subjectId=${s.id}${mode ? `&mode=${mode}` : ""}`}
                title={s.name}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
                  isCurrent
                    ? "bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--border-strong)] font-medium shadow-xs"
                    : "border border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]/60"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full transition-transform shrink-0"
                  style={{
                    backgroundColor: s.color,
                    boxShadow: isCurrent ? `0 0 8px ${s.color}` : "none",
                  }}
                />
                <span>{getSubjectShortName(s.name)}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    isCurrent
                      ? "bg-[var(--bg-surface-active)] text-[var(--text-secondary)] font-semibold"
                      : "opacity-60"
                  }`}
                >
                  {s._count.flashcards}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 shrink-0 bg-[var(--bg-main)] p-1 rounded-lg border border-[var(--border-subtle)] self-start md:self-auto">
          <Link
            href={`/reviews?${subjectId ? `subjectId=${subjectId}&` : ""}mode=due`}
            className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium transition flex items-center gap-1.5 ${
              !isAllMode
                ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs border border-[var(--border-subtle)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>Pendientes SM-2</span>
          </Link>
          <Link
            href={`/reviews?${subjectId ? `subjectId=${subjectId}&` : ""}mode=all`}
            className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium transition flex items-center gap-1.5 ${
              isAllMode
                ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs border border-[var(--border-subtle)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Banco Completo</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]">
              {currentSubjectTotal}
            </span>
          </Link>
        </div>
      </div>

      {isFallback && !isAllMode && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            ¡Estás al día con tus repasos programados! Te mostramos todas las tarjetas de la materia para práctica libre de examen.
          </span>
        </div>
      )}

      <FlashcardPlayer
        key={`${subjectId || "all"}_${mode}`}
        flashcards={flashcards}
      />
    </div>
  );
}
