
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'flat' | 'elevated' | 'glass' | 'blue' | 'outline';
}

const Card: React.FC<CardProps> = ({ children, variant = 'flat', className = '', onClick }) => {
  const variants = {
    flat: 'bg-white/80 dark:bg-ocean/60 border border-blue-200/30 dark:border-blue-400/20 shadow-lg backdrop-blur-sm',
    elevated: 'bg-white/90 dark:bg-ocean/70 border border-blue-300/40 dark:border-blue-400/30 shadow-2xl card-shadow backdrop-blur-md',
    glass: 'glass-panel',
    blue: 'mesh-gradient text-white border border-blue-400/30 shadow-2xl shadow-blue-500/20',
    outline: 'bg-transparent border border-blue-300/30 dark:border-blue-400/30 hover:border-blue-500/50 transition-colors'
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-sm overflow-hidden transition-all duration-500 ${variants[variant]} ${onClick ? 'cursor-pointer active:scale-[0.99] active:brightness-110' : ''} ${className}`}
    >
      {variant === 'blue' && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none opacity-50"></div>
      )}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default Card;
