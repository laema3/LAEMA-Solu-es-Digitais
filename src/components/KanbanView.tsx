import React from 'react';
import { Conversation, TicketStatus } from '../types';
import { MessageSquare, Instagram, Globe, Mail, ArrowRight, User } from 'lucide-react';

interface KanbanViewProps {
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  onUpdateStatus: (conversationId: string, newStatus: TicketStatus) => void;
}

export const KanbanView: React.FC<KanbanViewProps> = ({ conversations, onSelectConversation }) => {
  const columns: { id: TicketStatus | 'proposal' | 'closed'; title: string; color: string }[] = [
    { id: 'open', title: 'Novos Leads / Abertos', color: 'border-amber-400 bg-amber-50/50' },
    { id: 'pending', title: 'Em Atendimento / Pendente', color: 'border-blue-400 bg-blue-50/50' },
    { id: 'proposal', title: 'Visita / Orçamento', color: 'border-purple-400 bg-purple-50/50' },
    { id: 'resolved', title: 'Resolvido / Fechado', color: 'border-emerald-400 bg-emerald-50/50' },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto flex-1 flex flex-col">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Kanban de Atendimento & Vendas</h2>
        <p className="text-slate-500 text-sm mt-1">Acompanhe visualmente o funil de atendimento dos clientes da Ambiental Controle de Pragas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1 items-start">
        {columns.map((col) => {
          const colConvs = conversations.filter((c) => {
            if (col.id === 'open') return c.status === 'open';
            if (col.id === 'pending') return c.status === 'pending';
            if (col.id === 'proposal') return c.tags.includes('Orçamento') || c.tags.includes('VIP');
            if (col.id === 'resolved') return c.status === 'resolved';
            return false;
          });

          return (
            <div key={col.id} className={`p-4 rounded-2xl border-2 ${col.color} space-y-4 flex flex-col h-full min-h-[500px]`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">{col.title}</h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white text-slate-700 shadow-sm">
                  {colConvs.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {colConvs.map((conv) => {
                  const lastMsg = conv.messages[conv.messages.length - 1];
                  return (
                    <div
                      key={conv.id}
                      onClick={() => onSelectConversation(conv.id)}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={conv.customerAvatar} alt={conv.customerName} className="w-8 h-8 rounded-full object-cover" />
                          <span className="font-semibold text-slate-900 text-xs truncate">{conv.customerName}</span>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                          conv.channel === 'whatsapp' ? 'bg-emerald-100 text-emerald-800' :
                          conv.channel === 'instagram' ? 'bg-purple-100 text-purple-800' :
                          conv.channel === 'website' ? 'bg-indigo-100 text-indigo-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {conv.channel}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2">{lastMsg?.text || 'Sem mensagens'}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {conv.assignedAgent}
                        </span>
                        <span className="font-medium text-emerald-600">{conv.lastMessageTime}</span>
                      </div>
                    </div>
                  );
                })}

                {colConvs.length === 0 && (
                  <div className="py-12 text-center text-xs text-slate-400 italic">
                    Nenhum card nesta etapa
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
