
import React, { useState } from 'react';
import { User, AppMessage, MessageType } from '../types';
import Card from '../components/Card';
import { Icons } from '../constants';

interface MessagesProps {
  user: User;
}

const Messages: React.FC<MessagesProps> = ({ user }) => {
  const [filter, setFilter] = useState<'ALL' | MessageType>('ALL');
  const [selectedMsg, setSelectedMsg] = useState<AppMessage | null>(null);

  const mockMessages: AppMessage[] = [
    {
      id: '1',
      userId: user.id,
      type: 'MOTIVATIONAL',
      title: 'Dica do Dia',
      content: 'Lembre-se: seu ciclo de "Volume Adaptativo" foi desenhado para testar seus limites neurais hoje. Foco total na cadência 4-0-2.',
      date: 'Hoje, 08:30',
      read: false,
      author: 'Sistema Exclusive'
    },
    {
      id: '2',
      userId: 'PUBLIC',
      type: 'INSTITUTIONAL',
      title: 'Manutenção Pista 02',
      content: 'Prezado aluno, informamos que a Pista 02 passará por calibração técnica biomecânica amanhã das 10h às 14h. Utilize a Pista Principal.',
      date: 'Ontem, 16:45',
      read: true,
      author: 'Governança Unidade Jardins'
    },
    {
      id: '3',
      userId: user.id,
      type: 'SEGMENTED',
      title: 'Resultado de Avaliação',
      content: 'Sua última Bioimpedância mostrou um ganho de 1.2kg de massa magra. Excelente resposta ao estímulo metabólico do ciclo anterior.',
      date: '12 Abr',
      read: true,
      author: 'Coord. Felipe'
    }
  ];

  const filteredMessages = filter === 'ALL'
    ? mockMessages
    : mockMessages.filter(m => m.type === filter);

  const getTypeStyle = (type: MessageType) => {
    switch (type) {
      case 'INSTITUTIONAL': return 'bg-blue-500/10 text-deep-blue dark:text-blue-400 border-blue-500/20';
      case 'SEGMENTED': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      case 'MOTIVATIONAL': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    }
  };

  const getTypeName = (type: MessageType) => {
    switch (type) {
      case 'INSTITUTIONAL': return 'Avisos';
      case 'SEGMENTED': return 'Evolução';
      case 'MOTIVATIONAL': return 'Dicas';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 pb-32 pt-4 relative px-8">


      {/* Quote Card Impactante */}
      <Card variant="blue" className="p-8 relative overflow-hidden group rounded-[40px] shadow-2xl shadow-blue-900/40">
        <div className="absolute top-0 right-0 w-48 h-48 mesh-gradient opacity-20 rounded-full -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-[20s]"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-xl mesh-gradient flex items-center justify-center text-slate-950 dark:text-white shadow-lg">
              <Icons.Logo className="w-4 h-4" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-950 dark:text-white/60">Foco do Dia</p>
          </div>
          <p className="text-xl font-black text-slate-950 dark:text-white leading-tight italic tracking-tight">"A consistência é o único atalho para a alta performance. Cada RPE validado é um tijolo no seu legado físico."</p>
        </div>
        <Icons.Plus className="absolute -bottom-6 -left-6 w-32 h-32 opacity-10 rotate-12" />
      </Card>

      {/* Filter Strip Premium */}
      <div className="flex space-x-3 overflow-x-auto no-scrollbar py-2 -mx-2 px-2">
        {(['ALL', 'INSTITUTIONAL', 'SEGMENTED', 'MOTIVATIONAL'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all border duration-500 ${filter === f
              ? 'mesh-gradient text-white border-transparent shadow-2xl shadow-blue-900/40 scale-105'
              : 'glass-panel text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5 active:scale-95'
              }`}
          >
            {f === 'ALL' ? 'Todas' : getTypeName(f as MessageType)}
          </button>
        ))}
      </div>

      {/* Grid de Mensagens */}
      <div className="space-y-4">
        {filteredMessages.map(msg => (
          <div
            key={msg.id}
            onClick={() => setSelectedMsg(msg)}
            className={`glass-panel rounded-[32px] p-6 border transition-all active:scale-[0.98] cursor-pointer group relative overflow-hidden ${msg.read ? 'border-slate-200 dark:border-white/5' : 'border-blue-500/30 ring-1 ring-blue-500/10'}`}
          >
            {!msg.read && (
              <div className="absolute top-0 left-0 bottom-0 w-1.5 mesh-gradient shadow-[0_0_15px_rgba(59,130,246,0.4)]"></div>
            )}
            <div className="flex justify-between items-center mb-4">
              <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-xl border ${getTypeStyle(msg.type)}`}>
                {getTypeName(msg.type)}
              </span>
              <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">{msg.date}</span>
            </div>
            <h4 className={`text-base font-black mb-2 tracking-tight uppercase ${msg.read ? 'text-slate-950 dark:text-white/80' : 'text-gradient'}`}>{msg.title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-600 dark:text-slate-400 font-bold line-clamp-2 leading-relaxed tracking-wide">
              {msg.content}
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100/30 dark:border-white/5 flex items-center justify-between">
              <p className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">{msg.author}</p>
              <Icons.ChevronRight className="w-4 h-4 text-deep-blue dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Message Modal Experience */}
      {selectedMsg && (
        <div className="fixed inset-0 z-[100] bg-deep-blue/40 dark:bg-ocean/80 backdrop-blur-xl flex items-end animate-in fade-in duration-500">
          <div className="w-full bg-white dark:bg-ocean rounded-t-[48px] p-10 pb-16 border-t border-slate-200 dark:border-white/20 animate-in slide-in-from-bottom-20 duration-700 shadow-2xl shadow-black/30">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-2xl border ${getTypeStyle(selectedMsg.type)}`}>
                  {getTypeName(selectedMsg.type)}
                </span>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 font-black uppercase mt-4 tracking-[0.3em]">{selectedMsg.date} • {selectedMsg.author}</p>
              </div>
              <button onClick={() => setSelectedMsg(null)} className="w-12 h-12 glass-panel rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-400 active:scale-90 transition-all">
                <Icons.Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <h3 className="text-3xl font-black text-slate-950 dark:text-white mb-6 uppercase tracking-tight italic">{selectedMsg.title}</h3>
            <p className="text-base text-slate-600 dark:text-slate-600 dark:text-slate-400 font-bold leading-relaxed whitespace-pre-wrap tracking-wide">
              {selectedMsg.content}
            </p>
            <button
              onClick={() => setSelectedMsg(null)}
              className="w-full h-16 mt-12 mesh-gradient text-white rounded-[24px] font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-blue-900/40 active:scale-[0.97] transition-all"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
