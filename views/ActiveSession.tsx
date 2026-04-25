import React, { useState, useEffect, useCallback } from 'react';
import { Icons } from '../constants';
import { RPEValue, SessionLog, User, Protocol, LiveSession } from '../types';
import { INITIAL_EXERCISES } from '../data/exercises';
import { 
  getProtocolById, 
  subscribeToLiveSession, 
  updateLiveSession, 
  startLiveSession, 
  endLiveSession, 
  logSession 
} from '../firebase';

interface ActiveSessionProps {
  user: User;
  executor: User;
  onFinish: () => void;
}

const MOTIVATIONAL_PHRASES = [
  "Mantenha o foco, cada repetição te aproxima do objetivo!",
  "A consistência é a chave para o resultado extraordinário.",
  "Sinta a contração, controle cada fase do movimento.",
  "Você é seu único limite. Supere-se hoje!",
  "Respiração controlada, mente presente, corpo em evolução.",
  "O treino de hoje constrói o corpo de amanhã.",
  "Não pare quando estiver cansado, pare quando terminar.",
  "Qualidade acima de quantidade. Execute com perfeição."
];

const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000; // 8 horas

const clearSessionStorage = () => {
  localStorage.removeItem('pg-session-ex-idx');
  localStorage.removeItem('pg-session-set');
  localStorage.removeItem('pg-session-logs');
  localStorage.removeItem('pg-session-ts');
};

const isSessionStorageValid = () => {
  const ts = localStorage.getItem('pg-session-ts');
  if (!ts) return false;
  return Date.now() - parseInt(ts) < SESSION_MAX_AGE_MS;
};

const ActiveSession: React.FC<ActiveSessionProps> = ({ user, executor, onFinish }) => {
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(() => {
    if (!isSessionStorageValid()) { clearSessionStorage(); return 0; }
    const saved = localStorage.getItem('pg-session-ex-idx');
    return saved ? parseInt(saved) : 0;
  });
  const [currentCoachName, setCurrentCoachName] = useState<string | null>(null);

  const handleReportIssue = () => {
    if (currentExerciseIdx < exercises.length - 1) {
      triggerHaptic(50);
      setCurrentExerciseIdx(prev => prev + 1);
      setCurrentSet(1);
      setIsResting(false);
    } else {
      setIsFinishing(true);
    }
  };

  const [currentSet, setCurrentSet] = useState(() => {
    if (!isSessionStorageValid()) return 1;
    const saved = localStorage.getItem('pg-session-set');
    return saved ? parseInt(saved) : 1;
  });

  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>(() => {
    if (!isSessionStorageValid()) return [];
    const saved = localStorage.getItem('pg-session-logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [exercises, setExercises] = useState<any[]>(INITIAL_EXERCISES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProtocol = async () => {
      if (user.currentCycle?.protocolId) {
        try {
          const proto = await getProtocolById(user.currentCycle.protocolId);
          if (proto && proto.exercises.length > 0) {
            setExercises(proto.exercises);
          }
        } catch (e) {
          console.error("Error loading protocol for session:", e);
        }
      }
      setIsLoading(false);
    };
    loadProtocol();
  }, [user.currentCycle?.protocolId]);

  const currentExercise = exercises[currentExerciseIdx] || exercises[0] || INITIAL_EXERCISES[0];

  const [isFinishing, setIsFinishing] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [showingVideo, setShowingVideo] = useState(false);
  const [restTime, setRestTime] = useState(60);
  const [trackingMode, setTrackingMode] = useState<'REPS' | 'TIME'>('REPS');

  const [weight, setWeight] = useState(currentExercise.weight);
  const [volumeValue, setVolumeValue] = useState(12);
  const [rpe, setRpe] = useState<RPEValue>(7);
  const [isLiveSessionActive, setIsLiveSessionActive] = useState(false);

  const isStaff = executor.role === 'PERSONAL' || executor.role === 'CHEFE' || executor.role === 'ADMIN';
  const hasControl = isStaff || (executor.role === 'ALUNO' && !isLiveSessionActive);

  // --- Real-time Sync Logic ---
  useEffect(() => {
    // If student, subscribe to live session
    if (executor.role === 'ALUNO') {
      const unsub = subscribeToLiveSession(user.id, (session) => {
        if (session) {
          setIsLiveSessionActive(true);
          setCurrentExerciseIdx(session.currentExerciseIdx);
          setCurrentSet(session.currentSet);
          setIsResting(session.isResting);
          setRestTime(session.restTimeRemaining);
          setSessionLogs(session.logs);
          setCurrentCoachName(session.personalName || null);
          if (session.status === 'FINISHED') {
            setIsFinishing(true);
          }
        } else {
          setIsLiveSessionActive(false);
        }
      });
      return () => unsub();
    } else if (isStaff) {
      // If staff, initialize live session if not already there
      startLiveSession(user.id, executor.id, executor.name, user.currentCycle?.protocolId || '');
    }
  }, [user.id, executor.id, executor.role, user.currentCycle?.protocolId]);

  // Sync Staff state to Firestore
  useEffect(() => {
    if (isStaff) {
      updateLiveSession(user.id, {
        currentExerciseIdx,
        currentSet,
        isResting,
        restTimeRemaining: restTime,
        logs: sessionLogs
      });
    }
  }, [isStaff, user.id, currentExerciseIdx, currentSet, isResting, restTime, sessionLogs]);

  // Persistence Effects (Only for Staff or Solo Mode / Local redundancy)
  useEffect(() => {
    if (hasControl) {
      if (!localStorage.getItem('pg-session-ts')) {
        localStorage.setItem('pg-session-ts', Date.now().toString());
      }
      localStorage.setItem('pg-session-ex-idx', currentExerciseIdx.toString());
    }
  }, [currentExerciseIdx, hasControl]);

  useEffect(() => {
    if (hasControl) {
      localStorage.setItem('pg-session-set', currentSet.toString());
    }
  }, [currentSet, hasControl]);

  useEffect(() => {
    if (hasControl) {
      localStorage.setItem('pg-session-logs', JSON.stringify(sessionLogs));
    }
  }, [sessionLogs, hasControl]);

  // Reset exercise-specific state when exercise changes
  useEffect(() => {
    setWeight(currentExercise.weight);
    setVolumeValue(trackingMode === 'REPS' ? 12 : 45);
    setRpe(7);
  }, [currentExercise, trackingMode]);

  const triggerHaptic = useCallback((pattern: number | number[]) => {
    if ('vibrate' in navigator) navigator.vibrate(pattern);
  }, []);

  useEffect(() => {
    let timer: any;
    if (isResting && restTime > 0) {
      timer = setInterval(() => setRestTime(prev => prev - 1), 1000);
    } else if (restTime === 0) {
      setIsResting(false);
      triggerHaptic(50);
    }
    return () => clearInterval(timer);
  }, [isResting, restTime, triggerHaptic]);

  const handleLogSet = () => {
    if (!hasControl) return; // Only users with control can log sets

    const log: SessionLog = {
      exerciseId: currentExercise.id,
      weight,
      value: volumeValue,
      mode: trackingMode,
      rpe
    };
    setSessionLogs(prev => [...prev, log]);
    triggerHaptic(20);

    setRestTime(60);
    if (currentSet < currentExercise.sets) {
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
    } else if (currentExerciseIdx < exercises.length - 1) {
      setCurrentExerciseIdx(prev => prev + 1);
      setCurrentSet(1);
      setIsResting(true);
    } else {
      triggerHaptic([40, 60, 40]);
      setIsFinishing(true);
    }
  };

  const handleFinishSession = async () => {
    if (!user) return;
    try {
      if (isStaff) {
        // Save the logs permanently
        if (activeSession && user.currentCycle) {
          await logSession(user.id, user.currentCycle.id, activeSession.logs);
        }
        await endLiveSession(user.id);
      }
      clearSessionStorage();
      onFinish();
    } catch (error) {
      console.error("Erro ao finalizar sessão:", error);
      alert("Erro ao finalizar sessão. Tente novamente.");
    }
  };

  const getRPEColor = (val: number) => {
    if (val < 6) return 'text-blue-400';
    if (val < 9) return 'text-cyan-500';
    return 'text-red-500 animate-pulse';
  };

  return (
    <div className="flex flex-col transition-colors duration-500 relative font-sans">
      <div className="precision-bg absolute inset-0 z-0 opacity-40"></div>

      {/* 2. MAIN SCROLLABLE CONTENT */}
      <main className="flex-1 px-4 pt-0 pb-48 relative z-10 w-full max-w-lg mx-auto overflow-y-auto no-scrollbar">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4 pt-20">
            <div className="w-12 h-12 border-4 border-cobalt border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-black text-app-muted uppercase tracking-[0.4em]">Carregando seu plano...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* MOTIVATIONAL BANNER / SYNC STATUS */}
            <div className={`rounded-2xl p-4 flex items-center space-x-4 animate-pulse-slow ${!hasControl ? 'bg-emerald-600/10 border-emerald-500/20' : 'bg-blue-600/10 border-blue-500/20'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!hasControl ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]'}`}>
                {!hasControl ? (
                  <img
                    src={executor.avatar || executor.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${executor.id}`}
                    className="w-full h-full rounded-full object-cover"
                    alt="Coach"
                  />
                ) : <Icons.TrendingUp className="w-5 h-5 text-white" />}
              </div>
              <div className="flex flex-col">
                <p className={`text-[11px] font-black uppercase tracking-widest leading-tight italic ${!hasControl ? 'text-emerald-900 dark:text-emerald-300' : 'text-blue-900 dark:text-blue-300'}`}>
                  {!hasControl
                    ? `COORDENAÇÃO POR ${currentCoachName?.split(' ')[0] || 'PERSONAL FLEX'}`
                    : `"${MOTIVATIONAL_PHRASES[(currentExerciseIdx + currentSet) % MOTIVATIONAL_PHRASES.length]}"`
                  }
                </p>
                {!hasControl && <span className="text-[9px] font-bold text-emerald-600/70 uppercase flex items-center">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-ping"></span>
                  Sincronizado via Personal Flex
                </span>}
                {hasControl && !isStaff && <span className="text-[9px] font-bold text-blue-600/70 uppercase flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Mondo Solo
                </span>}
              </div>
            </div>

            {/* SESSIONS PROGRESS STRIP */}
            <div className="flex space-x-1.5 h-2">
              {Array.from({ length: currentExercise.sets }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-700 ${i + 1 < currentSet ? 'bg-cobalt shadow-[0_0_10px_var(--pg-accent)]' :
                    i + 1 === currentSet ? 'bg-app shadow-xl' : 'bg-surface border border-white/5'
                    }`}
                />
              ))}
            </div>

            {/* VISUAL IMAGE CARD - PRECISION CUT */}
            <div className="relative w-full aspect-[4/5] border border-white/10 overflow-hidden group shadow-2xl rounded-sm bg-card">
              <div className="absolute inset-0 z-10 pointer-events-none border-[1px] border-white/10 rounded-sm"></div>

              {/* VIDEO OVERLAY */}
              {!showingVideo ? (
                <>
                  <img src={currentExercise.image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop'} className="w-full h-full object-cover grayscale-[20%] opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[10s]" alt={currentExercise.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20"></div>

                  <div className="absolute inset-0 p-6 z-30 flex flex-col justify-end">
                    <div className="flex justify-between items-end">
                      <div className="flex-1 min-w-0 pr-4">
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1 block">Exercício {currentExerciseIdx + 1} de {exercises.length}</span>
                        <h2 className="text-3xl font-black text-white mb-3 leading-none font-display uppercase italic tracking-tight drop-shadow-lg">{currentExercise.name}</h2>
                        <div className="flex flex-wrap gap-2">
                          <div className="px-3 py-1.5 border border-white/20 bg-white/10 backdrop-blur-md text-white font-black text-[10px] uppercase tracking-widest inline-flex items-center rounded-lg">
                            <Icons.Repeat className="w-3 h-3 mr-1.5 text-blue-400" />
                            {currentExercise.reps} Reps
                          </div>
                          {currentExercise.videoUrl && (
                            <button
                              onClick={() => setShowingVideo(true)}
                              className="px-3 py-1.5 border border-blue-500 bg-blue-600 backdrop-blur-md text-white font-black text-[10px] uppercase tracking-widest inline-flex items-center rounded-lg hover:bg-blue-500 transition-all active:scale-95"
                            >
                              <Icons.Play className="w-3 h-3 mr-1.5" /> Técnica
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="w-16 h-16 border-2 border-blue-500 bg-black/80 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] rounded-2xl backdrop-blur-sm transform rotate-3">
                        <span className="text-[8px] font-black uppercase text-blue-400 mb-0.5 tracking-tighter">Série</span>
                        <span className="text-3xl font-black tracking-tight text-white leading-none font-display italic">{currentSet}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 bg-black z-40 flex flex-col">
                  <iframe
                    src={currentExercise.videoUrl}
                    title={currentExercise.name}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <button
                    onClick={() => setShowingVideo(false)}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white flex items-center justify-center rounded-full backdrop-blur-md border border-white/20 hover:bg-red-600/80 transition-colors"
                  >
                    <Icons.X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* PERFORMANCE CONTROLS - OBSIDIAN HUD */}
            <div className="glass-panel p-6 space-y-8 border-app rounded-sm bg-surface/50">

              {/* TRACKING MODE TOGGLE */}
              <div className={`flex border border-app bg-surface/80 rounded-lg overflow-hidden p-1 ${!hasControl ? 'opacity-50 pointer-events-none' : ''}`}>
                <button
                  onClick={() => { triggerHaptic(5); setTrackingMode('REPS'); }}
                  className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all relative rounded-md ${trackingMode === 'REPS' ? 'text-app bg-app shadow-sm' : 'text-app-muted hover:text-app'}`}
                >
                  Peso e Repetições
                  {trackingMode === 'REPS' && <div className="absolute bottom-1 w-1 h-1 bg-cobalt rounded-full left-1/2 -translate-x-1/2 shadow-[0_0_10px_#2563EB]"></div>}
                </button>
                <button
                  onClick={() => { triggerHaptic(5); setTrackingMode('TIME'); }}
                  className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all relative rounded-md ${trackingMode === 'TIME' ? 'text-app bg-app shadow-sm' : 'text-app-muted hover:text-app'}`}
                >
                  Peso e Tempo
                  {trackingMode === 'TIME' && <div className="absolute bottom-1 w-1 h-1 bg-cobalt rounded-full left-1/2 -translate-x-1/2 shadow-[0_0_10px_#2563EB]"></div>}
                </button>
              </div>

              <div className="space-y-8">
                {/* CARGA (KG) */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end px-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-app uppercase tracking-widest leading-none mb-2">Peso</span>
                      <span className="text-xs font-bold text-cobalt uppercase tracking-wider leading-none">
                        Última: {Math.max(10, weight - 5)}kg (12 Abr)
                      </span>
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <h4 className="text-6xl font-bold text-app tracking-tighter tabular-nums leading-none font-display">{weight}</h4>
                      <span className="text-sm font-bold text-cobalt uppercase">KG</span>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-4 ${!hasControl ? 'opacity-50 pointer-events-none' : ''}`}>
                    <button
                      aria-label="Diminuir peso"
                      onClick={() => { triggerHaptic(5); setWeight(w => Math.max(0, w - 5)); }}
                      className="w-14 h-14 border border-app bg-surface hover:bg-app rounded-xl flex items-center justify-center text-app font-medium text-2xl active:scale-95 transition-all">
                      −
                    </button>
                    <div className="flex-1 px-2">
                      <input
                        type="range" min="0" max="400" step="1"
                        value={weight}
                        disabled={!hasControl}
                        onChange={e => { triggerHaptic(5); setWeight(parseInt(e.target.value)); }}
                        className="w-full h-2 bg-surface rounded-full appearance-none accent-cobalt cursor-pointer shadow-inner"
                      />
                    </div>
                    <button
                      aria-label="Aumentar peso"
                      onClick={() => { triggerHaptic(5); setWeight(w => w + 5); }}
                      className="w-14 h-14 border border-app bg-surface hover:bg-app rounded-xl flex items-center justify-center text-app font-medium text-2xl active:scale-95 transition-all">
                      +
                    </button>
                  </div>
                </div>

                {/* VOLUME */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end px-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-app uppercase tracking-widest leading-none mb-2">
                        {trackingMode === 'REPS' ? 'Repetições' : 'Duração (seg)'}
                      </span>
                      <span className="text-xs font-bold text-cobalt uppercase tracking-wider leading-none">Total</span>
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <h4 className="text-6xl font-bold text-app tracking-tighter tabular-nums leading-none font-display">{volumeValue}</h4>
                      <span className="text-sm font-bold text-cobalt uppercase">{trackingMode === 'REPS' ? 'Reps' : 'Segs'}</span>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-4 ${!hasControl ? 'opacity-50 pointer-events-none' : ''}`}>
                    <button
                      aria-label="Diminuir volume"
                      onClick={() => { triggerHaptic(5); setVolumeValue(v => Math.max(1, v - 1)); }}
                      className="w-14 h-14 border border-app bg-surface hover:bg-app rounded-xl flex items-center justify-center text-app font-medium text-2xl active:scale-95 transition-all">
                      −
                    </button>
                    <div className="flex-1 px-2">
                      <input
                        type="range" min="1" max={trackingMode === 'REPS' ? 100 : 300} step="1"
                        value={volumeValue}
                        disabled={!hasControl}
                        onChange={e => { triggerHaptic(5); setVolumeValue(parseInt(e.target.value)); }}
                        className="w-full h-2 bg-surface rounded-full appearance-none accent-cobalt cursor-pointer shadow-inner"
                      />
                    </div>
                    <button
                      aria-label="Aumentar volume"
                      onClick={() => { triggerHaptic(5); setVolumeValue(v => v + 1); }}
                      className="w-14 h-14 border border-app bg-surface hover:bg-app rounded-xl flex items-center justify-center text-app font-medium text-2xl active:scale-95 transition-all">
                      +
                    </button>
                  </div>
                </div>

                {/* RPE SLIDER */}
                <div className="pt-8 border-t border-app">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-app uppercase tracking-widest leading-none mb-2">Esforço</span>
                      <span className="text-xs font-bold text-cobalt uppercase tracking-wider leading-none">Nível (1-10)</span>
                    </div>
                    <span className={`text-4xl font-bold tracking-tight tabular-nums font-display ${getRPEColor(rpe)}`}>{rpe}</span>
                  </div>
                  <input
                    type="range" min="1" max="10"
                    value={rpe}
                    disabled={!hasControl}
                    onChange={e => { triggerHaptic(5); setRpe(parseInt(e.target.value) as RPEValue); }}
                    className="w-full h-3 bg-surface rounded-full appearance-none accent-cobalt cursor-pointer shadow-inner mb-6"
                  />
                  <div className="flex justify-between px-1">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-6 rounded-full transition-all duration-500 ${i + 1 <= rpe
                          ? (i + 1 > 8 ? 'bg-red-600 shadow-[0_0_10px_#DC2626]' : i + 1 > 5 ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : 'bg-cobalt shadow-[0_0_10px_#2563EB]')
                          : 'bg-surface'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. STICKY FOOTER */}
      <footer className="fixed bottom-24 left-0 right-0 p-4 glass-panel border-t border-app z-[100] shadow-2xl safe-pb backdrop-blur-xl bg-surface/80">
        <div className="max-w-lg mx-auto flex gap-3">
          {hasControl ? (
            <>
              <button
                onClick={handleLogSet}
                className="flex-[3] h-14 bg-blue-600 text-white font-black text-sm uppercase tracking-[0.2em] transition-all relative overflow-hidden group/finish shadow-[0_10px_30px_rgba(37,99,235,0.4)] rounded-2xl active:scale-[0.98]"
              >
                <div className="flex items-center justify-center space-x-4 relative z-10 italic">
                  <span>{currentSet === currentExercise.sets ? 'Próximo Exercício' : 'Finalizar Série'}</span>
                  <Icons.ChevronRight className="w-5 h-5 group-hover/finish:translate-x-1 transition-transform" />
                </div>
              </button>
              <button
                onClick={handleReportIssue}
                className="flex-1 h-14 bg-surface border border-app text-red-500 font-black text-[10px] uppercase tracking-widest flex flex-col items-center justify-center rounded-2xl hover:bg-red-500/10 transition-all active:scale-95"
              >
                <Icons.ExclamationCircle className="w-5 h-5 mb-1" />
                <span>Pular</span>
              </button>
            </>
          ) : (
            <div className="flex-1 h-14 bg-surface border border-app flex items-center justify-center rounded-2xl">
              <span className="text-xs font-black text-app-muted uppercase tracking-widest animate-pulse">
                Aguardando comando do professor...
              </span>
            </div>
          )}
        </div>
      </footer>

      {/* REST OVERLAY - CLINICIAL TECH */}
      {isResting && (
        <div className="fixed inset-0 z-[200] bg-app/95 backdrop-blur-3xl flex flex-col items-center justify-center p-8 animate-in fade-in duration-500 font-display">
          <div className="precision-bg absolute inset-0 z-0 opacity-20"></div>

          <div className="relative w-80 h-80 flex items-center justify-center z-10 my-12">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="160" cy="160" r="156" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-app/5" />
              <circle
                cx="160" cy="160" r="156" stroke="currentColor" strokeWidth="6" fill="transparent"
                className="text-cobalt shadow-[0_0_30px_#2563EB] transition-all duration-1000 ease-linear"
                strokeDasharray={980}
                strokeDashoffset={980 - (980 * restTime) / 60}
                strokeLinecap="round"
              />
            </svg>
            <div className="flex flex-col items-center">
              <span className="text-9xl font-bold tabular-nums text-app leading-none tracking-tighter">{restTime}</span>
              <span className="text-xs font-bold text-cobalt uppercase tracking-[0.5em] mt-2 bg-surface px-4 py-1 rounded-full border border-cobalt/30 shadow-md">Intervalo</span>
            </div>
          </div>

          <button
            onClick={() => { if (hasControl) { triggerHaptic(10); setIsResting(false); } }}
            disabled={!hasControl}
            className={`relative z-10 w-full max-w-xs py-5 border border-app bg-surface text-xs font-bold uppercase tracking-[0.3em] text-app hover:bg-app transition-all shadow-xl rounded-none active:scale-95 ${!hasControl ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {hasControl ? 'Pular Intervalo' : 'Em Recuperação...'}
          </button>
        </div>
      )}

      {/* FINISH OVERLAY */}
      {isFinishing && (
        <div className="fixed inset-0 z-[300] bg-app flex flex-col items-center justify-center p-8 animate-in slide-in-from-bottom-full duration-700">
          <div className="precision-bg absolute inset-0 z-0 opacity-40"></div>

          <div className="w-40 h-40 border border-cobalt/30 bg-cobalt/10 rounded-full flex items-center justify-center mb-12 shadow-[0_0_60px_rgba(37,99,235,0.2)] relative z-10 animate-bounce">
            <Icons.Shield className="w-20 h-20 text-cobalt drop-shadow-[0_0_15px_rgba(37,99,235,0.8)]" />
          </div>

          <h3 className="relative z-10 text-5xl md:text-6xl font-bold text-app mb-8 tracking-tighter text-center leading-none uppercase font-display">
            Treino<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cobalt to-laser">Finalizado</span>
          </h3>

          <p className="relative z-10 text-app-muted text-sm text-center mb-24 max-w-xs font-medium uppercase tracking-widest leading-relaxed">
            Ótimo trabalho! Treino registrado.
          </p>

          <button
            onClick={handleFinishSession}
            className="relative z-10 w-full max-w-sm h-16 bg-cobalt text-white font-bold text-sm uppercase tracking-[0.4em] transition-all hover:bg-blue-600 shadow-2xl rounded-none active:scale-[0.98]"
          >
            {hasControl ? (isStaff ? 'Salvar e Sair' : 'Concluir') : 'Concluir'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ActiveSession;
