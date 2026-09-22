"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Upload,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { formatDateEs } from "@/lib/utils/dates";
import { formatFileName } from "@/lib/utils/format";

interface MaterialItem {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  processingStatus: string;
  uploadedAt: Date;
  subject: {
    id: string;
    name: string;
    color: string;
  };
  classSession?: {
    id: string;
    title: string;
    classNumber: number;
  } | null;
}

export function MaterialLibraryClient({
  materials,
  subjects,
}: {
  materials: MaterialItem[];
  subjects: { id: string; name: string }[];
}) {
  const [search, setSearch] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("all");

  const filtered = materials.filter((m) => {
    if (selectedSubjectId !== "all" && m.subject.id !== selectedSubjectId) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        m.fileName.toLowerCase().includes(q) ||
        m.subject.name.toLowerCase().includes(q) ||
        (m.classSession && m.classSession.title.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 text-xs">
      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por archivo, materia o clase..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] focus:outline-none text-xs"
          >
            <option value="all">Todas las materias</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Materials List */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] divide-y divide-[var(--border-subtle)]">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--bg-surface-elevated)] transition group"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[var(--text-primary)] truncate">
                    {formatFileName(m.fileName)}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    {m.processingStatus}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: m.subject.color }}
                    />
                    {m.subject.name}
                  </span>
                  {m.classSession && (
                    <>
                      <span>·</span>
                      <span>{m.classSession.title}</span>
                    </>
                  )}
                  <span>·</span>
                  <span>{Math.round(m.fileSize / 1024)} KB</span>
                  <span>·</span>
                  <span>{formatDateEs(m.uploadedAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {m.classSession && (
                <Link
                  href={`/classes/${m.classSession.id}`}
                  className="px-2.5 py-1 rounded-md border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-active)] font-medium text-[var(--text-primary)] transition flex items-center gap-1"
                >
                  <BookOpen className="w-3 h-3 text-[var(--accent)]" />
                  <span>Ver en Clase</span>
                </Link>
              )}

              <a
                href={`/api/materials/${m.id}/file`}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-md border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-active)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition"
                title="Abrir PDF original"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-xs text-[var(--text-muted)]">
            No se encontraron documentos en la biblioteca.
          </div>
        )}
      </div>
    </div>
  );
}
