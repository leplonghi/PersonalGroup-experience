import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Icons } from '../constants';
import { PlayCircle, X, Shield, TrendingUp, ChevronRight, AlertCircle, Repeat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RPEValue, SessionLog, User, Protocol, LiveSession, ESCALA_ESFORCO } from '../types';
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

const ModalVideo: React.FC<{ url: string; onClose: () => void }> = ({ url, onClose }) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>
        <iframe 
          src={url} 
          className="w-full h-full" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen 
        />
      </div>
    </div>
  );
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
  const [videoAberto, setVideoAberto] = useState<string | null>(null);
  const [restTime, setRestTime] = useState(60);
  const [trackingMode, setTrackingMode] = useState<'REPS' | 'TIME'>('REPS');

  const [weight, setWeight] = useState(currentExercise.weight);
  const [volumeValue, setVolumeValue] = useState(12);
  const [rpe, setRpe] = useState<RPEValue>(7);
  const [isLiveSessionActive, setIsLiveSessionActive] = useState(false);

  const [esforco, setEsforco] = useState<number | null>(null);
  const [observacoes, setObservacoes] = useState('');
  const [treinoConcluido, setTreinoConcluido] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const restIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [salvando, setSalvando] = useState(false);

  const isStaff = executor.role === 'PERSONAL' || executor.role === 'CHEFE' || executor.role === 'ADMIN';
  const hasControl = isStaff || (executor.role === 'ALUNO' && !isLiveSessionActive);
  const navigate = useNavigate();

  const duracaoMinutos = () => Math.floor((Date.now() - sessionStartTime) / 60000);
  const volumeTotal = () => sessionLogs.reduce((acc, log) => acc + (log.weight || 0) * (log.value || 0), 0);
  const totalSeries = () => sessionLogs.length;

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
    if (restIntervalRef.current) {
      clearInterval(restIntervalRef.current);
      restIntervalRef.current = null;
    }
    if (isResting && restTime > 0) {
      restIntervalRef.current = setInterval(() => setRestTime(prev => prev - 1), 1000);
    } else if (restTime === 0) {
      setIsResting(false);
      triggerHaptic(50);
    }
    return () => {
      if (restIntervalRef.current) {
        clearInterval(restIntervalRef.current);
        restIntervalRef.current = null;
      }
    };
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
        if (sessionLogs.length > 0 && user.currentCycle) {
          await logSession(user.id, user.currentCycle.id, sessionLogs);
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

  const handleFinish = async () => {
    setSalvando(true);
    if (!user) return;
    try {
      if (isStaff) {
        if (sessionLogs.length > 0 && user.currentCycle) {
          await logSession(user.id, user.currentCycle.id, sessionLogs);
        }
        await endLiveSession(user.id);
      }
      clearSessionStorage();
      setTreinoConcluido(true);
      setIsFinishing(false);
    } catch (error) {
      console.error("Erro ao finalizar sessão:", error);
      alert("Erro ao finalizar sessão. Tente novamente.");
    } finally {
      setSalvando(false);
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
                ) : <TrendingUp className="w-5 h-5 text-white" />}
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
                  Modo Solo
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

            {/* Progresso da sessão */}
            <div className="px-5 pb-3 flex-shrink-0">
              <div className="flex justify-between items-center text-xs text-pg-text-muted font-semibold mb-1.5">
                <span>Exercício {currentExerciseIdx + 1} de {exercises.length}</span>
                <span className="text-pg-cobalt font-bold">
                  {Math.round(((currentExerciseIdx) / exercises.length) * 100)}% concluído
                </span>
              </div>
              <div className="h-1 bg-white/7 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-pg-cobalt rounded-full transition-all duration-500"
                  style={{ width: `${(currentExerciseIdx / exercises.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Área do exercício */}
            <div className="mx-5 mb-3.5 relative rounded-2xl overflow-hidden border border-pg-cobalt/10"
                 style={{ aspectRatio: '16/9' }}>
              {currentExercise.image ? (
                <img src={currentExercise.image} alt={currentExercise.name}
                     className="w-full h-full object-cover"/>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0b246e] to-[#0d3082]
                                flex items-center justify-center">
                  <span className="text-6xl opacity-20">🏋️</span>
                </div>
              )}

              {/* Badge de série */}
              <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full
                              bg-black/55 backdrop-blur-sm text-xs font-black text-white">
                Série {currentSet} de {currentExercise.sets}
              </div>

              {/* Badge de grupo muscular */}
              {currentExercise.muscleGroup && (
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1
                                rounded-full bg-sky-500/50 backdrop-blur-sm border border-sky-500/50
                                text-[11px] font-bold text-blue-200">
                  💪 {currentExercise.muscleGroup}
                </div>
              )}
            </div>

            {currentExercise.videoUrl && (
              <button
                onClick={() => setVideoAberto(currentExercise.videoUrl!)}
                className="mx-5 mb-3 flex items-center gap-3 p-3 rounded-xl
                           bg-white/[0.04] border border-white/[0.08] active:bg-pg-cobalt/10 transition-colors"
              >
                <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-pg-cobalt/25 to-sky-500/30
                                flex items-center justify-center text-lg flex-shrink-0">▶️</div>
                <div className="text-left">
                  <div className="text-[13px] font-bold text-white">Ver execução correta</div>
                  <div className="text-[11px] text-pg-text-muted mt-0.5">Vídeo demonstrativo</div>
                </div>
              </button>
            )}

            <div className="mx-5 mb-3 flex gap-2.5 p-3 rounded-xl
                            bg-gradient-to-br from-pg-cobalt/10 to-sky-500/10 border border-pg-cobalt/20 relative overflow-hidden">
              <span className="text-lg flex-shrink-0 mt-0.5">🤖</span>
              <div className="text-[12px] text-amber-300/90 leading-relaxed">
                <strong className="font-black block mb-0.5 text-[12.5px]">Dica de execução</strong>
                Mantenha a técnica correta e controle a respiração. Qualidade sempre acima da quantidade.
              </div>
            </div>

            {currentExercise.weight !== undefined && (
              <div className="mx-5 mb-3 flex items-center gap-3.5 p-4 rounded-2xl
                              bg-white/5 border border-white/[0.08]">
                <button
                  onClick={() => setWeight(w => Math.max(0, w - 2.5))}
                  className="w-11 h-11 rounded-xl bg-pg-cobalt/10 border border-pg-cobalt/20 text-pg-cobalt
                             text-2xl font-bold flex items-center justify-center
                             transition-all hover:bg-pg-cobalt/20 active:scale-90"
                >−</button>

                <div className="flex-1">
                  <div className="text-[10px] font-bold text-pg-text-muted uppercase tracking-wider mb-0.5">
                    Carga selecionada
                  </div>
                  <div className="text-3xl font-black text-white leading-none">
                    {weight} <span className="text-sm text-pg-text-muted font-semibold">kg</span>
                  </div>
                </div>

                <button
                  onClick={() => setWeight(w => w + 2.5)}
                  className="w-11 h-11 rounded-xl bg-pg-cobalt/10 border border-pg-cobalt/20 text-pg-cobalt
                             text-2xl font-bold flex items-center justify-center
                             transition-all hover:bg-pg-cobalt/20 active:scale-90"
                >+</button>
              </div>
            )}

            <div className="mx-5 mb-3">
              <div className="text-[11px] font-bold text-pg-text-muted uppercase tracking-wider mb-2">
                Repetições realizadas
              </div>
              <div className="flex gap-2">
                {[currentExercise.reps - 2, currentExercise.reps, currentExercise.reps + 2].filter(r => r > 0).map((r) => (
                  <button
                    key={r}
                    onClick={() => setVolumeValue(r)}
                    className={`flex-1 py-3 rounded-xl border text-center transition-all active:scale-95
                      ${volumeValue === r
                        ? 'bg-pg-cobalt/15 border-pg-cobalt/50 shadow-[0_0_12px_rgba(37,99,235,0.2)]'
                        : 'bg-white/5 border-white/[0.08] hover:border-white/20'
                      }`}
                  >
                    <div className="text-xl font-black text-white">{r}</div>
                    <div className="text-[10px] text-pg-text-muted mt-1 uppercase tracking-wider">
                      {r === currentExercise.reps ? 'Prescrição' : r > currentExercise.reps ? '+ extra' : 'Menos'}
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => {
                    const val = prompt('Quantas repetições você fez?');
                    if (val) setVolumeValue(parseInt(val) || 0);
                  }}
                  className="flex-[0.55] py-3 rounded-xl border bg-white/5 border-white/[0.08]
                             text-center transition-all active:scale-95 hover:border-white/20"
                >
                  <div className="text-xl font-black text-white">+</div>
                  <div className="text-[10px] text-pg-text-muted mt-1 uppercase tracking-wider">Outro</div>
                </button>
              </div>
            </div>

            <div className="mx-5 mb-3">
              <div className="text-[12px] font-bold text-pg-text-muted uppercase tracking-wider mb-2.5">
                Esforço percebido
              </div>
              <div className="flex gap-1.5 justify-between mb-1">
                {ESCALA_ESFORCO.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setEsforco(e.id)}
                    className={`flex-1 aspect-square rounded-2xl flex flex-col items-center justify-center gap-1
                                border-2 transition-all active:scale-95
                                ${esforco === e.id
                                  ? 'border-pg-cobalt bg-pg-cobalt/10 scale-105'
                                  : 'border-transparent bg-white/5 hover:bg-white/[0.08]'
                                }`}
                  >
                    <span className="text-2xl leading-none">{e.emoji}</span>
                    <span className={`text-[8px] font-bold text-center leading-tight ${
                      esforco === e.id ? 'text-pg-cobalt' : 'text-pg-text-muted'
                    }`}>
                      {e.label}
                    </span>
                  </button>
                ))}
              </div>
              {esforco && (
                <p className="text-center text-xs text-pg-text-muted transition-all">
                  {ESCALA_ESFORCO.find(e => e.id === esforco)?.descricao}
                </p>
              )}
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
                  <ChevronRight className="w-5 h-5 group-hover/finish:translate-x-1 transition-transform" />
                </div>
              </button>
              <button
                onClick={handleReportIssue}
                className="flex-1 h-14 bg-surface border border-app text-red-500 font-black text-[10px] uppercase tracking-widest flex flex-col items-center justify-center rounded-2xl hover:bg-red-500/10 transition-all active:scale-95"
              >
                <AlertCircle className="w-5 h-5 mb-1" />
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

      {isResting && (
        <div className="fixed inset-0 z-[200] bg-pg-midnight flex flex-col
                        items-center justify-center p-6 gap-6 animate-in fade-in duration-300">
          <div className="text-center">
            <p className="text-xl font-black text-white mb-1">⏸ Recuperando</p>
            <p className="text-sm text-pg-text-muted">Respire fundo. Você está indo bem!</p>
          </div>

          <div className="relative w-52 h-52">
            <div className="absolute inset-[-14px] rounded-full
                            bg-[radial-gradient(circle,rgba(0,182,253,0.13)_60%,transparent_100%)]
                            animate-pulse" />
            <div className="w-52 h-52 rounded-full flex items-center justify-center relative">
              <svg width="208" height="208" viewBox="0 0 208 208" className="-rotate-90 absolute inset-0"
                   style={{ filter: 'drop-shadow(0 0 20px rgba(0,182,253,0.25))' }}>
                <circle cx="104" cy="104" r="92" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10"/>
                <circle cx="104" cy="104" r="92" fill="none"
                  stroke="url(#restGrad)" strokeWidth="10"
                  strokeDasharray="578"
                  strokeDashoffset={578 * (restTime / 60)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
                <defs>
                  <linearGradient id="restGrad">
                    <stop offset="0%" stopColor="#3363a2"/>
                    <stop offset="100%" stopColor="#00b6fd"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#021141]/95 to-[#00060f]/98
                              border border-white/[0.07] flex flex-col items-center justify-center">
                <div className="text-5xl font-black text-white">{restTime}</div>
                <div className="text-xs text-pg-text-muted font-semibold mt-1">segundos</div>
              </div>
            </div>
          </div>

          <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/[0.08]">
            <span className="text-[10px] font-black text-pg-cobalt uppercase tracking-wider block mb-1">
              {currentSet >= currentExercise.sets ? 'Próximo exercício' : 'Próxima série'}
            </span>
            <div className="text-base font-bold text-white">
              {currentSet >= currentExercise.sets
                ? (exercises[currentExerciseIdx + 1]?.name || 'Fim do treino')
                : `Série ${currentSet + 1} de ${currentExercise.sets}`}
            </div>
          </div>

          <button
            onClick={() => { setIsResting(false); clearInterval(restIntervalRef.current); }}
            className="text-pg-text-muted text-sm font-semibold underline underline-offset-2
                       hover:text-white transition-colors"
          >
            Pular descanso →
          </button>
        </div>
      )}

      {isFinishing && (
        <div className="fixed inset-0 z-[200] bg-pg-midnight overflow-y-auto">
          <div className="px-5 pt-5 pb-8">
            <button onClick={() => setIsFinishing(false)} className="text-pg-text-muted text-lg mb-3">←</button>
            <h2 className="text-2xl font-black text-white">Como foi o treino?</h2>
            <p className="text-sm text-pg-text-muted mt-1 mb-5">
              {exercises.length} de {exercises.length} exercícios ✓
            </p>

            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {[
                { v: `${duracaoMinutos()} min`, u: 'duração' },
                { v: totalSeries(), u: 'séries' },
                { v: `${volumeTotal()} kg`, u: 'volume' },
              ].map(s => (
                <div key={s.u} className="p-3 rounded-2xl bg-white/5 border border-white/[0.08] text-center">
                  <div className="text-xl font-black text-white">{s.v}</div>
                  <div className="text-[10px] text-pg-text-muted font-semibold mt-1">{s.u}</div>
                </div>
              ))}
            </div>

            <p className="text-sm font-bold text-white mb-1.5">Qual foi o esforço?</p>
            <p className="text-xs text-pg-text-muted mb-4 leading-relaxed">
              Sua avaliação ajuda a calibrar cargas e descanso nas próximas sessões.
            </p>
            <div className="flex gap-2 justify-between mb-2">
              {ESCALA_ESFORCO.map(e => (
                <button
                  key={e.id}
                  onClick={() => setEsforco(e.id)}
                  className={`flex-1 aspect-square rounded-2xl flex flex-col items-center justify-center gap-1.5
                              border-2 transition-all active:scale-95 ${
                                esforco === e.id
                                  ? 'border-pg-cobalt bg-pg-cobalt/10 scale-105'
                                  : 'border-transparent bg-white/5'
                              }`}
                >
                  <span className="text-2xl leading-none">{e.emoji}</span>
                  <span className={`text-[8px] font-bold text-center leading-tight ${
                    esforco === e.id ? 'text-pg-cobalt' : 'text-pg-text-muted'
                  }`}>
                    {e.label}
                  </span>
                </button>
              ))}
            </div>
            {esforco && (
              <p className="text-center text-xs text-pg-text-muted mb-5 transition-all">
                {ESCALA_ESFORCO.find(e => e.id === esforco)?.descricao}
              </p>
            )}

            <p className="text-sm font-bold text-white mb-2">Observações (opcional)</p>
            <textarea
              value={observacoes}
              onChange={e => setObservacoes(e.target.value)}
              placeholder="Ex: joelho esquerdo sensível, adaptei o agachamento..."
              className="w-full h-24 rounded-2xl bg-white/5 border border-white/[0.08] p-3.5
                         text-white text-sm resize-none outline-none placeholder:text-pg-text-muted
                         focus:border-pg-cobalt/30 mb-5 transition-colors"
              maxLength={400}
            />

            <button
              onClick={handleFinish}
              disabled={salvando}
              className="w-full py-4 rounded-full bg-pg-cobalt text-pg-midnight font-black text-base mb-3
                         transition-all hover:scale-[1.02] hover:shadow-pg-cobalt
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {salvando ? 'Salvando...' : '✓ Registrar treino'}
            </button>
            <button
              onClick={() => setIsFinishing(false)}
              className="w-full py-3.5 rounded-full border border-white/[0.08] text-pg-text-muted
                         text-sm font-semibold transition-all hover:border-white/[0.18] hover:text-white"
            >
              Voltar ao treino
            </button>
          </div>
        </div>
      )}

      {treinoConcluido && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center
                        p-6 gap-5 animate-in fade-in duration-500"
             style={{ background: 'linear-gradient(160deg, #010e35, #021141, #010922)' }}>
          <span className="text-7xl animate-bounce">💪</span>
          <div className="text-center">
            <h2 className="text-3xl font-black text-white mb-2">Treino concluído!</h2>
            <p className="text-sm text-pg-text-muted leading-relaxed">
              Mais um dia de cuidado com você mesmo.<br/>Isso faz toda a diferença.
            </p>
          </div>

          {user.progresso?.diasSeguidos > 0 && (
            <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full
                            bg-pg-cobalt/10 border border-pg-cobalt/20">
              <span className="text-xl">🔥</span>
              <span className="text-sm font-bold text-pg-cobalt">
                {user.progresso.diasSeguidos} dias seguidos de treino
                {user.progresso.diasSeguidos === user.progresso.maiorSequencia ? ' — seu recorde!' : ''}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5 w-full">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/[0.08] text-center">
              <div className="text-2xl font-black text-pg-cobalt">{duracaoMinutos()} min</div>
              <div className="text-xs text-pg-text-muted mt-1">Duração</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/[0.08] text-center">
              <div className="text-2xl font-black text-pg-cobalt">{exercises.length}</div>
              <div className="text-xs text-pg-text-muted mt-1">Exercícios</div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2.5">
            <button
              onClick={() => { setTreinoConcluido(false); onFinish(); }}
              className="w-full py-4 rounded-full bg-pg-cobalt text-pg-midnight font-black text-base
                         hover:scale-[1.02] hover:shadow-pg-cobalt transition-all"
            >
              Voltar ao início
            </button>
            <button
              onClick={() => navigate('/evolution')}
              className="w-full py-3.5 rounded-full border border-pg-cobalt/20 text-pg-cobalt
                         text-sm font-semibold hover:bg-pg-cobalt/8 transition-all"
            >
              Ver minha evolução →
            </button>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoAberto && (
        <ModalVideo 
          url={videoAberto} 
          onClose={() => setVideoAberto(null)} 
        />
      )}
    </div>
  );
};

export default ActiveSession;
