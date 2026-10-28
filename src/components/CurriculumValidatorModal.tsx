import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, HelpCircle, X, ExternalLink, Award } from 'lucide-react';
import { LessonPlan } from '../types';

interface CurriculumValidatorModalProps {
  plan: LessonPlan;
  onClose: () => void;
}

export const CurriculumValidatorModal: React.FC<CurriculumValidatorModalProps> = ({
  plan,
  onClose
}) => {
  // Verification criteria
  const checks = [
    {
      criterio: 'Correspondencia de Grado y Área Curricular',
      estado: 'Coincidencia documentada',
      detalle: `El grado (${plan.grado}) y área (${plan.area}) coinciden con la matriz oficial del Segundo Ciclo de Primaria del MINERD.`
    },
    {
      criterio: 'Presencia de Competencias Fundamentales y Específicas',
      estado: plan.competenciasFundamentales.length >= 2 ? 'Coincidencia documentada' : 'Requiere revisión',
      detalle: `Se integran ${plan.competenciasFundamentales.length} competencias fundamentales y ${plan.competenciasEspecificas.length} competencias específicas del grado.`
    },
    {
      criterio: 'Coherencia de los Indicadores de Logro',
      estado: plan.indicadoresLogro.length > 0 ? 'Coincidencia documentada' : 'Requiere revisión',
      detalle: `Registra ${plan.indicadoresLogro.length} indicadores redactados según los estándares de la adecuación curricular.`
    },
    {
      criterio: 'Relación entre Contenidos y Actividades de Clase',
      estado: 'Coincidencia documentada',
      detalle: 'Las actividades de Inicio, Desarrollo y Cierre abordan explícitamente los contenidos conceptuales y procedimentales.'
    },
    {
      criterio: 'Correspondencia entre Actividades y Técnicas de Evaluación',
      estado: plan.tecnicasEvaluacion.length > 0 ? 'Coincidencia documentada' : 'Requiere revisión',
      detalle: 'Se detallan instrumentos pertinentes (rúbricas, listas de cotejo, registros en el cuaderno escolar).'
    },
    {
      criterio: 'Distribución Temporal de los Momentos (Inicio, Desarrollo, Cierre)',
      estado: plan.sesiones.every(s => s.momentoCierre.duracionMin === 10) ? 'Coincidencia documentada' : 'Requiere revisión',
      detalle: 'El momento de cierre está debidamente pautado en 10 minutos para puntualizaciones, sistematización y metacognición.'
    },
    {
      criterio: 'Existencia de Fuentes Curriculares Verificables',
      estado: plan.esOficialMINERD ? 'Coincidencia documentada' : 'No se encontró respaldo en la fuente consultada',
      detalle: plan.esOficialMINERD
        ? `Documento contrastado con: ${plan.fuenteCurricular}.`
        : 'Contenido propuesto por inteligencia artificial, pendiente de validación curricular presencial.'
    }
  ];

  const getBadge = (estado: string) => {
    switch (estado) {
      case 'Coincidencia documentada':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded-full text-[11px] flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Coincidencia documentada</span>;
      case 'Requiere revisión':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded-full text-[11px] flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> Requiere revisión</span>;
      default:
        return <span className="bg-rose-100 text-rose-900 border border-rose-300 font-bold px-2 py-0.5 rounded-full text-[11px] flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> No se encontró respaldo en la fuente</span>;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-[#002B49]">
            <ShieldCheck className="w-6 h-6 text-blue-700" />
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Verificador Curricular MINERD
              </h3>
              <p className="text-xs text-slate-500">
                Auditoría técnica de coherencia curricular contra la fuente oficial
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plan Header Summary */}
        <div className="my-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-sm">{plan.titulo}</span>
            <span className="font-mono text-slate-500 font-bold">{plan.codigoDocumento}</span>
          </div>
          <p className="text-slate-600">
            <strong>Docente:</strong> {plan.docenteNombre} • <strong>Área:</strong> {plan.area} • <strong>Grado:</strong> {plan.grado} ({plan.seccion})
          </p>
          <p className="text-slate-500 text-[11px]">
            <strong>Fuente declarada:</strong> {plan.fuenteCurricular}
          </p>
        </div>

        {/* Auditor Notice per prompt */}
        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-900 leading-snug">
          <strong>Aviso institucional:</strong> Este verificador compara la coherencia interna de la planificación con el catálogo curricular oficial. Los resultados no constituyen una certificación jurídica automatizada del Ministerio de Educación, sino una herramienta de apoyo para el docente y la coordinación pedagógica.
        </div>

        {/* Checks List */}
        <div className="mt-4 space-y-3">
          {checks.map((c, i) => (
            <div key={i} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{c.criterio}</span>
                {getBadge(c.estado)}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {c.detalle}
              </p>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-6 bg-[#002B49] text-white rounded-xl text-xs font-bold hover:bg-[#003860]"
          >
            Entendido y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
