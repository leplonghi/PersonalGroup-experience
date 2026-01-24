
import React from 'react';
import Card from '../components/Card';
import { Icons } from '../constants';
import { User } from '../types';

interface ClubProps {
    user: User;
    onBack: () => void;
}

const Club: React.FC<ClubProps> = ({ user, onBack }) => {
    const amenities = [
        { name: 'Valet', icon: Icons.Car },
        { name: 'Toalhas', icon: Icons.Leaf },
        { name: 'Wi-Fi', icon: Icons.Wifi },
        { name: 'Café', icon: Icons.Coffee },
        { name: 'Vestiário', icon: Icons.Droplet },
        { name: 'Cowork', icon: Icons.FileText },
    ];

    const spaces = [
        { name: 'Arena Cardio', description: 'Technogym Live', icon: Icons.TrendingUp },
        { name: 'Iron Zone', description: 'Peso Livre', icon: Icons.Dumbbell },
        { name: 'Mind & Body', description: 'Yoga e Pilates', icon: Icons.Yoga },
        { name: 'Recovery', description: 'Massagem', icon: Icons.Leaf },
        { name: 'Piscina', description: 'Semi-olímpica', icon: Icons.Swimming },
    ];

    const partners = [
        { name: 'Mundo Verde', discount: '15% OFF', category: 'Suplementos', icon: Icons.Leaf },
        { name: 'Dr. Lucas S.', discount: 'Consulta VIP', category: 'Nutrólogo', icon: Icons.Shield },
        { name: 'Nike Store', discount: '10% OFF', category: 'Sportswear', icon: Icons.Chart },
    ];

    return (
        <div className="min-h-screen bg-app transition-colors duration-1000 p-6 pb-32">
            <div className="precision-bg fixed inset-0 z-0 opacity-20"></div>

            <div className="relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header removido para usar o global */}

                {/* Sobre a Academia (Intro) */}
                <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-2 relative z-10">O Espaço</h2>
                    <p className="text-sm text-slate-400 leading-relaxed relative z-10">
                        Mais que uma academia, um centro de performance e bem-estar.
                        Design biofílico, equipamentos de ponta e um ambiente pensado
                        para elevar sua experiência de treino.
                    </p>
                    <div className="mt-4 flex items-center space-x-3 text-xs font-bold text-slate-400">
                        <Icons.MapPin className="w-4 h-4 text-blue-500" />
                        <span>Av. das Américas, 3500 - Barra da Tijuca</span>
                    </div>
                </div>

                {/* Comodidades (Amenities) */}
                <div>
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4 pl-1">Comodidades</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {amenities.map((item, i) => (
                            <div key={i} className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 hover:border-blue-500/30 transition-all group">
                                <item.icon className="w-6 h-6 text-slate-400 group-hover:text-blue-500 mb-2 transition-colors" />
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-center">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Espaços Internos (Spaces) */}
                <div>
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4 pl-1">Espaços Internos</h3>
                    <div className="space-y-3">
                        {spaces.map((space, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/[0.07] transition-all">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-ocean/40 flex items-center justify-center text-blue-500">
                                        <space.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{space.name}</h4>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{space.description}</p>
                                    </div>
                                </div>
                                <Icons.ChevronRight className="w-4 h-4 text-slate-600" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Parceiros (Partners) */}
                <div>
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4 pl-1">Parceiros no Local</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {partners.map((p, i) => (
                            <Card key={i} variant="outline" className="p-4 border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-all group flex items-center justify-between cursor-pointer active:scale-[0.99]">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-center text-blue-500 group-hover:text-white group-hover:bg-blue-600 transition-all">
                                        <p.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{p.name}</h5>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{p.category}</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-blue-600/10 border border-blue-600/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                                    {p.discount}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Institutional Actions */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                    <button className="h-20 glass-panel border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex flex-col items-center justify-center space-y-2 group">
                        <Icons.Users className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-900 dark:group-hover:text-white">Falar com Recepção</span>
                    </button>
                    <button className="h-20 glass-panel border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex flex-col items-center justify-center space-y-2 group">
                        <Icons.FileText className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-900 dark:group-hover:text-white">Regulamento</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Club;
