// Prompts for academic content processing in Spanish adhering to UCABA guidelines

export const SYSTEM_ACADEMIC_PROMPT = `Eres el motor de inteligencia artificial de Kanri ("University OS"), la plataforma académica oficial para estudiantes de la Licenciatura en Tecnologías Digitales en la Universidad de la Ciudad de Buenos Aires (UCABA).
Tu misión es transformar material académico (apuntes de clase, diapositivas de cátedra, PDFs, programas analíticos) en un sistema de estudio estructurado de máximo rendimiento.

REGLAS ACADÉMICAS OBLIGATORIAS:
1. Idioma: Español universitario rioplatense/argentino formal y riguroso.
2. Rigor de Cátedra: Respeta y prioriza la terminología, taxonomías, autores canónicos y fórmulas exigidas por los profesores de la cátedra oficial.
3. Cero Alucinaciones: Basa tus resúmenes, flashcards y preguntas de examen ÚNICAMENTE en el contenido de la clase y las pautas oficiales. No inventes conceptos fuera de programa.
4. Flashcards SM-2: Diseñadas para Active Recall (pregunta clara al frente que desafía el razonamiento o recuerdo activo, dorso con respuesta sintética y justificada).
5. Preguntas de Examen (Simulador): Preguntas tipo múltiple opción o Verdadero/Falso idénticas a las que toma la cátedra en sus exámenes presenciales, con 4 opciones plausibles y explicación técnica rigurosa.
6. Salida: Responde EXCLUSIVAMENTE en formato JSON válido, sin bloques de código markdown ni texto adicional.
`;

export function getSubjectRubricGuidelines(subjectName: string): string {
  const s = (subjectName || "").toLowerCase();

  if (s.includes("sistemas")) {
    return `
=== PAUTAS DE CÁTEDRA: SISTEMAS DIGITALES (Prof. Andrés Bondio, Gastón Escobar) - UCABA ===
- Régimen evaluativo: Examen Parcial Presencial Integrador (Unidades 1 a 13).
- REGLA ESTRICTA DE CORTE: La cátedra exige responder y resolver correctamente como mínimo el 70% del examen (Nota 7 sobre 10) para aprobar.
- Ejes temáticos prioritarios para Flashcards y Preguntas:
  1. Metodología OKR (Andy Grove, John Doerr): Objetivos cualitativos/aspiracionales (stretch goals con 70-80% de cumplimiento), Key Results cuantitativos medibles (0 a 100% o valores absolutos), distinción con KPIs operativos y Matriz ACT (Análisis, Conceptualización, Transformación).
  2. Arquitectura de Software (IEEE Std 1471 / SEI Bass, Clements, Kazman): Las 6 partes obligatorias de un Escenario de Calidad (Fuente, Estímulo, Entorno, Artefacto, Respuesta y Medida de la respuesta). Atributos de calidad (Disponibilidad, Rendimiento, Modificabilidad, Seguridad, Testabilidad) y tácticas asociadas (detección, recuperación, prevención).
  3. Automatización de Procesos (BPM vs. RPA): Criterios de viabilidad para robotización (reglas fijas, alto volumen, datos estructurados digitales, baja excepción, sistemas legacy), bots Attended vs. Unattended, arquitectura Studio/Robot/Orquestador.
  4. Blockchain y Finanzas Descentralizadas (DeFi): Criptografía asimétrica, funciones hash SHA-256, inmutabilidad, EVM, Smart Contracts, Pools de liquidez AMM (x * y = k) y sobrecolateralización de préstamos en DeFi (Aave/MakerDAO).
`;
  }

  if (s.includes("emprendedurismo") || s.includes("taller")) {
    return `
=== PAUTAS DE CÁTEDRA: TALLER DE EMPRENDEDURISMO EN INNOVACIÓN DIGITAL (Prof. Cottini, Foricher, Moneda, Rshaid) - UCABA ===
- Régimen evaluativo: 40% Parcial Escrito Presencial (Unidades 1 a 5) + 60% Pitch Final individual ante jurado (Hito 3). Promoción directa con nota ponderada >= 7.
- REGLA FINANCIERA INELUDIBLE: El proyecto debe demostrar Valor Actual Neto (VAN) > 0 a una tasa de descuento anual del 30% y un VAN resultante >= US$ 600.000. Prohibición de clientes/proveedores gubernamentales.
- Ejes temáticos prioritarios para Flashcards y Preguntas:
  1. Lean Startup y Customer Discovery: Validación de hipótesis, experimentos de bajo costo, pivot y factores de éxito de startups (estudio de Bill Gross: Timing 42%, Equipo 32%, Idea 28%).
  2. Business Model Canvas (Osterwalder) y Propuesta de Valor: Los 9 bloques, encaje con el Mapa de Empatía (dolores, alegrías, tareas).
  3. Elevator Pitch: Estructura canónica de 5 fases (Gancho, Problema validado, Solución MVP, Modelo de negocio, Cierre/Call to action).
  4. Dimensionamiento de Mercado: TAM (Mercado Total), SAM (Mercado Disponible), SOM (Mercado Objetivo Inmediato).
  5. Marketing y Estrategia: 5 Fuerzas de Porter, roles de compra CUPID, Marketing Mix 4P (Producto, Precio, Plaza, Promoción).
`;
  }

  if (s.includes("negocios")) {
    return `
=== PAUTAS DE CÁTEDRA: ADMINISTRACIÓN DE NEGOCIOS DIGITALES (Prof. Javier Monzón, Sergio Donzelli) - UCABA ===
- Régimen evaluativo: 50% Parcial 1 Presencial (Unidades 1 a 4) + 50% Parcial 2 (Entrega TP Diagnóstico de Transformación Digital y Defensa Oral). Promoción directa con promedio >= 7 (sin notas < 6).
- Ejes temáticos prioritarios para Flashcards y Preguntas:
  1. Economía Conductual: Dan Ariely ("Zero as a Special Price" / Efecto Cero), sesgos cognitivos y decisiones de compra digital.
  2. Modelos de Negocio Asimétricos y Ecosistemas: Monetización indirecta cruzada, productos complementarios (Amazon Prime vs. Netflix).
  3. Plataformas Multifacéticas y Efectos de Red (Hagiu & Rogers): Efectos de red directos e indirectos, fijación de precios asimétrica.
  4. Planificación Estratégica Digital: Los 10 pasos de Gartner para diseñar una plataforma digital y Objetivos SMART.
  5. Diagnóstico del Entorno Digital: Entornos BANI (Quebradizo, Ansioso, No lineal, Incomprensible) de Jamais Cascio vs. VUCA y análisis PESTLE.
  6. Matrices Estratégicas: FODA, VRIO (Ventaja competitiva sostenible), CAME (Corregir, Afrontar, Mantener, Explotar) alineadas a OKRs.
`;
  }

  if (s.includes("talento")) {
    return `
=== PAUTAS DE CÁTEDRA: GESTIÓN DEL TALENTO HUMANO EN LA INDUSTRIA DIGITAL (Prof. Sanguinetti, Garattoni, Nucilli) - UCABA ===
- Régimen evaluativo: 2 Parciales presenciales obligatorios (50% y 50%). Promoción directa con promedio >= 7 (sin notas < 6).
- Ejes temáticos prioritarios para Flashcards y Preguntas:
  1. Cultura Organizacional: Stephen Robbins (culturas fuertes vs. débiles, 4 mecanismos de transmisión cultural, selección y socialización, iceberg del bienestar laboral).
  2. Capital Humano como Sistema Abierto: Shimon Dolan (insumos, procesos, productos y retroalimentación), Autoridad de Línea vs. Función de Staff.
  3. Planeamiento Estratégico de CH: George Bohlander, integración vertical con el negocio e integración horizontal entre subsistemas, FODA de RRHH.
  4. RSE Interna y Balance Social: Manual de la OIT 2001, características de PyMEs IT argentinas vs. sector público.
  5. Paradigmas de Gestión: Roberto Pérez Van Morlegan (por qué los paradigmas prevalecen sobre las herramientas técnicas).
  6. Motivación Laboral: Frederick Herzberg (factores higiénicos previenen insatisfacción pero no motivan; factores intrínsecos motivadores).
  7. Liderazgo Situacional: Hersey & Blanchard (estilos directivo, persuasivo, participativo y delegativo según madurez técnica y motivacional).
  8. Gestión por Competencias: Martha Alles (diccionario de competencias, evaluación por incidentes críticos STAR).
`;
  }

  return "";
}

export function buildSummarizePrompt(docText: string, context?: { subject?: string; classTitle?: string }): string {
  const rubricGuide = getSubjectRubricGuidelines(context?.subject || "");

  return `Analiza en profundidad el siguiente material académico oficial para la materia "${context?.subject || "Universidad"}" - Clase "${context?.classTitle || "General"}".
${rubricGuide}

MATERIAL ACADÉMICO EXTRAÍDO:
"""
${docText.slice(0, 16000)}
"""

INSTRUCCIONES DE SALIDA:
Genera una respuesta JSON estrictamente estructurada. Asegúrate de incluir:
- Al menos 6 a 10 Flashcards SM-2 enfocadas en los conceptos clave que evalúa la cátedra según la rúbrica.
- Al menos 4 a 6 Preguntas de Examen de opción múltiple (o Verdadero/Falso fundamentado) con la justificación técnica de la respuesta correcta.
- Resumen detallado con formato Markdown, definiciones rigurosas y errores comunes de examen.

Estructura JSON exacta requerida:
{
  "title": "Título sintético y preciso del tema central",
  "overview": "Resumen ejecutivo en 2 párrafos concisos y de alto nivel sobre el propósito y alcance del tema.",
  "detailedSummary": "Explicación estructurada completa en formato Markdown técnico, con subtítulos, listas, fórmulas y viñetas.",
  "simplifiedExplanation": "Explicación intuitiva con una analogía clara para comprender el concepto medular.",
  "keyPoints": [
    "Punto clave 1",
    "Punto clave 2",
    "Punto clave 3",
    "Punto clave 4"
  ],
  "definitions": [
    { "term": "Término técnico", "definition": "Definición rigurosa y exacta según cátedra" }
  ],
  "examples": [
    { "title": "Nombre del ejemplo o caso", "description": "Contexto y resolución paso a paso" }
  ],
  "commonMistakes": [
    { "mistake": "Error o confusión habitual en exámenes de la cátedra", "explanation": "Por qué ocurre y cómo evitarlo con precisión conceptual" }
  ],
  "topics": [
    {
      "name": "Nombre del tema o subtema evaluado",
      "description": "Breve descripción",
      "importance": "critical" // "critical", "high", "medium"
    }
  ],
  "examQuestions": [
    {
      "question": "Pregunta de examen con caso o concepto técnico",
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "answer": "Opción A",
      "explanation": "Justificación técnica fundamentada según los textos y diapositivas de la cátedra",
      "difficulty": "medium", // "easy", "medium", "hard"
      "type": "multiple_choice" // "multiple_choice", "true_false"
    }
  ],
  "flashcards": [
    {
      "front": "¿Pregunta o concepto clave para Active Recall?",
      "back": "Respuesta clara, concisa y completa para memorización a largo plazo",
      "difficulty": "medium"
    }
  ],
  "detectedAssignments": [
    { "title": "Nombre del trabajo o entrega", "dueDateSuggestion": "2026-10-15" }
  ],
  "detectedDates": [
    { "title": "Fecha de examen o hito", "dateSuggestion": "2026-10-02" }
  ]
}
`;
}

