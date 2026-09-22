/**
 * Text formatting and Unicode sanitization utilities
 */

export function formatFileName(name: string): string {
  if (!name) return "";
  return name
    .normalize("NFC")
    .replace(/e[\u0300\u0301]/g, "é")
    .replace(/a[\u0300\u0301]/g, "á")
    .replace(/i[\u0300\u0301]/g, "í")
    .replace(/o[\u0300\u0301]/g, "ó")
    .replace(/u[\u0300\u0301]/g, "ú")
    .replace(/n[\u0303]/g, "ñ")
    .replace(/E[\u0300\u0301]/g, "É")
    .replace(/A[\u0300\u0301]/g, "Á")
    .replace(/I[\u0300\u0301]/g, "Í")
    .replace(/O[\u0300\u0301]/g, "Ó")
    .replace(/U[\u0300\u0301]/g, "Ú")
    .replace(/N[\u0303]/g, "Ñ");
}
