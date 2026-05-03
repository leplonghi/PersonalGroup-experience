import React from 'react';
import { Heart, MessageCircle, MoreVertical, Layout, Bell, MessageSquare, Send, X, Camera, Zap, AlertTriangle, AlertCircle, Circle, FileSpreadsheet, CheckCircle, Copy, Info, Sparkles, Gift } from 'lucide-react';

export const COLORS = {
  primary: '#002B54',
  secondary: '#004B8D',
  flex: '#EAB308', // Yellow from FLEX shirts
  accent: '#3B82F6',
  success: '#22C55E', // Green from the consultant button
  warning: '#F59E0B',
  danger: '#EF4444'
};

export const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=1e293b",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=312e81",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Buster&backgroundColor=172554",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi&backgroundColor=0f172a",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Snuggles&backgroundColor=312e81",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow&backgroundColor=1e293b",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar&backgroundColor=172554",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Coco&backgroundColor=0f172a",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Max&backgroundColor=1e293b",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy&backgroundColor=172554",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie&backgroundColor=312e81",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&backgroundColor=0f172a",
];

export const BRAND = {
  name: 'Personal Group',
  tagline: 'Mais que uma academia, uma experiência a cada treino',
  founded: 2010,
  location: {
    address: 'Av. Jackson Képler Lago s/n',
    neighborhood: "Península - Ponta D'areia",
    city: 'São Luís',
    state: 'Maranhão'
  },
  contact: {
    whatsapp: '98991332316',
    email: 'recepcao@personalgroup.com.br'
  },
  hours: {
    weekdays: '6h às 22h',
    saturday: '7h às 13h',
    sunday: '8h às 13h'
  },
  area: '900m²',
  methodology: 'Sistema Flex'
};

export const WELLNESS_SERVICES_DATA = [
  {
    id: 'massagem',
    name: 'Massagem Relaxante',
    description: 'Relaxamento muscular pós-treino',
    duration: '50min',
    icon: 'Leaf',
    type: 'WELLNESS'
  },
  {
    id: 'fisioterapia',
    name: 'Fisioterapia',
    description: 'Recuperação e prevenção de lesões',
    duration: '45min',
    icon: 'Shield',
    type: 'WELLNESS'
  },
  {
    id: 'nutricao',
    name: 'Consultoria Nutricional',
    description: 'Planejamento alimentar personalizado',
    duration: '60min',
    icon: 'Droplet',
    type: 'WELLNESS'
  },
  {
    id: 'avaliacao',
    name: 'Avaliação Física',
    description: 'Análise corporal completa',
    duration: '45min',
    icon: 'ClipboardCheck',
    type: 'WELLNESS'
  }
];

export const CLASS_SERVICES_DATA = [
  {
    id: 'yoga',
    name: 'Yoga Sunrise',
    description: 'Mobilidade e consciência corporal',
    duration: '60min',
    icon: 'Yoga',
    type: 'CLASS',
    instructor: 'Sofia M.',
    capacity: 12
  },
  {
    id: 'cross',
    name: 'PG Cross',
    description: 'Treino funcional de alta intensidade',
    duration: '50min',
    icon: 'Dumbbell',
    type: 'CLASS',
    instructor: 'Carlos R.',
    capacity: 15
  },
  {
    id: 'cycle',
    name: 'Cycle Indoor',
    description: 'Cardio intenso em bike',
    duration: '45min',
    icon: 'Activity',
    type: 'CLASS',
    instructor: 'João P.',
    capacity: 20
  }
];

export const TRAINING_SESSIONS_DATA = [
  {
    id: 'session-1',
    title: 'Treino de Força A',
    date: '16 Mai',
    time: '07:00',
    instructor: 'Renato S.'
  },
  {
    id: 'session-2',
    title: 'PG Cross High Performance',
    date: '16 Mai',
    time: '18:30',
    instructor: 'Carlos R.'
  },
  {
    id: 'session-3',
    title: 'Avaliação Biométrica',
    date: '17 Mai',
    time: '09:00',
    instructor: 'Dra. Marina'
  }
];

export const Icons = {
  Logo: ({ className }: { className?: string }) => (
    <img src="/logo-wellness.png" alt="PersonalGroup Wellness Logo" className={className} />
  ),
  LogoSymbol: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
      <path d="M50 15L85 35V65L50 85L15 65V35L50 15Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M50 15L85 35V65L50 85L15 65V35L50 15Z" fill="currentColor" opacity="0.1" />
      <path d="M35 45H65M35 55H55M45 35V65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  Google: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  ),
  Home: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M3 10.182V20a1 1 0 001 1h5v-6h6v6h5a1 1 0 001-1v-9.818a1 1 0 00-.316-.725L12.447 3.345a1 1 0 00-1.341.137L3.316 9.457a1 1 0 00-.316.725z" fill="currentColor" opacity="0.1" />
      <path d="M3 10.182V20a1 1 0 001 1h5v-6h6v6h5a1 1 0 001-1v-9.818a1 1 0 00-.316-.725L12.447 3.345a1 1 0 00-1.341.137L3.316 9.457a1 1 0 00-.316.725z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    </svg>
  ),
  Calendar: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="3" y="4" width="18" height="17" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 13h2m3 0h2m3 0h2m-10 4h2m3 0h2m3 0h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <rect x="3" y="4" width="18" height="5" fill="currentColor" opacity="0.1" />
    </svg>
  ),
  User: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 20c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.1" />
    </svg>
  ),
  Message: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" fill="currentColor" opacity="0.1" />
    </svg>
  ),
  Chart: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M3 20h18M3 20V4M7 20v-6m4 6v-9m4 9v-5m4 5v-11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 14.5l4-2.5 4-4 4 1.5 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <rect x="7" y="14" width="2" height="6" fill="currentColor" opacity="0.1" />
      <rect x="11" y="11" width="2" height="9" fill="currentColor" opacity="0.1" />
      <rect x="15" y="15" width="2" height="5" fill="currentColor" opacity="0.1" />
      <rect x="19" y="9" width="2" height="11" fill="currentColor" opacity="0.1" />
    </svg>
  ),
  ChevronRight: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ChevronLeft: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ChevronUp: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ChevronDown: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Settings: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.1" />
    </svg>
  ),
  Shield: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 2L4 5v6c0 5.5 3.5 10.1 8 11 4.5-.9 8-5.5 8-11V5l-8-3z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7l1.5 3h3.5l-2.5 2.5 1 3.5-3.5-2L8.5 16l1-3.5-2.5-2.5h3.5L12 7z" stroke="currentColor" strokeWidth="1" fill="currentColor" opacity="0.4" />
      <path d="M12 2L4 5v6c0 5.5 3.5 10.1 8 11 4.5-.9 8-5.5 8-11V5l-8-3z" fill="currentColor" opacity="0.1" />
    </svg>
  ),
  Plus: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  Clock: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.1" />
    </svg>
  ),
  TrendingUp: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M23 6l-9.5 9.5-5-5L1 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 6h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23 6l-9.5 9.5-5-5L1 18" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.1" />
    </svg>
  ),
  Edit: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 10l5-5 2 2-5 5-2-2z" fill="currentColor" opacity="0.1" />
    </svg>
  ),
  Sun: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.1" />
    </svg>
  ),
  Moon: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" opacity="0.1" />
    </svg>
  ),
  Save: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M17 21v-8H7v8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 3v5h8" stroke="currentColor" strokeWidth="1.5" />
      <rect x="7" y="13" width="10" height="8" fill="currentColor" opacity="0.1" />
    </svg>
  ),
  Trash: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2m-6 5v6m4-6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 6h14v2H5V6z" fill="currentColor" opacity="0.1" />
    </svg>
  ),
  Bell: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9z" fill="currentColor" opacity="0.1" />
    </svg>
  ),
  Users: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="7" r="4" fill="currentColor" opacity="0.1" />
    </svg>
  ),
  ClipboardCheck: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 2a2 2 0 012 2v2a2 2 0 01-2 2 2 2 0 01-2-2V4a2 2 0 012-2zM9 14.1l2.2 2.2 4.4-4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="4" width="16" height="18" rx="2" fill="currentColor" opacity="0.1" />
    </svg>
  ),
  Leaf: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M2 22s4-1 6-5M22 2c0 0-10 0-15 5s-5 15-5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 7c0 0 8 0 11 3s3 11 3 11M7 7c0 0 0 8 3 11s11 3 11 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M22 2c0 0-10 0-15 5s-5 15-5 15c0 0 8 0 15-5s5-15 5-15z" fill="currentColor" opacity="0.1" />
    </svg>
  ),
  Swimming: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M2 14s3-2 6 0 6 2 9 0 6-2 6-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2 18s3-2 6 0 6 2 9 0 6-2 6-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M15 8l-2-2-3 1M8 10l-2-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Yoga: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 6c-2 0-4 1-5 3L3 16h18l-4-7c-1-2-3-3-5-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 16v5m8-5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 6c-2 0-4 1-5 3L3 16h18l-4-7c-1-2-3-3-5-3z" fill="currentColor" opacity="0.1" />
    </svg>
  ),
  Dumbbell: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M6.5 6.5h11M18 2v20M6 2v20M2 10v4m20-4v4m-2-6v12M4 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="6" y="2" width="12" height="20" rx="1" fill="currentColor" opacity="0.05" />
      <path d="M6 12h12" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    </svg>
  ),
  QRCode: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M3 3h6v6H3V3zm12 0h6v6h-6V3zm0 12h6v6h-6v-6zM3 15h6v6H3v-6z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 3h6v6H3V3zm12 0h6v6h-6V3zm0 12h6v6h-6v-6zM3 15h6v6H3v-6z" fill="currentColor" opacity="0.1" />
      <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    </svg>
  ),
  MapPin: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" fill="currentColor" opacity="0.1" />
    </svg>
  ),
  X: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  FileText: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9l-7-7z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13 2v7h7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 13h8m-8 4h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9l-7-7z" fill="currentColor" opacity="0.1" />
    </svg>
  ),
  Activity: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Coffee: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 1v3M10 1v3M14 1v3" />
    </svg>
  ),
  Car: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /> {/* Placeholder, let's use a real car icon path or generic transport */}
      <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  ),
  Droplet: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  Star: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  Play: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Check: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Upload: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  Search: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Fingerprint: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.288 0 2.512.24 3.642.678m8 8.44l-.053.09A10.003 10.003 0 0012 21a9.97 9.97 0 01-5.186-1.447m15.186-15.186l-.053.09A10.003 10.003 0 0012 3a9.97 9.97 0 015.186 1.447m-15.186 15.186l.053-.09A10.003 10.003 0 0012 3" />
    </svg>
  ),
  Smartphone: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  Refresh: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  Download: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  Target: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" />
    </svg>
  ),
  Map: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6V20M16 4V18M4 8L8 6L16 10L20 8V22L16 20L8 16L4 18V8Z" />
    </svg>
  ),
  Zap: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
    </svg>
  ),
  ArrowUp: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  ),
  ArrowDown: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  ),
  ArrowRight: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  ArrowLeft: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  AlertTriangle: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  ExclamationCircle: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Eye: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  Heart: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  Wifi: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.212 0" />
    </svg>
  ),
  ClipboardList: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  AlertOctagon: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 2L16 2L22 8V16L16 22H8L2 16V8L8 2Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8V12" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16H12.01" />
    </svg>
  ),
  Apple: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 2c1 .5 2 2 2 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ShieldCheck: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Repeat: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="m17 2 4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 11v-1a4 4 0 0 1 4-4h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m7 22-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 13v1a4 4 0 0 1-4 4H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Camera: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  MessageCircle: ({ className }: { className?: string }) => (
    <MessageCircle className={className} />
  ),
  MoreVertical: ({ className }: { className?: string }) => (
    <MoreVertical className={className} />
  ),
  Layout: ({ className }: { className?: string }) => (
    <Layout className={className} />
  ),
  MessageSquare: ({ className }: { className?: string }) => (
    <MessageSquare className={className} />
  ),
  Send: ({ className }: { className?: string }) => (
    <Send className={className} />
  ),
  AlertCircle: ({ className }: { className?: string }) => (
    <AlertCircle className={className} />
  ),
  Circle: ({ className }: { className?: string }) => (
    <Circle className={className} />
  ),
  FileSpreadsheet: ({ className }: { className?: string }) => (
    <FileSpreadsheet className={className} />
  ),
  CheckCircle: ({ className }: { className?: string }) => (
    <CheckCircle className={className} />
  ),
  Copy: ({ className }: { className?: string }) => (
    <Copy className={className} />
  ),
  Info: ({ className }: { className?: string }) => (
    <Info className={className} />
  ),
  Sparkles: ({ className }: { className?: string }) => (
    <Sparkles className={className} />
  ),
  Gift: ({ className }: { className?: string }) => (
    <Gift className={className} />
  )
};

