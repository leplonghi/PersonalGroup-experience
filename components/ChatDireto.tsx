
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { Icons } from '../constants';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isAdmin: boolean;
}

interface ChatDiretoProps {
  user: User;
}

const ChatDireto: React.FC<ChatDiretoProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'personal-1',
      text: 'Olá! Vi que você completou o treino de pernas ontem com um RPE de 9. Como estão as dores musculares hoje?',
      timestamp: new Date(Date.now() - 3600000 * 2),
      isAdmin: true
    },
    {
      id: '2',
      senderId: user.id,
      text: 'Oi professor! Bastante cansado, mas a dor está suportável. Acho que a cadência 4-0-2 fez muita diferença.',
      timestamp: new Date(Date.now() - 3600000 * 1),
      isAdmin: false
    }
  ]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      text: inputText,
      timestamp: new Date(),
      isAdmin: false
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[60vh] glass-panel rounded-[40px] border-slate-200 dark:border-white/5 overflow-hidden animate-in fade-in zoom-in-95 duration-700">
      {/* Chat Header */}
      <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-black/20 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felipe&backgroundColor=002B54" 
              className="w-10 h-10 rounded-full border border-blue-500/30" 
              alt="Personal"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white dark:border-ocean"></div>
          </div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Coach Felipe</h4>
            <p className="text-[9px] font-bold text-green-500 uppercase tracking-tighter">Online agora</p>
          </div>
        </div>
        <Icons.Activity className="w-4 h-4 text-blue-500 opacity-50" />
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 duration-500`}
          >
            <div className={`max-w-[80%] p-4 rounded-3xl text-xs font-medium leading-relaxed shadow-sm ${
              msg.isAdmin 
                ? 'bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 rounded-bl-none' 
                : 'mesh-gradient text-white rounded-br-none shadow-lg shadow-blue-900/20'
            }`}>
              {msg.text}
              <div className={`text-[8px] mt-2 opacity-50 font-black uppercase tracking-tighter ${msg.isAdmin ? 'text-slate-500' : 'text-white'}`}>
                {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/50 dark:bg-black/20 border-t border-slate-100 dark:border-white/5 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-500/50 transition-all"
          />
          <button 
            onClick={handleSend}
            className="w-12 h-12 mesh-gradient rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20 active:scale-90 transition-all"
          >
            <Icons.ChevronRight className="w-5 h-5 rotate-[-45deg] translate-x-0.5 -translate-y-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDireto;
