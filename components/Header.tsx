
import React from 'react';
import { Icons } from '../constants';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-[150] max-w-md mx-auto h-16 px-6 flex items-center justify-between bg-white/95 dark:bg-[#020617]/95 backdrop-blur-md border-b border-slate-100 dark:border-white/5 transition-colors duration-300">
      <div className="flex items-center space-x-3">
        <img
          src="/logo.png"
          alt="PersonalGroup Logo"
          className="h-10 w-auto object-contain transition-transform active:scale-95"
        />
        <div className="flex flex-col">
          <span className="text-[8px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.3em] leading-none">
            Exclusive
          </span>
        </div>
      </div>

      <button
        onClick={toggleTheme}
        className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-900 dark:text-white active:scale-90 transition-all border border-slate-200 dark:border-white/10"
        aria-label="Alternar Tema"
      >
        {isDarkMode ? <Icons.Sun className="w-5 h-5" /> : <Icons.Moon className="w-5 h-5" />}
      </button>
    </header>
  );
};

export default Header;