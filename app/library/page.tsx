import React from "react";
import prisma from "@/lib/db/prisma";
import { MaterialLibraryClient } from "@/components/library/material-library-client";

export const revalidate = 0;

export default async function LibraryPage() {
  const [materials, subjects] = await Promise.all([
    prisma.material.findMany({
      include: {
        subject: true,
        classSession: true,
      },
      orderBy: { uploadedAt: "desc" },
    }),
    prisma.subject.findMany({
      where: { status: "active" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Biblioteca de Materiales & PDFs
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Archivos, apuntes de clase y documentos procesados por la IA
        </p>
      </div>

      <MaterialLibraryClient materials={materials} subjects={subjects} />
    </div>
  );
}
