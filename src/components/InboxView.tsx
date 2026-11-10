import React, { useState } from 'react';
import { Search, MessageSquare, Instagram, Mail, Globe } from 'lucide-react';
import { Conversation, ChannelType, TicketStatus } from '../types';

interface InboxViewProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  selectedChannelFilter: 'all' | ChannelType;
  setSelectedChannelFilter: (channel: 'all' | ChannelType) => void;
}

export const InboxView: React.FC<InboxViewProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  selectedChannelFilter,
  setSelectedChannelFilter,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | TicketStatus>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredConversations = conversations.filter((c) => {
    const matchesChannel = selectedChannelFilter === 'all' || c.channel === selectedChannelFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesSearch =
      c.customerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.customerEmail.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(searchFilter.toLowerCase())) ||
      c.messages.some((m) => m.text.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesChannel && matchesStatus && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden border-r border-slate-200">
      {/* Inbox filter bar */}
      <div className="p-4 border-b border-slate-200 space-y-3 bg-slate-50/50">
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
          {/* Channel tabs */}
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setSelectedChannelFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedChannelFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({conversations.length})
            </button>
            <button
              onClick={() => setSelectedChannelFilter('whatsapp')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                selectedChannelFilter === 'whatsapp' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
            </button>
            <button
              onClick={() => setSelectedChannelFilter('instagram')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                selectedChannelFilter === 'instagram' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Instagram className="w-3.5 h-3.5" /> Instagram
            </button>
            <button
              onClick={() => setSelectedChannelFilter('website')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                selectedChannelFilter === 'website' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> Site
            </button>
            <button
              onClick={() => setSelectedChannelFilter('email')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                selectedChannelFilter === 'email' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" /> E-mail
            </button>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 text-xs shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">Todos os Status</option>
              <option value="open">Abertos</option>
              <option value="pending">Pendentes</option>
              <option value="resolved">Resolvidos</option>
            </select>
          </div>
        </div>

        {/* Local search in inbox */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Pesquisar nas conversas de controle de pragas..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-700">Nenhuma conversa encontrada</p>
            <p className="text-xs text-slate-400">Tente alterar os filtros ou simular uma nova mensagem.</p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = activeConversationId === conv.id;
            const lastMsg = conv.messages[conv.messages.length - 1];

            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`p-4 transition-all cursor-pointer flex gap-3.5 relative ${
                  isActive ? 'bg-emerald-50/60 border-l-4 border-emerald-600' : 'hover:bg-slate-50'
                }`}
              >
                {/* Avatar with channel badge */}
                <div className="relative shrink-0">
                  <img src={conv.customerAvatar} alt={conv.customerName} className="w-11 h-11 rounded-full object-cover" />
                  <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] shadow-sm ${
                    conv.channel === 'whatsapp' ? 'bg-emerald-600' :
                    conv.channel === 'instagram' ? 'bg-purple-600' :
                    conv.channel === 'website' ? 'bg-indigo-600' : 'bg-blue-600'
                  }`}>
                    {conv.channel === 'whatsapp' && <MessageSquare className="w-3 h-3" />}
                    {conv.channel === 'instagram' && <Instagram className="w-3 h-3" />}
                    {conv.channel === 'website' && <Globe className="w-3 h-3" />}
                    {conv.channel === 'email' && <Mail className="w-3 h-3" />}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900 text-sm truncate">{conv.customerName}</h4>
                    <span className="text-[11px] text-slate-400 whitespace-nowrap ml-2">{conv.lastMessageTime}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-600 truncate mt-0.5">
                    {conv.company || conv.customerEmail}
                  </p>
                  <p className="text-xs text-slate-500 truncate mt-1">
                    {lastMsg?.text || 'Sem mensagens'}
                  </p>

                  {/* Tags and sentiment */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      conv.status === 'open' ? 'bg-amber-100 text-amber-800' :
                      conv.status === 'pending' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {conv.status === 'open' ? 'Aberto' : conv.status === 'pending' ? 'Pendente' : 'Resolvido'}
                    </span>

                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      conv.sentiment === 'Frustrado/Urgente' ? 'bg-rose-100 text-rose-700' :
                      conv.sentiment === 'Positivo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {conv.sentiment}
                    </span>

                    {conv.unreadCount > 0 && (
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full ml-auto">
                        {conv.unreadCount} nova{conv.unreadCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
