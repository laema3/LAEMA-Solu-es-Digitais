import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Instagram, 
  Mail, 
  CheckCircle2, 
  QrCode, 
  Smartphone, 
  RefreshCw, 
  AlertCircle, 
  Key, 
  Server, 
  ExternalLink, 
  Check, 
  Copy, 
  Info,
  Users,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  User,
  AlertTriangle
} from 'lucide-react';
import QRCode from 'qrcode';
import { Tenant } from '../types';

interface SettingsViewProps {
  activeTenant: Tenant | null;
}

interface OperatorUser {
  id: string;
  name: string;
  username: string;
  password: string;
  role: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ activeTenant }) => {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'operators' | 'channels'>('whatsapp');

  // WhatsApp state
  const [connectedWhatsApp, setConnectedWhatsApp] = useState<boolean>(() => {
    return localStorage.getItem(`laema_wa_connected_${activeTenant?.id || 'default'}`) === 'true';
  });
  const [connectedNumber, setConnectedNumber] = useState<string>(() => {
    return localStorage.getItem(`laema_wa_number_${activeTenant?.id || 'default'}`) || activeTenant?.whatsappNumber || '+55 (11) 98877-6655';
  });
  const [showQrModal, setShowQrModal] = useState(false);
  const [modalMode, setModalMode] = useState<'qr' | 'code' | 'vps'>('qr');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [countdown, setCountdown] = useState(25);
  const [refreshKey, setRefreshKey] = useState(0);
  const [inputPhone, setInputPhone] = useState('');
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Operators state per tenant
  const tenantStorageKey = `laema_tenant_users_${activeTenant?.id || 'default'}`;
  const [operators, setOperators] = useState<OperatorUser[]>(() => {
    try {
      const saved = localStorage.getItem(tenantStorageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading tenant operators', e);
    }
    return [
      { id: 'op-1', name: 'Vilma', username: 'vilma', password: '@Amb10340', role: 'Atendente' },
      { id: 'op-2', name: 'Mariana', username: 'mariana', password: '@Amb10340', role: 'Atendente' },
    ];
  });

  const [isOperatorModalOpen, setIsOperatorModalOpen] = useState(false);
  const [editingOperator, setEditingOperator] = useState<OperatorUser | null>(null);
  const [opName, setOpName] = useState('');
  const [opUsername, setOpUsername] = useState('');
  const [opPassword, setOpPassword] = useState('@Amb10340');
  const [opRole, setOpRole] = useState('Atendente');
  const [opDeleteConfirmId, setOpDeleteConfirmId] = useState<string | null>(null);

  const [connectedInstagram, setConnectedInstagram] = useState(true);
  const [connectedEmail, setConnectedEmail] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Generate QR code
  useEffect(() => {
    if (showQrModal && modalMode === 'qr') {
      const pairingPayload = `2@${Math.random().toString(36).substring(2, 10)},${Math.random().toString(36).substring(2, 15)},${Math.random().toString(36).substring(2, 15)}`;
      QRCode.toDataURL(
        pairingPayload, 
        { width: 260, margin: 2, color: { dark: '#0f172a', light: '#ffffff' } }, 
        (err, url) => {
          if (!err && url) {
            setQrCodeDataUrl(url);
          }
        }
      );
      setCountdown(25);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setRefreshKey((k) => k + 1);
            return 25;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showQrModal, refreshKey, modalMode]);

  const handleToggleWhatsApp = () => {
    if (connectedWhatsApp) {
      setConnectedWhatsApp(false);
      localStorage.setItem(`laema_wa_connected_${activeTenant?.id || 'default'}`, 'false');
      setToastMessage('WhatsApp desconectado com sucesso.');
    } else {
      setShowQrModal(true);
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleConfirmConnection = (numberToSave?: string) => {
    const finalNumber = numberToSave || inputPhone || connectedNumber;
    setConnectedWhatsApp(true);
    setConnectedNumber(finalNumber);
    localStorage.setItem(`laema_wa_connected_${activeTenant?.id || 'default'}`, 'true');
    localStorage.setItem(`laema_wa_number_${activeTenant?.id || 'default'}`, finalNumber);
    setShowQrModal(false);
    setToastMessage(`WhatsApp ${finalNumber} conectado com sucesso ao workspace!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveOperator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opName || !opUsername || !opPassword) return;

    let updatedOps: OperatorUser[];
    if (editingOperator) {
      updatedOps = operators.map(o => o.id === editingOperator.id ? { ...o, name: opName, username: opUsername.toLowerCase(), password: opPassword, role: opRole } : o);
      setToastMessage('Atendente atualizado com sucesso!');
    } else {
      const newOp: OperatorUser = {
        id: `op-${Date.now()}`,
        name: opName,
        username: opUsername.toLowerCase(),
        password: opPassword,
        role: opRole,
      };
      updatedOps = [...operators, newOp];
      setToastMessage('Novo atendente cadastrado com sucesso!');
    }

    setOperators(updatedOps);
    try {
      localStorage.setItem(tenantStorageKey, JSON.stringify(updatedOps));
    } catch (e) {
      console.warn('Error saving operators', e);
    }
    setIsOperatorModalOpen(false);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteOperator = (id: string) => {
    const updatedOps = operators.filter(o => o.id !== id);
    setOperators(updatedOps);
    try {
      localStorage.setItem(tenantStorageKey, JSON.stringify(updatedOps));
    } catch (e) {
      console.warn('Error saving operators', e);
    }
    setOpDeleteConfirmId(null);
    setToastMessage('Atendente removido com sucesso.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto select-none">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Configurações do Workspace — {activeTenant?.name || 'Empresa'}
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Gerencie a conexão do WhatsApp e a equipe de atendentes exclusivos desta empresa.
        </p>
      </div>

      {toastMessage && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-md text-sm font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" /> {toastMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'whatsapp' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Conexão WhatsApp</span>
        </button>
        <button
          onClick={() => setActiveTab('operators')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'operators' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
        >
          <Users className="w-4 h-4" />
          <span>Equipe & Atendentes ({operators.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('channels')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'channels' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
        >
          <Instagram className="w-4 h-4" />
          <span>Outros Canais</span>
        </button>
      </div>

      {/* TAB 1: WHATSAPP */}
      {activeTab === 'whatsapp' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${connectedWhatsApp ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-700'}`}>
                <MessageSquare className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">WhatsApp Atendimento</h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${connectedWhatsApp ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                    {connectedWhatsApp ? 'Sessão Conectada' : 'Desconectado'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {connectedWhatsApp ? `Aparelho pareado: ${connectedNumber}` : 'Nenhum celular pareado no momento. Conecte seu número para receber mensagens.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {connectedWhatsApp ? (
                <button
                  onClick={handleToggleWhatsApp}
                  className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors"
                >
                  Desconectar Número
                </button>
              ) : (
                <button
                  onClick={() => {
                    setModalMode('qr');
                    setShowQrModal(true);
                  }}
                  className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Conectar Celular (QR Code)</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Smartphone className="w-4 h-4 text-sky-600" />
              <span>Como fazer a leitura do QR Code no seu celular:</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Abra o WhatsApp no celular da empresa, vá em <strong>Configurações</strong> &gt; <strong>Aparelhos conectados</strong> &gt; <strong>Conectar um aparelho</strong> e aponte para o QR Code.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: OPERATORS (EQUIPE) */}
      {activeTab === 'operators' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700 uppercase tracking-wider flex justify-between items-center">
              <span>Atendentes & Operadores deste Workspace ({operators.length})</span>
              <button
                onClick={() => {
                  setEditingOperator(null);
                  setOpName('');
                  setOpUsername('');
                  setOpPassword('@Amb10340');
                  setOpRole('Atendente');
                  setIsOperatorModalOpen(true);
                }}
                className="px-4 py-2 bg-sky-500 text-white rounded-xl text-xs font-semibold hover:bg-sky-600 shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Atendente</span>
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {operators.map((op) => (
                <div key={op.id} className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold border border-sky-100">
                      {op.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{op.name}</h4>
                      <p className="text-xs text-slate-500 font-mono">Usuário: {op.username} • Cargo: {op.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-xs font-mono bg-slate-100 px-3 py-1 rounded-lg text-slate-700">
                      Senha: <span className="font-bold text-slate-900">{op.password}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingOperator(op);
                          setOpName(op.name);
                          setOpUsername(op.username);
                          setOpPassword(op.password);
                          setOpRole(op.role);
                          setIsOperatorModalOpen(true);
                        }}
                        className="px-3 py-1.5 text-slate-700 hover:text-slate-900 rounded-lg border border-slate-200 bg-white text-xs font-medium"
                      >
                        Editar / Senha
                      </button>
                      <button
                        onClick={() => setOpDeleteConfirmId(op.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg border border-slate-200 bg-white"
                        title="Excluir Atendente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OTHER CHANNELS */}
      {activeTab === 'channels' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center border border-pink-100">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">Instagram Direct</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${connectedInstagram ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                    {connectedInstagram ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Mensagens diretas integradas ao CRM.</p>
              </div>
            </div>
            <button
              onClick={() => setConnectedInstagram(!connectedInstagram)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                connectedInstagram ? 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200' : 'bg-sky-500 text-white hover:bg-sky-600 border-transparent shadow-sm'
              }`}
            >
              {connectedInstagram ? 'Desconectar' : 'Conectar'}
            </button>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">E-mail Corporativo</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${connectedEmail ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                    {connectedEmail ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Sincronização de caixas de entrada.</p>
              </div>
            </div>
            <button
              onClick={() => setConnectedEmail(!connectedEmail)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                connectedEmail ? 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200' : 'bg-sky-500 text-white hover:bg-sky-600 border-transparent shadow-sm'
              }`}
            >
              {connectedEmail ? 'Desconectar' : 'Conectar'}
            </button>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-center">
            <h3 className="text-base font-bold text-slate-900">Escaneie o QR Code</h3>
            <div className="p-4 bg-white rounded-2xl inline-block border-2 border-slate-200 shadow-inner">
              {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt="WhatsApp QR Code" className="w-56 h-56 mx-auto rounded-lg" />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-xs text-slate-400">Gerando QR Code...</div>
              )}
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-xl font-medium border border-slate-200"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => handleConfirmConnection()}
                className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl shadow-sm"
              >
                Validar Conexão com Meu Número
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Operator Modal */}
      {isOperatorModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <h3 className="text-lg font-bold text-slate-900">
              {editingOperator ? 'Editar Atendente' : 'Adicionar Novo Atendente'}
            </h3>
            <form onSubmit={handleSaveOperator} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Atendente *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Mendes"
                  value={opName}
                  onChange={(e) => setOpName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Usuário de Login *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: carlos"
                  value={opUsername}
                  onChange={(e) => setOpUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Senha de Acesso *</label>
                <input
                  type="text"
                  required
                  placeholder="@Amb10340"
                  value={opPassword}
                  onChange={(e) => setOpPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Perfil / Cargo</label>
                <select
                  value={opRole}
                  onChange={(e) => setOpRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                >
                  <option value="Atendente">Atendente</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOperatorModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl shadow-sm"
                >
                  Salvar Atendente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Operator Confirmation Modal */}
      {opDeleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Confirmar Exclusão de Atendente</h3>
            <p className="text-xs text-slate-500">Tem certeza que deseja remover este atendente do workspace?</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setOpDeleteConfirmId(null)}
                className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteOperator(opDeleteConfirmId)}
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
