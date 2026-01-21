
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
    <div className="min-h-screen bg-white flex flex-col animate-in slide-in-from-right duration-300">
      <header className="px-6 pt-10 pb-6 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white z-50">
        <button onClick={onBack} className="p-2 bg-gray-50 rounded-xl">
          <Icons.ChevronRight className="w-5 h-5 text-gray-400 rotate-180" />
        </button>
        <div className="text-center">
          <h2 className="text-sm font-black text-blue-900 uppercase tracking-widest">Configurar Novo Ciclo</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{student.name}</p>
        </div>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 px-8 py-10 space-y-10">
        {/* Identificação */}
        <section className="space-y-4">
           <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Nomenclatura Estratégica</label>
           <input 
             type="text" 
             value={name}
             onChange={e => setName(e.target.value)}
             placeholder="Ex: Hipertrofia III: Volume Adaptativo"
             className="w-full text-lg font-black text-blue-900 bg-gray-50 rounded-2xl px-6 py-5 border-none focus:ring-4 focus:ring-blue-900/5 placeholder:text-gray-200"
           />
        </section>

        {/* Seleção de Protocolo */}
        <section className="space-y-4">
           <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Protocolo Corporativo Base</label>
           <div className="grid grid-cols-1 gap-3">
             {isLoading ? (
               <div className="py-4 animate-pulse bg-gray-50 rounded-2xl h-16"></div>
             ) : (
               protocols.map(p => (
                 <button 
                   key={p.id}
                   onClick={() => setSelectedProtocolId(p.id)}
                   className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${selectedProtocolId === p.id ? 'border-blue-900 bg-blue-50/30' : 'border-gray-50 bg-white'}`}
                 >
                   <div>
                     <p className={`text-sm font-black ${selectedProtocolId === p.id ? 'text-blue-900' : 'text-gray-400'}`}>{p.name}</p>
                     <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Versão {p.version}</p>
                   </div>
                   {selectedProtocolId === p.id && <Icons.Shield className="w-4 h-4 text-blue-900" />}
                 </button>
               ))
             )}
           </div>
        </section>

        {/* Duração */}
        <section className="space-y-6">
           <div className="flex justify-between items-end">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Volume de Sessões</label>
             <span className="text-3xl font-black text-blue-900">{sessions} <span className="text-sm text-gray-300">treinos</span></span>
           </div>
           <input 
             type="range" min="4" max="36" step="4" 
             value={sessions} 
             onChange={e => setSessions(parseInt(e.target.value))}
             className="w-full h-2 bg-gray-50 rounded-lg appearance-none accent-blue-900"
           />
           <div className="flex justify-between text-[8px] font-black text-gray-300 uppercase tracking-widest">
             <span>Impacto Inicial</span>
             <span>Médio Prazo</span>
             <span>Consolidação</span>
           </div>
        </section>
      </div>

      <footer className="p-8">
        <button 
          onClick={handleConfirm}
          className="w-full py-5 blue-gradient text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-900/40 active:scale-95 transition-all"
        >
          Iniciar Ciclo Exclusive
        </button>
      </footer>
    </div>
  );
};

export default CycleBuilder;
