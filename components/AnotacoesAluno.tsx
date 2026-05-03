
import React, { useState } from 'react';
import { AnotacaoAluno, User } from '../types';
import { Icons } from '../constants';
import Card from './Card';

interface AnotacoesAlunoProps {
  user: User;
  anotacoes: AnotacaoAluno[];
  onSave: (conteudo: string) => void;
  onDelete: (id: string) => void;
}

const AnotacoesAluno: React.FC<AnotacoesAlunoProps> = ({ anotacoes, onSave, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState('');

  const handleSave = () => {
    if (newNote.trim()) {
      onSave(newNote);
      setNewNote('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-700">
      {/* Botão Nova Anotação */}
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full h-16 glass-panel border-dashed border-slate-300 dark:border-white/10 rounded-2xl flex items-center justify-center space-x-3 text-slate-500 hover:text-blue-500 transition-all active:scale-[0.98]"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Icons.Plus className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Adicionar Insight</span>
        </button>
      ) : (
        <div className="glass-panel rounded-3xl p-6 border-blue-500/30 ring-1 ring-blue-500/10 space-y-4 animate-in zoom-in-95 duration-500">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Nova Anotação</span>
            <button onClick={() => setIsAdding(false)} className="text-slate-400">
              <Icons.Plus className="w-4 h-4 rotate-45" />
            </button>
          </div>
          <textarea
            autoFocus
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Registre um feedback sobre o treino, uma carga nova ou como se sentiu hoje..."
            className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-500/50 transition-all min-h-[120px] resize-none font-medium leading-relaxed"
          />
          <div className="flex space-x-3">
            <button
              onClick={() => setIsAdding(false)}
              className="flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 glass-panel active:scale-95 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-[2] h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-white mesh-gradient shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
            >
              Salvar Nota
            </button>
          </div>
        </div>
      )}

      {/* Lista de Anotações */}
      <div className="grid grid-cols-1 gap-4">
        {anotacoes.length === 0 ? (
          <div className="py-12 text-center space-y-3 opacity-40">
            <Icons.Edit className="w-8 h-8 mx-auto text-slate-400" />
            <p className="text-[9px] font-black uppercase tracking-widest">Suas notas aparecerão aqui</p>
          </div>
        ) : (
          anotacoes.map((nota) => (
            <Card key={nota.id} className="p-6 relative group overflow-hidden border-slate-200 dark:border-white/5">
              <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 dark:bg-white/10"></div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                  {new Date(nota.criadaEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
                <button 
                  onClick={() => onDelete(nota.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <Icons.Trash className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">
                {nota.conteudo}
              </p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AnotacoesAluno;
