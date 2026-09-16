import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET() {
  try {
    const [
      users,
      academicYears,
      semesters,
      subjects,
      classes,
      materials,
      summaries,
      topics,
      questions,
      flashcards,
      exams,
      assignments,
      studySessions,
      reviewSessions,
    ] = await Promise.all([
      prisma.user.findMany(),
      prisma.academicYear.findMany(),
      prisma.semester.findMany(),
      prisma.subject.findMany(),
      prisma.classSession.findMany(),
      prisma.material.findMany({ select: { id: true, fileName: true, fileType: true, fileSize: true, processingStatus: true, uploadedAt: true } }),
      prisma.summary.findMany(),
      prisma.topic.findMany(),
      prisma.question.findMany(),
      prisma.flashcard.findMany(),
      prisma.exam.findMany({ include: { planItems: true } }),
      prisma.assignment.findMany(),
      prisma.studySession.findMany(),
      prisma.reviewSession.findMany(),
    ]);

    const backup = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      platform: "Kanri (University OS)",
      data: {
        users,
        academicYears,
        semesters,
        subjects,
        classes,
        materials,
        summaries,
        topics,
        questions,
        flashcards,
        exams,
        assignments,
        studySessions,
        reviewSessions,
      },
    };

    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="kanri_backup_${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
