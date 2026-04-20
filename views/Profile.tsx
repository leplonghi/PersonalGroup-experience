
import React, { useState } from 'react';
import { User } from '../types';
import { Icons } from '../constants';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
  onGoTimeline?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout, onUpdateUser, onGoTimeline }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHealth, setShowHealth] = useState(false);

  // Edit State
  const [editName, setEditName] = useState(user?.name || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '/placeholder-avatar.png');

  const handleSaveProfile = () => {
    onUpdateUser({
      ...user,
      name: editName,
      avatar: editAvatar
    });
    setIsEditing(false);
  };

  const menuItems = [
    { id: 'data', icon: <Icons.User className="w-5 h-5" />, label: 'Dados Pessoais', desc: 'Edite seu perfil e identificação', action: () => setIsEditing(true) },
    { id: 'plan', icon: <Icons.Shield className="w-5 h-5" />, label: 'Meu Plano', desc: 'Renovação e status financeiro', action: () => setShowPlan(true) },
    { id: 'health', icon: <Icons.Chart className="w-5 h-5" />, label: 'Deep Health', desc: 'Biometria e Evolução Corporal', action: () => setShowHealth(true) },
    { id: 'timeline', icon: <Icons.FileText className="w-5 h-5" />, label: 'Histórico & PDF', desc: 'Ver evolução e exportar relatório', action: onGoTimeline },
    { id: 'settings', icon: <Icons.Settings className="w-5 h-5" />, label: 'Configurações', desc: 'Protocolos e privacidade', action: () => setShowSettings(true) },
  ];

  const faqs = [
    { q: "Posso treinar na Personal Group sem possuir um Personal Trainer?", a: "Sim, oferecemos suporte técnico de pista em todos os horários via Protocolos Exclusive." },
    { q: "Posso levar meu Personal para me dar treino?", a: "Temos políticas específicas para instrutores externos. Consulte a governança na recepção." },
    { q: "Tenho que pagar taxa de adesão?", a: "Consulte nossas condições vigentes com um consultor comercial." },
    { q: "A Personal Group possui algum convênio?", a: "Mantemos parcerias estratégicas em São Luís. Verifique a lista atualizada de integrações." }
  ];

  const [showPlan, setShowPlan] = useState(false);

  // Mock Data for Health/Bioimpedance
  const bioData = {
    current: { weight: 78.4, fat: 14.2, muscle: 42.1, visceral: 4, metaAge: 24 },
    previous: { weight: 79.2, fat: 15.8, muscle: 41.5, visceral: 5, metaAge: 26 },
    history: [
      { date: '10/01', weight: 82.0, fat: 18.0 },
      { date: '15/02', weight: 80.5, fat: 17.2 },
      { date: '20/03', weight: 79.2, fat: 15.8 },
      { date: '25/04', weight: 78.4, fat: 14.2 },
    ]
  };

  // Safe defaults for new fields
  const userPlan = user.plan || { type: 'PLATINUM', name: 'Platinum Flex', renewalDate: '15/05/2026', status: 'ACTIVE', price: 'R$ 489,00' };
  const userGamification = user.gamification || { level: 12, points: 2450, lounge: 'IRON' };

  return (
    <div className="flex flex-col transition-colors duration-500 relative px-6 pb-20 pt-2">
      <div className="precision-bg absolute inset-0 z-0 opacity-40"></div>

      <header className="relative z-10 flex flex-col items-center mb-8 pt-2">

        <div className="relative mb-6 group">
          {/* Sharp Avatar Border */}
          <div className="w-28 h-28 border border-white/10 p-1 group-hover:border-cobalt/50 transition-all duration-700 relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-cobalt/5 group-hover:bg-cobalt/10"></div>
            <div className="w-full h-full overflow-hidden bg-midnight relative z-10 rounded-2xl">
              <img src={user.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Avatar" />
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="absolute -bottom-3 -right-3 w-12 h-12 bg-cobalt text-white flex items-center justify-center border border-midnight shadow-[0_0_15px_rgba(0,182,253,0.5)] active:scale-90 transition-all z-20 cursor-pointer hover:bg-sky rounded-full"
          >
            <Icons.Edit className="w-5 h-5" />
          </button>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-none uppercase text-center">{user.name}</h2>
        <div className="flex items-center space-x-3 mt-5">
          <div className="w-2 h-2 bg-blue-600 shadow-[0_0_10px_#2563EB]"></div>
          <p className="text-xs text-blue-900 dark:text-blue-400 font-bold uppercase tracking-[0.3em] leading-none">Membro Experience Center</p>
          <div className="w-1 h-1 bg-slate-700"></div>
          <p className="text-xs text-amber-600 dark:text-yellow-500 font-bold uppercase tracking-[0.3em] leading-none">LVL {userGamification.level}</p>
        </div>
      </header>

      <div className="relative z-10 space-y-2 mb-8">
        {menuItems.map((item, idx) => (
          <div
            key={idx}
            onClick={item.action}
            className="glass-panel p-3.5 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all group border-white/5 hover:bg-white/[0.02] rounded-xl"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-500 flex items-center justify-center mr-4 group-hover:border-cobalt group-hover:text-cobalt transition-all rounded-lg">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-blue-950 dark:text-white tracking-tight uppercase leading-none">{item.label}</p>
                <p className="text-[10px] text-slate-700 dark:text-slate-400 font-bold uppercase tracking-widest mt-1 leading-none">{item.desc}</p>
              </div>
            </div>
            <Icons.ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
          </div>
        ))}
      </div>

      <section className="relative z-10 space-y-4 mb-10 px-2 text-left">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-[1px] bg-blue-600"></div>
          <h4 className="text-xs font-black text-blue-900 dark:text-slate-400 uppercase tracking-[0.3em] leading-none">Suporte & Inteligência</h4>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-panel border-white/5 overflow-hidden transition-all">
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className={`w-full p-6 text-left flex items-center justify-between transition-all duration-500 ${activeFaq === i ? 'bg-blue-600/10' : ''}`}
              >
                <div className="flex items-center space-x-5">
                  <span className={`w-2 h-2 transition-all duration-500 ${activeFaq === i ? 'bg-blue-600 shadow-[0_0_10px_#2563EB]' : 'bg-slate-400 dark:bg-slate-800'}`}></span>
                  <span className={`text-xs font-bold tracking-tight leading-tight uppercase ${activeFaq === i ? 'text-blue-950 dark:text-white' : 'text-slate-700 dark:text-slate-400'}`}>{faq.q}</span>
                </div>
                <Icons.Plus className={`w-4 h-4 shrink-0 transition-transform duration-700 text-slate-500 ${activeFaq === i ? 'rotate-45 text-blue-500' : ''}`} />
              </button>
              {activeFaq === i && (
                <div className="p-8 border-t border-white/5 text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed uppercase tracking-widest animate-in slide-in-from-top-4 duration-500">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <button
        onClick={onLogout}
        className="relative z-10 w-full h-16 border border-red-900/30 bg-red-950/10 text-red-500 font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 active:scale-[0.98] transition-all mb-12 hover:bg-red-950/20 rounded-xl"
      >
        Sair com Segurança
      </button>

      <footer className="relative z-10 text-center space-y-8 pt-10 border-t border-white/5">
        <div className="flex justify-center p-2 relative group">
          <img src="/logo.png" className="h-12 w-auto object-contain filter drop-shadow-[0_0_20px_rgba(0,182,253,0.4)] relative z-10 transition-transform duration-500 group-hover:scale-105" alt="PersonalGroup logo" />
        </div>
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-[0.3em] leading-none">Personal<span className="text-blue-600">Group</span></h4>
          <div className="space-y-2">
            <p className="text-[7px] text-slate-600 font-bold uppercase tracking-widest leading-relaxed">
              Av. Nina Rodrigues, Península <br/> 
              São Luís - Maranhão
            </p>
          </div>
          <div className="flex items-center justify-center space-x-6 text-[9px] font-bold">
            <span className="text-blue-500 tracking-widest">98 9 9133-2316</span>
            <div className="w-1 h-1 bg-white/20"></div>
            <span className="text-blue-500 tracking-widest">@PERSONALGROUP</span>
          </div>
        </div>
        <div className="pb-8 pt-6">
          <p className="text-[7px] font-bold text-slate-800 uppercase tracking-[0.8em]">Exclusive System v1.6.0 Stable</p>
        </div>
      </footer>

      {/* Edit Profile Modal/Overlay */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 dark:bg-midnight/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-modal p-8 rounded-[40px] shadow-2xl relative">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <Icons.X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-8 flex items-center gap-3">
              <Icons.User className="w-6 h-6 text-blue-500" />
              Editor de Perfil
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-widest mb-2">Nome de Exibição</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-ocean/50 border border-white/10 p-4 text-white font-bold tracking-wider focus:border-blue-500 focus:outline-none transition-colors placeholder:text-slate-700"
                  placeholder="SEU NOME"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-widest mb-2">URL do Avatar</label>
                <input
                  type="text"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full bg-ocean/50 border border-white/10 p-4 text-xs text-slate-300 font-mono tracking-tight focus:border-blue-500 focus:outline-none transition-colors placeholder:text-slate-700"
                  placeholder="https://..."
                />
                <p className="text-[9px] text-slate-600 mt-2 uppercase tracking-wide">Cole um link direto de imagem.</p>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-4 border border-slate-200 dark:border-white/10 text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 active:scale-95 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 py-4 bg-blue-600 text-white font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:bg-blue-500 active:scale-95 transition-all"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal/Overlay */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 dark:bg-midnight/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-modal p-8 rounded-[40px] shadow-2xl relative">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <Icons.X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-8 flex items-center gap-3">
              <Icons.Settings className="w-6 h-6 text-blue-500" />
              Configurações
            </h3>

            <div className="space-y-4">
              {['Notificações Push', 'Modo de Privacidade', 'Sincronização em 2º Plano', 'Alertas de Hidratação'].map((setting, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-ocean/40 border border-slate-200 dark:border-white/5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{setting}</span>
                  <div className="relative inline-block w-10 h-5 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" name={`toggle-${i}`} id={`toggle-${i}`} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-5" defaultChecked={i === 0 || i === 2} />
                    <label htmlFor={`toggle-${i}`} className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-800 cursor-pointer checked:bg-blue-600"></label>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between p-4 bg-blue-600/10 border border-blue-500/20">
                <div className="flex items-center space-x-3">
                  <Icons.User className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">FaceID / Biometria</span>
                </div>
                <div className="relative inline-block w-10 h-5 align-middle select-none transition duration-200 ease-in">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      onUpdateUser({
                        ...user,
                        biometricEnabled: e.target.checked
                      });
                    }}
                    checked={user.biometricEnabled}
                    className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white no-theme-fix border-4 border-transparent appearance-none cursor-pointer checked:right-0 right-5 transition-transform duration-300 ease-in-out"
                  />
                  <label className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-800 cursor-pointer checked:bg-blue-600"></label>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-[9px] text-slate-600 uppercase tracking-widest">ID do Dispositivo: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Health & Metrics Modal */}
      {showHealth && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-50/95 dark:bg-midnight/95 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-slate-50/95 dark:bg-midnight/95 z-40 backdrop-blur-md">
            <div>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] mb-1">Deep Health</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                Biometria
                <span className="px-2 py-0.5 bg-blue-600/20 text-blue-500 text-[10px] rounded-full border border-blue-500/30">AO VIVO</span>
              </h3>
            </div>
            <button
              onClick={() => setShowHealth(false)}
              className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-full hover:bg-white/10 transition-colors"
            >
              <Icons.X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="flex-1 p-8 space-y-12 pb-32">

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white dark:bg-ocean/50 border border-slate-200 dark:border-white/10 space-y-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Icons.TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Peso Atual</p>
                <div className="flex items-baseline space-x-1">
                  <h4 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tighter">{bioData.current.weight}</h4>
                  <span className="text-xs font-bold text-slate-600">kg</span>
                </div>
                <div className="flex items-center text-[9px] font-bold text-green-500 uppercase tracking-wider">
                  <span className="mr-1">▼</span>
                  {(bioData.previous.weight - bioData.current.weight).toFixed(1)}kg vs anterior
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-ocean/50 border border-slate-200 dark:border-white/10 space-y-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Icons.Activity className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Gordura Corporal</p>
                <div className="flex items-baseline space-x-1">
                  <h4 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tighter">{bioData.current.fat}</h4>
                  <span className="text-xs font-bold text-slate-600">%</span>
                </div>
                <div className="flex items-center text-[9px] font-bold text-green-500 uppercase tracking-wider">
                  <span className="mr-1">▼</span>
                  {(bioData.previous.fat - bioData.current.fat).toFixed(1)}% vs anterior
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-ocean/50 border border-slate-200 dark:border-white/10 space-y-2 col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Composição Corporal</p>
                  <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Bioimpedância Tetrapolar</span>
                </div>

                {/* Visual Bar for Body Comp */}
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      <span>Massa Muscular</span>
                      <span className="text-slate-900 dark:text-white">{bioData.current.muscle} kg</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-[55%] shadow-[0_0_10px_#2563EB]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      <span>Massa Gorda</span>
                      <span className="text-slate-900 dark:text-white">{(bioData.current.weight * (bioData.current.fat / 100)).toFixed(1)} kg</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 w-[18%]"></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
                  <div>
                    <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Gordura Visceral</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{bioData.current.visceral} <span className="text-[9px] text-green-500">Nível Ótimo</span></p>
                  </div>
                  <div>
                    <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Idade Metabólica</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{bioData.current.metaAge} <span className="text-[9px] text-slate-500">Anos</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Evolution Chart Simulation */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-[1px] bg-blue-600"></div>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] leading-none">Evolução 6 Meses</h4>
              </div>

              <div className="h-40 flex items-end justify-between px-2 gap-2">
                {bioData.history.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="relative w-full flex justify-center items-end h-full">
                      {/* Fat Bar */}
                      <div
                        className="w-2 bg-yellow-500/20 group-hover:bg-yellow-500 transition-colors rounded-t-sm absolute bottom-0"
                        style={{ height: `${h.fat * 3}%` }}
                      ></div>
                      {/* Weight Bar Overlay */}
                      <div
                        className="w-4 bg-slate-300 dark:bg-white/10 group-hover:bg-blue-600 transition-colors rounded-t-sm relative z-10 shadow-lg"
                        style={{ height: `${(h.weight - 50) * 3}%` }} // Scale adjustment
                      ></div>
                    </div>
                    <span className="text-[8px] font-bold text-slate-600 uppercase tracking-wider">{h.date}</span>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-midnight border border-white/20 p-2 text-[9px] font-bold uppercase tracking-widest text-white transition-opacity z-20 whitespace-nowrap">
                      {h.weight}kg // {h.fat}%
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600"></div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Peso (kg)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500/50"></div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Gordura (%)</span>
                </div>
              </div>
            </div>

            {/* Next Assessment Call to Action */}
            <button className="w-full py-6 border border-blue-600/30 bg-blue-600/5 text-blue-500 font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-all group">
              <Icons.ClipboardCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Agendar Nova Bioimpedância
            </button>
          </div>
        </div>
      )}

      {/* PLAN DETAILS MODAL */}
      {showPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 dark:bg-midnight/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-sm glass-panel p-8 rounded-[40px] shadow-2xl relative border-white/10">
            <button onClick={() => setShowPlan(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
              <Icons.X className="w-6 h-6" />
            </button>
            <div className="text-center mb-8">
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] mb-2">Assinatura</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter italic">Meu Plano<span className="text-blue-500">.</span></h3>
            </div>

            <div className="p-8 bg-blue-600/5 border border-blue-500/10 rounded-3xl text-center mb-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icons.Shield className="w-12 h-12" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-1 italic">{userPlan.name}</h4>
              <div className={`text-[10px] font-bold uppercase tracking-[0.2em] inline-flex items-center gap-2 px-3 py-1 rounded-full ${userPlan.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${userPlan.status === 'ACTIVE' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></span>
                {userPlan.status === 'ACTIVE' ? 'Status Ativo' : 'Pendente'}
              </div>
            </div>

            <div className="space-y-1 mb-8">
              <div className="flex justify-between items-center py-4 border-b border-white/5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Próxima Renovação</span>
                <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{userPlan.renewalDate}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-white/5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Investimento Mensal</span>
                <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{userPlan.price}</span>
              </div>
            </div>

            <button 
              className="w-full py-5 bg-midnight dark:bg-white text-white dark:text-midnight font-bold text-[10px] uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all rounded-2xl flex items-center justify-center gap-3"
              onClick={() => window.open('https://wa.me/5598999999999', '_blank')}
            >
              <Icons.Message className="w-4 h-4" />
              Falar com Consultor
            </button>
          </div>
        </div>
      )}


    </div>
  );
};

export default Profile;
