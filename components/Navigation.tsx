
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { Icons } from '../constants';

interface NavigationProps {
  role: UserRole;
}

const Navigation: React.FC<NavigationProps> = ({ role }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isManagementRole = role === UserRole.CHEFE || role === UserRole.ADMIN;

  const NavItem = ({ path, icon: Icon, label }: { path: string, icon: any, label: string }) => {
    // Check if current path starts with the nav item path (for simple active state)
    // Precise matching for root/home might be needed
    const isActive = currentPath === path || (path === '/home' && currentPath === '/');

    return (
      <button
        onClick={() => navigate(path)}
        className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative ${isActive
          ? 'text-white'
          : 'text-slate-600'
          }`}
      >
        <div className={`transition-all duration-500 transform ${isActive ? 'scale-110 translate-y-[-4px]' : 'opacity-40'}`}>
          <Icon className={`w-6 h-6 ${isActive ? 'text-pg-cobalt drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]' : 'text-slate-500'}`} />
        </div>
        <span className={`text-[9px] font-black uppercase tracking-[0.3em] mt-2 transition-all duration-300 ${isActive ? 'opacity-100 text-pg-cobalt' : 'opacity-40 font-bold'}`}>
          {label}
        </span>
        {isActive && (
          <div className="absolute top-0 inset-x-4 h-[2px] bg-pg-cobalt shadow-[0_0_15px_#2563EB]"></div>
        )}
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[150] backdrop-blur-xl pb-safe overflow-hidden border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,50,0.8)]" style={{ backgroundColor: '#080838' }}>
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"></div>
      <div className="h-20 max-w-[480px] md:max-w-2xl lg:max-w-4xl mx-auto px-4">
        <nav className="h-full flex items-center justify-around">
          {isManagementRole ? (
            <>
              <NavItem path="/management" icon={Icons.Logo} label="Painel" />
              <NavItem path="/messages" icon={Icons.Users} label="Equipe" />
              <NavItem path="/protocol-edit" icon={Icons.ClipboardCheck} label="Protos" />
              <NavItem path="/timeline" icon={Icons.Chart} label="Dados" />
              <NavItem path="/profile" icon={Icons.User} label="Perfil" />
            </>
          ) : (
            <>
              <NavItem path="/home" icon={Icons.Home} label="Início" />
              <NavItem path="/agenda" icon={Icons.Calendar} label="Agenda" />
              <NavItem path="/timeline" icon={Icons.Chart} label="Histórico" />
              <NavItem path="/wellness" icon={Icons.Shield} label="Wellness" />
              <NavItem path="/profile" icon={Icons.User} label="Perfil" />
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
