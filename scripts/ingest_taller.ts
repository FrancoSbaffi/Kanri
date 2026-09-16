import prisma from "../lib/db/prisma";
import fs from "fs";
import path from "path";
import { extractTextFromBuffer } from "../lib/pdf/extractor";

async function main() {
  console.log("🚀 Iniciando ingesta de materiales para Taller de Emprendedurismo...");

  // 1. Obtener la materia
  const subject = await prisma.subject.findFirst({
    where: { name: { contains: "Emprendedurismo" } },
    include: { classes: { orderBy: { classNumber: "asc" } } },
  });

  if (!subject) {
    throw new Error("No se encontró la materia Taller de Emprendedurismo");
  }

  console.log(`✅ Materia encontrada: ${subject.name} (${subject.id})`);

  const classMap = new Map(subject.classes.map((c) => [c.classNumber, c]));

  // 2. Definir los materiales con sus rutas en uploads/materials/taller_emprededurismo/
  const materialsToProcess = [
    {
      classNumber: 1,
      fileName: "Clase 1 Q2 2026- Taller emprendedurismo.pdf",
      relativeStoragePath: "uploads/materials/taller_emprededurismo/Clase 1 Q2 2026- Taller emprendedurismo.pdf",
      classTitle: "Clase 01: Fundamentos de Emprendedurismo, Factores de Éxito de Bill Gross, Mapa de Empatía y Elevator Pitch",
      summary: {
        title: "Resumen Académico · Clase 01: Introducción al Emprendedurismo, Factores de Éxito, Mapa de Empatía y Elevator Pitch",
        overview:
          "En esta primera sesión del Taller de Emprendedurismo en Innovación Digital se establecen los cimientos de la creación de valor en proyectos de base tecnológica. Se desmitifica la idea de que los emprendimientos fracasan por deficiencias del producto o servicio, demostrando empíricamente que la causa raíz del 90% de los cierres es la falta de clientes. A partir de los estudios de Bill Gross (Idealab) sobre más de 100 startups, se analiza la jerarquía real de factores de éxito, donde el 'Timing' (momento oportuno del mercado) representa el 42% del éxito, superando ampliamente a la idea (28%) y al financiamiento (14%). Asimismo, se introducen herramientas de descubrimiento de clientes como el Mapa de Empatía y la estructura canónica en cinco fases de un Elevator Pitch de alto impacto.",
        detailedSummary: `### 1. ¿Qué es Emprender?
La cátedra adopta una definición precisa y accionable:
> *"Emprender es crear un valor que antes no existía. El emprendedor es alguien que ve o busca activamente una oportunidad (no la espera), y encuentra la forma de transformarla en una realidad exitosa, sin contar inicialmente con todos los recursos necesarios."*

#### Cualidades esenciales del espíritu emprendedor:
- **Creatividad e innovación continua**.
- **Tolerancia al riesgo y a la ambigüedad**.
- **Persistencia y resiliencia** frente al rechazo y la fricción del mercado.
- **Capacidad de adaptación** ágil a nuevas condiciones competitivas.
- **Liderazgo, oratoria, networking y articulación de equipos multidisciplinarios**.

---

### 2. Factores Determinantes de Éxito en Startups (Estudio de Bill Gross - Idealab)
A partir del relevamiento riguroso de más de 100 compañías, Bill Gross puntuó cinco dimensiones críticas para contrastar empresas exitosas (como Airbnb, Uber, Citysearch) frente a fracasos resonantes (como Pets.com, Kozmo, Webvan):

| Factor | Ponderación | Descripción y Conclusión Clave |
| :--- | :---: | :--- |
| **1. Timing (Momento)** | **42%** | **El factor #1 más determinante**. ¿El mercado y la sociedad están listos para la propuesta hoy? (*Airbnb triunfó porque lanzó durante la recesión de 2008, cuando las personas necesitaban ingresos extra y los viajeros buscaban opciones económicas*). |
| **2. Equipo y Ejecución** | **32%** | Capacidad del equipo para iterar, pivotar, escuchar al usuario y ejecutar bajo incertidumbre. |
| **3. Idea** | **28%** | La originalidad o brillantez inicial. Por sí sola no garantiza viabilidad sin ejecución ni timing. |
| **4. Modelo de Negocio** | **24%** | Forma de monetización. Puede comenzar sin estar 100% definido y evolucionar con el feedback de los usuarios. |
| **5. Financiamiento** | **14%** | Es un combustible acelerador, pero no compensa una mala ejecución o un timing prematuro. |

> **Axioma de la cátedra:** *"La ejecución importa, pero el timing importa aún más. Los negocios no fallan por buenos o malos servicios: fallan PORQUE NO HAY CLIENTES."*

---

### 3. Mapa de Empatía
Herramienta visual y holística centrada en el cliente, orientada a evitar el sesgo del emprendedor (*building something nobody wants*):
1. **¿Qué piensa y siente?**: Preocupaciones profundas, valores no expresados, expectativas y aspiraciones.
2. **¿Qué ve?**: Su entorno cotidiano, la oferta existente en el mercado, el comportamiento de sus amigos y colegas.
3. **¿Qué oye?**: Mensajes de personas influyentes, jefes, líderes de opinión y su círculo de confianza.
4. **¿Qué dice y hace?**: Su actitud pública, apariencia, comportamiento observable e incongruencias entre lo que dice y lo que verdaderamente hace.
5. **Esfuerzos (Pains / Dolores)**: Miedos, frustraciones, obstáculos, costos ocultos y riesgos percibidos.
6. **Resultados (Gains / Alegrías)**: Necesidades satisfechas, medida subjetiva del éxito, deseos y deseos de superación.

---

### 4. Propuesta de Valor Canvas vs. Mapa de Empatía
- **Mapa de Empatía**: Se centra exclusivamente en la persona del cliente y su psicología contextual.
- **Propuesta de Valor Canvas (Osterwalder)**: Diseña el encaje bidireccional (*Problem-Solution Fit*) conectando:
  - **Perfil del Cliente**: Tareas del cliente (*Customer Jobs*), Dolores (*Pains*) y Alegrías (*Gains*).
  - **Mapa de Valor del Emprendimiento**: Productos y Servicios, Aliviadores de Frustraciones (*Pain Relievers*) y Creadores de Alegrías (*Gain Creators*).

---

### 5. Estructura Canónica del Elevator Pitch (30s - 2min)
Presentación breve de impacto para captar atención y generar interés inmediato. Debe seguir estrictamente cinco bloques:
1. **Introducción (10-15s)**: Quién sos y cuál es el gancho/apertura.
2. **Problema (15-30s)**: Descripción clara del dolor real y concreto que sufre el cliente.
3. **Solución (15-30s)**: Qué es el producto/servicio y cómo resuelve ese problema.
4. **Propuesta de Valor / Beneficios (15-30s)**: Por qué tu solución es superior, innovadora y medible (ahorro de tiempo, dinero, estrés).
5. **Llamado a la Acción / CTA (5-10s)**: Qué esperás de la audiencia al terminar (reunión de 15 minutos, demo de producto o feedback).

*Ejemplos analizados*: Mini Market Autónomo en barrios cerrados (resolución de compra por impulso 24/7 sin salir del barrio) y GreenTech (plataforma en la nube de gestión y optimización de residuos para industrias).`,
        simplifiedExplanation:
          "Si querés crear una empresa, tener una idea genial no alcanza. Tenés que lanzarla en el momento exacto en que la gente la necesita desesperadamente (Timing). Para saber qué necesita la gente, tenés que meterte en su cabeza con el Mapa de Empatía, entender sus frustraciones reales y diseñar una propuesta de valor que le saque ese dolor. Y cuando se lo tengas que contar a alguien, tenés 60 segundos con un Elevator Pitch para explicar el problema, tu solución y qué querés que haga.",
        keyPoints: [
          "Definición de emprendedor: creador de un valor que antes no existía sin contar con todos los recursos al inicio.",
          "El 42% del éxito de una startup depende del Timing según Bill Gross (Idealab), seguido de Equipo (32%), Idea (28%), Modelo (24%) y Fondos (14%).",
          "Los negocios fallan por ausencia de clientes y falta de validación de mercado, nunca por 'servicios insuficientes'.",
          "El Mapa de Empatía analiza qué piensa, siente, ve, oye, dice y hace el cliente, junto a sus frustraciones y metas.",
          "La Propuesta de Valor Canvas une los dolores/alegrías del cliente con los productos y aliviadores del emprendimiento.",
          "El Elevator Pitch se estructura en 5 bloques: Introducción, Problema, Solución, Propuesta de Valor y Call to Action.",
        ],
        definitions: [
          { term: "Emprender", definition: "Acción de identificar una oportunidad y movilizar recursos para crear un valor que antes no existía en el mercado." },
          { term: "Timing", definition: "Grado de madurez del mercado, la tecnología y el contexto sociocultural que hace que un producto sea adoptado masivamente o rechazado por prematuro/tardío." },
          { term: "Mapa de Empatía", definition: "Herramienta de diseño centrado en las personas que mapea sensaciones, estímulos del entorno, dolores y aspiraciones del arquetipo de cliente." },
          { term: "Propuesta de Valor Canvas", definition: "Diagrama visual que asegura el encaje problema-solución vinculando dolores y tareas del cliente con aliviadores y servicios del negocio." },
          { term: "Elevator Pitch", definition: "Discurso persuasivo estructurado de 30 a 120 segundos orientado a despertar el interés de inversores o clientes e impulsar una acción posterior." },
        ],
        examples: [
          { title: "Bill Gross: Airbnb vs. Kozmo", description: "Airbnb triunfó porque el timing de la crisis de 2008 obligó a la gente a alquilar habitaciones para pagar la hipoteca. Kozmo fracasó en 1999 haciendo delivery en 1 hora porque no existían smartphones ni logística moderna (timing prematuro)." },
          { title: "Mini Market Autónomo", description: "Tienda sin cajeros en barrios privados que soluciona compras nocturnas y de emergencia, ahorrando 40 minutos de viaje y peajes." },
          { title: "GreenTech (Pitch)", description: "Software B2B que calcula rutas de reciclaje y reportes regulatorios automatizados para empresas contaminantes." },
        ],
        commonMistakes: [
          { mistake: "Enamorarse de la idea en lugar del problema", explanation: "Dedicar meses a codificar un software perfecto que resuelve una necesidad inexistente o irrelevante para los usuarios." },
          { mistake: "Creer que la falta de capital es el motivo de fracaso", explanation: "El estudio de Bill Gross demuestra que el financiamiento explica solo el 14% del éxito; startups con millones cierran si no hay timing ni clientes." },
          { mistake: "Usar lenguaje técnico en el Elevator Pitch", explanation: "Perder a la audiencia explicando la arquitectura de servidores o algoritmos en vez de enfocarse en el dolor del cliente y el beneficio tangible." },
        ],
      },
      topics: [
        { name: "Concepto de Emprender y Espíritu Emprendedor", description: "Creación de valor inédito, toma de riesgos calculados y resiliencia operativa.", importance: "high" },
        { name: "Factores de Éxito de Bill Gross (Timing 42%)", description: "Análisis empírico de las 5 variables de éxito de Idealab.", importance: "critical" },
        { name: "Mapa de Empatía del Cliente", description: "Metodología de introspección del usuario: qué ve, oye, piensa, siente, dice y hace.", importance: "high" },
        { name: "Propuesta de Valor Canvas", description: "Encaje entre el perfil del cliente (Jobs, Pains, Gains) y el mapa de valor.", importance: "high" },
        { name: "Estructura del Elevator Pitch", description: "Metodología de 5 bloques: Intro, Problema, Solución, Beneficios y Call to Action.", importance: "high" },
      ],
      flashcards: [
        { front: "¿Cuál es el factor más determinante para el éxito de una startup según el estudio de Bill Gross (Idealab)?", back: "El TIMING con un 42%, seguido de Equipo/Ejecución (32%), Idea (28%), Modelo de Negocio (24%) y Financiamiento (14%).", difficulty: "easy" },
        { front: "¿Por qué fracasan la gran mayoría de los nuevos negocios según la cátedra?", back: "Porque 'no hay clientes' (desarrollan productos desconectados de una necesidad real del mercado), no por falta de financiamiento ni por malos servicios.", difficulty: "medium" },
        { front: "¿En qué se diferencia el Mapa de Empatía de la Propuesta de Valor Canvas?", back: "El Mapa de Empatía se enfoca exclusivamente en la psicología y entorno del usuario. La Propuesta de Valor Canvas conecta sus dolores/alegrías con los productos y aliviadores específicos de la empresa.", difficulty: "medium" },
        { front: "¿Cuáles son las 5 partes constitutivas de un Elevator Pitch eficaz?", back: "1. Introducción (10-15s)\n2. Problema (15-30s)\n3. Solución (15-30s)\n4. Propuesta de Valor/Beneficios (15-30s)\n5. Llamado a la Acción / CTA (5-10s).", difficulty: "easy" },
      ],
      questions: [
        {
          question: "Según la investigación de Bill Gross sobre más de 100 startups, ¿cuál de los siguientes factores explica el mayor porcentaje de éxito de un emprendimiento?",
          options: ["La originalidad disruptiva de la idea", "El volumen de financiamiento de Venture Capital recibido", "El timing o momento de madurez del mercado", "Tener un modelo de negocio cerrado desde el día uno"],
          answer: "El timing o momento de madurez del mercado",
          explanation: "Bill Gross concluyó que el Timing representa el 42% del éxito. Empresas con grandes ideas fracasaron por llegar antes de tiempo, mientras que proyectos con ideas sencillas triunfaron por el momento exacto de su lanzamiento.",
          difficulty: "easy",
          type: "multiple_choice",
        },
        {
          question: "¿Cuál de los siguientes elementos corresponde a los 'Pains' o Esfuerzos dentro del Mapa de Empatía?",
          options: ["Las cosas que le dicen sus amigos y jefes cotidianamente", "Los miedos, frustraciones, costos ocultos y obstáculos que enfrenta para resolver una necesidad", "Los títulos profesionales y certificaciones académicas del usuario", "Los canales digitales que utiliza para informarse"],
          answer: "Los miedos, frustraciones, costos ocultos y obstáculos que enfrenta para resolver una necesidad",
          explanation: "Los dolores o frustraciones representan las barreras, temores y desgastes que experimenta el cliente al intentar satisfacer sus necesidades actuales.",
          difficulty: "easy",
          type: "multiple_choice",
        },
      ],
    },
    {
      classNumber: 2,
      fileName: "Clase 2  Q2 2026 - Taller emprendedurismo .pdf",
      relativeStoragePath: "uploads/materials/taller_emprededurismo/Clase 2  Q2 2026 - Taller emprendedurismo .pdf",
      classTitle: "Clase 02: Propósito, Misión vs Visión, Estrategia Competitiva de Porter, Ciclo de Vida y Canvas de Negocio",
      summary: {
        title: "Resumen Académico · Clase 02: Propósito, Misión/Visión, Estrategia Competitiva de Porter y Modelo CANVAS",
        overview:
          "La Clase 02 aborda la columna vertebral del diseño estratégico empresarial: cómo definir, generar y capturar valor sostenible. Se profundiza en la distinción entre el Propósito (la causa interna que moviliza y responde al '¿por qué?'), la Misión (extrospectiva, el qué hacemos en el día a día para nuestros clientes) y la Visión (la imagen ambiciosa del futuro deseado). Respaldado por las premisas de Paul Graham ('Enamorate del problema, no de la idea' y 'Hacé cosas que la gente quiera'), se examina el Triángulo Estratégico, el Ciclo de Vida de la Industria y los modelos de posicionamiento competitivo de Michael Porter (Líder en Costos, Diferenciación y Nichos), cerrando con la integración de los 9 bloques del Business Model Canvas de Osterwalder y las herramientas diagnósticas PEST y FODA.",
        detailedSummary: `### 1. El Propósito y el Problema
#### El Propósito:
- Razón fundamental de existencia del proyecto: responde a **¿Por qué estamos haciendo este emprendimiento?** y **¿Qué nos moviliza internamente?**
- Carácter **introspectivo** (esencialmente interno para el equipo fundador).
- Vinculación con el **Triple Impacto**: sostenibilidad económica, social y ambiental.
- *Ejemplo Apple*: *"Cambiar el mundo a través de la innovación tecnológica que mejora la vida de las personas."*

#### El Problema (Fundamento de Paul Graham - Y Combinator):
- *"Un problema es un determinado asunto o cuestión que requiere solución. A nivel social, al solucionarse aporta beneficios tangibles."*
- Reglas fundamentales:
  1. **"Hacé cosas que la gente quiera"** (*Make something people want*).
  2. **"Enamorate del Problema, no de la idea"**: Las ideas cambian y pivotan; el problema del cliente es el norte inmutable.

---

### 2. Misión vs. Visión
| Dimensión | MISIÓN | VISIÓN |
| :--- | :--- | :--- |
| **Definición** | La actividad principal del negocio y cómo se lleva a cabo hoy. | La imagen futura y el estado deseado a largo plazo. |
| **Enfoque** | Concreto, operativo, accionable: qué hace, para quién y cómo. | Inspirador, desafiante, ambicioso y motivador. |
| **Perspectiva** | **Extrospectiva**: *"Se la tengo que contar a mis destinatarios"*. | De liderazgo y aspiración institucional. |
| **Pregunta clave** | *¿Qué hacemos en el día a día? ¿Qué nos hace diferentes?* | *¿Hacia dónde queremos avanzar y en qué queremos transformarnos?* |
| **Caso Apple** | *"Diseñar los mejores productos y proporcionar experiencias increíbles que enriquezcan la vida de las personas (excelencia en diseño y UX)."* | *"Ser la empresa más innovadora del mundo, llevando a cabo una revolución tecnológica y dejando una marca indeleble en la sociedad."* |

---

### 3. Estrategia Empresarial: Generar y Capturar Valor
Hacer estrategia significa definir **cómo generar y capturar valor** para tres actores:
1. **Accionistas**: Retorno sobre la inversión y valor financiero.
2. **Clientes**: Soluciones efectivas y satisfacción de necesidades.
3. **Stakeholders**: Empleados, proveedores, comunidad y medio ambiente.

#### El Triángulo de la Estrategia Exitosa:
- **Objetivos de corto y largo plazo simples y consistentes**: Misión, Visión, Iniciativas.
- **Evaluación y desarrollo de recursos y capacidades**: Propósitos, valores, organización, cultura -> **CÓMO COMPETIR (Ventajas Competitivas)**.
- **Conocimiento profundo del ambiente competitivo**: PEST, industria, clientes, competidores -> **DÓNDE COMPETIR (Posicionamiento)**.

---

### 4. Ciclo de Vida de la Industria
Cada industria atraviesa cinco etapas con desafíos estratégicos singulares:
1. **Introducción**: Exploración, alta incertidumbre, clientes innovadores/early adopters, precios altos, diseños exploratorios.
2. **Crecimiento**: Surge el **diseño dominante**, ingresan nuevos competidores, producción a escala, reducción de precios unitarios.
3. **Madurez**: Producto estandarizado, consolidación mediante fusiones y adquisiciones (M&A), competencia feroz en precios y márgenes (*Vaca lechera*).
4. **Decadencia**: Aparición de productos sustitutos, capacidad ociosa, salida de competidores débiles.
5. **Desaparición o Renacimiento**: Ocurre la **disrupción tecnológica** que reinventa la categoría o extingue la industria tradicional.

---

### 5. Posicionamiento Estratégico (Michael Porter)
| Estrategia | Claves de Éxito | Recursos y Capacidades | Ejemplos |
| :--- | :--- | :--- | :--- |
| **Líder en Costos** | Alto volumen, precio bajo, márgenes unitarios finos, estandarización total, canales masivos. | Economías de escala y alcance, eficiencia en procesos, poder de negociación con proveedores. | **Flybondi, Ryanair, Día %** |
| **Líder en Diferenciación** | Menor volumen, márgenes elevados, percepción de prestigio, diseño, marca y ecosistema. | I+D para mejorar producto (no para abaratar), marketing de alto impacto, experiencia de usuario premium. | **Apple, Starbucks, Rolex** |
| **Foco en Nichos** | Volumen pequeño por diseño, precios altos, modelo cuasi-artesanal y atención hiperpersonalizada. | I+D hiperespecífico, venta directa o canales exclusivos, relación íntima con el cliente. | **Ferrari, Cervecería Artesanal de Autor** |
| **Estrategia Dual** | Bajos costos operativos combinados con diseño y experiencia diferenciada. *Extremadamente difícil*. | Autoservicio, modularidad, diseño propietario masivo. | **IKEA, Toyota** |
| **Multi-Nichos** | Múltiples nichos en paralelo, cada uno con una marca y expertise independientes. | Portafolio descentralizado con identidades no contaminadas. | **LVMH (Louis Vuitton, Moët & Chandon, TAG Heuer, Sephora)** |

---

### 6. Business Model Canvas (Osterwalder) - 9 Bloques
1. **Propuesta de Valor**: Problema que resolvemos, necesidad que satisfacemos y beneficios percibidos.
2. **Segmentos de Clientes**: A quién va dirigida la solución (arquetipo, masa, nicho).
3. **Canales**: Cómo comunicamos, vendemos y entregamos el valor (web, tienda física, distribución B2B).
4. **Relaciones con Clientes**: Tipo de vínculo (asistencia personal, autoservicio, comunidad automatizada).
5. **Fuentes de Ingresos**: Mecanismo de captura de valor (suscripción mensual, venta directa, comisiones, licencias).
6. **Recursos Clave**: Activos indispensables (infraestructura técnica, patentes, personal especializado, capital).
7. **Actividades Clave**: Procesos operativos críticos (desarrollo de software, logística, control de calidad).
8. **Socios Clave**: Proveedores estratégicos, alianzas de distribución y partners tecnológicos.
9. **Estructura de Costos**: Costos fijos, variables, economías de escala y prioridades de gasto.

---

### 7. Herramientas de Análisis Diagnóstico: PEST y FODA
- **Análisis PEST (Entorno Macro)**:
  - **P** (Político-Legal): Regulaciones de precios, leyes laborales, comercio exterior, permisos ambientales.
  - **E** (Económico): Inflación, ciclos económicos, tasas de interés bancarias, tipo de cambio oficial/paralelo.
  - **S** (Socio-Cultural): Demografía, hábitos de consumo, tendencias ecológicas, nivel educativo.
  - **T** (Tecnológico): Automatización, IA, infraestructura de conectividad, I+D.
- **Matriz FODA (Fit Estratégico)**:
  - Internas: **Fortalezas** (capacidades distintivas) y **Debilidades** (vulnerabilidades operativas).
  - Externas: **Oportunidades** (tendencias de mercado aprovechables) y **Amenazas** (competidores, regulaciones, cambios macroeconómicos).`,
        simplifiedExplanation:
          "Toda empresa necesita un 'por qué' interno (Propósito), un 'qué hacemos hoy' para nuestros clientes (Misión) y un 'dónde queremos estar en 10 años' (Visión). Para ganar en el mercado tenés que elegir cómo competir: o sos el más barato produciendo a lo bestia (Flybondi), o sos el mejor diferenciándote por diseño y calidad cobrando caro (Apple), o te metés en un nicho exclusivo (Ferrari). Para ordenar cómo funciona todo el negocio sin escribir un testamento de 50 hojas, usás los 9 bloques del Canvas de Osterwalder.",
        keyPoints: [
          "El Propósito es introspectivo (responde al por qué fundacional y al triple impacto).",
          "La Misión es extrospectiva y operativa (qué hacemos en el día a día para diferenciarnos); la Visión es inspiradora y de largo plazo.",
          "Paul Graham: 'Enamorate del problema, no de la idea' y 'Hacé cosas que la gente quiera'.",
          "La estrategia define cómo generar y capturar valor para accionistas, clientes y stakeholders.",
          "El ciclo de vida de una industria pasa por Introducción, Crecimiento (diseño dominante), Madurez, Decadencia y Disrupción.",
          "Las estrategias de Porter son excluyentes: Liderazgo en Costos, Diferenciación o Foco en Nichos (caer en el medio suele llevar al fracaso).",
          "El Modelo Canvas integra en 9 bloques el valor, los clientes, la infraestructura y las finanzas del emprendimiento.",
        ],
        definitions: [
          { term: "Propósito", definition: "Razón ontológica e introspectiva de un emprendimiento que moviliza al equipo y establece su compromiso de triple impacto." },
          { term: "Misión", definition: "Declaración concreta y extrospectiva de la actividad principal del negocio, qué problema resuelve, a quién y cómo en el día a día." },
          { term: "Visión", definition: "Declaración aspiracional que describe el estado deseado a largo plazo y la meta máxima de evolución institucional." },
          { term: "Diseño Dominante", definition: "Estándar tecnológico y de formato que se impone en la fase de crecimiento de una industria y define las reglas de competencia futuras." },
          { term: "Líder en Costos", definition: "Estrategia competitiva basada en alcanzar el costo unitario de producción más bajo del mercado mediante escala y eficiencia." },
          { term: "Líder en Diferenciación", definition: "Estrategia orientada a crear atributos únicos y valor percibido premium por los cuales los clientes están dispuestos a pagar más." },
          { term: "Business Model Canvas", definition: "Plantilla de gestión estratégica creada por Alexander Osterwalder que sintetiza un negocio en 9 bloques interconectados." },
        ],
        examples: [
          { title: "Apple: Misión vs. Visión", description: "Misión: Crear los mejores productos y enriquecer vidas hoy (UX y diseño). Visión: Ser la empresa más innovadora del mundo y cambiar la sociedad." },
          { title: "Flybondi vs. Starbucks", description: "Flybondi lidera en costos cobrando todo aparte y unificando su flota de aviones. Starbucks lidera en diferenciación vendiendo una experiencia de 'tercer espacio' y café gourmet con margen premium." },
          { title: "LVMH (Multi-Nichos)", description: "Conglomerado de lujo que maneja marcas de nicho independientes (Dom Pérignon, Dior, TAG Heuer, Sephora) sin mezclar sus propuestas de valor." },
        ],
        commonMistakes: [
          { mistake: "Confundir Misión con Visión", explanation: "Escribir en la Misión 'Seremos los líderes de Latinoamérica en 2030' (eso es visión a futuro) en vez de definir concretamente qué solucionamos hoy y cómo." },
          { mistake: "Quedar 'atrapado en el medio' (Stuck in the middle)", explanation: "Intentar tener costos bajos y calidad premium sin los recursos ni la escala adecuada, siendo superado por competidores enfocados." },
          { mistake: "Completar el Canvas como un trámite estático", explanation: "Tomar el Business Model Canvas como un documento inmutable en vez de un lienzo dinámico de hipótesis a validar con clientes reales." },
        ],
      },
      topics: [
        { name: "Propósito y Triple Impacto", description: "La razón de ser introspectiva y el compromiso ambiental y social.", importance: "high" },
        { name: "Problema: Paul Graham y el Enfoque en el Cliente", description: "Hacé cosas que la gente quiera; amor al problema frente al sesgo de la idea.", importance: "critical" },
        { name: "Misión vs. Visión Empresarial", description: "Diferenciación conceptual y operativa con el caso de estudio de Apple.", importance: "high" },
        { name: "Triángulo Estratégico y Generación de Valor", description: "Alineación de ventajas competitivas y posicionamiento para stakeholders.", importance: "high" },
        { name: "Ciclo de Vida de la Industria", description: "Fases de Introducción, Crecimiento, Madurez, Decadencia y Disrupción.", importance: "high" },
        { name: "Estrategias Competitivas Genéricas de Porter", description: "Liderazgo en Costos, Diferenciación, Enfoque en Nichos, Dual y Multi-Nichos.", importance: "critical" },
        { name: "Business Model Canvas (9 Bloques)", description: "Arquitectura integral del modelo de negocio de Osterwalder.", importance: "critical" },
        { name: "Análisis PEST y Matriz FODA", description: "Diagnóstico de variables macro y micro para el ajuste estratégico.", importance: "medium" },
      ],
      flashcards: [
        { front: "¿Cuál es la diferencia fundamental entre Misión y Visión según la cátedra?", back: "La Misión es extrospectiva, concreta y del día a día (qué hace, para quién y cómo nos diferenciamos hoy). La Visión es aspiracional, motivadora y a largo plazo (el estado futuro al que aspira llegar la empresa).", difficulty: "easy" },
        { front: "¿Qué sostiene Paul Graham sobre el problema y la idea en startups?", back: "'Hacé cosas que la gente quiera' y 'Enamorate del problema, no de la idea'. Las ideas deben pivotar ágilmente, pero el problema real del cliente debe ser el foco.", difficulty: "easy" },
        { front: "¿Cuáles son las 3 estrategias competitivas genéricas postuladas por Michael Porter?", back: "1. Liderazgo en Costos (alto volumen, bajo precio, eficiencia)\n2. Diferenciación (producto único, prestigio, precio premium)\n3. Foco en Nichos (segmento hiperacotado con atención especializada).", difficulty: "medium" },
        { front: "¿Qué evento marca la transición entre la etapa de Introducción y Crecimiento en el ciclo de una industria?", back: "La consolidación del 'Diseño Dominante', que estandariza los formatos y tecnologías, reduciendo la incertidumbre y habilitando economías de escala.", difficulty: "hard" },
        { front: "¿Cuáles son los 9 bloques del Business Model Canvas de Osterwalder?", back: "Propuesta de Valor, Segmentos de Clientes, Canales, Relación con Clientes, Fuentes de Ingresos, Recursos Clave, Actividades Clave, Socios Clave y Estructura de Costos.", difficulty: "medium" },
      ],
      questions: [
        {
          question: "¿Cómo se clasifica a la empresa Flybondi de acuerdo con las estrategias competitivas genéricas de Porter?",
          options: ["Líder en Diferenciación por experiencia de vuelo", "Líder en Costos, basada en flota estandarizada, alta rotación y cobro de servicios secundarios", "Estrategia Multi-Nichos exclusiva de aviación", "Estrategia de Nicho Artesanal"],
          answer: "Líder en Costos, basada en flota estandarizada, alta rotación y cobro de servicios secundarios",
          explanation: "Las aerolíneas low-cost como Flybondi o Ryanair maximizan el volumen y la eficiencia con flota única (Boeing 737) y cobran por cada servicio adicional, permitiendo la tarifa base más baja del mercado.",
          difficulty: "easy",
          type: "multiple_choice",
        },
        {
          question: "Al analizar el entorno mediante la herramienta PEST, ¿a qué categoría corresponde una modificación impositiva en los aranceles de importación de microchips?",
          options: ["Factores Tecnológicos (T)", "Factores Político-Legales y Económicos (P/E)", "Factores Socio-Culturales (S)", "Factores de Propuesta de Valor"],
          answer: "Factores Político-Legales y Económicos (P/E)",
          explanation: "Las regulaciones de comercio exterior, aranceles y normativas impositivas forman parte de los factores Político-Legales (P) y tienen impacto macroeconómico directo (E).",
          difficulty: "medium",
          type: "multiple_choice",
        },
      ],
    },
    {
      classNumber: 4,
      fileName: "Clase de Marketing.pdf",
      relativeStoragePath: "uploads/materials/taller_emprededurismo/Clase de Marketing.pdf",
      classTitle: "Clase 04: Conceptos de Marketing, Segmentación, Competidores, Roles CUPID, TAM-SAM-SOM y 4P",
      summary: {
        title: "Resumen Académico · Clase 04: Conceptos de Marketing, Segmentación, Roles CUPID, TAM-SAM-SOM y Marketing Mix (4P)",
        overview:
          "La Clase 04 se sumerge en el Marketing Estratégico y Operativo para startups de base tecnológica. Con el dato alarmante de que el 42% de los fracasos empresariales surgen por desarrollar productos desconectados del mercado, la cátedra estructura el proceso de marketing desde la perspectiva de Peter Drucker ('no preguntes qué queremos vender, sino qué quiere comprar el cliente'). Se desglosa la tríada Necesidades-Deseos-Demandas, el arquetipo de Buyer Persona, las variables de segmentación y el modelo CUPID de roles del consumidor. Asimismo, se enseña la técnica de dimensionamiento de mercado TAM-SAM-SOM, las fórmulas de proyección de ventas y las decisiones tácticas del Marketing Mix o las 4P (Producto con sus 4 niveles de valor, Precio con la ecuación Costo < Precio <= Valor, Plaza y Promoción a través del embudo de conversión).",
        detailedSummary: `### 1. Definición y Filosofía del Marketing
- **Asociación Argentina de Marketing (AAM)**: *"Ciencia económica que estudia las razones y consecuencias de las relaciones de intercambio entre consumidores y productores, desarrollando modelos y procesos para satisfacer necesidades y crear valor para todas las partes."*
- **Kotler y Armstrong**: *"Proceso social y administrativo mediante el cual individuos y grupos obtienen lo que necesitan y desean a través de la creación y el intercambio de productos y valor."*
- **Aporte de Peter Drucker (1979)**:
  - *"El verdadero marketing comienza con el cliente: con sus datos demográficos, sus valores y necesidades."*
  - **No preguntes**: *"¿Qué queremos vender?"*, sino **"¿Qué quiere comprar el cliente?"**
  - **No digas**: *"Esto es lo que hace nuestro producto"*, sino **"Estas son las satisfacciones que el consumidor busca."**

> **Estadística crítica para emprendedores**: *"El 42% de los fracasos de startups se deben al desarrollo de un producto desconectado del mercado"* (Fernando Lallana y Gianluca Fioravanti).

---

### 2. La Tríada: Necesidades, Deseos y Demandas
1. **Necesidades**: Estados de carencia física, psicológica o social percibida inherente a la condición humana (ej: hambre, comunicación, abrigo). No las crea el marketing.
2. **Deseos**: Forma cultural e individual específica que adopta una necesidad (ej: el hambre se traduce en desear una hamburguesa; la necesidad de comunicarse se traduce en desear un iPhone 15 Pro).
3. **Demandas**: Deseos humanos respaldados por el **poder adquisitivo real**. El marketing actúa estimulando la demanda hacia su propuesta de valor.

---

### 3. Proceso Estratégico de Marketing
1. **Diagnóstico**: Análisis Externo (mercado, competencia, clientes) + Análisis Interno (misión, Canvas, capacidades).
2. **Segmentación Estratégica**: División del mercado en grupos homogéneos.
3. **Selección del Target (Segmento Objetivo)**: Elección de a quién vamos a servir.
4. **Posicionamiento**: Percepción relativa que logramos en la mente del consumidor frente a los competidores (ej. Coca-Cola, Apple, Nike).
5. **Marketing Mix (4P)**: Ejecución operativa.

---

### 4. Variables de Segmentación y Buyer Persona
- **Variables Geográficas**: País, provincia, ciudad, barrio, densidad urbana o rural, clima.
- **Variables Demográficas**: Edad, género, nivel socioeconómico (NSE), profesión, ingresos, educación, estado civil.
- **Variables Psicográficas**: Estilo de vida, valores, personalidad, intereses, aficiones.
- **Variables Conductuales**: Tasa de uso, ocasiones de compra, lealtad a la marca, sensibilidad al precio, comprador impulsivo vs. analítico.
- **Buyer Persona**: Arquetipo semificticio del consumidor ideal que sintetiza variables demográficas, hábitos de consumo, dolores, frustraciones, retos y objetivos (ej. casos Marta Fernández y Luis Uribe analizados en clase).

---

### 5. Roles del Consumidor: Modelo CUPID
En muchas compras no interviene una sola persona, sino una red de roles:
- **C - Comprador**: Quien ejecuta formal o físicamente el acto de compra.
- **U - Usuario**: Quien efectivamente utiliza, consume o aprovecha el bien o servicio.
- **P - Pagador**: Quien desembolsa el dinero y asume el costo financiero.
- **I - Influenciador**: Quien opina, aconseja, condiciona o recomienda la elección (amigos, líderes técnicos, expertos).
- **D - Decisor**: Quien tiene la autoridad final para aprobar la transacción.

*Ejemplo B2B (Software Tango de Gestión)*: El Comprador es el área de Compras, el Usuario es el administrativo contable, el Pagador es la Gerencia Financiera, el Influenciador es el auditor externo y el Decisor es el Directorio.

---

### 6. Dimensionamiento del Mercado: TAM, SAM y SOM
| Métrica | Nombre Completo | Concepto y Cálculo | Ejemplo Cátedra (Diarios Digitales) |
| :--- | :--- | :--- | :--- |
| **TAM** | **Total Available Market** | Universo total de la población o demanda potencial si tuviéramos el 100% de cuota. | Todos los lectores de diarios de habla hispana. |
| **SAM** | **Serviceable Available Market** | Mercado que coincide con el alcance de nuestra tecnología, canal y geografía. | Lectores habituales de diarios en formato digital. |
| **SOM** | **Serviceable Obtainable Market** | **Segmento objetivo real** que capturaremos en el corto plazo con los recursos disponibles. | Lectores de diarios digitales dispuestos a pagar suscripción mensual en Argentina. |

#### Fórmula de Estimación de Demanda:
$$\text{Proyección de Ventas} = \text{Cantidad de Compradores} \times \text{Frecuencia de Compra} \times \text{Volumen por Compra}$$

---

### 7. Investigación de Mercado: Métodos
- **Cualitativa (Comprender percepciones y sentimientos)**: Focus groups, entrevistas a profundidad con referentes, observación directa (Mystery Shopper).
- **Cuantitativa (Validar y dimensionar numéricamente)**: Encuestas estructuradas, censos poblacionales, auditorías de retail.
- *Reglas para una buena encuesta*: Definir objetivo claro, muestra representativa, evitar sesgos en la redacción, preguntas cerradas prioritarias, escala Likert (1 al 5) y dejar las preguntas personales/sensibles al final.

---

### 8. El Marketing Mix: Las 4P
#### P1: PRODUCTO (Bien o servicio susceptible de valor)
- **Los 4 Niveles del Producto**:
  1. **Genérico**: Elementos básicos para ingresar a la categoría (ej. un teléfono que hace llamadas).
  2. **Previsto**: Genérico + lo mínimo esperado por el cliente (pantalla táctil, batería de 24h).
  3. **Mejorado**: Incorpora elementos inesperados que aumentan el valor (cámara profesional, ecosistema de apps).
  4. **Potencial**: Todo aquello que va más allá de lo que la gente percibe como posible hoy.
- **Estructura de la Cartera**:
  - **Amplitud**: Variedad y cantidad de gamas o líneas de productos ofrecidas (gama A, B, N).
  - **Profundidad**: Número de artículos o variantes específicas dentro de una gama determinada (ej. Coca-Cola Original, Zero, Light, Cherry en botellas de 500ml, 1.5L, 2.25L).

#### P2: PRECIO (Decisión de rentabilidad y percepción)
- **La Ecuación Fundamental del Precio**:
  $$\text{COSTO} < \text{PRECIO} \le \text{VALOR PERCIBIDO}$$
  - $\text{Costo} < \text{Precio}$: Asegura la **motivación de la empresa a vender** (margen positivo).
  - $\text{Precio} \le \text{Valor}$: Asegura la **motivación del cliente a comprar** (siente que recibe más de lo que paga).
  - *Distinción*: El Precio es la transacción real, objetiva y concreta; el Valor es la percepción de utilidad relativa, subjetiva e intangible.
- **Métodos para Fijar Precios**:
  1. Basado en los Costos (*Cost-Plus*).
  2. Basado en la Demanda y Valor Percibido (*Value-Based Pricing*).
  3. Basado en la Competencia (*Competitive Benchmarking*).

#### P3: PROMOCIÓN (Comunicar la propuesta de valor)
- Esfuerzos para informar, persuadir y generar recordación en el público objetivo.
- **El Embudo de Comunicación**:
  $$\text{Conocimiento} \longrightarrow \text{Consideración} \longrightarrow \text{Compra} \longrightarrow \text{Lealtad}$$

#### P4: PLAZA (Distribución y acceso)
- Cómo se pone el producto a disposición del cliente: canales físicos, mayoristas, distribuidores o canales directos digitales (E-commerce, SEO, SEM, marketplace).`,
        simplifiedExplanation:
          "El marketing no es vender lo que fabricaste, es entender qué necesita el cliente para fabricar justo eso. El 42% de los proyectos quiebra por crear algo que a nadie le interesa. Para vender tenés que conocer al Buyer Persona y a los roles CUPID (porque el que usa el producto muchas veces no es el que lo paga). Luego calculás tu mercado con TAM-SAM-SOM y ajustás las 4P: armás un buen Producto en varios niveles, le ponés un Precio que sea mayor al Costo pero menor al Valor percibido, lo Promocionás con un embudo de conversión y lo distribuís por la Plaza adecuada.",
        keyPoints: [
          "Peter Drucker: el marketing no parte de lo que la empresa quiere vender, sino de las satisfacciones que el cliente busca.",
          "El 42% de los fracasos de startups proviene de la desconexión entre el producto y las necesidades del mercado.",
          "Las necesidades son carencias universales, los deseos son elecciones culturales y las demandas son deseos con poder adquisitivo.",
          "El modelo CUPID desglosa los 5 roles del consumidor: Comprador, Usuario, Pagador, Influenciador y Decisor.",
          "TAM es el mercado total, SAM es el mercado servible con tu tecnología y SOM es el segmento objetivo capturable en el corto plazo.",
          "Ecuación rectora del precio: Costo < Precio <= Valor Percibido.",
          "El Producto tiene 4 niveles: Genérico, Previsto, Mejorado y Potencial; y se organiza en Amplitud y Profundidad.",
          "El embudo de comunicación de la Promoción avanza por Conocimiento, Consideración, Compra y Lealtad.",
        ],
        definitions: [
          { term: "Buyer Persona", definition: "Representación arquetípica del cliente ideal basada en datos demográficos, psicográficos, conductuales, dolores y objetivos." },
          { term: "Modelo CUPID", definition: "Marco de análisis que distingue los 5 roles en el proceso de compra: Comprador, Usuario, Pagador, Influenciador y Decisor." },
          { term: "TAM (Total Available Market)", definition: "Estimación del volumen total de demanda si una empresa lograra el 100% de penetración en su industria." },
          { term: "SAM (Serviceable Available Market)", definition: "Porción del TAM que puede ser alcanzada y atendida por el modelo operativo y tecnológico actual." },
          { term: "SOM (Serviceable Obtainable Market)", definition: "Subconjunto del SAM que la startup planea capturar efectivamente en sus primeros años de operación." },
          { term: "Ecuación de Valor del Precio", definition: "Principio económico que establece que el precio debe situarse estrictamente por encima de los costos totales y por debajo del valor subjetivo percibido por el comprador." },
          { term: "Amplitud de Producto", definition: "Cantidad de diferentes líneas o gamas de producto que comercializa una misma empresa." },
          { term: "Profundidad de Producto", definition: "Cantidad de variantes, tamaños, sabores o modelos específicos contenidos dentro de cada línea de producto." },
        ],
        examples: [
          { title: "Roles CUPID en la compra de gaseosas", description: "En un cumpleaños infantil, los chicos son los Usuarios e Influenciadores, la madre es la Decisora y el padre que pasa por el supermercado es el Comprador y Pagador." },
          { title: "TAM-SAM-SOM de Diarios Digitales", description: "TAM: Todos los lectores de noticias del país. SAM: Lectores de medios digitales. SOM: Suscriptores que pagan un muro de pago (paywall) de contenido premium." },
          { title: "Niveles de Producto: iPhone", description: "Genérico: Hacer y recibir llamadas. Previsto: Pantalla táctil y conexión 4G. Mejorado: Cámaras con modo cine y FaceID. Potencial: Integración de IA multimodal local y computación espacial." },
        ],
        commonMistakes: [
          { mistake: "Fijar precios calculando solo Costo + Margen deseado", explanation: "Ignorar el valor percibido por el cliente; si el valor es altísimo, la empresa deja dinero sobre la mesa; si el valor es bajo, nadie compra aunque el costo sea bajo." },
          { mistake: "Diseñar la campaña de marketing hablándole solo al Usuario", explanation: "En modelos B2B o familiares, ignorar al Pagador o al Decisor en los mensajes publicitarios provoca el rechazo de la compra." },
          { mistake: "Confundir TAM con SOM", explanation: "Afirmar en un pitch que 'el mercado de la salud es de 10.000 millones de dólares y solo necesitamos el 1%' sin demostrar cómo capturar el SOM real." },
        ],
      },
      topics: [
        { name: "Fundamentos del Marketing y Tríada Necesidad-Deseo-Demanda", description: "Definiciones de AAM, Kotler y la filosofía centrada en el cliente de Peter Drucker.", importance: "high" },
        { name: "Desconexión con el Mercado (42% Fracaso)", description: "Causas de mortandad temprana de startups por falta de validación.", importance: "critical" },
        { name: "Roles del Consumidor: Modelo CUPID", description: "Comprador, Usuario, Pagador, Influenciador y Decisor en el proceso de compra.", importance: "critical" },
        { name: "Segmentación y Construcción de Buyer Persona", description: "Variables geográficas, demográficas, psicográficas y conductuales.", importance: "high" },
        { name: "Dimensionamiento de Mercado: TAM, SAM y SOM", description: "Metodología de cálculo y embudo de mercado accesible para startups.", importance: "critical" },
        { name: "Estimación de Demanda y Proyección de Ventas", description: "Fórmula de compradores x frecuencia x volumen unitario.", importance: "high" },
        { name: "Marketing Mix (4P): Decisiones de Producto", description: "Niveles (Genérico, Previsto, Mejorado, Potencial) y Cartera (Amplitud y Profundidad).", importance: "high" },
        { name: "Marketing Mix (4P): Decisiones de Precio y Ecuación de Valor", description: "Fórmula Costo < Precio <= Valor y métodos de pricing.", importance: "critical" },
        { name: "Marketing Mix (4P): Promoción y Plaza", description: "Embudo de comunicación AIDA y selección de canales de distribución.", importance: "high" },
      ],
      flashcards: [
        { front: "¿Qué significa el acrónimo CUPID en el análisis del comportamiento del consumidor?", back: "C: Comprador (adquiere físicamente)\nU: Usuario (consume el bien)\nP: Pagador (financia la compra)\nI: Influenciador (recomienda y condiciona)\nD: Decisor (da la aprobación final).", difficulty: "easy" },
        { front: "¿Cuál es la relación matemática que debe cumplirse para que exista transacción voluntaria y rentabilidad en un producto?", back: "COSTO < PRECIO <= VALOR PERCIBIDO.\nEl costo marca el piso para la empresa y el valor marca el techo de disposición a pagar del cliente.", difficulty: "medium" },
        { front: "¿Qué significan las siglas TAM, SAM y SOM en la evaluación de mercados?", back: "TAM: Total Available Market (Mercado total)\nSAM: Serviceable Available Market (Mercado servible con nuestra tecnología)\nSOM: Serviceable Obtainable Market (Segmento objetivo a capturar a corto plazo).", difficulty: "easy" },
        { front: "¿Cuáles son los 4 niveles de producto según la teoría de marketing?", back: "1. Genérico (básico)\n2. Previsto (mínimo esperado)\n3. Mejorado (atributos inesperados de valor)\n4. Potencial (lo que va más allá de lo concebible hoy).", difficulty: "medium" },
        { front: "¿En qué se diferencian la Amplitud y la Profundidad de una cartera de productos?", back: "La Amplitud es la cantidad de gamas o líneas distintas que ofrece la empresa. La Profundidad es la cantidad de productos o variantes específicas dentro de una misma línea.", difficulty: "medium" },
      ],
      questions: [
        {
          question: "¿Cuál de las siguientes afirmaciones describe con precisión la regla de oro de fijación de precios enseñada en clase?",
          options: ["El Precio debe ser siempre igual al Costo más un 30% fijo según la AFIP", "El Costo debe ser menor al Precio, y el Precio debe ser menor o igual al Valor percibido por el cliente", "El Precio solo depende de lo que cobre el competidor principal sin importar los costos", "El Valor percibido siempre coincide exactamente con el costo de fabricación"],
          answer: "El Costo debe ser menor al Precio, y el Precio debe ser menor o igual al Valor percibido por el cliente",
          explanation: "Si Costo >= Precio, la empresa pierde dinero. Si Precio > Valor, el cliente no tiene motivación racional para comprar porque siente que paga más de lo que recibe.",
          difficulty: "medium",
          type: "multiple_choice",
        },
        {
          question: "En una empresa que vende licencias de software contable para pymes, el contador externo que exige cambiar de sistema actúa bajo qué rol del modelo CUPID:",
          options: ["Usuario exclusivamente", "Influenciador", "Pagador directo", "Comprador pasivo"],
          answer: "Influenciador",
          explanation: "El asesor o auditor externo recomienda o exige el software pero no lo compra ni lo financia con su dinero; su rol principal es el de Influenciador técnico determinante.",
          difficulty: "easy",
          type: "multiple_choice",
        },
        {
          question: "En el dimensionamiento de mercado, el subconjunto de clientes potenciales al cual la empresa decide efectivamente orientar su oferta comercial a corto plazo con su fuerza de ventas se denomina:",
          options: ["TAM (Total Available Market)", "Fuerza de Porter #4", "SOM (Serviceable Obtainable Market)", "Segmento Genérico"],
          answer: "SOM (Serviceable Obtainable Market)",
          explanation: "El SOM es el mercado objetivo alcanzable y capturable de forma realista en el corto plazo por la empresa.",
          difficulty: "easy",
          type: "multiple_choice",
        },
      ],
    },
  ];

  // 3. Procesar e insertar en la base de datos
  for (const item of materialsToProcess) {
    const classSession = classMap.get(item.classNumber);
    if (!classSession) {
      console.warn(`⚠️ No se encontró la clase número ${item.classNumber} en la base de datos`);
      continue;
    }

    console.log(`\n📚 Procesando Clase ${item.classNumber}: ${item.classTitle}...`);

    const fullFilePath = path.join(process.cwd(), item.relativeStoragePath);
    let fileSize = 0;
    let extractedText = "";

    if (fs.existsSync(fullFilePath)) {
      const buf = fs.readFileSync(fullFilePath);
      fileSize = fs.statSync(fullFilePath).size;
      const extracted = await extractTextFromBuffer(buf);
      extractedText = extracted.text;
      console.log(`  📄 Archivo PDF cargado (${(fileSize / (1024 * 1024)).toFixed(2)} MB, ${extractedText.length} caracteres extraídos).`);
    } else {
      console.warn(`  ⚠️ No se encontró el archivo físico en ${fullFilePath}`);
    }

    // Actualizar o crear registro Material
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

    // Actualizar o crear Summary
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

    // Actualizar título y notas de la clase
    await prisma.classSession.update({
      where: { id: classSession.id },
      data: {
        title: item.classTitle,
        notes: `Material oficial subido: ${item.fileName}.\nResumen académico disponible en la sección de resúmenes.`,
        attendanceStatus: "attended",
      },
    });

    // Ingestar Topics
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
            masteryScore: 65,
          },
        });
      }
    }
    console.log(`  📌 ${item.topics.length} temas clave actualizados.`);

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
    console.log(`  🗂️  ${item.flashcards.length} flashcards creadas para repetición espaciada.`);

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

  // 4. Actualizar la Clase 3 para reflejar que no hubo clase
  const class3 = classMap.get(3);
  if (class3) {
    await prisma.classSession.update({
      where: { id: class3.id },
      data: {
        title: "Clase 3: Sin clase dictada (Salto de cronograma a Clase 4)",
        notes: "No hubo clase 3 según lo informado por la cátedra. El contenido continuó con Conceptos de Marketing en la Clase 4.",
        attendanceStatus: "cancelled",
      },
    });
    console.log(`\n📅 Clase 3 actualizada como 'Sin clase dictada / Cancelada' según indicación del usuario.`);
  }

  console.log("\n🎉 Ingesta y sincronización completada exitosamente!");
}

main()
  .catch((e) => {
    console.error("Error en la ingesta:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
