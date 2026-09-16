// Spanish date formatting utilities for Kanri

const SPANISH_MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

const SPANISH_DAYS = [
  "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
];

const SPANISH_DAYS_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function formatDateEs(dateInput: Date | string | number, options?: { includeYear?: boolean; includeDayName?: boolean }): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";

  const dayName = SPANISH_DAYS[d.getDay()];
  const day = d.getDate();
  const month = SPANISH_MONTHS[d.getMonth()];
  const year = d.getFullYear();

  if (options?.includeDayName && options?.includeYear) {
    return `${dayName} ${day} de ${month}, ${year}`;
  }
  if (options?.includeDayName) {
    return `${dayName} ${day} de ${month}`;
  }
  if (options?.includeYear) {
    return `${day} de ${month} de ${year}`;
  }
  return `${day} de ${month}`;
}

export function formatTimeEs(dateInput: Date | string | number): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function formatRelativeEs(targetDate: Date | string | number): string {
  const now = new Date();
  const target = new Date(targetDate);
  if (isNaN(target.getTime())) return "";

  const diffMs = target.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHours = Math.round(diffMin / 60);
  const diffDays = Math.round(diffHours / 24);

  // Calendar day diff
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const dayDifference = Math.round((targetDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (dayDifference === 0) return "Hoy";
  if (dayDifference === 1) return "Mañana";
  if (dayDifference === -1) return "Ayer";
  if (dayDifference > 1 && dayDifference <= 30) return `en ${dayDifference} días`;
  if (dayDifference < -1 && dayDifference >= -30) return `hace ${Math.abs(dayDifference)} días`;

  if (diffHours > 0 && diffHours < 24) return `en ${diffHours} h`;
  if (diffHours < 0 && diffHours > -24) return `hace ${Math.abs(diffHours)} h`;

  return formatDateEs(target, { includeYear: target.getFullYear() !== now.getFullYear() });
}

export function getCountdownParts(targetDate: Date | string | number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  totalHours: number;
} {
  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, totalHours: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  const totalHours = Math.floor(diff / (1000 * 60 * 60));

  return { days, hours, minutes, seconds, isPast: false, totalHours };
}

export { SPANISH_DAYS, SPANISH_DAYS_SHORT, SPANISH_MONTHS };
