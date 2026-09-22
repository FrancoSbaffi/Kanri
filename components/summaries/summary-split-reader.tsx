"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  BookOpen,
  Split,
  Maximize2,
  Minimize2,
  Sparkles,
  Download,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Layers,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { formatDateEs } from "@/lib/utils/dates";
import { formatFileName } from "@/lib/utils/format";
import { MarkdownContent } from "@/components/ui/markdown-content";

interface SummarySplitReaderProps {
  summary: {
    id: string;
    title: string;
    overview: string;
    detailedSummary: string;
    simplifiedExplanation?: string | null;
    keyPointsJson: string;
    definitionsJson: string;
    examplesJson: string;
    commonMistakesJson: string;
    aiModel: string;
    createdAt: Date;
    classSession?: {
      id: string;
      title: string;
      classNumber: number;
      subject: {
        id: string;
        name: string;
        color: string;
      };
    } | null;
    material?: {
      id: string;
      fileName: string;
      fileType: string;
    } | null;
  };
}

export function SummarySplitReader({ summary }: SummarySplitReaderProps) {
  const [viewMode, setViewMode] = useState<"split" | "summary" | "pdf">("split");
  const [isPdfExpanded, setIsPdfExpanded] = useState(false);

  // Close theater fullscreen on ESC
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPdfExpanded) {
        setIsPdfExpanded(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPdfExpanded]);

  const keyPoints: string[] = JSON.parse(summary.keyPointsJson || "[]");
  const definitions: { term: string; definition: string }[] = JSON.parse(summary.definitionsJson || "[]");
  const examples: { title: string; description: string }[] = JSON.parse(summary.examplesJson || "[]");
  const commonMistakes: { mistake: string; explanation: string }[] = JSON.parse(summary.commonMistakesJson || "[]");

  const pdfUrl = summary.material ? `/api/materials/${summary.material.id}/file` : null;

  const exportMarkdown = () => {
    const mdContent = `# ${summary.title}
Materia: ${summary.classSession?.subject?.name || "Universidad"}
Clase: ${summary.classSession?.title || ""}
Generado por: Kanri (${summary.aiModel})

## Resumen Ejecutivo
${summary.overview}

## Puntos Clave
${keyPoints.map((p) => `- ${p}`).join("\n")}

## Explicación Detallada
${summary.detailedSummary}

## Definiciones
${definitions.map((d) => `### ${d.term}\n${d.definition}`).join("\n\n")}

## Errores Comunes en Exámenes
${commonMistakes.map((m) => `### ⚠️ ${m.mistake}\n${m.explanation}`).join("\n\n")}
`;

    const blob = new Blob([mdContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${summary.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-1">
            {summary.classSession?.subject && (
              <Link
                href={`/subjects/${summary.classSession.subject.id}`}
                className="hover:text-[var(--text-primary)] transition flex items-center gap-1"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: summary.classSession.subject.color }}
                />
                {summary.classSession.subject.name}
              </Link>
            )}
            {summary.classSession && (
              <>
                <span>/</span>
                <Link
                  href={`/classes/${summary.classSession.id}`}
                  className="hover:text-[var(--text-primary)]"
                >
                  {summary.classSession.title}
                </Link>
              </>
            )}
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)]">
            {summary.title}
          </h1>
        </div>

        {/* View mode toggle & actions */}
        <div className="flex items-center gap-2 shrink-0 text-xs">
          {/* View Toggles */}
          {pdfUrl && (
            <div className="flex items-center bg-[var(--bg-surface-elevated)] p-1 rounded-lg border border-[var(--border-subtle)]">
              <button
                onClick={() => {
                  setViewMode("summary");
                  setIsPdfExpanded(false);
                }}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  viewMode === "summary"
                    ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                Solo Resumen
              </button>
              <button
                onClick={() => {
                  setViewMode("split");
                  setIsPdfExpanded(false);
                }}
                className={`px-2.5 py-1 rounded-md font-medium transition hidden md:block ${
                  viewMode === "split"
                    ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                Vista Dividida
              </button>
              <button
                onClick={() => setViewMode("pdf")}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  viewMode === "pdf"
                    ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                Solo PDF
              </button>
            </div>
          )}

          <button
            onClick={exportMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] text-[var(--text-primary)] font-medium transition"
            title="Descargar apunte en Markdown"
          >
            <Download className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span className="hidden sm:inline">Exportar MD</span>
          </button>
        </div>
      </div>

      {/* Main Workspace (Split / Full) */}
      <div
        className={`transition-all ${
          viewMode === "split" && pdfUrl
            ? "grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-175px)] min-h-[650px]"
            : viewMode === "pdf" && pdfUrl
            ? "w-full"
            : "grid grid-cols-1 gap-4"
        }`}
      >
        {/* Left pane: PDF Viewer (in Split or PDF mode) */}
        {(viewMode === "split" || viewMode === "pdf") && pdfUrl && (
          <div
            className={`transition-all duration-200 border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden flex flex-col shadow-sm ${
              isPdfExpanded
                ? "fixed inset-3 md:inset-6 z-50 rounded-2xl shadow-2xl backdrop-blur-xl border-white/10"
                : viewMode === "pdf"
                ? "rounded-xl h-[calc(100vh-175px)] min-h-[650px] w-full"
                : "rounded-xl h-full"
            }`}
          >
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-xs shrink-0">
              <div className="flex items-center gap-2.5 truncate">
                <div className="p-1 rounded-md bg-indigo-500/10 text-indigo-400">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-[var(--text-primary)] truncate">
                  {summary.material?.fileName ? formatFileName(summary.material.fileName) : "Documento de Cátedra"}
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                  PDF Cátedra
                </span>
              </div>

              <div className="flex items-center gap-1 text-[var(--text-muted)]">
                <button
                  onClick={() => setIsPdfExpanded(!isPdfExpanded)}
                  className="p-1.5 rounded-md hover:bg-[var(--bg-surface-active)] hover:text-[var(--text-primary)] transition"
                  title={isPdfExpanded ? "Salir de pantalla completa (Esc)" : "Pantalla completa"}
                >
                  {isPdfExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>

                <a
                  href={pdfUrl}
                  download={summary.material?.fileName || "material.pdf"}
                  className="p-1.5 rounded-md hover:bg-[var(--bg-surface-active)] hover:text-[var(--text-primary)] transition"
                  title="Descargar PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>

                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-md hover:bg-[var(--bg-surface-active)] hover:text-[var(--text-primary)] transition"
                  title="Abrir en pestaña nueva"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="relative flex-1 w-full h-full min-h-0 bg-[#18181b] overflow-hidden">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=1`}
                className="absolute inset-0 w-full h-full border-0"
                title="Visor de PDF de Cátedra"
              />
            </div>
          </div>
        )}

        {/* Right pane: Structured AI Summary */}
        {(viewMode === "split" || viewMode === "summary" || !pdfUrl) && (
          <div
            className={`rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 overflow-y-auto space-y-6 text-xs ${
              viewMode === "split" ? "h-full" : ""
            }`}
          >
            {/* Overview Box */}
            <div className="space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Resumen Ejecutivo</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {summary.overview}
              </p>
            </div>

            {/* Simplified Analogy Box */}
            {summary.simplifiedExplanation && (
              <div className="p-3.5 rounded-lg border border-amber-500/20 bg-amber-500/5 space-y-1">
                <span className="text-[11px] font-semibold text-amber-300 block">
                  Analogía Intuitiva
                </span>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {summary.simplifiedExplanation}
                </p>
              </div>
            )}

            {/* Key Points */}
            {keyPoints.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Puntos Clave del Tema
                </div>
                <div className="space-y-1.5">
                  {keyPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-[var(--text-secondary)]">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Explanation */}
            <div className="space-y-3 pt-3 border-t border-[var(--border-subtle)]">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center justify-between">
                <span>Desarrollo Teórico y Formal</span>
                <span className="text-[10px] text-zinc-500 font-mono font-normal">Formato Académico</span>
              </div>
              <div className="pt-1">
                <MarkdownContent content={summary.detailedSummary} />
              </div>
            </div>

            {/* Definitions */}
            {definitions.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Definiciones Rigurosas
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {definitions.map((d, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]"
                    >
                      <div className="font-semibold text-xs text-[var(--text-primary)]">
                        {d.term}
                      </div>
                      <p className="mt-1 text-[11px] text-[var(--text-secondary)] leading-relaxed">
                        {d.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Examples */}
            {examples.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Casos de Uso & Ejemplos Resueltos
                </div>
                <div className="space-y-2.5">
                  {examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]"
                    >
                      <div className="font-semibold text-xs text-indigo-400">
                        {ex.title}
                      </div>
                      <p className="mt-1 text-[11px] text-[var(--text-secondary)] leading-relaxed">
                        {ex.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common Exam Mistakes */}
            {commonMistakes.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Errores Frecuentes en Exámenes</span>
                </div>
                <div className="space-y-2">
                  {commonMistakes.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 space-y-1"
                    >
                      <span className="font-semibold text-xs text-[var(--text-primary)]">
                        {m.mistake}
                      </span>
                      <p className="text-[11px] text-[var(--text-secondary)]">
                        {m.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
