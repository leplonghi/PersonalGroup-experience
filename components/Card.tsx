
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'flat' | 'elevated' | 'glass' | 'blue' | 'outline';
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, variant = 'elevated' }) => {
  const baseStyles = "rounded-[32px] transition-all duration-400 overflow-hidden";
  
  const variants = {
    flat: "bg-white dark:bg-[#0F172A] border border-slate-100 dark:border-white/5",
    elevated: "bg-white dark:bg-[#0F172A] shadow-[0_8px_30px_rgba(0,0,0,0.02)] dark:shadow-none border border-slate-50 dark:border-white/5",
    glass: "glass-card shadow-lg",
    blue: "blue-gradient text-white border-none shadow-xl shadow-blue-900/20",
    outline: "bg-transparent border-2 border-slate-100 dark:border-white/10"
  };

  const interactiveStyles = onClick ? "active:scale-[0.96] cursor-pointer hover:shadow-md" : "";

  return (
    <div 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${interactiveStyles} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
