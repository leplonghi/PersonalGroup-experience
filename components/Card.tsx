import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'flat' | 'elevated' | 'glass' | 'cobalt' | 'outline' | 'gradient';
}

const Card: React.FC<CardProps> = ({ children, variant = 'glass', className = '', onClick }) => {
  const variants = {
    flat: 'bg-pg-midnight-light border border-pg-border-main/10 shadow-sm hover:border-pg-cobalt/30 transition-all',
    elevated: 'bg-pg-midnight border border-pg-border-main/20 shadow-2xl shadow-black/50 hover:translate-y-[-4px] hover:shadow-pg-cobalt/10',
    glass: 'glass-card border border-pg-border-main/10 hover:border-pg-cobalt/30 transition-all',
    cobalt: 'bg-gradient-to-br from-pg-cobalt to-indigo-600 text-white border border-white/20 shadow-lg shadow-pg-cobalt/20',
    outline: 'bg-transparent border border-pg-border-main/30 hover:border-pg-cobalt hover:bg-pg-cobalt/5 transition-all',
    gradient: 'glass-card bg-gradient-to-br from-pg-midnight/80 via-pg-midnight-light/50 to-pg-cobalt/10 border border-pg-border-main/20'
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-xl overflow-hidden transition-all duration-500 ${variants[variant]} ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} ${className} relative group`}
    >
      {/* Subtle hover glow for all cards */}
      <div className="absolute inset-0 bg-pg-cobalt/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      {variant === 'cobalt' && (
        <div className="absolute inset-x-0 top-0 h-[100px] bg-gradient-to-b from-white/10 to-transparent pointer-events-none opacity-50" />
      )}
      
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default Card;
