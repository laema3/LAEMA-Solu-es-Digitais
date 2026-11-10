import React from 'react';
import { Search, Plus, Sparkles, MessageCircle, Instagram, Mail, Globe } from 'lucide-react';
import { ChannelType } from '../types';

interface HeaderProps {
  currentViewTitle: string;
  onOpenSimulateModal: (defaultChannel?: ChannelType) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentViewTitle,
  onOpenSimulateModal,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
      {/* Zone 1: Context Title */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight whitespace-nowrap">
          {currentViewTitle}
        </h2>
        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          WhatsApp, Instagram, E-mail & Site Conectados
        </span>
      </div>

      {/* Zone 2: Global Search */}
      <div className="hidden md:flex items-center relative w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3" />
        <input
          type="text"
          placeholder="Buscar clientes, pragas ou agendamentos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 placeholder-slate-400"
        />
      </div>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 font-medium mr-2">
          <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </span>
          <span className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded">
            <Instagram className="w-3.5 h-3.5" /> Instagram
          </span>
          <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded">
            <Globe className="w-3.5 h-3.5" /> Site
          </span>
        </div>

        <button
          onClick={() => onOpenSimulateModal()}
          className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Simular Nova Mensagem</span>
        </button>
      </div>
    </header>
  );
};
