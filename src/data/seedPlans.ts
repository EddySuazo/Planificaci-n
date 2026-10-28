import { LessonPlan } from '../types';

export const INITIAL_LESSON_PLANS: LessonPlan[] = [
  {
    id: 'plan-diaria-6to-mat-001',
    codigoDocumento: 'PLAN-DIA-2026-6M01',
    titulo: 'Planificación Diaria: Algoritmo de la División con Decimales aplicada a Datos Censales',
    tipo: 'diaria',
    estado: 'Aprobado institucionalmente',
    docenteId: 'doc-002',
    docenteNombre: 'Agustina Florián Méndez',
    docenteCedula: '108-0005346-3',
    centroEducativoId: '03498',
    centroEducativoNombre: 'Centro Educativo Anacaona',
    regional: '02 - San Juan',
    distrito: '02-05 - San Juan Este',
    nivel: 'Primario',
    ciclo: 'Segundo Ciclo',
    grado: '6to de Primaria',
    seccion: 'A',
    area: 'Matemática',
    anoEscolar: '2026-2027',
    periodo: 'P1 (Primer Período)',
    secuenciaReferenciaId: 'seq-mat-6to-01',
    secuenciaReferenciaTitulo: 'Secuencia Didáctica Oficial: Fracciones, Operaciones con Decimales y Resolución de Problemas Censales',
    esOficialMINERD: true,
    fuenteCurricular: 'MINERD - Dirección de Educación Primaria (Segundo Ciclo Crece Primaria / Adecuación Curricular Vigente)',
    
    situacionAprendizaje: 'Los estudiantes de 6to grado analizan el reporte censal de comunidades vulnerables de Santo Domingo Norte para calcular el promedio de habitantes atendidos por centro de atención primaria, requiriendo divisiones exactas y con cifras decimales.',
    competenciasFundamentales: [
      'Pensamiento Lógico, Creativo y Crítico',
      'Resolución de Problemas',
      'Científica y Tecnológica'
    ],
    competenciasEspecificas: [
      'Razona y argumenta: Identifica la función de la coma o punto decimal en el cociente al dividir números naturales con residuo.',
      'Resuelve problemas: Realiza divisiones con datos censales dominicanos reales y verifica la razonabilidad de su respuesta.'
    ],
    indicadoresLogro: [
      'Resuelve problemas de la vida cotidiana que involucran división con números decimales hasta las centésimas y milésimas.',
      'Explica oralmente el procedimiento utilizado para colocar el punto decimal en el cociente.'
    ],
    contenidosConceptuales: [
      'División de números naturales con cociente decimal.',
      'Valor posicional de décimas, centésimas y milésimas.',
      'Datos estadísticos demográficos.'
    ],
    contenidosProcedimentales: [
      'Ejecución del algoritmo tradicional de la división agregando ceros al dividendo para continuar la partición.',
      'Resolución de problemas de reparto equitativo con cifras censales (165,658; 38,456; 21,985; 25,650; 47,985; 43,700).'
    ],
    contenidosActitudinales: [
      'Perseverancia y rigor en el cálculo exacto.',
      'Interés por aplicar las matemáticas a la resolución de problemas comunitarios.'
    ],
    estrategiasEnsenanza: [
      'Indagación dialógica y modelado docente.',
      'Resolución de problemas contextualizados.',
      'Trabajo en parejas heterogéneas.'
    ],
    sesiones: [
      {
        id: 'ses-01',
        numero: 1,
        fecha: '2026-10-27',
        duracionMinutos: 90,
        momentoInicio: {
          duracionMin: 15,
          rutinaDiaria: 'Saludo formal, oración o reflexión del día, registro de asistencia en el libro de vida escolar, lectura de la intención pedagógica del día.',
          retroalimentacion: 'Revisión rápida de la tarea previa sobre valor posicional con tarjetas de números decimales.',
          saberesPrevios: 'Pregunta activadora: Si tenemos 165,658 cajas de raciones del INABIE para repartir entre 8 distritos escolares, ¿alcanza una cantidad entera exacta o sobra? ¿Qué hacemos con lo que sobra?',
          recursos: 'Pizarra, tarjetas con cifras oficiales del censo'
        },
        momentoDesarrollo: {
          duracionMin: 65,
          actividades: '1) El docente modela en la pizarra la división de una cifra censal (ejemplo: 38,456 habitantes distribuidos entre 5 centros de salud barriales), explicando cómo se agrega la coma decimal al cociente para continuar dividiendo las décimas y centésimas sobrantes. 2) Los estudiantes en parejas resuelven los ejercicios prácticos de la secuencia oficial utilizando las cifras oficiales: 165,658 / 4; 21,985 / 6; 25,650 / 8; 47,985 / 12; y 43,700 / 15. 3) Intercambio de cuadernos para coevaluación y verificación con calculadora escolar.',
          numeroLetraSecuencia: 'Actividad 4, numerales b y c (pág. 48 del Fascículo Crece Primaria)',
          recursos: 'Fascículo Crece Primaria MINERD pág. 48, cuadernos de trabajo, regla y calculadora de comprobación'
        },
        momentoCierre: {
          duracionMin: 10,
          puntualizaciones: 'El docente sintetiza la regla áurea: "Al bajar la primera cifra decimal o agregar un cero al residuo para obtener partes menores que la unidad, se escribe inmediatamente el punto decimal en el cociente".',
          sistematizacion: 'Preguntas dirigidas: ¿Qué indica el residuo en un problema de distribución humana? ¿Por qué no podemos dividir a una persona en decimales pero sí podemos expresar un promedio per cápita?',
          metacognicion: '¿Qué paso del algoritmo me generó dudas hoy? ¿Cómo logré superarlo junto a mi compañero?',
          recursos: 'Pizarra, diario de clase'
        },
        actividadesDiversidad: 'Para estudiantes con barreras en la memorización de tablas de multiplicar: uso de la tabla pitagórica plastificada y dinero lúdico para representar el valor fraccionario. Para estudiantes con alta competencia matemática: calcular el porcentaje de error si se redondea a las décimas.',
        actividadDiarioEstudiante: 'Escribe en 4 líneas: "¿En qué situación de tu casa o colmado tu familia necesita dividir una cantidad y obtener decimales?"',
        lecturaRecomendada: 'Libro de la Semana: "El Hombre que Calculaba" de Malba Tahan (Capítulo III: El reparto de los 35 camellos).',
        notasDocente: 'Nota para el docente: en el PDF fuente algunos números no se leen correctamente (problema de codificación de fuente). Se conservan las cifras legibles (165,658; 38,456; 21,985; 25,650; 47,985; 43,700 y las estimaciones y totales que se desprenden de la resolución del propio PDF). Los valores marcados como "ilegible en el PDF" deben copiarse directamente del documento original antes de usar la planificación.'
      }
    ],
    recursosDidacticos: [
      'Fascículo Crece Primaria Matemática 6to',
      'Tabla de valor posicional mural',
      'Tablas pitagóricas para apoyo inclusivo',
      'Calculadoras didácticas'
    ],
    tecnicasEvaluacion: [
      'Observación sistemática durante la resolución en parejas',
      'Revisión del cuaderno con lista de cotejo de algoritmos',
      'Preguntas de metacognición orales y escritas'
    ],
    evidenciasAprendizaje: [
      'Cuaderno del estudiante con resolución y comprobación de las 5 divisiones',
      'Respuesta argumentada en el diario reflexivo'
    ],
    actividadesRecuperacion: 'Taller de refuerzo en la hora de tutoría: ejercicios de división con dividendo menor de 3 cifras y división paso a paso utilizando material concreto Multibase Base 10.',
    estrategiasAtencionDiversidad: 'Acompañamiento personalizado en la mesa de apoyo pedagógico, asignación de monitores pares de apoyo.',
    metacognicionReflexion: 'Los alumnos reconocieron la utilidad social de los decimales en estadísticas comunitarias reales.',
    observacionesDocente: 'Se cumplió el tiempo de 90 minutos de manera fluida. El momento de cierre en 10 minutos permitió fijar la regla sin prisas.',
    verificacionCurricular: {
      estado: 'Coincidencia documentada',
      observaciones: [
        'Alineación total con la Secuencia Oficial MINERD Matemática 6to (pág. 48).',
        'Competencias específicas e indicadores de logro idénticos al currículo revisado.',
        'Se incluyen las cifras censales originales del fascículo.'
      ],
      coherenciaScore: 100,
      fuenteVerificada: true
    },
    revisionesInstitucionales: [
      {
        revisadoPorId: 'coord-001',
        revisadoPorNombre: 'Licda. Andrea Montero Vicente',
        revisadoPorRol: 'Coordinadora Pedagógica',
        fechaRevision: '2026-10-25',
        comentario: 'Excelente coherencia curricular. Se aprecia la integración fiel de los momentos de la clase y las notas técnicas de la secuencia MINERD.',
        accion: 'aprobado_institucional'
      },
      {
        revisadoPorId: 'dir-001',
        revisadoPorNombre: 'José Milquiades Peña Ogando',
        revisadoPorRol: 'Director de Centro',
        fechaRevision: '2026-10-26',
        comentario: 'Planificación diaria validada y aprobada para el centro educativo.',
        accion: 'aprobado_institucional'
      }
    ],
    historialVersiones: [
      {
        version: 1,
        fecha: '2026-10-24 14:30',
        guardadoPor: 'Agustina Florián Méndez',
        motivo: 'Borrador inicial generado desde la secuencia oficial MINERD.'
      },
      {
        version: 2,
        fecha: '2026-10-25 09:15',
        guardadoPor: 'Agustina Florián Méndez',
        motivo: 'Ajuste de la rutina de inicio e incorporación de la lectura recomendada de la semana.'
      }
    ],
    esFavorito: true,
    creadoEn: '2026-10-24T14:30:00Z',
    actualizadoEn: '2026-10-25T09:15:00Z'
  },
  {
    id: 'plan-semanal-4to-esp-002',
    codigoDocumento: 'PLAN-SEM-2026-4L02',
    titulo: 'Planificación Semanal: Estructura del Informe de Lectura y Conectores de Causa',
    tipo: 'semanal',
    estado: 'Revisado',
    docenteId: 'doc-003',
    docenteNombre: 'Marcos Aurelio Santana Gómez',
    docenteCedula: '023-0056124-7',
    centroEducativoId: 'esc-anacaona',
    centroEducativoNombre: 'Escuela Primaria Anacaona',
    regional: '10 - Santo Domingo',
    distrito: '10-01 - Villa Mella',
    nivel: 'Primario',
    ciclo: 'Segundo Ciclo',
    grado: '4to de Primaria',
    seccion: 'B',
    area: 'Lengua Española',
    anoEscolar: '2026-2027',
    periodo: 'P1 (Semana 4)',
    secuenciaReferenciaId: 'seq-len-4to-01',
    secuenciaReferenciaTitulo: 'Secuencia Didáctica Oficial: El Informe de Lectura y la Carta de Solicitud de Permiso',
    esOficialMINERD: true,
    fuenteCurricular: 'MINERD - Dirección General de Currículo (Adecuación Curricular Segundo Ciclo)',
    situacionAprendizaje: 'Los estudiantes preparan su informe de lectura para presentar sus autores favoritos en el rincón escolar.',
    competenciasFundamentales: ['Comunicativa', 'Pensamiento Lógico, Creativo y Crítico'],
    competenciasEspecificas: [
      'Comprensión escrita: Reconstruye el sentido global de un cuento dominicano.',
      'Producción escrita: Redacta un informe de lectura de tres párrafos respetando la estructura canónica.'
    ],
    indicadoresLogro: [
      'Distingue el informe de lectura de otros textos a partir de su función comunicativa y estructura lógica.',
      'Reconoce y utiliza conectores de causa (porque, ya que) y orden (primero, luego, finalmente).'
    ],
    contenidosConceptuales: [
      'El informe de lectura: introducción, resumen y conclusión con juicio crítico.',
      'Conectores de causa y de orden temporal.'
    ],
    contenidosProcedimentales: [
      'Planificación del texto mediante esquema de ideas.',
      'Escritura del primer borrador y corrección ortográfica de mayúsculas y puntos.'
    ],
    contenidosActitudinales: [
      'Valoración de los textos narrativos de autores dominicanos.',
      'Cuidado y prolijidad en sus escritos.'
    ],
    estrategiasEnsenanza: ['Taller de escritura guiada', 'Modelado textual', 'Coevaluación entre pares'],
    sesiones: [
      {
        id: 'ses-sem-01',
        numero: 1,
        fecha: '2026-11-02',
        duracionMinutos: 90,
        momentoInicio: {
          duracionMin: 15,
          rutinaDiaria: 'Lectura en voz alta de un microcuento dominicano.',
          retroalimentacion: 'Preguntas sobre los personajes y la trama.',
          saberesPrevios: '¿Cómo le cuentas a un amigo si una película te gustó sin contarle todo el final?',
          recursos: 'Antología de cuentos'
        },
        momentoDesarrollo: {
          duracionMin: 65,
          actividades: 'Análisis de la silueta textual del informe en papelógrafo. Identificación de párrafos de introducción, resumen y opinión.',
          numeroLetraSecuencia: 'Secuencia 2, Actividad 3',
          recursos: 'Papelógrafo, marcadores de colores'
        },
        momentoCierre: {
          duracionMin: 10,
          puntualizaciones: 'El informe de lectura no es copiar el libro entero, es resumir y dar tu propia voz.',
          sistematizacion: '¿Cuáles son las 3 partes obligatorias del informe?',
          metacognicion: '¿Qué aprendí sobre la diferencia entre resumir y copiar?',
          recursos: 'Pizarra'
        },
        actividadesDiversidad: 'Uso de plantilla con oraciones incompletas para completar.',
        actividadDiarioEstudiante: 'Escribe el título de tu cuento favorito y 2 oraciones de por qué te agradó.',
        lecturaRecomendada: 'Cuentos escritos en el exilio (Juan Bosch).',
        notasDocente: 'Vigilar el uso correcto del punto y seguido.'
      }
    ],
    recursosDidacticos: ['Libro de texto MINERD', 'Fichas de conectores', 'Papelógrafos'],
    tecnicasEvaluacion: ['Rúbrica de producción escrita', 'Lista de cotejo'],
    evidenciasAprendizaje: ['Borrador revisado del informe de lectura'],
    actividadesRecuperacion: 'Práctica de redacción de oraciones causales con apoyo visual.',
    estrategiasAtencionDiversidad: 'Acompañamiento individualizado y bancos de palabras.',
    metacognicionReflexion: 'Evolución positiva en la diferenciación de hechos y opiniones.',
    observacionesDocente: 'Los estudiantes mostraron entusiasmo con los cuentos de Juan Bosch.',
    verificacionCurricular: {
      estado: 'Coincidencia documentada',
      observaciones: ['Alineado con el currículo oficial de 4to grado MINERD.'],
      coherenciaScore: 98,
      fuenteVerificada: true
    },
    revisionesInstitucionales: [
      {
        revisadoPorId: 'coord-001',
        revisadoPorNombre: 'Lic. Roberto Emilio Valdez Santos',
        revisadoPorRol: 'Coordinador Pedagógico',
        fechaRevision: '2026-10-22',
        comentario: 'Plan coherente y bien secuenciado. Sugiero reforzar la rúbrica de coevaluación.',
        accion: 'marcado_revisado'
      }
    ],
    historialVersiones: [
      { version: 1, fecha: '2026-10-21', guardadoPor: 'Marcos Aurelio Santana Gómez', motivo: 'Creación' }
    ],
    esFavorito: true,
    creadoEn: '2026-10-21T10:00:00Z',
    actualizadoEn: '2026-10-22T16:00:00Z'
  },
  {
    id: 'plan-anual-5to-cie-003',
    codigoDocumento: 'PLAN-ANU-2026-5C03',
    titulo: 'Planificación Anual: Ciencias de la Naturaleza 5to Grado - Año Escolar 2026-2027',
    tipo: 'anual',
    estado: 'Aprobado institucionalmente',
    docenteId: 'doc-004',
    docenteNombre: 'Yomaira Altagracia Castillo Díaz',
    docenteCedula: '402-2345678-9',
    centroEducativoId: 'esc-anacaona',
    centroEducativoNombre: 'Escuela Primaria Anacaona',
    regional: '10 - Santo Domingo',
    distrito: '10-01 - Villa Mella',
    nivel: 'Primario',
    ciclo: 'Segundo Ciclo',
    grado: '5to de Primaria',
    seccion: 'A y B',
    area: 'Ciencias de la Naturaleza',
    anoEscolar: '2026-2027',
    periodo: 'Anual Completo (P1 a P4)',
    secuenciaReferenciaId: 'seq-cie-5to-01',
    secuenciaReferenciaTitulo: 'Secuencia Didáctica Oficial: Sistemas del Cuerpo Humano, Digestión, Nutrición Saludable y Prevención',
    esOficialMINERD: true,
    fuenteCurricular: 'MINERD - Dirección de Educación Primaria / Aula Virtual MINERD',
    situacionAprendizaje: 'Distribución anual de unidades curriculares basadas en el calendario escolar de 190 días lectivos del MINERD, articulando los 4 períodos de evaluación.',
    competenciasFundamentales: ['Ambiental y de la Salud', 'Científica y Tecnológica', 'Resolución de Problemas'],
    competenciasEspecificas: ['Explicación científica de fenómenos naturales', 'Aplicación de procedimientos indagatorios', 'Actitud de cuidado y preservación ambiental'],
    indicadoresLogro: [
      'Explica la interdependencia entre los seres vivos y el ambiente en ecosistemas dominicanos.',
      'Identifica órganos y hábitos saludables de los sistemas del cuerpo humano.'
    ],
    contenidosConceptuales: [
      'Unidad 1: Los seres vivos y sus sistemas (P1).',
      'Unidad 2: Ecosistemas y biodiversidad de la República Dominicana (P2).',
      'Unidad 3: Materia, energía y fuerzas (P3).',
      'Unidad 4: El planeta Tierra y el universo (P4).'
    ],
    contenidosProcedimentales: ['Diseño y ejecución de experimentos sencillos de laboratorio escolar y campo.'],
    contenidosActitudinales: ['Responsabilidad con la salud personal y comunitaria.'],
    estrategiasEnsenanza: ['Aprendizaje Basado en Indagación', 'Salidas de campo escolares', 'Proyectos STEAM'],
    sesiones: [],
    recursosDidacticos: ['Guías del MINERD', 'Kit de ciencias', 'Láminas murales'],
    tecnicasEvaluacion: ['Rúbricas anuales', 'Pruebas de período P1, P2, P3, P4', 'Portafolios'],
    evidenciasAprendizaje: ['Cuadernos de ciencias', 'Informes de experimentos'],
    actividadesRecuperacion: 'Períodos de recuperación pedagógica al cierre de cada trimestre según ordenanza de evaluación.',
    estrategiasAtencionDiversidad: 'Ajustes curriculares no significativos y apoyo de tutoría.',
    metacognicionReflexion: 'Monitoreo de metas anuales de aprendizaje científico.',
    observacionesDocente: 'Se contemplan las 40 semanas del calendario escolar oficial MINERD.',
    verificacionCurricular: {
      estado: 'Coincidencia documentada',
      observaciones: ['Estructura anual 100% concordante con la Adecuación Curricular MINERD.'],
      coherenciaScore: 100,
      fuenteVerificada: true
    },
    revisionesInstitucionales: [
      {
        revisadoPorId: 'dir-001',
        revisadoPorNombre: 'Dra. Carmen Altagracia Rosario Mota',
        revisadoPorRol: 'Directora de Centro',
        fechaRevision: '2026-09-05',
        comentario: 'Plan anual validado para el centro escolar. Excelente coherencia institucional.',
        accion: 'aprobado_institucional'
      }
    ],
    historialVersiones: [{ version: 1, fecha: '2026-09-01', guardadoPor: 'Yomaira Castillo', motivo: 'Registro inicial' }],
    esFavorito: false,
    creadoEn: '2026-09-01T08:00:00Z',
    actualizadoEn: '2026-09-05T11:00:00Z'
  }
];
