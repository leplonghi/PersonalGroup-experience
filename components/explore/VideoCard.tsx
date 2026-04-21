
import React from 'react';
import { Icons } from '../../constants';

interface VideoCardProps {
    title: string;
    description: string;
    duration: string;
    thumbnail: string;
    category: string;
    level: 'Básico' | 'Intermediário' | 'Pro';
    onClick?: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
    title,
    description,
    duration,
    thumbnail,
    category,
    level,
    onClick
}) => {
    const levelColors = {
        'Básico': 'text-green-400 bg-green-500/10 border-green-500/20',
        'Intermediário': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        'Pro': 'text-red-400 bg-red-500/10 border-red-500/20'
    };

    return (
        <div 
            onClick={onClick}
            className="group relative overflow-hidden bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl cursor-pointer active:scale-[0.98] transition-all"
        >
            {/* Thumbnail Area */}
            <div className="relative aspect-video overflow-hidden">
                <img 
                    src={thumbnail} 
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-md text-[9px] font-bold text-white uppercase tracking-widest">
                        {category}
                    </span>
                </div>

                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[9px] font-black text-white flex items-center gap-1.5">
                    <Icons.Clock className="w-3 h-3" />
                    {duration}
                </div>

                {/* Play Icon overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40">
                        <Icons.Play className="w-6 h-6 text-white ml-0.5" />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-4 space-y-2">
                <div className="flex justify-between items-start gap-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1 group-hover:text-blue-500 transition-colors">
                        {title}
                    </h3>
                </div>
                
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {description}
                </p>

                <div className="flex items-center gap-2 pt-1">
                    <span className={`px-2 py-0.5 border rounded-full text-[8px] font-black uppercase tracking-tighter ${levelColors[level]}`}>
                        {level}
                    </span>
                </div>
            </div>
        </div>
    );
};
