"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  Laptop,
  Sparkles,
  CheckSquare,
  Layers,
  MapPin,
  Clock,
  X,
  ExternalLink,
  Calendar,
  Download,
} from "lucide-react";
import { formatDateEs } from "@/lib/utils/dates";

export interface CalendarEvent {
  id: string;
  rawId?: string;
  type: "presencial" | "virtual" | "exam" | "assignment" | "review";
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  room?: string;
  location?: string;
  subjectName: string;
  subjectColor: string;
  url: string;
}

export function AcademicCalendar({
  initialEvents,
  subjects,
}: {
  initialEvents: CalendarEvent[];
  subjects: { id: string; name: string; color: string }[];
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "agenda">("month");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const [selectedType, setSelectedType] = useState<
    "all" | "presencial" | "virtual" | "exam" | "assignment"
  >("all");
  const [showExportModal, setShowExportModal] = useState(false);

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const todayMonth = () => {
    setCurrentDate(new Date());
  };

  const filteredEvents = initialEvents.filter((ev) => {
    if (selectedSubject !== "all" && ev.subjectName !== selectedSubject) return false;
    if (selectedType === "presencial" && ev.type !== "presencial") return false;
    if (selectedType === "virtual" && ev.type !== "virtual") return false;
    if (selectedType === "exam" && ev.type !== "exam") return false;
    if (selectedType === "assignment" && ev.type !== "assignment") return false;
    return true;
  });

  // Calculate event type counts for the current subject selection
  const typeCounts = {
    all: initialEvents.filter((e) => selectedSubject === "all" || e.subjectName === selectedSubject).length,
    presencial: initialEvents.filter((e) => (selectedSubject === "all" || e.subjectName === selectedSubject) && e.type === "presencial").length,
    virtual: initialEvents.filter((e) => (selectedSubject === "all" || e.subjectName === selectedSubject) && e.type === "virtual").length,
    exam: initialEvents.filter((e) => (selectedSubject === "all" || e.subjectName === selectedSubject) && e.type === "exam").length,
    assignment: initialEvents.filter((e) => (selectedSubject === "all" || e.subjectName === selectedSubject) && e.type === "assignment").length,
  };

  const currentSubjectObj = subjects.find((s) => s.name === selectedSubject);
  const exportParams = new URLSearchParams();
  if (selectedType !== "all") exportParams.set("type", selectedType);
  if (currentSubjectObj) exportParams.set("subjectId", currentSubjectObj.id);
  const exportUrl = `/api/calendar/export${exportParams.toString() ? `?${exportParams.toString()}` : ""}`;

  // Month grid generation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const dayLabels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  // Days array including padding for offset
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  return (
    <div className="space-y-4 text-xs">
      {/* Calendar Top Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3.5">
        <div className="flex items-center gap-2">
          <button
            onClick={todayMonth}
            className="px-3 py-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] font-medium text-xs text-[var(--text-primary)] transition"
          >
            Hoy
          </button>
          <div className="flex items-center bg-[var(--bg-surface-elevated)] rounded-md border border-[var(--border-subtle)] p-0.5">
            <button
              onClick={prevMonth}
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition"
              title="Mes anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition"
              title="Mes siguiente"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="font-semibold text-sm tracking-tight text-[var(--text-primary)] ml-1">
            {monthNames[month]} {year}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter by Subject - macOS NSPopUpButton style */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] text-xs font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">Todas las materias</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          {/* View Mode Toggle - macOS Segmented Control */}
          <div className="flex items-center bg-[var(--bg-surface-elevated)] p-0.5 rounded-lg border border-[var(--border-subtle)]">
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                viewMode === "month"
                  ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Mes
            </button>
            <button
              onClick={() => setViewMode("agenda")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                viewMode === "agenda"
                  ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Agenda
            </button>
          </div>

          {/* Export Calendar (.ics) - Button with macOS Modal */}
          <button
            onClick={() => setShowExportModal(true)}
            className="baseframe-btn-primary cursor-pointer"
            title="Exportar a Calendario de Mac (.ics)"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Exportar a Mac Calendar</span>
          </button>
        </div>
      </div>

      {/* Dedicated Category & Modality Filter Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[var(--bg-surface-elevated)] rounded-lg border border-[var(--border-subtle)]">
        <button
          onClick={() => setSelectedType("all")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
            selectedType === "all"
              ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs font-semibold border border-[var(--border-subtle)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          <span>Todos</span>
          <span className="font-mono text-[10px] opacity-75 px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/10 font-bold">
            {typeCounts.all}
          </span>
        </button>

        <button
          onClick={() => setSelectedType("presencial")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
            selectedType === "presencial"
              ? "bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30 shadow-xs font-semibold"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-amber-500" />
          <span>Clases Presenciales</span>
          <span className="font-mono text-[10px] opacity-80 px-1.5 py-0.2 rounded bg-amber-500/15 font-bold">
            {typeCounts.presencial}
          </span>
        </button>

        <button
          onClick={() => setSelectedType("virtual")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
            selectedType === "virtual"
              ? "bg-blue-500/15 text-blue-500 dark:text-blue-400 border border-blue-500/30 shadow-xs font-semibold"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Laptop className="w-3.5 h-3.5 text-blue-500" />
          <span>Clases Virtuales</span>
          <span className="font-mono text-[10px] opacity-80 px-1.5 py-0.2 rounded bg-blue-500/15 font-bold">
            {typeCounts.virtual}
          </span>
        </button>

        <button
          onClick={() => setSelectedType("exam")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
            selectedType === "exam"
              ? "bg-rose-500/15 text-rose-500 dark:text-rose-400 border border-rose-500/30 shadow-xs font-semibold"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-rose-500" />
          <span>Parciales y Exámenes</span>
          <span className="font-mono text-[10px] opacity-80 px-1.5 py-0.2 rounded bg-rose-500/15 font-bold">
            {typeCounts.exam}
          </span>
        </button>

        <button
          onClick={() => setSelectedType("assignment")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
            selectedType === "assignment"
              ? "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 shadow-xs font-semibold"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
          <span>Entregas de TPs</span>
          <span className="font-mono text-[10px] opacity-80 px-1.5 py-0.2 rounded bg-emerald-500/15 font-bold">
            {typeCounts.assignment}
          </span>
        </button>
      </div>

      {/* Month View Grid */}
      {viewMode === "month" && (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]">
            {dayLabels.map((lbl, idx) => (
              <div
                key={idx}
                className="py-2 text-center text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider"
              >
                {lbl}
              </div>
            ))}
          </div>

          {/* Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-[var(--border-subtle)]">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-[90px] sm:min-h-[110px] bg-[var(--bg-surface-elevated)]/20"
                  />
                );
              }

              const cellDate = new Date(year, month, day);
              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;

              const dayEvents = filteredEvents.filter((ev) => {
                const d = new Date(ev.date);
                return (
                  d.getDate() === day &&
                  d.getMonth() === month &&
                  d.getFullYear() === year
                );
              });

              return (
                <div
                  key={`day-${day}`}
                  className={`min-h-[90px] sm:min-h-[110px] p-1.5 transition flex flex-col justify-between ${
                    isToday ? "bg-[var(--accent)]/5" : "hover:bg-[var(--bg-surface-elevated)]/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-mono w-5 h-5 flex items-center justify-center rounded font-medium ${
                        isToday
                          ? "bg-[#090a0f] text-white dark:bg-white dark:text-[#08090c] font-bold"
                          : "text-[var(--text-muted)]"
                      }`}
                    >
                      {day}
                    </span>
                  </div>

                  {/* Event Badges */}
                  <div className="space-y-1 my-1 overflow-hidden">
                    {dayEvents.slice(0, 3).map((ev) => {
                      return (
                        <div
                          key={ev.id}
                          onClick={() => setSelectedEvent(ev)}
                          className="px-1.5 py-0.5 rounded text-[10px] truncate cursor-pointer transition border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] flex items-center gap-1"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: ev.subjectColor }}
                          />
                          <span className="truncate font-medium text-[var(--text-primary)]">
                            {ev.type === "presencial" ? "🏫 " : ev.type === "virtual" ? "💻 " : ev.type === "exam" ? "📝 " : ev.type === "assignment" ? "📋 " : ""}
                            {ev.title}
                          </span>
                        </div>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <div className="text-[9px] text-[var(--text-muted)] text-center font-mono">
                        +{dayEvents.length - 3} más
                      </div>
                    )}
                  </div>
                  <div />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Agenda View */}
      {viewMode === "agenda" && (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] divide-y divide-[var(--border-subtle)]">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              onClick={() => setSelectedEvent(ev)}
              className="p-3.5 flex items-center justify-between hover:bg-[var(--bg-surface-elevated)] transition cursor-pointer text-xs group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: ev.subjectColor }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition truncate">
                      {ev.title}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded border uppercase font-bold ${
                        ev.type === "presencial"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : ev.type === "virtual"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : ev.type === "exam"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : ev.type === "assignment"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]"
                      }`}
                    >
                      {ev.type === "presencial"
                        ? "Presencial"
                        : ev.type === "virtual"
                        ? "Virtual"
                        : ev.type === "exam"
                        ? "Parcial"
                        : ev.type === "assignment"
                        ? "Entrega TP"
                        : ev.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-0.5 flex items-center gap-2">
                    <span>{ev.subjectName}</span>
                    {ev.room && (
                      <>
                        <span>·</span>
                        <span>{ev.room}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-medium text-[var(--text-secondary)]">
                  {formatDateEs(ev.date, { includeDayName: true })}
                </div>
                {ev.startTime && (
                  <div className="text-[11px] text-[var(--text-muted)]">
                    {ev.startTime} {ev.endTime ? `– ${ev.endTime}` : ""} hs
                  </div>
                )}
              </div>
            </div>
          ))}
          {filteredEvents.length === 0 && (
            <div className="py-8 text-center text-xs text-[var(--text-muted)]">
              No hay eventos en la agenda para la selección actual.
            </div>
          )}
        </div>
      )}

      {/* Mac Calendar Export Modal */}
      {showExportModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setShowExportModal(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-100 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-[var(--border-subtle)] pb-3.5">
              <div>
                <div className="flex items-center gap-2 text-[var(--accent)] font-semibold uppercase tracking-wider text-[10px] font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Sincronización Apple Calendar</span>
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)] mt-1 tracking-tight">
                  Exportar a Calendario de Mac
                </h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Summary of what is being exported based on current active filters */}
              <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-1.5">
                <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase">
                  Selección Activa a Exportar
                </div>
                <div className="flex items-center justify-between font-semibold text-sm text-[var(--text-primary)]">
                  <span>
                    {selectedType === "all"
                      ? "Todos los eventos académicos"
                      : selectedType === "presencial"
                      ? "Clases Presenciales en Sede"
                      : selectedType === "virtual"
                      ? "Clases Virtuales Campus"
                      : selectedType === "exam"
                      ? "Parciales y Exámenes"
                      : "Entregas de Trabajos Prácticos"}
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                    {filteredEvents.length} eventos
                  </span>
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">
                  {selectedSubject === "all"
                    ? "Incluye todas las 4 cátedras de la cursada 2026"
                    : `Filtrado por: ${selectedSubject}`}
                </div>
              </div>

              {/* Instructions for macOS */}
              <div className="space-y-2 text-[11px] text-[var(--text-secondary)] leading-relaxed">
                <div className="font-semibold text-[var(--text-primary)] text-xs">
                  Pasos para importar en macOS:
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-xs text-[var(--accent)] font-bold">1.</span>
                  <span>Hacé clic en el botón de descarga a continuación para obtener el archivo <code>.ics</code>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-xs text-[var(--accent)] font-bold">2.</span>
                  <span>Abrí el archivo descargado: macOS abrirá automáticamente la aplicación <strong>Calendario</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-xs text-[var(--accent)] font-bold">3.</span>
                  <span>Seleccioná el calendario de destino (ej: tu cuenta de iCloud o creá <em>&ldquo;Kanri UCABA&rdquo;</em>).</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <span>✓ Formato RFC 5545 validado para macOS</span>
                </div>
                <div className="text-[10px] text-emerald-300/80">
                  Incluye alarmas de presencialidad (-24h y -2h) y zona horaria fijada en Buenos Aires (America/Argentina/Buenos_Aires).
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center gap-2.5">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-3.5 py-2 rounded-md border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-elevated)] font-medium text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer"
              >
                Cerrar
              </button>
              <a
                href={exportUrl}
                download={
                  selectedType === "presencial"
                    ? "kanri_clases_presenciales.ics"
                    : selectedType === "virtual"
                    ? "kanri_clases_virtuales.ics"
                    : selectedType === "exam"
                    ? "kanri_parciales_examenes.ics"
                    : selectedType === "assignment"
                    ? "kanri_entregas_tps.ics"
                    : "kanri_calendario_ucaba.ics"
                }
                onClick={() => setShowExportModal(false)}
                className="flex-1 text-center py-2 rounded-md bg-white text-[#090a0f] hover:bg-neutral-200 font-semibold flex items-center justify-center gap-2 transition text-xs shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar archivo .ics</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Contextual Event Details Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-[var(--border-subtle)] pb-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: selectedEvent.subjectColor }}
                  />
                  <span className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                    {selectedEvent.subjectName}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mt-1 tracking-tight">
                  {selectedEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[var(--text-secondary)]">
              {/* Modality Banner - Apple HIG Style */}
              <div
                className={`p-2.5 rounded-lg border flex items-center gap-2.5 font-medium ${
                  selectedEvent.type === "presencial"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : selectedEvent.type === "virtual"
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    : selectedEvent.type === "exam"
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                }`}
              >
                {selectedEvent.type === "presencial" ? (
                  <>
                    <Building2 className="w-4 h-4 shrink-0 text-amber-500" />
                    <div>
                      <div className="font-semibold text-xs text-[var(--text-primary)]">Clase Presencial</div>
                      <div className="text-[11px] text-[var(--text-muted)]">Asistencia en aula física</div>
                    </div>
                  </>
                ) : selectedEvent.type === "virtual" ? (
                  <>
                    <Laptop className="w-4 h-4 shrink-0 text-blue-500" />
                    <div>
                      <div className="font-semibold text-xs text-[var(--text-primary)]">Clase Virtual</div>
                      <div className="text-[11px] text-[var(--text-muted)]">Conexión sincrónica en línea</div>
                    </div>
                  </>
                ) : selectedEvent.type === "exam" ? (
                  <>
                    <Clock className="w-4 h-4 shrink-0 text-rose-500" />
                    <div>
                      <div className="font-semibold text-xs text-[var(--text-primary)]">Examen Presencial</div>
                      <div className="text-[11px] text-[var(--text-muted)]">Evaluación obligatoria en sede</div>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckSquare className="w-4 h-4 shrink-0 text-emerald-500" />
                    <div>
                      <div className="font-semibold text-xs text-[var(--text-primary)]">Entrega de TP</div>
                      <div className="text-[11px] text-[var(--text-muted)]">Trabajo práctico evaluable</div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                <span>
                  {formatDateEs(selectedEvent.date, { includeDayName: true, includeYear: true })}
                  {selectedEvent.startTime ? ` · ${selectedEvent.startTime} hs` : ""}
                </span>
              </div>

              {selectedEvent.room ? (
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                  <span>
                    {selectedEvent.room} ({selectedEvent.location || "Sede UCABA"})
                  </span>
                </div>
              ) : selectedEvent.type === "virtual" ? (
                <div className="flex items-center gap-2.5">
                  <Laptop className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                  <span>Campus Virtual UCABA (Sincrónico)</span>
                </div>
              ) : null}
            </div>

            <div className="pt-3 flex items-center gap-2 border-t border-[var(--border-subtle)]">
              {selectedEvent.rawId && (selectedEvent.type === "presencial" || selectedEvent.type === "virtual" || selectedEvent.type === "exam") && (
                <a
                  href={`/api/calendar/export?${selectedEvent.type === "exam" ? `examId=${selectedEvent.rawId}` : `classId=${selectedEvent.rawId}`}`}
                  download
                  className="flex-1 text-center py-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] text-[var(--text-primary)] font-medium flex items-center justify-center gap-1.5 transition text-xs"
                  title="Descargar este evento individual en formato .ics"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Añadir a Mac</span>
                </a>
              )}
              <Link
                href={selectedEvent.url}
                className="flex-1 text-center py-1.5 rounded-md bg-white text-[#090a0f] font-medium hover:bg-neutral-200 transition text-xs"
              >
                Abrir Detalle
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
