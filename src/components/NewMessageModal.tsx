import React, { useState } from 'react';
import { X, MessageSquare, Instagram, Mail, Sparkles } from 'lucide-react';
import { ChannelType, Conversation, SentimentType } from '../types';

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddConversation: (newConv: Conversation) => void;
  defaultChannel?: ChannelType;
}

export const NewMessageModal: React.FC<NewMessageModalProps> = ({
  isOpen,
  onClose,
  onAddConversation,
  defaultChannel = 'whatsapp',
}) => {
  const [channel, setChannel] = useState<ChannelType>(defaultChannel);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [company, setCompany] = useState('');
  const [messageText, setMessageText] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !messageText) return;

    setLoading(true);
    let sentiment: SentimentType = 'Neutro';
    let urgencyScore = 3;

    // Call server API for AI sentiment analysis
    try {
      const res = await fetch('/api/gemini/sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });
      const data = await res.json();
      if (data.sentiment) {
        sentiment = data.sentiment;
        urgencyScore = data.urgencyScore || 3;
      }
    } catch (err) {
      console.error('Sentiment analysis error, falling back', err);
    } finally {
      setLoading(false);
    }

    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      customerName,
      customerAvatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?w=150`,
      customerEmail: customerEmail || `${customerName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      customerPhone: customerPhone || '+55 11 99999-0000',
      channel,
      status: 'open',
      sentiment,
      urgencyScore,
      unreadCount: 1,
      lastMessageTime: 'Agora mesmo',
      assignedAgent: 'Carlos Mendes',
      tags: ['Novo Lead', channel === 'whatsapp' ? 'WhatsApp' : channel === 'instagram' ? 'Instagram' : 'E-mail'],
      company: company || 'Empresa Cliente',
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: 'customer',
          senderName: customerName,
          text: messageText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          channel,
          subject: channel === 'email' ? (emailSubject || 'Nova Solicitação de Suporte') : undefined,
        }
      ],
      notes: [`Nova conversa simulada recebida via ${channel}. Sentimento analisado por IA: ${sentiment}.`]
    };

    onAddConversation(newConv);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Simular Nova Mensagem / Chamado</h3>
              <p className="text-xs text-slate-500">Teste o fluxo omnichannel e a análise de sentimento por IA Gemini.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Channel selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Canal de Atendimento</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setChannel('whatsapp')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  channel === 'whatsapp' ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" /> WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setChannel('instagram')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  channel === 'instagram' ? 'bg-purple-50 border-purple-600 text-purple-800 shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Instagram className="w-4 h-4 text-purple-600" /> Instagram
              </button>
              <button
                type="button"
                onClick={() => setChannel('email')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  channel === 'email' ? 'bg-blue-50 border-blue-600 text-blue-800 shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Mail className="w-4 h-4 text-blue-600" /> E-mail
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Cliente *</label>
              <input
                type="text"
                required
                placeholder="Ex: Juliana Castro"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Empresa</label>
              <input
                type="text"
                placeholder="Ex: Studio Design"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {channel === 'email' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assunto do E-mail</label>
              <input
                type="text"
                placeholder="Ex: Dúvida sobre faturamento"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mensagem do Cliente *</label>
            <textarea
              required
              rows={3}
              placeholder="Ex: Olá, gostaria de saber se o plano Pro inclui suporte 24h via WhatsApp?"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              {loading ? 'Analisando com IA...' : 'Simular Recebimento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
