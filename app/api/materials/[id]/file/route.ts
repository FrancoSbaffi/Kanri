import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const material = await prisma.material.findUnique({ where: { id } });

    if (!material) {
      return NextResponse.json({ error: "Material no encontrado" }, { status: 404 });
    }

    // Scoped file access inside uploads folder
    const relativeSubPath = material.storagePath.replace(/^uploads[\/\\]?/, "");
    let fullPath = path.join(process.cwd(), "uploads", relativeSubPath);

    if (!existsSync(fullPath)) {
      const fileName = path.basename(material.storagePath);
      const fallbackPath = path.join(process.cwd(), "uploads", "materials", fileName);
      if (existsSync(fallbackPath)) {
        fullPath = fallbackPath;
      } else {
        return NextResponse.json(
          { error: "El archivo físico no se encuentra en el almacenamiento" },
          { status: 404 }
        );
      }
    }

    const fileBuffer = await readFile(fullPath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": material.fileType || "application/pdf",
        "Content-Disposition": `inline; filename="${encodeURIComponent(material.fileName)}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
