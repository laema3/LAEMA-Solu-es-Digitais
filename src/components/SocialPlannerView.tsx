import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Sparkles, Instagram, Share2, CheckCircle2, Trash2 } from 'lucide-react';
import { SocialPost } from '../types';

interface SocialPlannerViewProps {
  posts: SocialPost[];
  onAddPost: (post: SocialPost) => void;
  onDeletePost: (id: string) => void;
}

export const SocialPlannerView: React.FC<SocialPlannerViewProps> = ({ posts, onAddPost, onDeletePost }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1584467735811-628d011f1cb5?w=600');
  const [platforms, setPlatforms] = useState<('instagram' | 'facebook')[]>(['instagram', 'facebook']);
  const [scheduledDate, setScheduledDate] = useState('2026-11-12');
  const [scheduledTime, setScheduledTime] = useState('10:00');
  const [aiTopic, setAiTopic] = useState('');
  const [generatingAi, setGeneratingAi] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleGenerateAiCaption = async () => {
    if (!aiTopic.trim()) return;
    try {
      setGeneratingAi(true);
      const res = await fetch('/api/gemini/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiTopic }),
      });
      const data = await res.json();
      if (data.caption) {
        setCaption(data.caption);
      }
    } catch (err) {
      console.error('Error generating caption', err);
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption || !scheduledDate) return;

    const newPost: SocialPost = {
      id: `sp-${Date.now()}`,
      caption,
      imageUrl,
      platforms,
      scheduledDate,
      scheduledTime,
      status: 'Agendado',
    };

    onAddPost(newPost);
    setIsModalOpen(false);
    setCaption('');
    setAiTopic('');
    setToast('Post agendado com sucesso para publicação automática no Instagram e Facebook!');
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Planejador & Agendador de Redes Sociais</h2>
          <p className="text-slate-500 text-sm mt-1">Programe postagens automáticas diárias para o Instagram e Facebook da Ambiental Controle de Pragas.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Agendar Nova Postagem</span>
        </button>
      </div>

      {toast && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-md text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> {toast}
        </div>
      )}

      {/* Info banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-600" /> Automação Diária de Postagens
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Organize seu calendário editorial e o sistema publica automaticamente no Instagram e Facebook todos os dias.
          </p>
        </div>
      </div>

      {/* Posts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="relative h-48 bg-slate-100">
                <img src={post.imageUrl} alt="Social post" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {post.platforms.map((p, idx) => (
                    <span key={idx} className="bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                      {p}
                    </span>
                  ))}
                </div>
                <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  post.status === 'Publicado' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {post.status}
                </span>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <CalendarIcon className="w-3.5 h-3.5 text-purple-600" />
                  <span>{post.scheduledDate} às {post.scheduledTime}</span>
                </div>
                <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed">{post.caption}</p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-[11px] text-slate-400">Publicação Automática</span>
              <button
                onClick={() => onDeletePost(post.id)}
                className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg border border-slate-200 bg-white transition-colors"
                title="Excluir postagem"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to create post */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">Agendar Nova Postagem (Instagram & Facebook)</h3>
            
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                <Sparkles className="w-4 h-4 text-purple-600" /> Gerador de Legendas com IA Gemini
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Dicas de prevenção contra cupins em móveis de madeira..."
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-purple-200 rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleGenerateAiCaption}
                  disabled={generatingAi || !aiTopic.trim()}
                  className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  {generatingAi ? 'Gerando...' : 'Gerar com IA'}
                </button>
              </div>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Legenda da Postagem *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Escreva a legenda com hashtags..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL da Imagem / Foto</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Data de Publicação *</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Horário *</label>
                  <input
                    type="time"
                    required
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
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
                  Salvar e Agendar Automaticamente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
