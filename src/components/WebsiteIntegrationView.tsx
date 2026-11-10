import React, { useState } from 'react';
import { Globe, Copy, CheckCircle2, Code, ExternalLink, Sparkles, Calendar, MessageSquare } from 'lucide-react';
import { Conversation, Visit } from '../types';

interface WebsiteIntegrationViewProps {
  onAddConversation: (newConv: Conversation) => void;
  onAddVisit: (newVisit: Visit) => void;
}

export const WebsiteIntegrationView: React.FC<WebsiteIntegrationViewProps> = ({
  onAddConversation,
  onAddVisit,
}) => {
  const [copied, setCopied] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const widgetCode = `<script src="https://omnidesk.app/widget.js" data-token="ambiental-pragas-live-9921" async></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(widgetCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSimulateWebsiteBooking = () => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      customerName: 'Fernanda Teles',
      customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      customerEmail: 'fernanda.teles@gmail.com',
      customerPhone: '+55 11 97111-2233',
      channel: 'website',
      status: 'open',
      sentiment: 'Positivo',
      urgencyScore: 4,
      unreadCount: 1,
      lastMessageTime: 'Agora mesmo',
      assignedAgent: 'Carlos Mendes',
      tags: ['Agendamento Site', 'Dedetização'],
      company: 'Residência',
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: 'customer',
          senderName: 'Fernanda Teles',
          text: 'Olá! Acabei de preencher o formulário no site ambientalcontroledepragas.com.br solicitando dedetização para o próximo sábado às 09h.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          channel: 'website',
        }
      ],
      notes: ['Lead gerado pelo widget do site oficial ambientalcontroledepragas.com.br com agendamento solicitado.']
    };

    const newVisit: Visit = {
      id: `v-${Date.now()}`,
      clientName: 'Fernanda Teles',
      clientPhone: '+55 11 97111-2233',
      address: 'Alameda Santos, 1200 - Cerqueira César, São Paulo - SP',
      serviceType: 'Dedetização de Baratas/Formigas',
      scheduledDate: '2026-11-15',
      scheduledPeriod: 'Manhã (08h - 12h)',
      technicianName: 'Marcos Silva',
      status: 'Agendado',
      notes: 'Agendamento originado diretamente pelo site ambientalcontroledepragas.com.br',
    };

    onAddConversation(newConv);
    onAddVisit(newVisit);
    setSuccessToast('Agendamento do site recebido! O lead apareceu na Caixa de Entrada e na Agenda de Visitas.');
    setTimeout(() => setSuccessToast(null), 5000);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Integração com o Website</h2>
        <p className="text-slate-500 text-sm mt-1">Conecte o widget de atendimento e agendamento ao site <a href="https://ambientalcontroledepragas.com.br" target="_blank" rel="noreferrer" className="text-slate-900 underline font-semibold">ambientalcontroledepragas.com.br</a>.</p>
      </div>

      {successToast && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-md text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> {successToast}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Code installation card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Widget de Agendamento no Site</h3>
              <p className="text-xs text-slate-500">Cole este script no seu site WordPress ou HTML para habilitar o chat e agendamentos.</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Snippet de Instalação</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-slate-900 hover:text-slate-700 font-semibold"
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
              </button>
            </div>
            <div className="p-4 bg-slate-900 text-slate-200 font-mono text-xs rounded-xl overflow-x-auto">
              <code>{widgetCode}</code>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-3">
            <p className="font-bold flex items-center gap-1.5 text-slate-900">
              <Sparkles className="w-4 h-4 text-purple-600" /> Como o cliente agenda pelo site e você é avisado aqui:
            </p>
            <p>
              Quando o cliente escolhe o serviço e o horário no site <strong>ambientalcontroledepragas.com.br</strong>, o sistema cria automaticamente o ticket na sua Caixa de Entrada e o compromisso na sua Agenda de Visitas!
            </p>
            <button
              onClick={handleSimulateWebsiteBooking}
              className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Simular Cliente Agendando pelo Site Agora
            </button>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Pré-visualização do Widget</span>
              <a
                href="https://ambientalcontroledepragas.com.br"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 underline font-medium"
              >
                ambientalcontroledepragas.com.br <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Atendimento e Agendamento Automático</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              O widget do site permite que o cliente selecione o tipo de praga e o melhor dia. O lead entra direto no seu CRM sem que você precise digitar nada.
            </p>
          </div>

          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                AP
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Ambiental Controle de Pragas</p>
                <p className="text-[10px] text-emerald-600 font-medium">● Agende sua visita online</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-slate-900 text-white font-bold text-xs rounded-full">
              Chat Ativo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
