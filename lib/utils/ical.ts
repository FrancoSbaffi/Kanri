// iCalendar (.ics) Generator strictly compliant with RFC 5545 and Apple/macOS Calendar
export interface ICalEventInput {
  uid: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  modality: "presencial" | "virtual" | "hybrid" | "exam" | "assignment";
  subjectName: string;
  url?: string;
}

/**
 * Format a Date object to local Buenos Aires iCal format: YYYYMMDDTHHMMSS
 * Argentina (UTC-3) has no daylight saving time, offset is fixed at -03:00.
 */
function formatLocalBuenosAires(date: Date): string {
  // Convert UTC timestamp into America/Argentina/Buenos_Aires components
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value || "00";

  const year = get("year");
  const month = get("month");
  const day = get("day");
  const hour = get("hour");
  const minute = get("minute");
  const second = get("second");

  return `${year}${month}${day}T${hour}${minute}${second}`;
}

function formatUtcTimestamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeICalText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

/**
 * RFC 5545 Section 3.1: Lines of text SHOULD NOT be longer than 75 octets.
 * Continuation lines must begin with a single space (which counts as 1 octet).
 */
function foldLine(line: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(line);
  if (bytes.length <= 75) return line;

  const chunks: string[] = [];
  let offset = 0;
  let isFirst = true;

  while (offset < bytes.length) {
    const maxLen = isFirst ? 75 : 74;
    let end = offset + maxLen;
    if (end >= bytes.length) {
      const slice = bytes.subarray(offset);
      const text = new TextDecoder("utf-8").decode(slice);
      chunks.push(isFirst ? text : " " + text);
      break;
    }

    // Do not split inside a multi-byte UTF-8 sequence (continuation bytes: 10xxxxxx, i.e. 0x80..0xBF)
    while (end > offset && (bytes[end] & 0xC0) === 0x80) {
      end--;
    }

    const slice = bytes.subarray(offset, end);
    const text = new TextDecoder("utf-8").decode(slice);
    chunks.push(isFirst ? text : " " + text);
    offset = end;
    isFirst = false;
  }

  return chunks.join("\r\n");
}

export function generateICalendar(events: ICalEventInput[]): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kanri//University OS v2.0//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Kanri · Cursada UCABA 2026",
    "X-WR-TIMEZONE:America/Argentina/Buenos_Aires",
    "X-WR-CALDESC:Calendario académico sincronizado desde Kanri OS con horarios de clases presenciales y virtuales, parciales y entregas de TP.",
    // Standard VTIMEZONE component for Apple Calendar
    "BEGIN:VTIMEZONE",
    "TZID:America/Argentina/Buenos_Aires",
    "X-LIC-LOCATION:America/Argentina/Buenos_Aires",
    "BEGIN:STANDARD",
    "TZNAME:-03",
    "TZOFFSETFROM:-0300",
    "TZOFFSETTO:-0300",
    "DTSTART:19700101T000000",
    "END:STANDARD",
    "END:VTIMEZONE",
  ];

  const nowStamp = formatUtcTimestamp(new Date());

  for (const ev of events) {
    const isPresencial = ev.modality === "presencial";
    const isExam = ev.modality === "exam";
    const isAssignment = ev.modality === "assignment";

    const dtStartStr = formatLocalBuenosAires(ev.startDate);
    const dtEndStr = formatLocalBuenosAires(ev.endDate);

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${ev.uid}@kanri.ucaba.edu.ar`);
    lines.push(`DTSTAMP:${nowStamp}`);
    lines.push(`CREATED:${nowStamp}`);
    lines.push(`LAST-MODIFIED:${nowStamp}`);
    lines.push(`SEQUENCE:0`);
    lines.push(`DTSTART;TZID=America/Argentina/Buenos_Aires:${dtStartStr}`);
    lines.push(`DTEND;TZID=America/Argentina/Buenos_Aires:${dtEndStr}`);
    lines.push(`SUMMARY:${escapeICalText(ev.title)}`);
    lines.push(`LOCATION:${escapeICalText(ev.location)}`);
    lines.push(`DESCRIPTION:${escapeICalText(ev.description)}`);

    const category = isExam
      ? "EXAMEN"
      : isPresencial
      ? "CLASE PRESENCIAL"
      : isAssignment
      ? "ENTREGA TRABAJO PRÁCTICO"
      : "CLASE VIRTUAL";

    lines.push(`CATEGORIES:${category}`);
    lines.push("STATUS:CONFIRMED");
    lines.push("TRANSP:OPAQUE");

    if (ev.url) {
      lines.push(`URL:${ev.url}`);
    }

    // Alarms / Reminders native to macOS Calendar.app
    if (isPresencial) {
      // 1 day before
      lines.push("BEGIN:VALARM");
      lines.push("TRIGGER:-P1D");
      lines.push("ACTION:DISPLAY");
      lines.push(`DESCRIPTION:Alerta Kanri: Mañana tienes clase presencial de ${escapeICalText(ev.subjectName)}`);
      lines.push("END:VALARM");

      // 2 hours before with location
      lines.push("BEGIN:VALARM");
      lines.push("TRIGGER:-PT2H");
      lines.push("ACTION:DISPLAY");
      lines.push(`DESCRIPTION:En 2 horas: Clase presencial en ${escapeICalText(ev.location)}`);
      lines.push("END:VALARM");
    } else if (isExam) {
      // 2 days before
      lines.push("BEGIN:VALARM");
      lines.push("TRIGGER:-P2D");
      lines.push("ACTION:DISPLAY");
      lines.push(`DESCRIPTION:Examen importante en 48 hs: ${escapeICalText(ev.subjectName)}`);
      lines.push("END:VALARM");

      // 3 hours before
      lines.push("BEGIN:VALARM");
      lines.push("TRIGGER:-PT3H");
      lines.push("ACTION:DISPLAY");
      lines.push(`DESCRIPTION:Examen hoy: ${escapeICalText(ev.subjectName)} en ${escapeICalText(ev.location)}`);
      lines.push("END:VALARM");
    } else if (isAssignment) {
      // 1 day before deadline
      lines.push("BEGIN:VALARM");
      lines.push("TRIGGER:-P1D");
      lines.push("ACTION:DISPLAY");
      lines.push(`DESCRIPTION:Entrega pendiente mañana: ${escapeICalText(ev.title)}`);
      lines.push("END:VALARM");

      // 3 hours before deadline
      lines.push("BEGIN:VALARM");
      lines.push("TRIGGER:-PT3H");
      lines.push("ACTION:DISPLAY");
      lines.push(`DESCRIPTION:Vence en 3 horas: ${escapeICalText(ev.title)}`);
      lines.push("END:VALARM");
    } else {
      // Virtual class: 30 minutes before
      lines.push("BEGIN:VALARM");
      lines.push("TRIGGER:-PT30M");
      lines.push("ACTION:DISPLAY");
      lines.push(`DESCRIPTION:En 30 minutos: Clase virtual de ${escapeICalText(ev.subjectName)}`);
      lines.push("END:VALARM");
    }

    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  // Apply RFC 5545 line folding and join with CRLF
  return lines.map(foldLine).join("\r\n");
}

