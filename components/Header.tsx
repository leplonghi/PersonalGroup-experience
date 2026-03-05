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
    <header className="fixed top-0 left-0 right-0 z-[150] h-20 backdrop-blur-xl border-b border-app/5 transition-all duration-500 shadow-2xl dark:shadow-blue-950/40 shadow-slate-200/50" style={{ background: isDarkMode ? 'linear-gradient(180deg, #25235b 0%, #1a1945 100%)' : 'rgba(255, 255, 255, 0.95)' }}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/5 to-transparent"></div>
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"></div>

      <div className="h-full max-w-[480px] md:max-w-2xl lg:max-w-4xl mx-auto px-8 flex items-center justify-between relative z-10">
        {/* Left Section */}
        <div className="flex items-center space-x-4 flex-1">
          {leftAction}
          {!leftAction && showLogo && (
            <div className="flex items-center group cursor-pointer">
              <img src="/personalgroup-logo.png" alt="Personal Group Logo" className="h-10 w-auto object-contain transition-all filter drop-shadow-[0_0_8px_rgba(37,99,235,0.3)] group-hover:scale-105" />
            </div>
          )}
        </div>

        {/* Center/Title Section */}
        <div className="flex flex-col items-center text-center px-4">
          {title ? (
            <div className="flex flex-col items-center">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-none tracking-tight whitespace-nowrap font-display">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[10px] font-black text-blue-800 dark:text-blue-400 uppercase tracking-[0.2em] mt-1.5 whitespace-nowrap">
                  {subtitle}
                </p>
              )}
            </div>
          ) : (
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none font-display">Exclusive<span className="text-cobalt">.</span></h2>
          )}
        </div>

        <div className="flex justify-end items-center gap-3">
          {/* Theme Toggle - Always Visible */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="relative z-50 w-10 h-10 border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-700 dark:text-white active:scale-95 transition-all hover:bg-slate-200 dark:hover:bg-white/20 rounded-full"
              aria-label="Alternar tema"
            >
              {isDarkMode ? <Icons.Sun className="w-5 h-5 text-amber-400" /> : <Icons.Moon className="w-5 h-5 text-slate-600" />}
            </button>
          )}

          {/* Profile Clickable Avatar */}
          {user && (
            <button
              onClick={onGoProfile}
              className="relative z-50 group active:scale-95 transition-all"
              aria-label="Ir para perfil"
            >
              <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-cobalt to-sky transition-transform group-hover:rotate-12">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-blue-950">
                  <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-blue-950 shadow-lg"></div>
            </button>
          )}

          {rightAction}
        </div>
      </div>
    </header>
  );
};

export default Header;
