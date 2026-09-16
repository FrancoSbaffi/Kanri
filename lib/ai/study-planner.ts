// Intelligent Academic Study Priority & Recommendation Engine for Kanri

export interface StudyCandidate {
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicName: string;
  masteryScore: number;
  importance: string; // low, medium, high, critical
  daysUntilExam: number | null;
  examTitle: string | null;
  overdueReviewDays: number; // 0 if not overdue, >0 if overdue
  flashcardsCount: number;
}

export interface StudyRecommendation {
  subject: string;
  topic: string;
  durationMinutes: number;
  reason: string;
  priority: "critical" | "high" | "medium" | "low";
  type: "review" | "concept_study" | "quiz" | "flashcards";
  actionUrl: string;
}

/**
 * Calculates priority score and generates an optimal daily study schedule.
 */
export function calculateStudyPriority(candidate: StudyCandidate): number {
  let score = 0;

  // 1. Exam urgency (up to 40 points)
  if (candidate.daysUntilExam !== null) {
    if (candidate.daysUntilExam <= 3) score += 40;
    else if (candidate.daysUntilExam <= 7) score += 32;
    else if (candidate.daysUntilExam <= 14) score += 24;
    else if (candidate.daysUntilExam <= 21) score += 16;
    else score += 8;
  }

  // 2. Weakness / Mastery Gap (up to 30 points)
  const masteryGap = 100 - Math.min(100, Math.max(0, candidate.masteryScore));
  score += (masteryGap / 100) * 30;

  // 3. Overdue Spaced Reviews (up to 20 points)
  if (candidate.overdueReviewDays > 0) {
    score += Math.min(20, 8 + candidate.overdueReviewDays * 3);
  }

  // 4. Topic Importance (up to 10 points)
  switch (candidate.importance.toLowerCase()) {
    case "critical":
      score += 10;
      break;
    case "high":
      score += 7;
      break;
    case "medium":
      score += 4;
      break;
    default:
      score += 2;
  }

  return Math.round(score);
}

export function generateDailyStudyPlan(
  candidates: StudyCandidate[],
  availableMinutes: number = 90
): StudyRecommendation[] {
  if (!candidates || candidates.length === 0) return [];

  // Rank candidates by composite priority score
  const scored = candidates.map((c) => ({
    ...c,
    score: calculateStudyPriority(c),
  }));

  scored.sort((a, b) => b.score - a.score);

  const recommendations: StudyRecommendation[] = [];
  let allocatedMinutes = 0;

  for (const item of scored) {
    if (allocatedMinutes >= availableMinutes) break;

    const remaining = availableMinutes - allocatedMinutes;
    let duration = 25;
    let priority: "critical" | "high" | "medium" | "low" = "medium";
    let type: "review" | "concept_study" | "quiz" | "flashcards" = "concept_study";

    if (item.score >= 70) {
      priority = "critical";
      duration = Math.min(remaining, 35);
    } else if (item.score >= 50) {
      priority = "high";
      duration = Math.min(remaining, 25);
    } else if (item.score >= 30) {
      priority = "medium";
      duration = Math.min(remaining, 20);
    } else {
      priority = "low";
      duration = Math.min(remaining, 15);
    }

    if (duration < 10 && remaining >= 10) duration = remaining;
    if (duration < 10) break;

    // Determine reason text
    let reason = "";
    if (item.daysUntilExam !== null && item.daysUntilExam <= 21) {
      reason = `Examen "${item.examTitle || "Parcial"}" en ${item.daysUntilExam} días · Dominio al ${item.masteryScore}%`;
      type = item.masteryScore < 60 ? "concept_study" : "quiz";
    } else if (item.overdueReviewDays > 0) {
      reason = `Repaso espaciado vencido hace ${item.overdueReviewDays} ${item.overdueReviewDays === 1 ? "día" : "días"}`;
      type = "flashcards";
    } else if (item.masteryScore <= 40) {
      reason = `Tema prioritario con bajo dominio (${item.masteryScore}%)`;
      type = "concept_study";
    } else {
      reason = `Consolidación de conceptos clave (${item.importance})`;
      type = "review";
    }

    recommendations.push({
      subject: item.subjectName,
      topic: item.topicName,
      durationMinutes: duration,
      reason,
      priority,
      type,
      actionUrl: `/study?subjectId=${item.subjectId}&topicId=${item.topicId}`,
    });

    allocatedMinutes += duration;
  }

  return recommendations;
}
