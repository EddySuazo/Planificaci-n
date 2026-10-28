import React, { useState, useEffect } from 'react';
import {
  Save, Download, Printer, Copy, RefreshCw, ShieldCheck, ArrowLeft,
  Plus, Trash2, Clock, CheckCircle2, History, AlertCircle, FileText,
  School, CheckSquare, Sparkles, BookOpen, Calendar, Layers, Lightbulb,
  X, AlertTriangle
} from 'lucide-react';
import { LessonPlan, UserProfile, PlanSession, EstadoPlanificacion } from '../types';
import { exportLessonPlanToDocx } from '../utils/docxExport';
import { api } from '../services/api';

interface PlanEditorViewProps {
  initialPlan: LessonPlan;
  currentUser: UserProfile;
  onSave: (updated: LessonPlan) => void;
  onClose: () => void;
  onConvert: (plan: LessonPlan) => void;
  onDuplicate: (plan: LessonPlan) => void;
  onVerify: (plan: LessonPlan) => void;
  onDelete?: (planId: string) => void;
}

export const PlanEditorView: React.FC<PlanEditorViewProps> = ({
  initialPlan,
  currentUser,
  onSave,
  onClose,
  onConvert,
  onDuplicate,
  onVerify,
  onDelete
}) => {
  const [plan, setPlan] = useState<LessonPlan>(initialPlan);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Guardado');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [selectedSessionIdx, setSelectedSessionIdx] = useState<number>(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Auto-save logic
  const handleManualSave = async () => {
    setIsSaving(true);
    try {
      const updated = await api.updatePlan(plan.id, plan);
      setPlan(updated);
      onSave(updated);
      setLastSavedTime(new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e) {
      console.error('Error saving plan:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSession = () => {
    const newSessionNum = plan.sesiones.length + 1;
    const newSession: PlanSession = {
      id: `ses-${Date.now()}`,
      numero: newSessionNum,
      fecha: new Date().toISOString().split('T')[0],
      duracionMinutos: 90,
      momentoInicio: {
        duracionMin: 15,
        rutinaDiaria: 'Saludo, oración o reflexión del día, registro de asistencia, intención pedagógica.',
        retroalimentacion: 'Retroalimentación de la sesión anterior.',
        saberesPrevios: 'Pregunta activadora de conocimientos previos.',
        recursos: 'Pizarra, fichas didácticas'
      },
      momentoDesarrollo: {
        duracionMin: 65,
        actividades: 'Modelado docente y actividades prácticas colaborativas en parejas.',
        numeroLetraSecuencia: `Actividad ${newSessionNum} de la secuencia`,
        recursos: 'Fascículo oficial MINERD, cuaderno de trabajo'
      },
      momentoCierre: {
        duracionMin: 10,
        puntualizaciones: 'Puntualizaciones pedagógicas del docente.',
        sistematizacion: 'Preguntas y ejercicios de sistematización.',
        metacognicion: 'Reflexión metacognitiva: ¿Qué aprendimos hoy?',
        recursos: 'Diario del estudiante'
      },
      actividadesDiversidad: 'Acompañamiento en mesa de apoyo con material concreto.',
      actividadDiarioEstudiante: 'Síntesis escrita de 3 líneas en el cuaderno.',
      lecturaRecomendada: 'Libro de la semana o texto escolar MINERD.',
      notasDocente: 'Conservar los valores numéricos y precisiones curriculares del fascículo oficial.'
    };

    setPlan(prev => ({
      ...prev,
      sesiones: [...prev.sesiones, newSession]
    }));
    setSelectedSessionIdx(plan.sesiones.length);
  };

  const handleRemoveSession = (idx: number) => {
    if (plan.sesiones.length <= 1) return;
    const nextSes = plan.sesiones.filter((_, i) => i !== idx).map((s, i) => ({ ...s, numero: i + 1 }));
    setPlan(prev => ({ ...prev, sesiones: nextSes }));
    if (selectedSessionIdx >= nextSes.length) {
      setSelectedSessionIdx(Math.max(0, nextSes.length - 1));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentSession = plan.sesiones[selectedSessionIdx] || plan.sesiones[0];

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      {/* Top Action Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
              title="Volver"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {plan.codigoDocumento}
                </span>
                <span className="text-[11px] font-bold uppercase bg-blue-50 text-[#002B49] px-2 py-0.5 rounded">
                  {plan.tipo}
                </span>
                <span className="text-xs text-slate-500">
                  {isSaving ? 'Guardando cambios...' : `Guardado a las: ${lastSavedTime}`}
                </span>
              </div>
              <h1 className="text-base font-bold text-slate-900 truncate max-w-lg">
                {plan.titulo}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onVerify(plan)}
              className="px-3 py-1.5 border border-blue-200 bg-blue-50 text-[#002B49] rounded-xl text-xs font-bold hover:bg-blue-100 flex items-center space-x-1"
              title="Verificar Coherencia Curricular MINERD"
            >
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>Verificar Curricular</span>
            </button>

            <button
              onClick={() => onConvert(plan)}
              className="px-3 py-1.5 border border-slate-200 bg-white text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 flex items-center space-x-1"
              title="Convertir a otro formato de planificación"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
              <span>Convertir</span>
            </button>

            <button
              onClick={() => onDuplicate(plan)}
              className="px-3 py-1.5 border border-slate-200 bg-white text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 flex items-center space-x-1"
              title="Duplicar para otra sección"
            >
              <Copy className="w-3.5 h-3.5 text-slate-600" />
              <span>Duplicar</span>
            </button>

            <button
              onClick={() => setShowVersionHistory(!showVersionHistory)}
              className="px-3 py-1.5 border border-slate-200 bg-white text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 flex items-center space-x-1"
              title="Historial de Versiones"
            >
              <History className="w-3.5 h-3.5 text-slate-600" />
              <span>Versiones ({plan.historialVersiones?.length || 1})</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 border border-slate-200 bg-white text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 flex items-center space-x-1"
              title="Imprimir documento oficial"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={() => exportLessonPlanToDocx(plan)}
              className="px-3.5 py-1.5 bg-[#002B49] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#003860] flex items-center space-x-1.5"
              title="Descargar archivo Word .docx listo para MINERD"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Word (.docx)</span>
            </button>

            <button
              onClick={handleManualSave}
              disabled={isSaving}
              className="px-4 py-1.5 bg-[#CE1126] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#B00E1F] flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
            </button>

            {(currentUser.rol === 'administrador' || currentUser.rol === 'director' || currentUser.id === plan.docenteId) && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-3 py-1.5 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
                title="Eliminar esta planificación de la base de datos"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                <span>Eliminar</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Document Body */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-6">
        {/* Version History Drawer */}
        {showVersionHistory && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-md mb-6">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <History className="w-4 h-4 mr-2 text-blue-700" />
                Historial de Versiones y Trazabilidad Curricular
              </h3>
              <button
                onClick={() => setShowVersionHistory(false)}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                Cerrar
              </button>
            </div>
            <div className="space-y-2 text-xs">
              {(plan.historialVersiones || []).map((v, i) => (
                <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">Versión {v.version}</span>
                    <span className="text-slate-500 ml-2">por {v.guardadoPor}</span>
                    <p className="text-slate-600 italic text-[11px] mt-0.5">{v.motivo}</p>
                  </div>
                  <span className="text-slate-400 font-mono text-[10px]">{v.fecha}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Printable Official MINERD Paper Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 sm:p-12 space-y-8 print:border-none print:shadow-none print:p-0">
          {/* Official Dominican Header */}
          <div className="text-center border-b-2 border-[#002B49] pb-4">
            <h2 className="text-base sm:text-lg font-black tracking-widest text-[#002B49] uppercase">
              REPÚBLICA DOMINICANA
            </h2>
            <h3 className="text-sm sm:text-base font-extrabold tracking-wider text-[#CE1126] uppercase">
              MINISTERIO DE EDUCACIÓN (MINERD)
            </h3>
            <p className="text-xs text-slate-600 italic mt-0.5">
              Dirección Regional {plan.regional} • Distrito Educativo {plan.distrito}
            </p>
            <div className="mt-2 inline-block px-4 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-[#002B49] uppercase tracking-wider">
              PLANIFICACIÓN PEDAGÓGICA ({plan.tipo.toUpperCase()})
            </div>
          </div>

          {/* Institutional Identification Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-semibold block">Centro Educativo:</span>
              <input
                type="text"
                value={plan.centroEducativoNombre}
                onChange={e => setPlan({ ...plan, centroEducativoNombre: e.target.value })}
                className="font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-300 w-full focus:outline-none"
              />
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Código SIGERD:</span>
              <span className="font-mono text-slate-800">{plan.centroEducativoId}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Docente:</span>
              <input
                type="text"
                value={plan.docenteNombre}
                onChange={e => setPlan({ ...plan, docenteNombre: e.target.value })}
                className="font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-300 w-full focus:outline-none"
              />
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Cédula:</span>
              <span className="font-mono text-slate-800">{plan.docenteCedula}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Nivel, Ciclo y Grado:</span>
              <div className="flex gap-2">
                <span className="font-medium text-slate-800">{plan.nivel} - {plan.ciclo} | {plan.grado}</span>
                <span className="font-bold text-slate-900">Sección: {plan.seccion}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Área Curricular:</span>
              <input
                type="text"
                value={plan.area}
                onChange={e => setPlan({ ...plan, area: e.target.value })}
                className="font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-300 w-full focus:outline-none"
              />
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Año Escolar:</span>
              <span className="font-medium text-slate-800">{plan.anoEscolar}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Período de Evaluación:</span>
              <input
                type="text"
                value={plan.periodo}
                onChange={e => setPlan({ ...plan, periodo: e.target.value })}
                className="font-medium text-slate-800 bg-transparent border-b border-dashed border-slate-300 w-full focus:outline-none"
              />
            </div>
          </div>

          {/* Title of Unit or Sequence */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#002B49] uppercase tracking-wider block">
              Título de la Unidad o Secuencia Didáctica
            </label>
            <input
              type="text"
              value={plan.titulo}
              onChange={e => setPlan({ ...plan, titulo: e.target.value })}
              className="w-full text-base font-bold text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:border-[#002B49] outline-none"
            />
          </div>

          {/* Learning Situation */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#002B49] uppercase tracking-wider block">
              Situación de Aprendizaje
            </label>
            <textarea
              rows={3}
              value={plan.situacionAprendizaje}
              onChange={e => setPlan({ ...plan, situacionAprendizaje: e.target.value })}
              className="w-full text-xs text-slate-800 p-3 rounded-xl border border-slate-200 focus:border-[#002B49] outline-none leading-relaxed"
            />
          </div>

          {/* Competencies Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Fundamental Competencies */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#002B49] uppercase tracking-wider block">
                Competencias Fundamentales
              </label>
              <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {plan.competenciasFundamentales.map((cf, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#002B49]"></span>
                    <span>{cf}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specific Competencies */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#002B49] uppercase tracking-wider block">
                Competencias Específicas del Grado
              </label>
              <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {plan.competenciasEspecificas.map((ce, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#CE1126] mt-1.5 flex-shrink-0"></span>
                    <span className="leading-snug">{ce}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Indicators of Achievement */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#002B49] uppercase tracking-wider block">
              Indicadores de Logro MINERD
            </label>
            <div className="space-y-1 text-xs text-slate-800 bg-blue-50/40 p-3.5 rounded-xl border border-blue-200">
              {plan.indicadoresLogro.map((ind, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 mt-0.5 flex-shrink-0" />
                  <span className="leading-snug font-medium">{ind}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contents Matrix (Conceptuales, Procedimentales, Actitudinales) */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#002B49] uppercase tracking-wider block">
              Contenidos Curriculares Oficiales
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Conceptuales</span>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {plan.contenidosConceptuales.join('; ')}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Procedimentales</span>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {plan.contenidosProcedimentales.join('; ')}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Actitudinales y Valores</span>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {plan.contenidosActitudinales.join('; ')}
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SPECIALIZED OFFICIAL MINERD PLANNING PANELS */}
          {/* ========================================================================= */}

          {/* 1. PLANIFICACIÓN SEMANAL (DISTRIBUCIÓN LUNES A VIERNES) */}
          {plan.diasSemana && plan.diasSemana.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#002B49] flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5 text-blue-700" />
                    <span>Estructura Semanal de Clases (Lunes a Viernes)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dosificación progresiva semanal por bloques horarios oficiales
                  </p>
                </div>
                <span className="bg-blue-100 text-[#002B49] font-bold text-xs px-2.5 py-1 rounded-full">
                  Semanal
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <thead className="bg-[#002B49] text-white">
                    <tr>
                      <th className="p-3 text-left w-24">Día</th>
                      <th className="p-3 text-left w-1/4">Intención Pedagógica</th>
                      <th className="p-3 text-left w-1/3">Actividades de Aprendizaje</th>
                      <th className="p-3 text-left">Indicadores Evaluados</th>
                      <th className="p-3 text-left">Tareas / Hogar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {plan.diasSemana.map((d, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-[#002B49] bg-slate-50 align-top">
                          {d.dia}
                        </td>
                        <td className="p-3 align-top font-medium text-slate-800">
                          <textarea
                            rows={2}
                            value={d.intencionPedagogica}
                            onChange={e => {
                              const val = e.target.value;
                              setPlan(prev => {
                                const nextDias = [...(prev.diasSemana || [])];
                                nextDias[idx] = { ...nextDias[idx], intencionPedagogica: val };
                                return { ...prev, diasSemana: nextDias };
                              });
                            }}
                            className="w-full p-1 border border-slate-200 rounded text-xs bg-white"
                          />
                        </td>
                        <td className="p-3 align-top text-slate-700">
                          <textarea
                            rows={3}
                            value={d.actividades}
                            onChange={e => {
                              const val = e.target.value;
                              setPlan(prev => {
                                const nextDias = [...(prev.diasSemana || [])];
                                nextDias[idx] = { ...nextDias[idx], actividades: val };
                                return { ...prev, diasSemana: nextDias };
                              });
                            }}
                            className="w-full p-1 border border-slate-200 rounded text-xs bg-white"
                          />
                        </td>
                        <td className="p-3 align-top text-slate-700">
                          <input
                            type="text"
                            value={d.indicadores}
                            onChange={e => {
                              const val = e.target.value;
                              setPlan(prev => {
                                const nextDias = [...(prev.diasSemana || [])];
                                nextDias[idx] = { ...nextDias[idx], indicadores: val };
                                return { ...prev, diasSemana: nextDias };
                              });
                            }}
                            className="w-full p-1 border border-slate-200 rounded text-xs bg-white"
                          />
                        </td>
                        <td className="p-3 align-top text-slate-600">
                          <input
                            type="text"
                            value={d.tareas}
                            onChange={e => {
                              const val = e.target.value;
                              setPlan(prev => {
                                const nextDias = [...(prev.diasSemana || [])];
                                nextDias[idx] = { ...nextDias[idx], tareas: val };
                                return { ...prev, diasSemana: nextDias };
                              });
                            }}
                            className="w-full p-1 border border-slate-200 rounded text-xs bg-white"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. PLANIFICACIÓN TRIMESTRAL / POR PERÍODO (P1, P2, P3, P4) */}
          {plan.cronogramaPeriodo && plan.cronogramaPeriodo.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#002B49] flex items-center">
                    <Layers className="w-4 h-4 mr-1.5 text-indigo-700" />
                    <span>Cronograma y Hitos del Período Oficial (Registro de Grado MINERD)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Articulación por semanas, indicadores del período y corte evaluativo
                  </p>
                </div>
                <span className="bg-indigo-100 text-indigo-900 font-bold text-xs px-2.5 py-1 rounded-full">
                  {plan.periodo || 'Período Oficial'}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <thead className="bg-[#002B49] text-white">
                    <tr>
                      <th className="p-3 text-left w-28">Semanas</th>
                      <th className="p-3 text-left w-1/4">Unidad o Tema Central</th>
                      <th className="p-3 text-left w-1/3">Competencias e Indicadores</th>
                      <th className="p-3 text-left">Actividades Clave</th>
                      <th className="p-3 text-left">Hito Evaluativo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {plan.cronogramaPeriodo.map((cp, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900 bg-slate-50 align-top">
                          {cp.semana}
                        </td>
                        <td className="p-3 align-top font-semibold text-slate-800">
                          {cp.unidadTema}
                        </td>
                        <td className="p-3 align-top text-slate-700">
                          {cp.competenciasEIndicadores}
                        </td>
                        <td className="p-3 align-top text-slate-700">
                          {cp.actividadesClave}
                        </td>
                        <td className="p-3 align-top font-bold text-[#CE1126] bg-red-50/50">
                          {cp.evaluacionHito}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. PLANIFICACIÓN ANUAL (PLAN DOCENTE ANUAL / 190 DÍAS LECTIVOS) */}
          {plan.cronogramaAnual && plan.cronogramaAnual.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#002B49] flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5 text-amber-700" />
                    <span>Plan Docente Anual (PDA) • 10 Meses / 190 Días Lectivos</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Distribución anual por períodos P1 a P4, unidades y efemérides patrias oficiales del MINERD
                  </p>
                </div>
                <span className="bg-amber-100 text-amber-900 font-bold text-xs px-2.5 py-1 rounded-full">
                  Año {plan.anoEscolar}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <thead className="bg-[#002B49] text-white">
                    <tr>
                      <th className="p-3 text-left w-28">Mes</th>
                      <th className="p-3 text-center w-20">Período</th>
                      <th className="p-3 text-left w-1/3">Unidades y Secuencias Didácticas</th>
                      <th className="p-3 text-left">Efemérides Oficiales MINERD</th>
                      <th className="p-3 text-center w-24">Días Lectivos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {plan.cronogramaAnual.map((ca, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900 bg-slate-50 align-top">
                          {ca.mes}
                        </td>
                        <td className="p-3 font-bold text-center text-[#002B49] align-top">
                          {ca.periodo}
                        </td>
                        <td className="p-3 align-top font-medium text-slate-800">
                          {ca.unidadesSecuencias}
                        </td>
                        <td className="p-3 align-top text-slate-700 italic">
                          {ca.efemeridesMINERD}
                        </td>
                        <td className="p-3 font-bold text-center text-slate-800 align-top">
                          {ca.diasLectivos} días
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. PROYECTO PARTICIPATIVO DE AULA (PPA) / PROYECTO STEAM */}
          {plan.proyectoDetalles && (
            <div className="space-y-4 pt-4 border-t border-slate-200 bg-emerald-50/40 p-5 rounded-2xl border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-emerald-900 flex items-center">
                    <Sparkles className="w-4 h-4 mr-1.5 text-emerald-700" />
                    <span>Proyecto de Aprendizaje / Proyecto Participativo de Aula (PPA)</span>
                  </h3>
                  <p className="text-xs text-emerald-700">
                    {plan.proyectoDetalles.nombreProyecto}
                  </p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-1 rounded-full">
                  PPA / STEAM
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-800">
                <div>
                  <span className="font-bold text-emerald-950 block">Problemática Comunitaria Identificada:</span>
                  <p className="mt-0.5 text-slate-700">{plan.proyectoDetalles.problematicaComunitaria}</p>
                </div>
                <div>
                  <span className="font-bold text-emerald-950 block">Preguntas Generadoras:</span>
                  <ul className="list-disc list-inside mt-0.5 space-y-1 text-slate-700">
                    {plan.proyectoDetalles.preguntasGeneradoras.map((pg, i) => (
                      <li key={i}>{pg}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-bold text-emerald-950 block">Productos Esperados y Evidencias Tangibles:</span>
                  <ul className="list-disc list-inside mt-0.5 space-y-1 text-slate-700">
                    {plan.proyectoDetalles.productosEsperados.map((pe, i) => (
                      <li key={i}>{pe}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 5. CENTRO DE INTERÉS (NIVEL INICIAL / 1ER CICLO) */}
          {plan.centroInteresDetalles && (
            <div className="space-y-4 pt-4 border-t border-slate-200 bg-purple-50/40 p-5 rounded-2xl border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-purple-900 flex items-center">
                    <Lightbulb className="w-4 h-4 mr-1.5 text-purple-700" />
                    <span>Centro de Interés / Eje Temático Infantil</span>
                  </h3>
                  <p className="text-xs text-purple-700">
                    Tema Generador: {plan.centroInteresDetalles.temaGenerador}
                  </p>
                </div>
                <span className="bg-purple-100 text-purple-800 font-bold text-xs px-2.5 py-1 rounded-full">
                  Nivel Inicial / 1er Ciclo
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-purple-200">
                  <span className="font-bold text-purple-900 block mb-1">1. Momento de Observación</span>
                  <p className="text-slate-700 text-[11px]">{plan.centroInteresDetalles.momentos.observacion}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-purple-200">
                  <span className="font-bold text-purple-900 block mb-1">2. Momento de Asociación</span>
                  <p className="text-slate-700 text-[11px]">{plan.centroInteresDetalles.momentos.asociacion}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-purple-200">
                  <span className="font-bold text-purple-900 block mb-1">3. Momento de Expresión</span>
                  <p className="text-slate-700 text-[11px]">{plan.centroInteresDetalles.momentos.expresion}</p>
                </div>
              </div>

              <div className="text-xs">
                <span className="font-bold text-purple-950 block mb-1.5">Rincones de Aprendizaje Articulados:</span>
                <div className="flex flex-wrap gap-2">
                  {plan.centroInteresDetalles.rinconesTrabajo.map((r, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white border border-purple-200 text-purple-900 rounded-lg text-xs font-semibold">
                      🏷️ {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SESSIONS & CLASS MOMENTS SECTION (MOMENTO DE LA CLASE: INICIO, DESARROLLO, CIERRE 10 MIN) */}
          {plan.sesiones.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#002B49]">
                    Desarrollo Pedagógico de las Sesiones de Clase
                  </h3>
                  <p className="text-xs text-slate-500">
                    Formato oficial: Momento de Inicio, Desarrollo y Cierre (10 minutos) con intención pedagógica
                  </p>
                </div>
                <button
                  onClick={handleAddSession}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#002B49] rounded-xl text-xs font-bold border border-blue-200 flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Sesión</span>
                </button>
              </div>

              {/* Sessions Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {plan.sesiones.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSessionIdx(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center space-x-1.5 ${
                      selectedSessionIdx === idx
                        ? 'bg-[#002B49] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>Sesión {s.numero}</span>
                    {plan.sesiones.length > 1 && (
                      <Trash2
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSession(idx);
                        }}
                        className="w-3 h-3 text-slate-400 hover:text-red-400"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Active Session Content */}
              {currentSession && (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-800">
                      Sesión {currentSession.numero} ({currentSession.duracionMinutos} Minutos)
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-500">Fecha de aplicación:</span>
                      <input
                        type="date"
                        value={currentSession.fecha || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setPlan(prev => {
                            const newSes = [...prev.sesiones];
                            newSes[selectedSessionIdx] = { ...newSes[selectedSessionIdx], fecha: val };
                            return { ...prev, sesiones: newSes };
                          });
                        }}
                        className="p-1 border border-slate-300 rounded text-xs bg-white"
                      />
                    </div>
                  </div>

                  {/* 3 Moments Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border border-slate-200 rounded-xl overflow-hidden bg-white">
                      <thead className="bg-[#002B49] text-white font-bold">
                        <tr>
                          <th className="p-3 text-left w-1/4">Momento de la Clase / Duración</th>
                          <th className="p-3 text-left w-1/2">Actividades Pedagógicas</th>
                          <th className="p-3 text-left w-1/4">Recursos</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {/* INICIO */}
                        <tr>
                          <td className="p-3 font-bold text-slate-900 bg-slate-50 align-top">
                            Inicio ({currentSession.momentoInicio.duracionMin} min)
                          </td>
                          <td className="p-3 space-y-2">
                            <div>
                              <span className="font-semibold text-slate-700 block">Rutina diaria:</span>
                              <textarea
                                rows={2}
                                value={currentSession.momentoInicio.rutinaDiaria}
                                onChange={e => {
                                  const val = e.target.value;
                                  setPlan(prev => {
                                    const next = [...prev.sesiones];
                                    next[selectedSessionIdx].momentoInicio.rutinaDiaria = val;
                                    return { ...prev, sesiones: next };
                                  });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <span className="font-semibold text-slate-700 block">Retroalimentación:</span>
                              <textarea
                                rows={2}
                                value={currentSession.momentoInicio.retroalimentacion}
                                onChange={e => {
                                  const val = e.target.value;
                                  setPlan(prev => {
                                    const next = [...prev.sesiones];
                                    next[selectedSessionIdx].momentoInicio.retroalimentacion = val;
                                    return { ...prev, sesiones: next };
                                  });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <span className="font-semibold text-slate-700 block">Saberes previos:</span>
                              <textarea
                                rows={2}
                                value={currentSession.momentoInicio.saberesPrevios}
                                onChange={e => {
                                  const val = e.target.value;
                                  setPlan(prev => {
                                    const next = [...prev.sesiones];
                                    next[selectedSessionIdx].momentoInicio.saberesPrevios = val;
                                    return { ...prev, sesiones: next };
                                  });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                              />
                            </div>
                          </td>
                          <td className="p-3 align-top">
                            <textarea
                              rows={4}
                              value={currentSession.momentoInicio.recursos}
                              onChange={e => {
                                const val = e.target.value;
                                setPlan(prev => {
                                  const next = [...prev.sesiones];
                                  next[selectedSessionIdx].momentoInicio.recursos = val;
                                  return { ...prev, sesiones: next };
                                });
                              }}
                              className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                            />
                          </td>
                        </tr>

                        {/* DESARROLLO */}
                        <tr>
                          <td className="p-3 font-bold text-slate-900 bg-slate-50 align-top">
                            Desarrollo ({currentSession.momentoDesarrollo.duracionMin} min)
                            <span className="text-[10px] text-slate-500 block font-normal mt-1">
                              Ref: {currentSession.momentoDesarrollo.numeroLetraSecuencia}
                            </span>
                          </td>
                          <td className="p-3 space-y-2">
                            <textarea
                              rows={6}
                              value={currentSession.momentoDesarrollo.actividades}
                              onChange={e => {
                                const val = e.target.value;
                                setPlan(prev => {
                                  const next = [...prev.sesiones];
                                  next[selectedSessionIdx].momentoDesarrollo.actividades = val;
                                  return { ...prev, sesiones: next };
                                });
                              }}
                              className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                            />
                          </td>
                          <td className="p-3 align-top">
                            <textarea
                              rows={4}
                              value={currentSession.momentoDesarrollo.recursos}
                              onChange={e => {
                                const val = e.target.value;
                                setPlan(prev => {
                                  const next = [...prev.sesiones];
                                  next[selectedSessionIdx].momentoDesarrollo.recursos = val;
                                  return { ...prev, sesiones: next };
                                });
                              }}
                              className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                            />
                          </td>
                        </tr>

                        {/* CIERRE (10 MIN) */}
                        <tr>
                          <td className="p-3 font-bold text-slate-900 bg-slate-50 align-top">
                            Cierre (Tiempo: {currentSession.momentoCierre.duracionMin} min)
                          </td>
                          <td className="p-3 space-y-2">
                            <div>
                              <span className="font-semibold text-slate-700 block">Puntualizaciones del docente:</span>
                              <textarea
                                rows={2}
                                value={currentSession.momentoCierre.puntualizaciones}
                                onChange={e => {
                                  const val = e.target.value;
                                  setPlan(prev => {
                                    const next = [...prev.sesiones];
                                    next[selectedSessionIdx].momentoCierre.puntualizaciones = val;
                                    return { ...prev, sesiones: next };
                                  });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <span className="font-semibold text-slate-700 block">Sistematización con preguntas y ejercicios:</span>
                              <textarea
                                rows={2}
                                value={currentSession.momentoCierre.sistematizacion}
                                onChange={e => {
                                  const val = e.target.value;
                                  setPlan(prev => {
                                    const next = [...prev.sesiones];
                                    next[selectedSessionIdx].momentoCierre.sistematizacion = val;
                                    return { ...prev, sesiones: next };
                                  });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <span className="font-semibold text-slate-700 block">Metacognición:</span>
                              <textarea
                                rows={2}
                                value={currentSession.momentoCierre.metacognicion}
                                onChange={e => {
                                  const val = e.target.value;
                                  setPlan(prev => {
                                    const next = [...prev.sesiones];
                                    next[selectedSessionIdx].momentoCierre.metacognicion = val;
                                    return { ...prev, sesiones: next };
                                  });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                              />
                            </div>
                          </td>
                          <td className="p-3 align-top">
                            <textarea
                              rows={4}
                              value={currentSession.momentoCierre.recursos}
                              onChange={e => {
                                const val = e.target.value;
                                setPlan(prev => {
                                  const next = [...prev.sesiones];
                                  next[selectedSessionIdx].momentoCierre.recursos = val;
                                  return { ...prev, sesiones: next };
                                });
                              }}
                              className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Complementary Sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                    <div>
                      <span className="font-bold text-slate-800 block mb-1">
                        Actividades Complementarias para Atender la Diversidad:
                      </span>
                      <textarea
                        rows={2}
                        value={currentSession.actividadesDiversidad}
                        onChange={e => {
                          const val = e.target.value;
                          setPlan(prev => {
                            const next = [...prev.sesiones];
                            next[selectedSessionIdx].actividadesDiversidad = val;
                            return { ...prev, sesiones: next };
                          });
                        }}
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block mb-1">
                        Actividad para el Diario del Estudiante:
                      </span>
                      <textarea
                        rows={2}
                        value={currentSession.actividadDiarioEstudiante}
                        onChange={e => {
                          const val = e.target.value;
                          setPlan(prev => {
                            const next = [...prev.sesiones];
                            next[selectedSessionIdx].actividadDiarioEstudiante = val;
                            return { ...prev, sesiones: next };
                          });
                        }}
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block mb-1">
                        Lecturas Recomendadas o Libro de la Semana:
                      </span>
                      <input
                        type="text"
                        value={currentSession.lecturaRecomendada}
                        onChange={e => {
                          const val = e.target.value;
                          setPlan(prev => {
                            const next = [...prev.sesiones];
                            next[selectedSessionIdx].lecturaRecomendada = val;
                            return { ...prev, sesiones: next };
                          });
                        }}
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block mb-1">
                        Nota Técnica para el Docente (cifras oficiales legibles):
                      </span>
                      <textarea
                        rows={2}
                        value={currentSession.notasDocente}
                        onChange={e => {
                          const val = e.target.value;
                          setPlan(prev => {
                            const next = [...prev.sesiones];
                            next[selectedSessionIdx].notasDocente = val;
                            return { ...prev, sesiones: next };
                          });
                        }}
                        className="w-full p-2 border border-amber-200 bg-amber-50/50 rounded-lg text-xs font-mono text-amber-900"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Evaluation and Remediation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-200">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Técnicas e Instrumentos de Evaluación
              </label>
              <textarea
                rows={2}
                value={plan.tecnicasEvaluacion.join(', ')}
                onChange={e => setPlan({ ...plan, tecnicasEvaluacion: e.target.value.split(', ') })}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Actividades de Recuperación Pedagógica
              </label>
              <textarea
                rows={2}
                value={plan.actividadesRecuperacion}
                onChange={e => setPlan({ ...plan, actividadesRecuperacion: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Institutional Signatures Block */}
          <div className="pt-8 border-t-2 border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider text-center mb-6">
              Espacio de Validación y Firmas Institucionales
            </h4>
            <div className="grid grid-cols-3 gap-6 text-center text-xs text-slate-700">
              <div className="border-t border-slate-400 pt-2">
                <span className="font-bold block text-slate-900">{plan.docenteNombre}</span>
                <span className="text-[11px] text-slate-500">Docente de Aula</span>
              </div>
              <div className="border-t border-slate-400 pt-2">
                <span className="font-bold block text-slate-900">Coordinación Pedagógica</span>
                <span className="text-[11px] text-slate-500">Segundo Ciclo Primaria</span>
              </div>
              <div className="border-t border-slate-400 pt-2">
                <span className="font-bold block text-slate-900">Dirección del Centro</span>
                <span className="text-[11px] text-slate-500">Sello Escolar</span>
              </div>
            </div>
          </div>

          {/* Footer watermark note */}
          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4">
            Documento pedagógico estructurado con PlanificaRD • Ministerio de Educación de la República Dominicana
          </div>
        </div>
      </main>

      {/* MODAL: CONFIRMAR ELIMINACIÓN DE PLANIFICACIÓN */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-red-200 overflow-hidden animate-in fade-in">
            <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-200" />
                <span>Eliminar Planificación</span>
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <p className="text-sm text-slate-800 font-semibold">
                ¿Está seguro de que desea eliminar permanentemente esta planificación?
              </p>

              <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded">
                    {plan.codigoDocumento}
                  </span>
                  <span className="uppercase text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                    {plan.tipo}
                  </span>
                </div>
                <p className="font-bold text-red-950 text-sm mt-1">
                  {plan.titulo}
                </p>
                <p className="text-xs text-red-800">
                  Docente: <strong>{plan.docenteNombre}</strong>
                </p>
                <p className="text-[11px] text-red-700">
                  {plan.grado} ({plan.seccion}) • {plan.area} • Año Escolar {plan.anoEscolar}
                </p>
              </div>

              <p className="text-slate-500 italic">
                Esta acción eliminará el documento de la base de datos oficial. Acción autorizada para:{' '}
                <strong>{currentUser.nombre} {currentUser.apellidos}</strong>.
              </p>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={async () => {
                    setIsDeleting(true);
                    try {
                      if (onDelete) {
                        await onDelete(plan.id);
                      } else {
                        await api.deletePlan(plan.id, {
                          adminId: currentUser.id,
                          adminNombre: `${currentUser.nombre} ${currentUser.apellidos}`,
                          adminRol: currentUser.rol
                        });
                        onClose();
                      }
                    } catch (e) {
                      console.error('Error deleting plan:', e);
                    } finally {
                      setIsDeleting(false);
                      setShowDeleteModal(false);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 flex items-center space-x-1.5 shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isDeleting ? 'Eliminando...' : 'Sí, Eliminar Planificación'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
