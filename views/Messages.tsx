
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
      // Added missing userId to satisfy AppMessage type
      userId: user.id,
      type: 'MOTIVATIONAL',
      title: 'Mentalidade de Pico',
      content: 'Lembre-se: seu ciclo de "Volume Adaptativo" foi desenhado para testar seus limites neurais hoje. Foco total na cadência 4-0-2.',
      date: 'Hoje, 08:30',
      read: false,
      author: 'Sistema Exclusive'
    },
    {
      id: '2',
      // Added missing userId to satisfy AppMessage type
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
      // Added missing userId to satisfy AppMessage type
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
      case 'INSTITUTIONAL': return 'bg-blue-50 text-blue-900 border-blue-100';
      case 'SEGMENTED': return 'bg-gray-50 text-gray-500 border-gray-100';
      case 'MOTIVATIONAL': return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  const getTypeName = (type: MessageType) => {
    switch (type) {
      case 'INSTITUTIONAL': return 'Institucional';
      case 'SEGMENTED': return 'Progresso';
      case 'MOTIVATIONAL': return 'Mindset';
    }
  };

  return (
    <div className="px-6 py-8 space-y-8 animate-in fade-in duration-500 pb-32">
      <header className="flex justify-between items-center">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Comunicação</p>
          <h2 className="text-2xl font-black text-blue-900">Exclusive Center</h2>
        </div>
      </header>

      {/* Quote Card (Fixed Top) */}
      <Card className="blue-gradient text-white p-6 border-none shadow-xl relative overflow-hidden">
        <div className="relative z-10">
           <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">Daily Performance Mindset</p>
           <p className="text-lg font-black leading-tight">"A consistência é o único atalho para a alta performance. Cada RPE validado é um tijolo no seu legado físico."</p>
        </div>
        <Icons.Plus className="absolute -top-4 -right-4 w-24 h-24 opacity-10 rotate-45" />
      </Card>

      {/* Filter Strip */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar py-2">
        {(['ALL', 'INSTITUTIONAL', 'SEGMENTED', 'MOTIVATIONAL'] as const).map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
              filter === f 
                ? 'bg-blue-900 text-white border-blue-900 shadow-lg' 
                : 'bg-white text-gray-400 border-gray-100'
            }`}
          >
            {f === 'ALL' ? 'Todas' : getTypeName(f as MessageType)}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {filteredMessages.map(msg => (
          <div 
            key={msg.id}
            onClick={() => setSelectedMsg(msg)}
            className={`bg-white rounded-[28px] p-6 border shadow-sm transition-all active:scale-[0.98] ${msg.read ? 'border-gray-50' : 'border-blue-100 ring-1 ring-blue-50'}`}
          >
            <div className="flex justify-between items-start mb-3">
              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg border ${getTypeStyle(msg.type)}`}>
                {getTypeName(msg.type)}
              </span>
              <span className="text-[8px] font-bold text-gray-300 uppercase">{msg.date}</span>
            </div>
            <h4 className={`text-sm font-black mb-1 ${msg.read ? 'text-gray-700' : 'text-blue-900'}`}>{msg.title}</h4>
            <p className="text-[11px] text-gray-400 font-medium line-clamp-2 leading-relaxed">
              {msg.content}
            </p>
          </div>
        ))}
      </div>

      {/* Message Modal Overlay */}
      {selectedMsg && (
        <div className="fixed inset-0 z-[100] bg-blue-900/40 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
           <div className="w-full bg-white rounded-t-[40px] p-8 pb-12 animate-in slide-in-from-bottom-10 duration-500">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-xl border ${getTypeStyle(selectedMsg.type)}`}>
                    {getTypeName(selectedMsg.type)}
                  </span>
                  <p className="text-[10px] text-gray-300 font-bold uppercase mt-3 tracking-widest">{selectedMsg.date} • {selectedMsg.author}</p>
                </div>
                <button onClick={() => setSelectedMsg(null)} className="p-2 bg-gray-50 rounded-xl">
                   <Icons.Plus className="w-5 h-5 text-gray-400 rotate-45" />
                </button>
              </div>
              <h3 className="text-2xl font-black text-blue-900 mb-4">{selectedMsg.title}</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed whitespace-pre-wrap">
                {selectedMsg.content}
              </p>
              <button 
                onClick={() => setSelectedMsg(null)}
                className="w-full mt-10 py-5 blue-gradient text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
              >
                Entendido
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
