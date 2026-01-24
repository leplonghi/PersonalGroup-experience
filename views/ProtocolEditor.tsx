
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
    <div className="min-h-screen bg-app flex flex-col transition-colors duration-500 grain-overlay relative pb-32">
      <div className="precision-bg absolute inset-0 z-0 opacity-40"></div>

      <div className="flex-1 px-8 pt-6 space-y-10 relative z-10 max-w-md mx-auto w-full">
        {/* Protocol Identification */}
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-blue-300/40 uppercase tracking-[0.4em] italic leading-none">Identificação do Script</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Hipertrofia Metabólica"
              className="w-full text-xl font-black text-white bg-white/5 border border-white/10 px-6 py-4 focus:outline-none focus:border-blue-500 italic tracking-tighter placeholder:opacity-20 transition-all"
            />
          </div>

          <div className="flex items-center justify-between gap-6">
            <div className="flex-1 space-y-4">
              <label className="text-[10px] font-black text-blue-300/40 uppercase tracking-[0.4em] italic leading-none">Vetor de Estímulo</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full text-[10px] font-black text-white bg-white/5 border border-white/10 px-6 py-4 focus:outline-none focus:border-blue-500 uppercase tracking-[0.2em] italic"
              >
                <option value="Hipertrofia">Hipertrofia</option>
                <option value="Força">Força Máxima</option>
                <option value="Resistência">Resistência</option>
                <option value="Recuperação">Recuperação</option>
              </select>
            </div>
            <div className="text-right">
              <label className="text-[10px] font-black text-blue-300/40 uppercase tracking-[0.4em] italic leading-none mb-4 block">Status</label>
              <span className="inline-block text-[10px] font-black text-blue-400 border border-blue-400/30 bg-blue-600/10 px-4 py-2 italic tracking-widest leading-none">
                V{protocol ? (parseFloat(protocol.version) + 0.1).toFixed(1) : '1.0'} BUILD
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center px-2">
          <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none">Arquitetura Biomecânica</h4>
          <span className="text-[10px] font-black text-blue-500 italic tracking-widest">{exercises.length} MÓDULOS</span>
        </div>

        <div className="space-y-8">
          {exercises.map((ex, idx) => (
            <div key={ex.id} className="bg-white/5 border border-white/5 p-8 space-y-8 relative group transition-all">
              <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <div className="flex items-center">
                  <span className="text-[10px] font-black text-white bg-blue-600 w-8 h-8 flex items-center justify-center mr-4 italic shadow-[0_0_15px_rgba(37,99,235,0.4)]">{idx + 1}</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Configuração de Célula</span>
                </div>
                <button
                  onClick={() => setExercises(exercises.filter(e => e.id !== ex.id))}
                  className="w-10 h-10 flex items-center justify-center text-slate-800 hover:text-red-600 transition-colors border border-white/5 hover:border-red-600/30 active:scale-95"
                >
                  <Icons.Trash className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none">Nomenclatura</label>
                <input
                  placeholder="Nome do Exercício"
                  value={ex.name}
                  onChange={(e) => updateExercise(ex.id, 'name', e.target.value)}
                  className="w-full font-black text-lg text-white bg-transparent border-b border-white/10 pb-3 focus:outline-none focus:border-blue-600 transition-all placeholder:opacity-20 italic tracking-tighter"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none">Séries</label>
                  <input
                    type="number"
                    value={ex.sets}
                    onChange={(e) => updateExercise(ex.id, 'sets', parseInt(e.target.value) || 0)}
                    className="w-full bg-white/5 border border-white/10 px-5 py-4 text-base font-black text-white italic tracking-tighter focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none">Repetições</label>
                  <input
                    value={ex.reps}
                    placeholder="Ex: 8-12"
                    onChange={(e) => updateExercise(ex.id, 'reps', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-5 py-4 text-base font-black text-white italic tracking-tighter focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 ml-1">
                  <Icons.TrendingUp className="w-3 h-3 text-blue-500" />
                  <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] italic leading-none">Diretriz de Progressão</label>
                </div>
                <textarea
                  placeholder="Defina as regras de avanço de carga..."
                  value={ex.progressionRule}
                  onChange={(e) => updateExercise(ex.id, 'progressionRule', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-6 text-[11px] font-black uppercase tracking-widest text-white italic min-h-[100px] focus:outline-none focus:border-blue-600 leading-relaxed placeholder:opacity-20"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 ml-1">
                  <Icons.Settings className="w-3 h-3 text-slate-600" />
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none">Substituições</label>
                </div>
                <input
                  placeholder="Ex: Leg Press ou Agachamento Sumô"
                  value={ex.variations}
                  onChange={(e) => updateExercise(ex.id, 'variations', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-5 py-4 text-[10px] font-black uppercase tracking-widest text-white italic focus:outline-none focus:border-blue-600 placeholder:opacity-20"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addExercise}
          className="w-full border border-dashed border-white/10 py-16 flex flex-col items-center justify-center text-slate-700 hover:text-blue-500 hover:border-blue-600 hover:bg-blue-600/5 transition-all group"
        >
          <div className="w-14 h-14 border border-dashed border-current flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Icons.Plus className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">Anexar Módulo</span>
        </button>
      </div>

      {/* SAVE FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 p-8 glass-panel border-t border-white/5 z-[120] shadow-2xl">
        <div className="max-w-md mx-auto">
          <button
            disabled={isSaving}
            onClick={handleSave}
            className="w-full h-22 bg-blue-600 text-white font-black text-[12px] uppercase tracking-[0.8em] transition-all relative overflow-hidden group/finish shadow-[0_0_30px_rgba(37,99,235,0.4)]"
          >
            <div className="absolute inset-0 bg-white translate-x-[-101%] group-hover/finish:translate-x-0 transition-transform duration-700 mix-blend-difference"></div>
            <div className="flex items-center justify-center space-x-6 relative z-10">
              {isSaving ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Icons.Save className="w-6 h-6 italic" />
                  <span className="italic">Consolidar Protocolo</span>
                </>
              )}
            </div>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ProtocolEditor;
