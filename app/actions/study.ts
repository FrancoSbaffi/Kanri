"use server";

import prisma from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function recordStudySession({
  subjectId,
  topicId,
  durationMinutes,
  difficultyRated,
  notes,
}: {
  subjectId: string;
  topicId?: string;
  durationMinutes: number;
  difficultyRated: "easy" | "normal" | "hard";
  notes?: string;
}) {
  try {
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("Usuario no encontrado");

    const session = await prisma.studySession.create({
      data: {
        userId: user.id,
        subjectId,
        topicId: topicId || null,
        durationMinutes,
        difficultyRated,
        notes,
        startedAt: new Date(Date.now() - durationMinutes * 60 * 1000),
        endedAt: new Date(),
      },
    });

    // If a topic was studied, increase its mastery score slightly
    if (topicId) {
      const topic = await prisma.topic.findUnique({ where: { id: topicId } });
      if (topic) {
        const delta = difficultyRated === "easy" ? 8 : difficultyRated === "normal" ? 5 : 2;
        await prisma.topic.update({
          where: { id: topicId },
          data: {
            masteryScore: Math.min(100, topic.masteryScore + delta),
            lastReviewedAt: new Date(),
          },
        });
      }
    }

    try {
      revalidatePath("/dashboard");
      revalidatePath("/study");
      revalidatePath("/analytics");
    } catch {}

    return { success: true, session };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function submitQuizResults({
  subjectId,
  topicId,
  score,
  totalQuestions,
  durationSeconds,
}: {
  subjectId: string;
  topicId?: string;
  score: number;
  totalQuestions: number;
  durationSeconds?: number;
}) {
  try {
    const percentage = Math.round((score / Math.max(1, totalQuestions)) * 100);

    const user = await prisma.user.findFirst();
    if (user) {
      await prisma.quizAttempt.create({
        data: {
          userId: user.id,
          subjectId,
          score,
          totalQuestions,
          percentage,
          durationSeconds: durationSeconds || 0,
        },
      });
    }

    if (topicId) {
      const topic = await prisma.topic.findUnique({ where: { id: topicId } });
      if (topic) {
        const updatedScore = Math.round(topic.masteryScore * 0.5 + percentage * 0.5);
        await prisma.topic.update({
          where: { id: topicId },
          data: {
            masteryScore: Math.max(0, Math.min(100, updatedScore)),
            lastReviewedAt: new Date(),
          },
        });
      }
    } else {
      const subjectTopics = await prisma.topic.findMany({ where: { subjectId } });
      for (const t of subjectTopics) {
        const updatedScore = Math.round(t.masteryScore * 0.6 + percentage * 0.4);
        await prisma.topic.update({
          where: { id: t.id },
          data: {
            masteryScore: Math.max(0, Math.min(100, updatedScore)),
            lastReviewedAt: new Date(),
          },
        });
      }
    }

    try {
      revalidatePath(`/subjects/${subjectId}`);
      revalidatePath("/dashboard");
      revalidatePath("/study");
      revalidatePath("/analytics");
    } catch {}

    return { success: true, percentage };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}
