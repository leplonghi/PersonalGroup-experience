import React from 'react';
import { User } from '../types';
import { Icons } from '../constants';

interface StudentHubProps {
    user: User;
    onLogout: () => void;
    onNavigateTo: (view: string) => void;
}

const StudentHub: React.FC<StudentHubProps> = ({ user, onLogout, onNavigateTo }) => {
    return (
        <div className="min-h-screen p-5 pb-32 space-y-6 animate-in fade-in duration-700"
             style={{ background: 'linear-gradient(180deg, #010b2e 0%, #00060f 40%, #010e35 100%)' }}>

            {/* ── HEADER ── */}
            <div className="pt-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight">Perfil<span className="text-pg-cobalt">.</span></h1>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.4em] mt-1">Seu espaço pessoal</p>
                </div>
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_20px_rgba(0,182,253,0.2)]">
                    <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="avatar" className="w-full h-full object-cover" />
                </div>
            </div>

            {/* ── XP PROGRESS ── */}
            <div className="p-4 rounded-2xl border border-white/[0.06]"
                 style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Evolução PG</span>
                    <span className="text-[10px] font-black text-pg-cobalt uppercase tracking-[0.15em]">2.450 / 3.000 XP</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pg-cobalt to-indigo-500 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.5)]" style={{ width: '82%' }} />
                </div>
                <div className="flex justify-between mt-2">
                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Elite Member</span>
                    <span className="text-[9px] font-bold text-pg-cobalt uppercase tracking-widest">→ Black Card</span>
                </div>
            </div>

            {/* ── MENU GRID ── */}
            <div className="grid grid-cols-2 gap-3">
                <button onClick={() => onNavigateTo('evolution')}
                    className="p-4 rounded-2xl border border-white/[0.06] text-left transition-all active:scale-[0.98] hover:border-white/[0.12]"
                    style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}>
                    <div className="w-10 h-10 rounded-xl bg-pg-cobalt/10 border border-pg-cobalt/20 flex items-center justify-center mb-3">
                        <Icons.Activity className="w-5 h-5 text-pg-cobalt" />
                    </div>
                    <p className="text-sm font-bold text-white">Evolução</p>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-0.5">Gráficos e histórico</p>
                </button>

                <button onClick={() => onNavigateTo('frequency')}
                    className="p-4 rounded-2xl border border-white/[0.06] text-left transition-all active:scale-[0.98] hover:border-white/[0.12]"
                    style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}>
                    <div className="w-10 h-10 rounded-xl bg-pg-cobalt/10 border border-pg-cobalt/20 flex items-center justify-center mb-3">
                        <Icons.Calendar className="w-5 h-5 text-pg-cobalt" />
                    </div>
                    <p className="text-sm font-bold text-white">Frequência</p>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-0.5">Controle de presença</p>
                </button>

                <button onClick={() => onNavigateTo('messages')}
                    className="p-4 rounded-2xl border border-white/[0.06] text-left transition-all active:scale-[0.98] hover:border-white/[0.12]"
                    style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}>
                    <div className="w-10 h-10 rounded-xl bg-pg-cobalt/10 border border-pg-cobalt/20 flex items-center justify-center mb-3">
                        <Icons.Message className="w-5 h-5 text-pg-cobalt" />
                    </div>
                    <p className="text-sm font-bold text-white">Mensagens</p>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-0.5">Chat com equipe</p>
                </button>

                <button onClick={() => onNavigateTo('wearables')}
                    className="p-4 rounded-2xl border border-white/[0.06] text-left transition-all active:scale-[0.98] hover:border-white/[0.12]"
                    style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}>
                    <div className="w-10 h-10 rounded-xl bg-pg-cobalt/10 border border-pg-cobalt/20 flex items-center justify-center mb-3">
                        <Icons.Smartphone className="w-5 h-5 text-pg-cobalt" />
                    </div>
                    <p className="text-sm font-bold text-white">Wearables</p>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-0.5">Dispositivos conectados</p>
                </button>

                <button onClick={() => onNavigateTo('edit-profile')}
                    className="p-4 rounded-2xl border border-white/[0.06] text-left transition-all active:scale-[0.98] hover:border-white/[0.12]"
                    style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}>
                    <div className="w-10 h-10 rounded-xl bg-pg-cobalt/10 border border-pg-cobalt/20 flex items-center justify-center mb-3">
                        <Icons.Settings className="w-5 h-5 text-pg-cobalt" />
                    </div>
                    <p className="text-sm font-bold text-white">Configurações</p>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-0.5">Editar perfil e dados</p>
                </button>

                <button onClick={() => onNavigateTo('support')}
                    className="p-4 rounded-2xl border border-white/[0.06] text-left transition-all active:scale-[0.98] hover:border-white/[0.12]"
                    style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}>
                    <div className="w-10 h-10 rounded-xl bg-pg-cobalt/10 border border-pg-cobalt/20 flex items-center justify-center mb-3">
                        <Icons.Info className="w-5 h-5 text-pg-cobalt" />
                    </div>
                    <p className="text-sm font-bold text-white">Suporte</p>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-0.5">Ajuda e contato</p>
                </button>
            </div>

            {/* ── LOGOUT ── */}
            <button onClick={onLogout}
                className="w-full py-4 rounded-2xl border border-red-500/20 text-red-400 font-black text-[11px] uppercase tracking-widest
                           hover:bg-red-500/10 transition-all active:scale-[0.98]">
                Sair da conta
            </button>
        </div>
    );
};

export default StudentHub;
