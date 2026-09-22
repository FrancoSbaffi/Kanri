import fs from "fs";
import path from "path";
import { extractTextFromBuffer } from "../lib/pdf/extractor";

async function main() {
  const dir = path.join(process.cwd(), "uploads/rubricas");
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".pdf"));

  console.log(`🔍 Encontrados ${files.length} archivos PDF en uploads/rubricas:`);

  const outDir = path.join(process.cwd(), "scratch_rubricas");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const file of files) {
    console.log(`\n📄 Procesando: ${file}...`);
    const filePath = path.join(dir, file);
    const buf = fs.readFileSync(filePath);
    const result = await extractTextFromBuffer(buf, "application/pdf");
    console.log(`   Longitud de texto extraído: ${result.text.length} caracteres.`);

    const safeName = file.replace(/[^a-zA-Z0-9_\-\.]/g, "_") + ".txt";
    fs.writeFileSync(path.join(outDir, safeName), result.text, "utf-8");

    // Buscar palabras clave de evaluación
    const evalKeywords = ["evaluaci", "parcial", "final", "aprobaci", "promoci", "regular", "nota", "criterio", "rúbrica", "rubrica", "70%", "60%", "escala"];
    const lines = result.text.split("\n");
    const matched = lines.filter(l => evalKeywords.some(k => l.toLowerCase().includes(k)));
    console.log(`   Líneas relevantes de evaluación detectadas: ${matched.length}`);
  }

  console.log(`\n✅ Todo el texto extraído y guardado en ${outDir}`);
}

main().catch(console.error);
