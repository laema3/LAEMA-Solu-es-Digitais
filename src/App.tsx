import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { InboxView } from './components/InboxView';
import { ChatDetail } from './components/ChatDetail';
import { AnalyticsView } from './components/AnalyticsView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { CustomersView } from './components/CustomersView';
import { SettingsView } from './components/SettingsView';
import { VisitsView } from './components/VisitsView';
import { ChatbotConfigView } from './components/ChatbotConfigView';
import { WebsiteIntegrationView } from './components/WebsiteIntegrationView';
import { SocialPlannerView } from './components/SocialPlannerView';
import { MasterAdminView } from './components/MasterAdminView';
import { KanbanView } from './components/KanbanView';
import { FlowBuilderView } from './components/FlowBuilderView';
import { NewMessageModal } from './components/NewMessageModal';
import { LoginView } from './components/LoginView';
import { INITIAL_CONVERSATIONS, INITIAL_KNOWLEDGE_BASE, INITIAL_VISITS, INITIAL_SOCIAL_POSTS, INITIAL_TENANTS } from './mockData';
import { Conversation, ChannelType, TicketStatus, Visit, SocialPost, Tenant, AuthUser } from './types';

export default function App() {
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    try {
      const saved = localStorage.getItem('laema_tenants');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Exclude test tenants so system is 100% clean
        const clean = parsed.filter(
          (t: any) =>
            t.id !== 'tenant-1' &&
            t.id !== 'tenant-2' &&
            t.id !== 'tenant-3' &&
            t.slug !== 'ambiental-pragas' &&
            t.slug !== 'sos-pragas' &&
            t.slug !== 'cleanclean'
        );
        return clean;
      }
    } catch (e) {
      console.warn('Error reading tenants from localStorage', e);
    }
    return INITIAL_TENANTS;
  });

  const [activeTenantId, setActiveTenantId] = useState<string>('');
  const [currentView, setCurrentView] = useState<'inbox' | 'dashboard' | 'analytics' | 'kb' | 'customers' | 'settings' | 'visits' | 'chatbot' | 'website' | 'social' | 'master' | 'kanban' | 'flow'>('master');
  const [isClientMode, setIsClientMode] = useState<boolean>(false);

  const [isMasterLoggedIn, setIsMasterLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('laema_master_auth') === 'true';
    } catch (e) {
      return true;
    }
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('laema_client_auth');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading auth from localStorage', e);
    }
    return null;
  });

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('laema_client_auth', JSON.stringify(user));
    } catch (e) {
      console.warn('Error saving auth to localStorage', e);
    }
  };

  const handleLogout = () => {
    if (currentView === 'master') {
      setIsMasterLoggedIn(false);
      try {
        localStorage.removeItem('laema_master_auth');
      } catch (e) {
        console.warn('Error clearing master auth', e);
      }
    } else {
      setCurrentUser(null);
      setCurrentView('master');
      setIsClientMode(false);
      window.history.pushState(null, '', '/');
      try {
        localStorage.removeItem('laema_client_auth');
      } catch (e) {
        console.warn('Error clearing client auth', e);
      }
    }
  };

  // Sync tenants to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('laema_tenants', JSON.stringify(tenants));
    } catch (e) {
      console.warn('Error saving tenants to localStorage', e);
    }
  }, [tenants]);

  // URL-based routing: detect if user or client opened /app/:slug or ?slug=:slug
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const querySlug = searchParams.get('empresa') || searchParams.get('slug');

      let targetSlug = querySlug;
      if (!targetSlug && path.startsWith('/app/')) {
        targetSlug = path.replace('/app/', '').split('/')[0].split('?')[0];
      }

      if (targetSlug) {
        const found = tenants.find((t) => t.slug === targetSlug || t.id === targetSlug);
        if (found) {
          setActiveTenantId(found.id);
          setCurrentView('dashboard');
          setIsClientMode(true);
        } else {
          // If a slug was provided but not found, we should NOT fall back to master login silently
          // For now, we'll keep master as fallback but ensure activeTenant is null
          setActiveTenantId('__NOT_FOUND__');
          setIsClientMode(true);
        }
      } else if (path === '/' || path === '') {
        setCurrentView('master');
        setIsClientMode(false);
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, [tenants]);
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);

  // Load/Save tenant data
  useEffect(() => {
    if (activeTenantId && activeTenantId !== '__NOT_FOUND__') {
      const convs = localStorage.getItem(`laema_convs_${activeTenantId}`);
      const vsts = localStorage.getItem(`laema_visits_${activeTenantId}`);
      const posts = localStorage.getItem(`laema_posts_${activeTenantId}`);
      
      setConversations(convs ? JSON.parse(convs) : []);
      setVisits(vsts ? JSON.parse(vsts) : []);
      setSocialPosts(posts ? JSON.parse(posts) : []);
    } else if (currentView === 'master') {
       // In master view, we could potentially see all, but for now we reset
       setConversations([]);
       setVisits([]);
       setSocialPosts([]);
    }
  }, [activeTenantId, currentView]);

  useEffect(() => {
    if (activeTenantId && activeTenantId !== '__NOT_FOUND__') {
      localStorage.setItem(`laema_convs_${activeTenantId}`, JSON.stringify(conversations));
    }
  }, [conversations, activeTenantId]);

  useEffect(() => {
    if (activeTenantId && activeTenantId !== '__NOT_FOUND__') {
      localStorage.setItem(`laema_visits_${activeTenantId}`, JSON.stringify(visits));
    }
  }, [visits, activeTenantId]);

  useEffect(() => {
    if (activeTenantId && activeTenantId !== '__NOT_FOUND__') {
      localStorage.setItem(`laema_posts_${activeTenantId}`, JSON.stringify(socialPosts));
    }
  }, [socialPosts, activeTenantId]);

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<'all' | ChannelType>('all');
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);
  const [defaultSimulateChannel, setDefaultSimulateChannel] = useState<ChannelType>('whatsapp');
  const [searchQuery, setSearchQuery] = useState('');

  const activeTenant = tenants.find((t) => t.id === activeTenantId || (activeTenantId && t.slug === activeTenantId)) || null;
  const unreadTotal = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const activeConversation = conversations.find((c) => c.id === activeConversationId) || (conversations.length > 0 ? conversations[0] : null);

  const handleSelectTenantWorkspace = (tenantId: string) => {
    const tenant = tenants.find((t) => t.id === tenantId);
    setActiveTenantId(tenantId);
    setCurrentView('dashboard');
    setIsClientMode(true);
    if (tenant) {
      window.history.pushState(null, '', `/app/${tenant.slug}`);
    }
  };

  const handleReturnToMaster = () => {
    setCurrentView('master');
    setIsClientMode(false);
    window.history.pushState(null, '', '/');
  };

  const handleAddTenant = (newTenant: Tenant) => {
    setTenants((prev) => [newTenant, ...prev]);
  };

  const handleUpdateTenant = (updated: Tenant) => {
    setTenants((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleDeleteTenant = (id: string) => {
    setTenants((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setCurrentView('inbox');
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSendMessage = (text: string, attachments?: string[]) => {
    if (!activeConversationId) return;

    const newMessage = {
      id: `m-${Date.now()}`,
      sender: 'agent' as const,
      senderName: currentUser?.name || activeTenant?.ownerName || 'Atendente',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel: activeConversation ? activeConversation.channel : ('whatsapp' as ChannelType),
      attachments,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            lastMessageTime: 'Agora mesmo',
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );
  };

  const handleUpdateStatus = (status: TicketStatus) => {
    if (!activeConversationId) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConversationId ? { ...c, status } : c))
    );
  };

  const handleAddNote = (note: string) => {
    if (!activeConversationId) return;
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversationId) {
          const notes = c.notes ? [...c.notes, note] : [note];
          return { ...c, notes };
        }
        return c;
      })
    );
  };

  const handleAddConversation = (newConv: Conversation) => {
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setCurrentView('inbox');
  };

  const handleAddVisit = (newVisit: Visit) => {
    setVisits((prev) => [newVisit, ...prev]);
  };

  const handleUpdateVisit = (updatedVisit: Visit) => {
    setVisits((prev) => prev.map((v) => (v.id === updatedVisit.id ? updatedVisit : v)));
  };

  const handleDeleteVisit = (id: string) => {
    setVisits((prev) => prev.filter((v) => v.id !== id));
  };

  const handleUpdateVisitStatus = (id: string, status: Visit['status']) => {
    setVisits((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status } : v))
    );
  };

  const handleAddSocialPost = (post: SocialPost) => {
    setSocialPosts((prev) => [post, ...prev]);
  };

  const handleDeleteSocialPost = (id: string) => {
    setSocialPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const getViewTitle = () => {
    if (currentView === 'master') {
      return 'Laema Soluções Digitais — Painel Master SaaS';
    }
    const operatorBadge = currentUser ? ` [${currentUser.name}]` : '';
    return `${activeTenant?.name || 'Cliente'} — ${
      currentView === 'dashboard' ? 'Visão Geral' :
      currentView === 'inbox' ? 'Caixa de Entrada' :
      currentView === 'kanban' ? 'Kanban de Atendimento' :
      currentView === 'visits' ? 'Visitas Técnicas' :
      currentView === 'flow' ? 'Fluxo de Conversas' :
      currentView === 'social' ? 'Planejador Social' :
      currentView === 'chatbot' ? 'Chatbot Auto-Pilot' :
      currentView === 'website' ? 'Integração Site' :
      currentView === 'analytics' ? 'Relatórios & CSAT' :
      currentView === 'kb' ? 'Base de Conhecimento' :
      currentView === 'customers' ? 'Clientes CRM' : 'Configurações'
    }${operatorBadge}`;
  };

  // If in master view and master is not logged in, show Master Login View
  if (currentView === 'master' && !isMasterLoggedIn) {
    return (
      <LoginView
        activeTenant={null}
        onLoginSuccess={() => {
          setIsMasterLoggedIn(true);
          try {
            localStorage.setItem('laema_master_auth', 'true');
          } catch (e) {}
        }}
        isClientMode={false}
      />
    );
  }

  // If entering a client workspace and user is not logged in, enforce the Login View
  if (currentView !== 'master' && !currentUser) {
    return (
      <LoginView
        activeTenant={activeTenant}
        onLoginSuccess={handleLoginSuccess}
        onReturnToMaster={handleReturnToMaster}
        isClientMode={isClientMode}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        unreadTotal={unreadTotal}
        activeTenant={activeTenant}
        onReturnToMaster={handleReturnToMaster}
        isClientMode={isClientMode}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          currentViewTitle={getViewTitle()}
          onOpenSimulateModal={(ch) => {
            if (ch) setDefaultSimulateChannel(ch);
            setIsSimulateModalOpen(true);
          }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="flex-1 flex overflow-hidden">
          {currentView === 'master' ? (
            <MasterAdminView
              tenants={tenants}
              onAddTenant={handleAddTenant}
              onUpdateTenant={handleUpdateTenant}
              onDeleteTenant={handleDeleteTenant}
              onSelectTenantWorkspace={handleSelectTenantWorkspace}
            />
          ) : (
            <>
              {currentView === 'dashboard' && (
                <DashboardView
                  conversations={conversations}
                  visits={visits}
                  onSelectConversation={handleSelectConversation}
                  onNavigate={setCurrentView}
                  activeTenant={activeTenant}
                />
              )}

              {currentView === 'inbox' && (
                <div className="flex-1 flex overflow-hidden">
                  <InboxView
                    conversations={conversations}
                    activeConversationId={activeConversationId}
                    onSelectConversation={handleSelectConversation}
                    selectedChannelFilter={selectedChannelFilter}
                    setSelectedChannelFilter={setSelectedChannelFilter}
                  />
                  {activeConversation ? (
                    <ChatDetail
                      conversation={activeConversation}
                      onSendMessage={handleSendMessage}
                      onUpdateStatus={handleUpdateStatus}
                      onAddNote={handleAddNote}
                    />
                  ) : (
                    <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400 text-sm">
                      Selecione uma conversa para iniciar o atendimento.
                    </div>
                  )}
                </div>
              )}

              {currentView === 'kanban' && (
                <KanbanView
                  conversations={conversations}
                  onSelectConversation={handleSelectConversation}
                  onUpdateStatus={(id, st) => {
                    setConversations(prev => prev.map(c => c.id === id ? { ...c, status: st } : c));
                  }}
                />
              )}

              {currentView === 'visits' && (
                <VisitsView
                  visits={visits}
                  onAddVisit={handleAddVisit}
                  onUpdateVisit={handleUpdateVisit}
                  onDeleteVisit={handleDeleteVisit}
                  onUpdateVisitStatus={handleUpdateVisitStatus}
                />
              )}

              {currentView === 'flow' && <FlowBuilderView />}

              {currentView === 'social' && (
                <SocialPlannerView
                  posts={socialPosts}
                  onAddPost={handleAddSocialPost}
                  onDeletePost={handleDeleteSocialPost}
                />
              )}

              {currentView === 'chatbot' && <ChatbotConfigView knowledgeBase={INITIAL_KNOWLEDGE_BASE} />}

              {currentView === 'website' && (
                <WebsiteIntegrationView
                  onAddConversation={handleAddConversation}
                  onAddVisit={handleAddVisit}
                />
              )}

              {currentView === 'analytics' && <AnalyticsView conversations={conversations} />}

              {currentView === 'kb' && <KnowledgeBaseView knowledgeBase={INITIAL_KNOWLEDGE_BASE} />}

              {currentView === 'customers' && <CustomersView conversations={conversations} />}

              {currentView === 'settings' && <SettingsView activeTenant={activeTenant} />}
            </>
          )}
        </main>
      </div>

      <NewMessageModal
        isOpen={isSimulateModalOpen}
        onClose={() => setIsSimulateModalOpen(false)}
        onAddConversation={handleAddConversation}
        defaultChannel={defaultSimulateChannel}
      />
    </div>
  );
}
