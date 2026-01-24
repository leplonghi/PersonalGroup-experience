
import React, { useState, useEffect, useCallback } from 'react';
import { Icons } from '../constants';
import { RPEValue, SessionLog } from '../types';
import { INITIAL_EXERCISES } from '../data/exercises';

interface ActiveSessionProps {
  user: any; // Using any temporarily to avoid type issues, ideally should remain User
  executor: any;
  onFinish: () => void;
}

const ActiveSession: React.FC<ActiveSessionProps> = ({ user, executor, onFinish }) => {
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(() => {
    const saved = localStorage.getItem('pg-session-ex-idx');
    return saved ? parseInt(saved) : 0;
  });

  const handleReportIssue = () => {
    // In a real app, this would send a ticket to the gym management system
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
    const saved = localStorage.getItem('pg-session-set');
    return saved ? parseInt(saved) : 1;
  });

  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>(() => {
    const saved = localStorage.getItem('pg-session-logs');
    return saved ? JSON.parse(saved) : [];
  });

  const exercises = INITIAL_EXERCISES;
  const currentExercise = exercises[currentExerciseIdx] || exercises[0];

  const [isFinishing, setIsFinishing] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(60);
  const [trackingMode, setTrackingMode] = useState<'REPS' | 'TIME'>('REPS');

  const [weight, setWeight] = useState(currentExercise.weight);
  const [volumeValue, setVolumeValue] = useState(12);
  const [rpe, setRpe] = useState<RPEValue>(7);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('pg-session-ex-idx', currentExerciseIdx.toString());
  }, [currentExerciseIdx]);

  useEffect(() => {
    localStorage.setItem('pg-session-set', currentSet.toString());
  }, [currentSet]);

  useEffect(() => {
    localStorage.setItem('pg-session-logs', JSON.stringify(sessionLogs));
  }, [sessionLogs]);

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

  const handleFinishSession = () => {
    // Clear storage on finish
    localStorage.removeItem('pg-session-ex-idx');
    localStorage.removeItem('pg-session-set');
    localStorage.removeItem('pg-session-logs');
    onFinish();
  };

  const getRPEColor = (val: number) => {
    if (val < 6) return 'text-blue-400';
    if (val < 9) return 'text-amber-500';
    return 'text-red-500 animate-pulse';
  };

  return (
    <div className="min-h-screen bg-app flex flex-col transition-colors duration-500 grain-overlay relative font-sans">
      <div className="precision-bg absolute inset-0 z-0 opacity-40"></div>

      {/* 2. MAIN SCROLLABLE CONTENT */}
      <main className="flex-1 px-6 pt-4 pb-56 overflow-y-auto no-scrollbar relative z-10 w-full max-w-lg mx-auto">
        <div className="space-y-12">

          {/* SESSIONS PROGRESS STRIP */}
          <div className="flex space-x-1.5 h-2">
            {Array.from({ length: currentExercise.sets }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 rounded-full transition-all duration-700 ${i + 1 < currentSet ? 'bg-pg-cobalt shadow-[0_0_10px_var(--pg-cobalt)]' :
                  i + 1 === currentSet ? 'bg-slate-900 dark:bg-white shadow-xl' : 'bg-slate-200 dark:bg-white/10'
                  }`}
              />
            ))}
          </div>

          {/* VISUAL IMAGE CARD - PRECISION CUT */}
          <div className="relative w-full aspect-[4/5] border border-white/10 overflow-hidden group shadow-2xl rounded-pg-premium bg-pg-titanium">
            <div className="absolute inset-0 z-10 pointer-events-none border-[1px] border-white/10 rounded-pg-premium"></div>
            <img src={currentExercise.image} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[10s]" alt={currentExercise.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 dark:from-midnight dark:via-midnight/40 to-transparent z-20"></div>

            <div className="absolute inset-0 p-8 z-30 flex flex-col justify-end">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <h2 className="text-3xl font-bold text-white mb-2 leading-tight font-display shadow-black drop-shadow-lg">{currentExercise.name}</h2>
                  <div className="flex space-x-2">
                    <div className="px-3 py-1.5 border border-white/20 bg-ocean/60 backdrop-blur-md text-white font-bold text-xs uppercase tracking-wider inline-block rounded-md">
                      {currentExercise.reps} Repetições
                    </div>
                    <button onClick={handleReportIssue} className="px-3 py-1.5 border border-red-500/30 bg-red-500/10 backdrop-blur-md text-red-500 font-bold text-xs uppercase tracking-wider inline-flex items-center rounded-md hover:bg-red-500/20">
                      <Icons.ExclamationCircle className="w-3 h-3 mr-1" /> Relatar Problema
                    </button>
                  </div>
                </div>

                <div className="w-20 h-20 border border-pg-cobalt bg-midnight/80 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.3)] rounded-lg backdrop-blur-sm">
                  <span className="text-[10px] font-bold uppercase text-pg-cobalt mb-0.5 tracking-wider">Série</span>
                  <span className="text-4xl font-bold tracking-tight text-white leading-none font-display">{currentSet}</span>
                </div>
              </div>
            </div>
          </div>

          {/* PERFORMANCE CONTROLS - OBSIDIAN HUD */}
          <div className="glass-panel p-8 space-y-16 border-slate-200 dark:border-white/5 rounded-pg-premium">

            {/* TRACKING MODE TOGGLE */}
            <div className="flex border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-ocean/40 rounded-lg overflow-hidden p-1">
              <button
                onClick={() => { triggerHaptic(5); setTrackingMode('REPS'); }}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all relative rounded-md ${trackingMode === 'REPS' ? 'text-white bg-slate-900 dark:bg-white/10' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
              >
                Carga e Repetições
                {trackingMode === 'REPS' && <div className="absolute bottom-1 w-1 h-1 bg-pg-cobalt rounded-full left-1/2 -translate-x-1/2 shadow-[0_0_10px_#2563EB]"></div>}
              </button>
              <button
                onClick={() => { triggerHaptic(5); setTrackingMode('TIME'); }}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all relative rounded-md ${trackingMode === 'TIME' ? 'text-white bg-slate-900 dark:bg-white/10' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
              >
                Carga e Tempo
                {trackingMode === 'TIME' && <div className="absolute bottom-1 w-1 h-1 bg-pg-cobalt rounded-full left-1/2 -translate-x-1/2 shadow-[0_0_10px_#2563EB]"></div>}
              </button>
            </div>

            <div className="space-y-16">
              {/* CARGA (KG) */}
              <div className="space-y-8">
                <div className="flex justify-between items-end px-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">Peso</span>
                    <span className="text-[10px] font-bold text-pg-cobalt uppercase tracking-wider leading-none">
                      Última: {Math.max(10, weight - 5)}kg (12 Abr)
                    </span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <h4 className="text-7xl font-bold text-slate-900 dark:text-white tracking-tighter tabular-nums leading-none font-display">{weight}</h4>
                    <span className="text-lg font-bold text-pg-cobalt uppercase">KG</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    aria-label="Diminuir peso"
                    onClick={() => { triggerHaptic(5); setWeight(w => Math.max(0, w - 5)); }}
                    className="w-16 h-16 border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 rounded-xl flex items-center justify-center text-slate-900 dark:text-white font-medium text-3xl active:scale-95 transition-all">
                    −
                  </button>
                  <div className="flex-1 px-2">
                    <input
                      type="range" min="0" max="400" step="1"
                      value={weight}
                      onChange={e => { triggerHaptic(5); setWeight(parseInt(e.target.value)); }}
                      className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full appearance-none accent-pg-cobalt cursor-pointer"
                    />
                  </div>
                  <button
                    aria-label="Aumentar peso"
                    onClick={() => { triggerHaptic(5); setWeight(w => w + 5); }}
                    className="w-16 h-16 border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 rounded-xl flex items-center justify-center text-slate-900 dark:text-white font-medium text-3xl active:scale-95 transition-all">
                    +
                  </button>
                </div>
              </div>

              {/* VOLUME */}
              <div className="space-y-8">
                <div className="flex justify-between items-end px-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">
                      {trackingMode === 'REPS' ? 'Repetições' : 'Tempo de Execução'}
                    </span>
                    <span className="text-[10px] font-bold text-pg-cobalt uppercase tracking-wider leading-none">Total</span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <h4 className="text-7xl font-bold text-slate-900 dark:text-white tracking-tighter tabular-nums leading-none font-display">{volumeValue}</h4>
                    <span className="text-lg font-bold text-pg-cobalt uppercase">{trackingMode === 'REPS' ? 'Reps' : 'Segs'}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    aria-label="Diminuir volume"
                    onClick={() => { triggerHaptic(5); setVolumeValue(v => Math.max(1, v - 1)); }}
                    className="w-16 h-16 border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 rounded-xl flex items-center justify-center text-slate-900 dark:text-white font-medium text-3xl active:scale-95 transition-all">
                    −
                  </button>
                  <div className="flex-1 px-2">
                    <input
                      type="range" min="1" max={trackingMode === 'REPS' ? 100 : 300} step="1"
                      value={volumeValue}
                      onChange={e => { triggerHaptic(5); setVolumeValue(parseInt(e.target.value)); }}
                      className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full appearance-none accent-pg-cobalt cursor-pointer"
                    />
                  </div>
                  <button
                    aria-label="Aumentar volume"
                    onClick={() => { triggerHaptic(5); setVolumeValue(v => v + 1); }}
                    className="w-16 h-16 border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 rounded-xl flex items-center justify-center text-slate-900 dark:text-white font-medium text-3xl active:scale-95 transition-all">
                    +
                  </button>
                </div>
              </div>

              {/* RPE SLIDER */}
              <div className="pt-12 border-t border-slate-200 dark:border-white/5">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">Esforço</span>
                    <span className="text-[10px] font-bold text-pg-cobalt uppercase tracking-wider leading-none">Nível (1-10)</span>
                  </div>
                  <span className={`text-6xl font-bold tracking-tight tabular-nums font-display ${getRPEColor(rpe)}`}>{rpe}</span>
                </div>
                <input
                  type="range" min="1" max="10"
                  value={rpe}
                  onChange={e => { triggerHaptic(5); setRpe(parseInt(e.target.value) as RPEValue); }}
                  className="w-full h-3 bg-slate-200 dark:bg-white/10 rounded-full appearance-none accent-pg-cobalt cursor-pointer mb-6"
                />
                <div className="flex justify-between px-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-6 rounded-full transition-all duration-500 ${i + 1 <= rpe
                        ? (i + 1 > 8 ? 'bg-red-600 shadow-[0_0_10px_#DC2626]' : i + 1 > 5 ? 'bg-amber-500 shadow-[0_0_10px_#F59E0B]' : 'bg-pg-cobalt shadow-[0_0_10px_#2563EB]')
                        : 'bg-slate-200 dark:bg-white/5'
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. STICKY FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 glass-panel border-t border-slate-200 dark:border-white/5 z-[120] shadow-2xl safe-pb">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleLogSet}
            className="w-full h-16 bg-pg-cobalt text-white font-bold text-sm uppercase tracking-[0.3em] transition-all relative overflow-hidden group/finish shadow-[0_0_30px_rgba(37,99,235,0.4)] rounded-pg-sharp active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-white translate-x-[-101%] group-hover/finish:translate-x-0 transition-transform duration-700 mix-blend-difference"></div>
            <div className="flex items-center justify-center space-x-4 relative z-10">
              <span>Concluir Série</span>
              <Icons.ChevronRight className="w-5 h-5 animate-pulse" />
            </div>
          </button>
        </div>
      </footer>

      {/* REST OVERLAY - CLINICIAL TECH */}
      {isResting && (
        <div className="fixed inset-0 z-[200] bg-midnight/95 backdrop-blur-3xl flex flex-col items-center justify-center p-8 animate-in fade-in duration-500 font-display">
          <div className="precision-bg absolute inset-0 z-0 opacity-20"></div>

          <div className="relative w-80 h-80 flex items-center justify-center z-10 my-12">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="160" cy="160" r="156" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" />
              <circle
                cx="160" cy="160" r="156" stroke="currentColor" strokeWidth="6" fill="transparent"
                className="text-pg-cobalt shadow-[0_0_30px_#2563EB] transition-all duration-1000 ease-linear"
                strokeDasharray={980}
                strokeDashoffset={980 - (980 * restTime) / 60}
                strokeLinecap="round"
              />
            </svg>
            <div className="flex flex-col items-center">
              <span className="text-9xl font-bold tabular-nums text-white leading-none tracking-tighter">{restTime}</span>
              <span className="text-xs font-bold text-pg-cobalt uppercase tracking-[0.5em] mt-2 bg-midnight/50 px-4 py-1 rounded-full border border-pg-cobalt/30">Descanso</span>
            </div>
          </div>

          <button
            onClick={() => { triggerHaptic(10); setIsResting(false); }}
            className="relative z-10 w-full max-w-xs py-5 border border-white/20 bg-white/5 text-xs font-bold uppercase tracking-[0.3em] text-white hover:bg-white/10 transition-all shadow-xl rounded-pg-sharp active:scale-95"
          >
            Pular Descanso
          </button>
        </div>
      )}

      {/* FINISH OVERLAY */}
      {isFinishing && (
        <div className="fixed inset-0 z-[300] bg-midnight flex flex-col items-center justify-center p-8 animate-in slide-in-from-bottom-full duration-700">
          <div className="precision-bg absolute inset-0 z-0 opacity-40"></div>

          <div className="w-40 h-40 border border-pg-cobalt/30 bg-pg-cobalt/10 rounded-full flex items-center justify-center mb-12 shadow-[0_0_60px_rgba(37,99,235,0.2)] relative z-10 animate-bounce">
            <Icons.Shield className="w-20 h-20 text-pg-cobalt drop-shadow-[0_0_15px_rgba(37,99,235,0.8)]" />
          </div>

          <h3 className="relative z-10 text-5xl md:text-6xl font-bold text-white mb-8 tracking-tighter text-center leading-none uppercase font-display">
            Treino<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-pg-cobalt to-pg-laser">Concluído</span>
          </h3>

          <p className="relative z-10 text-slate-400 text-sm text-center mb-24 max-w-xs font-medium uppercase tracking-widest leading-relaxed">
            Parabéns! Seu treino foi registrado com sucesso.
          </p>

          <button
            onClick={handleFinishSession}
            className="relative z-10 w-full max-w-sm h-16 bg-pg-cobalt text-white font-bold text-sm uppercase tracking-[0.4em] transition-all hover:bg-blue-600 shadow-2xl rounded-pg-sharp active:scale-[0.98]"
          >
            Finalizar Treino
          </button>
        </div>
      )}
    </div>
  );
};

export default ActiveSession;
