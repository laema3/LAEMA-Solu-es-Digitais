import React from 'react';
import { MessageSquare, Clock, CheckCircle2, TrendingUp, Users, Sparkles, ArrowUpRight, ShieldCheck, Calendar, Globe } from 'lucide-react';
import { Conversation, Visit, Tenant } from '../types';

interface DashboardViewProps {
  conversations: Conversation[];
  visits: Visit[];
  onSelectConversation: (id: string) => void;
  onNavigate: (view: 'inbox' | 'analytics' | 'kb' | 'customers' | 'settings' | 'visits' | 'chatbot' | 'website' | 'social' | 'master' | 'kanban' | 'flow') => void;
  activeTenant?: Tenant | null;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  conversations,
  visits,
  onSelectConversation,
  onNavigate,
  activeTenant,
}) => {
  const totalOpen = conversations.filter((c) => c.status === 'open').length;
  const confirmedVisits = visits.filter((v) => v.status === 'Confirmado pelo Cliente').length;
  
  const whatsappCount = conversations.filter((c) => c.channel === 'whatsapp').length;
  const instagramCount = conversations.filter((c) => c.channel === 'instagram').length;
  const websiteCount = conversations.filter((c) => c.channel === 'website').length;
  const emailCount = conversations.filter((c) => c.channel === 'email').length;

  const urgentConversations = conversations.filter((c) => c.urgencyScore >= 4 && c.status !== 'resolved');

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Welcome banner */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>{activeTenant?.name || 'Central de Atendimento'} — Workspace Ativo</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            WhatsApp, Instagram, E-mail & Site Unificados
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Gerencie solicitações, conversas e agendamentos de visitas técnicas com inteligência artificial Gemini respondendo automaticamente fora do expediente.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onNavigate('visits')}
            className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Ver Visitas ({visits.length})</span>
          </button>
          <button
            onClick={() => onNavigate('chatbot')}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-900 font-semibold rounded-xl text-xs transition-colors border border-slate-200 flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Configurar Chatbot IA</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Conversas Abertas</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2 tabular-nums">{totalOpen}</h3>
            <p className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> Requer resposta
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Visitas Confirmadas</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2 tabular-nums">{confirmedVisits}</h3>
            <p className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Técnicos escalados
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Atendimentos via Site</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2 tabular-nums">{websiteCount}</h3>
            <p className="text-xs text-slate-600 font-medium mt-1 flex items-center gap-1">
              <Globe className="w-3 h-3 text-purple-600" /> ambientalcontroledepragas.com.br
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Índice Satisfação CSAT</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2 tabular-nums">4.9 / 5.0</h3>
            <p className="text-xs text-slate-500 mt-1">Avaliações de dedetização</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Channel Distribution & Urgent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Channel breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900">Volume por Canal</h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span> WhatsApp
                </span>
                <span className="font-bold text-slate-900 tabular-nums">{whatsappCount}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: conversations.length > 0 ? `${(whatsappCount / conversations.length) * 100}%` : '0%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <span className="w-3 h-3 rounded-full bg-purple-500"></span> Instagram
                </span>
                <span className="font-bold text-slate-900 tabular-nums">{instagramCount}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: conversations.length > 0 ? `${(instagramCount / conversations.length) * 100}%` : '0%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <span className="w-3 h-3 rounded-full bg-indigo-500"></span> Website Widget
                </span>
                <span className="font-bold text-slate-900 tabular-nums">{websiteCount}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: conversations.length > 0 ? `${(websiteCount / conversations.length) * 100}%` : '0%' }}></div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Sincronização ativa</span>
            <button onClick={() => onNavigate('settings')} className="text-slate-900 font-semibold hover:underline">
              Configurar Canais →
            </button>
          </div>
        </div>

        {/* Urgent Attention Needed */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Solicitações Urgentes de Dedetização</span>
                <span className="bg-rose-100 text-rose-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {urgentConversations.length} novas
                </span>
              </h3>
              <button onClick={() => onNavigate('inbox')} className="text-xs font-semibold text-slate-900 hover:underline">
                Ver todas na caixa de entrada
              </button>
            </div>

            <div className="space-y-3">
              {urgentConversations.length === 0 ? (
                <p className="text-sm text-slate-500 py-6 text-center">Nenhum chamado urgente pendente.</p>
              ) : (
                urgentConversations.map((conv) => {
                  const lastMsg = conv.messages[conv.messages.length - 1];
                  return (
                    <div
                      key={conv.id}
                      onClick={() => onSelectConversation(conv.id)}
                      className="p-4 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50/80 transition-all cursor-pointer flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img src={conv.customerAvatar} alt={conv.customerName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 text-sm truncate">{conv.customerName}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                              conv.channel === 'whatsapp' ? 'bg-emerald-100 text-emerald-800' :
                              conv.channel === 'instagram' ? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800'
                            }`}>
                              {conv.channel}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{lastMsg?.text || 'Sem mensagens'}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold">
                          Urgência {conv.urgencyScore}/5
                        </span>
                        <p className="text-[11px] text-slate-400 mt-1">{conv.lastMessageTime}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
