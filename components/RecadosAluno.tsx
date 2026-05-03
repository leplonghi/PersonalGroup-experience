
import React from 'react';
import { Recado, User } from '../types';
import { Icons } from '../constants';
import Card from './Card';

interface RecadosAlunoProps {
  user: User;
  recados: Recado[];
  onRead: (id: string) => void;
}

const RecadosAluno: React.FC<RecadosAlunoProps> = ({ recados, onRead }) => {
  const sortedRecados = [...recados].sort((a, b) => {
    if (a.fixado && !b.fixado) return -1;
    if (!a.fixado && b.fixado) return 1;
    return new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime();
  });

  if (recados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 animate-in fade-in duration-700">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-dashed border-slate-300 dark:border-white/10">
          <Icons.Bell className="w-8 h-8 text-slate-300 dark:text-slate-700" />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nenhum recado no momento</p>
          <p className="text-[9px] text-slate-500 max-w-[200px]">Fique tranquilo, avisaremos você quando houver novidades.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-700">
      {sortedRecados.map((recado) => (
        <Card
          key={recado.id}
          onClick={() => onRead(recado.id)}
          className={`relative overflow-hidden p-6 cursor-pointer group transition-all active:scale-[0.98] ${
            recado.lido ? 'opacity-80' : 'ring-1 ring-blue-500/30 shadow-lg shadow-blue-900/10'
          }`}
        >
          {recado.fixado && (
            <div className="absolute top-0 right-0">
              <div className="bg-amber-500 text-white p-1.5 pl-3 rounded-bl-2xl shadow-lg">
                <Icons.Plus className="w-3 h-3 rotate-45" /> {/* Using Plus as a makeshift pin or star if needed, but let's check for Star */}
              </div>
            </div>
          )}

          {!recado.lido && (
            <div className="absolute top-6 right-6 w-2 h-2 rounded-full mesh-gradient shadow-lg shadow-blue-500/50 animate-pulse"></div>
          )}

          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${
              recado.remetenteRole === 'ACADEMIA' 
                ? 'bg-pg-cobalt/10 border-pg-cobalt/20 text-pg-cobalt' 
                : 'bg-pg-gold/10 border-pg-gold/20 text-pg-gold'
            }`}>
              {recado.remetenteRole === 'ACADEMIA' ? <Icons.Logo className="w-6 h-6" /> : <Icons.User className="w-6 h-6" />}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  {recado.remetenteRole === 'ACADEMIA' ? 'Institucional' : 'Personal Flex'}
                </span>
                <span className="text-[8px] font-bold text-slate-500 uppercase">
                  {new Date(recado.criadoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </span>
              </div>
              <h4 className={`text-sm font-black uppercase tracking-tight ${!recado.lido ? 'text-gradient' : 'text-slate-900 dark:text-white/80'}`}>
                {recado.titulo}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed">
                {recado.mensagem}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Toque para ler mais</p>
            </div>
            <Icons.ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 group-hover:translate-x-1 transition-transform" />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RecadosAluno;
