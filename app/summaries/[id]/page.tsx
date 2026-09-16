import React from "react";
import prisma from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import { SummarySplitReader } from "@/components/summaries/summary-split-reader";

export const revalidate = 0;

export default async function SummaryDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const summary = await prisma.summary.findUnique({
    where: { id },
    include: {
      classSession: {
        include: { subject: true },
      },
      material: true,
    },
  });

  if (!summary) notFound();

  return <SummarySplitReader summary={summary} />;
}
