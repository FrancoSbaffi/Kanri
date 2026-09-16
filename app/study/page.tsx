import React from "react";
import prisma from "@/lib/db/prisma";
import { StudyCenterClient } from "@/components/study/study-center-client";

export const revalidate = 0;

export default async function StudyPage(props: {
  searchParams: Promise<{ subjectId?: string; topicId?: string }>;
}) {
  const { subjectId, topicId } = await props.searchParams;

  const subjects = await prisma.subject.findMany({
    where: { status: "active" },
    include: {
      topics: {
        orderBy: { masteryScore: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Centro de Estudio & Modo Enfoque
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Temporizador Pomodoro, selección inteligente de temas y registro de dificultad
        </p>
      </div>

      <StudyCenterClient
        subjects={subjects}
        initialSubjectId={subjectId}
        initialTopicId={topicId}
      />
    </div>
  );
}
