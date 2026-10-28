import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, BookOpen, HelpCircle, Copy, Check } from 'lucide-react';
import { UserProfile } from '../types';
import { api } from '../services/api';

interface PedagogicalAiAssistantProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const PedagogicalAiAssistant: React.FC<PedagogicalAiAssistantProps> = ({
  currentUser,
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string; fuente?: string }[]>([
    {
      role: 'assistant',
      text: `¡Saludos cordiales, ${currentUser.nombre}! Soy el Asistente de IA Pedagógica de PlanificaRD, entrenado en el currículo dominicano y las secuencias oficiales del MINERD.\n\n¿En qué puedo apoyarle hoy?\n• Explicar el desarrollo de una secuencia didáctica.\n• Crear problemas contextualizados a la República Dominicana (con datos del censo).\n• Elaborar rúbricas analíticas según la ordenanza de evaluación vigente.\n• Diseñar actividades de atención a la diversidad y recuperación pedagógica.`,
      fuente: 'Asistente Oficial PlanificaRD'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    '¿Cómo abordar la división con decimales en 6to de Primaria?',
    'Genera un problema de matemática contextualizado a Villa Mella con datos censales',
    'Dame una rúbrica analítica de 4 niveles para evaluar el informe de lectura',
    '¿Qué actividades de cierre en 10 minutos recomiendas para fijar la metacognición?'
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const newHistory = [...messages, { role: 'user' as const, text }];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await api.chatPedagogical({
        mensaje: text,
        contextoDocente: {
          nombre: `${currentUser.nombre} ${currentUser.apellidos}`,
          grado: currentUser.gradosAsignados[0] || '6to de Primaria',
          area: currentUser.areasAsignadas[0] || 'Matemática',
          escuela: currentUser.centroEducativoNombre
        }
      });

      setMessages([...newHistory, { role: 'assistant', text: res.respuesta, fuente: res.fuente }]);
    } catch (e: any) {
      setMessages([...newHistory, {
        role: 'assistant',
        text: 'Ocurrió una dificultad al consultar el modelo. Por favor verifique su conexión o intente nuevamente.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (txt: string, idx: number) => {
    navigator.clipboard.writeText(txt);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-[#002B49] text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">Asistente de IA Pedagógica</h3>
            <p className="text-[10px] text-blue-200 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
              Gemini 3.8 Flash • Adecuación Curricular MINERD
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-white/70 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Notice Banner */}
      <div className="px-3 py-1.5 bg-amber-50 border-b border-amber-200 text-[10px] text-amber-900 flex items-center justify-between">
        <span>Contenido asistido por IA: pendiente de validación curricular final.</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[90%] whitespace-pre-wrap leading-relaxed shadow-2xs ${
                m.role === 'user'
                  ? 'bg-[#002B49] text-white rounded-br-none'
                  : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
              }`}
            >
              {m.text}
            </div>

            {m.role === 'assistant' && (
              <div className="flex items-center space-x-2 mt-1 text-[10px] text-slate-400">
                <span>{m.fuente || 'MINERD AI'}</span>
                <button
                  onClick={() => handleCopy(m.text, idx)}
                  className="hover:text-slate-600 flex items-center"
                >
                  {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs">
            <Bot className="w-4 h-4 animate-spin text-blue-700" />
            <span>Consultando fuentes curriculares del MINERD...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-2 border-t border-slate-100 bg-slate-50 space-y-1">
        <span className="text-[10px] font-bold uppercase text-slate-400 block px-1">Preguntas sugeridas:</span>
        <div className="flex flex-col gap-1 max-h-24 overflow-y-auto">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(qp)}
              className="text-left text-[11px] p-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-900 transition truncate"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Pregunte sobre secuencias, actividades o rúbricas..."
            className="flex-1 p-2.5 border border-slate-300 rounded-xl text-xs focus:border-[#002B49] outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 bg-[#002B49] text-white rounded-xl hover:bg-[#003860] disabled:opacity-50 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
