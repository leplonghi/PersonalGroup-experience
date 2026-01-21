
import React, { useState } from 'react';
import { User } from '../types';
import Card from '../components/Card';
import { Icons } from '../constants';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onGoTimeline?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout, onGoTimeline }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const menuItems = [
    { id: 'data', icon: <Icons.User className="w-5 h-5" />, label: 'Dados Pessoais', desc: 'Edite seu perfil e avatar' },
    { id: 'timeline', icon: <Icons.Clock className="w-5 h-5" />, label: 'Minha Jornada', desc: 'Histórico de performance', action: onGoTimeline },
    { id: 'settings', icon: <Icons.Settings className="w-5 h-5" />, label: 'Configurações', desc: 'Notificações e privacidade' },
  ];

  const faqs = [
    { q: "Posso treinar na Personal Group sem possuir um Personal Trainer?", a: "Sim, oferecemos suporte técnico de pista em todos os horários." },
    { q: "Posso levar meu Personal para me dar treino?", a: "Temos políticas específicas para instrutores externos. Consulte a recepção." },
    { q: "Tenho que pagar taxa de adesão?", a: "Consulte nossas condições vigentes com um consultor comercial." },
    { q: "A Personal Group possui algum convênio?", a: "Mantemos parcerias estratégicas em São Luís. Verifique a lista atualizada." }
  ];

  return (
    <div className="px-6 py-12 pb-48 animate-fade-in bg-white dark:bg-[#020617] min-h-screen transition-colors">
      <header className="flex flex-col items-center mb-12">
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-[48px] border-[6px] border-white dark:border-slate-800 shadow-2xl overflow-hidden bg-slate-50 dark:bg-slate-900">
             <img src={user.avatar} className="w-full h-full object-cover" alt="Avatar" />
          </div>
          <button className="absolute -bottom-2 -right-2 bg-[#002B54] dark:bg-blue-600 text-white p-3 rounded-2xl shadow-xl active:scale-90 transition-all border-4 border-white dark:border-slate-900">
            <Icons.Edit className="w-4 h-4" />
          </button>
        </div>
        <h2 className="text-3xl font-black text-slate-950 dark:text-white tracking-tight leading-none">{user.name}</h2>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Aluno Exclusive</p>
      </header>

      <div className="space-y-4 mb-14">
        {menuItems.map((item, idx) => (
          <Card key={idx} onClick={item.action} variant="flat" className="p-6 flex items-center justify-between cursor-pointer active:bg-slate-50 dark:active:bg-white/5 transition-all shadow-sm border-slate-100 dark:border-white/5">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#002B54] dark:text-blue-400 mr-5 shadow-inner">
                {item.icon}
              </div>
              <div>
                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight">{item.label}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{item.desc}</p>
              </div>
            </div>
            <Icons.ChevronRight className="w-5 h-5 text-slate-300" />
          </Card>
        ))}
      </div>

      <section className="space-y-5 mb-14">
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Suporte & FAQ</h4>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-[28px] border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 overflow-hidden transition-all shadow-sm">
              <button 
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className={`w-full p-6 text-left flex items-center justify-between transition-all ${activeFaq === i ? 'bg-[#002B54] text-white' : 'text-slate-900 dark:text-white'}`}
              >
                <div className="flex items-center space-x-4">
                  <span className={`w-2.5 h-2.5 rounded-full ${activeFaq === i ? 'bg-blue-400' : 'bg-slate-100 dark:bg-white/20'}`}></span>
                  <span className="text-xs font-black tracking-tight leading-snug pr-4">{faq.q}</span>
                </div>
                <Icons.Plus className={`w-5 h-5 shrink-0 transition-transform duration-500 ${activeFaq === i ? 'rotate-45' : ''}`} />
              </button>
              {activeFaq === i && (
                <div className="p-7 bg-slate-50/50 dark:bg-blue-900/10 text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <button 
        onClick={onLogout}
        className="w-full py-6 bg-red-50 text-red-600 font-black text-xs uppercase tracking-[0.2em] rounded-[32px] flex items-center justify-center gap-3 active:bg-red-100 transition-all border border-red-100/50 mb-16 shadow-sm"
      >
        Encerrar Sessão Segura
      </button>

      <footer className="text-center space-y-8 pt-10 border-t border-slate-100 dark:border-white/5">
        <div className="flex justify-center">
           <div className="w-16 h-16 bg-[#002B54] dark:bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-900/20">
             <Icons.Logo className="w-10 h-10" />
           </div>
        </div>
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-950 dark:text-white uppercase tracking-[0.4em]">Unidade Península</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold leading-relaxed max-w-[220px] mx-auto uppercase tracking-widest">
            Av. Jackson Kepler Lago s/n<br/>
            Ponta D'areia, São Luís - MA
          </p>
          <div className="flex items-center justify-center space-x-3 text-[10px] font-black text-[#002B54] dark:text-blue-400">
             <span className="tracking-widest">98 9 9133-2316</span>
             <span className="w-1.5 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full"></span>
             <span className="tracking-widest">@personalgroup</span>
          </div>
        </div>
        <p className="text-[8px] font-bold text-slate-200 dark:text-slate-800 uppercase tracking-[0.5em] pb-10">Exclusive Journey v1.5.0</p>
      </footer>
    </div>
  );
};

export default Profile;
