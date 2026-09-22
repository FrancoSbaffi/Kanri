import prisma from "../lib/db/prisma";
import fs from "fs";
import path from "path";
import { extractTextFromBuffer } from "../lib/pdf/extractor";

async function main() {
  console.log("🚀 Iniciando ingesta de Clases 5 y 6 para Taller de Emprendedurismo en Innovación Digital...");

  // 1. Obtener la materia
  const subject = await prisma.subject.findFirst({
    where: { name: { contains: "Emprendedurismo" } },
    include: {
      classes: { orderBy: { classNumber: "asc" } },
      topics: true,
    },
  });

  if (!subject) {
    throw new Error("No se encontró la materia Taller de Emprendedurismo");
  }

  console.log(`✅ Materia encontrada: ${subject.name} (${subject.id})`);
  const classMap = new Map(subject.classes.map((c) => [c.classNumber, c]));

  // 2. Localizar archivos en uploads/materials/taller_emprededurismo/
  const tallerDir = path.join(process.cwd(), "uploads/materials/taller_emprededurismo");
  const dirFiles = fs.readdirSync(tallerDir);

  const mktFile = dirFiles.find((f) => f.includes("Clase II MKT") || f.includes("MKT - Q1"));
  const notaFile = dirFiles.find((f) => f.startsWith("Nota") && f.includes("Unidad 4"));

  if (!mktFile) throw new Error("No se encontró el archivo de Clase II MKT");
  if (!notaFile) throw new Error("No se encontró el archivo de Nota Técnica Unidad 4");

  console.log(`📄 Archivo Clase 5 detectado: ${mktFile}`);
  console.log(`📄 Archivo Clase 6 detectado: ${notaFile}`);

  // 3. Estructura de contenidos académicos para las dos nuevas clases
  const newClassesData = [
    {
      classNumber: 5,
      fileName: mktFile,
      classTitle: "Clase 05: Unidad 3: Estrategias de Pricing, Valor Económico Real (VER), WTP y Métricas Clave para Startups",
      summary: {
        title: "Resumen Académico · Clase 05: Estrategias de Pricing, Valor Económico Real (VER), WTP y Métricas de Rendimiento para Startups",
        overview:
          "En la Clase 05 del Taller de Emprendedurismo en Innovación Digital se profundiza en la dimensión económica del Marketing Mix (la 'P' de Precio) y el tablero de métricas esenciales para la gestión de startups. Se contrastan las tres filosofías de fijación de precios: Basado en Costos, Basado en la Competencia y Basado en Valor al Cliente (Value Pricing). Se desarrolla el modelado del Valor Económico Real (VER) frente al Valor Percibido / Disposición a Pagar (WTP - Willingness to Pay) mediante casos prácticos B2B de sistemas IoT. Asimismo, se articulan las métricas críticas del negocio divididas en cuatro categorías estratégicas: Rentabilidad (Margen Bruto, Margen de Contribución y Break-Even), Subsistencia (Burn Rate, Runway, Churn Rate y Retention Rate), Crecimiento (MoM, MRR y ARR) y Eficiencia del Cliente (CAC, Customer Lifetime Value y el ratio óptimo LTV/CAC ≥ 3x), cerrando con el principio de control y mejora de Peter Drucker.",
        detailedSummary: `### 1. Comparativa de Estrategias de Fijación de Precios (Pricing)
La cátedra clasifica tres metodologías fundamentales para fijar precios, señalando sus fortalezas y vulnerabilidades:

| Estrategia | Ventajas | Desventajas | Cuándo Utilizarla |
| :--- | :--- | :--- | :--- |
| **Basado en Costos** | • Sencillo de calcular.<br>• Sobrevive bien en instancias de planificación presupuestaria inicial. | • **Ignora las condiciones del mercado**.<br>• Desconectado de la propuesta de valor y del cliente.<br>• Los costos son dinámicos y cambiantes. | Etapas embrionarias o productos genéricos (commodities). |
| **Basado en la Competencia** | • Captura la realidad y las tarifas del mercado.<br>• Fácilmente contrastable. | • Puede desencadenar una destructiva **guerra de precios**.<br>• Deja expuesta a la empresa a las estrategias del rival.<br>• No reconoce el valor diferencial propio. | Mercados maduros y altamente disputados. |
| **Basado en Valor al Cliente (*Value Pricing*)** | • **Enfocado en el valor percibido por el cliente**.<br>• Permite cobrar precios más altos a quienes perciben mayor valor y ajustar a quienes perciben menor valor.<br>• Maximiza la captura de excedente del consumidor. | • Dificultad para medir e identificar el valor percibido.<br>• Exige mayor investigación de mercado y recursos analíticos.<br>• Implementación compleja. | **Recomendada para startups y productos digitales innovadores**. |

---

### 2. Cálculo del Precio a partir del Margen Deseado (Basado en Costos)
Cuando se fija el precio por margen de rentabilidad sobre el costo de ventas, se aplica la fórmula canónica:

$$\\text{Precio} = \\frac{\\text{Costo de Ventas}}{1 - \\%\\text{Margen}}$$

#### Caso de Aplicación Numérica (Cátedra):
- **Datos**: Costo de Ventas = $ 74.400.- | Margen Bruto deseado = 38% (0,38).
- **Cálculo**:
  $$\\text{Precio} = \\frac{74.400}{1 - 0,38} = \\frac{74.400}{0,62} = \\mathbf{\\$ 120.000.-}$$
- **Comprobación**:
  - Costo de Ventas: $ 74.400.-
  - Margen Bruto ($): $ 120.000 - $ 74.400 = $ 45.600.-
  - Margen Bruto (%): $(45.600 / 120.000) \\times 100 = \\mathbf{38\\%}$.

---

### 3. Pricing Basado en Valor: Valor Económico Real (VER) vs. Disposición a Pagar (WTP)
El punto de partida del *Value Pricing* reside en dos constructos:
- **Valor Económico Real (VER)**: El valor objetivo que el producto proporciona al cliente en comparación con la mejor alternativa de la competencia (precio del competidor + ahorros demostrables en costos de mantenimiento, eficiencia energética o mayor durabilidad).
- **Valor Percibido o Disposición a Pagar (WTP - *Willingness To Pay*)**: Lo que el cliente cree que vale el producto en función de su percepción, confianza y evaluación subjetiva del riesgo.

> **Análisis del Caso B2B (IoT para Sistema de Refrigeración Industrial)**:
> - Precio del competidor tradicional: **$ 75.000.-**
> - Ahorros operativos netos demostrables por IoT: **$ 6.500.-**
> - **Valor Económico Real (VER)** = $ 75.000 + $ 6.500 = **$ 81.500.-**
> - *Indiferencia*: Un cliente racional y 100% informado es indiferente entre pagar $ 75.000 al competidor o $ 81.500 por la solución IoT.
> - **Ajuste por Riesgo (WTP)**: Si el cliente percibe una probabilidad de falla del 5%, descontará esa prima de riesgo, situando su WTP por debajo del VER teórico.
> - **Rango Estratégico de Precio**: Suponiendo un Costo de Ventas de **$ 50.000.-**, el precio debe fijarse en el intervalo:
>   $$\\text{Costo de Ventas (\\$ 50.000)} < \\text{Precio Fijado} \\le \\text{WTP del Cliente}$$
>   *(Fijar por debajo de $50.000 destruye margen; fijar por encima de WTP impide la venta)*.

---

### 4. Cuadro de Mando Integral de Métricas para Startups
La cátedra divide las métricas de gestión en cuatro categorías esenciales:

\`\`\`mermaid
graph TD
    M[Métricas Clave de la Startup] --> R[1. Métricas de Rentabilidad]
    M --> S[2. Métricas de Subsistencia / Supervivencia]
    M --> C[3. Métricas de Crecimiento]
    M --> E[4. Métricas de Eficiencia / Rendimiento]

    R --> R1[Margen Bruto %]
    R --> R2[Margen de Contribución %]
    R --> R3[Break-Even en Q y $]

    S --> S1[Burn Rate mensual]
    S --> S2[Runway en meses]
    S --> S3[Churn Rate vs Retention Rate]

    C --> C1[Usuarios Activos DAU/MAU]
    C --> C2[MoM % crecimiento mensual]
    C --> C3[MRR y ARR]

    E --> E1[CAC Costo Adquisición]
    E --> E2[LTV / CLV Valor de Vida]
    E --> E3[Ratio LTV / CAC >= 3x]
\`\`\`

#### 4.1 Métricas de Rentabilidad
1. **Margen Bruto (%)**:
   $$\\text{Margen Bruto (\\%)} = \\left( \\frac{\\text{Ingresos} - \\text{Costo de Ventas}}{\\text{Ingresos}} \\right) \\times 100$$
   *Nota*: El Costo de Ventas incluye costos variables y fijos de producción.
2. **Margen de Contribución Unitario (%)**:
   $$\\text{Margen de Contribución (\\%)} = \\left( \\frac{\\text{Precio} - \\text{Costo Variable Unitario}}{\\text{Precio}} \\right) \\times 100$$
   *Nota*: El Costo Variable incluye costos variables de producción y comercialización (comisiones, pasarelas de pago, envíos).
3. **Punto de Equilibrio (Break-Even)**:
   - **En volumen (Unidades Q)**:
     $$\\text{Break-Even (Q)} = \\frac{\\text{Costos Fijos Totales (\\$)}}{\\text{Contribución Marginal Unitaria (\\$)}}$$
   - **En facturación monetaria ($)**:
     $$\\text{Break-Even (\\$)} = \\frac{\\text{Costos Fijos Totales (\\$)}}{\\text{Contribución Marginal (\\%)}}$$

---

#### 4.2 Métricas de Subsistencia (Supervivencia Financiera)
- **Burn Rate ($ mensual)**: Cuánto dinero líquido "quema" la empresa por mes en operaciones.
  $$\\text{Burn Rate} = \\text{Saldo de Caja Inicial} - \\text{Saldo de Caja del Mes Actual}$$
- **Runway (Cantidad de meses)**: Tiempo que tiene la startup antes de quedarse sin efectivo al ritmo actual de gasto:
  $$\\text{Runway (meses)} = \\frac{\\text{Caja Actual Disponible}}{\\text{Burn Rate Mensual}}$$
- **Churn Rate (% mensual de abandono de clientes)**:
  $$\\text{Churn Rate} = \\left( \\frac{\\text{\\# Clientes perdidos durante el mes}}{\\text{\\# Clientes al inicio del mes}} \\right) \\times 100$$
- **Retention Rate (% de retención)**:
  $$\\text{Retention Rate} = \\left( \\frac{\\text{Clientes al final del mes} - \\text{Nuevos clientes adquiridos}}{\\text{Clientes al inicio del mes}} \\right) \\times 100$$
  *Relación matemática directa*: A mayor Churn Rate, menor Retention Rate (son caras opuestas de la misma moneda).

---

#### 4.3 Métricas de Crecimiento
- **Usuarios Activos**: Volumen de usuarios que interactúan activamente en un período determinado (DAU diario / MAU mensual).
- **Month on Month (MoM %)**: Crecimiento porcentual de un mes respecto al mes inmediato anterior en usuarios, clientes o facturación.
- **Monthly Recurring Revenue (MRR)**: Total de ingresos recurrentes contratados en un mes particular:
  $$\\text{MRR} = \\text{\\$ Tarifa mensual de suscripción} \\times \\text{\\# Clientes activos}$$
- **Annual Recurring Revenue (ARR)**: Anualización de los ingresos recurrentes (asumiendo churn cero):
  $$\\text{ARR} = \\text{MRR} \\times 12$$

---

#### 4.4 Métricas de Eficiencia del Cliente (Unit Economics)
1. **CAC (Customer Acquisition Cost)**:
   $$\\text{CAC} = \\frac{\\text{Costo Total de Adquisición de Nuevos Clientes}}{\\text{Número de Nuevos Clientes Adquiridos}}$$
   *Incluye*: Marketing digital (pauta publicitaria), ventas, pruebas gratuitas, descuentos iniciales y comisiones de referidos.
   *Excluye taxativamente*: Gastos de retención y fidelización de clientes existentes.
2. **Tiempo de Vida del Cliente en Meses (Lifetime)**:
   $$\\text{Vida Media del Cliente (meses)} = \\frac{1}{\\text{\\% Churn Rate mensual}}$$
   *(Por ejemplo, un Churn del 5% mensual (0,05) implica un tiempo de vida promedio de 20 meses)*.
3. **Customer Lifetime Value (CLV / LTV)**:
   $$\\text{LTV} = \\text{Margen de Contribución mensual por cliente} \\times \\text{Vida Media del cliente (meses)}$$
4. **La Regla de Oro del Ratio LTV / CAC**:
   - En teoría, una empresa podría tolerar un CAC igual al LTV (ratio 1:1), pero esto no dejaría excedente para absorber los costos fijos ni la estructura operativa.
   - **Estándar de la industria**: Para una startup en etapa temprana (*early stage*), se considera saludable un ratio:
     $$\\mathbf{\\frac{\\text{LTV}}{\\text{CAC}} \\ge 3\\times}$$
     *(Cada dólar invertido en adquisición debe generar al menos tres dólares de margen de contribución durante la vida útil del cliente)*.

---

### 5. El Principio Rector de Peter Drucker
La clase concluye con el axioma de gestión fundamental para todo fundador tecnológico:
> *"Lo que no se puede medir no se puede controlar; lo que no se puede controlar no se puede gestionar; lo que no se puede gestionar no se puede mejorar."* — **Peter Drucker**`,
        simplifiedExplanation:
          "En esta clase aprendés a ponerle precio a tu producto y a medir si tu negocio vive o muere. Para poner precio, no mires solo lo que te cuesta fabricarlo: mirá cuánto valor le ahorrás o le generás a tu cliente (Value Pricing y WTP). Y para saber si tu startup es viable, tenés que mirar los números clave: el Burn Rate (cuánta plata quemás por mes), el Runway (cuántos meses de vida te quedan antes de fundirte), el Churn (cuántos clientes se te van), y la regla sagrada del Unit Economics: lo que te deja un cliente a lo largo de su vida (LTV) tiene que ser por lo menos el triple de lo que te costó conseguirlo (CAC >= 3x).",
        keyPoints: [
          "El Value Pricing es superior a fijar precios por costos o por competencia porque captura el valor diferencial y maximiza la rentabilidad.",
          "Fórmula de precio por margen de costo: Precio = Costo de Ventas / (1 - % Margen). Con costo $74.400 y margen 38%, el precio es $120.000.",
          "El Valor Económico Real (VER) suma el precio del competidor más los ahorros operativos netos. El WTP descuenta la prima por riesgo de falla.",
          "El rango estratégico de precios debe ubicarse estrictamente entre el Costo de Ventas y la Disposición a Pagar (WTP).",
          "Burn Rate es la pérdida mensual de caja y Runway es la cantidad de meses de supervivencia restante (Caja Actual / Burn Rate).",
          "CAC incluye exclusivamente gastos orientados a captar nuevos usuarios (marketing, ventas, demos); no incluye retención de clientes.",
          "Tiempo de vida promedio del cliente = 1 / Churn Rate mensual.",
          "El ratio objetivo de salud financiera para una startup temprana es LTV / CAC ≥ 3x.",
        ],
        definitions: [
          { term: "Value Pricing", definition: "Estrategia de precios basada en el valor que el cliente percibe de la solución, maximizando la captura de excedente económico sin limitarse a los costos." },
          { term: "Valor Económico Real (VER)", definition: "Valor objetivo de un producto frente a la mejor alternativa del mercado, equivalente al precio del competidor más los beneficios económicos y ahorros cuantificables." },
          { term: "WTP (Willingness to Pay)", definition: "Disposición a pagar del cliente; precio máximo que está dispuesto a desembolsar según su percepción subjetiva del valor y del riesgo." },
          { term: "Burn Rate", definition: "Ritmo mensual de consumo neto de caja que experimenta una startup durante su etapa deficitaria de crecimiento." },
          { term: "Runway", definition: "Cantidad de meses de autonomía operativa que le quedan a una startup antes de agotar su saldo de efectivo disponible al ritmo del Burn Rate actual." },
          { term: "Churn Rate", definition: "Porcentaje de clientes o suscriptores que cancelan o abandonan el servicio en un período de tiempo mensual determinado." },
          { term: "CAC (Customer Acquisition Cost)", definition: "Costo unitario promedio incurrido en ventas y marketing para conseguir un nuevo cliente." },
          { term: "LTV (Lifetime Value)", definition: "Margen de contribución monetario acumulado que un cliente genera a lo largo de toda su relación comercial con la empresa." },
        ],
        examples: [
          { title: "Cálculo de Precio por Margen", description: "Con un costo de ventas de $74.400 y un margen deseado del 38%, el precio es $74.400 / 0.62 = $120.000. El margen en pesos es de $45.600." },
          { title: "Caso B2B IoT de Refrigeración", description: "Competidor cobra $75.000. El sistema IoT ahorra $6.500 de energía y mermas. El VER es $81.500. Con costo de $50.000, el precio óptimo se fija entre $50.000 y el WTP del cliente." },
          { title: "Cálculo de Runway", description: "Una startup tiene $1.200.000 en el banco y su Burn Rate es de $300.000 mensuales. Su Runway es de 4 meses antes de necesitar otra ronda o alcanzar el punto de equilibrio." },
          { title: "Ratio LTV/CAC Saludable", description: "Si adquirir un cliente cuesta $100 (CAC) y el cliente genera un LTV de $350 gracias a una retención prolongada, el ratio es 3.5x, superando el umbral de 3x exigido para una startup sana." },
        ],
        commonMistakes: [
          { mistake: "Confundir Margen con Markup", explanation: "Calcular el precio multiplicando el costo por (1 + %) en vez de dividir por (1 - %), lo cual produce un margen bruto real significativamente menor al proyectado." },
          { mistake: "Incluir gastos de retención en el CAC", explanation: "El CAC mide el esfuerzo de captar nuevos usuarios. Incluir promociones a clientes actuales distorsiona el costo de adquisición unitario." },
          { mistake: "Operar con un ratio LTV/CAC cercano a 1", explanation: "Si el LTV apenas iguala al CAC (1:1), la empresa no tiene margen para absorber costos fijos, desarrollo de producto ni estructura, condenándola a la quiebra." },
        ],
      },
      topics: [
        { name: "Estrategias de Pricing: Costos, Competencia y Value Pricing", description: "Metodologías de fijación de tarifas, ventajas, desventajas y cálculo a partir del margen deseado.", importance: "critical" },
        { name: "Valor Económico Real (VER) y Disposición a Pagar (WTP)", description: "Cálculo de VER en entornos B2B, prima de riesgo y banda estratégica de fijación entre costo y WTP.", importance: "high" },
        { name: "Métricas de Rentabilidad y Break-Even (Punto de Equilibrio)", description: "Margen bruto, margen de contribución y fórmulas de punto de equilibrio en unidades y en pesos.", importance: "high" },
        { name: "Métricas de Subsistencia: Burn Rate, Runway, Churn y Retention Rate", description: "Indicadores de supervivencia de caja y tasas de retención vs. deserción de usuarios.", importance: "critical" },
        { name: "Unit Economics y Rendimiento: CAC, LTV, MRR, ARR y Ratio 3x", description: "Eficiencia de captación, valor de ciclo de vida del cliente y el umbral de viabilidad económica LTV/CAC ≥ 3x.", importance: "critical" },
      ],
      flashcards: [
        { front: "¿Cuál es la fórmula para calcular el precio a partir del margen deseado basado en costos?", back: "Precio = Costo de Ventas / (1 - % Margen). Ejemplo: $74.400 / (1 - 0.38) = $120.000.", difficulty: "medium" },
        { front: "¿Qué es el Valor Económico Real (VER) en la estrategia de Value Pricing?", back: "Es el valor objetivo del producto, igual al precio de la alternativa del competidor más el valor de los ahorros o beneficios económicos netos cuantificables.", difficulty: "medium" },
        { front: "¿Entre qué valores debe situarse el rango estratégico de fijación de precios en Value Pricing?", back: "Entre el Costo de Ventas (piso mínimo para no perder dinero) y la Disposición a Pagar / WTP del cliente (techo máximo).", difficulty: "easy" },
        { front: "¿Qué representa el Burn Rate y cómo se vincula con el Runway de una startup?", back: "Burn Rate es el dinero líquido que la empresa pierde por mes (Caja Inicial - Caja Actual). El Runway es la cantidad de meses de vida que le quedan antes de agotar la caja: Caja Actual / Burn Rate.", difficulty: "easy" },
        { front: "¿Cómo se calcula el tiempo de vida (Lifetime en meses) de un cliente a partir del Churn Rate?", back: "Tiempo de vida en meses = 1 / (% Churn Rate mensual). Por ejemplo, con 5% de churn (0.05), la vida media es de 20 meses.", difficulty: "medium" },
        { front: "¿Qué gastos NO deben incluirse en el cálculo del CAC (Customer Acquisition Cost)?", back: "Los gastos de retención, fidelización y estímulo de uso de clientes existentes. Solo se incluyen los costos directos de atraer y convertir clientes nuevos.", difficulty: "medium" },
        { front: "¿Cuál es el ratio objetivo saludable entre LTV y CAC para una startup en etapa temprana?", back: "Un ratio LTV / CAC de al menos 3x (3 a 1). Si LTV = CAC, la empresa no cubre sus costos fijos y quiebra.", difficulty: "easy" },
        { front: "¿Cómo se relacionan matemáticamente el MRR y el ARR?", back: "ARR (Annual Recurring Revenue) = MRR (Monthly Recurring Revenue) × 12.", difficulty: "easy" },
      ],
      questions: [
        {
          question: "Una startup tiene un Costo de Ventas de $74.400 y su equipo directivo exige un Margen Bruto del 38%. ¿Cuál debe ser el precio de venta al público según la metodología basada en margen?",
          options: ["$ 102.672.-", "$ 120.000.-", "$ 115.000.-", "$ 140.000.-"],
          answer: "$ 120.000.-",
          explanation: "La fórmula es Precio = Costo de Ventas / (1 - % Margen) = $ 74.400 / (1 - 0.38) = $ 74.400 / 0.62 = $ 120.000. Comprobación: Margen en pesos = $ 45.600, que sobre $ 120.000 representa exactamente el 38%.",
          difficulty: "medium",
          type: "multiple_choice",
        },
        {
          question: "Si una startup tecnológica dispone de una caja bancaria de $ 1.500.000 y presenta un Burn Rate mensual constante de $ 250.000, ¿cuál es su Runway?",
          options: ["3 meses", "6 meses", "12 meses", "18 meses"],
          answer: "6 meses",
          explanation: "Runway = Caja Actual / Burn Rate = $ 1.500.000 / $ 250.000 = 6 meses de supervivencia antes de quedarse sin efectivo.",
          difficulty: "easy",
          type: "multiple_choice",
        },
        {
          question: "¿Por qué se exige un ratio LTV / CAC de al menos 3x para validar la viabilidad económica de una startup?",
          options: ["Porque los inversores se quedan con el 66% de la empresa en la primera ronda", "Porque un ratio 1:1 apenas cubre el costo de adquisición sin dejar excedente para cubrir los costos fijos y de producto", "Porque la ley de emprendedores impone un límite de rentabilidad del 300%", "Porque el Churn Rate mensual siempre triplica al CAC"],
          answer: "Porque un ratio 1:1 apenas cubre el costo de adquisición sin dejar excedente para cubrir los costos fijos y de producto",
          explanation: "Si el CAC es igual al LTV (1:1), cada cliente nuevo apenas repaga el marketing de su propia captura, impidiendo absorber salarios, servidores, desarrollo y costos fijos de la compañía.",
          difficulty: "medium",
          type: "multiple_choice",
        },
        {
          question: "¿Cuál de los siguientes rubros DEBE EXCLUIRSE estrictamente del cálculo del Customer Acquisition Cost (CAC)?",
          options: ["Pauta publicitaria en Google Ads y Meta Ads", "Comisiones por ventas de nuevos clientes", "Campañas de fidelización y promociones enviadas a clientes ya activos", "Descuentos aplicados en la primera compra de prueba"],
          answer: "Campañas de fidelización y promociones enviadas a clientes ya activos",
          explanation: "El CAC mide única y exclusivamente los costos de atraer y convertir clientes nuevos. Los esfuerzos de retención y fidelización de la cartera existente no forman parte del CAC.",
          difficulty: "medium",
          type: "multiple_choice",
        },
      ],
    },
    {
      classNumber: 6,
      fileName: notaFile,
      classTitle: "Clase 06: Unidad 4: Desarrollo de Productos Digitales, Cascada vs Agile, Scrum, Kanban, Lean Startup (MVP) y Design Thinking",
      summary: {
        title: "Resumen Académico · Clase 06: Nota Técnica Unidad 4 — Desarrollo de Productos Digitales (Cascada vs. Agile, Scrum, Kanban, MVP y Design Thinking)",
        overview:
          "Esta sesión sintetiza el material de estudio principal de la Unidad 4 elaborado por la cátedra (Cottini, Foricher, Moneda y Rshaid): la Nota Técnica sobre Desarrollo de Productos Digitales. Constituye el puente decisivo entre la validación de la idea (Canvas y Marketing Mix de las Unidades 1 a 3) y la proyección del flujo de fondos y cálculo del VAN (Unidad 5). Se estructura en cinco partes orgánicas: 1) Cascada vs. Agile, analizando la incertidumbre mediante la Matriz de Stacey y la Curva de Boehm; 2) Metodologías Ágiles: arquitectura formal de Scrum (3 pilares, 5 valores, 3 roles, 5 eventos y 3 artefactos) y el flujo continuo de Kanban (límites de WIP, Lead Time vs. Cycle Time); 3) El Producto Mínimo Viable (Lean Startup), su concepción no degradada (el skateboard de Kniberg), la formulación de hipótesis falsables, los 5 tipos de MVP y las métricas piratas AARRR; 4) Design Thinking y el Doble Diamante; y 5) La integración práctica del post-it al backlog mediante User Stories con sintaxis Gherkin (Given-When-Then) y priorización MoSCoW.",
        detailedSummary: `### Parte I · Cómo se Construye Software: Cascada vs. Agile

#### 1.1 El Problema de Fondo: Incertidumbre y Costo del Cambio
Toda decisión metodológica en software responde a la pregunta de **cuándo tomar decisiones**.
- En la construcción civil (un puente), cambiar de opinión a mitad de obra es carísimo y los requerimientos son estables desde el inicio.
- En el software —especialmente en startups con productos inéditos— nadie sabe con certeza qué quiere hasta que interactúa con algo funcional.

#### 1.2 La Matriz de Stacey
Modela dos ejes de incertidumbre:
1. **Eje de Requisitos**: Qué tan claro está *qué* construir (desde Requisitos Claros hasta Requisitos Inciertos/Cambiantes).
2. **Eje Tecnológico**: Qué tan claro está *cómo* construirlo (desde Tecnología Conocida hasta Tecnología Inédita/Experimental).

\`\`\`mermaid
graph TD
    subgraph Matriz de Stacey
    S1[Simple / Predecible] -->|Requisitos claros + Tecnología conocida| CASCADA[Modelo en Cascada]
    S2[Complicado] -->|Expertos requeridos| CASCADA2[Cascada / Iterativo]
    S3[Complejo / Alta Incertidumbre] -->|Requisitos cambiantes + Tecnología nueva| AGILE[Metodologías Ágiles: Scrum / Kanban]
    S4[Caos] -->|Sin orden previsible| EMERGENCIA[Intervención de Emergencia]
    end
\`\`\`

#### 1.3 La Curva de Costo del Cambio (Barry Boehm)
- **En Cascada**: El costo de modificar un requerimiento crece de forma exponencial conforme avanza el ciclo de vida (Requerimientos $\\rightarrow$ Diseño $\\rightarrow$ Codificación $\\rightarrow$ Testing $\\rightarrow$ Producción). Un error detectado en producción cuesta hasta 100 veces más que en la etapa inicial.
- **En Agile**: Mediante integración continua, refactorización y sprints cortos, la curva se aplana, manteniendo el costo de adaptación relativamente constante.

#### 1.4 El Manifiesto Ágil (2001)
Cuatro postulados valorativos:
1. **Individuos e interacciones** por sobre procesos y herramientas.
2. **Software funcionando** por sobre documentación exhaustiva.
3. **Colaboración con el cliente** por sobre negociación contractual.
4. **Respuesta ante el cambio** por sobre seguimiento de un plan.

---

### Parte II · Metodologías Ágiles: Kanban y Scrum

#### 2.1 Kanban (Flujo Continuo)
Originado en el sistema de producción de Toyota por Taiichi Ohno.
- **Principio central**: No se trabaja por iteraciones fijas de tiempo, sino por flujo continuo bajo demanda (*pull system*).
- **Las 6 Prácticas Generales**:
  1. Visualizar el flujo de trabajo (Tablero Kanban).
  2. **Limitar el Trabajo en Progreso (WIP - *Work In Progress*)**: Establece un tope máximo de tarjetas por columna para evitar cuellos de botella y multitarea.
  3. Gestionar y medir el flujo.
  4. Hacer las políticas explícitas (criterios para pasar de una columna a la siguiente).
  5. Implementar bucles de retroalimentación.
  6. Mejorar colaborativamente y evolucionar experimentalmente.
- **Métricas Clave de Kanban**:
  - **Lead Time**: Tiempo total transcurrido desde que un ítem es comprometido o solicitado hasta que se entrega en producción.
  - **Cycle Time**: Tiempo transcurrido desde que el equipo comienza efectivamente a trabajar en el ítem hasta que se completa.
  - **Throughput**: Cantidad de ítems completados por unidad de tiempo (ej. 8 historias por semana).
  - **Diagrama de Flujo Acumulado (CFD)**: Gráfico de áreas apiladas que visualiza el ritmo de entrada, acumulación en columnas y entrega final.

---

#### 2.2 Scrum (Marco Empírico Iterativo e Incremental)
Creado por Ken Schwaber y Jeff Sutherland.
- **Los 3 Pilares Empíricos**: Transparencia, Inspección y Adaptación.
- **Los 5 Valores de Scrum**: Compromiso, Foco, Apertura, Respeto y Coraje.

\`\`\`mermaid
graph LR
    subgraph Estructura de Scrum
    PO[Product Owner] --> PB[Product Backlog]
    SM[Scrum Master] --> EV[Facilitación de Eventos]
    DEV[Developers] --> SB[Sprint Backlog]
    SB --> SP[Sprint 1-4 semanas]
    SP --> INC[Incremento Potencialmente Entregable]
    end
\`\`\`

- **Los 3 Roles / Responsabilidades**:
  1. **Product Owner (PO)**: Maximiza el valor del producto; dueño exclusivo de la priorización del *Product Backlog*.
  2. **Scrum Master (SM)**: Líder servicial; vela por la aplicación de Scrum y remueve impedimentos organizacionales.
  3. **Developers (Equipo de Desarrollo)**: Profesionales multidisciplinarios que crean el incremento con calidad técnica y definen el *Sprint Backlog*.

- **Los 5 Eventos**:
  1. **Sprint**: Contenedor de 1 a 4 semanas donde se produce el incremento.
  2. **Sprint Planning**: Se define qué se hará y cómo se construirá (nace el *Sprint Goal*).
  3. **Daily Scrum**: Reunión diaria de **15 minutos** para que los developers sincronicen trabajo y detecten bloqueos.
  4. **Sprint Review**: Demostración del incremento a los stakeholders para recibir retroalimentación.
  5. **Sprint Retrospective**: Reunión interna de mejora continua del proceso y dinámica del equipo.

- **Los 3 Artefactos y sus Compromisos**:
  - **Product Backlog** $\\rightarrow$ Su compromiso es el **Product Goal** (meta a largo plazo).
  - **Sprint Backlog** $\\rightarrow$ Su compromiso es el **Sprint Goal** (objetivo del sprint actual).
  - **Incremento** $\\rightarrow$ Su compromiso es la **Definition of Done (DoD)** (criterios rigurosos de calidad que debe cumplir para considerarse terminado).

---

### Parte III · El Producto Mínimo Viable (Lean Startup)

#### 3.1 Definición Rigurosa de MVP
El MVP no es un producto defectuoso ni la primera fase incompleta de una cascada.
> **Definición de Eric Ries**: *"La versión de un nuevo producto que permite a un equipo recolectar la máxima cantidad de aprendizaje validado sobre sus clientes con el menor esfuerzo posible."*
> **El Skateboard de Henrik Kniberg**: Si el objetivo final es un auto para transportarse, el MVP no es una rueda aislada (inútil), sino un skateboard funcional: permite trasladarse desde el día uno y validar si la necesidad de transporte existe.

#### 3.2 Formulación de Hipótesis Falsables
Un MVP debe validar dos hipótesis nucleares:
1. **Hipótesis de Valor**: ¿El producto realmente le soluciona un problema a los usuarios y están dispuestos a usarlo/pagar?
2. **Hipótesis de Crecimiento**: ¿Cómo descubrirán el producto los nuevos usuarios y cómo se difundirá?

*Plantilla de Hipótesis Falsable*:
> *"Creemos que [segmento de clientes] tiene el problema de [dolor específico]. Si les ofrecemos [solución mínima], entonces mediremos [métrica específica de comportamiento], esperando alcanzar al menos [umbral porcentual / cuantitativo]."*

#### 3.3 Tipos de MVP
| Tipo de MVP | Descripción Mecánica | Caso Real / Ejemplo |
| :--- | :--- | :--- |
| **1. MVP de Humo (*Smoke Test* / *Fake Door*)** | Landing page con botón de registro o compra simulada para medir intención real antes de programar nada. | Buffer (Joel Gascoigne publicó una landing con precios de planes antes de escribir una sola línea de código). |
| **2. MVP Conserje (*Concierge*)** | El servicio se presta de forma **100% manual y visible**, ofreciendo atención personalizada de guante blanco. | Food on the Table (el fundador iba en persona a la casa de la primera clienta a planificar su menú y compras). |
| **3. MVP Mago de Oz (*Wizard of Oz* / *Flinstoning*)** | La interfaz parece un sistema automatizado, pero detrás hay personas operando manualmente sin que el usuario lo perciba. | Zappos (Nick Swinmurn sacaba fotos de zapatos en tiendas locales, las subía a una web y, si alguien compraba, iba a pie a la tienda a comprar el par y enviarlo por correo). |
| **4. MVP *Piecemeal* (Por partes / *Frankenstein*)** | Ensamblado de herramientas existentes no-code o SaaS (Typeform + Zapier + Google Sheets + Stripe) para crear un flujo funcional sin programar software a medida. | Groupon (empezó como un simple blog de WordPress en The Point enviando cupones en PDF por correo electrónico). |
| **5. Prototipo Funcional / *Single-Feature MVP*** | Software real pero limitado exclusivamente a la funcionalidad central que ataca el dolor raíz. | Dropbox (el video de 3 minutos de Drew Houston sincronizando una carpeta en pantalla) o Twitter en Odeo. |

#### 3.4 Métricas Piratas AARRR (Dave McClure)
- **Acquisition (Adquisición)**: ¿De dónde vienen los usuarios? (visitas a la web, descargas).
- **Activation (Activación)**: ¿Tienen una primera experiencia exitosa (*Aha Moment*)?
- **Retention (Retención)**: ¿Vuelven a utilizar el producto regularmente?
- **Referral (Referencia)**: ¿Invitan o recomiendan el producto a terceros?
- **Revenue (Monetización)**: ¿Pagan por el valor recibido?

#### 3.5 Pivotar o Perseverar (Los 10 Pivotes de Eric Ries)
Un pivote es una corrección estructurada diseñada para probar una nueva hipótesis fundamental sobre el producto, la estrategia y el motor de crecimiento:
1. *Zoom-in* (enfocarse en una sola funcionalidad que era secundaria).
2. *Zoom-out* (la funcionalidad actual se convierte en una parte pequeña de un producto mayor).
3. *Segmento de Clientes* (el producto resuelve un problema pero para otro tipo de usuario).
4. *Necesidad del Cliente* (conocemos bien al usuario pero descubrimos que su dolor crítico es otro).
5. *Plataforma* (pasar de una aplicación a una plataforma o viceversa).
6. *Arquitectura de Negocio* (alto margen/bajo volumen B2B a bajo margen/alto volumen B2C).
7. *Captura de Valor* (cambio de modelo de monetización: suscripción, freemium, publicidad).
8. *Motor de Crecimiento* (viral, pegajoso o pago).
9. *Canal* (cambio en la forma de distribución).
10. *Tecnología* (misma solución con una tecnología radicalmente más eficiente).

---

### Parte IV · Design Thinking (Descubrimiento del Problema)
Metodología de innovación centrada en las personas desarrollada por David Kelley (IDEO) y la d.school de Stanford.

#### El Modelo del Doble Diamante (Design Council):
1. **Primer Diamante (Problema)**:
   - *Divergir*: **Empatizar** (entrevistas en profundidad, observación, mapa de empatía).
   - *Convergir*: **Definir** (sintetizar insights, formular el Punto de Vista - POV y preguntas "¿Cómo podríamos nosotros...? / *How Might We* - HMW").
2. **Segundo Diamante (Solución)**:
   - *Divergir*: **Idear** (brainstorming, Crazy Eights, SCAMPER).
   - *Convergir*: **Prototipar y Testear** (prototipos de baja a alta fidelidad y pruebas con usuarios).

---

### Parte V · Integración: Del Post-it al Backlog

#### 5.1 La Articulación de los Tres Marcos
- **Design Thinking**: Encuentra el problema correcto y empatiza con el dolor humano.
- **Lean Startup**: Formula hipótesis falsables y prueba el modelo de negocio con un MVP.
- **Agile (Scrum / Kanban)**: Construye y entrega el producto de forma iterativa, adaptativa y con alta calidad técnica.

#### 5.2 Formato Canónico de User Stories
Una historia de usuario captura valor desde la perspectiva del destinatario final:

> **Estructura**:  
> *"Como **[rol de usuario]**,  
> quiero **[acción o capacidad técnica]**,  
> para **[beneficio tangible o valor de negocio]**."*

#### 5.3 Criterios de Aceptación en Sintaxis Gherkin
Definen cuándo una historia de usuario está completa y verificable:
- **Dado (*Given*)**: Contexto previo o estado del sistema.
- **Cuando (*When*)**: Acción o evento desencadenado por el usuario.
- **Entonces (*Then*)**: Consecuencia esperada y observable.

*Ejemplo de la Cátedra*:
\`\`\`gherkin
Dado que un alumno tiene flashcards pendientes según el algoritmo SM-2,
Cuando presiona el botón "Estudiar Ahora",
Entonces el sistema debe presentar la primera tarjeta mostrando únicamente el anverso y ocultando la respuesta.
\`\`\`

#### 5.4 Priorización del Backlog: Técnica MoSCoW
- **Must Have (M)**: Vitales para el MVP; sin ellos el producto no puede lanzarse.
- **Should Have (S)**: Importantes pero no impiden el lanzamiento si hay restricciones de tiempo.
- **Could Have (C)**: Deseables pero prescindibles si faltan recursos.
- **Won't Have this time (W)**: Excluidas explícitamente para esta versión (evita la corrupción del alcance / *scope creep*).

#### 5.5 Conexión Estratégica con la Unidad 5
El alcance definido para el MVP en esta Unidad 4 se traduce en la Unidad 5 en:
- Estimación del costo por Sprint (salarios del equipo técnico e infraestructura cloud).
- Tiempo de desarrollo hasta el lanzamiento comercial.
- Supuestos de inversión inicial para el **Flujo de Fondos** y el cálculo del **Valor Actual Neto (VAN)** exigido en el Pitch Final ante el jurado evaluador.`,
        simplifiedExplanation:
          "Esta clase te explica cómo se fabrica software en el mundo real sin tirar la plata a la basura. Primero te muestra por qué el modelo viejo de planificar todo de entrada (Cascada) no funciona en startups: porque nadie sabe lo que quiere hasta que lo ve (por eso usamos metodologías Ágiles como Scrum con sus Sprints de 2 semanas o Kanban con límites de trabajo). Segundo, te enseña qué es un MVP de verdad: no es un software roto, es la prueba más rápida para ver si la gente quiere lo que hacés (como hacer una simple página web para ver si hacen clic antes de programar). Y por último, te enseña a escribir historias de usuario claras (Dado-Cuando-Entonces) para que el equipo técnico sepa exactamente qué construir y cuánto va a costar en tu flujo de fondos.",
        keyPoints: [
          "La elección metodológica depende de la incertidumbre: a mayor incertidumbre de requisitos y tecnología (Matriz de Stacey), mayor necesidad de enfoques Ágiles frente a Cascada.",
          "La Curva de Boehm demuestra que en Cascada el costo de corregir un error crece exponencialmente; en Agile la curva se aplana mediante iteraciones cortas.",
          "Kanban gestiona flujo continuo limitando el trabajo en curso (WIP) y mide Lead Time (desde pedido a entrega) y Cycle Time (desde inicio a entrega).",
          "Scrum se fundamenta en 3 pilares (Transparencia, Inspección, Adaptación), 3 roles (PO, SM, Developers), 5 eventos y 3 artefactos con sus compromisos.",
          "El MVP es la versión mínima que permite el máximo aprendizaje validado con el menor esfuerzo (metáfora del skateboard de Kniberg).",
          "Existen 5 tipos de MVP: Humo (Fake door), Conserje (manual visible), Mago de Oz (manual oculto), Piecemeal (herramientas no-code) y Prototipo funcional.",
          "Design Thinking sigue el modelo de Doble Diamante en 5 fases: Empatizar, Definir, Idear, Prototipar y Testear.",
          "Las User Stories se escriben como 'Como [rol] quiero [acción] para [beneficio]' con Criterios de Aceptación en Gherkin (Dado-Cuando-Entonces).",
          "El alcance del MVP definido en la Unidad 4 alimenta el costo por sprint y el cálculo del VAN en la Unidad 5.",
        ],
        definitions: [
          { term: "Matriz de Stacey", definition: "Modelo que evalúa el grado de certeza en los requisitos y en la tecnología para determinar la metodología de gestión adecuada (Simple, Complicado, Complejo o Caótico)." },
          { term: "Curva de Boehm", definition: "Principio empírico que demuestra el incremento exponencial del costo del cambio en software según la fase del ciclo de vida en que se detecte el desvío." },
          { term: "WIP (Work In Progress)", definition: "Cantidad máxima de tareas permitidas simultáneamente en una columna de un tablero Kanban para evitar saturación y cuellos de botella." },
          { term: "Definition of Done (DoD)", definition: "Lista formal de criterios de calidad técnica, testing y documentación que un incremento de Scrum debe cumplir obligatoriamente para considerarse terminado." },
          { term: "MVP (Producto Mínimo Viable)", definition: "Versión de un producto que maximiza el aprendizaje validado sobre el mercado con la menor inversión de tiempo y recursos." },
          { term: "MVP Mago de Oz", definition: "Experimento de MVP donde la interfaz aparenta automatización digital pero los procesos internos son operados manualmente por personas sin que el usuario lo note." },
          { term: "MVP Conserje", definition: "Prueba de concepto donde el servicio se presta de forma totalmente personalizada, artesanal y explícitamente manual frente al cliente." },
          { term: "Sintaxis Gherkin", definition: "Formato estructurado de especificación de pruebas y criterios de aceptación basado en las cláusulas Dado (Given), Cuando (When) y Entonces (Then)." },
        ],
        examples: [
          { title: "El Skateboard de Kniberg", description: "Construir primero un skateboard para validar si la gente quiere transportarse sobre ruedas, en lugar de fabricar primero una rueda aislada que no le sirve a nadie hasta completar el auto." },
          { title: "MVP de Humo de Buffer", description: "Joel Gascoigne publicó una landing page con los precios y funciones de Buffer; solo cuando comprobó que cientos de usuarios hacían clic en 'Comprar' comenzó a programar el software." },
          { title: "Zappos y el Mago de Oz", description: "Nick Swinmurn fotografió zapatos en tiendas físicas y los publicó en una web sencilla; cuando alguien ordenaba, iba a pie a comprarlos a precio minorista y los despachaba por correo para validar si la gente compraría calzado por internet." },
          { title: "Groupon como MVP Piecemeal", description: "Groupon empezó con un blog en WordPress, generaba cupones en PDF con FileMaker y los enviaba manualmente por Apple Mail sin programar una plataforma transaccional propia." },
        ],
        commonMistakes: [
          { mistake: "Creer que un MVP es una versión beta rota o de mala calidad", explanation: "Un MVP debe ofrecer una experiencia excelente y completa para el problema específico que ataca (skateboard funcional), no un auto sin volante ni frenos." },
          { mistake: "Diseñar el MVP en base a opiniones en vez de comportamientos observables", explanation: "Las entrevistas miden lo que la gente dice que haría; el MVP mide lo que la gente hace realmente (clics, tiempo de permanencia, transacciones monetarias)." },
          { mistake: "No definir la Definition of Done en Scrum", explanation: "Dar por terminadas tareas que no fueron testeadas ni revisadas genera deuda técnica acumulada que detona en los sprints posteriores." },
        ],
      },
      topics: [
        { name: "Modelos de Desarrollo de Software: Cascada vs. Metodologías Ágiles", description: "Incertidumbre, Matriz de Stacey, Curva de Boehm y los 4 valores del Manifiesto Ágil.", importance: "critical" },
        { name: "Framework Scrum: Pilares, Roles, Eventos, Artefactos y DoD", description: "Estructura completa de Scrum: PO, SM, Developers, Sprint, Daily, Backlog y Definition of Done.", importance: "critical" },
        { name: "Sistema Kanban: Tablero, Límites de WIP, Lead Time vs. Cycle Time y Flujo", description: "Gestión de flujo continuo, sistema pull, métricas de ciclo y Diagrama de Flujo Acumulado (CFD).", importance: "high" },
        { name: "Lean Startup, Hipótesis Falsables y los 5 Tipos de MVP", description: "Definición rigurosa de MVP, skateboard de Kniberg, tipos (Humo, Conserje, Mago de Oz, Piecemeal) y métricas AARRR.", importance: "critical" },
        { name: "Design Thinking: Doble Diamante y las 5 Fases de Descubrimiento", description: "Empatizar, Definir (POV/HMW), Idear, Prototipar y Testear en el descubrimiento de clientes.", importance: "high" },
        { name: "Integración del Backlog: User Stories, Sintaxis Gherkin y Priorización MoSCoW", description: "Formato de historias de usuario, criterios de aceptación Dado-Cuando-Entonces y conexión con el flujo de fondos de Unidad 5.", importance: "high" },
      ],
      flashcards: [
        { front: "¿Bajo qué condiciones de la Matriz de Stacey es preferible utilizar un modelo en Cascada en vez de metodologías Ágiles?", back: "Cuando los requisitos son estables, claros y completamente conocidos desde el inicio, y la tecnología a emplear es madura y probada (baja incertidumbre y bajo costo de cambio).", difficulty: "medium" },
        { front: "¿Qué demuestra la Curva de Costo del Cambio de Barry Boehm?", back: "Que en modelos tradicionales (Cascada), corregir un error o cambiar un requerimiento cuesta exponencialmente más conforme avanza el proyecto (hasta 100x más en producción que en diseño).", difficulty: "medium" },
        { front: "¿Cuál es la diferencia entre Lead Time y Cycle Time en Kanban?", back: "Lead Time es el tiempo total desde que el cliente solicita o compromete el ítem hasta que se entrega. Cycle Time es el tiempo que el equipo pasa trabajando activamente en él desde que ingresa a 'En Progreso'.", difficulty: "medium" },
        { front: "¿Cuáles son los 3 roles constitutivos del marco Scrum y cuál es la misión de cada uno?", back: "1. Product Owner (PO): maximizar el valor del producto y gestionar el Product Backlog.\n2. Scrum Master (SM): líder servicial que remueve impedimentos y vela por Scrum.\n3. Developers: equipo técnico multidisciplinario que construye el incremento.", difficulty: "easy" },
        { front: "¿En qué consiste la Definition of Done (DoD) en Scrum?", back: "Es el acuerdo formal y riguroso de criterios de calidad (código revisado, pruebas unitarias aprobadas, documentación, despliegue) que debe cumplir todo ítem para ser considerado un Incremento terminado.", difficulty: "medium" },
        { front: "¿Cómo se diferencian un MVP Conserje y un MVP Mago de Oz?", back: "En el MVP Conserje el servicio se realiza de forma manual y explícitamente VISIBLE para el cliente (atención artesanal). En el Mago de Oz la interfaz simula automatización pero detrás operan humanos sin que el usuario lo sepa.", difficulty: "medium" },
        { front: "¿Cuáles son las 5 métricas piratas AARRR de Dave McClure?", back: "Acquisition (Adquisición), Activation (Activación), Retention (Retención), Referral (Referidos) y Revenue (Ingresos/Monetización).", difficulty: "easy" },
        { front: "¿Cuál es la estructura canónica de una User Story y de un Criterio de Aceptación en Gherkin?", back: "User Story: 'Como [rol], quiero [acción], para [beneficio]'.\nCriterio Gherkin: 'Dado [contexto], Cuando [acción/evento], Entonces [resultado esperado]'.", difficulty: "easy" },
      ],
      questions: [
        {
          question: "Según la Nota Técnica de la Cátedra, ¿cuál es el propósito fundamental de limitar el Trabajo en Progreso (WIP Limits) en un tablero Kanban?",
          options: ["Reducir el salario de los desarrolladores que trabajan en más de una tarea", "Prevenir cuellos de botella, reducir la multitarea y maximizar la velocidad de flujo del sistema", "Garantizar que todos los miembros del equipo utilicen exactamente el mismo IDE", "Impedir que el Product Owner agregue nuevos requerimientos al Product Backlog"],
          answer: "Prevenir cuellos de botella, reducir la multitarea y maximizar la velocidad de flujo del sistema",
          explanation: "Limitar el WIP asegura que el equipo termine tareas antes de empezar nuevas ('dejar de empezar y empezar a terminar'), evitando que se saturen columnas y se generen cuellos de botella.",
          difficulty: "medium",
          type: "multiple_choice",
        },
        {
          question: "Nick Swinmurn validó la idea de Zappos tomando fotos en zapaterías locales y comprando el calzado a precio minorista cada vez que un usuario ordenaba en su web. ¿Qué tipo de MVP representa este experimento?",
          options: ["MVP Conserje (Concierge)", "MVP Mago de Oz (Wizard of Oz)", "MVP de Humo (Smoke Test)", "Prototipo de Alta Fidelidad en Cascada"],
          answer: "MVP Mago de Oz (Wizard of Oz)",
          explanation: "En el Mago de Oz el cliente cree que está interactuando con una tienda online con inventario y logística automatizada, pero tras bambalinas todo el proceso es ejecutado manualmente por personas.",
          difficulty: "easy",
          type: "multiple_choice",
        },
        {
          question: "¿Cuál de los siguientes eventos de Scrum tiene una duración máxima predefinida de 15 minutos y está destinado exclusivamente a que los Developers sincronicen su avance diario?",
          options: ["Sprint Retrospective", "Sprint Review", "Daily Scrum", "Sprint Planning"],
          answer: "Daily Scrum",
          explanation: "El Daily Scrum es una reunión diaria de time-box estricto de 15 minutos donde los desarrolladores inspeccionan el progreso hacia el Sprint Goal y adaptan su plan para las siguientes 24 horas.",
          difficulty: "easy",
          type: "multiple_choice",
        },
        {
          question: "¿Cómo se articulan secuencialmente los tres marcos metodológicos enseñados en la Unidad 4 para llevar una idea a producción?",
          options: ["Cascada planifica todo el presupuesto, Scrum hace el testing final y Kanban redacta los manuales", "Design Thinking descubre el problema correcto, Lean Startup prueba el modelo de negocio con un MVP y Agile construye el producto de forma iterativa", "Lean Startup programa el backend, Design Thinking diseña los servidores y Scrum define los aspectos legales", "Se elige uno solo de los tres porque son filosofías mutuamente excluyentes que no pueden combinarse"],
          answer: "Design Thinking descubre el problema correcto, Lean Startup prueba el modelo de negocio con un MVP y Agile construye el producto de forma iterativa",
          explanation: "La Nota Técnica enseña expresamente que Design Thinking, Lean Startup y Agile forman una cadena de valor unificada: empatizar y definir el problema real, validar la hipótesis de negocio con un MVP, y construir el software mediante incrementos ágiles.",
          difficulty: "medium",
          type: "multiple_choice",
        },
      ],
    },
  ];

  // 4. Procesar y guardar en la base de datos
  for (const item of newClassesData) {
    console.log(`\n======================================================`);
    console.log(`📚 Procesando Clase ${item.classNumber}: ${item.classTitle}`);

    // Buscar o actualizar la clase
    let classSession = classMap.get(item.classNumber);
    if (!classSession) {
      console.log(`Creando nueva ClassSession para Clase ${item.classNumber}...`);
      classSession = await prisma.classSession.create({
        data: {
          subjectId: subject.id,
          classNumber: item.classNumber,
          title: item.classTitle,
          date: item.classNumber === 5 ? new Date("2026-09-14T21:30:00.000Z") : new Date("2026-09-21T21:30:00.000Z"),
          modality: "presencial",
          startTime: "18:30",
          endTime: "21:30",
          attendanceStatus: "attended",
        },
      });
    } else {
      classSession = await prisma.classSession.update({
        where: { id: classSession.id },
        data: {
          title: item.classTitle,
          attendanceStatus: "attended",
        },
      });
    }

    // Procesar archivo PDF y Material
    const fullFilePath = path.join(tallerDir, item.fileName);
    const fileStats = fs.statSync(fullFilePath);
    const fileBuffer = fs.readFileSync(fullFilePath);
    const extracted = await extractTextFromBuffer(fileBuffer);

    console.log(`  📄 Extrayendo texto de '${item.fileName}' (${fileStats.size} bytes)...`);

    const relativeStoragePath = `uploads/materials/taller_emprededurismo/${item.fileName}`;

    let material = await prisma.material.findFirst({
      where: {
        subjectId: subject.id,
        storagePath: relativeStoragePath,
      },
    });

    if (material) {
      material = await prisma.material.update({
        where: { id: material.id },
        data: {
          classId: classSession.id,
          fileSize: fileStats.size,
          extractedText: extracted.text,
          processingStatus: "completed",
        },
      });
      console.log(`  💾 Material existente actualizado: ID ${material.id}`);
    } else {
      material = await prisma.material.create({
        data: {
          subjectId: subject.id,
          classId: classSession.id,
          fileName: item.fileName,
          fileType: "application/pdf",
          fileSize: fileStats.size,
          storagePath: relativeStoragePath,
          extractedText: extracted.text,
          processingStatus: "completed",
        },
      });
      console.log(`  ✨ Material creado y vinculado a la clase: ID ${material.id}`);
    }

    // Crear o actualizar el Resumen Académico
    const existingSummary = await prisma.summary.findFirst({
      where: {
        classId: classSession.id,
      },
    });

    if (existingSummary) {
      await prisma.summary.update({
        where: { id: existingSummary.id },
        data: {
          materialId: material.id,
          title: item.summary.title,
          overview: item.summary.overview,
          detailedSummary: item.summary.detailedSummary,
          simplifiedExplanation: item.summary.simplifiedExplanation,
          keyPointsJson: JSON.stringify(item.summary.keyPoints),
          definitionsJson: JSON.stringify(item.summary.definitions),
          examplesJson: JSON.stringify(item.summary.examples),
          commonMistakesJson: JSON.stringify(item.summary.commonMistakes),
        },
      });
      console.log(`  📝 Resumen académico actualizado para Clase ${item.classNumber}`);
    } else {
      await prisma.summary.create({
        data: {
          classId: classSession.id,
          materialId: material.id,
          title: item.summary.title,
          overview: item.summary.overview,
          detailedSummary: item.summary.detailedSummary,
          simplifiedExplanation: item.summary.simplifiedExplanation,
          keyPointsJson: JSON.stringify(item.summary.keyPoints),
          definitionsJson: JSON.stringify(item.summary.definitions),
          examplesJson: JSON.stringify(item.summary.examples),
          commonMistakesJson: JSON.stringify(item.summary.commonMistakes),
        },
      });
      console.log(`  🌟 Resumen académico creado con éxito para Clase ${item.classNumber}`);
    }

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
    console.log(`  📌 ${item.topics.length} temas clave sincronizados.`);

    // Ingestar Flashcards con nextReviewAt = AHORA (disponibles para repasar de inmediato)
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
            nextReviewAt: new Date(), // Inmediatamente activa
          },
        });
      }
    }
    console.log(`  🗂️  ${item.flashcards.length} flashcards creadas y activas para SM-2.`);

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
    console.log(`  ❓ ${item.questions.length} preguntas de examen ingresadas para simulacro.`);
  }

  // 5. Estadísticas finales de la materia
  const updatedSubject = await prisma.subject.findUnique({
    where: { id: subject.id },
    include: {
      _count: {
        select: {
          classes: true,
          materials: true,
          flashcards: true,
          questions: true,
        },
      },
    },
  });

  console.log(`\n======================================================`);
  console.log(`🎉 Ingesta de Clases 5 y 6 completada con total éxito!`);
  console.log(`📊 Balance de la materia '${subject.name}':`);
  console.log(`   - Clases registradas: ${updatedSubject?._count.classes}`);
  console.log(`   - Materiales subidos: ${updatedSubject?._count.materials}`);
  console.log(`   - Flashcards SM-2 activas: ${updatedSubject?._count.flashcards}`);
  console.log(`   - Preguntas de simulador: ${updatedSubject?._count.questions}`);
}

main()
  .catch((e) => {
    console.error("❌ Error en la ingesta:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
