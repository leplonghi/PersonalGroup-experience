import React, { useState, useCallback } from 'react';
import { Icons } from '../constants';
import { obterLocalizacao, verificarDentroDoRaio, registrarCheckIn } from '../src/services/checkInService';

interface CheckInProps {
  userId: string;
  userName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

type Step = 'GPS_CHECK' | 'LOADING' | 'OUTSIDE' | 'ENERGY' | 'LIMITATION' | 'CONFIRMING' | 'DONE' | 'ERROR';

const CheckIn: React.FC<CheckInProps> = ({ userId, userName, onSuccess, onCancel }) => {
  const [step, setStep] = useState<Step>('GPS_CHECK');
  const [energy, setEnergy] = useState<'low' | 'medium' | 'high' | null>(null);
  const [limitation, setLimitation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const triggerHaptic = useCallback((pattern: number | number[]) => {
    if ('vibrate' in navigator) navigator.vibrate(pattern);
  }, []);

  const handleVerificarLocalizacao = async () => {
    setStep('LOADING');
    try {
      const position = await obterLocalizacao();
      const taDentro = verificarDentroDoRaio(position.coords.latitude, position.coords.longitude);

      if (taDentro) {
        triggerHaptic(50);
        setStep('ENERGY');
      } else {
        triggerHaptic([50, 100, 50]);
        setStep('OUTSIDE');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Erro ao obter localização. Permita o acesso ao GPS.');
      setStep('ERROR');
    }
  };

  const handleConfirmar = async () => {
    if (!energy) return;
    setStep('CONFIRMING');
    try {
      await registrarCheckIn(userId, energy, limitation);
      triggerHaptic([50, 30, 80]);
      setStep('DONE');
      setTimeout(() => onSuccess(), 2500);
    } catch (e: any) {
      setErrorMessage(e.message || 'Erro ao registrar check-in');
      setStep('ERROR');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#021141] text-white flex flex-col font-sans overflow-hidden">
      {/* Background detail */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00b6fd] rounded-full blur-[120px] mix-blend-screen translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Header */}
      <div className="pt-12 px-6 pb-6 relative z-10 flex items-center">
        <button onClick={onCancel} className="w-10 h-10 border border-white/20 bg-white/5 backdrop-blur-md rounded-xl flex items-center justify-center active:scale-95 transition-all text-white hover:bg-white/10">
          <Icons.X className="w-5 h-5" />
        </button>
        <div className="flex-1 text-center pr-10">
          <h1 className="text-[10px] font-black uppercase tracking-widest text-[#00b6fd] font-display">Check-in</h1>
        </div>
      </div>

      <main className="flex-1 px-6 flex flex-col justify-center relative z-10 pb-12 max-w-lg mx-auto w-full">
        {step === 'GPS_CHECK' && (
          <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-40 h-40 bg-[#00b6fd]/10 rounded-[40px] flex items-center justify-center border border-[#00b6fd]/30 shadow-[0_0_40px_rgba(0,182,253,0.3)] relative">
              <div className="absolute inset-0 border-[3px] border-[#00b6fd]/30 rounded-[40px] animate-ping opacity-50 duration-1000"></div>
              <Icons.Target className="w-16 h-16 text-[#00b6fd]" />
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Localização</h2>
              <p className="text-sm text-white/60 font-medium px-4 leading-relaxed">Confirme que você está no raio de 100m da academia.</p>
            </div>
            <button
              onClick={handleVerificarLocalizacao}
              className="w-full h-16 bg-[#00b6fd] rounded-2xl text-white font-black text-sm uppercase tracking-widest shadow-[0_10px_30px_rgba(0,182,253,0.4)] transition-all active:scale-[0.98] mt-8 flex items-center justify-center"
            >
              <Icons.MapPin className="w-5 h-5 mr-2" />
              Verificar
            </button>
          </div>
        )}

        {step === 'LOADING' && (
          <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
            <div className="w-16 h-16 border-4 border-[#00b6fd] border-t-white/10 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00b6fd] animate-pulse">Buscando sinal...</p>
          </div>
        )}

        {step === 'OUTSIDE' && (
          <div className="flex flex-col items-center justify-center space-y-8 animate-in slide-in-from-bottom-8 duration-500 text-center">
            <div className="w-32 h-32 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30">
              <Icons.Map className="w-12 h-12 text-red-500" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-black tracking-tight text-white uppercase">Muito Longe</h2>
              <p className="text-sm text-white/60 px-2 leading-relaxed">Aproxime-se da recepção para liberar o check-in.</p>
            </div>
            <button
              onClick={() => setStep('GPS_CHECK')}
              className="w-full h-16 border-2 border-white/20 bg-white/5 rounded-2xl text-white font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.98] mt-4"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {step === 'ENERGY' && (
          <div className="flex flex-col space-y-6 animate-in slide-in-from-bottom-8 duration-500">
            <div className="text-center space-y-3 mb-4">
              <h2 className="text-3xl font-black tracking-tight uppercase leading-none">Bateria de Hoje</h2>
              <p className="text-xs text-white/50 font-medium tracking-wide uppercase">Selecione seu nível de energia</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'high', label: 'Energia Alta', icon: Icons.Activity, desc: 'Pronto para bater PR', color: 'text-orange-400', border: 'border-orange-400/50', bg: 'bg-orange-400/10' },
                { id: 'medium', label: 'Normal', icon: Icons.Zap, desc: 'Siga a planilha', color: 'text-[#00b6fd]', border: 'border-[#00b6fd]/50', bg: 'bg-[#00b6fd]/10' },
                { id: 'low', label: 'Energia Baixa', icon: Icons.Moon, desc: 'Preciso pegar leve', color: 'text-indigo-400', border: 'border-indigo-400/50', bg: 'bg-indigo-400/10' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    triggerHaptic(15);
                    setEnergy(item.id as any);
                    setTimeout(() => setStep('LIMITATION'), 300);
                  }}
                  className={`w-full text-left p-6 rounded-[24px] flex items-center space-x-5 border-2 transition-all active:scale-[0.98] ${energy === item.id ? `${item.border} ${item.bg}` : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                >
                  <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${energy === item.id ? item.bg : 'bg-white/5'}`}>
                    <item.icon className={`w-6 h-6 ${energy === item.id ? item.color : 'text-white/50'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg leading-tight">{item.label}</h3>
                    <p className="text-[11px] text-white/50 uppercase tracking-wider mt-1 font-medium">{item.desc}</p>
                  </div>
                  <Icons.ArrowRight className={`w-5 h-5 ${energy === item.id ? item.color : 'text-white/30'}`} />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'LIMITATION' && (
          <div className="flex flex-col h-full animate-in slide-in-from-right-8 duration-500">
            <div className="text-center space-y-3 mb-8">
              <h2 className="text-3xl font-black tracking-tight uppercase leading-none">Limitações?</h2>
              <p className="text-xs text-white/50 font-medium tracking-wide uppercase">Alguma dor ou desconforto? (Opcional)</p>
            </div>

            <div className="flex-1 flex flex-col">
              <textarea
                className="w-full flex-1 min-h-[160px] bg-white/5 border-2 border-white/10 rounded-[24px] p-6 text-white text-lg placeholder-white/20 focus:outline-none focus:border-[#00b6fd]/50 transition-colors resize-none mb-6"
                placeholder="Ex: Dor na lombar, não dormi bem..."
                value={limitation}
                onChange={(e) => setLimitation(e.target.value)}
              ></textarea>

              <div className="flex space-x-3 mt-auto">
                <button
                  onClick={() => setStep('ENERGY')}
                  className="w-16 h-16 border-2 border-white/10 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 active:scale-95 transition-all text-white/50 hover:text-white hover:border-white/20 hover:bg-white/10"
                >
                  <Icons.ArrowLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleConfirmar}
                  className="flex-1 h-16 bg-[#00b6fd] rounded-2xl text-white font-black text-sm uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(0,182,253,0.4)] transition-all active:scale-[0.98] flex items-center justify-center"
                >
                  Concluir
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'CONFIRMING' && (
          <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
            <div className="w-16 h-16 border-4 border-[#00b6fd] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00b6fd] animate-pulse">Registrando...</p>
          </div>
        )}

        {step === 'DONE' && (
          <div className="flex flex-col items-center justify-center h-full animate-in zoom-in-95 duration-500">
            <div className="w-32 h-32 bg-emerald-500/10 rounded-[40px] flex items-center justify-center border-2 border-emerald-500/50 shadow-[0_0_60px_rgba(16,185,129,0.3)] text-emerald-400 mb-8">
              <Icons.Check className="w-16 h-16 animate-in zoom-in duration-300 delay-150" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-white mb-3 text-center uppercase leading-none">Treino<br />Liberado</h2>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em]">Bom treino, {userName.split(' ')[0]}</p>
          </div>
        )}

        {step === 'ERROR' && (
          <div className="flex flex-col items-center justify-center space-y-8 animate-in slide-in-from-bottom-8 duration-500 text-center">
            <div className="w-32 h-32 bg-red-500/10 rounded-[40px] flex items-center justify-center border-2 border-red-500/30">
              <Icons.AlertTriangle className="w-16 h-16 text-red-500" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black tracking-tighter text-white uppercase leading-none">Erro</h2>
              <p className="text-sm text-white/50 px-6 leading-relaxed font-medium">{errorMessage}</p>
            </div>
            <button
              onClick={() => setStep('GPS_CHECK')}
              className="w-full h-16 border-2 border-white/20 bg-white/5 rounded-2xl text-white font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.98] mt-4"
            >
              Recomeçar
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CheckIn;
