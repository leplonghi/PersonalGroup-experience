
import React, { useState } from 'react';
import { User, Recado, AnotacaoAluno } from '../types';
import Card from '../components/Card';
import { Icons } from '../constants';
import RecadosAluno from '../components/RecadosAluno';
import ChatDireto from '../components/ChatDireto';
import AnotacoesAluno from '../components/AnotacoesAluno';

interface MessagesProps {
  user: User;
}

type MessageTab = 'RECADOS' | 'CONVERSA' | 'ANOTACOES';

const Messages: React.FC<MessagesProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<MessageTab>('RECADOS');

  // MOCK DATA
  const [recados, setRecados] = useState<Recado[]>([
    {
      id: 'r1',
      paraId: user.id,
      deId: 'system',
      remetenteRole: 'ACADEMIA',
      titulo: 'Novos Equipamentos',
      mensagem: 'Chegaram os novos bancos reguláveis na Pista 01. Venha conferir a ergonomia superior do sistema Flex.',
      lido: false,
      criadoEm: new Date(),
      fixado: true
    },
    {
      id: 'r2',
      paraId: user.id,
      deId: 'personal-1',
      remetenteRole: 'PERSONAL',
      titulo: 'Ajuste de Carga',
      mensagem: 'Vi seu último registro. Vamos subir 5kg no leg press na próxima sessão. Seu volume adaptativo está pronto.',
      lido: true,
      criadoEm: new Date(Date.now() - 86400000),
      fixado: false
    }
  ]);

  const [anotacoes, setAnotacoes] = useState<AnotacaoAluno[]>([
    {
      id: 'a1',
      alunoId: user.id,
      conteudo: 'Senti um leve desconforto no joelho esquerdo durante o agachamento hoje. Tentar focar mais na descida.',
      criadaEm: new Date(Date.now() - 172800000),
      atualizadaEm: new Date(Date.now() - 172800000)
    }
  ]);

  const handleReadRecado = (id: string) => {
    setRecados(prev => prev.map(r => r.id === id ? { ...r, lido: true, lidoEm: new Date() } : r));
  };

  const handleSaveAnotacao = (conteudo: string) => {
    const nova: AnotacaoAluno = {
      id: Date.now().toString(),
      alunoId: user.id,
      conteudo,
      criadaEm: new Date(),
      atualizadaEm: new Date()
    };
    setAnotacoes([nova, ...anotacoes]);
  };

  const handleDeleteAnotacao = (id: string) => {
    setAnotacoes(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 pb-32 pt-0 relative px-6">
      
      {/* Tab Navigation Premium */}
      <div className="flex p-1.5 bg-slate-100 dark:bg-white/5 rounded-[24px] border border-slate-200 dark:border-white/10 sticky top-4 z-50 backdrop-blur-xl">
        {(['RECADOS', 'CONVERSA', 'ANOTACOES'] as MessageTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3.5 rounded-[18px] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 relative overflow-hidden ${
              activeTab === tab 
                ? 'text-white shadow-2xl' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            {activeTab === tab && (
              <div className="absolute inset-0 mesh-gradient animate-pulse opacity-100 transition-opacity duration-500"></div>
            )}
            <span className="relative z-10">
              {tab === 'RECADOS' ? 'Recados' : tab === 'CONVERSA' ? 'Conversa' : 'Anotações'}
              {tab === 'RECADOS' && recados.some(r => !r.lido) && (
                <span className="absolute -top-1 -right-4 w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Header Contextual */}
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tighter italic">
          {activeTab === 'RECADOS' && 'Central de Avisos'}
          {activeTab === 'CONVERSA' && 'Chat Exclusivo'}
          {activeTab === 'ANOTACOES' && 'Diário de Performance'}
        </h2>
        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">
          {activeTab === 'RECADOS' && 'Fique por dentro de tudo'}
          {activeTab === 'CONVERSA' && 'Fale direto com seu personal'}
          {activeTab === 'ANOTACOES' && 'Registre sua evolução pessoal'}
        </p>
      </div>

      {/* Render Content based on Tab */}
      <div className="min-h-[50vh]">
        {activeTab === 'RECADOS' && (
          <RecadosAluno 
            user={user} 
            recados={recados} 
            onRead={handleReadRecado} 
          />
        )}
        {activeTab === 'CONVERSA' && (
          <ChatDireto 
            user={user} 
          />
        )}
        {activeTab === 'ANOTACOES' && (
          <AnotacoesAluno 
            user={user} 
            anotacoes={anotacoes} 
            onSave={handleSaveAnotacao}
            onDelete={handleDeleteAnotacao}
          />
        )}
      </div>

      {/* Quote Card (only on Recados to keep focus) */}
      {activeTab === 'RECADOS' && (
        <Card variant="blue" className="p-8 mt-12 relative overflow-hidden group rounded-[40px] shadow-2xl shadow-blue-900/40">
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
      )}
    </div>
  );
};

export default Messages;
