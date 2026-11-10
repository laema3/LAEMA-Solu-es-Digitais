import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuthUser, Tenant } from '../types';

interface LoginViewProps {
  activeTenant: Tenant | null;
  onLoginSuccess: (user: AuthUser) => void;
  onReturnToMaster?: () => void;
  isClientMode?: boolean;
}

export const getPresetUsers = (): Array<AuthUser & { passwordHash: string }> => {
  try {
    const saved = localStorage.getItem('laema_system_users');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((u: any) => ({
          id: u.id,
          name: u.name,
          username: u.username,
          passwordHash: u.password,
          role: u.role,
          avatar: u.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        }));
      }
    }
  } catch (e) {
    console.warn('Error reading system users in LoginView', e);
  }
  return [
    {
      id: 'user-vilma',
      name: 'Vilma',
      username: 'vilma',
      passwordHash: '@Amb10340',
      role: 'Atendente',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
    {
      id: 'user-mariana',
      name: 'Mariana',
      username: 'mariana',
      passwordHash: '@Amb10340',
      role: 'Atendente',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    {
      id: 'user-admin',
      name: 'Administrador',
      username: 'admin',
      passwordHash: '@Amb10340',
      role: 'Super Admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  ];
};

export const LoginView: React.FC<LoginViewProps> = ({
  activeTenant,
  onLoginSuccess,
  onReturnToMaster,
  isClientMode = false,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const presetUsers = getPresetUsers();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const trimmedUser = username.trim().toLowerCase();
    const foundUser = presetUsers.find(
      (u) => (u.username.toLowerCase() === trimmedUser || u.name.toLowerCase() === trimmedUser) && u.passwordHash === password
    );

    setTimeout(() => {
      setLoading(false);
      if (foundUser) {
        const { passwordHash, ...cleanUser } = foundUser;
        onLoginSuccess(cleanUser);
      } else {
        setErrorMessage('Usuário ou senha incorretos. Verifique suas credenciais.');
      }
    }, 350);
  };

  const handleQuickLogin = (preset: typeof presetUsers[0]) => {
    setUsername(preset.name);
    setPassword(preset.passwordHash);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-4 select-none">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Brand header */}
        <div className="p-8 text-center bg-slate-50 border-b border-slate-100 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-sky-500 text-white flex items-center justify-center mx-auto shadow-md shadow-sky-500/20">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
              {activeTenant ? 'Acesso Seguro ao Workspace' : 'Administração Master SaaS'}
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              {activeTenant?.name || 'Laema Soluções Digitais'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {activeTenant ? 'Digite seu usuário e senha autorizados para acessar o painel de atendimento.' : 'Faça login com sua conta de Administrador Master para gerenciar o SaaS.'}
            </p>
          </div>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Usuário *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="Ex: Vilma ou Mariana"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Senha *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick preset chips for convenience */}
          <div className="pt-1">
            <p className="text-[11px] font-semibold text-slate-500 mb-2">Usuários Cadastrados para este Projeto:</p>
            <div className="flex flex-wrap gap-2">
              {presetUsers.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleQuickLogin(preset)}
                  className="py-1.5 px-3 bg-slate-50 hover:bg-sky-50 hover:border-sky-200 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full py-3 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-semibold rounded-xl text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Validando...' : 'Entrar no Workspace'}</span>
          </button>

          {!isClientMode && !(typeof window !== 'undefined' && window.location.pathname.startsWith('/app/')) && onReturnToMaster && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onReturnToMaster}
                className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
              >
                Voltar para o Painel Master (Laema)
              </button>
            </div>
          )}
        </form>

        {/* Security badge footer */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Laema Soluções Digitais — Multi-Tenant Autenticado</span>
        </div>
      </div>
    </div>
  );
};
