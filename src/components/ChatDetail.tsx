import React, { useState } from 'react';
import { MessageSquare, Instagram, Mail, Globe, Send, Sparkles, Paperclip, CheckCircle, Clock, AlertTriangle, User, Tag, FileText, Star } from 'lucide-react';
import { Conversation, Message, TicketStatus } from '../types';

interface ChatDetailProps {
  conversation: Conversation;
  onSendMessage: (text: string, attachments?: string[]) => void;
  onUpdateStatus: (status: TicketStatus) => void;
  onAddNote: (note: string) => void;
  onResolveCSAT?: (rating: number) => void;
}

export const ChatDetail: React.FC<ChatDetailProps> = ({
  conversation,
  onSendMessage,
  onUpdateStatus,
  onAddNote,
  onResolveCSAT,
}) => {
  const [inputText, setInputText] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<Array<{ title: string; text: string }>>([]);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiSummary, setAiSummary] = useState<{ summary: string; issue: string; statusRecommendation: string } | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const generateSmartReplies = async () => {
    try {
      setLoadingAi(true);
      const lastMsg = conversation.messages[conversation.messages.length - 1]?.text || '';
      const res = await fetch('/api/gemini/suggest-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: conversation.customerName,
          channel: conversation.channel,
          lastMessage: lastMsg,
          conversationHistory: conversation.messages.slice(-4),
          companyContext: conversation.company || 'Atendimento ao Cliente',
        }),
      });
      const data = await res.json();
      if (data.suggestions) {
        setAiSuggestions(data.suggestions);
      }
    } catch (err) {
      console.error('Failed to generate smart replies', err);
    } finally {
      setLoadingAi(false);
    }
  };

  const generateSummary = async () => {
    try {
      setLoadingSummary(true);
      const res = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationMessages: conversation.messages }),
      });
      const data = await res.json();
      if (data.summary) {
        setAiSummary(data);
      }
    } catch (err) {
      console.error('Failed to summarize', err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(newNoteText);
    setNewNoteText('');
    setShowNoteInput(false);
  };

  return (
    <div className="flex-1 flex bg-white overflow-hidden">
      {/* Main chat window */}
      <div className="flex-1 flex flex-col h-full bg-slate-50/30">
        {/* Chat header */}
        <div className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={conversation.customerAvatar} alt={conversation.customerName} className="w-10 h-10 rounded-full object-cover" />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] ${
                conversation.channel === 'whatsapp' ? 'bg-emerald-600' :
                conversation.channel === 'instagram' ? 'bg-purple-600' :
                conversation.channel === 'website' ? 'bg-indigo-600' : 'bg-blue-600'
              }`}>
                {conversation.channel === 'whatsapp' && <MessageSquare className="w-2.5 h-2.5" />}
                {conversation.channel === 'instagram' && <Instagram className="w-2.5 h-2.5" />}
                {conversation.channel === 'website' && <Globe className="w-2.5 h-2.5" />}
                {conversation.channel === 'email' && <Mail className="w-2.5 h-2.5" />}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">{conversation.customerName}</h3>
                <span className="text-xs text-slate-400">({conversation.customerPhone})</span>
              </div>
              <p className="text-xs text-slate-500">{conversation.company || conversation.customerEmail}</p>
            </div>
          </div>

          {/* Status actions */}
          <div className="flex items-center gap-2">
            <select
              value={conversation.status}
              onChange={(e) => onUpdateStatus(e.target.value as TicketStatus)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border focus:outline-none ${
                conversation.status === 'open' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                conversation.status === 'pending' ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
            >
              <option value="open">Status: Aberto</option>
              <option value="pending">Status: Pendente</option>
              <option value="resolved">Status: Resolvido</option>
            </select>

            <button
              onClick={generateSummary}
              disabled={loadingSummary}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium rounded-lg text-xs transition-colors border border-emerald-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{loadingSummary ? 'Resumindo...' : 'Resumir com IA'}</span>
            </button>
          </div>
        </div>

        {/* AI Summary Banner if generated */}
        {aiSummary && (
          <div className="bg-emerald-900 text-white p-4 mx-6 mt-4 rounded-xl shadow-md text-xs space-y-2 relative">
            <button onClick={() => setAiSummary(null)} className="absolute top-3 right-3 text-emerald-300 hover:text-white font-bold">×</button>
            <div className="flex items-center gap-1.5 font-semibold text-emerald-300">
              <Sparkles className="w-4 h-4" /> Resumo Inteligente Gemini
            </div>
            <p><strong className="text-emerald-200">Problema:</strong> {aiSummary.issue}</p>
            <p><strong className="text-emerald-200">Resumo:</strong> {aiSummary.summary}</p>
            <p><strong className="text-emerald-200">Recomendação:</strong> {aiSummary.statusRecommendation}</p>
          </div>
        )}

        {/* Messages scroll area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {conversation.messages.map((msg) => {
            const isCustomer = msg.sender === 'customer';
            return (
              <div key={msg.id} className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}>
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-xs font-medium text-slate-700">{msg.senderName}</span>
                  <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                </div>
                <div className={`max-w-xl rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  isCustomer
                    ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                    : 'bg-slate-900 text-white rounded-tr-sm'
                }`}>
                  {msg.subject && (
                    <div className="font-bold text-xs pb-2 mb-2 border-b border-white/10 text-emerald-400">
                      Assunto: {msg.subject}
                    </div>
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Smart Replies Suggestions box */}
        {aiSuggestions.length > 0 && (
          <div className="px-6 py-2 bg-emerald-50/80 border-t border-emerald-100 flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 shrink-0">
              <Sparkles className="w-3.5 h-3.5" /> Sugestões IA:
            </span>
            {aiSuggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(sug.text);
                  setAiSuggestions([]);
                }}
                className="px-3 py-1.5 bg-white hover:bg-emerald-600 hover:text-white text-slate-800 text-xs rounded-lg border border-emerald-200 shadow-sm transition-colors whitespace-nowrap shrink-0 text-left font-medium"
                title={sug.text}
              >
                <span className="font-bold text-emerald-700 hover:text-white mr-1">[{sug.title}]:</span>
                {sug.text.substring(0, 40)}...
              </button>
            ))}
          </div>
        )}

        {/* Reply footer box */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form onSubmit={handleSend} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={generateSmartReplies}
                  disabled={loadingAi}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-medium shadow-sm transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{loadingAi ? 'Gerando...' : 'Sugerir Resposta com IA'}</span>
                </button>
                <span className="text-xs text-slate-400">Canal: <strong className="uppercase text-slate-700">{conversation.channel}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`Digite sua resposta via ${conversation.channel}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white rounded-xl text-sm font-medium shadow-sm transition-colors flex items-center gap-2 shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>Enviar</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right CRM Customer Details Sidebar */}
      <div className="w-80 bg-white border-l border-slate-200 p-6 overflow-y-auto space-y-6 shrink-0 hidden xl:block">
        <div className="text-center space-y-3 pb-6 border-b border-slate-100">
          <img src={conversation.customerAvatar} alt={conversation.customerName} className="w-20 h-20 rounded-full object-cover mx-auto shadow-md" />
          <div>
            <h4 className="font-bold text-slate-900 text-base">{conversation.customerName}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{conversation.company || 'Cliente Cadastrado'}</p>
          </div>
          <div className="flex justify-center gap-2 pt-1">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              conversation.sentiment === 'Frustrado/Urgente' ? 'bg-rose-100 text-rose-700' :
              conversation.sentiment === 'Positivo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
            }`}>
              Sentimento: {conversation.sentiment}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-amber-100 text-amber-800">
              Urgência {conversation.urgencyScore}/5
            </span>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-3 text-xs">
          <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Dados de Contato</p>
          <div className="space-y-2 text-slate-600">
            <p><strong className="text-slate-900">E-mail:</strong> {conversation.customerEmail}</p>
            <p><strong className="text-slate-900">Telefone:</strong> {conversation.customerPhone}</p>
            <p><strong className="text-slate-900">Atendente:</strong> {conversation.assignedAgent}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Tags e Categorias</p>
          <div className="flex flex-wrap gap-1.5">
            {conversation.tags?.map((tag, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-medium">
                <Tag className="w-3 h-3 text-slate-400" /> {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Internal notes */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Notas Internas</p>
            <button onClick={() => setShowNoteInput(!showNoteInput)} className="text-xs text-emerald-600 font-medium hover:underline">
              + Adicionar
            </button>
          </div>

          {showNoteInput && (
            <form onSubmit={handleAddNoteSubmit} className="space-y-2">
              <textarea
                placeholder="Escreva uma nota interna para a equipe..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                rows={2}
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowNoteInput(false)} className="px-2.5 py-1 text-xs text-slate-500">Cancelar</button>
                <button type="submit" className="px-3 py-1 text-xs bg-sky-500 hover:bg-sky-600 text-white rounded-md font-medium transition-colors">Salvar Nota</button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {conversation.notes && conversation.notes.length > 0 ? (
              conversation.notes.map((note, idx) => (
                <div key={idx} className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-xs text-slate-700 leading-relaxed">
                  {note}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">Nenhuma nota interna registrada.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
