import prisma from "../lib/db/prisma";
import fs from "fs";
import path from "path";
import { extractTextFromBuffer } from "../lib/pdf/extractor";

async function main() {
  console.log("🚀 Sincronizando currícula académica oficial para Gestión del Talento Humano en la Industria Digital...");

  const subject = await prisma.subject.findFirst({
    where: { name: { contains: "Talento Humano" } },
    include: {
      classes: { orderBy: { classNumber: "asc" } },
      exams: true,
    },
  });

  if (!subject) throw new Error("No se encontró la materia");

  const classMap = new Map(subject.classes.map((c) => [c.classNumber, c]));
  const baseDir = path.join(process.cwd(), "uploads", "materials", "miercoles_gestion");

  // 1. Clases con Unidad oficial y títulos exactos de la cátedra
  const classesData = [
    {
      classNumber: 1,
      unit: "Unidad 1",
      fileName: "Clase 1.pdf",
      title: "Clase 1: Unidad 1 · Filosofía y Cultura Organizacional, Misión, Visión y Valores (Robbins & Gilli)",
      notes: "Material de clase: Clase 1.pdf. Filosofía organizacional, valores, culturas fuertes vs débiles y evolución de Personal a Gestión de CH.",
    },
    {
      classNumber: 2,
      unit: "Unidad 1",
      fileName: "GTHID Clase 2 2C2026.pdf",
      title: "Clase 2: Unidad 1 · Capital Humano como Sistema Abierto, Subsistemas y Bienestar (Simon Dolan)",
      notes: "Material de clase: GTHID Clase 2 2C2026.pdf. Los 6 subsistemas de CH, personas como asociados, línea vs staff y bienestar organizacional.",
    },
    {
      classNumber: 3,
      unit: "Unidad 2",
      fileName: "GTHID Clase 3 2C2026.pdf",
      title: "Clase 3: Unidad 2 · Planeamiento Estratégico de CH (Bohlander) y Estrategias de Porter",
      notes: "Material de clase: GTHID Clase 3 2C2026.pdf. Proceso de 5 pasos de planeación de CH, factores externos y estrategias competitivas de Michael Porter.",
    },
    {
      classNumber: 4,
      unit: "Unidad 2",
      fileName: "Clase 4 2C2026.pdf",
      title: "Clase 4: Unidad 2 · Integración Vertical/Horizontal, Matriz FODA de CH, RSE y Caso Globant",
      notes: "Material de clase: Clase 4 2C2026.pdf. Doble integración, FODA de CH, crisis 2024-2025 de Globant, RSE interna (Mondy) y desempleo estructural.",
    },
    {
      classNumber: 5,
      unit: "Unidad 2",
      fileName: "Clase 5 2C2026.pdf",
      title: "Clase 5: Unidad 2 · Employer Branding, Balance Social (OIT 2001) y PyMEs vs. Sector Público",
      notes: "Material de clase: Clase 5 2C2026.pdf. Marca empleadora, indicadores del Balance Social OIT, particularidades de PyMEs y sector público.",
    },
    {
      classNumber: 6,
      unit: "Unidad 3",
      fileName: "GTHID Clase 6  2C2026.pdf",
      title: "Clase 6: Unidad 3 · Paradigmas en CH, Motivación (Herzberg), Liderazgo y Competencias (Martha Alles)",
      notes: "Material de clase: GTHID Clase 6  2C2026.pdf. Paradigmas (Pérez Van Morlegan), Herzberg (higiénicos vs motivadores), Liderazgo situacional y Martha Alles.",
    },
  ];

  for (const cData of classesData) {
    const classSession = classMap.get(cData.classNumber);
    if (classSession) {
      await prisma.classSession.update({
        where: { id: classSession.id },
        data: {
          title: cData.title,
          notes: cData.notes,
          attendanceStatus: "attended",
        },
      });
      console.log(`✅ Clase ${cData.classNumber} actualizada con Unidad y título oficial.`);
    }
  }

  // 2. Limpiar topics, flashcards y questions previos de la materia para asegurar estricta correspondencia con las diapositivas
  console.log("\n🧹 Reordenando banco de temas, flashcards y preguntas para estructuración por Unidades...");
  await prisma.flashcard.deleteMany({ where: { subjectId: subject.id } });
  await prisma.question.deleteMany({ where: { subjectId: subject.id } });
  await prisma.topic.deleteMany({ where: { subjectId: subject.id } });

  // 3. Estructura de Temas por Unidad con Flashcards y Preguntas basadas ESTRICTAMENTE en las diapositivas
  const curriculum = [
    // --- UNIDAD 1 (Clases 1 y 2) ---
    {
      classNumber: 1,
      unit: "Unidad 1",
      topicName: "Unidad 1 · Filosofía y Cultura Organizacional (Stephen Robbins)",
      description: "Patrones compartidos de valores, presunciones y creencias. Diferencias entre culturas fuertes y débiles, historias, rituales y símbolos materiales.",
      importance: "critical",
      masteryScore: 70,
      flashcards: [
        {
          front: "¿Cuál es la diferencia fundamental entre una Cultura Fuerte y una Cultura Débil según Stephen Robbins?",
          back: "En una Cultura Fuerte los valores centrales están profundamente arraigados, son ampliamente compartidos por los colaboradores y guían las conductas espontáneas sin necesidad de un control policial rígido. En una Cultura Débil hay falta de claridad, mensajes contradictorios y los empleados no saben qué premia o castiga la dirección.",
          difficulty: "medium",
        },
        {
          front: "¿Cuáles son los 4 mecanismos principales mediante los cuales los colaboradores aprenden y asimilan la cultura de una organización?",
          back: "1. Historias o anécdotas: relatos fundacionales sobre los orígenes, superación y decisiones críticas de los fundadores.\n2. Rituales: ceremonias de premiación, demostraciones o eventos de integración.\n3. Lenguaje: códigos, jergas y terminología propia de la organización.\n4. Símbolos materiales: distribución física, arquitectura abierta, vestimenta y objetos emblemáticos.",
          difficulty: "medium",
        },
        {
          front: "¿Cómo influyen los procesos de Selección y Socialización (Inducción) en el mantenimiento de la cultura organizacional?",
          back: "La Selección asegura contratar candidatos con ajuste cultural ('cultural fit') que compartan los valores institucionales. La Socialización (en el Proceso de Inducción) transmite explícitamente las normas, expectativas de desempeño y reglas de convivencia a los recién ingresados.",
          difficulty: "easy",
        },
      ],
      questions: [
        {
          question: "Según la obra de Stephen Robbins sobre Comportamiento Organizacional vista en la Clase 1, ¿por qué una cultura organizacional fuerte favorece la productividad?",
          options: [
            "Porque permite despedir inmediatamente a quien comete un error administrativo.",
            "Porque cuando los valores son claros y compartidos, las personas saben exactamente qué se espera de ellas y actúan con rapidez y consistencia.",
            "Porque elimina la necesidad de contar con líderes de equipo y mandos medios.",
            "Porque garantiza salarios superiores al promedio de la economía.",
          ],
          answer: "Porque cuando los valores son claros y compartidos, las personas saben exactamente qué se espera de ellas y actúan con rapidez y consistencia.",
          explanation: "La fortaleza cultural alinea las decisiones descentralizadas y reduce la fricción y ambigüedad laboral al compartir un marco ético y conductual homogéneo.",
          difficulty: "medium",
        },
      ],
    },
    {
      classNumber: 1,
      unit: "Unidad 1",
      topicName: "Unidad 1 · Misión, Visión, Valores y Gestión de CH",
      description: "Misión (negocio presente) vs. Visión (aspiración futura). Evolución de Unidad de Administración de Personal a Unidad de Gestión.",
      importance: "high",
      masteryScore: 75,
      flashcards: [
        {
          front: "¿En qué se diferencian la Misión y la Visión de una organización?",
          back: "La Misión define el negocio y razón de ser presente en términos de mercado, producto y clientes (qué hace hoy y para quién). La Visión es la imagen desafiante del futuro deseado a largo plazo (hacia dónde aspira transformarse).",
          difficulty: "easy",
        },
        {
          front: "¿Qué distingue al área de Capital Humano como 'Unidad de Administración de Personal' frente a una 'Unidad de Gestión'?",
          back: "La Unidad de Administración de Personal opera con enfoque burocrático/hard, limitándose a liquidación de haberes, ausentismo y legajos legales. La Unidad de Gestión actúa como socio estratégico de la dirección, planificando el talento, diagnosticando el clima, diseñando planes de carrera y modelando la experiencia del colaborador.",
          difficulty: "medium",
        },
        {
          front: "¿Qué postula la cátedra respecto a la relación entre la felicidad organizacional y el negocio en empresas de tecnología?",
          back: "La felicidad de los colaboradores no es un lujo decorativo sino una estrategia central del negocio: empleados felices reducen la rotación de talento, mejoran el clima laboral y potencian la productividad.",
          difficulty: "easy",
        },
      ],
      questions: [
        {
          question: "Un área de Capital Humano que se dedica exclusivamente a controlar horarios mediante el reloj biométrico y confeccionar recibos de sueldo está actuando bajo el rol de:",
          options: [
            "Unidad de Gestión Estratégica",
            "Unidad de Administración de Personal",
            "Centro de Innovación Tecnológica",
            "Comité de People Analytics",
          ],
          answer: "Unidad de Administración de Personal",
          explanation: "La administración tradicional de personal tiene un sesgo meramente burocrático y transaccional centrado en el control normativo y la liquidación.",
          difficulty: "easy",
        },
      ],
    },
    {
      classNumber: 2,
      unit: "Unidad 1",
      topicName: "Unidad 1 · Capital Humano como Sistema Abierto y Subsistemas de Gestión",
      description: "Los 6 subsistemas articulados: puestos, selección, formación, desempeño, compensaciones y plan de carrera.",
      importance: "critical",
      masteryScore: 68,
      flashcards: [
        {
          front: "¿Cuáles son los 6 subsistemas interrelacionados que conforman el área de Capital Humano como sistema abierto?",
          back: "1. Descripción y Análisis de Puestos.\n2. Reclutamiento y Selección de Personal.\n3. Formación y Capacitación Continua.\n4. Evaluación de Desempeño.\n5. Remuneraciones, Beneficios y Compensaciones.\n6. Planes de Carrera y Sucesión.",
          difficulty: "medium",
        },
        {
          front: "¿Qué acontecimientos identifica Simon Dolan como impulsores de la relevancia actual de la gestión de personas?",
          back: "1. El aumento de la competencia global y necesidad de ser competitivo.\n2. Los costos y ventajas directas vinculadas al uso estratégico del capital humano.\n3. La crisis de productividad en modelos mecanicistas.\n4. La aceleración y complejidad de los cambios socioculturales, educativos y tecnológicos.",
          difficulty: "medium",
        },
        {
          front: "¿Qué diferencia existe entre concebir a los colaboradores como 'Recursos' versus como 'Asociados' de la empresa?",
          back: "Como 'Recursos', se los considera mano de obra pasiva, un costo variable a controlar y estandarizar. Como 'Asociados', se reconoce que invierten su conocimiento, habilidades y creatividad (capital intelectual), coinvirtiendo valor y aportando dinamismo a la estrategia.",
          difficulty: "easy",
        },
      ],
      questions: [
        {
          question: "Según la concepción sistémica de Capital Humano vista en la Clase 2, ¿qué función cumple el subsistema de 'Evaluación de Desempeño'?",
          options: [
            "Registrar las entradas y salidas diarias del personal en portería.",
            "Determinar la adecuación de la persona al puesto, verificar el logro de objetivos e identificar necesidades de formación y oportunidades de ascenso.",
            "Calcular los impuestos a las ganancias y retenciones provisionales.",
            "Negociar convenios salariales con los delegados gremiales exclusivamente.",
          ],
          answer: "Determinar la adecuación de la persona al puesto, verificar el logro de objetivos e identificar necesidades de formación y oportunidades de ascenso.",
          explanation: "La evaluación de desempeño mide el aporte real individual y grupal, proveyendo insumos clave para capacitar, remunerar y promover.",
          difficulty: "medium",
        },
      ],
    },
    {
      classNumber: 2,
      unit: "Unidad 1",
      topicName: "Unidad 1 · Autoridad de Línea vs. Función de Staff y Bienestar",
      description: "Distribución de responsabilidades entre mandos operativos y especialistas de CH. El Iceberg de Bienestar Organizacional.",
      importance: "high",
      masteryScore: 72,
      flashcards: [
        {
          front: "¿Cómo se articulan la 'Autoridad de Línea' y la 'Función de Staff' en la administración de Capital Humano?",
          back: "La administración del CH es una 'responsabilidad de línea' de cada jefe directo (quien conduce, asigna tareas y evalúa a su equipo) y una 'función de staff' del área de CH (que actúa como asesor interno, diseña políticas, provee herramientas y brinda soporte metodológico).",
          difficulty: "medium",
        },
        {
          front: "¿Qué postula la metáfora del 'Iceberg del Bienestar Organizacional' presentada en la Clase 2?",
          back: "Que los factores visibles en la superficie (la punta del iceberg: salarios básicos, equipamiento material) no alcanzan por sí solos para fidelizar; la satisfacción y felicidad profunda radican en los factores invisibles subyacentes: seguridad psicológica, confianza en el líder, reconocimiento y sentido de propósito.",
          difficulty: "medium",
        },
      ],
      questions: [
        {
          question: "En una organización moderna que aplica el principio de 'responsabilidad de línea y función de staff', ¿quién debe tener la decisión final sobre la incorporación de un nuevo integrante al equipo?",
          options: [
            "El jefe operativo directo del equipo de trabajo (Línea), con la asesoría y preselección del área de CH (Staff).",
            "Exclusivamente el selector junior de Recursos Humanos sin consultar al área de destino.",
            "El auditor de sistemas informáticos de la compañía.",
            "El sindicato de la actividad económica.",
          ],
          answer: "El jefe operativo directo del equipo de trabajo (Línea), con la asesoría y preselección del área de CH (Staff).",
          explanation: "La línea tiene la responsabilidad y autoridad de mando sobre las personas que integran su sector; el staff de CH asesora y estructura el proceso.",
          difficulty: "easy",
        },
      ],
    },

    // --- UNIDAD 2 (Clases 3, 4 y 5) ---
    {
      classNumber: 3,
      unit: "Unidad 2",
      topicName: "Unidad 2 · Planeamiento Estratégico de CH (George Bohlander)",
      description: "Proceso anticipatorio de 5 pasos para prever ingresos, permanencias y salidas. Planeamiento estratégico vs. operativo.",
      importance: "critical",
      masteryScore: 65,
      flashcards: [
        {
          front: "¿Cómo define George Bohlander (2009) la planeación del Capital Humano?",
          back: "Como el proceso sistemático de anticipar y hacer previsiones para el ingreso, permanencia y salida del personal, con el fin de utilizar los recursos humanos de la manera más efectiva posible y cumplir con las metas estratégicas de la organización.",
          difficulty: "medium",
        },
        {
          front: "¿Cuáles son los 5 pasos secuenciales del proceso de planeamiento de Capital Humano?",
          back: "1. Establecimiento de la Visión, Misión y Valores centrales.\n2. Escaneo del entorno y análisis de fuerzas internas/externas.\n3. Pronóstico de Demanda futura y Oferta de talento (interna y de mercado).\n4. Formulación y Ejecución de la Estrategia de CH (análisis y cierre de brechas / gap analysis).\n5. Evaluación, métricas de resultado y control.",
          difficulty: "critical",
        },
        {
          front: "¿En qué difieren el Planeamiento Estratégico y el Planeamiento Operativo de Capital Humano?",
          back: "El Planeamiento Estratégico abarca de 1 a 5 años, es decidido por la alta dirección, tiene visión global y adapta las capacidades de la organización a la competencia. El Planeamiento Operativo abarca el corto plazo (hasta 1 año), es táctico y gestiona turnos, licencias y presupuestos anuales de sueldos.",
          difficulty: "medium",
        },
      ],
      questions: [
        {
          question: "Según el modelo de George Bohlander expuesto en la Clase 3, ¿cuál es el objetivo central del 'Análisis de Brechas' (Gap Analysis)?",
          options: [
            "Auditar el consumo de resmas de papel en la oficina de administración.",
            "Comparar la demanda futura proyectada de talento con la oferta disponible (interna y externa) para determinar qué perfiles contratar, capacitar o reestructurar.",
            "Calcular la depreciación fiscal de las computadoras portátiles asignadas al personal.",
            "Determinar las fechas exactas de las vacaciones estivales del personal.",
          ],
          answer: "Comparar la demanda futura proyectada de talento con la oferta disponible (interna y externa) para determinar qué perfiles contratar, capacitar o reestructurar.",
          explanation: "El análisis de brechas identifica el desfasaje entre las capacidades actuales y las requeridas a futuro por el plan de negocio.",
          difficulty: "medium",
        },
      ],
    },
    {
      classNumber: 3,
      unit: "Unidad 2",
      topicName: "Unidad 2 · Estrategias Competitivas de Porter aplicadas a CH",
      description: "Liderazgo en Costos vs. Diferenciación y su traducción en políticas salariales, de selección y cultura.",
      importance: "critical",
      masteryScore: 68,
      flashcards: [
        {
          front: "¿Cómo condiciona una estrategia de 'Liderazgo en Costos' de Michael Porter a la gestión de Capital Humano?",
          back: "Exige un control estricto y riguroso de la masa salarial, estandarización de tareas, foco en la productividad por hora, compensaciones fijas previsibles y automatización de procesos para operar al menor costo del mercado.",
          difficulty: "medium",
        },
        {
          front: "¿Cómo condiciona una estrategia de 'Diferenciación' de Michael Porter a la gestión de Capital Humano?",
          back: "Exige reclutar talentos altamente creativos e innovadores, esquemas de compensación agresivos y variables por mérito, programas continuos de capacitación, fomento de la experimentación y tolerancia a la autonomía operativa.",
          difficulty: "medium",
        },
      ],
      questions: [
        {
          question: "Una compañía que desarrolla software de inteligencia artificial decide competir por 'Diferenciación' en el mercado internacional. ¿Qué política de Capital Humano es coherente con esta elección?",
          options: [
            "Congelar contrataciones e imponer salarios mínimos estandarizados por debajo del promedio.",
            "Ofrecer esquemas de compensación competitivos, autonomía técnica, bonos por innovación y formación en tecnologías emergentes.",
            "Eliminar todo beneficio laboral y reemplazar a los ingenieros por operadores sin experiencia.",
            "Limitar la comunicación interna exclusivamente a memorándums impresos y formales.",
          ],
          answer: "Ofrecer esquemas de compensación competitivos, autonomía técnica, bonos por innovación y formación en tecnologías emergentes.",
          explanation: "La diferenciación exige atraer y fidelizar talento creativo de punta capaz de generar propuestas de valor exclusivas e innovadoras.",
          difficulty: "easy",
        },
      ],
    },
    {
      classNumber: 4,
      unit: "Unidad 2",
      topicName: "Unidad 2 · Integración Estratégica (Vertical y Horizontal) y Matriz FODA",
      description: "Integración vertical (negocio-CH) e horizontal (subsistemas entre sí). Matriz FODA de talento y Caso Globant 2024-2025.",
      importance: "critical",
      masteryScore: 66,
      flashcards: [
        {
          front: "¿Cuál es la diferencia entre Integración Vertical e Integración Horizontal en la gestión de Capital Humano?",
          back: "La Integración Vertical alinea y supedita las políticas de CH a la estrategia general del negocio. La Integración Horizontal asegura que los subsistemas de CH sean consistentes entre sí (por ejemplo, que la selección por competencias coincida con la evaluación de desempeño y el sistema de incentivos).",
          difficulty: "medium",
        },
        {
          front: "¿Cuáles son las 4 dimensiones de la Matriz FODA aplicada a Capital Humano?",
          back: "Fortalezas (capacidades y habilidades técnicas distintivas internas), Debilidades (falencias de formación o brechas internas de dotación), Oportunidades (posibilidades del mercado laboral, IA, People Analytics) y Amenazas (fuga de cerebros en dólares, inflación, regulaciones).",
          difficulty: "easy",
        },
        {
          front: "¿Qué lecciones dejó el Caso Globant (crisis 2024-2025) analizado en la Clase 4?",
          back: "Demostró que a pesar del crecimiento en IA (+110%), despidos masivos unilaterales (~1.000 empleados) dañan severamente la marca empleadora, deterioran el clima interno y aumentan la desconfianza del talento remanente, obligando a priorizar comunicación transparente y programas de reskilling.",
          difficulty: "critical",
        },
      ],
      questions: [
        {
          question: "Si una empresa tecnológica evalúa y premia individualmente a sus colaboradores pero exige formalmente que trabajen de manera ágil y colaborativa en escuadrones, está sufriendo una falla de:",
          options: [
            "Integración Horizontal de CH",
            "Integración Vertical de CH",
            "Liquidación de haberes impositiva",
            "Auditoría externa de balance social",
          ],
          answer: "Integración Horizontal de CH",
          explanation: "La falta de coherencia entre subsistemas internos (evaluación individual vs. cultura de equipo) es una falla de integración horizontal.",
          difficulty: "medium",
        },
      ],
    },
    {
      classNumber: 4,
      unit: "Unidad 2",
      topicName: "Unidad 2 · Responsabilidad Social Empresaria (RSE) Interna y Desempleo",
      description: "RSE interna (condiciones dignas, equidad, salud laboral) vs. externa (Mondy & Jones). Tipos de desempleo y organizaciones skills-based.",
      importance: "high",
      masteryScore: 70,
      flashcards: [
        {
          front: "¿Qué abarca la 'RSE Interna' en la gestión de Capital Humano según Wayne Mondy y Gareth Jones?",
          back: "Abarca prácticas éticas hacia los propios colaboradores: condiciones dignas de trabajo, seguridad y salud ocupacional, equidad remunerativa, conciliación entre trabajo y familia, diversidad y fomento de la empleabilidad a través de la capacitación continua.",
          difficulty: "medium",
        },
        {
          front: "¿Qué es el 'Desempleo Estructural' y cómo se manifiesta en la industria digital?",
          back: "Es el desempleo generado por el desajuste o desfase permanente entre las competencias que buscan las empresas tecnológicas (ej. ingenieros de IA, cloud) y la formación o habilidades obsoletas que ofrece la masa laboral disponible.",
          difficulty: "medium",
        },
      ],
      questions: [
        {
          question: "¿Cuál de las siguientes acciones corporativas representa un ejemplo genuino de Responsabilidad Social Empresaria (RSE) Interna?",
          options: [
            "Financiar campañas publicitarias en televisión sobre ecología.",
            "Implementar programas de salud mental, balance vida-trabajo y equidad salarial para los empleados propios.",
            "Donar computadoras obsoletas a escuelas rurales deducible de impuestos.",
            "Sponsorizar un torneo deportivo internacional de golf.",
          ],
          answer: "Implementar programas de salud mental, balance vida-trabajo y equidad salarial para los empleados propios.",
          explanation: "La RSE interna se enfoca en el trato ético, bienestar y desarrollo integral de los propios integrantes de la compañía.",
          difficulty: "easy",
        },
      ],
    },
    {
      classNumber: 5,
      unit: "Unidad 2",
      topicName: "Unidad 2 · Employer Branding y Balance Social (Manual OIT 2001)",
      description: "Marca empleadora, propuesta de valor al empleado (EVP) y los rubros clave de auditoría social de la OIT.",
      importance: "critical",
      masteryScore: 68,
      flashcards: [
        {
          front: "¿Qué es el Employer Branding y por qué trasciende al salario monetario?",
          back: "Es la estrategia integral de gestión de la reputación de la empresa como empleador atractivo. Trasciende al dinero porque los perfiles calificados priorizan la flexibilidad horaria, el clima laboral, la autogestión, la comunicación inclusiva y proyectos técnicos con propósito.",
          difficulty: "easy",
        },
        {
          front: "¿Qué es el Balance Social según las directrices del Manual de la OIT (2001)?",
          back: "Es un instrumento estandarizado de auditoría y diagnóstico que permite recopilar, cuantificar y reportar periódicamente la situación social y laboral de la empresa, evaluando el impacto de sus políticas humanas.",
          difficulty: "medium",
        },
        {
          front: "¿Cuáles son los 5 rubros obligatorios a considerar en el diseño del Balance Social de la OIT?",
          back: "1. Empleo y Dotación (rotación, edades, género, inclusión).\n2. Condiciones de Trabajo, Seguridad e Higiene (siniestralidad, ergonomía).\n3. Remuneraciones y Prestaciones Sociales.\n4. Capacitación y Formación profesional.\n5. Relaciones Laborales e Integración (sindicatos, conflictividad, participación).",
          difficulty: "critical",
        },
      ],
      questions: [
        {
          question: "En el marco del Manual de Balance Social de la Organización Internacional del Trabajo (OIT 2001), ¿qué indicador se analiza en el rubro 'Condiciones de Trabajo'?",
          options: [
            "El volumen de facturación bruta en moneda extranjera.",
            "El índice de siniestralidad, accidentes de trabajo y días perdidos por enfermedad profesional.",
            "El ranking de descargas de la aplicación en las tiendas digitales.",
            "La cotización de las acciones de la empresa en Wall Street.",
          ],
          answer: "El índice de siniestralidad, accidentes de trabajo y días perdidos por enfermedad profesional.",
          explanation: "Las condiciones de trabajo evalúan la salud, higiene, ergonomía y seguridad física/emocional del trabajador.",
          difficulty: "medium",
        },
      ],
    },
    {
      classNumber: 5,
      unit: "Unidad 2",
      topicName: "Unidad 2 · Gestión de CH en PyMEs vs. Startups IT vs. Sector Público",
      description: "Impacto del tamaño y naturaleza jurídica. Centralización en el fundador, informalidad, retención tech y estabilidad pública.",
      importance: "high",
      masteryScore: 72,
      flashcards: [
        {
          front: "¿Cuáles son los principales puntos a favor y en contra de la gestión de Capital Humano en las PyMEs?",
          back: "A favor: agilidad en la toma de decisiones, alta flexibilidad y adaptabilidad al cambio, comunicación directa sin burocracia y cercanía humana. En contra: centralización excesiva en el dueño/fundador, presupuesto limitado, escasez de planes de carrera formales y alta dificultad para retener perfiles clave.",
          difficulty: "medium",
        },
        {
          front: "¿Qué particularidad distingue a la gestión de Capital Humano en la Administración Pública frente al sector privado?",
          back: "Se rige por estabilidad laboral garantizada por ley, carrera administrativa pautada por escalafón rígido y concursos formales, salarios fijados centralmente sin margen para premiar discrecionalmente el mérito y menor flexibilidad organizativa.",
          difficulty: "easy",
        },
      ],
      questions: [
        {
          question: "¿Cuál es el principal obstáculo que enfrentan las PyMEs del sector de software en Argentina para retener programadores Senior?",
          options: [
            "La falta de computadoras de escritorio en la oficina.",
            "La disparidad salarial frente a empresas extranjeras que contratan en dólares y la carencia de planes de carrera corporativos.",
            "La excesiva cantidad de comités directivos y burocracia documental.",
            "La prohibición legal de utilizar metodologías ágiles en pequeñas empresas.",
          ],
          answer: "La disparidad salarial frente a empresas extranjeras que contratan en dólares y la carencia de planes de carrera corporativos.",
          explanation: "La fuga de talentos hacia el mercado remoto internacional con salarios en moneda dura impacta de lleno en la retención de las PyMEs locales.",
          difficulty: "easy",
        },
      ],
    },

    // --- UNIDAD 3 (Clase 6) ---
    {
      classNumber: 6,
      unit: "Unidad 3",
      topicName: "Unidad 3 · Paradigmas en Gestión de CH e Ideas-Fuerza (Pérez Van Morlegan)",
      description: "Concepto de paradigma rector del comportamiento humano. Comunicación organizacional asertiva y barreras de mensaje.",
      importance: "high",
      masteryScore: 70,
      flashcards: [
        {
          front: "¿Qué es un 'paradigma' en la gestión del Capital Humano según Pérez Van Morlegan (2011)?",
          back: "Son ideas-fuerza que concentran conceptos y puntos de vista compartidos acerca de las personas y lo que se espera de ellas en el trabajo. Prevalecen por sobre las herramientas técnicas e instrumentales y determinan el estilo gerencial de la empresa.",
          difficulty: "medium",
        },
      ],
      questions: [
        {
          question: "Según Pérez Van Morlegan (2011), ¿por qué los paradigmas prevalecen sobre las herramientas tecnológicas de Recursos Humanos?",
          options: [
            "Porque las herramientas tecnológicas no requieren ningún tipo de configuración.",
            "Porque la concepción de fondo que tienen los directivos sobre las personas determina cómo y con qué propósito se utilizan las herramientas.",
            "Porque los sindicatos prohíben el uso de computadoras en la gestión del talento.",
            "Porque la legislación laboral exige respetar modelos de gestión del siglo XIX.",
          ],
          answer: "Porque la concepción de fondo que tienen los directivos sobre las personas determina cómo y con qué propósito se utilizan las herramientas.",
          explanation: "El paradigma directivo es la lente a través de la cual se aplican todas las políticas y herramientas organizacionales.",
          difficulty: "medium",
        },
      ],
    },
    {
      classNumber: 6,
      unit: "Unidad 3",
      topicName: "Unidad 3 · Teoría Bifactorial de Motivación de Frederick Herzberg",
      description: "Factores Higiénicos (mantenimiento/extrínsecos) vs. Factores Motivacionales (crecimiento/intrínsecos). La falacia del salario como motivador duradero.",
      importance: "critical",
      masteryScore: 65,
      flashcards: [
        {
          front: "¿Por qué el salario NO es un factor motivador según la Teoría Bifactorial de Frederick Herzberg?",
          back: "Porque es un 'Factor Higiénico' (extrínseco). Su ausencia genera profunda insatisfacción, pero su presencia en niveles adecuados solo neutraliza el descontento: no produce por sí misma satisfacción duradera, entusiasmo ni compromiso activo.",
          difficulty: "critical",
        },
        {
          front: "¿Cuáles son los 'Factores Motivacionales' según Herzberg y qué impacto tienen en el colaborador?",
          back: "Son factores intrínsecos relacionados con el contenido de la tarea: el logro de metas desafiantes, el reconocimiento genuino, la responsabilidad delegada, la autonomía y el desarrollo personal. Su presencia es la que genera auténtica satisfacción y rendimiento superior.",
          difficulty: "critical",
        },
        {
          front: "¿Qué postula Herzberg sobre los opuestos de la Satisfacción y la Insatisfacción laboral?",
          back: "Postula que lo opuesto a la Satisfacción no es la Insatisfacción, sino la 'No-Satisfacción'. Y lo opuesto a la Insatisfacción no es la Satisfacción, sino la 'No-Insatisfacción'. Son dos continuos independientes administrados por factores distintos.",
          difficulty: "medium",
        },
      ],
      questions: [
        {
          question: "Un líder técnico otorga un aumento de sueldo a un desarrollador que se siente desmotivado por realizar tareas rutinarias de soporte sin autonomía. Según Herzberg, ¿qué ocurrirá?",
          options: [
            "El colaborador quedará permanentemente motivado y duplicará su productividad de por vida.",
            "El aumento eliminará temporalmente la insatisfacción económica (factor higiénico), pero la falta de factores motivacionales (desafío, autonomía) mantendrá su desmotivación de fondo.",
            "El colaborador renunciará de inmediato porque el dinero ofende a los programadores.",
            "El colaborador solicitará automáticamente un puesto administrativo.",
          ],
          answer: "El aumento eliminará temporalmente la insatisfacción económica (factor higiénico), pero la falta de factores motivacionales (desafío, autonomía) mantendrá su desmotivación de fondo.",
          explanation: "El salario es un factor higiénico de mantenimiento que solo aplaca la queja; la motivación surge del reto intelectual y la autonomía de la tarea.",
          difficulty: "medium",
        },
      ],
    },
    {
      classNumber: 6,
      unit: "Unidad 3",
      topicName: "Unidad 3 · Liderazgo Situacional (Hersey & Blanchard) y Team Building",
      description: "Los 4 estilos de liderazgo según madurez (Dirigir, Guiar, Apoyar, Delegar). Grupo de trabajo vs. Equipo interdependiente.",
      importance: "high",
      masteryScore: 72,
      flashcards: [
        {
          front: "¿Cuáles son los 4 estilos de liderazgo del modelo situacional de Hersey & Blanchard y cuándo se aplica cada uno?",
          back: "1. Dirigir (E1): Alta tarea, baja relación (para colaboradores con baja competencia pero compromiso inicial).\n2. Guiar / Persuadir (E2): Alta tarea, alta relación (para quienes están aprendiendo pero experimentan frustración).\n3. Apoyar / Participar (E3): Baja tarea, alta relación (para quienes tienen alta capacidad técnica pero falta de seguridad o motivación).\n4. Delegar (E4): Baja tarea, baja relación (para colaboradores con alta competencia y alto compromiso autónomo).",
          difficulty: "critical",
        },
        {
          front: "¿Qué diferencia a un 'Grupo de Trabajo' de un 'Equipo de Trabajo' (Team Building)?",
          back: "El grupo se limita a sumar esfuerzos individuales con responsabilidad puramente personal. El equipo posee interdependencia positiva, sinergia colaborativa donde el todo es mayor que la suma de las partes y responsabilidad mutua por el resultado final.",
          difficulty: "easy",
        },
      ],
      questions: [
        {
          question: "Un Tech Lead conduce a un Arquitecto de Software Senior con 10 años de experiencia comprobada y alta dedicación. Según el Liderazgo Situacional de Hersey & Blanchard, ¿qué estilo debe aplicar?",
          options: [
            "Dirigir (supervisar minuciosamente cada línea de código y dictar instrucciones paso a paso).",
            "Delegar (otorgarle autonomía para la toma de decisiones técnicas y apoyarlo solo cuando lo solicite).",
            "Persuadir mediante controles estrictos de ingreso y salida.",
            "Sancionarlo preventivamente para que no se relaje.",
          ],
          answer: "Delegar (otorgarle autonomía para la toma de decisiones técnicas y apoyarlo solo cuando lo solicite).",
          explanation: "Cuando el colaborador posee alta competencia técnica y alto compromiso (madurez M4), el estilo óptimo es la delegación con baja dirección de tarea y bajo soporte directivo.",
          difficulty: "easy",
        },
      ],
    },
    {
      classNumber: 6,
      unit: "Unidad 3",
      topicName: "Unidad 3 · Modelo de Gestión por Competencias (Martha Alles)",
      description: "Definición de competencia, pilares (Saber, Saber Hacer, Querer, Poder), técnica STAR de incidentes críticos y competencias tech.",
      importance: "critical",
      masteryScore: 68,
      flashcards: [
        {
          front: "¿Cómo define Martha Alles (2006) una 'Competencia Laboral'?",
          back: "Es una característica de personalidad profunda y duradera que subyace en un individuo y que está causalmente relacionada con comportamientos observables determinantes de un desempeño superior en el puesto de trabajo.",
          difficulty: "medium",
        },
        {
          front: "¿Cuáles son los 4 pilares constitutivos indispensables para que una persona desarrolle una competencia?",
          back: "1. SABER: Conocimientos teóricos e información conceptual.\n2. SABER HACER: Habilidades prácticas, destrezas técnicas y experiencia aplicada.\n3. QUERER HACER: Actitudes personales, motivación, valores y voluntad.\n4. PODER HACER: Contar con los recursos, herramientas, autoridad y contexto facilitador en la empresa.",
          difficulty: "critical",
        },
        {
          front: "¿Qué evalúa la técnica de 'Incidentes Críticos' (STAR) en la selección por competencias de Martha Alles?",
          back: "Evalúa comportamientos reales del pasado indagando la Situación enfrentada, la Tarea asignada, la Acción concreta realizada por el candidato y el Resultado obtenido, bajo la premisa de que la mejor predicción del desempeño futuro son las conductas verificables pasadas.",
          difficulty: "medium",
        },
        {
          front: "¿Cuáles son las 4 competencias clave en la industria digital destacadas por la cátedra?",
          back: "1. Análisis y Resolución de Problemas Complejos.\n2. Liderazgo de Equipos de Desarrollo (fomentar colaboración y agilidad).\n3. Liderazgo Inspiracional (visión compartida y orientación a metas).\n4. Visión Estratégica (alinear la tecnología con las oportunidades de negocio del cliente).",
          difficulty: "medium",
        },
      ],
      questions: [
        {
          question: "En el Modelo de Gestión por Competencias de Martha Alles, si un empleado tiene el título universitario (Saber), domina el lenguaje de programación (Saber Hacer) y tiene entusiasmo (Querer Hacer), pero la empresa no le da permisos en el servidor ni equipamiento para trabajar, ¿qué pilar está fallando?",
          options: [
            "Saber Conceptual",
            "Poder Hacer (Recursos, entorno y habilitación organizacional)",
            "Querer Hacer (Motivación intrínseca)",
            "Incidentes Críticos",
          ],
          answer: "Poder Hacer (Recursos, entorno y habilitación organizacional)",
          explanation: "El 'Poder Hacer' refiere a la disponibilidad de medios, facultades formales y herramientas operativas que la organización debe suministrar para que la competencia pueda ejecutarse.",
          difficulty: "easy",
        },
      ],
    },
  ];

  // 4. Crear los Topics, Flashcards y Questions en la DB
  console.log("\n📦 Insertando tópicos por Unidad y vinculando Flashcards/Preguntas...");
  const createdTopics: any[] = [];

  for (const item of curriculum) {
    const classSession = classMap.get(item.classNumber);
    if (!classSession) continue;

    const topic = await prisma.topic.create({
      data: {
        subjectId: subject.id,
        classId: classSession.id,
        name: item.topicName,
        description: item.description,
        importance: item.importance,
        masteryScore: item.masteryScore,
      },
    });

    createdTopics.push(topic);
    console.log(`  📌 [${item.unit}] Tópico creado: ${topic.name}`);

    // Crear Flashcards vinculadas al Topic
    for (const fc of item.flashcards) {
      await prisma.flashcard.create({
        data: {
          subjectId: subject.id,
          topicId: topic.id,
          front: fc.front,
          back: fc.back,
          difficulty: fc.difficulty,
          easeFactor: 2.5,
          interval: 1,
          repetitions: 0,
          nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
    }

    // Crear Preguntas vinculadas al Topic y Class
    for (const q of item.questions) {
      await prisma.question.create({
        data: {
          subjectId: subject.id,
          classId: classSession.id,
          topicId: topic.id,
          question: q.question,
          optionsJson: JSON.stringify(q.options),
          answer: q.answer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          type: "multiple_choice",
        },
      });
    }
  }

  // 5. Vincular todos los tópicos al 1er Examen Parcial Presencial Obligatorio (Unidades 1, 2 y 3)
  const exam = subject.exams.find((e) => e.title.includes("1er Examen Parcial") || e.examType === "midterm");
  if (exam) {
    console.log(`\n🎯 Vinculando ${createdTopics.length} tópicos al ${exam.title}...`);
    await prisma.examTopic.deleteMany({ where: { examId: exam.id } });

    for (const t of createdTopics) {
      await prisma.examTopic.create({
        data: {
          examId: exam.id,
          topicId: t.id,
        },
      });
    }

    // Actualizar Plan de Preparación Oficial por Unidades
    await prisma.preparationPlanItem.deleteMany({ where: { examId: exam.id } });

    const planSteps = [
      {
        order: 1,
        title: "Unidad 1: Filosofía y Cultura (Robbins), Misión/Visión y CH como Sistema (Clases 1 y 2)",
        description: "Repasar patrones de valores, culturas fuertes vs débiles, personas como asociados, los 6 subsistemas y autoridad de línea vs staff.",
        scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        order: 2,
        title: "Unidad 2: Planeamiento Estratégico (Bohlander), Porter, FODA y Caso Globant (Clases 3 y 4)",
        description: "Estudiar proceso de 5 pasos, análisis de brechas, estrategias de Costos/Diferenciación, integración vertical/horizontal y lecciones de crisis de Globant.",
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        order: 3,
        title: "Unidad 2: Employer Branding, Balance Social OIT y PyMEs vs. Sector Público (Clase 5)",
        description: "Fijar conceptos de EVP, los 5 rubros de auditoría del Balance Social OIT (2001) y particularidades de PyMEs y administración pública.",
        scheduledDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
      },
      {
        order: 4,
        title: "Unidad 3: Paradigmas (Pérez Van Morlegan), Herzberg, Liderazgo y Competencias (Clase 6)",
        description: "Dominar Teoría Bifactorial (higiénicos vs motivadores), Liderazgo situacional (Hersey & Blanchard) y Modelo de Competencias de Martha Alles (Saber, Saber Hacer, Querer, Poder y técnica STAR).",
        scheduledDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      },
      {
        order: 5,
        title: "Simulacro General de Parcial Presencial: Unidades 1, 2 y 3 Integradas",
        description: "Resolver examen de prueba con preguntas oficiales de cátedra cronometrado a 60 minutos.",
        scheduledDate: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
      },
    ];

    for (const step of planSteps) {
      await prisma.preparationPlanItem.create({
        data: {
          examId: exam.id,
          order: step.order,
          title: step.title,
          description: step.description,
          scheduledDate: step.scheduledDate,
          completed: false,
        },
      });
    }

    console.log("✅ Plan de preparación del 1er Parcial por Unidades establecido.");
  }

  console.log("\n🎉 ¡Sincronización de currícula, flashcards y preparación de examen finalizada exitosamente!");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
