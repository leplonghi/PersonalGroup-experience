
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
  onGoExplore
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowBlackCard(false)}>
          <div className="relative w-full max-w-sm aspect-[1/1.6] rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)] animate-in zoom-in-95 slide-in-from-bottom-10 flex flex-col justify-between p-8"
            style={{ background: 'linear-gradient(145deg, #1e293b, #0f172a)' }} onClick={(e) => e.stopPropagation()}>

            {/* Shiny border effect */}
            <div className="absolute inset-0 border-[2px] border-white/10 rounded-[32px] pointer-events-none"></div>
            <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-white/10 to-transparent rotate-45 pointer-events-none mix-blend-overlay"></div>

            <div className="relative z-10 flex justify-between items-start">
              <div>
                <Icons.LogoSymbol className="w-10 h-10 object-contain text-white" />
                <h2 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mt-4 opacity-80">Personal Group</h2>
                <h3 className="text-white font-display text-2xl mt-1 leading-none uppercase tracking-tight">Access<br />Card</h3>
              </div>
              <button onClick={() => setShowBlackCard(false)} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/50 hover:text-white transition-colors">
                <Icons.X className="w-5 h-5 pointer-events-none" />
              </button>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-48 h-48 bg-white p-4 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)] mb-6 flex flex-col items-center justify-center">
                {/* Fake QR using grid for pure CSS visual - avoids dependency */}
                <div className="w-full h-full grid grid-cols-6 grid-rows-6 gap-1 opacity-90 relative">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className={`bg-black rounded-sm ${(i % 5 === 0 || i % 7 === 0 || i % 3 === 0) ? 'opacity-100' : 'opacity-0'}`}></div>
                  ))}
                  <div className="absolute top-0 left-0 w-8 h-8 border-4 border-black rounded-md"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-4 border-black rounded-md"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-4 border-black rounded-md"></div>
                </div>
              </div>
              <p className="text-white/50 font-black text-[10px] uppercase tracking-[0.3em] mb-1">Aproxime da Catraca</p>
              <p className="text-white font-black tracking-widest uppercase">{user.name}</p>
            </div>

            <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6">
              <div>
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Membro desde</p>
                <p className="text-xs font-bold text-white uppercase tracking-widest">2026</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest">Status</p>
                <p className="text-xs font-bold text-amber-500 uppercase tracking-widest shadow-sm">Ativo (Premium)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
