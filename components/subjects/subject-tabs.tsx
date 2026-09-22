"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  FileText,
  Sparkles,
  CheckSquare,
  Clock,
  Layers,
  Building2,
  Calendar,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Upload,
  BookMarked,
  Check,
} from "lucide-react";
import { formatDateEs } from "@/lib/utils/dates";
import { formatFileName } from "@/lib/utils/format";
import { updateAssignmentStatus } from "@/app/actions/tasks";
import { togglePlanItemCompleted } from "@/app/actions/exams";

interface SubjectTabsProps {
  subject: any;
  activeTab: string;
  weakTopics: any[];
}

export function SubjectTabs({ subject, activeTab: initialTab, weakTopics }: SubjectTabsProps) {
  const [tab, setTab] = useState(initialTab);

  // Recopilar todos los resúmenes de las clases ordenados cronológicamente
  const allSummaries = (subject.classes || [])
    .flatMap((c: any) => (c.summaries || []).map((s: any) => ({ ...s, classSession: c })))
    .sort((a: any, b: any) => (a.classSession?.classNumber || 0) - (b.classSession?.classNumber || 0));

  const tabs = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "summaries", label: `Resúmenes (${allSummaries.length})`, icon: Sparkles },
    { id: "classes", label: `Clases (${subject.classes.length})`, icon: GraduationCap },
    { id: "topics", label: `Temas (${subject.topics.length})`, icon: Layers },
    { id: "materials", label: `Materiales (${subject.materials.length})`, icon: FileText },
    { id: "exams", label: `Exámenes (${subject.exams.length})`, icon: Sparkles },
    { id: "tasks", label: `Trabajos (${subject.assignments.length})`, icon: CheckSquare },
    { id: "study", label: "Estudio", icon: Clock },
  ];

  // Agrupador de resúmenes por Unidad temática
  const getUnitForClass = (classNumber: number, title?: string) => {
    const sName = subject?.name || "";
    const isSistemas = sName.toLowerCase().includes("sistemas");

    if (isSistemas) {
      if ((title && (title.includes("Unidad 1") || title.includes("Unidad 2"))) || classNumber === 1) return "Unidad 1 y 2";
      if ((title && title.includes("Unidad 6")) || classNumber === 2) return "Unidad 6";
      if ((title && title.includes("Unidad 3")) || classNumber === 3) return "Unidad 3";
      if ((title && (title.includes("Unidad 7") || title.includes("Unidad 10"))) || classNumber === 4) return "Unidad 7 y 10";
    }

    if (title) {
      const match = title.match(/Unidad\s*(\d+)/i);
      if (match) return `Unidad ${match[1]}`;
    }
    if (classNumber === 1) return "Unidad 1";
    if (classNumber === 2) return "Unidad 2";
    if (classNumber === 3) return "Unidad 3";
    if (classNumber === 4) return "Unidad 4";
    if (classNumber <= 6) return "Unidad 5";
    return "Unidad 6";
  };

  const getUnitMeta = (unit: string) => {
    const sName = subject?.name || "";
    const isNegocios = sName.toLowerCase().includes("negocios");
    const isTalento = sName.toLowerCase().includes("talento");
    const isEmprendedurismo = sName.toLowerCase().includes("emprendedurismo") || sName.toLowerCase().includes("taller");
    const isSistemas = sName.toLowerCase().includes("sistemas");

    const colorMaps: Record<string, { color: string; badgeColor: string }> = {
      "Unidad 1": { color: "bg-rose-500/10 text-rose-400 border-rose-500/20", badgeColor: "bg-rose-500/20 text-rose-300" },
      "Unidad 1 y 2": { color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20", badgeColor: "bg-cyan-500/20 text-cyan-300" },
      "Unidad 2": { color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", badgeColor: "bg-indigo-500/20 text-indigo-300" },
      "Unidad 3": { color: "bg-amber-500/10 text-amber-400 border-amber-500/20", badgeColor: "bg-amber-500/20 text-amber-300" },
      "Unidad 4": { color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", badgeColor: "bg-emerald-500/20 text-emerald-300" },
      "Unidad 5": { color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20", badgeColor: "bg-cyan-500/20 text-cyan-300" },
      "Unidad 6": { color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", badgeColor: "bg-indigo-500/20 text-indigo-300" },
      "Unidad 7 y 10": { color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", badgeColor: "bg-emerald-500/20 text-emerald-300" },
    };

    let titleLabel = `${unit} · Contenidos Temáticos`;
    if (isSistemas) {
      switch (unit) {
        case "Unidad 1 y 2":
        case "Unidad 1":
          titleLabel = "Unidad 1 y 2 · Transformación Digital Continua, Metodología OKR y ACT";
          break;
        case "Unidad 6":
        case "Unidad 2":
          titleLabel = "Unidad 6 · Arquitectura de Software, Atributos de Calidad y Diseño";
          break;
        case "Unidad 3":
          titleLabel = "Unidad 3 · Transformación Digital y Automatización de Procesos (BPM y RPA)";
          break;
        case "Unidad 7 y 10":
        case "Unidad 4":
        case "Unidad 7":
          titleLabel = "Unidad 7 y 10 · Blockchain, Contratos Inteligentes y Finanzas Descentralizadas (DeFi)";
          break;
        default:
          titleLabel = `${unit} · Arquitectura Tecnológica e Infraestructura`;
      }
    } else if (isNegocios) {
      switch (unit) {
        case "Unidad 1":
          titleLabel = "Unidad 1 · Introducción a Negocios Digitales, Efecto Cero y Plataformas";
          break;
        case "Unidad 2":
          titleLabel = "Unidad 2 · Planeamiento Estratégico Digital y Pasos de Gartner";
          break;
        case "Unidad 3":
          titleLabel = "Unidad 3 · Análisis del Entorno Digital: VUCA a BANI y PESTLE";
          break;
        case "Unidad 4":
          titleLabel = "Unidad 4 · Análisis de Competencia Digital: FODA, VRIO, CAME y OKRs";
          break;
        default:
          titleLabel = `${unit} · Transformación Digital y Ecosistemas`;
      }
    } else if (isTalento) {
      switch (unit) {
        case "Unidad 1":
          titleLabel = "Unidad 1 · Filosofía, Cultura y CH como Sistema";
          break;
        case "Unidad 2":
          titleLabel = "Unidad 2 · Planeamiento, Integración, FODA, RSE y Balance Social";
          break;
        case "Unidad 3":
          titleLabel = "Unidad 3 · Paradigmas de CH, Motivación (Herzberg) y Competencias (Alles)";
          break;
        default:
          titleLabel = "Unidad 4 · Subsistemas y Procesos Avanzados de CH";
      }
    } else if (isEmprendedurismo) {
      switch (unit) {
        case "Unidad 1":
          titleLabel = "Unidad 1 · Descubrimiento del Problema y Customer Discovery";
          break;
        case "Unidad 2":
          titleLabel = "Unidad 2 · Propuesta de Valor, Producto Mínimo Viable (MVP)";
          break;
        case "Unidad 3":
          titleLabel = "Unidad 3 · Validación de Mercado y Métricas de Tracción";
          break;
        default:
          titleLabel = "Unidad 4 · Presentación, Pitch y Modelo de Negocio";
      }
    }

    const styling = colorMaps[unit] || { color: "bg-blue-500/10 text-blue-400 border-blue-500/20", badgeColor: "bg-blue-500/20 text-blue-300" };

    return {
      label: titleLabel,
      color: styling.color,
      badgeColor: styling.badgeColor,
    };
  };

  // Agrupar los resúmenes por unidad
  const summariesByUnit = allSummaries.reduce((acc: Record<string, any[]>, sum: any) => {
    const fullText = `${sum.classSession?.title || ""} ${sum.title || ""}`;
    const unit = getUnitForClass(sum.classSession?.classNumber || 1, fullText);
    if (!acc[unit]) acc[unit] = [];
    acc[unit].push(sum);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* Tab bar in Linear style */}
      <div className="flex items-center gap-1 border-b border-[var(--border-subtle)] overflow-x-auto pb-px">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition whitespace-nowrap ${
                isActive
                  ? "border-[var(--accent)] text-[var(--text-primary)] font-semibold"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Overview Tab */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          <div className="lg:col-span-2 space-y-5">
            {/* Recent Classes */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5 mb-3">
                <h3 className="font-semibold text-xs text-[var(--text-primary)] uppercase tracking-wider">
                  Clases Recientes y Dictadas
                </h3>
                <button
                  onClick={() => setTab("classes")}
                  className="text-[11px] text-[var(--accent)] hover:underline"
                >
                  Ver todas ({subject.classes.length})
                </button>
              </div>
              <div className="space-y-2">
                {subject.classes.slice(0, 6).map((c: any) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] transition flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/classes/${c.id}`}
                          className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition truncate"
                        >
                          {c.title}
                        </Link>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded border uppercase font-bold shrink-0 ${
                            c.modality === "presencial"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          }`}
                        >
                          {c.modality}
                        </span>
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] mt-1 flex flex-wrap items-center gap-2">
                        <span>{formatDateEs(c.date)}</span>
                        <span>·</span>
                        <span>{c.startTime} - {c.endTime} hs</span>
                        {c.room && (
                          <>
                            <span>·</span>
                            <span>{c.room}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {c.summaries && c.summaries.length > 0 && (
                        <Link
                          href={`/summaries/${c.summaries[0].id}`}
                          className="px-2 py-1 rounded bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20 font-medium text-[11px] transition flex items-center gap-1"
                          title="Ver resumen estructurado"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Resumen</span>
                        </Link>
                      )}
                      {c.materials && c.materials.length > 0 && (
                        <a
                          href={`/api/materials/${c.materials[0].id}/file`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] transition"
                          title="Ver PDF Diapositivas"
                        >
                          <FileText className="w-3.5 h-3.5 text-indigo-400" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Summaries (Shows ALL classes with summaries) */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5 mb-3">
                <div>
                  <h3 className="font-semibold text-xs text-[var(--text-primary)] uppercase tracking-wider">
                    Resúmenes Académicos por Clase
                  </h3>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {allSummaries.length} clases con resúmenes estructurados disponibles
                  </span>
                </div>
                <button
                  onClick={() => setTab("summaries")}
                  className="text-[11px] text-[var(--accent)] hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Ver agrupados por Unidad</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {allSummaries.map((sum: any) => {
                  const unit = getUnitForClass(sum.classSession?.classNumber || 1, sum.classSession?.title || sum.title);
                  const meta = getUnitMeta(unit);
                  const classNum = sum.classSession?.classNumber;
                  const mat = sum.classSession?.materials?.[0];

                  return (
                    <div
                      key={sum.id}
                      className="p-4 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent)]/40 bg-[var(--bg-surface-elevated)] transition-all group space-y-2.5 shadow-sm"
                    >
                      {/* Top Meta Bar */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wide border ${meta.color}`}>
                            {unit}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wide bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                            Clase {String(classNum || "").padStart(2, "0")}
                          </span>
                          {sum.classSession?.modality && (
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded uppercase font-bold ${
                                sum.classSession.modality === "presencial"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              }`}
                            >
                              {sum.classSession.modality}
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 shrink-0 font-medium">
                          <Sparkles className="w-3 h-3 text-[var(--accent)]" />
                          <span>Lectura Oficial Cátedra</span>
                        </span>
                      </div>

                      {/* Main Title - Clean Full-width */}
                      <Link
                        href={`/summaries/${sum.id}`}
                        className="block text-xs sm:text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition leading-snug"
                      >
                        {sum.title}
                      </Link>

                      {/* Overview Preview */}
                      <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                        {sum.overview}
                      </p>

                      {/* Bottom Footer Bar */}
                      <div className="pt-2.5 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2 text-[11px]">
                        <span className="text-[10px] text-[var(--text-muted)] truncate max-w-[280px]">
                          {mat?.fileName ? formatFileName(mat.fileName) : "Material oficial de cátedra"}
                        </span>

                        <div className="flex items-center gap-2 shrink-0">
                          {mat && (
                            <a
                              href={`/api/materials/${mat.id}/file`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-active)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition text-[10px] border border-[var(--border-subtle)]"
                              title="Ver PDF Diapositivas"
                            >
                              <FileText className="w-3 h-3 text-indigo-400" />
                              <span>Diapositivas PDF</span>
                            </a>
                          )}
                          <Link
                            href={`/summaries/${sum.id}`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--accent)] text-white hover:opacity-90 font-medium transition text-[11px] shadow-sm"
                          >
                            <span>Leer Resumen</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {allSummaries.length === 0 && (
                  <p className="text-center py-4 text-[var(--text-muted)]">
                    No hay resúmenes generados todavía. Sube un PDF a una clase para procesarlo.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right column: Weak topics and Quick actions */}
          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
              <h3 className="font-semibold text-xs text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2.5 mb-3">
                Temas Clave de Parcial
              </h3>
              <div className="space-y-2">
                {subject.topics.slice(0, 4).map((t: any) => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded-lg bg-[var(--bg-surface-elevated)] flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-medium text-[var(--text-primary)] truncate">
                        {t.name}
                      </div>
                      <div className="text-[10px] text-amber-400 font-mono mt-0.5">
                        Dominio: {t.masteryScore}% · Importancia: {t.importance}
                      </div>
                    </div>
                    <Link
                      href={`/study?subjectId=${subject.id}&topicId=${t.id}`}
                      className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
              <h3 className="font-semibold text-xs text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2.5 mb-3">
                Recursos de Estudio y Examen
              </h3>
              <div className="space-y-2 text-xs">
                <button
                  onClick={() => setTab("summaries")}
                  className="w-full p-2.5 rounded-md bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] flex items-center justify-between text-[var(--text-primary)] font-medium transition text-left"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                    Ver Resúmenes por Unidad ({allSummaries.length})
                  </span>
                  <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
                </button>
                <Link
                  href={`/study?subjectId=${subject.id}`}
                  className="p-2.5 rounded-md bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] flex items-center justify-between text-[var(--text-primary)] font-medium transition"
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    Iniciar Sesión de Pomodoro
                  </span>
                  <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
                </Link>
                <Link
                  href={`/reviews?subjectId=${subject.id}`}
                  className="p-2.5 rounded-md bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] flex items-center justify-between text-[var(--text-primary)] font-medium transition"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    Repasar Flashcards SM-2 ({subject.flashcards.length})
                  </span>
                  <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
                </Link>
                <Link
                  href={`/study/quiz/${subject.id}`}
                  className="p-2.5 rounded-md bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] flex items-center justify-between text-[var(--text-primary)] font-medium transition"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Simulacro de Examen ({subject.questions.length} preguntas)
                  </span>
                  <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DEDICATED SUMMARIES TAB (Organized by Unidad & Class) */}
      {tab === "summaries" && (
        <div className="space-y-6 text-xs animate-in fade-in duration-200">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                <span>Resúmenes Académicos Oficiales por Unidad y Clase</span>
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Contenidos extraídos estrictamente de las diapositivas de cátedra, organizados según el programa oficial de examen.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs px-2.5 py-1 rounded bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] font-mono border border-[var(--border-subtle)]">
                {allSummaries.length} Clases Resumidas
              </span>
            </div>
          </div>

          {/* Grouped by Unidad */}
          {Object.keys(summariesByUnit)
            .sort((a, b) => {
              const minClassA = Math.min(...(summariesByUnit[a] || []).map((s: any) => s.classSession?.classNumber ?? 99));
              const minClassB = Math.min(...(summariesByUnit[b] || []).map((s: any) => s.classSession?.classNumber ?? 99));
              if (minClassA !== minClassB) return minClassA - minClassB;
              const numA = parseInt(a.replace(/\D/g, "") || "0", 10);
              const numB = parseInt(b.replace(/\D/g, "") || "0", 10);
              return numA - numB;
            })
            .map((unitKey) => {
            const unitSummaries = summariesByUnit[unitKey] || [];
            if (unitSummaries.length === 0) return null;
            const meta = getUnitMeta(unitKey);

            return (
              <div key={unitKey} className="space-y-3">
                <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${meta.color}`}>
                    {unitKey}
                  </span>
                  <h4 className="font-semibold text-xs text-[var(--text-primary)] uppercase tracking-wider">
                    {meta.label}
                  </h4>
                  <span className="text-[10px] text-[var(--text-muted)] ml-auto">
                    {unitSummaries.length} {unitSummaries.length === 1 ? "clase" : "clases"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unitSummaries.map((sum: any) => {
                    const classNum = sum.classSession?.classNumber;
                    const mat = sum.classSession?.materials?.[0];

                    return (
                      <div
                        key={sum.id}
                        className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex flex-col justify-between hover:border-[var(--border-strong)] transition group space-y-3"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                              Clase {String(classNum).padStart(2, "0")}
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 font-medium">
                              <Sparkles className="w-3 h-3 text-[var(--accent)]" />
                              <span>Lectura Oficial</span>
                            </span>
                          </div>

                          <Link
                            href={`/summaries/${sum.id}`}
                            className="block font-semibold text-xs sm:text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] transition leading-snug"
                          >
                            {sum.title}
                          </Link>

                          <p className="text-[11px] text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                            {sum.overview}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2">
                          {mat ? (
                            <a
                              href={`/api/materials/${mat.id}/file`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] text-[var(--text-muted)] hover:text-[var(--text-primary)] text-[11px] transition"
                            >
                              <FileText className="w-3 h-3 text-indigo-400" />
                              <span>Diapositivas PDF</span>
                            </a>
                          ) : (
                            <span />
                          )}

                          <Link
                            href={`/summaries/${sum.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--accent)] text-white hover:opacity-90 font-medium text-[11px] transition shadow-sm"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Leer Resumen</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Classes Tab */}
      {tab === "classes" && (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Cronograma de Clases Dictadas y Futuras
            </h3>
            <span className="text-xs text-[var(--text-muted)]">
              {subject.classes.length} sesiones registradas
            </span>
          </div>

          <div className="divide-y divide-[var(--border-subtle)] text-xs">
            {subject.classes.map((c: any) => (
              <div
                key={c.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-[var(--bg-surface-elevated)] px-2 rounded-md transition"
              >
                <div className="flex items-start gap-3 min-w-0 pr-2">
                  <div className="p-2 rounded-lg bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] shrink-0 mt-0.5">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/classes/${c.id}`}
                        className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition truncate"
                      >
                        {c.title}
                      </Link>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded border uppercase font-bold shrink-0 ${
                          c.modality === "presencial"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        }`}
                      >
                        {c.modality}
                      </span>
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-1 flex flex-wrap items-center gap-3">
                      <span>{formatDateEs(c.date, { includeDayName: true })}</span>
                      <span>{c.startTime} - {c.endTime} hs</span>
                      {c.room && <span>{c.room}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {c.summaries && c.summaries.length > 0 && (
                    <Link
                      href={`/summaries/${c.summaries[0].id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20 font-medium text-[11px] transition"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Resumen</span>
                    </Link>
                  )}
                  {c.materials && c.materials.length > 0 && (
                    <a
                      href={`/api/materials/${c.materials[0].id}/file`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] text-[var(--text-muted)] hover:text-[var(--text-primary)] text-[11px] transition"
                    >
                      <FileText className="w-3 h-3 text-indigo-400" />
                      <span>PDF</span>
                    </a>
                  )}
                  <Link
                    href={`/classes/${c.id}`}
                    className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Topics Tab */}
      {tab === "topics" && (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                Mapeo Curricular y Dominio por Unidades
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Temas oficiales evaluados en los exámenes de la cátedra
              </p>
            </div>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              {subject.topics.length} temas
            </span>
          </div>

          <div className="divide-y divide-[var(--border-subtle)] text-xs">
            {subject.topics.map((t: any) => (
              <div
                key={t.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-[var(--bg-surface-elevated)] px-2 rounded-md transition"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[var(--text-primary)] truncate">
                      {t.name}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded border uppercase font-bold shrink-0 ${
                        t.importance === "critical"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : t.importance === "high"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}
                    >
                      {t.importance}
                    </span>
                  </div>
                  {t.description && (
                    <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                      {t.description}
                    </p>
                  )}
                  <div className="text-[10px] text-[var(--text-muted)] mt-1 flex items-center gap-3">
                    <span>{t.flashcards?.length || 0} flashcards</span>
                    <span>·</span>
                    <span>{t.questions?.length || 0} preguntas de examen</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="w-24">
                    <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mb-1">
                      <span>Dominio</span>
                      <span className="font-mono">{t.masteryScore}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[var(--bg-surface-elevated)] overflow-hidden">
                      <div
                        className={`h-full ${
                          t.masteryScore >= 75
                            ? "bg-emerald-500"
                            : t.masteryScore >= 50
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                        style={{ width: `${t.masteryScore}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    href={`/study?subjectId=${subject.id}&topicId=${t.id}`}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] text-xs text-[var(--text-primary)] font-medium transition"
                  >
                    <Clock className="w-3 h-3 text-[var(--accent)]" />
                    <span>Estudiar</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Materials Tab (Classes + Extra Bibliography) */}
      {tab === "materials" && (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                Biblioteca de Materiales & Bibliografía
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Clases dictadas (con resumen) y textos complementarios de consulta guardados
              </p>
            </div>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              {subject.materials.length} archivos
            </span>
          </div>

          <div className="divide-y divide-[var(--border-subtle)] text-xs">
            {subject.materials.map((m: any) => {
              const isClass = m.fileName.toLowerCase().includes("clase");

              return (
                <div
                  key={m.id}
                  className="py-3 flex items-center justify-between hover:bg-[var(--bg-surface-elevated)] px-2 rounded-md transition group"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <FileText className={`w-4 h-4 shrink-0 ${isClass ? "text-indigo-400" : "text-amber-400"}`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[var(--text-primary)] truncate">
                          {formatFileName(m.fileName)}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase font-bold shrink-0 ${
                            isClass
                              ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {isClass ? "Clase Oficial" : "Bibliografía Extra"}
                        </span>
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] mt-0.5 flex items-center gap-2">
                        <span>{Math.round(m.fileSize / 1024)} KB</span>
                        <span>·</span>
                        <span>{formatDateEs(m.uploadedAt)}</span>
                        {m.classSession && (
                          <>
                            <span>·</span>
                            <span>{m.classSession.title}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`/api/materials/${m.id}/file`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-1 rounded bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[11px] transition flex items-center gap-1"
                      title="Abrir PDF"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Abrir</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Exams Tab (Official Units Breakdown & Study Plan) */}
      {tab === "exams" && (
        <div className="space-y-5 text-xs">
          {subject.exams.map((exam: any) => (
            <div
              key={exam.id}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      Obligatorio Presencial
                    </span>
                    <h4 className="font-bold text-sm text-[var(--text-primary)]">
                      {exam.title}
                    </h4>
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-1">
                    {formatDateEs(exam.date, { includeDayName: true, includeYear: true })} · {exam.startTime || "08:00"} hs · {exam.location || "Sede UCABA"} ({exam.room || "Aula 108"})
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/study/quiz/${subject.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--accent)] text-white text-xs font-medium hover:opacity-90 transition shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Simular Examen</span>
                  </Link>
                  <Link
                    href={`/reviews?subjectId=${subject.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] text-[var(--text-primary)] text-xs font-medium transition"
                  >
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>Flashcards</span>
                  </Link>
                </div>
              </div>

              {/* Rúbrica Oficial de Cátedra & Alcance Evaluado */}
              {(() => {
                let rubric: any = null;
                try {
                  rubric = JSON.parse(exam.notes || "{}");
                } catch {
                  rubric = null;
                }

                if (rubric && rubric.institution) {
                  return (
                    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-2.5">
                        <div className="flex items-center gap-2">
                          <BookMarked className="w-4 h-4 text-[var(--accent)]" />
                          <h5 className="font-semibold text-xs text-[var(--text-primary)] uppercase tracking-wider">
                            Rúbrica de Cátedra & Criterios de Calificación UCABA
                          </h5>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] font-medium">
                            Ponderación: <strong className="text-[var(--text-primary)]">{rubric.weightPercentage}%</strong>
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                            Promoción: <strong>&gt;= {rubric.promotionGrade}</strong>
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                            Aprobación: <strong>&gt;= {rubric.passingGrade}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                        <div className="p-3 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
                          <div className="font-semibold text-[var(--text-primary)] uppercase tracking-wider text-[10px]">
                            Modalidad & Formato
                          </div>
                          <p className="text-[var(--text-secondary)] leading-relaxed">
                            {rubric.format}
                          </p>
                          {rubric.professors && (
                            <div className="text-[10px] text-[var(--text-muted)] pt-1">
                              Docentes: <strong className="text-[var(--text-secondary)]">{rubric.professors}</strong>
                            </div>
                          )}
                        </div>

                        <div className="p-3 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
                          <div className="font-semibold text-[var(--text-primary)] uppercase tracking-wider text-[10px]">
                            Criterios Obligatorios de Evaluación
                          </div>
                          <ul className="text-[var(--text-secondary)] space-y-1 list-disc list-inside leading-relaxed">
                            {rubric.keyCriteria?.map((crit: string, idx: number) => (
                              <li key={idx}>
                                <span>{crit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {rubric.evaluatedScope && (
                        <div className="pt-2 border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span><strong>Temas Evaluados:</strong> {rubric.evaluatedScope}</span>
                          <span className="font-mono text-[var(--accent)]">UCABA · 2026</span>
                        </div>
                      )}
                    </div>
                  );
                }

                if (exam.notes) {
                  return (
                    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-3 text-[11px] text-[var(--text-secondary)]">
                      <div className="font-semibold text-[var(--text-primary)] mb-1">Pautas de Evaluación:</div>
                      <p>{exam.notes}</p>
                    </div>
                  );
                }

                return null;
              })()}

              {/* Plan de Preparación Automatizado */}
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 flex items-center justify-between">
                  <span>Cronograma de Repaso por Unidades</span>
                  <span className="text-[10px] text-[var(--accent)]">
                    {exam.planItems.filter((i: any) => i.completed).length} de {exam.planItems.length} completados
                  </span>
                </div>
                <div className="space-y-1.5">
                  {exam.planItems.map((item: any) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-md bg-[var(--bg-surface-elevated)] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <input
                          type="checkbox"
                          defaultChecked={item.completed}
                          onChange={async (e) => {
                            await togglePlanItemCompleted(item.id, e.target.checked);
                          }}
                          className="rounded border-[var(--border-strong)] text-[var(--accent)] focus:ring-0 cursor-pointer w-3.5 h-3.5"
                        />
                        <span className={`truncate font-medium ${item.completed ? "line-through text-[var(--text-muted)]" : "text-[var(--text-primary)]"}`}>
                          {item.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono shrink-0">
                        {formatDateEs(item.scheduledDate)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 7. Tasks Tab */}
      {tab === "tasks" && (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Trabajos Prácticos y Entregas
            </h3>
            <Link
              href="/tasks?action=new"
              className="text-xs text-[var(--accent)] hover:underline"
            >
              Nuevo Trabajo
            </Link>
          </div>

          <div className="space-y-2 text-xs">
            {subject.assignments.map((a: any) => (
              <div
                key={a.id}
                className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <input
                    type="checkbox"
                    defaultChecked={a.status === "completed"}
                    onChange={async (e) => {
                      await updateAssignmentStatus(a.id, e.target.checked ? "completed" : "todo");
                    }}
                    className="mt-0.5 rounded border-[var(--border-strong)] text-[var(--accent)] cursor-pointer"
                  />
                  <div className="min-w-0">
                    <div className={`font-semibold ${a.status === "completed" ? "line-through text-[var(--text-muted)]" : "text-[var(--text-primary)]"}`}>
                      {a.title}
                    </div>
                    {a.description && (
                      <p className="text-[11px] text-[var(--text-secondary)] mt-1 line-clamp-2">
                        {a.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded border uppercase font-bold ${
                      a.priority === "urgent" || a.priority === "high"
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}
                  >
                    {a.priority}
                  </span>
                  <div className="text-[11px] text-[var(--text-muted)] mt-1">
                    Entrega: {formatDateEs(a.dueDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Study Tab */}
      {tab === "study" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-sm text-[var(--text-primary)]">
                Repaso de Flashcards SM-2
              </h4>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                Repasa las {subject.flashcards.length} tarjetas de memoria creadas estrictamente a partir de las clases y ordenadas por Unidades temáticas.
              </p>
            </div>
            <Link
              href={`/reviews?subjectId=${subject.id}`}
              className="mt-4 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-[var(--accent)] text-white font-medium hover:opacity-90 transition"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Iniciar Repaso</span>
            </Link>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-sm text-[var(--text-primary)]">
                Simulacro de Examen & Quiz
              </h4>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                Pon a prueba tus conocimientos con {subject.questions.length} preguntas de opción múltiple de cátedra correspondientes a las Unidades 1, 2 y 3.
              </p>
            </div>
            <Link
              href={`/study/quiz/${subject.id}`}
              className="mt-4 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] text-[var(--text-primary)] font-medium transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Comenzar Quiz</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
