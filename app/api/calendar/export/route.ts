import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { generateICalendar, ICalEventInput } from "@/lib/utils/ical";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "all";
    const subjectId = searchParams.get("subjectId");
    const classId = searchParams.get("classId");
    const examId = searchParams.get("examId");

    const whereClass: any = {};
    const whereExam: any = {};
    const whereAssignment: any = {};

    if (classId) {
      whereClass.id = classId;
      whereExam.id = "none";
      whereAssignment.id = "none";
    } else if (examId) {
      whereExam.id = examId;
      whereClass.id = "none";
      whereAssignment.id = "none";
    } else {
      if (subjectId && subjectId !== "all") {
        whereClass.subjectId = subjectId;
        whereExam.subjectId = subjectId;
        whereAssignment.subjectId = subjectId;
      }

      if (type === "presencial") {
        whereClass.modality = "presencial";
        whereExam.id = "none";
        whereAssignment.id = "none";
      } else if (type === "virtual") {
        whereClass.modality = { in: ["virtual", "hybrid"] };
        whereExam.id = "none";
        whereAssignment.id = "none";
      } else if (type === "exam") {
        whereClass.id = "none";
        whereAssignment.id = "none";
      } else if (type === "assignment") {
        whereClass.id = "none";
        whereExam.id = "none";
      }
    }

    const [classes, exams, assignments] = await Promise.all([
      whereClass.id === "none"
        ? []
        : prisma.classSession.findMany({
            where: whereClass,
            include: { subject: true },
            orderBy: { date: "asc" },
          }),
      whereExam.id === "none"
        ? []
        : prisma.exam.findMany({
            where: whereExam,
            include: { subject: true },
            orderBy: { date: "asc" },
          }),
      whereAssignment.id === "none"
        ? []
        : prisma.assignment.findMany({
            where: whereAssignment,
            include: { subject: true },
            orderBy: { dueDate: "asc" },
          }),
    ]);

    const events: ICalEventInput[] = [];

    // Map Classes
    for (const c of classes) {
      const isPresencial = c.modality === "presencial";
      const isHybrid = c.modality === "hybrid";
      const tag = isPresencial ? "🏫 PRESENCIAL" : isHybrid ? "🔄 HÍBRIDA" : "💻 VIRTUAL";

      // Parse start and end times
      const [startHour, startMin] = (c.startTime || "18:30").split(":").map(Number);
      const [endHour, endMin] = (c.endTime || "21:30").split(":").map(Number);

      const startDate = new Date(c.date);
      startDate.setHours(startHour, startMin, 0, 0);

      const endDate = new Date(c.date);
      endDate.setHours(endHour, endMin, 0, 0);

      const locationStr = isPresencial
        ? `${c.room || "Aula Magna 102"} - ${c.location || "Sede UCABA Centro"}`
        : "Campus Virtual UCABA · Zoom / Meet (Sincrónica)";

      const description = [
        `MODALIDAD: ${isPresencial ? "PRESENCIAL (En Sede)" : "VIRTUAL (Campus en línea)"}`,
        `MATERIA: ${c.subject.name} (${c.subject.code || "UCABA"})`,
        c.subject.professor ? `DOCENTES: ${c.subject.professor}` : null,
        `HORARIO: ${c.startTime || "18:30"} a ${c.endTime || "21:30"} hs`,
        isPresencial ? `AULA: ${c.room || "Aula asignada"}` : "PLATAFORMA: Zoom / Campus Virtual",
        c.notes ? `NOTAS CÁTEDRA: ${c.notes}` : null,
        "Sincronizado automáticamente desde Kanri (University OS)",
      ]
        .filter(Boolean)
        .join("\n");

      events.push({
        uid: `class-${c.id}`,
        title: `[${tag}] ${c.subject.name} - Clase ${c.classNumber.toString().padStart(2, "0")}`,
        description,
        location: locationStr,
        startDate,
        endDate,
        modality: isPresencial ? "presencial" : isHybrid ? "hybrid" : "virtual",
        subjectName: c.subject.name,
        url: `https://kanri.ucaba.edu.ar/classes/${c.id}`,
      });
    }

    // Map Exams
    for (const e of exams) {
      const [startHour, startMin] = (e.startTime || "18:30").split(":").map(Number);
      const startDate = new Date(e.date);
      startDate.setHours(startHour, startMin, 0, 0);

      const endDate = new Date(e.date);
      endDate.setHours(startHour + 2, startMin, 0, 0);

      const locationStr = `${e.room || "Aula Magna 102"} - ${e.location || "Sede UCABA Centro"}`;
      const description = [
        "MODALIDAD: EVALUACIÓN PRESENCIAL OBLIGATORIA",
        `MATERIA: ${e.subject.name}`,
        `EXAMEN: ${e.title}`,
        `HORARIO: ${e.startTime || "18:30"} hs`,
        `AULA: ${e.room || "Aula Magna"}`,
        e.notes ? `PAUTAS DE EVALUACIÓN: ${e.notes}` : null,
        "Sincronizado desde Kanri (University OS)",
      ]
        .filter(Boolean)
        .join("\n");

      events.push({
        uid: `exam-${e.id}`,
        title: `[📝 PARCIAL] ${e.subject.name} - ${e.title}`,
        description,
        location: locationStr,
        startDate,
        endDate,
        modality: "exam",
        subjectName: e.subject.name,
        url: `https://kanri.ucaba.edu.ar/exams/${e.id}`,
      });
    }

    // Map Assignments (Entregas de Trabajos Prácticos)
    for (const a of assignments) {
      const dueDate = new Date(a.dueDate);
      const startDate = new Date(dueDate);
      startDate.setHours(23, 0, 0, 0);
      const endDate = new Date(dueDate);
      endDate.setHours(23, 59, 0, 0);

      const description = [
        "MODALIDAD: ENTREGA DE TRABAJO PRÁCTICO",
        `MATERIA: ${a.subject.name}`,
        `ENTREGA: ${a.title}`,
        `FECHA LÍMITE: 23:59 hs`,
        a.description ? `CONSIGNA: ${a.description}` : null,
        "Sincronizado desde Kanri (University OS)",
      ]
        .filter(Boolean)
        .join("\n");

      events.push({
        uid: `assignment-${a.id}`,
        title: `[📋 ENTREGA TP] ${a.subject.name} - ${a.title}`,
        description,
        location: "Campus Virtual UCABA",
        startDate,
        endDate,
        modality: "assignment",
        subjectName: a.subject.name,
        url: `https://kanri.ucaba.edu.ar/tasks`,
      });
    }

    let filename = "kanri_calendario_ucaba.ics";
    if (classId && classes.length > 0) {
      filename = `clase_${classes[0].classNumber}_${(classes[0].subject.code || "ucaba").toLowerCase()}.ics`;
    } else if (examId && exams.length > 0) {
      filename = `examen_${exams[0].title.toLowerCase().replace(/[^a-z0-9]/gi, "_")}.ics`;
    } else if (type === "presencial") {
      filename = "kanri_clases_presenciales.ics";
    } else if (type === "virtual") {
      filename = "kanri_clases_virtuales.ics";
    } else if (type === "exam") {
      filename = "kanri_parciales_examenes.ics";
    } else if (type === "assignment") {
      filename = "kanri_entregas_tps.ics";
    }

    const icsContent = generateICalendar(events);

    return new NextResponse(icsContent, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8; method=PUBLISH",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("Error generating iCalendar feed:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
