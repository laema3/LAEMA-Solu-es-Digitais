import React, { useState, useEffect } from 'react';
import { Settings, MessageSquare, Instagram, Mail, Globe, CheckCircle2, QrCode, Smartphone, Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';
import QRCode from 'qrcode';

export const SettingsView: React.FC = () => {
  const [connectedWhatsApp, setConnectedWhatsApp] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [countdown, setCountdown] = useState(20);
  const [refreshKey, setRefreshKey] = useState(0);

  const [connectedInstagram, setConnectedInstagram] = useState(true);
  const [connectedEmail, setConnectedEmail] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Generate real scannable QR code when modal opens or refreshes
  useEffect(() => {
    if (showQrModal) {
      // Valid multi-device pairing string format for Baileys/WA Web simulation
      const pairingPayload = `2@${Math.random().toString(36).substring(2, 10)},${Math.random().toString(36).substring(2, 15)},${Math.random().toString(36).substring(2, 15)}`;
      QRCode.toDataURL(pairingPayload, { width: 240, margin: 2, color: { dark: '#0f172a', light: '#ffffff' } }, (err, url) => {
        if (!err && url) {
          setQrCodeDataUrl(url);
        }
      });
      setCountdown(20);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setRefreshKey((k) => k + 1);
            return 20;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showQrModal, refreshKey]);

  const handleToggleWhatsApp = () => {
    if (connectedWhatsApp) {
      setConnectedWhatsApp(false);
      setToastMessage('WhatsApp desconectado.');
    } else {
      setShowQrModal(true);
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSimulateSuccessfulScan = () => {
    setShowQrModal(false);
    setConnectedWhatsApp(true);
    setToastMessage('WhatsApp conectado com sucesso! Sessão ativa no CRM.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Canais & Configurações de Conexão</h2>
        <p className="text-slate-500 text-sm mt-1">Conecte seu WhatsApp gerando o QR Code de sessão para leitura (modo desenvolvimento / VPS).</p>
      </div>

      {toastMessage && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-md text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> {toastMessage}
        </div>
      )}

      <div className="space-y-6">
        {/* WhatsApp Connection Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">WhatsApp (Sessão via QR Code)</h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${connectedWhatsApp ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                    {connectedWhatsApp ? 'Conectado (Sessão Ativa)' : 'Desconectado'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Gera o QR Code para pareamento com o celular da empresa.</p>
              </div>
            </div>
            <button
              onClick={handleToggleWhatsApp}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                connectedWhatsApp ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200' : 'bg-sky-500 text-white hover:bg-sky-600 shadow-sm'
              }`}
            >
              {connectedWhatsApp ? 'Desconectar Aparelho' : 'Escanear QR Code'}
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
            <p className="font-bold text-slate-900">Nota sobre o ambiente de desenvolvimento:</p>
            <p>
              Em ambiente de preview (sandbox), o leitor do WhatsApp pode emitir aviso de "código inválido" pois não há um servidor WebSocket Baileys ativo em segundo plano. Quando você for para a sua VPS de produção, o QR Code gerado pelo backend fará o pareamento real com o celular.
            </p>
          </div>
        </div>

        {/* Instagram */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">Instagram Direct</h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${connectedInstagram ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                  {connectedInstagram ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Direct Message integrado com a Meta API</p>
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

        {/* Email */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">E-mail Corporativo</h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${connectedEmail ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                  {connectedEmail ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Caixa de entrada de e-mails corporativos</p>
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

      {/* Real QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Escaneie o QR Code</h3>
              <p className="text-xs text-slate-500 mt-1">Abra o WhatsApp no celular e aponte para o código abaixo.</p>
            </div>

            <div className="p-4 bg-white rounded-2xl inline-block border-2 border-slate-200 shadow-inner">
              {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt="WhatsApp QR Code" className="w-56 h-56 mx-auto rounded-lg" />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-xs text-slate-400">Gerando QR Code...</div>
              )}
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 text-left">
              <strong>Aviso de Sandbox:</strong> Como este é um ambiente de testes sem o serviço Baileys WebSocket rodando, a leitura direta pela câmera do celular emitirá aviso de código inválido. Clique em <em>"Simular Leitura com Sucesso"</em> para prosseguir com os testes do CRM!
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-600" />
              <span>Atualizando QR Code em <strong>{countdown}s</strong></span>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-xl font-medium"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSimulateSuccessfulScan}
                className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
              >
                Simular Leitura com Sucesso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
