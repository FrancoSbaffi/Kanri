import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { extractTextFromBuffer } from "../lib/pdf/extractor";

const prisma = new PrismaClient();

async function main() {
  console.log("🏛️ Sincronizando Rúbricas Oficiales y Programas Analíticos en Kanri...");

  const subjects = await prisma.subject.findMany({
    include: {
      exams: true,
      materials: true,
    },
  });

  const rubricsDir = path.join(process.cwd(), "uploads/rubricas");
  const rubricFiles = fs.readdirSync(rubricsDir).filter((f) => f.endsWith(".pdf"));

  console.log(`📁 Detectados ${rubricFiles.length} documentos oficiales en uploads/rubricas/`);

  // Mapeo de archivos a materias
  const fileToSubjectMap: Record<string, string> = {
    // Negocios
    "GD_2026C2_ASIG00123_Administracion_de_modelos_de_negocios_digitales - Guía Didáctica 2026 v1.pdf": "negocios",
    "PROG_2026C2_ASIG00123_Administracion_de_modelos_de_negocios_digitales - Programa analítico 2026 v1.pdf": "negocios",
    // Sistemas
    "PROG_2026C2_00124_Sistemas_Digitales.pdf": "sistemas",
    "Guia_Didactica_Sistemas_Digitales_2026.pdf": "sistemas",
    // GTHID
    "Programa analitico GTHID 2C2026.pdf": "talento",
    "Guía Didáctica 1C_2026.pdf": "talento",
    // Taller
    "Programa_Analitico_2026_actualizado.docx.pdf": "taller",
  };

  for (const fileName of rubricFiles) {
    const key = Object.keys(fileToSubjectMap).find((k) => fileName.includes(k) || k.includes(fileName));
    const subjectKey = key ? fileToSubjectMap[key] : (fileName.toLowerCase().includes("sistemas") ? "sistemas" : fileName.toLowerCase().includes("negocios") ? "negocios" : fileName.toLowerCase().includes("talento") || fileName.toLowerCase().includes("gthid") ? "talento" : "taller");

    const subject = subjects.find((s) => {
      const sName = s.name.toLowerCase();
      if (subjectKey === "sistemas") return sName.includes("sistemas");
      if (subjectKey === "negocios") return sName.includes("negocios");
      if (subjectKey === "talento") return sName.includes("talento");
      if (subjectKey === "taller") return sName.includes("taller") || sName.includes("emprendedurismo");
      return false;
    });

    if (!subject) {
      console.warn(`⚠️ No se pudo asignar ${fileName} a ninguna materia.`);
      continue;
    }

    const filePath = path.join(rubricsDir, fileName);
    const fileStat = fs.statSync(filePath);
    const buf = fs.readFileSync(filePath);
    const extracted = await extractTextFromBuffer(buf, "application/pdf");

    let mat = await prisma.material.findFirst({
      where: { subjectId: subject.id, fileName },
    });

    if (mat) {
      mat = await prisma.material.update({
        where: { id: mat.id },
        data: {
          fileSize: fileStat.size,
          storagePath: `uploads/rubricas/${fileName}`,
          extractedText: extracted.text,
        },
      });
      console.log(`  🔄 Material de rúbrica actualizado: "${fileName}" -> ${subject.name}`);
    } else {
      mat = await prisma.material.create({
        data: {
          subjectId: subject.id,
          fileName,
          fileType: "application/pdf",
          fileSize: fileStat.size,
          storagePath: `uploads/rubricas/${fileName}`,
          extractedText: extracted.text,
        },
      });
      console.log(`  ➕ Material de rúbrica registrado: "${fileName}" -> ${subject.name}`);
    }
  }

  // 2. Sincronizar pautas oficiales en los exámenes de cada materia
  console.log("\n🎯 Sincronizando especificaciones de examen basadas en las Rúbricas Oficiales...");

  // Sistemas Digitales
  const sistemasSubject = subjects.find((s) => s.name.toLowerCase().includes("sistemas"));
  if (sistemasSubject) {
    const sistemasExam = sistemasSubject.exams.find((e) => e.examType === "midterm" || e.title.includes("Parcial"));
    if (sistemasExam) {
      const rubricNotes = {
        institution: "Universidad de la Ciudad de Buenos Aires (UCABA)",
        career: "Licenciatura en Tecnologías Digitales",
        instanceType: "Examen Parcial Presencial Integrador Teórico-Práctico",
        professors: "Andrés Bondio, Gastón Escobar",
        weightPercentage: 70,
        passingGrade: 7,
        promotionGrade: 7,
        minGradePerInstance: 7,
        gradingScale: "1 a 10 (Aprobación estricta de cátedra con 70% / Nota 7)",
        format: "Examen individual presencial teórico-práctico en Laboratorio Digital. Comprende resolución de casos de arquitectura con escenarios SEI de 6 partes, cálculos matemáticos de neuronas artificiales y funciones de activación, diseño de viabilidad RPA/BPM y criptografía/DeFi.",
        evaluatedScope: "Unidades 1 a 13 (OKRs, Metodología ACT, Arquitectura de Software IEEE/SEI Bass, Atributos de Calidad, RPA/BPM, Blockchain, Smart Contracts, DeFi, Containers, Cloud, IA y Prompt Engineering)",
        keyCriteria: [
          "Regla de Aprobación de Cátedra: Requiere responder y resolver correctamente como mínimo el 70% del examen (calificación 7 sobre 10) para aprobar.",
          "Metodología OKR (Grove & Doerr): Formulación de Objetivos cualitativos/stretch goals y Key Results medibles, distinción con KPIs operativos y Matriz ACT.",
          "Arquitectura de Software (IEEE Std 1471 / Bass): Especificación canónica de Escenarios de Calidad con las 6 partes (Fuente, Estímulo, Entorno, Artefacto, Respuesta, Medida de la respuesta).",
          "Atributos de Calidad y Tácticas: Trade-offs entre Disponibilidad, Rendimiento, Modificabilidad, Seguridad y Testabilidad.",
          "Automatización Robótica de Procesos (RPA): Criterios de viabilidad (reglas fijas, alto volumen, datos estructurados, baja excepción), arquitectura Studio/Robot/Orquestador.",
          "Blockchain & DeFi: Funciones hash SHA-256, inmutabilidad, EVM, Smart Contracts, Pools de Liquidez AMM (x*y=k) y sobrecolateralización de préstamos en protocolos DeFi.",
          "Inteligencia Artificial y GenAI (Unidad 11): Definición de Russell & Norvig, cálculo numérico de neuronas artificiales (Y = f(Σ WiXi + b)), funciones Sigmoide/ReLU/Tanh, taxonomía ANI vs AGI vs IAG, GANs y Prompt Engineering.",
          "Acreditación de Trabajos Prácticos: TP1 (Arquitectura y OKR) y TP2 (Automatización de Procesos RPA en LowCode) con entrega aprobada obligatoria.",
        ],
      };

      await prisma.exam.update({
        where: { id: sistemasExam.id },
        data: {
          notes: JSON.stringify(rubricNotes),
          location: "Sede Central UCABA",
          room: "Laboratorio Digital 301",
        },
      });
      console.log(`  ✅ Examen de Sistemas Digitales calibrado con 70% nota de corte.`);
    }
  }

  // Taller de Emprendedurismo
  const tallerSubject = subjects.find((s) => s.name.toLowerCase().includes("taller") || s.name.toLowerCase().includes("emprendedurismo"));
  if (tallerSubject) {
    const parcialTaller = tallerSubject.exams.find((e) => e.title.includes("Parcial Escrito") || e.examType === "midterm");
    if (parcialTaller) {
      const rubricParcial = {
        institution: "Universidad de la Ciudad de Buenos Aires (UCABA)",
        career: "Licenciatura en Tecnologías Digitales",
        instanceType: "Parcial Escrito Presencial (40% de Cursada)",
        professors: "Juan Manuel Cottini, Tomás Foricher, Pedro Moneda, Bernardo Rshaid",
        weightPercentage: 40,
        passingGrade: 4,
        promotionGrade: 7,
        minGradePerInstance: 6,
        gradingScale: "1 a 10 (Aprobación con 60% / Nota 4)",
        format: "Individual escrito presencial. Preguntas opción múltiple conceptuales y Verdadero/Falso con fundamentación rigurosa sobre Unidades 1 a 5.",
        evaluatedScope: "Unidades 1 a 5 (Lean Startup, Canvas de Modelo de Negocio, Mapa de Empatía, TAM/SAM/SOM, Metodologías Ágiles vs Cascada, Evaluación Financiera VAN a tasa 30%)",
        keyCriteria: [
          "Definición y aplicación del Business Model Canvas y Mapa de Empatía (dolores, alegrías y tareas).",
          "Cálculo y justificación de mercado: TAM (Total Addressable Market), SAM (Serviceable Addressable Market) y SOM (Serviceable Obtainable Market).",
          "Diferenciación conceptual entre Metodologías Ágiles (Scrum, Kanban, sprints, MVP) y modelo en cascada tradicional.",
          "Formulación matemática del Valor Actual Neto (VAN), tasa de descuento del 30% anual y umbral de viabilidad ineludible de US$ 600.000.",
          "Evaluación de clientes y canales mediante roles CUPID y las 4P del Marketing Mix.",
          "Estudio de Bill Gross sobre éxito de startups (Timing 42%, Equipo 32%, Idea 28%).",
        ],
      };

      await prisma.exam.update({
        where: { id: parcialTaller.id },
        data: { notes: JSON.stringify(rubricParcial) },
      });
      console.log(`  ✅ Parcial de Taller de Emprendedurismo calibrado con rúbrica 40%.`);
    }

    const pitchTaller = tallerSubject.exams.find((e) => e.title.includes("Pitch Final") || e.examType === "final");
    if (pitchTaller) {
      const rubricPitch = {
        institution: "Universidad de la Ciudad de Buenos Aires (UCABA)",
        career: "Licenciatura en Tecnologías Digitales",
        instanceType: "Defensa Oral Individual de Pitch ante Jurado (Hito 3 - 60% Cursada)",
        professors: "Juan Manuel Cottini, Tomás Foricher, Pedro Moneda, Bernardo Rshaid",
        weightPercentage: 60,
        passingGrade: 4,
        promotionGrade: 7,
        minGradePerInstance: 6,
        gradingScale: "1 a 10 (Calificación individual por jurado de cátedra)",
        format: "Exposición oral individual de 5 minutos apoyada en Pitch Deck oficial + ronda de 5 a 10 minutos de preguntas técnicas del jurado.",
        evaluatedScope: "Unidades 1 a 8 (Plan de Negocios Completo, Storytelling en 5 fases, Tracción del MVP, Finanzas VAN >= US$ 600k a tasa 30%, Estructura Legal y VC)",
        keyCriteria: [
          "Oratoria y Storytelling: Estructura clara en 5 fases (Gancho disruptivo, Problema validado, Solución MVP demostrada, Modelo de Negocio monetizable, Llamado a la Acción).",
          "Viabilidad Financiera Ineludible: VAN > 0 calculado al 30% anual y VAN acumulado >= US$ 600.000 con flujo de fondos justificado a perpetuidad.",
          "Restricción Excluyente: Proyecto no puede tener al Estado/Gobierno como cliente o proveedor primario.",
          "Solvencia en Defensa Individual: Capacidad de respuesta técnica ante objeciones del jurado sobre CAC, LTV y canales.",
          "Nota Ponderada de Cursada: (Parcial Escrito x 0.40) + (Pitch Final x 0.60). Promoción directa con promedio >= 7.00.",
        ],
      };

      await prisma.exam.update({
        where: { id: pitchTaller.id },
        data: { notes: JSON.stringify(rubricPitch) },
      });
      console.log(`  ✅ Pitch Final de Taller calibrado con rúbrica 60%.`);
    }
  }

  // Administración de Negocios Digitales
  const negociosSubject = subjects.find((s) => s.name.toLowerCase().includes("negocios"));
  if (negociosSubject) {
    const parcial1 = negociosSubject.exams.find((e) => e.title.includes("Parcial 1"));
    if (parcial1) {
      const rubricN1 = {
        institution: "Universidad de la Ciudad de Buenos Aires (UCABA)",
        career: "Licenciatura en Tecnologías Digitales",
        instanceType: "Evaluación Parcial 1 Presencial Individual (50%)",
        professors: "Javier Monzón, Sergio Donzelli",
        weightPercentage: 50,
        passingGrade: 4,
        promotionGrade: 7,
        minGradePerInstance: 6,
        gradingScale: "1 a 10 (Aprobación con 4, Promoción directa con promedio >= 7 y notas >= 6)",
        format: "Evaluación escrita presencial individual. Preguntas teóricas, análisis de casos y resolución de desafíos de negocios digitales.",
        evaluatedScope: "Unidades 1 a 4 (Economía Conductual de Dan Ariely, Efecto del Precio Cero, Modelos de Negocio Asimétricos, Plataformas Multifacéticas Hagiu & Rogers, Efectos de Red, Gartner 10 pasos y Entornos BANI/VUCA)",
        keyCriteria: [
          "Economía Conductual: Análisis riguroso del Efecto del Precio Cero (Dan Ariely) y su aplicación a la captación de usuarios en productos digitales freemium.",
          "Modelos Asimétricos: Explicación de modelos donde un producto subsidia a otro (estrategia Amazon Prime vs. Netflix).",
          "Plataformas Multifacéticas: Definición formal de Hagiu & Rogers, efectos de red directos e indirectos, y resolución de la falla de masa crítica inicial.",
          "Planificación Estratégica: Aplicación de los 10 pasos de Gartner para diseñar una plataforma digital y Objetivos SMART.",
          "Diagnóstico de Entorno: Diferenciación analítica entre entornos VUCA (Volátil, Incierto, Complejo, Ambiguo) y entornos BANI (Quebradizo, Ansioso, No lineal, Incomprensible) de Jamais Cascio.",
        ],
      };
      await prisma.exam.update({
        where: { id: parcial1.id },
        data: { notes: JSON.stringify(rubricN1) },
      });
      console.log(`  ✅ Parcial 1 de Negocios Digitales calibrado con rúbrica.`);
    }

    const parcial2 = negociosSubject.exams.find((e) => e.title.includes("Parcial 2"));
    if (parcial2) {
      const rubricN2 = {
        institution: "Universidad de la Ciudad de Buenos Aires (UCABA)",
        career: "Licenciatura en Tecnologías Digitales",
        instanceType: "Evaluación Parcial 2: Entrega TP Diagnóstico de Transformación Digital y Defensa Oral (50%)",
        professors: "Javier Monzón, Sergio Donzelli",
        weightPercentage: 50,
        passingGrade: 4,
        promotionGrade: 7,
        minGradePerInstance: 6,
        gradingScale: "1 a 10 (Aprobación con 4, Promoción directa con promedio >= 7 y notas >= 6)",
        format: "Presentación escrita formal del caso de Transformación Digital de una empresa real + Defensa oral individual y en equipo ante el cuerpo docente.",
        evaluatedScope: "Unidades 5 a 8 (Diagnóstico PESTLE, FODA, Matriz VRIO, Tácticas CAME, Roadmap de Transformación Digital y Métricas OKR)",
        keyCriteria: [
          "Rigor Diagnóstico: Evaluación de la empresa mediante matriz VRIO (Valioso, Raro, Inimitable, Organizado) para identificar ventajas competitivas sostenibles.",
          "Articulación CAME: Propuesta de acciones concretas derivadas del FODA (Corregir debilidades, Afrontar amenazas, Mantener fortalezas, Explotar oportunidades).",
          "Roadmap y OKRs: Definición de iniciativas digitales priorizadas con Objetivos y Resultados Clave cuantificables.",
          "Defensa Oral: Claridad conceptual, dominio del caso de negocio y solidez en la respuesta a repreguntas del docente.",
        ],
      };
      await prisma.exam.update({
        where: { id: parcial2.id },
        data: { notes: JSON.stringify(rubricN2) },
      });
      console.log(`  ✅ Parcial 2 de Negocios Digitales calibrado con rúbrica.`);
    }
  }

  // Gestión del Talento Humano en la Industria Digital
  const talentoSubject = subjects.find((s) => s.name.toLowerCase().includes("talento"));
  if (talentoSubject) {
    const p1Talento = talentoSubject.exams.find((e) => e.title.includes("1er Examen Parcial"));
    if (p1Talento) {
      const rubricT1 = {
        institution: "Universidad de la Ciudad de Buenos Aires (UCABA)",
        career: "Licenciatura en Tecnologías Digitales",
        instanceType: "1er Examen Parcial Presencial Obligatorio (50%)",
        professors: "Ignacio Sanguinetti, Bárbara Garattoni, Augusto Nucilli",
        weightPercentage: 50,
        passingGrade: 4,
        promotionGrade: 7,
        minGradePerInstance: 6,
        gradingScale: "1 a 10 (Aprobación con 4, Promoción directa con promedio >= 7 y notas >= 6)",
        format: "Examen individual presencial escrito. Preguntas conceptuales y análisis de casos situacionales sobre las Unidades 1 a 3.",
        evaluatedScope: "Unidades 1 a 3 (Cultura Organizacional de Stephen Robbins, Capital Humano como Sistema Abierto de Shimon Dolan, Planeamiento Estratégico de Bohlander, RSE y Paradigmas de Gestión de Van Morlegan)",
        keyCriteria: [
          "Cultura Organizacional (Robbins): Distinción entre culturas fuertes y débiles, los 4 mecanismos de transmisión cultural, y el iceberg del bienestar organizacional.",
          "Capital Humano como Sistema Abierto (Dolan): Insumos, procesos de gestión, productos de retención/desempeño y retroalimentación con el entorno de mercado.",
          "Autoridad de Línea vs. Función de Staff: Responsabilidades directas del líder de equipo vs. asesoramiento del departamento de Capital Humano.",
          "Planeamiento Estratégico (Bohlander): Integración vertical con la estrategia corporativa e integración horizontal entre subsistemas de RRHH.",
          "Paradigmas de Gestión (Van Morlegan): Demostrar por qué los paradigmas organizacionales prevalecen y condicionan las herramientas técnicas.",
        ],
      };
      await prisma.exam.update({
        where: { id: p1Talento.id },
        data: { notes: JSON.stringify(rubricT1) },
      });
      console.log(`  ✅ Parcial 1 de Gestión del Talento calibrado con rúbrica.`);
    }

    const p2Talento = talentoSubject.exams.find((e) => e.title.includes("2do Examen Parcial"));
    if (p2Talento) {
      const rubricT2 = {
        institution: "Universidad de la Ciudad de Buenos Aires (UCABA)",
        career: "Licenciatura en Tecnologías Digitales",
        instanceType: "2do Examen Parcial Presencial Obligatorio + Trabajo Integrador (50%)",
        professors: "Ignacio Sanguinetti, Bárbara Garattoni, Augusto Nucilli",
        weightPercentage: 50,
        passingGrade: 4,
        promotionGrade: 7,
        minGradePerInstance: 6,
        gradingScale: "1 a 10 (Aprobación con 4, Promoción directa con promedio >= 7 y notas >= 6)",
        format: "Examen individual presencial escrito sobre Unidad 4 + Defensa del Trabajo Práctico Integrador de aplicación a un equipo de desarrollo IT.",
        evaluatedScope: "Unidad 4 (Subsistemas de CH: Descripción de Puestos, Reclutamiento IT, Modelo de Competencias de Martha Alles, Motivación Herzberg, Liderazgo Hersey & Blanchard, Salario Emocional y Legislación Laboral)",
        keyCriteria: [
          "Modelo de Competencias (Martha Alles): Identificación de competencias cardinales y específicas, niveles de desarrollo y comportamientos observables.",
          "Evaluación de Desempeño: Método de incidentes críticos y técnica de entrevista STAR (Situación, Tarea, Acción, Resultado).",
          "Teoría Bifactorial de Herzberg: Diferenciación nítida entre factores higiénicos/extrínsecos (sueldo, condiciones físicas) y factores motivadores intrínsecos (logro, autonomía).",
          "Liderazgo Situacional (Hersey & Blanchard): Adaptación del estilo de liderazgo (directivo, persuasivo, participativo, delegativo) según madurez técnica y motivacional del desarrollador.",
          "Compensaciones y Salario Emocional: Componentes no monetarios clave para la retención de perfiles escasos en la industria digital.",
        ],
      };
      await prisma.exam.update({
        where: { id: p2Talento.id },
        data: { notes: JSON.stringify(rubricT2) },
      });
      console.log(`  ✅ Parcial 2 de Gestión del Talento calibrado con rúbrica.`);
    }
  }

  console.log("\n🎉 Todas las materias y exámenes quedaron 100% sincronizados con las Rúbricas Oficiales de UCABA.");
}

main()
  .catch((e) => {
    console.error("❌ Error sincronizando rúbricas:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
