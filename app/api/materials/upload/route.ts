import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { extractTextFromBuffer } from "@/lib/pdf/extractor";
import { processAcademicMaterial } from "@/lib/ai/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const subjectId = formData.get("subjectId") as string | null;
    const classId = formData.get("classId") as string | null;
    const autoProcess = formData.get("autoProcess") !== "false";

    if (!file || !subjectId) {
      return NextResponse.json(
        { error: "Archivo y subjectId son requeridos" },
        { status: 400 }
      );
    }

    // Ensure subject exists
    const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
    if (!subject) {
      return NextResponse.json({ error: "Materia no encontrada" }, { status: 404 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Secure local upload storage
    const uploadsDir = path.join(process.cwd(), "uploads", "materials");
    await mkdir(uploadsDir, { recursive: true });

    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueFileName = `${Date.now()}_${safeFileName}`;
    const filePath = path.join(uploadsDir, uniqueFileName);
    const storageRelativePath = `uploads/materials/${uniqueFileName}`;

    await writeFile(filePath, buffer);

    // 1. Text extraction
    const extracted = await extractTextFromBuffer(buffer, file.type);

    // 2. Create Material record
    const material = await prisma.material.create({
      data: {
        subjectId,
        classId: classId || null,
        fileName: file.name,
        fileType: file.type || "application/pdf",
        fileSize: file.size,
        storagePath: storageRelativePath,
        extractedText: extracted.text,
        processingStatus: autoProcess ? "processing" : "completed",
      },
    });

    // 3. If autoProcess, run academic summary pipeline
    if (autoProcess) {
      // Background-style async processing
      try {
        const classSession = classId
          ? await prisma.classSession.findUnique({ where: { id: classId } })
          : null;

        const { result, modelUsed } = await processAcademicMaterial(extracted.text, {
          subject: subject.name,
          classTitle: classSession?.title || file.name,
        });

        // Store summary
        const summary = await prisma.summary.create({
          data: {
            classId: classId || null,
            materialId: material.id,
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

        // Find upcoming exam for this subject to link new topics
        const upcomingExam = await prisma.exam.findFirst({
          where: { subjectId, status: "upcoming" },
          orderBy: { date: "asc" },
        });

        // 1. Create extracted topics
        const createdTopics = [];
        for (const topicData of result.topics || []) {
          const createdTopic = await prisma.topic.create({
            data: {
              subjectId,
              classId: classId || null,
              name: topicData.name,
              description: topicData.description,
              importance: topicData.importance || "high",
              masteryScore: 50,
              nextReviewAt: new Date(),
            },
          });
          createdTopics.push(createdTopic);

          // Link topic to upcoming exam if available
          if (upcomingExam) {
            await prisma.examTopic.create({
              data: {
                examId: upcomingExam.id,
                topicId: createdTopic.id,
              },
            }).catch(() => {});
          }
        }

        // 2. Create ALL flashcards with SM-2 parameters
        const primaryTopicId = createdTopics[0]?.id || null;
        for (let i = 0; i < (result.flashcards || []).length; i++) {
          const card = result.flashcards[i];
          const assignedTopicId = createdTopics[i % Math.max(1, createdTopics.length)]?.id || primaryTopicId;
          await prisma.flashcard.create({
            data: {
              subjectId,
              topicId: assignedTopicId,
              front: card.front,
              back: card.back,
              difficulty: card.difficulty || "medium",
              easeFactor: 2.5,
              interval: 1,
              repetitions: 0,
              nextReviewAt: new Date(), // available immediately for SM-2 recall!
            },
          });
        }

        // 3. Create ALL exam questions
        for (const q of result.examQuestions || []) {
          await prisma.question.create({
            data: {
              subjectId,
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

        // Update material status
        await prisma.material.update({
          where: { id: material.id },
          data: { processingStatus: "completed" },
        });

        return NextResponse.json({
          success: true,
          material: { ...material, processingStatus: "completed" },
          summaryId: summary.id,
        });
      } catch (procErr: any) {
        console.error("AI pipeline processing error:", procErr);
        await prisma.material.update({
          where: { id: material.id },
          data: {
            processingStatus: "failed",
            errorMessage: procErr?.message || "Error al generar resumen inteligente",
          },
        });
        return NextResponse.json({
          success: true,
          material: { ...material, processingStatus: "failed" },
          warning: "El archivo fue guardado con éxito pero falló el procesamiento IA.",
        });
      }
    }

    return NextResponse.json({ success: true, material });
  } catch (error: any) {
    console.error("Error in upload route:", error);
    return NextResponse.json(
      { error: error?.message || "Error en la subida del material" },
      { status: 500 }
    );
  }
}
