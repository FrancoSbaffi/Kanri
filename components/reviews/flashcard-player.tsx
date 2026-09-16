"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { submitFlashcardReview } from "@/app/actions/reviews";
import confetti from "canvas-confetti";

interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  difficulty: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  subject: {
    id: string;
    name: string;
    color: string;
  };
  topic?: {
    id: string;
    name: string;
    masteryScore: number;
  } | null;
}

export function FlashcardPlayer({ flashcards }: { flashcards: FlashcardItem[] }) {
  const [cards, setCards] = useState<FlashcardItem[]>(flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isReviewing, setIsReviewing] = useState(true);
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    setCards(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsReviewing(true);
  }, [flashcards]);

  const currentCard = cards[currentIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space: flip card
      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (isFlipped) {
        if (e.key === "1" || e.key === "ArrowLeft") {
          e.preventDefault();
          handleRating(1);
        } else if (e.key === "2" || e.key === "ArrowDown") {
          e.preventDefault();
          handleRating(2);
        } else if (e.key === "3" || e.key === "ArrowRight") {
          e.preventDefault();
          handleRating(3);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, currentIndex, cards]);

  const handleRating = async (rating: 1 | 2 | 3) => {
    if (!currentCard) return;

    // Send SM-2 review rating to server
    await submitFlashcardReview(currentCard.id, rating);

    setReviewedCount((prev) => prev + 1);
    setIsFlipped(false);

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsReviewing(false);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  };

  if (!cards || cards.length === 0 || !isReviewing) {
    return (
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 text-center space-y-5 max-w-lg mx-auto text-xs animate-in zoom-in-95 duration-150">
        <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {reviewedCount > 0 ? "¡Repaso Finalizado!" : "¡Todo al Día!"}
          </h2>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            {reviewedCount > 0
              ? `Has repasado ${reviewedCount} tarjetas con el algoritmo SM-2.`
              : "No hay más flashcards pendientes para hoy según tu curva de olvido."}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white font-medium hover:opacity-90 transition"
          >
            Volver al Dashboard
          </Link>
          <Link
            href="/study"
            className="px-3.5 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] text-[var(--text-primary)] font-medium transition"
          >
            Centro de Estudio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-xs select-none">
      {/* Top progress */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                backgroundColor: currentCard.subject.color,
                boxShadow: `0 0 6px ${currentCard.subject.color}60`,
              }}
            />
            <span className="font-semibold text-[var(--text-primary)] truncate">
              {currentCard.subject.name}
            </span>
            {currentCard.topic && (
              <>
                <span className="text-[var(--text-muted)]/50">·</span>
                <span className="truncate max-w-[280px] text-[var(--text-secondary)]">
                  {currentCard.topic.name}
                </span>
              </>
            )}
          </div>
          <div className="font-mono text-xs font-semibold text-[var(--text-primary)] shrink-0 ml-3 bg-[var(--bg-surface-elevated)] px-2.5 py-1 rounded-md border border-[var(--border-subtle)]">
            {currentIndex + 1} <span className="text-[var(--text-muted)] font-normal">/ {cards.length}</span>
          </div>
        </div>
        <div className="w-full bg-[var(--bg-surface-elevated)] h-1.5 rounded-full overflow-hidden border border-[var(--border-subtle)]/40">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Flip Card Canvas */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer min-h-[300px] sm:min-h-[360px] rounded-xl border border-[var(--border-subtle)] hover:border-[var(--border-strong)] bg-[var(--bg-surface)] p-8 flex flex-col justify-between transition-all duration-150 relative group"
      >
        <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <span className="uppercase tracking-wider font-semibold">
            {isFlipped ? "Reverso / Respuesta" : "Frente / Pregunta"}
          </span>
          <span className="px-2 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] font-mono">
            Espacio para voltear
          </span>
        </div>

        <div className="my-auto py-8 text-center">
          <p className="text-base sm:text-xl font-medium text-[var(--text-primary)] leading-relaxed">
            {isFlipped ? currentCard.back : currentCard.front}
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-3">
          <span>
            Repeticiones: <strong className="font-mono">{currentCard.repetitions}</strong> · Intervalo:{" "}
            <strong className="font-mono">{currentCard.interval}d</strong>
          </span>
          <span className="text-[var(--accent)] font-medium group-hover:underline">
            {isFlipped ? "Volver a ver frente" : "Ver respuesta →"}
          </span>
        </div>
      </div>

      {/* SM-2 Rating Controls (when card is revealed) */}
      {isFlipped ? (
        <div className="space-y-2 animate-in fade-in duration-100">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleRating(1)}
              className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/8 hover:bg-rose-500/15 text-rose-600 dark:text-rose-400 font-medium transition text-center"
            >
              <div className="font-semibold text-xs">Difícil</div>
              <div className="text-[10px] text-[var(--text-muted)] mt-0.5 font-mono">
                1 día · [1 o ←]
              </div>
            </button>

            <button
              onClick={() => handleRating(2)}
              className="p-3 rounded-lg border border-blue-500/20 bg-blue-500/8 hover:bg-blue-500/15 text-blue-600 dark:text-blue-400 font-medium transition text-center"
            >
              <div className="font-semibold text-xs">Bueno</div>
              <div className="text-[10px] text-[var(--text-muted)] mt-0.5 font-mono">
                {Math.max(2, Math.round(currentCard.interval * currentCard.easeFactor))} días · [2 o ↓]
              </div>
            </button>

            <button
              onClick={() => handleRating(3)}
              className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/8 hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium transition text-center"
            >
              <div className="font-semibold text-xs">Fácil</div>
              <div className="text-[10px] text-[var(--text-muted)] mt-0.5 font-mono">
                {Math.max(4, Math.round(currentCard.interval * currentCard.easeFactor * 1.3))} días · [3 o →]
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-2 text-xs text-[var(--text-muted)]">
          Presiona <kbd className="mx-1">Espacio</kbd> o haz clic en la tarjeta para revelar la respuesta
        </div>
      )}
    </div>
  );
}
