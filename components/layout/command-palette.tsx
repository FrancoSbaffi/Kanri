"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  GraduationCap,
  Sparkles,
  Layers,
  FileText,
  CheckSquare,
  BarChart3,
  Settings,
  Plus,
  Moon,
  Sun,
  Search,
  Upload,
  Clock,
  X,
} from "lucide-react";
import { useTheme } from "./theme-provider";

interface CommandItem {
  id: string;
  title: string;
  category: "Navegación" | "Acciones Rápidas" | "Estudio" | "Sistema";
  icon: any;
  shortcut?: string;
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { toggleTheme, resolvedTheme } = useTheme();

  // Listen for global keyboard shortcuts
  useEffect(() => {
    let keyBuffer = "";
    let keyTimer: any = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when inside input/textarea unless it's Esc or ⌘K
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setSearch("");
        setSelectedIndex(0);
        return;
      }

      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
        return;
      }

      if (isInput) return;

      // Sequential shortcuts like 'G' then 'D'
      if (!open) {
        clearTimeout(keyTimer);
        keyBuffer += e.key.toLowerCase();
        keyTimer = setTimeout(() => {
          keyBuffer = "";
        }, 600);

        if (keyBuffer === "gd") {
          router.push("/dashboard");
          keyBuffer = "";
        } else if (keyBuffer === "gc") {
          router.push("/calendar");
          keyBuffer = "";
        } else if (keyBuffer === "gs") {
          router.push("/subjects");
          keyBuffer = "";
        } else if (keyBuffer === "gr") {
          router.push("/reviews");
          keyBuffer = "";
        } else if (keyBuffer === "ge") {
          router.push("/exams");
          keyBuffer = "";
        } else if (keyBuffer === "gt") {
          router.push("/tasks");
          keyBuffer = "";
        } else if (keyBuffer === "gl") {
          router.push("/library");
          keyBuffer = "";
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, router]);

  const commands: CommandItem[] = useMemo(
    () => [
      // Navigation
      {
        id: "nav-dash",
        title: "Ir al Dashboard",
        category: "Navegación",
        icon: LayoutDashboard,
        shortcut: "G D",
        action: () => router.push("/dashboard"),
      },
      {
        id: "nav-cal",
        title: "Ir al Calendario Académico",
        category: "Navegación",
        icon: Calendar,
        shortcut: "G C",
        action: () => router.push("/calendar"),
      },
      {
        id: "nav-subj",
        title: "Ver Materias",
        category: "Navegación",
        icon: BookOpen,
        shortcut: "G S",
        action: () => router.push("/subjects"),
      },
      {
        id: "nav-classes",
        title: "Ver Clases y Cronogramas",
        category: "Navegación",
        icon: GraduationCap,
        shortcut: "G K",
        action: () => router.push("/classes"),
      },
      {
        id: "nav-study",
        title: "Centro de Estudio y Pomodoro",
        category: "Estudio",
        icon: Clock,
        shortcut: "G P",
        action: () => router.push("/study"),
      },
      {
        id: "nav-reviews",
        title: "Repasos Espaciados (Flashcards SM-2)",
        category: "Estudio",
        icon: Layers,
        shortcut: "G R",
        action: () => router.push("/reviews"),
      },
      {
        id: "nav-exams",
        title: "Exámenes y Cuenta Regresiva",
        category: "Navegación",
        icon: Sparkles,
        shortcut: "G E",
        action: () => router.push("/exams"),
      },
      {
        id: "nav-tasks",
        title: "Trabajos Prácticos y Tareas",
        category: "Navegación",
        icon: CheckSquare,
        shortcut: "G T",
        action: () => router.push("/tasks"),
      },
      {
        id: "nav-library",
        title: "Biblioteca de Materiales y PDFs",
        category: "Navegación",
        icon: FileText,
        shortcut: "G L",
        action: () => router.push("/library"),
      },
      {
        id: "nav-analytics",
        title: "Progreso y Estadísticas Académicas",
        category: "Navegación",
        icon: BarChart3,
        action: () => router.push("/analytics"),
      },
      {
        id: "nav-settings",
        title: "Configuración de Kanri",
        category: "Navegación",
        icon: Settings,
        action: () => router.push("/settings"),
      },

      // Quick Actions
      {
        id: "act-upload",
        title: "Subir Material / PDF de clase",
        category: "Acciones Rápidas",
        icon: Upload,
        action: () => router.push("/library?action=upload"),
      },
      {
        id: "act-new-class",
        title: "Generar Cronograma de Clases Recurrentes",
        category: "Acciones Rápidas",
        icon: Plus,
        action: () => router.push("/classes?action=generate"),
      },
      {
        id: "act-new-exam",
        title: "Registrar Nuevo Examen Parcial / Final",
        category: "Acciones Rápidas",
        icon: Plus,
        action: () => router.push("/exams?action=new"),
      },
      {
        id: "act-new-task",
        title: "Crear Nuevo Trabajo Práctico",
        category: "Acciones Rápidas",
        icon: Plus,
        action: () => router.push("/tasks?action=new"),
      },

      // System
      {
        id: "sys-theme",
        title: `Alternar Tema (actualmente ${resolvedTheme === "dark" ? "Oscuro" : "Claro"})`,
        category: "Sistema",
        icon: resolvedTheme === "dark" ? Sun : Moon,
        action: () => toggleTheme(),
      },
    ],
    [router, resolvedTheme, toggleTheme]
  );

  const filteredCommands = useMemo(() => {
    if (!search.trim()) return commands;
    const term = search.toLowerCase();
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(term) ||
        c.category.toLowerCase().includes(term) ||
        (c.shortcut && c.shortcut.toLowerCase().includes(term))
    );
  }, [commands, search]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const handleSelect = (cmd: CommandItem) => {
    setOpen(false);
    cmd.action();
  };

  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        handleSelect(filteredCommands[selectedIndex]);
      }
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 bg-black/60 backdrop-blur-sm px-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleModalKeyDown}
      >
        {/* Search input header */}
        <div className="flex items-center px-4 py-3 border-b border-[var(--border-subtle)] gap-3">
          <Search className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
          <input
            autoFocus
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Escribe un comando o busca en Kanri..."
            className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
          />
          <button
            onClick={() => setOpen(false)}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-0.5 rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-transparent">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--text-muted)]">
              No se encontraron comandos para &ldquo;{search}&rdquo;
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => handleSelect(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-xs transition ${
                    isSelected
                      ? "bg-[var(--bg-surface-active)] text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isSelected ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`} />
                    <span className="font-medium">{cmd.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                      {cmd.category}
                    </span>
                    {cmd.shortcut && <kbd>{cmd.shortcut}</kbd>}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <span>Navegar</span>
            <kbd>↑</kbd>
            <kbd>↓</kbd>
            <span className="ml-2">Seleccionar</span>
            <kbd>↵</kbd>
          </div>
          <div className="flex items-center gap-2">
            <span>Cerrar</span>
            <kbd>ESC</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
