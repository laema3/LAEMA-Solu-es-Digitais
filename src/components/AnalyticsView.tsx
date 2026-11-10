import React from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle2, MessageSquare, ShieldCheck, Users } from 'lucide-react';
import { Conversation } from '../types';

interface AnalyticsViewProps {
  conversations?: Conversation[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ conversations = [] }) => {
  const total = conversations.length;
  const resolved = conversations.filter((c) => c.status === 'resolved').length;
  const whatsappCount = conversations.filter((c) => c.channel === 'whatsapp').length;
  const instagramCount = conversations.filter((c) => c.channel === 'instagram').length;
  const websiteCount = conversations.filter((c) => c.channel === 'website').length;
  const emailCount = conversations.filter((c) => c.channel === 'email').length;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Relatórios & Performance Omnichannel</h2>
        <p className="text-slate-500 text-sm mt-1">Métricas consolidadas de atendimento no WhatsApp, Instagram, E-mail e Site.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">Total de Atendimentos</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2 tabular-nums">{total}</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">Registros no CRM</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">Tempo Médio 1ª Resposta</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2 tabular-nums">{total > 0 ? '< 2 min' : '--'}</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">{total > 0 ? 'Meta atingida' : 'Aguardando dados'}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">Atendimentos Resolvidos</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2 tabular-nums">{resolved}</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">{total > 0 ? `${Math.round((resolved / total) * 100)}% de resolução` : 'Nenhum chamado pendente'}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">CSAT Global</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2 tabular-nums">{total > 0 ? '5.0 / 5.0' : '--'}</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">Satisfação dos clientes</p>
        </div>
      </div>

      {/* Channel Volume Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900">Volume de Mensagens por Canal</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5 font-medium">
                <span className="text-slate-700 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span> WhatsApp Business
                </span>
                <span className="tabular-nums font-bold">{whatsappCount} mensagens</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: total > 0 ? `${(whatsappCount / total) * 100}%` : '0%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5 font-medium">
                <span className="text-slate-700 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-500"></span> Instagram Direct
                </span>
                <span className="tabular-nums font-bold">{instagramCount} mensagens</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: total > 0 ? `${(instagramCount / total) * 100}%` : '0%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5 font-medium">
                <span className="text-slate-700 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-500"></span> Website Widget
                </span>
                <span className="tabular-nums font-bold">{websiteCount} mensagens</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: total > 0 ? `${(websiteCount / total) * 100}%` : '0%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5 font-medium">
                <span className="text-slate-700 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span> E-mail
                </span>
                <span className="tabular-nums font-bold">{emailCount} mensagens</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: total > 0 ? `${(emailCount / total) * 100}%` : '0%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900">Produtividade da Equipe de Atendimento</h3>
          <div className="p-8 text-center space-y-3 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Aguardando atendimentos reais</p>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Conforme os operadores realizarem atendimentos e resolverem chamados, o ranking de produtividade e CSAT será gerado aqui automaticamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
