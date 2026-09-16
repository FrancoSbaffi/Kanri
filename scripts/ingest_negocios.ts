import prisma from "../lib/db/prisma";
import fs from "fs";
import path from "path";
import { extractTextFromBuffer } from "../lib/pdf/extractor";

async function main() {
  console.log("🚀 Iniciando ingesta integral de materiales para Administración de Negocios Digitales...");

  // 1. Obtener la materia
  const subject = await prisma.subject.findFirst({
    where: { name: { contains: "Negocios Digitales" } },
    include: {
      classes: { orderBy: { classNumber: "asc" } },
      exams: true,
    },
  });

  if (!subject) {
    throw new Error("No se encontró la materia Administración de Negocios Digitales");
  }

  console.log(`✅ Materia encontrada: ${subject.name} (ID: ${subject.id})`);

  const classMap = new Map(subject.classes.map((c) => [c.classNumber, c]));
  const baseDir = path.join(process.cwd(), "uploads", "materials", "miercoles_negocios");

  // 2. Definición estructurada de las 4 clases oficiales con contenido 100% de cátedra
  const classesToProcess = [
    {
      classNumber: 1,
      unit: "Unidad 1",
      fileName: "2026 Administracion de Negocios Digitales - 01 Introducción.pdf",
      relativeStoragePath: "uploads/materials/miercoles_negocios/2026 Administracion de Negocios Digitales - 01 Introducción.pdf",
      classTitle: "Clase 1: Unidad 1 · Introducción a Negocios Digitales, Efecto Precio Cero, Modelos Asimétricos y Plataformas",
      summary: {
        title: "Resumen Académico · Clase 01: Negocios Digitales, Precio Cero (Ariely), Modelos Asimétricos y Plataformas",
        overview:
          "La primera sesión de Administración de Negocios Digitales establece los fundamentos microeconómicos y estratégicos de los modelos productivos basados en bits. Se inicia analizando los descubrimientos de la Economía Conductual sobre 'La fuerza de lo gratis' a partir del paper canónico de Shampanier, Mazar y Dan Ariely ('Zero as a Special Price'), demostrando empíricamente cómo el precio cero no es un descuento ordinario sino un disparador psicológico irracional que elimina el riesgo percibido. Luego se aborda el concepto de Modelo de Negocios según Alexander Osterwalder y la distinción crítica entre productos complementarios y Modelos de Negocios Asimétricos (destacando a Amazon frente al dilema de modelo simétrico puro de Netflix analizado por Marc Sansó). Finalmente, se diferencia una simple 'Oferta Digital' de un 'Modelo de Negocio Digital nativo' con costo marginal cero y se profundiza en las Plataformas Multifacéticas (Hagiu & Wright, David Rogers) y sus efectos de red directos e indirectos.",
        detailedSummary: `### 1. Economía Conductual y la Paradoja de 'Lo Gratis' (Dan Ariely)
A partir del paper seminal *"Zero as a Special Price: The True Value of Free Products"* (Shampanier, Mazar y Dan Ariely):
- **La teoría económica clásica del costo-beneficio postula:**
  $$\\text{Elijo } X \\iff [\\text{Beneficio}(X) - \\text{Precio}(X)] > [\\text{Beneficio}(Y) - \\text{Precio}(Y)]$$
- **El experimento empírico de las trufas Lindt vs. bombones Hershey's:**
  1. *Escenario A (Precios bajos pero mayores a cero)*: Trufa Lindt suiza a **15¢** vs. Hershey's a **1¢**. La gran mayoría (73%) eligió Lindt porque la diferencia de calidad supera con creces los 14 centavos de diferencia.
  2. *Escenario B (Reducción idéntica de 1¢ en ambos productos)*: Lindt a **14¢** vs. Hershey's a **0¢ (GRATIS)**.
- **El hallazgo clave:** A pesar de que la diferencia de precios siguió siendo exactamente de 14¢ y Lindt representaba una 'ganga' económica infinitamente mayor, **el 69% de los consumidores eligió el Hershey's gratuito**.
- **Conclusión de cátedra:** El cero no es un precio más; es una barrera psicológica. Lo gratis elimina por completo el miedo a equivocarse (*cero riesgo percibido*), lo que explica por qué las empresas digitales regalan experiencias y productos iniciales para capturar masivamente la atención del usuario.

---

### 2. Modelo de Negocios y Estrategia Asimétrica
- **Definición canónica (Alexander Osterwalder):**
  > *"Un modelo de negocio describe los fundamentos lógicos y operativos sobre cómo una organización crea, entrega y captura valor."*
- **Productos Complementarios:** Bienes cuyo valor aumenta cuando se consumen conjuntamente (hardware y software, consolas y videojuegos).
- **Modelos de Negocios Asimétricos:**
  - Ocurren cuando una empresa **monetiza en un mercado completamente diferente** a aquel donde atrae y brinda su servicio principal.
  - *Caso Amazon:* Vende hardware como Kindle o dispositivos Echo prácticamente al costo o a pérdida, porque su verdadero negocio es la captura del usuario en su ecosistema de comercio electrónico, servicios en la nube (AWS) y suscripción anual Prime.
  - *El dilema de Netflix (Marc Sansó):* Netflix opera un **modelo simétrico puro** (solo cobra suscripción por streaming de video). Cuando gigantes como Apple (Apple TV+) o Amazon (Prime Video) entran a competir con modelos asimétricos, Netflix queda atrapada: sus rivales no necesitan que el streaming dé ganancias directas, ya que lo usan para vender iPhones o membresías de logística.

---

### 3. Oferta Digital vs. Modelo de Negocios Digital Nativo
| Dimensión | Oferta Digital (Digitalizada) | Modelo de Negocio Digital Nativo |
| :--- | :--- | :--- |
| **Concepto** | Llevar un producto o canal físico al formato digital (*ej. una zapatería tradicional que abre un sitio web*). | La tecnología digital redefine por completo la propuesta de valor y la forma de captura de ingresos. |
| **Estructura de Costos** | Costos variables crecientes por cada unidad física adicional. | **Costo marginal cercano a cero** para atender al usuario $N+1$. |
| **Cultura Operativa** | Procesos lineales, jerárquicos y ciclos lentos de actualización. | Agilidad extrema, experimentación continua y toma de decisiones guiada por datos (*data-driven*). |

---

### 4. Modelos de Negocio de Plataforma Multifacética
- **Definición formal (Andrei Hagiu y Julian Wright):**
  > *"Una plataforma multifacética es una organización que habilita interacciones directas entre dos o más partes distintas (oferentes y demandantes), donde cada parte está afiliada a la plataforma mediante inversiones específicas de acceso."*
- **Aporte de la tecnología digital:** Eliminación radical de costos de búsqueda, verificación y transacción, escalando la intermediación sin necesidad de poseer los activos físicos (*Airbnb no posee habitaciones, Uber no posee automóviles*).
- **Efectos de Red (Network Effects - David L. Rogers):**
  1. **Efectos Directos (del mismo lado / same-side):** El valor del servicio para un usuario crece automáticamente a medida que más usuarios de su mismo grupo lo utilizan (*ej. WhatsApp, redes sociales*).
  2. **Efectos Indirectos (cruzados / cross-side):** El ingreso de usuarios de un lado del mercado atrae y genera valor para los participantes del otro lado (*ej. más desarrolladores en iOS atraen más compradores de iPhone, y más pasajeros en Uber reducen tiempos de espera atrayendo más conductores*).`,
        simplifiedExplanation:
          "En el mundo digital, lo 'gratis' no es una oferta común: la gente se vuelve loca cuando el precio es cero porque siente que no tiene nada que perder (como demostró Dan Ariely con los chocolates). Esto permite crear Modelos Asimétricos: Amazon te vende el lector Kindle al costo porque su verdadero negocio es que después le compres libros y membresías Prime. Y las Plataformas (como Uber o Airbnb) no fabrican productos: crean un puente digital donde dos grupos interactúan y el valor se dispara gracias a los Efectos de Red (cuanta más gente hay, mejor funciona para todos).",
        keyPoints: [
          "Dan Ariely demostró que el precio cero tiene un poder psicológico desproporcionado que distorsiona el análisis económico clásico costo-beneficio.",
          "Un Modelo de Negocio Asimétrico atrae usuarios regalando o subsidiando un producto en un mercado A para monetizar en un mercado B secundario.",
          "Netflix sufre desventaja competitiva frente a Apple y Amazon porque opera un modelo simétrico puro contra rivales que subsidian el streaming.",
          "Diferencia rectora: digitalizar una oferta física tradicional no es lo mismo que crear un modelo nativo digital con costo marginal cercano a cero.",
          "Las Plataformas Multifacéticas (Hagiu & Wright) generan valor reduciendo costos de transacción y apalancándose en efectos de red directos e indirectos.",
        ],
        definitions: [
          { term: "Efecto Precio Cero (Ariely)", definition: "Fenómeno conductual por el cual los consumidores perciben que los productos gratuitos conllevan cero riesgo, prefiriéndolos masivamente aun frente a opciones de mayor beneficio económico objetivo." },
          { term: "Modelo de Negocio Asimétrico", definition: "Estrategia corporativa donde la compañía utiliza un producto o servicio gratuito/subsidiado para capturar cuota de mercado y monetizar en un vertical secundario conexo." },
          { term: "Plataforma Multifacética", definition: "Modelo de negocio (Hagiu & Wright) que facilita la interacción directa entre dos o más segmentos interdependientes de usuarios, intermediando transacciones sin poseer los activos subyacentes." },
          { term: "Efectos de Red Cruzados (Indirectos)", definition: "Dinámica en la que el aumento de participantes de un lado de la plataforma (ej. usuarios) incrementa el valor de la plataforma para los participantes del lado opuesto (ej. creadores o conductores)." },
        ],
        examples: [
          { title: "El experimento de los chocolates Lindt vs. Hershey's", description: "Al rebajar 1 centavo a ambos chocolates, Lindt costaba 14¢ y Hershey's 0¢. La mayoría abandonó el chocolate suizo prémium para llevarse el bombón gratuito sin desembolsar dinero." },
          { title: "Amazon Kindle y Echo como Caballo de Troya", description: "Amazon produce dispositivos al costo para colocarlos en los hogares de los usuarios, monetizando a través de ventas de comercio electrónico, libros y suscripciones continuas." },
        ],
        commonMistakes: [
          { mistake: "Creer que digitalizar una tienda física equivale a un negocio digital", explanation: "Montar una web con catálogo de productos físicos mantiene la estructura de costos y logística tradicional; un negocio digital nativo transforma la propuesta de valor y escala con costo marginal casi nulo." },
          { mistake: "Confundir un negocio simétrico con uno asimétrico", explanation: "Pensar que todos los competidores en un sector ganan dinero vendiendo el mismo servicio, ignorando que rivales como Apple o Amazon subsidian productos con otros flujos de caja." },
        ],
      },
      topics: [
        {
          name: "Unidad 1 · Economía Conductual (Efecto Cero de Dan Ariely) y Modelos de Negocio",
          description: "La fuerza de lo gratis, distorsión de la teoría clásica costo-beneficio y definición de Alexander Osterwalder.",
          importance: "critical",
          masteryScore: 70,
          flashcards: [
            {
              front: "¿Qué demostró el experimento de Dan Ariely (paper 'Zero as a Special Price') con los chocolates Lindt y Hershey's?",
              back: "Demostró que el precio CERO no es un simple descuento cuantitativo, sino una categoría psicológica especial: al pasar de 1¢ a 0¢, los consumidores abandonan masivamente opciones de mayor valor objetivo (Lindt a 14¢) porque lo gratis elimina el riesgo percibido de equivocarse.",
              difficulty: "medium",
            },
            {
              front: "¿Cómo define Alexander Osterwalder un Modelo de Negocios?",
              back: "Como la descripción de las bases lógicas y operativas mediante las cuales una organización crea, entrega y captura valor en el mercado.",
              difficulty: "easy",
            },
          ],
          questions: [
            {
              question: "En el experimento de Dan Ariely, cuando la trufa Lindt costaba 15¢ y el bombón Hershey's 1¢, la mayoría prefería Lindt. Al bajar 1¢ ambos productos (Lindt 14¢ y Hershey's 0¢), ¿qué ocurrió y qué principio explica ese comportamiento?",
              options: [
                "La proporción de compra se mantuvo idéntica porque la diferencia de precio siguió siendo de 14 centavos.",
                "El 69% eligió el bombón Hershey's gratuito, demostrando que el precio cero elimina la percepción de riesgo y distorsiona el análisis económico clásico.",
                "Los clientes dejaron de comprar chocolates por desconfianza en la calidad sanitaria.",
                "Lindt duplicó sus ventas porque 14 centavos era un precio ridículamente bajo.",
              ],
              answer: "El 69% eligió el bombón Hershey's gratuito, demostrando que el precio cero elimina la percepción de riesgo y distorsiona el análisis económico clásico.",
              explanation: "El efecto precio cero activa una reacción emocional positiva irracional donde el consumidor siente que no hay pérdida potencial posible.",
              difficulty: "medium",
            },
          ],
        },
        {
          name: "Unidad 1 · Modelos Asimétricos (Amazon vs. Netflix) y Productos Complementarios",
          description: "Monetización en mercados cruzados, subvención de hardware y la desventaja de modelos simétricos puros.",
          importance: "critical",
          masteryScore: 68,
          flashcards: [
            {
              front: "¿Qué es un Modelo de Negocios Asimétrico?",
              back: "Es una estrategia donde una empresa compite en un mercado ofreciendo un producto a bajo costo, gratis o subsidiado, pero monetiza y captura ganancias en un mercado secundario completamente diferente (ej. Amazon vendiendo Kindle para facturar libros y suscripciones Prime).",
              difficulty: "medium",
            },
            {
              front: "¿Por qué Netflix se encuentra en desventaja frente a competidores como Apple y Amazon según Marc Sansó?",
              back: "Porque Netflix opera un modelo simétrico puro (depende 100% del ingreso de suscripciones de streaming), mientras que Apple y Amazon tienen modelos asimétricos y pueden subsidiar el contenido audiovisual para vender hardware (iPhones) o membresías de comercio electrónico.",
              difficulty: "medium",
            },
          ],
          questions: [
            {
              question: "¿Cuál de las siguientes empresas opera bajo un 'Modelo de Negocio Asimétrico' característico según lo visto en clase?",
              options: [
                "Una distribuidora de gas por tuberías con tarifa única regulada.",
                "Amazon, vendiendo dispositivos Kindle a precio de fábrica para monetizar con ventas de libros digitales y servicios del ecosistema.",
                "Un restaurante tradicional de barrio con menú fijo diario.",
                "Un videoclub de alquiler físico de películas VHS.",
              ],
              answer: "Amazon, vendiendo dispositivos Kindle a precio de fábrica para monetizar con ventas de libros digitales y servicios del ecosistema.",
              explanation: "Amazon utiliza el hardware como vehículo de entrada para capturar rentas en mercados complementarios de mayor margen.",
              difficulty: "easy",
            },
          ],
        },
        {
          name: "Unidad 1 · Plataformas Digitales Multifacéticas y Efectos de Red (Hagiu & Rogers)",
          description: "Definición de plataformas multifacéticas, costos de transacción y efectos directos e indirectos de red.",
          importance: "critical",
          masteryScore: 72,
          flashcards: [
            {
              front: "¿Cómo definen Andrei Hagiu y Julian Wright una 'Plataforma Multifacética'?",
              back: "Como una organización que permite la interacción directa entre dos o más grupos distintos de usuarios afiliados, donde el valor se genera mediante la intermediación y reducción de costos de transacción sin necesidad de poseer los activos físicos.",
              difficulty: "medium",
            },
            {
              front: "¿Cuál es la diferencia entre los Efectos de Red Directos e Indirectos según David L. Rogers?",
              back: "Los efectos directos (del mismo lado) ocurren cuando más usuarios aumentan el valor para usuarios de ese mismo grupo (ej. WhatsApp). Los efectos indirectos (cruzados) ocurren cuando el aumento de usuarios de un lado incrementa el valor para el otro lado (ej. más pasajeros atraen más conductores en Uber).",
              difficulty: "medium",
            },
          ],
          questions: [
            {
              question: "En una plataforma como Uber o Airbnb, el hecho de que una mayor cantidad de conductores o anfitriones reduzca los tiempos de espera y precios, atrayendo a más pasajeros o viajeros, constituye un ejemplo de:",
              options: [
                "Efecto de Red Indirecto o Cruzado (Cross-side)",
                "Efecto de Red Directo (Same-side)",
                "Modelo de Negocio Simétrico Tradicional",
                "Efecto de Sustitución Negativa",
              ],
              answer: "Efecto de Red Indirecto o Cruzado (Cross-side)",
              explanation: "El efecto es cruzado porque el crecimiento de un lado del mercado (oferta de autos) genera valor y atrae al lado opuesto (demanda de viajes).",
              difficulty: "medium",
            },
          ],
        },
      ],
    },
    {
      classNumber: 2,
      unit: "Unidad 2",
      fileName: "2026 Administracion de Negocios Digitales - 02 Planeamiento Estrategico.pdf",
      relativeStoragePath: "uploads/materials/miercoles_negocios/2026 Administracion de Negocios Digitales - 02 Planeamiento Estrategico.pdf",
      classTitle: "Clase 2: Unidad 2 · Planificación Estratégica Digital y los 10 Pasos de Gartner para Plataformas",
      summary: {
        title: "Resumen Académico · Clase 02: Planificación Estratégica Digital, Gartner y Objetivos SMART",
        overview:
          "La Clase 02 aborda la metodología de la Planificación Estratégica aplicada al vertiginoso contexto de los negocios digitales. Se examina el origen etimológico militar de la palabra 'estrategia' (Strat-ós y Ág-ō) para contextualizar el liderazgo de recursos bajo incertidumbre competitiva. Se contrasta el modelo tradicional de financiamiento por proyectos rígidos frente al modelo moderno de 'Financiamiento Dinámico Basado en Valor' (Dynamic Value-Driven Funding). El núcleo de la clase se focaliza en el Framework oficial de Gartner con los '10 Pasos para Construir una Plataforma Digital de Negocios' (desde la visión y capacidades, creación de estructura interna, APIs de integración desacopladas, desarrollo del MVP hasta la expansión escalable), cerrando con el diseño de objetivos SMART e indicadores de resultados.",
        detailedSummary: `### 1. Concepto y Origen de la Planificación Estratégica
- **Etimología griega:**
  - *Strat-ós (στρατ-)*: Ejército o hueste en movimiento.
  - *Ág-ō (ἄγω)*: Conducir, guiar, dirigir o liderar.
  - *Estrategia:* El arte y la ciencia de liderar y coordinar los recursos disponibles hacia el cumplimiento de objetivos decisivos en un entorno competitivo.
- **Definición de Plan Estratégico:** Documento rector que formaliza los objetivos cualitativos y cuantitativos de la organización, delimitando los caminos críticos, asignación de recursos y métricas de desempeño para capturar ventajas competitivas sustentables.
- **La complejidad en negocios digitales:** Los ciclos de vida son hiper-acelerados. Un plan estratégico digital no puede ser un plan quinquenal inmutable; debe ser un instrumento vivo sujeto a iteración continua.

---

### 2. El Cambio de Paradigma: Financiamiento Dinámico Basado en Valor (Gartner)
- **Modelo Tradicional (Waterfall / Por Proyectos):** Asigna un presupuesto cerrado anual a un proyecto de IT con alcance fijo. Cuando termina el año o el proyecto, el presupuesto finaliza sin importar si el mercado cambió.
- **Modelo Digital (Dynamic Value-Driven Funding):**
  - El negocio digital no es un proyecto temporal con inicio y fin: **es una capacidad corporativa continua**.
  - Los fondos se liberan en ciclos cortos y progresivos atados a la entrega real de valor verificable con usuarios (*milestones de producto*).

---

### 3. Los 10 Pasos de Gartner para Construir una Plataforma Digital
Metodología de referencia para transformar una organización tradicional en una plataforma de negocio digital:
1. **Visión y Capacidades:** Definir explícitamente el grado de ambición digital de la compañía (¿buscamos optimizar operaciones existentes o crear nuevos modelos de monetización?).
2. **Objetivos Secuenciados:** Establecer métricas e hitos cronológicos claros vinculados a resultados conductuales de los clientes.
3. **Presupuesto Plurianual:** Abandonar la visión de gasto anual cerrado y comprometer inversiones de evolución continua.
4. **Crear Organización y Liderazgo:** El 75% de las empresas fracasan porque mantienen estructuras burocráticas rígidas que asfixian la agilidad digital.
5. **Involucrar al Ecosistema de Proveedores:** Casi el 100% de las plataformas exitosas apalancan partners externos para acelerar el desarrollo y la cobertura.
6. **Plan de Desarrollo de Habilidades (Upskilling):** Capacitar a la fuerza interna en habilidades de producto, metodologías ágiles, cloud y People Analytics.
7. **Seleccionar Tecnologías Escalables:** Arquitecturas de microservicios, infraestructura en la nube elástica y modular.
8. **Estrategia de APIs e Integración:** Las APIs son los contratos digitales que permiten que sistemas heterogéneos se comuniquen de forma desacoplada y segura.
9. **Desarrollar e Implementar el MVP (Producto Mínimo Viable):** Lanzar la versión más simple que pruebe la hipótesis central de valor con clientes reales antes de invertir masivamente.
10. **Escalar y Expandir:** Con el encaje producto-mercado verificado, acelerar la inversión en captación y optimización de infraestructura.

---

### 4. Definición de Objetivos SMART en Negocios Digitales
Metodología para redactar metas estratégicas operativas:
- **S (Specific / Específicos):** Claridad sin ambigüedades sobre qué se busca lograr.
- **M (Measurable / Medibles):** Atados a KPIs o métricas cuantitativas verificables.
- **A (Achievable / Alcanzables):** Desafiantes pero realistas según los recursos disponibles.
- **R (Relevant / Relevantes):** Alineados a la supervivencia y rentabilidad del negocio.
- **T (Time-bound / Con Tiempo definido):** Fecha límite estricta de cumplimiento y revisión.`,
        simplifiedExplanation:
          "Armar un negocio digital no es contratar programadores y esperar a ver qué pasa. Requiere Planificación Estratégica: saber a dónde querés llegar y cómo vas a coordinar tus recursos. La consultora Gartner define 10 pasos fundamentales: definir tu visión, no financiar con presupuestos fijos anuales sino según el valor real que vas logrando, conectar todo mediante APIs, crear un MVP rápido para ver si a la gente le sirve, y solo después escalar con todo. Y para que las metas no queden en el aire, se usan los Objetivos SMART.",
        keyPoints: [
          "La palabra estrategia proviene del griego y alude al arte de conducir recursos en entornos de conflicto o competencia.",
          "El financiamiento digital moderno (Gartner) debe ser dinámico y basado en valor (Value-Driven Funding), no por presupuestos anuales estáticos.",
          "El 75% de las iniciativas de plataformas digitales fracasan por problemas organizacionales y culturales, no por fallas tecnológicas.",
          "Las APIs representan los conectores clave que permiten que la plataforma se integre ágilmente con clientes, socios y el ecosistema.",
          "El proceso de Gartner concluye con el ciclo MVP -> Validación de hipótesis -> Escalamiento agresivo.",
        ],
        definitions: [
          { term: "Dynamic Value-Driven Funding", definition: "Modelo de asignación presupuestaria continua y flexible donde el financiamiento se renueva en función del valor y resultados empíricos demostrados en cada ciclo." },
          { term: "Estrategia de APIs", definition: "Definición de interfaces de programación abiertas y modulares que permiten desacoplar componentes de software e integrarse con plataformas de terceros." },
          { term: "Producto Mínimo Viable (MVP)", definition: "Versión inicial de un producto que cuenta con las funcionalidades indispensables para validar una hipótesis de negocio central frente a usuarios reales con el menor esfuerzo posible." },
          { term: "Objetivos SMART", definition: "Metodología de establecimiento de metas caracterizadas por ser Específicas, Medibles, Alcanzables, Relevantes y Temporalmente acotadas." },
        ],
        examples: [
          { title: "Fracaso por Presupuesto Tradicional Waterfall", description: "Un banco destina 10 millones de dólares a un desarrollo cerrado de 2 años. Al finalizar el plazo, las necesidades de los usuarios de billeteras móviles habían cambiado y el software nació obsoleto." },
          { title: "Lanzamiento de MVP en Plataformas", description: "Antes de programar una plataforma de delivery con algoritmos de IA, los fundadores validan manualmente los pedidos por WhatsApp para comprobar si los comercios y clientes están dispuestos a pagar por el servicio." },
        ],
        commonMistakes: [
          { mistake: "Considerar a la plataforma digital como un proyecto con fecha final de entrega", explanation: "Una plataforma digital es un producto y capacidad viva que requiere evolución, mantenimiento y experimentación continua." },
          { mistake: "Escalar la plataforma antes de probar el MVP", explanation: "Invertir millones en pauta publicitaria y servidores antes de validar que los usuarios realmente retienen y usan la propuesta de valor lleva a la quiebra acelerada." },
        ],
      },
      topics: [
        {
          name: "Unidad 2 · Planificación Estratégica Digital y los 10 Pasos de Gartner",
          description: "Metodología de 10 pasos de Gartner para diseñar, financiar y escalar plataformas digitales de negocio.",
          importance: "critical",
          masteryScore: 68,
          flashcards: [
            {
              front: "¿Qué plantea el concepto de 'Dynamic Value-Driven Funding' de Gartner frente al presupuesto tradicional?",
              back: "Plantea que el negocio digital no es un proyecto de IT con fecha de cierre y presupuesto estático anual, sino una capacidad continua donde los fondos se liberan en ciclos cortos según el valor real generado y validado con usuarios.",
              difficulty: "medium",
            },
            {
              front: "¿Por qué el 75% de las empresas fracasan al construir plataformas digitales según Gartner?",
              back: "Porque no adaptan su estructura organizacional, cultura interna ni esquemas de liderazgo, manteniendo jerarquías rígidas y lentas que ahogan la velocidad de iteración digital.",
              difficulty: "easy",
            },
            {
              front: "¿Cuál es el rol de las APIs en la construcción de una plataforma digital según Gartner?",
              back: "Las APIs son los contratos digitales modulares que permiten el desacoplamiento de sistemas, la reutilización de datos y la integración ágil con proveedores, clientes y socios externos.",
              difficulty: "medium",
            },
          ],
          questions: [
            {
              question: "En el framework de Gartner para construir plataformas digitales, ¿cuál es el paso que debe ejecutarse inmediatamente ANTES de escalar y expandir la plataforma?",
              options: [
                "Congelar el presupuesto y desvincular al equipo técnico.",
                "Desarrollar e implementar el Producto Mínimo Viable (MVP) para probar la hipótesis central de valor con clientes reales.",
                "Comprar software propietario enlatado sin posibilidad de personalización.",
                "Publicar balances sociales impresos en papel prensa.",
              ],
              answer: "Desarrollar e implementar el Producto Mínimo Viable (MVP) para probar la hipótesis central de valor con clientes reales.",
              explanation: "El paso 9 es la validación empírica mediante un MVP; solo cuando el valor ha sido probado de forma fehaciente se procede al paso 10 de escala masiva.",
              difficulty: "medium",
            },
          ],
        },
        {
          name: "Unidad 2 · Definición de Objetivos SMART y Financiamiento Dinámico",
          description: "Criterios de definición de metas cuantitativas y cualitativas de la estrategia digital.",
          importance: "high",
          masteryScore: 72,
          flashcards: [
            {
              front: "¿Cuáles son las 5 características indispensables de un objetivo SMART en la gestión de negocios digitales?",
              back: "Específico (Specific), Medible (Measurable), Alcanzable (Achievable), Relevante (Relevant) y Acotado en el Tiempo (Time-bound).",
              difficulty: "easy",
            },
          ],
          questions: [
            {
              question: "¿Cuál de los siguientes enunciados cumple cabalmente con los criterios de un 'Objetivo SMART' en un negocio digital?",
              options: [
                "Ser la mejor aplicación móvil del mundo en los próximos años.",
                "Aumentar la tasa de conversión de visitantes a usuarios registrados en un 15% durante el cuarto trimestre de 2026.",
                "Mejorar el diseño visual de la interfaz para que sea más moderna.",
                "Hacer que los programadores trabajen con mayor entusiasmo y alegría.",
              ],
              answer: "Aumentar la tasa de conversión de visitantes a usuarios registrados en un 15% durante el cuarto trimestre de 2026.",
              explanation: "Es específico (tasa de conversión de registro), medible (15%), alcanzable, relevante para el negocio y delimitado en el tiempo (Q4 2026).",
              difficulty: "easy",
            },
          ],
        },
      ],
    },
    {
      classNumber: 3,
      unit: "Unidad 3",
      fileName: "2026 Administracion de Negocios Digitales - 03 Analisis del entorno digital.pdf",
      relativeStoragePath: "uploads/materials/miercoles_negocios/2026 Administracion de Negocios Digitales - 03 Analisis del entorno digital.pdf",
      classTitle: "Clase 3: Unidad 3 · Análisis del Entorno Digital: Entornos VUCA a BANI y Metodología PESTLE",
      summary: {
        title: "Resumen Académico · Clase 03: Entorno Digital, Entornos VUCA vs. BANI y Análisis PESTLE",
        overview:
          "La Clase 03 se concentra en la comprensión y evaluación diagnóstica del macroentorno en el que operan las organizaciones digitales. Se define el Entorno Organizacional y su impacto en la toma de decisiones directivas. Se analiza la transición conceptual desde los tradicionales entornos VUCA (Volatilidad, Incertidumbre, Complejidad, Ambigüedad) concebidos a fines de la Guerra Fría hacia el nuevo marco BANI formulado por Jamais Cascio (Quebradizo/Brittle, Ansógeno/Anxious, No-lineal/Non-linear e Incomprensible/Incomprehensible), estructurando las respuestas estratégicas necesarias frente a cada dimensión. Finalmente, se diseña de punta a punta la matriz metodológica PESTLE (Factores Políticos, Económicos, Sociales, Tecnológicos, Legales y Ecológicos), aplicándola al caso de estudio de Airbnb en el contexto económico y regulatorio argentino.",
        detailedSummary: `### 1. El Entorno Organizacional y Digital
- **Definición:** El entorno organizacional comprende la totalidad de factores, fuerzas y condiciones externas que se encuentran fuera del control directo e inmediato de la empresa, pero que influyen decisivamente en su supervivencia, desempeño y competitividad.
- **Propósito del análisis del entorno:**
  - Identificar tempranamente riesgos emergentes (*amenazas*).
  - Descubrir nichos desatendidos o tendencias tecnológicas favorables (*oportunidades*).
  - Permitir que el modelo de negocio digital sea flexible y antifrágil.

---

### 2. La Evolución de Paradigmas: De Entornos VUCA a Entornos BANI (Jamais Cascio)
El marco **VUCA** (creado por el Colegio de Guerra del Ejército de EE.UU.) resultó insuficiente para describir la disrupción tecnológica contemporánea, dando paso al marco **BANI**:

| Dimensión BANI | Definición y Síntoma en la Era Digital | Respuesta y Capacidad Estratégica |
| :--- | :--- | :--- |
| **B - Brittle (Quebradizo / Frágil)** | Sistemas que parecen sólidos y estables pero que colapsan catastróficamente ante shocks inesperados (*ej. caída global de servidores cloud, quiebra de Silicon Valley Bank*). | **Resiliencia y Capacidad de holgura:** No optimizar al 100% la eficiencia; mantener redundancias y sistemas de respaldo. |
| **A - Anxious (Ansógeno / Ansiedad)** | Sensación constante de impotencia, desinformación y urgencia frente a la velocidad del cambio tecnológico y la IA. | **Empatía, Seguridad Psicológica y Conciencia Plena:** Fomentar una cultura de contención y transparencia. |
| **N - Non-linear (No Lineal)** | Desconexión entre causa y efecto: pequeñas decisiones causan impactos masivos, mientras que grandes inversiones pueden no mover la aguja (*efecto mariposa*). | **Adaptabilidad y Contexto:** Abandonar planes rígidos de causa-efecto lineal; operar mediante experimentación continua. |
| **I - Incomprehensible (Incomprensible)** | El exceso abrumador de datos y algoritmos de 'caja negra' imposibilita entender la causa raíz mediante el razonamiento lógico tradicional. | **Transparencia e Intuición:** Modelos explicables y toma de decisiones guiada por principios rectores claros. |

---

### 3. Marco Metodológico de Análisis PESTLE
Herramienta de diagnóstico de 6 dimensiones externas para evaluar la viabilidad de un negocio digital:
1. **Factores Políticos (P):** Estabilidad del gobierno, políticas tributarias a la economía digital, relaciones internacionales y nivel de intervencionismo.
2. **Factores Económicos (E):** Tipo de cambio (brecha cambiaria, cepo), tasa de inflación, poder adquisitivo de los usuarios, costo del crédito y tasas de interés.
3. **Factores Sociales y Culturales (S):** Cambios de hábitos de consumo digital, adopción de e-commerce, nivel educativo, demografía y preferencias generacionales (Generación Z, nómades digitales).
4. **Factores Tecnológicos (T):** Penetración de internet de alta velocidad y 5G, adopción de inteligencia artificial generativa, madurez de la computación en la nube y ciberseguridad.
5. **Factores Legales y Regulatorios (L):** Leyes de protección de datos personales (GDPR, LPDP), regulaciones a plataformas de intermediación, regímenes de facturación electrónica y normativas laborales de teletrabajo.
6. **Factores Ecológicos y Ambientales (E):** Huella de carbono de los centros de cómputo, consumo de energía de modelos de IA y demandas de sostenibilidad por parte de los consumidores.

---

### 4. Caso de Estudio: Análisis PESTLE de Airbnb en Argentina
- **Político/Legal:** Tensiones con cámaras hoteleras tradicionales, proyectos de ley para registrar alquileres temporarios y retener impuestos turísticos.
- **Económico:** Oportunidad gigante por brecha cambiaria (turistas extranjeros atraídos por costos bajos pagando en dólares), pero riesgo por inflación local y restricciones a giros de divisas al exterior.
- **Social:** Alta aceptación en usuarios jóvenes por tarifas accesibles; quejas vecinales por ruidos molestos en barrios residenciales.
- **Tecnológico:** Excelente penetración de smartphones y medios de pago digitales para concretar reservas inmediatas.`,
        simplifiedExplanation:
          "Las empresas digitales no viven en una burbuja: tienen que entender el mundo que las rodea. Antes se decía que el mundo era VUCA (volátil y confuso), pero hoy es BANI: quebradizo (se cae todo de golpe), ansioso, no lineal (hacés una tontería y se vuelve viral, o invertís millones y nadie te mira) e incomprensible. Para no estrellarse, se usa el análisis PESTLE, que revisa 6 áreas clave: Política, Economía, Sociedad, Tecnología, Leyes y Ecología (como vimos en el caso de Airbnb en Argentina).",
        keyPoints: [
          "El análisis del entorno detecta amenazas y oportunidades que escapan al control interno directo de la organización.",
          "El marco BANI (Jamais Cascio) reemplaza a VUCA: Quebradizo (Brittle), Ansógeno (Anxious), No lineal (Non-linear) e Incomprensible (Incomprehensible).",
          "A la fragilidad se responde con resiliencia; a la ansiedad con empatía; a la no linealidad con adaptabilidad; a lo incomprensible con transparencia.",
          "PESTLE analiza 6 factores externos: Políticos, Económicos, Sociales, Tecnológicos, Legales y Ecológicos.",
          "El caso Airbnb en Argentina demuestra cómo los factores económicos (turismo en dólares) y legales (regulaciones de alquileres) chocan y definen la estrategia.",
        ],
        definitions: [
          { term: "Entorno BANI", definition: "Marco conceptual postulado por Jamais Cascio que describe el entorno contemporáneo como Brittle (Quebradizo), Anxious (Generador de ansiedad), Non-linear (No lineal) e Incomprehensible (Incomprensible)." },
          { term: "Análisis PESTLE", definition: "Técnica de análisis estratégico que examina los factores Políticos, Económicos, Sociales, Tecnológicos, Legales y Ecológicos del macroentorno organizacional." },
          { term: "Resiliencia Organizacional", definition: "Capacidad de un sistema o modelo de negocio para absorber impactos abruptos, reconfigurarse y seguir operando sin quebrarse." },
        ],
        examples: [
          { title: "No linealidad en Negocios Digitales", description: "Un bug menor de software en una actualización de CrowdStrike en 2024 provocó la cancelación simultánea de 5.000 vuelos en aeropuertos globales en menos de 2 horas (pequeña causa, colapso masivo no lineal)." },
          { title: "Factor Legal en PESTLE para IA", description: "La aprobación de la ley AI Act en la Unión Europea obligó a empresas como OpenAI y Google a rediseñar de inmediato sus modelos de transparencia y almacenamiento de datos." },
        ],
        commonMistakes: [
          { mistake: "Confundir complejidad (VUCA) con incomprensibilidad (BANI)", explanation: "Un sistema complejo tiene muchas partes pero con tiempo puede entenderse; un sistema incomprensible no responde a la lógica de deducción causal clásica debido a la saturación algorítmica de datos." },
          { mistake: "Realizar un PESTLE como un resumen enciclopédico sin impacto estratégico", explanation: "Listar noticias generales de economía sin vincularlas a cómo afectan concretamente los costos, precios o clientes de la empresa convierte al PESTLE en un ejercicio estéril." },
        ],
      },
      topics: [
        {
          name: "Unidad 3 · Entornos Organizacionales: Transición de VUCA a BANI (Jamais Cascio)",
          description: "De la volatilidad clásica a la fragilidad quebradiza, ansiedad, no linealidad e incomprensibilidad.",
          importance: "critical",
          masteryScore: 68,
          flashcards: [
            {
              front: "¿Qué significan las siglas del acrónimo BANI formulado por Jamais Cascio?",
              back: "Brittle (Quebradizo / Frágil), Anxious (Ansógeno / Generador de ansiedad), Non-linear (No lineal) e Incomprehensible (Incomprensible).",
              difficulty: "easy",
            },
            {
              front: "¿Cuáles son las 4 respuestas estratégicas frente a cada una de las dimensiones del entorno BANI?",
              back: "1. Frente a lo Quebradizo (Brittle) -> Resiliencia y redundancia de sistemas.\n2. Frente a la Ansiedad (Anxious) -> Empatía, contención y transparencia.\n3. Frente a la No linealidad (Non-linear) -> Adaptabilidad y experimentación ágil.\n4. Frente a lo Incomprensible (Incomprehensible) -> Transparencia e intuición guiada por principios.",
              difficulty: "critical",
            },
          ],
          questions: [
            {
              question: "En el marco BANI de Jamais Cascio, cuando una empresa digital descubre que pequeños cambios en un algoritmo provocan resultados masivos impredecibles y desproporcionados, está experimentando la dimensión de:",
              options: [
                "No linealidad (Non-linear)",
                "Fragilidad Quebradiza (Brittle)",
                "Generación de Ansiedad (Anxious)",
                "Planeamiento Tradicional Waterfall",
              ],
              answer: "No linealidad (Non-linear)",
              explanation: "La no linealidad rompe la relación proporcional clásica de causa y efecto, generando impactos exponenciales o desconectados del estímulo inicial.",
              difficulty: "medium",
            },
          ],
        },
        {
          name: "Unidad 3 · Análisis del Entorno Digital: Marco Metodológico PESTLE",
          description: "Evaluación de variables Políticas, Económicas, Sociales, Tecnológicas, Legales y Ecológicas.",
          importance: "critical",
          masteryScore: 70,
          flashcards: [
            {
              front: "¿Cuáles son los 6 factores que componen la herramienta de análisis de macroentorno PESTLE?",
              back: "Políticos (P), Económicos (E), Sociales (S), Tecnológicos (T), Legales (L) y Ecológicos/Ambientales (E).",
              difficulty: "easy",
            },
            {
              front: "¿Cómo influyó el factor Legal en el análisis PESTLE de Airbnb en Argentina según lo debatido en clase?",
              back: "A través de las presiones de cámaras hoteleras para crear registros obligatorios de alquileres temporarios, tributación específica y regulaciones de consorcios en edificios residenciales.",
              difficulty: "medium",
            },
          ],
          questions: [
            {
              question: "Al realizar un análisis PESTLE para una billetera virtual Fintech en Argentina, ¿a qué categoría corresponde la exigencia del Banco Central de mantener el 100% de los depósitos encajados y reportar operaciones a la AFIP/UIF?",
              options: [
                "Factores Legales y Regulatorios (L)",
                "Factores Ecológicos (E)",
                "Factores Sociales y Culturales (S)",
                "Análisis de Competencia Directa",
              ],
              answer: "Factores Legales y Regulatorios (L)",
              explanation: "Las circulares del BCRA y normas tributarias de la AFIP/UIF constituyen el marco legal regulatorio de cumplimiento forzoso.",
              difficulty: "easy",
            },
          ],
        },
      ],
    },
    {
      classNumber: 4,
      unit: "Unidad 4",
      fileName: "2026 Administracion de Negocios Digitales - 04 Analisis de la competencia digital.pdf",
      relativeStoragePath: "uploads/materials/miercoles_negocios/2026 Administracion de Negocios Digitales - 04 Analisis de la competencia digital.pdf",
      classTitle: "Clase 4: Unidad 4 · Análisis de la Competencia Digital: FODA, Matriz VRIO, CAME y OKRs",
      summary: {
        title: "Resumen Académico · Clase 04: Competencia Digital, Matriz VRIO, CAME y OKRs",
        overview:
          "La Clase 04 completa el ciclo de diagnóstico y formulación estratégica vinculando el entorno competitivo con la ejecución operativa. Se define la Competencia Digital diferenciando competidores directos de indirectos. Se presenta la articulación entre la Matriz FODA y el modelo VRIO de Jay Barney (Valor, Rareza, Inimitabilidad y Organización), determinando qué fortalezas internas constituyen auténticas Ventajas Competitivas Sostenibles. Para traducir el diagnóstico en planes de acción ejecutables, se desarrolla la Matriz CAME (Corregir debilidades, Afrontar amenazas, Mantener fortalezas y Explotar oportunidades), conectándola directamente con la metodología OKR (Objectives and Key Results de John Doerr). Finalmente, se analiza el Caso de Estudio Antimonopolio contra Meta (juicio histórico de la FTC por la adquisición de Instagram y WhatsApp para neutralizar competidores).",
        detailedSummary: `### 1. Concepto de Competencia y Competidores Digitales
- **Etimología:** Del latín *competentia*, derivado del verbo *competĕre* (pugnar dos o más partes por conseguir una misma cosa o preferencia).
- **Tipologías:**
  - **Competidores Directos:** Ofrecen productos o servicios con la misma propuesta de valor y atienden al mismo segmento de clientes (*ej. Netflix vs. Disney+, Spotify vs. Apple Music*).
  - **Competidores Indirectos:** Ofrecen productos diferentes pero satisfacen la misma necesidad de fondo o compiten por el mismo recurso escaso del usuario: **el tiempo y la atención** (*ej. Netflix compitiendo contra TikTok, Fortnite o YouTube*).

---

### 2. De FODA a la Matriz VRIO (Jay Barney)
El análisis FODA suele ser subjetivo: listar cualquier capacidad como 'Fortaleza' puede ser engañoso. El test **VRIO** somete los recursos y capacidades a cuatro preguntas secuenciales:

| Dimensión VRIO | Pregunta Evaluadora de Cátedra | Si la respuesta es NO | Si la respuesta es SÍ |
| :--- | :--- | :--- | :--- |
| **V - Valor** | ¿El recurso permite neutralizar amenazas o explotar oportunidades del mercado? | **Desventaja Competitiva** | Pasa al siguiente filtro. |
| **R - Rareza** | ¿El recurso está en manos de muy pocas empresas en el sector? | **Paridad Competitiva** (igual que todos) | Pasa al siguiente filtro. |
| **I - Inimitabilidad** | ¿Es difícil o sumamente costoso de copiar o replicar para los rivales? | **Ventaja Competitiva Temporal** | Pasa al siguiente filtro. |
| **O - Organización** | ¿La empresa posee los procesos, liderazgo y estructura para explotarlo al máximo? | **Ventaja No Explotada** | **VENTAJA COMPETITIVA SOSTENIBLE** |

*Conclusión de cátedra:* Solo los recursos que cumplen las cuatro condiciones (V, R, I, O) se clasifican como **Fortalezas Estratégicas de Alto Rendimiento** en el FODA.

---

### 3. Matriz CAME: El Plan de Acción Estratégico
El FODA solo diagnostica; la Matriz **CAME** define la acción:

| Estrategia CAME | Cruce con FODA | Tipo de Estrategia y Acción |
| :--- | :--- | :--- |
| **C - Corregir** | Debilidades | **Estrategia de Reorientación:** Rediseñar procesos internos, capacitar o cambiar tecnología para superar falencias. |
| **A - Afrontar** | Amenazas | **Estrategia de Supervivencia:** Proteger márgenes, diversificar fuentes de ingresos y blindarse ante el contexto adverso. |
| **M - Mantener** | Fortalezas | **Estrategia Defensiva:** Blindar ventajas competitivas VRIO, fidelizar clientes y reforzar patentes o algoritmos. |
| **E - Explotar** | Oportunidades | **Estrategia Ofensiva:** Penetrar nuevos mercados, lanzar productos innovadores y capturar cuota agresivamente. |

*Caso analizado en clase:* **TikTok**: Explotar algoritmos de recomendación (Ofensiva), Corregir preocupaciones de privacidad (Reorientación), Afrontar prohibiciones gubernamentales en EE.UU. (Supervivencia).

---

### 4. Conexión de CAME con Metodología OKR (John Doerr)
Para que el plan estratégico no quede en un informe guardado en un cajón, se traduce a **OKRs (Objectives and Key Results)**:
- **Objetivo (O):** Cualitativo, inspirador, ambicioso y memorable (*¿Hacia dónde queremos ir?*).
- **Resultados Clave (KR):** Cuantitativos, medibles, con fecha estricta (*¿Cómo sabemos si estamos llegando?*).
  - *Ejemplo Cátedra:*
    - **Objetivo:** Convertirse en la plataforma de e-commerce preferida del público joven en Argentina.
    - **KR 1:** Incrementar el GMV mensual de $5M a $12M al 31 de diciembre.
    - **KR 2:** Reducir el tiempo de entrega de 48 hs a menos de 4 hs en el 90% de los envíos.
    - **KR 3:** Alcanzar un Net Promoter Score (NPS) superior a 75 puntos.

---

### 5. Caso de Estudio: Demanda Antimonopolio contra Meta (FTC)
- **El núcleo del conflicto:** Mark Zuckerberg identificó que Instagram y WhatsApp amenazaban el monopolio de Facebook y decidió adquirirlas tempranamente (*estrategia de 'comprar o enterrar' competidores*).
- **Debate de cátedra:**
  - *Línea de la acusación (FTC):* Meta abusó de su posición dominante para sofocar la competencia, privando a los usuarios de alternativas independientes y controlando monopólicamente los datos publicitarios.
  - *Línea de la defensa (Meta):* Las compras fueron aprobadas en su momento por los reguladores; Instagram y WhatsApp crecieron exponencialmente gracias a la infraestructura y capital aportado por Meta, y compiten ferozmente contra TikTok, YouTube y Apple.`,
        simplifiedExplanation:
          "Analizar a la competencia no es solo mirar a tus rivales directos (como Netflix mirando a Disney+), sino también a los indirectos que te roban tiempo (TikTok o videojuegos). Para saber si lo que tenés es una ventaja real o una ilusión, se usa el test VRIO: tu capacidad debe ser Valiosa, Rara, difícil de Imitar y bien Organizada. Después, con la Matriz CAME transformás el FODA en acción: Corregís debilidades, Afrontás amenazas, Mantenés fortalezas y Explotás oportunidades. Esas acciones se ejecutan con OKRs (objetivos medibles). Y cerramos con el juicio contra Meta, que compró Instagram y WhatsApp para que nadie pudiera hacerle sombra.",
        keyPoints: [
          "En la economía digital, la competencia por el tiempo y la atención hace que los competidores indirectos sean tan peligrosos como los directos.",
          "La Matriz VRIO (Jay Barney) valida si una fortaleza es una verdadera Ventaja Competitiva Sostenible (Valor, Rareza, Inimitabilidad, Organización).",
          "La Matriz CAME operacionaliza el FODA: Corregir debilidades, Afrontar amenazas, Mantener fortalezas y Explotar oportunidades.",
          "Los OKRs (John Doerr) traducen las estrategias CAME en metas cualitativas inspiradoras y resultados clave cuantitativos medibles.",
          "El juicio a Meta plantea la frontera entre el crecimiento legítimo mediante fusiones y el estrangulamiento monopólico de rivales.",
        ],
        definitions: [
          { term: "Matriz VRIO (Jay Barney)", definition: "Marco de análisis interno de recursos que evalúa su Valor, Rareza, Inimitabilidad y Organización para determinar el tipo de ventaja competitiva." },
          { term: "Matriz CAME", definition: "Herramienta de formulación estratégica que traduce el diagnóstico FODA en cuatro tipos de planes: Corregir, Afrontar, Mantener y Explotar." },
          { term: "OKRs (Objectives and Key Results)", definition: "Metodología de gestión estratégica y alineación de equipos creada por Andy Grove y popularizada por John Doerr en Google." },
          { term: "Monopolio en Plataformas Digitales", definition: "Concentración dominante de mercado donde una empresa controla las redes, datos y canales esenciales bloqueando la entrada de rivales." },
        ],
        examples: [
          { title: "El algoritmo de TikTok bajo la Matriz VRIO", description: "El algoritmo de recomendación de TikTok es Valioso (retiene horas), Raro (los rivales tardaron años en acercarse), muy difícil de Imitar (por la cantidad de señales de micro-conducta procesadas) y Organizado (toda la empresa optimiza sobre él) -> Ventaja Competitiva Sostenible." },
          { title: "Competencia Indirecta entre Netflix y Epic Games", description: "El CEO de Netflix declaró que su mayor competidor no era HBO ni Disney, sino el videojuego Fortnite, porque competía por las mismas horas de ocio nocturno de los usuarios." },
        ],
        commonMistakes: [
          { mistake: "Confundir un Resultado Clave (KR) con una tarea de la lista To-Do", explanation: "Un KR mide un impacto o resultado cuantitativo alcanzado (ej. 'aumentar retención a 40%'), nunca una simple actividad (ej. 'rediseñar el botón azul')." },
          { mistake: "Hacer un FODA y no construir la Matriz CAME", explanation: "Quedarse con la lista de fortalezas y debilidades sin definir si se va a Corregir, Afrontar, Mantener o Explotar deja a la empresa paralizada en el diagnóstico sin plan de acción." },
        ],
      },
      topics: [
        {
          name: "Unidad 4 · Análisis de Competencia Digital (Directa vs. Indirecta) y Matriz VRIO",
          description: "Economía de la atención, competidores directos vs indirectos y el test VRIO de Jay Barney.",
          importance: "critical",
          masteryScore: 68,
          flashcards: [
            {
              front: "¿Cuál es la diferencia entre Competidores Directos y Competidores Indirectos en la industria digital?",
              back: "Los directos ofrecen el mismo producto para la misma necesidad (ej. Netflix vs Disney+). Los indirectos ofrecen productos distintos pero compiten por el mismo recurso crítico escaso: el tiempo y la atención del usuario (ej. Netflix vs TikTok o videojuegos como Fortnite).",
              difficulty: "medium",
            },
            {
              front: "¿Qué 4 preguntas consecutivas plantea la Matriz VRIO de Jay Barney para validar una fortaleza?",
              back: "1. ¿Es Valioso (V)?\n2. ¿Es Raro (R)?\n3. ¿Es difícil o costoso de Imitar (I)?\n4. ¿La empresa está Organizada para explotarlo (O)?\nSi cumple las 4, constituye una Ventaja Competitiva Sostenible.",
              difficulty: "critical",
            },
          ],
          questions: [
            {
              question: "Si una empresa de inteligencia artificial cuenta con un algoritmo que genera ingresos (Valioso) y pocos lo tienen (Raro), pero cualquier competidor puede copiarlo en 3 semanas con software libre de código abierto (no es difícil de imitar), ¿qué tipo de ventaja competitiva posee según el modelo VRIO?",
              options: [
                "Ventaja Competitiva Temporal",
                "Ventaja Competitiva Sostenible",
                "Desventaja Competitiva Absoluta",
                "Paridad Competitiva",
              ],
              answer: "Ventaja Competitiva Temporal",
              explanation: "Al no ser inimitable, la ventaja se disuelve rápidamente en cuanto los competidores replican el algoritmo en el mercado.",
              difficulty: "medium",
            },
          ],
        },
        {
          name: "Unidad 4 · Matriz CAME y Alineación Estratégica con OKRs (John Doerr)",
          description: "Corregir, Afrontar, Mantener y Explotar; formulación de Objetivos y Resultados Clave.",
          importance: "critical",
          masteryScore: 70,
          flashcards: [
            {
              front: "¿Qué significan las siglas de la Matriz CAME y cuál es su vínculo con el FODA?",
              back: "Corregir Debilidades (reorientación), Afrontar Amenazas (supervivencia), Mantener Fortalezas (defensiva) y Explotar Oportunidades (ofensiva). Es la herramienta que transforma el diagnóstico estático del FODA en un plan de acción concreto.",
              difficulty: "medium",
            },
            {
              front: "¿Qué componentes integran la metodología OKR de John Doerr y cuál es su regla de oro?",
              back: "Se compone de Objetivos cualitativos e inspiradores (hacia dónde vamos) y Resultados Clave (KRs) cuantitativos y numéricos (cómo sabemos si llegamos). La regla de oro es que los KRs deben medir resultados de impacto, no simples tareas.",
              difficulty: "medium",
            },
          ],
          questions: [
            {
              question: "En la Matriz CAME, cuando una empresa digital detecta una 'Oportunidad' de mercado en la adopción de pagos cripto y moviliza sus recursos para liderar ese nicho rápidamente, está ejecutando una estrategia de:",
              options: [
                "Explotar (Estrategia Ofensiva)",
                "Afrontar (Estrategia de Supervivencia)",
                "Corregir (Estrategia de Reorientación)",
                "Mantener (Estrategia Pasiva)",
              ],
              answer: "Explotar (Estrategia Ofensiva)",
              explanation: "El cruce de Fortalezas con Oportunidades impulsa la acción de 'Explotar' mediante una postura ofensiva de conquista de mercado.",
              difficulty: "easy",
            },
          ],
        },
        {
          name: "Unidad 4 · Competencia y Monopolio en Big Tech (Caso Antimonopolio Meta)",
          description: "Adquisición de rivales emergentes (Instagram, WhatsApp) y debate sobre poder de mercado y datos.",
          importance: "high",
          masteryScore: 74,
          flashcards: [
            {
              front: "¿Cuál es el eje central de la demanda antimonopolio impulsada por la FTC contra Meta debatida en la Clase 4?",
              back: "Que Meta ejecutó una estrategia deliberada de 'comprar o enterrar' competidores emergentes, adquiriendo Instagram y WhatsApp para neutralizar amenazas existenciales a su monopolio en redes sociales y publicidad digital.",
              difficulty: "medium",
            },
          ],
          questions: [
            {
              question: "¿Cuál fue el argumento central presentado por la defensa de Meta en el juicio antimonopolio frente a las acusaciones de sofocar la competencia?",
              options: [
                "Que Meta nunca cobró un solo dólar a ningún usuario por utilizar Facebook.",
                "Que las adquisiciones de Instagram y WhatsApp fueron aprobadas formalmente por las autoridades en su momento y que compite activamente contra rivales masivos como TikTok, YouTube y Apple.",
                "Que las redes sociales no forman parte de la economía digital.",
                "Que Instagram no tiene servidores informáticos propios.",
              ],
              answer: "Que las adquisiciones de Instagram y WhatsApp fueron aprobadas formalmente por las autoridades en su momento y que compite activamente contra rivales masivos como TikTok, YouTube y Apple.",
              explanation: "La defensa de Meta sostiene que el mercado es dinámico y multipolar con la irrupción de TikTok, y que sus inversiones potenciaron los servicios adquiridos.",
              difficulty: "easy",
            },
          ],
        },
      ],
    },
  ];

  // 3. Limpiar tópicos, flashcards y questions previos de la materia para garantizar consistencia con las diapositivas oficiales
  console.log("\n🧹 Sincronizando tópicos, flashcards y preguntas para Administración de Negocios Digitales...");
  await prisma.flashcard.deleteMany({ where: { subjectId: subject.id } });
  await prisma.question.deleteMany({ where: { subjectId: subject.id } });
  await prisma.topic.deleteMany({ where: { subjectId: subject.id } });

  const allCreatedTopics: any[] = [];

  // 4. Procesar cada una de las 4 clases
  for (const cData of classesToProcess) {
    const classSession = classMap.get(cData.classNumber);
    if (!classSession) {
      console.warn(`⚠️ No se encontró la sesión de clase ${cData.classNumber}`);
      continue;
    }

    console.log(`\n📦 Procesando Clase ${cData.classNumber}: ${cData.fileName}...`);
    const filePath = path.join(baseDir, cData.fileName);

    if (!fs.existsSync(filePath)) {
      console.error(`❌ Archivo físico no encontrado: ${filePath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileSize = fs.statSync(filePath).size;
    const doc = await extractTextFromBuffer(fileBuffer);

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
          fileName: cData.fileName,
          fileSize,
          storagePath: cData.relativeStoragePath,
          extractedText: doc.text || material.extractedText,
          processingStatus: "completed",
        },
      });
      console.log(`  🔄 Material actualizado: ${material.id}`);
    } else {
      material = await prisma.material.create({
        data: {
          subjectId: subject.id,
          classId: classSession.id,
          fileName: cData.fileName,
          fileType: "application/pdf",
          fileSize,
          storagePath: cData.relativeStoragePath,
          extractedText: doc.text,
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
      title: cData.summary.title,
      overview: cData.summary.overview,
      detailedSummary: cData.summary.detailedSummary,
      simplifiedExplanation: cData.summary.simplifiedExplanation,
      keyPointsJson: JSON.stringify(cData.summary.keyPoints),
      definitionsJson: JSON.stringify(cData.summary.definitions),
      examplesJson: JSON.stringify(cData.summary.examples),
      commonMistakesJson: JSON.stringify(cData.summary.commonMistakes),
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
        title: cData.classTitle,
        notes: `Material de cátedra: ${cData.fileName}.\nResumen estructurado y flashcards disponibles para estudio.`,
        attendanceStatus: "attended",
      },
    });

    // Crear Topics, Flashcards y Questions
    for (const t of cData.topics) {
      const topic = await prisma.topic.create({
        data: {
          subjectId: subject.id,
          classId: classSession.id,
          name: t.name,
          description: t.description,
          importance: t.importance,
          masteryScore: t.masteryScore,
        },
      });

      allCreatedTopics.push(topic);
      console.log(`  📌 [${cData.unit}] Tópico creado: ${topic.name}`);

      for (const fc of t.flashcards) {
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

      for (const q of t.questions) {
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
  }

  // 5. Vincular tópicos y plan de preparación para la 'Evaluación Parcial 1 Presencial' (Unidades 1 a 4)
  const exam = subject.exams.find((e) => e.title.includes("Parcial 1") || e.examType === "midterm");
  if (exam) {
    console.log(`\n🎯 Vinculando ${allCreatedTopics.length} tópicos a ${exam.title}...`);
    await prisma.examTopic.deleteMany({ where: { examId: exam.id } });

    for (const t of allCreatedTopics) {
      await prisma.examTopic.create({
        data: {
          examId: exam.id,
          topicId: t.id,
        },
      });
    }

    // Actualizar Plan de Preparación Oficial por Unidades (Unidades 1 a 4)
    await prisma.preparationPlanItem.deleteMany({ where: { examId: exam.id } });

    const planSteps = [
      {
        order: 1,
        title: "Unidad 1: Efecto Precio Cero (Ariely), Modelos Asimétricos y Plataformas (Clase 1)",
        description: "Repasar economía conductual, trufas Lindt vs Hershey, productos complementarios (Amazon vs Netflix) y efectos de red.",
        scheduledDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      },
      {
        order: 2,
        title: "Unidad 2: Planificación Estratégica Digital y 10 Pasos de Gartner (Clase 2)",
        description: "Estudiar el framework de Gartner para plataformas, Dynamic Value-Driven Funding, APIs y formulación de objetivos SMART.",
        scheduledDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      },
      {
        order: 3,
        title: "Unidad 3: Entornos VUCA a BANI (Jamais Cascio) y Análisis PESTLE (Clase 3)",
        description: "Fijar respuestas a la fragilidad, ansiedad y no linealidad, junto a los 6 factores PESTLE del caso Airbnb en Argentina.",
        scheduledDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      },
      {
        order: 4,
        title: "Unidad 4: Competencia Digital, Matriz VRIO, CAME y OKRs (Clase 4)",
        description: "Dominar el test VRIO de Jay Barney, la Matriz CAME, la metodología OKR de John Doerr y el caso antimonopolio contra Meta.",
        scheduledDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
      },
      {
        order: 5,
        title: "Simulacro General de Parcial 1 Presencial: Unidades 1 a 4 Integradas",
        description: "Resolver cuestionario de examen cronometrado con preguntas oficiales de cátedra.",
        scheduledDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
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

    console.log("✅ Plan de preparación del Parcial 1 por Unidades 1 a 4 registrado.");
  }

  console.log("\n🎉 ¡Ingesta de Administración de Negocios Digitales completada exitosamente!");
}

main()
  .catch((e) => {
    console.error("Error en la ingesta:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
