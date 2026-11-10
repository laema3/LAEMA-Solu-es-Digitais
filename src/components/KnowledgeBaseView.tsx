import React, { useState } from 'react';
import { BookOpen, Search, Sparkles, Tag } from 'lucide-react';
import { KnowledgeItem } from '../types';

interface KnowledgeBaseViewProps {
  knowledgeBase: KnowledgeItem[];
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({ knowledgeBase }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  const filteredItems = knowledgeBase.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    try {
      setLoadingAi(true);
      const res = await fetch('/api/gemini/kb-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: aiQuery, knowledgeBase }),
      });
      const data = await res.json();
      setAiAnswer(data.answer || 'Sem resposta encontrada.');
    } catch (err) {
      console.error('KB Search error', err);
      setAiAnswer('Erro ao consultar a base de conhecimento.');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Base de Conhecimento & FAQs</h2>
        <p className="text-slate-500 text-sm mt-1">Artigos e procedimentos de suporte para consulta rápida da equipe ou chatbot.</p>
      </div>

      {/* AI RAG Assistant Search */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Assistente IA RAG - Pesquisa Avançada</span>
        </div>
        <form onSubmit={handleAiSearch} className="flex gap-3">
          <input
            type="text"
            placeholder="Ex: Qual o prazo para reembolso via PIX e como orientar o cliente?"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <button
            type="submit"
            disabled={loadingAi}
            className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl text-xs transition-colors whitespace-nowrap shadow-sm"
          >
            {loadingAi ? 'Buscando...' : 'Perguntar à IA'}
          </button>
        </form>

        {aiAnswer && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm leading-relaxed text-slate-800 space-y-2">
            <p className="font-bold text-slate-900 text-xs uppercase tracking-wider">Resposta da IA Baseada nos Manuais:</p>
            <p className="whitespace-pre-wrap">{aiAnswer}</p>
          </div>
        )}
      </div>

      {/* Local search & articles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Artigos Cadastrados</h3>
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Pesquisar artigos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold">
                  {item.category}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">{item.title}</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{item.content}</p>
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                {item.tags.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                    <Tag className="w-3 h-3 text-slate-400" /> {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
