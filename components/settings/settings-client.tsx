"use client";

import React, { useState } from "react";
import { useTheme } from "@/components/layout/theme-provider";
import {
  Download,
  Calendar,
  Moon,
  Sun,
  Laptop,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Database,
  Bell,
  Clock,
  ExternalLink,
} from "lucide-react";

export function SettingsClient({
  initialUser,
  isAiConfigured,
}: {
  initialUser: any;
  isAiConfigured: boolean;
}) {
  const { theme, setTheme } = useTheme();
  const [presencialHours, setPresencialHours] = useState("24");
  const [examReminderDays, setExamReminderDays] = useState("7");
  const [savedMsg, setSavedMsg] = useState("");

  const handleSavePreferences = () => {
    setSavedMsg("Preferencias guardadas correctamente.");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6 text-xs">
      {/* 1. Appearance / Theme */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
        <h3 className="font-semibold text-xs text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2.5">
          Apariencia & Tema Visual
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setTheme("dark")}
            className={`p-3 rounded-lg border text-left transition flex items-center gap-3 ${
              theme === "dark"
                ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-primary)]"
                : "border-[var(--border-subtle)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]"
            }`}
          >
            <Moon className="w-4 h-4 text-indigo-400" />
            <div>
              <div className="font-medium">Modo Oscuro</div>
              <div className="text-[10px] text-[var(--text-muted)]">Linear Dark</div>
            </div>
          </button>

          <button
            onClick={() => setTheme("light")}
            className={`p-3 rounded-lg border text-left transition flex items-center gap-3 ${
              theme === "light"
                ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-primary)]"
                : "border-[var(--border-subtle)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]"
            }`}
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <div>
              <div className="font-medium">Modo Claro</div>
              <div className="text-[10px] text-[var(--text-muted)]">Linear Clean</div>
            </div>
          </button>

          <button
            onClick={() => setTheme("system")}
            className={`p-3 rounded-lg border text-left transition flex items-center gap-3 ${
              theme === "system"
                ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-primary)]"
                : "border-[var(--border-subtle)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]"
            }`}
          >
            <Laptop className="w-4 h-4 text-purple-400" />
            <div>
              <div className="font-medium">Sistema</div>
              <div className="text-[10px] text-[var(--text-muted)]">Automático</div>
            </div>
          </button>
        </div>
      </div>

      {/* 2. General Profile & Timezone */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
        <h3 className="font-semibold text-xs text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2.5">
          Perfil Académico & Zona Horaria
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
              Nombre de Usuario
            </label>
            <input
              type="text"
              defaultValue={initialUser?.name || "Franco Sbaffi"}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
              Universidad / Facultad
            </label>
            <input
              type="text"
              defaultValue={initialUser?.university || "Universidad Tecnológica Nacional"}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
              Zona Horaria
            </label>
            <select
              defaultValue={initialUser?.timezone || "America/Argentina/Buenos_Aires"}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] focus:outline-none"
            >
              <option value="America/Argentina/Buenos_Aires">
                America/Argentina/Buenos_Aires (GMT-3)
              </option>
              <option value="America/Santiago">America/Santiago (GMT-4)</option>
              <option value="America/Montevideo">America/Montevideo (GMT-3)</option>
              <option value="America/Bogota">America/Bogota (GMT-5)</option>
              <option value="America/Mexico_City">America/Mexico_City (GMT-6)</option>
              <option value="Europe/Madrid">Europe/Madrid (GMT+2)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
              Carrera de Grado
            </label>
            <input
              type="text"
              defaultValue={initialUser?.career || "Ingeniería en Sistemas de Información"}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Presencial Class Warnings & Notifications */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
        <h3 className="font-semibold text-xs text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2.5 flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5" />
          <span>Alertas de Clases Presenciales & Recordatorios</span>
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-[var(--text-primary)]">
                Anticipación de Alerta para Clases Presenciales
              </div>
              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Muestra la notificación destacada en la cabecera antes de la clase en aula
              </div>
            </div>
            <select
              value={presencialHours}
              onChange={(e) => setPresencialHours(e.target.value)}
              className="px-2.5 py-1 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)]"
            >
              <option value="24">24 horas antes</option>
              <option value="3">3 horas antes</option>
              <option value="1">1 hora antes</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
            <div>
              <div className="font-medium text-[var(--text-primary)]">
                Prioridad de Repaso para Exámenes Próximos
              </div>
              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Incrementa el peso en el plan de estudio diario cuando el parcial está cerca
              </div>
            </div>
            <select
              value={examReminderDays}
              onChange={(e) => setExamReminderDays(e.target.value)}
              className="px-2.5 py-1 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)]"
            >
              <option value="14">14 días antes</option>
              <option value="7">7 días antes</option>
              <option value="3">3 días antes</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-[var(--border-subtle)]">
          {savedMsg ? (
            <span className="text-emerald-400 font-medium text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {savedMsg}
            </span>
          ) : (
            <span />
          )}
          <button
            onClick={handleSavePreferences}
            className="px-3 py-1.5 rounded-md bg-[var(--accent)] text-white font-medium hover:opacity-90 transition"
          >
            Guardar Configuración
          </button>
        </div>
      </div>

      {/* 4. AI Engine Status */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
          <h3 className="font-semibold text-xs text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Motor de Inteligencia Artificial</span>
          </h3>
          <span
            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
              isAiConfigured
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            }`}
          >
            {isAiConfigured ? "Conectado" : "Modo Offline Activo"}
          </span>
        </div>

        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
          Kanri cuenta con una arquitectura desacoplada compatible con cualquier endpoint OpenAI (OpenAI, Groq, OpenRouter o Gemini OpenAI).
          {isAiConfigured ? (
            <span className="text-emerald-400 font-medium ml-1">
              La clave API está configurada y procesando resúmenes en vivo.
            </span>
          ) : (
            <span className="ml-1">
              Actualmente funciona con el motor determinístico local de Kanri, permitiéndote subir PDFs y generar resúmenes, preguntas y flashcards de inmediato sin requerir conexión a internet. Para activar un modelo en la nube, añade tu clave en el archivo <code className="px-1 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">.env</code> como <code className="px-1 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">OPENAI_API_KEY</code>.
            </span>
          )}
        </p>
      </div>

      {/* 5. Calendar Synchronization */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
          <h3 className="font-semibold text-xs text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Sincronización con Calendario (.ics)</span>
          </h3>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
            Estándar iCalendar
          </span>
        </div>

        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
          Exporta tu cronograma universitario directamente en formato estándar compatible con Apple Calendar, Google Calendar y Outlook.
          Cada evento incluye la modalidad detallada y recordatorios automáticos:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] space-y-1">
            <div className="font-medium text-[var(--text-primary)] text-xs flex items-center gap-1.5">
              <span>Clases Presenciales</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-normal">
              Incluye aula (Aula 304, Aula 108, Aula Magna 102), dirección de sede y recordatorios de 24 hs y 2 hs antes.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] space-y-1">
            <div className="font-medium text-[var(--text-primary)] text-xs flex items-center gap-1.5">
              <span>Clases Virtuales</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-normal">
              Incluye enlace sincrónico de campus, docentes a cargo y recordatorio 30 minutos antes.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href="/api/calendar/export"
            download="kanri_calendario_ucaba.ics"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[var(--accent)] hover:opacity-95 text-white font-medium text-xs transition shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Descargar Calendario (.ics)</span>
          </a>
          <span className="text-[11px] text-[var(--text-muted)]">
            Compatible con aplicaciones estándar de Calendario (.ics).
          </span>
        </div>
      </div>

      {/* 6. Database & Full Backup */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-3">
        <h3 className="font-semibold text-xs text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2.5 flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-indigo-400" />
          <span>Copia de Seguridad & Exportación Total</span>
        </h3>

        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
          Descarga un archivo JSON estructurado con la totalidad de tus materias, clases, resúmenes, flashcards, exámenes, notas y sesiones de estudio para resguardo personal.
        </p>

        <div className="pt-2">
          <a
            href="/api/export"
            download
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-active)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium transition"
          >
            <Download className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span>Descargar Copia de Seguridad JSON</span>
          </a>
        </div>
      </div>
    </div>
  );
}
