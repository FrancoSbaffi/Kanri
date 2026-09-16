import React from "react";
import Link from "next/link";
import prisma from "@/lib/db/prisma";
import {
  Calendar as CalendarIcon,
  Layers,
  Brain,
  Download,
  Check,
  Clock,
  BookOpen,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  BarChart2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { KanriLogo } from "@/components/brand/kanri-logo";

export const revalidate = 0; // Fresh academic data

export default async function HomePage() {
  const now = new Date();

  // Fetch live university data
  const [subjects, upcomingClasses, nextExam, dueFlashcardsCount] = await Promise.all([
    prisma.subject.findMany({
      where: { status: "active" },
      include: {
        classes: { take: 3, orderBy: { date: "asc" } },
        topics: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.classSession.findMany({
      where: { date: { gte: now } },
      include: { subject: true },
      orderBy: { date: "asc" },
      take: 4,
    }),
    prisma.exam.findFirst({
      where: { status: "upcoming", date: { gte: now } },
      include: { subject: true },
      orderBy: { date: "asc" },
    }),
    prisma.flashcard.count({
      where: { nextReviewAt: { lte: now } },
    }),
  ]);

  const daysUntilExam = nextExam
    ? Math.max(0, Math.ceil((new Date(nextExam.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : 20;

  return (
    <div className="relative min-h-screen bg-[#101112] text-white selection:bg-white selection:text-black overflow-x-hidden font-sans">
      {/* Baseframe Tactile Noise Texture Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 baseframe-noise opacity-40 mix-blend-overlay" />

      {/* Baseframe Central Ambient Lighting / Spotlight */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[900px] h-[520px] -z-10"
        style={{
          background:
            "radial-gradient(700px 380px at 50% 18%, rgba(255, 255, 255, 0.055) 0%, rgba(255, 255, 255, 0.015) 50%, transparent 80%)",
        }}
      />

      {/* Top Header Bar — Exact Baseframe Dimensions, Geist Light & Absolute Centering */}
      <header className="sticky top-0 z-50 w-full border-b border-[#26282a] bg-[#101112]/95 backdrop-blur-md px-6 sm:px-12 h-14 relative flex items-center justify-between">
        {/* Left: Minimal Geometric Vector Logo */}
        <div className="flex items-center z-10">
          <Link href="/" className="flex items-center text-white hover:text-white/80 transition" title="Kanri OS">
            <KanriLogo size={26} className="text-white" />
          </Link>
        </div>

        {/* Center: Mathematically Centered in Viewport with Absolute Positioning, Geist Light & Uppercase */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-7 lg:gap-8 pointer-events-auto">
          <Link
            href="/dashboard"
            className="font-sans font-light text-[11px] lg:text-[12px] uppercase tracking-[0.18em] text-[#8E929B] hover:text-white transition"
          >
            DASHBOARD
          </Link>
          <Link
            href="/calendar"
            className="font-sans font-light text-[11px] lg:text-[12px] uppercase tracking-[0.18em] text-[#8E929B] hover:text-white transition"
          >
            CALENDARIO
          </Link>
          <Link
            href="/subjects"
            className="font-sans font-light text-[11px] lg:text-[12px] uppercase tracking-[0.18em] text-[#8E929B] hover:text-white transition"
          >
            MATERIAS
          </Link>
          <Link
            href="/study"
            className="font-sans font-light text-[11px] lg:text-[12px] uppercase tracking-[0.18em] text-[#8E929B] hover:text-white transition"
          >
            ESTUDIO
          </Link>
          <Link
            href="/reviews"
            className="font-sans font-light text-[11px] lg:text-[12px] uppercase tracking-[0.18em] text-[#8E929B] hover:text-white transition"
          >
            REPASOS SM-2
          </Link>
        </nav>

        {/* Right: Dark Button with Hairline Border, Geist Light & Uppercase */}
        <div className="flex items-center z-10">
          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 rounded-[4px] bg-[#1A1B1E] hover:bg-[#24262B] border border-[#2E3035] text-[#D1D5DB] hover:text-white font-sans font-light text-[11px] uppercase tracking-[0.14em] transition shadow-sm"
          >
            INGRESAR AL SISTEMA
          </Link>
        </div>
      </header>

      {/* Main Hero Architectural Column — Exact Baseframe Structure */}
      <section className="relative z-10 max-w-[720px] mx-auto border-l border-r border-[#26282a]">
        {/* Hero Content Area */}
        <div className="pt-14 sm:pt-16 pb-11 px-6 sm:px-10 flex flex-col items-center text-center">
          {/* Status Badge with Square Green Dot (Geist Light & Uppercase) */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] border border-[#26282a] bg-[#151618] font-sans font-light text-[10px] uppercase tracking-[0.16em] text-[#9CA0A8]">
            <span className="w-1.5 h-1.5 bg-[#22C55E] shrink-0" />
            <span>DISPONIBLE · 2° CUATRIMESTRE 2026</span>
          </div>

          {/* Large Bold Hero Headline (Geist Medium 500, exactly 2 balanced lines like Baseframe) */}
          <h1 className="mt-5 text-[30px] sm:text-[38px] md:text-[42px] font-medium tracking-[-0.035em] text-white max-w-[660px] leading-[1.14]">
            Un mejor sistema para estudiar
            <br className="hidden sm:inline" /> y dominar todas tus materias.
          </h1>

          {/* Subtitle (Geist Sans 400, Geist Text Tone) */}
          <p className="mt-4 text-[14px] sm:text-[15px] text-[#8E929B] max-w-[520px] leading-[1.55] font-normal">
            Organización integral de cursada: clases presenciales y virtuales, apuntes de cátedra, entregas de trabajos prácticos y repasos espaciados con algoritmo SM-2 para rendir al máximo en la universidad.
          </p>

          {/* Dual Action Buttons (Geist Light & Uppercase) */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-[4px] bg-white text-[#101112] hover:bg-neutral-200 font-sans font-light text-[12px] uppercase tracking-[0.12em] transition shadow-sm"
            >
              EXPLORAR DASHBOARD
            </Link>
            <Link
              href="/calendar"
              className="px-4 py-2 rounded-[4px] border border-[#2E3035] bg-[#1A1B1E] text-[#D1D5DB] hover:bg-[#24262B] hover:text-white font-sans font-light text-[12px] uppercase tracking-[0.12em] transition"
            >
              VER CALENDARIO
            </Link>
          </div>
        </div>

        {/* Hairline Divider directly before the 6-cell box */}
        <div className="w-full border-t border-[#26282a]" />

        {/* Baseframe Style Modular 6-Cell Grid Box ("TRUSTED BY 40+ STARTUPS") */}
        <div className="w-full bg-[#141517]">
          {/* Header Label inside the Box (Geist Light & Uppercase) */}
          <div className="py-2.5 px-4 text-center border-b border-[#26282a] bg-[#141517] font-sans font-light text-[10px] tracking-[0.18em] uppercase text-[#787D85]">
            ASIGNATURAS Y MÓDULOS DE CURSADA · UCABA 2026
          </div>

          {/* Row 1: 3 Perfectly Centered Startup Logomarks (Geist Light & Uppercase) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#26282a]">
            {/* Cell 1: Negocios Digitales */}
            <Link
              href="/subjects"
              className="h-[88px] flex items-center justify-center gap-2.5 px-4 hover:bg-[#18191C] transition-colors group cursor-pointer"
            >
              <svg className="w-4 h-4 text-neutral-400 group-hover:text-white transition shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              <span className="font-sans font-light text-[13px] uppercase tracking-[0.1em] text-white/90 group-hover:text-white transition">
                NEGOCIOS DIGITALES
              </span>
            </Link>

            {/* Cell 2: Sistemas Digitales */}
            <Link
              href="/subjects"
              className="h-[88px] flex items-center justify-center gap-2.5 px-4 hover:bg-[#18191C] transition-colors group cursor-pointer"
            >
              <svg className="w-4 h-4 text-neutral-400 group-hover:text-white transition shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <rect x="9" y="9" width="6" height="6" />
                <line x1="9" y1="1" x2="9" y2="4" />
                <line x1="15" y1="1" x2="15" y2="4" />
              </svg>
              <span className="font-sans font-light text-[13px] uppercase tracking-[0.1em] text-white/90 group-hover:text-white transition">
                SISTEMAS DIGITALES
              </span>
            </Link>

            {/* Cell 3: Taller de Innovación */}
            <Link
              href="/subjects"
              className="h-[88px] flex items-center justify-center gap-2.5 px-4 hover:bg-[#18191C] transition-colors group cursor-pointer"
            >
              <svg className="w-4 h-4 text-neutral-400 group-hover:text-white transition shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <span className="font-sans font-light text-[13px] uppercase tracking-[0.1em] text-white/90 group-hover:text-white transition">
                TALLER DE INNOVACIÓN
              </span>
            </Link>
          </div>

          {/* Row 2: 3 Perfectly Centered Startup Logomarks (Geist Light & Uppercase) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#26282a] border-t border-[#26282a]">
            {/* Cell 4: Talento Humano */}
            <Link
              href="/subjects"
              className="h-[88px] flex items-center justify-center gap-2.5 px-4 hover:bg-[#18191C] transition-colors group cursor-pointer"
            >
              <svg className="w-4 h-4 text-neutral-400 group-hover:text-white transition shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              </svg>
              <span className="font-sans font-light text-[13px] uppercase tracking-[0.1em] text-white/90 group-hover:text-white transition">
                TALENTO HUMANO
              </span>
            </Link>

            {/* Cell 5: Algoritmo SM-2 */}
            <Link
              href="/reviews"
              className="h-[88px] flex items-center justify-center gap-2.5 px-4 hover:bg-[#18191C] transition-colors group cursor-pointer"
            >
              <svg className="w-4 h-4 text-neutral-400 group-hover:text-white transition shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="font-sans font-light text-[13px] uppercase tracking-[0.1em] text-white/90 group-hover:text-white transition">
                ALGORITMO SM-2
              </span>
            </Link>

            {/* Cell 6: Motor de IA */}
            <Link
              href="/study"
              className="h-[88px] flex items-center justify-center gap-2.5 px-4 hover:bg-[#18191C] transition-colors group cursor-pointer"
            >
              <svg className="w-4 h-4 text-neutral-400 group-hover:text-white transition shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
              </svg>
              <span className="font-sans font-light text-[13px] uppercase tracking-[0.1em] text-white/90 group-hover:text-white transition">
                MOTOR DE IA
              </span>
            </Link>
          </div>
        </div>

        {/* Bottom hairline border of the central column */}
        <div className="w-full border-b border-[#26282a]" />
      </section>

      {/* BASEFRAME SIGNATURE ANIMATION: INFINITE HORIZONTAL MARQUEE OF SOFTWARE WINDOW MOCKUPS */}
      <section className="relative w-full border-t border-b border-[#26282a] bg-[#101112] py-10 sm:py-12 overflow-hidden">
        {/* Marquee Container with edge fading masks */}
        <div className="marquee-mask overflow-hidden py-2">
          <div className="animate-marquee flex gap-8 sm:gap-10">
            {/* DUPLICATE SET 1 */}
            <MockupCards dueFlashcardsCount={dueFlashcardsCount} daysUntilExam={daysUntilExam} />
            {/* DUPLICATE SET 2 for Seamless Continuous Infinite Loop */}
            <MockupCards dueFlashcardsCount={dueFlashcardsCount} daysUntilExam={daysUntilExam} />
          </div>
        </div>
      </section>

      {/* Lower Case Studies / Architectural Deep-Dives Section (Baseframe "Case Studies" equivalent) */}
      <section className="relative z-10 py-16 px-6 sm:px-12 max-w-5xl mx-auto">
        <div className="border-b border-[#26282a] pb-4 mb-8 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#787D85]">
              Módulos del Sistema
            </span>
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-white mt-1">
              Herramientas diseñadas para organizar tu estudio y aprobar cada cursada.
            </h2>
          </div>
          <Link
            href="/dashboard"
            className="font-mono text-xs text-[#8E929B] hover:text-white flex items-center gap-1.5 transition"
          >
            <span>Ver todo el sistema</span>
            <span className="font-mono">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Feature 1: Calendario Bimodal */}
          <div className="border border-[#26282a] bg-[#141517] rounded-[4px] p-5 flex flex-col justify-between hover:border-[#383B40] transition group">
            <div>
              <div className="w-8 h-8 rounded-[4px] bg-[#1A1B1E] border border-[#2E3035] flex items-center justify-center text-white mb-3.5">
                <CalendarIcon className="w-4 h-4 text-neutral-300" />
              </div>
              <h3 className="font-medium text-[14px] text-white">
                Sincronización Bimodal & Exportación Mac
              </h3>
              <p className="text-[13px] text-[#8E929B] mt-2 leading-relaxed">
                Diferenciación estricta entre clases presenciales en Aula Magna 102 y sesiones sincrónicas por campus virtual. Exportación directa a Apple Calendar (.ics) con alertas de traslado.
              </p>
            </div>
            <Link
              href="/calendar"
              className="mt-5 pt-3.5 border-t border-[#26282a] font-mono text-xs text-white group-hover:text-emerald-400 flex items-center justify-between transition"
            >
              <span>Abrir Calendario</span>
              <span>→</span>
            </Link>
          </div>

          {/* Feature 2: Repaso Espaciado SM-2 */}
          <div className="border border-[#26282a] bg-[#141517] rounded-[4px] p-5 flex flex-col justify-between hover:border-[#383B40] transition group">
            <div>
              <div className="w-8 h-8 rounded-[4px] bg-[#1A1B1E] border border-[#2E3035] flex items-center justify-center text-white mb-3.5">
                <Layers className="w-4 h-4 text-neutral-300" />
              </div>
              <h3 className="font-medium text-[14px] text-white">
                Algoritmo SuperMemo-2 (SM-2)
              </h3>
              <p className="text-[13px] text-[#8E929B] mt-2 leading-relaxed">
                Fórmula de retención que calcula factores de facilidad e intervalos óptimos de repaso basados en tu historial. Llega al parcial con el 95% del contenido fijado en memoria a largo plazo.
              </p>
            </div>
            <Link
              href="/reviews"
              className="mt-5 pt-3.5 border-t border-[#26282a] font-mono text-xs text-white group-hover:text-purple-400 flex items-center justify-between transition"
            >
              <span>Iniciar Repasos</span>
              <span>→</span>
            </Link>
          </div>

          {/* Feature 3: Centro de Estudio & IA */}
          <div className="border border-[#26282a] bg-[#141517] rounded-[4px] p-5 flex flex-col justify-between hover:border-[#383B40] transition group">
            <div>
              <div className="w-8 h-8 rounded-[4px] bg-[#1A1B1E] border border-[#2E3035] flex items-center justify-center text-white mb-3.5">
                <Brain className="w-4 h-4 text-neutral-300" />
              </div>
              <h3 className="font-medium text-[14px] text-white">
                Síntesis de Cátedra & Quizzes IA
              </h3>
              <p className="text-[13px] text-[#8E929B] mt-2 leading-relaxed">
                Extracción automática de conceptos clave a partir de diapositivas y textos oficiales de UCABA. Generación instantánea de resúmenes estructurados y cuestionarios de autoevaluación.
              </p>
            </div>
            <Link
              href="/study"
              className="mt-5 pt-3.5 border-t border-[#26282a] font-mono text-xs text-white group-hover:text-blue-400 flex items-center justify-between transition"
            >
              <span>Explorar Estudio</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Minimal Spanish Footer */}
        <footer className="mt-16 pt-7 border-t border-[#26282a] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#717680]">
          <div className="flex items-center gap-2.5">
            <KanriLogo size={16} className="text-white/80" />
            <span>Kanri OS · Universidad de la Ciudad de Buenos Aires (UCABA)</span>
          </div>
          <div>
            Licenciatura en Tecnologías Digitales · 2° Cuatrimestre 2026
          </div>
        </footer>
      </section>
    </div>
  );
}

/**
 * High-Fidelity Software Window Mockup Cards for the Continuous Marquee Animation
 * Styled in studio-grade frames matching Baseframe's high-definition look
 */
function MockupCards({
  dueFlashcardsCount,
  daysUntilExam,
}: {
  dueFlashcardsCount: number;
  daysUntilExam: number;
}) {
  return (
    <>
      {/* FRAME 1: Light Apple/macOS Academic Calendar & Bimodal Timetable */}
      <Link
        href="/calendar"
        className="group/card w-[680px] sm:w-[720px] h-[450px] shrink-0 rounded-[14px] border border-[#26282a] bg-[#121316] p-4 sm:p-5 flex flex-col justify-center relative overflow-hidden shadow-2xl hover:border-[#4B4E56] transition-all duration-300"
      >
        {/* Subtle studio ambient lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.06),_transparent_70%)] pointer-events-none" />

        {/* Floating Pro Light Window */}
        <div className="relative z-10 w-full h-full rounded-[10px] bg-[#FFFFFF] border border-[#D5D8DE] shadow-[0_20px_45px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden text-[#111318]">
          {/* macOS Titlebar */}
          <div className="px-4 py-2.5 border-b border-[#E2E4E8] bg-[#F4F5F8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
              <span className="ml-2 font-mono text-[11px] text-[#4B5563] font-medium">
                kanri / calendario / cursada-bimodal
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex font-mono text-[9px] uppercase px-2 py-0.5 rounded bg-neutral-200 text-neutral-700 font-semibold">
                Semana 4 · Sep 2026
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#18181B] text-white">
                <Download className="w-2.5 h-2.5" />
                <span>Exportar .ics</span>
              </span>
            </div>
          </div>

          {/* Window Body: Sidebar + Weekly Schedule Grid */}
          <div className="flex-1 flex overflow-hidden">
            {/* Mini sidebar */}
            <div className="w-[180px] shrink-0 border-r border-[#E5E7EB] bg-[#F9FAFB] p-3 flex flex-col justify-between text-[11px]">
              <div className="space-y-3">
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-[#6B7280] font-semibold">
                    Cátedras Activas
                  </div>
                  <div className="mt-1.5 space-y-1">
                    <div className="flex items-center gap-1.5 font-medium text-neutral-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="truncate">Taller de Innovación</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-neutral-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="truncate">Sistemas Digitales</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-neutral-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="truncate">Negocios Digitales</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-neutral-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      <span className="truncate">Talento Humano</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E5E7EB]">
                  <div className="font-mono text-[9px] uppercase tracking-wider text-[#6B7280] font-semibold">
                    Modalidad
                  </div>
                  <div className="mt-1 space-y-1 text-[10px] text-neutral-600">
                    <div className="p-1 rounded bg-amber-500/10 text-amber-800 border border-amber-500/20 font-medium">
                      Sede Centro · Aula 102
                    </div>
                    <div className="p-1 rounded bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 font-medium">
                      Campus Virtual UCABA
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E5E7EB] font-mono text-[9px] text-[#6B7280]">
                Alertas de viaje: +45m
              </div>
            </div>

            {/* Main Schedule Canvas */}
            <div className="flex-1 p-3.5 flex flex-col justify-between bg-white">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-[#F0F2F5] pb-2">
                  <span className="font-semibold text-[13px] text-neutral-900">
                    Horario de Clases y Entregas
                  </span>
                  <span className="font-mono text-[10px] text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded font-medium">
                    Hoy: Miércoles 17 Sep
                  </span>
                </div>

                {/* Class Row 1 */}
                <div className="p-2.5 rounded-[6px] bg-amber-50/70 border border-amber-200/80 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-amber-950">
                        Taller: Emprendedurismo en Innovación Digital
                      </span>
                      <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-amber-200/60 text-amber-900 font-bold uppercase">
                        Presencial
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-900/80 mt-0.5">
                      Sede Centro · Aula Magna 102 · Prof. Arispe
                    </div>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-amber-900 bg-white/80 px-2 py-0.5 rounded border border-amber-200">
                    Lun 18:30
                  </span>
                </div>

                {/* Class Row 2 */}
                <div className="p-2.5 rounded-[6px] bg-emerald-50/70 border border-emerald-200/80 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-emerald-950">
                        Sistemas Digitales y Arquitectura
                      </span>
                      <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-emerald-200/60 text-emerald-900 font-bold uppercase">
                        Virtual
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-900/80 mt-0.5">
                      Campus Virtual UCABA · Zoom Cátedra en Vivo
                    </div>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-emerald-900 bg-white/80 px-2 py-0.5 rounded border border-emerald-200">
                    Mié 18:30
                  </span>
                </div>

                {/* Assignment Row 3 */}
                <div className="p-2 rounded-[6px] bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-xs font-medium text-neutral-800">
                      Entrega TP N° 2 · Admin. de Negocios
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-neutral-600 font-semibold">
                    Vence Vie 23:59 hs
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F0F2F5] flex items-center justify-between font-mono text-[10px] text-[#6B7280]">
                <span>● 4 asignaturas sincronizadas con Apple Calendar</span>
                <span className="text-[#18181B] font-semibold">Semana 4 en curso →</span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* FRAME 2: Dark Pro SM-2 Spaced Repetition Algorithmic Engine */}
      <Link
        href="/reviews"
        className="group/card w-[680px] sm:w-[720px] h-[450px] shrink-0 rounded-[14px] border border-[#26282a] bg-[#111215] p-4 sm:p-5 flex flex-col justify-center relative overflow-hidden shadow-2xl hover:border-[#4B4E56] transition-all duration-300"
      >
        {/* Subtle purple algorithmic glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.14),_transparent_65%)] pointer-events-none" />

        {/* Floating Pro Dark Window */}
        <div className="relative z-10 w-full h-full rounded-[10px] bg-[#141518] border border-[#2B2D34] shadow-[0_20px_45px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden text-white">
          {/* Pro Titlebar */}
          <div className="px-4 py-2.5 border-b border-[#26282D] bg-[#18191D] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80" />
              <span className="ml-2 font-mono text-[11px] text-[#9CA3AF]">
                kanri / flashcards / algoritmo-sm2
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold">
                Intervalo: +6 Días
              </span>
              <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded bg-white/[0.05] text-[#9CA3AF]">
                Retención: 94.8%
              </span>
            </div>
          </div>

          {/* Window Body: Flashcard Arena + Algorithmic Telemetry */}
          <div className="flex-1 flex overflow-hidden">
            {/* Flashcard Active Arena */}
            <div className="flex-1 p-4 flex flex-col justify-between bg-[#141518]">
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] text-[#8E929B]">
                  <span>ADMIN. NEGOCIOS DIGITALES · UNIDAD 2</span>
                  <span className="text-purple-400">TARJETA 14 DE 38</span>
                </div>

                <h4 className="text-sm font-medium text-white mt-1.5 leading-snug">
                  ¿Cómo se define y calcula el Punto de Equilibrio Operativo (Break-Even Point)?
                </h4>

                {/* Formula Syntax Box */}
                <div className="mt-2.5 p-2.5 rounded-[5px] bg-[#1A1C20] border border-[#2D3038] font-mono text-[11px] text-neutral-300 leading-relaxed">
                  <div className="text-neutral-500 text-[9px] uppercase tracking-wider mb-1">
                    // Fórmula Cátedra UCABA
                  </div>
                  <div>PE = Costos Fijos Totales / (Precio Venta - Costo Variable Unitario)</div>
                  <div className="text-emerald-400/90 mt-0.5">Margen Seguridad = (Ventas Proy. - Ventas PE) / Ventas Proy.</div>
                </div>

                {/* Concept Drawer */}
                <div className="mt-2 p-2 rounded-[5px] bg-purple-500/[0.06] border border-purple-500/20 text-[11px] text-purple-200">
                  <span className="font-semibold text-white">Criterio Examen:</span> Nivel exacto donde EBIT = 0. Cubre todos los costos fijos sin generar pérdida.
                </div>
              </div>

              {/* SM-2 Grading Buttons */}
              <div className="pt-2.5 border-t border-[#26282D]">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex-1 text-center py-1.5 rounded-[4px] bg-rose-500/10 text-rose-300 text-[10px] font-mono border border-rose-500/25 font-medium">
                    1 Otra vez (&lt;10m)
                  </span>
                  <span className="flex-1 text-center py-1.5 rounded-[4px] bg-amber-500/10 text-amber-300 text-[10px] font-mono border border-amber-500/25 font-medium">
                    2 Difícil (12h)
                  </span>
                  <span className="flex-1 text-center py-1.5 rounded-[4px] bg-blue-500/10 text-blue-300 text-[10px] font-mono border border-blue-500/25 font-medium">
                    3 Bueno (+3d)
                  </span>
                  <span className="flex-1 text-center py-1.5 rounded-[4px] bg-emerald-500/15 text-emerald-300 text-[10px] font-mono border border-emerald-500/30 font-semibold shadow-sm">
                    4 Fácil (+6d)
                  </span>
                </div>
              </div>
            </div>

            {/* Right Telemetry Column */}
            <div className="w-[170px] shrink-0 border-l border-[#26282D] bg-[#101114] p-3 flex flex-col justify-between text-[11px]">
              <div className="space-y-2.5">
                <div className="font-mono text-[9px] uppercase tracking-wider text-[#787D85]">
                  Algoritmo SM-2
                </div>

                <div className="p-2 rounded bg-[#17181C] border border-[#26282D]">
                  <div className="font-mono text-[9px] text-[#8E929B]">Factor EF</div>
                  <div className="font-mono text-sm font-bold text-white mt-0.5">2.50 <span className="text-emerald-400 text-[10px] font-normal">+0.1</span></div>
                </div>

                <div className="p-2 rounded bg-[#17181C] border border-[#26282D]">
                  <div className="font-mono text-[9px] text-[#8E929B]">Repeticiones</div>
                  <div className="font-mono text-sm font-bold text-purple-400 mt-0.5">#4 consecutivas</div>
                </div>

                <div className="p-2 rounded bg-[#17181C] border border-[#26282D]">
                  <div className="font-mono text-[9px] text-[#8E929B]">Próximo Repaso</div>
                  <div className="font-mono text-xs font-semibold text-white mt-0.5">21 Sep 2026</div>
                </div>
              </div>

              <div className="font-mono text-[9px] text-[#6B7280]">
                Optimizador de memoria a largo plazo
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* FRAME 3: Dark Pro AI Study Engine & Interactive Class Quiz */}
      <Link
        href="/study"
        className="group/card w-[680px] sm:w-[720px] h-[450px] shrink-0 rounded-[14px] border border-[#26282a] bg-[#101214] p-4 sm:p-5 flex flex-col justify-center relative overflow-hidden shadow-2xl hover:border-[#4B4E56] transition-all duration-300"
      >
        {/* Subtle emerald AI glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.13),_transparent_65%)] pointer-events-none" />

        {/* Floating Pro Dark Window */}
        <div className="relative z-10 w-full h-full rounded-[10px] bg-[#131518] border border-[#26282E] shadow-[0_20px_45px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden text-white">
          {/* Pro Titlebar */}
          <div className="px-4 py-2.5 border-b border-[#26282D] bg-[#17191D] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80" />
              <span className="ml-2 font-mono text-[11px] text-[#9CA3AF]">
                kanri / estudio / sintesis-ia-documentos
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
                Quiz: 85% Precisión
              </span>
            </div>
          </div>

          {/* Window Body: Class Summary Extraction + Interactive Quiz */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left: Notes Synthesis */}
            <div className="w-[280px] shrink-0 border-r border-[#26282D] bg-[#111215] p-3.5 flex flex-col justify-between text-xs">
              <div className="space-y-2">
                <div className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>Síntesis de Cátedra UCABA</span>
                </div>
                <div className="text-xs font-semibold text-white">
                  Sistemas Digitales · Clase 04
                </div>
                <div className="text-[11px] text-[#8E929B] leading-relaxed space-y-1.5 pt-1">
                  <p>
                    <strong className="text-neutral-200">1. De Morgan:</strong> Simplificación para compuertas universales NAND / NOR.
                  </p>
                  <p>
                    <strong className="text-neutral-200">2. Mapas K:</strong> Agrupamiento adyacente en potencias de dos (1, 2, 4, 8).
                  </p>
                  <p>
                    <strong className="text-neutral-200">3. Examen:</strong> Expresar en forma canónica SOP antes de simplificar.
                  </p>
                </div>
              </div>

              <div className="p-2 rounded bg-white/[0.03] border border-white/[0.06] font-mono text-[10px] text-neutral-400">
                Fuente: Diapositivas Cátedra (48 págs)
              </div>
            </div>

            {/* Right: Quiz Engine */}
            <div className="flex-1 p-4 flex flex-col justify-between bg-[#141518]">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#8E929B]">
                  <span>PREGUNTA 3 DE 5</span>
                  <span className="text-white font-medium">Autoevaluación Parcial</span>
                </div>

                <div className="text-xs font-medium text-white leading-relaxed">
                  ¿Cuál es el complemento de la función F = (A + B) · C según el Teorema de De Morgan?
                </div>

                {/* Interactive Options */}
                <div className="space-y-1.5 pt-1">
                  <div className="p-2 rounded-[5px] bg-emerald-500/10 border border-emerald-500/35 text-xs text-emerald-300 flex items-center justify-between font-mono">
                    <span>A) F&apos; = (A&apos; · B&apos;) + C&apos;</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>
                  <div className="p-2 rounded-[5px] bg-[#1A1C20] border border-[#27292F] text-xs text-neutral-400 font-mono">
                    <span>B) F&apos; = (A&apos; + B&apos;) · C&apos;</span>
                  </div>
                  <div className="p-2 rounded-[5px] bg-[#1A1C20] border border-[#27292F] text-xs text-neutral-400 font-mono">
                    <span>C) F&apos; = A · B + C</span>
                  </div>
                </div>

                <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/20 text-[10px] text-emerald-300/90 leading-relaxed">
                  ✓ <strong className="text-emerald-200">Verificado:</strong> Al complementar un producto de sumas, las operaciones se invierten a suma de productos negados.
                </div>
              </div>

              <div className="pt-2 border-t border-[#26282D] flex items-center justify-between font-mono text-[10px] text-[#8E929B]">
                <span>Puntaje proyectado: 10/10</span>
                <span className="text-white">Siguiente pregunta →</span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* FRAME 4: Dark Pro Student Cockpit & Dashboard */}
      <Link
        href="/dashboard"
        className="group/card w-[680px] sm:w-[720px] h-[450px] shrink-0 rounded-[14px] border border-[#26282a] bg-[#121315] p-4 sm:p-5 flex flex-col justify-center relative overflow-hidden shadow-2xl hover:border-[#4B4E56] transition-all duration-300"
      >
        {/* Subtle warm amber cockpit glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.1),_transparent_65%)] pointer-events-none" />

        {/* Floating Pro Dark Window */}
        <div className="relative z-10 w-full h-full rounded-[10px] bg-[#141619] border border-[#27292F] shadow-[0_20px_45px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden text-white">
          {/* Pro Titlebar */}
          <div className="px-4 py-2.5 border-b border-[#26282D] bg-[#181A1E] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80" />
              <span className="ml-2 font-mono text-[11px] text-[#9CA3AF]">
                kanri / dashboard / cockpit-estudiante
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
                Sede Centro · 18:30 hs
              </span>
            </div>
          </div>

          {/* Window Body: High Density Cockpit */}
          <div className="flex-1 p-4 flex flex-col justify-between bg-[#141619] space-y-2.5">
            {/* KPI Grid */}
            <div className="grid grid-cols-4 gap-2">
              <div className="p-2.5 rounded-[5px] bg-[#181A1F] border border-[#2A2C34]">
                <div className="text-[9px] font-mono text-[#8E929B] uppercase">Cursadas</div>
                <div className="text-sm font-bold font-mono text-white mt-0.5">4 Activas</div>
              </div>
              <div className="p-2.5 rounded-[5px] bg-[#181A1F] border border-[#2A2C34]">
                <div className="text-[9px] font-mono text-[#8E929B] uppercase">Repasos SM-2</div>
                <div className="text-sm font-bold font-mono text-purple-400 mt-0.5">{dueFlashcardsCount} hoy</div>
              </div>
              <div className="p-2.5 rounded-[5px] bg-[#181A1F] border border-[#2A2C34]">
                <div className="text-[9px] font-mono text-[#8E929B] uppercase">Próximo Parcial</div>
                <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">{daysUntilExam} días</div>
              </div>
              <div className="p-2.5 rounded-[5px] bg-[#181A1F] border border-[#2A2C34]">
                <div className="text-[9px] font-mono text-[#8E929B] uppercase">Promedio</div>
                <div className="text-sm font-bold font-mono text-amber-300 mt-0.5">8.75 / 10</div>
              </div>
            </div>

            {/* Live Class Alert Box */}
            <div className="p-3 rounded-[6px] bg-amber-500/[0.08] border border-amber-500/30 flex items-start justify-between">
              <div>
                <div className="font-mono text-[9px] uppercase text-amber-400 font-bold flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  <span>[Alerta Presencial Hoy] Aula Magna 102 · Sede Centro</span>
                </div>
                <div className="text-xs font-semibold text-white mt-1">
                  Taller: Emprendedurismo en Innovación Digital
                </div>
                <div className="text-[11px] text-neutral-300 mt-0.5">
                  Prof. Arispe · Lectura obligatoria Clase 4 disponible en biblioteca.
                </div>
              </div>
              <span className="font-mono text-[10px] text-amber-300 px-2 py-1 rounded bg-amber-500/20 font-bold shrink-0">
                18:30 hs
              </span>
            </div>

            {/* Task Tracking Checklist */}
            <div className="space-y-1.5">
              <div className="font-mono text-[9px] uppercase text-[#787D85] tracking-wider">
                Entregas y Tareas en Cola
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-[#181A1F] border border-[#26282E] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span className="text-neutral-200 truncate">TP 2 Sistemas</span>
                  </div>
                  <span className="font-mono text-[10px] text-amber-400">Vence en 3d</span>
                </div>
                <div className="p-2 rounded bg-[#181A1F] border border-[#26282E] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span className="text-neutral-200 truncate">Repaso SM-2</span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-400">Completar hoy</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-[#26282D] flex items-center justify-between font-mono text-[10px] text-[#8E929B]">
              <span>Sistema Operativo Académico · UCABA</span>
              <span className="text-white">Abrir Terminal →</span>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
