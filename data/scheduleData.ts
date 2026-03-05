
export interface ClassSession {
    id: string;
    title: string;
    instructor: string;
    time: string;
    duration: string;
    type: 'cardio' | 'strength' | 'flexibility' | 'hiit';
    capacity: number;
    enrolled: number;
    location: string;
}

export interface TrainerSlot {
    id: string;
    name: string;
    specialty: string;
    avatar: string;
    availableTimes: string[];
    status: 'available' | 'busy' | 'off-duty';
}

export const gymSchedule: ClassSession[] = [
    {
        id: 'c1',
        title: 'Morning Power Cycle',
        instructor: 'Carla Dias',
        time: '07:00',
        duration: '45min',
        type: 'cardio',
        capacity: 20,
        enrolled: 18,
        location: 'Studio A'
    },
    {
        id: 'c2',
        title: 'Functional Strength',
        instructor: 'Roberto Silva',
        time: '09:00',
        duration: '60min',
        type: 'strength',
        capacity: 15,
        enrolled: 12,
        location: 'Functional Zone'
    },
    {
        id: 'c3',
        title: 'HIIT Blast',
        instructor: 'Carla Dias',
        time: '18:00',
        duration: '30min',
        type: 'hiit',
        capacity: 20,
        enrolled: 20,
        location: 'Studio B'
    },
    {
        id: 'c4',
        title: 'Yoga Flow',
        instructor: 'Ana Costa',
        time: '19:00',
        duration: '60min',
        type: 'flexibility',
        capacity: 12,
        enrolled: 5,
        location: 'Zen Room'
    }
];

export const availableTrainers: TrainerSlot[] = [
    {
        id: 't1',
        name: 'Marcos Vinicius',
        specialty: 'Hipertrofia',
        avatar: 'https://cdn.usegalileo.ai/sdxl10/24328575-52d3-4611-a889-1834220b30bb.png',
        availableTimes: ['08:00', '10:00', '14:00', '16:00'],
        status: 'available'
    },
    {
        id: 't2',
        name: 'Julia Santos',
        specialty: 'Reabilitação',
        avatar: 'https://cdn.usegalileo.ai/sdxl10/68297750-6817-4866-b258-05206254199c.png',
        availableTimes: ['09:00', '11:00', '15:00'],
        status: 'busy'
    },
    {
        id: 't3',
        name: 'Pedro Alcantara',
        specialty: 'Performance',
        avatar: 'https://cdn.usegalileo.ai/sdxl10/c0953495-94e8-4228-a46c-c60bf8032ba8.png',
        availableTimes: ['07:00'],
        status: 'available'
    }
];

export const assessmentHistory = [
    { id: 'a1', date: '2025-12-10', weight: 82.0, bodyFat: 18.0, result: 'Normal' },
    { id: 'a2', date: '2026-01-15', weight: 80.5, bodyFat: 16.5, result: 'Bom' },
];
