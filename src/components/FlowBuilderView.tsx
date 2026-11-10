import React, { useState } from 'react';
import { GitBranch, Plus, CheckCircle2, Bot, MessageSquare, Calendar, ArrowRight, Settings, Trash2, Edit2, Play } from 'lucide-react';

interface FlowStep {
  id: string;
  title: string;
  trigger: string;
  action: string;
  channel: string;
}

export const FlowBuilderView: React.FC = () => {
  const [steps, setSteps] = useState<FlowStep[]>([
    { id: '1', title: 'Início do Atendimento (Boas-vindas)', trigger: 'Mensagem recebida no WhatsApp / Site', action: 'Enviar saudação automática + Menu inicial (1. Orçamento, 2. Visita Técnica, 3. Falar com Atendente)', channel: 'WhatsApp / Site' },
    { id: '2', title: 'Identificação da Necessidade', trigger: 'Cliente seleciona opção do menu ou digita texto', action: 'Coletar nome, endereço e tipo de praga / serviço desejado', channel: 'Todos' },
    { id: '3', title: 'Agendamento Automático', trigger: 'Dados completos fornecidos pelo cliente', action: 'Sugerir horários de visita técnica e registrar no calendário', channel: 'WhatsApp' },
    { id: '4', title: 'Transbordo para Atendente Humano', trigger: 'Cliente digita "Atendente" ou "Humano"', action: 'Atribuir ticket para Vilma ou Mariana na Caixa de Entrada com notificação sonora', channel: 'Todos' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<FlowStep | null>(null);
  const [title, setTitle] = useState('');
  const [trigger, setTrigger] = useState('');
  const [action, setAction] = useState('');
  const [channel, setChannel] = useState('WhatsApp');

  const [toast, setToast] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);

  const handleOpenAdd = () => {
    setEditingStep(null);
    setTitle('');
    setTrigger('');
    setAction('');
    setChannel('WhatsApp');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (step: FlowStep) => {
    setEditingStep(step);
    setTitle(step.title);
    setTrigger(step.trigger);
    setAction(step.action);
    setChannel(step.channel);
    setIsModalOpen(true);
  };

  const handleSaveStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !trigger || !action) return;

    if (editingStep) {
      setSteps(prev => prev.map(s => s.id === editingStep.id ? { ...s, title, trigger, action, channel } : s));
      setToast('Bloco do fluxo atualizado com sucesso!');
    } else {
      const newStep: FlowStep = {
        id: `step-${Date.now()}`,
        title,
        trigger,
        action,
        channel,
      };
      setSteps(prev => [...prev, newStep]);
      setToast('Novo bloco de fluxo adicionado com sucesso!');
    }

    setIsModalOpen(false);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteStep = (id: string) => {
    setSteps(prev => prev.filter(s => s.id !== id));
    setToast('Bloco removido do fluxo.');
    setTimeout(() => setToast(null), 3000);
  };

  const handleTestFlow = () => {
    setIsSimulating(true);
    setSimulationLog(['Iniciando simulação do bot...']);
    setTimeout(() => {
      setSimulationLog(prev => [...prev, '👤 Cliente envia "Olá, preciso de dedetização".']);
    }, 500);
    setTimeout(() => {
      setSimulationLog(prev => [...prev, '🤖 [Etapa 1] Bot envia mensagem de boas-vindas e menu inicial.']);
    }, 1200);
    setTimeout(() => {
      setSimulationLog(prev => [...prev, '👤 Cliente seleciona "2. Visita Técnica".']);
    }, 1900);
    setTimeout(() => {
      setSimulationLog(prev => [...prev, '🤖 [Etapa 3] Bot solicita endereço e agenda visita automaticamente.']);
    }, 2600);
    setTimeout(() => {
      setSimulationLog(prev => [...prev, '✅ Fluxo executado com sucesso! Ticket criado na Caixa de Entrada.']);
      setIsSimulating(false);
    }, 3400);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto flex-1 flex flex-col select-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Fluxo de Conversas & Automação (Chatbot)</h2>
          <p className="text-slate-500 text-sm mt-1">Configure o fluxo conversacional interativo do seu atendimento automático.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleTestFlow}
            disabled={isSimulating}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            <span>{isSimulating ? 'Simulando...' : 'Testar Fluxo'}</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Novo Bloco</span>
          </button>
        </div>
      </div>

      {toast && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-md text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> {toast}
        </div>
      )}

      {/* Simulation Log Preview Modal / Banner */}
      {simulationLog.length > 0 && (
        <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4" /> Simulador de Fluxo do Chatbot
            </span>
            <button onClick={() => setSimulationLog([])} className="text-xs text-slate-400 hover:text-white">Limpar Log</button>
          </div>
          <div className="space-y-1.5 font-mono text-xs">
            {simulationLog.map((log, i) => (
              <p key={i} className="animate-in fade-in">{log}</p>
            ))}
          </div>
        </div>
      )}

      {/* Flow Steps Visualizer */}
      <div className="space-y-6 max-w-3xl mx-auto w-full">
        {steps.map((step, idx) => (
          <div key={step.id} className="relative">
            <div className="bg-white p-6 rounded-2xl border-2 border-sky-500/30 shadow-md space-y-3 relative z-10 hover:border-sky-500 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800">
                  Etapa {idx + 1} ({step.channel})
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(step)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                    title="Editar Bloco"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteStep(step.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    title="Excluir Bloco"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{step.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="font-bold text-slate-500 block mb-1">Gatilho (Trigger):</span>
                  <span className="text-slate-800">{step.trigger}</span>
                </div>
                <div className="p-3 bg-sky-50/60 rounded-xl">
                  <span className="font-bold text-sky-700 block mb-1">Ação da IA / Bot:</span>
                  <span className="text-slate-800">{step.action}</span>
                </div>
              </div>
            </div>

            {idx < steps.length - 1 && (
              <div className="flex justify-center my-3">
                <div className="w-0.5 h-8 bg-sky-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-sky-600"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add / Edit Step Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <h3 className="text-lg font-bold text-slate-900">
              {editingStep ? 'Editar Bloco do Fluxo' : 'Adicionar Novo Bloco de Automação'}
            </h3>
            <form onSubmit={handleSaveStep} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Título da Etapa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pesquisa de Satisfação CSAT"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Canal</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Instagram">Instagram Direct</option>
                  <option value="Site">Widget do Site</option>
                  <option value="Todos">Todos os Canais</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Gatilho (Trigger) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Atendimento finalizado pelo atendente"
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Ação do Bot / IA *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ex: Enviar pesquisa de nota de 1 a 5"
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl shadow-sm"
                >
                  {editingStep ? 'Salvar Alterações' : 'Adicionar Bloco'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
