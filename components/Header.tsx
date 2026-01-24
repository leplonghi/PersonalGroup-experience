
import React from 'react';
import { Icons } from '../constants';

interface HeaderProps {
  title?: React.ReactNode;
  subtitle?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  showLogo?: boolean;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftAction,
  rightAction,
  showLogo = true,
  isDarkMode = false,
  onToggleTheme
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-[150] h-20 backdrop-blur-xl border-b border-white/10 transition-all duration-500 overflow-hidden shadow-2xl shadow-blue-900/30" style={{ backgroundColor: '#080838' }}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"></div>

      <div className="h-full max-w-[480px] md:max-w-2xl lg:max-w-4xl mx-auto px-8 flex items-center justify-between relative z-10">
        {/* Left Section */}
        <div className="flex items-center space-x-4 flex-1">
          {leftAction}
          {!leftAction && showLogo && (
            <div className="flex items-center group cursor-pointer">
              <Icons.Logo className="h-14 w-auto object-contain transition-all filter drop-shadow-[0_0_8px_rgba(37,99,235,0.3)] group-hover:scale-105" />
            </div>
          )}
        </div>

        {/* Center/Title Section */}
        <div className="flex flex-col items-center text-center px-4">
          {title ? (
            <div className="flex flex-col items-center">
              <h1 className="text-lg font-bold text-white leading-none tracking-tight whitespace-nowrap font-display">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[9px] font-bold text-pg-cobalt uppercase tracking-[0.2em] mt-1.5 whitespace-nowrap">
                  {subtitle}
                </p>
              )}
            </div>
          ) : (
            <h2 className="text-xl font-bold tracking-tight text-white leading-none font-display">Exclusive<span className="text-pg-cobalt">.</span></h2>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-end gap-2 flex-1">
          {rightAction}
          {/* Theme Toggle - Always Visible */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="relative z-50 w-12 h-12 border border-white/20 bg-white/10 flex items-center justify-center text-white active:scale-95 transition-all hover:bg-white/20 rounded-lg"
              aria-label="Alternar tema"
            >
              {isDarkMode ? <Icons.Sun className="w-5 h-5 text-amber-400" /> : <Icons.Moon className="w-5 h-5 text-slate-200" />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
