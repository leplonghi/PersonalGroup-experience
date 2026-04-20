import React from 'react';
import { Icons, PRESET_AVATARS } from '../constants';
import { User } from '../types';
import Logo from './ui/Logo';

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
  onLogout?: () => void;
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
  onGoProfile,
  onLogout
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-[150] h-[calc(3.5rem+env(safe-area-inset-top))] backdrop-blur-xl border-b border-white/5 bg-white/70 dark:bg-pg-midnight/80 px-6 safe-pt shadow-2xl dark:shadow-blue-950/40 shadow-slate-200/50 bg-[var(--pg-glass-bg-main)]">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/5 to-transparent"></div>
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"></div>

      <div className="h-full max-w-[480px] md:max-w-2xl lg:max-w-4xl mx-auto px-6 flex items-center justify-between relative z-10">
        {/* Left Section */}
        <div className="flex items-center space-x-3 flex-1">
          {leftAction}
          {showLogo && (
            <div className="origin-left">
               <Logo variant="header" />
            </div>
          )}
        </div>

        {/* Center Section Removed */}
        <div className="flex-1"></div>

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
                  <img src={user.avatar || PRESET_AVATARS[0]} className="w-full h-full object-cover" alt="Profile" />
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
