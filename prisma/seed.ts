import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Sincronizando Kanri con los programas oficiales de UCABA (Licenciatura en Tecnologías Digitales)...");
  console.log("📅 Fecha de referencia actual: 15 de Septiembre de 2026.");

  // Limpiar base de datos
  await prisma.reviewSession.deleteMany({});
  await prisma.studySession.deleteMany({});
  await prisma.preparationPlanItem.deleteMany({});
  await prisma.examTopic.deleteMany({});
  await prisma.exam.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.flashcard.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.concept.deleteMany({});
  await prisma.topic.deleteMany({});
  await prisma.summary.deleteMany({});
  await prisma.material.deleteMany({});
  await prisma.classSession.deleteMany({});
  await prisma.subject.deleteMany({});
  await prisma.semester.deleteMany({});
  await prisma.academicYear.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Usuario
  const user = await prisma.user.create({
    data: {
      email: "franco.sbaffi@udelaciudad.edu.ar",
      name: "Franco Sbaffi",
      career: "Licenciatura en Tecnologías Digitales",
      university: "Universidad de la Ciudad de Buenos Aires (UCABA)",
      timezone: "America/Argentina/Buenos_Aires",
    },
  });

  // 2. Ciclo Lectivo y Cuatrimestre
  const academicYear = await prisma.academicYear.create({
    data: {
      userId: user.id,
      name: "2026",
      startDate: new Date("2026-03-01T00:00:00-03:00"),
      endDate: new Date("2026-12-20T23:59:59-03:00"),
      active: true,
    },
  });

  const semester = await prisma.semester.create({
    data: {
      academicYearId: academicYear.id,
      name: "2do Cuatrimestre 2026",
      startDate: new Date("2026-08-10T00:00:00-03:00"),
      endDate: new Date("2026-11-28T23:59:59-03:00"),
      status: "active",
    },
  });

  // 3. Materias Oficiales según Programas Analíticos de UCABA
  const asigNegocios = await prisma.subject.create({
    data: {
      semesterId: semester.id,
      name: "Administración de Negocios Digitales",
      code: "ASIG00123",
      professor: "Javier Monzón (javier.monzon@udelaciudad.edu.ar), Sergio Donzelli (sergio.donzelli@udelaciudad.edu.ar)",
      commission: "Escuela de Tecnologías e Industrias Digitales",
      description: "Modelos de negocio digitales, creación, entrega y captura de valor, planificación estratégica, análisis PESTLE y FODA, transformación digital de dos velocidades, marketing digital, analítica del comportamiento (Behavioral Analytics, CDP, CRM), eCommerce y tecnologías emergentes (Gartner Hype Cycle, Headless Commerce, GenAI). Régimen: 16 clases (11 virtuales sincrónicas por Zoom y 5 presenciales en sede). Promoción directa con promedio >= 7 (sin notas < 6 en los 2 parciales).",
      color: "#6366f1", // Indigo
      credits: 4,
      status: "active",
    },
  });

  const asigSistemas = await prisma.subject.create({
    data: {
      semesterId: semester.id,
      name: "Sistemas Digitales",
      code: "ASIG00124",
      professor: "Andrés Bondio, Gastón Escobar",
      commission: "Escuela de Tecnologías e Industrias Digitales",
      description: "Conceptos fundamentales de sistemas digitales, metodologías ágiles y OKRs, optimización de procesos BPM, hiper-automatización (RPA y LowCode), arquitectura de software y atributos de calidad, componentes de interfaz/negocio/persistencia, infraestructura tecnológica, virtualización, containers, microservicios, Cloud, Blockchain/DeFi, IA generativa, agentes de IA y Machine Learning (CNN, RNN, PLN). Evaluación: Un único examen presencial teórico-práctico (aprobación con 70% / nota 7) más evaluación integral de TPs (TP1 OKR/Arq, TP2 RPA).",
      color: "#10b981", // Emerald
      credits: 5,
      status: "active",
    },
  });

  const asigEmprendedurismo = await prisma.subject.create({
    data: {
      semesterId: semester.id,
      name: "Taller: Emprendedurismo en Innovación Digital",
      code: "ASIG00125",
      professor: "Juan Manuel Cottini, Tomás Foricher, Pedro Moneda, Bernardo Rshaid",
      commission: "Escuela de Tecnologías e Industrias Digitales",
      description: "Taller 100% presencial de desarrollo de proyectos de base tecnológica. Metodología Lean Startup (Eric Ries), Business Model Canvas (Osterwalder), análisis de mercado (TAM/SAM/SOM), metodologías ágiles (Scrum, Kanban, MVP, Design Thinking), finanzas básicas y evaluación de proyectos de inversión (VAN > 0 a tasa 30% y >= US$ 600.000, flujo de fondos, perpetuidad), oratoria, storytelling, pitch deck, aspectos legales y Venture Capital. Régimen de aprobación: 40% Parcial escrito (Unidades 1 a 5) + 60% Pitch Final individual ante jurado. Promoción directa con nota final ponderada >= 7.",
      color: "#f59e0b", // Amber
      credits: 4,
      status: "active",
    },
  });

  const asigTalento = await prisma.subject.create({
    data: {
      semesterId: semester.id,
      name: "Gestión del Talento Humano en la Industria Digital",
      code: "ASIG00205",
      professor: "Ignacio Sanguinetti, Bárbara Garattoni, Augusto Nucilli",
      commission: "Lic. en Tecnologías Digitales / Ciencia de Datos",
      description: "Objetivos estratégicos y operativos de la gestión del capital humano en el sector tecnológico. Filosofía y cultura organizacional, el área de CH como sistema y área de servicios, planeamiento estratégico de CH en PyMEs y startups tech, motivación, liderazgo, trabajo en equipo, Gestión por Objetivos (MBO), modelo de Gestión por Competencias (Martha Alles), subsistemas de reclutamiento tech, capacitación, evaluación de desempeño, compensaciones y salario emocional. Evaluación: 2 exámenes parciales presenciales obligatorios más Trabajo Integrador. Promoción directa con promedio >= 7 y notas >= 6.",
      color: "#ec4899", // Rose
      credits: 4,
      status: "active",
    },
  });

  // -------------------------------------------------------------
  // 4. CRONOGRAMA REAL DE CLASES: Pasadas (antes del 15-Sep) y Futuras (desde 16-Sep)
  // -------------------------------------------------------------
  const now = new Date("2026-09-15T19:51:00-03:00");

  // A) Administración de Negocios Digitales (Miércoles 18:30 a 21:30 hs)
  const cronoNegocios = [
    { num: 1, fecha: "2026-08-12", mod: "presencial", titulo: "Unidad 1: Introducción a los Negocios Digitales (Parte 1)" },
    { num: 2, fecha: "2026-08-19", mod: "virtual", titulo: "Unidad 1 y 2: Negocios Digitales (Parte 2) y Planificación Estratégica" },
    { num: 3, fecha: "2026-08-26", mod: "virtual", titulo: "Unidad 2 y 3: Planificación Estratégica y Análisis del Entorno Digital (PESTLE)" },
    { num: 4, fecha: "2026-09-02", mod: "virtual", titulo: "Unidad 4: Análisis de la Competencia Digital (FODA)" },
    { num: 5, fecha: "2026-09-09", mod: "presencial", titulo: "Introducción al Trabajo Práctico Grupal de Transformación Digital" },
    { num: 6, fecha: "2026-09-16", mod: "virtual", titulo: "Unidad 5: Transformación Digital (Dos Velocidades y Pilares de Valor)" }, // MAÑANA 18:30hs!
    { num: 7, fecha: "2026-09-23", mod: "virtual", titulo: "Invitado Transformación Digital y Unidad 6: El Nuevo Consumidor Digital" },
    { num: 8, fecha: "2026-09-30", mod: "virtual", titulo: "Unidad 7: Marketing Digital (Estrategias, Tácticas y Herramientas)" },
    { num: 9, fecha: "2026-10-07", mod: "virtual", titulo: "Unidad 8: Analítica Digital (Behavioral Analytics, CDP y CRM)" },
    { num: 10, fecha: "2026-10-14", mod: "presencial", titulo: "EVALUACIÓN PARCIAL 1 (Presencial)" },
    { num: 11, fecha: "2026-10-21", mod: "virtual", titulo: "Seguimiento del Trabajo Práctico Grupal" },
    { num: 12, fecha: "2026-10-28", mod: "virtual", titulo: "Inteligencia Artificial en Negocios Digitales" },
    { num: 13, fecha: "2026-11-04", mod: "virtual", titulo: "Unidad 9 y 10: eCommerce y Casos de Éxito / Tendencias" },
    { num: 14, fecha: "2026-11-11", mod: "presencial", titulo: "Entrega Final TP Escrito y Presentaciones Orales por Grupo (1/2) - Parcial 2" },
    { num: 15, fecha: "2026-11-18", mod: "presencial", titulo: "Presentaciones Orales Individuales por Grupo (2/2) - Parcial 2" },
    { num: 16, fecha: "2026-11-25", mod: "virtual", titulo: "Exámenes Recuperatorios" },
  ];

  for (const c of cronoNegocios) {
    const classDate = new Date(c.fecha + "T18:30:00-03:00");
    const isPast = classDate < now;
    await prisma.classSession.create({
      data: {
        subjectId: asigNegocios.id,
        title: `Clase ${c.num}: ${c.titulo}`,
        classNumber: c.num,
        date: classDate,
        startTime: "18:30",
        endTime: "21:30",
        modality: c.mod,
        location: c.mod === "presencial" ? "Sede UCABA" : "Campus Virtual Zoom",
        room: c.mod === "presencial" ? "Aula 204" : "Sala Zoom Sincrónica",
        attendanceStatus: isPast ? "attended" : "pending",
      },
    });
  }

  // B) Taller de Emprendedurismo en Innovación Digital (Lunes 18:30 a 21:30 hs - 100% Presencial)
  const cronoEmprendedurismo = [
    { num: 1, fecha: "2026-08-10", titulo: "Unidad 1: Introducción al Emprendedurismo, Mapa de Empatía, Propuesta de Valor Canvas y Elevator Pitch" },
    { num: 2, fecha: "2026-08-24", titulo: "Unidad 2: Propósito, Misión/Visión, FODA, PEST, Ciclo de Vida de la Industria, Matriz BCG y Modelo CANVAS" },
    { num: 3, fecha: "2026-08-31", titulo: "HITO 1: Evaluación de Propuesta de Valor CANVAS + Elevator Pitch" },
    { num: 4, fecha: "2026-09-07", titulo: "Unidad 3: Introducción al Marketing, 5 Fuerzas de Porter, Buyer Persona y Roles CUPID" },
    { num: 5, fecha: "2026-09-14", titulo: "Unidad 3: Mercado TAM, SAM, SOM, Marketing Mix (4P) y Estrategias de Pricing" },
    { num: 6, fecha: "2026-09-21", titulo: "Unidad 4: Desarrollo de Productos Digitales, Metodologías Ágiles vs Cascada, Kanban, Scrum, MVP y Design Thinking" }, // PRÓXIMO LUNES!
    { num: 7, fecha: "2026-09-28", titulo: "Unidad 5: Finanzas Básicas, Evaluación de Proyectos de Inversión, Factor de Descuento, VAN y Riesgo" },
    { num: 8, fecha: "2026-10-05", titulo: "PARCIAL ESCRITO PRESENCIAL (Unidades 1 a 5, 40% nota) + Taller Práctico de Cash Flow" },
    { num: 9, fecha: "2026-10-19", titulo: "Unidad 7 y HITO 2: Oratoria, Storytelling, Pitch Deck y Entrega de Avance del Plan de Negocios" },
    { num: 10, fecha: "2026-10-26", titulo: "Unidad 6 y 8: Aspectos Legales de Startups, Venture Capital, Rondas de Inversión y RECUPERATORIO 1er PARCIAL" },
    { num: 11, fecha: "2026-11-02", titulo: "HITO 3: Pitch Final ante Jurado (Defensa individual 5 min, 60% nota) + Entrega Plan de Negocios Final (1/3)" },
    { num: 12, fecha: "2026-11-09", titulo: "HITO 3: Pitch Final ante Jurado (2/3)" },
    { num: 13, fecha: "2026-11-16", titulo: "HITO 3: Pitch Final ante Jurado y Cierre de Cursada (3/3)" },
  ];

  for (const c of cronoEmprendedurismo) {
    const classDate = new Date(c.fecha + "T18:30:00-03:00");
    const isPast = classDate < now;
    await prisma.classSession.create({
      data: {
        subjectId: asigEmprendedurismo.id,
        title: `Clase ${c.num}: ${c.titulo}`,
        classNumber: c.num,
        date: classDate,
        startTime: "18:30",
        endTime: "21:30",
        modality: "presencial",
        location: "Sede UCABA - Escuela de Tecnologías",
        room: "Aula Magna 102",
        attendanceStatus: isPast ? "attended" : "pending",
      },
    });
  }

  // C) Sistemas Digitales (Jueves 18:30 a 21:30 hs)
  const cronoSistemas = [
    { num: 1, fecha: "2026-08-13", mod: "virtual", titulo: "Unidad 1 y 2: Transformación Digital Continua, Metodología OKR y ACT" },
    { num: 2, fecha: "2026-08-20", mod: "virtual", titulo: "Unidad 6: Arquitectura de Software, Atributos de Calidad y Principios de Diseño" },
    { num: 3, fecha: "2026-08-27", mod: "virtual", titulo: "Unidad 3: Transformación Digital y Automatización de Procesos (BPM - RPA)" },
    { num: 4, fecha: "2026-09-03", mod: "presencial", titulo: "Unidad 7 y 10: Blockchain, Presentación TP1 y Organización en Interfaz/Negocio/Persistencia" },
    { num: 5, fecha: "2026-09-10", mod: "virtual", titulo: "Unidad 5: Automation RPA - LowCode y Lanzamiento TP2 RPA" },
    { num: 6, fecha: "2026-09-17", mod: "virtual", titulo: "Unidad 8: Arquitectura Tecnológica - Frontend y Backend" }, // ESTE JUEVES!
    { num: 7, fecha: "2026-09-24", mod: "virtual", titulo: "Unidad 8: Infraestructura Tecnológica, Virtualización y Containers I" },
    { num: 8, fecha: "2026-10-01", mod: "virtual", titulo: "Unidad 11: Introducción a la Inteligencia Artificial, GenAI y Agentes de IA (Presentación TP2)" },
    { num: 9, fecha: "2026-10-08", mod: "virtual", titulo: "Unidad 8: Containers y Microservicios - Integración de Aplicaciones" },
    { num: 10, fecha: "2026-10-15", mod: "virtual", titulo: "Unidad 9: Arquitectura Tecnológica – Cloud (IaaS, PaaS, SaaS)" },
    { num: 11, fecha: "2026-10-22", mod: "presencial", titulo: "Unidad 11: Inteligencia Artificial - Agentes de IA, Tools, LLMs (Aplicación Práctica)" },
    { num: 12, fecha: "2026-10-29", mod: "virtual", titulo: "Unidad 12 y 13: Machine Learning - Algoritmos Supervisados/No Supervisados y Redes Neuronales" },
    { num: 13, fecha: "2026-11-05", mod: "virtual", titulo: "Cierre de TPs y Repaso Integral de Examen" },
    { num: 14, fecha: "2026-11-12", mod: "presencial", titulo: "EXAMEN PARCIAL PRESENCIAL (Unidades 1 a 13, nota mínima 7 para aprobar)" },
    { num: 15, fecha: "2026-11-19", mod: "virtual", titulo: "Feedback y Repaso de Examen Recuperatorio" },
    { num: 16, fecha: "2026-11-26", mod: "presencial", titulo: "Recuperatorio de Examen Presencial" },
  ];

  for (const c of cronoSistemas) {
    const classDate = new Date(c.fecha + "T18:30:00-03:00");
    const isPast = classDate < now;
    await prisma.classSession.create({
      data: {
        subjectId: asigSistemas.id,
        title: `Clase ${c.num}: ${c.titulo}`,
        classNumber: c.num,
        date: classDate,
        startTime: "18:30",
        endTime: "21:30",
        modality: c.mod,
        location: c.mod === "presencial" ? "Sede UCABA" : "Campus Virtual Zoom",
        room: c.mod === "presencial" ? "Laboratorio Digital 301" : "Sala Zoom Sincrónica",
        attendanceStatus: isPast ? "attended" : "pending",
      },
    });
  }

  // D) Gestión del Talento Humano en la Industria Digital (Miércoles 08:00 a 11:00 hs)
  const cronoTalento = [
    { num: 1, fecha: "2026-08-12", mod: "virtual", titulo: "Unidad 1: Presentación de la Asignatura y Foro de Presentación" },
    { num: 2, fecha: "2026-08-19", mod: "virtual", titulo: "Unidad 1: Filosofía y Cultura Organizacional. El rol del Gerente de Capital Humano" },
    { num: 3, fecha: "2026-08-26", mod: "virtual", titulo: "Unidad 2: Planeamiento del Capital Humano y Autoevaluación" },
    { num: 4, fecha: "2026-09-02", mod: "virtual", titulo: "Unidad 2: Gestión Estratégica del CH: FODA, RSE y Relación con el Empleo" },
    { num: 5, fecha: "2026-09-09", mod: "presencial", titulo: "Unidad 2: Gestión del CH en PyMEs, Empresas Familiares y Microempresas" },
    { num: 6, fecha: "2026-09-16", mod: "virtual", titulo: "Unidad 3: Paradigmas en la Gestión de CH: Motivación, Liderazgo y Comunicación" }, // MAÑANA 08:00hs!
    { num: 7, fecha: "2026-09-23", mod: "virtual", titulo: "Unidad 3: Comunicación Asertiva, Trabajo en Equipo y Gestión por Objetivos (MBO)" },
    { num: 8, fecha: "2026-09-30", mod: "virtual", titulo: "Unidad 3: Fidelización, Retención de Talentos y Modelo de Competencias" },
    { num: 9, fecha: "2026-10-07", mod: "presencial", titulo: "1ER EXAMEN PARCIAL OBLIGATORIO PRESENCIAL (Unidades 1, 2 y 3)" },
    { num: 10, fecha: "2026-10-14", mod: "virtual", titulo: "Unidad 3: Gestión por Competencias (Martha Alles) y Glosario Conductual" },
    { num: 11, fecha: "2026-10-21", mod: "virtual", titulo: "Unidad 4: Subsistema de CH: Descripción de Puestos, Selección y Reclutamiento Tech" },
    { num: 12, fecha: "2026-10-28", mod: "virtual", titulo: "Unidad 4: Capacitación, Formación y Métricas de Evaluación de Desempeño" },
    { num: 13, fecha: "2026-11-04", mod: "presencial", titulo: "Unidad 4: Políticas de Compensaciones, Beneficios y Salario Emocional" },
    { num: 14, fecha: "2026-11-11", mod: "virtual", titulo: "Unidad 4: Modalidades de Trabajo (Remoto/Híbrido), Negociación Laboral y Desvinculaciones" },
    { num: 15, fecha: "2026-11-18", mod: "presencial", titulo: "2DO EXAMEN PARCIAL OBLIGATORIO PRESENCIAL (Unidad 4 y Trabajo Integrador)" },
    { num: 16, fecha: "2026-11-25", mod: "presencial", titulo: "Recuperatorios y Cierre Académico del Curso" },
  ];

  for (const c of cronoTalento) {
    const classDate = new Date(c.fecha + "T08:00:00-03:00");
    const isPast = classDate < now;
    await prisma.classSession.create({
      data: {
        subjectId: asigTalento.id,
        title: `Clase ${c.num}: ${c.titulo}`,
        classNumber: c.num,
        date: classDate,
        startTime: "08:00",
        endTime: "11:00",
        modality: c.mod,
        location: c.mod === "presencial" ? "Sede UCABA" : "Campus Virtual Zoom",
        room: c.mod === "presencial" ? "Aula 108" : "Sala Zoom Sincrónica",
        attendanceStatus: isPast ? "attended" : "pending",
      },
    });
  }

  // -------------------------------------------------------------
  // 5. TEMAS OFICIALES Y NIVELES DE DOMINIO SEGÚN PROGRAMAS
  // -------------------------------------------------------------
  // Taller de Emprendedurismo (Examen en 20 días: 5 de Octubre)
  const topicCanv = await prisma.topic.create({
    data: {
      subjectId: asigEmprendedurismo.id,
      name: "Modelo Business Model Canvas y Propuesta de Valor",
      description: "Los 9 bloques de Osterwalder, mapa de empatía y diseño de propuesta de valor en startups digitales.",
      importance: "critical",
      masteryScore: 82, // Dominado
      lastReviewedAt: new Date("2026-09-13T10:00:00-03:00"),
      nextReviewAt: new Date("2026-09-19T00:00:00-03:00"),
    },
  });

  const topicFinanzas = await prisma.topic.create({
    data: {
      subjectId: asigEmprendedurismo.id,
      name: "Finanzas Básicas y Evaluación de Proyectos (VAN y Flujo de Fondos)",
      description: "Valor del dinero en el tiempo, factor de descuento, tasa del 30%, cálculo de VAN >= US$ 600.000 y perpetuidad.",
      importance: "critical",
      masteryScore: 46, // Débil / En desarrollo -> Requiere estudio prioritario para el parcial
      lastReviewedAt: new Date("2026-09-11T16:00:00-03:00"),
      nextReviewAt: now, // Vencido hoy 15 de septiembre!
    },
  });

  const topicMercado = await prisma.topic.create({
    data: {
      subjectId: asigEmprendedurismo.id,
      name: "Dimensionamiento de Mercado: TAM, SAM y SOM",
      description: "Metodologías top-down y bottom-up, buyer persona, variables de segmentación CUPID y pricing.",
      importance: "high",
      masteryScore: 68, // Bueno
      lastReviewedAt: new Date("2026-09-14T19:00:00-03:00"),
      nextReviewAt: new Date("2026-09-17T00:00:00-03:00"),
    },
  });

  const topicAgiles = await prisma.topic.create({
    data: {
      subjectId: asigEmprendedurismo.id,
      name: "Desarrollo de Productos Digitales: Ágiles vs Cascada, MVP y Design Thinking",
      description: "Kanban, Scrum, definición de Producto Mínimo Viable (Eric Ries) y validación de hipótesis.",
      importance: "critical",
      masteryScore: 55, // Tema de la próxima clase del lunes 21-Sep
      lastReviewedAt: new Date("2026-09-10T12:00:00-03:00"),
      nextReviewAt: now,
    },
  });

  // Administración de Negocios Digitales
  const topicPestleFoda = await prisma.topic.create({
    data: {
      subjectId: asigNegocios.id,
      name: "Planificación Estratégica: Análisis PESTLE y FODA Digital",
      description: "Prioridades estratégicas, entorno macro y competitivo en ecosistemas digitales.",
      importance: "high",
      masteryScore: 74,
      lastReviewedAt: new Date("2026-09-12T14:00:00-03:00"),
      nextReviewAt: new Date("2026-09-18T00:00:00-03:00"),
    },
  });

  const topicTransfDigital = await prisma.topic.create({
    data: {
      subjectId: asigNegocios.id,
      name: "Transformación Digital: Modelo de Dos Velocidades y Creación de Valor",
      description: "Pilares de transformación (Creación, Entrega y Captura de valor), OKRs y KPIs de negocio. Tema de la clase 6 (mañana 16-Sep).",
      importance: "critical",
      masteryScore: 50,
      lastReviewedAt: new Date("2026-09-09T20:00:00-03:00"),
      nextReviewAt: now,
    },
  });

  const topicAnalytics = await prisma.topic.create({
    data: {
      subjectId: asigNegocios.id,
      name: "Analítica Digital: Behavioral Analytics, CDP y CRM",
      description: "Métricas de comportamiento del consumidor digital, plataformas de datos de cliente y optimización del embudo.",
      importance: "high",
      masteryScore: 40,
      lastReviewedAt: null,
      nextReviewAt: new Date("2026-09-20T00:00:00-03:00"),
    },
  });

  // Sistemas Digitales
  const topicArqSW = await prisma.topic.create({
    data: {
      subjectId: asigSistemas.id,
      name: "Arquitectura de Software y Atributos de Calidad",
      description: "Definición de Len Bass, escalabilidad, disponibilidad, modificabilidad, separación interfaz/negocio/persistencia.",
      importance: "critical",
      masteryScore: 76,
      lastReviewedAt: new Date("2026-09-13T18:00:00-03:00"),
      nextReviewAt: new Date("2026-09-22T00:00:00-03:00"),
    },
  });

  const topicBpmRpa = await prisma.topic.create({
    data: {
      subjectId: asigSistemas.id,
      name: "Optimización de Procesos: BPM y RPA (Hiper-automatización)",
      description: "Etapas de modelado, bots asistidos y desatendidos, plataformas LowCode y aplicación de TP2.",
      importance: "critical",
      masteryScore: 60,
      lastReviewedAt: new Date("2026-09-10T21:00:00-03:00"),
      nextReviewAt: now,
    },
  });

  const topicContainersCloud = await prisma.topic.create({
    data: {
      subjectId: asigSistemas.id,
      name: "Infraestructura, Containers y Arquitectura Cloud (IaaS, PaaS, SaaS)",
      description: "Virtualización, microservicios, Docker, Kubernetes y modelos de servicio en la nube.",
      importance: "high",
      masteryScore: 45,
      lastReviewedAt: null,
      nextReviewAt: new Date("2026-09-24T00:00:00-03:00"),
    },
  });

  // Gestión del Talento Humano
  const topicCulturaCH = await prisma.topic.create({
    data: {
      subjectId: asigTalento.id,
      name: "Filosofía Organizacional y el Área de CH como Sistema de Servicios",
      description: "Misión, visión, valores, integración horizontal y vertical, FODA de RRHH y PyMEs tecnológicas.",
      importance: "high",
      masteryScore: 80,
      lastReviewedAt: new Date("2026-09-12T10:00:00-03:00"),
      nextReviewAt: new Date("2026-09-21T00:00:00-03:00"),
    },
  });

  const topicLiderazgoCH = await prisma.topic.create({
    data: {
      subjectId: asigTalento.id,
      name: "Paradigmas de Gestión: Motivación, Liderazgo y Trabajo en Equipo Tech",
      description: "Teorías de liderazgo situacional, gestión por objetivos (MBO) y comunicación asertiva. Tema de la clase 6 (mañana 16-Sep 8hs).",
      importance: "critical",
      masteryScore: 52,
      lastReviewedAt: new Date("2026-09-08T11:00:00-03:00"),
      nextReviewAt: now,
    },
  });

  const topicCompetenciasAlles = await prisma.topic.create({
    data: {
      subjectId: asigTalento.id,
      name: "Modelo de Gestión por Competencias (Martha Alles)",
      description: "Glosario conductual, competencias por nivel y puesto, evaluación de desempeño y reclutamiento IT.",
      importance: "critical",
      masteryScore: 58,
      lastReviewedAt: new Date("2026-09-07T12:00:00-03:00"),
      nextReviewAt: now,
    },
  });

  // -------------------------------------------------------------
  // 6. MATERIALES DE ESTUDIO OFICIALES Y RESÚMENES ESTRUCTURADOS
  // -------------------------------------------------------------
  const matEmprende = await prisma.material.create({
    data: {
      subjectId: asigEmprendedurismo.id,
      fileName: "Taller_Emprendedurismo_Programa_y_Guia_Financiera_VAN.pdf",
      fileType: "application/pdf",
      fileSize: 3420000,
      storagePath: "uploads/materials/Taller_Emprendedurismo_Programa_y_Guia_Financiera_VAN.pdf",
      processingStatus: "completed",
      extractedText: "Programa oficial de Taller de Emprendedurismo en Innovación Digital (UCABA). Criterio de viabilidad financiera de proyectos: VAN > 0 con tasa de descuento del 30% anual y VAN resultante mayor o igual a US$ 600.000. Proyecto grupal de 5 integrantes. El parcial presencial (Unidades 1 a 5) pondera 40% y el Pitch Final individual ante jurado pondera 60%. Promoción directa con promedio 7 sin notas menores a 6.",
    },
  });

  await prisma.summary.create({
    data: {
      materialId: matEmprende.id,
      title: "Guía de Evaluación Financiera (VAN) y Régimen de Aprobación de Emprendedurismo",
      overview: "Este documento sintetiza las exigencias financieras y el régimen de promoción del Taller de Emprendedurismo en Innovación Digital de UCABA. Detalla la formulación matemática del Valor Actual Neto (VAN), la tasa de corte ajustada por riesgo argentino (30%) y el umbral de viabilidad (US$ 600.000).",
      detailedSummary: `### 1. Requisitos de Viabilidad del Proyecto
Para superar la evaluación del jurado y del equipo docente (Cottini, Foricher, Moneda, Rshaid), el proyecto grupal (5 integrantes) debe satisfacer:
- **Viabilidad Económico-Financiera:** VAN > 0 calculado a una tasa del 30% anual, debiendo alcanzar o superar los **US$ 600.000**.
- **Viabilidad Comercial:** Justificación rigurosa de TAM, SAM y SOM con estrategia de monetización y canales.
- **Restricción Excluyente:** No se permite tener como proveedor o cliente a entidades gubernamentales.

### 2. Régimen de Calificación y Promoción
- **Parcial Escrito Presencial (Unidades 1 a 5):** Ponderación del **40%**. Opción múltiple y Verdadero/Falso.
- **Pitch Final Individual ante Jurado:** Ponderación del **60%** (incluye defensa individual en ronda de preguntas).
- **Condición de Promoción:** Nota ponderada final entre **7 y 10** (sin final escrito).
- **Aprobación de Cursada:** Nota entre 4 y 6,99 (rinde examen final escrito). Con menos de 4, recursa.`,
      simplifiedExplanation: "El VAN nos dice si los dólares futuros que generará tu startup traídos al día de hoy cubren con creces la inversión inicial y el costo de oportunidad del dinero. En este taller, la cátedra exige que tu proyecto demuestre generar al menos US$ 600.000 de valor neto a una tasa del 30%.",
      keyPointsJson: JSON.stringify([
        "El VAN debe ser estrictamente positivo a una tasa del 30% y superar los US$ 600.000.",
        "La nota de cursada pondera 40% el Parcial escrito (05/10) y 60% el Pitch Final (02/11 a 16/11).",
        "Con promedio 7 o superior se promociona directamente sin rendir examen final escrito.",
        "El Hito 2 exige entrega del Plan de Negocios integrado y Pre-Pitch el 19 de octubre.",
      ]),
      definitionsJson: JSON.stringify([
        { term: "Valor Actual Neto (VAN)", definition: "Diferencia entre el valor de mercado de una inversión y su costo. Mide el valor en moneda de hoy que el proyecto añade a los accionistas." },
        { term: "Tasa de Descuento (30%)", definition: "Tasa mínima de rendimiento requerida para compensar el costo del capital y el riesgo país del ecosistema tecnológico local." },
      ]),
      aiModel: "gpt-4o-mini",
      version: 1,
    },
  });

  // -------------------------------------------------------------
  // 7. FLASHCARDS SM-2 (Curva de Olvido adaptada al 15 de Septiembre)
  // -------------------------------------------------------------
  await prisma.flashcard.createMany({
    data: [
      {
        subjectId: asigEmprendedurismo.id,
        topicId: topicFinanzas.id,
        front: "¿Cuáles son las dos condiciones financieras numéricas obligatorias para el proyecto en Emprendedurismo?",
        back: "1. VAN > 0 calculado a una tasa de descuento del 30% anual.\n2. VAN resultante mayor o igual a US$ 600.000.",
        difficulty: "hard",
        easeFactor: 2.1,
        interval: 1,
        repetitions: 1,
        nextReviewAt: now, // Pendiente para hoy!
      },
      {
        subjectId: asigEmprendedurismo.id,
        topicId: topicFinanzas.id,
        front: "¿Cómo se compone la nota final de cursada en Taller de Emprendedurismo?",
        back: "Nota de cursada = (Parcial escrito × 40%) + (Pitch Final individual ante jurado × 60%). Se promociona con 7 a 10.",
        difficulty: "medium",
        easeFactor: 2.5,
        interval: 1,
        repetitions: 2,
        nextReviewAt: now,
      },
      {
        subjectId: asigNegocios.id,
        topicId: topicTransfDigital.id,
        front: "¿Cuáles son los 3 pilares del valor en un modelo de negocio digital según el programa de Negocios Digitales?",
        back: "1. Creación de Valor Digital (resolver el dolor del cliente).\n2. Entrega de Valor Digital (canales y experiencia).\n3. Captura de Valor Digital (monetización y retorno).",
        difficulty: "medium",
        easeFactor: 2.4,
        interval: 1,
        repetitions: 1,
        nextReviewAt: now,
      },
      {
        subjectId: asigTalento.id,
        topicId: topicLiderazgoCH.id,
        front: "¿Qué plantea la Gestión por Objetivos (MBO) en el management de equipos de tecnología?",
        back: "Alineación de metas individuales y de equipo con los objetivos estratégicos de la empresa, evaluando el desempeño por resultados verificables y no por mera presencia física.",
        difficulty: "easy",
        easeFactor: 2.7,
        interval: 2,
        repetitions: 2,
        nextReviewAt: now,
      },
      {
        subjectId: asigSistemas.id,
        topicId: topicBpmRpa.id,
        front: "¿Cuál es el criterio de aprobación y calificación del examen parcial de Sistemas Digitales?",
        back: "Examen único presencial teórico-práctico. Se aprueba alcanzando como mínimo el 70% de respuestas correctas (nota 7 sobre 10).",
        difficulty: "medium",
        easeFactor: 2.5,
        interval: 3,
        repetitions: 2,
        nextReviewAt: new Date("2026-09-18T00:00:00-03:00"),
      },
    ],
  });

  // -------------------------------------------------------------
  // 8. BANCO DE PREGUNTAS DE EXAMEN (Basadas en los programas oficiales)
  // -------------------------------------------------------------
  await prisma.question.createMany({
    data: [
      {
        subjectId: asigEmprendedurismo.id,
        topicId: topicFinanzas.id,
        question: "En el régimen del Taller de Emprendedurismo, un estudiante obtiene 8 en el Parcial Escrito y 7 en su defensa individual del Pitch Final. ¿Cuál es su situación académica final?",
        optionsJson: JSON.stringify([
          "Promociona la materia con nota final 7.40 (eximido del examen final escrito).",
          "Aprueba la cursada pero debe rendir examen final escrito presencial.",
          "Debe recursar la materia por no alcanzar 8 en el Pitch Final.",
          "Debe rendir el recuperatorio del primer parcial.",
        ]),
        answer: "Promociona la materia con nota final 7.40 (eximido del examen final escrito).",
        explanation: "Nota = (8 × 0.40) + (7 × 0.60) = 3.20 + 4.20 = 7.40. Al ser mayor o igual a 7 y sin notas individuales menores a 6, promociona directamente.",
        difficulty: "medium",
        type: "multiple_choice",
      },
      {
        subjectId: asigNegocios.id,
        topicId: topicTransfDigital.id,
        question: "Verdadero o Falso: En la planificación estratégica digital, el concepto de 'dos velocidades' implica sostener la estabilidad operativa del core tradicional mientras se acelera la innovación ágil en nuevos canales.",
        optionsJson: JSON.stringify(["Verdadero", "Falso"]),
        answer: "Verdadero",
        explanation: "La arquitectura y gestión de dos velocidades permite no poner en riesgo la continuidad operativa de la empresa mientras se experimenta a alta velocidad en el frente digital.",
        difficulty: "easy",
        type: "true_false",
      },
      {
        subjectId: asigSistemas.id,
        topicId: topicArqSW.id,
        question: "Según la bibliografía obligatoria de Len Bass ('Software Architecture in Practice'), ¿qué elemento define primordialmente a una Arquitectura de Software?",
        optionsJson: JSON.stringify([
          "El conjunto de estructuras necesarias para razonar sobre el sistema, compuestas por elementos de software, relaciones y propiedades.",
          "El lenguaje de programación y la base de datos SQL elegida para la persistencia.",
          "El diagrama de clases de diseño detallado de cada submódulo.",
          "La configuración física de servidores y cables en el centro de datos.",
        ]),
        answer: "El conjunto de estructuras necesarias para razonar sobre el sistema, compuestas por elementos de software, relaciones y propiedades.",
        explanation: "Len Bass define la arquitectura como el conjunto de estructuras que permiten evaluar atributos de calidad y tomar decisiones de diseño de alto nivel.",
        difficulty: "hard",
        type: "multiple_choice",
      },
    ],
  });

  // -------------------------------------------------------------
  // 9. EXÁMENES OFICIALES CALENDARIZADOS
  // -------------------------------------------------------------
  // Examen 1: Taller de Emprendedurismo - 05/10/2026 (En 20 días)
  const examEmprende = await prisma.exam.create({
    data: {
      subjectId: asigEmprendedurismo.id,
      title: "Parcial Escrito Presencial (Unidades 1 a 5)",
      examType: "midterm",
      date: new Date("2026-10-05T18:30:00-03:00"),
      startTime: "18:30",
      location: "Sede UCABA",
      room: "Aula Magna 102",
      notes: "Evaluación escrita obligatoria individual (Multiple Choice y Verdadero/Falso). Pondera el 40% de la nota de cursada. Temas: Lean Startup, Canvas, TAM/SAM/SOM, Metodologías Ágiles y VAN.",
      status: "upcoming",
    },
  });

  await prisma.examTopic.createMany({
    data: [
      { examId: examEmprende.id, topicId: topicCanv.id },
      { examId: examEmprende.id, topicId: topicFinanzas.id },
      { examId: examEmprende.id, topicId: topicMercado.id },
      { examId: examEmprende.id, topicId: topicAgiles.id },
    ],
  });

  const planEmprende = [
    { title: "Consolidación de Canvas y Mapa de Empatía (Unidad 1 y 2)", offset: 0, comp: true },
    { title: "Práctica intensiva de dimensionamiento de mercado TAM/SAM/SOM (Unidad 3)", offset: 4, comp: false },
    { title: "Taller de ejercitación de cálculo de VAN a tasa 30% y Cash Flow (Unidad 5)", offset: 8, comp: false },
    { title: "Repaso de Metodologías Ágiles Scrum vs Cascada y MVP (Unidad 4)", offset: 12, comp: false },
    { title: "Simulacro cronometrado de examen escrito con preguntas teóricas y numéricas", offset: 16, comp: false },
    { title: "Repaso ligero de fórmulas y descanso previo al parcial", offset: 19, comp: false },
  ];

  for (let i = 0; i < planEmprende.length; i++) {
    const scheduled = new Date(now.getTime() + planEmprende[i].offset * 24 * 60 * 60 * 1000);
    await prisma.preparationPlanItem.create({
      data: {
        examId: examEmprende.id,
        scheduledDate: scheduled,
        title: planEmprende[i].title,
        completed: planEmprende[i].comp,
        order: i + 1,
      },
    });
  }

  // Examen 2: Gestión del Talento Humano - 07/10/2026 (En 22 días)
  const examTalento = await prisma.exam.create({
    data: {
      subjectId: asigTalento.id,
      title: "1er Examen Parcial Presencial Obligatorio",
      examType: "midterm",
      date: new Date("2026-10-07T08:00:00-03:00"),
      startTime: "08:00",
      location: "Sede UCABA",
      room: "Aula 108",
      notes: "Examen presencial individual. Contenidos de Unidades 1, 2 y 3 (Cultura, Planeamiento de CH, Liderazgo, Motivación y Competencias).",
      status: "upcoming",
    },
  });

  await prisma.examTopic.createMany({
    data: [
      { examId: examTalento.id, topicId: topicCulturaCH.id },
      { examId: examTalento.id, topicId: topicLiderazgoCH.id },
      { examId: examTalento.id, topicId: topicCompetenciasAlles.id },
    ],
  });

  // Examen 3: Administración de Negocios Digitales - 14/10/2026 (En 29 días)
  await prisma.exam.create({
    data: {
      subjectId: asigNegocios.id,
      title: "Evaluación Parcial 1 Presencial",
      examType: "midterm",
      date: new Date("2026-10-14T18:30:00-03:00"),
      startTime: "18:30",
      location: "Sede UCABA",
      room: "Aula 204",
      notes: "Evaluación escrita individual sobre Unidades 1 a 4 (Negocios Digitales, Planificación Estratégica, PESTLE y FODA).",
      status: "upcoming",
    },
  });

  // Examen 4: Sistemas Digitales - 12/11/2026
  await prisma.exam.create({
    data: {
      subjectId: asigSistemas.id,
      title: "Examen Parcial Presencial Integrador (Unidades 1 a 13)",
      examType: "midterm",
      date: new Date("2026-11-12T18:30:00-03:00"),
      startTime: "18:30",
      location: "Sede UCABA",
      room: "Laboratorio Digital 301",
      notes: "Examen único individual teórico-práctico. Exige calificación mínima de 7 (70% de respuestas correctas) para aprobar.",
      status: "upcoming",
    },
  });

  // -------------------------------------------------------------
  // 10. TRABAJOS PRÁCTICOS Y ENTREGAS PROGRAMADAS
  // -------------------------------------------------------------
  await prisma.assignment.createMany({
    data: [
      {
        subjectId: asigEmprendedurismo.id,
        title: "Hito 2: Avance del Plan de Negocios y Pre-Pitch",
        description: "Modelo CANVAS integrado, problema, solución validada con MVP, estimación de mercado TAM/SAM/SOM y proyección preliminar de Cash Flow.",
        dueDate: new Date("2026-10-19T18:30:00-03:00"),
        priority: "urgent",
        status: "in_progress",
      },
      {
        subjectId: asigSistemas.id,
        title: "TP 2: Aplicación Conceptual de RPA en Procesos de Negocio",
        description: "Identificación de caso de negocio, modelado en BPMN y diseño de automatización con bots de RPA en plataforma LowCode.",
        dueDate: new Date("2026-10-01T21:30:00-03:00"),
        priority: "high",
        status: "in_progress",
      },
      {
        subjectId: asigNegocios.id,
        title: "Trabajo Práctico Grupal: Diagnóstico de Transformación Digital",
        description: "Análisis de empresa tradicional, propuesta de valor digital y diseño de arquitectura empresarial (negocios, datos, personas, tecnología).",
        dueDate: new Date("2026-11-11T18:30:00-03:00"),
        priority: "medium",
        status: "todo",
      },
      {
        subjectId: asigTalento.id,
        title: "Estudio de Caso: Plan de Atracción y Salario Emocional",
        description: "Diseño de estrategia de reclutamiento y políticas de retención para equipo de desarrolladores y data engineers.",
        dueDate: new Date("2026-10-21T08:00:00-03:00"),
        priority: "medium",
        status: "todo",
      },
    ],
  });

  // -------------------------------------------------------------
  // 11. NOTIFICACIONES COHERENTES CON EL 15 DE SEPTIEMBRE
  // -------------------------------------------------------------
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        type: "presencial_warning",
        title: "Próxima Clase Presencial: Lunes 21 de Septiembre",
        message: "Tienes clase presencial de Taller de Emprendedurismo a las 18:30 hs en Aula Magna 102 (Sede UCABA). Tema: Metodologías Ágiles y MVP.",
        actionUrl: `/subjects/${asigEmprendedurismo.id}`,
      },
      {
        userId: user.id,
        type: "exam_countdown",
        title: "Parcial de Emprendedurismo en 20 días",
        message: "El examen presencial de Unidades 1 a 5 (CANVAS, VAN, Mercado, Ágiles) se rinde el 5 de octubre a las 18:30 hs.",
        actionUrl: `/exams/${examEmprende.id}`,
      },
      {
        userId: user.id,
        type: "review_due",
        title: "Repasos para hoy (15 de Septiembre)",
        message: "Tienes 4 flashcards del tema Finanzas y Tasa de Descuento (VAN) listas para consolidar en el algoritmo SM-2.",
        actionUrl: "/reviews",
      },
    ],
  });

  console.log("✅ Base de datos de Kanri 100% alineada con los programas analíticos de UCABA al 15 de Septiembre de 2026.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding UCABA programs:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
