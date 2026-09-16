import prisma from "../lib/db/prisma";
import fs from "fs";
import path from "path";
import { extractTextFromBuffer } from "../lib/pdf/extractor";

async function main() {
  console.log("🚀 Iniciando ingesta integral de materiales para Gestión del Talento Humano en la Industria Digital...");

  // 1. Obtener la materia
  const subject = await prisma.subject.findFirst({
    where: { name: { contains: "Talento Humano" } },
    include: { classes: { orderBy: { classNumber: "asc" } } },
  });

  if (!subject) {
    throw new Error("No se encontró la materia Gestión del Talento Humano");
  }

  console.log(`✅ Materia encontrada: ${subject.name} (ID: ${subject.id})`);

  const classMap = new Map(subject.classes.map((c) => [c.classNumber, c]));
  const baseDir = path.join(process.cwd(), "uploads", "materials", "miercoles_gestion");

  // 2. Definición de las 6 Clases Oficiales (Material de estudio principal con resúmenes, flashcards y exámenes)
  const classMaterialsToProcess = [
    {
      classNumber: 1,
      fileName: "Clase 1.pdf",
      relativeStoragePath: "uploads/materials/miercoles_gestion/Clase 1.pdf",
      classTitle: "Clase 1: Filosofía y Cultura Organizacional, Misión/Visión y el Área de Capital Humano",
      summary: {
        title: "Resumen Académico · Clase 01: Filosofía Organizacional, Cultura, Misión/Visión y Capital Humano",
        overview:
          "La primera sesión de Gestión del Talento Humano en la Industria Digital establece los cimientos de la interacción entre las personas y las organizaciones en el ecosistema productivo moderno. Se desglosa la Filosofía Organizacional analizando la Cultura como un patrón compartido de valores, creencias y presunciones que guían la conducta de sus integrantes. Se contrasta el concepto de Misión (el propósito operativo presente y de mercado) frente a la Visión (el horizonte aspiracional futuro). Asimismo, se examina la diferenciación entre Culturas Fuertes y Débiles según Stephen Robbins, su proceso de formación, socialización y mantenimiento, y se aborda la evolución del área de Recursos Humanos: desde la tradicional 'Unidad de Administración de Personal' (sesgo hard burocrático enfocado en legajos, ausentismo y liquidación de haberes) hacia la moderna 'Unidad de Gestión' que actúa como Socio Estratégico del negocio.",
        detailedSummary: `### 1. Filosofía de la Organización: Estructura, Cultura y Valores
Las organizaciones coordinan sus esfuerzos a través de una arquitectura intencional que articula dimensiones duras y blandas:

| Dimensión | Definición Conceptual | Enfoque y Pregunta Central |
| :--- | :--- | :--- |
| **Estructura** | Forma en que las organizaciones dividen, organizan y coordinan formalmente sus actividades y recursos. | *¿Cómo distribuimos las tareas y los niveles de autoridad?* |
| **Cultura Organizacional** | Patrón compartido de valores, creencias, expectativas y supuestos que orientan la conducta cotidiana. | *¿Cómo hacemos las cosas aquí? ¿Qué premisas rigen nuestro actuar?* |
| **Misión** | Razón de ser actual de la empresa en términos de producto, mercado y clientes. | *¿Qué es y qué hace nuestro negocio hoy en el mercado?* |
| **Visión** | Imagen del futuro deseado, desafiante e inspiradora a mediano y largo plazo. | *¿En qué queremos convertirnos y hacia dónde nos proyectamos?* |
| **Valores** | Principios éticos y convicciones profundas que marcan los límites del comportamiento aceptable. | *¿Qué principios morales e institucionales son innegociables?* |

---

### 2. Culturas Fuertes vs. Culturas Débiles (Stephen Robbins)
La cátedra destaca que el desempeño de una compañía está directamente correlacionado con la coherencia y solidez de su cultura:
- **Culturas Fuertes**: Los valores centrales están profundamente arraigados, son conocidos y compartidos por la gran mayoría de los empleados. La gente sabe qué se espera de ella, reduciendo la ambigüedad, alineando la toma de decisiones y aumentando la productividad sin necesidad de un control policial rígido.
- **Culturas Débiles**: Hay dispersión de valores, mensajes contradictorios de la dirección y falta de claridad sobre qué conductas se premian o penalizan, lo que genera confusión, desmotivación y lentitud en la resolución de problemas.

#### Dimensiones culturales clave:
- **Orientación a la Innovación y toma de riesgos** (*ej. Apple, Samsung* en tecnología, donde el desarrollo de producto define su personalidad).
- **Orientación a las personas** (*ej. Southwest Airlines*, donde el colaborador es el eje central del negocio).
- **Orientación a resultados y al detalle**.

---

### 3. Dinámica de la Cultura Organizacional: Creación, Aprendizaje y Mantenimiento
#### A. Formación e Integración Interna:
- **Lenguaje y conceptos**: Creación de un léxico compartido y códigos propios de la empresa.
- **Límites de grupo**: Criterios de pertenencia y cohesión de equipo.
- **Poder y status**: Reglas para adquirir, ejercer y perder autoridad.
- **Recompensas y castigos**: Sistemas de estímulo moral y material.

#### B. Mecanismos de Aprendizaje:
1. **Historias y anécdotas**: Relatos fundacionales sobre sacrificios, superaciones o decisiones críticas de los fundadores.
2. **Rituales**: Ceremonias de premiación, demostraciones o eventos periódicos de integración.
3. **Lenguaje y jergas**: Vocabularios técnicos propios que generan identidad gremial o corporativa.
4. **Objetos y símbolos materiales**: Espacios abiertos, vestimenta, disposición edilicia y equipamiento de trabajo.

#### C. Mantenimiento y Socialización:
- **Selección de candidatos**: Búsqueda intencional de ajuste cultural (*cultural fit*).
- **Proceso de Inducción (Onboarding)**: Transmisión explícita de normas, reglas de convivencia, expectativas de desempeño y políticas institucionales.
- **Socialización continua**: Interacción cotidiana entre veteranos y recién ingresados.

> **Premisa clave de la cátedra:** *"La felicidad organizacional no es un lujo; es una estrategia central del negocio. Empleados felices = Mayor productividad, menor rotación y mejor clima laboral. El área de Capital Humano es la creadora de experiencias memorables para el colaborador."*

---

### 4. Management del Capital Humano y Evolución del Área
El *Management de Capital Humano* es el conjunto de principios y decisiones directivas orientadas a la coordinación del esfuerzo individual y colectivo para alcanzar metas organizacionales.

#### De la Oficina de Personal al Socio Estratégico:
1. **Unidad de Administración de Personal (Enfoque Tradicional / Hard)**:
   - Centrada en el cumplimiento legal, control disciplinario y burocracia.
   - Funciones: liquidación de sueldos y jornales, control de ausentismo, altas y bajas de AFIP, legajos físicos y sanciones.
2. **Unidad de Gestión / Socio Estratégico (Enfoque Moderno / Soft)**:
   - Integrada a la mesa directiva y a la estrategia global del negocio.
   - Funciones: relevamiento de necesidades organizacionales, diagnóstico de clima, diseño de planes de carrera, desarrollo de talento, cultura de bienestar y People Analytics.`,
        simplifiedExplanation:
          "La cultura de una empresa es su personalidad: cómo se comportan sus miembros cuando nadie los mira. Si la cultura es fuerte (como en Google o Apple), todos saben hacia dónde ir y qué valores respetar. Antes, Recursos Humanos era una oficina gris que solo liquidaba sueldos y controlaba llegadas tarde (Administración de Personal). Hoy, en empresas tecnológicas, es un área estratégica (Unidad de Gestión) encargada de diseñar la experiencia de trabajo, cuidar la felicidad del equipo y asegurar que la empresa cuente con el mejor talento.",
        keyPoints: [
          "La Estructura define cómo se divide el trabajo formal; la Cultura define cómo se vive y se siente la organización en el día a día.",
          "La Misión es el propósito operativo y de mercado presente; la Visión es la meta aspiracional futura.",
          "Las Culturas Fuertes reducen la ambigüedad, alinean la conducta y mejoran la productividad al compartir valores nítidos.",
          "La cultura se transmite mediante historias, rituales, lenguaje propio y símbolos materiales.",
          "El área de Capital Humano evolucionó de Unidad de Administración de Personal (control burocrático y liquidación) a Unidad de Gestión (socio estratégico del negocio y creador de experiencias).",
        ],
        definitions: [
          { term: "Cultura Organizacional", definition: "Patrón de valores, creencias, presunciones y expectativas compartidas por los integrantes de una organización que orienta sus conductas y toma de decisiones." },
          { term: "Misión Organizacional", definition: "Definición del negocio de la empresa en el presente: a qué mercado sirve, qué productos/servicios ofrece y qué la distingue hoy." },
          { term: "Visión Organizacional", definition: "Declaración aspiracional a largo plazo del estado futuro y la posición que la organización aspira alcanzar." },
          { term: "Unidad de Administración de Personal", definition: "Esquema operativo tradicional de RRHH enfocado exclusivamente en tareas registrales, control de asistencia y liquidación de haberes." },
          { term: "Unidad de Gestión de Capital Humano", definition: "Enfoque contemporáneo donde RRHH actúa como socio estratégico, diagnosticando necesidades, potenciando el talento y modelando la cultura." },
        ],
        examples: [
          { title: "Cultura de Innovación: Apple vs. Cultura de Personas: Southwest Airlines", description: "Apple premia la toma de riesgos y el secretismo estricto para crear productos revolucionarios. Southwest Airlines prioriza el bienestar y humor de sus tripulantes para que estos atiendan de forma empática a los pasajeros." },
          { title: "Rituales de Onboarding en Tech Startups", description: "Entrega del 'welcome pack', presentación pública en canales de Slack y almuerzo de bienvenida con el equipo para acelerar la socialización." },
          { title: "Transición de Personal a Capital Humano", description: "Una empresa de software deja de limitar a RRHH al cómputo de vacaciones y lo integra a la planificación trimestral de apertura de nuevos hubs de desarrollo." },
        ],
        commonMistakes: [
          { mistake: "Confundir Misión con Visión", explanation: "La Misión responde al 'qué hacemos hoy y para quién', mientras que la Visión proyecta 'en qué queremos transformarnos a futuro'." },
          { mistake: "Creer que la Cultura se impone solo mediante carteles en la pared", explanation: "La cultura real se forja en los comportamientos observables de los líderes y en lo que se premia o castiga en el día a día, no en lemas decorativos." },
          { mistake: "Reducir el Capital Humano a una mera función administrativa de liquidación", explanation: "Ignorar la dimensión de gestión estratégica provoca fuga de cerebros, desmotivación y desacople entre la dotación y las metas del negocio." },
        ],
      },
      topics: [
        { name: "Filosofía y Cultura Organizacional (Stephen Robbins)", description: "Conceptos de cultura, artefactos, ritos, historias y diferencias entre culturas fuertes y débiles.", importance: "critical" },
        { name: "Misión, Visión y Valores Estratégicos", description: "Definición del negocio actual frente a la proyección de futuro y premisas conductuales.", importance: "high" },
        { name: "Evolución de CH: Administración de Personal vs. Unidad de Gestión", description: "Transición de la oficina burocrática de legajos al rol de socio estratégico del negocio.", importance: "high" },
      ],
      flashcards: [
        { front: "¿Cuál es la diferencia fundamental entre una cultura organizacional fuerte y una débil según Robbins?", back: "En una cultura fuerte los valores centrales están profundamente arraigados, son ampliamente compartidos y guían el comportamiento sin necesidad de controles excesivos; en una débil hay confusión, falta de claridad y mensajes contradictorios.", difficulty: "medium" },
        { front: "¿Qué distingue a Capital Humano como 'Unidad de Administración de Personal' de una 'Unidad de Gestión'?", back: "La Unidad de Administración se limita a lo transaccional y legal (legajos, sueldos, ausentismo), mientras que la Unidad de Gestión actúa como socio estratégico, planificando talento, diagnosticando clima y alineando políticas a los objetivos de negocio.", difficulty: "easy" },
        { front: "¿Cuáles son los 4 vehículos principales a través de los cuales los empleados aprenden la cultura organizacional?", back: "1. Historias y anécdotas fundacionales.\n2. Rituales de reconocimiento y eventos.\n3. Lenguaje y códigos internos.\n4. Símbolos y objetos materiales.", difficulty: "medium" },
        { front: "¿Qué define a la Misión frente a la Visión organizacional?", back: "La Misión define el negocio presente (qué hace, a quién sirve y qué ofrece hoy). La Visión es la imagen futura deseada y desafiante a mediano/largo plazo.", difficulty: "easy" },
      ],
      questions: [
        {
          question: "¿Cuál de las siguientes afirmaciones describe con mayor precisión a una 'Cultura Organizacional Fuerte' según Stephen Robbins?",
          options: [
            "Es aquella donde el manual de procedimientos escritos es el más extenso y se castiga severamente cualquier error.",
            "Es aquella en la que los valores centrales son ampliamente conocidos, internalizados y compartidos por la gran mayoría de sus miembros.",
            "Es aquella donde únicamente los directores toman decisiones sin consultar a los colaboradores.",
            "Es aquella orientada exclusivamente a la reducción de costos operativos y estandarización fabril.",
          ],
          answer: "Es aquella en la que los valores centrales son ampliamente conocidos, internalizados y compartidos por la gran mayoría de sus miembros.",
          explanation: "La fortaleza de una cultura radica en el grado de internalización y compromiso de los empleados con los valores centrales, lo que alinea las conductas espontáneas y minimiza la ambigüedad.",
          difficulty: "medium",
          type: "multiple_choice",
        },
        {
          question: "Un área de Recursos Humanos que centra sus actividades cotidianas en el control biométrico de asistencia, liquidación de haberes y archivo de legajos corresponde al modelo de:",
          options: [
            "Unidad de Gestión Estratégica",
            "Centro de People Analytics Avanzado",
            "Unidad de Administración de Personal",
            "Modelo de Competencias Conductuales",
          ],
          answer: "Unidad de Administración de Personal",
          explanation: "El enfoque tradicional de oficina de personal se restringe a tareas administrativas, transaccionales y de control normativo (la vertiente 'hard' de RRHH).",
          difficulty: "easy",
          type: "multiple_choice",
        },
      ],
    },
    {
      classNumber: 2,
      fileName: "GTHID Clase 2 2C2026.pdf",
      relativeStoragePath: "uploads/materials/miercoles_gestion/GTHID Clase 2 2C2026.pdf",
      classTitle: "Clase 2: El Área de Capital Humano como Sistema, Subsistemas y Bienestar Organizacional",
      summary: {
        title: "Resumen Académico · Clase 02: Capital Humano como Sistema Abierto, Subsistemas de Gestión y Bienestar",
        overview:
          "La Clase 02 profundiza en el Área de Capital Humano abordada integralmente como un Sistema Abierto interactivo con el entorno competitivo. A partir del marco teórico de Simon Dolan, se revisan los factores que impulsaron la relevancia de la gestión de personas: competitividad desmedida, crisis de productividad y aceleración del cambio sociocultural. Se establece el cambio de paradigma entre concebir a los colaboradores como meros 'recursos o costos a amortizar' versus considerarlos 'socios estratégicos / asociados' que invierten su capital intelectual en la compañía. Asimismo, se desagregan los subsistemas nucleares de CH (Descripción de Puestos, Reclutamiento y Selección, Capacitación, Evaluación de Desempeño, Compensaciones y Plan de Carrera), la dualidad operativa entre la Autoridad de Línea y la Función de Staff, y la estructura del Iceberg de Bienestar Organizacional.",
        detailedSummary: `### 1. El Área de Capital Humano como Sistema Abierto
Un sistema abierto recibe insumos del entorno (*inputs* como candidatos, tecnologías y marco regulatorio), los procesa mediante subsistemas coordinados y entrega resultados (*outputs* como colaboradores calificados, clima laboral favorable, productividad y retención).

#### Factores de Simon Dolan que revalorizan el Capital Humano:
1. **Aumento de la competencia global**: Necesidad imperiosa de ser competitivo e innovador.
2. **Costos y ventajas del talento**: El factor humano es el único activo capaz de generar diferenciación insustituible.
3. **Crisis de productividad**: La mecanización sin motivación ni alineación estratégica genera cuellos de botella.
4. **Ritmo vertiginoso de cambios sociales, educativos y tecnológicos**.

---

### 2. Paradigmas de Relación: Personas como Recursos vs. Personas como Asociados
| Dimensión | Personas como Recursos (Tradicional) | Personas como Asociados / Socios (Moderno) |
| :--- | :--- | :--- |
| **Concepción** | Mano de obra, costo variable, engranaje mecanicista reemplazable. | Capital intelectual, talento creativo, generadores de valor insustituibles. |
| **Tratamiento** | Control externo rígido, estandarización de tareas, desconfianza. | Empoderamiento (*empowerment*), autonomía, confianza y desarrollo continuo. |
| **Aporte** | Horas de presencia física y esfuerzo manual. | Ideas, capacidades, toma de decisiones, pasión y resolución de problemas. |
| **Vínculo** | Transaccional (tiempo a cambio de salario básico). | Relacional y de coinversión (compromiso mutuo y desarrollo profesional). |

---

### 3. Los Subsistemas del Área de Capital Humano
Aunque se gestionan metodológicamente por separado, operan en permanente interdependencia:
1. **Descripción y Análisis de Puestos**: Diseña la estructura funcional, fija responsabilidades y define los perfiles de competencia requeridos.
2. **Reclutamiento y Selección**: Atrae y elige a los mejores candidatos internos o externos acordes a las exigencias técnicas y culturales.
3. **Formación y Capacitación Continua**: Desarrolla y actualiza habilidades blandas y duras para cerrar brechas de rendimiento.
4. **Evaluación de Desempeño**: Mide objetivamente el aporte individual y grupal, alimentando promociones, capacitación y bonos.
5. **Remuneraciones, Compensaciones y Beneficios**: Estructura la política salarial justa, incentivos variables y salario emocional.
6. **Plan de Carrera y Sucesión**: Delinea las trayectorias de crecimiento futuro, brindando previsibilidad y estimulando la retención de talentos clave.

---

### 4. Autoridad de Línea vs. Función de Staff
Una distinción organizacional medular examinada por la cátedra:
- **Autoridad de Línea**: La ejercen los gerentes y jefes operativos directos sobre sus equipos. Son ellos quienes dirigen, asignan tareas cotidianas, evalúan el día a día y toman decisiones operativas con su personal.
- **Función de Staff (o Asesoría)**: La ejerce el área de Capital Humano. Actúa como consultor interno, diseñando políticas, proveyendo herramientas metodológicas, reclutando ternas y asesorando a los líderes sin invadir su mando jerárquico.

> **Regla de oro de la cátedra:** *"La administración del Capital Humano es una responsabilidad de línea (de cada líder) y una función de staff (del área de CH)."*

---

### 5. El Iceberg de Bienestar Organizacional
La satisfacción en el trabajo posee elementos visibles en la superficie (la punta del iceberg: salarios, equipamiento, horarios), pero la verdadera lealtad y felicidad laboral descansan en los factores invisibles subyacentes:
- Confianza en el liderazgo directo.
- Sentido de propósito y trascendencia de la tarea.
- Reconocimiento explícito y oportuno.
- Oportunidades genuinas de aprendizaje continuo.
- Entorno de seguridad psicológica y balance con la vida personal.`,
        simplifiedExplanation:
          "En una empresa moderna, los empleados no son engranajes desechables, sino socios que aportan su inteligencia y conocimientos. Recursos Humanos funciona como un sistema interconectado: si seleccionás mal, capacitás mal; si no medís el desempeño, no sabés a quién ascender ni cómo pagarle justamente. Además, cada jefe es el verdadero responsable del día a día de su equipo (Autoridad de Línea), mientras que RRHH actúa como su asesor y proveedor de herramientas expertas (Función de Staff).",
        keyPoints: [
          "Simon Dolan identifica que la competencia global, los costos y el ritmo de cambio obligan a profesionalizar la gestión de personas.",
          "Cambio de paradigma: tratar al empleado como socio/asociado que invierte capital intelectual, no como mero costo.",
          "Los 6 subsistemas clave de CH: Análisis de puestos, Selección, Capacitación, Evaluación de Desempeño, Compensaciones y Plan de Carrera.",
          "Diferencia rectora: Autoridad de Línea (líder operativo que conduce) vs. Asesoría de Staff (CH que asiste, normaliza y asesora).",
          "El Iceberg del Bienestar: los factores profundos (reconocimiento, propósito, seguridad psicológica) pesan más que los superficiales.",
        ],
        definitions: [
          { term: "Capital Intelectual", definition: "Conjunto de conocimientos, experiencia, habilidades y creatividad de las personas que generan ventaja competitiva duradera para la organización." },
          { term: "Autoridad de Línea", definition: "Facultad jerárquica directa que tiene un superior sobre sus subordinados para impartir órdenes, asignar tareas y tomar decisiones de mando." },
          { term: "Función de Staff", definition: "Rol consultivo y de servicio que desempeña el área de CH, brindando asesoramiento técnico, normas y soporte a los gerentes de línea." },
          { term: "Plan de Carrera", definition: "Programa estructurado que traza las posibles rutas de movilidad, ascenso y desarrollo profesional que un empleado puede recorrer dentro de la firma." },
        ],
        examples: [
          { title: "Línea vs. Staff en una contratación", description: "El área de CH (Staff) publica el aviso, filtra 200 CVs y presenta una terna calificada. El Tech Lead del proyecto (Línea) realiza la prueba técnica final y decide formalmente a quién incorporar a su escuadrón." },
          { title: "El Iceberg en Empresas Tech", description: "Una software factory ofrece salarios altos y mesa de ping-pong (superficie), pero sufre 40% de renuncia anual porque los líderes micromanagean y no hay seguridad psicológica (base del iceberg)." },
        ],
        commonMistakes: [
          { mistake: "Creer que la gestión de personas es tarea exclusiva de RRHH", explanation: "La gestión cotidiana es responsabilidad directa de cada jefe de línea; si el líder no sabe motivar o comunicar, las políticas de RRHH pierden efectividad." },
          { mistake: "Gestionar los subsistemas de CH de manera aislada", explanation: "Diseñar puestos sin coordinar con el sistema de compensaciones o evaluar desempeños sin vincularlos a los planes de capacitación genera desarticulación organizativa." },
        ],
      },
      topics: [
        { name: "Capital Humano como Sistema Abierto y Subsistemas", description: "Estructura interactiva de puestos, selección, desarrollo, compensaciones y desempeño.", importance: "critical" },
        { name: "Personas como Recursos vs. Personas como Asociados", description: "Evolución conceptual hacia el capital intelectual y la coinversión de valor.", importance: "high" },
        { name: "Autoridad de Línea y Función de Staff en CH", description: "Articulación de roles entre los jefes de equipo y los especialistas de recursos humanos.", importance: "critical" },
      ],
      flashcards: [
        { front: "¿Qué significa que la gestión de personas es 'responsabilidad de línea y función de staff'?", back: "Significa que cada jefe directo es responsable de liderar, motivar y decidir sobre su equipo (línea), mientras que CH asesora, crea políticas, diseña herramientas y da soporte metodológico (staff).", difficulty: "medium" },
        { front: "¿Cuáles son los 6 subsistemas articulados que componen el área de Capital Humano?", back: "1. Descripción de Puestos\n2. Reclutamiento y Selección\n3. Capacitación y Desarrollo\n4. Evaluación de Desempeño\n5. Compensaciones y Beneficios\n6. Plan de Carrera.", difficulty: "easy" },
        { front: "¿Qué factores cita Simon Dolan como motores de la relevancia actual de la gestión de personas?", back: "El aumento de la competencia global, el reconocimiento del factor humano como ventaja competitiva, la crisis de productividad y la creciente complejidad del cambio sociocultural y tecnológico.", difficulty: "medium" },
      ],
      questions: [
        {
          question: "¿Quién toma la decisión final de contratación de un desarrollador senior en una organización que opera bajo el principio de 'responsabilidad de línea y función de staff'?",
          options: [
            "El especialista de RRHH que filtró los antecedentes curriculares.",
            "El líder del equipo de desarrollo (jefe de línea) con el asesoramiento de CH.",
            "Exclusivamente el departamento legal y de relaciones sindicales.",
            "Un comité externo de consultoría de selección.",
          ],
          answer: "El líder del equipo de desarrollo (jefe de línea) con el asesoramiento de CH.",
          explanation: "La autoridad de mando reside en el líder de línea, quien integrará al candidato a su equipo. El área de CH asesora, preselecciona y diseña el proceso, pero no impone la decisión operativa.",
          difficulty: "medium",
          type: "multiple_choice",
        },
        {
          question: "¿Cuál de los siguientes pares contrapone correctamente la visión de las personas como 'recursos' frente a personas como 'asociados'?",
          options: [
            "Empleados asalariados vs. Contratistas independientes externos",
            "Mano de obra y costo a controlar vs. Capital intelectual e inversión estratégica",
            "Trabajadores de planta fabril vs. Mandos medios gerenciales",
            "Personal presencial vs. Colaboradores con esquema 100% remoto",
          ],
          answer: "Mano de obra y costo a controlar vs. Capital intelectual e inversión estratégica",
          explanation: "El paradigma moderno ve a los colaboradores como socios estratégicos que invierten su conocimiento, tiempo y habilidades para generar ventaja competitiva.",
          difficulty: "easy",
          type: "multiple_choice",
        },
      ],
    },
    {
      classNumber: 3,
      fileName: "GTHID Clase 3 2C2026.pdf",
      relativeStoragePath: "uploads/materials/miercoles_gestion/GTHID Clase 3 2C2026.pdf",
      classTitle: "Clase 3: Planeamiento Estratégico del Capital Humano y Alineación con el Negocio",
      summary: {
        title: "Resumen Académico · Clase 03: Planeamiento Estratégico vs. Operativo de CH y Modelos Competitivos",
        overview:
          "La Clase 03 se concentra en la disciplina del Planeamiento Estratégico del Capital Humano, definido a partir de los postulados de George Bohlander (2009) como el proceso anticipatorio y sistemático que permite sincronizar la oferta y demanda de personas con las metas corporativas. Se explican los 5 pasos metodológicos de la planificación y se marcan las diferencias fundamentales entre el nivel estratégico (largo plazo, holístico y sensible al entorno) y el nivel operativo (táctico, anual y presupuestario). Se analizan los factores externos macro y microambientales que inciden sobre la fuerza laboral (demografía, competencia salarial, inflación y mercado IT), y se conectan las Estrategias Genéricas de Michael Porter (Liderazgo en Costos, Diferenciación y Enfoque) con el diseño de políticas específicas de Capital Humano.",
        detailedSummary: `### 1. Definición y Propósito del Planeamiento Estratégico de CH
Según **George Bohlander (2009)**:
> *"La planeación del Capital Humano es el proceso sistemático de anticipar y hacer previsiones para el ingreso, permanencia y salida del personal, con el fin de utilizar los recursos humanos del modo más eficaz posible para alcanzar los objetivos estratégicos."*

El planeamiento evita crisis recurrentes:
- Falta de perfiles calificados cuando el negocio se expande (*cuellos de botella*).
- Excesos imprevistos de dotación que encarecen la nómina en épocas de retracción.
- Obsolescencia técnica de los colaboradores frente a disrupciones del mercado.

---

### 2. Los Cinco Pasos del Proceso de Planeamiento de CH
1. **Establecimiento de la Misión, Visión y Objetivos Corporativos**: El norte del negocio determina el perfil de organización requerido.
2. **Escaneo del Entorno y Análisis de Fuerzas Externas/Internas**: Estudio del mercado laboral, competencia, contexto macroeconómico y regulaciones vigentes.
3. **Pronóstico de Oferta y Demanda de Capital Humano**:
   - *Demanda futura*: Cuántas personas, con qué competencias y en qué áreas se necesitarán a 1, 2 o 3 años.
   - *Oferta interna*: Con quiénes se cuenta hoy, qué potencial de promoción tienen y quiénes podrían jubilarse o desvincularse.
   - *Oferta externa*: Disponibilidad real de graduados y especialistas en el mercado abierto.
4. **Formulación y Ejecución de la Estrategia de CH**: Acciones concretas para cerrar la brecha (*gap analysis*): planes de contratación, *upskilling*, convenios universitarios o reconversión.
5. **Evaluación, Medición de Resultados y Control**: Tableros de control de rotación, tiempo de cobertura de vacantes y costo por contratación.

---

### 3. Planeamiento Estratégico vs. Planeamiento Operativo
| Criterio | Planeamiento Estratégico de CH | Planeamiento Operativo de CH |
| :--- | :--- | :--- |
| **Horizonte Temporal** | Mediano y largo plazo (1 a 5 años). | Corto plazo (inmediato a 1 año calendario). |
| **Nivel de Decisión** | Alta Dirección y Gerencia General. | Mandos medios, supervisores y líderes operativos. |
| **Alcance** | Global, holístico y transformador. | Específico, departamental y presupuestario. |
| **Foco Central** | Adaptación al entorno competitivo y cierre de brechas de capacidades futuras. | Asignación de turnos, cronogramas de vacaciones, presupuesto de sueldos del año. |

---

### 4. Factores y Limitantes Externos al Planificar
La planificación de CH no ocurre en el vacío. Está condicionada por:
- **Condiciones del mercado laboral y competencia**: Fuga de perfiles demandados (ej. desarrolladores Senior, ingenieros DevOps).
- **Entorno Macroeconómico e Inflación**: Presión sobre la escala salarial, devaluaciones y distorsiones salariales entre posiciones locales y regionales.
- **Cambios Demográficos y Culturales**: Nuevas expectativas laborales de las generaciones jóvenes (priorización del trabajo remoto, nómades digitales y propósito social).
- **Marco Regulatorio y Legislación Laboral**: Costos indemnizatorios, regímenes de teletrabajo y convenios colectivos.

---

### 5. Estrategias Genéricas de Michael Porter y su Impacto en CH
La estrategia competitiva elegida por la compañía define directamente qué conductas y perfiles de talento deben promoverse:
1. **Liderazgo en Costos**:
   - La empresa busca ser el productor más eficiente y económico del sector.
   - *Política de CH*: Control estricto de la nómina, estandarización de tareas, foco en la productividad por hora, compensaciones fijas previsibles y automatización de procesos repetitivos.
2. **Diferenciación de Producto / Servicio**:
   - La empresa busca ofrecer soluciones únicas e innovadoras percibidas como exclusivas (*ej. Apple, diseño UX de vanguardia*).
   - *Política de CH*: Búsqueda de perfiles de alta creatividad, tolerancia a la experimentación, compensaciones agresivas y variables por mérito, programas intensivos de capacitación y autonomía operativa.
3. **Enfoque o Nicho**:
   - Especialización profunda en un segmento particular de clientes o vertical industrial.
   - *Política de CH*: Reclutamiento de especialistas con conocimiento vertical de nicho y fidelización a largo plazo.`,
        simplifiedExplanation:
          "Planificar en Capital Humano es adelantarse al futuro: saber con tiempo cuántas personas vas a necesitar en 2 o 3 años, qué conocimientos nuevos van a tener que dominar y cómo vas a conseguirlos. Si tu empresa compite vendiendo barato (Liderazgo en Costos de Porter), tu plan de RRHH cuidará cada centavo de la nómina y buscará máxima eficiencia. Si compite innovando con productos únicos (Diferenciación), tendrás que pagar sueldos altos, contratar a los mejores creativos y darles libertad para experimentar.",
        keyPoints: [
          "El Planeamiento de CH (Bohlander) busca anticipar ingresos, permanencias y salidas para optimizar el aporte de valor.",
          "El proceso canónico sigue 5 pasos: Objetivos, Escaneo del entorno, Pronóstico de oferta/demanda, Ejecución del plan y Control.",
          "Diferencia temporal: Estratégico (1-5 años, directivo, holístico) vs. Operativo (corto plazo, anual, presupuestario).",
          "Factores externos limitantes: mercado de talento tech, inflación, regulaciones y cambios en las aspiraciones generacionales.",
          "Alineación con Porter: Liderazgo en Costos exige eficiencia y estandarización; Diferenciación exige creatividad, autonomía y retención agresiva.",
        ],
        definitions: [
          { term: "Planeamiento Estratégico de CH", definition: "Proceso directivo de anticipación que proyecta las necesidades de dotación y competencias requeridas para materializar la estrategia del negocio." },
          { term: "Análisis de Brechas (Gap Analysis)", definition: "Comparación sistemática entre las competencias y cantidad de personal actual frente a las necesidades proyectadas a futuro." },
          { term: "Estrategia de Diferenciación (Porter)", definition: "Posicionamiento competitivo enfocado en ofrecer productos o servicios con atributos únicos y valorados, requiriendo talento innovador y creativo." },
          { term: "Estrategia de Liderazgo en Costos (Porter)", definition: "Estrategia orientada a operar con los costos más bajos del sector, impulsando estandarización y estricto control de gastos laborales." },
        ],
        examples: [
          { title: "Planificación de expansión en una Fintech", description: "La fintech proyecta triplicar usuarios en 2 años. El plan de CH anticipa que necesitará 40 ingenieros de datos y comienza convenios con facultades 18 meses antes." },
          { title: "Porter en Software Factories vs. Retail de descuento", description: "Una consultora de IA (Diferenciación) otorga bonos en dólares y semanas de capacitación; un call center masivo (Costos) estandariza métricas de llamadas y turnos rígidos." },
        ],
        commonMistakes: [
          { mistake: "Diseñar el plan de CH desvinculado del plan de negocio", explanation: "Armar programas de capacitación en tecnologías que la empresa no piensa adoptar o contratar masivamente sin previsión de ventas." },
          { mistake: "Confundir el presupuesto operativo anual con el planeamiento estratégico", explanation: "El presupuesto solo calcula el costo salarial inmediato; el plan estratégico anticipa qué capacidades competitivas necesitará la firma en el próximo quinquenio." },
        ],
      },
      topics: [
        { name: "Planeamiento Estratégico de CH (Bohlander)", description: "Proceso sistemático de 5 pasos para proyectar la dotación y capacidades futuras.", importance: "critical" },
        { name: "Planeamiento Estratégico vs. Planeamiento Operativo", description: "Distinción temporal, de alcance decisorio y de objetivos entre ambos niveles.", importance: "high" },
        { name: "Estrategias de Michael Porter aplicadas a Capital Humano", description: "Alineación de compensaciones, reclutamiento y cultura según Costos o Diferenciación.", importance: "critical" },
      ],
      flashcards: [
        { front: "¿Cómo define George Bohlander la planeación del Capital Humano?", back: "Como el proceso sistemático de anticipar y hacer previsiones para el ingreso, permanencia y salida del personal, con el fin de utilizar los recursos humanos del modo más eficaz para alcanzar las metas estratégicas.", difficulty: "medium" },
        { front: "¿Cuáles son las diferencias principales entre la planificación estratégica y la operativa de CH?", back: "La estratégica es a mediano/largo plazo (1 a 5 años), abarca a toda la organización y se alinea al negocio competitivo. La operativa es a corto plazo (hasta 1 año), departamental y centrada en turnos y presupuestos.", difficulty: "easy" },
        { front: "¿Cómo repercute una estrategia de 'Liderazgo en Costos' de Porter en las prácticas de Capital Humano?", back: "Exige estricto control presupuestario de la nómina, procesos estandarizados, capacitación orientada a la eficiencia operativa y esquemas salariales de productividad fija.", difficulty: "medium" },
      ],
      questions: [
        {
          question: "Una compañía de tecnología decide competir mediante una estrategia de 'Diferenciación' (Porter). ¿Cuál de las siguientes políticas de Capital Humano es la más congruente con esa decisión?",
          options: [
            "Estandarizar al extremo las descripciones de tareas y penalizar los errores de experimentación.",
            "Congelar los sueldos en niveles mínimos de mercado y reducir el presupuesto de capacitación.",
            "Diseñar planes de compensación variable agresivos, fomentar la creatividad y contratar perfiles de alto potencial innovador.",
            "Subcontratar todas las áreas de desarrollo en agencias de bajo costo sin relación de dependencia.",
          ],
          answer: "Diseñar planes de compensación variable agresivos, fomentar la creatividad y contratar perfiles de alto potencial innovador.",
          explanation: "La diferenciación exige que el talento sea creativo, motivado y capaz de resolver problemas inéditos, requiriendo esquemas de atracción y reconocimiento premium.",
          difficulty: "easy",
          type: "multiple_choice",
        },
        {
          question: "Dentro de los 5 pasos del planeamiento de CH de Bohlander, ¿qué actividad caracteriza al 'Análisis de Brechas' (Gap Analysis)?",
          options: [
            "Calcular el importe final de la liquidación de haberes mensuales.",
            "Contrastar la demanda futura proyectada de talento frente a la oferta real interna y externa disponible.",
            "Redactar el estatuto social de la compañía ante las autoridades públicas.",
            "Sancionar formalmente los desvíos de asistencia en el reloj biométrico.",
          ],
          answer: "Contrastar la demanda futura proyectada de talento frente a la oferta real interna y externa disponible.",
          explanation: "El análisis de brechas identifica qué perfiles faltan, qué capacidades deben desarrollarse internamente y cuántas vacantes deben buscarse en el mercado para cumplir el plan.",
          difficulty: "medium",
          type: "multiple_choice",
        },
      ],
    },
    {
      classNumber: 4,
      fileName: "Clase 4 2C2026.pdf",
      relativeStoragePath: "uploads/materials/miercoles_gestion/Clase 4 2C2026.pdf",
      classTitle: "Clase 4: Integración Vertical/Horizontal, Matriz FODA de CH, RSE y Caso Globant",
      summary: {
        title: "Resumen Académico · Clase 04: Integración Estratégica, FODA de Capital Humano, RSE y Caso Globant",
        overview:
          "La Clase 04 constituye una sesión medular para comprender la articulación estratégica de la gestión de personas en organizaciones tecnológicas complejas. Se profundiza en el principio de doble integración: la Integración Vertical (subordinación coherente de las políticas de CH a la estrategia del negocio) y la Integración Horizontal (consistencia armónica entre los propios subsistemas de CH). Se desarrolla la metodología de la Matriz FODA aplicada a Capital Humano, contrastando variables internas (Fortalezas y Debilidades del equipo) frente a externas (Oportunidades y Amenazas del mercado IT). Se debate el Caso de Estudio Real de Globant (crisis 2024-2025, despidos de 1.000 empleados y reestructuración con IA). Finalmente, se profundiza en la Responsabilidad Social Empresaria (RSE interna vs. externa según Mondy y Jones), las causas del desempleo y las nuevas tendencias de puestos basados en habilidades (*skills-based*).",
        detailedSummary: `### 1. El Doble Eje de Integración Estratégica de Capital Humano
Para que la gestión de personas genere valor económico real debe operar bajo dos dimensiones concurrentes:
1. **Integración Vertical**:
   - Se produce cuando todas las políticas y acciones de Capital Humano se alinean, responden y están subordinadas a la estrategia corporativa general.
   - *Ejemplo*: Si la empresa decide ingresar al mercado de inteligencia artificial aplicada, CH debe reconfigurar de inmediato los perfiles de búsqueda, los programas de pasantías y los planes de capacitación para aprovisionar esas habilidades.
2. **Integración Horizontal**:
   - Se produce cuando los diferentes subsistemas y procesos de CH guardan estricta coherencia interna entre sí.
   - *Ejemplo*: Si se seleccionan perfiles basados en competencias de trabajo colaborativo, la evaluación de desempeño debe medir la cooperación (no el individualismo) y el esquema de remuneraciones debe premiar los logros del equipo.

---

### 2. Matriz FODA aplicada a Capital Humano
Herramienta de diagnóstico que combina el análisis interno del talento con las fuerzas del entorno competitivo:

| Cuadrante | Variables Internas / Externas | Ejemplos concretos en la Industria Tech |
| :--- | :--- | :--- |
| **Fortalezas (F)** | Internas (Controlables) | Dominio técnico consolidado en arquitecturas cloud, baja rotación voluntaria en puestos clave, marca empleadora atractiva. |
| **Oportunidades (O)** | Externas (No controlables) | Auge de herramientas de People Analytics e IA generativa, oferta de egresados de bootcamps, mercado global para exportar servicios. |
| **Debilidades (D)** | Internas (Controlables) | Brechas de habilidades blandas en mandos medios, atraso en la escala salarial frente al mercado, despidos que dañaron el clima interno. |
| **Amenazas (A)** | Externas (No controlables) | Competencia salarial en dólares de empresas del exterior, inflación que licua el poder adquisitivo local, escasez crítica de talentos Senior. |

---

### 3. Caso de Estudio: FODA y Crisis de Globant (2024 - 2025)
La cátedra analiza exhaustivamente el caso de **Globant** para contrastar la teoría con la volatilidad del sector IT:
- **Fortalezas históricas**: Sólida reputación en reclutamiento técnico, presencia global, ecosistema de innovación y expansión de ingresos por servicios de IA (+110%).
- **El punto de inflexión (Crisis 2024-2025)**:
  - Despidos masivos de aproximadamente 1.000 colaboradores.
  - Caída abrupta en la cotización de sus acciones y deterioro severo del clima laboral interno.
  - Debilitamiento del *Employer Branding*: pérdida de confianza en la estabilidad de carrera y reclamos por desfasaje salarial.
- **Debate y Recomendaciones directivas de la cátedra**:
  - Recomponer la comunicación interna transparente y asertiva.
  - Implementar programas de *reskilling* hacia tecnologías cognitivas en lugar de desvinculaciones unilaterales.
  - Recuperar el sentido de pertenencia y diseñar esquemas de compensación vinculados a resultados transparentes.

---

### 4. Responsabilidad Social Empresaria (RSE) en Capital Humano (Mondy & Jones)
La RSE ya no es una mera donación filantrópica; es una gestión ética que impacta en el empleo:
- **RSE Interna (Hacia los propios colaboradores)**:
  - Garantía de condiciones de trabajo seguras y dignas.
  - Equidad retributiva sin brechas de género ni discriminación.
  - Planes de salud mental, ergonomía en teletrabajo y conciliación con la vida familiar.
  - Empleabilidad a largo plazo: capacitación continua para evitar la obsolescencia laboral.
- **RSE Externa**:
  - Apoyo a la comunidad educativa circundante, becas de inclusión tecnológica y cuidado ambiental.

---

### 5. Tipologías del Desempleo y Tendencias del Trabajo Digital
- **Desempleo Estructural**: Causado por el descalce (*mismatch*) entre lo que las empresas tecnológicas demandan y las habilidades obsoletas que ofrece la fuerza de trabajo.
- **Desempleo Friccional**: Período de transición natural en que un profesional cambia voluntariamente de empleo.
- **Desempleo Cíclico / Macroeconómico**: Vinculado a recesiones generales de la economía y caída de la demanda agregada.
- **Tendencia hacia Organizaciones basadas en Habilidades (*Skills-based*)**: El puesto tradicional rígido desaparece; los empleados se asignan dinámicamente a proyectos según sus micro-competencias demostradas.`,
        simplifiedExplanation:
          "Para que Recursos Humanos funcione, tiene que mirar hacia afuera de la empresa (Integración Vertical: saber qué necesita el negocio) y hacia adentro de sus propios procesos (Integración Horizontal: que el sueldo, la selección y la evaluación apunten a lo mismo). El caso de Globant nos demuestra que tener tecnología de punta no sirve si descuidás a la gente: despedir a 1.000 personas de golpe destruyó el clima laboral y la marca empleadora. Una empresa verdaderamente responsable cuida a sus empleados con RSE interna (sueldos justos, salud mental, flexibilidad).",
        keyPoints: [
          "Integración Vertical: subordinar las políticas de CH a las metas del negocio; Integración Horizontal: coherencia mutua entre subsistemas de CH.",
          "La Matriz FODA aplicada a CH identifica capacidades internas (Fortalezas/Debilidades) y condiciones del mercado laboral (Oportunidades/Amenazas).",
          "Caso Globant: demostración empírica de cómo los despidos masivos dañan la marca empleadora, la confianza y la retención del talento clave.",
          "RSE Interna (Mondy y Jones): condiciones de trabajo dignas, equidad, conciliación vida-trabajo y programas de capacitación continua.",
          "El desempleo estructural en tecnología ocurre cuando la formación de la población no coincide con las habilidades requeridas por la industria.",
        ],
        definitions: [
          { term: "Integración Vertical de CH", definition: "Alineamiento y subordinación de las estrategias y políticas de Capital Humano respecto a la estrategia corporativa de la organización." },
          { term: "Integración Horizontal de CH", definition: "Coherencia, consistencia y articulación recíproca entre los distintos subsistemas de gestión de personas (selección, evaluación, compensaciones, capacitación)." },
          { term: "RSE Interna", definition: "Conjunto de prácticas éticas empresariales volcadas hacia los propios empleados: seguridad laboral, equidad salarial, bienestar y desarrollo profesional." },
          { term: "Desempleo Estructural", definition: "Desocupación generada por la discrepancia insalvable entre las competencias que buscan los empleadores y las calificaciones que poseen los trabajadores." },
        ],
        examples: [
          { title: "Falta de Integración Horizontal", description: "Una empresa anuncia que premia la innovación y el trabajo en equipo, pero en la evaluación de desempeño y bono salarial solo premia a quienes redujeron horas extra individuales." },
          { title: "Impacto del Caso Globant en Reclutamiento", description: "Luego de las desvinculaciones de 2024-2025, los reclutadores de Globant enfrentaron el doble de rechazo de ofertas salariales por temor de los candidatos a la inestabilidad laboral." },
        ],
        commonMistakes: [
          { mistake: "Creer que la RSE es solo hacer donaciones externas a fundaciones", explanation: "La base ética de la RSE radica primero en las condiciones laborales de la propia dotación (RSE interna: salarios dignos, trato humano, balance de vida)." },
          { mistake: "Analizar el FODA como un ejercicio estático de una sola vez", explanation: "En mercados tecnológicos volátiles, las debilidades y oportunidades cambian trimestralmente y exigen ajustes continuos en el plan de talento." },
        ],
      },
      topics: [
        { name: "Integración Vertical y Horizontal en CH", description: "Coordinación bidireccional con el negocio y consistencia entre subsistemas internos.", importance: "critical" },
        { name: "Matriz FODA de Capital Humano y Caso Globant", description: "Diagnóstico estratégico, crisis de dotación, despidos masivos e impacto en el clima laboral.", importance: "critical" },
        { name: "Responsabilidad Social Empresaria (RSE) Interna y Desempleo", description: "Ética en el empleo, bienestar, causas del desempleo estructural y organizaciones por habilidades.", importance: "high" },
      ],
      flashcards: [
        { front: "¿Qué diferencia existe entre la Integración Vertical y la Integración Horizontal en la gestión de CH?", back: "La Integración Vertical alinea la estrategia de CH a los objetivos de negocio de la empresa. La Integración Horizontal asegura que los subsistemas de CH (selección, evaluación, sueldos) sean coherentes entre sí.", difficulty: "medium" },
        { front: "¿Cuáles son las 4 dimensiones de la Matriz FODA aplicada al Capital Humano?", back: "Fortalezas (competencias internas destacadas), Debilidades (falencias o brechas de habilidades internas), Oportunidades (tendencias y recursos externos favorables) y Amenazas (fuga de talento, inflación, competencia global).", difficulty: "easy" },
        { front: "¿Qué lecciones clave dejó la crisis de Globant (2024-2025) analizada en la cátedra?", back: "Demostró que los despidos masivos unilaterales dañan severamente la marca empleadora (Employer Branding), deterioran el clima laboral y aumentan la desconfianza del personal remanente, exigiendo comunicación transparente y planes de reskilling.", difficulty: "medium" },
        { front: "¿Qué distingue a la RSE Interna de la RSE Externa según Wayne Mondy?", back: "La RSE Interna se enfoca en el bienestar, equidad, salud laboral y desarrollo de los propios colaboradores de la empresa; la Externa se vuelca a la comunidad, el medio ambiente y la sociedad en general.", difficulty: "easy" },
      ],
      questions: [
        {
          question: "Si una empresa de software formula un plan para desembarcar en el sector Fintech y su área de CH readecua de inmediato las búsquedas y capacitaciones a perfiles de seguridad bancaria, está ejecutando una:",
          options: [
            "Integración Horizontal de CH",
            "Integración Vertical de CH",
            "Liquidación de haberes descentralizada",
            "Estrategia de liderazgo en costos fabril",
          ],
          answer: "Integración Vertical de CH",
          explanation: "La Integración Vertical se produce cuando las políticas y prioridades de Capital Humano se subordinan y acoplan directamente a las prioridades estratégicas del negocio.",
          difficulty: "medium",
          type: "multiple_choice",
        },
        {
          question: "En el análisis FODA de Capital Humano de una empresa tecnológica argentina, ¿cuál de las siguientes opciones constituye una 'Amenaza' externa típica?",
          options: [
            "Falta de capacitación del personal interno en metodologías Scrum.",
            "La captación de profesionales locales por parte de empresas extranjeras con pagos directos en moneda extranjera (dólares).",
            "Un clima laboral enrarecido por falta de comunicación interna.",
            "La modernización del portal de autoservicio del empleado.",
          ],
          answer: "La captación de profesionales locales por parte de empresas extranjeras con pagos directos en moneda extranjera (dólares).",
          explanation: "La competencia salarial foránea con divisas fuertes proviene del entorno macroeconómico externo sobre el cual la empresa local no tiene control directo.",
          difficulty: "easy",
          type: "multiple_choice",
        },
      ],
    },
    {
      classNumber: 5,
      fileName: "Clase 5 2C2026.pdf",
      relativeStoragePath: "uploads/materials/miercoles_gestion/Clase 5 2C2026.pdf",
      classTitle: "Clase 5: Employer Branding, Balance Social (OIT) y Gestión del CH en PyMEs vs Sector Público",
      summary: {
        title: "Resumen Académico · Clase 05: Employer Branding, Balance Social OIT y CH en PyMEs y Sector Público",
        overview:
          "La Clase 05 explora las herramientas contemporáneas de posicionamiento de la organización y la diversidad de realidades según su escala y naturaleza jurídica. Se profundiza en el concepto de Employer Branding (Marca Empleadora) y Propuesta de Valor al Empleado (EVP), que reemplaza la antigua visión de que el salario económico es el único factor de atracción. Se detalla el instrumento del Balance Social según las directrices del Manual de la OIT (2001), examinando sus rubros cuantitativos y cualitativos de auditoría socio-laboral. A continuación, se comparan las políticas de Capital Humano en Grandes Empresas versus PyMEs tecnológicas y Empresas Familiares (analizando la centralización en el fundador, agilidad, informalidad y desafíos de retención), culminando con las características singulares del empleo en la Administración Pública.",
        detailedSummary: `### 1. Employer Branding y la Propuesta de Valor al Empleado (EVP)
El salario económico ya no basta para atraer ni retener al talento tecnológico calificado. El **Employer Branding** es la reputación integral de una empresa como empleador:
- **Gestión del talento**: Reconocer, recompensar y diferenciar de forma competitiva a quienes agregan valor extraordinario.
- **Comunicación inclusiva**: Fomentar la contención, diversidad y respeto en todos los canales organizacionales.
- **Clima laboral ameno**: Foco en la empatía, el trato cotidiano digno y la seguridad psicológica.
- **Autogestión de los colaboradores**: Plataformas de autoservicio para trámites de RRHH y autonomía en la toma de decisiones cotidianas.
- **Flexibilidad laboral**: Esquemas híbridos, trabajo por objetivos y respeto a la desconexión digital.

---

### 2. El Balance Social (Manual OIT 2001)
El **Balance Social** es un instrumento sistemático de gestión y auditoría que sirve para medir, evaluar y reportar con claridad los resultados de la política social y laboral de la empresa durante un período determinado:

#### Rubros e Indicadores Fundamentales a Considerar:
1. **Empleo y Dotación**: Evolución de la dotación fija/temporal, tasa de rotación, estructura de edades, equidad de género e inclusión de personas con discapacidad.
2. **Condiciones de Trabajo, Seguridad e Higiene**: Siniestralidad, accidentes laborales, días perdidos por enfermedad, ergonomía y salud ocupacional.
3. **Remuneraciones y Beneficios Sociales**: Masa salarial total, salario promedio por categorías, beneficios en especie, seguro médico y previsión social.
4. **Capacitación y Formación**: Horas de capacitación anuales por empleado, presupuesto invertido y programas de desarrollo de habilidades.
5. **Relaciones Laborales e Integración**: Conflictividad laboral, tasa de sindicalización, convenios alcanzados y mecanismos de participación interna.

---

### 3. Gestión del Capital Humano en PyMEs vs. Grandes Empresas
| Aspecto de Gestión | Grandes Empresas / Corporaciones | Pequeñas y Medianas Empresas (PyMEs) |
| :--- | :--- | :--- |
| **Toma de Decisiones** | Protocolizada, comités directivos, descentralizada con políticas formales. | Altamente centralizada en la figura del dueño o socio fundador. |
| **Estructura del Área de CH** | Departamentalizada: especialistas en reclutamiento, compensaciones, legales y formación. | Muy reducida o unipersonal (muchas veces externalizada a estudios contables). |
| **Formalización de Procesos** | Manuales de puestos, evaluaciones 360° y planes de carrera formales. | Informalidad en la evaluación; acuerdos directos y verbales con el fundador. |
| **Ventajas y Puntos a Favor** | Altos presupuestos, beneficios corporativos, solidez y marca global. | **Flexibilidad, rápida adaptación al cambio, cercanía humana, menor burocracia.** |
| **Desventajas y Obstáculos** | Lentitud en la toma de decisiones, burocracia, despersonalización. | **Dificultad extrema para retener talento, presupuestos limitados, ausencia de planes de carrera.** |

---

### 4. Particularidades de las PyMEs del Sector IT en Argentina
- Se enfrentan a una asimetría competitiva: compiten por los mismos ingenieros y diseñadores contra multinacionales y clientes del exterior que pagan en moneda dura.
- Deben apalancarse en la flexibilidad, aprendizaje acelerado, proyectos desafiantes y un clima de alta calidez humana para compensar las brechas salariales.

---

### 5. Gestión del Capital Humano en la Administración Pública
La cátedra contrasta el ámbito privado con el Estado:
- **Estabilidad laboral**: Garantía constitucional y legal de estabilidad en el empleo público.
- **Carrera administrativa y Escalafón**: Ascensos pautados estrictamente por antigüedad o concursos reglamentados, con escasa discrecionalidad gerencial.
- **Remuneraciones**: Tablas rígidas fijadas por ley o paritarias centrales, sin flexibilidad para premiar el mérito individual inmediato.
- **Rigidez normativa**: Dificultad para desvincular personal no productivo o reestructurar puestos ágilmente.`,
        simplifiedExplanation:
          "Employer Branding es la imagen que tiene tu empresa para que la gente quiera trabajar en ella: flexibilidad, buen clima, tecnología moderna y respeto. El Balance Social de la OIT es una especie de informe contable, pero de la gente: mide cuántos accidentes hubo, cuántas horas se capacitó a los empleados y cómo se pagaron los sueldos. Por último, no es lo mismo gestionar personas en una PyME (donde el dueño decide todo en un pasillo pero hay agilidad) que en una multinacional o en el Estado (donde todo está atado a leyes y escalafones rígidos).",
        keyPoints: [
          "El Employer Branding y la EVP van más allá del sueldo: abarcan flexibilidad, autonomía, clima laboral y diversidad.",
          "El Balance Social (OIT 2001) audita la gestión socio-laboral: empleo, higiene y seguridad, remuneraciones y capacitación.",
          "En las PyMEs, la figura del dueño concentra las decisiones de personal, lo que otorga agilidad pero genera informalidad y falta de planes de carrera.",
          "Las PyMEs del sector IT en Argentina sufren la fuga de talentos hacia el exterior y deben apalancar su propuesta de valor en desafíos técnicos y cercanía.",
          "El Sector Público se caracteriza por estabilidad garantizada, escalafón rígido y baja capacidad para premiar el mérito diferencial.",
        ],
        definitions: [
          { term: "Employer Branding", definition: "Estrategia integral orientada a posicionar a la empresa como un empleador atractivo y de excelencia para el talento actual y potencial." },
          { term: "Propuesta de Valor al Empleado (EVP)", definition: "Conjunto total de retribuciones tangibles e intangibles (sueldo, cultura, aprendizaje, flexibilidad) que una organización ofrece a cambio del aporte del colaborador." },
          { term: "Balance Social", definition: "Documento e instrumento de gestión estandarizado (OIT) que refleja periódicamente los aspectos sociales, laborales y éticos de la empresa." },
          { term: "Escalafón Administrativo", definition: "Estructura jerárquica reglamentada del sector público donde los cargos y remuneraciones se determinan por categorías formales y antigüedad." },
        ],
        examples: [
          { title: "Employer Branding con Flexibilidad", description: "Una startup permite a sus desarrolladores trabajar desde cualquier país hasta 3 meses al año y otorga viernes a la tarde libres, atrayendo perfiles que rechazan ofertas bancarias rígidas." },
          { title: "El Dilema del Fundador en la PyME", description: "Un programador solicita un aumento o cambio de puesto, pero debe esperar a que el dueño de la PyME regrese de un viaje comercial porque no hay políticas de CH delegadas." },
        ],
        commonMistakes: [
          { mistake: "Asumir que el Balance Social es exclusivo de empresas con fines de lucro", explanation: "Cualquier organización (cooperativas, ONG, entidades públicas) puede y debe auditar su impacto laboral mediante el Balance Social de la OIT." },
          { mistake: "Intentar copiar burocráticamente los manuales de una multinacional en una PyME", explanation: "Las PyMEs triunfan por su flexibilidad y cercanía; ahogarlas en manuales rígidos de 500 páginas destruye su principal ventaja competitiva." },
        ],
      },
      topics: [
        { name: "Employer Branding y Propuesta de Valor al Empleado (EVP)", description: "Estrategias de marca empleadora, flexibilidad, clima y autogestión en la era digital.", importance: "high" },
        { name: "Balance Social (Manual de la OIT 2001)", description: "Concepto, rubros cuantitativos y cualitativos de auditoría socio-laboral.", importance: "critical" },
        { name: "Gestión de Capital Humano en PyMEs vs. Sector Público", description: "Comparación de estructuras, toma de decisiones, ventajas y obstáculos según el tipo de organización.", importance: "critical" },
      ],
      flashcards: [
        { front: "¿Qué es el Employer Branding y cuáles son sus pilares fundamentales?", back: "Es la estrategia de construcción y gestión de la reputación de la empresa como empleador deseable, sostenida en la gestión del talento, clima laboral, comunicación inclusiva, autogestión y flexibilidad.", difficulty: "easy" },
        { front: "¿Qué es el Balance Social según las directrices de la OIT?", back: "Es un instrumento de auditoría y diagnóstico periódico que cuantifica y evalúa el cumplimiento de la responsabilidad social y laboral de la empresa (empleo, seguridad, sueldos, capacitación y relaciones sindicales).", difficulty: "medium" },
        { front: "¿Cuáles son los principales puntos a favor y en contra de la gestión de CH en una PyME?", back: "A favor: agilidad, rápida adaptabilidad al cambio, comunicación directa y clima cercano. En contra: concentración de decisiones en el dueño, recursos limitados, falta de planes de carrera formales y alta dificultad de retención.", difficulty: "medium" },
      ],
      questions: [
        {
          question: "¿Cuál de los siguientes rubros forma parte indispensable de los indicadores analizados en el Balance Social según la OIT (2001)?",
          options: [
            "La cotización diaria de las acciones en la bolsa de valores.",
            "Las condiciones de trabajo, seguridad e higiene y días perdidos por siniestralidad laboral.",
            "El balance contable de amortización impositiva de bienes de uso.",
            "El cronograma de lanzamientos comerciales de marketing digital.",
          ],
          answer: "Las condiciones de trabajo, seguridad e higiene y días perdidos por siniestralidad laboral.",
          explanation: "El Balance Social audita el factor humano y laboral interno: seguridad, higiene, empleo, salarios y formación continua.",
          difficulty: "medium",
          type: "multiple_choice",
        },
        {
          question: "¿Cuál es el principal factor que suele obstaculizar la retención de perfiles tecnológicos Senior en una PyME frente a grandes empresas?",
          options: [
            "La excesiva lentitud burocrática para tomar decisiones en la PyME.",
            "La falta de cercanía con los directivos de la empresa.",
            "La limitación presupuestaria para competir con paquetes de compensaciones globales y la escasez de planes de carrera estructurados.",
            "La imposibilidad de comunicarse directamente con los clientes.",
          ],
          answer: "La limitación presupuestaria para competir con paquetes de compensaciones globales y la escasez de planes de carrera estructurados.",
          explanation: "Las PyMEs sufren desventajas salariales y de previsibilidad de carrera frente a multinacionales o firmas extranjeras que ofrecen beneficios corporativos masivos.",
          difficulty: "easy",
          type: "multiple_choice",
        },
      ],
    },
    {
      classNumber: 6,
      fileName: "GTHID Clase 6  2C2026.pdf",
      relativeStoragePath: "uploads/materials/miercoles_gestion/GTHID Clase 6  2C2026.pdf",
      classTitle: "Clase 6: Paradigmas en Gestión de CH: Motivación (Herzberg), Liderazgo y Competencias (Martha Alles)",
      summary: {
        title: "Resumen Académico · Clase 06: Paradigmas de CH, Motivación (Herzberg), Liderazgo y Competencias",
        overview:
          "La Clase 06 se adentra en la Unidad 3 sobre Paradigmas en la gestión del Talento Humano, sustentada en la obra de Pérez Van Morlegan (2011). Se conceptualizan los paradigmas como ideas-fuerza que orientan las prácticas y concepciones del factor humano. Se examina en detalle la Teoría Bifactorial de Frederick Herzberg, desarticulando la falacia de que el salario motiva por sí mismo (diferenciación entre Factores Higiénicos que previenen insatisfacción y Factores Motivacionales que generan compromiso real). Se analiza la Comunicación Asertiva, el Liderazgo Situacional (Hersey & Blanchard) y la distinción entre grupo y Trabajo en Equipo (Team Building). Finalmente, se profundiza en el Modelo de Gestión por Competencias (Martha Alles y Fernández López): componentes del saber, saber hacer, querer y poder hacer, diccionario de conductas observables, niveles de gradación y su impacto transversal en selección, evaluación y carrera.",
        detailedSummary: `### 1. Los Paradigmas en la Gestión de Capital Humano (Pérez Van Morlegan 2011)
Los paradigmas son **ideas-fuerza rectoras** que concentran conceptos y puntos de vista sobre el valor de las personas. Prevalecen por encima de las herramientas tecnológicas o técnicas específicas. Si el paradigma directivo considera al empleado como un costo desconfiable, ningún software de RRHH solucionará el clima laboral.

---

### 2. Teorías de Motivación: La Teoría Bifactorial de Frederick Herzberg
Herzberg revolucionó la psicología laboral al demostrar que **lo opuesto a la satisfacción no es la insatisfacción, sino la 'no-satisfacción'**:

| Dimensión | FACTORES HIGIÉNICOS (Extrínsecos / De Mantenimiento) | FACTORES MOTIVACIONALES (Intrínsecos / De Crecimiento) |
| :--- | :--- | :--- |
| **Definición** | Se relacionan con el **entorno y las condiciones** que rodean al trabajo. | Se relacionan directamente con el **contenido y la naturaleza de la tarea**. |
| **Componentes** | Salario base, condiciones físicas, seguridad laboral, políticas de la empresa, supervisión técnica, beneficios de obra social. | Logro de objetivos desafiantes, reconocimiento explícito, responsabilidad delegada, autonomía, trabajo estimulante, desarrollo personal. |
| **Efecto de su ausencia** | **Generan profunda insatisfacción y quejas.** | No generan quejas severas; solo 'ausencia de motivación'. |
| **Efecto de su presencia** | **Eliminan la insatisfacción, pero NO generan motivación duradera.** | **Generan alta motivación, compromiso genuino y productividad superior.** |

> **Conclusión clave de la cátedra:** *"El dinero y las oficinas modernas son higiénicos: si faltan, la gente se queja y se va. Pero si los tenés, solo conseguís que no estén disconformes. La motivación verdadera nace de sentirse valorado, tener autonomía y afrontar desafíos estimulantes."*

---

### 3. Comunicación Organizacional y Liderazgo Situacional
- **Comunicación Asertiva**: Flujo multidireccional (ascendente, descendente y horizontal) con escucha activa y erradicación de barreras y rumores.
- **Liderazgo Situacional (Hersey & Blanchard)**:
  - No existe un único estilo de liderazgo perfecto. El líder exitoso adapta su conducta a la **madurez profesional y motivación** del colaborador:
    1. *Dirigir (Instruir)*: Para quien no sabe y tiene baja confianza (alta dirección en la tarea, baja relación).
    2. *Guiar (Persuadir)*: Para quien tiene entusiasmo pero le faltan habilidades (alta tarea, alta relación).
    3. *Apoyar (Participar)*: Para quien tiene alta competencia pero duda de su motivación (baja tarea, alta relación).
    4. *Delegar*: Para el profesional autónomo, competente y comprometido (baja tarea, baja relación).
- **Trabajo en Equipo (*Team Building*)**: A diferencia de un simple grupo que suma individualidades, el equipo posee interdependencia positiva, sinergia colaborativa y responsabilidad colectiva por el resultado.

---

### 4. El Modelo de Gestión por Competencias (Martha Alles & Fernández López)
El modelo vincula el plan estratégico de la compañía con los comportamientos observables de las personas.

#### ¿Qué es una Competencia?
> *"Es una característica de personalidad profunda y duradera, que subyace en el individuo y que determina o predice un comportamiento exitoso y un desempeño superior en el puesto de trabajo."*

#### Los Cuatro Pilares del Perfil de Competencia:
1. **SABER (Conocimientos)**: Información teórica, títulos, conceptos aprendidos.
2. **SABER HACER (Habilidades / Destrezas)**: Capacidad práctica de aplicar el conocimiento a situaciones reales.
3. **QUERER HACER (Actitudes / Motivación)**: Voluntad, valores, ganas e iniciativa personal.
4. **PODER HACER (Entorno / Aptitud)**: Contar con los recursos, autoridad y contexto organizacional para actuar.

#### Estructura y Niveles Conductuales:
- Se redacta un **Diccionario de Competencias** institucional donde cada competencia se desglosa en niveles observables (ej. A: Excelente / Referente; B: Muy Bueno; C: Bueno; D: En desarrollo).
- **Aplicación integral en el área de CH**:
  - *Selección*: Entrevistas por Incidentes Críticos (*STAR: Situación, Tarea, Acción, Resultado*) para evaluar conductas pasadas reales.
  - *Evaluación de Desempeño*: Evaluación 360° para contrastar el nivel real del colaborador contra el nivel exigido por el perfil.
  - *Capacitación*: Foco preciso en cerrar brechas de competencia diagnosticadas.

#### Competencias Clave en la Industria Digital:
- **Análisis y Resolución Crítica de Problemas**: Diagnosticar fallas en software y diseñar soluciones óptimas.
- **Liderazgo de Equipos Ágiles**: Conducción empática sin microgestión en entornos de incertidumbre.
- **Visión Estratégica**: Comprender el impacto del código o del producto en el negocio final del cliente.
- **Adaptabilidad y Aprendizaje Continuo**: Asimilar nuevas tecnologías a velocidad vertiginosa.`,
        simplifiedExplanation:
          "Herzberg demostró que un buen sueldo o una linda oficina evitan que la gente esté descontenta (factores higiénicos), pero lo que realmente te motiva a dar lo mejor es que reconozcan tus logros y te den proyectos interesantes (factores motivacionales). El liderazgo debe ser situacional: a un junior lo guiás de cerca, pero a un senior le delegás con confianza. Y con el Modelo de Martha Alles, dejamos de evaluar a la gente por 'si nos cae bien' y la evaluamos por Competencias: conductas concretas que demuestran si sabe, puede y quiere hacer el trabajo con excelencia.",
        keyPoints: [
          "Pérez Van Morlegan: los paradigmas son ideas-fuerza que condicionan todo el estilo de management de personas.",
          "Teoría Bifactorial de Herzberg: Factores Higiénicos (sueldo, entorno) previenen insatisfacción; Factores Motivacionales (logro, autonomía) generan compromiso genuino.",
          "El Liderazgo Situacional adapta el estilo (dirigir, guiar, apoyar o delegar) al nivel de madurez y autonomía del colaborador.",
          "Definición de Competencia (Martha Alles): característica subyacente que predice un desempeño superior verificable en conductas observables.",
          "Los 4 componentes para desarrollar una competencia: Saber (conocimiento), Saber Hacer (habilidad), Querer Hacer (actitud) y Poder Hacer (contexto).",
        ],
        definitions: [
          { term: "Factores Higiénicos (Herzberg)", definition: "Variables extrínsecas del entorno de trabajo (salario, seguridad, normativas) cuya ausencia provoca insatisfacción, pero cuya presencia no motiva de forma duradera." },
          { term: "Factores Motivacionales (Herzberg)", definition: "Variables intrínsecas vinculadas al contenido de la tarea (logro, reconocimiento, desafío, responsabilidad) que generan satisfacción laboral profunda." },
          { term: "Liderazgo Situacional", definition: "Modelo de conducción (Hersey & Blanchard) que postula que no hay un estilo único de liderazgo, sino que debe adecuarse a la madurez de cada colaborador." },
          { term: "Competencia Laboral (Martha Alles)", definition: "Característica de personalidad profunda y duradera que se manifiesta en conductas observables determinantes de un rendimiento exitoso en el puesto." },
          { term: "Técnica STAR (Incidentes Críticos)", definition: "Metodología de entrevista de selección que indaga la Situación, Tarea, Acción y Resultado de conductas pasadas para inferir competencias futuras." },
        ],
        examples: [
          { title: "Salario vs. Motivación en Desarrolladores", description: "Una empresa aumenta 20% el sueldo a un programador, pero le asigna tareas monótonas de soporte sin feedback: el colaborador deja de quejarse del dinero por 2 meses, pero luego renuncia por falta de factores motivacionales." },
          { title: "Liderazgo Situacional en un Squad", description: "El Scrum Master acompaña paso a paso al pasante en sus primeros commits (Dirigir/Guiar), pero al Arquitecto de Software le define objetivos trimestrales y le otorga total autonomía técnica (Delegar)." },
        ],
        commonMistakes: [
          { mistake: "Creer que aumentar el sueldo resuelve la falta de motivación o compromiso", explanation: "El sueldo es un factor higiénico según Herzberg: calma el descontento inmediato, pero no despierta pasión, creatividad ni pertenencia." },
          { mistake: "Definir competencias de forma ambigua o abstracta", explanation: "Las competencias deben traducirse indefectiblemente en conductas observables y medibles, de lo contrario la evaluación de desempeño deviene en favoritismo subjetivo." },
        ],
      },
      topics: [
        { name: "Teoría Bifactorial de Herzberg (Higiénicos vs. Motivacionales)", description: "Diferenciación entre factores extrínsecos de mantenimiento y factores intrínsecos de compromiso.", importance: "critical" },
        { name: "Liderazgo Situacional y Trabajo en Equipo (Team Building)", description: "Adaptación del estilo de conducción (Hersey & Blanchard) y sinergia colaborativa.", importance: "high" },
        { name: "Modelo de Gestión por Competencias (Martha Alles)", description: "Saber, saber hacer, querer y poder; glosario conductual y evaluación por incidentes críticos.", importance: "critical" },
      ],
      flashcards: [
        { front: "¿Por qué el salario NO es un factor motivacional según Frederick Herzberg?", back: "Porque es un factor 'higiénico' o extrínseco. Su ausencia genera insatisfacción, pero su presencia solo previene el descontento; no genera por sí misma motivación ni compromiso duradero.", difficulty: "medium" },
        { front: "¿Cuáles son los 4 estilos de conducción del Liderazgo Situacional de Hersey & Blanchard?", back: "1. Dirigir (alta tarea, baja relación)\n2. Guiar / Persuadir (alta tarea, alta relación)\n3. Apoyar / Participar (baja tarea, alta relación)\n4. Delegar (baja tarea, baja relación).", difficulty: "medium" },
        { front: "¿Cómo define Martha Alles una 'competencia' laboral?", back: "Una característica de personalidad profunda y duradera que subyace en el individuo y se traduce en comportamientos observables directamente asociados con un desempeño superior en el puesto.", difficulty: "easy" },
        { front: "¿Cuáles son los 4 componentes necesarios para que una persona desarrolle una competencia laboral?", back: "1. SABER (Conocimientos teóricos)\n2. SABER HACER (Habilidades y destrezas prácticas)\n3. QUERER HACER (Actitud, motivación y valores)\n4. PODER HACER (Recursos, facultades y entorno propicio).", difficulty: "medium" },
      ],
      questions: [
        {
          question: "Según la Teoría Bifactorial de Frederick Herzberg, ¿cuál de los siguientes elementos constituye un auténtico 'Factor Motivacional' capaz de generar satisfacción y compromiso duradero?",
          options: [
            "El equipamiento de hardware provisto y la luminosidad de la oficina.",
            "La estabilidad contractual garantizada en el convenio colectivo.",
            "La delegación de responsabilidad, la autonomía y el reconocimiento por logros.",
            "El pago puntual de la liquidación de haberes mensuales.",
          ],
          answer: "La delegación de responsabilidad, la autonomía y el reconocimiento por logros.",
          explanation: "Los factores motivacionales son intrínsecos al contenido del trabajo (crecimiento personal, desafío, reconocimiento y autonomía). El resto son factores higiénicos o de mantenimiento.",
          difficulty: "easy",
          type: "multiple_choice",
        },
        {
          question: "En el Modelo de Gestión por Competencias de Martha Alles, ¿qué evalúa la técnica de 'Incidentes Críticos' durante una entrevista de selección?",
          options: [
            "El promedio de calificaciones numéricas obtenidas en la universidad.",
            "Los comportamientos y acciones concretas desplegadas por el postulante en situaciones reales pasadas.",
            "La capacidad del candidato para memorizar de memoria el organigrama de la empresa.",
            "El resultado de un test psicotécnico genérico sin relación al puesto.",
          ],
          answer: "Los comportamientos y acciones concretas desplegadas por el postulante en situaciones reales pasadas.",
          explanation: "La premisa de incidentes críticos es que la mejor predicción del desempeño futuro son las conductas reales observadas en situaciones similares del pasado.",
          difficulty: "medium",
          type: "multiple_choice",
        },
      ],
    },
  ];

  // 3. Procesar e Ingestar las 6 Clases Oficiales
  console.log("\n📦 Procesando 6 Clases Oficiales (con Resúmenes, Temas, Flashcards y Preguntas)...");

  for (const item of classMaterialsToProcess) {
    const classSession = classMap.get(item.classNumber);
    if (!classSession) {
      console.warn(`⚠️ No se encontró la clase ${item.classNumber} en la base de datos.`);
      continue;
    }

    console.log(`\n--- Procesando Clase ${item.classNumber}: ${item.fileName} ---`);
    const filePath = path.join(baseDir, item.fileName);

    if (!fs.existsSync(filePath)) {
      console.error(`❌ El archivo físico no existe: ${filePath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileSize = fs.statSync(filePath).size;
    const doc = await extractTextFromBuffer(fileBuffer);
    const extractedText = doc.text;

    console.log(`  📄 Texto extraído: ${extractedText.length} caracteres.`);

    // Upsert Material
    let material = await prisma.material.findFirst({
      where: {
        subjectId: subject.id,
        classId: classSession.id,
      },
    });

    if (material) {
      material = await prisma.material.update({
        where: { id: material.id },
        data: {
          fileName: item.fileName,
          fileSize,
          storagePath: item.relativeStoragePath,
          extractedText: extractedText || material.extractedText,
          processingStatus: "completed",
        },
      });
      console.log(`  🔄 Material actualizado: ${material.id}`);
    } else {
      material = await prisma.material.create({
        data: {
          subjectId: subject.id,
          classId: classSession.id,
          fileName: item.fileName,
          fileType: "application/pdf",
          fileSize,
          storagePath: item.relativeStoragePath,
          extractedText,
          processingStatus: "completed",
        },
      });
      console.log(`  ✨ Nuevo material creado: ${material.id}`);
    }

    // Upsert Summary
    let summary = await prisma.summary.findFirst({
      where: {
        classId: classSession.id,
      },
    });

    const summaryData = {
      title: item.summary.title,
      overview: item.summary.overview,
      detailedSummary: item.summary.detailedSummary,
      simplifiedExplanation: item.summary.simplifiedExplanation,
      keyPointsJson: JSON.stringify(item.summary.keyPoints),
      definitionsJson: JSON.stringify(item.summary.definitions),
      examplesJson: JSON.stringify(item.summary.examples),
      commonMistakesJson: JSON.stringify(item.summary.commonMistakes),
      aiModel: "kanri-academic-curator-v2",
      version: 2,
    };

    if (summary) {
      summary = await prisma.summary.update({
        where: { id: summary.id },
        data: {
          ...summaryData,
          materialId: material.id,
        },
      });
      console.log(`  🔄 Resumen académico actualizado: ${summary.id}`);
    } else {
      summary = await prisma.summary.create({
        data: {
          classId: classSession.id,
          materialId: material.id,
          ...summaryData,
        },
      });
      console.log(`  ✨ Nuevo resumen académico creado: ${summary.id}`);
    }

    // Actualizar ClassSession
    await prisma.classSession.update({
      where: { id: classSession.id },
      data: {
        title: item.classTitle,
        notes: `Material de clase: ${item.fileName}.\nResumen académico completo con análisis conceptual disponible en la sección de resúmenes.`,
        attendanceStatus: "attended",
      },
    });

    // Ingestar Topics vinculados a la clase
    for (const t of item.topics) {
      const existingTopic = await prisma.topic.findFirst({
        where: {
          subjectId: subject.id,
          name: t.name,
        },
      });

      if (!existingTopic) {
        await prisma.topic.create({
          data: {
            subjectId: subject.id,
            classId: classSession.id,
            name: t.name,
            description: t.description,
            importance: t.importance,
            masteryScore: 68,
          },
        });
      } else {
        await prisma.topic.update({
          where: { id: existingTopic.id },
          data: {
            classId: classSession.id,
            description: t.description,
            importance: t.importance,
          },
        });
      }
    }
    console.log(`  📌 ${item.topics.length} temas clave sincronizados.`);

    // Ingestar Flashcards
    for (const f of item.flashcards) {
      const existingFc = await prisma.flashcard.findFirst({
        where: {
          subjectId: subject.id,
          front: f.front,
        },
      });

      if (!existingFc) {
        await prisma.flashcard.create({
          data: {
            subjectId: subject.id,
            front: f.front,
            back: f.back,
            difficulty: f.difficulty,
            easeFactor: 2.5,
            interval: 1,
            repetitions: 0,
            nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        });
      }
    }
    console.log(`  🗂️  ${item.flashcards.length} flashcards creadas.`);

    // Ingestar Questions
    for (const q of item.questions) {
      const existingQ = await prisma.question.findFirst({
        where: {
          subjectId: subject.id,
          question: q.question,
        },
      });

      if (!existingQ) {
        await prisma.question.create({
          data: {
            subjectId: subject.id,
            classId: classSession.id,
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
    console.log(`  ❓ ${item.questions.length} preguntas de examen ingresadas.`);
  }

  // 4. Ingestar los 7 Archivos de Bibliografía Extra (Guardados en Biblioteca como Materiales, sin generar Resúmenes)
  console.log("\n📚 Procesando Bibliografía Extra (Archivos guardados en biblioteca sin resúmenes)...");

  const extraBibliographyFiles = [
    {
      fileName: "ARRHH_Gilli_Estructura y organigrama.pdf",
      title: "Gilli, Juan José - Diseño de Estructuras y Organigramas para la Organización Efectiva",
    },
    {
      fileName: "ARRHH_Mondy RSE.pdf",
      title: "Mondy, Wayne - Responsabilidad Social Empresarial, Ética y Administración de CH",
    },
    {
      fileName: "GTHID Porter_Cap1.pdf",
      title: "Porter, Michael - Estrategia Competitiva: Técnicas para el Análisis de los Sectores Industriales (Cap. 1)",
    },
    {
      fileName: "Jones_Cultura - RSE.pdf",
      title: "Jones, Gareth - Teoría Organizacional: Diseño y Cambio Organizacional, Cultura y RSE",
    },
    {
      fileName: "OIT (2001) Manual de Balance Social.pdf",
      title: "OIT (2001) - Manual de Balance Social: Indicadores de Auditoría y Responsabilidad Laboral",
    },
    {
      fileName: "Robbins-y-otro Cultura Organizacional.pdf",
      title: "Robbins, Stephen - Comportamiento Organizacional: Dinámica de la Cultura y Socialización",
    },
    {
      fileName: "Sherman_y_otros_Gerente de RH.pdf",
      title: "Sherman, Bohlander & Snell - El Rol Estratégico del Gerente de Recursos Humanos",
    },
  ];

  for (const biblio of extraBibliographyFiles) {
    const filePath = path.join(baseDir, biblio.fileName);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Archivo de bibliografía no encontrado: ${filePath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileSize = fs.statSync(filePath).size;
    const doc = await extractTextFromBuffer(fileBuffer);
    const relativeStoragePath = `uploads/materials/miercoles_gestion/${biblio.fileName}`;

    let material = await prisma.material.findFirst({
      where: {
        subjectId: subject.id,
        fileName: biblio.fileName,
      },
    });

    if (material) {
      material = await prisma.material.update({
        where: { id: material.id },
        data: {
          fileSize,
          storagePath: relativeStoragePath,
          extractedText: doc.text || material.extractedText,
          processingStatus: "completed",
        },
      });
      console.log(`  🔄 Bibliografía extra actualizada: ${biblio.fileName}`);
    } else {
      material = await prisma.material.create({
        data: {
          subjectId: subject.id,
          classId: null, // Sin clase vinculada por ser bibliografía general
          fileName: biblio.fileName,
          fileType: "application/pdf",
          fileSize,
          storagePath: relativeStoragePath,
          extractedText: doc.text,
          processingStatus: "completed",
        },
      });
      console.log(`  ✨ Bibliografía extra catalogada: ${biblio.fileName}`);
    }
  }

  console.log("\n🎉 ¡Ingesta de Gestión del Talento Humano finalizada con éxito absoluto!");
}

main()
  .catch((e) => {
    console.error("Error en la ingesta:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
