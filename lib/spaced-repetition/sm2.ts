// SuperMemo SM-2 Spaced Repetition Algorithm Implementation for Kanri

export interface SM2Input {
  rating: number; // 0 to 5 (or mapped from 1-3: 1=hard/2, 2=good/4, 3=easy/5)
  repetitions: number;
  interval: number; // in days
  easeFactor: number;
}

export interface SM2Output {
  repetitions: number;
  interval: number; // in days
  easeFactor: number;
  nextReviewAt: Date;
  masteryScoreDelta: number;
}

/**
 * Calculates the next review date and updated SM-2 parameters.
 * rating scale:
 * 0: Complete blackout
 * 1: Incorrect, but remembered upon seeing answer
 * 2: Incorrect, but easy to recall once seen
 * 3: Correct response recalled with serious difficulty
 * 4: Correct response after a hesitation
 * 5: Perfect response with zero hesitation
 */
export function calculateSM2(input: SM2Input): SM2Output {
  const { rating, repetitions: prevReps, interval: prevInterval, easeFactor: prevEF } = input;
  const clampedRating = Math.max(0, Math.min(5, Math.round(rating)));

  let repetitions = prevReps;
  let interval = prevInterval;
  let easeFactor = prevEF;

  if (clampedRating >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.max(1, Math.round(prevInterval * easeFactor));
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  // Update Ease Factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const q = clampedRating;
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + interval);

  // Calculate mastery delta based on score
  let masteryScoreDelta = 0;
  if (clampedRating === 5) masteryScoreDelta = 10;
  else if (clampedRating === 4) masteryScoreDelta = 6;
  else if (clampedRating === 3) masteryScoreDelta = 3;
  else if (clampedRating === 2) masteryScoreDelta = -4;
  else masteryScoreDelta = -8;

  return {
    repetitions,
    interval,
    easeFactor: parseFloat(easeFactor.toFixed(2)),
    nextReviewAt,
    masteryScoreDelta,
  };
}

/**
 * Returns human-readable mastery status in Spanish
 */
export function getMasteryLevel(score: number): {
  label: string;
  colorClass: string;
  bgClass: string;
  badgeClass: string;
} {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  if (clamped >= 81) {
    return {
      label: "Dominado",
      colorClass: "text-emerald-400",
      bgClass: "bg-emerald-500",
      badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    };
  }
  if (clamped >= 61) {
    return {
      label: "Bueno",
      colorClass: "text-blue-400",
      bgClass: "bg-blue-500",
      badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    };
  }
  if (clamped >= 31) {
    return {
      label: "En desarrollo",
      colorClass: "text-amber-400",
      bgClass: "bg-amber-500",
      badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    };
  }
  return {
    label: "Débil",
    colorClass: "text-rose-400",
    bgClass: "bg-rose-500",
    badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };
}
