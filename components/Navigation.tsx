
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { Icons } from '../constants';

interface NavigationProps {
  role: UserRole;
  isDarkMode: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ role, isDarkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isManagementRole = role === UserRole.CHEFE || role === UserRole.ADMIN || role === UserRole.PERSONAL;

  const NavItem = ({ path, icon: Icon, label }: { path: string, icon: any, label: string }) => {
    const isActive = currentPath === path || (path === '/home' && currentPath === '/');

    return (
      <button
        onClick={() => navigate(path)}
        className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative ${isActive
          ? (isDarkMode ? 'text-white' : 'text-slate-900')
          : (isDarkMode ? 'text-blue-300' : 'text-slate-400')
          }`}
      >
        <div className={`transition-all duration-500 transform ${isActive ? 'scale-110 translate-y-[-4px]' : 'opacity-80'}`}>
          <Icon className={`w-6 h-6 object-contain ${isActive ? 'text-cobalt drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]' : (isDarkMode ? 'text-blue-300' : 'text-slate-400')}`} />
        </div>
        <span className={`text-[11px] font-black uppercase tracking-wider mt-1 transition-all duration-300 ${isActive ? 'opacity-100 text-cobalt' : 'opacity-80'}`}>
          {label}
        </span>
        {isActive && (
          <div className="absolute top-0 inset-x-4 h-[2px] bg-cobalt shadow-[0_0_15px_#2563EB]"></div>
        )}
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[150] backdrop-blur-xl pb-safe border-t transition-all duration-500 shadow-2xl dark:shadow-blue-950/40 shadow-slate-200/50" style={{ background: isDarkMode ? 'linear-gradient(0deg, #25235b 0%, #1a1945 100%)' : 'rgba(255, 255, 255, 0.95)', borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"></div>
      <div className="h-24 max-w-[480px] md:max-w-2xl lg:max-w-4xl mx-auto px-4">
        <nav className="h-full flex items-center justify-around">
          {isManagementRole ? (
            <>
              <NavItem path="/management" icon={Icons.Home} label="Painel" />
              <NavItem path="/messages" icon={Icons.Users} label="Equipe" />

              {/* Central Button Pattern */}
              <button
                onClick={() => navigate('/protocol-edit')}
                className="relative -top-6 flex flex-col items-center justify-center p-0 bg-transparent hover:scale-110 active:scale-95 transition-all outline-none"
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-cobalt/20 blur-xl rounded-full group-hover:bg-cobalt/30 transition-all"></div>
                  <Icons.LogoSymbol className="w-[77px] h-[77px] object-contain relative z-10 drop-shadow-[0_0_20px_rgba(0,182,253,0.8)]" />
                </div>
              </button>

              <NavItem path="/timeline" icon={Icons.Chart} label="Dados" />
              <NavItem path="/admin" icon={Icons.FileText} label="Gestão" />
            </>
          ) : (
            <>
              <NavItem path="/home" icon={Icons.Home} label="Início" />
              <NavItem path="/messages" icon={Icons.Message} label="Mensagens" />

              {/* Botão Central de Treino (Destaque Premium) */}
              <button
                onClick={() => navigate('/session')}
                className="relative -top-6 flex flex-col items-center justify-center p-0 bg-transparent hover:scale-110 active:scale-95 transition-all outline-none"
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-cobalt/20 blur-xl rounded-full group-hover:bg-cobalt/30 transition-all"></div>
                  <Icons.LogoSymbol className="w-[77px] h-[77px] object-contain relative z-10 drop-shadow-[0_0_20px_rgba(0,182,253,0.8)]" />
                </div>
              </button>

              <NavItem path="/agenda" icon={Icons.Calendar} label="Agenda" />
              <NavItem path="/timeline" icon={Icons.Chart} label="Histórico" />
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
