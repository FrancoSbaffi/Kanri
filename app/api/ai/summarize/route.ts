import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { processAcademicMaterial } from "@/lib/ai/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { materialId, classId, customPrompt } = body;

    if (!materialId && !classId) {
      return NextResponse.json(
        { error: "Se requiere materialId o classId" },
        { status: 400 }
      );
    }

    let textToProcess = "";
    let subjectName = "Universidad";
    let classTitle = "Clase";
    let targetSubjectId = "";

    if (materialId) {
      const material = await prisma.material.findUnique({
        where: { id: materialId },
        include: { subject: true, classSession: true },
      });
      if (!material) return NextResponse.json({ error: "Material no encontrado" }, { status: 404 });
      textToProcess = material.extractedText || "";
      subjectName = material.subject.name;
      targetSubjectId = material.subjectId;
      classTitle = material.classSession?.title || material.fileName;
    } else if (classId) {
      const cls = await prisma.classSession.findUnique({
        where: { id: classId },
        include: { subject: true, materials: true },
      });
      if (!cls) return NextResponse.json({ error: "Clase no encontrada" }, { status: 404 });
      subjectName = cls.subject.name;
      targetSubjectId = cls.subjectId;
      classTitle = cls.title;
      textToProcess = cls.notes || cls.materials.map((m) => m.extractedText || "").join("\n\n");
    }

    if (!textToProcess.trim()) {
      textToProcess = `Contenido teórico sobre ${classTitle} para la materia ${subjectName}.`;
    }

    const { result, isMock, modelUsed } = await processAcademicMaterial(textToProcess, {
      subject: subjectName,
      classTitle,
    });

    // Save or update Summary
    const summary = await prisma.summary.create({
      data: {
        classId: classId || null,
        materialId: materialId || null,
        title: result.title,
        overview: result.overview,
        detailedSummary: result.detailedSummary,
        simplifiedExplanation: result.simplifiedExplanation,
        keyPointsJson: JSON.stringify(result.keyPoints || []),
        definitionsJson: JSON.stringify(result.definitions || []),
        examplesJson: JSON.stringify(result.examples || []),
        commonMistakesJson: JSON.stringify(result.commonMistakes || []),
        aiModel: modelUsed,
        version: 1,
      },
    });

    // Create extracted topics, flashcards & exam questions
    if (targetSubjectId) {
      const upcomingExam = await prisma.exam.findFirst({
        where: { subjectId: targetSubjectId, status: "upcoming" },
        orderBy: { date: "asc" },
      });

      const createdTopics = [];
      for (const t of result.topics || []) {
        const topic = await prisma.topic.create({
          data: {
            subjectId: targetSubjectId,
            classId: classId || null,
            name: t.name,
            description: t.description,
            importance: t.importance || "high",
            masteryScore: 50,
            nextReviewAt: new Date(),
          },
        });
        createdTopics.push(topic);

        if (upcomingExam) {
          await prisma.examTopic.create({
            data: {
              examId: upcomingExam.id,
              topicId: topic.id,
            },
          }).catch(() => {});
        }
      }

      // Persist all flashcards with SM-2 parameters
      const primaryTopicId = createdTopics[0]?.id || null;
      for (let i = 0; i < (result.flashcards || []).length; i++) {
        const card = result.flashcards[i];
        const assignedTopicId = createdTopics[i % Math.max(1, createdTopics.length)]?.id || primaryTopicId;
        await prisma.flashcard.create({
          data: {
            subjectId: targetSubjectId,
            topicId: assignedTopicId,
            front: card.front,
            back: card.back,
            difficulty: card.difficulty || "medium",
            easeFactor: 2.5,
            interval: 1,
            repetitions: 0,
            nextReviewAt: new Date(),
          },
        });
      }

      // Persist all exam questions
      for (const q of result.examQuestions || []) {
        await prisma.question.create({
          data: {
            subjectId: targetSubjectId,
            classId: classId || null,
            question: q.question,
            optionsJson: JSON.stringify(q.options || []),
            answer: q.answer,
            explanation: q.explanation,
            difficulty: q.difficulty || "medium",
            type: q.type || "multiple_choice",
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      summary,
      isMock,
      modelUsed,
    });
  } catch (error: any) {
    console.error("Error in summarize route:", error);
    return NextResponse.json({ error: error?.message || "Error al generar resumen" }, { status: 500 });
  }
}
