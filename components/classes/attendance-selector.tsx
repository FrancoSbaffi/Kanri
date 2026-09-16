"use client";

import React, { useState } from "react";
import { updateClassAttendance } from "@/app/actions/academic";
import { Check, X, Clock, AlertTriangle } from "lucide-react";

export function AttendanceSelector({
  classId,
  currentStatus,
}: {
  classId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (newStatus: "attended" | "missed" | "cancelled" | "pending") => {
    setStatus(newStatus);
    setLoading(true);
    await updateClassAttendance(classId, newStatus);
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-1 bg-[var(--bg-surface-elevated)] p-1 rounded-lg border border-[var(--border-subtle)] text-xs">
      <button
        onClick={() => handleUpdate("attended")}
        className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 ${
          status === "attended"
            ? "bg-emerald-500 text-white shadow-xs"
            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        }`}
        title="Marcar como asistida"
      >
        <Check className="w-3 h-3" />
        <span>Asistí</span>
      </button>

      <button
        onClick={() => handleUpdate("pending")}
        className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 ${
          status === "pending"
            ? "bg-[var(--bg-surface-active)] text-[var(--text-primary)]"
            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        }`}
        title="Pendiente"
      >
        <Clock className="w-3 h-3" />
        <span>Pendiente</span>
      </button>

      <button
        onClick={() => handleUpdate("missed")}
        className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 ${
          status === "missed"
            ? "bg-rose-500 text-white"
            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        }`}
        title="Marcar como ausente"
      >
        <X className="w-3 h-3" />
        <span>Ausente</span>
      </button>
    </div>
  );
}
