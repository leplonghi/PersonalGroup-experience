
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Icons } from '../constants';

interface CheckInProps {
  userName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const CheckIn: React.FC<CheckInProps> = ({ userName, onSuccess, onCancel }) => {
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'SYNCING' | 'SUCCESS'>('IDLE');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (status === 'SCANNING') {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus('SYNCING');
            return 100;
          }
          return prev + 2;
        });
      }, 50);
    } else if (status === 'SYNCING') {
      setTimeout(() => {
        setStatus('SUCCESS');
        setTimeout(onSuccess, 1500);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [status, onSuccess]);

  return (
    <div className="fixed inset-0 z-[200] bg-[#020617] flex flex-col transition-colors duration-500 overflow-hidden">
      <div className="absolute inset-0 mesh-gradient opacity-5"></div>

      <main className="flex-1 flex flex-col items-center justify-center p-10 pt-4 text-center relative z-10">

        {status === 'IDLE' && (
          <div className="animate-in fade-in zoom-in duration-700 flex flex-col items-center w-full">
            <div className="w-72 h-72 glass-panel rounded-[64px] border-2 border-dashed border-blue-500/20 flex items-center justify-center mb-16 relative overflow-hidden group shadow-2xl">
              <Icons.QRCode className="w-36 h-36 text-slate-200 dark:text-slate-950 dark:text-white/10 group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-blue-600/5 animate-pulse"></div>
              <div className="absolute top-0 left-0 right-0 h-1 mesh-gradient animate-[bounce_3s_infinite] opacity-50 shadow-[0_0_20px_rgba(59,130,246,0.8)]"></div>
            </div>
            <h3 className="text-4xl font-bold text-white mb-6 tracking-tight uppercase leading-none">PRONTO PARA<br /><span className="text-blue-600">TREINAR?</span></h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mb-16 max-w-[280px] leading-relaxed">Aproxime seu celular ou use a localização.</p>
            <button
              onClick={() => setStatus('SCANNING')}
              className="w-full h-20 bg-blue-600 hover:bg-blue-500 text-white rounded-[32px] font-bold text-xs uppercase tracking-[0.4em] shadow-2xl shadow-blue-900/40 active:scale-[0.97] transition-all border border-white/10"
            >
              Fazer Check-in
            </button>
          </div>
        )}

        {status === 'SCANNING' && (
          <div className="flex flex-col items-center w-full max-w-sm animate-in fade-in duration-500">
            <div className="relative w-80 h-80 mb-20 group">
              <div className="absolute inset-0 mesh-gradient rounded-full opacity-10 animate-pulse scale-110"></div>
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="160" cy="160" r="145" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-slate-100 dark:text-slate-950 dark:text-white/5" />
                <circle
                  cx="160" cy="160" r="145" stroke="currentColor" strokeWidth="12" fill="transparent"
                  className="text-[#191970] transition-all duration-100 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                  strokeDasharray={911}
                  strokeDashoffset={911 - (911 * progress) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-8xl font-bold text-white tracking-tight tabular-nums">{progress}%</span>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em] mt-4 leading-none">Verificando...</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></div>
              <p className="text-white font-bold text-xs uppercase tracking-[0.2em]">Confirmando seu plano...</p>
            </div>
          </div>
        )}

        {status === 'SYNCING' && (
          <div className="flex flex-col items-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-blue-600 rounded-[40px] flex items-center justify-center text-white shadow-2xl shadow-blue-900/40 animate-bounce mb-12">
              <Icons.Repeat className="w-12 h-12 animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">Sincronizando...</h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">Preparando seu treino...</p>
          </div>
        )}

        {status === 'SUCCESS' && (
          <div className="animate-in zoom-in duration-1000 flex flex-col items-center">
            <div className="w-40 h-40 bg-blue-600 text-white rounded-[56px] flex items-center justify-center mb-16 shadow-2xl shadow-blue-900/40 group">
              <Icons.Shield className="w-20 h-20 group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <h3 className="text-6xl font-bold text-white mb-6 tracking-tight uppercase leading-none animate-in slide-in-from-bottom-8 duration-700">ACESSO<br /><span className="text-blue-600">LIBERADO</span></h3>
            <p className="text-slate-400 text-lg font-bold uppercase tracking-widest animate-in slide-in-from-bottom-8 duration-700 delay-300">Bom treino, {userName.split(' ')[0]}!</p>
          </div>
        )}
      </main>

      <footer className="p-16 text-center relative z-10">
        <p className="text-[9px] font-bold text-slate-800 uppercase tracking-[0.5em]">Personal Group Experience</p>
      </footer>
    </div>
  );
};

export default CheckIn;
