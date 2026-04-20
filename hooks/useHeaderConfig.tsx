import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icons } from '../constants'; // Note: adjust path if necessary, but App.tsx says import { Icons } from './constants.tsx'

export const useHeaderConfig = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return useMemo(() => {
        const backBtn = (path: string | number) => (
            <button
                onClick={() => navigate(path as any)}
                className="w-12 h-12 border border-app bg-surface text-app flex items-center justify-center active:scale-95 transition-all outline-none rounded-xl"
            >
                <Icons.ChevronRight className="w-5 h-5 rotate-180" />
            </button>
        );

        const bellBtn = (
            <button className="w-12 h-12 border border-app bg-surface text-app flex items-center justify-center relative active:scale-95 transition-all outline-none rounded-xl">
                <Icons.Bell className="w-5 h-5" />
                {/* Replaced hardcoded red shadow with tailwind shadow token and ring/border utilities if needed, or matched colors from COLOR_SYSTEM */}
                <div className="absolute top-3.5 right-3.5 w-1.5 h-1.5 bg-red-500 rounded-full shadow-sm shadow-red-500/50"></div>
            </button>
        );

        const path = location.pathname;

        if (path === '/home') return {};
        if (path === '/agenda') return { title: 'Abril 2026', subtitle: 'Agenda de Treinos' };
        if (path === '/messages') return { title: 'Mensagens', subtitle: 'Central de Avisos', rightAction: bellBtn };
        if (path === '/timeline') return { title: 'Minha Jornada', subtitle: 'Histórico de Performance', leftAction: backBtn('/home') };
        if (path === '/wellness') return { title: 'Wellness Centre', subtitle: 'Recuperação Biomecânica', leftAction: backBtn('/home') };
        if (path === '/club') return { title: 'Ecossistema', subtitle: 'Exclusividade', leftAction: backBtn('/home') };
        if (path === '/profile') return { title: 'Meu Perfil', subtitle: 'Minha Conta', leftAction: backBtn('/home') };
        if (path === '/session') return {
            title: 'Sessão Ativa',
            subtitle: 'Em Execução',
            // Replaced arbitrarily hardcoded hex #3B82F6 with Tailwind tokens matching the app's `cobalt` scheme
            leftAction: <div className="w-2 h-2 bg-cobalt rounded-full shadow-sm shadow-cobalt/50 animate-pulse ml-4"></div>
        };
        if (path === '/management') return { title: <>Gestão de <span className="text-cobalt">Pista</span></>, subtitle: 'Painel do Professor', rightAction: bellBtn };
        if (path === '/protocol-edit') return { title: 'Editar Treino', subtitle: 'Detalhes Técnicos', leftAction: backBtn('/management') };
        if (path === '/assessment') return { title: 'Avaliação', subtitle: 'Intervenção Técnica', leftAction: backBtn('/management'), rightAction: <div className="w-12 h-12 border border-app bg-surface flex items-center justify-center font-black text-[10px] text-cobalt italic rounded-xl">GOV</div> };
        if (path === '/cycle-builder') return { title: 'Novo Ciclo', subtitle: 'Planejamento', leftAction: backBtn('/management'), rightAction: <div className="w-12 h-12 border border-app bg-surface flex items-center justify-center font-black text-[10px] text-cobalt italic rounded-xl">v1.2</div> };
        if (path === '/checkin') return { title: 'Validação de Acesso', subtitle: 'Check-in Ativo', leftAction: backBtn('/home') };
        if (path === '/floor-view') return { title: 'Pista', subtitle: 'Visão Geral', leftAction: backBtn('/management') };
        if (path.startsWith('/student-briefing')) return { title: 'Prontuário', subtitle: 'Aluno', leftAction: backBtn('/floor-view') };
        if (path.startsWith('/evolution')) return { title: 'Evolução', subtitle: 'Acompanhamento', leftAction: backBtn(-1) };

        return {};
    }, [location.pathname, navigate]);
};
