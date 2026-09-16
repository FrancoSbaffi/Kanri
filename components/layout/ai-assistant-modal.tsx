"use client";

import React, { useState } from "react";
import { Sparkles, X, Send, BookOpen, ExternalLink, Loader2 } from "lucide-react";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIAssistantModal({ isOpen, onClose }: AIAssistantModalProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string; sources?: any[] }[]
  >([
    {
      role: "assistant",
      content:
        "Hola Franco. Soy tu Asistente Académico de Kanri. Puedes preguntarme sobre tus apuntes, resúmenes, fórmulas o conceptos de tus materias (Bases de Datos, Concurrencia, Redes) y citaré los apuntes correspondientes.",
    },
  ]);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    const userText = query.trim();
    setQuery("");
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userText }),
      });
      const data = await res.json();

      if (data.answer) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.answer,
            sources: data.sources || [],
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Ocurrió un inconveniente al consultar la base de conocimientos.",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "No se pudo conectar con el motor de IA.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl h-[560px] flex flex-col rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-[var(--text-primary)]">
                Asistente Académico Kanri
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                RAG sobre tus apuntes y PDFs de materias
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                m.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3.5 py-2.5 leading-relaxed ${
                  m.role === "user"
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {m.sources && m.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] flex flex-wrap gap-2">
                    {m.sources.map((src: any, sIdx: number) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--bg-surface-active)] text-[10px] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                      >
                        <BookOpen className="w-2.5 h-2.5" />
                        {src.subject} · {src.classTitle}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] py-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--accent)]" />
              <span>Consultando apuntes y analizando relaciones...</span>
            </div>
          )}
        </div>

        {/* Query Input */}
        <form
          onSubmit={handleSend}
          className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pregunta sobre normalización, semáforos, sockets..."
            className="flex-1 px-3 py-2 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="px-3.5 py-2 rounded-lg bg-[var(--accent)] text-white hover:opacity-90 disabled:opacity-50 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Consultar</span>
          </button>
        </form>
      </div>
    </div>
  );
}
