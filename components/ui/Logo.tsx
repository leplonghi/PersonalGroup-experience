import React from 'react';

interface LogoProps {
  variant?: 'header' | 'login' | 'large' | 'compact';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'header', className = '' }) => {
  const sizes = {
    header: 'h-10 md:h-12',
    login: 'h-20 md:h-24',
    large: 'h-24 md:h-32',
    compact: 'h-6',
  };

  const isWellness = variant === 'header' || variant === 'compact';
  const logoSrc = isWellness ? '/2.png' : '/personalgroup-logo.png';

  return (
    <div className={`flex items-center group cursor-pointer transition-all duration-500 ${className}`}>
      <img
        src={logoSrc}
        alt={isWellness ? "Wellness Experience Logo" : "Personal Group Logo"}
        className={`w-auto object-contain ${!isWellness ? 'filter drop-shadow-[0_0_12px_rgba(0,182,253,0.4)]' : ''} group-hover:scale-105 transition-transform duration-500 ${sizes[variant]}`}
      />
    </div>
  );
};

export default Logo;
