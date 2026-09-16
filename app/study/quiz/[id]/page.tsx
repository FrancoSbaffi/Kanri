import React from "react";
import prisma from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import { QuizRunner } from "@/components/study/quiz-runner";

export const revalidate = 0;

export default async function QuizPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const subject = await prisma.subject.findUnique({
    where: { id },
    include: {
      questions: true,
    },
  });

  if (!subject) notFound();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-[var(--border-subtle)] pb-4 text-center">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Simulacro de Examen & Evaluación
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          {subject.name} · Preguntas teóricas y prácticas
        </p>
      </div>

      <QuizRunner subject={subject} questions={subject.questions} />
    </div>
  );
}
