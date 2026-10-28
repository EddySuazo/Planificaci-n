import React, { useState, useEffect } from 'react';
import {
  BarChart3, School, Users, CheckCircle2, Clock, AlertCircle,
  FileText, Download, Printer, Filter, Calendar
} from 'lucide-react';
import { LessonPlan, UserProfile } from '../types';
import { api } from '../services/api';

interface DirectorDashboardViewProps {
  currentUser: UserProfile;
  plans: LessonPlan[];
  onOpenPlan: (plan: LessonPlan) => void;
}

export const DirectorDashboardView: React.FC<DirectorDashboardViewProps> = ({
  currentUser,
  plans,
  onOpenPlan
}) => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.getAdminStats().then(setStats).catch(console.error);
  }, []);

  const total = plans.length;
  const approved = plans.filter(p => p.estado === 'Aprobado institucionalmente').length;
  const reviewed = plans.filter(p => p.estado === 'Revisado').length;
  const inProgress = plans.filter(p => p.estado === 'Borrador' || p.estado === 'En revisión').length;
  const requiresAdjustment = plans.filter(p => p.estado === 'Requiere ajustes').length;

  const pctApproved = total > 0 ? Math.round(((approved + reviewed) / total) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-900 mb-1">
            <School className="w-4 h-4 text-emerald-700" />
            <span>Panel de Gestión Institucional y Dirección Escolar</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Seguimiento de Planificación Pedagógica Institucional
          </h1>
          <p className="mt-1 text-xs text-slate-600 max-w-2xl">
            {currentUser.centroEducativoNombre} • Código SIGERD: {currentUser.centroEducativoId} • Distrito {currentUser.distrito}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 self-start md:self-center"
        >
          <Printer className="w-4 h-4" />
          <span>Generar Informe de Centro</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">Total Planificaciones</span>
          <span className="text-2xl font-black text-[#002B49]">{total}</span>
          <span className="text-[11px] text-slate-400 block mt-1">Registradas en el centro</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-bold text-emerald-700 block mb-1">Aprobadas / Revisadas</span>
          <span className="text-2xl font-black text-emerald-700">{approved + reviewed}</span>
          <span className="text-[11px] text-emerald-600 font-bold block mt-1">{pctApproved}% de cumplimiento</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-bold text-blue-700 block mb-1">En Proceso / Borrador</span>
          <span className="text-2xl font-black text-blue-700">{inProgress}</span>
          <span className="text-[11px] text-slate-400 block mt-1">En elaboración docente</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-bold text-rose-700 block mb-1">Requieren Ajustes</span>
          <span className="text-2xl font-black text-rose-700">{requiresAdjustment}</span>
          <span className="text-[11px] text-slate-400 block mt-1">Con observaciones pendientes</span>
        </div>
      </div>

      {/* Tables Breakdown by Grade and Subject */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Distribución por Grado Escolar
          </h3>
          <div className="space-y-2 text-xs">
            {['4to de Primaria', '5to de Primaria', '6to de Primaria'].map(grado => {
              const count = plans.filter(p => p.grado.includes(grado.slice(0, 3))).length;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={grado} className="space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span className="font-semibold">{grado}</span>
                    <span className="font-mono font-bold">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#002B49] h-full rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Distribución por Área Curricular
          </h3>
          <div className="space-y-2 text-xs">
            {['Matemática', 'Lengua Española', 'Ciencias de la Naturaleza', 'Ciencias Sociales'].map(area => {
              const count = plans.filter(p => p.area.toLowerCase().includes(area.toLowerCase().slice(0, 4))).length;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={area} className="space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span className="font-semibold">{area}</span>
                    <span className="font-mono font-bold">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#CE1126] h-full rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Center Plans Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Registro General de Planificaciones del Centro
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {plans.length} registros
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Código</th>
                <th className="p-3">Título / Secuencia</th>
                <th className="p-3">Docente</th>
                <th className="p-3">Grado y Área</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Coherencia</th>
                <th className="p-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {plans.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 font-mono font-bold text-slate-500">{p.codigoDocumento}</td>
                  <td className="p-3 font-semibold text-slate-900 max-w-xs truncate">{p.titulo}</td>
                  <td className="p-3">{p.docenteNombre}</td>
                  <td className="p-3">{p.grado} - {p.area}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      p.estado === 'Aprobado institucionalmente' ? 'bg-emerald-100 text-emerald-800' :
                      p.estado === 'Revisado' ? 'bg-blue-100 text-blue-800' :
                      p.estado === 'Requiere ajustes' ? 'bg-rose-100 text-rose-800' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {p.estado}
                    </span>
                  </td>
                  <td className="p-3 font-bold">{p.verificacionCurricular.coherenciaScore}%</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onOpenPlan(p)}
                      className="px-2.5 py-1 text-xs text-[#002B49] font-bold hover:underline"
                    >
                      Consultar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
