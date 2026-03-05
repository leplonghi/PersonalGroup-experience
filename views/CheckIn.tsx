
import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Icons } from '../constants';
import { performCheckIn, getGymConfig, isGymOpen } from '../firebase';

interface CheckInProps {
  userId: string;
  userName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const CheckIn: React.FC<CheckInProps> = ({ userId, userName, onSuccess, onCancel }) => {
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'SYNCING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');
  const [gymOpen, setGymOpen] = useState<{ open: boolean; reason?: string } | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Check gym hours on mount
    getGymConfig().then(cfg => {
      setGymOpen(isGymOpen(cfg));
    });

    // Cleanup scanner on unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(err => console.error("Failed to stop scanner", err));
      }
    };
  }, []);

  const startScanner = async () => {
    // Block if gym is closed
    if (gymOpen && !gymOpen.open) {
      setErrorMsg(gymOpen.reason || 'Academia fechada neste horário.');
      setStatus('ERROR');
      return;
    }

    setStatus('SCANNING');
    await new Promise(r => setTimeout(r, 100)); // Wait for DOM render

    try {
      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      await scanner.start(
        { facingMode: "environment" },
        config,
        async (decodedText) => {
          // Success callback
          await handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Error callback (ignore frequent read errors)
        }
      );
    } catch (err) {
      console.error("Camera error", err);
      setErrorMsg("Não foi possível acessar a câmera. Verifique as permissões.");
      setStatus('ERROR');
    }
  };

  const handleScanSuccess = async (qrCodeData: string) => {
    if (scannerRef.current) {
      await scannerRef.current.stop();
      scannerRef.current = null;
    }
    setStatus('SYNCING');

    try {
      // Allow any QR code for demo, or validate specific format
      // In real scenario: if (qrCodeData.startsWith('pg_unit_')) ...
      const gymId = qrCodeData || "unit_default";

      await performCheckIn(userId, gymId);

      setStatus('SUCCESS');
      setTimeout(onSuccess, 2000);
    } catch (err) {
      console.error("Check-in failed", err);
      setErrorMsg("Falha ao registrar presença. Tente novamente.");
      setStatus('ERROR');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#020617] flex flex-col transition-colors duration-500 overflow-hidden font-sans">
      <div className="absolute inset-0 mesh-gradient opacity-5"></div>

      {/* Header Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
        <button onClick={onCancel} className="text-white/50 hover:text-white p-2">
          <Icons.X className="w-8 h-8" />
        </button>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10 w-full max-w-md mx-auto">

        {status === 'IDLE' && (
          <div className="animate-in fade-in zoom-in duration-700 flex flex-col items-center w-full">
            <div className="w-72 h-72 glass-panel rounded-[64px] border-2 border-dashed border-blue-500/20 flex items-center justify-center mb-16 relative overflow-hidden group shadow-2xl">
              <Icons.QRCode className="w-36 h-36 text-slate-200 dark:text-slate-950 dark:text-white/10 group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-blue-600/5 animate-pulse"></div>
              <div className="absolute top-0 left-0 right-0 h-1 mesh-gradient animate-[bounce_3s_infinite] opacity-50 shadow-[0_0_20px_rgba(59,130,246,0.8)]"></div>
            </div>
            <h3 className="text-4xl font-bold text-white mb-6 tracking-tight uppercase leading-none">VAMOS<br /><span className="text-blue-600">TREINAR?</span></h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mb-16 max-w-[280px] leading-relaxed">Escaneie o QR Code na recepção.</p>
            <button
              onClick={startScanner}
              className="w-full h-20 bg-blue-600 hover:bg-blue-500 text-white rounded-[32px] font-bold text-xs uppercase tracking-[0.4em] shadow-2xl shadow-blue-900/40 active:scale-[0.97] transition-all border border-white/10"
            >
              Ler QR Code
            </button>
          </div>
        )}

        {status === 'SCANNING' && (
          <div className="flex flex-col items-center w-full animate-in fade-in duration-500">
            <div className="relative w-full aspect-square max-w-sm mb-8 overflow-hidden rounded-[40px] border-4 border-blue-500/30 bg-black shadow-2xl">
              <div id="reader" className="w-full h-full object-cover"></div>
              {/* Overlay Guide */}
              <div className="absolute inset-0 border-[40px] border-black/50 pointer-events-none z-10"></div>
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <div className="w-48 h-48 border-2 border-white/50 rounded-3xl relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 -mt-1 -ml-1 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 -mt-1 -mr-1 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 -mb-1 -ml-1 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 -mb-1 -mr-1 rounded-br-lg"></div>
                </div>
              </div>
            </div>
            <p className="text-white font-bold text-xs uppercase tracking-[0.2em] animate-pulse">Aponte para o QR Code</p>
          </div>
        )}

        {status === 'SYNCING' && (
          <div className="flex flex-col items-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-blue-600 rounded-[40px] flex items-center justify-center text-white shadow-2xl shadow-blue-900/40 animate-bounce mb-12">
              <Icons.Repeat className="w-12 h-12 animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">Validando...</h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">Registrando sua presença...</p>
          </div>
        )}

        {status === 'SUCCESS' && (
          <div className="animate-in zoom-in duration-700 flex flex-col items-center">
            <div className="w-40 h-40 bg-green-500 text-white rounded-[56px] flex items-center justify-center mb-16 shadow-2xl shadow-green-900/40 group">
              <Icons.Shield className="w-20 h-20 group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <h3 className="text-5xl font-bold text-white mb-6 tracking-tight uppercase leading-none animate-in slide-in-from-bottom-8 duration-700">ACESSO<br /><span className="text-green-500">CONFIRMADO</span></h3>
            <p className="text-slate-400 text-lg font-bold uppercase tracking-widest animate-in slide-in-from-bottom-8 duration-700 delay-300">Bom treino, {userName.split(' ')[0]}!</p>
          </div>
        )}

        {status === 'ERROR' && (
          <div className="animate-in shake duration-500 flex flex-col items-center">
            <div className="w-24 h-24 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mb-8 border border-red-500/50">
              <Icons.ExclamationCircle className="w-12 h-12" />
            </div>
            <p className="text-red-400 font-bold text-center capitalize mb-8 px-4">{errorMsg}</p>
            <button
              onClick={() => { setStatus('IDLE'); setErrorMsg(''); }}
              className="px-8 py-4 bg-white/10 text-white rounded-xl font-bold uppercase tracking-wider hover:bg-white/20"
            >
              Tentar Novamente
            </button>
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
