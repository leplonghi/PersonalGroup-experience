
import React from 'react';
import { View, UserRole } from '../types';
import { Icons } from '../constants';

interface NavigationProps {
  currentView: View;
  setView: (view: View) => void;
  role: UserRole;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, role }) => {
  const isManagementRole = role === UserRole.CHEFE || role === UserRole.ADMIN;

  const NavItem = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => {
    const isActive = currentView === view;
    return (
      <button 
        onClick={() => setView(view)}
        className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative ${
          isActive 
            ? 'text-blue-700 dark:text-white' 
            : 'text-slate-500 dark:text-slate-600'
        }`}
      >
        <Icon className={`w-6 h-6 mb-1.5 transition-all duration-300 ${isActive ? 'scale-110 opacity-100' : 'opacity-50'}`} />
        <span className={`text-[8px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
          {label}
        </span>
        {isActive && (
          <div className="absolute top-2 w-1 h-1 bg-blue-700 dark:bg-white rounded-full"></div>
        )}
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[150] safe-pb bg-white/95 dark:bg-[#020617]/95 backdrop-blur-2xl border-t border-slate-100 dark:border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors duration-300">
      <nav className="max-w-md mx-auto h-20 flex items-center justify-around px-2">
        {isManagementRole ? (
          <>
            <NavItem view="MANAGEMENT" icon={Icons.Logo} label="Dash" />
            <NavItem view="MESSAGES" icon={Icons.Users} label="Equipe" />
            <NavItem view="PROTOCOL_EDIT" icon={Icons.ClipboardCheck} label="Protocolos" />
            <NavItem view="TIMELINE" icon={Icons.Chart} label="Relatórios" />
            <NavItem view="PROFILE" icon={Icons.User} label="Perfil" />
          </>
        ) : (
          <>
            <NavItem view="HOME" icon={Icons.Home} label="Home" />
            <NavItem view="AGENDA" icon={Icons.Calendar} label="Agenda" />
            <NavItem view="TIMELINE" icon={Icons.Chart} label="Timeline" />
            <NavItem view="WELLNESS" icon={Icons.Shield} label="Wellness" />
            <NavItem view="PROFILE" icon={Icons.User} label="Perfil" />
          </>
        )}
      </nav>
    </div>
  );
};

export default Navigation;