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
        className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative ${isActive ? 'text-white' : 'text-pg-text-muted hover:text-pg-text-main/80'}`}
      >
        <div className={`transition-all duration-500 transform ${isActive ? 'scale-110 translate-y-[-4px]' : 'opacity-70'}`}>
          <Icon className={`w-6 h-6 object-contain ${isActive ? 'text-pg-cobalt drop-shadow-[0_0_12px_rgba(37,99,235,0.4)]' : 'text-current'}`} />
        </div>
        <span className={`text-[9px] font-bold uppercase tracking-wider mt-1.5 transition-all duration-300 font-display ${isActive ? 'opacity-100 text-pg-cobalt' : 'opacity-60'}`}>
          {label}
        </span>
        {isActive && (
          <div className="absolute top-0 inset-x-4 h-[2px] bg-pg-cobalt shadow-[0_0_20px_rgba(37,99,235,0.6)] rounded-full"></div>
        )}
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[150] transition-all duration-500 glass-surface pb-safe border-t border-pg-border-main/20">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-pg-cobalt/20 to-transparent"></div>
      <div className="h-20 max-w-[480px] md:max-w-2xl lg:max-w-4xl mx-auto px-4">
        <nav className="h-full flex items-center justify-around relative z-10">
          {isManagementRole ? (
            <>
              <NavItem path="/management" icon={Icons.Home} label="Painel" />
              <NavItem path="/messages" icon={Icons.Users} label="Equipe" />

              {/* Central Button Pattern */}
              <button
                onClick={() => navigate('/protocol-edit')}
                className="relative -top-7 flex flex-col items-center justify-center p-0 bg-transparent hover:scale-110 active:scale-95 transition-all outline-none"
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-pg-cobalt/30 blur-2xl rounded-full group-hover:bg-pg-cobalt/40 transition-all scale-125"></div>
                  <div className="relative z-10 w-[80px] h-[80px] rounded-full p-0.5 bg-gradient-to-b from-pg-cobalt to-sky-500 shadow-[0_10px_30px_rgba(37,99,235,0.4)]">
                    <div className="w-full h-full rounded-full bg-pg-midnight flex items-center justify-center overflow-hidden">
                       <Icons.LogoSymbol className="w-[85px] h-[85px] object-contain scale-[1.3] filter brightness-110" />
                    </div>
                  </div>
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
                className="relative -top-7 flex flex-col items-center justify-center p-0 bg-transparent hover:scale-110 active:scale-90 transition-all outline-none"
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-pg-cobalt/30 blur-2xl rounded-full group-hover:bg-pg-cobalt/40 transition-all scale-125 animate-pulse"></div>
                  <div className="relative z-10 w-[80px] h-[80px] rounded-full p-0.5 bg-gradient-to-b from-pg-cobalt to-sky-500 shadow-[0_10px_30px_rgba(37,99,235,0.4)]">
                    <div className="w-full h-full rounded-full bg-pg-midnight flex items-center justify-center overflow-hidden">
                       <Icons.LogoSymbol className="w-[85px] h-[85px] object-contain scale-[1.3] filter brightness-110" />
                    </div>
                  </div>
                </div>
              </button>

              <NavItem path="/evolution" icon={Icons.Activity} label="Saúde" />
              <NavItem path="/wellness" icon={Icons.Star} label="Wellness" />
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
