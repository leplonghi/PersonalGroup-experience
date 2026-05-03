import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../constants';
import Card from '../components/Card';
import { User } from '../types';

interface ExploreProps {
    user?: User;
}

const Explore: React.FC<ExploreProps> = () => {
    const navigate = useNavigate();

    const quickAccessItems = [
        {
            label: 'Comunidade',
            subtitle: 'Feed e interações',
            icon: Icons.MessageCircle,
            action: () => navigate('/comunidade'),
        },
        {
            label: 'Ranking',
            subtitle: 'Mural da constância',
            icon: Icons.Star,
            action: () => navigate('/ranking'),
        },
        {
            label: 'Club',
            subtitle: 'Benefícios exclusivos',
            icon: Icons.Coffee,
            action: () => navigate('/club'),
        },
        {
            label: 'Educação',
            subtitle: 'Conteúdo e aprendizado',
            icon: Icons.Play,
            action: () => document.getElementById('educational-content')?.scrollIntoView({ behavior: 'smooth' }),
        },
    ];

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
        <div className="min-h-screen p-5 pb-32 space-y-6 animate-in fade-in duration-700"
             style={{ background: 'linear-gradient(180deg, #010b2e 0%, #00060f 40%, #010e35 100%)' }}>
            {/* Header */}
            <div className="pt-6">
                <h1 className="text-3xl font-black text-white uppercase tracking-tight">Explorar<span className="text-pg-cobalt">.</span></h1>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.4em] mt-1">Descubra, conecte-se, evolua</p>
            </div>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-2 gap-3">
                {quickAccessItems.map((item, i) => (
                    <button
                        key={i}
                        onClick={item.action}
                        className="p-4 rounded-2xl border border-white/[0.06] text-left transition-all active:scale-[0.98] hover:border-white/[0.12]"
                        style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}
                    >
                        <div className="w-10 h-10 rounded-xl bg-pg-cobalt/10 border border-pg-cobalt/20 flex items-center justify-center mb-3">
                            <item.icon className="w-5 h-5 text-pg-cobalt" />
                        </div>
                        <p className="text-sm font-bold text-white">{item.label}</p>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-0.5">{item.subtitle}</p>
                    </button>
                ))}
            </div>

            {/* Educational Content */}
            <div id="educational-content" className="space-y-6 pt-2">
                {/* Search Bar */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Icons.Search className="w-4 h-4 text-white/30 group-focus-within:text-pg-cobalt transition-colors" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="PESQUISAR CONTEÚDO..." 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-white placeholder:text-white/20 focus:outline-none focus:border-pg-cobalt/50 focus:ring-4 focus:ring-pg-cobalt/10 transition-all"
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
                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">{cat.count} Aulas</p>
                        </Card>
                    ))}
                </div>

                {/* Featured */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Em Destaque</h4>
                    </div>
                    <div className="space-y-4">
                        {featured.map((item, i) => (
                            <Card key={i} variant="flat" className="p-0 overflow-hidden group cursor-pointer border-none bg-white/5">
                                <div className="relative h-48 overflow-hidden">
                                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" alt={item.title} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                        <div className="space-y-1">
                                            <div className="px-2 py-0.5 bg-pg-cobalt rounded text-[8px] font-black text-white uppercase tracking-widest inline-block">{item.category}</div>
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
                                            <Icons.Clock className="w-3 h-3 text-white/30" />
                                            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{item.duration}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Icons.TrendingUp className="w-3 h-3 text-white/30" />
                                            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{item.level}</span>
                                        </div>
                                    </div>
                                    <Icons.ChevronRight className="w-4 h-4 text-white/20 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Explore;
