
import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/Card';
import { Icons } from '../constants';
import { Exercise, RPEValue, User, SessionLog } from '../types';

interface ActiveSessionProps {
  user: User;
  executor: User;
  onFinish: () => void;
}

const ActiveSession: React.FC<ActiveSessionProps> = ({ user, executor, onFinish }) => {
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(60);
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([]);
  const [trackingMode, setTrackingMode] = useState<'REPS' | 'TIME'>('REPS');
  
  const exercises: Exercise[] = [
    { 
      id: 'e1', 
      name: 'Agachamento Smith (FLEX)', 
      sets: 4, 
      reps: '10-12', 
      weight: 60, 
      image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=600',
    },
    { 
      id: 'e2', 
      name: 'Leg Press 45º Pro', 
      sets: 3, 
      reps: '15', 
      weight: 160, 
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
    }
  ];

  const currentExercise = exercises[currentExerciseIdx];
  const [weight, setWeight] = useState(currentExercise.weight);
  const [volumeValue, setVolumeValue] = useState(12);
  const [rpe, setRpe] = useState<RPEValue>(7);

  const triggerHaptic = useCallback((pattern: number | number[]) => {
    if ('vibrate' in navigator) navigator.vibrate(pattern);
  }, []);

  useEffect(() => {
    let timer: any;
    if (isResting && restTime > 0) {
      timer = setInterval(() => setRestTime(prev => prev - 1), 1000);
    } else if (restTime === 0) {
      setIsResting(false);
      setRestTime(60);
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

    if (currentSet < currentExercise.sets) {
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
    } else if (currentExerciseIdx < exercises.length - 1) {
      setCurrentExerciseIdx(prev => prev + 1);
      setCurrentSet(1);
      const nextEx = exercises[currentExerciseIdx + 1];
      setWeight(nextEx.weight);
      setVolumeValue(trackingMode === 'REPS' ? 12 : 45);
      setIsResting(true);
    } else {
      triggerHaptic([40, 60, 40]);
      setIsFinishing(true);
    }
  };

  const getRPEColor = (val: number) => {
    if (val < 6) return 'text-blue-600 dark:text-blue-400';
    if (val < 9) return 'text-amber-500';
    return 'text-red-600 dark:text-red-500 animate-pulse';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] flex flex-col transition-colors duration-500">
      
      {/* 1. FIXED TOP HEADER - REFINADO */}
      <header className="fixed top-0 left-0 right-0 z-[110] px-6 pt-14 pb-6 bg-white/95 dark:bg-[#020617]/95 backdrop-blur-2xl border-b border-slate-100 dark:border-white/5">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
               <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
               <span className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-[0.3em]">Protocolo Ativo</span>
            </div>
            <div className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full">
              <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Ex: {currentExerciseIdx + 1}/{exercises.length}</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-black text-slate-950 dark:text-white leading-tight uppercase tracking-tighter mb-4">
            {currentExercise.name}
          </h2>

          <div className="flex space-x-1.5 h-1.5">
            {Array.from({ length: currentExercise.sets }).map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 rounded-full transition-all duration-500 ${
                  i + 1 < currentSet ? 'bg-blue-600' : 
                  i + 1 === currentSet ? 'bg-slate-950 dark:bg-white shadow-lg' : 'bg-slate-200 dark:bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* 2. MAIN SCROLLABLE CONTENT */}
      <main className="flex-1 px-6 pt-52 pb-48 overflow-y-auto no-scrollbar">
        <div className="max-w-md mx-auto space-y-10">
          
          {/* VISUAL IMAGE CARD */}
          <div className="relative w-full aspect-[4/5] rounded-[56px] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 transition-all duration-700">
            <img src={currentExercise.image} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
              <div className="px-5 py-2.5 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 text-white font-black text-[10px] uppercase tracking-widest">
                {currentExercise.reps} ALVO
              </div>
              <div className="w-20 h-20 bg-blue-600 text-white rounded-[32px] flex flex-col items-center justify-center shadow-2xl border border-white/20">
                <span className="text-[9px] font-black uppercase opacity-60 mb-0.5 tracking-widest">Série</span>
                <span className="text-3xl font-black italic">S{currentSet}</span>
              </div>
            </div>
          </div>

          {/* PERFORMANCE HUD - DEFINIÇÃO DE VARIÁVEIS */}
          <Card variant="flat" className="p-10 space-y-12 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm shadow-xl">
            
            {/* MODE SELECTOR */}
            <div className="flex bg-slate-100 dark:bg-white/5 p-1.5 rounded-[22px] border border-slate-200/50 dark:border-white/5">
              <button 
                onClick={() => { triggerHaptic(5); setTrackingMode('REPS'); }}
                className={`flex-1 py-3.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${trackingMode === 'REPS' ? 'bg-[#002B54] dark:bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}
              >
                Carga x Reps
              </button>
              <button 
                onClick={() => { triggerHaptic(5); setTrackingMode('TIME'); }}
                className={`flex-1 py-3.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${trackingMode === 'TIME' ? 'bg-[#002B54] dark:bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}
              >
                Carga x Tempo
              </button>
            </div>

            <div className="grid grid-cols-1 gap-12">
              {/* CARGA (KG) */}
              <div className="space-y-6">
                <div className="flex justify-between items-end px-1">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Carga</span>
                  <div className="flex items-baseline space-x-1">
                    <h4 className="text-5xl font-black text-slate-950 dark:text-white tracking-tighter tabular-nums">{weight}</h4>
                    <span className="text-sm font-black text-slate-400 uppercase">KG</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button onClick={() => { triggerHaptic(2); setWeight(w => Math.max(0, w-5)); }} className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-950 dark:text-white font-black text-2xl active:scale-90 border border-slate-200 dark:border-white/10 shadow-sm">-</button>
                  <input 
                    type="range" min="0" max="400" step="1" 
                    value={weight} 
                    onChange={e => { triggerHaptic(2); setWeight(parseInt(e.target.value)); }}
                    className="flex-1 h-2 bg-slate-100 dark:bg-white/10 rounded-full appearance-none accent-blue-700 dark:accent-blue-500 cursor-pointer"
                  />
                  <button onClick={() => { triggerHaptic(2); setWeight(w => w+5); }} className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-950 dark:text-white font-black text-2xl active:scale-90 border border-slate-200 dark:border-white/10 shadow-sm">+</button>
                </div>
              </div>

              {/* VOLUME (REPS / SECS) */}
              <div className="space-y-6">
                <div className="flex justify-between items-end px-1">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    {trackingMode === 'REPS' ? 'Execução' : 'Sustentação'}
                  </span>
                  <div className="flex items-baseline space-x-1">
                    <h4 className="text-5xl font-black text-slate-950 dark:text-white tracking-tighter tabular-nums">{volumeValue}</h4>
                    <span className="text-sm font-black text-slate-400 uppercase">{trackingMode === 'REPS' ? 'Reps' : 'Segs'}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button onClick={() => { triggerHaptic(2); setVolumeValue(v => Math.max(1, v-1)); }} className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-950 dark:text-white font-black text-2xl active:scale-90 border border-slate-200 dark:border-white/10 shadow-sm">-</button>
                  <input 
                    type="range" min="1" max={trackingMode === 'REPS' ? 100 : 300} step="1" 
                    value={volumeValue} 
                    onChange={e => { triggerHaptic(2); setVolumeValue(parseInt(e.target.value)); }}
                    className="flex-1 h-2 bg-slate-100 dark:bg-white/10 rounded-full appearance-none accent-blue-700 dark:accent-blue-500 cursor-pointer"
                  />
                  <button onClick={() => { triggerHaptic(2); setVolumeValue(v => v+1); }} className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-950 dark:text-white font-black text-2xl active:scale-90 border border-slate-200 dark:border-white/10 shadow-sm">+</button>
                </div>
              </div>
            </div>

            {/* RPE SLIDER - CLEAN & HIGH CONTRAST */}
            <div className="pt-10 border-t border-slate-100 dark:border-white/5">
              <div className="flex justify-between items-center mb-8">
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Esforço (RPE)</span>
                  <span className="text-[8px] font-bold text-blue-700 dark:text-blue-400 uppercase mt-1 tracking-[0.3em]">Percepção de Cansaço</span>
                </div>
                <span className={`text-6xl font-black italic tracking-tighter drop-shadow-sm ${getRPEColor(rpe)}`}>{rpe}</span>
              </div>
              <input 
                type="range" min="1" max="10" 
                value={rpe} 
                onChange={e => { triggerHaptic(2); setRpe(parseInt(e.target.value) as RPEValue); }}
                className="w-full h-2.5 bg-slate-100 dark:bg-white/10 rounded-full appearance-none accent-blue-700 dark:accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between mt-8 px-1">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1.5 h-4 rounded-full transition-all duration-300 ${
                      i + 1 <= rpe 
                        ? (i + 1 > 8 ? 'bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]' : i + 1 > 5 ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]') 
                        : 'bg-slate-200 dark:bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* 3. STICKY FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 p-8 bg-white/95 dark:bg-[#020617]/95 backdrop-blur-3xl border-t border-slate-100 dark:border-white/5 z-[120]">
        <div className="max-w-md mx-auto">
          <button 
            onClick={handleLogSet}
            className="w-full py-7 blue-gradient text-white rounded-[28px] font-black text-sm uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(0,43,84,0.3)] active:scale-[0.98] transition-all flex items-center justify-center space-x-4 border border-white/20"
          >
            <span>REGISTRAR PERFORMANCE</span>
            <Icons.ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </footer>

      {/* REST OVERLAY */}
      {isResting && (
        <div className="fixed inset-0 z-[200] bg-white dark:bg-[#020617] flex flex-col items-center justify-center p-12 animate-in fade-in duration-500">
           <div className="relative w-80 h-80 flex items-center justify-center">
             <svg className="absolute inset-0 w-full h-full -rotate-90">
               <circle cx="160" cy="160" r="150" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-slate-50 dark:text-white/5" />
               <circle 
                 cx="160" cy="160" r="150" stroke="currentColor" strokeWidth="10" fill="transparent" 
                 className="text-blue-600 transition-all duration-1000"
                 strokeDasharray={942}
                 strokeDashoffset={942 - (942 * restTime) / 60}
                 strokeLinecap="round"
               />
             </svg>
             <span className="text-[11rem] font-black tabular-nums text-slate-950 dark:text-white leading-none tracking-tighter">{restTime}</span>
           </div>
           <p className="mt-14 text-[11px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-[0.6em] animate-pulse">Recuperação Estratégica</p>
           <button 
             onClick={() => { triggerHaptic(10); setIsResting(false); }}
             className="mt-20 px-14 py-6 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 active:scale-95 shadow-sm"
           >
             Pular Intervalo
           </button>
        </div>
      )}

      {/* FINISH OVERLAY */}
      {isFinishing && (
        <div className="fixed inset-0 z-[300] bg-white dark:bg-[#020617] flex flex-col items-center justify-center p-10 animate-in slide-in-from-bottom-20 duration-700">
           <div className="w-44 h-44 bg-blue-700 text-white rounded-[56px] flex items-center justify-center mb-14 shadow-[0_32px_64px_-16px_rgba(0,43,84,0.4)] animate-in zoom-in duration-700 delay-200">
             <Icons.Shield className="w-24 h-24" />
           </div>
           <h3 className="text-6xl font-black text-slate-950 dark:text-white mb-8 tracking-tighter text-center leading-none uppercase">GOVERNANÇA<br/>VALIDADA</h3>
           <p className="text-slate-500 dark:text-slate-400 text-lg text-center mb-24 max-w-[300px] font-medium leading-relaxed">
             Sua sessão foi concluída e os dados de performance foram sincronizados com sucesso.
           </p>
           <button 
             onClick={onFinish}
             className="w-full max-w-sm py-8 blue-gradient text-white rounded-[32px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all border border-white/20"
           >
             ENCERRAR TURNO
           </button>
        </div>
      )}
    </div>
  );
};

export default ActiveSession;
