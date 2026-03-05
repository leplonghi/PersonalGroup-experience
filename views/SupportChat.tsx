import React, { useState } from 'react';
import { User } from '../types';
import { Icons } from '../constants';

interface SupportChatProps {
    user: User;
    onBack: () => void;
}

const faqData = [
    {
        category: '🏋️ Treinos',
        items: [
            { q: 'Como alterar meu programa de treino?', a: 'Acesse Administrativo → Nova Solicitação → Mudança de Treino. Seu personal avaliará o pedido.' },
            { q: 'Quantas vezes por semana devo treinar?', a: 'Sua frequência está definida no seu plano. Consulte a Home para ver seu tracker semanal.' },
            { q: 'Como funciona o PersonalDay?', a: 'A cada 45 dias após sua avaliação, você recebe um dia exclusivo com consultoria personalizada do seu personal.' },
        ]
    },
    {
        category: '📋 Avaliações',
        items: [
            { q: 'Quando é minha próxima reavaliação?', a: 'A reavaliação ocorre a cada 90 dias. Veja o banner na Home para saber quantos dias faltam.' },
            { q: 'Preciso agendar a avaliação?', a: 'Sim. Quando o lembrete aparecer na Home, toque em "Agendar Avaliação" para escolher data e horário.' },
        ]
    },
    {
        category: '💆 Wellness Center',
        items: [
            { q: 'Quantas sessões de wellness tenho direito?', a: 'Cada aluno tem direito a 2 sessões por mês. A cota é resetada automaticamente no dia 1º.' },
            { q: 'Como cancelar uma reserva wellness?', a: 'Acesse Wellness Center e toque na reserva ativa. Cancelamentos devem ser feitos com 24h de antecedência.' },
        ]
    },
    {
        category: '🔑 Conta & Acesso',
        items: [
            { q: 'Como fazer check-in na academia?', a: 'Na Home, toque em "Check-in" e escaneie o QR code da recepção. O check-in só funciona durante o horário de funcionamento.' },
            { q: 'Como trancar minha matrícula?', a: 'Acesse Administrativo → Trancamento. Anexe o documento comprobatório e descreva o motivo.' },
            { q: 'Como enviar atestado médico?', a: 'Acesse Administrativo → Atestado Médico. Faça upload da imagem ou PDF do atestado.' },
        ]
    }
];

const SupportChat: React.FC<SupportChatProps> = ({ user, onBack }) => {
    const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
    const [view, setView] = useState<'faq' | 'contact'>('faq');
    const [searchTerm, setSearchTerm] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);

    const filteredFaq = searchTerm.trim()
        ? faqData.map(cat => ({
            ...cat,
            items: cat.items.filter(
                item => item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.a.toLowerCase().includes(searchTerm.toLowerCase())
            )
        })).filter(cat => cat.items.length > 0)
        : faqData;

    const handleSend = () => {
        if (!subject.trim() || !message.trim()) return;
        // In production, this would call a firebase function
        setSent(true);
        setTimeout(() => {
            setSubject('');
            setMessage('');
            setSent(false);
            setView('faq');
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-app p-6 pb-32 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                    <Icons.ChevronLeft className="w-5 h-5 text-slate-400" />
                </button>
                <div className="text-center">
                    <h1 className="text-lg font-black text-white uppercase tracking-widest">Suporte</h1>
                    <p className="text-[9px] text-blue-400 font-bold uppercase tracking-[0.4em] mt-0.5">Central de Ajuda</p>
                </div>
                <div className="w-10" />
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
                <button
                    onClick={() => setView('faq')}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${view === 'faq' ? 'bg-white/10 text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Perguntas Frequentes
                </button>
                <button
                    onClick={() => setView('contact')}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${view === 'contact' ? 'bg-white/10 text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Falar com Suporte
                </button>
            </div>

            {view === 'faq' ? (
                <div className="space-y-4 animate-in fade-in duration-500">
                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Buscar nas perguntas..."
                            className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-blue-500/50 outline-none"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <span className="text-sm text-slate-500">🔍</span>
                        </div>
                    </div>

                    {/* FAQ Categories */}
                    {filteredFaq.length === 0 ? (
                        <div className="text-center py-12 space-y-3">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Nenhum resultado encontrado</p>
                            <button onClick={() => setView('contact')} className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em]">
                                Falar com suporte →
                            </button>
                        </div>
                    ) : (
                        filteredFaq.map(cat => (
                            <div key={cat.category} className="space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">{cat.category}</p>
                                {cat.items.map(item => {
                                    const key = item.q;
                                    const isOpen = expandedFaq === key;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => setExpandedFaq(isOpen ? null : key)}
                                            className="w-full text-left bg-white/5 border border-white/10 rounded-xl p-4 transition-all hover:bg-white/10"
                                        >
                                            <div className="flex items-start justify-between">
                                                <p className="text-[10px] font-bold text-white leading-relaxed pr-4">{item.q}</p>
                                                <Icons.ChevronRight className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                                            </div>
                                            {isOpen && (
                                                <p className="text-[9px] text-slate-400 mt-3 leading-relaxed border-t border-white/5 pt-3">
                                                    {item.a}
                                                </p>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>
            ) : sent ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4 animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 rounded-full bg-green-600/20 flex items-center justify-center">
                        <Icons.Check className="w-10 h-10 text-green-400" />
                    </div>
                    <h2 className="text-lg font-black text-white uppercase tracking-widest">Enviado!</h2>
                    <p className="text-[10px] text-slate-400 text-center max-w-xs">
                        Sua mensagem foi recebida. Nossa equipe responderá em até 24 horas.
                    </p>
                </div>
            ) : (
                /* Contact Form */
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em]">💡 Dica</p>
                        <p className="text-[9px] text-slate-400 leading-relaxed">
                            Antes de enviar, verifique as Perguntas Frequentes — sua dúvida pode já ter resposta!
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Assunto</p>
                        <input
                            type="text"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-white/20 focus:border-blue-500/50 outline-none"
                            placeholder="Resumo da sua dúvida..."
                        />
                    </div>

                    <div className="space-y-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Mensagem</p>
                        <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            rows={5}
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-white/20 focus:border-blue-500/50 outline-none resize-none"
                            placeholder="Descreva sua dúvida em detalhes..."
                        />
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!subject.trim() || !message.trim()}
                        className="w-full py-4 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-bold text-[11px] uppercase tracking-[0.25em] rounded-xl shadow-lg shadow-blue-900/40 border border-blue-400/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Enviar Mensagem
                    </button>
                </div>
            )}
        </div>
    );
};

export default SupportChat;
