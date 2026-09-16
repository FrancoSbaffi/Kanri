"use server";

import prisma from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function togglePlanItemCompleted(itemId: string, completed: boolean) {
  try {
    const item = await prisma.preparationPlanItem.update({
      where: { id: itemId },
      data: { completed },
    });

    revalidatePath("/exams");
    revalidatePath("/dashboard");
    return { success: true, item };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function createExam(data: {
  subjectId: string;
  title: string;
  examType: string;
  date: string;
  startTime?: string;
  room?: string;
  notes?: string;
}) {
  try {
    const exam = await prisma.exam.create({
      data: {
        subjectId: data.subjectId,
        title: data.title,
        examType: data.examType,
        date: new Date(data.date),
        startTime: data.startTime || "18:00",
        room: data.room || "Aula Magna",
        notes: data.notes,
        status: "upcoming",
      },
    });

    // Auto-generate a 4-step preparation plan
    const daysBefore = [14, 7, 3, 1];
    const titles = [
      "Lectura y consolidación de resúmenes teóricos",
      "Resolución de ejercicios prácticos y guías",
      "Simulacro de examen y repaso de preguntas clave",
      "Repaso ágil de flashcards y descanso",
    ];

    for (let i = 0; i < daysBefore.length; i++) {
      const scheduled = new Date(new Date(data.date).getTime() - daysBefore[i] * 24 * 60 * 60 * 1000);
      if (scheduled > new Date()) {
        await prisma.preparationPlanItem.create({
          data: {
            examId: exam.id,
            scheduledDate: scheduled,
            title: titles[i],
            completed: false,
            order: i + 1,
          },
        });
      }
    }

    revalidatePath("/exams");
    revalidatePath("/dashboard");
    return { success: true, exam };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}
