
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { Icons } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
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
        setErrorMessage('Preencha todos os campos obrigatórios.');
        return;
      }
      const validKeys = ['PG2025', 'EXCLUSIVE', 'PG-2025'];
      if (!validKeys.includes(accessKey.toUpperCase().replace(/\s/g, ''))) {
        setErrorMessage('Chave de Acesso inválida.');
        return;
      }
    } else {
      if (!email || !password) {
        setErrorMessage('Informe e-mail e senha.');
        return;
      }
    }

    setStatus('loading');
    setTimeout(() => {
      if (mode === 'login' && password === 'erro') {
        setStatus('error');
        setErrorMessage('Credenciais incorretas.');
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
      name: 'Test Profile',
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
    <div className="h-screen w-full flex flex-col items-center justify-center animate-gradient-bg overflow-hidden relative p-6">
      {/* Overlay para suavizar o gradiente no modo claro se necessário */}
      <div className="absolute inset-0 bg-white/5 dark:bg-transparent pointer-events-none"></div>

      <div className="w-full max-w-sm flex flex-col items-center z-10">

        {/* Branding */}
        <div className={`text-center transition-all duration-700 transform ${mode === 'signup' ? 'mb-4 scale-90' : 'mb-10'}`}>
          <div className="inline-flex items-center justify-center bg-white rounded-[24px] shadow-2xl mb-4 border border-blue-50/50 overflow-hidden">
            <img
              src="/logo.png"
              alt="PersonalGroup Logo"
              className="h-16 w-auto object-contain p-2"
            />
          </div>
          <p className="text-white/70 text-[7px] font-bold tracking-[0.5em] uppercase mt-2">Exclusive Experience</p>
        </div>

        {/* AUTH CARD */}
        <section className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[40px] shadow-[0_32px_64px_rgba(0,0,0,0.15)] dark:shadow-[0_32px_64px_rgba(0,0,0,0.4)] p-8 border border-white/50 dark:border-white/5 animate-in slide-in-from-bottom-12 duration-700 transition-colors">

          <div className="flex bg-slate-100/50 dark:bg-white/5 p-1 rounded-[20px] mb-8 border border-slate-200/20 dark:border-white/5">
            <button
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`flex-1 py-2.5 rounded-[16px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${mode === 'login' ? 'bg-white dark:bg-slate-800 text-[#002B54] dark:text-white shadow-sm' : 'text-slate-400'}`}
            >
              Entrar
            </button>
            <button
              onClick={() => { setMode('signup'); setErrorMessage(''); }}
              className={`flex-1 py-2.5 rounded-[16px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${mode === 'signup' ? 'bg-white dark:bg-slate-800 text-[#002B54] dark:text-white shadow-sm' : 'text-slate-400'}`}
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleAuth} className={`${mode === 'signup' ? 'space-y-3' : 'space-y-5'}`}>
            {mode === 'signup' && (
              <div>
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Nome Completo</label>
                <input
                  type="text" placeholder="Como devemos lhe chamar?" value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl px-5 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 dark:text-white"
                />
              </div>
            )}

            <div>
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Identificação</label>
              <input
                type="email" placeholder="nome@exclusivo.com" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl px-5 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Chave Privada</label>
              <input
                type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl px-5 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 dark:text-white"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Chave de Pista</label>
                <input
                  type="text" placeholder="PG-EXCLUSIVE" value={accessKey} onChange={e => setAccessKey(e.target.value)}
                  className="w-full bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl px-5 py-3 text-xs font-black text-blue-600 dark:text-blue-400 focus:outline-none focus:border-[#002B54] transition-all uppercase placeholder:text-blue-200"
                />
              </div>
            )}

            {errorMessage && (
              <p className="text-[9px] font-black text-red-500 text-center uppercase tracking-tighter animate-shake">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-4 rounded-[20px] blue-gradient text-white font-black text-[10px] uppercase tracking-[0.25em] shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center border border-white/20"
            >
              {status === 'loading' ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span>{mode === 'login' ? 'Acessar Pista' : 'Finalizar Adesão'}</span>
              )}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-slate-100 dark:bg-white/5"></div>
            <span className="px-4 text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Connect</span>
            <div className="flex-1 h-px bg-slate-100 dark:bg-white/5"></div>
          </div>

          <button
            disabled={status === 'loading'}
            className="w-full py-3.5 rounded-[18px] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-bold text-[9px] uppercase tracking-widest flex items-center justify-center space-x-3 active:bg-slate-50 dark:active:bg-white/10 transition-all shadow-sm"
          >
            <Icons.Google className="w-4 h-4" />
            <span>Google Account</span>
          </button>
        </section>

        {/* Quick Access Lab */}
        {mode === 'login' && (
          <div className="mt-8 grid grid-cols-4 gap-2 w-full opacity-40 hover:opacity-100 transition-opacity">
            <MiniTestButton label="AL" onClick={() => injectUser({ name: 'Augusto Silva', role: UserRole.ALUNO })} />
            <MiniTestButton label="P1" onClick={() => injectUser({ name: 'Prof. Ricardo', role: UserRole.PERSONAL })} />
            <MiniTestButton label="CH" onClick={() => injectUser({ name: 'Coordenador', role: UserRole.CHEFE })} />
            <MiniTestButton label="AD" onClick={() => injectUser({ name: 'Admin', role: UserRole.ADMIN })} />
          </div>
        )}

        <p className="mt-8 text-[6px] text-white/30 font-bold uppercase tracking-[0.6em]">Legado Digital v1.5.0</p>
      </div>
    </div>
  );
};

const MiniTestButton = ({ label, onClick }: any) => (
  <button onClick={onClick} className="p-2 rounded-xl bg-white/10 border border-white/10 text-white font-black text-[9px] flex items-center justify-center active:scale-90 transition-all backdrop-blur-md">
    {label}
  </button>
);

export default Login;
