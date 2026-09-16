"use server";

import prisma from "@/lib/db/prisma";
import { calculateSM2 } from "@/lib/spaced-repetition/sm2";
import { revalidatePath } from "next/cache";

export async function submitFlashcardReview(
  flashcardId: string,
  rating: number // 1=hard, 2=good, 3=easy
) {
  try {
    const card = await prisma.flashcard.findUnique({
      where: { id: flashcardId },
      include: { topic: true },
    });

    if (!card) throw new Error("Flashcard no encontrada");

    // Map 1-3 to SM-2 1-5 scale: 1 -> 2 (hard), 2 -> 4 (good), 3 -> 5 (easy)
    const sm2Rating = rating === 1 ? 2 : rating === 2 ? 4 : 5;

    const result = calculateSM2({
      rating: sm2Rating,
      repetitions: card.repetitions,
      interval: card.interval,
      easeFactor: card.easeFactor,
    });

    // Update flashcard
    await prisma.flashcard.update({
      where: { id: flashcardId },
      data: {
        repetitions: result.repetitions,
        interval: result.interval,
        easeFactor: result.easeFactor,
        nextReviewAt: result.nextReviewAt,
        lastReviewedAt: new Date(),
      },
    });

    // If card has an associated topic, update topic mastery score
    if (card.topicId && card.topic) {
      const newScore = Math.max(0, Math.min(100, card.topic.masteryScore + result.masteryScoreDelta));
      await prisma.topic.update({
        where: { id: card.topicId },
        data: {
          masteryScore: newScore,
          lastReviewedAt: new Date(),
        },
      });
    }

    // Get user
    const user = await prisma.user.findFirst();
    if (user) {
      await prisma.reviewSession.create({
        data: {
          userId: user.id,
          flashcardId: card.id,
          topicId: card.topicId,
          rating: sm2Rating,
          difficulty: rating === 1 ? "hard" : rating === 2 ? "normal" : "easy",
        },
      });
    }

    revalidatePath("/reviews");
    revalidatePath("/dashboard");
    revalidatePath("/study");

    return { success: true, nextReviewAt: result.nextReviewAt, interval: result.interval };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}
