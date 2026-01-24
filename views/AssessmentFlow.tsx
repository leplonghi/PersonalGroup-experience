
import React, { useState, useMemo } from 'react';
import { User, Assessment, AssessmentType, AssessmentData, HealthStatus } from '../types';
import Card from '../components/Card';
import { Icons } from '../constants';

interface AssessmentFlowProps {
  student: User;
  chefe: User;
  onBack: () => void;
  onFinish: (assessment: Assessment, newStatus: HealthStatus) => void;
}

const AssessmentFlow: React.FC<AssessmentFlowProps> = ({ student, chefe, onBack, onFinish }) => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<AssessmentType>('PERIODICA');
  const [decision, setDecision] = useState<HealthStatus>('NORMAL');

  const [data, setData] = useState<AssessmentData>({
    weight: 78.5,
    fatPercentage: 16.4,
    leanMass: 65.6,
    vo2Max: 44,
    bloodPressure: '12/8',
    observations: ''
  });

  const calculatedLeanMass = useMemo(() => {
    const fatMass = (data.weight * data.fatPercentage) / 100;
    return parseFloat((data.weight - fatMass).toFixed(1));
  }, [data.weight, data.fatPercentage]);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleFinalize = () => {
    const assessment: Assessment = {
      id: `ass_${Math.random().toString(36).substring(2, 11)}`,
      studentId: student.id,
      chefeId: chefe.id,
      date: new Date().toLocaleDateString('pt-BR'),
      type,
      data: {
        ...data,
        leanMass: calculatedLeanMass
      },
      validated: true
    };
    onFinish(assessment, decision);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
            <header className="border-l-4 border-blue-600 pl-6">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-2">Etapa 1 de 3</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">Tipo de Avaliação</h3>
            </header>

            <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'INICIAL', label: 'Avaliação Inicial', desc: 'Protocolo de admissão e calibração biométrica base.' },
                { id: 'PERIODICA', label: 'Avaliação de Rotina', desc: 'Validação de performance e progressão de ciclo.' },
                { id: 'EXTRAORDINARIA', label: 'Avaliação Extra', desc: 'Análise de exceção ou readequação clínica imediata.' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id as AssessmentType)}
                  className={`p-8 border transition-all text-left relative overflow-hidden ${type === t.id ? 'bg-blue-600 border-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'bg-white border-slate-200 dark:bg-white/5 dark:border-white/5 hover:border-blue-500/30'}`}
                >
                  <p className={`text-base font-black uppercase tracking-widest italic ${type === t.id ? 'text-white' : 'text-slate-600 dark:text-slate-500'}`}>{t.label}</p>
                  <p className={`text-[10px] mt-3 font-black uppercase tracking-widest leading-relaxed opacity-60 ${type === t.id ? 'text-white' : 'text-slate-500 dark:text-slate-600'}`}>{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
            <header className="border-l-4 border-blue-600 pl-6">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-2">Etapa 2 de 3</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">Medidas</h3>
            </header>

            <div className="space-y-12">
              {/* Peso */}
              <div className="space-y-6">
                <div className="flex justify-between items-end px-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic leading-none">Peso Corporal</label>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-5xl font-black text-slate-900 dark:text-white italic tracking-tighter tabular-nums leading-none">{data.weight}</span>
                    <span className="text-xs font-black text-blue-600 uppercase italic">kg</span>
                  </div>
                </div>
                <input
                  type="range" min="40" max="180" step="0.1"
                  value={data.weight}
                  onChange={e => setData({ ...data, weight: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 dark:bg-white/5 appearance-none accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Gordura */}
              <div className="space-y-6">
                <div className="flex justify-between items-end px-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic leading-none">% de Gordura</label>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-5xl font-black text-blue-600 italic tracking-tighter tabular-nums leading-none">{data.fatPercentage}</span>
                    <span className="text-xs font-black text-slate-400 dark:text-white opacity-40 uppercase italic">%</span>
                  </div>
                </div>
                <input
                  type="range" min="3" max="50" step="0.1"
                  value={data.fatPercentage}
                  onChange={e => setData({ ...data, fatPercentage: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 dark:bg-white/5 appearance-none accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Resultado Automático */}
              <div className="bg-white dark:bg-ocean p-10 flex justify-between items-center shadow-2xl border border-slate-200 dark:border-white/10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2 italic leading-none">Massa Magra</p>
                  <h4 className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter leading-none">{calculatedLeanMass} <span className="text-sm">kg</span></h4>
                </div>
                <div className="w-16 h-16 bg-slate-900 dark:bg-midnight flex items-center justify-center text-white">
                  <Icons.TrendingUp className="w-8 h-8" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic ml-1 leading-none">PA (Repouso)</label>
                  <input
                    type="text"
                    value={data.bloodPressure}
                    placeholder="12/8"
                    onChange={e => setData({ ...data, bloodPressure: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 py-5 text-base font-black text-slate-900 dark:text-white italic tracking-tighter focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic ml-1 leading-none">VO2 Máx</label>
                  <input
                    type="number"
                    value={data.vo2Max}
                    placeholder="40"
                    onChange={e => setData({ ...data, vo2Max: parseInt(e.target.value) })}
                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 py-5 text-base font-black text-slate-900 dark:text-white italic tracking-tighter focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
            <header className="border-l-4 border-blue-600 pl-6">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-2">Etapa 3 de 3</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">Conclusão</h3>
            </header>

            <div className="space-y-6">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic ml-1 leading-none">Observações</label>
              <textarea
                rows={6}
                value={data.observations}
                onChange={e => setData({ ...data, observations: e.target.value })}
                placeholder="Descreva as condições funcionais e recomendações de carga/volume..."
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white italic leading-relaxed focus:outline-none focus:border-blue-600 placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-6">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic ml-1 leading-none">Resultado Final</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDecision('NORMAL')}
                  className={`py-8 border flex flex-col items-center justify-center transition-all ${decision === 'NORMAL' ? 'bg-blue-600 border-blue-600 shadow-[0_0_20px_#2563EB]' : 'bg-white border-slate-200 dark:bg-white/5 dark:border-white/5'}`}
                >
                  <Icons.Shield className={`w-8 h-8 mb-4 ${decision === 'NORMAL' ? 'text-white' : 'text-slate-400'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] italic ${decision === 'NORMAL' ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>Aprovado</span>
                </button>
                <button
                  onClick={() => setDecision('WARNING')}
                  className={`py-8 border flex flex-col items-center justify-center transition-all ${decision === 'WARNING' ? 'bg-amber-600 border-amber-600 shadow-[0_0_20px_#D97706]' : 'bg-white border-slate-200 dark:bg-white/5 dark:border-white/5'}`}
                >
                  <Icons.Clock className={`w-8 h-8 mb-4 ${decision === 'WARNING' ? 'text-white' : 'text-slate-400'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] italic ${decision === 'WARNING' ? 'text-white' : 'text-slate-400'}`}>Revisar</span>
                </button>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-app flex flex-col transition-colors duration-500 grain-overlay relative p-8">
      <div className="precision-bg absolute inset-0 z-0 opacity-40"></div>

      <div className="flex-1 pb-48 pt-6 relative z-10 no-scrollbar overflow-y-auto">

        {renderStep()}
      </div>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 p-8 glass-panel border-t border-white/5 z-[120] shadow-2xl">
        <div className="max-w-md mx-auto">
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="w-full h-22 bg-blue-600 text-white font-black text-[12px] uppercase tracking-[0.8em] transition-all relative overflow-hidden group/finish shadow-[0_0_30px_rgba(37,99,235,0.4)]"
            >
              <div className="absolute inset-0 bg-white translate-x-[-101%] group-hover/finish:translate-x-0 transition-transform duration-700 mix-blend-difference"></div>
              <div className="flex items-center justify-center space-x-6 relative z-10">
                <span className="italic">Prossiguir</span>
                <Icons.ChevronRight className="w-5 h-5 animate-pulse" />
              </div>
            </button>
          ) : (
            <button
              onClick={handleFinalize}
              disabled={!data.observations.trim()}
              className={`w-full h-22 font-black text-[12px] uppercase tracking-[0.8em] transition-all relative overflow-hidden group/finish shadow-2xl ${data.observations.trim()
                ? 'bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)]'
                : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-800 cursor-not-allowed border border-slate-200 dark:border-white/5'
                }`}
            >
              <div className="absolute inset-0 bg-white translate-x-[-101%] group-hover/finish:translate-x-0 transition-transform duration-700 mix-blend-difference"></div>
              <div className="flex items-center justify-center space-x-6 relative z-10">
                <Icons.Shield className="w-6 h-6 italic" />
                <span className="italic">Finalizar Avaliação</span>
              </div>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default AssessmentFlow;
