
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'flat' | 'elevated' | 'glass' | 'blue' | 'outline' | 'gradient';
}

const Card: React.FC<CardProps> = ({ children, variant = 'flat', className = '', onClick }) => {
  const variants = {
    flat: 'bg-white dark:bg-ocean border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-500/30 ring-1 ring-black/5 dark:ring-white/5',
    elevated: 'bg-white dark:bg-ocean border border-slate-100 dark:border-white/10 shadow-xl shadow-blue-900/5 hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-blue-900/10',
    glass: 'bg-white/80 dark:bg-ocean/80 border border-white/40 dark:border-white/10 backdrop-blur-xl shadow-lg hover:bg-white/90 dark:hover:bg-ocean/90',
    blue: 'bg-deep-blue text-white border border-white/10 shadow-lg shadow-blue-900/20 relative overflow-hidden',
    outline: 'bg-transparent border border-slate-300 dark:border-white/20 hover:border-blue-600 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all cursor-pointer',
    gradient: 'bg-gradient-to-b from-blue-600 to-indigo-700 text-white border border-white/20 shadow-xl shadow-blue-900/30'
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-sm overflow-hidden transition-all duration-500 ${variants[variant]} ${onClick ? 'cursor-pointer active:scale-[0.99] active:brightness-110' : ''} ${className}`}
    >
      {variant === 'blue' && (
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none opacity-50"></div>
      )}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default Card;
