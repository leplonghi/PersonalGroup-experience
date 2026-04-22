import React from 'react';
import { Icons } from '../constants';
import { User } from '../types';

interface HeaderProps {
  user?: User;
  title?: React.ReactNode;
  subtitle?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  showLogo?: boolean;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onGoProfile?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  title,
  subtitle,
  leftAction,
  rightAction,
  showLogo = true,
  isDarkMode = false,
  onToggleTheme,
  onGoProfile
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-[160] transition-all duration-500 h-20 glass-surface border-b border-pg-border-main/20">
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-pg-cobalt/20 to-transparent"></div>
      
      <div className="max-w-[480px] md:max-w-2xl lg:max-w-4xl mx-auto h-full px-6 flex items-center justify-between relative z-10">
        
        {/* Left Section - Logo Focus */}
        <div className="flex items-center space-x-4 flex-1">
          {leftAction}
          {!leftAction && showLogo && (
            <button 
              onClick={() => window.location.href = '/'}
              className="group relative flex items-center hover:scale-105 active:scale-95 transition-all outline-none"
            >
              <div className="absolute -inset-4 bg-pg-cobalt/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img 
                src="/logo-wellness.png" 
                className="h-10 sm:h-12 w-auto object-contain filter brightness-110 drop-shadow-[0_0_20px_rgba(37,99,235,0.2)] dark:drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]" 
                alt="PersonalGroup" 
              />
            </button>
          )}
        </div>

        {/* Center Title Section */}
        <div className="flex flex-col items-center text-center px-4">
          {title && (
            <div className="flex flex-col items-center">
              <h1 className="text-base sm:text-lg font-bold text-gradient leading-none tracking-tighter font-display uppercase whitespace-nowrap">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[9px] font-bold text-pg-text-muted uppercase tracking-[0.3em] mt-1.5 whitespace-nowrap">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-end space-x-4 flex-1">
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="w-10 h-10 flex items-center justify-center text-pg-text-muted hover:text-pg-cobalt transition-colors"
            >
              {isDarkMode ? <Icons.Sun className="w-5 h-5" /> : <Icons.Moon className="w-5 h-5" />}
            </button>
          )}

          {user && (
            <button 
              onClick={onGoProfile}
              className="relative group outline-none"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full p-0.5 bg-gradient-to-tr from-pg-cobalt/80 to-sky-400/80 transition-all group-hover:scale-110 group-active:scale-95">
                <div className="w-full h-full rounded-full overflow-hidden bg-pg-midnight-light ring-2 ring-pg-midnight/50">
                  <img 
                    src={user.avatar} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt="Perfil" 
                  />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-pg-midnight rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            </button>
          )}
          {rightAction}
        </div>

      </div>
    </header>
  );
};

export default Header;
