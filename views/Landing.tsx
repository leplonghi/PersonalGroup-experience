
import React from 'react';
import { Icons } from '../constants';
import Logo from '../components/ui/Logo';

interface LandingProps {
  onLoginClick: () => void;
}

const Landing: React.FC<LandingProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-pg-midnight text-white selection:bg-pg-cobalt/30 overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-svh flex flex-col items-center justify-center p-6 md:p-8 overflow-hidden">
        {/* Background Visuals */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/gym-interior.png')] bg-cover bg-center opacity-20 scale-110 animate-slow-pan"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-pg-midnight/20 via-pg-midnight/80 to-pg-midnight"></div>
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-pg-midnight to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl space-y-8 md:space-y-12 text-center">
          <div className="flex justify-center mb-8 md:mb-12 animate-in fade-in zoom-in duration-1000">
            <Logo variant="large" />
          </div>

          <div className="space-y-4 md:space-y-6 animate-in slide-in-from-bottom-12 duration-1000">
            <p className="text-[12px] md:text-sm font-semibold text-pg-cobalt uppercase tracking-[0.3em] md:tracking-[0.4em]">Experiência Wellness Premium</p>
            <h1 className="text-4xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9] md:leading-[0.85]">
              VIVA O <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">EXTRAORDINÁRIO</span>
            </h1>
            <p className="text-sm md:text-lg text-slate-400 max-w-2xl mx-auto font-medium uppercase tracking-widest leading-relaxed px-4 md:px-0">
              O ecossistema fitness mais exclusivo de São Luís. Tecnologia, acolhimento e resultados baseados em evidência.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pt-8 md:pt-12 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
            <button 
              onClick={onLoginClick}
              className="w-full sm:w-auto px-12 py-5 md:py-6 bg-white text-pg-midnight font-bold text-sm uppercase tracking-[0.2em] hover:bg-pg-cobalt hover:text-white transition-all shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:-translate-y-1 active:scale-95"
            >
              Acessar Portal do Aluno
            </button>
            <button className="w-full sm:w-auto px-12 py-5 md:py-6 border border-white/10 bg-white/5 backdrop-blur-md text-white font-bold text-sm uppercase tracking-[0.2em] hover:bg-white/10 transition-all hover:-translate-y-1 active:scale-95">
              Conhecer Experiência
            </button>
          </div>
        </div>

        {/* Floating Metrics Decoration */}
        <div className="absolute bottom-12 left-12 hidden lg:flex items-center gap-6 animate-in slide-in-from-left-12 duration-1000">
          <div className="p-4 glass-panel border border-white/10">
            <p className="text-[12px] font-semibold text-pg-cobalt uppercase tracking-widest">Membros Ativos</p>
            <p className="text-2xl font-black italic">1,240+</p>
          </div>
          <div className="p-4 glass-panel border border-white/10">
            <p className="text-[12px] font-semibold text-pg-cobalt uppercase tracking-widest">Protocolo Científico</p>
            <p className="text-2xl font-black italic">100%</p>
          </div>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section className="py-32 px-8 max-w-7xl mx-auto space-y-32">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <header className="border-l-4 border-pg-cobalt pl-8">
              <p className="text-sm font-semibold text-pg-cobalt uppercase tracking-[0.3em] mb-4">Engenharia de Dados</p>
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
                DECISÕES BASEADAS <br />EM <span className="text-pg-cobalt">DADOS</span>
              </h2>
            </header>
            <p className="text-slate-400 text-lg leading-relaxed uppercase tracking-wide">
              Integramos seus wearables e dados de bioimpedância automaticamente. Seu treino evolui em tempo real com sua performance biológica.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8 text-xs font-black uppercase tracking-widest">
              <div className="flex items-center gap-4 text-white">
                <Icons.Activity className="w-6 h-6 text-pg-cobalt" />
                <span>Sincronização Smart</span>
              </div>
              <div className="flex items-center gap-4 text-white">
                <Icons.Chart className="w-6 h-6 text-pg-cobalt" />
                <span>Análise Preditiva</span>
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-pg-cobalt/20 blur-[100px] rounded-full group-hover:bg-pg-cobalt/30 transition-all"></div>
            <div className="relative aspect-square bg-slate-900 border border-white/10 flex items-center justify-center p-12 overflow-hidden shadow-2xl">
              <Icons.Activity className="w-48 h-48 text-pg-cobalt/20 absolute -right-12 -bottom-12 rotate-12" />
              <div className="space-y-8 relative z-10 w-full">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-1 bg-white/5 overflow-hidden">
                    <div className="h-full bg-pg-cobalt animate-pulse" style={{ width: `${30 + i * 20}%`, animationDelay: `${i * 200}ms` }}></div>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 bg-white/5 border border-white/10 p-6 flex flex-col justify-end">
                    <p className="text-[12px] text-slate-500 uppercase tracking-widest">Recuperação HRV</p>
                    <p className="text-xl font-black italic">88%</p>
                  </div>
                  <div className="h-32 bg-pg-cobalt p-6 flex flex-col justify-end">
                    <p className="text-[12px] text-white/60 uppercase tracking-widest">Carga de Treino</p>
                    <p className="text-xl font-black italic text-white">OTIMIZADA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-12">
            <h3 className="text-3xl font-black uppercase italic tracking-widest">Pronto para o próximo nível?</h3>
            <button 
              onClick={onLoginClick}
              className="px-16 py-8 bg-pg-sky text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_30px_60px_rgba(0,182,253,0.3)] hover:scale-105 active:scale-95 transition-all"
            >
                Tornar-se Membro
            </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 px-8 text-center text-[10px] text-slate-500 font-medium uppercase tracking-[0.2em]">
          &copy; 2025 Personal Group Experience • Av. Nina Rodrigues, Península • São Luís - MA
      </footer>
    </div>
  );
};

export default Landing;
