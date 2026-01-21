
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

  // Cálculo automático de Massa Magra
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
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <header className="mb-8">
              <p className="text-[10px] font-black text-blue-900/40 uppercase tracking-[0.2em] mb-1">Passo 01/03</p>
              <h3 className="text-xl font-black text-blue-900">Tipo de Intervenção</h3>
            </header>
            
            <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'INICIAL', label: 'Avaliação Inicial', desc: 'Primeiro contato e setup biométrico base.' },
                { id: 'PERIODICA', label: 'Check-point Periódico', desc: 'Validar evolução e destravar novo ciclo.' },
                { id: 'EXTRAORDINARIA', label: 'Intervenção Extra', desc: 'Análise por exceção ou alteração clínica.' }
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => setType(t.id as AssessmentType)}
                  className={`p-6 rounded-[32px] border-2 text-left transition-all relative overflow-hidden ${type === t.id ? 'border-blue-900 bg-blue-50/30' : 'border-gray-100 bg-white'}`}
                >
                  <p className={`text-sm font-black uppercase tracking-widest ${type === t.id ? 'text-blue-900' : 'text-gray-400'}`}>{t.label}</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium leading-relaxed">{t.desc}</p>
                  {type === t.id && <div className="absolute top-4 right-4 w-2 h-2 bg-blue-900 rounded-full"></div>}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-10 animate-in slide-in-from-right duration-300">
            <header>
              <p className="text-[10px] font-black text-blue-900/40 uppercase tracking-[0.2em] mb-1">Passo 02/03</p>
              <h3 className="text-xl font-black text-blue-900">Métricas Biométricas</h3>
            </header>
            
            <div className="space-y-8">
              {/* Peso */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Peso Corporal</label>
                  <div className="text-right">
                    <span className="text-3xl font-black text-blue-900">{data.weight}</span>
                    <span className="text-xs font-black text-gray-300 ml-1">kg</span>
                  </div>
                </div>
                <input 
                  type="range" min="40" max="180" step="0.1" 
                  value={data.weight} 
                  onChange={e => setData({...data, weight: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none accent-blue-900"
                />
              </div>

              {/* Gordura */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">% de Gordura</label>
                  <div className="text-right">
                    <span className="text-3xl font-black text-amber-500">{data.fatPercentage}</span>
                    <span className="text-xs font-black text-gray-300 ml-1">%</span>
                  </div>
                </div>
                <input 
                  type="range" min="3" max="50" step="0.1" 
                  value={data.fatPercentage} 
                  onChange={e => setData({...data, fatPercentage: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none accent-amber-500"
                />
              </div>

              {/* Resultado Automático */}
              <div className="bg-blue-900 rounded-[28px] p-6 text-white flex justify-between items-center shadow-xl shadow-blue-900/20">
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Massa Magra Estimada</p>
                    <h4 className="text-2xl font-black">{calculatedLeanMass} kg</h4>
                 </div>
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Icons.TrendingUp className="w-6 h-6" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">PA (Repouso)</label>
                  <input 
                    type="text" 
                    value={data.bloodPressure}
                    placeholder="12/8"
                    onChange={e => setData({...data, bloodPressure: e.target.value})}
                    className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm font-black text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900/5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">VO2 Máx</label>
                  <input 
                    type="number" 
                    value={data.vo2Max}
                    placeholder="40"
                    onChange={e => setData({...data, vo2Max: parseInt(e.target.value)})}
                    className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm font-black text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900/5"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <header>
              <p className="text-[10px] font-black text-blue-900/40 uppercase tracking-[0.2em] mb-1">Passo 03/03</p>
              <h3 className="text-xl font-black text-blue-900">Governança & Decisão</h3>
            </header>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Parecer Técnico (Obrigatório)</label>
              <textarea 
                rows={5}
                value={data.observations}
                onChange={e => setData({...data, observations: e.target.value})}
                placeholder="Descreva as condições funcionais e recomendações de carga/volume..."
                className="w-full bg-gray-50 rounded-[32px] p-6 text-sm font-medium border-none focus:ring-4 focus:ring-blue-900/5 leading-relaxed placeholder:text-gray-300 transition-all"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Decisão de Pista</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setDecision('NORMAL')}
                  className={`py-6 rounded-[28px] border-2 flex flex-col items-center justify-center transition-all ${decision === 'NORMAL' ? 'border-green-500 bg-green-50/30' : 'border-gray-50 bg-white'}`}
                >
                  <Icons.Shield className={`w-6 h-6 mb-2 ${decision === 'NORMAL' ? 'text-green-600' : 'text-gray-300'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${decision === 'NORMAL' ? 'text-green-600' : 'text-gray-400'}`}>Liberar Ciclo</span>
                </button>
                <button 
                  onClick={() => setDecision('WARNING')}
                  className={`py-6 rounded-[28px] border-2 flex flex-col items-center justify-center transition-all ${decision === 'WARNING' ? 'border-amber-500 bg-amber-50/30' : 'border-gray-50 bg-white'}`}
                >
                  <Icons.Clock className={`w-6 h-6 mb-2 ${decision === 'WARNING' ? 'text-amber-600' : 'text-gray-300'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${decision === 'WARNING' ? 'text-amber-600' : 'text-gray-400'}`}>Ajuste Clínico</span>
                </button>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-6 pt-10 pb-6 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white z-[60]">
        <button onClick={step === 1 ? onBack : handlePrev} className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center transition-transform active:scale-90">
          <Icons.ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div className="text-center">
          <h2 className="text-sm font-black text-blue-900 uppercase tracking-[0.2em]">Avaliação Técnica</h2>
          <p className="text-[9px] text-blue-900/30 font-bold uppercase tracking-widest">{student.name}</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center font-black text-xs">
          {step}/3
        </div>
      </header>

      <div className="flex-1 px-8 py-10 pb-32">
        {renderStep()}
      </div>

      <footer className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white to-transparent z-[70] pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          {step < 3 ? (
            <button 
              onClick={handleNext}
              className="w-full py-5 blue-gradient text-white rounded-[26px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-900/40 active:scale-95 transition-all flex items-center justify-center space-x-3"
            >
              <span>Continuar</span>
              <Icons.ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleFinalize}
              disabled={!data.observations.trim()}
              className={`w-full py-5 rounded-[26px] font-black text-sm uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center space-x-3 ${
                data.observations.trim() 
                  ? 'bg-blue-900 text-white shadow-blue-900/40 active:scale-95' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Icons.Shield className="w-5 h-5" />
              <span>Validar Governança</span>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default AssessmentFlow;
