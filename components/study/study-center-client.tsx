"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Layers,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Coffee,
} from "lucide-react";
import { recordStudySession } from "@/app/actions/study";
import confetti from "canvas-confetti";

interface StudyCenterClientProps {
  subjects: {
    id: string;
    name: string;
    color: string;
    topics: {
      id: string;
      name: string;
      masteryScore: number;
    }[];
  }[];
  initialSubjectId?: string;
  initialTopicId?: string;
}

export function StudyCenterClient({
  subjects,
  initialSubjectId,
  initialTopicId,
}: StudyCenterClientProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(
    initialSubjectId || subjects[0]?.id || ""
  );
  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const [selectedTopicId, setSelectedTopicId] = useState(
    initialTopicId || selectedSubject?.topics[0]?.id || ""
  );

  // Timer states
  const [durationPreset, setDurationPreset] = useState<number>(25); // 25, 50, or custom
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const [difficultyRating, setDifficultyRating] = useState<"easy" | "normal" | "hard">("normal");
  const [isSaving, setIsSaving] = useState(false);

  // When subject changes, pick first topic
  useEffect(() => {
    if (selectedSubject?.topics?.length > 0) {
      if (!selectedSubject.topics.some((t) => t.id === selectedTopicId)) {
        setSelectedTopicId(selectedSubject.topics[0].id);
      }
    } else {
      setSelectedTopicId("");
    }
  }, [selectedSubjectId]);

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      setSessionCompleted(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleSelectPreset = (minutes: number) => {
    setDurationPreset(minutes);
    setTimeLeft(minutes * 60);
    setIsRunning(false);
    setSessionCompleted(false);
  };

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(durationPreset * 60);
    setSessionCompleted(false);
  };

  const handleFinishEarly = () => {
    setIsRunning(false);
    setSessionCompleted(true);
    confetti({ particleCount: 80, spread: 60 });
  };

  const handleSaveSession = async () => {
    setIsSaving(true);
    const elapsedMinutes = Math.max(1, Math.round((durationPreset * 60 - timeLeft) / 60));
    await recordStudySession({
      subjectId: selectedSubject.id,
      topicId: selectedTopicId || undefined,
      durationMinutes: elapsedMinutes,
      difficultyRated: difficultyRating,
    });
    setIsSaving(false);
    setSessionCompleted(false);
    handleResetTimer();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = ((durationPreset * 60 - timeLeft) / (durationPreset * 60)) * 100;

  return (
    <div className="space-y-6 text-xs">
      {/* Configuration & Selection Header */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
              Materia de Estudio
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
              Tema Específico
            </label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            >
              {selectedSubject?.topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (Dominio: {t.masteryScore}%)
                </option>
              ))}
              {(!selectedSubject?.topics || selectedSubject.topics.length === 0) && (
                <option value="">General de la materia</option>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Timer & Focus Canvas */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 sm:p-12 text-center relative overflow-hidden">
        {/* Presets */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <button
            onClick={() => handleSelectPreset(25)}
            className={`px-3 py-1.5 rounded-lg border font-medium transition ${
              durationPreset === 25
                ? "bg-[var(--accent)] text-white border-transparent"
                : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            25 min (Pomodoro)
          </button>
          <button
            onClick={() => handleSelectPreset(50)}
            className={`px-3 py-1.5 rounded-lg border font-medium transition ${
              durationPreset === 50
                ? "bg-[var(--accent)] text-white border-transparent"
                : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            50 min (Bloque Largo)
          </button>
          <button
            onClick={() => handleSelectPreset(15)}
            className={`px-3 py-1.5 rounded-lg border font-medium transition ${
              durationPreset === 15
                ? "bg-[var(--accent)] text-white border-transparent"
                : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            15 min (Express)
          </button>
        </div>

        {/* Big Clock Display */}
        <div className="my-6">
          <div className="text-6xl sm:text-8xl font-bold tracking-tight font-mono text-[var(--text-primary)]">
            {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
          </div>
          <div className="mt-2 text-xs text-[var(--text-muted)]">
            Enfoque activo: <span className="text-[var(--text-primary)] font-medium">{selectedSubject?.name}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-md mx-auto w-full h-1.5 rounded-full bg-[var(--bg-surface-elevated)] my-6 overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleToggleTimer}
            className="px-6 py-2.5 rounded-lg bg-[var(--accent)] hover:opacity-90 text-white font-semibold flex items-center gap-2 shadow-sm transition"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>{timeLeft < durationPreset * 60 ? "Reanudar" : "Iniciar Sesión"}</span>
              </>
            )}
          </button>

          <button
            onClick={handleResetTimer}
            className="p-2.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition"
            title="Reiniciar temporizador"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {timeLeft < durationPreset * 60 && !sessionCompleted && (
            <button
              onClick={handleFinishEarly}
              className="px-4 py-2.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] text-[var(--text-primary)] font-medium transition"
            >
              Completar Ahora
            </button>
          )}
        </div>

        {/* Post Session Completion Dialog */}
        {sessionCompleted && (
          <div className="mt-8 p-5 max-w-md mx-auto rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-left animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>¡Sesión completada con éxito!</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mb-3">
              ¿Cómo calificarías la dificultad de los conceptos estudiados hoy?
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setDifficultyRating("easy")}
                className={`py-1.5 rounded-md border text-center font-medium transition ${
                  difficultyRating === "easy"
                    ? "bg-emerald-500 text-white border-transparent"
                    : "border-[var(--border-subtle)] text-[var(--text-secondary)]"
                }`}
              >
                Fácil (+8% dom)
              </button>
              <button
                type="button"
                onClick={() => setDifficultyRating("normal")}
                className={`py-1.5 rounded-md border text-center font-medium transition ${
                  difficultyRating === "normal"
                    ? "bg-indigo-500 text-white border-transparent"
                    : "border-[var(--border-subtle)] text-[var(--text-secondary)]"
                }`}
              >
                Normal (+5% dom)
              </button>
              <button
                type="button"
                onClick={() => setDifficultyRating("hard")}
                className={`py-1.5 rounded-md border text-center font-medium transition ${
                  difficultyRating === "hard"
                    ? "bg-rose-500 text-white border-transparent"
                    : "border-[var(--border-subtle)] text-[var(--text-secondary)]"
                }`}
              >
                Difícil (+2% dom)
              </button>
            </div>

            <button
              onClick={handleSaveSession}
              disabled={isSaving}
              className="w-full py-2 rounded-lg bg-[var(--accent)] text-white font-medium hover:opacity-90 transition text-center"
            >
              {isSaving ? "Guardando progreso..." : "Registrar Sesión y Actualizar Dominio"}
            </button>
          </div>
        )}
      </div>

      {/* Quick Jump into Interactive Quizzes or Flashcards for this subject */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href={`/reviews?subjectId=${selectedSubject.id}`}
          className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-[var(--text-primary)]">
                Repasar Flashcards SM-2
              </div>
              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Tarjetas inteligentes de {selectedSubject.name}
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition" />
        </Link>

        <Link
          href={`/study/quiz/${selectedSubject.id}`}
          className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-[var(--text-primary)]">
                Simulacro de Quiz / Examen
              </div>
              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Preguntas de opción múltiple cronometradas
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition" />
        </Link>
      </div>
    </div>
  );
}
