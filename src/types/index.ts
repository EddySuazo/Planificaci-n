export interface UserProfile {
  id: string;
  cedula: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: string;
  rol: 'docente' | 'coordinador' | 'director' | 'administrador';
  cargoFuncion?: string;
  centroEducativoId: string;
  centroEducativoNombre: string;
  regional: string;
  distrito: string;
  tanda: 'Matutina' | 'Vespertina' | 'Jornada Escolar Extendida';
  nivelAsignado: 'Inicial' | 'Primario' | 'Secundario';
  cicloAsignado: 'Primer Ciclo' | 'Segundo Ciclo';
  gradosAsignados: string[];
  areasAsignadas: string[];
  avatarUrl?: string;
  creadoEn: string;
}

export interface School {
  id: string;
  codigoSIGERD: string;
  nombre: string;
  regional: string;
  distrito: string;
  municipio: string;
  sector: 'Público' | 'Privado';
  tanda: string;
  directorNombre: string;
}

export interface OfficialCurriculumSequence {
  id: string;
  codigoOficial: string;
  titulo: string;
  nivel: 'Inicial' | 'Primario' | 'Secundario';
  ciclo: 'Primer Ciclo' | 'Segundo Ciclo';
  grado: string; // "4to de Primaria", "5to de Primaria", "6to de Primaria", etc.
  area: string; // "Matemática", "Lengua Española", "Ciencias de la Naturaleza", "Ciencias Sociales", etc.
  anoEscolar: string; // "2026-2027"
  unidad: string;
  numeroSecuencia: number;
  duracionSemanas: number;
  cantidadSesionesSugeridas: number;
  fuenteOficial: string; // "Dirección de Educación Primaria MINERD - Segundo Ciclo Crece Primaria"
  enlaceFuenteOficial: string;
  estadoRevision: 'Oficial MINERD - Verificado' | 'Adecuación Curricular Vigente' | 'Propuesta IA pendiente de validación';
  fechaActualizacion: string;
  paginasReferencia: string;
  situacionAprendizaje: string;
  competenciasFundamentales: string[];
  competenciasEspecificas: string[];
  indicadoresLogro: string[];
  contenidosConceptuales: string[];
  contenidosProcedimentales: string[];
  contenidosActitudinales: string[];
  estrategiasSugeridas: string[];
  actividadesSugeridas: {
    fase: 'Inicio' | 'Desarrollo' | 'Cierre';
    descripcion: string;
    recursos: string[];
  }[];
  recursosDidacticos: string[];
  instrumentosEvaluacion: string[];
  atencionDiversidad: string;
  notasPedagogicas: string;
  datosNumericosContextualizados?: string[]; // Ej: 165,658; 38,456; 21,985; etc.
}

export type TipoPlanificacion = 
  | 'diaria'
  | 'semanal'
  | 'unidad'
  | 'trimestral'
  | 'anual'
  | 'mensual'
  | 'secuencia'
  | 'proyecto_ppa'
  | 'proyecto_steam'
  | 'centro_interes'
  | 'recuperacion'
  | 'evaluacion';

export type EstadoPlanificacion = 
  | 'Borrador'
  | 'En revisión'
  | 'Requiere ajustes'
  | 'Revisado'
  | 'Aprobado institucionalmente';

export interface PlanSession {
  id: string;
  numero: number;
  fecha?: string;
  duracionMinutos: number;
  momentoInicio: {
    duracionMin: number;
    rutinaDiaria: string;
    retroalimentacion: string;
    saberesPrevios: string;
    recursos: string;
  };
  momentoDesarrollo: {
    duracionMin: number;
    actividades: string;
    numeroLetraSecuencia?: string;
    recursos: string;
  };
  momentoCierre: {
    duracionMin: number;
    puntualizaciones: string;
    sistematizacion: string;
    metacognicion: string;
    recursos: string;
  };
  actividadesDiversidad: string;
  actividadDiarioEstudiante: string;
  lecturaRecomendada: string;
  notasDocente: string;
}

export interface LessonPlan {
  id: string;
  codigoDocumento: string;
  titulo: string;
  tipo: TipoPlanificacion;
  estado: EstadoPlanificacion;
  docenteId: string;
  docenteNombre: string;
  docenteCedula: string;
  centroEducativoId: string;
  centroEducativoNombre: string;
  regional: string;
  distrito: string;
  nivel: 'Inicial' | 'Primario' | 'Secundario';
  ciclo: 'Primer Ciclo' | 'Segundo Ciclo';
  grado: string;
  seccion: string;
  area: string;
  anoEscolar: string;
  periodo: string; // "P1", "P2", "P3", "P4", "1er Trimestre", "Anual", etc.
  secuenciaReferenciaId?: string;
  secuenciaReferenciaTitulo?: string;
  esOficialMINERD: boolean;
  fuenteCurricular: string;
  
  // Estructura oficial 25 apartados MINERD
  situacionAprendizaje: string;
  competenciasFundamentales: string[];
  competenciasEspecificas: string[];
  indicadoresLogro: string[];
  contenidosConceptuales: string[];
  contenidosProcedimentales: string[];
  contenidosActitudinales: string[];
  estrategiasEnsenanza: string[];
  
  // Contenido de sesiones (para diaria / semanal / mensual / secuencia)
  sesiones: PlanSession[];

  // Estructuras especializadas oficiales MINERD según tipo de planificación
  diasSemana?: {
    dia: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes';
    fecha?: string;
    bloqueHorario?: string;
    intencionPedagogica: string;
    actividades: string;
    indicadores: string;
    recursos: string;
    tareas: string;
  }[];
  cronogramaPeriodo?: {
    semana: string;
    unidadTema: string;
    competenciasEIndicadores: string;
    actividadesClave: string;
    evaluacionHito: string;
  }[];
  cronogramaAnual?: {
    mes: string;
    periodo: string;
    unidadesSecuencias: string;
    efemeridesMINERD: string;
    diasLectivos: number;
  }[];
  proyectoDetalles?: {
    nombreProyecto: string;
    problematicaComunitaria: string;
    preguntasGeneradoras: string[];
    productosEsperados: string[];
  };
  centroInteresDetalles?: {
    temaGenerador: string;
    momentos: {
      observacion: string;
      asociacion: string;
      expresion: string;
    };
    rinconesTrabajo: string[];
  };
  
  // Apartados globales
  recursosDidacticos: string[];
  tecnicasEvaluacion: string[];
  evidenciasAprendizaje: string[];
  actividadesRecuperacion: string;
  estrategiasAtencionDiversidad: string;
  metacognicionReflexion: string;
  observacionesDocente: string;
  
  // Validación y trazabilidad
  verificacionCurricular: {
    estado: 'Coincidencia documentada' | 'Requiere revisión' | 'Contenido propuesto por inteligencia artificial, pendiente de validación curricular';
    observaciones: string[];
    coherenciaScore: number; // 0 a 100
    fuenteVerificada: boolean;
  };
  
  revisionesInstitucionales: {
    revisadoPorId?: string;
    revisadoPorNombre?: string;
    revisadoPorRol?: string;
    fechaRevision?: string;
    comentario?: string;
    accion: 'observacion' | 'solicitud_ajuste' | 'marcado_revisado' | 'aprobado_institucional';
  }[];

  historialVersiones: {
    version: number;
    fecha: string;
    guardadoPor: string;
    motivo: string;
  }[];

  esFavorito?: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface TeacherCensusRecord {
  cedula: string;
  nombres: string;
  apellidos: string;
  nombreCompleto?: string;
  correoInstitucional: string; // Correo institucional o personal
  correoPersonal?: string;
  centroEducativo: string;
  codigoSIGERD: string;
  regional: string;
  distrito: string;
  cargo: 'Docente' | 'Coordinador Pedagógico' | 'Director de Centro' | 'Administrador de la Plataforma';
  cargoNomina?: string;
  cargoFuncion?: string;
  nivel: 'Primario' | 'Secundario' | 'Inicial';
  ciclo: 'Primer Ciclo' | 'Segundo Ciclo';
  areaPrincipal: string;
  grados: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userNombre: string;
  userRol: string;
  accion: string;
  detalles: string;
}

export interface PermissionRequest {
  id: string;
  cedula: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  motivo: string;
  cargoSolicitado: 'Docente' | 'Coordinador Pedagógico' | 'Director de Centro';
  areaSugerida: string;
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado';
  fechaSolicitud: string;
  revisadoPor?: string;
  fechaRevision?: string;
}
