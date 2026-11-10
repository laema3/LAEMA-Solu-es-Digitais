import React, { useState } from 'react';
import { ShieldCheck, Plus, Edit2, Trash2, ExternalLink, Globe, Smartphone, Building, Users, AlertTriangle, CheckCircle2, Sparkles, Copy } from 'lucide-react';
import { Tenant } from '../types';

interface MasterAdminViewProps {
  tenants: Tenant[];
  onAddTenant: (tenant: Tenant) => void;
  onUpdateTenant: (tenant: Tenant) => void;
  onDeleteTenant: (id: string) => void;
  onSelectTenantWorkspace: (tenantId: string) => void;
}

export const MasterAdminView: React.FC<MasterAdminViewProps> = ({
  tenants,
  onAddTenant,
  onUpdateTenant,
  onDeleteTenant,
  onSelectTenantWorkspace,
}) => {
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
    const link = `https://laemasolucoes.com.br/app/${slug}`;
    navigator.clipboard.writeText(link);
    setToast(`Link de acesso copiado: ${link}`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Master banner */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Laema Soluções Digitais — Painel Master SaaS</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            Gerenciamento Multi-Tenant de Clientes
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
            Cada cliente possui seu próprio link de acesso exclusivo e workspace independente na sua VPS. Você controla todas as empresas por aqui.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Nova Empresa</span>
        </button>
      </div>

      {toast && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-md text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> {toast}
        </div>
      )}

      {/* Tenants Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">Empresas Clientes Cadastradas ({tenants.length})</h3>

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
                    <span className="text-slate-900 font-mono text-[11px] truncate">laemasolucoes.com.br/app/{tenant.slug}</span>
                    <button
                      onClick={() => handleCopyClientLink(tenant.slug)}
                      className="p-1 text-slate-500 hover:text-slate-900 rounded border border-slate-200 bg-white"
                      title="Copiar link de acesso do cliente"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectTenantWorkspace(tenant.id)}
                  className="flex-1 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold transition-colors text-center shadow-sm"
                >
                  Acessar Workspace
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(tenant)}
                    className="p-2 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 bg-white"
                    title="Editar Empresa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(tenant.id)}
                    className="p-2 text-slate-600 hover:text-rose-600 rounded-lg border border-slate-200 bg-white"
                    title="Excluir Empresa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Tenant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">
              {editingTenant ? 'Editar Empresa Cliente' : 'Cadastrar Nova Empresa Cliente'}
            </h3>
            <form onSubmit={handleSaveTenant} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nome da Empresa / Cliente *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ambiental Controle de Pragas"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Segmento</label>
                  <input
                    type="text"
                    placeholder="Ex: Controle de Pragas"
                    value={segment}
                    onChange={(e) => setSegment(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Responsável</label>
                  <input
                    type="text"
                    placeholder="Ex: Carlos Mendes"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp de Conexão *</label>
                  <input
                    type="text"
                    required
                    placeholder="+55 11 99999-9999"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Domínio / Link Personalizado</label>
                  <input
                    type="text"
                    placeholder="ambientalcontroledepragas.com.br"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Plano</label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Starter">Starter</option>
                    <option value="Pro">Pro</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status da Conta</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Teste">Teste</option>
                    <option value="Bloqueado">Bloqueado</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
                >
                  {editingTenant ? 'Salvar Alterações' : 'Criar Empresa no SaaS'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Confirmar Exclusão</h3>
            <p className="text-xs text-slate-500">Tem certeza que deseja remover esta empresa cliente da Laema Soluções Digitais?</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-xl font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteTenant(deleteConfirmId);
                  setDeleteConfirmId(null);
                  setToast('Empresa cliente excluída com sucesso!');
                  setTimeout(() => setToast(null), 3000);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow-sm"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
