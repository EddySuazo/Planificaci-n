import React, { useState } from 'react';
import { RefreshCw, ArrowRight, CheckCircle2, AlertCircle, FileText, X } from 'lucide-react';
import { LessonPlan, TipoPlanificacion, UserProfile } from '../types';
import { api } from '../services/api';

interface PlanConvertModalProps {
  plan: LessonPlan;
  currentUser: UserProfile;
  onConverted: (newPlan: LessonPlan) => void;
  onClose: () => void;
}

export const PlanConvertModal: React.FC<PlanConvertModalProps> = ({
  plan,
  currentUser,
  onConverted,
  onClose
}) => {
  const [targetTipo, setTargetTipo] = useState<TipoPlanificacion>('diaria');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const conversionOptions: { value: TipoPlanificacion; label: string; desc: string }[] = [
    { value: 'diaria', label: 'Planificación Diaria', desc: 'Desglosa la secuencia o plan semanal en momentos de clase detallados: Inicio, Desarrollo y Cierre (10 min).' },
    { value: 'semanal', label: 'Planificación Semanal', desc: 'Distribuye los aprendizajes en 5 sesiones de clase correlativas con progresión pedagógica.' },
    { value: 'mensual', label: 'Planificación Mensual', desc: 'Organiza 4 semanas de trabajo articuladas con las fechas lectivas oficiales del MINERD.' },
    { value: 'trimestral', label: 'Planificación por Período / Trimestral', desc: 'Estructura las unidades del período de evaluación (P1 a P4) con evidencias e indicadores clave.' },
    { value: 'evaluacion', label: 'Instrumentos de Evaluación y Fichas', desc: 'Deriva rúbricas analíticas, escalas de valoración y fichas de actividades prácticas para el estudiante.' },
  ];

  const handleConvert = async () => {
    setLoading(true);
    setError(null);
    try {
      const converted = await api.convertPlan(plan.id, {
        targetTipo,
        userNombre: `${currentUser.nombre} ${currentUser.apellidos}`,
        userId: currentUser.id
      });
      onConverted(converted);
    } catch (err: any) {
      setError(err.message || 'Error al convertir la planificación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-[#002B49]">
            <RefreshCw className="w-5 h-5 text-blue-700" />
            <h3 className="text-base font-bold text-slate-900">
              Convertir Planificación Pedagógica
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="my-3 p-3 bg-red-50 border-l-4 border-[#CE1126] text-xs text-red-800 rounded-r-lg">
            {error}
          </div>
        )}

        {/* Source Plan Info */}
        <div className="my-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
          <span className="font-bold text-slate-500 uppercase tracking-wider block">Documento de Origen:</span>
          <p className="font-bold text-slate-900">{plan.titulo}</p>
          <p className="text-slate-600">
            Tipo actual: <strong className="uppercase">{plan.tipo}</strong> • {plan.area} ({plan.grado})
          </p>
        </div>

        {/* Target Format Options */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-800 block">
            Seleccione el Formato de Destino:
          </label>
          <div className="space-y-2">
            {conversionOptions
              .filter(opt => opt.value !== plan.tipo)
              .map(opt => (
                <label
                  key={opt.value}
                  className={`p-3 rounded-xl border flex items-start space-x-3 cursor-pointer transition ${
                    targetTipo === opt.value
                      ? 'border-[#002B49] bg-blue-50/50 ring-1 ring-[#002B49]'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="targetTipo"
                    value={opt.value}
                    checked={targetTipo === opt.value}
                    onChange={() => setTargetTipo(opt.value)}
                    className="mt-1 text-[#002B49] focus:ring-[#002B49]"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{opt.label}</span>
                    <span className="text-[11px] text-slate-500 leading-snug block">{opt.desc}</span>
                  </div>
                </label>
              ))}
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900">
          <strong>Regla de preservación pedagógica:</strong> La conversión conservará todas las competencias, indicadores de logro y contenidos de origen, redistribuyendo los momentos de manera coherente con el tiempo lectivo.
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="py-2.5 px-4 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConvert}
            disabled={loading}
            className="py-2.5 px-6 bg-[#002B49] hover:bg-[#003860] text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-1.5 transition disabled:opacity-50"
          >
            {loading ? 'Procesando conversión...' : (
              <>
                <span>Generar Conversión</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
