import React, { useState, useEffect } from 'react';
import { User, UserRole, Protocol } from '../types';
import { getProtocolById, subscribeToActiveStaff } from '../firebase';
import { StudentHome } from '../components/home/StudentHome';
import { PersonalHome } from '../components/home/PersonalHome';
import { Icons } from '../constants';

interface HomeProps {
  user: User;
  onStartSession?: (student?: User) => void;
  onGoWellness?: () => void;
  onGoTimeline?: () => void;
  onGoMessages?: () => void;
  onGoAgenda?: () => void;
  onGoCheckIn?: () => void;
  onGoClub?: () => void;
  onGoEvolution?: () => void;
  onGoAdmin?: () => void;
  onGoSupport?: () => void;
  onGoRanking?: () => void;
  onGoWearables?: () => void;
  onGoExplore?: () => void;
  onGoComunidade?: () => void;
}

const Home: React.FC<HomeProps> = ({
  user,
  onStartSession,
  onGoWellness,
  onGoTimeline,
  onGoMessages,
  onGoAgenda,
  onGoCheckIn,
  onGoClub,
  onGoEvolution,
  onGoAdmin,
  onGoSupport,
  onGoRanking,
  onGoWearables,
  onGoExplore,
  onGoComunidade
}) => {
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [loadingProtocol, setLoadingProtocol] = useState(false);
  const [activeStaff, setActiveStaff] = useState<User[]>([]);
  const [showBlackCard, setShowBlackCard] = useState(false);
  const [lastRecap, setLastRecap] = useState<any>(null);

  useEffect(() => {
    // Mock simulation for the recap to show the value immediately
    setLastRecap({
      title: 'Treino Destruído!',
      message: 'Seu treinador notou melhoria impressionante na postura da Remada e aumento de resistência. Continue assim!',
      date: 'Ontem',
      rpe: 8
    });
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToActiveStaff((staff) => {
      setActiveStaff(staff);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user.currentCycle?.protocolId) {
      setLoadingProtocol(true);
      getProtocolById(user.currentCycle.protocolId)
        .then(setProtocol)
        .finally(() => setLoadingProtocol(false));
    }
  }, [user.currentCycle?.protocolId]);

  return (
    <div className="min-h-screen bg-app transition-colors duration-1000 relative">
      <div className="precision-bg min-h-screen">
        {user.role === UserRole.PERSONAL ? (
          <PersonalHome user={user} onGoAgenda={onGoAgenda} />
        ) : (
          <StudentHome
            user={user}
            protocol={protocol}
            loadingProtocol={loadingProtocol}
            activeStaff={activeStaff}
            lastRecap={lastRecap}
            setShowBlackCard={setShowBlackCard}
            onStartSession={() => onStartSession?.()}
            onGoClub={onGoClub}
            onGoAdmin={onGoAdmin}
            onGoSupport={onGoSupport}
            onGoEvolution={onGoEvolution}
            onGoWellness={onGoWellness}
            onGoTimeline={onGoTimeline}
            onGoMessages={onGoMessages}
            onGoAgenda={onGoAgenda}
            onGoCheckIn={onGoCheckIn}
            onGoRanking={onGoRanking}
            onGoWearables={onGoWearables}
            onGoExplore={onGoExplore}
          />
        )}
      </div>

      {/* BLACK CARD QR MODAL */}
      {showBlackCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80 animate-in fade-in duration-500" onClick={() => setShowBlackCard(false)}>
          <div className="relative w-full max-w-sm aspect-[1/1.6] rounded-[40px] overflow-hidden shadow-[0_0_80px_rgba(37,99,235,0.25)] animate-in zoom-in-95 slide-in-from-bottom-20 duration-500 flex flex-col justify-between p-10 border border-white/10"
            style={{ background: 'linear-gradient(160deg, #1e293b 0%, #0f172a 100%)' }} onClick={(e) => e.stopPropagation()}>

            {/* Premium background effects */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.15),transparent_50%)]"></div>
            <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.1),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay"></div>

            <div className="relative z-10 flex justify-between items-start">
              <div className="space-y-4">
                <div className="w-12 h-12 glass-surface rounded-2xl flex items-center justify-center border border-white/10 shadow-xl">
                    <Icons.LogoSymbol className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                </div>
                <div>
                    <h2 className="text-white font-black uppercase tracking-[0.4em] text-[10px] opacity-50 mb-1">Personal Group</h2>
                    <h3 className="text-white font-display text-3xl font-bold leading-none uppercase tracking-tighter">Access<br />Digital</h3>
                </div>
              </div>
              <button 
                onClick={() => setShowBlackCard(false)} 
                className="w-12 h-12 rounded-2xl glass-surface border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all active:scale-90"
              >
                <Icons.X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative z-10 flex flex-col items-center py-10">
              <div className="w-56 h-56 bg-white p-6 rounded-[32px] shadow-[0_0_50px_rgba(255,255,255,0.2)] mb-8 flex flex-col items-center justify-center group relative overflow-hidden">
                <div className="absolute inset-0 bg-pg-cobalt/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {/* Fake QR using grid for pure CSS visual - avoids dependency */}
                <div className="w-full h-full grid grid-cols-6 grid-rows-6 gap-1.5 opacity-90 relative">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className={`bg-slate-900 rounded-sm ${(i % 5 === 0 || i % 7 === 0 || i % 3 === 0 || i === 14 || i === 22) ? 'opacity-100' : 'opacity-0'}`}></div>
                  ))}
                  <div className="absolute top-0 left-0 w-10 h-10 border-[6px] border-slate-900 rounded-lg"></div>
                  <div className="absolute top-0 right-0 w-10 h-10 border-[6px] border-slate-900 rounded-lg"></div>
                  <div className="absolute bottom-0 left-0 w-10 h-10 border-[6px] border-slate-900 rounded-lg"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg border border-slate-100">
                        <div className="w-6 h-6 bg-slate-900 rounded-md"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-amber-500 font-black text-[11px] uppercase tracking-[0.4em] animate-pulse">Aproxime do Leitor</p>
                <p className="text-white font-bold text-xl tracking-wide uppercase font-display">{user.name}</p>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-8">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none">Membro Since</p>
                <p className="text-sm font-bold text-white uppercase tracking-widest font-display">2026</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest leading-none">Membership</p>
                <p className="text-sm font-bold text-amber-500 uppercase tracking-widest font-display shadow-sm">Platinum Flex</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
