import React, { useState } from 'react';
import {
  BookOpen, ExternalLink, Upload, FileText, CheckCircle2, ShieldCheck,
  Search, AlertCircle, Sparkles, Plus, FileCode
} from 'lucide-react';
import { OfficialCurriculumSequence, UserProfile } from '../types';
import { api } from '../services/api';

interface CurriculumLibraryViewProps {
  sequences: OfficialCurriculumSequence[];
  currentUser: UserProfile;
  onRefreshSequences: () => void;
  onSelectSequenceForPlan: (seq: OfficialCurriculumSequence) => void;
}

export const CurriculumLibraryView: React.FC<CurriculumLibraryViewProps> = ({
  sequences,
  currentUser,
  onRefreshSequences,
  onSelectSequenceForPlan
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    nombreArchivo: '',
    area: 'Matemática',
    grado: '6to de Primaria',
    nivel: 'Primario',
    textoExtraido: ''
  });
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const officialPortals = [
    {
      titulo: 'Dirección de Educación Primaria (Crece Primaria)',
      url: 'https://www.minerd.gob.do/sobre-nosotros/areas-institucionales/direccion-de-educacion-primaria/segundo-ciclo-crece-primaria',
      desc: 'Secuencias didácticas completas y fascículos para docentes de 4to, 5to y 6to grado de Primaria.',
      badge: 'Fuente Primaria Oficial'
    },
    {
      titulo: 'Dirección General de Currículo (Diseño Curricular)',
      url: 'https://www.minerd.gob.do/sobre-nosotros/areas-institucionales/direccion-general-de-curriculo/diseno-curricular',
      desc: 'Adecuación curricular vigente, competencias fundamentales y específicas, matrices de contenidos e indicadores.',
      badge: 'Adecuación Curricular Vigente'
    },
    {
      titulo: 'Aula Virtual del MINERD',
      url: 'https://aulavirtual2.minerd.gob.do/',
      desc: 'Plataforma oficial de recursos de aprendizaje interactivos, guías didácticas y evaluaciones.',
      badge: 'Plataforma Virtual MINERD'
    },
    {
      titulo: 'Repositorio Institucional Secuencias Primaria (SharePoint MINERD)',
      url: 'https://educrd-my.sharepoint.com/:f:/r/personal/eddy_suazo_docente_edu_do/Documents/Documentos/Secuencias%20Didacticas%20Minerd?d=wf520e9fa040d4348ab813ad367ea53e3&csf=1&web=1&e=x2bb7Z',
      desc: 'Carpeta oficial con las secuencias didácticas y fascículos del Segundo Ciclo de Primaria provistos para esta plataforma.',
      badge: 'Carpeta Oficial Minerd Eddy Suazo'
    }
  ];

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setUploadSuccess(null);
    try {
      await api.uploadCurriculumDocument({
        ...uploadData,
        userNombre: `${currentUser.nombre} ${currentUser.apellidos}`,
        userId: currentUser.id
      });
      setUploadSuccess('Documento curricular indexado y analizado con éxito.');
      onRefreshSequences();
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadSuccess(null);
      }, 1500);
    } catch (e: any) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const filteredSequences = sequences.filter(s => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return s.titulo.toLowerCase().includes(q) ||
           s.area.toLowerCase().includes(q) ||
           s.grado.toLowerCase().includes(q) ||
           s.codigoOficial.toLowerCase().includes(q) ||
           s.fuenteOficial.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-900 mb-1.5">
            <BookOpen className="w-4 h-4 text-blue-700" />
            <span>Biblioteca Curricular Digital MINERD</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Fuentes Oficiales y Secuencias Indexadas
          </h1>
          <p className="mt-1 text-xs text-slate-600 max-w-2xl">
            Consulte la documentación oficial respaldada por la Dirección de Educación Primaria y la Dirección General de Currículo. Puede importar nuevos documentos PDF o DOCX para su indexación.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 bg-[#002B49] hover:bg-[#003860] text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-2 transition self-start md:self-center"
        >
          <Upload className="w-4 h-4 text-amber-300" />
          <span>Subir e Indexar Documento</span>
        </button>
      </div>

      {/* Official Portals Grid */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
          Portales Institucionales Oficiales de Referencia:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {officialPortals.map((p, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between hover:border-blue-300 transition">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase bg-blue-50 text-[#002B49] px-2 py-0.5 rounded border border-blue-200">
                    {p.badge}
                  </span>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                  >
                    <span>Abrir Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{p.titulo}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search in indexed documents */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar en el catálogo de secuencias didácticas indexadas (ej. Matemática 6to, Fascículo, Fracciones...)"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#002B49] focus:ring-2 focus:ring-[#002B49]/20 outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>
      </div>

      {/* Indexed Documents Table / List */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Documentos y Secuencias Oficiales Disponibles ({filteredSequences.length})
        </h2>

        <div className="grid grid-cols-1 gap-3">
          {filteredSequences.map(seq => (
            <div
              key={seq.id}
              className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[10px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                    {seq.codigoOficial}
                  </span>
                  <span className="text-[11px] font-bold text-slate-700">
                    {seq.area} • {seq.grado}
                  </span>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
                    <ShieldCheck className="w-3 h-3 mr-1 text-emerald-700" />
                    {seq.estadoRevision}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{seq.titulo}</h3>
                <p className="text-xs text-slate-500">
                  <strong>Fuente:</strong> {seq.fuenteOficial} • <strong>Páginas:</strong> {seq.paginasReferencia} • <strong>Fecha:</strong> {seq.fechaActualizacion}
                </p>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center">
                <button
                  onClick={() => onSelectSequenceForPlan(seq)}
                  className="px-3.5 py-1.5 bg-[#002B49] hover:bg-[#003860] text-white rounded-xl text-xs font-bold shadow-xs transition"
                >
                  Planificar con esta Secuencia
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center">
              <Upload className="w-5 h-5 text-blue-700 mr-2" />
              Importar e Indexar Documento Curricular
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Cargue un archivo PDF o DOCX con secuencias del MINERD para extraer su texto, competencias e indicadores.
            </p>

            {uploadSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 rounded-xl flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nombre del Documento</label>
                <input
                  type="text"
                  required
                  value={uploadData.nombreArchivo}
                  onChange={e => setUploadData({ ...uploadData, nombreArchivo: e.target.value })}
                  placeholder="ej. Fascículo_Matemática_6to_Operaciones_Decimales.pdf"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Área Curricular</label>
                  <select
                    value={uploadData.area}
                    onChange={e => setUploadData({ ...uploadData, area: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Matemática">Matemática</option>
                    <option value="Lengua Española">Lengua Española</option>
                    <option value="Ciencias de la Naturaleza">Ciencias de la Naturaleza</option>
                    <option value="Ciencias Sociales">Ciencias Sociales</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Grado</label>
                  <select
                    value={uploadData.grado}
                    onChange={e => setUploadData({ ...uploadData, grado: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="4to de Primaria">4to de Primaria</option>
                    <option value="5to de Primaria">5to de Primaria</option>
                    <option value="6to de Primaria">6to de Primaria</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Texto o Fragmento del Documento Oficial (OCR / Copiado)
                </label>
                <textarea
                  rows={4}
                  required
                  value={uploadData.textoExtraido}
                  onChange={e => setUploadData({ ...uploadData, textoExtraido: e.target.value })}
                  placeholder="Pegue aquí el texto extraído del PDF o documento oficial para su indexación automática de competencias e indicadores..."
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-[#002B49] text-white rounded-xl text-xs font-bold hover:bg-[#003860]"
                >
                  {uploading ? 'Indexando...' : 'Indexar Documento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
