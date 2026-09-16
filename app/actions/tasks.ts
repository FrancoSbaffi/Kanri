"use server";

import prisma from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function updateAssignmentStatus(
  assignmentId: string,
  status: "todo" | "in_progress" | "completed"
) {
  try {
    const updated = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        status,
        completedAt: status === "completed" ? new Date() : null,
      },
    });

    revalidatePath("/tasks");
    revalidatePath("/dashboard");
    return { success: true, assignment: updated };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function createAssignment(data: {
  subjectId: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: "low" | "medium" | "high" | "urgent";
}) {
  try {
    const assignment = await prisma.assignment.create({
      data: {
        subjectId: data.subjectId,
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate),
        priority: data.priority,
        status: "todo",
      },
    });

    revalidatePath("/tasks");
    revalidatePath("/dashboard");
    return { success: true, assignment };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}
