"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, Sparkles, BookOpen } from "lucide-react";
import { submitQuizResults } from "@/app/actions/study";
import confetti from "canvas-confetti";

interface QuestionItem {
  id: string;
  question: string;
  optionsJson: string;
  answer: string;
  explanation?: string | null;
  difficulty: string;
  type: string;
  topicId?: string | null;
}

interface QuizRunnerProps {
  subject: {
    id: string;
    name: string;
    color: string;
  };
  questions: QuestionItem[];
}

export function QuizRunner({ subject, questions }: QuizRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [answersLog, setAnswersLog] = useState<{ isCorrect: boolean; question: string }[]>([]);

  if (!questions || questions.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 text-center text-xs space-y-3">
        <p className="text-[var(--text-muted)]">
          No hay preguntas de examen cargadas para esta materia aún.
        </p>
        <Link
          href={`/subjects/${subject.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--accent)] text-white font-medium"
        >
          Volver a la materia
        </Link>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const options: string[] = JSON.parse(currentQ.optionsJson || "[]");

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const isCorrect = opt.trim().toLowerCase() === currentQ.answer.trim().toLowerCase();
    if (isCorrect) setScore((prev) => prev + 1);

    setAnswersLog((prev) => [
      ...prev,
      { isCorrect, question: currentQ.question },
    ]);
  };

  const handleNext = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      confetti({ particleCount: 120, spread: 70 });
      // Submit results to server to update topic mastery
      await submitQuizResults({
        subjectId: subject.id,
        topicId: currentQ.topicId || undefined,
        score: score + (selectedOption?.trim().toLowerCase() === currentQ.answer.trim().toLowerCase() ? 1 : 0),
        totalQuestions: questions.length,
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setAnswersLog([]);
  };

  const finalPercentage = Math.round((score / questions.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-xs">
      {!isFinished ? (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: subject.color }}
              />
              <span className="font-semibold text-xs text-[var(--text-primary)]">
                {subject.name}
              </span>
            </div>
            <div className="text-xs font-mono text-[var(--text-muted)]">
              Pregunta {currentIndex + 1} de {questions.length}
            </div>
          </div>

          {/* Question text */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Dificultad {currentQ.difficulty} · {currentQ.type}
            </div>
            <h2 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrectAnswer = opt.trim().toLowerCase() === currentQ.answer.trim().toLowerCase();

              let btnStyle = "border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-[var(--border-strong)] text-[var(--text-primary)]";

              if (isAnswered) {
                if (isCorrectAnswer) {
                  btnStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold";
                } else if (isSelected && !isCorrectAnswer) {
                  btnStyle = "border-rose-500 bg-rose-500/10 text-rose-300 font-semibold";
                } else {
                  btnStyle = "border-[var(--border-subtle)] opacity-40 text-[var(--text-muted)]";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full text-left p-3.5 rounded-lg border text-xs transition flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrectAnswer && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box when Answered */}
          {isAnswered && currentQ.explanation && (
            <div className="p-3.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] space-y-1 animate-in fade-in">
              <span className="font-semibold text-xs text-[var(--text-primary)] block">
                Explicación técnica:
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white font-medium hover:opacity-90 flex items-center gap-1.5 transition"
              >
                <span>{currentIndex + 1 < questions.length ? "Siguiente Pregunta" : "Ver Resultados"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results Card */
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 text-center space-y-6 animate-in zoom-in-95 duration-150">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              ¡Quiz Completado!
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Resultados de evaluación para {subject.name}
            </p>
          </div>

          <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] max-w-sm mx-auto">
            <div className="text-4xl font-bold font-mono text-[var(--text-primary)]">
              {score} / {questions.length}
            </div>
            <div className="text-sm font-semibold text-emerald-400 mt-1">
              {finalPercentage}% de aciertos
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-2">
              Se ha actualizado el puntaje de dominio en tu historial académico.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] font-medium text-[var(--text-primary)] transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span>Reintentar Quiz</span>
            </button>

            <Link
              href={`/subjects/${subject.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent)] text-white font-medium hover:opacity-90 transition"
            >
              <span>Volver a la Materia</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
