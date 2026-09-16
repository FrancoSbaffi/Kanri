import React from "react";

interface KanriLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function KanriLogo({ className = "", size = 24, showText = false }: KanriLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* User's Custom Cat Brand Icon replacing the K lettermark */}
      <img
        src="/icon.png"
        alt="Kanri"
        width={size}
        height={size}
        className="shrink-0 object-contain select-none"
        style={{ width: `${size}px`, height: `${size}px` }}
      />

      {showText && (
        <span className="font-medium tracking-tight text-sm text-[var(--text-primary)]">
          Kanri
          <span className="font-mono text-[10px] text-[var(--text-muted)] ml-1 tracking-wider uppercase">
            / OS
          </span>
        </span>
      )}
    </div>
  );
}
