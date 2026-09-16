import React from "react";
import prisma from "@/lib/db/prisma";
import { DailyHero } from "@/components/dashboard/daily-hero";
import { PresencialAlert } from "@/components/dashboard/presencial-alert";
import { ExamCountdown } from "@/components/dashboard/exam-countdown";
import { StudyRecommendations } from "@/components/dashboard/study-recommendations";
import { UpcomingSchedule } from "@/components/dashboard/upcoming-schedule";
import { SubjectRows } from "@/components/dashboard/subject-rows";
import { generateDailyStudyPlan, StudyCandidate } from "@/lib/ai/study-planner";
import Link from "next/link";
import { Layers, ArrowRight, BookOpen, Clock } from "lucide-react";

export const revalidate = 0; // Fresh academic data

export default async function DashboardPage() {
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);

  // 1. Fetch User
  const user = await prisma.user.findFirst();

  // 2. Fetch Subjects with topics and classes count
  const subjects = await prisma.subject.findMany({
    where: { status: "active" },
    include: {
      topics: true,
      classes: true,
      materials: true,
    },
    orderBy: { name: "asc" },
  });

  // 3. Upcoming presencial class warning (first upcoming class within 48h that is presencial)
  const upcomingPresencialClass = await prisma.classSession.findFirst({
    where: {
      modality: "presencial",
      date: { gte: now },
    },
    include: { subject: true },
    orderBy: { date: "asc" },
  });

  // 4. Upcoming classes within 7 days
  const upcomingClasses = await prisma.classSession.findMany({
    where: {
      date: { gte: now, lte: nextWeek },
    },
    include: { subject: true },
    orderBy: { date: "asc" },
  });

  // 5. Next Exam
  const nextExam = await prisma.exam.findFirst({
    where: {
      status: "upcoming",
      date: { gte: now },
    },
    include: {
      subject: true,
      topics: { include: { topic: true } },
      planItems: { orderBy: { order: "asc" } },
    },
    orderBy: { date: "asc" },
  });

  // 6. Assignments pending
  const pendingAssignments = await prisma.assignment.findMany({
    where: {
      status: { not: "completed" },
    },
    include: { subject: true },
    orderBy: { dueDate: "asc" },
  });

  // 7. Flashcards due for review today (SM-2)
  const dueFlashcards = await prisma.flashcard.findMany({
    where: {
      nextReviewAt: { lte: now },
    },
    include: { topic: true, subject: true },
    take: 10,
  });

  // 8. Prepare study candidates for Daily AI Recommendation Engine
  const studyCandidates: StudyCandidate[] = [];
  for (const s of subjects) {
    for (const t of s.topics) {
      let daysUntilExam: number | null = null;
      let examTitle: string | null = null;

      if (nextExam && nextExam.subjectId === s.id) {
        const diffDays = Math.ceil(
          (new Date(nextExam.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        daysUntilExam = Math.max(0, diffDays);
        examTitle = nextExam.title;
      }

      const isOverdue = t.nextReviewAt && new Date(t.nextReviewAt) <= now;
      const overdueDays = isOverdue
        ? Math.max(1, Math.ceil((now.getTime() - new Date(t.nextReviewAt!).getTime()) / (1000 * 60 * 60 * 24)))
        : 0;

      studyCandidates.push({
        subjectId: s.id,
        subjectName: s.name,
        topicId: t.id,
        topicName: t.name,
        masteryScore: t.masteryScore,
        importance: t.importance,
        daysUntilExam,
        examTitle,
        overdueReviewDays: overdueDays,
        flashcardsCount: 3,
      });
    }
  }

  const dailyStudyRecommendations = generateDailyStudyPlan(studyCandidates, 90);

  // 9. Format timeline schedule items
  const scheduleItems: any[] = [];

  for (const c of upcomingClasses) {
    scheduleItems.push({
      id: `class-${c.id}`,
      type: "class",
      title: c.title,
      date: c.date,
      time: `${c.startTime} - ${c.endTime}`,
      subjectName: c.subject.name,
      subjectColor: c.subject.color,
      detail: c.room || "Aula 304",
      badge: c.modality,
      url: `/classes/${c.id}`,
    });
  }

  for (const a of pendingAssignments) {
    scheduleItems.push({
      id: `task-${a.id}`,
      type: "assignment",
      title: a.title,
      date: a.dueDate,
      time: "23:59",
      subjectName: a.subject.name,
      subjectColor: a.subject.color,
      detail: `Prioridad ${a.priority}`,
      badge: "Entrega",
      url: "/tasks",
    });
  }

  if (nextExam) {
    scheduleItems.push({
      id: `exam-${nextExam.id}`,
      type: "exam",
      title: nextExam.title,
      date: nextExam.date,
      time: nextExam.startTime || "18:00",
      subjectName: nextExam.subject.name,
      subjectColor: nextExam.subject.color,
      detail: nextExam.room || "Aula Magna",
      badge: "Examen",
      url: `/exams/${nextExam.id}`,
    });
  }

  scheduleItems.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Subject rows summary
  const subjectRowsData = subjects.map((s) => {
    const avg =
      s.topics.length > 0
        ? s.topics.reduce((acc, curr) => acc + curr.masteryScore, 0) / s.topics.length
        : 70;
    return {
      id: s.id,
      name: s.name,
      code: s.code,
      color: s.color,
      averageMastery: avg,
      classesCount: s.classes.length,
      materialsCount: s.materials.length,
    };
  });

  const daysUntilNextExam = nextExam
    ? Math.max(0, Math.ceil((new Date(nextExam.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Daily Hero */}
      <DailyHero
        userName={user?.name || "Estudiante"}
        upcomingClassesCount={upcomingClasses.length}
        assignmentsDueCount={pendingAssignments.length}
        reviewsDueCount={dueFlashcards.length}
        daysUntilNextExam={daysUntilNextExam}
      />

      {/* 2. Presencial Class Warning Alert */}
      {upcomingPresencialClass && (
        <PresencialAlert upcomingClass={upcomingPresencialClass} />
      )}

      {/* 3. Primary Focus: Next Exam Live Countdown */}
      {nextExam && <ExamCountdown exam={nextExam} />}

      {/* 4. Two columns: AI Study Recommendations & Due Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StudyRecommendations
            recommendations={dailyStudyRecommendations}
            totalMinutes={90}
          />
        </div>

        {/* Due Spaced Reviews widget - Baseframe Modular Card */}
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded border border-black/10 dark:border-white/10 bg-black/[0.04] dark:bg-white/[0.04] text-[var(--text-primary)] flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-primary)] font-semibold">
                    Repasos SM-2
                  </h2>
                  <div className="text-[11px] text-[var(--text-muted)]">Espaciado de retención activa</div>
                </div>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.04] text-[var(--text-secondary)]">
                {dueFlashcards.length} pendientes
              </span>
            </div>

            <div className="mt-3 space-y-1.5">
              {dueFlashcards.slice(0, 4).map((fc) => (
                <div
                  key={fc.id}
                  className="p-2.5 rounded border border-black/[0.04] dark:border-white/[0.04] bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-xs flex items-center justify-between transition"
                >
                  <span className="truncate max-w-[190px] text-[var(--text-secondary)] font-medium">
                    {fc.front}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] px-1.5 py-0.2 rounded border border-[var(--border-subtle)] bg-black/[0.01] dark:bg-white/[0.02]">
                    {fc.difficulty}
                  </span>
                </div>
              ))}
              {dueFlashcards.length === 0 && (
                <p className="text-xs text-[var(--text-muted)] py-4 text-center font-mono">
                  No hay tarjetas pendientes para hoy.
                </p>
              )}
            </div>
          </div>

          <Link
            href="/reviews"
            className="baseframe-btn-secondary mt-5 w-full py-2"
          >
            <span>Abrir sesión de repaso</span>
            <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </Link>
        </div>
      </div>

      {/* 5. Two columns: Upcoming 7-day schedule & Compact Subject Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingSchedule items={scheduleItems} />
        <SubjectRows subjects={subjectRowsData} />
      </div>
    </div>
  );
}
