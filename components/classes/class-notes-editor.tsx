"use client";

import React, { useState, useEffect, useTransition, useRef } from "react";
import {
  FileEdit,
  Save,
  Eye,
  Edit3,
  Check,
  Loader2,
  Bold,
  Heading,
  List,
  CheckSquare,
  Code,
  Quote,
  Sparkles,
} from "lucide-react";
import { updateClassNotes } from "@/app/actions/academic";
import { MarkdownContent } from "@/components/ui/markdown-content";

interface ClassNotesEditorProps {
  classId: string;
  initialNotes?: string | null;
  classTitle: string;
}

export function ClassNotesEditor({
  classId,
  initialNotes = "",
  classTitle,
}: ClassNotesEditorProps) {
  const [notes, setNotes] = useState(initialNotes || "");
  const [savedNotes, setSavedNotes] = useState(initialNotes || "");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isPending, startTransition] = useTransition();
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDirty = notes !== savedNotes;

  // Handle keyboard shortcut Cmd+S / Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (isDirty) {
          handleSave();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [notes, isDirty]);

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateClassNotes(classId, notes);
      if (res.success) {
        setSavedNotes(notes);
        setSaveMessage("Guardado");
        setTimeout(() => setSaveMessage(null), 2500);
      } else {
        setSaveMessage("Error al guardar");
      }
    });
  };

  // Helper for inserting formatting
  const insertFormatting = (prefix: string, suffix: string = "") => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = notes.substring(start, end);
    const replacement = `${prefix}${selected || "texto"}${suffix}`;
    const nextNotes = notes.substring(0, start) + replacement + notes.substring(end);
    setNotes(nextNotes);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 5));
    }, 10);
  };

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-xs text-xs">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 sm:px-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
            <FileEdit className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-xs text-[var(--text-primary)]">
                Cuaderno de Apuntes de Clase
              </h3>
              {saveMessage ? (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <Check className="w-3 h-3" />
                  <span>{saveMessage}</span>
                </span>
              ) : isDirty ? (
                <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>Cambios sin guardar</span>
                </span>
              ) : (
                <span className="text-[10px] text-[var(--text-muted)] opacity-75">
                  Sincronizado
                </span>
              )}
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              Registra ideas clave, apuntes del docente y dudas durante la cursada
            </p>
          </div>
        </div>

        {/* Top controls: mode tabs and save button */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Edit / Preview Segmented Control */}
          <div className="flex items-center p-0.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition flex items-center gap-1.5 ${
                activeTab === "edit"
                  ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs border border-[var(--border-subtle)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Edit3 className="w-3 h-3" />
              <span>Escribir</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition flex items-center gap-1.5 ${
                activeTab === "preview"
                  ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs border border-[var(--border-subtle)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Vista Previa</span>
            </button>
          </div>

          {/* Save Action */}
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || isPending}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition shadow-xs ${
              isDirty
                ? "bg-[var(--accent)] text-white hover:opacity-90 cursor-pointer"
                : "bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)] cursor-default opacity-60"
            }`}
            title="Guardar apuntes (Cmd+S)"
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Guardar</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {activeTab === "edit" ? (
        <div className="flex flex-col">
          {/* Quick formatting toolbar */}
          <div className="flex items-center gap-1 px-3 py-1.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 text-[var(--text-muted)] overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => insertFormatting("**", "**")}
              className="p-1 rounded hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)] transition"
              title="Negrita (**texto**)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("### ", "")}
              className="p-1 rounded hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)] transition"
              title="Encabezado (### Título)"
            >
              <Heading className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("- ", "")}
              className="p-1 rounded hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)] transition"
              title="Lista de viñetas"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("- [ ] ", "")}
              className="p-1 rounded hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)] transition"
              title="Casilla de verificación / Tarea"
            >
              <CheckSquare className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("`", "`")}
              className="p-1 rounded hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)] transition"
              title="Código en línea (`código`)"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("> ", "")}
              className="p-1 rounded hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)] transition"
              title="Cita o concepto destacado"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <div className="h-3 w-px bg-[var(--border-subtle)] mx-1" />
            <span className="text-[10px] text-[var(--text-muted)]/70">
              Soporta Markdown completo · Presiona <kbd className="text-[9px]">⌘S</kbd> para guardar
            </span>
          </div>

          <textarea
            ref={textareaRef}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={`Escribe aquí tus notas personales tomadas en clase sobre "${classTitle}"...\n\nEjemplos:\n### Puntos clave del docente\n- Concepto importante a recordar...\n- Posible tema de examen...\n\n> 💡 Idea para el trabajo práctico`}
            rows={10}
            className="w-full p-4 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none resize-y min-h-[220px] font-sans leading-relaxed text-xs border-none"
          />
        </div>
      ) : (
        <div className="p-4 sm:p-5 min-h-[220px] bg-[var(--bg-surface)]">
          {notes.trim() ? (
            <MarkdownContent content={notes} />
          ) : (
            <div className="py-12 text-center text-[var(--text-muted)] space-y-2">
              <Sparkles className="w-5 h-5 mx-auto text-[var(--text-muted)]/50" />
              <p className="text-xs">No hay notas escritas todavía.</p>
              <p className="text-[11px] text-[var(--text-muted)]/70">
                Cambia a la pestaña "Escribir" para tomar tus primeros apuntes.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Footer info bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]/30 text-[11px] text-[var(--text-muted)]">
        <div className="flex items-center gap-3 font-mono text-[10px]">
          <span>{wordCount} palabras</span>
          <span>·</span>
          <span>{notes.length} caracteres</span>
        </div>
        <div className="text-[10px]">
          {isDirty ? (
            <span className="text-amber-400">Recuerda guardar antes de salir</span>
          ) : (
            <span className="text-[var(--text-muted)]/80">Todos los cambios guardados</span>
          )}
        </div>
      </div>
    </div>
  );
}
