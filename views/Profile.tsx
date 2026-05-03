
import React, { useState } from 'react';
import { User } from '../types';
import { Icons } from '../constants';
import { useNavigate } from 'react-router-dom';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
  onGoTimeline?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout, onUpdateUser, onGoTimeline }) => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHealth, setShowHealth] = useState(false);

  // Edit State
  const [editName, setEditName] = useState(user.name);
  const [editAvatar, setEditAvatar] = useState(user.avatar);

  const handleSaveProfile = () => {
    onUpdateUser({
      ...user,
      name: editName,
      avatar: editAvatar
    });
    setIsEditing(false);
  };

  const formatarData = (data: string) => {
    // Simples retorno já que no mock já está formatada, 
    // mas preparado para ISO se vier do banco futuro.
    if (!data) return '';
    if (data.includes('-')) {
      const [year, month, day] = data.split('T')[0].split('-');
      return `${day}/${month}/${year}`;
    }
    return data;
  };

  const gerarConvite = () => setShowGuestPass(true);

  const menuItems = [
    { id: 'data', icon: <Icons.User className="w-5 h-5" />, label: 'Dados Pessoais', desc: 'Edite seu perfil e identificação', action: () => navigate('/edit-profile') },
    { id: 'plan', icon: <Icons.Shield className="w-5 h-5" />, label: 'Meu Plano', desc: 'Renovação e status financeiro', action: () => setShowPlan(true) },
    { id: 'guest', icon: <Icons.Users className="w-5 h-5" />, label: 'VIP Guest Pass', desc: 'Convide amigos para treinar', action: () => setShowGuestPass(true) },
    { id: 'health', icon: <Icons.Chart className="w-5 h-5" />, label: 'Deep Health', desc: 'Biometria e Evolução Corporal', action: () => setShowHealth(true) },
    { id: 'timeline', icon: <Icons.FileText className="w-5 h-5" />, label: 'Histórico & PDF', desc: 'Ver jornada e exportar relatório', action: onGoTimeline },
    { id: 'settings', icon: <Icons.Settings className="w-5 h-5" />, label: 'Configurações', desc: 'Protocolos e privacidade', action: () => setShowSettings(true) },
  ];

  const faqs = [
    { q: "Posso treinar na Personal Group sem possuir um Personal Trainer?", a: "Sim, oferecemos suporte técnico de pista em todos os horários via Protocolos Exclusive." },
    { q: "Posso levar meu Personal para me dar treino?", a: "Temos políticas específicas para instrutores externos. Consulte a governança na recepção." },
    { q: "Tenho que pagar taxa de adesão?", a: "Consulte nossas condições vigentes com um consultor comercial da unidade." },
    { q: "A Personal Group possui algum convênio?", a: "Mantemos parcerias estratégicas em São Luís. Verifique a lista atualizada de integrações." }
  ];

  const [showGuestPass, setShowGuestPass] = useState(false);
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
  const userGamification = user.gamification || { level: 12, points: 2450, club: 'IRON' };
  const progresso = user.progresso || {
    categoria: 'CONSTANTE',
    pontos: 1250,
    treinosNoMes: 12,
    diasSeguidos: 3,
    conquistasDesbloqueadas: ['first_session', 'month_consistent', 'water_hero']
  };
  const guestPasses = { available: user.guestPassesAvailable ?? 1, used: user.guestPassesUsed || [] };

  const categoriaNomes: Record<string, string> = {
    'INICIANTE': 'Ritmo Inicial',
    'DEDICADO': 'Movimento Ativo',
    'CONSTANTE': 'Hábito Saudável',
    'DESTAQUE': 'Foco & Vitalidade',
    'REFERENCIA': 'Exemplo de Vida'
  };

  const conquistasMocks = [
    { id: 'first_session', titulo: 'Primeiro Passo', icon: <Icons.Activity className="w-5 h-5" />, desc: 'Completou o primeiro treino' },
    { id: 'month_consistent', titulo: 'Hábito Mensal', icon: <Icons.Calendar className="w-5 h-5" />, desc: '12 treinos no mesmo mês' },
    { id: 'water_hero', titulo: 'Hidratação UP', icon: <Icons.CheckCircle className="w-5 h-5" />, desc: 'Manteve-se hidratado na semana' },
    { id: 'morning_star', titulo: 'Madrugador', icon: <Icons.Sun className="w-5 h-5" />, desc: 'Treinou antes das 08:00' },
  ];

  return (
    <div className="flex flex-col transition-colors duration-500 relative p-8 pb-32">
      <div className="precision-bg absolute inset-0 z-0 opacity-40"></div>

      <header className="relative z-10 flex flex-col items-center mb-20 pt-4">

        <div className="relative mb-10 group">
          {/* Sharp Avatar Border */}
          <div className="w-44 h-44 border border-white/10 p-1 group-hover:border-cobalt/50 transition-all duration-700 relative rounded-2xl overflow-hidden">
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
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight leading-none uppercase text-center">{user.name}</h2>
        <div className="flex items-center space-x-3 mt-5">
          <div className="w-2 h-2 bg-blue-600 shadow-[0_0_10px_#2563EB]"></div>
          <p className="text-xs text-blue-900 dark:text-blue-400 font-bold uppercase tracking-[0.3em] leading-none">Membro Exclusive Center</p>
          <div className="w-1 h-1 bg-slate-700"></div>
          <p className="text-xs text-pg-cobalt font-bold uppercase tracking-[0.3em] leading-none">{categoriaNomes[progresso.categoria]}</p>
        </div>
      </header>

      {/* Gamificação: Categoria & Conquistas */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {/* Card de Categoria - Estilo Apple Health Rings */}
        <div className="glass-panel p-6 border-white/5 bg-gradient-to-br from-pg-cobalt/5 to-transparent rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-[10px] font-bold text-pg-cobalt uppercase tracking-[0.2em] mb-1">Status de Atividade</p>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">{categoriaNomes[progresso.categoria]}</h4>
            </div>
            
            {/* Health Ring Visual */}
            <div className="relative w-16 h-16">
              <svg className="health-ring w-full h-full" viewBox="0 0 36 36">
                <circle
                  cx="18" cy="18" r="16"
                  fill="none"
                  className="stroke-pg-cobalt/10"
                  strokeWidth="3"
                />
                <circle
                  cx="18" cy="18" r="16"
                  fill="none"
                  className="health-ring-circle stroke-pg-cobalt"
                  strokeWidth="3"
                  strokeDasharray="100, 100"
                  strokeDashoffset={100 - (progresso.treinosNoMes / 15) * 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Icons.Activity className="w-5 h-5 text-pg-cobalt" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Progresso Mensal</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">{progresso.treinosNoMes}<span className="text-[10px] text-slate-400 font-bold ml-1">/ 15</span></span>
            </div>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium uppercase leading-relaxed tracking-wider">
              {progresso.treinosNoMes >= 12 
                ? "Incrível! Você está mantendo uma constância de elite." 
                : `Faltam apenas ${15 - progresso.treinosNoMes} sessões para subir de nível.`}
            </p>
          </div>
        </div>

        {/* Grid de Conquistas (Selos) */}
        <div className="glass-panel p-6 border-white/5 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Minhas Conquistas</p>
          <div className="grid grid-cols-4 gap-3">
            {conquistasMocks.map(conquista => {
              const isUnlocked = progresso.conquistasDesbloqueadas.includes(conquista.id);
              return (
                <div key={conquista.id} className="relative group cursor-help">
                  <div className={`w-full aspect-square border ${isUnlocked ? 'border-pg-cobalt/30 bg-pg-cobalt/5' : 'border-white/5 bg-white/0 opacity-30'} flex items-center justify-center transition-all duration-500 rounded-xl`}>
                    <div className={isUnlocked ? 'text-pg-cobalt' : 'text-slate-600'}>
                      {conquista.icon}
                    </div>
                  </div>
                  {/* Tooltip simples */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-24 p-2 bg-pg-midnight border border-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                    <p className="text-[8px] font-bold text-white uppercase text-center">{conquista.titulo}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cartões de Status do Plano e Guest Pass */}
      <section className="relative z-10 mb-10 space-y-4">
        {userPlan && (
          <div className="glass-panel p-6 border-white/5 bg-pg-surface-dark/40 rounded-2xl">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Icons.Shield className="w-4 h-4 text-pg-cobalt" />
                <h3 className="text-white font-bold text-xs uppercase tracking-widest">Meu plano</h3>
              </div>
              <span
                className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                  userPlan.status === 'ACTIVE'
                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                    : userPlan.status === 'PENDING'
                    ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}
              >
                {userPlan.status === 'ACTIVE' ? 'Em dia' : userPlan.status === 'PENDING' ? 'Pendente' : 'Vencido'}
              </span>
            </div>

            {/* Nome do plano */}
            <p className="text-2xl font-black text-white mb-1 uppercase tracking-tight">{userPlan.name}</p>
            
            {/* Vencimento */}
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              {userPlan.status === 'ACTIVE'
                ? `Renovação em ${formatarData(userPlan.renewalDate)}`
                : `Venceu em ${formatarData(userPlan.renewalDate)}`}
            </p>

            {/* CTA — somente contato, sem ação financeira no app */}
            <a
              href="https://wa.me/5598991332316?text=Olá! Gostaria de falar sobre meu plano."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 w-full py-4 
                         rounded-xl border border-pg-cobalt/30 text-pg-cobalt text-[10px] font-bold uppercase tracking-widest
                         hover:bg-pg-cobalt/5 transition-all active:scale-[0.98]"
            >
              <Icons.MessageCircle className="w-4 h-4" />
              Falar com a recepção sobre meu plano
            </a>
          </div>
        )}

        {guestPasses.available > 0 && (
          <div className="glass-panel p-6 border-pg-cobalt/20 bg-pg-cobalt/5 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Icons.Users className="w-12 h-12 text-pg-cobalt" />
            </div>
            
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-2">Convide um amigo</h3>
            <p className="text-slate-400 text-[10px] font-medium uppercase leading-relaxed tracking-wider mb-6 max-w-[280px]">
              Você tem {guestPasses.available} {guestPasses.available === 1 ? 'convite disponível' : 'convites disponíveis'} 
              este mês. Seu amigo poderá treinar um dia com você!
            </p>
            <button
              onClick={gerarConvite}
              className="w-full py-4 rounded-xl bg-pg-cobalt text-midnight font-black text-[10px] uppercase tracking-[0.2em] 
                         shadow-[0_0_20px_rgba(0,182,253,0.3)] hover:bg-sky transition-all active:scale-[0.98]"
            >
              Gerar QR Code de convite
            </button>
            <p className="text-slate-500 text-[8px] font-bold uppercase tracking-widest mt-4 text-center">
              Necessário validação na recepção no dia da visita.
            </p>
          </div>
        )}
      </section>

      <div className="relative z-10 space-y-4 mb-20">
        {menuItems.map((item, idx) => (
          <div
            key={idx}
            onClick={item.action}
            className="glass-panel p-8 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all group border-white/5 hover:bg-white/[0.02] rounded-2xl"
          >
            <div className="flex items-center">
              <div className="w-14 h-14 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-500 flex items-center justify-center mr-6 group-hover:border-cobalt group-hover:text-cobalt transition-all rounded-xl">
                {item.icon}
              </div>
              <div>
                <p className="text-lg font-bold text-blue-950 dark:text-white tracking-tight uppercase leading-none">{item.label}</p>
                <p className="text-xs text-slate-700 dark:text-slate-400 font-bold uppercase tracking-widest mt-2 leading-none">{item.desc}</p>
              </div>
            </div>
            <Icons.ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
          </div>
        ))}
      </div>

      <section className="relative z-10 space-y-8 mb-20 px-2 text-left">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-[1px] bg-blue-600"></div>
          <h4 className="text-xs font-black text-blue-900 dark:text-slate-400 uppercase tracking-[0.3em] leading-none">Suporte & Deep Intel</h4>
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
        className="relative z-10 w-full h-20 border border-red-900/30 bg-red-950/10 text-red-500 font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 active:scale-[0.98] transition-all mb-24 hover:bg-red-950/20 rounded-full"
      >
        Encerrar Sessão Segura
      </button>

      <footer className="relative z-10 text-center space-y-12 pt-20 border-t border-white/5">
        <div className="flex justify-center p-2 relative group">
          <img src="/logo.png" className="h-16 w-auto object-contain filter drop-shadow-[0_0_20px_rgba(0,182,253,0.4)] relative z-10 transition-transform duration-500 group-hover:scale-105" alt="PersonalGroup logo" />
        </div>
        <div className="space-y-6">
          <h4 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-[0.3em] leading-none">Personal<span className="text-blue-600">Group</span></h4>
          <div className="space-y-3">
            <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">{user.unit ? user.unit : 'Unidade Península Jardins'} // São Luís - Maranhão</p>
          </div>
          <div className="flex items-center justify-center space-x-6 text-[10px] font-bold">
            <span className="text-blue-500 tracking-widest">98 9 9133-2316</span>
            <div className="w-1 h-1 bg-white/20"></div>
            <span className="text-blue-500 tracking-widest">@PERSONALGROUP</span>
          </div>
        </div>
        <div className="pb-16 pt-10">
          <p className="text-[7px] font-bold text-slate-800 uppercase tracking-[0.8em]">Exclusive Journey v1.6.0 Stable</p>
        </div>
      </footer>

      {/* Edit Profile Modal/Overlay */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 dark:bg-midnight/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white dark:bg-ocean border border-slate-200 dark:border-white/10 p-8 shadow-2xl relative">
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
          <div className="w-full max-w-md bg-white dark:bg-ocean border border-slate-200 dark:border-white/10 p-8 shadow-2xl relative">
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
                  <Icons.Users className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Exibir no Mural da Constância</span>
                </div>
                <div className="relative inline-block w-10 h-5 align-middle select-none transition duration-200 ease-in">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      onUpdateUser({
                        ...user,
                        showInRanking: e.target.checked
                      });
                    }}
                    checked={user.showInRanking !== false} // Default true
                    className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-5"
                  />
                  <label className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-800 cursor-pointer checked:bg-blue-600"></label>
                </div>
              </div>

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
                    className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-5"
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
                <span className="px-2 py-0.5 bg-blue-600/20 text-blue-500 text-[10px] rounded-full border border-blue-500/30">LIVE</span>
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

            {/* Main Stats Grid - Apple Health Style Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white dark:bg-ocean/30 border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm space-y-3">
                <div className="flex items-center space-x-2 text-pg-cobalt">
                  <Icons.TrendingUp className="w-4 h-4" />
                  <p className="text-[9px] font-bold uppercase tracking-widest">Peso Corporal</p>
                </div>
                <div className="flex items-baseline space-x-1">
                  <h4 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{bioData.current.weight}</h4>
                  <span className="text-xs font-bold text-slate-400">kg</span>
                </div>
                <div className="flex items-center text-[9px] font-bold text-green-500 uppercase bg-green-500/10 px-2 py-1 rounded-full w-fit">
                  <span className="mr-1">↓</span>
                  {(bioData.previous.weight - bioData.current.weight).toFixed(1)} kg
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-ocean/30 border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm space-y-3">
                <div className="flex items-center space-x-2 text-red-500">
                  <Icons.Activity className="w-4 h-4" />
                  <p className="text-[9px] font-bold uppercase tracking-widest">Gordura</p>
                </div>
                <div className="flex items-baseline space-x-1">
                  <h4 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{bioData.current.fat}</h4>
                  <span className="text-xs font-bold text-slate-400">%</span>
                </div>
                <div className="flex items-center text-[9px] font-bold text-green-500 uppercase bg-green-500/10 px-2 py-1 rounded-full w-fit">
                  <span className="mr-1">↓</span>
                  {(bioData.previous.fat - bioData.current.fat).toFixed(1)}%
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-ocean/30 border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm col-span-2 space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Composição de Tecidos</p>
                  <Icons.Info className="w-4 h-4 text-slate-300" />
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
                      <span className="text-slate-500">Massa Muscular</span>
                      <span className="text-slate-900 dark:text-white">{bioData.current.muscle} kg</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-pg-cobalt rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
                      <span className="text-slate-500">Massa Gorda</span>
                      <span className="text-slate-900 dark:text-white">{(bioData.current.weight * (bioData.current.fat / 100)).toFixed(1)} kg</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
                  <div>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Gordura Visceral</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">Nível {bioData.current.visceral}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Metabolismo</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{bioData.current.metaAge} anos</p>
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
          <div className="w-full max-w-sm bg-white dark:bg-ocean border border-slate-200 dark:border-white/10 p-8 shadow-2xl relative">
            <button onClick={() => setShowPlan(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
              <Icons.X className="w-6 h-6" />
            </button>
            <div className="text-center mb-8">
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] mb-2">Status Financeiro</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Meu Plano</h3>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center mb-8">
              <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-1">{userPlan.name}</h4>
              <p className={`text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 ${userPlan.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}`}>
                <span className={`w-2 h-2 rounded-full ${userPlan.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {userPlan.status === 'ACTIVE' ? 'Ativo' : 'Pendente'}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400 border-b border-white/5 pb-2">
                <span>Renovação</span>
                <span className="text-slate-900 dark:text-white">{userPlan.renewalDate}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400 border-b border-white/5 pb-2">
                <span>Valor Mensal</span>
                <span className="text-slate-900 dark:text-white">{userPlan.price}</span>
              </div>
            </div>

            <button className="w-full py-4 bg-green-600 text-white font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-green-500 active:scale-95 transition-all flex items-center justify-center gap-2">
              <Icons.Message className="w-4 h-4" />
              Falar com Gerente
            </button>
          </div>
        </div>
      )}

      {/* GUEST PASS MODAL */}
      {showGuestPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 dark:bg-midnight/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white dark:bg-ocean border border-slate-200 dark:border-white/10 p-8 shadow-2xl relative text-center">
            <button onClick={() => setShowGuestPass(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
              <Icons.X className="w-6 h-6" />
            </button>

            <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-yellow-500/30">
              <Icons.Star className="w-10 h-10 text-yellow-500" />
            </div>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-2">Guest Pass VIP</h3>
            <p className="text-xs text-slate-500 mb-8 max-w-[200px] mx-auto">Convide um amigo para viver a experiência Personal Group por um dia.</p>

            <div className="p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-8">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Convites Disponíveis</p>
              <h4 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{guestPasses.available}</h4>
              <p className="text-[10px] text-slate-400 mt-2">Renova em 01/02</p>
            </div>

            {guestPasses.available > 0 ? (
              <button className="w-full py-4 bg-yellow-600 text-white font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-yellow-500 active:scale-95 transition-all flex items-center justify-center gap-2">
                <Icons.QRCode className="w-4 h-4" />
                Gerar Convite
              </button>
            ) : (
              <button disabled className="w-full py-4 bg-slate-700 text-slate-500 font-bold text-xs uppercase tracking-widest cursor-not-allowed">
                Sem convites este mês
              </button>
            )}

            <p className="text-[9px] text-slate-500 mt-6">* Necessário validação e cadastro na recepção com documento com foto.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
