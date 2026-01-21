
import React, { useState } from 'react';
import { Protocol, ProtocolExercise } from '../types';
import Card from '../components/Card';
import { Icons } from '../constants';

interface ProtocolEditorProps {
  protocol?: Protocol;
  onSave: (protocol: Protocol) => void;
  onBack: () => void;
}

const ProtocolEditor: React.FC<ProtocolEditorProps> = ({ protocol, onSave, onBack }) => {
  const [name, setName] = useState(protocol?.name ?? '');
  const [goal, setGoal] = useState(protocol?.goal ?? 'Hipertrofia');
  const [exercises, setExercises] = useState<ProtocolExercise[]>(protocol?.exercises ?? []);
  const [isSaving, setIsSaving] = useState(false);

  const addExercise = () => {
    const newEx: ProtocolExercise = {
      id: Math.random().toString(36).substring(2, 11),
      name: '',
      sets: 3,
      reps: '12',
      progressionRule: 'Progressão linear: +2kg se RPE < 8 por 2 sessões',
      variations: 'Uso de halteres ou Smith machine'
    };
    setExercises([...exercises, newEx]);
  };

  const updateExercise = (id: string, field: keyof ProtocolExercise, value: string | number) => {
    setExercises(exercises.map(ex => ex.id === id ? { ...ex, [field]: value } : ex));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Por favor, identifique este protocolo.");
      return;
    }
    
    setIsSaving(true);
    
    const nextVersion = protocol 
      ? (parseFloat(protocol.version) + 0.1).toFixed(1) 
      : '1.0';
    
    const newProtocol: Protocol = {
      id: protocol?.id ?? Math.random().toString(36).substring(2, 11),
      name: name,
      goal: goal,
      version: nextVersion,
      lastUpdated: new Date().toLocaleDateString('pt-BR'),
      exercises: exercises
    };

    try {
      await onSave(newProtocol);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center transition-transform active:scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-center">
            <p className="text-[10px] font-black text-blue-900/40 uppercase tracking-[0.2em] mb-1 leading-none">Governança Técnica</p>
            <h2 className="text-xs font-black text-blue-900 uppercase tracking-widest">
              {protocol ? `Revisão de Protocolo` : 'Novo Ciclo Base'}
            </h2>
          </div>
          <button 
            disabled={isSaving}
            onClick={handleSave} 
            className={`w-10 h-10 blue-gradient text-white rounded-xl flex items-center justify-center shadow-lg transition-transform active:scale-90 ${isSaving ? 'opacity-50' : ''}`}
          >
            {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Icons.Save className="w-5 h-5" />}
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest ml-1">Nome do Protocolo</label>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Hipertrofia Metabólica"
              className="w-full text-lg font-black text-blue-900 bg-gray-50 rounded-2xl px-5 py-4 border-none focus:ring-2 focus:ring-blue-900/10 placeholder:text-gray-200 transition-all"
            />
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-1">
              <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest ml-1">Foco Principal</label>
              <select 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full text-[11px] font-black text-blue-900 bg-gray-50 px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-blue-900/10 uppercase tracking-widest"
              >
                <option value="Hipertrofia">Hipertrofia</option>
                <option value="Força">Força Máxima</option>
                <option value="Resistência">Resistência</option>
                <option value="Recuperação">Recuperação</option>
              </select>
            </div>
            <div className="text-right shrink-0">
               <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-1">Status</label>
               <span className="inline-block text-[10px] font-black text-blue-900 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg">
                 VERSIONAMENTO V{protocol ? (parseFloat(protocol.version) + 0.1).toFixed(1) : '1.0'}
               </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 px-6 py-8 space-y-6">
        <div className="flex justify-between items-center px-1">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estrutura Biomecânica</h4>
          <span className="text-[10px] font-black text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md">{exercises.length} Total</span>
        </div>

        <div className="space-y-5">
          {exercises.map((ex, idx) => (
            <Card key={ex.id} className="p-6 border-none shadow-md space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                <div className="flex items-center">
                  <span className="text-[10px] font-black text-blue-900 bg-blue-50 w-7 h-7 flex items-center justify-center rounded-xl mr-3 border border-blue-100">{idx + 1}</span>
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Configuração</span>
                </div>
                <button 
                  onClick={() => setExercises(exercises.filter(e => e.id !== ex.id))}
                  className="w-8 h-8 flex items-center justify-center text-red-200 hover:text-red-500 transition-colors bg-red-50/30 rounded-lg"
                >
                  <Icons.Trash className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <input 
                  placeholder="Nome do Exercício"
                  value={ex.name}
                  onChange={(e) => updateExercise(ex.id, 'name', e.target.value)}
                  className="w-full font-black text-sm text-gray-800 bg-transparent border-b border-gray-100 pb-2 focus:outline-none focus:border-blue-900 transition-all placeholder:text-gray-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest ml-1">Séries</label>
                  <input 
                    type="number"
                    value={ex.sets}
                    onChange={(e) => updateExercise(ex.id, 'sets', parseInt(e.target.value) || 0)}
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold border-none focus:ring-2 focus:ring-blue-900/10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest ml-1">Repetições</label>
                  <input 
                    value={ex.reps}
                    placeholder="Ex: 8-12"
                    onChange={(e) => updateExercise(ex.id, 'reps', e.target.value)}
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold border-none focus:ring-2 focus:ring-blue-900/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 ml-1">
                   <Icons.TrendingUp className="w-3 h-3 text-blue-900/40" />
                   <label className="text-[9px] font-black text-blue-900/40 uppercase tracking-widest">Diretriz de Progressão</label>
                </div>
                <textarea 
                  placeholder="Defina as regras de avanço de carga..."
                  value={ex.progressionRule}
                  onChange={(e) => updateExercise(ex.id, 'progressionRule', e.target.value)}
                  className="w-full bg-gray-50 rounded-xl p-4 text-[11px] font-medium min-h-[70px] focus:outline-none border-none focus:ring-2 focus:ring-blue-900/10 leading-relaxed placeholder:text-gray-300"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 ml-1">
                   <Icons.Settings className="w-3 h-3 text-blue-900/40" />
                   <label className="text-[9px] font-black text-blue-900/40 uppercase tracking-widest">Substituições Permitidas</label>
                </div>
                <input 
                  placeholder="Ex: Leg Press ou Agachamento Sumô"
                  value={ex.variations}
                  onChange={(e) => updateExercise(ex.id, 'variations', e.target.value)}
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-[11px] font-medium focus:outline-none border-none focus:ring-2 focus:ring-blue-900/10 placeholder:text-gray-300"
                />
              </div>
            </Card>
          ))}
        </div>

        <button 
          onClick={addExercise}
          className="w-full border-2 border-dashed border-gray-200 rounded-[28px] py-10 flex flex-col items-center justify-center text-gray-300 hover:text-blue-900 hover:border-blue-900 hover:bg-blue-50/30 transition-all group"
        >
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Icons.Plus className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Acrescentar Exercício</span>
        </button>
      </div>

      <div className="h-32"></div>
    </div>
  );
};

export default ProtocolEditor;
