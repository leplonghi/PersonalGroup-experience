
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'flat' | 'elevated' | 'glass' | 'blue' | 'outline' | 'gradient';
}

const Card: React.FC<CardProps> = ({ children, variant = 'flat', className = '', onClick }) => {
  const variants = {
    flat: 'bg-surface text-app border border-app shadow-sm hover:shadow-md hover:border-cobalt/50 ring-1 ring-black/5 dark:ring-white/5',
    elevated: 'bg-surface text-app border border-app shadow-xl shadow-blue-900/5 hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-blue-900/10',
    glass: 'bg-[var(--pg-glass-bg-main)] text-app border border-app backdrop-blur-xl shadow-lg hover:brightness-110',
    blue: 'bg-cobalt text-white border border-white/10 shadow-lg shadow-blue-900/20 relative overflow-hidden',
    outline: 'bg-transparent text-app border border-app hover:border-cobalt hover:bg-cobalt/10 transition-all cursor-pointer',
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
