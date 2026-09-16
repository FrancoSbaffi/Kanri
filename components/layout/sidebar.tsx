"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  GraduationCap,
  Clock,
  Layers,
  Sparkles,
  CheckSquare,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { KanriLogo } from "@/components/brand/kanri-logo";

interface SubjectNav {
  id: string;
  name: string;
  color: string;
  code?: string | null;
}

export function Sidebar({
  subjects = [],
  reviewsDueCount = 0,
  upcomingExamsCount = 0,
}: {
  subjects?: SubjectNav[];
  reviewsDueCount?: number;
  upcomingExamsCount?: number;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const mainNav = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard, shortcut: "G D" },
    { name: "Calendario", href: "/calendar", icon: Calendar, shortcut: "G C" },
    { name: "Materias", href: "/subjects", icon: BookOpen, shortcut: "G S" },
    { name: "Clases", href: "/classes", icon: GraduationCap, shortcut: "G K" },
    { name: "Centro de Estudio", href: "/study", icon: Clock, shortcut: "G P" },
    {
      name: "Repasos SM-2",
      href: "/reviews",
      icon: Layers,
      shortcut: "G R",
      badge: reviewsDueCount > 0 ? `${reviewsDueCount}` : undefined,
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    {
      name: "Exámenes",
      href: "/exams",
      icon: Sparkles,
      shortcut: "G E",
      badge: upcomingExamsCount > 0 ? `${upcomingExamsCount}` : undefined,
      badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    },
    { name: "Trabajos Prácticos", href: "/tasks", icon: CheckSquare, shortcut: "G T" },
    { name: "Biblioteca PDFs", href: "/library", icon: FileText, shortcut: "G L" },
    { name: "Progreso", href: "/analytics", icon: BarChart3, shortcut: "G A" },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-[var(--border-subtle)] bg-[var(--sidebar-bg)] backdrop-blur-2xl transition-all duration-200 select-none z-20 ${
        collapsed ? "w-14" : "w-60"
      }`}
    >
      {/* Baseframe Minimal Monospace Brand Mark */}
      <div className="h-12 border-b border-[var(--border-subtle)] px-4 flex items-center justify-between">
        {!collapsed ? (
          <Link href="/" className="flex items-center gap-2 group text-[var(--text-primary)]" title="Ir al Home">
            <KanriLogo size={20} showText={true} />
          </Link>
        ) : (
          <Link href="/" className="mx-auto text-[var(--text-primary)]" title="Ir al Home">
            <KanriLogo size={20} showText={false} />
          </Link>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition hidden md:block"
          title={collapsed ? "Expandir barra lateral" : "Colapsar"}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Cuatrimestre Status Pill - Baseframe Monospace */}
      {!collapsed && (
        <div className="px-3 pt-3 pb-1">
          <div className="px-2.5 py-1.5 rounded-md bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)] flex items-center justify-between font-mono">
            <span className="text-[10px] tracking-wider uppercase truncate">2° Cuatrimestre 2026</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          </div>
        </div>
      )}

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition ${
                isActive
                  ? "bg-black/[0.06] dark:bg-white/[0.08] text-[var(--text-primary)] border border-black/[0.08] dark:border-white/[0.08] font-medium"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.03] dark:hover:bg-white/[0.04] border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 transition ${
                    isActive ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                  }`}
                />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </div>

              {!collapsed && (
                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded border border-black/[0.08] dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.04] text-[var(--text-secondary)] font-medium">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}

        {/* Subjects list */}
        {!collapsed && subjects.length > 0 && (
          <div className="pt-4 pb-1">
            <div className="px-2.5 flex items-center justify-between text-[10px] font-mono font-semibold text-[var(--text-muted)] uppercase tracking-[0.16em]">
              <span>Materias</span>
              <Link href="/subjects" className="hover:text-[var(--text-primary)] transition">
                <Plus className="w-3 h-3" />
              </Link>
            </div>
            <div className="mt-1.5 space-y-0.5">
              {subjects.map((subj) => {
                const isSubjActive = pathname === `/subjects/${subj.id}`;
                return (
                  <Link
                    key={subj.id}
                    href={`/subjects/${subj.id}`}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition ${
                      isSubjActive
                        ? "bg-black/[0.06] dark:bg-white/[0.08] text-[var(--text-primary)] border border-black/[0.08] dark:border-white/[0.08] font-medium"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.03] dark:hover:bg-white/[0.04] border border-transparent"
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: subj.color || "#090a0f" }}
                    />
                    <span className="truncate">{subj.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom settings */}
      <div className="p-2 border-t border-[var(--border-subtle)]">
        <Link
          href="/settings"
          title={collapsed ? "Configuración" : undefined}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition ${
            pathname === "/settings"
              ? "bg-black/[0.06] dark:bg-white/[0.08] text-[var(--text-primary)] border border-black/[0.08] dark:border-white/[0.08] font-medium"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
          }`}
        >
          <Settings className={`w-3.5 h-3.5 shrink-0 ${pathname === "/settings" ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"}`} />
          {!collapsed && <span>Configuración</span>}
        </Link>
      </div>
    </aside>
  );
}
