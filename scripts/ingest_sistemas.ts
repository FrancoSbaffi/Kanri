import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Iniciando ingesta integral de materiales para Sistemas Digitales...");

  const subject = await prisma.subject.findFirst({
    where: { name: { contains: "Sistemas" } },
    include: {
      classes: { orderBy: { classNumber: "asc" } },
      exams: true,
    },
  });

  if (!subject) {
    throw new Error("No se encontró la materia Sistemas Digitales en la base de datos.");
  }

  console.log(`✅ Materia encontrada: ${subject.name} (ID: ${subject.id})`);

  const exam = subject.exams.find((e) => e.examType === "midterm" || e.title.includes("Parcial"));
  if (!exam) {
    console.warn("⚠️ No se encontró examen parcial específico.");
  } else {
    console.log(`🎯 Examen Parcial detectado: ${exam.title} (ID: ${exam.id})`);
  }

  // Clases 1 a 4
  const class1 = subject.classes.find((c) => c.classNumber === 1);
  const class2 = subject.classes.find((c) => c.classNumber === 2);
  const class3 = subject.classes.find((c) => c.classNumber === 3);
  const class4 = subject.classes.find((c) => c.classNumber === 4);

  if (!class1 || !class2 || !class3 || !class4) {
    throw new Error("No se encontraron las clases 1, 2, 3 o 4 para Sistemas Digitales.");
  }

  // Limpiar tópicos, preguntas y flashcards anteriores de esta materia para evitar duplicados
  console.log("\n🧹 Sincronizando tópicos, flashcards y preguntas para Sistemas Digitales...");
  await prisma.reviewSession.deleteMany({
    where: { flashcard: { subjectId: subject.id } },
  });
  await prisma.flashcard.deleteMany({
    where: { subjectId: subject.id },
  });
  await prisma.question.deleteMany({
    where: { subjectId: subject.id },
  });
  if (exam) {
    await prisma.preparationPlanItem.deleteMany({
      where: { examId: exam.id },
    });
    await prisma.examTopic.deleteMany({
      where: { examId: exam.id },
    });
  }
  await prisma.topic.deleteMany({
    where: { subjectId: subject.id },
  });

  // Materiales de cada clase
  // -------------------------------------------------------------
  // CLASE 1: OKRs, TD, Metodología ACT
  // -------------------------------------------------------------
  console.log("\n📦 Procesando Clase 1: Transformación Digital Continua, OKRs y Metodología ACT...");

  const c1File = "Clase1-SistemasDigitales_TD_OKRs.pdf";
  const c1Path = `uploads/materials/jueves_sistemas/${c1File}`;
  const c1Stat = fs.existsSync(c1Path) ? fs.statSync(c1Path) : null;

  // Registrar material primario de Clase 1
  let mat1 = await prisma.material.findFirst({
    where: { classId: class1.id, fileName: c1File },
  });
  if (!mat1) {
    mat1 = await prisma.material.create({
      data: {
        subjectId: subject.id,
        classId: class1.id,
        fileName: c1File,
        fileType: "application/pdf",
        fileSize: c1Stat ? c1Stat.size : 7130000,
        storagePath: c1Path,
      },
    });
  }

  // Registrar material complementario Discovery ACT
  const c1DiscFile = "Discovery_MVP.pdf";
  const c1DiscPath = `uploads/materials/jueves_sistemas/${c1DiscFile}`;
  const c1DiscStat = fs.existsSync(c1DiscPath) ? fs.statSync(c1DiscPath) : null;
  let mat1Disc = await prisma.material.findFirst({
    where: { classId: class1.id, fileName: c1DiscFile },
  });
  if (!mat1Disc) {
    mat1Disc = await prisma.material.create({
      data: {
        subjectId: subject.id,
        classId: class1.id,
        fileName: c1DiscFile,
        fileType: "application/pdf",
        fileSize: c1DiscStat ? c1DiscStat.size : 18000,
        storagePath: c1DiscPath,
      },
    });
  }

  // Resumen Clase 1
  await prisma.summary.deleteMany({ where: { classId: class1.id } });
  await prisma.summary.create({
    data: {
      classId: class1.id,
      materialId: mat1.id,
      title: "Resumen Académico · Clase 01: Transformación Digital Continua, OKRs y Metodología ACT",
      overview:
        "La primera clase de Sistemas Digitales aborda los pilares fundacionales de la Transformación Digital en las organizaciones modernas, articulando las dimensiones de Personas, Metodologías, Procesos de Negocio y Tecnologías. Se profundiza exhaustivamente en la metodología OKR (Objectives and Key Results), nacida con Andy Grove en Intel y potenciada por John Doerr en Google, analizando la formulación de objetivos SMART, resultados clave cuantitativos ('ir de X a Y'), la distinción entre metas comprometidas y aspiracionales (stretch goals al 70%), y el abordaje ágil ACT (Analizar, Consultar, Transformar) para el discovery de oportunidades tecnológicas.",
      detailedSummary: `## 1. Los Pilares de la Transformación Digital
La cátedra establece que la Transformación Digital no es un fin tecnológico en sí mismo, sino una metamorfosis integral de la capacidad adaptativa organizacional, sustentada en 5 pilares interconectados con el cliente en el epicentro:
1. **Personas y Cultura**: Bienestar emocional, tiempo protegido sin interrupciones, mentalidad de experimentación y asimilación de nuevas habilidades digitales.
2. **Metodologías Ágiles**: Adopción de marcos iterativos que alinean la visión estratégica con la ejecución diaria (especialmente OKRs y Scrum).
3. **Procesos de Negocio (BPM / Lean)**: Modelado, optimización y estandarización de flujos de trabajo antes de automatizar o digitalizar.
4. **Tecnologías Habilitadoras**: Arquitecturas Cloud, Minería de Procesos, Automatización Robótica (RPA), Inteligencia Artificial Generativa y Agéntica.
5. **Cliente / Usuario en el Centro**: Toda iniciativa debe traducirse en un salto cualitativo en la experiencia y entrega de valor.

---

## 2. Metodología OKR (Objectives & Key Results)
### 2.1. Genealogía y Filosofía de Cátedra
* **Origen**: Desarrollado originalmente por **Andy Grove** en Intel bajo la evolución del MBO (Management by Objectives) de Peter Drucker, y formalmente introducido en Google en 1999 por **John Doerr** (Kleiner Perkins) cuando la compañía contaba con 40 empleados.
* **Cultura Google**:
  * *"Moonshots Inspire"*: Las metas deben formularse como desafíos ambiciosos ("Stretch Goals"). Un cumplimiento del 70% al 80% se califica como excelente. Cumplir consistentemente el 100% denota falta de ambición en los objetivos.
  * *"Pulling Together"*: Los OKRs deben construirse combinando al menos un **60% Bottom-Up** (propuestos por los equipos) con un 40% Top-Down (visión directiva), sincronizándose horizontal y verticalmente.
  * *"Complete Focus"*: Por trimestre, un equipo o individuo debe definir un máximo de **3 a 5 Objetivos**, cada uno respaldado por **3 a 4 Resultados Clave** medibles y verificables.

### 2.2. Anatomía de los Componentes
* **Objetivo (O) - El Propósito**:
  * Responde a: *¿Qué queremos lograr? ¿Para qué lo hacemos?*
  * Naturaleza cualitativa, inspiradora, concreta y desafiante. Cumple el estándar SMART (Específico, Medible, Alcanzable, Relevante y Temporal).
* **Resultados Claves (KRs) - Los Hitos Comprometidos**:
  * Responde a: *¿Cómo sabemos que lo hemos logrado?*
  * Fórmula de cátedra: **"Ir de X a Y para la fecha Z"**.
  * Cuantitativos, agresivos pero realistas, verificables objetivamente sin lugar a ambigüedades.

### 2.3. Tipología de OKRs
1. **Según el Responsable**:
   * *OKR de Empresa*: Gran propósito global anual de la organización.
   * *OKR de Gerencia*: Despliegue funcional departamental.
   * *OKR de Equipo / Célula (Squad)*: Objetivos compartidos por un equipo multidisciplinario.
   * *OKR Individual*: Compromisos puntuales del colaborador.
2. **Según el Tipo de Promesa**:
   * **Comprometidos**: Exigen el **100% de cumplimiento** estricto (ej. lanzamientos legales, disponibilidad de infraestructura crítica, hitos contractuales).
   * **Aspiracionales (Stretch Goals)**: Metas de alta incertidumbre y disrupción donde alcanzar el **70% es un éxito resonante** e impulsa la innovación.
   * **Mixtos**: Combinación ponderada dentro de un mismo período.

### 2.4. Estructura en Cascada y Relación con KPIs
$$\\text{Visión / Misión} \\longrightarrow \\text{Objetivo Global Anual} \\longrightarrow \\text{OKRs Trimestrales} \\longrightarrow \\text{KRs} \\longrightarrow \\text{Acciones Clave (KAs)} \\longrightarrow \\text{KPIs}$$
* **Diferencia Crítica OKR vs. KPI**: El KPI es el tablero de instrumentos que mide el estado de salud operativo continuo de un proceso (*Business as Usual*). El OKR es la palanca de cambio estratégico que define hacia dónde debe transformarse la organización en un período determinado.

### 2.5. Los 5 Pasos para Construir OKRs
1. **Contexto**: Alinear la dimensión Emocional (sin interrupciones), Material (herramientas colaborativas) y la Intención (horizonte temporal y nivel).
2. **Creatividad (Brainstorming)**: Lluvia de ideas sin juzgar sobre qué movería la aguja de la organización.
3. **Jerarquización**: Priorizar por impacto real y descartar lo que no representa una transformación significativa.
4. **Borrador**: Redactar bajo el formato estricto de Objetivos SMART y KRs cuantitativos.
5. **Mis OKRs**: Validación cruzada, compromiso público y medición continua.

### 2.6. Clasificación de Métricas en los KRs
* **Métricas de Resultado**: Hitos determinísticos obligatorios (*¿Se entregó la versión productiva o no?*).
* **Métricas de Acción**: Hábitos operativos recurrentes (*Estudiar 10 hs semanales, realizar 3 reuniones de alineación*).
* **Métricas de Rendimiento**:
  * *Calidad*: Tasa de errores, defectos por release, NPS.
  * *Económicas*: Reducción de costos fijos, incremento de ingresos.
  * *Velocidad*: Tiempo de entrega (lead time), latencia de respuesta, SLA.
  * *Tasas*: Porcentaje de conversión, adherencia, porcentaje de automatización.

---

## 3. Metodología ACT y Discovery de Oportunidades
Para operacionalizar la transformación y adopción de tecnologías exponenciales (RPA + IA), la cátedra introduce la metodología **ACT (Analizar, Consultar, Transformar)** basada en Design Thinking:
1. **Analizar**: Identificar las necesidades estratégicas mediante OKRs gerenciales. Analizar los flujos de trabajo actuales (*As-Is*) determinando repetitividad, volumen, headcount y puntos de dolor.
2. **Consultar**: Entrevistar a los *Key Users* y mapear los procesos en la **Matriz de Priorización de Cátedra**:
   * *Victorias Rápidas (Quick Wins)*: Alto impacto de negocio, Baja complejidad técnica $\\rightarrow$ Prioridad 1 inmediata para generar tracción.
   * *Grandes Metas*: Alto impacto de negocio, Alta complejidad $\\rightarrow$ Planificar como MVP iterativo.
   * *Eliminar / Desestimar*: Bajo impacto de negocio, Alta complejidad $\\rightarrow$ Descartar de inmediato.
   * *Definir*: Bajo impacto, Baja complejidad $\\rightarrow$ Evaluar conveniencia.
3. **Transformar**: Prototipar la arquitectura de solución To-Be, calcular el ROI y desplegar el MVP validado por métricas operativas y estratégicas.`,
      simplifiedExplanation:
        "Pensá en la transformación digital como un viaje en barco: la brújula son los OKRs (que te dicen hacia qué puerto ambicioso querés llegar y cómo medir si avanzás semana a semana), los remos son las metodologías ágiles y las personas, el casco del barco son los procesos de negocio bien diseñados, y el motor de propulsión es la tecnología (Cloud, IA, RPA). Si ponés un motor potente en un casco roto, el barco se hunde más rápido: por eso primero se analizan y optimizan los procesos antes de programar.",
      keyPointsJson: JSON.stringify([
        "La Transformación Digital descansa en 5 pilares: Personas/Cultura, Metodologías, Procesos de Negocio, Tecnologías y Cliente.",
        "Los OKRs fueron creados por Andy Grove en Intel y popularizados por John Doerr en Google en 1999 (11.8M USD de inversión).",
        "Filosofía de Google: Moonshots (70-80% de cumplimiento es excelente), 60% Bottom-Up y enfoque en máximo 5 Objetivos con 4 KRs.",
        "Objetivo (O) responde a '¿Qué queremos lograr?' (cualitativo y SMART). Resultados Clave (KRs) responden a '¿Cómo lo medimos?' (ir de X a Y).",
        "Diferencia fundamental: OKR Comprometido (100% de cumplimiento exigido) vs. OKR Aspiracional (Stretch Goal al 70%).",
        "Los 5 pasos para crear OKRs: Contexto -> Creatividad (Brainstorming) -> Jerarquización -> Borrador -> Mis OKRs.",
        "Métricas de KRs: Métricas de Resultado (hitos), Métricas de Acción (hábitos) y Métricas de Rendimiento (calidad, costo, velocidad, tasas).",
        "Metodología ACT: Analizar (OKRs y As-Is), Consultar (Key Users y Matriz de Priorización Quick Wins), Transformar (To-Be, ROI y MVP).",
      ]),
      definitionsJson: JSON.stringify([
        {
          term: "OKR (Objectives & Key Results)",
          definition:
            "Marco metodológico de gestión estratégica que alinea esfuerzos organizacionales conectando objetivos cualitativos e inspiradores con resultados clave cuantitativos y medibles en ciclos trimestrales.",
        },
        {
          term: "Stretch Goal (Meta Aspiracional)",
          definition:
            "Objetivo de alta ambición e innovación en el cual un cumplimiento del 70% al 80% es considerado un éxito rotundo, fomentando que los equipos asuman riesgos sin temor al fracaso.",
        },
        {
          term: "Fórmula de KR (Ir de X a Y para fecha Z)",
          definition:
            "Regla formal de redacción de resultados clave donde X es el valor base actual, Y es el valor meta proyectado y Z es la fecha límite improrrogable.",
        },
        {
          term: "Metodología ACT",
          definition:
            "Abordaje metodológico ágil basado en Design Thinking compuesto por tres fases consecutivas: Analizar los flujos críticos, Consultar a los usuarios clave y Transformar el modelo operativo mediante MVP.",
        },
        {
          term: "Matriz de Priorización de Procesos",
          definition:
            "Herramienta de diagnóstico que cruza Impacto en el Negocio vs. Complejidad Técnica para identificar Quick Wins (Alto Impacto / Baja Complejidad) y descartar iniciativas de bajo retorno.",
        },
      ]),
      examplesJson: JSON.stringify([
        {
          title: "Ejemplo de Cátedra: Certificación de Arquitecto Cloud AWS",
          description:
            "Objetivo: Ser experto certificado en la nube de AWS en el rol Solution Architect para Diciembre 2024. KR1 (Resultado): Obtener certificación profesional para Septiembre con +80% de puntaje. KR2 (Acción): Estudiar al menos 10 hs semanales. KR3 (Rendimiento): Liderar entre 2 y 4 proyectos de implementación con duración no mayor a 1 mes por proyecto.",
        },
        {
          title: "Ejemplo de Cátedra: Optimización en Cuentas a Pagar con RPA",
          description:
            "Objetivo: Reasignar en Diciembre los 2 recursos humanos dedicados a Gestión de Proveedores hacia Cuentas a Pagar. KR1: Automatizar el 100% del envío de estado de cuenta y retención a los 500 proveedores. KR2: Capacitar a los 2 recursos en Cuentas a Pagar (3 veces x semana, 4 hs/día hasta 48 hs). KR3: Transferir al Help Desk las incidencias y reclamos.",
        },
      ]),
      commonMistakesJson: JSON.stringify([
        {
          mistake: "Confundir un Resultado Clave (KR) con una Tarea o Acción Clave (KA)",
          explanation:
            "Un KR nunca es simplemente 'Hacer una reunión' o 'Escribir código'. Un KR debe medir el impacto o resultado verificable ('Alcanzar 99.9% de uptime' o 'Reducir de 45 a 10 minutos el tiempo de procesamiento').",
        },
        {
          mistake: "Tratar a los OKRs Aspiracionales como si fueran Comprometidos",
          explanation:
            "Si se penaliza a un equipo por alcanzar un 75% en un OKR aspiracional, se destruye la cultura de innovación y moonshots, provocando que los equipos fijen metas mediocres y fáciles de lograr.",
        },
        {
          mistake: "Crear OKRs de forma 100% Top-Down (impuestos por la dirección)",
          explanation:
            "La cátedra enfatiza que al menos el 60% de los OKRs deben originarse de abajo hacia arriba (Bottom-Up) desde los equipos operativos que conocen los cuellos de botella reales.",
        },
      ]),
      aiModel: "Antigravity Academic Engine",
    },
  });

  // Tópicos Clase 1
  const t1 = await prisma.topic.create({
    data: {
      subjectId: subject.id,
      classId: class1.id,
      name: "Unidad 1 y 2 · Transformación Digital Continua y Metodología OKR (Andy Grove & John Doerr)",
      description: "Pilares de TD, genealogía de OKRs en Intel/Google, objetivos SMART, KRs ('ir de X a Y'), metas comprometidas vs aspiracionales (stretch goals al 70%).",
      importance: "critical",
      masteryScore: 50,
    },
  });

  const t2 = await prisma.topic.create({
    data: {
      subjectId: subject.id,
      classId: class1.id,
      name: "Unidad 1 y 2 · Métricas de KRs (Resultado, Acción, Rendimiento) y Metodología ACT / Discovery",
      description: "Tipos de métricas, 5 pasos de construcción de OKRs, metodología ACT (Analizar, Consultar, Transformar) y matriz de priorización Quick Wins.",
      importance: "critical",
      masteryScore: 50,
    },
  });

  // -------------------------------------------------------------
  // CLASE 2: Arquitectura de Software y Atributos de Calidad
  // -------------------------------------------------------------
  console.log("\n📦 Procesando Clase 2: Arquitectura de Software, Atributos de Calidad y Principios de Diseño...");

  const c2File1 = "Universidad Ciudad de BA - 1) Introduccion a las Arqu.pdf";
  const c2Path1 = `uploads/materials/jueves_sistemas/${c2File1}`;
  const c2Stat1 = fs.existsSync(c2Path1) ? fs.statSync(c2Path1) : null;

  let mat2_1 = await prisma.material.findFirst({
    where: { classId: class2.id, fileName: c2File1 },
  });
  if (!mat2_1) {
    mat2_1 = await prisma.material.create({
      data: {
        subjectId: subject.id,
        classId: class2.id,
        fileName: c2File1,
        fileType: "application/pdf",
        fileSize: c2Stat1 ? c2Stat1.size : 1045000,
        storagePath: c2Path1,
      },
    });
  }

  const c2File2 = "Universidad Ciudad de BA - 2) Requerimientos, Atribut.pdf";
  const c2Path2 = `uploads/materials/jueves_sistemas/${c2File2}`;
  const c2Stat2 = fs.existsSync(c2Path2) ? fs.statSync(c2Path2) : null;

  let mat2_2 = await prisma.material.findFirst({
    where: { classId: class2.id, fileName: c2File2 },
  });
  if (!mat2_2) {
    mat2_2 = await prisma.material.create({
      data: {
        subjectId: subject.id,
        classId: class2.id,
        fileName: c2File2,
        fileType: "application/pdf",
        fileSize: c2Stat2 ? c2Stat2.size : 443000,
        storagePath: c2Path2,
      },
    });
  }

  // Resumen Clase 2
  await prisma.summary.deleteMany({ where: { classId: class2.id } });
  await prisma.summary.create({
    data: {
      classId: class2.id,
      materialId: mat2_1.id,
      title: "Resumen Académico · Clase 02: Arquitectura de Software, Atributos de Calidad y Escenarios",
      overview:
        "La Clase 02 formaliza la disciplina de la Arquitectura de Software como el conjunto de decisiones fundamentales e irreversibles que estructuran un sistema computacional. Se estudian la definición formal de arquitectura según los estándares IEEE y el SEI (Bass, Clements y Kazman), los tipos de arquitectura (monolítica, por capas, orientada a microservicios y dirigida por eventos), y se profundiza de forma rigurosa en los Atributos de Calidad (Requerimientos No Funcionales): Disponibilidad, Rendimiento, Modificabilidad, Seguridad, Testabilidad y Usabilidad, concluyendo con la formulación canónica de los 6 componentes de un Escenario de Calidad.",
      detailedSummary: `## 1. Definición Formal de Arquitectura de Software
La cátedra adopta la definición canónica de la disciplina (basada en el Software Engineering Institute y el estándar IEEE 1471):
> *"Una arquitectura es el conjunto de decisiones significativas sobre la organización de un sistema de software que define los principios que guían el desarrollo, los componentes principales del sistema, sus responsabilidades, las relaciones e interacciones entre ellos, y las restricciones que gobiernan su evolución a lo largo del tiempo."*

### Decisiones Arquitectónicas
* Son decisiones **estructuradas, de alto impacto y de costo elevado de modificación**.
* Determinan qué componentes existen en el sistema, cómo se comunican (sincrónica o asincrónicamente), dónde residen los datos y cómo se satisfacen los requerimientos no funcionales.

---

## 2. El Proceso de Arquitectura
El ciclo arquitectónico comprende:
1. **Comprensión de Requerimientos**: Identificación de drivers arquitectónicos (funcionalidades clave del negocio vs. restricciones del entorno vs. atributos de calidad).
2. **Diseño Conceptual**: Selección de patrones y estilos arquitectónicos (Monolito, N-Capas, Microservicios, Event-Driven).
3. **Selección de Tácticas**: Mecanismos de diseño específicos para satisfacer cada atributo de calidad.
4. **Evaluación de la Arquitectura**: Métodos formales (como ATAM) para analizar compromisos (*trade-offs*) entre atributos en conflicto (ej. mayor seguridad suele degradar el rendimiento).
5. **Documentación Formal**: Vistas arquitectónicas (Lógica, de Proceso, de Desarrollo, Física/Despliegue).

---

## 3. Tipos y Estilos de Arquitectura
* **Monolítica**: Toda la funcionalidad empaquetada en una sola unidad desplegable. Alta cohesión interna inicial, pero difícil escalabilidad independiente y alto riesgo de fallo global.
* **Arquitectura en Capas (N-Tier)**: Organización jerárquica con dependencias unidireccionales (Presentación $\\rightarrow$ Lógica de Negocio $\\rightarrow$ Acceso a Datos / Persistencia). Facilita el desacoplamiento y mantenimiento.
* **Microservicios**: Conjunto de servicios pequeños, autónomos, desplegables independientemente, organizados por capacidades de negocio y comunicados mediante APIs livianas o eventos.
* **Basada en Eventos (Event-Driven)**: Componentes desacoplados temporalmente que emiten y reaccionan a eventos mediante brokers (Kafka, RabbitMQ), maximizando la escalabilidad y disponibilidad.

---

## 4. Requerimientos No Funcionales y Atributos de Calidad
Los atributos de calidad definen **cómo** opera el sistema frente a estímulos externos e internos. Son determinísticos o probabilísticos y deben cuantificarse:
1. **Disponibilidad (Availability)**:
   * Capacidad del sistema de estar en estado operativo y prestar servicio cuando se lo requiere.
   * Se mide en porcentajes de tiempo activo (SLA: 99.9% o "tres nueves", MTBF - tiempo medio entre fallas, MTTR - tiempo medio de recuperación). Tácticas: redundancia activa/pasiva, heartbeat, failover automático.
2. **Rendimiento (Performance)**:
   * Capacidad del sistema de responder dentro de restricciones de tiempo ante cargas específicas.
   * Se mide en latencia (tiempo de respuesta en milisegundos), throughput (transacciones por segundo - TPS) y utilización de CPU/Memoria. Tácticas: caching distribuido, balanceo de carga, procesamiento concurrente.
3. **Modificabilidad (Modifiability)**:
   * Facilidad y costo con el que el software puede incorporar cambios, refactorizaciones o extensiones.
   * Se mide en tiempo y costo monetario de implementar una modificación sin introducir efectos secundarios. Tácticas: bajo acoplamiento, alta cohesión, encapsulamiento de dependencias mediante interfaces.
4. **Seguridad (Security)**:
   * Capacidad del sistema de resistir intentos maliciosos de acceso o alteración y garantizar la confidencialidad, integridad y disponibilidad de la información.
   * Tácticas: autenticación multifactor, autorización basada en roles (RBAC), cifrado de datos en reposo y en tránsito (TLS), auditoría inmutable.
5. **Testabilidad (Testability)**:
   * Facilidad con la que el software permite descubrir fallas mediante pruebas automatizadas.
   * Se mide en cobertura de código (code coverage), controlabilidad y observabilidad. Tácticas: inyección de dependencias, interfaces mockeables, separación de estados.
6. **Usabilidad (Usability)**:
   * Facilidad con la que los usuarios pueden aprender a usar el sistema, alcanzar sus metas eficientemente y recuperarse de errores humanos.

---

## 5. Especificación Formal de un Escenario de Calidad
Para evitar la ambigüedad de frases como "el sistema debe ser rápido y seguro", la cátedra exige especificar cada atributo mediante un **Escenario de Atributo de Calidad** compuesto por 6 partes obligatorias:
1. **Fuente del Estímulo**: La entidad generadora del evento (ej. usuario final, sistema externo, atacante, sensor, falla interna).
2. **Estímulo**: La condición o suceso que arriba al sistema (ej. solicitud de compra, intento de inyección SQL, caída súbita de un nodo).
3. **Artefacto**: La porción del sistema que recibe y procesa el estímulo (ej. API Gateway, base de datos de usuarios, servicio de autenticación).
4. **Entorno**: Las condiciones operativas en las que se encuentra el sistema al llegar el estímulo (ej. operación normal, pico de tráfico del Black Friday, modo de recuperación).
5. **Respuesta**: La acción o comportamiento que el artefacto debe manifestar frente al estímulo (ej. autenticar al usuario, aislar la transacción, denegar acceso y alertar a seguridad).
6. **Medida de la Respuesta**: El umbral cuantitativo que determina el éxito del escenario (ej. *"en menos de 150 ms para el 95% de las peticiones"*, *"cero pérdida de datos"*, *"recuperación total en menos de 30 segundos"*).`,
      simplifiedExplanation:
        "La arquitectura de software es como los planos estructurales de un edificio: una cosa son los muebles o la pintura (que podés cambiar en cualquier momento sin riesgo), y otra muy distinta son las columnas maestras, los cimientos y las cañerías centrales. Si te equivocás en los cimientos, tirar abajo el edificio cuesta millones. Los atributos de calidad son los requerimientos que te dicen si el edificio soporta terremotos (disponibilidad), si tiene salidas de emergencia rápidas (rendimiento) o si tiene cerraduras blindadas (seguridad).",
      keyPointsJson: JSON.stringify([
        "La arquitectura de software es el conjunto de decisiones estructurales de alto impacto y elevado costo de cambio.",
        "Se diferencia el diseño arquitectónico (global, cimientos) del diseño detallado de bajo nivel (clases, funciones).",
        "Los Atributos de Calidad son los Requerimientos No Funcionales determinísticos o probabilísticos cuantificables.",
        "Los 6 atributos cardinales: Disponibilidad, Rendimiento, Modificabilidad, Seguridad, Testabilidad y Usabilidad.",
        "Conflicto de Atributos (Trade-offs): optimizar un atributo suele degradar otro (ej. mayor encriptación y seguridad incrementa la latencia y reduce el rendimiento).",
        "Los 6 componentes canónicos del Escenario de Calidad: Fuente del Estímulo, Estímulo, Artefacto, Entorno, Respuesta y Medida de la Respuesta.",
        "Una medida de respuesta debe ser siempre numérica y verificable (ej. tiempo de respuesta < 200ms, SLA 99.99%).",
      ]),
      definitionsJson: JSON.stringify([
        {
          term: "Arquitectura de Software",
          definition:
            "Conjunto de decisiones significativas sobre la organización de un sistema de software, sus componentes principales, responsabilidades, relaciones e interacciones, y principios que guían su evolución.",
        },
        {
          term: "Atributo de Calidad",
          definition:
            "Propiedad no funcional cuantificable de un sistema que describe la calidad de su servicio ante estímulos operativos (ej. disponibilidad, rendimiento, seguridad).",
        },
        {
          term: "Escenario de Calidad",
          definition:
            "Especificación precisa de un requerimiento no funcional estructurada en 6 partes: fuente, estímulo, artefacto, entorno, respuesta y medida objetiva de respuesta.",
        },
        {
          term: "Trade-off Arquitectónico",
          definition:
            "Compromiso de diseño en el cual se sacrifica parcialmente el nivel de un atributo de calidad para optimizar otro de mayor prioridad estratégica para el negocio.",
        },
      ]),
      examplesJson: JSON.stringify([
        {
          title: "Ejemplo de Escenario de Rendimiento de Cátedra",
          description:
            "Fuente: Usuario final en la Web. Estímulo: Envía orden de compra con pago electrónico. Artefacto: Microservicio de Checkout y Pasarela de Cobros. Entorno: Carga normal de operaciones (500 transacciones concurrentes). Respuesta: Procesa la transacción y confirma el cobro. Medida de Respuesta: Latencia total menor a 800 milisegundos en el percentil 99.",
        },
        {
          title: "Ejemplo de Escenario de Disponibilidad de Cátedra",
          description:
            "Fuente: Falla física en el centro de datos. Estímulo: Caída inesperada del servidor de base de datos primario. Artefacto: Clúster de bases de datos. Entorno: Horario de alta demanda operativa. Respuesta: Conmutación por error (failover) a la réplica secundaria sin desconectar a los usuarios activos. Medida de Respuesta: Tiempo de recuperación total (RTO) menor a 15 segundos sin inconsistencia de transacciones.",
        },
      ]),
      commonMistakesJson: JSON.stringify([
        {
          mistake: "Redactar atributos de calidad sin una medida cuantitativa medible",
          explanation:
            "Escribir 'el sistema debe ser muy seguro' o 'debe ser rápido' es un error grave en exámenes. Debe especificarse el escenario completo con métricas exactas (ej. 'recuperación en < 30 seg', 'latencia < 200 ms').",
        },
        {
          mistake: "Confundir Requerimiento Funcional con Requerimiento No Funcional",
          explanation:
            "'El usuario puede pagar con tarjeta' es un requerimiento funcional. 'El pago debe procesarse en menos de 1 segundo con cifrado TLS 1.3 y disponibilidad 99.9%' es el atributo de calidad no funcional.",
        },
      ]),
      aiModel: "Antigravity Academic Engine",
    },
  });

  // Tópicos Clase 2
  const t3 = await prisma.topic.create({
    data: {
      subjectId: subject.id,
      classId: class2.id,
      name: "Unidad 6 · Fundamentos de Arquitectura de Software, Estilos y Patrones Arquitectónicos",
      description: "Definición formal IEEE/SEI, proceso de diseño, estilos monolítico, en capas (N-Tier), microservicios y event-driven.",
      importance: "critical",
      masteryScore: 50,
    },
  });

  const t4 = await prisma.topic.create({
    data: {
      subjectId: subject.id,
      classId: class2.id,
      name: "Unidad 6 · Atributos de Calidad (Disponibilidad, Rendimiento, Modificabilidad, Seguridad, Testabilidad)",
      description: "Requerimientos no funcionales cuantificables, métricas objetivas y análisis de trade-offs arquitectónicos en conflicto.",
      importance: "critical",
      masteryScore: 50,
    },
  });

  const t5 = await prisma.topic.create({
    data: {
      subjectId: subject.id,
      classId: class2.id,
      name: "Unidad 6 · Especificación de Escenarios de Calidad (Fuente, Estímulo, Entorno, Artefacto, Respuesta y Medida)",
      description: "Los 6 componentes canónicos del escenario de calidad del Software Engineering Institute (Bass, Clements, Kazman).",
      importance: "critical",
      masteryScore: 50,
    },
  });

  // -------------------------------------------------------------
  // CLASE 3: BPM y Automatización con RPA
  // -------------------------------------------------------------
  console.log("\n📦 Procesando Clase 3: Transformación Digital y Automatización de Procesos (BPM - RPA)...");

  const c3File = "Clase-SistemasDigitales_RPA_Q2.pdf";
  const c3Path = `uploads/materials/jueves_sistemas/${c3File}`;
  const c3Stat = fs.existsSync(c3Path) ? fs.statSync(c3Path) : null;

  let mat3 = await prisma.material.findFirst({
    where: { classId: class3.id, fileName: c3File },
  });
  if (!mat3) {
    mat3 = await prisma.material.create({
      data: {
        subjectId: subject.id,
        classId: class3.id,
        fileName: c3File,
        fileType: "application/pdf",
        fileSize: c3Stat ? c3Stat.size : 4800000,
        storagePath: c3Path,
      },
    });
  }

  // Resumen Clase 3
  await prisma.summary.deleteMany({ where: { classId: class3.id } });
  await prisma.summary.create({
    data: {
      classId: class3.id,
      materialId: mat3.id,
      title: "Resumen Académico · Clase 03: Transformación Digital y Automatización de Procesos (BPM y RPA)",
      overview:
        "La Clase 03 analiza la automatización operativa de procesos empresariales integrando la visión macro de BPM (Business Process Management) con la tecnología táctica de RPA (Robotic Process Automation). Se detallan las características que hacen viable la robotización de una tarea (reglas claras, alto volumen, datos estructurados, tareas fuera de horario y propensión a error humano), las herramientas de relevamiento como el diagrama PEPSU y el documento de definición PDD (Process Definition Document), los roles en células ágiles (Process Owner, Product Owner, Key User, Analista, DevOps) y la arquitectura integral de plataformas RPA compuesta por Orquestador, Servidores de Bots y Conectores.",
      detailedSummary: `## 1. Fundamentos de RPA (Robotic Process Automation)
RPA es una tecnología de software que permite configurar robots virtuales ("bots") para emular las acciones humanas sobre las interfaces gráficas (UI) y capas de aplicación de los sistemas existentes:
* **Naturaleza No Invasiva**: No altera la arquitectura profunda ni las bases de datos de los sistemas legados (*legacy*); opera como un usuario humano de alta velocidad y precisión.
* **Integración con BPM**: Mientras que **BPM** rediseña y optimiza el proceso de negocio de extremo a extremo (*End-to-End*), **RPA** automatiza tareas transaccionales repetitivas dentro de dicho flujo.

---

## 2. Criterios de Selección y Priorización de Procesos
La cátedra destaca que no todo proceso debe automatizarse con RPA ("automatizar un proceso defectuoso solo genera errores a mayor velocidad"). Los procesos elegibles deben cumplir:
1. **Basados en Reglas Claras**: Decisiones binarias o árboles lógicos determinísticos sin ambigüedad ni criterio subjetivo.
2. **Alto Volumen y Frecuencia**: Actividades que se ejecutan cientos o miles de veces por día/semana.
3. **Entradas de Datos Estructuradas**: Formularios digitales, planillas Excel, archivos CSV, bases de datos o mensajes estandarizados (si son documentos no estructurados, se requiere OCR previo o IA generativa).
4. **Tareas Fuera de Horario Habitual**: Cierres contables nocturnos, conciliaciones bancarias de fin de semana, procesamiento batch 24/7.
5. **Propensos a Error Humano**: Carga manual de datos entre sistemas no integrados (*swivel chair automation*), generación de duplicados o tipeo reiterativo.

### Matriz de Diagnóstico y Ranking
La cátedra utiliza una tabla de puntuación ponderada para ranquear procesos en base a: volumen transaccional, impacto económico, tiempo de desarrollo, criticidad operativa y estabilidad del sistema de origen.

---

## 3. Artefactos Metodológicos del Ciclo RPA
1. **Diagrama PEPSU (SIPOC)**:
   * **P**roveedores: Quién suministra la información de entrada.
   * **E**ntradas: Documentos, mails, registros o archivos recibidos.
   * **P**rocesos: Secuencia macro de pasos y actividades.
   * **S**alidas: Documentos generados, registros actualizados, mails enviados.
   * **U**suarios / Clientes: Quién recibe el resultado del proceso.
2. **PDD (Process Definition Document)**:
   * Documento canónico de relevamiento donde el Analista de Procesos y el Key User describen detalladamente el flujo actual (**As-Is**), capturan pantallas, definen las reglas de negocio, identifican excepciones (de negocio y de sistema) y proyectan el flujo automatizado (**To-Be**).

---

## 4. Roles y Organización en Células de Automatización
* **Process Owner (Gerente / Director)**: Dueño del proceso de negocio y patrocinador estratégico (*Stakeholder*). Define los OKRs de alto nivel (ej. reducir costos fijos o reasignar personal a tareas de mayor valor) y aprueba el Business Case.
* **Product Owner / Key User**: Experto operativo del día a día. Conoce los detalles de las pantallas y excepciones, valida el PDD y realiza las pruebas de aceptación de usuario (UAT).
* **Analista de Procesos**: Modela el proceso en PEPSU, redacta el PDD, calcula el ROI de la automatización y facilita el alineamiento entre negocio y tecnología.
* **DevOps / RPA Developer**: Diseña, programa y depura los flujos en la plataforma RPA (Power Automate, UiPath, etc.) e implementa las mejoras lógicas y tecnológicas.
* **SysOps**: Administra la infraestructura de servidores de bots (*Bot Servers*), entornos (Dev, QA, Prod), licencias y monitorea las alertas del orquestador.

---

## 5. Arquitectura Típica de una Solución RPA
Una solución empresarial de RPA se estructura en 3 niveles:
1. **El Orquestador (Cloud / Server)**:
   * Es el núcleo central de gestión.
   * Administra la asignación de trabajo a los robots y gestiona **colas de trabajo (Work Queues)**.
   * Maneja **Disparadores (Triggers)**:
     * *Automatizados (por evento)*: Se ejecutan ante la llegada de un mail, un archivo en Dropbox/OneDrive o una llamada API.
     * *Programados (Scheduled)*: Ejecución por calendario cron (ej. todos los días a las 02:00 AM).
     * *Instantáneos (a demanda)*: Disparados manualmente por un usuario con un botón.
   * Supervisión en tiempo real, auditoría inmutable, control de credenciales cifradas y escalabilidad paralela.
2. **Los Servidores de Bots (Bot Servers / Runtime)**:
   * Máquinas virtuales o servidores físicos donde corre el agente ejecutor (*Bot Agent*).
   * *Robots Atendidos (Attended)*: Corren en la máquina del usuario y requieren interacción humana para iniciar o resolver excepciones.
   * *Robots Desatendidos (Unattended)*: Operan en servidores dedicados en segundo plano sin intervención humana.
3. **Conectores y Ecosistema de Integración**:
   * Conexiones predefinidas y seguras mediante TLS a ERPs (SAP, SAP S/4HANA), CRMs, bases de datos (SQL), servicios de mensajería (Slack, Teams) y APIs REST.`,
      simplifiedExplanation:
        "RPA es como contratar a un asistente virtual infatigable que nunca duerme, no se equivoca al copiar y pegar datos, y hace en 2 segundos lo que a un humano le toma 20 minutos. Sin embargo, no podés poner un robot a decidir cosas complejas o ambiguas: el robot solo sigue reglas lógicas estrictas ('si el mail trae una factura en PDF, abrí el ERP y cargá el importe'). El Orquestador es el jefe de la oficina que le reparte el trabajo a cada robot y vigila que ninguno se quede sin tareas.",
      keyPointsJson: JSON.stringify([
        "RPA es una tecnología no invasiva que emula la interacción humana sobre interfaces gráficas y aplicaciones existentes.",
        "BPM optimiza el proceso de punta a punta (End-to-End); RPA automatiza tareas transaccionales repetitivas dentro de él.",
        "Criterios de viabilidad RPA: basado en reglas, alto volumen, datos estructurados, fuera de horario, propenso a error humano.",
        "Artefactos clave: PEPSU (Proveedores, Entradas, Procesos, Salidas, Usuarios) y PDD (Process Definition Document As-Is y To-Be).",
        "Roles clave: Process Owner (estrategia y OKRs), Key User (operación y UAT), Analista (PDD y ROI), DevOps (desarrollo RPA).",
        "Arquitectura RPA: Orquestador (colas, triggers, seguridad) -> Bot Servers (agentes ejecutores atendidos o desatendidos) -> Conectores.",
        "Tipos de disparadores: Programados (por hora/calendario), Automatizados (por evento/archivo/mail) e Instantáneos (a demanda).",
      ]),
      definitionsJson: JSON.stringify([
        {
          term: "RPA (Robotic Process Automation)",
          definition:
            "Tecnología de automatización por software que utiliza robots virtuales para replicar acciones humanas repetitivas basadas en reglas en interfaces de usuario y sistemas computacionales.",
        },
        {
          term: "Orquestador RPA",
          definition:
            "Plataforma centralizada de servidor o nube que coordina, programa, monitorea, audita y asigna colas de trabajo a los robots de software desplegados en la organización.",
        },
        {
          term: "PDD (Process Definition Document)",
          definition:
            "Documento formal de especificación que detalla minuciosamente el estado actual del proceso (As-Is), los requerimientos de automatización y el diseño operativo propuesto (To-Be).",
        },
        {
          term: "Robot Desatendido (Unattended Bot)",
          definition:
            "Robot de software que ejecuta procesos automatizados en servidores dedicados de forma autónoma en segundo plano, sin requerir la presencia ni intervención de un operador humano.",
        },
      ]),
      examplesJson: JSON.stringify([
        {
          title: "Caso de Cátedra: Envío Masivo de Estados de Cuenta de Proveedores",
          description:
            "Un proceso manual donde 2 personas descargaban extractos del ERP, conciliaban retenciones impositivas y enviaban correos a 500 proveedores. Se automatizó con un robot desatendido que se ejecuta los días 1 y 15 de cada mes a las 03:00 AM, reduciendo el error a cero y liberando 48 horas mensuales de personal calificado.",
        },
      ]),
      commonMistakesJson: JSON.stringify([
        {
          mistake: "Intentar automatizar con RPA un proceso caótico y sin reglas estables",
          explanation:
            "La cátedra recalca que 'automatizar el caos solo produce caos más rápido'. Primero se debe estandarizar y modelar el proceso mediante BPM y PEPSU, y recién cuando está estable se robotiza.",
        },
        {
          mistake: "Ignorar la gestión de excepciones de negocio en el PDD",
          explanation:
            "Un bot sin manejo de excepciones falla y se detiene ante el primer dato imprevisto. El PDD debe contemplar qué hacer cuando un dato falta, el formato no coincide o el sistema de origen no responde.",
        },
      ]),
      aiModel: "Antigravity Academic Engine",
    },
  });

  // Tópicos Clase 3
  const t6 = await prisma.topic.create({
    data: {
      subjectId: subject.id,
      classId: class3.id,
      name: "Unidad 3 · Automatización Robótica de Procesos (RPA) vs. Gestión de Procesos de Negocio (BPM)",
      description: "Concepto de RPA no invasivo, emulación de tareas humanas sobre UI/APIs, complementariedad con BPM end-to-end.",
      importance: "critical",
      masteryScore: 50,
    },
  });

  const t7 = await prisma.topic.create({
    data: {
      subjectId: subject.id,
      classId: class3.id,
      name: "Unidad 3 · Criterios de Selección, Artefactos PEPSU/PDD y Arquitectura de Plataformas RPA",
      description: "Criterios de viabilidad (reglas, volumen, datos estructurados), roles en la célula, diagramas PEPSU/SIPOC, PDD As-Is/To-Be y Orquestador.",
      importance: "critical",
      masteryScore: 50,
    },
  });

  // -------------------------------------------------------------
  // CLASE 4: Blockchain y Finanzas Descentralizadas (DeFi)
  // -------------------------------------------------------------
  console.log("\n📦 Procesando Clase 4: Blockchain, Contratos Inteligentes y Finanzas Descentralizadas (DeFi)...");

  const c4File = "Defi-2026  -  v2.pdf";
  const c4Path = `uploads/materials/jueves_sistemas/${c4File}`;
  const c4Stat = fs.existsSync(c4Path) ? fs.statSync(c4Path) : null;

  let mat4 = await prisma.material.findFirst({
    where: { classId: class4.id, fileName: c4File },
  });
  if (!mat4) {
    mat4 = await prisma.material.create({
      data: {
        subjectId: subject.id,
        classId: class4.id,
        fileName: c4File,
        fileType: "application/pdf",
        fileSize: c4Stat ? c4Stat.size : 1977000,
        storagePath: c4Path,
      },
    });
  }

  // Resumen Clase 4
  await prisma.summary.deleteMany({ where: { classId: class4.id } });
  await prisma.summary.create({
    data: {
      classId: class4.id,
      materialId: mat4.id,
      title: "Resumen Académico · Clase 04: Blockchain, Criptografía, Smart Contracts y Ecosistema DeFi",
      overview:
        "La Clase 04 presenta la tecnología Blockchain y su aplicación disruptiva en las Finanzas Descentralizadas (DeFi), dictada por el profesor Gastón Escobar. Se analiza la definición formal de blockchain como una base de datos pública, descentralizada e inmutable que elimina la necesidad de terceros de confianza a través de algoritmos de consenso criptográfico. Se desglosan la función criptográfica hash (SHA-256), el encadenamiento cronológico de bloques, la máquina de estados de los Smart Contracts y el surgimiento del ecosistema DeFi (préstamos descentralizados, creadores de mercado automatizados AMM y stablecoins), integrándolo con la arquitectura de software en 3 capas (Interfaz, Lógica de Negocio y Persistencia descentralizada).",
      detailedSummary: `## 1. Definición Canónica de Blockchain
La cátedra de Gastón Escobar establece la definición formal de Blockchain:
> *"Es una base de datos PÚBLICA que registra transacciones digitales INMUTABLES de forma DESCENTRALIZADA y sin necesidad de un TERCERO DE CONFIANZA, que representa una verdad ÚNICA, GLOBAL y CONSENSUADA."*

### Los Tres Pilares Tecnológicos
1. **Base de Datos Distribuida (DLT - Distributed Ledger Technology)**: No existe un servidor centralizado susceptible a ataques o censura (*Single Point of Failure*). Todos los nodos de la red conservan una réplica idéntica y sincronizada del registro histórico de transacciones.
2. **Criptografía Asimétrica y Funciones Hash**:
   * Cada usuario posee un par de claves criptográficas: una **clave pública** (su dirección/identidad en la red) y una **clave privada** (utilizada para firmar y autorizar digitalmente las transferencias).
   * **Función Hash Criptográfica (SHA-256)**: Algoritmo unidireccional y determinístico que convierte cualquier conjunto de datos en una cadena alfanumérica de longitud fija (256 bits). Modificar un solo bit de la transacción altera completamente el hash resultante (*efecto avalancha*).
3. **Red P2P (Peer-to-Peer) y Consenso Distribuido**: Red descentralizada entre pares donde ningún actor individual tiene autoridad unilateral.

---

## 2. Anatomía de la Cadena de Bloques
* Cada bloque contiene:
  * El conjunto de **transacciones validadas**.
  * Una marca temporal (**Timestamp**).
  * Un número arbitrario (**Nonce**) utilizado en la minería.
  * El **Hash del bloque anterior (Previous Hash)**.
  * El **Hash propio del bloque actual**.
* **Mecanismo de Inmutabilidad**: Como cada bloque incluye el hash del bloque previo, intentar alterar una transacción antigua modifica su hash, rompiendo inmediatamente el enlace con todos los bloques sucesivos de la cadena. La red rechaza el bloque alterado por consenso.

---

## 3. Mecanismos de Consenso
* **Prueba de Trabajo (PoW - Proof of Work)**:
  * Utilizado por Bitcoin.
  * Los nodos mineros compiten por resolver un acertijo matemático de alta demanda computacional (encontrar un Nonce que genere un hash con cierta cantidad de ceros iniciales). Exige un consumo intensivo de energía pero ofrece una seguridad extrema contra ataques del 51%.
* **Prueba de Participación (PoS - Proof of Stake)**:
  * Utilizado por Ethereum (tras *The Merge*) y redes modernas.
  * Los validadores bloquean capital criptográfico (*staking*) como garantía. El algoritmo selecciona al validador en función de su participación económica, reduciendo el consumo energético en más de un 99.9%.

---

## 4. Contratos Inteligentes (Smart Contracts)
* Concepto acuñado originalmente por Nick Szabo y materializado en **Ethereum** por Vitalik Buterin mediante la **EVM (Ethereum Virtual Machine)**.
* **Definición**: Programas informáticos inmutables que se ejecutan automáticamente sobre la cadena de bloques cuando se cumplen condiciones lógicas predeterminadas ("*If This, Then That*").
* **Características**:
  * *Autónomos y Determinísticos*: Se ejecutan sin intervención de jueces, abogados ni intermediarios financieros.
  * *Transparentes*: El código fuente es público y auditable por cualquier participante.
  * *Inmutables*: Una vez desplegados en la blockchain, las reglas no pueden modificarse unilateralmente.

---

## 5. Ecosistema DeFi (Finanzas Descentralizadas)
DeFi es la recreación del sistema financiero tradicional (préstamos, intercambio, derivados, seguros) sobre contratos inteligentes públicos, sin intermediación bancaria:
* **Exchanges Descentralizados (DEX)**: Plataformas como Uniswap que reemplazan el libro de órdenes tradicional por **Creadores de Mercado Automatizados (AMM - Automated Market Makers)** sustentados en piscinas de liquidez (*Liquidity Pools*) gobernadas por fórmulas matemáticas ($x \\cdot y = k$).
* **Protocolos de Préstamos (Lending & Borrowing)**: Protocolos como Aave o Compound donde usuarios depositan criptoactivos para obtener rendimientos y otros toman préstamos sobre-colateralizados en tiempo real sin verificación crediticia.
* **Monedas Estables (Stablecoins)**:
  * *Colateralizadas en Dinero Fiat*: Respaldadas 1:1 en cuentas bancarias tradicionales (USDC, USDT).
  * *Cripto-Colateralizadas / Descentralizadas*: Respaldadas por otros criptoactivos mediante contratos inteligentes sobre-colateralizados (DAI de MakerDAO).

---

## 6. Arquitectura de Sistemas en Aplicaciones Descentralizadas (dApps)
La cátedra relaciona la blockchain con la arquitectura de software en 3 capas:
1. **Capa de Interfaz (Frontend)**: Aplicación web/móvil convencional (React, Next.js) que se comunica con billeteras Web3 (MetaMask, WalletConnect) para solicitar la firma digital de transacciones.
2. **Capa de Lógica de Negocio**: Smart Contracts desplegados en la blockchain que ejecutan las reglas financieras y de gobernanza de forma inmutable.
3. **Capa de Persistencia**:
   * *On-Chain*: El libro contable de la blockchain (almacenamiento de saldos y estados críticos).
   * *Off-Chain / Descentralizado*: Redes como IPFS (InterPlanetary File System) para almacenar archivos pesados y metadatos sin saturar la cadena de bloques.`,
      simplifiedExplanation:
        "Imaginate que en lugar de que el banco tenga un libro contable secreto en su oficina central (donde si el banco quiebra o altera los números, nadie se entera), cada cliente del pueblo tiene una copia idéntica y exacta de ese libro en su casa. Cada vez que alguien le transfiere dinero a otro, se lo grita a todo el pueblo; todos comprueban que tenga saldo y anotan la transacción en su propia copia. Es imposible hacer trampa porque tendrías que modificar los cuadernos de más de la mitad del pueblo al mismo tiempo.",
      keyPointsJson: JSON.stringify([
        "Blockchain es una base de datos pública, descentralizada e inmutable sin necesidad de terceros de confianza.",
        "Los tres pilares: DLT (libro mayor distribuido), Criptografía asimétrica / Hashing SHA-256, y Red P2P con Consenso.",
        "Cada bloque almacena transacciones, timestamp, nonce, su propio hash y el hash del bloque previo.",
        "Consenso: Proof of Work (minería por poder de cómputo) vs. Proof of Stake (validadores por staking económico).",
        "Smart Contracts: Programas autónomos e inmutables que se ejecutan sobre la EVM al cumplirse condiciones lógicas.",
        "DeFi: Finanzas descentralizadas que eliminan a la banca tradicional mediante préstamos colateralizados, DEX (AMM) y stablecoins.",
        "Arquitectura dApp en 3 capas: Frontend Web3 (MetaMask) -> Smart Contracts (Lógica) -> Persistencia (Ledger Blockchain + IPFS).",
      ]),
      definitionsJson: JSON.stringify([
        {
          term: "Blockchain",
          definition:
            "Base de datos pública y distribuida que registra transacciones digitales de forma inmutable y cronológicamente encadenada mediante consenso sin intermediarios.",
        },
        {
          term: "Función Hash Criptográfica (SHA-256)",
          definition:
            "Algoritmo matemático unidireccional y determinístico que transforma una entrada de datos de cualquier tamaño en una cadena única de 256 bits con efecto avalancha.",
        },
        {
          term: "Smart Contract (Contrato Inteligente)",
          definition:
            "Código de programación ejecutable alojado en una blockchain que automatiza el cumplimiento de un acuerdo entre partes de manera autónoma e irreversible.",
        },
        {
          term: "DeFi (Decentralized Finance)",
          definition:
            "Ecosistema de servicios y productos financieros (préstamos, intercambios, seguros) operados exclusivamente por contratos inteligentes sin intervención de entidades bancarias.",
        },
      ]),
      examplesJson: JSON.stringify([
        {
          title: "Ejemplo de Cátedra: Transferencia de Valor P2P y Mining",
          description:
            "Alice transfiere 1 ETH a Bob firmando con su clave privada. La transacción entra a la mempool; los validadores la empaquetan en un bloque, calculan el hash incluyendo el hash del bloque previo y propagan el bloque a la red P2P, donde todos los nodos actualizan su estado contable de forma irreversible.",
        },
        {
          title: "Ejemplo de Cátedra: Creador de Mercado Automatizado (AMM)",
          description:
            "En Uniswap no hay un comprador y vendedor emparejados por un broker; el usuario interactúa contra una piscina de liquidez con fondos de dos tokens regulada por la fórmula constante x * y = k, garantizando liquidez instantánea sin custodia bancaria.",
        },
      ]),
      commonMistakesJson: JSON.stringify([
        {
          mistake: "Creer que la Blockchain garantiza la veracidad de los datos que vienen del mundo exterior",
          explanation:
            "La blockchain garantiza que lo escrito en ella no se puede alterar (inmutabilidad), pero si un sensor o humano carga un dato falso inicialmente, el dato quedará inmutablemente falso. Para conectar datos del mundo real se requieren 'Oráculos' (ej. Chainlink).",
        },
        {
          mistake: "Confundir la clave pública con la clave privada",
          explanation:
            "La clave pública es tu CBU / dirección que podés compartir libremente para recibir fondos. La clave privada es tu contraseña criptográfica intransferible que nunca debe revelarse porque permite firmar y vaciar los fondos.",
        },
      ]),
      aiModel: "Antigravity Academic Engine",
    },
  });

  // Tópicos Clase 4
  const t8 = await prisma.topic.create({
    data: {
      subjectId: subject.id,
      classId: class4.id,
      name: "Unidad 7 y 10 · Fundamentos Criptográficos de Blockchain, Hashing SHA-256 y Mecanismos de Consenso",
      description: "Definición canónica (Gastón Escobar), DLT, hashing criptográfico con efecto avalancha, encadenamiento de bloques y consenso PoW vs PoS.",
      importance: "critical",
      masteryScore: 50,
    },
  });

  const t9 = await prisma.topic.create({
    data: {
      subjectId: subject.id,
      classId: class4.id,
      name: "Unidad 7 y 10 · Smart Contracts, Ecosistema DeFi y Arquitectura por Capas en dApps",
      description: "Contratos inteligentes en EVM, finanzas descentralizadas (préstamos, AMM Uniswap, stablecoins) y arquitectura de 3 capas (Frontend, Lógica, Persistencia/IPFS).",
      importance: "critical",
      masteryScore: 50,
    },
  });

  // -------------------------------------------------------------
  // FLASHCARDS SM-2 (18 Flashcards)
  // -------------------------------------------------------------
  console.log("\n🧠 Creando 18 flashcards SM-2 estructuradas por Unidad y Clase...");

  const flashcardData = [
    // Clase 1: OKRs y ACT
    {
      topicId: t1.id,
      front: "¿Cuáles son los 5 pilares de la Transformación Digital según la cátedra y quién está en el centro?",
      back: "Los 5 pilares son: 1) Personas y Cultura, 2) Metodologías Ágiles (OKRs, Scrum), 3) Procesos de Negocio (BPM, Lean), 4) Tecnologías (Cloud, RPA, IA), y en el epicentro articulador se encuentra el Cliente / Usuario.",
    },
    {
      topicId: t1.id,
      front: "¿Quién creó los OKRs y cómo se introdujeron formalmente en Google en 1999?",
      back: "Fueron creados por Andy Grove en Intel y formalmente introducidos en Google en 1999 por John Doerr (Kleiner Perkins) con una inversión inicial de US$ 11.8 millones cuando la compañía tenía 40 colaboradores.",
    },
    {
      topicId: t1.id,
      front: "¿Qué porcentaje de cumplimiento se considera excelente en un OKR Aspiracional (Stretch Goal) en la filosofía de Google y por qué?",
      back: "Un cumplimiento del 70% al 80% se califica como excelente. Si un equipo logra consistentemente el 100%, denota falta de ambición e innovación ('Moonshots Inspire').",
    },
    {
      topicId: t1.id,
      front: "¿Cuál es la fórmula formal de redacción de un Resultado Clave (KR)?",
      back: "La fórmula canónica es: 'Ir de X (valor base actual) a Y (valor meta deseado) para la fecha Z (plazo límite definido)'.",
    },
    {
      topicId: t1.id,
      front: "¿Cuál es la diferencia crítica entre un OKR Comprometido y un OKR Aspiracional?",
      back: "El OKR Comprometido exige el 100% de cumplimiento sin excusas (hitos legales, infraestructura crítica). El Aspiracional es una meta disruptiva y ambiciosa donde alcanzar el 70% ya es un éxito resonante.",
    },
    {
      topicId: t2.id,
      front: "¿Qué fases componen la metodología ágil ACT para el abordaje de optimización de procesos?",
      back: "Se compone de 3 fases: 1) Analizar (identificar OKRs y flujos As-Is), 2) Consultar (entrevistas a Key Users y Matriz de Priorización), y 3) Transformar (diseño To-Be, cálculo de ROI y despliegue del MVP).",
    },
    {
      topicId: t2.id,
      front: "¿Qué define a una 'Victoria Rápida' (Quick Win) en la Matriz de Priorización de procesos?",
      back: "Es un proceso que combina Alto Impacto de Negocio con Baja Complejidad Técnica. Representa la Prioridad 1 para generar tracción temprana en la transformación digital.",
    },

    // Clase 2: Arquitectura y Atributos de Calidad
    {
      topicId: t3.id,
      front: "¿Cuál es la definición formal de Arquitectura de Software según la cátedra?",
      back: "Es el conjunto de decisiones significativas sobre la organización de un sistema de software que define los principios que guían el desarrollo, los componentes principales, sus responsabilidades, relaciones e interacciones, y las restricciones que gobiernan su evolución.",
    },
    {
      topicId: t4.id,
      front: "¿Cuáles son los 6 Atributos de Calidad cardinales (Requerimientos No Funcionales)?",
      back: "1) Disponibilidad, 2) Rendimiento (Performance), 3) Modificabilidad, 4) Seguridad, 5) Testabilidad y 6) Usabilidad.",
    },
    {
      topicId: t4.id,
      front: "¿Qué es un 'Trade-off Arquitectónico' y qué ejemplo clásico suele darse?",
      back: "Es un compromiso de diseño donde optimizar un atributo degrada otro. Ejemplo clásico: reforzar la Seguridad con cifrado pesado y autenticación multifactor incrementa la latencia y reduce el Rendimiento.",
    },
    {
      topicId: t5.id,
      front: "¿Cuáles son las 6 partes obligatorias que componen un Escenario de Atributo de Calidad?",
      back: "1) Fuente del Estímulo, 2) Estímulo, 3) Artefacto, 4) Entorno, 5) Respuesta del sistema y 6) Medida cuantitativa de la Respuesta.",
    },

    // Clase 3: RPA y BPM
    {
      topicId: t6.id,
      front: "¿Cuál es la diferencia fundamental entre BPM y RPA?",
      back: "BPM rediseña y optimiza el proceso de negocio de extremo a extremo (End-to-End) a nivel estructural; RPA es una automatización táctica y no invasiva de tareas repetitivas y basadas en reglas sobre las interfaces existentes.",
    },
    {
      topicId: t7.id,
      front: "¿Qué condiciones debe cumplir un proceso de negocio para ser candidato ideal para RPA?",
      back: "1) Reglas lógicas claras y determinísticas, 2) Alto volumen y repetitividad, 3) Entradas de datos digitales estructurados, 4) Tareas fuera de horario habitual (batch), 5) Alta propensión a error humano por tipeo manual.",
    },
    {
      topicId: t7.id,
      front: "¿Qué significan las siglas PEPSU y qué función cumple el documento PDD en RPA?",
      back: "PEPSU: Proveedores, Entradas, Procesos, Salidas, Usuarios. El PDD (Process Definition Document) es el artefacto formal que describe detalladamente el estado actual (As-Is) y el diseño automatizado propuesto (To-Be).",
    },
    {
      topicId: t7.id,
      front: "¿Cuáles son las funciones principales del Orquestador en una arquitectura RPA?",
      back: "Gestionar colas de trabajo (Work Queues), coordinar disparadores (Triggers programados, por evento o instantáneos), asignar tareas a robots, monitorear en tiempo real, auditar y garantizar la seguridad.",
    },

    // Clase 4: Blockchain y DeFi
    {
      topicId: t8.id,
      front: "¿Cómo define la cátedra formalmente a la Blockchain?",
      back: "Es una base de datos pública que registra transacciones digitales inmutables de forma descentralizada y sin necesidad de un tercero de confianza, representando una verdad única, global y consensuada.",
    },
    {
      topicId: t8.id,
      front: "¿Por qué se dice que una función hash como SHA-256 tiene 'efecto avalancha'?",
      back: "Porque modificar un único bit en los datos de entrada altera radicalmente todos los caracteres del hash resultante de 256 bits, haciendo imposible predecir el hash e invalidando cualquier bloque alterado.",
    },
    {
      topicId: t9.id,
      front: "¿Qué es un Smart Contract y en qué se diferencia de un contrato tradicional?",
      back: "Es un programa autónomo, inmutable y determinístico alojado en una blockchain (ej. Ethereum EVM) que se ejecuta automáticamente cuando se cumplen condiciones lógicas ('If This, Then That'), sin requerir abogados, jueces ni intermediarios.",
    },
  ];

  for (const fc of flashcardData) {
    await prisma.flashcard.create({
      data: {
        subjectId: subject.id,
        topicId: fc.topicId,
        front: fc.front,
        back: fc.back,
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
        nextReviewAt: new Date(),
      },
    });
  }
  console.log(`✅ ${flashcardData.length} flashcards registradas exitosamente.`);

  // -------------------------------------------------------------
  // SIMULACRO DE CÁTEDRA: 8 PREGUNTAS OFICIALES
  // -------------------------------------------------------------
  console.log("\n📝 Creando 8 preguntas de examen para el Simulacro de Cátedra...");

  const questionsData = [
    {
      classId: class1.id,
      topicId: t1.id,
      text: "De acuerdo con la metodología OKR adoptada en Google a partir de John Doerr, ¿qué porcentaje de cumplimiento en un OKR de tipo Aspiracional (Stretch Goal) se considera una calificación excelente?",
      optionsJson: JSON.stringify([
        "Exactamente el 100%, ya que cualquier resultado inferior denota incumplimiento del compromiso.",
        "Entre el 70% y el 80%, dado que un cumplimiento sistemático del 100% refleja falta de ambición e innovación.",
        "Más del 95%, admitiendo únicamente desvíos menores por factores macroeconómicos.",
        "El 50%, ya que en metodologías ágiles la velocidad prima sobre la exhaustividad del resultado.",
      ]),
      correctOption: 1,
      explanation:
        "La cátedra enseña que en Google los OKRs se conciben bajo el lema 'Moonshots Inspire'. Alcanzar entre el 70% y el 80% en metas aspiracionales se califica como excelente; cumplir el 100% de manera reiterada indica que los objetivos fueron conservadores.",
    },
    {
      classId: class1.id,
      topicId: t1.id,
      text: "¿Cuál de las siguientes afirmaciones describe con precisión la relación estructural entre la Visión de la empresa, los OKRs y los KPIs?",
      optionsJson: JSON.stringify([
        "Los KPIs reemplazan a los OKRs al inicio de cada año y se desglosan en metas cualitativas no medibles.",
        "La Visión define el norte anual; los OKRs son palancas de transformación trimestral con KRs cuantificables, mientras que los KPIs monitorean la salud operativa continua del negocio.",
        "Los OKRs son métricas operativas de mantenimiento (Business as Usual) y los KPIs son objetivos aspiracionales de disrupción tecnológica.",
        "Los OKRs se definen de forma 100% Top-Down por la dirección y los KPIs son sugeridos voluntariamente por los pasantes.",
      ]),
      correctOption: 1,
      explanation:
        "La estructura piramidal conecta la Visión con los OKRs trimestrales (impulsores del cambio estratégico), los cuales se respaldan en KRs y KAs. Los KPIs actúan como el tablero de control del negocio habitual.",
    },
    {
      classId: class1.id,
      topicId: t2.id,
      text: "En la Matriz de Priorización de la metodología ACT (Analizar, Consultar, Transformar), ¿cómo se clasifica a una iniciativa que posee Alto Impacto en el Negocio y Baja Complejidad Técnica?",
      optionsJson: JSON.stringify([
        "Gran Meta que debe postergarse para la fase final del proyecto.",
        "Iniciativa a Eliminar debido al riesgo de sobrecarga de los equipos.",
        "Victoria Rápida (Quick Win), que debe priorizarse de forma inmediata para generar valor temprano.",
        "Proyecto de Definición Lenta que requiere aprobación de un comité externo de auditoría.",
      ]),
      correctOption: 2,
      explanation:
        "Las iniciativas de Alto Impacto y Baja Complejidad constituyen las 'Victorias Rápidas' (Quick Wins), cuya implementación temprana demuestra tracción y retorno de inversión rápido en los programas de transformación digital.",
    },
    {
      classId: class2.id,
      topicId: t4.id,
      text: "Al diseñar una arquitectura de software empresarial, ¿cuál de los siguientes pares ilustra un conflicto clásico (trade-off) entre Atributos de Calidad?",
      optionsJson: JSON.stringify([
        "Incrementar la Testabilidad aumenta automáticamente la velocidad de renderizado en el cliente.",
        "Incorporar múltiples capas de cifrado criptográfico y validación biométrica (Seguridad) suele degradar la latencia de respuesta (Rendimiento).",
        "Aumentar la Disponibilidad con réplicas pasivas reduce a cero los costos de infraestructura computacional.",
        "Mejorar la Modificabilidad eliminando interfaces desacopladas incrementa la estabilidad del compilador.",
      ]),
      correctOption: 1,
      explanation:
        "Un principio fundacional de la arquitectura de software es que no se pueden maximizar todos los atributos simultáneamente. La seguridad extrema impone un costo de cómputo que afecta directamente al rendimiento en milisegundos.",
    },
    {
      classId: class2.id,
      topicId: t5.id,
      text: "¿Cuáles son las 6 partes canónicas exigidas por la cátedra para especificar un Escenario de Atributo de Calidad sin ambigüedades?",
      optionsJson: JSON.stringify([
        "Actor, Caso de Uso, Base de Datos, Algoritmo, Servidor y Costo Monetario.",
        "Fuente del Estímulo, Estímulo, Artefacto, Entorno, Respuesta y Medida de la Respuesta.",
        "Entrada, Proceso, Salida, Proveedor, Usuario y Diagrama de Secuencia.",
        "Objetivo SMART, Resultado Clave, Hito Comprometido, KPI, Lenguaje y Framework.",
      ]),
      correctOption: 1,
      explanation:
        "Siguiendo el estándar del Software Engineering Institute (Bass, Clements, Kazman), un escenario de calidad se desglosa rigurosamente en: Fuente del Estímulo, Estímulo, Artefacto afectado, Entorno operativo, Respuesta y Medida cuantitativa de la Respuesta.",
    },
    {
      classId: class3.id,
      topicId: t6.id,
      text: "¿Cuál es la distinción conceptual esencial entre la Gestión de Procesos de Negocio (BPM) y la Automatización Robótica de Procesos (RPA)?",
      optionsJson: JSON.stringify([
        "BPM es un lenguaje de programación de bajo nivel y RPA es un framework de testing de front-end.",
        "BPM rediseña y optimiza el proceso de punta a punta a nivel estructural; RPA es una capa de automatización no invasiva que emula tareas repetitivas sobre sistemas existentes.",
        "RPA reemplaza por completo a los ERPs tradicionales mientras que BPM solo se utiliza para enviar correos masivos.",
        "BPM solo es aplicable en empresas estatales y RPA se restringe a arquitecturas de criptomonedas.",
      ]),
      correctOption: 1,
      explanation:
        "BPM aborda el modelado y optimización estructural del proceso completo (End-to-End). RPA, por el contrario, actúa como una fuerza de trabajo digital complementaria que ejecuta tareas repetitivas y basadas en reglas sin tocar el backend subyacente.",
    },
    {
      classId: class3.id,
      topicId: t7.id,
      text: "En una arquitectura empresarial de RPA, ¿qué componente es el responsable de administrar las colas de trabajo (Work Queues), programar los disparadores y monitorear la ejecución de los bots en tiempo real?",
      optionsJson: JSON.stringify([
        "El Servidor de Base de Datos relacional transaccional.",
        "El Orquestador (Cloud o Servidor central).",
        "El Agente de Escritorio (Attended Bot Agent) instalado en la máquina del usuario.",
        "El archivo de configuración local PDD.",
      ]),
      correctOption: 1,
      explanation:
        "El Orquestador es el cerebro neurálgico de la plataforma RPA: distribuye tareas balanceadas entre robots, administra colas de trabajo, activa triggers (programados o por eventos) y audita la seguridad en tiempo real.",
    },
    {
      classId: class4.id,
      topicId: t8.id,
      text: "Según la definición de cátedra del Prof. Gastón Escobar, ¿cuál es la razón fundamental por la cual la tecnología Blockchain garantiza la inmutabilidad de sus registros?",
      optionsJson: JSON.stringify([
        "Porque los datos son custodiados por una entidad bancaria central con certificación ISO 27001.",
        "Porque cada bloque contiene el hash criptográfico del bloque previo, de modo que alterar un registro altera su hash y rompe la validez de toda la cadena posterior ante el consenso de la red.",
        "Porque los contratos inteligentes bloquean las direcciones IP de cualquier usuario que intente consultar el saldo.",
        "Porque utiliza únicamente almacenamiento en memoria RAM volátil sin persistencia física en disco.",
      ]),
      correctOption: 1,
      explanation:
        "El encadenamiento criptográfico mediante funciones hash (SHA-256) donde cada bloque sella el hash del bloque anterior asegura que cualquier manipulación retroactiva rompa la continuidad de la cadena, siendo rechazada por el consenso de los nodos.",
    },
  ];

  for (const q of questionsData) {
    const options: string[] = JSON.parse(q.optionsJson);
    const answerText = options[q.correctOption] || String(q.correctOption);
    await prisma.question.create({
      data: {
        subjectId: subject.id,
        classId: q.classId,
        topicId: q.topicId,
        question: q.text,
        optionsJson: q.optionsJson,
        answer: answerText,
        explanation: q.explanation,
        difficulty: "medium",
        type: "multiple_choice",
      },
    });
  }
  console.log(`✅ ${questionsData.length} preguntas de simulacro de cátedra creadas.`);

  // -------------------------------------------------------------
  // PLAN DE PREPARACIÓN PARA EXAMEN PARCIAL INTEGRADOR
  // -------------------------------------------------------------
  if (exam) {
    console.log(`\n🎯 Vinculando tópicos al Examen Parcial Integrador (${exam.title})...`);

    const allTopics = [t1, t2, t3, t4, t5, t6, t7, t8, t9];
    for (const t of allTopics) {
      await prisma.examTopic.create({
        data: {
          examId: exam.id,
          topicId: t.id,
        },
      });
    }

    const planItems = [
      {
        title: "Unidad 1 y 2: Dominio de OKRs, Metas Comprometidas vs. Aspiracionales y Metodología ACT",
        description: "Repasar genealogía Grove/Doerr, fórmula de KRs ('ir de X a Y'), los 5 pasos de OKRs y la Matriz de Priorización de procesos.",
        order: 1,
        scheduledDate: new Date("2026-10-15T21:00:00.000Z"),
      },
      {
        title: "Unidad 6: Fundamentos de Arquitectura de Software y Estilos Arquitectónicos",
        description: "Estudiar definición formal IEEE/Bass, diferencias entre Monolito, Capas y Microservicios, y trade-offs estructurales.",
        order: 2,
        scheduledDate: new Date("2026-10-22T21:00:00.000Z"),
      },
      {
        title: "Unidad 6: Atributos de Calidad y Formulación de Escenarios Formales",
        description: "Practicar la redacción de los 6 componentes del Escenario de Calidad (Fuente, Estímulo, Artefacto, Entorno, Respuesta y Medida) para Disponibilidad y Rendimiento.",
        order: 3,
        scheduledDate: new Date("2026-10-29T21:00:00.000Z"),
      },
      {
        title: "Unidad 3: Automatización Robótica de Procesos (RPA), BPM y Artefactos PEPSU/PDD",
        description: "Revisar criterios de viabilidad para robotización, roles en la célula (Process Owner, Key User) y arquitectura con Orquestador y Bot Servers.",
        order: 4,
        scheduledDate: new Date("2026-11-05T21:00:00.000Z"),
      },
      {
        title: "Unidad 7 y 10: Blockchain, Criptografía SHA-256, Consenso, Smart Contracts y DeFi",
        description: "Dominar la definición canónica de Blockchain (Gastón Escobar), mecanismos PoW vs PoS, dApps de 3 capas y pools AMM.",
        order: 5,
        scheduledDate: new Date("2026-11-10T21:00:00.000Z"),
      },
    ];

    for (const pi of planItems) {
      await prisma.preparationPlanItem.create({
        data: {
          examId: exam.id,
          title: pi.title,
          description: pi.description,
          order: pi.order,
          scheduledDate: pi.scheduledDate,
          completed: false,
        },
      });
    }
    console.log("✅ Plan de preparación para el Parcial Integrador registrado.");
  }

  console.log("\n🎉 ¡Ingesta de Sistemas Digitales completada exitosamente!");
}

main()
  .catch((e) => {
    console.error("❌ Error en ingesta:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
