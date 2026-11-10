import React, { useState } from 'react';
import { Sparkles, Bot, Send, CheckCircle2, MessageSquare, ShieldCheck } from 'lucide-react';
import { KnowledgeItem } from '../types';

interface ChatbotConfigViewProps {
  knowledgeBase: KnowledgeItem[];
}

export const ChatbotConfigView: React.FC<ChatbotConfigViewProps> = ({ knowledgeBase }) => {
  const [botEnabled, setBotEnabled] = useState(true);
  const [testMessage, setTestMessage] = useState('');
  const [testChatLog, setTestChatLog] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { sender: 'bot', text: 'Olá! Sou o assistente virtual da Ambiental Controle de Pragas. Como posso ajudar com dedetização ou agendamento de visita hoje?' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleTestChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testMessage.trim()) return;

    const userMsg = testMessage;
    setTestChatLog((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setTestMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          conversationHistory: testChatLog,
          knowledgeBase,
        }),
      });
      const data = await res.json();
      setTestChatLog((prev) => [...prev, { sender: 'bot', text: data.reply || 'Entendido! Nossa equipe entrará em contato.' }]);
    } catch (err) {
      console.error('Chatbot test error', err);
      setTestChatLog((prev) => [...prev, { sender: 'bot', text: 'Desculpe, tive um problema temporário. Um atendente humano falará com você em breve.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Chatbot de Atendimento Automático (IA Auto-Pilot)</h2>
        <p className="text-slate-500 text-sm mt-1">Configure o assistente virtual Gemini para esclarecer dúvidas e agendar visitas quando sua equipe estiver offline.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Status do Bot (Fora do Horário)</h3>
              <p className="text-xs text-slate-500">Responde automaticamente no WhatsApp, Instagram e Site.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={botEnabled}
                onChange={() => setBotEnabled(!botEnabled)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 text-xs">
            <p className="font-bold text-slate-900 uppercase tracking-wider">Diretrizes da IA</p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Responder dúvidas sobre dedetização, cupins e ratos
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Coletar endereço e telefone para agendamento
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Transmitir chat para atendente humano quando solicitado
              </li>
            </ul>
          </div>
        </div>

        {/* Interactive Sandbox Simulator */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Simulador do Chatbot Gemini</h4>
                <p className="text-[11px] text-slate-500">Teste como o cliente será atendido automaticamente</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium">
              {botEnabled ? 'Bot Ativo' : 'Bot Desativado'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {testChatLog.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md rounded-2xl px-4 py-2.5 text-xs ${
                  msg.sender === 'user' ? 'bg-slate-900 text-white rounded-tr-sm' : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-500 rounded-2xl px-4 py-2 text-xs animate-pulse">
                  Digitando resposta com IA...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleTestChat} className="pt-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              placeholder="Digite uma pergunta como cliente (ex: Quanto custa para eliminar cupim?)..."
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              className="flex-1 px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !testMessage.trim()}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
