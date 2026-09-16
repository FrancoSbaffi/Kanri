import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      subjectId,
      dayOfWeek, // 0 = Sunday, 1 = Monday, 2 = Tuesday, ...
      startTime,
      endTime,
      startDate,
      endDate,
      modality,
      room,
      location,
      titlePrefix,
    } = body;

    if (!subjectId || dayOfWeek === undefined || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Faltan parámetros obligatorios (subjectId, dayOfWeek, startDate, endDate)" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const createdClasses = [];

    let current = new Date(start);
    let classNum = 1;

    // Advance to first occurrence of the day of week
    while (current.getDay() !== parseInt(dayOfWeek)) {
      current.setDate(current.getDate() + 1);
    }

    while (current <= end) {
      const sessionDate = new Date(current);
      sessionDate.setHours(
        parseInt((startTime || "18:00").split(":")[0]),
        parseInt((startTime || "18:00").split(":")[1]),
        0,
        0
      );

      const newClass = await prisma.classSession.create({
        data: {
          subjectId,
          title: `${titlePrefix || "Clase"} ${classNum.toString().padStart(2, "0")}`,
          classNumber: classNum,
          date: sessionDate,
          startTime: startTime || "18:00",
          endTime: endTime || "20:00",
          modality: modality || "presencial",
          room: room || "Aula 304",
          location: location || "Campus Central",
          attendanceStatus: "pending",
        },
      });

      createdClasses.push(newClass);
      classNum++;

      // Next week
      current.setDate(current.getDate() + 7);
    }

    return NextResponse.json({
      success: true,
      count: createdClasses.length,
      classes: createdClasses,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
