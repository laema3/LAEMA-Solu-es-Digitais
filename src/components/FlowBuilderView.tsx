import React, { useState } from 'react';
import { GitBranch, Plus, CheckCircle2, Bot, MessageSquare, Calendar, ArrowRight, Settings } from 'lucide-react';

export const FlowBuilderView: React.FC = () => {
  const [steps, setSteps] = useState([
    { id: 1, title: 'Início do Atendimento (Boas-vindas)', trigger: 'Mensagem recebida no WhatsApp / Site', action: 'Enviar saudação automática + Menu de Pragas' },
    { id: 2, title: 'Identificação da Praga', trigger: 'Cliente escolhe 1 (Baratas/Formigas) ou 2 (Cupins/Ratos)', action: 'Enviar orientações e perguntar endereço' },
    { id: 3, title: 'Agendamento Automático', trigger: 'Cliente informa endereço e melhor data', action: 'Cadastrar visita na agenda e notificar técnico' },
    { id: 4, title: 'Transbordo para Humano', trigger: 'Cliente digita "Falar com atendente"', action: 'Atribuir para Carlos Mendes na Caixa de Entrada' },
  ]);

  const [toast, setToast] = useState<string | null>(null);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto flex-1 flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Fluxo de Conversas & Automação (Chatbot)</h2>
          <p className="text-slate-500 text-sm mt-1">Configure o fluxo conversacional interativo para atendimento de controle de pragas.</p>
        </div>
        <button
          onClick={() => {
            setToast('Novo bloco de fluxo adicionado com sucesso!');
            setTimeout(() => setToast(null), 3000);
          }}
          className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Novo Bloco</span>
        </button>
      </div>

      {toast && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-md text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> {toast}
        </div>
      )}

      {/* Flow Steps Visualizer */}
      <div className="space-y-6 max-w-3xl mx-auto w-full">
        {steps.map((step, idx) => (
          <div key={step.id} className="relative">
            <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500/30 shadow-md space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  Etapa {step.id}
                </span>
                <span className="text-xs font-medium text-slate-400">Automação Ativa</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{step.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="font-bold text-slate-500 block mb-1">Gatilho (Trigger):</span>
                  <span className="text-slate-800">{step.trigger}</span>
                </div>
                <div className="p-3 bg-emerald-50/60 rounded-xl">
                  <span className="font-bold text-emerald-700 block mb-1">Ação da IA / Bot:</span>
                  <span className="text-slate-800">{step.action}</span>
                </div>
              </div>
            </div>

            {idx < steps.length - 1 && (
              <div className="flex justify-center my-3">
                <div className="w-0.5 h-8 bg-emerald-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
