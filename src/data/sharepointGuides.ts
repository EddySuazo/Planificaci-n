import { OfficialCurriculumSequence } from '../types';

export interface SharePointGuide {
  id: string;
  grupo: 'Secuencias Didácticas 3er Grado' | 'Secuencias Didácticas 4to Grado' | 'Secuencias Didácticas 5to Grado' | 'Secuencias Didácticas 6to Grado' | 'Marcos Normativos y Formatos Oficiales';
  label: string;
  grado: string;
  area: string;
  nivel: 'Inicial' | 'Primario' | 'Secundario';
  ciclo: 'Primer Ciclo' | 'Segundo Ciclo';
  paginas: number;
  totalSecuencias: number;
  descripcion: string;
  secuenciasSugeridas: {
    numero: number;
    titulo: string;
    unidad: string;
    situacionAprendizaje: string;
    competenciasFundamentales: string[];
    competenciasEspecificas: string[];
    contenidosConceptuales: string[];
    contenidosProcedimentales: string[];
    contenidosActitudinales: string[];
    indicadoresLogro: string[];
    actividadInicio: string;
    actividadDesarrollo: string;
    actividadCierre: string;
  }[];
}

export const SHAREPOINT_OFFICIAL_GUIDES: SharePointGuide[] = [
  // ==================== 3ER GRADO ====================
  {
    id: 'sec_3_lengua',
    grupo: 'Secuencias Didácticas 3er Grado',
    label: '3er Grado - Lengua Española (132 págs, 8 secuencias)',
    grado: '3ro de Primaria',
    area: 'Lengua Española',
    nivel: 'Primario',
    ciclo: 'Primer Ciclo',
    paginas: 132,
    totalSecuencias: 8,
    descripcion: 'Guía oficial de secuencias didácticas de Lengua Española para 3er grado de Primaria (132 páginas, 8 secuencias). Énfasis en comprensión y producción de textos funcionales y narrativos.',
    secuenciasSugeridas: [
      {
        numero: 1,
        titulo: 'Secuencia 1: La Noticia Comunitaria y la Convivencia Escolar',
        unidad: 'Unidad 1: Textos Informativos y Periodísticos',
        situacionAprendizaje: 'Los estudiantes de 3er grado notan que en su comunidad escolar suceden eventos interesantes que no todos conocen. Deciden convertirse en pequeños periodistas escolares para redactar y publicar un periódico mural con noticias verídicas sobre actividades educativas y ambientales.',
        competenciasFundamentales: ['Comunicativa', 'Pensamiento Lógico, Creativo y Crítico', 'Ética y Ciudadana'],
        competenciasEspecificas: [
          'Comprende noticias orales y escritas sobre acontecimientos de la comunidad escolar.',
          'Produce noticias breves respondiendo a las preguntas qué, quién, cuándo, dónde y cómo.'
        ],
        contenidosConceptuales: [
          'La noticia: concepto, estructura canónica (titular, entrada, cuerpo y foto/pie de foto).',
          'Preguntas clave del periodismo informativo (¿Qué?, ¿Quién?, ¿Dónde?, ¿Cuándo?).',
          'Los verbos en tiempo pasado para relatar hechos ocurridos.'
        ],
        contenidosProcedimentales: [
          'Identificación de los elementos de la noticia en diarios impresos y digitales.',
          'Planificación, redacción del borrador y revisión colectiva de noticias escolares.',
          'Uso del punto, la coma y la concordancia de género y número.'
        ],
        contenidosActitudinales: [
          'Valoración de la verdad y la veracidad al comunicar informaciones.',
          'Respeto por el derecho a la información de toda la comunidad educativa.'
        ],
        indicadoresLogro: [
          'Reconoce la estructura de la noticia diferenciándola de cuentos y fábulas.',
          'Redacta noticias sencillas respondiendo al menos a cuatro de las preguntas básicas.',
          'Aplica la mayúscula inicial y el punto al finalizar cada oración.'
        ],
        actividadInicio: 'Rutina de saludo, lectura de una noticia breve de actualidad y preguntas sobre qué ocurrió y a quién.',
        actividadDesarrollo: 'Taller de escritura: en parejas, los estudiantes seleccionan un hecho escolar reciente y redactan el titular y las respuestas a las 4 preguntas guía.',
        actividadCierre: 'Puntualizaciones del docente en 10 minutos. Lectura voluntaria de titulares creados. Metacognición: ¿Por qué es importante que las noticias digan la verdad?'
      },
      {
        numero: 2,
        titulo: 'Secuencia 2: La Receta de Cocina y la Alimentación Sana Tradicional',
        unidad: 'Unidad 2: Textos Instructivos y Salud',
        situacionAprendizaje: 'Para promover una merienda escolar nutritiva, los alumnos investigan recetas familiares dominicanas a base de frutas y vegetales, reconociendo el formato instructivo de ingredientes y preparación.',
        competenciasFundamentales: ['Ambiental y de la Salud', 'Comunicativa', 'Resolución de Problemas'],
        competenciasEspecificas: [
          'Comprende recetas que escucha o lee para preparar platos sencillos y saludables.',
          'Produce recetas escritas respetando título, lista de ingredientes y pasos numerados.'
        ],
        contenidosConceptuales: [
          'La receta: función social, formato e importancia en la cocina cotidiana.',
          'Estructura: Título, Ingredientes (cantidades y medidas) y Modo de Preparación.',
          'Verbos de acción e imperativos (mezclar, picar, lavar, servir).'
        ],
        contenidosProcedimentales: [
          'Seguimiento paso a paso de instrucciones culinarias.',
          'Uso de conectores de orden cronológico (primero, luego, después, finalmente).',
          'Elaboración del recetario escolar ilustrado.'
        ],
        contenidosActitudinales: [
          'Aprecio por las tradiciones gastronómicas y la higiene en la manipulación de alimentos.',
          'Colaboración ordenada en tareas de equipo.'
        ],
        indicadoresLogro: [
          'Ordena cronológicamente los pasos para preparar un plato siguiendo un texto instructivo.',
          'Escribe una receta respetando la diferenciación entre ingredientes y pasos.',
          'Utiliza conectores de secuencia temporales con propiedad.'
        ],
        actividadInicio: 'Conversatorio sobre el desayuno escolar dominicano y observación de una ficha de receta de ensalada de frutas tropicales.',
        actividadDesarrollo: 'Los alumnos clasifican palabras en "ingredientes" o "acciones de preparación" y redactan los 3 pasos de una receta saludable.',
        actividadCierre: 'Sistematización: dos equipos leen sus recetas. Reflexión: ¿Qué sucedería si cambiamos el orden de los pasos en una receta?'
      }
    ]
  },
  {
    id: 'sec_3_mat',
    grupo: 'Secuencias Didácticas 3er Grado',
    label: '3er Grado - Matemática (320 págs, 7 secuencias)',
    grado: '3ro de Primaria',
    area: 'Matemática',
    nivel: 'Primario',
    ciclo: 'Primer Ciclo',
    paginas: 320,
    totalSecuencias: 7,
    descripcion: 'Guía oficial de secuencias didácticas de Matemática para 3er grado de Primaria (320 páginas, 7 secuencias). Sentido numérico hasta millares, sumas y restas con reagrupación y noción de multiplicación.',
    secuenciasSugeridas: [
      {
        numero: 1,
        titulo: 'Secuencia 1: Números Naturales hasta el 9,999 y Valor Posicional',
        unidad: 'Unidad 1: Sentido Numérico y Conteo',
        situacionAprendizaje: 'Los niños participan en el inventario de la biblioteca del centro escolar y en la recaudación de fondos para materiales deportivos, requiriendo contar, agrupar en centenas y millares y registrar cifras monetarias.',
        competenciasFundamentales: ['Pensamiento Lógico, Creativo y Crítico', 'Resolución de Problemas'],
        competenciasEspecificas: [
          'Razona y argumenta: Reconoce el valor posicional de los dígitos en números de hasta cuatro cifras.',
          'Comunica: Lee y escribe cantidades monetarias y de conteo hasta 9,999.'
        ],
        contenidosConceptuales: [
          'Números naturales hasta 9,999: unidades, decenas, centenas y unidades de mil.',
          'Valor posicional y descomposición aditiva.',
          'Comparación y ordenamiento con los símbolos <, > e =.'
        ],
        contenidosProcedimentales: [
          'Representación de números con ábacos, material base 10 y dinero lúdico dominicano.',
          'Descomposición de cantidades en millares, centenas, decenas y unidades.',
          'Resolución de situaciones de conteo y estimación.'
        ],
        contenidosActitudinales: [
          'Interés en el orden y precisión al realizar conteos y registros numéricos.',
          'Confianza en las propias capacidades matemáticas.'
        ],
        indicadoresLogro: [
          'Compone y descompone números de hasta cuatro cifras según su valor posicional.',
          'Compara y ordena números hasta 9,999 justificando su respuesta.',
          'Resuelve problemas de conteo en contextos de la vida diaria.'
        ],
        actividadInicio: 'Juego de agilidad mental: "Adivina el número de 4 cifras con pistas de centenas y millares".',
        actividadDesarrollo: 'Uso de billetes de fantasía de RD$1,000, RD$100, RD$10 y RD$1 para formar cantidades y registrarlas en la tabla de valor posicional.',
        actividadCierre: 'Puntualizaciones docentes sobre el cero como marcador posicional. Metacognición: ¿Cómo me ayuda la descomposición a sumar más rápido?'
      }
    ]
  },

  // ==================== 4TO GRADO ====================
  {
    id: 'sec_4_lengua',
    grupo: 'Secuencias Didácticas 4to Grado',
    label: '4to Grado - Lengua Española (212 págs, 10 secuencias)',
    grado: '4to de Primaria',
    area: 'Lengua Española',
    nivel: 'Primario',
    ciclo: 'Segundo Ciclo',
    paginas: 212,
    totalSecuencias: 10,
    descripcion: 'Guía oficial de secuencias didácticas de Lengua Española para 4to grado (212 páginas, 10 secuencias). El informe de lectura, la conversación, la biografía y la carta de solicitud.',
    secuenciasSugeridas: [
      {
        numero: 2,
        titulo: 'Secuencia 2: El Informe de Lectura y la Carta de Solicitud de Permiso',
        unidad: 'Unidad 3: Textos Funcionales y Producción Escrita en la Escuela',
        situacionAprendizaje: 'Los estudiantes desean solicitar a la dirección del centro educativo el permiso y apoyo para organizar un rincón de lectura escolar. Para convencer a las autoridades, leen cuentos de autores dominicanos, redactan un informe de lectura estructurado y envían una carta formal de solicitud.',
        competenciasFundamentales: ['Comunicativa', 'Pensamiento Lógico, Creativo y Crítico', 'Ética y Ciudadana'],
        competenciasEspecificas: [
          'Comprensión escrita: Lee y analiza la silueta textual del informe de lectura y de la carta formal.',
          'Producción escrita: Produce informes de lectura respetando estructura, coherencia y corrección gramatical.'
        ],
        contenidosConceptuales: [
          'El informe de lectura: concepto, función y estructura canónica (título, introducción, resumen, valoración personal).',
          'La carta formal de solicitud: encabezado, destinatario, exposición de motivos y firma.',
          'Conectores de orden, causa y adición.'
        ],
        contenidosProcedimentales: [
          'Identificación de los elementos fundamentales de un texto narrativo.',
          'Planificación, escritura del borrador y edición del informe.',
          'Aplicación de reglas de concordancia de género y número.'
        ],
        contenidosActitudinales: [
          'Gusto e interés por la lectura de obras de autores dominicanos.',
          'Aprecio por el valor de la palabra escrita para canalizar solicitudes con respeto.'
        ],
        indicadoresLogro: [
          'Distingue el informe de lectura de otros textos a partir de su función y estructura.',
          'Reconoce y utiliza conectores de causa (porque, ya que) y orden (primero, luego, finalmente).',
          'Elabora borradores del informe de lectura incorporando correcciones del docente.'
        ],
        actividadInicio: 'Rutina diaria, lectura colectiva de un fragmento de autor dominicano y activación de saberes sobre cómo resumir.',
        actividadDesarrollo: 'Modelado en pizarra de la silueta del informe de lectura y redacción en parejas de la valoración personal fundamentada.',
        actividadCierre: 'Puntualizaciones sobre el uso de conectores. Dos parejas leen su valoración. Metacognición reflexiva.'
      }
    ]
  },
  {
    id: 'sec_4_mat',
    grupo: 'Secuencias Didácticas 4to Grado',
    label: '4to Grado - Matemática (285 págs, 8 secuencias)',
    grado: '4to de Primaria',
    area: 'Matemática',
    nivel: 'Primario',
    ciclo: 'Segundo Ciclo',
    paginas: 285,
    totalSecuencias: 8,
    descripcion: 'Guía oficial de secuencias didácticas de Matemática para 4to grado (285 páginas, 8 secuencias). Millones, multiplicación por 2 y 3 dígitos, división exacta e inexacta y fracciones.',
    secuenciasSugeridas: [
      {
        numero: 1,
        titulo: 'Secuencia 1: Números hasta el Millón y Operaciones en Contextos Económicos',
        unidad: 'Unidad 1: Los Números Grandes en la Vida Diaria',
        situacionAprendizaje: 'Los alumnos investigan los presupuestos municipales y los datos de producción de cacao y café en el país, enfrentando cifras de más de seis dígitos que deben leer, comparar y operar.',
        competenciasFundamentales: ['Pensamiento Lógico, Creativo y Crítico', 'Resolución de Problemas', 'Científica y Tecnológica'],
        competenciasEspecificas: [
          'Razona y argumenta sobre el sistema de numeración decimal y el valor posicional hasta los millones.',
          'Modela y resuelve problemas de adición, sustracción y multiplicación con números grandes.'
        ],
        contenidosConceptuales: [
          'El millón: períodos y órdenes numéricos.',
          'Multiplicación de números naturales por factores de dos cifras.',
          'Propiedades de las operaciones (conmutativa, asociativa, distributiva).'
        ],
        contenidosProcedimentales: [
          'Lectura y escritura correcta de cantidades hasta el millón con separación de períodos.',
          'Resolución de situaciones problemáticas de compra, venta y presupuesto familiar.',
          'Estimación de productos y cálculo mental rápido.'
        ],
        contenidosActitudinales: [
          'Valoración del dinero y el consumo responsable en el hogar.',
          'Perseverancia en la búsqueda de soluciones a problemas numéricos.'
        ],
        indicadoresLogro: [
          'Lee y escribe números naturales hasta los millones en cifras y palabras.',
          'Aplica el algoritmo de la multiplicación con factores de dos cifras con precisión.',
          'Resuelve problemas de varias etapas contextualizados en la economía nacional.'
        ],
        actividadInicio: 'Presentación de titulares periodísticos con cifras millonarias de exportaciones dominicanas.',
        actividadDesarrollo: 'Resolución guiada de un problema de presupuesto de transporte escolar con operaciones combinadas.',
        actividadCierre: 'Sistematización de la técnica de alineación por órdenes numéricos y metacognición en 10 minutos.'
      }
    ]
  },

  // ==================== 5TO GRADO ====================
  {
    id: 'sec_5_lengua',
    grupo: 'Secuencias Didácticas 5to Grado',
    label: '5to Grado - Lengua Española (134 págs, 10 secuencias)',
    grado: '5to de Primaria',
    area: 'Lengua Española',
    nivel: 'Primario',
    ciclo: 'Segundo Ciclo',
    paginas: 134,
    totalSecuencias: 10,
    descripcion: 'Guía oficial de secuencias didácticas de Lengua Española para 5to grado (134 páginas, 10 secuencias). El artículo expositivo, la anécdota, el afiche publicitario y el debate.',
    secuenciasSugeridas: [
      {
        numero: 1,
        titulo: 'Secuencia 1: El Artículo Expositivo y la Divulgación de la Ciencia',
        unidad: 'Unidad 1: Textos de Divulgación y Exposición',
        situacionAprendizaje: 'Los alumnos investigan sobre la fauna y flora endémica de los parques nacionales dominicanos (como Los Haitises y Jaragua) para escribir artículos expositivos que se compartirán en una feria escolar.',
        competenciasFundamentales: ['Comunicativa', 'Científica y Tecnológica', 'Ambiental y de la Salud'],
        competenciasEspecificas: [
          'Comprende artículos expositivos identificando la idea central y los conectores de causa-efecto.',
          'Produce artículos expositivos con introducción, desarrollo y conclusión bien delimitados.'
        ],
        contenidosConceptuales: [
          'El artículo expositivo: función, características y estructura lógica.',
          'Conectores explicativos (es decir, o sea) y de causa-efecto (debido a, por lo tanto).',
          'Uso del vocabulario técnico y objetivo en textos de ciencia.'
        ],
        contenidosProcedimentales: [
          'Extracción de ideas principales y secundarias en párrafos informativos.',
          'Redacción de definiciones claras sobre conceptos científicos.',
          'Revisión ortográfica de acentuación diacrítica y signos de puntuación.'
        ],
        contenidosActitudinales: [
          'Curiosidad por la investigación científica y el conocimiento del entorno dominicano.',
          'Rigor y honestidad intelectual al citar fuentes.'
        ],
        indicadoresLogro: [
          'Identifica la estructura de introducción, desarrollo y conclusión en un texto expositivo.',
          'Emplea conectores de causa y consecuencia de forma adecuada en su redacción.',
          'Elabora un artículo expositivo breve respetando la coherencia temática.'
        ],
        actividadInicio: 'Lectura compartida de una ficha sobre el solenodonte y la jutía dominicana.',
        actividadDesarrollo: 'Subrayado de ideas principales en equipos y redacción del párrafo de desarrollo con conectores.',
        actividadCierre: 'Puntualizaciones del docente en 10 minutos. Evaluación formativa con lista de cotejo entre pares.'
      }
    ]
  },
  {
    id: 'sec_5_mat',
    grupo: 'Secuencias Didácticas 5to Grado',
    label: '5to Grado - Matemática (308 págs, 10 secuencias)',
    grado: '5to de Primaria',
    area: 'Matemática',
    nivel: 'Primario',
    ciclo: 'Segundo Ciclo',
    paginas: 308,
    totalSecuencias: 10,
    descripcion: 'Guía oficial de secuencias didácticas de Matemática para 5to grado (308 páginas, 10 secuencias). Fracciones equivalentes, operaciones con números decimales, geometría plana y estadística.',
    secuenciasSugeridas: [
      {
        numero: 1,
        titulo: 'Secuencia 1: Fracciones Equivalentes y Operaciones de Suma y Resta',
        unidad: 'Unidad 2: Números Racionales en la Medición y el Reparto',
        situacionAprendizaje: 'En el huerto escolar, los estudiantes necesitan dividir parcelas de cultivo de diferentes dimensiones y combinar porciones de abono orgánico, requiriendo encontrar fracciones equivalentes y realizar sumas con distinto denominador.',
        competenciasFundamentales: ['Pensamiento Lógico, Creativo y Crítico', 'Resolución de Problemas'],
        competenciasEspecificas: [
          'Modela y representa fracciones utilizando figuras geométricas y rectas numéricas.',
          'Resuelve problemas de suma y resta de fracciones con denominadores comunes y distintos.'
        ],
        contenidosConceptuales: [
          'Fracciones equivalentes por amplificación y simplificación.',
          'Mínimo común múltiplo (mcm) para sumar fracciones con diferente denominador.',
          'Fracciones propias, impropias y números mixtos.'
        ],
        contenidosProcedimentales: [
          'Cálculo de fracciones equivalentes mediante multiplicación cruzada y simplificación.',
          'Resolución de situaciones de reparto equitativo.',
          'Uso de tiras de fracciones y modelos circulares de cartulina.'
        ],
        contenidosActitudinales: [
          'Paciencia y rigurosidad al simplificar fracciones a su mínima expresión.',
          'Colaboración activa en el trabajo grupal.'
        ],
        indicadoresLogro: [
          'Identifica y genera fracciones equivalentes a partir de representaciones concretas y numéricas.',
          'Resuelve adiciones y sustracciones de fracciones con distinto denominador aplicando el mcm.',
          'Explica verbalmente el procedimiento seguido para resolver problemas de reparto.'
        ],
        actividadInicio: 'Dinámica de plegado de tiras de papel de colores para visualizar 1/2 = 2/4 = 4/8.',
        actividadDesarrollo: 'Resolución guiada del algoritmo de suma de fracciones con distinto denominador usando el mcm.',
        actividadCierre: 'Sistematización: ¿Por qué no podemos sumar los denominadores directamente? Metacognición.'
      }
    ]
  },
  {
    id: 'sec_5_ciencias',
    grupo: 'Secuencias Didácticas 5to Grado',
    label: '5to Grado - Ciencias de la Naturaleza (279 págs, 6 secuencias)',
    grado: '5to de Primaria',
    area: 'Ciencias de la Naturaleza',
    nivel: 'Primario',
    ciclo: 'Segundo Ciclo',
    paginas: 279,
    totalSecuencias: 6,
    descripcion: 'Guía oficial de secuencias didácticas de Ciencias de la Naturaleza para 5to grado (279 páginas, 6 secuencias). Sistemas del cuerpo humano, la nutrición, ecosistemas dominicanos y energía.',
    secuenciasSugeridas: [
      {
        numero: 3,
        titulo: 'Secuencia 3: Sistemas del Cuerpo Humano, Digestión y Nutrición Saludable',
        unidad: 'Unidad 1: Estructura y Función de los Seres Vivos y Salud Comunitaria',
        situacionAprendizaje: 'A raíz de una jornada de salud comunitaria, los estudiantes de 5to grado analizan cómo funciona el aparato digestivo y respiratorio, qué alimentos de la dieta tradicional dominicana aportan nutrientes esenciales y cómo prevenir enfermedades transmitidas por agua o alimentos.',
        competenciasFundamentales: ['Ambiental y de la Salud', 'Científica y Tecnológica', 'Resolución de Problemas'],
        competenciasEspecificas: [
          'Ofrece explicaciones científicas sobre la relación entre los órganos de los sistemas del cuerpo humano.',
          'Aplica procedimientos científicos organizados para registrar hábitos alimentarios y de higiene.'
        ],
        contenidosConceptuales: [
          'El sistema digestivo humano: boca, esófago, estómago, intestinos, hígado y páncreas.',
          'Proceso de digestión mecánica y química.',
          'Nutrientes esenciales en alimentos autóctonos dominicanos.'
        ],
        contenidosProcedimentales: [
          'Construcción de modelos ilustrados del sistema digestivo.',
          'Experimentación sencilla sobre la digestión de carbohidratos.',
          'Elaboración de tablas comparativas de valor nutricional.'
        ],
        contenidosActitudinales: [
          'Compromiso con hábitos alimenticios saludables y el consumo de agua segura.',
          'Cuidado y aprecio por su propio cuerpo y el bienestar común.'
        ],
        indicadoresLogro: [
          'Identifica y describe los órganos principales del aparato digestivo y sus funciones.',
          'Compara el valor nutricional de alimentos locales frente a productos ultraprocesados.',
          'Propone un menú escolar balanceado basado en la canasta familiar dominicana.'
        ],
        actividadInicio: 'Pregunta activadora: ¿Qué camino sigue una tajada de plátano con huevo después de comerla?',
        actividadDesarrollo: 'Rotación por estaciones: 1) Estación anatómica con láminas; 2) Estación nutricional clasificando víveres.',
        actividadCierre: 'Sistematización: cada equipo comparte un hallazgo clave. Reflexión metacognitiva en 10 minutos.'
      }
    ]
  },

  // ==================== 6TO GRADO ====================
  {
    id: 'sec_6_ciencias',
    grupo: 'Secuencias Didácticas 6to Grado',
    label: '6to Grado - Ciencias de la Naturaleza (297 págs, 6 secuencias)',
    grado: '6to de Primaria',
    area: 'Ciencias de la Naturaleza',
    nivel: 'Primario',
    ciclo: 'Segundo Ciclo',
    paginas: 297,
    totalSecuencias: 6,
    descripcion: 'Guía oficial de secuencias didácticas de Ciencias de la Naturaleza para 6to grado (297 páginas, 6 secuencias). La célula, sistemas de control, electricidad, energía renovable y cambio climático.',
    secuenciasSugeridas: [
      {
        numero: 1,
        titulo: 'Secuencia 1: La Célula como Unidad de la Vida y los Reinos Biológicos',
        unidad: 'Unidad 1: Organización Celular y Biodiversidad',
        situacionAprendizaje: 'Los estudiantes recolectan muestras de agua de charcas y hojas de plantas del entorno escolar para observarlas bajo lupas y microscopios escolares, descubriendo la unidad fundamental de los seres vivos y comparando células animales y vegetales.',
        competenciasFundamentales: ['Científica y Tecnológica', 'Ambiental y de la Salud'],
        competenciasEspecificas: [
          'Diferencia la estructura y funcionamiento de las células eucariotas y procariotas.',
          'Aplica el método científico en la observación de muestras biológicas.'
        ],
        contenidosConceptuales: [
          'La célula: membrana plasmática, citoplasma, núcleo y organelos principales.',
          'Diferencias entre célula animal y vegetal (pared celular, cloroplastos, vacuolas).',
          'Niveles de organización biológica: célula, tejido, órgano, sistema y organismo.'
        ],
        contenidosProcedimentales: [
          'Preparación de muestras frescas con cáscara de cebolla y tinción con yodo.',
          'Dibujo e identificación esquemática de partes celulares.',
          'Uso seguro de instrumentos ópticos escolares.'
        ],
        contenidosActitudinales: [
          'Cuidado y respeto hacia todas las formas de vida microscópica y macroscópica.',
          'Rigor y pulcritud en el laboratorio escolar.'
        ],
        indicadoresLogro: [
          'Distingue las características principales que diferencian la célula vegetal de la animal.',
          'Registra con precisión los pasos de una observación microscópica o con lupa.',
          'Relaciona la función de los organelos con las actividades vitales de la célula.'
        ],
        actividadInicio: 'Observación de una cebolla y pregunta problematizadora sobre de qué están formadas sus capas.',
        actividadDesarrollo: 'Práctica de laboratorio: preparación de la muestra con tinte y observación guiada de la pared celular.',
        actividadCierre: 'Puntualizaciones docentes sobre los cloroplastos y la fotosíntesis. Metacognición.'
      }
    ]
  },
  {
    id: 'sec_6_lengua',
    grupo: 'Secuencias Didácticas 6to Grado',
    label: '6to Grado - Lengua Española (172 págs, 10 secuencias)',
    grado: '6to de Primaria',
    area: 'Lengua Española',
    nivel: 'Primario',
    ciclo: 'Segundo Ciclo',
    paginas: 172,
    totalSecuencias: 10,
    descripcion: 'Guía oficial de secuencias didácticas de Lengua Española para 6to grado (172 páginas, 10 secuencias). El informe de experimento, el artículo de opinión, la carta de excusa y el comentario crítico.',
    secuenciasSugeridas: [
      {
        numero: 1,
        titulo: 'Secuencia 1: El Informe de Experimento y la Escritura Científica',
        unidad: 'Unidad 1: Textos Científicos y Divulgación Escolar',
        situacionAprendizaje: 'Al realizar experimentos en el laboratorio de ciencias sobre la densidad de los líquidos, los estudiantes de 6to grado necesitan comunicar sus hallazgos a la comunidad mediante un informe riguroso con introducción, materiales, procedimiento, resultados y conclusiones.',
        competenciasFundamentales: ['Comunicativa', 'Pensamiento Lógico, Creativo y Crítico', 'Científica y Tecnológica'],
        competenciasEspecificas: [
          'Comprende informes de experimentos científicos reconociendo la secuencia de pasos y vocabulario especializado.',
          'Produce informes de experimentos utilizando conectores de temporalidad y gráficas explicativas.'
        ],
        contenidosConceptuales: [
          'El informe de experimento: propósito, destinatario y silueta textual canónica.',
          'La voz pasiva y oraciones impersonales en la redacción científica.',
          'Tablas de datos y gráficas de barras como apoyo visual al texto.'
        ],
        contenidosProcedimentales: [
          'Registro cronológico del procedimiento experimental.',
          'Redacción de conclusiones fundamentadas en la evidencia observada.',
          'Revisión ortográfica de términos científicos.'
        ],
        contenidosActitudinales: [
          'Compromiso con la veracidad de los datos registrados sin alteración.',
          'Valoración de la comunicación escrita como herramienta para el progreso científico.'
        ],
        indicadoresLogro: [
          'Escribe informes de experimentos siguiendo la estructura de cinco partes obligatorias.',
          'Utiliza conectores temporales (al inicio, sucesivamente, finalmente) para ordenar el procedimiento.',
          'Formula conclusiones claras que responden a la pregunta de investigación inicial.'
        ],
        actividadInicio: 'Demostración relámpago con agua, aceite y alcohol en probeta; preguntas sobre cómo documentarlo.',
        actividadDesarrollo: 'Redacción en parejas del apartado de "Procedimiento y Resultados" utilizando tablas de registro.',
        actividadCierre: 'Puntualizaciones docentes sobre la objetividad en la ciencia. Metacognición.'
      }
    ]
  },
  {
    id: 'sec_6_mat',
    grupo: 'Secuencias Didácticas 6to Grado',
    label: '6to Grado - Matemática (304 págs, 7 secuencias)',
    grado: '6to de Primaria',
    area: 'Matemática',
    nivel: 'Primario',
    ciclo: 'Segundo Ciclo',
    paginas: 304,
    totalSecuencias: 7,
    descripcion: 'Guía oficial de secuencias didácticas de Matemática para 6to grado (304 páginas, 7 secuencias). Fracciones, operaciones con decimales, resolución de problemas censales y razonamiento proporcional.',
    secuenciasSugeridas: [
      {
        numero: 1,
        titulo: 'Secuencia 1: Fracciones, Operaciones con Decimales y Resolución de Problemas Censales',
        unidad: 'Unidad 2: Operaciones con Números Racionales y Estadísticas Poblacionales',
        situacionAprendizaje: 'Los estudiantes de 6to grado de la Escuela Primaria Anacaona investigan el crecimiento poblacional a partir de datos del Censo Nacional (con cifras como 165,658 habitantes; 38,456; 21,985; 25,650; 47,985; 43,700). Realizan adiciones, sustracciones y divisiones con números decimales y proponen soluciones razonadas para la distribución de recursos en su comunidad.',
        competenciasFundamentales: ['Pensamiento Lógico, Creativo y Crítico', 'Resolución de Problemas', 'Científica y Tecnológica', 'Ética y Ciudadana'],
        competenciasEspecificas: [
          'Razona y argumenta: Identifica regularidades en la representación decimal y fraccionaria de cantidades en situaciones del entorno.',
          'Comunica: Explica verbalmente y por escrito los algoritmos y estrategias seguidas con decimales.',
          'Modela y representa: Utiliza modelos gráficos, rectas numéricas y tablas de valor posicional.',
          'Conecta: Vincula conceptos matemáticos con datos demográficos de la República Dominicana.',
          'Resuelve problemas: Formula y resuelve problemas contextualizados con decimales.'
        ],
        contenidosConceptuales: [
          'Números decimales: décimas, centésimas y milésimas en la tabla de valor posicional.',
          'Operaciones con decimales: adición, sustracción, multiplicación y división.',
          'Fracciones como parte de una unidad, como cociente y como razón.',
          'Estimación y redondeo de cantidades numéricas.'
        ],
        contenidosProcedimentales: [
          'Lectura, escritura y ordenamiento de números decimales y fraccionarios.',
          'Ejecución correcta del algoritmo de la división con cociente decimal.',
          'Resolución de problemas contextualizados utilizando datos censales reales de República Dominicana.',
          'Comprobación de resultados mediante estimación y cálculo mental.'
        ],
        contenidosActitudinales: [
          'Interés por el trabajo riguroso y la precisión en los cálculos.',
          'Actitud de colaboración y respeto por las opiniones y estrategias de sus compañeros.',
          'Valoración de la matemática como herramienta para comprender la realidad comunitaria.'
        ],
        indicadoresLogro: [
          'Resuelve problemas de la vida cotidiana que involucran operaciones con números decimales hasta las milésimas.',
          'Aplica el redondeo y la estimación de cantidades decimales justificando su criterio.',
          'Representa e interpreta fracciones propias, impropias y mixtas en la recta numérica.',
          'Comunica con claridad y precisión el orden de las operaciones al resolver problemas combinados.'
        ],
        actividadInicio: 'Rutina diaria y retroalimentación de la clase anterior. Exploración de saberes previos mediante preguntas sobre compras y recibos de servicios con decimales.',
        actividadDesarrollo: 'Análisis de datos censales con cifras reales (165,658; 38,456; 21,985; 25,650). Los estudiantes en parejas calculan promedios y divisiones justificando el residuo.',
        actividadCierre: 'Puntualizaciones del docente en 10 minutos. Sistematización con preguntas clave sobre la alineación del punto decimal y metacognición.'
      }
    ]
  },

  // ==================== MARCOS NORMATIVOS Y FORMATOS OFICIALES ====================
  {
    id: 'norm_adecuacion_primaria',
    grupo: 'Marcos Normativos y Formatos Oficiales',
    label: 'Adecuación Curricular Nivel Primario (Oct 2023 - 404 págs)',
    grado: 'Todos los Grados (1ro a 6to de Primaria)',
    area: 'Todas las Áreas Curriculares Oficiales',
    nivel: 'Primario',
    ciclo: 'Primer Ciclo',
    paginas: 404,
    totalSecuencias: 25,
    descripcion: 'Documento normativo matriz de la Adecuación Curricular del Nivel Primario aprobada por el Consejo Nacional de Educación (Octubre 2023, 404 páginas). Contiene las 7 Competencias Fundamentales, las Competencias Específicas, Criterios de Evaluación y Malla Curricular Oficial de todas las asignaturas.',
    secuenciasSugeridas: [
      {
        numero: 1,
        titulo: 'Matriz Curricular Normativa Oficial del Nivel Primario MINERD',
        unidad: 'Marco de Referencia Curricular Nacional 2026-2027',
        situacionAprendizaje: 'Planificación integral de unidad conforme a los descriptores curriculares y criterios de progresión establecidos en la Adecuación Curricular Nivel Primario de octubre 2023.',
        competenciasFundamentales: [
          'Comunicativa',
          'Pensamiento Lógico, Creativo y Crítico',
          'Resolución de Problemas',
          'Científica y Tecnológica',
          'Ética y Ciudadana',
          'Ambiental y de la Salud',
          'Desarrollo Personal y Espiritual'
        ],
        competenciasEspecificas: [
          'Desarrolla competencias específicas del grado orientadas al dominio conceptual y procedimental.',
          'Aplica el enfoque por competencias y el aprendizaje significativo en todas las áreas de estudio.'
        ],
        contenidosConceptuales: ['Conceptos estructurantes del grado según la adecuación curricular vigente.'],
        contenidosProcedimentales: ['Estrategias de indagación, modelado y resolución de problemas auténticos.'],
        contenidosActitudinales: ['Valores cívicos, éticos y ambientales promovidos por la escuela dominicana.'],
        indicadoresLogro: ['Indicadores oficiales verificables del Registro de Grado MINERD.'],
        actividadInicio: 'Activación de conocimientos previos y vinculación con la realidad comunitaria.',
        actividadDesarrollo: 'Desarrollo de actividades formativas progresivas centradas en el estudiante.',
        actividadCierre: 'Evaluación formativa, sistematización pedagógica y metacognición en 10 minutos.'
      }
    ]
  },
  {
    id: 'norm_adecuacion_inicial',
    grupo: 'Marcos Normativos y Formatos Oficiales',
    label: 'Adecuación Curricular Nivel Inicial (2023 - 194 págs)',
    grado: 'Nivel Inicial (Maternal, Párvulo, Kínder, Pre-Primario)',
    area: 'Desarrollo Infantil Integral',
    nivel: 'Inicial',
    ciclo: 'Primer Ciclo',
    paginas: 194,
    totalSecuencias: 12,
    descripcion: 'Marco oficial de la Adecuación Curricular del Nivel Inicial (2023, 194 páginas). Comprende el Primer Ciclo (Maternal de 45 días a 11 meses, Párvulo de 1 a 2 años, Kínder de 2 a 3 años) y Segundo Ciclo (Pre-Kínder de 3 a 4 años, Kínder de 4 a 5 años, Pre-Primario de 5 a 6 años). Metodología de rincones de juego-trabajo y momentos pedagógicos de la rutina.',
    secuenciasSugeridas: [
      {
        numero: 1,
        titulo: 'Secuencia Inicial: Mi Cuerpo, Mis Emociones y la Convivencia Escolar',
        unidad: 'Unidad de Desarrollo Integral y Rincones de Aprendizaje',
        situacionAprendizaje: 'Los niños y niñas del Nivel Inicial reconocen su identidad, sus nombres, sus emociones y exploran los distintos rincones del aula (Rincón de Construcción, Dramatización, Biblioteca y Arte), aprendiendo a compartir y cooperar con sus compañeros.',
        competenciasFundamentales: ['Desarrollo Personal y Espiritual', 'Comunicativa', 'Ética y Ciudadana'],
        competenciasEspecificas: [
          'Identifica partes de su cuerpo, emociones básicas y manifiesta agrado por sus logros.',
          'Expresa ideas, vivencias y sentimientos a través del lenguaje oral, corporal y plástico.'
        ],
        contenidosConceptuales: [
          'Identidad personal: mi nombre, mi cuerpo y mis gustos.',
          'Las emociones básicas: alegría, tristeza, enojo, miedo y calma.',
          'Las normas de convivencia y cuidado de los materiales en los rincones de juego.'
        ],
        contenidosProcedimentales: [
          'Exploración sensorio-motriz y expresión gestual frente al espejo.',
          'Participación en el juego-trabajo: planificación, desarrollo, orden y evaluación.',
          'Modelado con plastilina y pintura dactilar libre.'
        ],
        contenidosActitudinales: [
          'Confianza y seguridad en sus propias posibilidades de acción.',
          'Disfrute al jugar y compartir en armonía con sus compañeros y docentes.'
        ],
        indicadoresLogro: [
          'Nombra y señala las partes principales de su cuerpo y reconoce su esquema corporal.',
          'Elige el rincón de aprendizaje donde desea jugar y respeta las reglas compartidas.',
          'Comunica verbalmente o mediante gestos sus emociones y estados de ánimo.'
        ],
        actividadInicio: 'Momento de Recibimiento y Encuentro de Grupo (30 min): Saludo afectuoso, canción de bienvenida, cartel del tiempo y asistencia con tarjetas de nombres.',
        actividadDesarrollo: 'Momento de Juego-Trabajo en Rincones (45 min): Los niños planifican en qué rincón trabajarán (Construcción con bloques de madera, Arte con pinceles y pintura al agua, o Biblioteca hojeando cuentos).',
        actividadCierre: 'Momento de Evaluación y Orden (15 min): Canción de guardar los juguetes, asamblea en círculo para conversar sobre lo que construyeron y despedida.'
      }
    ]
  },
  {
    id: 'norm_formato_diaria',
    grupo: 'Marcos Normativos y Formatos Oficiales',
    label: 'Formato Oficial MINERD de Planificación Diaria',
    grado: 'Todos los Grados y Niveles',
    area: 'Plantilla Oficial MINERD',
    nivel: 'Primario',
    ciclo: 'Primer Ciclo',
    paginas: 15,
    totalSecuencias: 1,
    descripcion: 'Instrumento y plantilla oficial de supervisión pedagógica distrital para la Planificación Diaria de Aula de la Escuela Primaria Anacaona. Desglosado en: Intención Pedagógica del Día, Momento de Inicio (10 min), Momento de Desarrollo (70 min), Momento de Cierre (10 min), Recursos, Vocabulario y Organización de los Estudiantes.',
    secuenciasSugeridas: [
      {
        numero: 1,
        titulo: 'Esquema Oficial MINERD de Planificación Diaria de Aula',
        unidad: 'Formato Oficial de Ejecución Cotidiana',
        situacionAprendizaje: 'Estructura diaria oficial exigida por los técnicos distritales de supervisión pedagógica para la jornada escolar extendida en centros educativos del MINERD.',
        competenciasFundamentales: ['Comunicativa', 'Pensamiento Lógico, Creativo y Crítico', 'Resolución de Problemas'],
        competenciasEspecificas: ['Logro de la intención pedagógica del día mediante actividades dosificadas.'],
        contenidosConceptuales: ['Contenido nuclear dosificado para la sesión del día.'],
        contenidosProcedimentales: ['Actividades guiadas e independientes de aprendizaje activo.'],
        contenidosActitudinales: ['Hábitos de trabajo cooperativo y escucha respetuosa.'],
        indicadoresLogro: ['Indicador de logro evaluado en la sesión de clase.'],
        actividadInicio: 'Inicio (10 min): Rutina de acogida, pase de lista, retroalimentación de la clase previa y activación de saberes previos con pregunta impulsora.',
        actividadDesarrollo: 'Desarrollo (70 min): Modelado del docente, actividad práctica de la secuencia didáctica oficial y trabajo en parejas o pequeños grupos.',
        actividadCierre: 'Cierre (10 min): Puntualizaciones del docente, preguntas de sistematización y metacognición: ¿Qué aprendimos hoy? ¿Para qué nos sirve?'
      }
    ]
  }
];

// Helper to find a guide by ID
export function getSharePointGuideById(id: string): SharePointGuide | undefined {
  return SHAREPOINT_OFFICIAL_GUIDES.find(g => g.id === id);
}

export interface SequenceActivityDetail {
  numero: number;
  titulo: string;
  intencionPedagogica: string;
  actividadInicio: string;
  actividadDesarrollo: string;
  actividadCierre: string;
}

export function getActivitiesForSequence(guideId: string, seqNum: number = 1): SequenceActivityDetail[] {
  const guide = getSharePointGuideById(guideId);
  const area = guide?.area || 'Curricular';
  const grado = guide?.grado || 'Primaria';

  // Specific contextualized activities for 6to Matematica (Censo y Decimales)
  if (guideId === 'sec_6_mat' || (area.toLowerCase().includes('matemática') && grado.includes('6to'))) {
    return [
      {
        numero: 1,
        titulo: 'Actividad 1: Presentación de la Situación y Exploración de Datos Censales',
        intencionPedagogica: 'Activar conocimientos previos sobre números decimales a partir de datos del Censo Nacional.',
        actividadInicio: 'Rutina de saludo y pase de lista. Exploración de saberes previos: ¿Dónde vemos números con punto decimal en compras familiares y noticias?',
        actividadDesarrollo: 'Presentación del cartel con cifras oficiales del Censo Dominicano (165,658 habitantes; 38,456; 21,985). Los alumnos identifican partes enteras y decimales en la tabla de valor posicional.',
        actividadCierre: 'Puntualizaciones docentes sobre el valor posicional de las décimas y centésimas. Metacognición en 10 min.'
      },
      {
        numero: 2,
        titulo: 'Actividad 2: Modelado Docente de Adición y Sustracción con Decimales',
        intencionPedagogica: 'Modelar y ejercitar el algoritmo de suma y resta con decimales alineando el punto decimal.',
        actividadInicio: 'Retroalimentación de la sesión anterior con un ejercicio relámpago de cálculo mental en la pizarra.',
        actividadDesarrollo: 'El docente modela la alineación estricta del punto decimal al sumar poblaciones municipales. En parejas, los estudiantes resuelven 3 problemas de diferencias demográficas.',
        actividadCierre: 'Sistematización: ¿Por qué es fundamental alinear el punto decimal antes de sumar? Registro en el cuaderno.'
      },
      {
        numero: 3,
        titulo: 'Actividad 3: División con Cociente Decimal y Reparto de Presupuestos',
        intencionPedagogica: 'Ejecutar el algoritmo de la división obteniendo cifras decimales en el cociente.',
        actividadInicio: 'Pregunta activadora: Si tenemos RD$25,650 para distribuir entre 4 escuelas, ¿cuánto corresponde a cada una?',
        actividadDesarrollo: 'Práctica guiada en mesas de trabajo resolviendo divisiones con cociente decimal e interpretando el residuo en contextos comunitarios reales.',
        actividadCierre: 'Dos parejas explican en la pizarra el procedimiento utilizado. Pauta de coevaluación.'
      },
      {
        numero: 4,
        titulo: 'Actividad 4: Redondeo, Estimación y Operaciones Combinadas',
        intencionPedagogica: 'Aplicar el redondeo a las décimas y centésimas justificando el criterio de aproximación.',
        actividadInicio: 'Juego de estimación rápida: ¿A qué número entero está más cerca 47.89?',
        actividadDesarrollo: 'Los estudiantes organizan tablas comparativas redondeando cifras estadísticas y calculan presupuestos estimados de materiales escolares.',
        actividadCierre: 'Reflexión metacognitiva: ¿En qué situaciones cotidianas es preferible estimar antes que calcular exactamente?'
      },
      {
        numero: 5,
        titulo: 'Actividad 5: Taller Autónomo de Resolución de Problemas en el Cuaderno',
        intencionPedagogica: 'Resolver de forma autónoma problemas de varias etapas con fracciones y decimales.',
        actividadInicio: 'Revisión colectiva de las dudas más frecuentes de la tarea.',
        actividadDesarrollo: 'Trabajo individual y en parejas con la ficha de problemas del fascículo oficial Crece Primaria Matemática 6to.',
        actividadCierre: 'Puntualizaciones del docente en 10 minutos y revisión con lista de cotejo.'
      },
      {
        numero: 6,
        titulo: 'Actividad 6: Sistematización Curricular y Evaluación Formativa de la Secuencia',
        intencionPedagogica: 'Consolidar los aprendizajes y evaluar formativamente las competencias matemáticas de la secuencia.',
        actividadInicio: 'Dinámica de repaso en equipos con tarjetas de preguntas conceptuales y procedimentales.',
        actividadDesarrollo: 'Aplicación de la rúbrica analítica y prueba de desempeño con situaciones auténticas de la comunidad.',
        actividadCierre: 'Cierre de la secuencia: reflexión final en el diario del estudiante y entrega de producciones.'
      }
    ];
  }

  // Specific contextualized activities for 4to Lengua Española (Informe de Lectura)
  if (guideId === 'sec_4_lengua' || (area.toLowerCase().includes('lengua') && grado.includes('4to'))) {
    return [
      {
        numero: 1,
        titulo: 'Actividad 1: Exploración de Siluetas Textuales y Lectura en Voz Alta',
        intencionPedagogica: 'Distinguir la función y estructura del informe de lectura a partir de textos narrativos dominicanos.',
        actividadInicio: 'Rutina matutina, lectura colectiva de un fragmento de Juan Bosch y exploración de saberes sobre cómo resumir.',
        actividadDesarrollo: 'Análisis de la silueta textual del informe: Título, Introducción, Resumen del argumento y Valoración fundamentada.',
        actividadCierre: 'Preguntas orales de comprensión lectora. Metacognición en 10 minutos.'
      },
      {
        numero: 2,
        titulo: 'Actividad 2: Modelado del Resumen del Argumento y Uso de Conectores',
        intencionPedagogica: 'Modelar la redacción del resumen utilizando conectores de orden cronológico.',
        actividadInicio: 'Reactivación de saberes: listar conectores temporales (al principio, luego, finalmente) en la pizarra.',
        actividadDesarrollo: 'Modelado docente paso a paso. Los alumnos en parejas seleccionan las acciones principales del cuento y redactan el resumen.',
        actividadCierre: 'Lectura voluntaria de dos resúmenes. Sistematización de reglas de puntuación.'
      },
      {
        numero: 3,
        titulo: 'Actividad 3: Redacción de la Opinión Personal Fundamentada',
        intencionPedagogica: 'Formular juicios críticos y valoraciones personales apoyadas en argumentos.',
        actividadInicio: 'Pregunta impulsora: ¿Qué parte de la historia te enseñó algo para tu vida y por qué?',
        actividadDesarrollo: 'Taller de escritura: redacción del párrafo de valoración personal utilizando conectores de causa (porque, debido a que).',
        actividadCierre: 'Intercambio de cuadernos para coevaluación con escala estimativa sencilla.'
      },
      {
        numero: 4,
        titulo: 'Actividad 4: La Carta Formal de Solicitud de Permiso',
        intencionPedagogica: 'Identificar las partes constitutivas de una carta formal de solicitud institucional.',
        actividadInicio: 'Lectura modelo de una carta dirigida a la dirección del centro educativo.',
        actividadDesarrollo: 'Identificación de lugar, fecha, destinatario, saludo formal, exposición de motivos y firma de la carta.',
        actividadCierre: 'Puntualizaciones sobre las fórmulas de cortesía dominicanas. Metacognición.'
      },
      {
        numero: 5,
        titulo: 'Actividad 5: Taller de Edición y Corrección de Borradores',
        intencionPedagogica: 'Revisar la concordancia gramatical, ortografía y coherencia del texto producido.',
        actividadInicio: 'Aclaración de dudas ortográficas recurrentes (uso de mayúsculas y signos de puntuación).',
        actividadDesarrollo: 'Reescritura del borrador limpio del informe de lectura incorporando las sugerencias pedagógicas.',
        actividadCierre: 'Puntualizaciones docentes sobre la importancia de la revisión procesual antes de publicar.'
      },
      {
        numero: 6,
        titulo: 'Actividad 6: Publicación en el Rincón de Lectura y Evaluación Formativa',
        intencionPedagogica: 'Socializar las producciones finales y aplicar la rúbrica oficial de producción escrita.',
        actividadInicio: 'Organización del espacio escolar para la galería de informes de lectura.',
        actividadDesarrollo: 'Exposición oral de los informes de lectura y entrega formal de la carta a la coordinación pedagógica.',
        actividadCierre: 'Evaluación formativa, felicitaciones a los estudiantes y registro en el diario del alumno.'
      }
    ];
  }

  // General 6-activity progression aligned with MINERD didactic sequences
  return [
    {
      numero: 1,
      titulo: `Actividad 1: Exploración Diagnóstica y Activación de Saberes Previos de ${area}`,
      intencionPedagogica: `Activar conocimientos previos y conectar la situación de aprendizaje con la vida cotidiana.`,
      actividadInicio: 'Rutina diaria, oración o reflexión cívica, pase de lista e interrogantes activadoras sobre el tema.',
      actividadDesarrollo: `El docente presenta la situación de aprendizaje contextualizada a la realidad escolar. En parejas, los estudiantes discuten sus ideas iniciales y las registran en el cuaderno.`,
      actividadCierre: 'Puntualizaciones en 10 minutos. Preguntas clave de metacognición: ¿Qué conocíamos antes y qué descubrimos hoy?'
    },
    {
      numero: 2,
      titulo: `Actividad 2: Modelado Pedagógico del Docente y Comprensión Guiada`,
      intencionPedagogica: `Comprender los conceptos estructurantes y procedimientos nucleares de la secuencia didáctica.`,
      actividadInicio: 'Retroalimentación rápida de la sesión anterior con una pregunta desafiante en la pizarra.',
      actividadDesarrollo: `Modelado explícito en la pizarra por parte del docente con ejemplos concretos. Los estudiantes siguen el procedimiento paso a paso en sus cuadernos de trabajo.`,
      actividadCierre: 'Sistematización: dos estudiantes resumen los pasos clave aprendidos hoy. Tarea de afianzamiento breve.'
    },
    {
      numero: 3,
      titulo: `Actividad 3: Práctica Colaborativa en Equipos y Resolución de Problemas`,
      intencionPedagogica: `Aplicar conceptos y procedimientos en situaciones prácticas mediante el trabajo cooperativo.`,
      actividadInicio: 'Formación de equipos cooperativos de 4 integrantes y asignación de roles de trabajo.',
      actividadDesarrollo: `Los equipos analizan casos, resuelven problemas o elaboran esquemas utilizando los recursos didácticos oficiales del MINERD.`,
      actividadCierre: 'Puesta en común relámpago: un relator de cada mesa presenta su hallazgo o resultado principal.'
    },
    {
      numero: 4,
      titulo: `Actividad 4: Taller de Aplicación Autónoma y Producción Escrita/Práctica`,
      intencionPedagogica: `Demostrar dominio procedimental independiente en la elaboración de evidencias de aprendizaje.`,
      actividadInicio: 'Presentación de los criterios de éxito de la actividad mediante una lista de cotejo visible en el aula.',
      actividadDesarrollo: `Desarrollo individual de ejercicios o producciones escritas con acompañamiento docente focalizado en la mesa de apoyo.`,
      actividadCierre: 'Puntualizaciones docentes sobre los aciertos observados y resolución de dudas comunes en 10 minutos.'
    },
    {
      numero: 5,
      titulo: `Actividad 5: Coevaluación entre Pares y Ajustes de Nivelación`,
      intencionPedagogica: `Valorar críticamente las producciones de los compañeros e incorporar sugerencias de mejora.`,
      actividadInicio: 'Instrucciones para la retroalimentación constructiva y respetuosa entre pares.',
      actividadDesarrollo: `Intercambio de cuadernos o producciones; aplicación de lista de cotejo y enriquecimiento mutuo del trabajo realizado.`,
      actividadCierre: 'Reflexión: ¿Cómo me ayudó la mirada de mi compañero a mejorar mi trabajo? Registro reflexivo.'
    },
    {
      numero: 6,
      titulo: `Actividad 6: Sistematización Curricular y Evaluación Formativa de la Secuencia`,
      intencionPedagogica: `Consolidar los aprendizajes de la secuencia y valorar los indicadores de logro alcanzados.`,
      actividadInicio: 'Dinámica integradora conectando todas las actividades trabajadas en la secuencia.',
      actividadDesarrollo: `Resolución de una situación de evaluación formativa y autoevaluación guiada con rúbrica analítica del MINERD.`,
      actividadCierre: 'Cierre oficial de la secuencia didáctica, registro de logros alcanzados y orientación hacia la siguiente unidad.'
    }
  ];
}

