
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Icons } from '../constants';
import { TEST_ACCOUNTS, seedTestUsers, loginAsTestUser, createTestUser, type TestAccount } from '../seedTestUsers';

interface LoginProps {
  /** Called with email+password for real Firebase Auth */
  onLogin: (email: string, password: string) => Promise<void>;
  /** Optional: Google sign-in handler */
  onGoogleLogin?: () => Promise<void>;
  /** Optional: navigate to new-user registration flow */
  onRegister?: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onGoogleLogin, onRegister, isDarkMode = false, onToggleTheme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [seedStatus, setSeedStatus] = useState<string[]>([]);
  const [seedLoading, setSeedLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Credenciais do sistema exigidas.');
      return;
    }
    setStatus('loading');
    try {
      await onLogin(email, password);
      setStatus('success');
    } catch (err: any) {
      const code = err?.code || '';
      const msg = code === 'auth/invalid-credential' || code === 'auth/wrong-password'
        ? 'E-mail ou senha incorretos.'
        : code === 'auth/user-not-found'
          ? 'Conta não encontrada.'
          : code === 'auth/too-many-requests'
            ? 'Muitas tentativas. Aguarde um momento.'
            : err?.message || 'Acesso não autorizado.';
      setErrorMessage(msg);
      setStatus('error');
    }
  };

  const handleGoogle = async () => {
    if (!onGoogleLogin) return;
    setStatus('loading');
    setErrorMessage('');
    try {
      await onGoogleLogin();
      setStatus('success');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Erro ao entrar com Google.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden p-6">
      {/* Background Image & Overlays - Cinematic Movement */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden bg-black">
        <div
          className="absolute inset-x-[-10%] inset-y-[-10%] w-[120%] h-[120%] bg-cover bg-center animate-slow-pan opacity-20"
          style={{ backgroundImage: 'url(/gym-interior.png)' }}
        />
        {/* Layer 1: Matte Tint */}
        <div className="absolute inset-0 bg-ocean/90 mix-blend-multiply"></div>
        {/* Layer 2: Deep Darkness Smooth Transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/80 via-midnight/95 to-midnight"></div>
        {/* Layer 3: Soft Radial Focus */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#000000_100%)] opacity-80"></div>
      </div>



      <div className="w-full max-w-sm z-10 space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
        {/* Logo Section */}
        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-1000">
          <div className="flex justify-center p-2 relative group">
            <div className="absolute inset-0 bg-blue-500/20 blur-[50px] rounded-full"></div>
            <img src="/logo.png" className="h-24 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(0,182,253,0.5)] relative z-10 transition-transform duration-500 group-hover:scale-105" alt="PersonalGroup logo" />
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-black text-white uppercase tracking-tight leading-none drop-shadow-xl">
              Transforme seu Corpo <br />e sua <span className="text-cobalt">Mente</span>
            </h1>
            <p className="text-xs font-black text-blue-200 uppercase tracking-[0.4em] opacity-90 drop-shadow-md">
              Experiência Exclusive
            </p>
          </div>
        </div>

        {/* Auth Card - Sharp & Matte */}
        <div className="backdrop-blur-md bg-black/40 p-8 rounded-2xl relative group overflow-hidden border border-white/10">
          {/* Shine Effects - Muted */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-900/30 to-transparent"></div>

          <p className="text-xs font-extrabold uppercase tracking-[0.4em] text-slate-300 mb-6 text-center">Acesso ao Sistema</p>

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-widest ml-1">E-mail</label>
              <div className="relative group/input">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 bg-black/20 border border-white/10 rounded-full px-5 text-sm font-medium text-white focus:border-blue-500/50 focus:bg-black/40 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-white/20 relative z-10"
                  placeholder="seu@email.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-widest ml-1">Senha</label>
              <div className="relative group/input">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 bg-black/20 border border-white/10 rounded-full px-5 text-sm font-medium text-white focus:border-blue-500/50 focus:bg-black/40 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-white/20 relative z-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="bg-red-500/15 border border-red-500/30 rounded-lg p-3 text-[11px] font-black text-red-400 text-center uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full h-14 mt-2 bg-cobalt hover:bg-sky text-white font-black text-[12px] uppercase tracking-[0.25em] transition-all relative overflow-hidden group/btn rounded-full border border-transparent disabled:opacity-60 shadow-[0_0_20px_rgba(0,182,253,0.3)]"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
              {status === 'loading' ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="opacity-80">Autenticando...</span>
                </div>
              ) : 'Acessar'}
            </button>

            {/* Biometric Login Call */}
            <button
              type="button"
              onClick={() => {
                setStatus('loading');
                setTimeout(() => {
                  setStatus('idle');
                  setErrorMessage('Biometria não configurada neste dispositivo.');
                }, 1500);
              }}
              className="w-full h-14 flex items-center justify-center space-x-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all group"
            >
              <Icons.Fingerprint className="w-6 h-6 text-cobalt group-hover:scale-110 transition-transform" />
              <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Acesso Biométrico</span>
            </button>
          </form>

          {/* Google Sign-In */}
          {onGoogleLogin && (
            <button
              onClick={handleGoogle}
              disabled={status === 'loading'}
              className="w-full h-12 mt-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm flex items-center justify-center space-x-3 transition-all disabled:opacity-60"
            >
              <Icons.Google className="w-5 h-5" />
              <span className="text-xs font-black text-white uppercase tracking-widest">Entrar com Google</span>
            </button>
          )}

          {/* Register link */}
          {onRegister && (
            <div className="mt-6 text-center">
              <button onClick={onRegister} className="text-[11px] font-bold text-blue-300 uppercase tracking-[0.2em] hover:text-white transition-colors">
                Novo membro? Criar conta
              </button>
            </div>
          )}

          {/* DEV TEST PANEL */}
          <div className="mt-8 border-t border-white/5 pt-6">
            <button
              onClick={() => setShowDevPanel(!showDevPanel)}
              className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.3em] hover:text-blue-400 transition-colors w-full text-center"
            >
              🧪 Acessos de Teste {showDevPanel ? '▲' : '▼'}
            </button>

            {showDevPanel && (
              <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Seed Button */}
                <button
                  onClick={async () => {
                    setSeedLoading(true);
                    setSeedStatus([]);
                    try {
                      const results = await seedTestUsers();
                      setSeedStatus(results);
                    } catch (err: any) {
                      setSeedStatus([`❌ Erro: ${err.message}`]);
                    }
                    setSeedLoading(false);
                  }}
                  disabled={seedLoading}
                  className="w-full py-2.5 bg-amber-600/20 border border-amber-500/30 rounded-lg text-[9px] font-black text-amber-300 uppercase tracking-[0.2em] hover:bg-amber-500/30 transition-all disabled:opacity-50"
                >
                  {seedLoading ? 'Criando usuários...' : '⚡ Criar Todos os Usuários de Teste'}
                </button>

                {/* Seed Results */}
                {seedStatus.length > 0 && (
                  <div className="bg-black/30 rounded-lg p-3 space-y-1">
                    {seedStatus.map((s, i) => (
                      <p key={i} className="text-[8px] text-slate-300 font-mono">{s}</p>
                    ))}
                  </div>
                )}

                {/* Quick Login Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {TEST_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.email}
                      onClick={async () => {
                        setStatus('loading');
                        setErrorMessage('');
                        try {
                          // Ensure user exists first
                          await createTestUser(acc);
                          // Then login
                          await onLogin(acc.email, acc.password);
                          setStatus('success');
                        } catch (err: any) {
                          setErrorMessage(err.message);
                          setStatus('error');
                        }
                      }}
                      disabled={status === 'loading'}
                      className="py-3 rounded-lg border transition-all hover:scale-[1.02] disabled:opacity-50"
                      style={{
                        borderColor: acc.color + '40',
                        background: acc.color + '15',
                      }}
                    >
                      <p className="text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: acc.color }}>
                        {acc.label}
                      </p>
                      <p className="text-[7px] text-slate-500 font-bold mt-0.5">{acc.email}</p>
                    </button>
                  ))}
                </div>

                <p className="text-[7px] text-slate-600 text-center font-bold uppercase tracking-widest">
                  Senha padrão: Test@123
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
