// PDF and document text extraction utility for Kanri

export interface ExtractedDocument {
  text: string;
  totalPages: number;
  info?: Record<string, any>;
}

export async function extractTextFromBuffer(
  buffer: Buffer,
  fileType: string = "application/pdf"
): Promise<ExtractedDocument> {
  if (fileType.includes("text/plain") || fileType.includes("markdown") || fileType.includes("text/csv")) {
    const text = buffer.toString("utf-8");
    return {
      text,
      totalPages: 1,
      info: {},
    };
  }

  try {
    // pdf-parse v2 API
    const { PDFParse } = (await import("pdf-parse")) as any;
    const parser = new PDFParse({ data: buffer });
    const textResult = await parser.getText();
    await parser.destroy();

    const cleanText = (typeof textResult === "string" ? textResult : textResult?.text || "")
      .replace(/\r\n/g, "\n")
      .replace(/\t/g, " ")
      .replace(/[ \u00a0]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return {
      text: cleanText.length > 0 ? cleanText : "Material procesado. Sin texto embebido.",
      totalPages: 1,
      info: {},
    };
  } catch (error: any) {
    console.warn("pdf-parse extraction failed, attempting ascii string fallback:", error?.message);
    const raw = buffer.toString("latin1");
    const extracted = raw.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s{3,}/g, "\n");
    return {
      text: extracted.length > 50 ? extracted : "No se pudo extraer texto seleccionable del archivo.",
      totalPages: 1,
      info: { error: error?.message },
    };
  }
}

/**
 * Splits extracted document text into manageable token-friendly chunks
 */
export function chunkDocumentText(text: string, maxChunkLength: number = 4000): string[] {
  if (text.length <= maxChunkLength) return [text];

  const paragraphs = text.split("\n\n");
  const chunks: string[] = [];
  let currentChunk = "";

  for (const para of paragraphs) {
    if ((currentChunk + "\n\n" + para).length <= maxChunkLength) {
      currentChunk += (currentChunk ? "\n\n" : "") + para;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      if (para.length > maxChunkLength) {
        let remaining = para;
        while (remaining.length > 0) {
          chunks.push(remaining.substring(0, maxChunkLength));
          remaining = remaining.substring(maxChunkLength);
        }
        currentChunk = "";
      } else {
        currentChunk = para;
      }
    }
  }

  if (currentChunk) chunks.push(currentChunk);
  return chunks;
}
