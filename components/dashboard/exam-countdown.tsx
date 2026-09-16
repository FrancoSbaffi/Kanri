"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getCountdownParts, formatDateEs } from "@/lib/utils/dates";
import { AlertTriangle, CheckCircle2, Play, BookOpen } from "lucide-react";

interface ExamCountdownProps {
  exam: {
    id: string;
    title: string;
    date: Date;
    startTime?: string | null;
    room?: string | null;
    subject: {
      id: string;
      name: string;
      color: string;
    };
    topics: {
      topic: {
        id: string;
        name: string;
        masteryScore: number;
      };
    }[];
    planItems: {
      id: string;
      completed: boolean;
    }[];
  } | null;
}

export function ExamCountdown({ exam }: ExamCountdownProps) {
  const [countdown, setCountdown] = useState(
    exam ? getCountdownParts(exam.date) : null
  );

  useEffect(() => {
    if (!exam) return;
    const timer = setInterval(() => {
      setCountdown(getCountdownParts(exam.date));
    }, 1000);
    return () => clearInterval(timer);
  }, [exam]);

  if (!exam || !countdown) return null;

  // Calculate preparation score from plan items and topic mastery
  const totalPlan = exam.planItems.length;
  const completedPlan = exam.planItems.filter((p) => p.completed).length;
  const planRatio = totalPlan > 0 ? completedPlan / totalPlan : 0.5;

  const topicScores = exam.topics.map((t) => t.topic.masteryScore);
  const avgMastery =
    topicScores.length > 0
      ? topicScores.reduce((a, b) => a + b, 0) / topicScores.length
      : 70;

  const preparationScore = Math.round(planRatio * 40 + (avgMastery / 100) * 60);
  const weakTopics = exam.topics.filter((t) => t.topic.masteryScore < 65);

  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 transition">
      {/* Baseframe Operational Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3.5">
        <div className="flex items-center gap-2.5">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: exam.subject.color || "#090a0f" }}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
            {exam.subject.name}
          </span>
          <span className="text-[var(--text-muted)]">/</span>
          <span className="text-xs text-[var(--text-primary)] font-medium">
            {exam.title}
          </span>
        </div>
        <div className="font-mono text-[11px] text-[var(--text-muted)]">
          {formatDateEs(exam.date, { includeDayName: true })} · {exam.startTime || "18:00"} hs
          {exam.room ? ` · ${exam.room}` : ""}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-5">
        {/* Live Countdown numbers in Baseframe Monospace grid */}
        <div className="flex flex-col justify-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-2.5">
            Tiempo Restante
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-2 rounded border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] text-center min-w-[54px]">
              <div className="text-2xl font-bold font-mono tracking-tight text-[var(--text-primary)]">
                {countdown.days}
              </div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">días</div>
            </div>
            <span className="text-[var(--text-muted)] font-mono font-bold">:</span>
            <div className="px-3 py-2 rounded border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] text-center min-w-[54px]">
              <div className="text-2xl font-bold font-mono tracking-tight text-[var(--text-primary)]">
                {countdown.hours.toString().padStart(2, "0")}
              </div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">hs</div>
            </div>
            <span className="text-[var(--text-muted)] font-mono font-bold">:</span>
            <div className="px-3 py-2 rounded border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] text-center min-w-[54px]">
              <div className="text-2xl font-bold font-mono tracking-tight text-[var(--text-primary)]">
                {countdown.minutes.toString().padStart(2, "0")}
              </div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">min</div>
            </div>
            <span className="text-[var(--text-muted)] font-mono font-bold">:</span>
            <div className="px-2.5 py-2 rounded border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.01] text-center min-w-[44px]">
              <div className="text-lg font-bold font-mono tracking-tight text-[var(--text-muted)]">
                {countdown.seconds.toString().padStart(2, "0")}
              </div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">seg</div>
            </div>
          </div>
        </div>

        {/* Preparation Progress Bar */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-2.5">
            <span>Preparación Estimada</span>
            <span className="text-[var(--text-primary)] font-mono font-bold">{preparationScore}%</span>
          </div>
          <div className="w-full h-1.5 rounded bg-black/[0.06] dark:bg-white/[0.06] overflow-hidden">
            <div
              className="h-full transition-all duration-300 bg-[var(--text-primary)]"
              style={{ width: `${preparationScore}%` }}
            />
          </div>
          <div className="mt-2.5 font-mono text-[10px] text-[var(--text-muted)] flex items-center justify-between">
            <span>{completedPlan} de {totalPlan} hitos listos</span>
            <span>Promedio: {Math.round(avgMastery)}%</span>
          </div>
        </div>

        {/* Weak Topics / Baseframe CTA Button */}
        <div className="flex flex-col justify-between pt-1">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>{weakTopics.length} Temas a Reforzar</span>
            </div>
            <div className="space-y-1">
              {weakTopics.slice(0, 2).map((t) => (
                <div
                  key={t.topic.id}
                  className="text-xs text-[var(--text-secondary)] flex items-center justify-between"
                >
                  <span className="truncate max-w-[170px]">{t.topic.name}</span>
                  <span className="text-[var(--text-primary)] font-mono text-[11px] font-semibold">
                    {t.topic.masteryScore}%
                  </span>
                </div>
              ))}
              {weakTopics.length === 0 && (
                <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Todos los temas evaluados en buen nivel</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3.5 flex items-center gap-2">
            {/* Baseframe High Contrast Primary Button */}
            <Link
              href={`/exams/${exam.id}`}
              className="baseframe-btn-primary flex-1"
            >
              <Play className="w-3 h-3" />
              <span>Hoja de Ruta</span>
            </Link>
            <Link
              href={`/study?subjectId=${exam.subject.id}`}
              className="baseframe-btn-secondary p-2"
              title="Estudiar materia"
            >
              <BookOpen className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
