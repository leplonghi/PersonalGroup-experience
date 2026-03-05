import { Exercise } from '../types';

export const INITIAL_EXERCISES: Exercise[] = [
    {
        id: 'e1',
        name: 'Agachamento Smith (FLEX)',
        sets: 4,
        reps: '10-12',
        weight: 60,
        image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=600',
        videoUrl: 'https://www.youtube.com/embed/O15fuy8mZ3o?rel=0&autoplay=0',
        observations: 'Mantenha a postura ereta e desça até 90 graus.'
    },
    {
        id: 'e2',
        name: 'Leg Press 45º Pro',
        sets: 3,
        reps: '15',
        weight: 160,
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
        videoUrl: 'https://www.youtube.com/embed/IZxyjW7MPJQ?rel=0&autoplay=0',
        observations: 'Pés na largura dos ombros. Não tranque os joelhos.'
    }
];
