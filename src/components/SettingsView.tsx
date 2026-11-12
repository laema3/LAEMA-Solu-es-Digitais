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
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import QRCode from 'qrcode';
import { Tenant } from '../types';

interface SettingsViewProps {
  activeTenant: Tenant | null;
  isMasterAdmin?: boolean;
}

interface OperatorUser {
  id: string;
  name: string;
  username: string;
  password: string;
  role: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ activeTenant, isMasterAdmin = false }) => {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'operators' | 'channels'>('whatsapp');

  // WhatsApp state
  const [connectedWhatsApp, setConnectedWhatsApp] = useState<boolean>(() => {
    return localStorage.getItem(`laema_wa_connected_${activeTenant?.id || 'default'}`) === 'true';
  });
  const [connectedNumber, setConnectedNumber] = useState<string>(() => {
    return localStorage.getItem(`laema_wa_number_${activeTenant?.id || 'default'}`) || activeTenant?.whatsappNumber || '+55 (11) 98877-6655';
  });
  const [showQrModal, setShowQrModal] = useState(false);
  const [modalMode, setModalMode] = useState<'qr' | 'code'>('qr');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [countdown, setCountdown] = useState(25);
  const [refreshKey, setRefreshKey] = useState(0);
  const [inputPhone, setInputPhone] = useState('');
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Global VPS config (Master defined)
  const [globalVpsConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('laema_global_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { evolutionApiUrl: '', globalApiToken: '' };
  });

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

  // Generate QR code (In a real app, this calls the global VPS URL)
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
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
                  <span>Conectar Celular</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Smartphone className="w-4 h-4 text-sky-600" />
              <span>Instruções de Conexão:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-sky-600">1.</span> Abra o WhatsApp no celular da empresa.
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-sky-600">2.</span> Vá em Menu ou Configurações &gt; Aparelhos Conectados.
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-sky-600">3.</span> Clique em Conectar Aparelho e aponte para o QR Code.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OPERATORS (EQUIPE) */}
      {activeTab === 'operators' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700 uppercase tracking-wider flex justify-between items-center">
              <span>Atendentes deste Workspace ({operators.length})</span>
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
                      <p className="text-xs text-slate-500 font-mono">Login: {op.username} • Cargo: {op.role}</p>
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
                        Editar
                      </button>
                      <button
                        onClick={() => setOpDeleteConfirmId(op.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg border border-slate-200 bg-white"
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

      {/* QR Code Modal (Simplified for Client - No technical VPS fields) */}
      {showQrModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 text-center border border-slate-200">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">Parear WhatsApp</h3>
              <p className="text-xs text-slate-500">Aponte a câmera do seu WhatsApp para o código abaixo.</p>
            </div>

            {/* Tab navigation for QR or Pairing Code */}
            <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-medium">
              <button
                onClick={() => setModalMode('qr')}
                className={`flex-1 py-2 rounded-lg transition-all ${modalMode === 'qr' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                Via QR Code
              </button>
              <button
                onClick={() => setModalMode('code')}
                className={`flex-1 py-2 rounded-lg transition-all ${modalMode === 'code' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                Via Código (8 dígitos)
              </button>
            </div>

            {modalMode === 'qr' ? (
              <div className="space-y-5 animate-in fade-in">
                <div className="p-4 bg-white rounded-3xl inline-block border-2 border-slate-100 shadow-inner">
                  {qrCodeDataUrl ? (
                    <img src={qrCodeDataUrl} alt="WhatsApp QR Code" className="w-64 h-64 mx-auto rounded-xl" />
                  ) : (
                    <div className="w-64 h-64 flex items-center justify-center text-xs text-slate-400">Gerando QR Code seguro...</div>
                  )}
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-500" />
                  <span>Atualizando em {countdown}s</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-4 animate-in fade-in">
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold text-slate-700">Número do WhatsApp (com DDD)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Ex: 5511999998888" 
                      value={inputPhone}
                      onChange={(e) => setInputPhone(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20" 
                    />
                    <button 
                      onClick={() => {
                        setIsGeneratingCode(true);
                        setTimeout(() => {
                          setPairingCode('ABCD-1234');
                          setIsGeneratingCode(false);
                        }, 1000);
                      }}
                      disabled={isGeneratingCode || !inputPhone}
                      className="px-4 py-2 bg-sky-500 text-white rounded-xl text-xs font-bold disabled:opacity-50"
                    >
                      {isGeneratingCode ? '...' : 'Gerar'}
                    </button>
                  </div>
                </div>

                {pairingCode && (
                  <div className="p-6 bg-sky-50 border border-sky-100 rounded-2xl space-y-3 animate-in zoom-in-95">
                    <p className="text-[10px] font-bold text-sky-700 uppercase tracking-widest">Código de Pareamento</p>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-3xl font-mono font-black text-sky-900 tracking-tighter bg-white px-4 py-2 rounded-xl border border-sky-200 shadow-sm">{pairingCode}</span>
                      <button onClick={() => copyToClipboard(pairingCode)} className="p-2.5 bg-white rounded-xl border border-sky-200 text-sky-600 hover:bg-sky-100">
                        {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-sky-800 leading-tight">
                      No WhatsApp, toque em "Aparelhos Conectados" &gt; "Conectar com número de telefone" e digite este código.
                    </p>
                  </div>
                )}
              </div>
            )}

            {!globalVpsConfig.evolutionApiUrl && (
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3 text-left">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="space-y-1">
                  <p className="text-[11px] text-amber-900">
                    <strong>Aviso técnico:</strong> A VPS central ainda não foi configurada no Painel Master. A conexão real só funcionará após a configuração do servidor.
                  </p>
                  {isMasterAdmin && (
                    <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">
                      💡 Dica Master: Configure a VPS na aba de Ajustes do Painel Master.
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleConfirmConnection()}
                className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Validar Conexão com Meu Número</span>
              </button>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="w-full py-2.5 text-xs text-slate-500 font-semibold hover:text-slate-800 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Operator Modal */}
      {isOperatorModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900">
              {editingOperator ? 'Editar Atendente' : 'Novo Atendente'}
            </h3>
            <form onSubmit={handleSaveOperator} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Mendes"
                  value={opName}
                  onChange={(e) => setOpName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Usuário de Login *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: carlos"
                  value={opUsername}
                  onChange={(e) => setOpUsername(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Senha de Acesso *</label>
                <input
                  type="text"
                  required
                  value={opPassword}
                  onChange={(e) => setOpPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Cargo / Perfil</label>
                <select
                  value={opRole}
                  onChange={(e) => setOpRole(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="Atendente">Atendente</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsOperatorModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Operator Confirmation */}
      {opDeleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl text-center space-y-5 border border-slate-200">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-rose-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Remover Atendente?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Este operador perderá o acesso imediato a este workspace. Deseja continuar?
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleDeleteOperator(opDeleteConfirmId)}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                Sim, Remover Atendente
              </button>
              <button
                onClick={() => setOpDeleteConfirmId(null)}
                className="w-full py-2.5 text-xs text-slate-500 font-semibold hover:text-slate-800 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
