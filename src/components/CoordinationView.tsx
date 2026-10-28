import React, { useState } from 'react';
import {
  CheckSquare, MessageSquare, AlertCircle, CheckCircle2, Clock,
  FileText, ShieldCheck, User, School, Send, Eye
} from 'lucide-react';
import { LessonPlan, UserProfile } from '../types';
import { api } from '../services/api';

interface CoordinationViewProps {
  currentUser: UserProfile;
  plans: LessonPlan[];
  onOpenPlan: (plan: LessonPlan) => void;
  onRefreshPlans: () => void;
}

export const CoordinationView: React.FC<CoordinationViewProps> = ({
  currentUser,
  plans,
  onOpenPlan,
  onRefreshPlans
}) => {
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
  const [commentText, setCommentText] = useState('');
  const [reviewAction, setReviewAction] = useState<'marcado_revisado' | 'solicitud_ajuste' | 'aprobado_institucional'>('marcado_revisado');
  const [submitting, setSubmitting] = useState(false);

  const pendingPlans = plans.filter(p => p.estado === 'En revisión' || p.estado === 'Requiere ajustes' || p.estado === 'Borrador');
  const reviewedPlans = plans.filter(p => p.estado === 'Revisado' || p.estado === 'Aprobado institucionalmente');

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    setSubmitting(true);
    try {
      await api.reviewPlan(selectedPlan.id, {
        revisorId: currentUser.id,
        revisorNombre: `${currentUser.nombre} ${currentUser.apellidos}`,
        revisorRol: currentUser.rol === 'coordinador' ? 'Coordinador Pedagógico' : 'Dirección del Centro',
        accion: reviewAction,
        comentario: commentText,
        nuevoEstado: reviewAction === 'marcado_revisado' ? 'Revisado'
                   : reviewAction === 'solicitud_ajuste' ? 'Requiere ajustes'
                   : 'Aprobado institucionalmente'
      });
      setSelectedPlan(null);
      setCommentText('');
      onRefreshPlans();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-purple-900 mb-1">
            <CheckSquare className="w-4 h-4 text-purple-700" />
            <span>Módulo de Acompañamiento y Coordinación Pedagógica</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Revisión y Seguimiento Curricular de los Docentes
          </h1>
          <p className="mt-1 text-xs text-slate-600 max-w-2xl">
            {currentUser.centroEducativoNombre} • Supervise la coherencia entre competencias, indicadores y momentos de clase. Registre observaciones pedagógicas y valide las planificaciones institucionales.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="p-2.5 bg-purple-50 text-purple-900 rounded-xl font-bold border border-purple-200">
            {pendingPlans.length} Pendientes
          </span>
          <span className="p-2.5 bg-emerald-50 text-emerald-900 rounded-xl font-bold border border-emerald-200">
            {reviewedPlans.length} Validadas
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Plans List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Planificaciones Docentes del Centro
          </h2>

          <div className="space-y-3">
            {plans.map(p => (
              <div
                key={p.id}
                className={`bg-white rounded-2xl border p-5 transition cursor-pointer ${
                  selectedPlan?.id === p.id ? 'border-purple-600 ring-2 ring-purple-100' : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setSelectedPlan(p)}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {p.codigoDocumento}
                    </span>
                    <span className="text-[10px] font-bold uppercase bg-blue-50 text-[#002B49] px-2 py-0.5 rounded">
                      {p.tipo}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.estado === 'Aprobado institucionalmente' ? 'bg-emerald-100 text-emerald-800' :
                      p.estado === 'Revisado' ? 'bg-blue-100 text-blue-800' :
                      p.estado === 'Requiere ajustes' ? 'bg-rose-100 text-rose-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {p.estado}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {p.actualizadoEn.split('T')[0]}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{p.titulo}</h3>

                <div className="mt-2 text-xs text-slate-600 flex flex-wrap gap-x-3 gap-y-1">
                  <span><strong>Docente:</strong> {p.docenteNombre}</span>
                  <span><strong>Grado:</strong> {p.grado} ({p.seccion})</span>
                  <span><strong>Área:</strong> {p.area}</span>
                  <span><strong>Coherencia:</strong> {p.verificacionCurricular.coherenciaScore}%</span>
                </div>

                {/* Show recent coordinator feedback if any */}
                {p.revisionesInstitucionales && p.revisionesInstitucionales.length > 0 && (
                  <div className="mt-3 p-2.5 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-purple-900">
                    <span className="font-bold block">Última observación de {p.revisionesInstitucionales[p.revisionesInstitucionales.length - 1].revisadoPorNombre}:</span>
                    <p className="italic mt-0.5">"{p.revisionesInstitucionales[p.revisionesInstitucionales.length - 1].comentario}"</p>
                  </div>
                )}

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {p.sesiones.length} sesiones estructuradas • {p.indicadoresLogro.length} indicadores MINERD
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPlan(p);
                    }}
                    className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Detalle en Editor</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Review Action Panel */}
        <div className="lg:col-span-1">
          {selectedPlan ? (
            <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-sm sticky top-20 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block mb-1">
                  Evaluación Pedagógica
                </span>
                <h3 className="text-sm font-bold text-slate-900">{selectedPlan.titulo}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Docente: {selectedPlan.docenteNombre}</p>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Dictamen de Acompañamiento
                  </label>
                  <select
                    value={reviewAction}
                    onChange={e => setReviewAction(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 bg-white"
                  >
                    <option value="marcado_revisado">Marcar como Revisado (Conforme)</option>
                    <option value="solicitud_ajuste">Solicitar Ajustes Pedagógicos</option>
                    <option value="aprobado_institucional">Aprobar Institucionalmente</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Observaciones y Recomendaciones Curriculares
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Escriba aquí sus orientaciones para el docente (ej. 'Excelente coherencia en el momento de cierre; sugiero ampliar las actividades de apoyo a la diversidad en la sesión 2')..."
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 outline-none focus:border-purple-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-2 transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Registrando...' : 'Registrar Dictamen de Coordinación'}</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
              <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-700">Seleccione una planificación</p>
              <p className="mt-1">Haga clic sobre una planificación de la lista para emitir observaciones y dictámenes pedagógicos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
