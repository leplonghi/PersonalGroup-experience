import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById } from '../firebase';
import { obterUltimaSessao, subscribeTeamNotes, iniciarSessao, adicionarTeamNote } from '../src/services/sessionService';
import { User } from '../types';
import { Icons } from '../constants';

const StudentBriefing: React.FC<{ trainer: User }> = ({ trainer }) => {
    const { uid } = useParams<{ uid: string }>();
    const navigate = useNavigate();

    const [student, setStudent] = useState<User | null>(null);
    const [lastSession, setLastSession] = useState<any | null>(null);
    const [teamNotes, setTeamNotes] = useState<any[]>([]);

    const [addingNote, setAddingNote] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [loading, setLoading] = useState(true);

    // Fallback exercises
    const DEFAULT_EXERCISES = [
        { id: '1', name: 'Agachamento Livre', sets: 3, reps: '12', weight: 40, image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1469&auto=format&fit=crop' },
        { id: '2', name: 'Supino Reto', sets: 3, reps: '12', weight: 30, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop' },
        { id: '3', name: 'Remada Curvada', sets: 3, reps: '12', weight: 35, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1520&auto=format&fit=crop' }
    ];

    useEffect(() => {
        if (!uid) return;

        const loadData = async () => {
            try {
                const u = await getUserById(uid);
                if (u) setStudent(u);

                const sess = await obterUltimaSessao(uid);
                if (sess) setLastSession(sess);

            } catch (err) {
                console.error("Error loading briefing data", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();

        const unsub = subscribeTeamNotes(uid, (notes) => {
            setTeamNotes(notes);
        });

        return () => unsub();
    }, [uid]);

    const handleSaveNote = async () => {
        if (!uid || !newNote.trim()) return;
        await adicionarTeamNote(uid, trainer.name || 'Trainer', newNote.trim());
        setNewNote('');
        setAddingNote(false);
    };

    const handleStartSession = async () => {
        if (!uid) return;
        const exercicios = lastSession?.exercicios || DEFAULT_EXERCISES;
        const sessId = await iniciarSessao(uid, trainer.id, trainer.name, exercicios);
        navigate(`/session/${uid}`);
        // If the app expects /live-session/:sessionId, we can use navigate(`/live-session/${sessId}`)
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-deep-blue flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-cobalt border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="min-h-screen bg-deep-blue text-white flex flex-col items-center justify-center">
                <Icons.AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold">Aluno não encontrado</h2>
                <button onClick={() => navigate(-1)} className="mt-6 text-cobalt uppercase font-bold text-sm tracking-widest">Voltar</button>
            </div>
        );
    }

    const checkInNote = student.painLimitations || 'Relatou leve dor lombar ontem.'; // Mock or real data if existing

    return (
        <div className="min-h-screen bg-deep-blue text-white flex flex-col font-sans pb-32">
            {/* Header Profile Area */}
            <div className="pt-12 px-6 pb-8 bg-white/5 border-b border-white/10 relative">
                <button onClick={() => navigate(-1)} className="absolute top-12 left-6 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all text-white">
                    <Icons.ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex flex-col items-center mt-6">
                    <div className="w-24 h-24 rounded-[32px] bg-white/10 border-2 border-white/20 p-1 mb-4 relative shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                        <img
                            src={student.avatar || student.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`}
                            className="w-full h-full rounded-[26px] object-cover"
                            alt="Avatar"
                        />
                        {student.healthStatus === 'WARNING' && (
                            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-500 border-4 border-deep-blue flex items-center justify-center shadow-lg">
                                <Icons.AlertTriangle className="w-3 h-3 text-white" />
                            </div>
                        )}
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-white mb-1">{student.name}</h1>
                    <p className="text-[10px] font-bold text-cobalt uppercase tracking-[0.2em]">{student.objectives?.join(' • ') || 'GANHO DE MASSA'}</p>
                </div>
            </div>

            <main className="flex-1 px-6 pt-6 space-y-6 max-w-lg mx-auto w-full">
                {/* Alerts & Energy */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-cobalt/10 border border-cobalt/30 flex flex-col items-center text-center">
                        <Icons.Zap className="w-6 h-6 text-cobalt mb-2" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-cobalt/70 mb-1">Energia Hoje</span>
                        <span className="text-sm font-bold text-white">Normal</span>
                    </div>
                    {student.healthStatus !== 'CRITICAL' && (
                        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex flex-col items-center text-center">
                            <Icons.AlertOctagon className="w-6 h-6 text-red-500 mb-2" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-red-500/70 mb-1">Limitação</span>
                            <span className="text-xs font-bold text-white leading-tight">Lombar pegando</span>
                        </div>
                    )}
                </div>

                {/* Last Session Review */}
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 ml-1">Última Sessão</h3>
                    {lastSession ? (
                        <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-4">
                            <div className="flex justify-between items-start border-b border-white/10 pb-4">
                                <div>
                                    <div className="text-sm font-bold text-white">Com {lastSession.personalNome}</div>
                                    <div className="text-[10px] uppercase text-white/50 tracking-wider mt-1">{new Date(lastSession.endTime?.toDate?.() || Date.now()).toLocaleDateString()}</div>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/50 flex flex-col items-center justify-center text-orange-400">
                                    <span className="text-[8px] font-black uppercase leading-none">RPE</span>
                                    <span className="text-base font-black leading-none">{lastSession.rpeGeral || 7}</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <span className="text-[9px] font-black text-cobalt uppercase tracking-widest">Feedback do Trainer</span>
                                <p className="text-sm text-white/80 leading-relaxed italic border-l-2 border-cobalt/50 pl-3 py-1">
                                    "{lastSession.notaTrainer || 'Ótima execução. Progrediu carga no supino e fez boa falha na última série.'}"
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 text-center border border-white/5 bg-white/5 rounded-2xl">
                            <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Nenhuma sessão anterior encontrada.</p>
                        </div>
                    )}
                </div>

                {/* Team Notes */}
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 ml-1">Team Notes</h3>
                    <div className="space-y-3">
                        {teamNotes.map(n => (
                            <div key={n.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{n.trainerNome}</span>
                                    <span className="text-[9px] font-medium text-white/30">{new Date(n.timestamp?.toDate?.() || Date.now()).toLocaleDateString()}</span>
                                </div>
                                <p className="text-xs text-white/70 leading-relaxed">{n.texto}</p>
                            </div>
                        ))}
                        {teamNotes.length === 0 && (
                            <p className="text-xs text-white/40 font-bold uppercase tracking-widest text-center py-4 border border-dashed border-white/10 rounded-xl">Sem notas colaborativas.</p>
                        )}

                        {/* Inline Add Note */}
                        {addingNote ? (
                            <div className="p-4 rounded-xl border border-cobalt/50 bg-cobalt/10 mt-4 animate-in fade-in zoom-in duration-300">
                                <textarea
                                    className="w-full min-h-[80px] bg-transparent border-0 text-white text-sm placeholder-white/40 focus:outline-none resize-none"
                                    placeholder="Escreva um aviso sobre foco, lesões ou dieta..."
                                    value={newNote}
                                    autoFocus
                                    onChange={(e) => setNewNote(e.target.value)}
                                />
                                <div className="flex justify-end space-x-2 mt-2 pt-2 border-t border-white/10">
                                    <button onClick={() => setAddingNote(false)} className="px-4 py-2 text-[10px] font-bold text-white/50 uppercase tracking-widest hover:text-white">Cancelar</button>
                                    <button onClick={handleSaveNote} className="px-4 py-2 bg-cobalt text-white rounded-lg text-[10px] font-black uppercase tracking-widest">Salvar</button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </main>

            {/* Fixed Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-6 glass-panel border-t border-white/10 z-[100] safe-pb bg-deep-blue/90 backdrop-blur-xl">
                <div className="max-w-lg mx-auto flex gap-3">
                    <button
                        onClick={() => setAddingNote(true)}
                        className="h-14 px-6 border border-white/20 bg-white/5 flex items-center justify-center rounded-2xl text-white/70 hover:text-white hover:bg-white/10 transition-all font-bold text-[10px] uppercase tracking-widest whitespace-nowrap active:scale-95"
                    >
                        <Icons.Plus className="w-4 h-4 mr-2" />
                        Nota
                    </button>

                    <button
                        onClick={handleStartSession}
                        className="flex-1 h-14 bg-cobalt rounded-2xl flex items-center justify-center text-white font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-cobalt/30 transition-all active:scale-[0.98]"
                    >
                        <Icons.Play className="w-5 h-5 mr-2" />
                        Iniciar Sessão
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentBriefing;
