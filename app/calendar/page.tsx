import React from "react";
import prisma from "@/lib/db/prisma";
import { AcademicCalendar, CalendarEvent } from "@/components/calendar/academic-calendar";

export const revalidate = 0;

export default async function CalendarPage() {
  const [classes, exams, assignments, subjects] = await Promise.all([
    prisma.classSession.findMany({
      include: { subject: true },
      orderBy: { date: "asc" },
    }),
    prisma.exam.findMany({
      include: { subject: true },
      orderBy: { date: "asc" },
    }),
    prisma.assignment.findMany({
      include: { subject: true },
      orderBy: { dueDate: "asc" },
    }),
    prisma.subject.findMany({
      where: { status: "active" },
      select: { id: true, name: true, color: true },
    }),
  ]);

  const calendarEvents: CalendarEvent[] = [];

  for (const c of classes) {
    calendarEvents.push({
      id: `class-${c.id}`,
      rawId: c.id,
      type: c.modality === "presencial" ? "presencial" : "virtual",
      title: c.title,
      date: c.date,
      startTime: c.startTime,
      endTime: c.endTime,
      room: c.room || undefined,
      location: c.location || undefined,
      subjectName: c.subject.name,
      subjectColor: c.subject.color,
      url: `/classes/${c.id}`,
    });
  }

  for (const e of exams) {
    calendarEvents.push({
      id: `exam-${e.id}`,
      rawId: e.id,
      type: "exam",
      title: e.title,
      date: e.date,
      startTime: e.startTime || "18:00",
      room: e.room || undefined,
      location: e.location || undefined,
      subjectName: e.subject.name,
      subjectColor: e.subject.color,
      url: `/exams/${e.id}`,
    });
  }

  for (const a of assignments) {
    calendarEvents.push({
      id: `task-${a.id}`,
      type: "assignment",
      title: a.title,
      date: a.dueDate,
      startTime: "23:59",
      subjectName: a.subject.name,
      subjectColor: a.subject.color,
      url: "/tasks",
    });
  }

  calendarEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Calendario Académico Global
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Clases presenciales y virtuales, parciales, finales y entregas de trabajos
        </p>
      </div>

      <AcademicCalendar initialEvents={calendarEvents} subjects={subjects} />
    </div>
  );
}
