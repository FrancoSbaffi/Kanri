import React from "react";
import prisma from "@/lib/db/prisma";
import { SettingsClient } from "@/components/settings/settings-client";
import { isAIConfigured } from "@/lib/ai/client";

export const revalidate = 0;

export default async function SettingsPage() {
  const user = await prisma.user.findFirst();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Configuración del Sistema
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Preferencias de visualización, notificaciones, motor de IA y exportación de datos
        </p>
      </div>

      <SettingsClient
        initialUser={user}
        isAiConfigured={isAIConfigured()}
      />
    </div>
  );
}
