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
=== PAUTAS DE CÁTEDRA OFICIALES: SISTEMAS DIGITALES (Prof. Andrés Bondio, Gastón Escobar) - UCABA 2026 ===
- Documentos rectores: PROG_2026C2_00124_Sistemas_Digitales.pdf y Guía Didáctica 2026.
- Régimen evaluativo: Examen Parcial Presencial Integrador Teórico-Práctico (Unidades 1 a 13).
- REGLA DE APROBACIÓN ESTRICTA: La cátedra exige responder y resolver correctamente como mínimo el 70% del examen (Nota 7 sobre 10) tanto en el parcial como en el recuperatorio.
- Trabajos Prácticos Obligatorios: TP1 (Arquitectura y OKR) y TP2 (Automatización de Procesos RPA en LowCode).
- Criterios de Rúbrica Oficial:
  1. Comprensión conceptual y aplicación práctica a problemáticas empresariales reales.
  2. Pensamiento crítico y enfoque reflexivo/creativo (ir más allá de la mera descripción).
  3. Organización general, secuencia lógica y claridad en la exposición técnica.
  4. Calidad y rigor en el uso de fuentes canónicas (IEEE Std 1471, Len Bass SEI, Klaus Schwab).
  5. Calidad visual de diagramas y recursos explicativos.
- Ejes temáticos prioritarios para Flashcards y Preguntas:
  1. Metodología OKR (Andy Grove, John Doerr): Objetivos aspiracionales (stretch goals), Key Results cuantitativos medibles (0-100% o absolutos), diferenciación con KPIs operativos y Matriz ACT (Análisis, Conceptualización, Transformación).
  2. Arquitectura de Software (IEEE Std 1471 / SEI Bass, Clements, Kazman): Escenario de Calidad de 6 partes canónicas (Fuente, Estímulo, Entorno, Artefacto, Respuesta y Medida de la respuesta). Atributos de calidad (Disponibilidad, Rendimiento, Modificabilidad, Seguridad, Testabilidad) y tácticas de diseño.
  3. Automatización de Procesos (BPM vs. RPA): Criterios de viabilidad de robotización (reglas fijas, alto volumen, datos estructurados digitales, baja excepción, sistemas legacy), bots Attended vs. Unattended, arquitectura Studio/Robot/Orquestador.
  4. Blockchain y Finanzas Descentralizadas (DeFi): Criptografía asimétrica, funciones hash SHA-256, inmutabilidad, EVM, Smart Contracts, Pools de liquidez AMM (fórmula x * y = k) y sobrecolateralización en protocolos de préstamo (Aave/MakerDAO).
  5. Inteligencia Artificial y GenAI (Unidad 11 - Russell & Norvig): Definición funcional (percibir, razonar, aprender, resolver problemas), tres impulsores (Big Data, GPU cómputo y redes neuronales), matemática de la neurona artificial (Y = f(Σ Wi*Xi + b)), funciones de activación Sigmoide (probabilidades [0,1]), ReLU (max(0,x), anti-desvanecimiento de gradiente) y Tanh ([-1,1]), caso práctico de ajuste de sesgo por aprendizaje supervisado, taxonomía ANI vs. AGI vs. IAG, modelos de texto (GPT/Transformers/LLMs) y audiovisuales (GANs con Generador vs. Discriminador).
  6. Prompt Engineering (11 principios): Claridad, asignación de rol/perspectiva, contexto situacional, delimitadores/placeholders, formato estructurado, acotamiento de alcance, preguntas diagnósticas previas de la IA, few-shot prompting, diseño para audiencia, iteración continua y meta-prompting.
`;
  }

  if (s.includes("emprendedurismo") || s.includes("taller")) {
    return `
=== PAUTAS DE CÁTEDRA OFICIALES: TALLER DE EMPRENDEDURISMO EN INNOVACIÓN DIGITAL (Prof. Cottini, Foricher, Moneda, Rshaid) - UCABA 2026 ===
- Documento rector: Programa_Analitico_2026_actualizado.docx.pdf.
- Régimen evaluativo de cursada:
  1. Hito 1 — Elevator Pitch (Aprobado/Desaprobado): Mapa de empatía + Propuesta de Valor Canvas.
  2. Parcial Escrito Presencial (40% de cursada): Opción múltiple conceptual y Verdadero/Falso con fundamentación rigurosa (Unidades 1 a 5).
  3. Hito 2 — Pre-entrega de Proyecto (Aprobado/Desaprobado): Plan de Negocios Canvas integrado + Pre-pitch (equipo, problema, solución, mercado y cash flow).
  4. Hito 3 — Pitch Final Individual ante Jurado (60% de cursada): Exposición oral de 5 min con Pitch Deck oficial + ronda de preguntas técnicas del jurado.
- CONDICIONES DE ACREDITACIÓN:
  - Promoción directa: Nota ponderada final >= 7.00, con calificación >= 6 en cada instancia evaluativa y 75% de asistencia.
  - REGLA FINANCIERA INELUDIBLE: El proyecto debe demostrar Valor Actual Neto (VAN) > 0 a una tasa de descuento anual del 30% y un VAN acumulado resultante >= US$ 600.000.
  - RESTRICCIÓN EXCLUYENTE: Prohibición absoluta de clientes o proveedores gubernamentales/estatales.
- Ejes temáticos prioritarios para Flashcards y Preguntas:
  1. Lean Startup y Customer Discovery: Validación de hipótesis, experimentos de bajo costo, pivot y factores de éxito de startups (estudio de Bill Gross: Timing 42%, Equipo 32%, Idea 28%).
  2. Business Model Canvas (Osterwalder) y Propuesta de Valor: Los 9 bloques interconectados, encaje problema-solución con el Mapa de Empatía (dolores, alegrías, tareas del cliente).
  3. Oratoria y Elevator Pitch: Estructura canónica de 5 fases (Gancho disruptivo, Problema validado, Solución MVP demostrada, Modelo de Negocio monetizable, Llamado a la acción / Inversión solicitada).
  4. Dimensionamiento de Mercado: TAM (Mercado Total Direccionable), SAM (Mercado Disponible Servible), SOM (Mercado Objetivo Obtenible Inmediato).
  5. Marketing y Estrategia: 5 Fuerzas de Porter, roles de compra CUPID (Consumidor, Usuario, Pagador, Influenciador, Decisor), Marketing Mix 4P (Producto, Precio, Plaza, Promoción).
  6. Finanzas para Startups: Flujo de fondos proyectado, Cash Flow, Tasa de Descuento (30%), cálculo de VAN, métricas CAC y LTV.
`;
  }

  if (s.includes("negocios")) {
    return `
=== PAUTAS DE CÁTEDRA OFICIALES: ADMINISTRACIÓN DE MODELOS DE NEGOCIOS DIGITALES (Prof. Javier Monzón, Sergio Donzelli) - UCABA 2026 ===
- Documentos rectores: PROG_2026C2_ASIG00123 y Guía Didáctica 2026 v1.
- Régimen evaluativo: 2 instancias obligatorias teóricas y prácticas diseñadas para demostrar comprensiones duraderas (50% Parcial 1 Presencial + 50% Parcial 2 Entrega TP Diagnóstico de Transformación Digital y Defensa Oral).
- CONDICIONES DE ACREDITACIÓN:
  - Regularidad: 75% de asistencia + aprobación de actividades obligatorias + nota mínima de 4 (cuatro).
  - Promoción directa: Promedio final >= 7 (siete), con calificación no menor a 6 (seis) en cada una de las evaluaciones obligatorias.
- Ejes temáticos prioritarios para Flashcards y Preguntas:
  1. Economía Conductual en Entornos Digitales: Dan Ariely ("Zero as a Special Price" / Efecto del Precio Cero), sesgos cognitivos, arquitectura de decisión y fijación de precios.
  2. Modelos de Negocio Asimétricos y Ecosistemas: Monetización indirecta cruzada, subsidio de productos complementarios (estrategia Amazon Prime vs. Netflix).
  3. Plataformas Multifacéticas y Efectos de Red (Hagiu & Rogers): Efectos de red directos e indirectos, fijación de precios asimétrica y superación del problema del huevo o la gallina.
  4. Planificación Estratégica Digital: Los 10 pasos de Gartner para diseñar una plataforma digital y formulación de Objetivos SMART.
  5. Diagnóstico del Entorno Digital: Entornos BANI (Quebradizo, Ansioso, No lineal, Incomprensible) de Jamais Cascio vs. VUCA, y análisis PESTLE.
  6. Matrices Estratégicas: FODA, VRIO (Ventaja competitiva sostenible: Valioso, Raro, Inimitable, Organizado), CAME (Corregir debilidades, Afrontar amenazas, Mantener fortalezas, Explotar oportunidades) alineadas a OKRs de negocio.
`;
  }

  if (s.includes("talento")) {
    return `
=== PAUTAS DE CÁTEDRA OFICIALES: GESTIÓN DEL TALENTO HUMANO EN LA INDUSTRIA DIGITAL (Prof. Sanguinetti, Garattoni, Nucilli) - UCABA 2026 ===
- Documentos rectores: Programa analitico GTHID 2C2026.pdf y Guía Didáctica 1C_2026.pdf.
- Régimen evaluativo: 2 Parciales obligatorios (50% y 50%) + Trabajo Integrador práctico.
- CONDICIONES DE ACREDITACIÓN:
  - Regularidad: 75% de asistencia + cumplimiento de actividades obligatorias + nota mínima de 4 (cuatro).
  - Promoción directa: Promedio final >= 7 (siete), sin ninguna nota inferior a 6 (seis) en las evaluaciones obligatorias.
- Ejes temáticos prioritarios para Flashcards y Preguntas:
  1. Cultura Organizacional y Clima: Stephen Robbins (culturas fuertes vs. débiles, 4 mecanismos de transmisión cultural, procesos de selección y socialización, iceberg del bienestar laboral).
  2. Capital Humano como Sistema Abierto: Shimon Dolan (insumos de personas y mercado, procesos de gestión, productos de retención/desempeño y retroalimentación), Autoridad de Línea vs. Función de Staff.
  3. Planeamiento Estratégico del Talento: George Bohlander (integración vertical con la estrategia corporativa e integración horizontal entre subsistemas de RRHH), FODA de Capital Humano.
  4. Responsabilidad Social Empresaria (RSE) y Balance Social: Manual de la OIT 2001, características y desafíos del empleo en PyMEs tecnológicas argentinas vs. sector público.
  5. Paradigmas de Gestión del Talento: Roberto Pérez Van Morlegan (por qué los paradigmas organizacionales prevalecen sobre las herramientas técnicas).
  6. Motivación Laboral: Frederick Herzberg (teoría bifactorial: factores higiénicos/extrínsecos previenen la insatisfacción pero no motivan; factores intrínsecos de crecimiento motivan).
  7. Liderazgo Situacional: Hersey & Blanchard (estilos directivo, persuasivo, participativo y delegativo en función de la madurez laboral y motivacional del colaborador IT).
  8. Gestión por Competencias: Martha Alles (diccionario de competencias organizacionales y específicas, comportamientos observables y evaluación de desempeño por incidentes críticos STAR).
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

