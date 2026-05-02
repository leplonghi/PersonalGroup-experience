import React from 'react';
import { User } from '../types';
import { Icons, BRAND } from '../constants';

interface ClubProps {
  user: User;
  onBack: () => void;
}

const AMENITIES = [
  {
    icon: 'Coffee',
    title: 'Cantinho do Café',
    description: 'Café gourmet disponível para todos os nossos membros durante todo o dia.',
    category: 'CONFORTO'
  },
  {
    icon: 'Leaf',
    title: 'Frutas Pós-Treino',
    description: 'Reposição natural com frutas frescas selecionadas diariamente.',
    category: 'NUTRIÇÃO'
  },
  {
    icon: 'Wifi',
    title: 'High-Speed Wi-Fi',
    description: 'Conectividade total em todas as áreas para seu trabalho ou entretenimento.',
    category: 'TECNOLOGIA'
  },
  {
    icon: 'Shield',
    title: 'Estacionamento VIP',
    description: 'Segurança e comodidade com estacionamento exclusivo para alunos.',
    category: 'COMODIDADE'
  },
  {
    icon: 'MapPin',
    title: 'Localização Elite',
    description: 'No coração da Península, com a melhor vista e brisa de São Luís.',
    category: 'PRESTÍGIO'
  },
  {
    icon: 'Zap',
    title: 'Toalhas Premium',
    description: 'Serviço de toalhas higienizadas e macias à sua disposição.',
    category: 'LUXO'
  }
];

const Club: React.FC<ClubProps> = ({ user, onBack }) => {
  return (
    <div className="min-h-screen bg-app flex flex-col transition-colors duration-500 grain-overlay relative p-8 pb-32">
      <div className="precision-bg absolute inset-0 z-0 opacity-40"></div>
      
      <div className="relative z-10 flex flex-col space-y-12 animate-reveal">
        {/* Header */}
        <header className="flex items-center space-x-6">
          <button 
            onClick={onBack} 
            className="w-12 h-12 border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-900 dark:text-white active:scale-95 transition-all rounded-full"
          >
            <Icons.ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight uppercase leading-none">PG Club</h3>
            <p className="text-[9px] font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.3em] mt-3 leading-none">Exclusividade e Amenidades</p>
          </div>
        </header>

        {/* Hero Section */}
        <section className="glass-panel p-10 overflow-hidden relative group border-white/5 shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all duration-700 rotate-12">
            <Icons.LogoSymbol className="w-40 h-40" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-6 uppercase italic">
              Premium<br />
              <span className="text-blue-600">Experience</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-[240px] leading-relaxed mb-8">
              A Personal Group não é apenas uma academia, é o seu clube de alta performance e bem-estar.
            </p>
            <div className="flex items-center space-x-4">
               <div className="h-[2px] w-12 bg-blue-600"></div>
               <span className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-[0.4em]">Life Is Gold</span>
            </div>
          </div>
        </section>

        {/* Amenities Grid */}
        <section className="space-y-8">
          <div className="px-1 flex justify-between items-end">
            <div>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Nossas Amenidades</h4>
              <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-2 uppercase">Conforto de Elite</p>
            </div>
            <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest border border-blue-600/20 px-3 py-1 rounded-full">Included</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {AMENITIES.map((item, idx) => {
              const IconComponent = Icons[item.icon as keyof typeof Icons] || Icons.Zap;
              return (
                <div 
                  key={idx}
                  className="glass-panel p-8 flex items-center space-x-6 group hover:border-blue-500/30 transition-all duration-500 border-white/5 active:scale-[0.98]"
                >
                  <div className="w-16 h-16 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:border-blue-600 transition-all duration-500 text-blue-600">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest leading-none">{item.category}</span>
                    </div>
                    <h5 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight uppercase">{item.title}</h5>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Partner Section */}
        <section className="glass-panel p-10 border-blue-600/10 bg-blue-600/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
          <div className="relative z-10 text-center space-y-6">
            <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.4em]">Parceiros Strategicos</h4>
            <p className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Vantagens Exclusivas</p>
            <div className="flex flex-wrap justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
              {/* Placeholders for partner logos */}
              <div className="px-6 py-3 border border-slate-300 dark:border-white/10 rounded-lg text-[10px] font-bold tracking-widest">WINE CLUB</div>
              <div className="px-6 py-3 border border-slate-300 dark:border-white/10 rounded-lg text-[10px] font-bold tracking-widest">BODY SHOP</div>
              <div className="px-6 py-3 border border-slate-300 dark:border-white/10 rounded-lg text-[10px] font-bold tracking-widest">HEALTH FOOD</div>
            </div>
            <p className="text-[10px] text-slate-500 italic mt-6">Apresente seu Black Card digital para benefícios em nossos parceiros.</p>
          </div>
        </section>

        {/* Brand Info */}
        <footer className="text-center py-12 space-y-6 border-t border-slate-200 dark:border-white/5">
          <div className="flex flex-col items-center gap-2">
            <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.5em]">{BRAND.name}</p>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest">{BRAND.tagline}</p>
          </div>
          <p className="text-[9px] text-slate-500/50 uppercase tracking-widest">Since {BRAND.founded} • {BRAND.location.neighborhood}</p>
        </footer>
      </div>
    </div>
  );
};

export default Club;
