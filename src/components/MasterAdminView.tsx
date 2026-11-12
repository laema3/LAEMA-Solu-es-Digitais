import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Edit2, Trash2, ExternalLink, Globe, Smartphone, Building, Users, AlertTriangle, CheckCircle2, Sparkles, Copy, Server, Key, LogOut, RefreshCw } from 'lucide-react';
import { Tenant } from '../types';

interface MasterAdminViewProps {
  tenants: Tenant[];
  onAddTenant: (tenant: Tenant) => void;
  onUpdateTenant: (tenant: Tenant) => void;
  onDeleteTenant: (id: string) => void;
  onSelectTenantWorkspace: (tenantId: string) => void;
  onLogout?: () => void;
}

interface GlobalConfig {
  evolutionApiUrl: string;
  globalApiToken: string;
}

export const MasterAdminView: React.FC<MasterAdminViewProps> = ({
  tenants,
  onAddTenant,
  onUpdateTenant,
  onDeleteTenant,
  onSelectTenantWorkspace,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'tenants' | 'settings'>('tenants');

  // Global Config state
  const [config, setConfig] = useState<GlobalConfig>(() => {
    try {
      const saved = localStorage.getItem('laema_global_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { evolutionApiUrl: '', globalApiToken: '' };
  });

  // Tenant Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [name, setName] = useState('');
  const [segment, setSegment] = useState('Controle de Pragas');
  const [ownerName, setOwnerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [plan, setPlan] = useState<'Starter' | 'Pro' | 'Enterprise'>('Pro');
  const [status, setStatus] = useState<'Ativo' | 'Bloqueado' | 'Teste'>('Ativo');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [toast, setToast] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestConnection = async () => {
    if (!config.evolutionApiUrl) {
      setToast('Insira a URL da VPS antes de testar.');
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/proxy/evolution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          targetUrl: `${config.evolutionApiUrl}/instance/fetchInstances`,
          method: 'GET',
          apiKey: config.globalApiToken
        })
      });

      if (response.ok) {
        setTestResult({ success: true, message: 'Conectado com sucesso via Proxy! A VPS respondeu corretamente.' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setTestResult({ 
          success: false, 
          message: `Erro na VPS (${response.status}): ${errorData.message || 'Verifique a URL e o Token.'}` 
        });
      }
    } catch (error: any) {
      setTestResult({ 
        success: false, 
        message: 'Falha na comunicação com o servidor de proxy. Tente novamente em instantes.' 
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('laema_global_config', JSON.stringify(config));
    setToast('Configurações globais da VPS salvas com sucesso!');
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingTenant(null);
    setName('');
    setSegment('Controle de Pragas');
    setOwnerName('');
    setWhatsappNumber('');
    setCustomDomain('');
    setPlan('Pro');
    setStatus('Ativo');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Tenant) => {
    setEditingTenant(t);
    setName(t.name);
    setSegment(t.segment);
    setOwnerName(t.ownerName);
    setWhatsappNumber(t.whatsappNumber);
    setCustomDomain(t.customDomain);
    setPlan(t.plan);
    setStatus(t.status);
    setIsModalOpen(true);
  };

  const handleSaveTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !whatsappNumber) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    if (editingTenant) {
      const updated: Tenant = {
        ...editingTenant,
        name,
        slug,
        segment,
        ownerName,
        whatsappNumber,
        customDomain,
        plan,
        status,
      };
      onUpdateTenant(updated);
      setToast('Empresa cliente atualizada com sucesso!');
    } else {
      const newTenant: Tenant = {
        id: `tenant-${Date.now()}`,
        name,
        slug,
        segment,
        ownerName: ownerName || 'Administrador',
        whatsappNumber,
        customDomain: customDomain || `${slug}.laemasolucoes.com.br`,
        plan,
        status,
        createdAt: new Date().toLocaleDateString(),
      };
      onAddTenant(newTenant);
      setToast('Nova empresa cliente cadastrada com sucesso! Link exclusivo gerado.');
    }

    setIsModalOpen(false);
    setTimeout(() => setToast(null), 4000);
  };

  const handleCopyClientLink = (slug: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://laemasolucoes.com.br';
    const link = `${origin}/app/${slug}`;
    navigator.clipboard.writeText(link);
    setToast(`Link de acesso copiado: ${link}`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto select-none">
      {/* Master banner */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Laema Soluções Digitais — Painel Master SaaS</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            Gerenciamento Global do Sistema
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
            Supervisione todas as empresas clientes e configure a conexão central com a sua VPS (Evolution API). 
          </p>
        </div>
        <div className="flex items-center gap-3">
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2.5 text-slate-400 hover:text-rose-600 rounded-xl border border-slate-200 hover:bg-rose-50 transition-colors"
              title="Sair do Painel Master"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Nova Empresa</span>
          </button>
        </div>
      </div>

      {toast && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-md text-sm font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5" /> {toast}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('tenants')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'tenants' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
        >
          <Building className="w-4 h-4" />
          <span>Empresas Clientes ({tenants.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'settings' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
        >
          <Server className="w-4 h-4" />
          <span>Configuração da VPS (Evolution API)</span>
        </button>
      </div>

      {/* TAB 1: TENANTS LIST */}
      {activeTab === 'tenants' && (
        <div className="space-y-4">
          {tenants.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-dashed border-slate-300 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                <Plus className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Nenhuma empresa cliente cadastrada</h3>
              <button
                onClick={handleOpenAdd}
                className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
              >
                Cadastrar Primeira Empresa
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tenants.map((tenant) => (
                <div key={tenant.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        tenant.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800' :
                        tenant.status === 'Teste' ? 'bg-purple-100 text-purple-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {tenant.status}
                      </span>
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                        Plano {tenant.plan}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{tenant.name}</h3>
                      <p className="text-xs font-medium text-slate-600 mt-0.5">{tenant.segment}</p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <p className="flex items-center gap-2 truncate">
                        <Users className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Resp: <strong>{tenant.ownerName}</strong></span>
                      </p>
                      <p className="flex items-center gap-2 truncate">
                        <Smartphone className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>WhatsApp: {tenant.whatsappNumber}</span>
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-slate-900 font-mono text-[11px] truncate">
                          /app/{tenant.slug}
                        </span>
                        <button
                          onClick={() => handleCopyClientLink(tenant.slug)}
                          className="p-1 text-slate-500 hover:text-slate-900 rounded border border-slate-200 bg-white"
                          title="Copiar link do cliente"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectTenantWorkspace(tenant.id)}
                      className="flex-1 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                    >
                      Acessar Workspace
                    </button>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleOpenEdit(tenant)} className="p-2 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 bg-white">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteConfirmId(tenant.id)} className="p-2 text-slate-600 hover:text-rose-600 rounded-lg border border-slate-200 bg-white">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VPS GLOBAL SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Configuração Central da VPS</h3>
                <p className="text-xs text-slate-500 mt-0.5">Defina aqui a URL da sua Evolution API que atenderá todos os clientes.</p>
              </div>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">URL da Evolution API (IP ou Domínio)</label>
                <input
                  type="url"
                  required
                  placeholder="Ex: http://149.56.238.226:8080 ou https://api.laemadesign.com.br"
                  value={config.evolutionApiUrl}
                  onChange={(e) => setConfig({ ...config, evolutionApiUrl: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
                <p className="text-[10px] text-slate-500 mt-1 italic">
                  💡 Geralmente usa-se a porta :8080. Se não tiver SSL configurado, use <strong>http://</strong> em vez de https.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Global API Token (Segurança)</label>
                <input
                  type="password"
                  required
                  placeholder="Seu Token Global da Evolution API"
                  value={config.globalApiToken}
                  onChange={(e) => setConfig({ ...config, globalApiToken: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-900 leading-relaxed">
                <strong>Atenção:</strong> Ao salvar esta configuração, todos os workspaces dos clientes passarão a utilizar automaticamente este endereço para gerar os QR Codes e sincronizar mensagens.
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-bold shadow-sm transition-colors"
                >
                  Salvar Configurações Globais
                </button>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold border border-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>{isTesting ? 'Testando...' : 'Testar Conexão'}</span>
                </button>
              </div>

              {testResult && (
                <div className={`p-4 rounded-xl text-xs font-medium border animate-in fade-in zoom-in-95 ${testResult.success ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
                  <div className="flex gap-2">
                    {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                    <span>{testResult.message}</span>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Modals (Add/Edit/Delete) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">{editingTenant ? 'Editar Empresa' : 'Cadastrar Nova Empresa'}</h3>
            <form onSubmit={handleSaveTenant} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Nome da Empresa *</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">WhatsApp Oficial *</label>
                  <input type="text" required value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Responsável</label>
                  <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Plano</label>
                  <select value={plan} onChange={(e) => setPlan(e.target.value as any)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                    <option value="Starter">Starter</option>
                    <option value="Pro">Pro</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                    <option value="Ativo">Ativo</option>
                    <option value="Teste">Teste</option>
                    <option value="Bloqueado">Bloqueado</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs text-slate-600 font-medium">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-sky-500 text-white rounded-xl text-xs font-bold">{editingTenant ? 'Salvar' : 'Criar Empresa'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="font-bold text-slate-900">Excluir Empresa?</h3>
            <p className="text-xs text-slate-500">Isso removerá todos os dados e acessos desta empresa permanentemente.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 text-xs font-medium">Cancelar</button>
              <button onClick={() => { onDeleteTenant(deleteConfirmId); setDeleteConfirmId(null); setToast('Empresa excluída!'); setTimeout(() => setToast(null), 3000); }} className="px-5 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold">Sim, Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
