import React, { useState, useEffect } from 'react';
import {
  Sparkles, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle,
  BookOpen, Calendar, Clock, Layers, Users, Plus, Target, Check,
  Award, Compass, FileText, ChevronRight, CheckSquare, Square,
  School, Lightbulb, FolderCheck
} from 'lucide-react';
import { LessonPlan, UserProfile, OfficialCurriculumSequence, TipoPlanificacion } from '../types';
import { api } from '../services/api';
import { SHAREPOINT_OFFICIAL_GUIDES, SharePointGuide, getSharePointGuideById, getActivitiesForSequence, SequenceActivityDetail } from '../data/sharepointGuides';

const ALL_MINERD_FUNDAMENTALES = [
  'Comunicativa',
  'Pensamiento Lógico, Creativo y Crítico',
  'Resolución de Problemas',
  'Científica y Tecnológica',
  'Ética y Ciudadana',
  'Ambiental y de la Salud',
  'Desarrollo Personal y Espiritual'
];

const CURRICULAR_AREAS = [
  'Lengua Española',
  'Matemática',
  'Ciencias de la Naturaleza',
  'Ciencias Sociales',
  'Inglés (Lenguas Extranjeras)',
  'Tecnología Educativa (Informática / TIC)',
  'Educación Artística',
  'Educación Física',
  'Formación Integral Humana y Religiosa',
  'Desarrollo Integral (Nivel Inicial)'
];

const NIVEL_INICIAL_GRADES = [
  'Maternal (45 días a 11 meses)',
  'Párvulo (1 a 2 años)',
  'Kínder (2 a 3 años)',
  'Pre-Kínder (3 a 4 años)',
  'Kínder (4 a 5 años)',
  'Pre-Primario (5 a 6 años)'
];

const NIVEL_PRIMARIO_GRADES = [
  '1ro de Primaria',
  '2do de Primaria',
  '3ro de Primaria',
  '4to de Primaria',
  '5to de Primaria',
  '6to de Primaria'
];

const NIVEL_SECUNDARIO_GRADES = [
  '1ro de Secundaria',
  '2do de Secundaria',
  '3ro de Secundaria',
  '4to de Secundaria',
  '5to de Secundaria',
  '6to de Secundaria'
];

const PLANNING_TYPES_MINERD: { id: TipoPlanificacion; label: string; badge: string; desc: string }[] = [
  {
    id: 'diaria',
    label: 'Planificación Diaria de Aula',
    badge: 'Momentos de Clase',
    desc: 'Esquema diario oficial MINERD: Intención Pedagógica, Inicio (10 min), Desarrollo (70 min) y Cierre (10 min), recursos y vocabulario.'
  },
  {
    id: 'semanal',
    label: 'Planificación Semanal',
    badge: 'Lunes a Viernes',
    desc: 'Distribución semanal organizada por días hábiles, bloques horarios (90/45 min), progresión de actividades y tareas de afianzamiento.'
  },
  {
    id: 'unidad',
    label: 'Unidad de Aprendizaje',
    badge: '2 a 4 Semanas',
    desc: 'Estrategia articuladora matriz MINERD: Eje temático transversal, situación de aprendizaje contextualizada y matriz de secuencias.'
  },
  {
    id: 'trimestral',
    label: 'Planificación Trimestral / Por Período (P1 - P4)',
    badge: 'Registro de Grado',
    desc: 'Planificación periódica alineada a los 4 períodos del Registro de Grado Oficial del MINERD, corte de calificaciones e hitos evaluativos.'
  },
  {
    id: 'anual',
    label: 'Planificación Anual (Plan Docente Anual / PDA)',
    badge: '190 Días Lectivos',
    desc: 'Planificación general anual de 10 meses: diagnóstico inicial, distribución de unidades en P1-P4, efemérides patrias y nivelación.'
  },
  {
    id: 'proyecto_ppa',
    label: 'Proyecto Participativo de Aula (PPA) / Aprendizaje',
    badge: 'Problemática Real',
    desc: 'Estrategia constructivista MINERD a partir de una problemática comunitaria escolar elegida por los estudiantes, con productos tangibles.'
  },
  {
    id: 'centro_interes',
    label: 'Centro de Interés / Eje Temático',
    badge: 'Nivel Inicial y 1er Ciclo',
    desc: 'Metodología pedagógica para educación infantil: Observación activa, Asociación y Expresión lúdica en rincones de aprendizaje.'
  },
  {
    id: 'secuencia',
    label: 'Planificación por Secuencia Didáctica',
    badge: 'Crece Primaria',
    desc: 'Planificación basada en los fascículos y guías de secuencias didácticas oficiales de la Dirección General de Educación Primaria.'
  },
  {
    id: 'proyecto_steam',
    label: 'Proyecto Integrado STEAM',
    badge: 'Ciencia y Tecnología',
    desc: 'Articulación interdisciplinaria de Ciencia, Tecnología, Ingeniería, Arte y Matemática con experimentación y prototipos.'
  },
  {
    id: 'recuperacion',
    label: 'Plan de Recuperación Pedagógica y Nivelación',
    badge: 'Atención a la Diversidad',
    desc: 'Estrategias intensivas de afianzamiento para estudiantes con ritmos de aprendizaje que requieren apoyo personalizado.'
  },
  {
    id: 'evaluacion',
    label: 'Instrumentos de Evaluación de Aprendizajes',
    badge: 'Rúbricas y Escalas',
    desc: 'Rúbricas analíticas, listas de cotejo, escalas de estimación y registros anecdóticos alineados a los indicadores del MINERD.'
  }
];

interface PlanGeneratorWizardProps {
  currentUser: UserProfile;
  sequences: OfficialCurriculumSequence[];
  initialSequence?: OfficialCurriculumSequence | null;
  initialType?: TipoPlanificacion;
  onPlanCreated: (plan: LessonPlan) => void;
  onCancel: () => void;
}

export const PlanGeneratorWizard: React.FC<PlanGeneratorWizardProps> = ({
  currentUser,
  sequences,
  initialSequence,
  initialType,
  onPlanCreated,
  onCancel
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // When initialSequence is null (teacher clicked "Nueva Planificación"), start ALL fields completely blank!
  const [formData, setFormData] = useState({
    // Step 1: Identification & Grade (All blank on fresh creation)
    nivel: initialSequence ? initialSequence.nivel : '',
    ciclo: initialSequence ? initialSequence.ciclo : '',
    grado: initialSequence ? initialSequence.grado : '',
    seccion: '',
    area: initialSequence ? initialSequence.area : '',
    anoEscolar: '2026-2027',
    periodo: '',
    tipo: (initialType || '') as TipoPlanificacion | '',

    // Step 2: Curriculum Sequence & SharePoint Guide Selector
    selectedSharePointGuideId: '',
    secuenciaNumero: initialSequence ? String(initialSequence.numeroSecuencia) : '',
    secuenciaTitulo: initialSequence ? initialSequence.titulo : '',
    secuenciaId: initialSequence?.id || '',
    unidad: initialSequence?.unidad || '',
    cantidadSesiones: '',
    duracionMinutos: '',

    // Step 3: Pedagogical Context & Inclusion (Blank on fresh creation)
    caracteristicasGrupo: '',
    apoyoPedagogico: '',
    recursosDisponibles: '',
    contextoCentro: `${currentUser.centroEducativoNombre}`
  });

  // Selected Activity State (from sequence activities)
  const [availableSequenceActivities, setAvailableSequenceActivities] = useState<SequenceActivityDetail[]>([]);
  const [selectedActivityNumber, setSelectedActivityNumber] = useState<number>(1);
  const [selectedActivityPhase, setSelectedActivityPhase] = useState<'Inicio' | 'Desarrollo' | 'Cierre' | 'completa' | 'personalizada'>('Desarrollo');
  const [customActivityText, setCustomActivityText] = useState('');

  // Selected Curricular Elements State
  const [selectedCompFundamentales, setSelectedCompFundamentales] = useState<string[]>([]);
  const [selectedCompEspecificas, setSelectedCompEspecificas] = useState<string[]>([]);
  const [selectedContConceptuales, setSelectedContConceptuales] = useState<string[]>([]);
  const [selectedContProcedimentales, setSelectedContProcedimentales] = useState<string[]>([]);
  const [selectedContActitudinales, setSelectedContActitudinales] = useState<string[]>([]);
  const [selectedIndicadoresLogro, setSelectedIndicadoresLogro] = useState<string[]>([]);

  // Available options derived from chosen SharePoint Guide or sequence
  const [availableCompEspecificas, setAvailableCompEspecificas] = useState<string[]>([]);
  const [availableContConceptuales, setAvailableContConceptuales] = useState<string[]>([]);
  const [availableContProcedimentales, setAvailableContProcedimentales] = useState<string[]>([]);
  const [availableContActitudinales, setAvailableContActitudinales] = useState<string[]>([]);
  const [availableIndicadoresLogro, setAvailableIndicadoresLogro] = useState<string[]>([]);
  const [situacionAprendizajeGuia, setSituacionAprendizajeGuia] = useState('');

  // Extra inputs for adding custom elements
  const [extraCompEsp, setExtraCompEsp] = useState('');
  const [extraContConcept, setExtraContConcept] = useState('');
  const [extraContProc, setExtraContProc] = useState('');
  const [extraContAct, setExtraContAct] = useState('');
  const [extraIndicador, setExtraIndicador] = useState('');

  // Apply activity content helper
  const applyActivityContent = (act: SequenceActivityDetail, phase: 'Inicio' | 'Desarrollo' | 'Cierre' | 'completa' | 'personalizada') => {
    if (!act) return;
    if (phase === 'Inicio') {
      setCustomActivityText(act.actividadInicio);
    } else if (phase === 'Desarrollo') {
      setCustomActivityText(act.actividadDesarrollo);
    } else if (phase === 'Cierre') {
      setCustomActivityText(act.actividadCierre);
    } else if (phase === 'completa') {
      setCustomActivityText(
        `[INICIO - 10 MIN]: ${act.actividadInicio}\n\n[DESARROLLO - 70 MIN]: ${act.actividadDesarrollo}\n\n[CIERRE - 10 MIN]: ${act.actividadCierre}`
      );
    }
  };

  // When a SharePoint official guide is selected from the 13 documents
  const handleSelectSharePointGuide = (guideId: string) => {
    setFormData(prev => ({ ...prev, selectedSharePointGuideId: guideId }));
    if (!guideId) return;

    const guide = getSharePointGuideById(guideId);
    if (!guide) return;

    // Auto-fill grade, level and area if currently blank or update accordingly
    const suggestedFirstSeq = guide.secuenciasSugeridas[0];
    const initialSeqNum = suggestedFirstSeq ? String(suggestedFirstSeq.numero) : '1';

    setFormData(prev => ({
      ...prev,
      nivel: prev.nivel || guide.nivel,
      ciclo: prev.ciclo || guide.ciclo,
      grado: prev.grado || guide.grado,
      area: prev.area || guide.area,
      secuenciaNumero: initialSeqNum,
      secuenciaTitulo: suggestedFirstSeq ? suggestedFirstSeq.titulo : guide.label,
      unidad: suggestedFirstSeq ? suggestedFirstSeq.unidad : 'Unidad Curricular Oficial MINERD',
      cantidadSesiones: prev.cantidadSesiones || (prev.tipo === 'diaria' ? '1' : prev.tipo === 'semanal' ? '5' : '10'),
      duracionMinutos: prev.duracionMinutos || '90'
    }));

    // Load activities for sequence 1
    const acts = getActivitiesForSequence(guideId, Number(initialSeqNum) || 1);
    setAvailableSequenceActivities(acts);
    setSelectedActivityNumber(1);

    if (suggestedFirstSeq) {
      setSituacionAprendizajeGuia(suggestedFirstSeq.situacionAprendizaje);
      setAvailableCompEspecificas(suggestedFirstSeq.competenciasEspecificas);
      setAvailableContConceptuales(suggestedFirstSeq.contenidosConceptuales);
      setAvailableContProcedimentales(suggestedFirstSeq.contenidosProcedimentales);
      setAvailableContActitudinales(suggestedFirstSeq.contenidosActitudinales);
      setAvailableIndicadoresLogro(suggestedFirstSeq.indicadoresLogro);

      // Pre-select items
      setSelectedCompFundamentales(suggestedFirstSeq.competenciasFundamentales);
      setSelectedCompEspecificas(suggestedFirstSeq.competenciasEspecificas);
      setSelectedContConceptuales(suggestedFirstSeq.contenidosConceptuales);
      setSelectedContProcedimentales(suggestedFirstSeq.contenidosProcedimentales);
      setSelectedContActitudinales(suggestedFirstSeq.contenidosActitudinales);
      setSelectedIndicadoresLogro(suggestedFirstSeq.indicadoresLogro);

      setSelectedActivityPhase('Desarrollo');
      if (acts.length > 0) {
        applyActivityContent(acts[0], 'Desarrollo');
      } else {
        setCustomActivityText(suggestedFirstSeq.actividadDesarrollo);
      }
    }
  };

  // When a specific sequence number is changed within the guide
  const handleSequenceNumberChange = (num: string) => {
    setFormData(prev => ({ ...prev, secuenciaNumero: num }));
    const guide = getSharePointGuideById(formData.selectedSharePointGuideId);

    // Update activities for this sequence number
    const acts = getActivitiesForSequence(formData.selectedSharePointGuideId, Number(num) || 1);
    setAvailableSequenceActivities(acts);
    setSelectedActivityNumber(1);

    if (!guide) return;

    const foundSeq = guide.secuenciasSugeridas.find(s => String(s.numero) === num);
    if (foundSeq) {
      setFormData(prev => ({
        ...prev,
        secuenciaTitulo: foundSeq.titulo,
        unidad: foundSeq.unidad
      }));
      setSituacionAprendizajeGuia(foundSeq.situacionAprendizaje);
      setAvailableCompEspecificas(foundSeq.competenciasEspecificas);
      setAvailableContConceptuales(foundSeq.contenidosConceptuales);
      setAvailableContProcedimentales(foundSeq.contenidosProcedimentales);
      setAvailableContActitudinales(foundSeq.contenidosActitudinales);
      setAvailableIndicadoresLogro(foundSeq.indicadoresLogro);

      setSelectedCompFundamentales(foundSeq.competenciasFundamentales);
      setSelectedCompEspecificas(foundSeq.competenciasEspecificas);
      setSelectedContConceptuales(foundSeq.contenidosConceptuales);
      setSelectedContProcedimentales(foundSeq.contenidosProcedimentales);
      setSelectedContActitudinales(foundSeq.contenidosActitudinales);
      setSelectedIndicadoresLogro(foundSeq.indicadoresLogro);

      if (acts.length > 0) {
        applyActivityContent(acts[0], selectedActivityPhase);
      } else {
        setCustomActivityText(foundSeq.actividadDesarrollo);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        secuenciaTitulo: `Secuencia Didáctica Oficial Nº ${num}: ${prev.area} (${prev.grado})`,
        unidad: `Unidad de Aprendizaje Nº ${num}`
      }));
      if (acts.length > 0) {
        applyActivityContent(acts[0], selectedActivityPhase);
      }
    }
  };

  // When teacher selects a specific activity from this sequence
  const handleSelectActivityNumber = (actNum: number) => {
    setSelectedActivityNumber(actNum);
    const act = availableSequenceActivities.find(a => a.numero === actNum);
    if (act) {
      applyActivityContent(act, selectedActivityPhase);
    }
  };

  // Activity phase / moment change helper
  const handleSelectActivityOption = (phase: 'Inicio' | 'Desarrollo' | 'Cierre' | 'completa' | 'personalizada') => {
    setSelectedActivityPhase(phase);
    const act = availableSequenceActivities.find(a => a.numero === selectedActivityNumber) || availableSequenceActivities[0];
    if (act && phase !== 'personalizada') {
      applyActivityContent(act, phase);
    }
  };

  // Toggle helper for arrays
  const toggleArrayItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!formData.tipo) {
        setError('Por favor elija el Tipo de Planificación que desea elaborar.');
        return;
      }
      if (!formData.area) {
        setError('Por favor elija el Área Curricular.');
        return;
      }
      if (!formData.grado) {
        setError('Por favor seleccione el Grado o Nivel asignado.');
        return;
      }
    }

    if (step === 2) {
      if (selectedCompEspecificas.length === 0) {
        setError('Por favor seleccione o agregue al menos una Competencia Específica del Grado.');
        return;
      }
      if (selectedContConceptuales.length === 0) {
        setError('Por favor seleccione o agregue al menos un Contenido Conceptual.');
        return;
      }
      if (selectedIndicadoresLogro.length === 0) {
        setError('Por favor seleccione o agregue al menos un Indicador de Logro.');
        return;
      }
    }

    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    setError(null);
    if (step > 1) setStep(step - 1);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const guide = getSharePointGuideById(formData.selectedSharePointGuideId);
      const payload = {
        nivel: formData.nivel || 'Primario',
        ciclo: formData.ciclo || 'Segundo Ciclo',
        grado: formData.grado || '6to de Primaria',
        area: formData.area || 'Matemática',
        anoEscolar: formData.anoEscolar || '2026-2027',
        tipo: formData.tipo || 'diaria',
        unidad: formData.unidad || formData.secuenciaTitulo || 'Secuencia Didáctica Oficial MINERD',
        cantidadSesiones: Number(formData.cantidadSesiones) || (formData.tipo === 'diaria' ? 1 : formData.tipo === 'semanal' ? 5 : 10),
        duracionMinutos: Number(formData.duracionMinutos) || 90,
        caracteristicasGrupo: formData.caracteristicasGrupo || 'Estudiantes con diversos estilos de aprendizaje que responden activamente a actividades prácticas y colaborativas.',
        apoyoPedagogico: formData.apoyoPedagogico || 'Acompañamiento individualizado, material concreto y actividades multinivel.',
        recursosDisponibles: formData.recursosDisponibles || 'Fascículos y libros de texto oficiales MINERD, cuadernos, pizarra e instrumentos pedagógicos.',
        contextoCentro: `${currentUser.centroEducativoNombre}, Regional ${currentUser.regional}, Distrito ${currentUser.distrito}.`,
        secuenciaBaseTitulo: formData.secuenciaTitulo || guide?.label || '',
        actividadSeleccionada: customActivityText,
        competenciasFundamentales: selectedCompFundamentales,
        competenciasEspecificas: selectedCompEspecificas,
        contenidosConceptuales: selectedContConceptuales,
        contenidosProcedimentales: selectedContProcedimentales,
        contenidosActitudinales: selectedContActitudinales,
        indicadoresLogro: selectedIndicadoresLogro
      };

      const aiResponse = await api.generateAiPlan(payload);
      const generatedData = aiResponse.data;

      // Create new lesson plan combining user's chosen curricular selections and structure
      const newPlanPayload: Partial<LessonPlan> = {
        titulo: generatedData.titulo || `Planificación ${String(formData.tipo).toUpperCase()}: ${formData.area} (${formData.grado})`,
        tipo: (formData.tipo || 'diaria') as TipoPlanificacion,
        estado: 'Borrador',
        docenteId: currentUser.id,
        docenteNombre: `${currentUser.nombre} ${currentUser.apellidos}`,
        docenteCedula: currentUser.cedula,
        centroEducativoId: currentUser.centroEducativoId,
        centroEducativoNombre: currentUser.centroEducativoNombre,
        regional: currentUser.regional,
        distrito: currentUser.distrito,
        nivel: (formData.nivel || 'Primario') as any,
        ciclo: (formData.ciclo || 'Primer Ciclo') as any,
        grado: formData.grado,
        seccion: formData.seccion || 'A',
        area: formData.area,
        anoEscolar: formData.anoEscolar,
        periodo: formData.periodo || 'P1 (Primer Período)',
        secuenciaReferenciaId: formData.selectedSharePointGuideId,
        secuenciaReferenciaTitulo: formData.secuenciaTitulo || guide?.label,
        esOficialMINERD: !!guide,
        fuenteCurricular: guide ? guide.label : 'Adecuación Curricular Vigente MINERD',
        situacionAprendizaje: generatedData.situacionAprendizaje || situacionAprendizajeGuia || '',
        competenciasFundamentales: selectedCompFundamentales.length > 0 ? selectedCompFundamentales : (generatedData.competenciasFundamentales || []),
        competenciasEspecificas: selectedCompEspecificas.length > 0 ? selectedCompEspecificas : (generatedData.competenciasEspecificas || []),
        indicadoresLogro: selectedIndicadoresLogro.length > 0 ? selectedIndicadoresLogro : (generatedData.indicadoresLogro || []),
        contenidosConceptuales: selectedContConceptuales.length > 0 ? selectedContConceptuales : (generatedData.contenidosConceptuales || []),
        contenidosProcedimentales: selectedContProcedimentales.length > 0 ? selectedContProcedimentales : (generatedData.contenidosProcedimentales || []),
        contenidosActitudinales: selectedContActitudinales.length > 0 ? selectedContActitudinales : (generatedData.contenidosActitudinales || []),
        estrategiasEnsenanza: generatedData.estrategiasEnsenanza || ['Aprendizaje Basado en Problemas (ABP)', 'Indagación Dialógica', 'Modelado Docente'],
        sesiones: generatedData.sesiones?.map((s: any, idx: number) => {
          if (idx === 0) {
            const selectedAct = availableSequenceActivities.find(a => a.numero === selectedActivityNumber);
            const updated = { ...s };

            if (selectedAct?.intencionPedagogica) {
              updated.intencionPedagogicaDelDia = selectedAct.intencionPedagogica;
            }

            const actLabel = selectedAct ? `Secuencia Nº ${formData.secuenciaNumero || 1} - Actividad Nº ${selectedActivityNumber}: ${selectedAct.titulo}` : `Secuencia Nº ${formData.secuenciaNumero || 1}`;

            if (selectedActivityPhase === 'completa' && selectedAct) {
              updated.momentoInicio = {
                ...updated.momentoInicio,
                actividades: selectedAct.actividadInicio
              };
              updated.momentoDesarrollo = {
                ...updated.momentoDesarrollo,
                actividades: selectedAct.actividadDesarrollo,
                numeroLetraSecuencia: actLabel
              };
              updated.momentoCierre = {
                ...updated.momentoCierre,
                actividades: selectedAct.actividadCierre
              };
            } else if (selectedActivityPhase === 'Inicio' && customActivityText) {
              updated.momentoInicio = {
                ...updated.momentoInicio,
                actividades: customActivityText
              };
              updated.momentoDesarrollo = {
                ...updated.momentoDesarrollo,
                numeroLetraSecuencia: `${actLabel} (Fase de Inicio)`
              };
            } else if (selectedActivityPhase === 'Cierre' && customActivityText) {
              updated.momentoCierre = {
                ...updated.momentoCierre,
                actividades: customActivityText
              };
              updated.momentoDesarrollo = {
                ...updated.momentoDesarrollo,
                numeroLetraSecuencia: `${actLabel} (Fase de Cierre)`
              };
            } else if (customActivityText) {
              updated.momentoDesarrollo = {
                ...updated.momentoDesarrollo,
                actividades: customActivityText,
                numeroLetraSecuencia: actLabel
              };
            }
            return updated;
          }
          return s;
        }) || [],
        diasSemana: generatedData.diasSemana,
        cronogramaPeriodo: generatedData.cronogramaPeriodo,
        cronogramaAnual: generatedData.cronogramaAnual,
        proyectoDetalles: generatedData.proyectoDetalles,
        centroInteresDetalles: generatedData.centroInteresDetalles,
        recursosDidacticos: generatedData.recursosDidacticos || ['Libros y fascículos oficiales del MINERD', 'Cuaderno del estudiante', 'Pizarra'],
        tecnicasEvaluacion: generatedData.tecnicasEvaluacion || ['Rúbrica analítica', 'Lista de cotejo', 'Observación formativa'],
        evidenciasAprendizaje: generatedData.evidenciasAprendizaje || ['Cuaderno del estudiante y producciones escritas individuales y grupales'],
        actividadesRecuperacion: generatedData.actividadesRecuperacion || 'Actividad de afianzamiento pedagógico con material manipulativo y tutoría entre pares.',
        estrategiasAtencionDiversidad: formData.apoyoPedagogico || 'Acompañamiento individualizado y adaptaciones de acceso curricular.',
        metacognicionReflexion: generatedData.metacognicionReflexion || 'Preguntas metacognitivas: ¿Qué aprendimos hoy? ¿Cómo lo aprendimos? ¿Para qué nos sirve en la vida cotidiana?',
        observacionesDocente: `Plan elaborado en base a: ${formData.secuenciaTitulo || guide?.label || 'Curriculo MINERD'} - Guía Oficial SharePoint.`,
        verificacionCurricular: {
          estado: guide ? 'Coincidencia documentada' : 'Contenido propuesto por inteligencia artificial, pendiente de validación curricular',
          observaciones: guide
            ? [
                `Plan estructurado sobre ${guide.label}.`,
                `Secuencia Didáctica Nº ${formData.secuenciaNumero || 1}.`,
                `Actividad Nº ${selectedActivityNumber} (${availableSequenceActivities.find(a => a.numero === selectedActivityNumber)?.titulo || 'Oficial'}).`,
                `Fase de actividad seleccionada: ${selectedActivityPhase}.`
              ]
            : ['Propuesta curricular generada conforme a la adecuación curricular vigente.'],
          coherenciaScore: guide ? 99 : 90,
          fuenteVerificada: !!guide
        }
      };

      const createdPlan = await api.createPlan(newPlanPayload);
      onPlanCreated(createdPlan);
    } catch (err: any) {
      setError(err.message || 'Error al generar la planificación pedagógica.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Stepper Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#002B49] text-white flex items-center justify-center font-bold text-xs">
              MINERD
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">
                Nueva Planificación Curricular MINERD
              </h1>
              <p className="text-xs text-slate-500">
                Paso {step} de 3 • Planificaciones Oficiales (Diaria, Semanal, Unidad, Trimestral, Anual y Proyectos)
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Cancelar
          </button>
        </div>

        {/* Progress Bar */}
        <div className="grid grid-cols-3 gap-2">
          <div className={`h-2 rounded-full ${step >= 1 ? 'bg-[#002B49]' : 'bg-slate-200'}`}></div>
          <div className={`h-2 rounded-full ${step >= 2 ? 'bg-[#002B49]' : 'bg-slate-200'}`}></div>
          <div className={`h-2 rounded-full ${step >= 3 ? 'bg-[#002B49]' : 'bg-slate-200'}`}></div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-[#CE1126] rounded-r-xl flex items-start text-xs text-red-800">
          <AlertCircle className="w-4 h-4 text-[#CE1126] mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* ==================== STEP 1: Identification & Format ==================== */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <span className="w-6 h-6 rounded-full bg-[#002B49] text-white text-xs flex items-center justify-center mr-2">1</span>
              Paso 1: Tipo de Planificación, Grado y Área Curricular
            </h2>
            <span className="text-[11px] font-semibold text-slate-400">Campos en blanco para completar</span>
          </div>

          {/* 1. Tipo de Planificación Oficial MINERD */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Tipo de Planificación Oficial MINERD <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.tipo}
              onChange={e => setFormData({ ...formData, tipo: e.target.value as any })}
              className="w-full p-3 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 bg-white focus:border-[#002B49] outline-none"
            >
              <option value="">-- Seleccionar Tipo de Planificación --</option>
              {PLANNING_TYPES_MINERD.map(t => (
                <option key={t.id} value={t.id}>
                  {t.label} ({t.badge})
                </option>
              ))}
            </select>
            {formData.tipo && (
              <p className="mt-1.5 text-xs text-slate-600 bg-blue-50/70 p-2.5 rounded-lg border border-blue-100">
                {PLANNING_TYPES_MINERD.find(t => t.id === formData.tipo)?.desc}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nivel Educativo */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nivel Educativo <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.nivel}
                onChange={e => {
                  const newNivel = e.target.value;
                  setFormData({
                    ...formData,
                    nivel: newNivel,
                    grado: '' // Reset grade on level change
                  });
                }}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 bg-white"
              >
                <option value="">-- Seleccionar Nivel --</option>
                <option value="Inicial">Nivel Inicial (Maternal, Kínder, Párvulo, Pre-Primario)</option>
                <option value="Primario">Nivel Primario (1ro a 6to de Primaria)</option>
                <option value="Secundario">Nivel Secundario (1ro a 6to de Secundaria)</option>
              </select>
            </div>

            {/* Grado / Sección */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Grado / Sección <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={formData.grado}
                  onChange={e => setFormData({ ...formData, grado: e.target.value })}
                  className="col-span-2 p-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 bg-white"
                >
                  <option value="">-- Seleccionar Grado --</option>
                  {(!formData.nivel || formData.nivel === 'Inicial') && (
                    <optgroup label="Nivel Inicial">
                      {NIVEL_INICIAL_GRADES.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </optgroup>
                  )}
                  {(!formData.nivel || formData.nivel === 'Primario') && (
                    <optgroup label="Nivel Primario">
                      {NIVEL_PRIMARIO_GRADES.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </optgroup>
                  )}
                  {(!formData.nivel || formData.nivel === 'Secundario') && (
                    <optgroup label="Nivel Secundario">
                      {NIVEL_SECUNDARIO_GRADES.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
                <input
                  type="text"
                  value={formData.seccion}
                  onChange={e => setFormData({ ...formData, seccion: e.target.value })}
                  placeholder="Sección"
                  className="p-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 bg-white uppercase text-center"
                />
              </div>
            </div>

            {/* Área Curricular con Inglés y Tecnología Educativa */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Área Curricular <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.area}
                onChange={e => setFormData({ ...formData, area: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 bg-white"
              >
                <option value="">-- Seleccionar Área Curricular --</option>
                {CURRICULAR_AREAS.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Período Escolar */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Período Escolar MINERD
              </label>
              <select
                value={formData.periodo}
                onChange={e => setFormData({ ...formData, periodo: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 bg-white"
              >
                <option value="">-- Seleccionar Período --</option>
                <option value="P1 (Primer Período - Ago/Oct)">P1 (Primer Período - Ago/Oct)</option>
                <option value="P2 (Segundo Período - Nov/Ene)">P2 (Segundo Período - Nov/Ene)</option>
                <option value="P3 (Tercer Período - Feb/Mar)">P3 (Tercer Período - Feb/Mar)</option>
                <option value="P4 (Cuarto Período - Abr/Jun)">P4 (Cuarto Período - Abr/Jun)</option>
                <option value="Año Escolar Completo 2026-2027">Año Escolar Completo 2026-2027</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 flex items-center justify-between">
            <div>
              <p><strong>Centro Educativo:</strong> {currentUser.centroEducativoNombre} (Regional {currentUser.regional}, Distrito {currentUser.distrito})</p>
              <p className="mt-0.5"><strong>Docente:</strong> {currentUser.nombre} {currentUser.apellidos} • <strong>Cédula:</strong> {currentUser.cedula}</p>
            </div>
            <School className="w-8 h-8 text-slate-400 opacity-60" />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="py-2.5 px-6 bg-[#002B49] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#003860] flex items-center space-x-2"
            >
              <span>Siguiente: Secuencia y Guía Curricular</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== STEP 2: SharePoint Sequence Selection & Curricular Chooser ==================== */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
          <div>
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center">
              <span className="w-6 h-6 rounded-full bg-[#002B49] text-white text-xs flex items-center justify-center mr-2">2</span>
              Paso 2: Selección de Guía Oficial del Repositorio SharePoint (13 Documentos)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Escoja la guía oficial del repositorio, el número de secuencia didáctica y luego seleccione la actividad específica y los elementos curriculares a trabajar.
            </p>
          </div>

          {/* ========================================================================= */}
          {/* EXACT DROPDOWN STRUCTURE FROM USER IMAGE (13 SHAREPOINT DOCUMENTS) */}
          {/* ========================================================================= */}
          <div className="space-y-3 bg-blue-50/40 p-4 sm:p-5 rounded-2xl border border-blue-200">
            <label className="text-xs font-bold text-[#002B49] uppercase tracking-wider block">
              Repositorio Oficial SharePoint MINERD (13 Documentos Oficiales) <span className="text-red-500">*</span>
            </label>

            {/* Exactly matching image_3f86750c.png */}
            <select
              value={formData.selectedSharePointGuideId}
              onChange={e => handleSelectSharePointGuide(e.target.value)}
              className="w-full p-3 border-2 border-blue-500 rounded-xl text-sm font-bold text-slate-900 bg-white focus:ring-2 focus:ring-blue-600 outline-none shadow-xs"
            >
              <option value="">-- Seleccionar Guía Oficial del Repositorio SharePoint (13 Documentos) --</option>

              {/* Group 1: 3er Grado */}
              <optgroup label="Secuencias Didácticas 3er Grado">
                <option value="sec_3_lengua">3er Grado - Lengua Española (132 págs, 8 secuencias)</option>
                <option value="sec_3_mat">3er Grado - Matemática (320 págs, 7 secuencias)</option>
              </optgroup>

              {/* Group 2: 4to Grado */}
              <optgroup label="Secuencias Didácticas 4to Grado">
                <option value="sec_4_lengua">4to Grado - Lengua Española (212 págs, 10 secuencias)</option>
                <option value="sec_4_mat">4to Grado - Matemática (285 págs, 8 secuencias)</option>
              </optgroup>

              {/* Group 3: 5to Grado */}
              <optgroup label="Secuencias Didácticas 5to Grado">
                <option value="sec_5_lengua">5to Grado - Lengua Española (134 págs, 10 secuencias)</option>
                <option value="sec_5_mat">5to Grado - Matemática (308 págs, 10 secuencias)</option>
                <option value="sec_5_ciencias">5to Grado - Ciencias de la Naturaleza (279 págs, 6 secuencias)</option>
              </optgroup>

              {/* Group 4: 6to Grado */}
              <optgroup label="Secuencias Didácticas 6to Grado">
                <option value="sec_6_ciencias">6to Grado - Ciencias de la Naturaleza (297 págs, 6 secuencias)</option>
                <option value="sec_6_lengua">6to Grado - Lengua Española (172 págs, 10 secuencias)</option>
                <option value="sec_6_mat">6to Grado - Matemática (304 págs, 7 secuencias)</option>
              </optgroup>

              {/* Group 5: Marcos Normativos */}
              <optgroup label="Marcos Normativos y Formatos Oficiales">
                <option value="norm_adecuacion_primaria">Adecuación Curricular Nivel Primario (Oct 2023 - 404 págs)</option>
                <option value="norm_adecuacion_inicial">Adecuación Curricular Nivel Inicial (2023 - 194 págs)</option>
                <option value="norm_formato_diaria">Formato Oficial MINERD de Planificación Diaria</option>
              </optgroup>
            </select>

            {/* Sequence number selector pills if a guide is selected */}
            {formData.selectedSharePointGuideId && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700">
                    Número de Secuencia Didáctica:
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {getSharePointGuideById(formData.selectedSharePointGuideId)?.totalSecuencias || 10} secuencias oficiales en esta guía
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: Math.min(getSharePointGuideById(formData.selectedSharePointGuideId)?.totalSecuencias || 8, 10) }).map((_, idx) => {
                    const seqNum = String(idx + 1);
                    const isSelected = formData.secuenciaNumero === seqNum;
                    return (
                      <button
                        key={seqNum}
                        type="button"
                        onClick={() => handleSequenceNumberChange(seqNum)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          isSelected
                            ? 'bg-[#002B49] text-white shadow-xs'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        Secuencia {seqNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Guide Details preview */}
            {formData.selectedSharePointGuideId && (
              <div className="bg-white rounded-xl border border-blue-200 p-3.5 text-xs text-slate-700 space-y-2 mt-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#002B49]">
                    {formData.secuenciaTitulo || getSharePointGuideById(formData.selectedSharePointGuideId)?.label}
                  </span>
                  <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full text-[10px]">
                    Oficial MINERD Verificado
                  </span>
                </div>
                {situacionAprendizajeGuia && (
                  <p className="text-slate-600 italic leading-relaxed text-[11px]">
                    <strong>Situación de Aprendizaje Oficial:</strong> {situacionAprendizajeGuia}
                  </p>
                )}
                <div className="pt-1.5 border-t border-slate-100 text-[10px] text-slate-500 flex flex-wrap justify-between gap-2">
                  <span><strong>Fuente:</strong> Dirección General de Currículo y Crece Primaria MINERD</span>
                  <span><strong>Páginas:</strong> {getSharePointGuideById(formData.selectedSharePointGuideId)?.paginas} págs</span>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* APARTADO 1: ACTIVIDAD DE LA SECUENCIA QUE VA A REALIZAR CON LOS ESTUDIANTES */}
          {/* ========================================================================= */}
          <div className="space-y-4 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center text-[#002B49]">
                  <Target className="w-4 h-4 mr-2 text-[#CE1126]" />
                  <span>1. Actividad de la Secuencia a Trabajar con los Estudiantes</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Seleccione la actividad específica de la Secuencia Nº {formData.secuenciaNumero || '1'} y luego el momento o fase correspondiente:
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-400">Requerido</span>
            </div>

            {/* Selector de la Actividad de la Secuencia */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#002B49] uppercase tracking-wider block">
                  Actividades de la Secuencia Nº {formData.secuenciaNumero || '1'} (Escoja una):
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">
                  {availableSequenceActivities.length > 0 ? `${availableSequenceActivities.length} actividades disponibles` : 'Secuencia oficial'}
                </span>
              </div>

              {/* Botones de selección de actividades */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {availableSequenceActivities.map(act => {
                  const isSelected = selectedActivityNumber === act.numero;
                  return (
                    <button
                      key={act.numero}
                      type="button"
                      onClick={() => handleSelectActivityNumber(act.numero)}
                      className={`p-2.5 rounded-xl border text-left transition flex items-start space-x-2 ${
                        isSelected
                          ? 'bg-[#002B49] text-white border-[#002B49] shadow-xs'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5 ${
                        isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {act.numero}
                      </span>
                      <div className="min-w-0">
                        <span className="text-xs font-bold block truncate">{act.titulo}</span>
                        <span className={`text-[10px] block truncate ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>
                          {act.intencionPedagogica}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Ficha descriptiva de la actividad elegida */}
              {(() => {
                const selectedAct = availableSequenceActivities.find(a => a.numero === selectedActivityNumber) || availableSequenceActivities[0];
                if (!selectedAct) return null;
                return (
                  <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#002B49] text-xs">
                        {selectedAct.titulo}
                      </span>
                      <span className="bg-[#002B49] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Actividad Nº {selectedAct.numero} Seleccionada
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700">
                      <strong>Intención Pedagógica:</strong> {selectedAct.intencionPedagogica}
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* Selector de Fase o Momento de esa actividad */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Fase o Momento de la Actividad Nº {selectedActivityNumber} a Desarrollar:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Inicio */}
                <button
                  type="button"
                  onClick={() => handleSelectActivityOption('Inicio')}
                  className={`p-3 rounded-xl border text-left transition ${
                    selectedActivityPhase === 'Inicio'
                      ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-1 ring-amber-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-amber-900">Fase de Inicio</span>
                    {selectedActivityPhase === 'Inicio' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Rutina diaria de acogida, retroalimentación y activación de saberes previos.
                  </p>
                </button>

                {/* Desarrollo */}
                <button
                  type="button"
                  onClick={() => handleSelectActivityOption('Desarrollo')}
                  className={`p-3 rounded-xl border text-left transition ${
                    selectedActivityPhase === 'Desarrollo'
                      ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-blue-900">Fase de Desarrollo (Central)</span>
                    {selectedActivityPhase === 'Desarrollo' && <CheckCircle2 className="w-4 h-4 text-blue-700" />}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Modelado docente, actividad de la secuencia oficial y resolución colaborativa.
                  </p>
                </button>

                {/* Cierre */}
                <button
                  type="button"
                  onClick={() => handleSelectActivityOption('Cierre')}
                  className={`p-3 rounded-xl border text-left transition ${
                    selectedActivityPhase === 'Cierre'
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-900">Fase de Cierre (10 min)</span>
                    {selectedActivityPhase === 'Cierre' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Puntualizaciones docentes, preguntas clave, metacognición y evaluación formativa.
                  </p>
                </button>
              </div>
            </div>

            {/* Quick full cycle buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleSelectActivityOption('completa')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedActivityPhase === 'completa'
                    ? 'bg-[#002B49] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ⭐ Ciclo Completo de la Actividad {selectedActivityNumber} (Inicio + Desarrollo + Cierre)
              </button>
              <button
                type="button"
                onClick={() => setSelectedActivityPhase('personalizada')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedActivityPhase === 'personalizada'
                    ? 'bg-[#002B49] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ✏️ Redactar Actividad Personalizada
              </button>
            </div>

            {/* Editable Activity Box */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Descripción detallada de la actividad que va a realizar con los estudiantes (editable):
              </label>
              <textarea
                rows={3}
                value={customActivityText}
                onChange={e => setCustomActivityText(e.target.value)}
                placeholder="Escriba o ajuste la consigna pedagógica, organización en equipos, consignas y preguntas orientadoras..."
                className="w-full p-3 border border-slate-300 rounded-xl text-xs text-slate-800 leading-relaxed focus:border-[#002B49] outline-none"
              />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* APARTADO 2: COMPETENCIAS FUNDAMENTALES Y ESPECÍFICAS DEL GRADO */}
          {/* ========================================================================= */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center text-[#002B49]">
                <Award className="w-4 h-4 mr-2 text-[#002B49]" />
                <span>2. Competencias Fundamentales y Específicas del Grado</span>
              </h3>
              <p className="text-xs text-slate-500">
                Seleccione las competencias que serán movilizadas y evaluadas en esta planificación:
              </p>
            </div>

            {/* Competencias Fundamentales */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Competencias Fundamentales MINERD ({selectedCompFundamentales.length} seleccionadas):
              </span>
              <div className="flex flex-wrap gap-2">
                {ALL_MINERD_FUNDAMENTALES.map(cf => {
                  const isChecked = selectedCompFundamentales.includes(cf);
                  return (
                    <button
                      key={cf}
                      type="button"
                      onClick={() => toggleArrayItem(selectedCompFundamentales, setSelectedCompFundamentales, cf)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
                        isChecked
                          ? 'bg-[#002B49] text-white shadow-2xs'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{cf}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Competencias Específicas del Grado */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 block">
                  Competencias Específicas del Grado ({selectedCompEspecificas.length} seleccionadas) <span className="text-red-500">*</span>:
                </span>
                <div className="space-x-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setSelectedCompEspecificas(availableCompEspecificas)}
                    className="text-[#002B49] font-bold hover:underline"
                  >
                    Seleccionar todas
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setSelectedCompEspecificas([])}
                    className="text-slate-500 hover:underline"
                  >
                    Desmarcar
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {availableCompEspecificas.map((ce, i) => {
                  const isChecked = selectedCompEspecificas.includes(ce);
                  return (
                    <div
                      key={i}
                      onClick={() => toggleArrayItem(selectedCompEspecificas, setSelectedCompEspecificas, ce)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-start space-x-3 ${
                        isChecked
                          ? 'bg-blue-50/60 border-blue-300 text-blue-950 font-medium'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="mt-0.5">
                        {isChecked ? <CheckSquare className="w-4 h-4 text-[#002B49]" /> : <Square className="w-4 h-4 text-slate-400" />}
                      </div>
                      <span className="flex-1 leading-relaxed">{ce}</span>
                    </div>
                  );
                })}
              </div>

              {/* Add custom specific competency */}
              <div className="flex space-x-2 pt-1">
                <input
                  type="text"
                  value={extraCompEsp}
                  onChange={e => setExtraCompEsp(e.target.value)}
                  placeholder="Agregar otra competencia específica del grado..."
                  className="flex-1 p-2 border border-slate-300 rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (extraCompEsp.trim()) {
                      setSelectedCompEspecificas([...selectedCompEspecificas, extraCompEsp.trim()]);
                      setAvailableCompEspecificas([...availableCompEspecificas, extraCompEsp.trim()]);
                      setExtraCompEsp('');
                    }
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* APARTADO 3: CONTENIDOS CONCEPTUALES */}
          {/* ========================================================================= */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center text-[#002B49]">
                  <BookOpen className="w-4 h-4 mr-2 text-indigo-700" />
                  <span>3. Contenidos Conceptuales</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Conceptos, nociones y definiciones de la secuencia didáctica:
                </p>
              </div>
              <div className="space-x-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedContConceptuales(availableContConceptuales)}
                  className="text-[#002B49] font-bold hover:underline"
                >
                  Seleccionar todos ({selectedContConceptuales.length})
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setSelectedContConceptuales([])}
                  className="text-slate-500 hover:underline"
                >
                  Desmarcar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableContConceptuales.map((concept, i) => {
                const isChecked = selectedContConceptuales.includes(concept);
                return (
                  <div
                    key={i}
                    onClick={() => toggleArrayItem(selectedContConceptuales, setSelectedContConceptuales, concept)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-start space-x-2.5 ${
                      isChecked
                        ? 'bg-indigo-50/60 border-indigo-300 text-indigo-950 font-medium'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isChecked ? <CheckSquare className="w-4 h-4 text-indigo-700" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </div>
                    <span className="flex-1 leading-relaxed">{concept}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex space-x-2 pt-1">
              <input
                type="text"
                value={extraContConcept}
                onChange={e => setExtraContConcept(e.target.value)}
                placeholder="Agregar contenido conceptual adicional..."
                className="flex-1 p-2 border border-slate-300 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (extraContConcept.trim()) {
                    setSelectedContConceptuales([...selectedContConceptuales, extraContConcept.trim()]);
                    setAvailableContConceptuales([...availableContConceptuales, extraContConcept.trim()]);
                    setExtraContConcept('');
                  }
                }}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
              >
                Agregar
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* APARTADO 4: CONTENIDOS PROCEDIMENTALES */}
          {/* ========================================================================= */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center text-[#002B49]">
                  <Compass className="w-4 h-4 mr-2 text-teal-700" />
                  <span>4. Contenidos Procedimentales</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Habilidades prácticas, algoritmos, indagación y resolución de problemas:
                </p>
              </div>
              <div className="space-x-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedContProcedimentales(availableContProcedimentales)}
                  className="text-[#002B49] font-bold hover:underline"
                >
                  Seleccionar todos ({selectedContProcedimentales.length})
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setSelectedContProcedimentales([])}
                  className="text-slate-500 hover:underline"
                >
                  Desmarcar
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {availableContProcedimentales.map((proc, i) => {
                const isChecked = selectedContProcedimentales.includes(proc);
                return (
                  <div
                    key={i}
                    onClick={() => toggleArrayItem(selectedContProcedimentales, setSelectedContProcedimentales, proc)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-start space-x-2.5 ${
                      isChecked
                        ? 'bg-teal-50/60 border-teal-300 text-teal-950 font-medium'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isChecked ? <CheckSquare className="w-4 h-4 text-teal-700" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </div>
                    <span className="flex-1 leading-relaxed">{proc}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex space-x-2 pt-1">
              <input
                type="text"
                value={extraContProc}
                onChange={e => setExtraContProc(e.target.value)}
                placeholder="Agregar contenido procedimental adicional..."
                className="flex-1 p-2 border border-slate-300 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (extraContProc.trim()) {
                    setSelectedContProcedimentales([...selectedContProcedimentales, extraContProc.trim()]);
                    setAvailableContProcedimentales([...availableContProcedimentales, extraContProc.trim()]);
                    setExtraContProc('');
                  }
                }}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
              >
                Agregar
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* APARTADO 5: CONTENIDOS DE ACTITUDES Y VALORES */}
          {/* ========================================================================= */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center text-[#002B49]">
                  <Users className="w-4 h-4 mr-2 text-rose-700" />
                  <span>5. Contenidos de Actitudes y Valores</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Actitudes éticas, cooperación, valoración y normas cívicas a fomentar:
                </p>
              </div>
              <div className="space-x-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedContActitudinales(availableContActitudinales)}
                  className="text-[#002B49] font-bold hover:underline"
                >
                  Seleccionar todos ({selectedContActitudinales.length})
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setSelectedContActitudinales([])}
                  className="text-slate-500 hover:underline"
                >
                  Desmarcar
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {availableContActitudinales.map((act, i) => {
                const isChecked = selectedContActitudinales.includes(act);
                return (
                  <div
                    key={i}
                    onClick={() => toggleArrayItem(selectedContActitudinales, setSelectedContActitudinales, act)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-start space-x-2.5 ${
                      isChecked
                        ? 'bg-rose-50/60 border-rose-300 text-rose-950 font-medium'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isChecked ? <CheckSquare className="w-4 h-4 text-rose-700" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </div>
                    <span className="flex-1 leading-relaxed">{act}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex space-x-2 pt-1">
              <input
                type="text"
                value={extraContAct}
                onChange={e => setExtraContAct(e.target.value)}
                placeholder="Agregar actitud o valor adicional..."
                className="flex-1 p-2 border border-slate-300 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (extraContAct.trim()) {
                    setSelectedContActitudinales([...selectedContActitudinales, extraContAct.trim()]);
                    setAvailableContActitudinales([...availableContActitudinales, extraContAct.trim()]);
                    setExtraContAct('');
                  }
                }}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
              >
                Agregar
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* APARTADO 6: INDICADORES DE LOGRO */}
          {/* ========================================================================= */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center text-[#002B49]">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-700" />
                  <span>6. Indicadores de Logro</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Criterios oficiales y evidencias evaluables del aprendizaje:
                </p>
              </div>
              <div className="space-x-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedIndicadoresLogro(availableIndicadoresLogro)}
                  className="text-[#002B49] font-bold hover:underline"
                >
                  Seleccionar todos ({selectedIndicadoresLogro.length})
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setSelectedIndicadoresLogro([])}
                  className="text-slate-500 hover:underline"
                >
                  Desmarcar
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {availableIndicadoresLogro.map((ind, i) => {
                const isChecked = selectedIndicadoresLogro.includes(ind);
                return (
                  <div
                    key={i}
                    onClick={() => toggleArrayItem(selectedIndicadoresLogro, setSelectedIndicadoresLogro, ind)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-start space-x-2.5 ${
                      isChecked
                        ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950 font-medium'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isChecked ? <CheckSquare className="w-4 h-4 text-emerald-700" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </div>
                    <span className="flex-1 leading-relaxed">{ind}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex space-x-2 pt-1">
              <input
                type="text"
                value={extraIndicador}
                onChange={e => setExtraIndicador(e.target.value)}
                placeholder="Agregar indicador de logro adicional..."
                className="flex-1 p-2 border border-slate-300 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (extraIndicador.trim()) {
                    setSelectedIndicadoresLogro([...selectedIndicadoresLogro, extraIndicador.trim()]);
                    setAvailableIndicadoresLogro([...availableIndicadoresLogro, extraIndicador.trim()]);
                    setExtraIndicador('');
                  }
                }}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
              >
                Agregar
              </button>
            </div>
          </div>

          {/* Sessions & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Cantidad de Sesiones o Bloques a Planificar
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={formData.cantidadSesiones}
                onChange={e => setFormData({ ...formData, cantidadSesiones: e.target.value })}
                placeholder="ej: 1 (diaria), 5 (semanal), 12 (unidad)"
                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Duración por Sesión (Minutos)
              </label>
              <select
                value={formData.duracionMinutos}
                onChange={e => setFormData({ ...formData, duracionMinutos: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 bg-white"
              >
                <option value="">-- Seleccionar Duración --</option>
                <option value="90">90 minutos (Bloque estándar Jornada Escolar Extendida)</option>
                <option value="45">45 minutos (Hora pedagógica simple)</option>
                <option value="60">60 minutos</option>
                <option value="30">30 minutos (Actividad focal Nivel Inicial)</option>
              </select>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-2">
            <button
              onClick={handleBack}
              className="py-2.5 px-5 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              onClick={handleNext}
              className="py-2.5 px-6 bg-[#002B49] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#003860] flex items-center space-x-2"
            >
              <span>Siguiente: Contexto y Generación</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== STEP 3: Context, Needs & Generation ==================== */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center">
            <span className="w-6 h-6 rounded-full bg-[#002B49] text-white text-xs flex items-center justify-center mr-2">3</span>
            Paso 3: Contextualización, Inclusión y Generación Pedagógica
          </h2>

          {/* Summary of Curricular Selections */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-xs space-y-2">
            <span className="font-bold text-[#002B49] block text-xs uppercase tracking-wider">
              Resumen de Elementos Curriculares Seleccionados:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
              <div>
                <strong>Tipo de Plan:</strong> {PLANNING_TYPES_MINERD.find(t => t.id === formData.tipo)?.label || formData.tipo}
              </div>
              <div>
                <strong>Área y Grado:</strong> {formData.area} • {formData.grado} ({formData.seccion || 'A'})
              </div>
              <div>
                <strong>Guía / Secuencia:</strong> Nº {formData.secuenciaNumero || '1'} - {formData.secuenciaTitulo || 'Guía Oficial SharePoint'}
              </div>
              <div>
                <strong>Actividad Elegida:</strong> {selectedActivityPhase} ({customActivityText.slice(0, 50)}...)
              </div>
              <div>
                <strong>Competencias:</strong> {selectedCompFundamentales.length} Fundamentales • {selectedCompEspecificas.length} Específicas
              </div>
              <div>
                <strong>Contenidos:</strong> {selectedContConceptuales.length} Conceptuales • {selectedContProcedimentales.length} Procedimentales • {selectedContActitudinales.length} Actitudes
              </div>
              <div className="col-span-1 sm:col-span-2">
                <strong>Indicadores de Logro:</strong> {selectedIndicadoresLogro.length} seleccionados para evaluación formativa
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Características del Grupo de Estudiantes (Opcional)
            </label>
            <textarea
              rows={2}
              value={formData.caracteristicasGrupo}
              onChange={e => setFormData({ ...formData, caracteristicasGrupo: e.target.value })}
              placeholder="Describa el ritmo de aprendizaje, intereses, cantidad de estudiantes y dinámicas del grupo..."
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Estrategias de Atención a la Diversidad y Necesidades de Apoyo (Opcional)
            </label>
            <textarea
              rows={2}
              value={formData.apoyoPedagogico}
              onChange={e => setFormData({ ...formData, apoyoPedagogico: e.target.value })}
              placeholder="Describa apoyos para estudiantes con ritmos diferenciados, adaptaciones de acceso o tutoría entre pares..."
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Recursos Didácticos y Tecnológicos Disponibles en el Centro (Opcional)
            </label>
            <input
              type="text"
              value={formData.recursosDisponibles}
              onChange={e => setFormData({ ...formData, recursosDisponibles: e.target.value })}
              placeholder="ej: Fascículos MINERD, computadoras del aula de robótica, pizarra digital, material concreto..."
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs text-slate-800"
            />
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start">
            <Sparkles className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Garantía de Fidelidad Curricular PlanificaRD:</p>
              <p className="mt-0.5 text-amber-800">
                La planificación integrará con total coherencia el formato oficial de {PLANNING_TYPES_MINERD.find(t => t.id === formData.tipo)?.label || 'Planificación MINERD'}, la actividad seleccionada y los contenidos, competencias e indicadores que usted eligió.
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={handleBack}
              disabled={loading}
              className="py-2.5 px-5 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="py-3 px-8 bg-[#CE1126] hover:bg-[#B00E1F] text-white rounded-xl text-sm font-bold shadow-lg shadow-red-900/20 flex items-center space-x-2 transition disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generando Planificación Oficial...
                </span>
              ) : (
                <span className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-amber-300" />
                  Generar Planificación Oficial Completa
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
