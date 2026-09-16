export interface SubjectMasteryBreakdown {
  overallScore: number; // 0 - 100
  statusLabel: string;
  statusBadgeColor: string; // Tailwind class
  progressBarColor: string;
  quizStats: {
    attemptsCount: number;
    avgScore: number;
    totalQuestions: number;
    hasPracticed: boolean;
  };
  flashcardStats: {
    totalCards: number;
    reviewedCards: number;
    retentionRate: number; // %
    masteredCards: number; // interval >= 3
    hasPracticed: boolean;
  };
  studyStats: {
    totalMinutes: number;
    sessionsCount: number;
  };
  practiceRecommendations: string[];
}

export function calculateSubjectMastery({
  topics,
  flashcards,
  quizAttempts,
  studySessions,
  totalQuestions,
}: {
  topics: { masteryScore: number }[];
  flashcards: {
    id: string;
    repetitions: number;
    interval: number;
    easeFactor: number;
    lastReviewedAt: Date | null;
  }[];
  quizAttempts: { score: number; totalQuestions: number; percentage: number }[];
  studySessions: { durationMinutes: number }[];
  totalQuestions: number;
}): SubjectMasteryBreakdown {
  // 1. Quizzes & Mock Exams Component (45% weight)
  let quizScore = 0;
  const quizCount = quizAttempts.length;
  let avgQuizScore = 0;

  if (quizCount > 0) {
    avgQuizScore = Math.round(
      quizAttempts.reduce((acc, q) => acc + q.percentage, 0) / quizCount
    );
    quizScore = avgQuizScore;
  }

  // 2. Flashcards & SM-2 Component (35% weight)
  const totalCards = flashcards.length;
  const reviewedCards = flashcards.filter((f) => f.repetitions > 0).length;
  const masteredCards = flashcards.filter((f) => f.interval >= 3 && f.repetitions >= 2).length;

  let flashcardScore = 0;
  let retentionRate = 0;

  if (totalCards > 0 && reviewedCards > 0) {
    // Retention based on easeFactor (2.5 is default, > 2.3 indicates solid retention)
    const avgEase =
      flashcards
        .filter((f) => f.repetitions > 0)
        .reduce((acc, f) => acc + f.easeFactor, 0) / reviewedCards;
    retentionRate = Math.min(100, Math.round((avgEase / 2.5) * 85));

    // Coverage (50%), Mastery (30%), Retention (20%)
    const coverage = (reviewedCards / totalCards) * 50;
    const masteryRate = (masteredCards / totalCards) * 30;
    const retentionPart = (retentionRate / 100) * 20;
    flashcardScore = Math.min(100, Math.round(coverage + masteryRate + retentionPart));
  }

  // 3. Study Sessions & Focus Component (20% weight)
  const totalMinutes = studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const targetMinutes = 120; // 2 hours of focused study baseline
  const studyScore = Math.min(100, Math.round((totalMinutes / targetMinutes) * 100));

  // 4. Overall Weighted Score Calculation
  // Baseline initial score for having active material: 10 points
  const baseScore = topics.length > 0 ? 10 : 0;
  const hasPracticedAny = quizCount > 0 || reviewedCards > 0 || totalMinutes > 0;

  let overallScore = 0;
  if (!hasPracticedAny) {
    // If student hasn't touched quizzes, flashcards, or study sessions, mastery reflects start level
    overallScore = baseScore;
  } else {
    // Earned score from real student performance
    const earned =
      quizScore * 0.45 +
      flashcardScore * 0.35 +
      studyScore * 0.20;

    overallScore = Math.min(100, Math.max(baseScore, Math.round(baseScore + earned * 0.9)));
  }

  // Status Labels & Badges
  let statusLabel = "Inicial · Requiere Práctica";
  let statusBadgeColor = "text-zinc-400 bg-zinc-800/60 border-zinc-700";
  let progressBarColor = "bg-zinc-500";

  if (overallScore >= 85) {
    statusLabel = "Promoción · Dominio Completo";
    statusBadgeColor = "text-emerald-300 bg-emerald-500/10 border-emerald-500/30";
    progressBarColor = "bg-emerald-500";
  } else if (overallScore >= 70) {
    statusLabel = "Listo para Parcial · Nivel Avanzado";
    statusBadgeColor = "text-blue-300 bg-blue-500/10 border-blue-500/30";
    progressBarColor = "bg-blue-500";
  } else if (overallScore >= 40) {
    statusLabel = "En Progreso · Práctica Regular";
    statusBadgeColor = "text-amber-300 bg-amber-500/10 border-amber-500/30";
    progressBarColor = "bg-amber-500";
  }

  // Recommendations based on gaps
  const recommendations: string[] = [];
  if (quizCount === 0) {
    recommendations.push("Rendí un simulacro de examen con preguntas de cátedra para medir tu nivel.");
  } else if (avgQuizScore < 70) {
    recommendations.push(`Tu promedio en simulacros es ${avgQuizScore}%. Repasá los temas débiles para superar el 70%.`);
  }

  if (reviewedCards < totalCards) {
    recommendations.push(`Tenés ${totalCards - reviewedCards} flashcards pendientes de repasar con algoritmo SM-2.`);
  }

  if (totalMinutes < 60) {
    recommendations.push("Iniciá sesiones de Pomodoro en el Centro de Estudio para consolidar conceptos.");
  }

  return {
    overallScore,
    statusLabel,
    statusBadgeColor,
    progressBarColor,
    quizStats: {
      attemptsCount: quizCount,
      avgScore: avgQuizScore,
      totalQuestions,
      hasPracticed: quizCount > 0,
    },
    flashcardStats: {
      totalCards,
      reviewedCards,
      retentionRate,
      masteredCards,
      hasPracticed: reviewedCards > 0,
    },
    studyStats: {
      totalMinutes,
      sessionsCount: studySessions.length,
    },
    practiceRecommendations: recommendations,
  };
}
