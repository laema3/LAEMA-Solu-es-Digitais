import React from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle2, MessageSquare, ShieldCheck, Users } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Relatórios & Performance Omnichannel</h2>
        <p className="text-slate-500 text-sm mt-1">Métricas consolidadas de atendimento no WhatsApp, Instagram e E-mail.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">Total de Atendimentos (Mês)</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2 tabular-nums">1.284</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">↑ 18% em relação ao mês anterior</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">Tempo Médio 1ª Resposta</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2 tabular-nums">1 min 42s</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">Meta: &lt; 2 min (Atingida)</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">Resolução no 1º Contato (FCR)</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2 tabular-nums">84.2%</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">↑ 3.5% este mês</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">CSAT Global</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2 tabular-nums">4.9 / 5.0</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">Baseado em 890 avaliações</p>
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
                <span className="tabular-nums font-bold">640 mensagens (50%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5 font-medium">
                <span className="text-slate-700 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-500"></span> Instagram Direct
                </span>
                <span className="tabular-nums font-bold">410 mensagens (32%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5 font-medium">
                <span className="text-slate-700 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span> E-mail Corporativo
                </span>
                <span className="tabular-nums font-bold">234 mensagens (18%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900">Produtividade da Equipe de Atendimento</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt="Carlos" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Carlos Mendes</p>
                  <p className="text-xs text-slate-500">428 atendimentos resolvidos</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">CSAT 4.98</span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" alt="Ana" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Ana Beatriz</p>
                  <p className="text-xs text-slate-500">392 atendimentos resolvidos</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">CSAT 4.95</span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" alt="Roberto" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Roberto Silveira</p>
                  <p className="text-xs text-slate-500">310 atendimentos resolvidos</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">CSAT 4.88</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
