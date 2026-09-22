"use server";

import prisma from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function createSubject(data: {
  name: string;
  code?: string;
  professor?: string;
  commission?: string;
  color?: string;
  credits?: number;
  description?: string;
}) {
  try {
    const semester = await prisma.semester.findFirst({ where: { status: "active" } });
    if (!semester) throw new Error("No hay un cuatrimestre activo");

    const subject = await prisma.subject.create({
      data: {
        semesterId: semester.id,
        name: data.name,
        code: data.code,
        professor: data.professor,
        commission: data.commission,
        color: data.color || "#6366f1",
        credits: data.credits || 4,
        description: data.description,
        status: "active",
      },
    });

    revalidatePath("/subjects");
    revalidatePath("/dashboard");
    return { success: true, subject };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function createClassSession(data: {
  subjectId: string;
  title: string;
  classNumber: number;
  date: string;
  startTime: string;
  endTime: string;
  modality: "presencial" | "virtual" | "hybrid";
  room?: string;
  notes?: string;
}) {
  try {
    const session = await prisma.classSession.create({
      data: {
        subjectId: data.subjectId,
        title: data.title,
        classNumber: data.classNumber,
        date: new Date(data.date),
        startTime: data.startTime,
        endTime: data.endTime,
        modality: data.modality,
        room: data.room || "Aula 304",
        notes: data.notes,
        attendanceStatus: "pending",
      },
    });

    revalidatePath("/classes");
    revalidatePath(`/subjects/${data.subjectId}`);
    revalidatePath("/calendar");
    revalidatePath("/dashboard");
    return { success: true, session };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function updateClassAttendance(
  classId: string,
  status: "attended" | "missed" | "cancelled" | "pending"
) {
  try {
    const session = await prisma.classSession.update({
      where: { id: classId },
      data: { attendanceStatus: status },
    });

    revalidatePath("/classes");
    revalidatePath(`/classes/${classId}`);
    revalidatePath("/dashboard");
    return { success: true, session };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function updateClassNotes(classId: string, notes: string) {
  try {
    const session = await prisma.classSession.update({
      where: { id: classId },
      data: { notes },
    });

    revalidatePath("/classes");
    revalidatePath(`/classes/${classId}`);
    return { success: true, session };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

