import React from 'react';
import { Icons } from '../constants';
import Card from '../components/Card';

const Explore: React.FC = () => {
    const categories = [
        { title: 'Técnicas', icon: Icons.Activity, count: 12, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { title: 'Nutrição', icon: Icons.Apple, count: 8, color: 'text-green-500', bg: 'bg-green-500/10' },
        { title: 'Mindset', icon: Icons.Zap, count: 5, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { title: 'Recovery', icon: Icons.Shield, count: 7, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    ];

    const featured = [
        {
            title: 'Biocânica do Agachamento',
            duration: '12 min',
            level: 'Essencial',
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
            category: 'Técnicas'
        },
        {
            title: 'Hacks de Sono para Atletas',
            duration: '08 min',
            level: 'Avançado',
            image: 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&q=80&w=600',
            category: 'Recovery'
        }
    ];

    return (
        <div className="min-h-screen bg-app p-6 pb-32 space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-3xl font-black text-white uppercase tracking-tight">Explore<span className="text-cobalt">.</span></h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em]">Education Hub</p>
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Icons.Search className="w-4 h-4 text-slate-500 group-focus-within:text-cobalt transition-colors" />
                </div>
                <input 
                    type="text" 
                    placeholder="PESQUISAR CONTEÚDO..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-white placeholder:text-slate-600 focus:outline-none focus:border-cobalt/50 focus:ring-4 focus:ring-cobalt/10 transition-all"
                />
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 gap-4">
                {categories.map((cat, i) => (
                    <Card key={i} variant="flat" className="p-5 border-white/5 bg-white/5 hover:bg-white/10 transition-all group overflow-hidden relative">
                        <div className={`absolute -right-4 -bottom-4 w-12 h-12 ${cat.bg} blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                        <div className={`w-10 h-10 rounded-xl ${cat.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                            <cat.icon className={`w-5 h-5 ${cat.color}`} />
                        </div>
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">{cat.title}</h3>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">{cat.count} Aulas</p>
                    </Card>
                ))}
            </div>

            {/* Featured */}
            <section className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Em Destaque</h4>
                </div>
                <div className="space-y-4">
                    {featured.map((item, i) => (
                        <Card key={i} variant="flat" className="p-0 overflow-hidden group cursor-pointer border-none bg-white/5">
                            <div className="relative h-48 overflow-hidden">
                                <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" alt={item.title} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                    <div className="space-y-1">
                                        <div className="px-2 py-0.5 bg-cobalt rounded text-[8px] font-black text-white uppercase tracking-widest inline-block">{item.category}</div>
                                        <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight">{item.title}</h3>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform text-black">
                                        <Icons.Play className="w-4 h-4 fill-current ml-0.5" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-1">
                                        <Icons.Clock className="w-3 h-3 text-slate-500" />
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.duration}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Icons.TrendingUp className="w-3 h-3 text-slate-500" />
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.level}</span>
                                    </div>
                                </div>
                                <Icons.ChevronRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Explore;
