import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Iniciando ingesta de nuevos documentos para Sistemas Digitales (Jueves)...");

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
  if (exam) {
    console.log(`🎯 Examen Parcial detectado: ${exam.title} (ID: ${exam.id})`);
  }

  // Identificar Clase 8
  const class8 = subject.classes.find((c) => c.classNumber === 8);
  if (!class8) {
    throw new Error("No se encontró la Clase 8 de Sistemas Digitales.");
  }

  console.log(`📍 Clase 8 encontrada: "${class8.title}" (ID: ${class8.id})`);

  // Archivos a ingestar
  const pptxFileName = "Clase - Inteligencia Artificial.pptx";
  const pptxPath = `uploads/materials/jueves_sistemas/${pptxFileName}`;
  const pptxStat = fs.existsSync(pptxPath) ? fs.statSync(pptxPath) : null;

  const docxFileName = "prompt engineering .docx";
  const docxPath = `uploads/materials/jueves_sistemas/${docxFileName}`;
  const docxStat = fs.existsSync(docxPath) ? fs.statSync(docxPath) : null;

  // Leer el texto OCR extraído de las diapositivas
  let pptxText = "";
  if (fs.existsSync("scratch_ocr_pptx.txt")) {
    pptxText = fs.readFileSync("scratch_ocr_pptx.txt", "utf-8");
  }

  // Texto extraído del DOCX
  const docxText = `Prompt Engineering. Formulación de prompts efectivos para interactuar con los LLM utilizados por ChatGPT, Gemini y Notebook LM, Copilot, Claude, otros.
1. Claridad en la Pregunta: Una pregunta clara reduce la ambigüedad y facilita una respuesta precisa. Información relevante: Incluye datos, metas, tono deseado, audiencia, rol que debe asumir el modelo, etc. Ejemplo: En lugar de preguntar "Háblame de tecnología", pregunta "¿Cuáles son las últimas tendencias en inteligencia artificial?".
2. Establece un punto de vista: Dale un papel, una profesión, una identidad o un punto de vista, para guiar sus respuestas. Ejemplo: "Eres un Científico reconocido mundialmente, has investigado por años la inteligencia artificial y debes dar tu punto de vista en relación a 'Cómo la IA cambiará la medicina en los próximos 5 años'".
3. Proporcionar Contexto: El contexto ayuda a la IA a entender la situación o el tema específico. Ejemplo: "En el contexto del crecimiento de las tecnologías de inteligencia Artificial, ¿cuáles crees que serán los 3 principales paradigmas que se presentarán?".
4. Delimitadores y PlaceHolders: Separar claramente las instrucciones de los datos de entrada o variables a analizar.
5. Formato de Respuesta: Indicar cómo deseas que se presente la respuesta puede mejorar su utilidad (tablas, markdown, json, viñetas).
6. Limitar el Alcance: Restringir el enfoque ayuda a obtener respuestas más manejables y relevantes. Ejemplo: "¿Cuáles son las principales características del arte barroco en Europa?".
7. Preguntas de la IA: Solicitarle a la IA que nos realice las preguntas que considere necesarias para profundizar el entendimiento de nuestra necesidad o requerimientos antes de responder.
8. Usar Ejemplos (Few-shot prompting): Proporcionar ejemplos puede ilustrar mejor lo que buscas y guiar a la IA. Ejemplo: "Como un experto en marketing, ¿qué estrategias recomendarías? Por ejemplo, menciona tácticas de redes sociales."
9. Definir la Audiencia: Indicar para quién es la información puede ayudar a ajustar el tono y el contenido. Ejemplo: "Explica el concepto de blockchain para un público sin conocimientos técnicos."
10. Iterar y Refinar: No dudes en ajustar el prompt basado en las respuestas anteriores para mejorar la calidad. El desarrollo de prompts es un proceso iterativo; es muy improbable encontrar el prompt adecuado en un primer intento.
11. La IA genera su propio Prompt (Meta-Prompting): Pedirle a la IAG que genere el prompt óptimo para la necesidad que tienes. Le explicas tus requerimientos y que la propia IA diseñe el mejor prompt posible para luego realizar la consulta con dicho prompt.`;

  // 1. Actualizar Clase 8: Título y Notas de Cátedra iniciales
  const updatedClassTitle = "Clase 8: Unidad 11: Inteligencia Artificial, Redes Neuronales, GenAI y Prompt Engineering";
  const classNotesMarkdown = `# Notas de Cátedra — Clase 8: Inteligencia Artificial y Prompt Engineering
**Materia:** Sistemas Digitales (UCABA) | **Fecha:** 01/10/2026

## 1. Definición y Ejes de la Inteligencia Artificial
- **Russell & Norvig:** La IA se manifiesta cuando una máquina emula funciones cognitivas humanas: *percibir, razonar, aprender y resolver problemas*.
- **Impulsores clave:**
  1. Captura masiva de datos (Big Data).
  2. Capacidad de cómputo acelerada (GPUs/TPUs).
  3. Modelos neuronales avanzados (Machine Learning y Deep Learning).

## 2. Componentes de una Red Neuronal Artificial (ANN)
- **Dendritas:** Entradas ($X_1, X_2, \\dots, X_n$).
- **Pesos ($W_i$):** Ponderación de importancia de cada entrada.
- **Soma:** Suma ponderada de entradas más el sesgo:
  $$Z = \\sum_{i=1}^n W_i X_i + b$$
- **Sesgo ($b$):** Umbral o bias que desplaza la función de activación.
- **Función de Activación $f(Z)$:**
  - **Sigmoide:** $\\sigma(x) = \\frac{1}{1 + e^{-x}}$ (mapea a intervalo $[0, 1]$, ideal para probabilidades).
  - **ReLU:** $f(x) = \\max(0, x)$ (estándar en capas ocultas profundas).
  - **Tanh:** $f(x) = \\tanh(x) = \\frac{e^x - e^{-x}}{e^x + e^{-x}}$ (intervalo $[-1, 1]$).
- **Axón:** Salida de la neurona ($Y$).

### Ejemplo de Cátedra (Probabilidad de Lluvia en CABA)
- Entradas: $TA = 20^\\circ\\text{C}$, $HA = 80\\%$.
- Pesos: $PT = 0.5$, $PH = 0.8$.
- $\\Sigma = (20 \\times 0.5) + (80 \\times 0.8) = 10 + 64 = 74$.
- Con sesgo $b = -30 \\Rightarrow Z = 44 \\Rightarrow \\sigma(44) \\approx 1.0$ (100% lluvia).
- **Ajuste por Aprendizaje:** Si no llovió, el modelo reajusta el sesgo a $b = -74 \\Rightarrow Z = 0 \\Rightarrow \\sigma(0) = 0.5$ (50%).

## 3. Taxonomía de la Inteligencia Artificial
1. **IA Estrecha o Débil (ANI):** Especializada en una sola tarea (asistentes de voz Alexa/Siri, filtros antispam, recomendadores Netflix).
2. **IA General o Fuerte (AGI):** Hipotética, con capacidad de igualar o superar la cognición humana en cualquier dominio intelectual sin experimentar conciencia.
3. **IA Generativa (IAG):**
   - **Texto:** GPT (Generative Pre-trained Transformer) con modelos LLM.
   - **Imágenes / Audio:** GANs (Generative Adversarial Networks con arquitectura Generador vs. Discriminador) y VAEs.

## 4. Prompt Engineering: 11 Directrices Esenciales
1. Claridad en la pregunta.
2. Rol o punto de vista ("Actúa como un arquitecto de software senior...").
3. Contexto situacional detallado.
4. Delimitadores y placeholders (e.g. \`\`\` o XML tags).
5. Formato estricto de respuesta (JSON, tablas, viñetas).
6. Delimitación precisa del alcance.
7. Preguntas activas previas de la IA.
8. Ejemplos de referencia (Few-shot prompting).
9. Definición explícita de audiencia objetivo.
10. Proceso iterativo y experimental.
11. Meta-Prompting (la IA diseña su propio prompt óptimo).`;

  await prisma.classSession.update({
    where: { id: class8.id },
    data: {
      title: updatedClassTitle,
      notes: classNotesMarkdown,
      attendanceStatus: "attended",
    },
  });
  console.log(`✅ Clase 8 actualizada con nuevo título y notas.`);

  // 2. Registrar o Actualizar Materiales
  let matPptx = await prisma.material.findFirst({
    where: { classId: class8.id, fileName: pptxFileName },
  });
  if (matPptx) {
    matPptx = await prisma.material.update({
      where: { id: matPptx.id },
      data: {
        fileSize: pptxStat ? pptxStat.size : 9125583,
        extractedText: pptxText,
        storagePath: pptxPath,
      },
    });
  } else {
    matPptx = await prisma.material.create({
      data: {
        subjectId: subject.id,
        classId: class8.id,
        fileName: pptxFileName,
        fileType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        fileSize: pptxStat ? pptxStat.size : 9125583,
        storagePath: pptxPath,
        extractedText: pptxText,
      },
    });
  }
  console.log(`✅ Material PPTX registrado: ${matPptx.fileName} (ID: ${matPptx.id})`);

  let matDocx = await prisma.material.findFirst({
    where: { classId: class8.id, fileName: docxFileName },
  });
  if (matDocx) {
    matDocx = await prisma.material.update({
      where: { id: matDocx.id },
      data: {
        fileSize: docxStat ? docxStat.size : 211128,
        extractedText: docxText,
        storagePath: docxPath,
      },
    });
  } else {
    matDocx = await prisma.material.create({
      data: {
        subjectId: subject.id,
        classId: class8.id,
        fileName: docxFileName,
        fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        fileSize: docxStat ? docxStat.size : 211128,
        storagePath: docxPath,
        extractedText: docxText,
      },
    });
  }
  console.log(`✅ Material DOCX registrado: ${matDocx.fileName} (ID: ${matDocx.id})`);

  // 3. Crear Resúmenes Académicos Estructurados
  // Borrar resúmenes preexistentes de Clase 8 para regenerar frescos
  await prisma.summary.deleteMany({
    where: { classId: class8.id },
  });

  const summary1 = await prisma.summary.create({
    data: {
      classId: class8.id,
      title: "Unidad 11: Fundamentos de Inteligencia Artificial, Redes Neuronales y GenAI",
      overview: "Estudio exhaustivo de la Inteligencia Artificial moderna según el marco conceptual de Russell & Norvig, los tres impulsores tecnológicos contemporáneos, la anatomía matemática y biológica de las neuronas artificiales (pesos, bias y funciones de activación Sigmoide, ReLU y Tanh), la extracción jerárquica de características en redes profundas, y la clasificación taxonómica entre ANI (estrecha), AGI (general) e IAG (generativa: GPT/Transformers y GANs/VAEs).",
      detailedSummary: `## 1. Definición Formal de Inteligencia Artificial
La Inteligencia Artificial se define según **Stuart Russell y Peter Norvig** como la disciplina y tecnología que permite a una máquina o sistema computacional emular las **funciones cognitivas superiores** que caracterizan a la mente humana:
- **Percibir:** Captar y digitalizar información del entorno físico o digital.
- **Razonar:** Inferir conclusiones lógicas a partir de premisas y datos observados.
- **Aprender:** Modificar sus parámetros internos a través de la experiencia para mejorar su rendimiento futuro.
- **Resolver Problemas:** Planificar secuencias de acciones para alcanzar metas complejas en condiciones de incertidumbre.

\`\`\`mermaid
flowchart LR
    A[Percepción Sensorial] --> B[Razonamiento Lógico]
    B --> C[Aprendizaje Adaptativo]
    C --> D[Resolución de Problemas]
\`\`\`

---

## 2. Los Tres Impulsores de la Revolución de la IA
La actual aceleración de la IA no es puramente teórica, sino el resultado de la confluencia de tres factores tecnológicos:
1. **Captura ingente de datos (Big Data):** Digitalización global de interacciones, transacciones, imágenes y texto masivo.
2. **Poder masivo de cómputo:** Microarquitecturas altamente paralelas (GPUs, TPUs) optimizadas para operaciones tensoriales.
3. **Avance en Redes Neuronales:** Transición del Machine Learning tradicional al Deep Learning con arquitecturas de múltiples capas ocultas y transformers.

---

## 3. Anatomía y Matemática de la Neurona Artificial
La neurona artificial (modelo inspirado en el perceptrón de McCulloch-Pitts y Rosenblatt) emula la estructura biológica de una célula nerviosa:

| Componente Biológico | Componente Artificial | Función Matemática / Operacional |
| :--- | :--- | :--- |
| **Dendritas** | Entradas ($X_1, X_2, \\dots, X_n$) | Señales de entrada o atributos numéricos del dato. |
| **Sinapsis** | Pesos ($W_1, W_2, \\dots, W_n$) | Factor de ponderación que amplifica o inhibe la señal. |
| **Soma** | Función de Combinación lineal | $\\Sigma = \\sum_{i=1}^n W_i X_i$ |
| **Umbral de Disparo** | Sesgo ($b$ / Bias) | Desplaza la recta o hiperplano de decisión independientemente de las entradas. |
| **Potencial de Acción** | Función de Activación $f(Z)$ | Introduce no linealidad y decide si la neurona dispara y con qué intensidad. |
| **Axón y Terminales** | Salida ($Y$) | Resultado emitido hacia las capas subsiguientes o la predicción final. |

### Ecuación de la Neurona Artificial
$$Y = f\\left( \\sum_{i=1}^n W_i X_i + b \\right)$$

### Funciones de Activación Principales
1. **Función Sigmoide (Logística):**
   $$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$
   - Mapea valores reales al intervalo abierto $(0, 1)$.
   - Ideal para modelar probabilidades y clasificaciones binarias.
2. **Función ReLU (Rectified Linear Unit):**
   $$\\text{ReLU}(z) = \\max(0, z)$$
   - Deja pasar valores positivos y anula los negativos.
   - Resuelve el problema del desvanecimiento del gradiente en redes profundas (*vanishing gradient*).
3. **Función Tangente Hiperbólica (Tanh):**
   $$\\tanh(z) = \\frac{e^z - e^{-z}}{e^z + e^{-z}}$$
   - Mapea valores al intervalo $(-1, 1)$, con media centrada en 0.

---

## 4. Caso Práctico Numérico de Cátedra: Estimación de Lluvia en CABA
La cátedra ilustra el funcionamiento de la neurona y el aprendizaje supervisado con el siguiente ejercicio:
- **Entradas:** Temperatura actual $TA = 20^\\circ\\text{C}$, Humedad actual $HA = 80\\%$.
- **Pesos asignados:** $PT = 0.5$, $PH = 0.8$.
- **Paso 1: Suma ponderada:**
  $$\\Sigma = (20 \\times 0.5) + (80 \\times 0.8) = 10 + 64 = 74$$
- **Paso 2: Incorporación del sesgo inicial ($b = -30$):**
  $$Z = 74 - 30 = 44$$
- **Paso 3: Aplicación de Función de Activación Sigmoide:**
  $$\\sigma(44) = \\frac{1}{1 + e^{-44}} \\approx 1.0$$
  *Interpretación:* La neurona emite $Y = 1$ (probabilidad prácticamente del 100% de lluvia).
- **Paso 4: Feedback de la realidad y ajuste por aprendizaje:**
  *Suceso:* Al día siguiente no llovió (la predicción fue errónea).
  *Mecanismo de Aprendizaje:* El algoritmo de optimización ajusta el sesgo a $b = -74$.
  *Nueva evaluación con el nuevo sesgo:*
  $$Z = 74 - 74 = 0 \\implies \\sigma(0) = \\frac{1}{1 + e^0} = \\frac{1}{2} = 0.5$$
  *Nueva salida:* Probabilidad recalibrada al 50%.

---

## 5. Extracción Jerárquica en Redes Neuronales Profundas (Deep Learning)
En una red convolucional o profunda de clasificación de imágenes (ej. identificar un perro):
- **Capa 1 (Píxeles brutos):** Recibe matrices de valores numéricos de intensidad de color.
- **Capa 2 (Bordes):** Detecta gradientes, aristas y líneas básicas de contraste.
- **Capa 3 (Formas simples):** Combina bordes para identificar patrones geométricos (círculos, curvas, esquinas).
- **Capa 4 (Partes / Características):** Identifica hocicos, orejas, ojos, patas.
- **Capa 5 (Combinación global de rasgos):** Ensambla las partes y la capa de salida concluye con una distribución de probabilidad: *"Es un perro con 98.7% de confianza"*.

---

## 6. Clasificación Taxonómica de la Inteligencia Artificial
\`\`\`mermaid
flowchart TD
    IA[Inteligencia Artificial]
    IA --> ANI[IA Estrecha o Débil - ANI]
    IA --> AGI[IA General o Fuerte - AGI]
    IA --> IAG[IA Generativa - IAG]
    
    ANI --> ANI_Ex[Asistentes de Voz / Algoritmos de Recomendación / Visión Computacional]
    AGI --> AGI_Ex[Capacidad intelectual humana universal - Hipotética / Sin consciencia]
    IAG --> IAG_Texto[GPT / Transformers / LLMs]
    IAG --> IAG_Media[GANs: Generador vs Discriminador / VAEs]
\`\`\`

1. **IA Estrecha o Débil (ANI - Artificial Narrow Intelligence):**
   - Diseñada y entrenada para resolver una tarea acotada de forma altamente competente.
   - Carece de transferencia de aprendizaje a otros dominios y de comprensión conceptual profunda.
   - Ejemplos: Siri, Alexa, motores de recomendación de Netflix/Amazon, reconocimiento facial de smartphones.
2. **IA General o Fuerte (AGI - Artificial General Intelligence):**
   - Estado hipotético donde un sistema de software puede igualar o superar la versatilidad cognitiva humana en cualquier tarea intelectual.
   - Puede razonar, aprender de forma autónoma y transferir conocimientos entre disciplinas dispares.
   - No experimenta consciencia ni emociones: su fin es replicar el razonamiento lógico adaptativo.
3. **IA Generativa (IAG):**
   - Modela la distribución de probabilidad subyacente de grandes volúmenes de datos para sintetizar contenido original y realista.
   - **Para texto:** Modelos **GPT (Generative Pre-trained Transformer)** apoyados en LLMs entrenados con billones de tokens, con ventanas de contexto (*Context Window*) y mecanismos de predicción autorregresiva de siguiente token (*Completion*).
   - **Para contenido audiovisual:** **GANs (Redes Generativas Antagónicas)** compuestas por dos redes en competencia continua:
     - *Generador:* Aprende a sintetizar datos falsos indistinguibles de los reales.
     - *Discriminador:* Aprende a distinguir muestras reales de datos sintéticos.
     - Ambas redes minimizan/maximizan pérdidas cruzadas (*Generator Loss* y *Discriminator Loss*).`,
      simplifiedExplanation: "Pensá en una neurona artificial como un semáforo inteligente para decidir si llevás paraguas: mira el termómetro (20°C) y la humedad (80%), multiplica cada dato por qué tanta bola le da (pesos) y le resta un valor base de escepticismo (el sesgo). Si el total supera cierto umbral, la neurona se activa con una función sigmoide y te dice 'Va a llover con 99% de certeza'. Si al final no llovió, el sistema no se frustra: reajusta sus pesos y su sesgo (aprendizaje) para que la próxima vez no sea tan exagerado.",
      keyPointsJson: JSON.stringify([
        "Definición canónica de Russell & Norvig: imitación de funciones cognitivas humanas (percibir, razonar, aprender y resolver problemas).",
        "Los tres catalizadores de la IA moderna: Big Data masivo, computación en GPUs/TPUs y redes neuronales profundas (Deep Learning).",
        "Ecuación del perceptrón: Y = f(Σ W_i * X_i + b), donde los pesos ponderan entradas y el sesgo desplaza el umbral de decisión.",
        "Funciones de activación clave: Sigmoide (probabilidades [0,1]), ReLU (evita gradiente desvaneciente) y Tanh (centrada en 0 [-1,1]).",
        "En Deep Learning la extracción de características es jerárquica: de píxeles a bordes, de bordes a formas, y de formas a objetos complejos.",
        "Taxonomía de IA: ANI (estrecha/débil, tarea puntual), AGI (general/fuerte, hipotética universal) e IAG (generativa, crea contenido nuevo).",
        "Modelos generativos: GPT (transformers autorregresivos para texto) y GANs (generador vs discriminador en competencia antagónica para medios audiovisuales)."
      ]),
      definitionsJson: JSON.stringify([
        { term: "Neurona Artificial", definition: "Unidad matemática y computacional de procesamiento inspirada en la neurona biológica, que recibe entradas ponderadas por pesos, suma un sesgo y produce una salida a través de una función de activación." },
        { term: "Sesgo (Bias - b)", definition: "Parámetro constante ajustable que desplaza la función de activación horizontalmente, permitiendo que la neurona se active o desactive incluso cuando todas las entradas son cero." },
        { term: "Función Sigmoide", definition: "Función matemática σ(z) = 1 / (1 + e^-z) que comprime cualquier valor real al intervalo (0, 1), ampliamente utilizada para representar probabilidades." },
        { term: "IA Estrecha (ANI)", definition: "Sistema de IA optimizado para ejecutar con alta precisión una tarea específica y predeterminada, sin capacidad de razonamiento transferible a otros dominios." },
        { term: "GAN (Generative Adversarial Network)", definition: "Arquitectura de Deep Learning compuesta por dos redes neuronales rivales: un Generador que produce muestras falsas y un Discriminador que intenta clasificarlas como reales o sintéticas." }
      ]),
      examplesJson: JSON.stringify([
        {
          title: "Cálculo de probabilidad de lluvia (Cátedra UCABA)",
          description: "Entradas: TA=20°C, HA=80%. Pesos: 0.5 y 0.8. Suma = 74. Con bias b=-30, Z=44 -> σ(44)=1 (100%). Al no llover, el reentrenamiento ajusta el bias a b=-74, obteniendo Z=0 -> σ(0)=0.5 (50%)."
        },
        {
          title: "Duelo antagónico en GANs",
          description: "Un falsificador (Generador) intenta crear billetes idénticos a los reales; un policía experto (Discriminador) aprende a detectar las fallas. Con miles de iteraciones, ambos mejoran hasta que el billete generado es indistinguible."
        }
      ]),
      commonMistakesJson: JSON.stringify([
        "Creer que la AGI requiere consciencia o autoconciencia: según la cátedra, la AGI busca igualar la capacidad intelectual y de razonamiento humano, no experimentar sentimientos ni subjetividad biológica.",
        "Confundir pesos (W) con sesgo (b): los pesos multiplican y ponderan directamente las variables de entrada, mientras que el sesgo es un término aditivo que desplaza la frontera de decisión.",
        "Pensar que una red neuronal profunda programa reglas lógicas a mano: la red aprende las reglas y las representaciones jerárquicas automáticamente a partir del ajuste de pesos en el entrenamiento."
      ]),
    },
  });
  console.log(`✅ Resumen 1 creado: "${summary1.title}" (ID: ${summary1.id})`);

  const summary2 = await prisma.summary.create({
    data: {
      classId: class8.id,
      title: "Unidad 11: Técnicas Avanzadas de Prompt Engineering y Formulación de Instrucciones para LLMs",
      overview: "Guía metodológica y sistemática para la formulación de prompts de alto rendimiento con Modelos de Lenguaje Grande (ChatGPT, Claude, Gemini, Copilot, NotebookLM). Desarrolla los 11 pilares esenciales dictados por la cátedra: claridad, asignación de roles, contextualización, delimitadores/placeholders, control de formato, alcance, preguntas interactivas de la IA, few-shot prompting, diseño para audiencia, refinamiento iterativo y meta-prompting.",
      detailedSummary: `## 1. Naturaleza y Ciclo de Vida del Prompt Engineering
El **Prompt Engineering** es la disciplina empírica y metodológica encargada de estructurar las entradas textuales para maximizar la fidelidad, coherencia y utilidad de las respuestas generadas por Modelos de Lenguaje Grande (LLMs).

La cátedra subraya una premisa fundamental:
> **"El desarrollo de prompts efectivos es un proceso iterativo. Es altamente improbable encontrar el prompt óptimo en un primer intento."**

\`\`\`mermaid
flowchart LR
    A[Idea / Problema a resolver] --> B[Diseño e Implementación del Prompt]
    B --> C[Resultados Experimentales de la IA]
    C --> D[Análisis de Errores y Calidad]
    D --> B
\`\`\`

---

## 2. Los 11 Pilares Metodológicos para Prompts de Cátedra

### 1. Claridad en la Pregunta y Reducción de Ambigüedad
- Una formulación difusa conduce a respuestas genéricas o alucinadas.
- *Ejemplo Deficiente:* "Háblame de tecnología."
- *Ejemplo Efectivo:* "¿Cuáles son las tres tendencias disruptivas en Inteligencia Artificial aplicada a la ciberseguridad industrial para 2026?"

### 2. Establecer un Punto de Vista (Role Prompting / Asignación de Identidad)
- Asignar al modelo un rol profesional, especialidad o marco institucional condiciona su vocabulario, nivel de profundidad y prioridades analíticas.
- *Ejemplo de Cátedra:* "Actúa como un científico de renombre internacional con 20 años de trayectoria investigando IA. Explica tu postura sobre cómo la IA transformará la medicina diagnóstica en los próximos 5 años."

### 3. Proporcionar Contexto Situacional Robusto
- Los LLMs operan dentro de una ventana de contexto (*Context Window*). Cuanto más delimitado esté el escenario de negocio o técnico, más afinada será la inferencia.
- *Ejemplo:* "En el marco de la modernización de sistemas legacy de una entidad bancaria con arquitectura monolítica hacia microservicios..."

### 4. Delimitadores y Placeholders
- Utilizar símbolos inequívocos (\`\`\`, ###, <input>, {variable}) para aislar las instrucciones del contenido de prueba o variables.
- Previene ambigüedades e intentos accidentales de inyección de prompts.

### 5. Formato Estricto de Respuesta
- Especificar con exactitud cómo se espera la salida: tablas comparativas Markdown, esquemas JSON tipados, listas numeradas con límite de palabras.

### 6. Limitar el Alcance (Scoping Constraint)
- Restringir la cobertura temporal, geográfica o temática para evitar divagaciones enciclopédicas.
- *Ejemplo:* "Enfócate exclusivamente en las características arquitectónicas del estilo Barroco en Europa occidental durante el siglo XVII."

### 7. Preguntas Activas de la IA (Entrevista Diagnóstica)
- Instruir explícitamente al LLM para que no responda inmediatamente, sino que antes formule preguntas al usuario para clarificar requisitos ambiguos.
- *Fórmula:* *"Antes de generar la propuesta final, haceme las 3 o 4 preguntas críticas que necesites para entender a fondo las restricciones de mi infraestructura."*

### 8. Uso de Ejemplos Concretos (Few-Shot Prompting)
- Ilustrar mediante tuplas de Entrada-Salida el formato, tono y lógica esperada. Reduce drásticamente las variaciones no deseadas.

### 9. Definir la Audiencia Objetivo
- Modular el registro léxico y la complejidad técnica según quién consumirá el documento (estudiantes universitarios, público no técnico, directorio ejecutivo C-Level).

### 10. Iteración y Refinamiento Sistemático
- Analizar las deficiencias de la primera salida (si fue muy extensa, si omitió un parámetro, si inventó una fuente) y ajustar el prompt con restricciones incrementales.

### 11. Meta-Prompting (La IA Diseña su Propio Prompt)
- Solicitar a la propia IA Generativa que redacte el prompt óptimo para una tarea compleja antes de ejecutarla.
- *Flujo:*
  1. El usuario describe su meta general e intenciones.
  2. La IA genera un metaprompt estructurado con roles, restricciones, delimitadores y ejemplos.
  3. El usuario utiliza dicho prompt perfeccionado para la consulta de producción.`,
      simplifiedExplanation: "Escribir un buen prompt no es pedir un deseo como a un genio de la lámpara; es como darle instrucciones a un pasante brillante pero literal: si le decís 'hacé un informe', te va a traer cualquier cosa. Si le decís 'actuá como auditor de sistemas, analizá estos datos que te dejo entre comillas, hacéme preguntas si algo no te cierra y devolveme una tabla con tres columnas en formato markdown para el directorio', el resultado es impecable.",
      keyPointsJson: JSON.stringify([
        "El prompt engineering es un proceso iterativo de ensayo, análisis de errores y refinamiento continuo.",
        "Role Prompting: otorgar un rol específico (ej. científico, auditor) orienta el espacio latente del modelo hacia terminología y profundidad adecuada.",
        "Delimitadores (```, <tags>): aíslan instrucciones operativas de los datos de entrada, evitando confusiones semánticas.",
        "Preguntas interactivas: instruir a la IA a interrogar primero al usuario optimiza la especificación de requerimientos.",
        "Few-shot prompting: proporcionar pares de ejemplo (input-output) asegura la consistencia estructural.",
        "Meta-Prompting: aprovechar la capacidad del propio LLM para sintetizar y formatear el prompt ideal para un objetivo dado."
      ]),
      definitionsJson: JSON.stringify([
        { term: "Prompt Engineering", definition: "Metodología de diseño, optimización y formulación estructurada de instrucciones de entrada para maximizar la calidad y precisión de las respuestas de un modelo de lenguaje (LLM)." },
        { term: "Context Window", definition: "Capacidad máxima de tokens que un LLM puede procesar simultáneamente en una sola llamada de inferencia, abarcando el prompt del sistema, las instrucciones y el historial de diálogo." },
        { term: "Few-Shot Prompting", definition: "Técnica de ingeniería de prompts donde se suministran al modelo dos o más ejemplos demostrativos de entradas y salidas esperadas antes de solicitar la tarea real." },
        { term: "Meta-Prompting", definition: "Técnica que utiliza un modelo de IA generativa para diseñar, evaluar y estructurar el prompt óptimo destinado a resolver una necesidad específica." }
      ]),
      examplesJson: JSON.stringify([
        {
          title: "Comparación de Prompt Básico vs. Avanzado de Cátedra",
          description: "Básico: 'Explicame blockchain'. Avanzado: 'Actuá como un docente de tecnologías digitales. Explicá el concepto de inmutabilidad y consenso en Blockchain para alumnos de primer año de universidad sin conocimientos previos. Usá una analogía cotidiana y limitá la respuesta a 200 palabras.'"
        },
        {
          title: "Uso de Meta-Prompting",
          description: "'Quiero diseñar un asistente para evaluar propuestas de arquitectura cloud. Actuá como un ingeniero en prompts experto y redactame el mejor prompt posible, incluyendo placeholders, formato JSON de salida y preguntas clarificadoras.'"
        }
      ]),
      commonMistakesJson: JSON.stringify([
        "Asumir que el primer prompt debe ser perfecto: la cátedra recalca que el diseño de prompts es inherently experimental e iterativo.",
        "Mezclar datos no delimitados con las órdenes: si pegás un texto sin delimitadores (como comillas o ```), el modelo puede interpretar partes del texto como nuevas instrucciones en lugar de datos a analizar.",
        "No acotar el formato de salida: dejar abierto el formato genera respuestas excesivamente largas o en formatos difíciles de procesar automáticamente."
      ]),
    },
  });
  console.log(`✅ Resumen 2 creado: "${summary2.title}" (ID: ${summary2.id})`);

  // 4. Crear o Actualizar Tópicos Académicos y Vincular con el Examen Parcial
  console.log("\n📚 Creando tópicos de la Unidad 11 vinculados al Examen Parcial...");

  const newTopicsData = [
    {
      name: "Fundamentos de IA y Taxonomía (ANI, AGI, GenAI)",
      importance: "high",
      weight: 15,
    },
    {
      name: "Redes Neuronales Artificiales: Estructura, Pesos, Sesgo y Activación",
      importance: "high",
      weight: 20,
    },
    {
      name: "Modelos Generativos: LLMs, Transformers y GANs",
      importance: "medium",
      weight: 15,
    },
    {
      name: "Técnicas Avanzadas de Prompt Engineering y Meta-Prompting",
      importance: "high",
      weight: 15,
    },
  ];

  for (const tData of newTopicsData) {
    let topic = await prisma.topic.findFirst({
      where: { subjectId: subject.id, name: tData.name },
    });
    if (!topic) {
      topic = await prisma.topic.create({
        data: {
          subjectId: subject.id,
          classId: class8.id,
          name: tData.name,
          importance: tData.importance,
          masteryScore: 20,
        },
      });
      console.log(`  ➕ Tópico creado: ${topic.name}`);
    } else {
      console.log(`  ℹ️ Tópico ya existente: ${topic.name}`);
    }

    // Vincular con el Examen Parcial si no está vinculado
    if (exam) {
      const existingExamTopic = await prisma.examTopic.findFirst({
        where: { examId: exam.id, topicId: topic.id },
      });
      if (!existingExamTopic) {
        await prisma.examTopic.create({
          data: {
            examId: exam.id,
            topicId: topic.id,
          },
        });
        console.log(`  🔗 Tópico "${topic.name}" enlazado al Examen Parcial.`);
      }
    }
  }

  // 5. Crear Flashcards SM-2 Activas para Estudio Inmediato
  console.log("\n🗂️ Generando Flashcards SM-2 para la Unidad 11...");
  const flashcardsData = [
    {
      front: "¿Cómo define la Inteligencia Artificial el marco clásico de Russell & Norvig?",
      back: "Se define como la capacidad de una máquina o sistema computacional de emular funciones cognitivas humanas superiores: percibir, razonar, aprender y resolver problemas.",
    },
    {
      front: "¿Cuáles son los tres impulsores tecnológicos que posibilitaron la actual revolución de la IA?",
      back: "1. Captura ingente de datos (Big Data).\n2. Poder masivo de cómputo y procesamiento paralelo (GPUs/TPUs).\n3. Avance de las redes neuronales y Deep Learning.",
    },
    {
      front: "¿Cuál es la ecuación matemática que describe el funcionamiento de una neurona artificial?",
      back: "Y = f(Σ Wi * Xi + b), donde Xi son las entradas, Wi son los pesos de ponderación, b es el sesgo (bias) y f es la función de activación.",
    },
    {
      front: "¿Qué función cumple el sesgo (bias 'b') en una neurona artificial?",
      back: "Es un parámetro constante ajustable que desplaza el umbral de disparo de la función de activación horizontalmente, permitiendo que la neurona se active o desactive independientemente del valor neto de las entradas.",
    },
    {
      front: "¿Qué caracteriza a la función de activación Sigmoide y en qué rango opera?",
      back: "Tiene la fórmula σ(z) = 1 / (1 + e^-z) y comprime cualquier valor real al rango abierto (0, 1), lo que la hace ideal para modelar probabilidades y decisiones binarias.",
    },
    {
      front: "En el ejercicio de la cátedra de lluvia en CABA, ¿qué ajuste realizó el modelo tras comprobar que no llovió?",
      back: "La salida inicial con b=-30 dio Z=44 y σ(44)≈1 (100% lluvia). Al no llover, por aprendizaje el modelo recalibró el sesgo a b=-74, obteniendo Z=0 y σ(0)=0.5 (50% de probabilidad).",
    },
    {
      front: "¿Cómo funciona la extracción jerárquica de características en una red neuronal convolucional profunda?",
      back: "Las capas iniciales detectan píxeles y bordes simples; las intermedias combinan bordes en formas geométricas básicas; las profundas reconocen partes específicas (ojos, hocico); y la capa final clasifica el objeto completo.",
    },
    {
      front: "¿Cuál es la diferencia fundamental entre IA Estrecha (ANI) e IA General (AGI)?",
      back: "La ANI (estrecha) está diseñada y entrenada para una única tarea puntual (ej. Siri, Netflix). La AGI (general) es una IA hipotética con versatilidad intelectual humana en cualquier disciplina, sin requerir consciencia.",
    },
    {
      front: "¿Cómo se compone la arquitectura de una GAN (Generative Adversarial Network) y cuál es el rol de cada parte?",
      back: "Se compone de dos redes rivales: el Generador (sintetiza datos falsos indistinguibles de los reales) y el Discriminador (aprende a clasificar si una muestra es real o generada).",
    },
    {
      front: "¿Por qué se dice que el Prompt Engineering es un proceso iterativo según la cátedra?",
      back: "Porque es altamente improbable obtener el resultado óptimo en el primer intento. Requiere un ciclo continuo de: formulación del prompt -> prueba experimental -> análisis de errores -> refinamiento de instrucciones.",
    },
    {
      front: "¿En qué consiste la técnica de 'Role Prompting' (Establecer un punto de vista)?",
      back: "Consiste en asignarle a la IA un papel, profesión o identidad determinada (ej. 'Actúa como un científico experto en IA...') para guiar su registro lingüístico, profundidad técnica y enfoque analítico.",
    },
    {
      front: "¿Qué ventaja aporta instruir a la IA para que realice preguntas activas al usuario antes de responder?",
      back: "Permite que el modelo diagnostique y aclare requerimientos o restricciones ambiguas antes de generar la respuesta final, evitando asunciones erróneas o resultados genéricos.",
    },
    {
      front: "¿Qué es el 'Meta-Prompting' según los lineamientos de la cátedra?",
      back: "Es la técnica en la cual se le solicita a la propia IA Generativa que diseñe y estructure el prompt óptimo para resolver una necesidad compleja descrita por el usuario.",
    },
    {
      front: "¿Por qué es crucial utilizar Delimitadores (placeholders, comillas, ```) en los prompts?",
      back: "Porque separan de forma inequívoca las directivas operativas de los datos de entrada o variables a procesar, evitando confusiones semánticas e inyecciones involuntarias.",
    },
  ];

  for (const fc of flashcardsData) {
    const existing = await prisma.flashcard.findFirst({
      where: { subjectId: subject.id, front: fc.front },
    });
    if (!existing) {
      await prisma.flashcard.create({
        data: {
          subjectId: subject.id,
          front: fc.front,
          back: fc.back,
          easeFactor: 2.5,
          interval: 1,
          repetitions: 0,
          nextReviewAt: new Date(), // Disponible de inmediato
        },
      });
    }
  }
  console.log(`✅ Flashcards generadas y activadas para estudio.`);

  // 6. Crear Preguntas de Examen de Simulación
  console.log("\n📝 Generando Preguntas de Examen para la Unidad 11...");
  const questionsData = [
    {
      question: "De acuerdo con la definición formal de Stuart Russell y Peter Norvig estudiada en clase, ¿cuáles son las cuatro funciones cognitivas que una máquina imita para considerarse Inteligencia Artificial?",
      type: "multiple_choice",
      optionsJson: JSON.stringify([
        "Almacenar, compilar, encriptar y sincronizar.",
        "Percibir, razonar, aprender y resolver problemas.",
        "Digitalizar, automatizar, virtualizar y desplegar.",
        "Calcular, transaccionar, distribuir y persistir.",
      ]),
      answer: "Percibir, razonar, aprender y resolver problemas.",
      explanation: "Russell y Norvig definen la IA como el campo donde una máquina emula las funciones cognitivas que los humanos asocian con la mente humana: percibir el entorno, razonar inferencias, aprender de datos/experiencia y resolver problemas complejos.",
    },
    {
      question: "Una neurona artificial tiene dos entradas: X1 = 20 y X2 = 80, con pesos asociados W1 = 0.5 y W2 = 0.8. Si el sesgo (bias) asignado es b = -30, ¿cuál es el valor de entrada neta Z a la función de activación?",
      type: "multiple_choice",
      optionsJson: JSON.stringify([
        "Z = 74",
        "Z = 44",
        "Z = 104",
        "Z = 14",
      ]),
      answer: "Z = 44",
      explanation: "Suma ponderada Σ = (20 * 0.5) + (80 * 0.8) = 10 + 64 = 74. Al incorporar el sesgo b = -30, Z = Σ + b = 74 - 30 = 44. Con la función sigmoide σ(44) tiende a 1.0.",
    },
    {
      question: "Si tras una predicción meteorológica basada en la neurona anterior el modelo verifica que NO llovió, ¿cómo modela la cátedra el ajuste por aprendizaje supervisado?",
      type: "multiple_choice",
      optionsJson: JSON.stringify([
        "Eliminando la entrada de temperatura por considerarla no correlacionada.",
        "Reajustando el sesgo a b = -74 para que la suma neta sea 0 y σ(0) = 0.5 (50% de probabilidad).",
        "Cambiando forzosamente la función sigmoide por una función escalón unitario sin modificar pesos.",
        "Duplicando el peso de la humedad para forzar una predicción negativa.",
      ]),
      answer: "Reajustando el sesgo a b = -74 para que la suma neta sea 0 y σ(0) = 0.5 (50% de probabilidad).",
      explanation: "En la diapositiva de cátedra, se muestra que ante el error 'no llovió', el aprendizaje recalibra el sesgo a b = -74. Así, Z = 74 - 74 = 0, y σ(0) = 1 / (1 + e^0) = 0.5 (probabilidad neutral de 50%).",
    },
    {
      question: "¿Cuál es la función matemática de la función de activación ReLU y qué beneficio clave aporta a las redes neuronales profundas?",
      type: "multiple_choice",
      optionsJson: JSON.stringify([
        "f(x) = 1 / (1 + e^-x); garantiza que la salida sea un valor probabilístico normalizado.",
        "f(x) = max(0, x); evita el desvanecimiento del gradiente en capas profundas y es computacionalmente muy eficiente.",
        "f(x) = (e^x - e^-x) / (e^x + e^-x); centra las activaciones exactamente en cero con simetría impar.",
        "f(x) = x^2 + b; genera fronteras de decisión cuadráticas continuas.",
      ]),
      answer: "f(x) = max(0, x); evita el desvanecimiento del gradiente en capas profundas y es computacionalmente muy eficiente.",
      explanation: "ReLU (Rectified Linear Unit) computa f(x) = max(0, x). Al tener derivada constante igual a 1 para todo x > 0, previene el desvanecimiento del gradiente (vanishing gradient) que sufre la función sigmoide en redes profundas.",
    },
    {
      question: "¿Cómo se clasifica a sistemas como Siri, Alexa o el recomendador de películas de Netflix según la taxonomía de la cátedra?",
      type: "multiple_choice",
      optionsJson: JSON.stringify([
        "IA General o Fuerte (AGI), porque interactúan con millones de usuarios en tiempo real.",
        "IA Estrecha o Débil (ANI), porque están entrenadas y optimizadas para tareas específicas y acotadas.",
        "IA Simbólica Pura, porque no emplean modelos estadísticos ni redes neuronales.",
        "IA Consciente, porque adaptan sus respuestas a las preferencias de los usuarios.",
      ]),
      answer: "IA Estrecha o Débil (ANI), porque están entrenadas y optimizadas para tareas específicas y acotadas.",
      explanation: "Son ejemplos clásicos de Artificial Narrow Intelligence (ANI) o IA Estrecha/Débil: realizan una tarea especializada de forma excelente pero no pueden razonar ni transferir su aprendizaje fuera de ese dominio específico.",
    },
    {
      question: "En el entrenamiento de una Red Generativa Antagónica (GAN) para imágenes, ¿cuál es el objetivo específico de la red 'Discriminador'?",
      type: "multiple_choice",
      optionsJson: JSON.stringify([
        "Sintetizar ruido gaussiano para confundir al generador.",
        "Aprender a distinguir entre imágenes reales provenientes del dataset y las imágenes sintéticas creadas por el generador.",
        "Comprimir las imágenes en un vector latente de baja dimensión para guardarlas en base de datos.",
        "Ajustar los hiperparámetros de la tasa de aprendizaje de forma estocástica.",
      ]),
      answer: "Aprender a distinguir entre imágenes reales provenientes del dataset y las imágenes sintéticas creadas por el generador.",
      explanation: "El Discriminador en una GAN actúa como un clasificador binario que evalúa si una muestra es auténtica (del dataset real) o falsa (producida por el Generador), mientras el Generador compite para engañarlo.",
    },
    {
      question: "En el contexto de Prompt Engineering para LLMs, ¿en qué consiste la técnica de 'Few-Shot Prompting'?",
      type: "multiple_choice",
      optionsJson: JSON.stringify([
        "Hacer una única pregunta extremadamente breve de menos de 5 palabras.",
        "Proporcionar al modelo varios ejemplos concretos de pares entrada-salida demostrativos antes de pedirle la respuesta final.",
        "Obligar al modelo a responder en menos de tres segundos de inferencia.",
        "Reiniciar la sesión de chat después de cada mensaje para evitar saturar la memoria.",
      ]),
      answer: "Proporcionar al modelo varios ejemplos concretos de pares entrada-salida demostrativos antes de pedirle la respuesta final.",
      explanation: "El Few-Shot Prompting consiste en suministrar al modelo algunos ejemplos ilustrativos de entradas y salidas esperadas para guiar su formato, tono y razonamiento sin necesidad de reentrenar sus pesos.",
    },
    {
      question: "¿A qué se refiere el principio de 'Meta-Prompting' expuesto en los materiales de cátedra?",
      type: "multiple_choice",
      optionsJson: JSON.stringify([
        "A utilizar herramientas de Meta (Facebook) para ejecutar modelos LLaMA.",
        "A solicitarle a la propia IA Generativa que formule y diseñe el prompt óptimo a partir de nuestras necesidades antes de realizar la consulta.",
        "A encadenar llamadas HTTP sincrónicas entre distintos proveedores de LLMs.",
        "A desactivar el token de parada para que el modelo escriba sin restricciones de longitud.",
      ]),
      answer: "A solicitarle a la propia IA Generativa que formule y diseñe el prompt óptimo a partir de nuestras necesidades antes de realizar la consulta.",
      explanation: "El material de cátedra define explícitamente: 'Pedirle a la IAG que genere el prompt óptimo para la necesidad que tienes. Le explicas tus requerimientos y que la propia IA diseñe el mejor prompt posible para luego realizar la consulta con dicho prompt.'",
    },
  ];

  for (const q of questionsData) {
    const existing = await prisma.question.findFirst({
      where: { subjectId: subject.id, question: q.question },
    });
    if (!existing) {
      await prisma.question.create({
        data: {
          subjectId: subject.id,
          classId: class8.id,
          question: q.question,
          type: q.type,
          optionsJson: q.optionsJson,
          answer: q.answer,
          explanation: q.explanation,
        },
      });
    }
  }
  console.log(`✅ Preguntas de simulación de examen generadas.`);

  // Verificación de totales actualizados
  const totalMaterials = await prisma.material.count({ where: { subjectId: subject.id } });
  const totalSummaries = await prisma.summary.count({ where: { classSession: { subjectId: subject.id } } });
  const totalCards = await prisma.flashcard.count({ where: { subjectId: subject.id } });
  const totalQuestions = await prisma.question.count({ where: { subjectId: subject.id } });
  const totalTopics = await prisma.topic.count({ where: { subjectId: subject.id } });

  console.log("\n📊 BALANCE ACADÉMICO PARA SISTEMAS DIGITALES TRAS INGESTA:");
  console.log(`- Materiales totales: ${totalMaterials}`);
  console.log(`- Resúmenes totales: ${totalSummaries}`);
  console.log(`- Flashcards totales: ${totalCards} (listas para SM-2)`);
  console.log(`- Preguntas de examen: ${totalQuestions}`);
  console.log(`- Tópicos de estudio: ${totalTopics}`);
}

main()
  .catch((e) => {
    console.error("❌ Error en la ingesta:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
