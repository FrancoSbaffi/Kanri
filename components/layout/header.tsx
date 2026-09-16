"use client";

import React, { useState } from "react";
import {
  Search,
  Bell,
  Sparkles,
  Sun,
  Moon,
  Command,
  Check,
  Calendar,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { AIAssistantModal } from "./ai-assistant-modal";
import Link from "next/link";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  actionUrl?: string | null;
  readAt?: Date | null;
}

export function Header({
  notifications = [],
}: {
  notifications?: NotificationItem[];
}) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [notifList, setNotifList] = useState(notifications);

  const unreadCount = notifList.filter((n) => !n.readAt).length;

  const markAllRead = () => {
    setNotifList((prev) =>
      prev.map((n) => ({ ...n, readAt: new Date() }))
    );
  };

  return (
    <>
      <header className="h-12 border-b border-[var(--border-subtle)] bg-[var(--header-bg)] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        {/* Left: Baseframe minimal search field */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true })
              );
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] hover:bg-black/[0.05] dark:hover:bg-white/[0.06] text-xs text-[var(--text-secondary)] transition group"
          >
            <Search className="w-3.5 h-3.5 group-hover:text-[var(--text-primary)] transition" />
            <span className="hidden sm:inline">Buscar materias, clases, resúmenes...</span>
            <span className="sm:hidden">Buscar...</span>
            <kbd className="hidden sm:inline-flex ml-2 font-mono text-[10px] text-[var(--text-muted)] border border-black/[0.08] dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.04] px-1.5 py-0.5 rounded">⌘K</kbd>
          </button>
        </div>

        {/* Center: Operational status badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--text-secondary)]">
            UCABA · 2° Cuatrimestre 2026
          </span>
        </div>

        {/* Right tools */}
        <div className="flex items-center gap-2.5">
          {/* Ask AI Trigger - Baseframe High Contrast CTA */}
          <button
            onClick={() => setShowAIAssistant(true)}
            className="baseframe-btn-primary"
            title="Asistente Académico IA"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consultar Apuntes</span>
          </button>

          {/* Notifications Drawer Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition"
              title="Notificaciones"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[var(--bg-surface)]" />
              )}
            </button>

            {/* Notification popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      Notificaciones Académicas
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-500">
                        {unreadCount} nuevas
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition"
                    >
                      Marcar leídas
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[var(--border-subtle)]">
                  {notifList.length === 0 ? (
                    <div className="py-6 text-center text-xs text-[var(--text-muted)]">
                      No hay notificaciones pendientes.
                    </div>
                  ) : (
                    notifList.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 text-xs transition ${
                          !item.readAt
                            ? "bg-[var(--bg-surface-elevated)]/60"
                            : "hover:bg-[var(--bg-surface-elevated)]"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 text-[var(--accent)]">
                            {item.type === "presencial_warning" ? (
                              <Calendar className="w-4 h-4 text-emerald-400" />
                            ) : item.type === "exam_countdown" ? (
                              <AlertCircle className="w-4 h-4 text-amber-400" />
                            ) : (
                              <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-[var(--text-primary)]">
                              {item.title}
                            </h4>
                            <p className="mt-0.5 text-[11px] text-[var(--text-secondary)] leading-normal">
                              {item.message}
                            </p>
                            {item.actionUrl && (
                              <Link
                                href={item.actionUrl}
                                onClick={() => setShowNotifications(false)}
                                className="inline-flex items-center gap-1 mt-1.5 text-[11px] text-[var(--accent)] hover:underline"
                              >
                                Ver detalle
                                <ExternalLink className="w-2.5 h-2.5" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition"
            title={`Cambiar a modo ${resolvedTheme === "dark" ? "claro" : "oscuro"}`}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--text-muted)]" />
            )}
          </button>

          {/* User Profile Mini */}
          <div className="h-4 w-[1px] bg-black/[0.08] dark:bg-white/[0.08] mx-1" />
          <Link href="/settings" className="flex items-center gap-2 pl-1 group">
            <div className="w-6 h-6 rounded-md border border-black/10 dark:border-white/15 bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center font-mono text-[10px] font-semibold text-[var(--text-primary)]">
              FS
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-medium text-[var(--text-primary)] leading-none group-hover:text-[var(--accent)] transition">
                Franco Sbaffi
              </p>
              <p className="text-[10px] font-mono text-[var(--text-muted)] leading-none mt-0.5">
                UCABA · LTD
              </p>
            </div>
          </Link>
        </div>
      </header>

      {/* Global AI Assistant Modal */}
      <AIAssistantModal
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
      />
    </>
  );
}
