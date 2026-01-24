
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { Icons } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, isDarkMode = false, onToggleTheme }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'signup') {
      if (!name || !email || !password || !accessKey) {
        setErrorMessage('Campos obrigatórios ausentes.');
        return;
      }
      const validKeys = ['PG2025', 'EXCLUSIVE', 'PG-2025'];
      if (!validKeys.includes(accessKey.toUpperCase().replace(/\s/g, ''))) {
        setErrorMessage('Chave de Hardware inválida.');
        return;
      }
    } else {
      if (!email || !password) {
        setErrorMessage('Credenciais do sistema exigidas.');
        return;
      }
    }

    setStatus('loading');
    setTimeout(() => {
      if (mode === 'login' && password === 'erro') {
        setStatus('error');
        setErrorMessage('Acesso não autorizado.');
        return;
      }

      const userName = mode === 'signup' ? name : 'Augusto Silva';
      let role = UserRole.ALUNO;
      if (email.includes('personal')) role = UserRole.PERSONAL;
      else if (email.includes('chefe')) role = UserRole.CHEFE;
      else if (email.includes('admin')) role = UserRole.ADMIN;

      const user: User = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        name: userName,
        email: email,
        role: role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
        unit: 'Unidade Península',
        healthStatus: 'NORMAL',
        healthException: null,
        wellnessSessionsUsed: 0
      };

      setStatus('success');
      setTimeout(() => onLogin(user), 600);
    }, 1500);
  };

  const injectUser = (config: Partial<User>) => {
    const baseUser: User = {
      id: 'dev_' + Math.random().toString(36).substr(2, 5),
      name: 'Perfil de Teste',
      email: 'exclusive@personalgroup.com',
      role: UserRole.ALUNO,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${config.name}`,
      unit: 'PG Lab São Luís',
      healthStatus: 'NORMAL',
      healthException: null,
      wellnessSessionsUsed: 0,
      ...config
    };
    onLogin(baseUser);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden p-6 bg-app grain-overlay">
      <div className="precision-bg absolute inset-0 z-0 opacity-40"></div>

      {/* Theme Toggle Button */}
      {onToggleTheme && (
        <button
          onClick={onToggleTheme}
          className="absolute top-6 right-6 z-50 w-12 h-12 border border-white/20 bg-white/10 flex items-center justify-center text-white active:scale-95 transition-all hover:bg-white/20 rounded-lg backdrop-blur-md shadow-lg"
          aria-label="Alternar tema"
        >
          {isDarkMode ? <Icons.Sun className="w-5 h-5 text-amber-400" /> : <Icons.Moon className="w-5 h-5 text-slate-200" />}
        </button>
      )}

      <div className="w-full max-w-sm z-10 space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
        {/* Logo Section */}
        <div className="text-center space-y-8 animate-in fade-in zoom-in duration-1000">
          <div className="flex justify-center p-2 relative group">
            <img src="/personalgroup-logo.png" className="h-24 w-auto object-contain filter drop-shadow-[0_0_25px_rgba(37,99,235,0.4)] relative z-10 transition-transform duration-500 group-hover:scale-105" alt="PersonalGroup logo" />
          </div>
          <div className="space-y-3">

            <p className="text-[11px] font-medium text-blue-400 uppercase tracking-[0.4em] opacity-80">Experiência Exclusive</p>
          </div>
        </div>

        {/* Auth Interface */}
        <div className="glass-panel p-8 shadow-2xl relative group overflow-hidden border-white/5">


          <div className="flex border-b border-white/5 mb-8">
            <button
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${mode === 'login' ? 'text-blue-500' : 'text-slate-600'}`}
            >
              Entrar
              {mode === 'login' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 shadow-[0_0_10px_#2563EB]"></div>}
            </button>
            <button
              onClick={() => { setMode('signup'); setErrorMessage(''); }}
              className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${mode === 'signup' ? 'text-blue-500' : 'text-slate-600'}`}
            >
              Criar Conta
              {mode === 'signup' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 shadow-[0_0_10px_#2563EB]"></div>}
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {mode === 'signup' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 bg-white/5 border border-white/10 px-4 text-sm font-semibold text-white focus:border-blue-500/50 outline-none transition-all"
                  placeholder="EX // JOÃO SILVA"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 bg-white/5 border border-white/10 px-4 text-sm font-semibold text-white focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-800"
                placeholder="seu@email.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 bg-white/5 border border-white/10 px-4 text-sm font-semibold text-white focus:border-blue-500/50 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {errorMessage && (
              <div className="bg-red-950/20 border border-red-500/30 p-4 text-[9px] font-bold text-red-500 text-center uppercase tracking-widest">
                Ops! {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] uppercase tracking-[0.4em] transition-all relative overflow-hidden group/btn shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              <div className="absolute inset-0 bg-white translate-x-[-101%] group-hover/btn:translate-x-0 transition-transform duration-700 mix-blend-difference"></div>
              {status === 'loading' ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : mode === 'login' ? 'Acessar' : 'Confirmar Cadastro'}
            </button>
          </form>
        </div>

        {/* Debug / Dev Profiles */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center space-x-4 opacity-30">
            <div className="flex-1 h-[1px] bg-white/10"></div>
            <span className="text-[8px] font-bold uppercase tracking-[0.4em]">Acesso Rápido</span>
            <div className="flex-1 h-[1px] bg-white/10"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Aluno', role: UserRole.ALUNO, icon: Icons.User },
              { label: 'Professor', role: UserRole.PERSONAL, icon: Icons.Dumbbell },
              { label: 'Gestor', role: UserRole.CHEFE, icon: Icons.Chart },
              { label: 'Admin', role: UserRole.ADMIN, icon: Icons.Shield }
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => injectUser({ name: p.label, role: p.role })}
                className="flex items-center space-x-4 p-4 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all group text-left"
              >
                <div className="w-8 h-8 flex items-center justify-center border border-white/10 group-hover:border-blue-500 transition-colors">
                  <p.icon className="w-4 h-4 text-slate-500 group-hover:text-blue-500 transition-colors" />
                </div>
                <span className="text-[9px] font-bold text-slate-400 group-hover:text-white uppercase tracking-widest">{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TestProfileButton: React.FC<{
  label: string;
  icon: any;
  color: string;
  onClick: () => void;
}> = ({ label, icon: Icon, color, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 p-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-100/30 dark:border-white/5 shadow-sm hover:shadow-md transition-all active:scale-[0.97] group text-left`}
    >
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-[10px] font-bold text-slate-900 dark:text-slate-950 dark:text-white uppercase tracking-tight leading-none">{label}</span>
    </button>
  );
};

export default Login;
