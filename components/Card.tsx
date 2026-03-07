
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'flat' | 'elevated' | 'glass' | 'blue' | 'outline' | 'gradient';
}

const Card: React.FC<CardProps> = ({ children, variant = 'flat', className = '', onClick }) => {
  const variants = {
    flat:     'bg-surface text-app border border-app shadow-card hover:shadow-elevated hover:border-cobalt/40 ring-1 ring-black/5 dark:ring-white/5',
    elevated: 'bg-surface text-app border border-app shadow-elevated hover:translate-y-[-2px] hover:shadow-modal',
    glass:    'bg-[var(--pg-glass-bg-main)] text-app border border-app backdrop-blur-xl shadow-card hover:brightness-105',
    blue:     'bg-cobalt text-white border border-white/10 shadow-cobalt relative overflow-hidden',
    outline:  'bg-transparent text-app border border-app hover:border-cobalt hover:bg-cobalt/10 transition-all',
    gradient: 'bg-gradient-to-b from-cobalt to-sky text-white border border-white/20 shadow-cobalt',
  };

  const interactiveProps = onClick
    ? {
        role: 'button' as const,
        tabIndex: 0,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        },
      }
    : {};

  return (
    <div
      onClick={onClick}
      {...interactiveProps}
      className={`rounded-xl overflow-hidden transition-all duration-300 ${variants[variant]} ${onClick ? 'cursor-pointer active:scale-[0.99] active:brightness-105' : ''} ${className}`}
    >
      {variant === 'blue' && (
        <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none"></div>
      )}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default Card;
