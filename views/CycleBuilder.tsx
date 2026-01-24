
import React, { useState, useEffect } from 'react';
import { User, Protocol, TrainingCycle } from '../types';
import Card from '../components/Card';
import { Icons } from '../constants';
import { getProtocols } from '../firebase';

interface CycleBuilderProps {
  student: User;
  onBack: () => void;
  onConfirm: (cycle: TrainingCycle) => void;
}

const CycleBuilder: React.FC<CycleBuilderProps> = ({ student, onBack, onConfirm }) => {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>('');
  const [sessions, setSessions] = useState(12);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('Hipertrofia');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        const data = await getProtocols();
        setProtocols(data);
        if (data.length > 0) setSelectedProtocolId(data[0].id);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProtocols();
  }, []);

  const handleConfirm = () => {
    if (!name.trim()) return alert("Nomeie o ciclo estrategicamente.");

    const cycle: TrainingCycle = {
      id: Math.random().toString(36).substring(2, 11),
      protocolId: selectedProtocolId,
      name: name,
      totalSessions: sessions,
      currentSession: 0,
      startDate: new Date().toLocaleDateString('pt-BR'),
      executionScore: 100,
      progressionRate: 0,
      presenceRate: 100,
      goal: goal
    };
    onConfirm(cycle);
  };

  return (
    <div className="min-h-screen bg-app flex flex-col transition-colors duration-500 grain-overlay relative">
      <div className="precision-bg absolute inset-0 z-0 opacity-40"></div>

      <div className="flex-1 px-8 pt-4 pb-32 space-y-10 relative z-10 max-w-md mx-auto w-full">

        {/* Identificação */}
        <section className="space-y-6">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic ml-1 leading-none">Nome do Plano</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ex: Hipertrofia - Foco em Braços"
            className="w-full text-2xl font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-8 py-6 focus:outline-none focus:border-blue-600 italic tracking-tighter placeholder:text-slate-400 dark:placeholder:text-white/20 transition-all"
          />
        </section>

        {/* Seleção de Protocolo */}
        <section className="space-y-6">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic ml-1 leading-none">Protocolo Base</label>
          <div className="grid grid-cols-1 gap-4">
            {isLoading ? (
              <div className="h-24 bg-white/5 animate-pulse"></div>
            ) : (
              protocols.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProtocolId(p.id)}
                  className={`p-8 border transition-all text-left relative overflow-hidden ${selectedProtocolId === p.id ? 'bg-blue-600 border-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'bg-white border-slate-200 dark:bg-white/5 dark:border-white/5 hover:border-blue-500/30'}`}
                >
                  <div>
                    <p className={`text-base font-black uppercase tracking-widest italic ${selectedProtocolId === p.id ? 'text-white' : 'text-slate-600 dark:text-slate-500'}`}>{p.name}</p>
                    <p className={`text-[10px] font-black uppercase mt-2 tracking-widest opacity-60 ${selectedProtocolId === p.id ? 'text-white' : 'text-slate-700'}`}>Versão {p.version}</p>
                  </div>
                  {selectedProtocolId === p.id && <Icons.Shield className="absolute top-4 right-4 w-6 h-6 text-white/20" />}
                </button>
              ))
            )}
          </div>
        </section>

        {/* Duração */}
        <section className="space-y-12 pt-10">
          <div className="flex justify-between items-end px-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic leading-none">Quantidade de Treinos</label>
            <div className="flex items-baseline space-x-3">
              <span className="text-6xl font-black text-slate-900 dark:text-white italic tracking-tighter leading-none">{sessions}</span>
              <span className="text-xs font-black text-blue-500 uppercase italic">treinos</span>
            </div>
          </div>
          <input
            type="range" min="4" max="36" step="4"
            value={sessions}
            onChange={e => setSessions(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-white/5 appearance-none accent-blue-600 cursor-pointer"
          />
          <div className="flex justify-between text-[8px] font-black text-slate-800 uppercase tracking-widest italic">
            <span>Curto Prazo</span>
            <span>Médio Prazo</span>
            <span>Longo Prazo</span>
          </div>
        </section>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 p-8 glass-panel border-t border-white/5 z-[120] shadow-2xl">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleConfirm}
            className="w-full h-22 bg-blue-600 text-white font-black text-[12px] uppercase tracking-[0.8em] transition-all relative overflow-hidden group/finish shadow-[0_0_30px_rgba(37,99,235,0.4)]"
          >
            <div className="absolute inset-0 bg-white translate-x-[-101%] group-hover/finish:translate-x-0 transition-transform duration-700 mix-blend-difference"></div>
            <div className="flex items-center justify-center space-x-6 relative z-10">
              <span className="italic">Criar Ciclo</span>
              <Icons.ChevronRight className="w-5 h-5 animate-pulse" />
            </div>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CycleBuilder;
