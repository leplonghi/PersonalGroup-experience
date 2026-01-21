
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
    <div className="fixed inset-0 z-[200] bg-white dark:bg-[#020617] flex flex-col transition-colors duration-500">
      {/* Header */}
      <header className="px-8 pt-14 pb-6 flex items-center justify-between">
        <button onClick={onCancel} className="w-10 h-10 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400">
          <Icons.ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div className="text-center">
          <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Validar Presença</h2>
          <p className="text-[9px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">Unidade Península</p>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        {status === 'IDLE' && (
          <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center">
            <div className="w-64 h-64 bg-slate-50 dark:bg-white/5 rounded-[48px] border-4 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center mb-12 relative overflow-hidden group">
              <Icons.QRCode className="w-32 h-32 text-slate-200 dark:text-white/10 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-blue-600/5 animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">PRONTO PARA O TURNO?</h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium mb-12 max-w-[260px]">Aproxime seu dispositivo do totem Exclusive ou valide via geolocalização.</p>
            <button 
              onClick={() => setStatus('SCANNING')}
              className="w-full max-w-xs py-6 blue-gradient text-white rounded-[28px] font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
            >
              Iniciar Check-in
            </button>
          </div>
        )}

        {status === 'SCANNING' && (
          <div className="flex flex-col items-center w-full max-w-xs">
            <div className="relative w-72 h-72 mb-16">
               <svg className="absolute inset-0 w-full h-full -rotate-90">
                 <circle cx="144" cy="144" r="130" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-slate-50 dark:text-white/5" />
                 <circle 
                   cx="144" cy="144" r="130" stroke="currentColor" strokeWidth="8" fill="transparent" 
                   className="text-blue-600 transition-all duration-100"
                   strokeDasharray={816}
                   strokeDashoffset={816 - (816 * progress) / 100}
                   strokeLinecap="round"
                 />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">{progress}%</span>
                 <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-2">Buscando Sinal</span>
               </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Validando Biometria...</p>
          </div>
        )}

        {status === 'SYNCING' && (
          <div className="flex flex-col items-center">
             <div className="w-20 h-20 bg-blue-600 rounded-[28px] flex items-center justify-center text-white shadow-2xl animate-bounce mb-8">
               <Icons.Repeat className="w-10 h-10 animate-spin" />
             </div>
             <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Sincronizando com Personal</h3>
             <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">Aguarde a liberação da pista</p>
          </div>
        )}

        {status === 'SUCCESS' && (
          <div className="animate-in zoom-in duration-700 flex flex-col items-center">
             <div className="w-32 h-32 bg-green-500 text-white rounded-[40px] flex items-center justify-center mb-10 shadow-[0_24px_48px_rgba(34,197,94,0.3)]">
               <Icons.Shield className="w-16 h-16" />
             </div>
             <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter uppercase leading-none">CHECK-IN<br/>VALIDADO</h3>
             <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Bom treino, {userName.split(' ')[0]}!</p>
          </div>
        )}
      </main>

      <footer className="p-12 text-center">
         <p className="text-[8px] font-black text-slate-200 dark:text-slate-800 uppercase tracking-[0.6em]">PGLAB Governança Ativa v1.5.0</p>
      </footer>
    </div>
  );
};

export default CheckIn;
