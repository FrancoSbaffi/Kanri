"use client";

import React, { useState } from "react";
import { Upload, FileText, CheckCircle2, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface ClassUploaderProps {
  subjectId: string;
  classId: string;
}

export function ClassUploader({ subjectId, classId }: ClassUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "extracting" | "analyzing" | "completed" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      startUpload(e.target.files[0]);
    }
  };

  const startUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setStatus("uploading");
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("subjectId", subjectId);
    formData.append("classId", classId);
    formData.append("autoProcess", "true");

    try {
      // Simulate stepped progress UI
      setTimeout(() => setStatus("extracting"), 800);
      setTimeout(() => setStatus("analyzing"), 2000);

      const res = await fetch("/api/materials/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Error al procesar el archivo");
      }

      setStatus("completed");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err.message || "Error al procesar");
    }
  };

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 mb-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
            Material de Clase & Procesamiento IA
          </h3>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
            Arrastra el PDF de la clase para extraer texto, generar resumen estructurado, temas y flashcards.
          </p>
        </div>
      </div>

      {status === "idle" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer ${
            dragOver
              ? "border-[var(--accent)] bg-[var(--accent)]/5"
              : "border-[var(--border-strong)] hover:border-[var(--text-muted)] bg-[var(--bg-surface-elevated)]"
          }`}
          onClick={() => document.getElementById("class-file-input")?.click()}
        >
          <input
            id="class-file-input"
            type="file"
            accept=".pdf,.txt,.docx,.md"
            onChange={handleFileChange}
            className="hidden"
          />
          <Upload className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-3" />
          <p className="text-xs font-medium text-[var(--text-primary)]">
            Haz clic o arrastra aquí el archivo PDF / Apunte
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Compatible con PDF, DOCX, TXT y Markdown (hasta 50 MB)
          </p>
        </div>
      )}

      {status !== "idle" && (
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-[var(--text-primary)]">
                {file?.name}
              </span>
            </div>
            {status === "completed" && (
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Procesado
              </span>
            )}
          </div>

          {/* Stepper */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Archivo guardado en almacenamiento local seguro</span>
            </div>

            <div className="flex items-center gap-2">
              {status === "uploading" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--accent)]" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>Extrayendo texto y fórmulas de páginas</span>
            </div>

            <div className="flex items-center gap-2">
              {status === "analyzing" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--accent)]" />
              ) : status === "completed" ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full border border-[var(--border-strong)] inline-block" />
              )}
              <span>Generando resumen estructurado, temas y flashcards</span>
            </div>
          </div>

          {status === "completed" && (
            <div className="pt-2 flex items-center justify-between border-t border-[var(--border-subtle)]">
              <span className="text-emerald-400 font-medium text-[11px] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                ¡Procesamiento finalizado con éxito!
              </span>
              <button
                onClick={() => setStatus("idle")}
                className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Subir otro archivo
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="pt-2 text-rose-400 text-[11px] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
              <button
                onClick={() => setStatus("idle")}
                className="ml-auto underline text-[var(--text-primary)]"
              >
                Reintentar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
