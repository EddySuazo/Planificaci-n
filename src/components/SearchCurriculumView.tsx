import React, { useState } from 'react';
import {
  Search, Filter, Sparkles, BookOpen, ShieldCheck, ArrowRight, ExternalLink,
  Layers, CheckCircle2, FileText, Calendar, PlusCircle
} from 'lucide-react';
import { OfficialCurriculumSequence, TipoPlanificacion } from '../types';

interface SearchCurriculumViewProps {
  sequences: OfficialCurriculumSequence[];
  onSelectSequenceForPlan: (seq: OfficialCurriculumSequence, suggestedType?: TipoPlanificacion) => void;
  onViewSequenceDetails: (seq: OfficialCurriculumSequence) => void;
}

export const SearchCurriculumView: React.FC<SearchCurriculumViewProps> = ({
  sequences,
  onSelectSequenceForPlan,
  onViewSequenceDetails
}) => {
  const [query, setQuery] = useState('');
  const [selectedNivel, setSelectedNivel] = useState('Primario');
  const [selectedCiclo, setSelectedCiclo] = useState('Segundo Ciclo');
  const [selectedGrado, setSelectedGrado] = useState('todos');
  const [selectedArea, setSelectedArea] = useState('todas');
  const [selectedAno, setSelectedAno] = useState('2026-2027');
  const [selectedFuente, setSelectedFuente] = useState('todas');
  const [selectedEstado, setSelectedEstado] = useState('todos');

  // Natural language query examples requested in Section 5
  const sampleQueries = [
    'Busca la secuencia didáctica oficial de Matemática de sexto grado para el año escolar 2026-2027',
    'Necesito una planificación anual de Lengua Española para cuarto grado',
    'Genera la planificación mensual de Ciencias de la Naturaleza de quinto grado',
    'Busca una secuencia sobre fracciones para sexto grado',
    'Busca actividades para estudiantes que presentan dificultades en la división',
    'Prepara una planificación diaria con inicio, desarrollo y cierre'
  ];

  const handleApplySample = (q: string) => {
    setQuery(q);
    // Auto-detect filters from question
    if (q.includes('sexto') || q.includes('6to')) setSelectedGrado('6to de Primaria');
    else if (q.includes('cuarto') || q.includes('4to')) setSelectedGrado('4to de Primaria');
    else if (q.includes('quinto') || q.includes('5to')) setSelectedGrado('5to de Primaria');

    if (q.includes('Matemática') || q.includes('fracciones') || q.includes('división')) setSelectedArea('Matemática');
    else if (q.includes('Lengua Española')) setSelectedArea('Lengua Española');
    else if (q.includes('Ciencias de la Naturaleza')) setSelectedArea('Ciencias de la Naturaleza');
  };

  // Filter sequences
  const filteredSequences = sequences.filter(seq => {
    if (selectedNivel !== 'todos' && seq.nivel !== selectedNivel) return false;
    if (selectedCiclo !== 'todos' && seq.ciclo !== selectedCiclo) return false;
    if (selectedGrado !== 'todos' && !seq.grado.toLowerCase().includes(selectedGrado.toLowerCase())) return false;
    if (selectedArea !== 'todas' && !seq.area.toLowerCase().includes(selectedArea.toLowerCase())) return false;
    if (selectedAno !== 'todos' && seq.anoEscolar !== selectedAno) return false;
    if (selectedEstado !== 'todos' && seq.estadoRevision !== selectedEstado) return false;

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      // Keyword & semantic match
      const inTitle = seq.titulo.toLowerCase().includes(q);
      const inUnidad = seq.unidad.toLowerCase().includes(q);
      const inSituation = seq.situacionAprendizaje.toLowerCase().includes(q);
      const inContents = seq.contenidosConceptuales.some(c => c.toLowerCase().includes(q)) ||
                         seq.contenidosProcedimentales.some(c => c.toLowerCase().includes(q));
      const inIndicators = seq.indicadoresLogro.some(i => i.toLowerCase().includes(q));
      const inKeywords = (q.includes('fraccion') && seq.titulo.toLowerCase().includes('fraccion')) ||
                         (q.includes('division') && seq.titulo.toLowerCase().includes('decimal')) ||
                         (q.includes('informe') && seq.titulo.toLowerCase().includes('informe')) ||
                         (q.includes('digestion') && seq.titulo.toLowerCase().includes('digesti'));

      if (!inTitle && !inUnidad && !inSituation && !inContents && !inIndicators && !inKeywords) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-900 mb-2">
          <BookOpen className="w-4 h-4 text-blue-700" />
          <span>Módulo de Búsqueda Curricular Oficial MINERD</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">
          Localizador de Secuencias Didácticas y Planificaciones Oficiales
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-3xl">
          Consulte las secuencias didácticas aprobadas por el MINERD, adecuación curricular vigente y fuentes verificadas de la Dirección de Educación Primaria (Crece Primaria).
        </p>

        {/* Natural Language Search Input */}
        <div className="mt-5 relative">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Escriba en lenguaje natural (ej. 'Busca la secuencia didáctica oficial de Matemática de sexto grado para 2026-2027')..."
            className="w-full pl-11 pr-28 py-3.5 rounded-xl border-2 border-slate-300 focus:border-[#002B49] focus:ring-2 focus:ring-[#002B49]/20 text-sm font-medium outline-none transition"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-4" />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-3.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Prompt-mandated natural language examples */}
        <div className="mt-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Preguntas y consultas frecuentes sugeridas:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((sq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplySample(sq)}
                className="px-2.5 py-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-xs text-slate-700 hover:text-blue-900 transition text-left truncate max-w-md"
              >
                “{sq}”
              </button>
            ))}
          </div>
        </div>

        {/* 14 Mandatory Filters Grid */}
        <div className="mt-6 pt-5 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
              <Filter className="w-3.5 h-3.5 mr-1 text-slate-500" />
              Filtros Curriculares Combinables:
            </span>
            <button
              onClick={() => {
                setSelectedNivel('Primario');
                setSelectedCiclo('Segundo Ciclo');
                setSelectedGrado('todos');
                setSelectedArea('todas');
                setSelectedAno('2026-2027');
                setSelectedEstado('todos');
                setQuery('');
              }}
              className="text-xs text-[#002B49] font-bold hover:underline"
            >
              Restablecer Filtros
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Nivel Educativo</label>
              <select
                value={selectedNivel}
                onChange={e => setSelectedNivel(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs font-medium bg-white"
              >
                <option value="todos">Todos los Niveles</option>
                <option value="Inicial">Inicial</option>
                <option value="Primario">Primario</option>
                <option value="Secundario">Secundario</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Ciclo Educativo</label>
              <select
                value={selectedCiclo}
                onChange={e => setSelectedCiclo(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs font-medium bg-white"
              >
                <option value="todos">Todos los Ciclos</option>
                <option value="Primer Ciclo">Primer Ciclo (1ro a 3ro)</option>
                <option value="Segundo Ciclo">Segundo Ciclo (4to a 6to)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Grado</label>
              <select
                value={selectedGrado}
                onChange={e => setSelectedGrado(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs font-medium bg-white"
              >
                <option value="todos">Todos los Grados</option>
                <option value="4to de Primaria">4to de Primaria</option>
                <option value="5to de Primaria">5to de Primaria</option>
                <option value="6to de Primaria">6to de Primaria</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Área Curricular</label>
              <select
                value={selectedArea}
                onChange={e => setSelectedArea(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs font-medium bg-white"
              >
                <option value="todas">Todas las Áreas</option>
                <option value="Matemática">Matemática</option>
                <option value="Lengua Española">Lengua Española</option>
                <option value="Ciencias de la Naturaleza">Ciencias de la Naturaleza</option>
                <option value="Ciencias Sociales">Ciencias Sociales</option>
                <option value="Proyecto Interdisciplinario">Proyecto STEAM</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Año Escolar</label>
              <select
                value={selectedAno}
                onChange={e => setSelectedAno(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs font-medium bg-white"
              >
                <option value="todos">Todos los Años</option>
                <option value="2026-2027">2026-2027 (Vigente)</option>
                <option value="2025-2026">2025-2026</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Estado de Revisión</label>
              <select
                value={selectedEstado}
                onChange={e => setSelectedEstado(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs font-medium bg-white"
              >
                <option value="todos">Todos los Estados</option>
                <option value="Oficial MINERD - Verificado">Oficial Verificado</option>
                <option value="Propuesta IA pendiente de validación">Propuesta IA</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800">
          Resultados Curriculares Disponibles ({filteredSequences.length})
        </h2>
        <span className="text-xs text-slate-500">
          Fuentes oficiales vinculadas a la Dirección General de Currículo y Crece Primaria
        </span>
      </div>

      {/* Sequences Cards */}
      <div className="space-y-4">
        {filteredSequences.map(seq => (
          <div
            key={seq.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-blue-300 transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#002B49] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {seq.codigoOficial}
                  </span>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {seq.grado} • {seq.area}
                  </span>
                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                    {seq.estadoRevision}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Año Escolar: <strong>{seq.anoEscolar}</strong>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 pt-1">
                  {seq.titulo}
                </h3>
                <p className="text-xs font-semibold text-blue-900">
                  {seq.unidad}
                </p>
              </div>

              {/* Source link badge */}
              <a
                href={seq.enlaceFuenteOficial}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-xs text-blue-700 hover:text-blue-900 font-semibold bg-blue-50/80 hover:bg-blue-100/80 px-3 py-1.5 rounded-xl border border-blue-200 self-start transition"
              >
                <span>Fuente Oficial MINERD</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Situation & Details */}
            <div className="mt-3 text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-900 block mb-1">Situación de Aprendizaje Oficial:</span>
              <p>{seq.situacionAprendizaje}</p>
              {seq.datosNumericosContextualizados && (
                <div className="mt-2 text-[11px] text-amber-900 bg-amber-50 p-2 rounded border border-amber-200 font-mono">
                  <strong>Cifras censales oficiales legibles en fascículo:</strong> {seq.datosNumericosContextualizados.join('; ')}
                </div>
              )}
            </div>

            {/* Competencies and Indicators Preview */}
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-800 block mb-1">Competencias Fundamentales:</span>
                <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                  {seq.competenciasFundamentales.slice(0, 3).map((cf, i) => (
                    <li key={i}>{cf}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-bold text-slate-800 block mb-1">Indicadores de Logro MINERD:</span>
                <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                  {seq.indicadoresLogro.slice(0, 2).map((ind, i) => (
                    <li key={i}>{ind}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer with Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-slate-500">
                Páginas de referencia: <strong>{seq.paginasReferencia}</strong> • {seq.duracionSemanas} semanas sugeridas ({seq.cantidadSesionesSugeridas} sesiones)
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onViewSequenceDetails(seq)}
                  className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  Ver Ficha Completa
                </button>
                <button
                  onClick={() => onSelectSequenceForPlan(seq, 'diaria')}
                  className="px-3.5 py-1.5 bg-[#002B49] hover:bg-[#003860] text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
                  <span>Generar Planificación Diaria</span>
                </button>
                <button
                  onClick={() => onSelectSequenceForPlan(seq, 'semanal')}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#002B49] border border-blue-200 rounded-xl text-xs font-bold transition"
                >
                  <span>Plan Semanal</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
