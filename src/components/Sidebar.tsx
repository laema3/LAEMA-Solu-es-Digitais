import React from 'react';
import { MessageSquare, BarChart3, BookOpen, Users, Settings, Sparkles, Layers, Calendar, Bot, Globe, Share2, Shield, ArrowLeft, Columns, GitBranch } from 'lucide-react';
import { Tenant } from '../types';

interface SidebarProps {
  currentView: 'inbox' | 'dashboard' | 'analytics' | 'kb' | 'customers' | 'settings' | 'visits' | 'chatbot' | 'website' | 'social' | 'master' | 'kanban' | 'flow';
  setCurrentView: (view: 'inbox' | 'dashboard' | 'analytics' | 'kb' | 'customers' | 'settings' | 'visits' | 'chatbot' | 'website' | 'social' | 'master' | 'kanban' | 'flow') => void;
  unreadTotal: number;
  activeTenant: Tenant | null;
  onReturnToMaster: () => void;
  isClientMode?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  unreadTotal,
  activeTenant,
  onReturnToMaster,
  isClientMode = false,
}) => {
  const clientNavItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: Layers },
    { id: 'inbox', label: 'Caixa de Entrada', icon: MessageSquare, badge: unreadTotal },
    { id: 'kanban', label: 'Kanban de Atendimento', icon: Columns },
    { id: 'visits', label: 'Agendamento de Visitas', icon: Calendar },
    { id: 'flow', label: 'Fluxo de Conversas', icon: GitBranch },
    { id: 'social', label: 'Planejador Redes Sociais', icon: Share2 },
    { id: 'chatbot', label: 'Chatbot IA (Auto-Pilot)', icon: Bot },
    { id: 'website', label: 'Integração Site', icon: Globe },
    { id: 'analytics', label: 'Relatórios & CSAT', icon: BarChart3 },
    { id: 'kb', label: 'Base de Conhecimento', icon: BookOpen },
    { id: 'customers', label: 'Clientes CRM', icon: Users },
    { id: 'settings', label: 'Canais & Configurações', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white text-slate-800 flex flex-col border-r border-slate-200 shrink-0 select-none shadow-sm">
      {/* Brand logo */}
      <div className="h-16 flex items-center px-4 gap-3 border-b border-slate-100 bg-slate-50/50">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-indigo-900/20 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h1 className="font-bold text-slate-900 tracking-tight text-xs truncate">
            {isClientMode && activeTenant ? activeTenant.name : 'Laema Soluções'}
          </h1>
          <p className="text-[10px] text-purple-600 font-medium truncate">
            {isClientMode ? 'Workspace Omnichannel' : 'SaaS Multi-Tenant CRM'}
          </p>
        </div>
      </div>

      {/* Active tenant switcher banner if viewing a client */}
      {activeTenant && (
        <div className="p-3 bg-purple-50 border-b border-purple-100 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Cliente Ativo</span>
            {!isClientMode && (
              <button
                onClick={onReturnToMaster}
                className="flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                <ArrowLeft className="w-3 h-3" /> Painel Master
              </button>
            )}
          </div>
          <p className="text-xs font-bold text-slate-900 truncate">{activeTenant.name}</p>
        </div>
      )}

      {/* Navigation menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!isClientMode && (
          <button
            onClick={onReturnToMaster}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold mb-3 transition-colors ${
              currentView === 'master'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            <Shield className={`w-4 h-4 ${currentView === 'master' ? 'text-white' : 'text-purple-600'}`} />
            <span>Painel Master (Laema)</span>
          </button>
        )}

        <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          {isClientMode ? 'Menu do Sistema' : 'Workspace do Cliente'}
        </p>
        {clientNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as any)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-purple-50 text-purple-700 border border-purple-200 font-semibold'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-purple-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shrink-0">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer user profile */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
              alt="Administrador Laema"
              className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">Laema Soluções</p>
            <p className="text-[11px] text-slate-500 truncate">Super Admin SaaS</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
