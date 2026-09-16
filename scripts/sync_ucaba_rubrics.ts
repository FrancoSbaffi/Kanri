import prisma from "../lib/db/prisma";

async function syncUcabaRubrics() {
  console.log("🏛️ Sincronizando Rúbricas Oficiales de UCABA y todas las instancias evaluativas...");

  const subjects = await prisma.subject.findMany({
    include: {
      exams: {
        include: {
          topics: true,
          planItems: true,
        },
      },
      topics: true,
      questions: true,
    },
  });

  const now = new Date("2026-09-16T18:35:00-03:00");

  for (const subject of subjects) {
    const sName = subject.name.toLowerCase();

    // -------------------------------------------------------------
    // 1. TALLER DE EMPRENDEDURISMO EN INNOVACIÓN DIGITAL
    // -------------------------------------------------------------
    if (sName.includes("emprendedurismo") || sName.includes("taller")) {
      console.log(`\n📦 Procesando: ${subject.name}`);

      // Instancia 1: Parcial Escrito Presencial (40%)
      let exam1: any = subject.exams.find((e) => e.title.includes("Parcial Escrito"));
      const rubricNotesExam1 = JSON.stringify({
        institution: "Universidad de la Ciudad de Buenos Aires (UCABA)",
        career: "Licenciatura en Tecnologías Digitales",
        instanceType: "Parcial Escrito Presencial",
        weightPercentage: 40,
        passingGrade: 4,
        promotionGrade: 7,
        minGradePerInstance: 6,
        gradingScale: "1 a 10 (Aprobación con 60% / Nota 4)",
        format: "Individual escrito presencial. Preguntas múltiple opción conceptuales, Verdadero/Falso con fundamentación rigurosa y casos numéricos breves.",
        professors: "Juan Manuel Cottini, Tomás Foricher, Pedro Moneda, Bernardo Rshaid",
        evaluatedScope: "Unidades 1 a 5 (Lean Startup, Canvas, TAM/SAM/SOM, Metodologías Ágiles, Evaluación Financiera VAN a tasa 30%)",
        keyCriteria: [
          "Definición y aplicación del Business Model Canvas y Mapa de Empatía.",
          "Cálculo y justificación de mercado: TAM (Total Addressable Market), SAM (Serviceable Addressable Market) y SOM (Serviceable Obtainable Market).",
          "Diferenciación conceptual entre Metodologías Ágiles (Scrum, Kanban, sprints, MVP) y modelo en cascada tradicional.",
          "Formulación matemática del Valor Actual Neto (VAN), tasa de descuento del 30% anual y umbral de viabilidad de US$ 600.000.",
          "Evaluación de clientes y canales mediante roles CUPID y las 4P del Marketing Mix.",
        ],
      });

      if (exam1) {
        await prisma.exam.update({
          where: { id: exam1.id },
          data: {
            notes: rubricNotesExam1,
            room: "Aula Magna 102",
            location: "Sede Central UCABA",
          },
        });
      }

      // Instancia 2: Pitch Final Individual ante Jurado (60%)
      let exam2: any = subject.exams.find((e) => e.title.includes("Pitch Final"));
      const rubricNotesExam2 = JSON.stringify({
        institution: "Universidad de la Ciudad de Buenos Aires (UCABA)",
        career: "Licenciatura en Tecnologías Digitales",
        instanceType: "Defensa Oral Individual de Pitch ante Jurado",
        weightPercentage: 60,
        passingGrade: 4,
        promotionGrade: 7,
        minGradePerInstance: 6,
        gradingScale: "1 a 10 (Calificación individual por jurado de cátedra)",
        format: "Exposición oral individual de 5 minutos apoyada en Pitch Deck oficial + ronda de 5 a 10 minutos de preguntas técnicas del jurado.",
        professors: "Juan Manuel Cottini, Tomás Foricher, Pedro Moneda, Bernardo Rshaid",
        evaluatedScope: "Unidades 1 a 8 (Plan de Negocios Completo, Storytelling, Tracción del MVP, Finanzas VAN >= US$ 600k, Estructura Legal y VC)",
        keyCriteria: [
          "Oratoria y Storytelling: Estructura clara en 5 fases (Gancho, Problema validado, Solución MVP, Modelo de Negocio, Llamado a la Acción).",
          "Viabilidad Financiera Ineludible: VAN > 0 calculado al 30% anual y VAN >= US$ 600.000 con flujo de fondos justificado a perpetuidad.",
          "Restricción Excluyente: Proyecto no puede tener al Estado como cliente o proveedor primario.",
          "Solvencia en Defensa Individual: Capacidad de respuesta técnica ante objeciones del jurado sobre CAC, LTV y canales.",
          "Nota Ponderada de Cursada: (Parcial Escrito x 0.40) + (Pitch Final x 0.60). Promoción directa con promedio >= 7.00.",
        ],
      });

      if (!exam2) {
        exam2 = await prisma.exam.create({
          data: {
            subjectId: subject.id,
            title: "Pitch Final Individual ante Jurado (Hito 3 - 60% Cursada)",
            examType: "final",
            date: new Date("2026-11-02T18:30:00-03:00"),
            startTime: "18:30",
            location: "Sede Central UCABA",
            room: "Aula Magna 102",
            notes: rubricNotesExam2,
            status: "upcoming",
          },
        });
        console.log(`  ➕ Creada instancia: ${exam2.title}`);

        // Plan items para el pitch
        const pitchPlan = [
          { title: "Definición del guión de Storytelling y estructura de 5 minutos", offset: 25, comp: false },
          { title: "Diseño visual de diapositivas del Pitch Deck (10 slides canónicas)", offset: 35, comp: false },
          { title: "Validación de métricas financieras (VAN > US$ 600.000 y tasa 30%)", offset: 40, comp: false },
          { title: "Ensayo cronometrado individual de oratoria y modulación de voz", offset: 44, comp: false },
          { title: "Simulacro de preguntas y respuestas técnicas del jurado", offset: 46, comp: false },
        ];
        for (let i = 0; i < pitchPlan.length; i++) {
          await prisma.preparationPlanItem.create({
            data: {
              examId: exam2.id,
              title: pitchPlan[i].title,
              scheduledDate: new Date(now.getTime() + pitchPlan[i].offset * 24 * 60 * 60 * 1000),
              completed: pitchPlan[i].comp,
              order: i + 1,
            },
          });
        }
      } else {
        await prisma.exam.update({
          where: { id: exam2.id },
          data: { notes: rubricNotesExam2 },
        });
      }

      // Vincular todos los topics existentes al examen 1
      for (const t of subject.topics) {
        const exists = await prisma.examTopic.findFirst({
          where: { examId: exam1!.id, topicId: t.id },
        });
        if (!exists) {
          await prisma.examTopic.create({
            data: { examId: exam1!.id, topicId: t.id },
          });
        }
      }
    }

    // -------------------------------------------------------------
    // 2. SISTEMAS DIGITALES
    // -------------------------------------------------------------
    if (sName.includes("sistemas")) {
      console.log(`\n📦 Procesando: ${subject.name}`);

      let exam = subject.exams.find((e) => e.title.includes("Integrador"));
      const rubricNotesSistemas = JSON.stringify({
        institution: "Universidad de la Ciudad de Buenos Aires (UCABA)",
        career: "Licenciatura en Tecnologías Digitales",
        instanceType: "Examen Parcial Presencial Integrador Teórico-Práctico",
        weightPercentage: 70,
        passingGrade: 7,
        promotionGrade: 7,
        minGradePerInstance: 7,
        gradingScale: "1 a 10 (Aprobación estricta de cátedra con 70% / Nota 7)",
        format: "Examen individual presencial teórico-práctico en Laboratorio Digital. Comprende resolución de casos de arquitectura, diseño de escenarios de calidad SEI, análisis de viabilidad RPA/BPM y fundamentos de Blockchain/DeFi.",
        professors: "Andrés Bondio, Gastón Escobar",
        evaluatedScope: "Unidades 1 a 13 (OKRs, Metodología ACT, Arquitectura de Software SEI Bass, Atributos de Calidad, Escenarios de 6 partes, RPA/BPM, Blockchain, Smart Contracts, DeFi, Containers, Cloud e IA)",
        keyCriteria: [
          "Regla de Aprobación de Cátedra: Requiere responder y resolver correctamente como mínimo el 70% del examen (calificación 7 sobre 10) para aprobar.",
          "Metodología OKR (Grove & Doerr): Formulación de Objetivos cualitativos y Key Results medibles, distinción con KPIs operativos y ciclos trimestrales.",
          "Arquitectura de Software (IEEE Std 1471 / Bass): Especificación canónica de Escenarios de Calidad con las 6 partes (Fuente, Estímulo, Entorno, Artefacto, Respuesta, Medida de la respuesta).",
          "Atributos de Calidad y Tácticas: Trade-offs entre Disponibilidad, Rendimiento, Modificabilidad, Seguridad y Testabilidad.",
          "Automatización Robótica de Procesos (RPA): Criterios de viabilidad (reglas fijas, alto volumen, datos estructurados, baja excepción), arquitectura Studio/Robot/Orquestador.",
          "Blockchain & DeFi: Funciones hash SHA-256, inmutabilidad, EVM, Smart Contracts, Pools de Liquidez AMM y sobrecolateralización en protocolos DeFi.",
          "Acreditación de Trabajos Prácticos: TP1 (Arquitectura y OKR) y TP2 (Automatización de Procesos RPA en LowCode) con entrega aprobada obligatoria.",
        ],
      });

      if (exam) {
        await prisma.exam.update({
          where: { id: exam.id },
          data: {
            notes: rubricNotesSistemas,
            room: "Laboratorio Digital 301",
            location: "Sede Central UCABA",
          },
        });

        // Asegurar que todos los topics de Sistemas están asociados al Examen
        for (const t of subject.topics) {
          const exists = await prisma.examTopic.findFirst({
            where: { examId: exam.id, topicId: t.id },
          });
          if (!exists) {
            await prisma.examTopic.create({
              data: { examId: exam.id, topicId: t.id },
            });
          }
        }
      }

      // Agregar 4 preguntas adicionales de cátedra para completar 12 preguntas de práctica
      const additionalSistemasQuestions = [
        {
          question: "En el diseño de una arquitectura de software según Len Bass, ¿cuál es una táctica arquitectónica canónica para el atributo de DISPONIBILIDAD clasificada como 'Detección de Fallas'?",
          options: [
            "Ping / Echo (Heartbeat periódico entre componentes para verificar estado de vida)",
            "Cifrado de datos en tránsito mediante TLS 1.3",
            "Uso de un intermediario / Message Broker para desacoplar productores de consumidores",
            "Particionamiento de bases de datos mediante Sharding horizontal"
          ],
          answer: "Ping / Echo (Heartbeat periódico entre componentes para verificar estado de vida)",
          explanation: "Bass clasifica las tácticas de Disponibilidad en Detección (Ping/Echo, Heartbeat, Excepciones), Recuperación (Redundancia activa/pasiva, Rollback) y Prevención (Remoción de servicio).",
          difficulty: "hard",
          type: "multiple_choice"
        },
        {
          question: "¿Cuál de las siguientes situaciones representa la violación de un principio clave al formular un Escenario de Calidad de 6 partes en un examen de Arquitectura?",
          options: [
            "Omitir la 'Medida de la respuesta', impidiendo verificar objetivamente si el sistema cumplió el requisito no funcional (ej. indicar 'el sistema debe responder rápido' sin especificar milisegundos)",
            "Definir a un usuario externo como la 'Fuente del estímulo'",
            "Indicar que el 'Entorno' corresponde a condiciones de operación en sobrecarga pico",
            "Especificar que el 'Artefacto' afectado es el gateway de pagos"
          ],
          answer: "Omitir la 'Medida de la respuesta', impidiendo verificar objetivamente si el sistema cumplió el requisito no funcional (ej. indicar 'el sistema debe responder rápido' sin especificar milisegundos)",
          explanation: "La 'Medida de la respuesta' es el criterio cuantitativo ineludible que convierte una aspiración difusa en un requerimiento arquitectónico testeable y verificable en auditorías.",
          difficulty: "medium",
          type: "multiple_choice"
        },
        {
          question: "¿Cuál es la diferencia operativa esencial entre un bot de RPA 'Attended' (Asistido) y uno 'Unattended' (Desatendido)?",
          options: [
            "El bot Attended corre en la estación de trabajo compartida y es disparado por un usuario humano ante eventos puntuales; el Unattended se ejecuta en servidores autónomos gestionado por el Orquestador en base a colas y horarios",
            "El bot Attended utiliza visión artificial y el Unattended solo líneas de comando",
            "El bot Attended solo funciona con APIs REST y el Unattended solo con interfaces gráficas legacy",
            "No existe diferencia; son denominaciones comerciales intercambiables"
          ],
          answer: "El bot Attended corre en la estación de trabajo compartida y es disparado por un usuario humano ante eventos puntuales; el Unattended se ejecuta en servidores autónomos gestionado por el Orquestador en base a colas y horarios",
          explanation: "Attended asiste al colaborador en tiempo real (disparado manualmente). Unattended procesa transacciones masivas de fondo en máquinas virtuales sin intervención humana.",
          difficulty: "easy",
          type: "multiple_choice"
        },
        {
          question: "En las Finanzas Descentralizadas (DeFi), ¿por qué los protocolos de préstamos (como Aave o MakerDAO) exigen una 'sobrecolateralización' (colateral superior al 100% del valor prestado)?",
          options: [
            "Para mitigar el riesgo de volatilidad cripto y proteger la solvencia del protocolo ante caídas abruptas de precio del activo en garantía sin recurrir a agencias de scoring crediticio",
            "Porque el protocolo debe transferir el 50% de las garantías al gobierno de la red",
            "Para cobrar comisiones de gas más altas en la red Ethereum",
            "Porque los contratos inteligentes no admiten tokens ERC-20 estándar"
          ],
          answer: "Para mitigar el riesgo de volatilidad cripto y proteger la solvencia del protocolo ante caídas abruptas de precio del activo en garantía sin recurrir a agencias de scoring crediticio",
          explanation: "En DeFi no hay veraz ni scoring crediticio tradicional. Para prestar US$ 100 en stablecoins, se exige bloquear (ej.) US$ 150 en ETH; si el colateral cae por debajo del umbral de liquidación, el smart contract subasta el colateral automáticamente.",
          difficulty: "medium",
          type: "multiple_choice"
        }
      ];

      for (const q of additionalSistemasQuestions) {
        const exists = await prisma.question.findFirst({
          where: { subjectId: subject.id, question: q.question },
        });
        if (!exists) {
          await prisma.question.create({
            data: {
              subjectId: subject.id,
              question: q.question,
              optionsJson: JSON.stringify(q.options),
              answer: q.answer,
              explanation: q.explanation,
              difficulty: q.difficulty,
              type: q.type,
            },
          });
        }
      }
    }

    // -------------------------------------------------------------
    // 3. ADMINISTRACIÓN DE NEGOCIOS DIGITALES
    // -------------------------------------------------------------
    if (sName.includes("negocios")) {
      console.log(`\n📦 Procesando: ${subject.name}`);

      // Instancia 1: Parcial 1 Presencial (14/10)
      let exam1: any = subject.exams.find((e) => e.title.includes("Parcial 1"));
      const rubricNotesNegocios1 = JSON.stringify({
        institution: "Universidad de la Ciudad de Buenos Aires (UCABA)",
        career: "Licenciatura en Tecnologías Digitales",
        instanceType: "Evaluación Parcial 1 Presencial Escrita",
        weightPercentage: 50,
        passingGrade: 4,
        promotionGrade: 7,
        minGradePerInstance: 6,
        gradingScale: "1 a 10 (Aprobación con 60% / Nota 4)",
        format: "Evaluación escrita presencial individual. Preguntas teóricas, análisis de casos de empresas digitales reales y aplicación de matrices estratégicas.",
        professors: "Javier Monzón, Sergio Donzelli",
        evaluatedScope: "Unidades 1 a 4 (Economía Conductual, Efecto Cero de Dan Ariely, Modelos Asimétricos, Plataformas de Red de Hagiu & Rogers, Framework de 10 Pasos de Gartner, Entornos BANI/VUCA, PESTLE, FODA, VRIO, CAME y OKRs)",
        keyCriteria: [
          "Comprensión de modelos de negocio asimétricos (Amazon, Google) y productos complementarios.",
          "Plataformas multifacéticas: Identificación de lados, efectos de red directos/indirectos y precios asimétricos.",
          "Planificación Estratégica: Los 10 pasos de Gartner para diseñar una plataforma digital y objetivos SMART.",
          "Análisis del Entorno Digital: Diagnóstico BANI (Quebradizo, Ansioso, No-lineal, Incomprensible) y PESTLE.",
          "Análisis Competitivo: Matriz VRIO para ventajas competitivas sostenibles y Matriz CAME alineada a OKRs.",
          "Condición de Promoción: Promedio >= 7.00 entre Parcial 1 y Parcial 2, con nota mínima 6 en cada uno.",
        ],
      });

      if (exam1) {
        await prisma.exam.update({
          where: { id: exam1.id },
          data: {
            notes: rubricNotesNegocios1,
            room: "Aula 204",
            location: "Sede Central UCABA",
          },
        });
      }

      // Instancia 2: Parcial 2 / Entrega TP Grupal y Defensa Oral (11/11 y 18/11)
      let exam2: any = subject.exams.find((e) => e.title.includes("Parcial 2") || e.title.includes("TP Grupal"));
      const rubricNotesNegocios2 = JSON.stringify({
        institution: "Universidad de la Ciudad de Buenos Aires (UCABA)",
        career: "Licenciatura en Tecnologías Digitales",
        instanceType: "Evaluación Parcial 2: Entrega TP Grupal de Transformación Digital y Defensa Oral",
        weightPercentage: 50,
        passingGrade: 4,
        promotionGrade: 7,
        minGradePerInstance: 6,
        gradingScale: "1 a 10 (50% informe escrito grupal + 50% defensa oral individual)",
        format: "Presentación escrita formal del caso de Transformación Digital + Defensa oral individual y grupal ante el equipo docente en Aula 204.",
        professors: "Javier Monzón, Sergio Donzelli",
        evaluatedScope: "Unidades 5 a 10 (Diagnóstico de Transformación Digital, Ecosistemas Digitales, Arquitectura Empresarial, eCommerce, Analítica y GenAI en Negocios)",
        keyCriteria: [
          "Diagnóstico Integral de Madurez Digital: Aplicación del modelo de dos velocidades a una organización real.",
          "Diseño de la Propuesta de Valor Digital: Creación, Entrega y Captura de valor digital.",
          "Arquitectura de Negocios y Tecnologías: Integración de canales omnicanal, CDP, CRM y automatización.",
          "Defensa Oral Individual: Dominio del marco conceptual, claridad expositiva y respuestas ante la cátedra.",
          "Promoción Directa: Promedio ponderado >= 7.00 sin notas inferiores a 6.00.",
        ],
      });

      if (!exam2) {
        exam2 = await prisma.exam.create({
          data: {
            subjectId: subject.id,
            title: "Evaluación Parcial 2: Entrega Final TP Grupal y Defensa Oral",
            examType: "midterm",
            date: new Date("2026-11-11T18:30:00-03:00"),
            startTime: "18:30",
            location: "Sede Central UCABA",
            room: "Aula 204",
            notes: rubricNotesNegocios2,
            status: "upcoming",
          },
        });
        console.log(`  ➕ Creada instancia: ${exam2.title}`);

        const planNegocios2 = [
          { title: "Selección de empresa y relevamiento del modelo de negocio tradicional", offset: 15, comp: false },
          { title: "Diagnóstico FODA digital y análisis del entorno PESTLE", offset: 25, comp: false },
          { title: "Diseño de la arquitectura digital y pilares de transformación", offset: 35, comp: false },
          { title: "Consolidación del informe escrito final de cátedra", offset: 48, comp: false },
          { title: "Ensayo de la presentación oral por equipo y preparación de defensas individuales", offset: 53, comp: false },
        ];
        for (let i = 0; i < planNegocios2.length; i++) {
          await prisma.preparationPlanItem.create({
            data: {
              examId: exam2.id,
              title: planNegocios2[i].title,
              scheduledDate: new Date(now.getTime() + planNegocios2[i].offset * 24 * 60 * 60 * 1000),
              completed: planNegocios2[i].comp,
              order: i + 1,
            },
          });
        }
      } else {
        await prisma.exam.update({
          where: { id: exam2.id },
          data: { notes: rubricNotesNegocios2 },
        });
      }

      // Vincular todos los topics al examen 1
      for (const t of subject.topics) {
        const exists = await prisma.examTopic.findFirst({
          where: { examId: exam1!.id, topicId: t.id },
        });
        if (!exists) {
          await prisma.examTopic.create({
            data: { examId: exam1!.id, topicId: t.id },
          });
        }
      }
    }

    // -------------------------------------------------------------
    // 4. GESTIÓN DEL TALENTO HUMANO EN LA INDUSTRIA DIGITAL
    // -------------------------------------------------------------
    if (sName.includes("talento")) {
      console.log(`\n📦 Procesando: ${subject.name}`);

      // Instancia 1: 1er Parcial Presencial (07/10)
      let exam1: any = subject.exams.find((e) => e.title.includes("1er"));
      const rubricNotesTalento1 = JSON.stringify({
        institution: "Universidad de la Ciudad de Buenos Aires (UCABA)",
        career: "Licenciatura en Tecnologías Digitales / Ciencia de Datos",
        instanceType: "1er Examen Parcial Presencial Obligatorio",
        weightPercentage: 50,
        passingGrade: 4,
        promotionGrade: 7,
        minGradePerInstance: 6,
        gradingScale: "1 a 10 (Aprobación con 60% / Nota 4)",
        format: "Examen individual escrito presencial. Preguntas conceptuales y análisis de casos organizacionales sobre gestión de personas en empresas tecnológicas.",
        professors: "Ignacio Sanguinetti, Bárbara Garattoni, Augusto Nucilli",
        evaluatedScope: "Unidades 1, 2 y 3 (Filosofía y Cultura Organizacional de Robbins, CH como Sistema Abierto de Dolan, Planeamiento Estratégico de Bohlander, Estrategias de Porter en CH, Integración vertical/horizontal, RSE y Balance Social OIT, Paradigmas de Pérez Van Morlegan, Teoría Bifactorial de Herzberg, Liderazgo Situacional de Hersey & Blanchard, y Modelo de Gestión por Competencias de Martha Alles)",
        keyCriteria: [
          "Diferenciación entre Misión, Visión, Valores y la Cultura real percibida (Stephen Robbins).",
          "Concepción sistémica de CH (insumos, procesos, productos y retroalimentación) y Autoridad de Línea vs. Staff.",
          "Alineación estratégica: Integración vertical con el plan del negocio e integración horizontal entre subsistemas.",
          "RSE Interna vs. Externa y Balance Social según el Manual de la OIT.",
          "Paradigmas de Capital Humano e ideas-fuerza de Pérez Van Morlegan.",
          "Motivación laboral según Frederick Herzberg (factores higiénicos no motivan, previenen insatisfacción).",
          "Liderazgo Situacional y etapas de madurez del equipo técnico.",
          "Modelo por Competencias de Martha Alles: Glosario conductual y evaluación STAR.",
          "Promoción directa: Promedio >= 7.00 sin notas < 6.00.",
        ],
      });

      if (exam1) {
        await prisma.exam.update({
          where: { id: exam1.id },
          data: {
            notes: rubricNotesTalento1,
            room: "Aula 108",
            location: "Sede Central UCABA",
          },
        });
      }

      // Instancia 2: 2do Parcial Presencial (18/11)
      let exam2: any = subject.exams.find((e) => e.title.includes("2do"));
      const rubricNotesTalento2 = JSON.stringify({
        institution: "Universidad de la Ciudad de Buenos Aires (UCABA)",
        career: "Licenciatura en Tecnologías Digitales / Ciencia de Datos",
        instanceType: "2do Examen Parcial Presencial Obligatorio",
        weightPercentage: 50,
        passingGrade: 4,
        promotionGrade: 7,
        minGradePerInstance: 6,
        gradingScale: "1 a 10 (Aprobación con 60% / Nota 4)",
        format: "Examen individual presencial escrito sobre Unidad 4 + Defensa del Trabajo Práctico Integrador de Gestión del Talento en empresas tech.",
        professors: "Ignacio Sanguinetti, Bárbara Garattoni, Augusto Nucilli",
        evaluatedScope: "Unidad 4 y Trabajo Integrador (Reclutamiento y Selección IT, Descripción de Puestos por Competencias, Capacitación y Métricas de Desempeño 9-Box, Compensaciones, Beneficios y Salario Emocional, Modalidades Remotas/Híbridas)",
        keyCriteria: [
          "Subsistema de Incorporación: Reclutamiento Tech (sourcing, hunting, canales digitales) y entrevistas por incidentes críticos STAR.",
          "Subsistema de Desarrollo: Planes de carrera técnica, capacitación y evaluación de potencial 9-Box Grid.",
          "Compensaciones y Beneficios: Bandas salariales para perfiles tecnológicos y Salario Emocional.",
          "Modalidades de Trabajo: Cultura en equipos remotos, desvinculaciones y legislación laboral aplicable.",
          "Promoción Directa: Promedio >= 7.00 sin notas inferiores a 6.00.",
        ],
      });

      if (!exam2) {
        exam2 = await prisma.exam.create({
          data: {
            subjectId: subject.id,
            title: "2do Examen Parcial Presencial Obligatorio (Unidad 4 y Trabajo Integrador)",
            examType: "midterm",
            date: new Date("2026-11-18T08:00:00-03:00"),
            startTime: "08:00",
            location: "Sede Central UCABA",
            room: "Aula 108",
            notes: rubricNotesTalento2,
            status: "upcoming",
          },
        });
        console.log(`  ➕ Creada instancia: ${exam2.title}`);

        const planTalento2 = [
          { title: "Estudio de subsistemas de Reclutamiento Tech y perfiles IT", offset: 25, comp: false },
          { title: "Formulación de descripciones de puestos por competencias", offset: 35, comp: false },
          { title: "Métricas de Evaluación de Desempeño y Matriz 9-Box", offset: 45, comp: false },
          { title: "Políticas de Salario Emocional y Compensaciones", offset: 54, comp: false },
          { title: "Repaso integral y defensa del Trabajo Integrador", offset: 60, comp: false },
        ];
        for (let i = 0; i < planTalento2.length; i++) {
          await prisma.preparationPlanItem.create({
            data: {
              examId: exam2.id,
              title: planTalento2[i].title,
              scheduledDate: new Date(now.getTime() + planTalento2[i].offset * 24 * 60 * 60 * 1000),
              completed: planTalento2[i].comp,
              order: i + 1,
            },
          });
        }
      } else {
        await prisma.exam.update({
          where: { id: exam2.id },
          data: { notes: rubricNotesTalento2 },
        });
      }

      // Vincular todos los topics al examen 1
      for (const t of subject.topics) {
        const exists = await prisma.examTopic.findFirst({
          where: { examId: exam1!.id, topicId: t.id },
        });
        if (!exists) {
          await prisma.examTopic.create({
            data: { examId: exam1!.id, topicId: t.id },
          });
        }
      }
    }
  }

  console.log("\n✅ Sincronización de Rúbricas e Instancias de Examen de UCABA completada con éxito.");
}

syncUcabaRubrics()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
