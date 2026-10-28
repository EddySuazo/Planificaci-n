import React, { useState } from 'react';
import {
  FileText, Plus, Search, Calendar, Clock, Layers, Bookmark, History,
  CheckCircle, AlertCircle, FileEdit, Copy, RefreshCw, Download, Printer,
  Sparkles, Filter, Eye, Star, ShieldCheck, ChevronRight, BookOpen, School,
  Trash2, AlertTriangle, X
} from 'lucide-react';
import { LessonPlan, UserProfile, TipoPlanificacion } from '../types';
import { exportLessonPlanToDocx } from '../utils/docxExport';

interface DashboardViewProps {
  currentUser: UserProfile;
  plans: LessonPlan[];
  onOpenPlan: (plan: LessonPlan) => void;
  onCreateNew: (initialType?: TipoPlanificacion) => void;
  onOpenSearch: () => void;
  onConvertPlan: (plan: LessonPlan) => void;
  onDuplicatePlan: (plan: LessonPlan) => void;
  onVerifyPlan: (plan: LessonPlan) => void;
  onOpenLibrary: () => void;
  onOpenCoordination: () => void;
  onDeletePlan?: (planId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  plans,
  onOpenPlan,
  onCreateNew,
  onOpenSearch,
  onConvertPlan,
  onDuplicatePlan,
  onVerifyPlan,
  onOpenLibrary,
  onOpenCoordination,
  onDeletePlan
}) => {
  const [filterTipo, setFilterTipo] = useState<string>('todos');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCardFilter, setActiveCardFilter] = useState<string | null>(null);
  const [planToDelete, setPlanToDelete] = useState<LessonPlan | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter plans
  const filteredPlans = plans.filter(p => {
    if (activeCardFilter === 'favoritos' && !p.esFavorito) return false;
    if (activeCardFilter === 'pendientes' && p.estado !== 'En revisión' && p.estado !== 'Requiere ajustes') return false;
    if (activeCardFilter && ['anual', 'trimestral', 'mensual', 'semanal', 'diaria', 'secuencia', 'evaluacion'].includes(activeCardFilter)) {
      if (p.tipo !== activeCardFilter) return false;
    }

    if (filterTipo !== 'todos' && p.tipo !== filterTipo) return false;
    if (filterEstado !== 'todos' && p.estado !== filterEstado) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        p.titulo.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q) ||
        p.grado.toLowerCase().includes(q) ||
        p.codigoDocumento.toLowerCase().includes(q) ||
        p.docenteNombre.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'Aprobado institucionalmente':
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Aprobado</span>;
      case 'Revisado':
        return <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Revisado</span>;
      case 'Requiere ajustes':
        return <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> Requiere ajustes</span>;
      case 'En revisión':
        return <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center"><Clock className="w-3 h-3 mr-1" /> En revisión</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded-full">Borrador</span>;
    }
  };

  // Card definitions matching Section 12
  const dashboardCards = [
    { id: 'mis-planes', label: 'Mis Planificaciones', count: plans.length, icon: FileText, color: 'text-blue-700 bg-blue-50 border-blue-200', action: () => { setActiveCardFilter(null); setFilterTipo('todos'); } },
    { id: 'nueva', label: 'Crear Planificación', isAction: true, icon: Plus, color: 'text-white bg-[#002B49] border-[#002B49] hover:bg-[#003860]', action: () => onCreateNew() },
    { id: 'buscar', label: 'Buscar Secuencias', isAction: true, icon: Search, color: 'text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100', action: onOpenSearch },
    { id: 'diaria', label: 'Planificaciones Diarias', count: plans.filter(p => p.tipo === 'diaria').length, icon: Clock, color: 'text-emerald-700 bg-emerald-50 border-emerald-200', action: () => { setActiveCardFilter('diaria'); } },
    { id: 'semanal', label: 'Planificaciones Semanales', count: plans.filter(p => p.tipo === 'semanal').length, icon: Calendar, color: 'text-teal-700 bg-teal-50 border-teal-200', action: () => { setActiveCardFilter('semanal'); } },
    { id: 'mensual', label: 'Planificaciones Mensuales', count: plans.filter(p => p.tipo === 'mensual').length, icon: Calendar, color: 'text-cyan-700 bg-cyan-50 border-cyan-200', action: () => { setActiveCardFilter('mensual'); } },
    { id: 'trimestral', label: 'Planes por Período / Trimestral', count: plans.filter(p => p.tipo === 'trimestral').length, icon: Layers, color: 'text-violet-700 bg-violet-50 border-violet-200', action: () => { setActiveCardFilter('trimestral'); } },
    { id: 'anual', label: 'Planificaciones Anuales', count: plans.filter(p => p.tipo === 'anual').length, icon: Bookmark, color: 'text-amber-700 bg-amber-50 border-amber-200', action: () => { setActiveCardFilter('anual'); } },
    { id: 'secuencia', label: 'Unidades y Secuencias', count: plans.filter(p => p.tipo === 'secuencia').length, icon: BookOpen, color: 'text-blue-700 bg-blue-50 border-blue-200', action: () => { setActiveCardFilter('secuencia'); } },
    { id: 'evaluacion', label: 'Instrumentos de Evaluación', count: plans.filter(p => p.tipo === 'evaluacion').length, icon: CheckCircle, color: 'text-rose-700 bg-rose-50 border-rose-200', action: () => { setActiveCardFilter('evaluacion'); } },
    { id: 'recursos', label: 'Recursos Didácticos MINERD', count: 18, isAction: true, icon: BookOpen, color: 'text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100', action: onOpenLibrary },
    { id: 'pendientes', label: 'Pendientes de Revisión', count: plans.filter(p => p.estado === 'En revisión' || p.estado === 'Requiere ajustes').length, icon: AlertCircle, color: 'text-orange-700 bg-orange-50 border-orange-200', action: () => { setActiveCardFilter('pendientes'); } },
    { id: 'favoritos', label: 'Favoritos', count: plans.filter(p => p.esFavorito).length, icon: Star, color: 'text-yellow-700 bg-yellow-50 border-yellow-200', action: () => { setActiveCardFilter('favoritos'); } },
    { id: 'historial', label: 'Historial de Documentos', count: plans.reduce((acc, p) => acc + (p.historialVersiones?.length || 1), 0), icon: History, color: 'text-gray-700 bg-gray-50 border-gray-200', action: () => { setActiveCardFilter(null); } },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#002B49] via-[#003860] to-[#0A4B78] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center">
          <School className="w-80 h-80 -mr-20 -mb-20 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-amber-300 mb-3 border border-white/15">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MINERD • Adecuación Curricular Vigente 2026-2027</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bienvenido(a), {currentUser.nombre} {currentUser.apellidos}
          </h1>
          <p className="mt-1.5 text-sm text-blue-100 leading-relaxed">
            {currentUser.centroEducativoNombre} • Regional {currentUser.regional} ({currentUser.distrito})
            <br />
            Asistente pedagógico para elaborar, verificar, convertir y descargar planificaciones alineadas a las secuencias didácticas oficiales.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onCreateNew()}
              className="px-4 py-2.5 bg-[#CE1126] hover:bg-[#B00E1F] text-white rounded-xl text-sm font-bold shadow-md flex items-center space-x-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Generar Nueva Planificación</span>
            </button>
            <button
              onClick={onOpenSearch}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-sm font-semibold backdrop-blur-xs flex items-center space-x-2 transition border border-white/20"
            >
              <Search className="w-4 h-4 text-amber-300" />
              <span>Buscar Secuencias Oficiales</span>
            </button>
          </div>
        </div>
      </div>

      {/* 14 Mandatory Dashboard Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Panel de Acceso Rápido del Docente
          </h2>
          {activeCardFilter && (
            <button
              onClick={() => setActiveCardFilter(null)}
              className="text-xs text-[#002B49] font-semibold hover:underline"
            >
              Quitar filtro ({activeCardFilter})
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {dashboardCards.map(card => {
            const Icon = card.icon;
            const isSelected = activeCardFilter === card.id;
            return (
              <button
                key={card.id}
                onClick={card.action}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between h-24 ${
                  card.isAction
                    ? card.color
                    : isSelected
                    ? 'ring-2 ring-[#002B49] bg-blue-50 border-[#002B49]'
                    : `${card.color} hover:shadow-xs`
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon className="w-4 h-4" />
                  {card.count !== undefined && (
                    <span className="text-xs font-bold font-mono px-1.5 py-0.5 rounded-md bg-white/80 shadow-2xs">
                      {card.count}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold leading-tight line-clamp-2">
                  {card.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Search Bar & Quick Filters */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar planificaciones por área, grado, título o código (ej. Matemática 6to, El Informe de Lectura, PLAN-DIA...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#002B49] focus:ring-2 focus:ring-[#002B49]/20 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          <div className="flex gap-2">
            <select
              value={filterTipo}
              onChange={e => setFilterTipo(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-white"
            >
              <option value="todos">Todos los Tipos</option>
              <option value="diaria">Planificación Diaria</option>
              <option value="semanal">Planificación Semanal</option>
              <option value="mensual">Planificación Mensual</option>
              <option value="trimestral">Trimestral / Período</option>
              <option value="anual">Planificación Anual</option>
              <option value="secuencia">Por Secuencia Didáctica</option>
              <option value="proyecto_steam">Proyecto STEAM</option>
            </select>

            <select
              value={filterEstado}
              onChange={e => setFilterEstado(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-white"
            >
              <option value="todos">Todos los Estados</option>
              <option value="Borrador">Borrador</option>
              <option value="En revisión">En revisión</option>
              <option value="Requiere ajustes">Requiere ajustes</option>
              <option value="Revisado">Revisado</option>
              <option value="Aprobado institucionalmente">Aprobado Institucional</option>
            </select>
          </div>
        </div>
      </div>

      {/* Plan Document Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">
            Documentos Curriculares ({filteredPlans.length})
          </h3>
          <span className="text-xs text-slate-500">
            Mostrando planes para {currentUser.centroEducativoNombre}
          </span>
        </div>

        {filteredPlans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-700">No se encontraron planificaciones</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              No hay documentos que coincidan con los filtros seleccionados. Puede crear una nueva planificación asistida por IA.
            </p>
            <button
              onClick={() => onCreateNew()}
              className="mt-4 px-4 py-2 bg-[#002B49] text-white rounded-xl text-xs font-bold hover:bg-[#003860]"
            >
              + Generar Planificación Ahora
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPlans.map(plan => (
              <div
                key={plan.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Top badges */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {plan.codigoDocumento}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#002B49] px-2 py-0.5 rounded">
                        {plan.tipo}
                      </span>
                      {getStatusBadge(plan.estado)}
                    </div>
                    {plan.esOficialMINERD ? (
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
                        <ShieldCheck className="w-3 h-3 mr-1" /> Oficial MINERD
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-medium px-2 py-0.5 rounded-full">
                        Propuesta IA
                      </span>
                    )}
                  </div>

                  {/* Title & Info */}
                  <h4
                    onClick={() => onOpenPlan(plan)}
                    className="text-base font-bold text-slate-900 hover:text-[#002B49] cursor-pointer transition line-clamp-2"
                  >
                    {plan.titulo}
                  </h4>

                  <div className="mt-2 text-xs text-slate-600 flex flex-wrap gap-x-3 gap-y-1">
                    <span><strong>Área:</strong> {plan.area}</span>
                    <span><strong>Grado:</strong> {plan.grado} ({plan.seccion})</span>
                    <span><strong>Período:</strong> {plan.periodo}</span>
                    <span><strong>Año:</strong> {plan.anoEscolar}</span>
                  </div>

                  <p className="mt-2 text-xs text-slate-500 line-clamp-2 italic">
                    {plan.situacionAprendizaje || 'Situación de aprendizaje vinculada a la secuencia curricular.'}
                  </p>

                  {/* Verifier status preview */}
                  <div className="mt-3 p-2.5 bg-slate-50 rounded-xl text-[11px] border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-600 flex items-center">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-700 mr-1.5" />
                      Coherencia: <strong>{plan.verificacionCurricular.coherenciaScore}%</strong>
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      {plan.sesiones.length} sesiones • {plan.indicadoresLogro.length} indicadores
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => onOpenPlan(plan)}
                      className="px-3 py-1.5 bg-[#002B49] text-white rounded-lg text-xs font-semibold hover:bg-[#003860] flex items-center space-x-1"
                      title="Abrir en Editor Visual"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => onConvertPlan(plan)}
                      className="p-1.5 text-slate-600 hover:text-[#002B49] hover:bg-slate-100 rounded-lg transition"
                      title="Convertir planificación a otro formato (ej. Semanal a Diaria)"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDuplicatePlan(plan)}
                      className="p-1.5 text-slate-600 hover:text-[#002B49] hover:bg-slate-100 rounded-lg transition"
                      title="Duplicar para otra sección"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onVerifyPlan(plan)}
                      className="p-1.5 text-slate-600 hover:text-[#002B49] hover:bg-slate-100 rounded-lg transition"
                      title="Verificador Curricular MINERD"
                    >
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => exportLessonPlanToDocx(plan)}
                      className="px-2.5 py-1.5 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center space-x-1"
                      title="Descargar Microsoft Word (.docx) oficial"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Word</span>
                    </button>

                    {(currentUser.rol === 'administrador' || currentUser.rol === 'director' || currentUser.id === plan.docenteId) && (
                      <button
                        onClick={() => setPlanToDelete(plan)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-lg transition"
                        title="Eliminar planificación"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: CONFIRMAR ELIMINACIÓN DE PLANIFICACIÓN */}
      {planToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-red-200 overflow-hidden animate-in fade-in">
            <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-200" />
                <span>Eliminar Planificación</span>
              </h3>
              <button
                onClick={() => setPlanToDelete(null)}
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
                    {planToDelete.codigoDocumento}
                  </span>
                  <span className="uppercase text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                    {planToDelete.tipo}
                  </span>
                </div>
                <p className="font-bold text-red-950 text-sm mt-1">
                  {planToDelete.titulo}
                </p>
                <p className="text-xs text-red-800">
                  Docente: <strong>{planToDelete.docenteNombre}</strong>
                </p>
                <p className="text-[11px] text-red-700">
                  {planToDelete.grado} • {planToDelete.area} • Año Escolar {planToDelete.anoEscolar}
                </p>
              </div>

              <p className="text-slate-500 italic">
                Esta acción es irreversible y eliminará el documento junto con todas sus sesiones del sistema.
              </p>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setPlanToDelete(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={async () => {
                    if (onDeletePlan && planToDelete) {
                      setIsDeleting(true);
                      try {
                        await onDeletePlan(planToDelete.id);
                        setPlanToDelete(null);
                      } finally {
                        setIsDeleting(false);
                      }
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
