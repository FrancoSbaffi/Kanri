import prisma from "../lib/db/prisma";

async function main() {
  console.log("📝 Sembrando banco de preguntas oficiales de cátedra para simulacros...");

  const subject = await prisma.subject.findFirst({
    where: { name: { contains: "Emprendedurismo" } },
    include: { classes: true, topics: true },
  });

  if (!subject) throw new Error("Materia no encontrada");

  const classMap = new Map(subject.classes.map((c) => [c.classNumber, c]));

  const examQuestions = [
    {
      classNumber: 1,
      question: "Según la investigación de Bill Gross (Idealab) sobre más de 100 startups, ¿cuál es el factor individual más determinante para el éxito de un emprendimiento?",
      options: [
        "La originalidad y grado de disrupción de la idea inicial",
        "El Timing (momento de madurez del mercado y la sociedad), explicando un 42% del éxito",
        "El volumen de financiamiento de rondas Seed y Serie A",
        "Tener el Business Model Canvas 100% definido antes de salir a la calle"
      ],
      answer: "El Timing (momento de madurez del mercado y la sociedad), explicando un 42% del éxito",
      explanation: "Bill Gross demostró que el Timing explica el 42% del éxito, superando a Equipo (32%), Idea (28%), Modelo (24%) y Financiamiento (14%). La ejecución importa, pero el timing importa aún más.",
      difficulty: "easy",
      type: "multiple_choice"
    },
    {
      classNumber: 1,
      question: "De acuerdo con el axioma de cátedra, ¿cuál es la razón fundamental por la que quiebran o cierran la mayoría de los emprendimientos?",
      options: [
        "Por deficiencias técnicas insalvables en el código o proceso productivo",
        "Por falta de clientes y validación real de mercado ('no fallan por buenos o malos servicios: fallan porque no hay clientes')",
        "Por desavenencias legales irresolubles en el pacto de socios inicial",
        "Por cobrar precios inferiores a la media de la competencia"
      ],
      answer: "Por falta de clientes y validación real de mercado ('no fallan por buenos o malos servicios: fallan porque no hay clientes')",
      explanation: "El mercado manda: una empresa con un producto perfecto fracasará inexorablemente si no existe demanda real con disposición a pagar.",
      difficulty: "easy",
      type: "multiple_choice"
    },
    {
      classNumber: 1,
      question: "¿Cuál de las siguientes afirmaciones describe con precisión la diferencia entre el Mapa de Empatía y la Propuesta de Valor Canvas?",
      options: [
        "El Mapa de Empatía analiza los costos financieros de la empresa, mientras la Propuesta de Valor mide la competencia",
        "El Mapa de Empatía se centra holísticamente en la psicología y entorno del cliente; la Propuesta de Valor Canvas diseña el encaje bidireccional entre los dolores/alegrías del cliente y los productos/aliviadores del negocio",
        "Son herramientas idénticas que solo cambian de nombre según el autor",
        "La Propuesta de Valor se utiliza únicamente en empresas del Estado"
      ],
      answer: "El Mapa de Empatía se centra holísticamente en la psicología y entorno del cliente; la Propuesta de Valor Canvas diseña el encaje bidireccional entre los dolores/alegrías del cliente y los productos/aliviadores del negocio",
      explanation: "El Mapa de Empatía describe a la persona (qué ve, oye, siente, dolores y aspiraciones). El Canvas de Propuesta de Valor conecta ese perfil con los aliviadores de frustraciones y creadores de ganancias específicos de nuestra solución.",
      difficulty: "medium",
      type: "multiple_choice"
    },
    {
      classNumber: 1,
      question: "¿Cuál es la estructura canónica en 5 fases de un Elevator Pitch de alto impacto enseñada en el Taller?",
      options: [
        "1. Saludo, 2. Biografía del fundador, 3. Balance contable, 4. Código fuente, 5. Despedida",
        "1. Introducción (10-15s), 2. Problema (15-30s), 3. Solución (15-30s), 4. Propuesta de Valor/Beneficios (15-30s), 5. Llamado a la Acción / CTA (5-10s)",
        "1. Pedido de dinero, 2. Idea, 3. Costos, 4. Equipo, 5. Agradecimiento",
        "1. Misión, 2. Visión, 3. PEST, 4. FODA, 5. Conclusiones"
      ],
      answer: "1. Introducción (10-15s), 2. Problema (15-30s), 3. Solución (15-30s), 4. Propuesta de Valor/Beneficios (15-30s), 5. Llamado a la Acción / CTA (5-10s)",
      explanation: "Un pitch de ascensor de 30 a 120 segundos debe seguir rigurosamente estas 5 fases, rematando siempre con una llamada a la acción concreta (reunión, demo o contacto).",
      difficulty: "easy",
      type: "multiple_choice"
    },
    {
      classNumber: 2,
      question: "En el diseño estratégico, ¿qué diferencia sustancial existe entre la Misión y la Visión de una empresa como Apple?",
      options: [
        "La Misión es para los accionistas y la Visión es para los clientes",
        "La Misión es extrospectiva, concreta y del día a día (qué hacemos, para quién y cómo); la Visión es la imagen aspiracional y el estado deseado a largo plazo",
        "La Misión se redacta a 20 años y la Visión cambia todos los meses",
        "Son conceptos sinónimos intercambiables según el manual contable"
      ],
      answer: "La Misión es extrospectiva, concreta y del día a día (qué hacemos, para quién y cómo); la Visión es la imagen aspiracional y el estado deseado a largo plazo",
      explanation: "Misión Apple: 'Diseñar los mejores productos y enriquecer vidas hoy'. Visión Apple: 'Ser la empresa más innovadora del mundo y dejar una huella imborrable en la sociedad'.",
      difficulty: "medium",
      type: "multiple_choice"
    },
    {
      classNumber: 2,
      question: "¿Cuáles son las dos premisas fundamentales de Paul Graham (Y Combinator) enfatizadas por los docentes del taller?",
      options: [
        "'Buscá financiamiento rápido' y 'Copia lo que funciona en Silicon Valley'",
        "'Hacé cosas que la gente quiera' y 'Enamorate del problema, no de la idea'",
        "'Registrá la patente primero' y 'Nunca compartas tu idea'",
        "'Priorizá la rentabilidad financiera por encima de la satisfacción del usuario'"
      ],
      answer: "'Hacé cosas que la gente quiera' y 'Enamorate del problema, no de la idea'",
      explanation: "Paul Graham insiste en que las ideas deben mutar con agilidad según el mercado, mientras que el dolor y la necesidad real del cliente deben ser el centro obsesivo del equipo.",
      difficulty: "easy",
      type: "multiple_choice"
    },
    {
      classNumber: 2,
      question: "De acuerdo con el modelo de Posicionamiento Competitivo de Michael Porter, ¿cómo se clasifica a una aerolínea low-cost como Flybondi o Ryanair?",
      options: [
        "Líder en Diferenciación por experiencia a bordo",
        "Líder en Costos, sustentada en estandarización extrema de flota, alta rotación de aeronaves y cobro de todo adicional",
        "Estrategia Dual de lujo accesible",
        "Foco en Nichos de aviación ejecutiva"
      ],
      answer: "Líder en Costos, sustentada en estandarización extrema de flota, alta rotación de aeronaves y cobro de todo adicional",
      explanation: "El liderazgo en costos busca la tarifa base más baja posible mediante volumen, economías de escala y eliminación de costos superfluos.",
      difficulty: "easy",
      type: "multiple_choice"
    },
    {
      classNumber: 2,
      question: "¿Qué evento tecnológico y de mercado marca la transición entre la etapa de Introducción y Crecimiento en el Ciclo de Vida de una Industria?",
      options: [
        "La quiebra del competidor más pequeño",
        "La consolidación del 'Diseño Dominante', que estandariza los formatos y habilita la producción a escala",
        "El inicio de la regulación de precios por parte del gobierno",
        "La caída generalizada de los salarios industriales"
      ],
      answer: "La consolidación del 'Diseño Dominante', que estandariza los formatos y habilita la producción a escala",
      explanation: "El diseño dominante cierra la fase de exploración experimental y abre paso a la penetración masiva y a la guerra de escalas.",
      difficulty: "hard",
      type: "multiple_choice"
    },
    {
      classNumber: 2,
      question: "¿Cuáles son los tres componentes del 'Triángulo de la Estrategia Exitosa' enseñado en clase?",
      options: [
        "1. Abogados, 2. Contadores, 3. Inversores",
        "1. Objetivos simples y consistentes (Misión/Visión), 2. Recursos y capacidades internas (Cómo competir), 3. Conocimiento profundo del entorno competitivo (Dónde competir)",
        "1. Facebook, 2. Google, 3. TikTok",
        "1. Costo, 2. Venta, 3. Margen bruto"
      ],
      answer: "1. Objetivos simples y consistentes (Misión/Visión), 2. Recursos y capacidades internas (Cómo competir), 3. Conocimiento profundo del entorno competitivo (Dónde competir)",
      explanation: "La estrategia exitosa alinea los objetivos institucionales con las capacidades internas (ventajas competitivas) y el entorno de mercado (posicionamiento).",
      difficulty: "medium",
      type: "multiple_choice"
    },
    {
      classNumber: 4,
      question: "Según Peter Drucker (1979), ¿cuál es el cambio de paradigma esencial que define al verdadero marketing?",
      options: [
        "Invertir el 50% de los ingresos brutos en anuncios de televisión",
        "No preguntarse '¿Qué queremos vender?', sino '¿Qué quiere comprar el cliente?'; no decir 'Esto es lo que hace el producto', sino 'Estas son las satisfacciones que busca el consumidor'",
        "Convencer a las personas de adquirir cosas que no necesitan mediante psicología inversa",
        "Bajar los precios hasta quebrar a los competidores locales"
      ],
      answer: "No preguntarse '¿Qué queremos vender?', sino '¿Qué quiere comprar el cliente?'; no decir 'Esto es lo que hace el producto', sino 'Estas son las satisfacciones que busca el consumidor'",
      explanation: "Drucker sentó las bases del enfoque 'Customer-Centric': el producto debe nacer de la necesidad y satisfacción buscada por el cliente, nunca del capricho de producción de la empresa.",
      difficulty: "easy",
      type: "multiple_choice"
    },
    {
      classNumber: 4,
      question: "En la teoría del comportamiento del consumidor, ¿cómo se encadenan Necesidades, Deseos y Demandas?",
      options: [
        "Las Demandas generan Necesidades y estas se convierten en Deseos",
        "Las Necesidades son estados de carencia biológica o social; se transforman en Deseos moldeados por la cultura y la personalidad, y estimulan Demandas cuando están respaldadas por poder adquisitivo real",
        "Son tres palabras idénticas utilizadas como sinónimos en publicidad",
        "El marketing crea las necesidades primarias de la nada"
      ],
      answer: "Las Necesidades son estados de carencia biológica o social; se transforman en Deseos moldeados por la cultura y la personalidad, y estimulan Demandas cuando están respaldadas por poder adquisitivo real",
      explanation: "El marketing no crea la necesidad de alimentarse o comunicarse; influye en el deseo (ej. querer una hamburguesa gourmet o un iPhone) y captura la demanda solvente.",
      difficulty: "medium",
      type: "multiple_choice"
    },
    {
      classNumber: 4,
      question: "¿Qué representa cada letra del modelo CUPID en el análisis del proceso de decisión y compra?",
      options: [
        "Costo, Utilidad, Precio, Interés, Descuento",
        "Comprador (quien ejecuta la transacción), Usuario (quien consume el bien), Pagador (quien financia), Influenciador (quien recomienda u opina) y Decisor (quien tiene la última palabra)",
        "Calidad, Usabilidad, Prontitud, Innovación, Durabilidad",
        "Cliente, Ubicación, Promoción, Ingresos, Demanda"
      ],
      answer: "Comprador (quien ejecuta la transacción), Usuario (quien consume el bien), Pagador (quien financia), Influenciador (quien recomienda u opina) y Decisor (quien tiene la última palabra)",
      explanation: "El modelo CUPID permite mapear compras complejas donde quien usa el producto (ej. un empleado contable o un hijo) no es quien decide la compra ni quien pone el dinero.",
      difficulty: "easy",
      type: "multiple_choice"
    },
    {
      classNumber: 4,
      question: "¿Cuál es la relación matemática ineludible que debe verificarse en las Decisiones de Precio de cualquier emprendimiento viable?",
      options: [
        "Precio = Costo + 10% obligatorio",
        "COSTO < PRECIO <= VALOR PERCIBIDO",
        "Precio > Valor percibido para maximizar la rentabilidad",
        "Costo > Precio para subsidiar la cuota de mercado"
      ],
      answer: "COSTO < PRECIO <= VALOR PERCIBIDO",
      explanation: "Si Costo >= Precio, la empresa destruye valor y quiebra. Si Precio > Valor, el cliente no compra porque siente que lo están estafando. El precio debe flotar entre el piso del costo y el techo del valor.",
      difficulty: "medium",
      type: "multiple_choice"
    },
    {
      classNumber: 4,
      question: "En el dimensionamiento de mercado de un proyecto digital, ¿cuál es el significado correcto de las métricas TAM, SAM y SOM?",
      options: [
        "TAM: Tarifa Anual Media; SAM: Saldo Actual Monetario; SOM: Sistema Operativo de Mercado",
        "TAM: Total Available Market (universo total); SAM: Serviceable Available Market (mercado alcanzable con nuestra tecnología); SOM: Serviceable Obtainable Market (objetivo real a corto plazo)",
        "TAM: Tasa de Amplitud Mínima; SAM: Segmento de Alto Margen; SOM: Solución Óptima de Marketing",
        "Representan los tres niveles de costos fijos de un negocio"
      ],
      answer: "TAM: Total Available Market (universo total); SAM: Serviceable Available Market (mercado alcanzable con nuestra tecnología); SOM: Serviceable Obtainable Market (objetivo real a corto plazo)",
      explanation: "El TAM representa el 100% teórico de la industria, el SAM acota a quienes podemos servir con nuestro modelo y el SOM es la meta tangible y medible del plan de ventas inicial.",
      difficulty: "easy",
      type: "multiple_choice"
    },
    {
      classNumber: 4,
      question: "¿A qué hace referencia la 'Amplitud' versus la 'Profundidad' dentro de las decisiones de Producto del Marketing Mix?",
      options: [
        "La Amplitud es el tamaño del local físico y la Profundidad es el subsuelo del depósito",
        "La Amplitud es la cantidad de gamas o líneas de productos distintas que ofrece la empresa; la Profundidad es el número de artículos específicos o variantes dentro de cada gama",
        "La Amplitud mide los años de garantía y la Profundidad el costo de reposición",
        "Son conceptos exclusivos de la logística portuaria"
      ],
      answer: "La Amplitud es la cantidad de gamas o líneas de productos distintas que ofrece la empresa; la Profundidad es el número de artículos específicos o variantes dentro de cada gama",
      explanation: "Coca-Cola tiene amplitud de gamas (gaseosas, aguas Kin, jugos Cepita, isotónicos Powerade) y profundidad en cada una (Coca-Cola Original, Zero, Light en presentaciones de 500ml, 1.5L, 2.25L).",
      difficulty: "medium",
      type: "multiple_choice"
    },
    {
      classNumber: 4,
      question: "¿Cuáles son las 4 fases secuenciales del Embudo de Comunicación dentro de las decisiones de Promoción?",
      options: [
        "1. Diseño, 2. Impresión, 3. Reparto, 4. Facturación",
        "1. Conocimiento (Awareness) -> 2. Consideración -> 3. Compra -> 4. Lealtad (Fidelización)",
        "1. Descuento -> 2. Reclamo -> 3. Devolución -> 4. Cierre",
        "1. PEST -> 2. FODA -> 3. BCG -> 4. Canvas"
      ],
      answer: "1. Conocimiento (Awareness) -> 2. Consideración -> 3. Compra -> 4. Lealtad (Fidelización)",
      explanation: "El cliente primero debe enterarse de que existimos (conocimiento), luego evaluar si nuestra propuesta resuelve su problema (consideración), efectuar la transacción (compra) y finalmente convertirse en promotor recurrente (lealtad).",
      difficulty: "easy",
      type: "multiple_choice"
    }
  ];

  let added = 0;
  for (const q of examQuestions) {
    const classSession = classMap.get(q.classNumber);
    const existing = await prisma.question.findFirst({
      where: {
        subjectId: subject.id,
        question: q.question,
      },
    });

    if (!existing) {
      await prisma.question.create({
        data: {
          subjectId: subject.id,
          classId: classSession ? classSession.id : null,
          question: q.question,
          optionsJson: JSON.stringify(q.options),
          answer: q.answer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          type: q.type,
        },
      });
      added++;
    }
  }

  console.log(`✅ Se agregaron ${added} preguntas oficiales al banco de examen de Taller de Emprendedurismo.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
