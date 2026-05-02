
export interface ClassSession {
  id: string;
  title: string;
  instructor: string;
  time: string;
  duration: string;
  date: string;
  capacity: number;
  enrolled: number;
  category: 'STRENGTH' | 'CARDIO' | 'YOGA' | 'RECOVERY';
  type: 'strength' | 'cardio' | 'flexibility' | 'hiit';
  level: 'ALL' | 'BEGINNER' | 'ADVANCED';
}

export interface TrainerSlot {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  status: 'available' | 'busy';
  availableTimes: string[];
}

export const gymSchedule: ClassSession[] = [
  {
    id: '1',
    title: 'Precision Cardio',
    instructor: 'Renato Silva',
    time: '08:00',
    duration: '45min',
    date: 'Hoje',
    capacity: 12,
    enrolled: 8,
    category: 'CARDIO',
    type: 'cardio',
    level: 'ALL',
  },
  {
    id: '2',
    title: 'Elite Strength',
    instructor: 'Mariana Costa',
    time: '10:00',
    duration: '60min',
    date: 'Hoje',
    capacity: 10,
    enrolled: 10,
    category: 'STRENGTH',
    type: 'strength',
    level: 'ADVANCED',
  },
  {
    id: '3',
    title: 'Deep Recovery',
    instructor: 'Felipe Neves',
    time: '14:00',
    duration: '50min',
    date: 'Hoje',
    capacity: 8,
    enrolled: 3,
    category: 'RECOVERY',
    type: 'flexibility',
    level: 'ALL',
  },
  {
    id: '4',
    title: 'Yoga Flow',
    instructor: 'Bia Araujo',
    time: '18:00',
    duration: '60min',
    date: 'Hoje',
    capacity: 15,
    enrolled: 12,
    category: 'YOGA',
    type: 'flexibility',
    level: 'ALL',
  },
  {
    id: '5',
    title: 'HIIT Protocol',
    instructor: 'Renato Silva',
    time: '07:00',
    duration: '40min',
    date: 'Amanhã',
    capacity: 10,
    enrolled: 4,
    category: 'CARDIO',
    type: 'hiit',
    level: 'ADVANCED',
  },
  {
    id: '6',
    title: 'Power Lifting',
    instructor: 'Mariana Costa',
    time: '09:00',
    duration: '75min',
    date: 'Amanhã',
    capacity: 8,
    enrolled: 7,
    category: 'STRENGTH',
    type: 'strength',
    level: 'ADVANCED',
  },
];

export const trainerAvailability: TrainerSlot[] = [
  {
    id: 't1',
    name: 'Dr. Ricardo',
    specialty: 'Fisiologista',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=250&auto=format&fit=crop',
    status: 'available',
    availableTimes: ['09:00', '11:00', '15:00'],
  },
  {
    id: 't2',
    name: 'Coach Amanda',
    specialty: 'Performance',
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=250&auto=format&fit=crop',
    status: 'busy',
    availableTimes: ['16:30', '18:00'],
  },
  {
    id: 't3',
    name: 'Prof. Lucas',
    specialty: 'Biomecânica',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=250&auto=format&fit=crop',
    status: 'available',
    availableTimes: ['10:00', '13:00'],
  },
];
